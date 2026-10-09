"""
Quotes & Invoices URL configuration
"""
from django.urls import path
from .views import (
    QuoteListView,
    QuoteDetailView,
    ConvertQuoteToInvoiceView,
    InvoiceListView,
    InvoicePdfView,
)

urlpatterns = [
    path('quotes/', QuoteListView.as_view(), name='quote-list'),
    path('quotes/<str:pk>/', QuoteDetailView.as_view(), name='quote-detail'),
    path('quotes/<str:pk>/convert-to-invoice/', ConvertQuoteToInvoiceView.as_view(), name='quote-convert'),
    path('invoices/', InvoiceListView.as_view(), name='invoice-list'),
    path('invoices/<str:pk>/pdf/', InvoicePdfView.as_view(), name='invoice-pdf'),
]
