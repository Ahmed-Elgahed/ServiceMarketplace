from django.urls import path, include

urlpatterns = [
    path("users/", include("apps.users.urls")),
    path("posts/", include("apps.posts.urls")),
    path("admin/", include("apps.admin_panel.urls"))
]