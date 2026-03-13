from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [

    # ✅ Custom Secure Login
    path('login/', views.LoginView.as_view(), name='login'),

    # ✅ Refresh Token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ Register
    path('register/', views.RegisterView.as_view(), name='register'),

    # ✅ Password Reset
    path('reset-password/', views.PasswordResetView.as_view(), name='reset_password'),

    # ✅ Verify 2FA
    path('verify-2fa/', views.Verify2FAView.as_view(), name='verify_2fa'),

    # ✅ Logout
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # ✅ Security Logs
    path('security-logs/', views.SecurityLogsView.as_view(), name='security_logs'),

    # ✅ Profile
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
]