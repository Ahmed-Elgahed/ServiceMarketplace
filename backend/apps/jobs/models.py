import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    icon_name = models.CharField(max_length=50, blank=True) # لربطه بـ FontAwesome أو React Icons

    def __str__(self):
        return self.name

class Job(models.Model):
    STATUS_CHOICES = (
        ('open', _('Open For Bids')),
        ('in_progress', _('Work In Progress')),
        ('completed', _('Job Completed')),
        ('canceled', _('Terminated')),
        ('disputed', _('In Dispute')),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='posted_jobs'
    )
    
    # تفاصيل الوظيفة
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jobs')
    
    # الميزانية (استخدام Decimal للفلوس)
    budget = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(5.00)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', db_index=True)
    
    # الوسائط (Media Orchestration)
    # ملاحظة: في المشاريع الضخمة بنستخدم Generic Relation لرفع كذا ملف، بس هنا هنخليها بسيطة دلوقتي
    media = models.FileField(upload_to='jobs/attachments/%Y/%m/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=['status', 'created_at'])]

    def __str__(self):
        return self.title

class Offer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='offers')
    worker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submitted_bids')
    
    price = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.PositiveIntegerField()
    message = models.TextField()
    
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'worker') # العامل ميقدرش يقدم عرضين لنفس الشغلانة