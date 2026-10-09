"""
Pastures Gardening Django Settings & Configuration additions.
Configures DRF, CORS, Authentication, Stripe, and Database.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'pastures-gardening-secure-secret-key-2026')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS_ADDITIONS = [
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'accounts',
    'bookings',
    'quotes_invoices',
    'payments',
    'garden_tracking',
]

MIDDLEWARE_ADDITIONS = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
]

# Business configuration for Pastures Gardening
PASTURES_CONFIG = {
    'COMPANY_NAME': 'Pastures Gardening & Grounds Maintenance Ltd.',
    'VAT_NUMBER': 'GB 924 8102 33',
    'COMPANY_REGISTRATION': '10842911',
    'OFFICE_ADDRESS': 'The Estate Yard, Chipping Campden, Cotswolds, GL55 6HB',
    'TELEPHONE': '+44 (0) 1386 840 922',
    'SUPPORT_EMAIL': 'enquiries@pastures-gardening.co.uk',
    'CURRENCY': 'GBP',
    'CURRENCY_SYMBOL': '£',
    'STANDARD_VAT_RATE': 0.20,
    'STRIPE_PUBLISHABLE_KEY': os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_sample_pastures'),
    'STRIPE_SECRET_KEY': os.environ.get('STRIPE_SECRET_KEY', 'sk_test_sample_pastures'),
    'GEMINI_API_KEY': os.environ.get('GEMINI_API_KEY', ''),
}
