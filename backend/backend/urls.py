from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # محرك التوكنات (JWT Authentication)
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ربط تطبيقات الـ Apps
    # غير الأسطر التالية واحذف كلمة apps. منها
    path('api/v1/users/', include('users.urls')),
    path('api/v1/jobs/', include('jobs.urls')),
    path('api/v1/transactions/', include('transactions.urls')),
]

# دعم ملفات الميديا (الصور والفيديوهات) فى بيئة التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)