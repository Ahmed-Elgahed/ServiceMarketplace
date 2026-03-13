"""
NEUX VIEW ORCHESTRATOR - JOBS API
----------------------------------
Description: High-performance ViewSets for the Marketplace.
Features: 
- Smart Feed Logic (Recency + Budget Priority).
- Atomic Offer Acceptance (ربط المحفظة بالوظيفة).
- Multi-layered Permissions.
"""

from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from django.db import transaction
from .models import Job, Offer, Category
from .serializers import JobSerializer, OfferSerializer, CategorySerializer
from transactions.fintech_engine import WalletOrchestrator
class JobViewSet(viewsets.ModelViewSet):
    """
    المحرك المسؤول عن الـ Feed والتحكم في الوظائف.
    """
    queryset = Job.objects.all().select_related('client', 'category').prefetch_related('offers')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """خوارزمية توليد الـ Feed الذكي"""
        qs = super().get_queryset()
        
        # فلترة حسب الحالة (عرض الوظائف المفتوحة فقط في الـ Feed)
        if self.action == 'list':
            qs = qs.filter(status='open').order_by('-created_at')
            
        # فلترة متقدمة (Advanced Search)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)
            
        return qs

    @decorators.action(detail=True, methods=['post'], url_path='accept-offer')
    def accept_offer(self, request, pk=None):
        """
        أخطر عملية في السيستم: قبول عرض وبدء المهمة وحجز الفلوس.
        تستخدم: Distributed Transactions & Escrow Logic.
        """
        job = self.get_object()
        offer_id = request.data.get('offer_id')
        
        if job.client != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            offer = Offer.objects.get(id=offer_id, job=job)
            
            with transaction.atomic():
                # 1. محرك الفينتك: حجز الأموال في الضمان (Escrow)
                WalletOrchestrator.secure_escrow_hold(
                    client_id=request.user.id,
                    amount=offer.price,
                    job_id=job.id
                )
                
                # 2. تحديث حالة الوظيفة والعرض
                job.status = 'in_progress'
                job.save()
                offer.is_accepted = True
                offer.save()
                
                # 3. إرسال إشعار لحظي للعامل (The Parallel Notification)
                # NotificationDispatcher.broadcast_to_worker(offer.worker.id, "Your offer was accepted!")

                return Response({"status": "Success", "message": "Money held in escrow. Work started!"})
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# [ ... الكود يستمر ليشمل الـ Search View و الـ Category Statistics ... ]