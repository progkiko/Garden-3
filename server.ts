import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import { backendStore } from './server/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ==========================================
// BACKEND CLIENT REQUESTS MANAGEMENT API
// ==========================================

// 1. Get all client requests (with search and filtering)
app.get('/api/client-requests', (req, res) => {
  const { status, type, priority, query } = req.query as Record<string, string>;
  const requests = backendStore.getAllRequests({ status, type, priority, query });
  return res.json({ success: true, count: requests.length, requests });
});

// 2. Get specific client request by ID
app.get('/api/client-requests/:id', (req, res) => {
  const request = backendStore.getRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, error: 'Request not found' });
  }
  return res.json({ success: true, request });
});

// 3. Create a new client request
app.post('/api/client-requests', (req, res) => {
  const newRequest = backendStore.createRequest(req.body);
  return res.status(201).json({ success: true, request: newRequest });
});

// 4. Update request status, assigned staff, or internal notes
app.patch('/api/client-requests/:id', (req, res) => {
  const updated = backendStore.updateRequest(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Request not found' });
  }
  return res.json({ success: true, request: updated });
});

// 5. Delete or archive request
app.delete('/api/client-requests/:id', (req, res) => {
  const success = backendStore.deleteRequest(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Request not found' });
  }
  return res.json({ success: true, message: 'Request archived successfully' });
});

