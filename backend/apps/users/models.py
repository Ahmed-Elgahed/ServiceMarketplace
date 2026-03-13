from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):

    # =====================================
    # ✅ Roles
    # =====================================

    ROLE_USER = "user"
    ROLE_ADMIN = "admin"
    ROLE_SUPERADMIN = "superadmin"

    ROLE_CHOICES = [
        (ROLE_USER, "User"),
        (ROLE_ADMIN, "Admin"),
        (ROLE_SUPERADMIN, "Super Admin"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_USER,
        db_index=True
    )

    # =====================================
    # ✅ Account Status
    # =====================================

    is_banned = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    # ✅ Temporary lock after brute force
    locked_until = models.DateTimeField(blank=True, null=True)

    # =====================================
    # ✅ Password Reset
    # =====================================

    reset_code = models.CharField(max_length=6, blank=True, null=True)
    reset_code_created_at = models.DateTimeField(blank=True, null=True)

    # =====================================
    # ✅ Email Verification
    # =====================================

    is_email_verified = models.BooleanField(default=False)

    email_verification_code = models.CharField(max_length=6, blank=True, null=True)
    email_verification_created_at = models.DateTimeField(blank=True, null=True)

    # =====================================
    # ✅ Two Factor Authentication (2FA)
    # =====================================

    two_factor_enabled = models.BooleanField(default=False)
    two_factor_code = models.CharField(max_length=6, blank=True, null=True)
    two_factor_created_at = models.DateTimeField(blank=True, null=True)

    # =====================================
    # ✅ Security Tracking
    # =====================================

    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    last_device = models.TextField(blank=True, null=True)

    failed_login_attempts = models.IntegerField(default=0)
    suspicious_login_count = models.IntegerField(default=0)

    # =====================================
    # ✅ Timestamps
    # =====================================

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # =====================================
    # ✅ Helper Methods
    # =====================================

    def is_locked(self):
        if self.locked_until and timezone.now() < self.locked_until:
            return True
        return False

    def lock_account(self, minutes=15):
        self.locked_until = timezone.now() + timedelta(minutes=minutes)
        self.save(update_fields=["locked_until"])

    def is_reset_code_valid(self):
        if not self.reset_code or not self.reset_code_created_at:
            return False
        return timezone.now() - self.reset_code_created_at < timedelta(minutes=10)

    def is_email_verification_valid(self):
        if not self.email_verification_code or not self.email_verification_created_at:
            return False
        return timezone.now() - self.email_verification_created_at < timedelta(minutes=10)

    def is_2fa_code_valid(self):
        if not self.two_factor_code or not self.two_factor_created_at:
            return False
        return timezone.now() - self.two_factor_created_at < timedelta(minutes=5)

    def increment_failed_attempts(self):
        self.failed_login_attempts += 1

        # Lock after 5 attempts
        if self.failed_login_attempts >= 5:
            self.lock_account()

        self.save(update_fields=["failed_login_attempts", "locked_until"])

    def reset_failed_attempts(self):
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save(update_fields=["failed_login_attempts", "locked_until"])

    def __str__(self):
        return f"{self.username} ({self.role})"


# =====================================
# ✅ Login Audit Log Model
# =====================================

class LoginLog(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="login_logs"
    )

    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()

    device_fingerprint = models.TextField(blank=True, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    success = models.BooleanField(default=False)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["ip_address"]),
            models.Index(fields=["timestamp"]),
            models.Index(fields=["success"]),
        ]

    def __str__(self):
        status = "SUCCESS" if self.success else "FAILED"
        return f"{self.user.username} - {self.ip_address} - {status}"