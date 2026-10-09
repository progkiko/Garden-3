"""
Payments URL configuration
"""
from django.urls import path
from .views import (
    CreatePaymentIntentView,
    ConfirmPaymentView,
    PaymentHistoryView,
)

urlpatterns = [
    path('create-intent/', CreatePaymentIntentView.as_view(), name='payment-create-intent'),
    path('confirm/', ConfirmPaymentView.as_view(), name='payment-confirm'),
    path('history/', PaymentHistoryView.as_view(), name='payment-history'),
]
