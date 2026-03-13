"""
NEUX GLOBAL SEARCH ENGINE v1.0
------------------------------
Description: High-performance search and filtering logic for jobs and workers.
Capabilities: 
- Full-text search across titles and descriptions.
- Multi-parameter filtering (Category, Budget, Rating).
- Parallel Indexing & Caching strategy.
"""

import logging
from django.db.models import Q, Avg, Count
from django.core.cache import cache
from .models import Job, Category
from apps.users.models import User

logger = logging.getLogger("neux.search")

class MarketplaceSearchEngine:
    """
    المحرك المسؤول عن تحليل طلبات البحث وإرجاع أدق النتائج.
    """

    @staticmethod
    def search_jobs(query_params):
        """
        البحث في الوظائف المفتوحة.
        المبدأ: Advanced Filtering Data Structure.
        """
        keyword = query_params.get('q', '').strip()
        category_slug = query_params.get('category')
        min_budget = query_params.get('min_budget')
        max_budget = query_params.get('max_budget')
        sort_by = query_params.get('sort', '-created_at')

        # إنشاء مفتاح كاش فريد للبحث (Distributed Caching)
        cache_key = f"search_results_{keyword}_{category_slug}_{min_budget}_{max_budget}_{sort_by}"
        cached_results = cache.get(cache_key)
        
        if cached_results:
            return cached_results

        # بناء الاستعلام بشكل ديناميكي (Dynamic Query Building)
        query = Q(status='open')

        if keyword:
            # البحث في العنوان والوصف (Case-insensitive)
            query &= (Q(title__icontains=keyword) | Q(description__icontains=keyword))
        
        if category_slug:
            query &= Q(category__slug=category_slug)
            
        if min_budget:
            query &= Q(budget__gte=min_budget)
            
        if max_budget:
            query &= Q(budget__lte=max_budget)

        # تنفيذ البحث في قاعدة البيانات مع تحسين الأداء (Optimization)
        results = Job.objects.filter(query).select_related('client', 'category').order_by(sort_by)

        # حفظ النتائج في الكاش لمدة 10 دقائق لتسريع البحث المتكرر
        cache.set(cache_key, results, timeout=600)
        
        return results

    @staticmethod
    def get_top_categories():
        """جلب الفئات الأكثر طلباً (Trend Analysis)"""
        return Category.objects.annotate(job_count=Count('jobs')).order_by('-job_count')[:10]

    @staticmethod
    def search_workers(query):
        """البحث عن العمال حسب المهارات والتقييم"""
        return User.objects.filter(
            Q(role='worker') & 
            (Q(skills__icontains=query) | Q(bio__icontains=query))
        ).order_by('-rating')