import uuid
from django.db import models
from django.conf import settings
from decimal import Decimal

class Wallet(models.Model):
    """المحفظة الرقمية - قلب النظام المالي"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    available_balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    frozen_balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=3, default='USD')
    
    def __str__(self):
        return f"{self.user.username}'s Wallet"

class Transaction(models.Model):
    METHOD_CHOICES = (('stripe', 'Stripe'), ('paypal', 'PayPal'), ('wallet', 'Internal Wallet'))
    STATUS_CHOICES = (('pending', 'Pending'), ('success', 'Success'), ('failed', 'Failed'))

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='debits')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='credits')
    
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # مرجع للعملية في Stripe/PayPal (مهم جداً للتدقيق)
    reference_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)