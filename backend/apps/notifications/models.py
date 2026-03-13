import uuid
from django.db import models
from django.conf import settings

class Notification(models.Model):
    """
    نظام الإشعارات المركزي.
    """
    TYPES = (
        ('offer_received', 'New Offer Received'),
        ('offer_accepted', 'Offer Accepted'),
        ('payment_received', 'Payment Successful'),
        ('message_received', 'New Message'),
        ('system_alert', 'System Update'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    
    verb = models.CharField(max_length=255) # وصف الفعل (مثلاً: "قام أحمد بتقديم عرض")
    notification_type = models.CharField(max_length=20, choices=TYPES)
    
    # حقل بيانات مرن (JSON) لتخزين أي داتا إضافية (مثل ID الوظيفة)
    metadata = models.JSONField(default=dict, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f"To {self.recipient.username}: {self.verb}"