export type RequestType =
  | 'booking'
  | 'quote_estimation'
  | 'emergency_clearance'
  | 'planting_consultation'
  | 'turf_installation'
  | 'general_inquiry';

export type RequestStatus =
  | 'new'
  | 'under_review'
  | 'quote_sent'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type RequestPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ClientRequest {
  id: string;
  referenceNo: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyAddress: string;
  postcode: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  assignedStaff?: string;
  requestedDate?: string;
  preferredTimeSlot?: 'morning' | 'afternoon' | 'full_day';
  estimatedValue?: number;
  internalNotes?: string[];
  yardDimensions?: string;
  servicesRequested?: string[];
  associatedBookingId?: string;
  associatedQuoteId?: string;
  associatedInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendStats {
  totalRequests: number;
  newRequestsCount: number;
  underReviewCount: number;
  scheduledCount: number;
  completedCount: number;
  totalRevenueGBP: number;
  unpaidRevenueGBP: number;
  activeFieldCrews: number;
}
