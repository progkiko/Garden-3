"""
Booking Serializers for Pastures Gardening
"""
from rest_framework import serializers

class BookingSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    bookingRef = serializers.CharField(max_length=40)
    customerName = serializers.CharField(max_length=120)
    customerEmail = serializers.EmailField()
    customerPhone = serializers.CharField(max_length=40)
    address = serializers.CharField(max_length=255)
    serviceIds = serializers.ListField(child=serializers.CharField())
    date = serializers.CharField(max_length=30)
    timeSlot = serializers.ChoiceField(choices=['morning', 'afternoon', 'full_day'])
    status = serializers.ChoiceField(choices=['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
    notes = serializers.CharField(allow_blank=True, required=False)
    totalEstimate = serializers.FloatField()
    assignedGardener = serializers.CharField(allow_blank=True, required=False)
    checklist = serializers.DictField(required=False)
    createdAt = serializers.CharField(required=False)

class RescheduleBookingSerializer(serializers.Serializer):
    newDate = serializers.CharField(max_length=30)
    newTimeSlot = serializers.ChoiceField(choices=['morning', 'afternoon', 'full_day'])
    reason = serializers.CharField(required=False, allow_blank=True)

class ReviewBookingSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    reviewNotes = serializers.CharField()
    wouldRecommend = serializers.BooleanField(default=True)
