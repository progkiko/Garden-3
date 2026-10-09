"""
Pastures Gardening Main URL Configuration
"""
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def api_root(request):
    """
    Overview of all Pastures Gardening Backend API endpoints.
    """
    return Response({
        'service': 'Pastures Gardening API',
        'status': 'online',
        'version': '1.0.0',
        'endpoints': {
            'accounts': '/api/accounts/',
            'bookings': '/api/bookings/',
            'quotes_invoices': '/api/quotes-invoices/',
            'payments': '/api/payments/',
            'garden_tracking': '/api/garden-tracking/',
            'client_requests': '/api/client-requests/',
        }
    })

urlpatterns = [
    path('api/', api_root, name='api-root'),
    path('api/accounts/', include('accounts.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/quotes-invoices/', include('quotes_invoices.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/garden-tracking/', include('garden_tracking.urls')),
]
