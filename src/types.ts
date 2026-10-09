export type UserRole = 'customer' | 'gardener' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  postcode: string;
  notes?: string;
  gardenSpecs?: {
    lawnAreaM2: number;
    hasHedges: boolean;
    hasTrees: boolean;
    petSafeOnly: boolean;
    organicMulch: boolean;
    gateAccessCode?: string;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Lawn' | 'Hedges' | 'Clearance' | 'Planting' | 'Landscaping' | 'Irrigation';
  description: string;
  basePrice: number;
  unit: string;
  estimatedMinutes: number;
  popular?: boolean;
  features: string[];
}

export interface Booking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  serviceIds: string[];
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'full_day';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  totalEstimate: number;
  assignedGardener?: string;
  checklist?: { [task: string]: boolean };
  createdAt: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuoteEstimate {
  id: string;
  quoteRef: string;
  customerName: string;
  customerEmail: string;
  propertyAddress: string;
  gardenSizeDesc: string;
  assessmentSummary: string;
  difficultyRating: string;
  estimatedHours: number;
  recommendedCrewSize: number;
  lineItems: QuoteLineItem[];
  wasteVolumeBags: number;
  subtotal: number;
  greenWasteFee: number;
  taxVat: number;
  total: number;
  equipmentRecommended: string[];
  proGardenerTips: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'invoiced';
  createdAt: string;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  greenWasteFee: number;
  taxVat: number;
  total: number;
  paymentStatus: 'unpaid' | 'paid' | 'deposit_paid';
  stripePaymentId?: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface GardenPlant {
  id: string;
  x: number; // grid column 0-11
  y: number; // grid row 0-7
  speciesName: string;
  botanicalName: string;
  category: 'flower' | 'shrub' | 'tree' | 'herb' | 'vegetable' | 'grass';
  health: 'thriving' | 'good' | 'needs_water' | 'pest_alert' | 'prune_due';
  sunlight: 'full_sun' | 'partial_shade' | 'deep_shade';
  waterCadenceDays: number;
  lastWatered: string;
  plantedDate?: string;
  notes: string;
  arScale: number; // 0.8 - 1.5
  bloomSeason: string;
}

export interface PlantDiagnosisResult {
  botanicalName: string;
  probableCause: string;
  severity: string;
  immediateAction: string;
  wateringSchedule: string;
  sunlightAdjustment: string;
  seasonalPruningAdvice: string;
  fertilizerGuidance: string;
  visualSignsIdentified?: string[];
}

export interface PlantRecognitionResult {
  commonName: string;
  botanicalName: string;
  family: string;
  confidence: number;
  hardiness: string;
  idealSoil: string;
  sunlight: string;
  pruningSchedule: string;
  wateringSchedule: string;
  category: 'flower' | 'shrub' | 'tree' | 'herb' | 'vegetable' | 'grass';
  healthAssessment: {
    status: 'thriving' | 'healthy' | 'stressed' | 'pest_alert';
    summary: string;
    identifiedIssues?: string[];
  };
  companionPlants: string[];
  professionalAdvice: string;
}

export interface CameraVisionResult {
  detectedSpecies: string[];
  lawnCondition: string;
  groundMoisture: string;
  sunlightExposure: string;
  immediateRecommendation: string;
  safetyOrPestNotice?: string;
}
