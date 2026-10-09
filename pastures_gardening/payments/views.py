"""
Payments & Stripe Settlement Views for Pastures Gardening
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import uuid

TRANSACTIONS_LOG = [
    {
        'id': 'txn-001',
        'invoiceId': 'inv-301',
        'amount': 202.80,
        'currency': 'gbp',
        'method': 'Stripe Card',
        'status': 'succeeded',
        'date': '2026-10-06T15:30:00Z',
    }
]

class CreatePaymentIntentView(APIView):
    def post(self, request):
        invoice_id = request.data.get('invoiceId')
        amount = request.data.get('amount', 202.80)
        
        # Simulates creating a Stripe PaymentIntent with Client Secret
        payment_intent_id = f"pi_mock_{uuid.uuid4().hex[:16]}"
        client_secret = f"{payment_intent_id}_secret_{uuid.uuid4().hex[:12]}"
        
        return Response({
            'success': True,
            'clientSecret': client_secret,
            'paymentIntentId': payment_intent_id,
            'amount': amount,
            'currency': 'gbp',
        })

class ConfirmPaymentView(APIView):
    def post(self, request):
        invoice_id = request.data.get('invoiceId')
        payment_method = request.data.get('paymentMethod', 'card_visa')
        amount = request.data.get('amount', 0)
        
        txn = {
            'id': f'txn_{uuid.uuid4().hex[:8]}',
            'invoiceId': invoice_id,
            'amount': amount,
            'currency': 'gbp',
            'method': payment_method,
            'status': 'succeeded',
            'date': '2026-10-08T16:00:00Z',
        }
        TRANSACTIONS_LOG.append(txn)
        
        return Response({
            'success': True,
            'message': 'Payment settled successfully via Stripe.',
            'transaction': txn,
        })

class PaymentHistoryView(APIView):
    def get(self, request):
        return Response({
            'success': True,
            'count': len(TRANSACTIONS_LOG),
            'history': TRANSACTIONS_LOG,
        })
