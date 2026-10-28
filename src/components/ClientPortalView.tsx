import React, { useState } from 'react';
import {
  UserProfile,
  Booking,
  Invoice,
  QuoteEstimate,
  GardenPlant,
  ServiceItem,
} from '../types';
import { ClientRequest } from '../../server/types';
import { PasturesLogo } from './PasturesLogo';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sprout,
  Plus,
  ArrowRight,
  ShieldCheck,
  Send,
  FileText,
  DollarSign,
  Download,
  Eye,
  Check,
  X,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Info,
  Lock,
} from 'lucide-react';

interface ClientPortalViewProps {
  currentUser: UserProfile;
  bookings: Booking[];
  invoices: Invoice[];
  quotes: QuoteEstimate[];
  plants: GardenPlant[];
  services: ServiceItem[];
  clientRequests: ClientRequest[];
  onBookService: () => void;
  onRequestAssistance: () => void;
  onPayInvoice: (invoice: Invoice) => void;
  onViewQuote: (quote: QuoteEstimate) => void;
  onAcceptQuote?: (quoteId: string) => void;
  onOpenBookingDetails: (booking: Booking) => void;
  onOpenPlantDetails: (plant: GardenPlant) => void;
  onOpenMessages: () => void;
  onSwitchToProviderPortal: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  currentUser,
  bookings,
  invoices,
  quotes,
  plants,
  services,
  clientRequests,
  onBookService,
  onRequestAssistance,
  onPayInvoice,
  onViewQuote,
  onAcceptQuote,
  onOpenBookingDetails,
  onOpenPlantDetails,
  onOpenMessages,
  onSwitchToProviderPortal,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'visits' | 'quotes' | 'invoices' | 'garden' | 'tickets'>('overview');
  const [newRequestText, setNewRequestText] = useState('');
  const [newRequestCategory, setNewRequestCategory] = useState<'Emergency' | 'Maintenance' | 'Seasonal' | 'Renovation'>('Maintenance');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Client-specific bookings and records
  const myBookings = bookings.filter(
    (b) => b.customerEmail === currentUser.email || b.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) || true
  );

  const nextUpcomingVisit = myBookings.find(
    (b) => b.status === 'confirmed' || b.status === 'in_progress' || b.status === 'pending'
  );

  const unpaidInvoices = invoices.filter((i) => i.paymentStatus !== 'paid');
  const pendingQuotes = quotes.filter((q) => q.status === 'pending' || q.status === 'draft');
  const myRequests = clientRequests;

  const handleQuickRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestText.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setNewRequestText('');
      setRequestSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Estate Header */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block">
              <PasturesLogo variant="mark-only" size="lg" theme="dark" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Private Client Portal</span>
                <span className="text-stone-300">·</span>
                <span className="text-stone-500">{currentUser.address}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                {currentUser.name}’s Estate
              </h1>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                <span>Lawn: {currentUser.gardenSpecs?.lawnAreaM2 || 180} m²</span>
                <span>·</span>
                <span>Gate Code: {currentUser.gardenSpecs?.gateAccessCode || '4821'}</span>
                <span>·</span>
                <span>Account: #{currentUser.id.replace('usr-', '').toUpperCase()}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onBookService}
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Garden Service</span>
            </button>
            <button
              onClick={onRequestAssistance}
              className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>New Work Request</span>
            </button>
            <button
              onClick={onOpenMessages}
              className="px-3.5 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Chat with Head Gardener"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
              <span>Groundsman</span>
            </button>
            <button
              onClick={onSwitchToProviderPortal}
              className="px-3 py-2 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Staff Login for Service Provider & Contractor Hub"
            >
              <Lock className="w-3 h-3 text-emerald-800" />
              <span>Contractor Staff Login →</span>
            </button>
          </div>
        </div>

        {/* Section Segmented Navigation Tabs */}
        <div className="pt-4 flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'overview'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Estate Overview
          </button>
          <button
            onClick={() => setActiveSection('visits')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'visits'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Scheduled Visits</span>
            <span className="px-1.5 py-0.2 bg-stone-200 text-stone-800 text-[10px] rounded-full">
              {myBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSection('quotes')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'quotes'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Quotes & Proposals</span>
            {pendingQuotes.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full font-bold">
                {pendingQuotes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('invoices')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'invoices'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Invoices & Payments</span>
            {unpaidInvoices.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] rounded-full font-bold">
                £{unpaidInvoices.reduce((a, b) => a + b.total, 0).toFixed(0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('garden')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'garden'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Garden Passport ({plants.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('tickets')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'tickets'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>Work Requests ({myRequests.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Next Scheduled Visit</span>
              <div className="text-lg font-bold text-stone-900 mt-1 font-serif">
                {nextUpcomingVisit ? nextUpcomingVisit.date : 'No pending visit'}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                {nextUpcomingVisit ? `${nextUpcomingVisit.timeSlot} slot` : 'Book a slot anytime'}
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Estate Plant Health</span>
              <div className="text-lg font-bold text-emerald-900 mt-1 font-serif flex items-center gap-1.5">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <span>{plants.filter((p) => p.health === 'thriving').length} / {plants.length} Thriving</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">RHS Certified Botanical Log</p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Pending Quotes</span>
              <div className="text-lg font-bold text-stone-900 mt-1 font-serif">
                {pendingQuotes.length} Active {pendingQuotes.length === 1 ? 'Proposal' : 'Proposals'}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {pendingQuotes.length > 0 ? 'Awaiting your 1-click review' : 'All proposals up to date'}
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Open Ledger Balance</span>
              <div className="text-lg font-bold text-stone-900 mt-1 font-serif">
                £{unpaidInvoices.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                {unpaidInvoices.length} outstanding invoice
              </p>
            </div>
          </div>

          {/* Next Visit Spotlight Card */}
          {nextUpcomingVisit && (
            <div className="bg-linear-to-r from-emerald-950 to-stone-900 rounded-2xl p-6 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/60 border border-emerald-700/60 flex items-center justify-center text-emerald-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                      Confirmed Grounds Service
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                      Ref: {nextUpcomingVisit.bookingRef}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800 text-emerald-200 border border-emerald-700">
                    {nextUpcomingVisit.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => onOpenBookingDetails(nextUpcomingVisit)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-stone-400">Date & Window:</span>
                  <div className="font-semibold text-white mt-0.5">
                    {nextUpcomingVisit.date} ({nextUpcomingVisit.timeSlot})
                  </div>
                </div>
                <div>
                  <span className="text-stone-400">Lead Groundsman:</span>
                  <div className="font-semibold text-white mt-0.5">
                    {nextUpcomingVisit.assignedGardener || 'Callum Brooks (Senior Groundsman)'}
                  </div>
                </div>
                <div>
                  <span className="text-stone-400">Service Estimate:</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    £{nextUpcomingVisit.totalEstimate.toFixed(2)}
                  </div>
                </div>
              </div>

              {nextUpcomingVisit.checklist && (
                <div className="mt-4 pt-4 border-t border-emerald-900/60">
                  <span className="text-[11px] font-semibold text-stone-300">Groundsman On-Site Checklist:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(nextUpcomingVisit.checklist).map(([task, done]) => (
                      <span
                        key={task}
                        className={`px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1.5 ${
                          done ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800/80 text-stone-300'
                        }`}
                      >
                        {done ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-stone-400" />}
                        <span>{task}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dual Column: Pending Proposals & Fast Request Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column A: Active Quotes & Action Required */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Proposals & Estimates
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSection('quotes')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                >
                  View All ({quotes.length}) →
                </button>
              </div>

              {quotes.length > 0 ? (
                <div className="space-y-3">
                  {quotes.slice(0, 3).map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{q.quoteRef}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              q.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {q.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {q.lineItems?.length || 2} service items · Created {q.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-stone-900">
                          £{q.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => onViewQuote(q)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No active quotes for your estate.
                </p>
              )}
            </div>

            {/* Column B: Direct Request to Pastures Operations */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-800" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Direct Request to Grounds Crew
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-800 font-medium">Avg reply: 15 min</span>
              </div>

              <form onSubmit={handleQuickRequest} className="space-y-3">
                <div className="flex items-center gap-2">
                  {(['Maintenance', 'Emergency', 'Seasonal', 'Renovation'] as const).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewRequestCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                        newRequestCategory === cat
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={newRequestText}
                  onChange={(e) => setNewRequestText(e.target.value)}
                  placeholder="E.g., High winds dropped a hornbeam branch across the patio. Please clear during next Friday visit..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-800 placeholder-stone-400 focus:bg-white focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none resize-none"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Gate code #{currentUser.gardenSpecs?.gateAccessCode || '4821'} will be attached.
                  </span>
                  <button
                    type="submit"
                    disabled={!newRequestText.trim()}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Dispatch Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {requestSubmitted && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your request has been logged. Callum Brooks has been notified!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SCHEDULED VISITS */}
      {activeSection === 'visits' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Your Maintenance & Landscaping Calendar
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Full history of scheduled, ongoing, and completed estate care visits.
              </p>
            </div>
            <button
              onClick={onBookService}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Next Visit</span>
            </button>
          </div>

          <div className="space-y-4">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-stone-900">{b.bookingRef}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : b.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                          : b.status === 'completed'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    Date: {b.date} · Window: {b.timeSlot}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-3">
                    <span>Assigned: {b.assignedGardener || 'Callum Brooks'}</span>
                    <span>·</span>
                    <span>Services: {b.serviceIds.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-base font-bold text-stone-900">
                    £{b.totalEstimate.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onOpenBookingDetails(b)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: QUOTES & PROPOSALS */}
      {activeSection === 'quotes' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Itemized Quotes & Proposals
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Detailed breakdowns generated by Pastures certified horticultural estimators.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900">{q.quoteRef}</span>
                    <span className="text-stone-300 mx-2">·</span>
                    <span className="text-xs text-stone-500">Issued: {q.createdAt}</span>
                    <span className="text-stone-300 mx-2">·</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        q.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {q.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-stone-900">
                    £{q.total.toFixed(2)}
                  </div>
                </div>

                {/* Line Items Preview */}
                <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                  {q.lineItems?.map((li) => (
                    <div key={li.id} className="flex justify-between text-stone-600">
                      <span>{li.description} ({li.quantity} {li.unit})</span>
                      <span className="font-medium text-stone-900">£{li.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    Valid for 30 calendar days from issue.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewQuote(q)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                    {q.status !== 'approved' && onAcceptQuote && (
                      <button
                        onClick={() => onAcceptQuote(q.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Quote</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: INVOICES & PAYMENTS */}
      {activeSection === 'invoices' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Billing Ledger & Tax Receipts
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Download official PDF invoices or pay online via card.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {inv.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAYMENT DUE'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Issued: {inv.issueDate} · Due: {inv.dueDate}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-stone-900">
                    £{inv.total.toFixed(2)}
                  </span>
                  {inv.paymentStatus !== 'paid' ? (
                    <button
                      onClick={() => onPayInvoice(inv)}
                      className="px-4 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settled</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: GARDEN PASSPORT */}
      {activeSection === 'garden' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Estate Botanical Inventory ({plants.length} Cultivars)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Monitored species, pruning calendars, and watering requirements.
              </p>
            </div>
            {plants.length > 0 && (
              <button
                onClick={() => onOpenPlantDetails(plants[0])}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs whitespace-nowrap"
              >
                <span>Launch Interactive 2D, 3D & 360° Map</span>
                <span>→</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map((p) => (
              <div
                key={p.id}
                onClick={() => onOpenPlantDetails(p)}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                    {p.speciesName}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      p.health === 'thriving'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.health.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 italic">{p.botanicalName}</p>
                <div className="text-[11px] text-stone-600 flex items-center gap-3 pt-1">
                  <span>Sun: {p.sunlight.replace('_', ' ')}</span>
                  <span>·</span>
                  <span>Bloom: {p.bloomSeason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: WORK REQUESTS / TICKETS */}
      {activeSection === 'tickets' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Dispatched Maintenance Requests ({myRequests.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time tracking of specialized tasks submitted to the grounds crew.
              </p>
            </div>
            <button
              onClick={onRequestAssistance}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </div>

          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900">{req.referenceNo}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        req.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : req.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-medium">
                      {req.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 mt-1">{req.title}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{req.description}</p>
                </div>

                <div className="text-right text-xs text-stone-500">
                  <div>Assigned: {req.assignedStaff || 'Pending dispatch'}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">Submitted: {req.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
