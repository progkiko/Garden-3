"""
Garden, Plant, and AR Serializers for Pastures Gardening
"""
from rest_framework import serializers

class PlantSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    x = serializers.IntegerField(min_value=0, max_value=12)
    y = serializers.IntegerField(min_value=0, max_value=8)
    speciesName = serializers.CharField(max_length=120)
    botanicalName = serializers.CharField(max_length=120)
    category = serializers.ChoiceField(choices=['flower', 'shrub', 'tree', 'herb', 'vegetable', 'grass'])
    health = serializers.ChoiceField(choices=['thriving', 'good', 'needs_water', 'pest_alert', 'prune_due'])
    sunlight = serializers.ChoiceField(choices=['full_sun', 'partial_shade', 'deep_shade'])
    waterCadenceDays = serializers.IntegerField()
    lastWatered = serializers.CharField(max_length=40)
    plantedDate = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(allow_blank=True)
    arScale = serializers.FloatField(default=1.0)
    bloomSeason = serializers.CharField(max_length=60)

class GardenZoneSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=120)
    type = serializers.CharField(max_length=80)
    exposure = serializers.CharField(max_length=80)
    status = serializers.CharField(max_length=120)
    coverage = serializers.CharField(max_length=40)

class GardenSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=64)
    name = serializers.CharField(max_length=160)
    location = serializers.CharField(max_length=160)
    areaM2 = serializers.IntegerField()
    soil = serializers.CharField(max_length=160)
    aspect = serializers.CharField(max_length=120)
    zones = GardenZoneSerializer(many=True, required=False)

class ARPlacementSerializer(serializers.Serializer):
    plantId = serializers.CharField(max_length=64)
    worldX = serializers.FloatField()
    worldY = serializers.FloatField()
    worldZ = serializers.FloatField()
    scale = serializers.FloatField(default=1.0)
    rotation = serializers.FloatField(default=0.0)
