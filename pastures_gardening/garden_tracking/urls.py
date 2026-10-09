"""
Garden Tracking URL configuration
"""
from django.urls import path
from .views import (
    GardenListView,
    PlantListView,
    PlantDetailView,
    WaterPlantView,
)

urlpatterns = [
    path('gardens/', GardenListView.as_view(), name='garden-list'),
    path('plants/', PlantListView.as_view(), name='plant-list'),
    path('plants/<str:pk>/', PlantDetailView.as_view(), name='plant-detail'),
    path('plants/<str:pk>/water/', WaterPlantView.as_view(), name='plant-water'),
]