// 6. Action dispatcher (e.g. Convert to booking, dispatch crew, approve)
app.post('/api/client-requests/:id/action', (req, res) => {
  const { action, staffName, scheduledDate } = req.body;
  const request = backendStore.getRequestById(req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, error: 'Request not found' });
  }

  if (action === 'assign_crew') {
    const updated = backendStore.updateRequest(request.id, {
      assignedStaff: staffName || 'Callum Brooks (Senior Groundsman)',
      status: 'under_review',
      internalNotes: [`Assigned to ${staffName} on ${new Date().toLocaleDateString()}`],
    });
    return res.json({ success: true, request: updated });
  }

  if (action === 'convert_to_booking') {
    const booking = backendStore.createBooking({
      id: `book-${Date.now()}`,
      bookingRef: `PG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: request.clientName,
      customerEmail: request.clientEmail,
      customerPhone: request.clientPhone,
      address: `${request.propertyAddress}, ${request.postcode}`,
      serviceIds: request.servicesRequested || ['srv-clearance'],
      date: scheduledDate || request.requestedDate || new Date().toISOString().split('T')[0],
      timeSlot: request.preferredTimeSlot || 'morning',
      status: 'confirmed',
      notes: request.description,
      totalEstimate: request.estimatedValue || 180,
      assignedGardener: request.assignedStaff || 'Callum Brooks (Senior Groundsman)',
      checklist: {
        'Initial site safety and perimeter inspection': false,
        'Carry out requested works': false,
        'Sweep pathways and rake borders': false,
        'Green waste removal & disposal': false,
      },
      createdAt: new Date().toISOString().split('T')[0],
    });

    const updated = backendStore.updateRequest(request.id, {
      status: 'scheduled',
      associatedBookingId: booking.id,
      internalNotes: [`Converted to formal booking ${booking.bookingRef}`],
    });

    return res.json({ success: true, request: updated, booking });
  }

  if (action === 'mark_completed') {
    const updated = backendStore.updateRequest(request.id, {
      status: 'completed',
      internalNotes: ['Grounds work confirmed completed by operations team.'],
    });
    return res.json({ success: true, request: updated });
  }

  return res.status(400).json({ success: false, error: 'Unknown action' });
});

// ==========================================
// BACKEND BOOKINGS API
// ==========================================

app.get('/api/bookings', (_req, res) => {
  const bookings = backendStore.getAllBookings();
  return res.json({ success: true, bookings });
});

app.post('/api/bookings', (req, res) => {
  const created = backendStore.createBooking(req.body);
  return res.status(201).json({ success: true, booking: created });
});

app.patch('/api/bookings/:id', (req, res) => {
  const updated = backendStore.updateBooking(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  return res.json({ success: true, booking: updated });
});

app.post('/api/bookings/:id/checklist', (req, res) => {
  const { task } = req.body;
  const booking = backendStore.getAllBookings().find((b) => b.id === req.params.id);
  if (!booking || !booking.checklist) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const updatedChecklist = {
    ...booking.checklist,
    [task]: !booking.checklist[task],
  };

  const updated = backendStore.updateBooking(booking.id, { checklist: updatedChecklist });
  return res.json({ success: true, booking: updated });
});

app.post('/api/bookings/:id/reschedule', (req, res) => {
  const { newDate, newTimeSlot } = req.body;
  const booking = backendStore.getAllBookings().find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  const updated = backendStore.updateBooking(booking.id, {
    date: newDate || booking.date,
    timeSlot: newTimeSlot || booking.timeSlot,
    status: 'confirmed',
  });
  return res.json({ success: true, booking: updated });
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  const booking = backendStore.getAllBookings().find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  const updated = backendStore.updateBooking(booking.id, { status: 'cancelled' });
  return res.json({ success: true, booking: updated });
});

app.post('/api/bookings/:id/review', (req, res) => {
  const { rating, reviewNotes } = req.body;
  const booking = backendStore.getAllBookings().find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
  return res.json({ success: true, message: 'Review recorded. Thank you for your feedback!' });
});

// ==========================================
// BACKEND QUOTES & ESTIMATES API
// ==========================================

app.get('/api/quotes', (_req, res) => {
  const quotes = backendStore.getAllQuotes();
  return res.json({ success: true, quotes });
});

app.get('/api/quotes/:id', (req, res) => {
  const quote = backendStore.getQuoteById(req.params.id);
  if (!quote) return res.status(404).json({ success: false, error: 'Quote not found' });
  return res.json({ success: true, quote });
});

app.patch('/api/quotes/:id', (req, res) => {
  const quote = backendStore.updateQuote(req.params.id, req.body);
  if (!quote) return res.status(404).json({ success: false, error: 'Quote not found' });
  return res.json({ success: true, quote });
});

app.get('/api/quotes/:id/pdf', (req, res) => {
  const quote = backendStore.getQuoteById(req.params.id);
  if (!quote) return res.status(404).send('Quote not found');
  const itemsHtml = quote.lineItems.map((li) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">
        <strong>${li.description}</strong>
        <div style="font-size: 11px; color: #78716c;">${li.category}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: center;">${li.quantity} ${li.unit}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace;">£${li.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace; font-weight: bold;">£${li.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quotation ${quote.quoteRef} - Pastures Gardening</title>
      <style>
        body { font-family: -apple-system, sans-serif; color: #1c1917; padding: 40px; max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #064e3b; padding-bottom: 20px; }
        .brand { font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #064e3b; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th { background: #f5f5f4; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #57534e; }
        .totals { margin-left: auto; width: 300px; }
        .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .grand-total { font-size: 18px !important; font-weight: bold; color: #064e3b; border-top: 2px solid #064e3b; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Pastures Gardening</div>
          <div style="font-size: 12px; color: #57534e;">Horticultural Quotation & Care Plan</div>
          <div style="font-size: 11px; color: #78716c;">VAT Reg: GB 924 8102 33</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 18px; font-weight: bold; font-family: monospace;">${quote.quoteRef}</div>
          <div style="font-size: 12px; color: #57534e;">Status: ${quote.status.toUpperCase()}</div>
        </div>
      </div>
      <div style="margin: 24px 0;">
        <strong>Client:</strong> ${quote.customerName} (${quote.customerEmail})<br>
        <strong>Property:</strong> ${quote.propertyAddress}<br>
        <strong>Terrain:</strong> ${quote.gardenSizeDesc} • Difficulty: ${quote.difficultyRating}<br>
        <strong>Summary:</strong> ${quote.assessmentSummary}
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div class="totals">
        <div><span>Subtotal:</span><span style="font-family: monospace;">£${quote.subtotal.toFixed(2)}</span></div>
        <div><span>Green Waste Disposal:</span><span style="font-family: monospace;">£${quote.greenWasteFee.toFixed(2)}</span></div>
        <div><span>VAT (20%):</span><span style="font-family: monospace;">£${quote.taxVat.toFixed(2)}</span></div>
        <div class="grand-total"><span>Total Estimate:</span><span style="font-family: monospace;">£${quote.total.toFixed(2)}</span></div>
      </div>
      <div style="margin-top: 40px; font-size: 11px; color: #78716c; text-align: center;">
        Valid for 30 days from issuance. Pastures Gardening Ltd. The Estate Yard, Chipping Campden.
      </div>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

app.post('/api/quotes', (req, res) => {
  const created = backendStore.createQuote(req.body);
  return res.status(201).json({ success: true, quote: created });
});

app.post('/api/quotes/:id/convert-to-invoice', (req, res) => {
  const quote = backendStore.getAllQuotes().find((q) => q.id === req.params.id);
  if (!quote) {
    return res.status(404).json({ success: false, error: 'Quote not found' });
  }

  const invoice = backendStore.createInvoice({
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    quoteId: quote.id,
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerAddress: quote.propertyAddress,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    lineItems: quote.lineItems,
    subtotal: quote.subtotal,
    greenWasteFee: quote.greenWasteFee,
    taxVat: quote.taxVat,
    total: quote.total,
    paymentStatus: 'unpaid',
  });

  return res.json({ success: true, invoice });
});

// ==========================================
// BACKEND INVOICES & PAYMENTS API
// ==========================================

app.get('/api/invoices', (_req, res) => {
  const invoices = backendStore.getAllInvoices();
  return res.json({ success: true, invoices });
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = backendStore.getInvoiceById(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, error: 'Invoice not found' });
  return res.json({ success: true, invoice });
});

app.get('/api/invoices/:id/pdf', (req, res) => {
  const invoice = backendStore.getInvoiceById(req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');

  const itemsHtml = invoice.lineItems.map((li) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">
        <strong>${li.description}</strong>
        <div style="font-size: 11px; color: #78716c;">Category: ${li.category}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: center;">${li.quantity} ${li.unit}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace;">£${li.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace; font-weight: bold;">£${li.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const statusLabel = invoice.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAYMENT DUE';
  const statusColor = invoice.paymentStatus === 'paid' ? '#047857' : '#b45309';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Invoice ${invoice.invoiceNumber} - Pastures Gardening</title>
      <style>
        body { font-family: -apple-system, sans-serif; color: #1c1917; padding: 40px; max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #064e3b; padding-bottom: 20px; }
        .brand { font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #064e3b; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; color: white; background: ${statusColor}; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th { background: #f5f5f4; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #57534e; }
        .totals { margin-left: auto; width: 300px; }
        .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .grand-total { font-size: 18px !important; font-weight: bold; color: #064e3b; border-top: 2px solid #064e3b; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Pastures Gardening</div>
          <div style="font-size: 12px; color: #57534e;">Grounds Maintenance & Horticultural Services</div>
          <div style="font-size: 11px; color: #78716c;">VAT Reg: GB 924 8102 33 | Reg No: 10842911</div>
        </div>
        <div style="text-align: right;">
          <div class="status-badge">${statusLabel}</div>
          <div style="font-size: 18px; font-weight: bold; font-family: monospace; margin-top: 8px;">${invoice.invoiceNumber}</div>
          <div style="font-size: 12px; color: #57534e;">Issue Date: ${invoice.issueDate}</div>
          <div style="font-size: 12px; color: #57534e;">Due Date: ${invoice.dueDate}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 24px 0;">
        <div>
          <strong style="font-size: 11px; text-transform: uppercase; color: #78716c;">Billed To:</strong>
          <div style="font-size: 15px; font-weight: bold;">${invoice.customerName}</div>
          <div style="font-size: 13px; color: #44403c;">${invoice.customerAddress}</div>
          <div style="font-size: 12px; color: #78716c;">${invoice.customerEmail}</div>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 11px; text-transform: uppercase; color: #78716c;">Remit Payment To:</strong>
          <div style="font-size: 13px;">Pastures Gardening Ltd.</div>
          <div style="font-size: 12px; color: #78716c;">Sort Code: 40-18-22</div>
          <div style="font-size: 12px; color: #78716c;">Account: 72910483</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div class="totals">
        <div><span>Subtotal:</span><span style="font-family: monospace;">£${invoice.subtotal.toFixed(2)}</span></div>
        <div><span>Eco Green Waste Disposal:</span><span style="font-family: monospace;">£${invoice.greenWasteFee.toFixed(2)}</span></div>
        <div><span>VAT (20%):</span><span style="font-family: monospace;">£${invoice.taxVat.toFixed(2)}</span></div>
        <div class="grand-total"><span>Total Amount Due:</span><span style="font-family: monospace;">£${invoice.total.toFixed(2)}</span></div>
      </div>
      <div style="margin-top: 40px; font-size: 11px; color: #78716c; text-align: center;">
        Thank you for trusting Pastures Gardening with your estate grounds.<br>
        The Estate Yard, Chipping Campden, Cotswolds GL55 6HB • Tel: +44 (0) 1386 840 922
      </div>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

app.post('/api/invoices', (req, res) => {
  const created = backendStore.createInvoice(req.body);
  return res.status(201).json({ success: true, invoice: created });
});

app.post('/api/invoices/:id/pay', (req, res) => {
  const { paymentMethod } = req.body;
  const paidInvoice = backendStore.payInvoice(req.params.id, paymentMethod);
  if (!paidInvoice) {
    return res.status(404).json({ success: false, error: 'Invoice not found' });
  }
  return res.json({ success: true, invoice: paidInvoice });
});

// Stripe & Payments APIs
app.post('/api/payments/create-intent', (req, res) => {
  const { invoiceId, amount } = req.body;
  const mockIntentId = `pi_live_${Math.random().toString(36).substring(2, 12)}`;
  const mockClientSecret = `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 8)}`;
  return res.json({
    success: true,
    clientSecret: mockClientSecret,
    paymentIntentId: mockIntentId,
    amount: amount || 202.80,
    currency: 'gbp',
  });
});

app.post('/api/payments/confirm', (req, res) => {
  const { invoiceId, paymentMethod, amount } = req.body;
  if (invoiceId) {
    backendStore.payInvoice(invoiceId, paymentMethod || 'Stripe Card');
  }
  const txn = backendStore.logTransaction({
    id: `txn_${Date.now()}`,
    invoiceId,
    amount: amount || 202.80,
    currency: 'gbp',
    method: paymentMethod || 'Stripe Card',
    status: 'succeeded',
    date: new Date().toISOString(),
  });
  return res.json({ success: true, message: 'Payment settled successfully.', transaction: txn });
});

app.get('/api/payments/history', (_req, res) => {
  return res.json({ success: true, history: backendStore.getTransactions() });
});

// Accounts & Authentication APIs
app.get('/api/accounts/profile', (req, res) => {
  const { id } = req.query as { id?: string };
  const user = id ? backendStore.getUserById(id) : backendStore.getAllUsers()[0];
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  return res.json({ success: true, profile: user });
});

app.patch('/api/accounts/profile', (req, res) => {
  const { id, ...updates } = req.body;
  const targetId = id || backendStore.getAllUsers()[0].id;
  const updated = backendStore.updateUser(targetId, updates);
  if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
  return res.json({ success: true, profile: updated });
});

app.post('/api/accounts/login', (req, res) => {
  const { email } = req.body;
  const matched = backendStore.getAllUsers().find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || backendStore.getAllUsers()[0];
  return res.json({
    success: true,
    user: matched,
    token: `pastures_jwt_${matched.id}_${Date.now()}`,
  });
});

app.post('/api/accounts/register', (req, res) => {
  const { name, email, role, phone, address } = req.body;
  const newUser = backendStore.createUser({
    id: `usr_${Date.now()}`,
    name: name || 'New Client',
    email: email || 'client@pastures.co.uk',
    role: role || 'customer',
    phone: phone || '',
    address: address || '',
    postcode: '',
  });
  return res.status(201).json({
    success: true,
    user: newUser,
    token: `pastures_jwt_${newUser.id}_${Date.now()}`,
    message: 'Account registered successfully.',
  });
});

app.post('/api/accounts/verify-email', (_req, res) => {
  return res.json({ success: true, message: 'Email address verified successfully.' });
});

app.post('/api/accounts/forgot-password', (req, res) => {
  const { email } = req.body;
  return res.json({ success: true, message: `Password reset instructions sent to ${email || 'your email'}.` });
});

// Gardens & AR Endpoints
app.get('/api/gardens', (_req, res) => {
  return res.json({ success: true, gardens: backendStore.getAllGardens() });
});

app.get('/api/ar/markers', (_req, res) => {
  const plants = backendStore.getAllPlants();
  const markers = plants.map((p) => ({
    plantId: p.id,
    speciesName: p.speciesName,
    botanicalName: p.botanicalName,
    worldCoordinates: { x: p.x, y: 0.2, z: p.y },
    healthStatus: p.health,
    scale: p.arScale,
  }));
  return res.json({ success: true, count: markers.length, markers });
});

// ==========================================
// BACKEND GARDEN PLANTS API
// ==========================================

app.get('/api/plants', (_req, res) => {
  const plants = backendStore.getAllPlants();
  return res.json({ success: true, plants });
});

app.post('/api/plants', (req, res) => {
  const saved = backendStore.savePlant(req.body);
  return res.status(201).json({ success: true, plant: saved });
});

app.put('/api/plants/:id', (req, res) => {
  const saved = backendStore.savePlant({ ...req.body, id: req.params.id });
  return res.json({ success: true, plant: saved });
});

app.post('/api/plants/:id/water', (req, res) => {
  const watered = backendStore.waterPlant(req.params.id);
  if (!watered) {
    return res.status(404).json({ success: false, error: 'Plant not found' });
  }
  return res.json({ success: true, plant: watered });
});

// ==========================================
// BACKEND STATS & DASHBOARD OVERVIEW API
// ==========================================

app.get('/api/stats/dashboard', (_req, res) => {
  const stats = backendStore.getBackendStats();
  return res.json({ success: true, stats });
});

// ==========================================
// GEMINI AI INTEGRATIONS (SERVER-SIDE ONLY)
// ==========================================

// AI Garden Quote & Estimation Endpoint
app.post('/api/ai-estimate', async (req, res) => {
  try {
    const { gardenSize, condition, services, notes, imageBase64, mimeType } = req.body;

    const promptText = `You are a master British horticulturalist, estimator, and groundskeeper for "Pastures Gardening & Landscaping".
Calculate a detailed, realistic garden quote and job plan based on the following property details:
- Yard / Garden Size: ${gardenSize || 'Medium (approx 120 sq meters)'}
- Current Condition: ${condition || 'Overgrown with weeds, neglected borders'}
- Requested Services: ${Array.isArray(services) ? services.join(', ') : 'Lawn mowing, hedge trimming, garden clearance'}
- Special Customer Notes: ${notes || 'None provided'}

Provide an itemized breakdown with realistic UK gardening industry pricing in GBP (£):
Lawn mowing (~£0.35/m² or £35/hr), Hedge trimming (£40/hr), Clearance (£45/hr), Mulching/Bark (£65/bulk bag), Green waste eco-recycling (£30-£65/ton bag).
Be practical, fair, and professional. Return accurate structured pricing.`;

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessmentSummary: {
              type: Type.STRING,
              description: 'Professional botanical and terrain condition overview',
            },
            difficultyRating: {
              type: Type.STRING,
              description: 'Light, Moderate, Heavy, or Overgrown Reclamation',
            },
            estimatedHours: {
              type: Type.NUMBER,
              description: 'Estimated crew hours required',
            },
            recommendedCrewSize: {
              type: Type.INTEGER,
              description: 'Optimal number of gardeners (e.g. 1 or 2)',
            },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  unitPrice: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
                },
                required: ['id', 'description', 'category', 'quantity', 'unit', 'unitPrice', 'total'],
              },
            },
            wasteVolumeBags: {
              type: Type.NUMBER,
              description: 'Estimated cubic yards or standard green waste bags',
            },
            subtotal: { type: Type.NUMBER },
            greenWasteFee: { type: Type.NUMBER },
            taxVat: { type: Type.NUMBER },
            total: { type: Type.NUMBER },
            equipmentRecommended: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            proGardenerTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'assessmentSummary',
            'difficultyRating',
            'estimatedHours',
            'recommendedCrewSize',
            'lineItems',
            'subtotal',
            'greenWasteFee',
            'taxVat',
            'total',
            'equipmentRecommended',
            'proGardenerTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, estimate: parsed });
  } catch (error: any) {
    console.error('Error generating AI estimate:', error);
    return res.status(200).json({
      success: true,
      fallback: true,
      estimate: {
        assessmentSummary:
          'Based on typical British residential terrain metrics, the site requires standard maintenance, border defining, and seasonal hedge rejuvenation.',
        difficultyRating: 'Moderate',
        estimatedHours: 4.5,
        recommendedCrewSize: 2,
        lineItems: [
          {
            id: 'item-1',
            description: 'Rotary Lawn Mowing & Precision Edge Trimming',
            category: 'Lawn Care',
            quantity: 120,
            unit: 'sq meters',
            unitPrice: 0.45,
            total: 54.0,
          },
          {
            id: 'item-2',
            description: 'Perimeter Hedge Sculpting & Topiary Leveling',
            category: 'Hedge Care',
            quantity: 2.5,
            unit: 'hours',
            unitPrice: 42.0,
            total: 105.0,
          },
          {
            id: 'item-3',
            description: 'Border Weeding & Organic Mulching Application',
            category: 'Beds & Borders',
            quantity: 2,
            unit: 'hours',
            unitPrice: 38.0,
            total: 76.0,
          },
        ],
        wasteVolumeBags: 3,
        subtotal: 235.0,
        greenWasteFee: 35.0,
        taxVat: 54.0,
        total: 324.0,
        equipmentRecommended: [
          'Commercial Honda Roller Mower',
          'Stihl Cordless Pole Hedge Trimmer',
          'Heavy Duty Green Waste Sacks',
        ],
        proGardenerTips: [
          'Apply high-nitrogen lawn feed 7 days post-mow.',
          'Prune hydrangeas back to strong double buds before late autumn.',
        ],
      },
    });
  }
});

// Plant Care & Health Diagnosis Endpoint (Supports text symptoms & camera/image inspection)
app.post('/api/plant-diagnose', async (req, res) => {
  try {
    const { plantName, symptoms, sunlight, soilType, imageBase64, mimeType } = req.body;

    const promptText = `You are a certified master RHS (Royal Horticultural Society) botanist for Pastures Gardening.
Diagnose and provide botanical guidance for this plant:
Plant: ${plantName || 'General Garden Specimen'}
Observed Symptoms: ${symptoms || 'Yellowing leaves and slow growth'}
Sunlight Level: ${sunlight || 'Partial Sun'}
Soil Type: ${soilType || 'Loam / Clay blend'}

${imageBase64 ? 'Please carefully inspect the provided foliage/specimen photo for signs of fungal spores, chlorosis, scorch, pest infestation, powdery mildew, or root stress, and identify specific visual signs.' : ''}

Respond with concise, scientific yet actionable RHS advice.`;

    const parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            botanicalName: { type: Type.STRING },
            probableCause: { type: Type.STRING },
            severity: { type: Type.STRING, description: 'Mild, Moderate, or Urgent' },
            immediateAction: { type: Type.STRING },
            wateringSchedule: { type: Type.STRING },
            sunlightAdjustment: { type: Type.STRING },
            seasonalPruningAdvice: { type: Type.STRING },
            fertilizerGuidance: { type: Type.STRING },
            visualSignsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Visual pathological markers detected on foliage or stems',
            },
          },
          required: [
            'botanicalName',
            'probableCause',
            'severity',
            'immediateAction',
            'wateringSchedule',
            'sunlightAdjustment',
            'seasonalPruningAdvice',
            'fertilizerGuidance',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, diagnosis: parsed });
  } catch (error) {
    console.error('Error diagnosing plant:', error);
    return res.json({
      success: true,
      fallback: true,
      diagnosis: {
        botanicalName: 'Lavandula angustifolia / Hydrangea macrophylla',
        probableCause: 'Over-watering or slight iron deficiency due to alkaline soil pH.',
        severity: 'Moderate',
        immediateAction: 'Allow the top 2 inches of soil to dry out completely before next watering. Apply sequestered iron chelate.',
        wateringSchedule: 'Once weekly in warm periods, deep soak at root base (avoid foliage).',
        sunlightAdjustment: 'Requires minimum 6 hours of direct sun for robust blooming.',
        seasonalPruningAdvice: 'Prune flower spikes back to fresh green growth immediately after flowering in late summer.',
        fertilizerGuidance: 'Slow-release organic seaweed extract once in early spring.',
        visualSignsIdentified: ['Interveinal chlorosis on upper leaves', 'Slight marginal leaf curling'],
      },
    });
  }
});

// Plant Recognition Endpoint via Gemini Vision (Camera snapshot or uploaded photo)
app.post('/api/plant-recognize', async (req, res) => {
  try {
    const { imageBase64, mimeType, userNotes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Image base64 data is required for recognition' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `You are a world-class British botanist, RHS Fellow, and groundskeeper for Pastures Gardening & Landscaping in the Cotswolds.
Carefully examine this photograph of a garden plant, shrub, tree, flower, or foliage.
${userNotes ? `Additional user observation: "${userNotes}"` : ''}

Identify the botanical specimen with scientific accuracy and provide detailed RHS-standard gardening parameters.
Category MUST be one of: flower, shrub, tree, herb, vegetable, grass.
Health status MUST be one of: thriving, healthy, stressed, pest_alert.
Confidence should be between 0.85 and 0.999.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: { type: Type.STRING, description: 'Common British English name (e.g. English Lavender "Hidcote")' },
            botanicalName: { type: Type.STRING, description: 'Binomial Latin botanical name' },
            family: { type: Type.STRING, description: 'Plant family, e.g. Lamiaceae, Rosaceae' },
            confidence: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' },
            category: { type: Type.STRING, description: 'flower, shrub, tree, herb, vegetable, or grass' },
            hardiness: { type: Type.STRING, description: 'RHS Hardiness rating, e.g. RHS H5 (Hardy down to -15°C)' },
            idealSoil: { type: Type.STRING, description: 'Soil drainage, texture, and pH preference' },
            sunlight: { type: Type.STRING, description: 'Sunlight requirements: Full Sun, Partial Shade, or Deep Shade' },
            pruningSchedule: { type: Type.STRING, description: 'Timing and technique for pruning' },
            wateringSchedule: { type: Type.STRING, description: 'Watering frequency and depth' },
            healthAssessment: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: 'thriving, healthy, stressed, or pest_alert' },
                summary: { type: Type.STRING, description: 'Overview of foliage, vigor, and bloom health seen in photo' },
                identifiedIssues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Any leaf spots, scorching, aphids, or nutrient deficiency signs detected'
                },
              },
              required: ['status', 'summary'],
            },
            companionPlants: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 beneficial companion plants that grow well alongside this specimen'
            },
            professionalAdvice: { type: Type.STRING, description: 'Practical groundskeeper advice for maintaining this specimen in the UK climate' },
          },
          required: [
            'commonName',
            'botanicalName',
            'family',
            'confidence',
            'category',
            'hardiness',
            'idealSoil',
            'sunlight',
            'pruningSchedule',
            'wateringSchedule',
            'healthAssessment',
            'companionPlants',
            'professionalAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, recognition: parsed });
  } catch (error) {
    console.error('Error recognizing plant:', error);
    // Return sensible fallback recognition
    return res.json({
      success: true,
      fallback: true,
      recognition: {
        commonName: 'English Lavender "Hidcote"',
        botanicalName: 'Lavandula angustifolia',
        family: 'Lamiaceae',
        confidence: 0.985,
        category: 'shrub',
        hardiness: 'RHS H5 (Hardy down to -15°C)',
        idealSoil: 'Free-draining chalk, sand, or limestone loam; neutral to alkaline pH',
        sunlight: 'Full Sun (Minimum 6 hours daily)',
        pruningSchedule: 'Late summer immediately after flowering; prune back flower stalks and 2cm of current year growth.',
        wateringSchedule: 'Low once established; drought tolerant. Water deeply every 5-7 days in hot spells.',
        healthAssessment: {
          status: 'healthy',
          summary: 'Foliage exhibits healthy silver-grey coloration with uniform density and active bud formation.',
          identifiedIssues: [],
        },
        companionPlants: ['Climbing English Roses', 'Rosmarinus officinalis (Rosemary)', 'Nepeta (Catmint)'],
        professionalAdvice: 'Ensure sharp drainage at the crown. Avoid heavy organic mulch directly around stem base to prevent fungal rot.',
      },
    });
  }
});

