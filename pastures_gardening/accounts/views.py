"""
Accounts & Authentication Views for Pastures Gardening
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    PasswordResetRequestSerializer,
    VerifyEmailSerializer,
    SavedAddressSerializer,
    PreferencesSerializer,
)

# Mock in-memory database of active users
USERS_DB = [
    {
        'id': 'u1',
        'name': 'Lady Alistair Finch',
        'email': 'alistair.finch@cotswolds.co.uk',
        'role': 'customer',
        'phone': '+44 7700 900077',
        'address': 'High Meadow House, Willow Lane, Chipping Campden',
        'postcode': 'GL55 6HB',
        'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        'bio': 'Owner of 180m² formal lawns and herbaceous perennial borders.',
        'joined_date': 'March 2025',
    },
    {
        'id': 'u2',
        'name': 'Callum Brooks',
        'email': 'callum@pastures-gardening.co.uk',
        'role': 'gardener',
        'phone': '+44 7700 900812',
        'address': 'Pastures Yard, Moreton-in-Marsh',
        'postcode': 'GL56 0AA',
        'avatar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        'bio': 'Senior Groundsman & Horticulturalist with RHS Level 3 qualification.',
        'joined_date': 'January 2024',
    },
    {
        'id': 'u3',
        'name': 'Harriet Sterling',
        'email': 'admin@pastures-gardening.co.uk',
        'role': 'admin',
        'phone': '+44 7700 900999',
        'address': 'The Estate Office, Broadway Road',
        'postcode': 'WR12 7AA',
        'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        'bio': 'Operations Director managing field crew schedules and client contracts.',
        'joined_date': 'August 2023',
    },
]

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        new_user = {
            'id': f'u_{len(USERS_DB) + 1}',
            'name': data['name'],
            'email': data['email'],
            'role': data.get('role', 'customer'),
            'phone': data.get('phone', ''),
            'address': data.get('address', ''),
            'postcode': '',
            'avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            'bio': 'New Pastures gardening client account.',
            'joined_date': 'October 2026',
        }
        USERS_DB.append(new_user)
        return Response({
            'success': True,
            'message': 'Account registered successfully. Verification email dispatched.',
            'user': new_user,
            'token': f'pastures_token_{new_user["id"]}'
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email'].lower()
        matched = next((u for u in USERS_DB if u['email'].lower() == email), USERS_DB[0])
        
        return Response({
            'success': True,
            'user': matched,
            'token': f'pastures_auth_token_{matched["id"]}',
        })

class ProfileView(APIView):
    def get(self, request):
        user_id = request.query_params.get('id', 'u1')
        user = next((u for u in USERS_DB if u['id'] == user_id), USERS_DB[0])
        return Response({'success': True, 'profile': user})

    def patch(self, request):
        user_id = request.data.get('id', 'u1')
        user = next((u for u in USERS_DB if u['id'] == user_id), None)
        if not user:
            return Response({'success': False, 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        for k, v in request.data.items():
            if k in user:
                user[k] = v
        return Response({'success': True, 'profile': user})

class VerifyEmailView(APIView):
    def post(self, request):
        return Response({
            'success': True,
            'message': 'Email address verified successfully. Welcome to Pastures Gardening!'
        })

class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('email', '')
        return Response({
            'success': True,
            'message': f'Secure reset instructions sent to {email}'
        })
