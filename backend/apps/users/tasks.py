from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_security_alert_email(email, ip):
    send_mail(
        "Suspicious Login Detected",
        f"New login detected from IP: {ip}",
        "no-reply@yourapp.com",
        [email],
        fail_silently=True,
    )