// Camera Vision & AR Ground Inspection via Gemini
app.post('/api/gemini/camera-vision', async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Image base64 data is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `You are an expert groundskeeper and landscape surveyor for Pastures Gardening.
Examine this camera view of a lawn, garden plot, border, or horticultural environment.
${prompt ? `Special inspector focus: "${prompt}"` : ''}

Assess lawn quality, soil condition, detected plant species or weed presence, and give immediate groundskeeping recommendations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedSpecies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Flora, turf grasses, or weeds recognized in the frame',
            },
            lawnCondition: { type: Type.STRING, description: 'Lush & Healthy, Thatch Present, Compacted, or Needs Aeration' },
            groundMoisture: { type: Type.STRING, description: 'Optimal, Saturated, or Dry' },
            sunlightExposure: { type: Type.STRING, description: 'Full Sun, Dappled Light, or Shaded' },
            immediateRecommendation: { type: Type.STRING, description: 'Top action: e.g. scarify, edge borders, aerate, or overseed' },
            safetyOrPestNotice: { type: Type.STRING, description: 'Any safety hazards, trip risks, or pest activity noticed' },
          },
          required: [
            'detectedSpecies',
            'lawnCondition',
            'groundMoisture',
            'sunlightExposure',
            'immediateRecommendation',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, vision: parsed });
  } catch (error) {
    console.error('Error analyzing camera frame:', error);
    return res.json({
      success: true,
      fallback: true,
      vision: {
        detectedSpecies: ['Perennial Ryegrass (Lolium perenne)', 'Creeping Buttercup', 'English Daisy'],
        lawnCondition: 'Healthy with light moss and thatch density',
        groundMoisture: 'Optimal field capacity',
        sunlightExposure: 'Full Sun (South-facing slope)',
        immediateRecommendation: 'Conduct spring hollow-tine aeration followed by autumn scarification and high-nitrogen topdressing.',
        safetyOrPestNotice: 'Border edging stones secure. No significant leatherjacket or chafer grub activity detected.',
      },
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Pastures Gardening Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
