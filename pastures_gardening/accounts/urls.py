"""
Accounts URL routing
"""
from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    VerifyEmailView,
    PasswordResetView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='account-register'),
    path('login/', LoginView.as_view(), name='account-login'),
    path('profile/', ProfileView.as_view(), name='account-profile'),
    path('verify-email/', VerifyEmailView.as_view(), name='account-verify-email'),
    path('forgot-password/', PasswordResetView.as_view(), name='account-forgot-password'),
]
