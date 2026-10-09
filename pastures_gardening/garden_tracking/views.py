"""
Garden Tracking, Botanical Catalog, and AR views for Pastures Gardening
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlantSerializer, GardenSerializer, ARPlacementSerializer

GARDENS_DATA = [
    {
        'id': 'g1',
        'name': 'High Meadow House - South Formal Grounds',
        'location': 'Chipping Campden, Cotswolds',
        'areaM2': 180,
        'soil': 'Limestone loam with rich humus top-dressing',
        'aspect': 'South-South-West (High natural light)',
        'zones': [
            {
                'id': 'za',
                'name': 'Zone A: Roller Striped Lawn',
                'type': 'Fine Turf',
                'exposure': 'Full Sunlight',
                'status': 'Recently scarified & cylinder striped',
                'coverage': '85 m²',
            },
            {
                'id': 'zb',
                'name': 'Zone B: Herbaceous Lavender & Perennial Border',
                'type': 'Cottage Border',
                'exposure': 'Full Sunlight',
                'status': 'Dense flower spikes, linalool aroma',
                'coverage': '35 m²',
            },
        ],
    }
]

PLANTS_DATA = [
    {
        'id': 'p1',
        'x': 2,
        'y': 3,
        'speciesName': "English Lavender 'Munstead'",
        'botanicalName': 'Lavandula angustifolia',
        'category': 'herb',
        'health': 'thriving',
        'sunlight': 'full_sun',
        'waterCadenceDays': 7,
        'lastWatered': '2026-10-06',
        'plantedDate': '2024-04-12',
        'notes': 'Pruned hard after summer bloom. Excellent silvery foliage and root drainage.',
        'arScale': 1.0,
        'bloomSeason': 'Summer to Early Autumn',
    },
    {
        'id': 'p2',
        'x': 5,
        'y': 2,
        'speciesName': "Japanese Maple 'Bloodgood'",
        'botanicalName': 'Acer palmatum',
        'category': 'tree',
        'health': 'good',
        'sunlight': 'partial_shade',
        'waterCadenceDays': 4,
        'lastWatered': '2026-10-07',
        'plantedDate': '2023-09-18',
        'notes': 'Stunning deep crimson foliage. Protected from harsh north winds by limestone wall.',
        'arScale': 1.4,
        'bloomSeason': 'Foliage focal point',
    },
    {
        'id': 'p3',
        'x': 8,
        'y': 4,
        'speciesName': 'French Hydrangea',
        'botanicalName': 'Hydrangea macrophylla',
        'category': 'shrub',
        'health': 'needs_water',
        'sunlight': 'partial_shade',
        'waterCadenceDays': 3,
        'lastWatered': '2026-10-04',
        'plantedDate': '2024-05-10',
        'notes': 'Requires deep irrigation soak during dry spells; acidic fertilizer maintains blue sepals.',
        'arScale': 1.1,
        'bloomSeason': 'Summer',
    },
]

class GardenListView(APIView):
    def get(self, request):
        return Response({'success': True, 'count': len(GARDENS_DATA), 'gardens': GARDENS_DATA})

class PlantListView(APIView):
    def get(self, request):
        return Response({'success': True, 'count': len(PLANTS_DATA), 'plants': PLANTS_DATA})

    def post(self, request):
        serializer = PlantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        plant = serializer.validated_data
        PLANTS_DATA.append(plant)
        return Response({'success': True, 'plant': plant}, status=status.HTTP_201_CREATED)

class PlantDetailView(APIView):
    def get(self, request, pk):
        plant = next((p for p in PLANTS_DATA if p['id'] == pk), None)
        if not plant:
            return Response({'success': False, 'error': 'Plant not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'plant': plant})

    def put(self, request, pk):
        plant = next((p for p in PLANTS_DATA if p['id'] == pk), None)
        if not plant:
            return Response({'success': False, 'error': 'Plant not found'}, status=status.HTTP_404_NOT_FOUND)
        for k, v in request.data.items():
            plant[k] = v
        return Response({'success': True, 'plant': plant})

class WaterPlantView(APIView):
    def post(self, request, pk):
        plant = next((p for p in PLANTS_DATA if p['id'] == pk), None)
        if not plant:
            return Response({'success': False, 'error': 'Plant not found'}, status=status.HTTP_404_NOT_FOUND)
        
        plant['health'] = 'thriving'
        plant['lastWatered'] = '2026-10-08'
        return Response({
            'success': True,
            'message': f'{plant["speciesName"]} watered and logged in maintenance history.',
            'plant': plant,
        })
