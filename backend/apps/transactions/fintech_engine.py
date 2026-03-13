import logging
import uuid
from decimal import Decimal
from django.db import transaction
from django.core.cache import cache
# تصحيح المسارات هنا (استخدام الاستيراد النسبي .models)
from .models import Wallet, Transaction

audit_logger = logging.getLogger("proly.fintech.audit")

TRANSACTION_LOCK_TIMEOUT = 30 

class DistributedFinLock:
    @staticmethod
    def lock_user_wallet(user_id) -> str:
        lock_id = str(uuid.uuid4())
        if cache.add(f"wallet_lock:{user_id}", lock_id, timeout=TRANSACTION_LOCK_TIMEOUT):
            return lock_id
        return None

    @staticmethod
    def unlock_user_wallet(user_id, lock_id: str):
        if cache.get(f"wallet_lock:{user_id}") == lock_id:
            cache.delete(f"wallet_lock:{user_id}")

class WalletOrchestrator:
    @staticmethod
    @transaction.atomic
    def deposit_funds(user_id, amount: Decimal, provider_ref: str) -> bool:
        wallet = Wallet.objects.select_for_update().get(user_id=user_id)
        wallet.available_balance += amount
        wallet.save()
        Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type='DEPOSIT',
            status='COMPLETED',
            description=f"Ref: {provider_ref}"
        )
        return True

    @staticmethod
    @transaction.atomic
    def get_user_wallet(user):
        wallet, created = Wallet.objects.get_or_create(user=user)
        return wallet