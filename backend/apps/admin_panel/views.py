from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from apps.jobs.models import Job  # أو Post حسب اسمك
from .permissions import IsSuperAdmin

User = get_user_model()


# ✅ Ban User
@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def ban_user(request, user_id):

    user = User.objects.get(id=user_id)
    user.is_banned = True
    user.save()

    return Response({"message": "User banned successfully"})


# ✅ Suspend User
@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def suspend_user(request, user_id):

    user = User.objects.get(id=user_id)
    user.is_suspended = True
    user.save()

    return Response({"message": "User suspended successfully"})


# ✅ Delete Post
@api_view(["DELETE"])
@permission_classes([IsSuperAdmin])
def delete_post(request, post_id):

    post = Job.objects.get(id=post_id)  # غير Job لو اسمك Post
    post.delete()

    return Response({"message": "Post deleted successfully"})