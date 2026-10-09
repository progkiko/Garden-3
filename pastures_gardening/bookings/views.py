"""
Bookings Views for Pastures Gardening
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    BookingSerializer,
    RescheduleBookingSerializer,
    ReviewBookingSerializer,
)

BOOKINGS_STORE = [
    {
        'id': 'book-101',
        'bookingRef': 'BKG-2026-042',
        'customerName': 'Lady Alistair Finch',
        'customerEmail': 'alistair.finch@cotswolds.co.uk',
        'customerPhone': '+44 7700 900077',
        'address': 'High Meadow House, Willow Lane, Chipping Campden',
        'serviceIds': ['srv-lawn-mowing', 'srv-hedge-sculpt'],
        'date': '2026-10-12',
        'timeSlot': 'morning',
        'status': 'confirmed',
        'notes': 'Please focus on formal front terrace cylinder striping and clipping topiary box spheres.',
        'totalEstimate': 145.0,
        'assignedGardener': 'Callum Brooks (Senior Groundsman)',
        'checklist': {
            'Perimeter security & dog gate latch check': True,
            'Cylinder roller mowing at 22mm bench height': False,
            'Topiary box sphere shears finish': False,
            'Green waste sweeping & composting': False,
        },
        'createdAt': '2026-10-06T10:00:00Z',
    },
    {
        'id': 'book-102',
        'bookingRef': 'BKG-2026-043',
        'customerName': 'Lord Henry Sterling',
        'customerEmail': 'henry@sterlinghall.co.uk',
        'customerPhone': '+44 7700 900334',
        'address': 'Sterling Manor, Broadway Road, Gloucestershire',
        'serviceIds': ['srv-clearance', 'srv-planting-mulch'],
        'date': '2026-10-15',
        'timeSlot': 'full_day',
        'status': 'in_progress',
        'notes': 'Spreading 3 bulk bags of organic mushroom compost across the walled kitchen garden.',
        'totalEstimate': 360.0,
        'assignedGardener': 'Callum Brooks & Toby Miller',
        'checklist': {
            'Weed barrier inspection': True,
            'Compost layer depth 3 inches check': True,
            'Subsurface drip line test': False,
            'Site clean down and sweep': False,
        },
        'createdAt': '2026-10-06T14:30:00Z',
    },
]

class BookingListView(APIView):
    def get(self, request):
        status_filter = request.query_params.get('status')
        if status_filter:
            data = [b for b in BOOKINGS_STORE if b['status'] == status_filter]
        else:
            data = BOOKINGS_STORE
        return Response({'success': True, 'count': len(data), 'bookings': data})

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        booking = serializer.validated_data
        BOOKINGS_STORE.insert(0, booking)
        return Response({'success': True, 'booking': booking}, status=status.HTTP_201_CREATED)

class BookingDetailView(APIView):
    def get(self, request, pk):
        booking = next((b for b in BOOKINGS_STORE if b['id'] == pk), None)
        if not booking:
            return Response({'success': False, 'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'booking': booking})

    def patch(self, request, pk):
        booking = next((b for b in BOOKINGS_STORE if b['id'] == pk), None)
        if not booking:
            return Response({'success': False, 'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        for k, v in request.data.items():
            booking[k] = v
        return Response({'success': True, 'booking': booking})

class RescheduleBookingView(APIView):
    def post(self, request, pk):
        booking = next((b for b in BOOKINGS_STORE if b['id'] == pk), None)
        if not booking:
            return Response({'success': False, 'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RescheduleBookingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        booking['date'] = serializer.validated_data['newDate']
        booking['timeSlot'] = serializer.validated_data['newTimeSlot']
        booking['status'] = 'confirmed'
        return Response({'success': True, 'booking': booking, 'message': 'Booking rescheduled successfully.'})

class CancelBookingView(APIView):
    def post(self, request, pk):
        booking = next((b for b in BOOKINGS_STORE if b['id'] == pk), None)
        if not booking:
            return Response({'success': False, 'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        booking['status'] = 'cancelled'
        return Response({'success': True, 'booking': booking, 'message': 'Booking cancelled.'})

class ToggleChecklistView(APIView):
    def post(self, request, pk):
        booking = next((b for b in BOOKINGS_STORE if b['id'] == pk), None)
        if not booking:
            return Response({'success': False, 'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        
        task = request.data.get('task')
        if not task:
            return Response({'success': False, 'error': 'Task name required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if 'checklist' not in booking or not isinstance(booking['checklist'], dict):
            booking['checklist'] = {}
        
        current_val = booking['checklist'].get(task, False)
        booking['checklist'][task] = not current_val
        return Response({'success': True, 'booking': booking})
