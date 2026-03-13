"""
NEUX REAL-TIME CHAT MODELS v1.0
-------------------------------
Description: Data schema for Private Messaging & Group Threads.
Features: 
- Message Status Tracking (Sent, Delivered, Read).
- Support for complex message types (Offers, Media).
- Optimized for high-frequency writes.
"""

import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Conversation(models.Model):
    """
    غرفة المحادثة: تربط بين طرفين (مثلاً العميل والعامل).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='conversations'
    )
    
    # يربط المحادثة بوظيفة معينة (اختياري)
    related_job = models.ForeignKey(
        'jobs.Job', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='chats'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_message_at']

    def __str__(self):
        return f"Chat {self.id}"

class Message(models.Model):
    """
    الرسالة الواحدة داخل المحادثة.
    """
    MSG_TYPES = (
        ('text', 'Text Message'),
        ('image', 'Image/Media'),
        ('offer', 'Price Offer'),
        ('system', 'System Notification'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, 
        on_delete=models.CASCADE, 
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    
    content = models.TextField()
    message_type = models.CharField(max_length=10, choices=MSG_TYPES, default='text')
    
    # تتبع حالة الرسالة (Instagram Style)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
        ]

    def __str__(self):
        return f"From {self.sender.username} at {self.created_at}"