import {
  Booking,
  QuoteEstimate,
  Invoice,
  GardenPlant,
  PlantDiagnosisResult,
  PlantRecognitionResult,
  CameraVisionResult,
  WeatherCareAlertsData,
} from './types';
import { ClientRequest, BackendStats } from '../server/types';

export const api = {
  // Client Requests
  async getClientRequests(filters?: { status?: string; type?: string; priority?: string; query?: string }): Promise<ClientRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.query) params.append('query', filters.query);

    const res = await fetch(`/api/client-requests?${params.toString()}`);
    const data = await res.json();
    return data.requests || [];
  },

  async createClientRequest(req: Partial<ClientRequest>): Promise<ClientRequest> {
    const res = await fetch('/api/client-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    return data.request;
  },

  async updateClientRequest(id: string, updates: Partial<ClientRequest>): Promise<ClientRequest> {
    const res = await fetch(`/api/client-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.request;
  },

  async deleteClientRequest(id: string): Promise<boolean> {
    const res = await fetch(`/api/client-requests/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async dispatchRequestAction(
    id: string,
    action: 'assign_crew' | 'convert_to_booking' | 'mark_completed',
    params?: { staffName?: string; scheduledDate?: string }
  ): Promise<{ request: ClientRequest; booking?: Booking }> {
    const res = await fetch(`/api/client-requests/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...params }),
    });
    return await res.json();
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    return data.bookings || [];
  },

  async createBooking(booking: Booking): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    return data.booking;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.booking;
  },

  async toggleChecklist(id: string, task: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    const data = await res.json();
    return data.booking;
  },

  async rescheduleBooking(id: string, newDate: string, newTimeSlot: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newTimeSlot }),
    });
    const data = await res.json();
    return data.booking;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}/cancel`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.booking;
  },

  async submitReview(id: string, rating: number, reviewNotes: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/bookings/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, reviewNotes }),
    });
    return await res.json();
  },

  // Quotes
  async getQuotes(): Promise<QuoteEstimate[]> {
    const res = await fetch('/api/quotes');
    const data = await res.json();
    return data.quotes || [];
  },

  async createQuote(quote: QuoteEstimate): Promise<QuoteEstimate> {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    const data = await res.json();
    return data.quote;
  },

  async updateQuote(quoteId: string, updates: Partial<QuoteEstimate>): Promise<QuoteEstimate> {
    const res = await fetch(`/api/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.quote;
  },

  async convertQuoteToInvoice(quoteId: string): Promise<Invoice> {
    const res = await fetch(`/api/quotes/${quoteId}/convert-to-invoice`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.invoice;
  },

  // Invoices & Payments
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch('/api/invoices');
    const data = await res.json();
    return data.invoices || [];
  },

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    const data = await res.json();
    return data.invoice;
  },

  async payInvoice(invoiceId: string, paymentMethod: string = 'stripe_card'): Promise<Invoice> {
    const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });
    const data = await res.json();
    return data.invoice;
  },

  // Plants
  async getPlants(): Promise<GardenPlant[]> {
    const res = await fetch('/api/plants');
    const data = await res.json();
    return data.plants || [];
  },

  async savePlant(plant: GardenPlant): Promise<GardenPlant> {
    const res = await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plant),
    });
    const data = await res.json();
    return data.plant;
  },

  async waterPlant(id: string): Promise<GardenPlant> {
    const res = await fetch(`/api/plants/${id}/water`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.plant;
  },

  // Dashboard Overview Stats
  async getStats(): Promise<BackendStats> {
    const res = await fetch('/api/stats/dashboard');
    const data = await res.json();
    return data.stats;
  },

  // Stripe Payments
  async createPaymentIntent(invoiceId: string, amount?: number): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const res = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, amount }),
    });
    return await res.json();
  },

  async confirmPayment(invoiceId: string, paymentMethod?: string, amount?: number): Promise<any> {
    const res = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, paymentMethod, amount }),
    });
    return await res.json();
  },

  async getPaymentHistory(): Promise<any[]> {
    const res = await fetch('/api/payments/history');
    const data = await res.json();
    return data.history || [];
  },

  // Gardens & AR
  async getGardens(): Promise<any[]> {
    const res = await fetch('/api/gardens');
    const data = await res.json();
    return data.gardens || [];
  },

  async getArMarkers(): Promise<any[]> {
    const res = await fetch('/api/ar/markers');
    const data = await res.json();
    return data.markers || [];
  },

  // Accounts & Profile
  async getProfile(id?: string): Promise<any> {
    const query = id ? `?id=${encodeURIComponent(id)}` : '';
    const res = await fetch(`/api/accounts/profile${query}`);
    const data = await res.json();
    return data.profile;
  },

  async updateProfile(updates: any): Promise<any> {
    const res = await fetch('/api/accounts/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.profile;
  },

  async login(email: string): Promise<any> {
    const res = await fetch('/api/accounts/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },

  async register(userData: any): Promise<any> {
    const res = await fetch('/api/accounts/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  },

  // Document URLs for download/viewing
  getInvoicePdfUrl(invoiceId: string): string {
    return `/api/invoices/${encodeURIComponent(invoiceId)}/pdf`;
  },

  getQuotePdfUrl(quoteId: string): string {
    return `/api/quotes/${encodeURIComponent(quoteId)}/pdf`;
  },

  // Gemini AI Camera & Vision Methods
  async recognizePlant(imageBase64: string, mimeType = 'image/jpeg', userNotes?: string): Promise<PlantRecognitionResult> {
    const res = await fetch('/api/plant-recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, userNotes }),
    });
    const data = await res.json();
    if (!data.success && data.error) {
      throw new Error(data.error);
    }
    return data.recognition;
  },

  async diagnosePlant(params: {
    plantName: string;
    symptoms: string;
    sunlight?: string;
    soilType?: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<PlantDiagnosisResult> {
    const res = await fetch('/api/plant-diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data.diagnosis;
  },

  async analyzeCameraVision(imageBase64: string, mimeType = 'image/jpeg', prompt?: string): Promise<CameraVisionResult> {
    const res = await fetch('/api/gemini/camera-vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, prompt }),
    });
    const data = await res.json();
    return data.vision;
  },

  // Weather & Localized Care Alerts
  async getWeatherCareAlerts(params?: {
    lat?: number;
    lon?: number;
    locationName?: string;
    plants?: string[];
  }): Promise<WeatherCareAlertsData> {
    const urlParams = new URLSearchParams();
    if (params?.lat !== undefined) urlParams.append('lat', params.lat.toString());
    if (params?.lon !== undefined) urlParams.append('lon', params.lon.toString());
    if (params?.locationName) urlParams.append('locationName', params.locationName);
    if (params?.plants && params.plants.length > 0) urlParams.append('plants', params.plants.join(','));

    const res = await fetch(`/api/weather-care-alerts?${urlParams.toString()}`);
    const data = await res.json();
    if (!data.success && data.error) {
      throw new Error(data.error);
    }
    return {
      weather: data.weather,
      alerts: data.alerts,
      groundskeepingWindow: data.groundskeepingWindow,
    };
  },
};
