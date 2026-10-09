"""
User & Authentication Serializers for Pastures Gardening
"""
from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['customer', 'gardener', 'admin'])
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    postcode = serializers.CharField(max_length=20, required=False, allow_blank=True)
    avatar = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    joined_date = serializers.CharField(required=False)

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['customer', 'gardener', 'admin'], default='customer')
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=128)

class SavedAddressSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    label = serializers.CharField(max_length=60)
    address = serializers.CharField(max_length=255)
    postcode = serializers.CharField(max_length=20)
    is_primary = serializers.BooleanField(default=False)
    notes = serializers.CharField(required=False, allow_blank=True)

class PreferencesSerializer(serializers.Serializer):
    email_notifications = serializers.BooleanField(default=True)
    sms_alerts = serializers.BooleanField(default=True)
    seasonal_planting_advice = serializers.BooleanField(default=True)
    invoice_reminders = serializers.BooleanField(default=True)
