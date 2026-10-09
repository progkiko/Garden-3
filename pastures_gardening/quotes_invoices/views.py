"""
Quotes and Invoices Views for Pastures Gardening
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from .serializers import QuoteSerializer, InvoiceSerializer
from .pdf_gen import generate_invoice_html, generate_invoice_pdf

QUOTES_STORE = [
    {
        'id': 'quote-201',
        'quoteRef': 'EST-2026-088',
        'customerName': 'Eleanor Vance',
        'customerEmail': 'eleanor.vance@cotswolds.co.uk',
        'propertyAddress': 'High Meadow House, Willow Lane, Chipping Campden',
        'gardenSizeDesc': '180 sq meters formal grounds',
        'assessmentSummary': 'Formal lawn requiring precision rotary mowing, followed by hornbeam perimeter topiary leveling.',
        'difficultyRating': 'Moderate',
        'estimatedHours': 3.5,
        'recommendedCrewSize': 2,
        'lineItems': [
            {
                'id': 'qi-1',
                'description': 'Precision Cylinder Lawn Mowing & Striping',
                'category': 'Lawn Care',
                'quantity': 180.0,
                'unit': 'sq m',
                'unitPrice': 0.45,
                'total': 81.0,
            },
            {
                'id': 'qi-2',
                'description': 'Hornbeam Boundary Hedge Leveling & Topiary',
                'category': 'Hedge Care',
                'quantity': 1.5,
                'unit': 'hours',
                'unitPrice': 42.0,
                'total': 63.0,
            },
        ],
        'wasteVolumeBags': 2.0,
        'subtotal': 144.0,
        'greenWasteFee': 25.0,
        'taxVat': 33.80,
        'total': 202.80,
        'status': 'accepted',
        'createdAt': '2026-10-05T14:00:00Z',
        'equipmentRecommended': ['Dennis FT510 Cylinder Mower', 'Stihl HLA 86 Pole Trimmer'],
        'proGardenerTips': ['Maintain cylinder roller cut at 22mm throughout early autumn.'],
    }
]

INVOICES_STORE = [
    {
        'id': 'inv-301',
        'invoiceNumber': 'INV-2026-0034',
        'quoteId': 'quote-201',
        'customerName': 'Eleanor Vance',
        'customerEmail': 'eleanor.vance@cotswolds.co.uk',
        'customerAddress': 'High Meadow House, Willow Lane, Chipping Campden',
        'issueDate': '2026-10-05',
        'dueDate': '2026-10-19',
        'lineItems': [
            {
                'id': 'li-1',
                'description': 'Precision Cylinder Lawn Mowing & Striping',
                'category': 'Lawn Care',
                'quantity': 180.0,
                'unit': 'sq m',
                'unitPrice': 0.45,
                'total': 81.0,
            },
            {
                'id': 'li-2',
                'description': 'Hornbeam Boundary Hedge Leveling & Topiary',
                'category': 'Hedge Care',
                'quantity': 1.5,
                'unit': 'hours',
                'unitPrice': 42.0,
                'total': 63.0,
            },
        ],
        'subtotal': 144.0,
        'greenWasteFee': 25.0,
        'taxVat': 33.80,
        'total': 202.80,
        'paymentStatus': 'unpaid',
    }
]

class QuoteListView(APIView):
    def get(self, request):
        return Response({'success': True, 'count': len(QUOTES_STORE), 'quotes': QUOTES_STORE})

    def post(self, request):
        serializer = QuoteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        quote = serializer.validated_data
        QUOTES_STORE.insert(0, quote)
        return Response({'success': True, 'quote': quote}, status=status.HTTP_201_CREATED)

class QuoteDetailView(APIView):
    def get(self, request, pk):
        quote = next((q for q in QUOTES_STORE if q['id'] == pk), None)
        if not quote:
            return Response({'success': False, 'error': 'Quote not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'quote': quote})

    def patch(self, request, pk):
        quote = next((q for q in QUOTES_STORE if q['id'] == pk), None)
        if not quote:
            return Response({'success': False, 'error': 'Quote not found'}, status=status.HTTP_404_NOT_FOUND)
        for k, v in request.data.items():
            quote[k] = v
        return Response({'success': True, 'quote': quote})

class ConvertQuoteToInvoiceView(APIView):
    def post(self, request, pk):
        quote = next((q for q in QUOTES_STORE if q['id'] == pk), None)
        if not quote:
            return Response({'success': False, 'error': 'Quote not found'}, status=status.HTTP_404_NOT_FOUND)
        
        quote['status'] = 'accepted'
        new_inv = {
            'id': f'inv-{len(INVOICES_STORE) + 100}',
            'invoiceNumber': f'INV-2026-0{len(INVOICES_STORE) + 35}',
            'quoteId': quote['id'],
            'customerName': quote['customerName'],
            'customerEmail': quote['customerEmail'],
            'customerAddress': quote['propertyAddress'],
            'issueDate': '2026-10-08',
            'dueDate': '2026-10-22',
            'lineItems': quote['lineItems'],
            'subtotal': quote['subtotal'],
            'greenWasteFee': quote['greenWasteFee'],
            'taxVat': quote['taxVat'],
            'total': quote['total'],
            'paymentStatus': 'unpaid',
        }
        INVOICES_STORE.insert(0, new_inv)
        return Response({'success': True, 'invoice': new_inv}, status=status.HTTP_201_CREATED)

class InvoiceListView(APIView):
    def get(self, request):
        return Response({'success': True, 'count': len(INVOICES_STORE), 'invoices': INVOICES_STORE})

    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        inv = serializer.validated_data
        INVOICES_STORE.insert(0, inv)
        return Response({'success': True, 'invoice': inv}, status=status.HTTP_201_CREATED)

class InvoicePdfView(APIView):
    def get(self, request, pk):
        invoice = next((i for i in INVOICES_STORE if i['id'] == pk), None)
        if not invoice:
            return Response({'success': False, 'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)
        
        format_type = request.query_params.get('format', 'html')
        if format_type == 'html':
            html_output = generate_invoice_html(invoice)
            return HttpResponse(html_output, content_type='text/html')
        else:
            pdf_bytes = generate_invoice_pdf(invoice)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice["invoiceNumber"]}.pdf"'
            return response
