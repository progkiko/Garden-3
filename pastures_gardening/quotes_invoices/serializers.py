"""
Serializers for Quotes, Estimates, Line Items, and Invoices
"""
from rest_framework import serializers

class LineItemSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    description = serializers.CharField(max_length=255)
    category = serializers.CharField(max_length=80)
    quantity = serializers.FloatField()
    unit = serializers.CharField(max_length=40)
    unitPrice = serializers.FloatField()
    total = serializers.FloatField()

class QuoteSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    quoteRef = serializers.CharField(max_length=40)
    customerName = serializers.CharField(max_length=120)
    customerEmail = serializers.EmailField()
    propertyAddress = serializers.CharField(max_length=255)
    gardenSizeDesc = serializers.CharField(max_length=120)
    assessmentSummary = serializers.CharField()
    difficultyRating = serializers.CharField(max_length=60)
    estimatedHours = serializers.FloatField()
    recommendedCrewSize = serializers.IntegerField()
    lineItems = LineItemSerializer(many=True)
    wasteVolumeBags = serializers.FloatField(required=False)
    subtotal = serializers.FloatField()
    greenWasteFee = serializers.FloatField()
    taxVat = serializers.FloatField()
    total = serializers.FloatField()
    status = serializers.ChoiceField(choices=['draft', 'sent', 'accepted', 'rejected'])
    createdAt = serializers.CharField(required=False)
    equipmentRecommended = serializers.ListField(child=serializers.CharField(), required=False)
    proGardenerTips = serializers.ListField(child=serializers.CharField(), required=False)

class InvoiceSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    invoiceNumber = serializers.CharField(max_length=40)
    quoteId = serializers.CharField(max_length=64, required=False, allow_blank=True)
    customerName = serializers.CharField(max_length=120)
    customerEmail = serializers.EmailField()
    customerAddress = serializers.CharField(max_length=255)
    issueDate = serializers.CharField(max_length=30)
    dueDate = serializers.CharField(max_length=30)
    lineItems = LineItemSerializer(many=True)
    subtotal = serializers.FloatField()
    greenWasteFee = serializers.FloatField()
    taxVat = serializers.FloatField()
    total = serializers.FloatField()
    paymentStatus = serializers.ChoiceField(choices=['unpaid', 'paid', 'deposit_paid'])
    stripePaymentId = serializers.CharField(required=False, allow_blank=True)
    paidAt = serializers.CharField(required=False, allow_blank=True)
    paymentMethod = serializers.CharField(required=False, allow_blank=True)
