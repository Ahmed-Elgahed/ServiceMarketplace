from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from .models import LoginLog
from .tasks import send_security_alert_email
import random

User = get_user_model()


# =====================================
# ✅ Helper
# =====================================

def generate_code():
    return str(random.randint(100000, 999999))


# =====================================
# ✅ Register
# =====================================

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        full_name = request.data.get("fullName", "")

        if not username or not email or not password:
            return Response({"error": "All fields required"}, status=400)

        if len(password) < 8:
            return Response({"error": "Password too short"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username exists"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email exists"}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=full_name.split()[0] if full_name else "",
            last_name=" ".join(full_name.split()[1:]) if full_name else ""
        )

        code = generate_code()
        user.email_verification_code = code
        user.email_verification_created_at = timezone.now()
        user.save()

        return Response({"message": "Account created. Verify email."}, status=201)


# =====================================
# ✅ Login (Secure Production Version)
# =====================================

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        ip = request.META.get("REMOTE_ADDR")
        device = request.META.get("HTTP_USER_AGENT")

        # ✅ Redis Rate Limit
        cache_key = f"login_attempts_{ip}"
        attempts = cache.get(cache_key, 0)

        if attempts >= 10:
            return Response({"error": "Too many attempts"}, status=429)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            cache.set(cache_key, attempts + 1, timeout=300)
            return Response({"error": "Invalid credentials"}, status=401)

        # ✅ Check lock
        if user.is_locked():
            return Response({"error": "Account temporarily locked"}, status=403)

        auth_user = authenticate(username=username, password=password)

        if not auth_user:
            user.increment_failed_attempts()
            cache.set(cache_key, attempts + 1, timeout=300)

            LoginLog.objects.create(
                user=user,
                ip_address=ip,
                user_agent=device,
                device_fingerprint=device,
                success=False
            )

            return Response({"error": "Invalid credentials"}, status=401)

        # ✅ Account Status Checks
        if user.is_banned:
            return Response({"error": "Account banned"}, status=403)

        if user.is_suspended:
            return Response({"error": "Account suspended"}, status=403)

        if not user.is_email_verified:
            return Response({"error": "Email not verified"}, status=403)

        # ✅ Suspicious IP
        if user.last_login_ip and user.last_login_ip != ip:
            user.suspicious_login_count += 1
            user.save(update_fields=["suspicious_login_count"])

            send_security_alert_email.delay(user.email, ip)

        # ✅ Device tracking
        if user.last_device and user.last_device != device:
            print("⚠ New device detected")

        # ✅ 2FA BEFORE issuing token
        if user.two_factor_enabled:
            code = generate_code()
            user.two_factor_code = code
            user.two_factor_created_at = timezone.now()
            user.save()

            return Response({"2fa_required": True})

        # ✅ Issue JWT
        refresh = RefreshToken.for_user(user)

        user.reset_failed_attempts()
        user.last_login_ip = ip
        user.last_device = device
        user.save()

        cache.delete(cache_key)

        LoginLog.objects.create(
            user=user,
            ip_address=ip,
            user_agent=device,
            device_fingerprint=device,
            success=True
        )

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# =====================================
# ✅ Verify 2FA
# =====================================

class Verify2FAView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        code = request.data.get("code")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Invalid request"}, status=400)

        if not user.is_2fa_code_valid():
            return Response({"error": "Code expired"}, status=400)

        if user.two_factor_code != code:
            return Response({"error": "Invalid code"}, status=400)

        refresh = RefreshToken.for_user(user)

        user.two_factor_code = None
        user.save()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# =====================================
# ✅ Logout
# =====================================

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out"})


# =====================================
# ✅ Security Logs
# =====================================

class SecurityLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        logs = request.user.login_logs.all()[:20]

        data = [
            {
                "ip": log.ip_address,
                "device": log.device_fingerprint,
                "success": log.success,
                "time": log.timestamp
            }
            for log in logs
        ]

        return Response(data)


# =====================================
# ✅ User Profile
# =====================================

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_email_verified": user.is_email_verified,
        })


# =====================================
# ✅ Password Reset
# =====================================

class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If exists, code sent"}, status=200)

        code = generate_code()
        user.reset_code = code
        user.reset_code_created_at = timezone.now()
        user.save()

        return Response({"message": "If exists, code sent"}, status=200)