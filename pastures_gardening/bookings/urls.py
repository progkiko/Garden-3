"""
Bookings URL configuration
"""
from django.urls import path
from .views import (
    BookingListView,
    BookingDetailView,
    RescheduleBookingView,
    CancelBookingView,
    ToggleChecklistView,
)

urlpatterns = [
    path('', BookingListView.as_view(), name='booking-list'),
    path('<str:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('<str:pk>/reschedule/', RescheduleBookingView.as_view(), name='booking-reschedule'),
    path('<str:pk>/cancel/', CancelBookingView.as_view(), name='booking-cancel'),
    path('<str:pk>/checklist/', ToggleChecklistView.as_view(), name='booking-checklist'),
]
