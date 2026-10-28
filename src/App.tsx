import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  ServiceItem,
  Booking,
  QuoteEstimate,
  Invoice,
  GardenPlant,
  ProviderStaffSession,
  StaffAccount,
} from './types';
import { ClientRequest, BackendStats } from '../server/types';
import {
  INITIAL_SERVICES,
  INITIAL_USERS,
  INITIAL_BOOKINGS,
  INITIAL_QUOTES,
  INITIAL_INVOICES,
  INITIAL_PLANTS,
  STAFF_ACCOUNTS,
} from './data/mockData';
import { Navigation, NavTab } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { BookingCalendarView } from './components/BookingCalendarView';
import { GardenTrackingArView } from './components/GardenTrackingArView';
import { AiQuoteInvoiceView } from './components/AiQuoteInvoiceView';
import { ClientRequestsView } from './components/ClientRequestsView';
import { StripePaymentModal } from './components/StripePaymentModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { MessagesView } from './components/MessagesView';
import { AiAssistantView } from './components/AiAssistantView';
import { GardensView } from './components/GardensView';
import { ProfileView } from './components/ProfileView';
import { SplashScreen } from './components/SplashScreen';
import { ClientPortalView } from './components/ClientPortalView';
import { ServiceProviderPortalView } from './components/ServiceProviderPortalView';
import { ProviderAuthModal } from './components/ProviderAuthModal';
import { PortalGuideModal } from './components/PortalGuideModal';
import { UnchangingLaneStudioView } from './components/UnchangingLaneStudioView';
import { api } from './api';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [showSplash, setShowSplash] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pastures_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Services catalog
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  // Backend Managed Entities
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [quotes, setQuotes] = useState<QuoteEstimate[]>(INITIAL_QUOTES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [plants, setPlants] = useState<GardenPlant[]>(INITIAL_PLANTS);

  // Modal & Detail States
  const [activeServiceToBook, setActiveServiceToBook] = useState<string | undefined>(undefined);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | undefined>(undefined);
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Provider Staff Authentication & Security Session State
  const [providerSession, setProviderSession] = useState<ProviderStaffSession | null>(() => {
    try {
      const stored = localStorage.getItem('pastures_provider_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isProviderAuthModalOpen, setIsProviderAuthModalOpen] = useState(false);
  const [isPortalGuideOpen, setIsPortalGuideOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthenticateProvider = (staff: StaffAccount, session: ProviderStaffSession) => {
    setProviderSession(session);
    try {
      localStorage.setItem('pastures_provider_session', JSON.stringify(session));
    } catch (err) {
      console.warn(err);
    }

    const matchedUser = INITIAL_USERS.find((u) => u.id === staff.id) || {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      address: 'Pastures Depot 3, Meadow Way, Cirencester',
      postcode: 'GL7 1AA',
    };
    setCurrentUser(matchedUser);
    setCurrentTab('provider_portal');
    showToast(`Security verified: Welcome ${staff.name} (${staff.badgeNumber})`);
  };

  const handleLockProviderSession = () => {
    setProviderSession(null);
    try {
      localStorage.removeItem('pastures_provider_session');
    } catch (err) {
      console.warn(err);
    }
    const customerUser = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
    setCurrentUser(customerUser);
    setCurrentTab('client_portal');
    showToast('Provider session locked. Returned to Client Portal.');
  };

  const handleOpenProviderPortal = () => {
    if (!providerSession) {
      setIsProviderAuthModalOpen(true);
    } else {
      if (currentUser.role === 'customer') {
        const staffUser = INITIAL_USERS.find((u) => u.id === providerSession.staffId) || INITIAL_USERS[1];
        setCurrentUser(staffUser);
      }
      setCurrentTab('provider_portal');
    }
  };

  // Fetch all data from backend REST API on mount
  const refreshBackendData = async () => {
    try {
      const [reqs, bks, qts, invs, plts, stats] = await Promise.all([
        api.getClientRequests(),
        api.getBookings(),
        api.getQuotes(),
        api.getInvoices(),
        api.getPlants(),
        api.getStats(),
      ]);

      if (reqs && reqs.length) setClientRequests(reqs);
      if (bks && bks.length) setBookings(bks);
      if (qts && qts.length) setQuotes(qts);
      if (invs && invs.length) setInvoices(invs);
      if (plts && plts.length) setPlants(plts);
      if (stats) setBackendStats(stats);
    } catch (err) {
      console.error('Failed fetching data from backend API:', err);
    }
  };

  useEffect(() => {
    refreshBackendData();
  }, []);

  // Sync current user to LocalStorage
  useEffect(() => {
    localStorage.setItem('pastures_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Actions
  const handleSwitchRole = (newRole: UserRole) => {
    const matchedUser = INITIAL_USERS.find((u) => u.role === newRole) || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(matchedUser);
    showToast(`Switched view to ${newRole.toUpperCase()} mode`);
  };

  const handleSelectServiceToBook = (serviceId: string) => {
    setActiveServiceToBook(serviceId);
    setCurrentTab('bookings');
  };

  // Client Requests Backend Handlers
  const handleUpdateClientRequest = async (id: string, updates: Partial<ClientRequest>) => {
    try {
      const updated = await api.updateClientRequest(id, updates);
      setClientRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast(`Request ${updated.referenceNo} updated`);
      const newStats = await api.getStats();
      if (newStats) setBackendStats(newStats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDispatchRequestAction = async (
    id: string,
    action: 'assign_crew' | 'convert_to_booking' | 'mark_completed',
    params?: { staffName?: string; scheduledDate?: string }
  ) => {
    try {
      const result = await api.dispatchRequestAction(id, action, params);
      setClientRequests((prev) => prev.map((r) => (r.id === id ? result.request : r)));

      if (result.booking) {
        setBookings((prev) => [result.booking!, ...prev]);
        showToast(`Created official booking ${result.booking.bookingRef}!`);
      } else {
        showToast(`Action dispatched for ${result.request.referenceNo}`);
      }

      const newStats = await api.getStats();
      if (newStats) setBackendStats(newStats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClientRequest = async (req: Partial<ClientRequest>) => {
    try {
      const created = await api.createClientRequest(req);
      setClientRequests((prev) => [created, ...prev]);
      showToast(`Logged request ticket ${created.referenceNo}`);
      const newStats = await api.getStats();
      if (newStats) setBackendStats(newStats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClientRequest = async (id: string) => {
    try {
      await api.deleteClientRequest(id);
      setClientRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('Client request archived');
      const newStats = await api.getStats();
      if (newStats) setBackendStats(newStats);
    } catch (err) {
      console.error(err);
    }
  };

  // Bookings Handlers
  const handleAddBooking = async (newBooking: Booking) => {
    try {
      const created = await api.createBooking(newBooking);
      setBookings((prev) => [created, ...prev]);
      showToast(`Appointment ${created.bookingRef} successfully reserved!`);
      const [reqs, stats] = await Promise.all([api.getClientRequests(), api.getStats()]);
      if (reqs) setClientRequests(reqs);
      if (stats) setBackendStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const updated = await api.updateBooking(bookingId, { status });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      showToast(`Booking status updated to ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleBooking = async (
    bookingId: string,
    newDate: string,
    newSlot: 'morning' | 'afternoon' | 'full_day'
  ) => {
    try {
      const updated = await api.updateBooking(bookingId, { date: newDate, timeSlot: newSlot });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      showToast(`Booking rescheduled to ${newDate} (${newSlot})`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklistTask = async (bookingId: string, task: string) => {
    try {
      const updated = await api.toggleChecklist(bookingId, task);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      console.error(err);
    }
  };

  // Quotes & Invoices Handlers
  const handleAddQuote = async (newQuote: QuoteEstimate) => {
    try {
      const created = await api.createQuote(newQuote);
      setQuotes((prev) => [created, ...prev]);
      showToast(`AI Quote ${created.quoteRef} generated!`);
      const [reqs, stats] = await Promise.all([api.getClientRequests(), api.getStats()]);
      if (reqs) setClientRequests(reqs);
      if (stats) setBackendStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuote = (updatedQuote: QuoteEstimate) => {
    setQuotes((prev) => prev.map((q) => (q.id === updatedQuote.id ? updatedQuote : q)));
    showToast(`Quote ${updatedQuote.quoteRef} marked ${updatedQuote.status.toUpperCase()}`);
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const updated = await api.updateQuote(quoteId, { status: 'approved' });
      setQuotes((prev) => prev.map((q) => (q.id === quoteId ? updated : q)));
      showToast(`Quote ${updated.quoteRef} approved! Grounds crew notified.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddInvoice = async (newInvoice: Invoice) => {
    try {
      const created = await api.createInvoice(newInvoice);
      setInvoices((prev) => [created, ...prev]);
      showToast(`Tax Invoice ${created.invoiceNumber} created!`);
      const stats = await api.getStats();
      if (stats) setBackendStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvoicePaid = async (invoiceId: string) => {
    try {
      const paid = await api.payInvoice(invoiceId, 'stripe_card');
      setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? paid : inv)));
      showToast(`Invoice ${paid.invoiceNumber} successfully settled via Stripe!`);
      const stats = await api.getStats();
      if (stats) setBackendStats(stats);
    } catch (err) {
      console.error(err);
    }
  };

  // Garden Plants Handlers
  const handleUpdatePlant = async (updatedPlant: GardenPlant) => {
    try {
      const saved = await api.savePlant(updatedPlant);
      setPlants((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      showToast(`${saved.speciesName} care logged!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlant = async (newPlant: GardenPlant) => {
    try {
      const saved = await api.savePlant(newPlant);
      setPlants((prev) => [...prev, saved]);
      showToast(`${saved.speciesName} placed on garden grid!`);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingRequestsCount = clientRequests.filter(
    (r) => r.status === 'new' || r.status === 'under_review'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-700 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl border border-stone-700 animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSplash={() => setShowSplash(true)}
        pendingRequestsCount={pendingRequestsCount}
        unreadNotificationsCount={2}
        services={services}
        bookings={bookings}
        plants={plants}
        clientRequests={clientRequests}
        onSelectBooking={(b) => setSelectedBookingForDetails(b)}
        onSelectPlant={(p) => {
          setSelectedPlantId(p.id);
          setCurrentTab('gardens');
        }}
        onSelectClientRequest={(r) => {
          setSelectedRequestId(r.id);
          setCurrentTab('requests');
        }}
        isProviderAuthenticated={Boolean(providerSession)}
        onOpenProviderLogin={() => setIsProviderAuthModalOpen(true)}
        onOpenPortalGuide={() => setIsPortalGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            services={services}
            onSelectTab={setCurrentTab}
            onSelectServiceToBook={handleSelectServiceToBook}
          />
        )}

        {currentTab === 'client_portal' && (
          <ClientPortalView
            currentUser={currentUser}
            bookings={bookings}
            invoices={invoices}
            quotes={quotes}
            plants={plants}
            services={services}
            clientRequests={clientRequests}
            onBookService={() => setCurrentTab('bookings')}
            onRequestAssistance={() => setCurrentTab('requests')}
            onPayInvoice={(inv) => setPayingInvoice(inv)}
            onViewQuote={(_q) => setCurrentTab('quotes')}
            onAcceptQuote={handleAcceptQuote}
            onOpenBookingDetails={(b) => setSelectedBookingForDetails(b)}
            onOpenPlantDetails={(p) => {
              setSelectedPlantId(p.id);
              setCurrentTab('gardens');
            }}
            onOpenMessages={() => setCurrentTab('messages')}
            onSwitchToProviderPortal={handleOpenProviderPortal}
          />
        )}

        {currentTab === 'provider_portal' && (
          <ServiceProviderPortalView
            currentUser={currentUser}
            providerSession={providerSession}
            bookings={bookings}
            invoices={invoices}
            quotes={quotes}
            services={services}
            clientRequests={clientRequests}
            backendStats={backendStats}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onToggleChecklistTask={handleToggleChecklistTask}
            onOpenBookingDetails={(b) => setSelectedBookingForDetails(b)}
            onDispatchRequestAction={handleDispatchRequestAction}
            onCreateQuote={handleAddQuote}
            onCreateInvoice={handleAddInvoice}
            onOpenAiAssistant={() => setCurrentTab('ai_assistant')}
            onOpenArGarden={() => setCurrentTab('ar_garden')}
            onSwitchToClientPortal={() => {
              handleSwitchRole('customer');
              setCurrentTab('client_portal');
            }}
            onLockSession={handleLockProviderSession}
            onOpenProviderLogin={() => setIsProviderAuthModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            bookings={bookings}
            invoices={invoices}
            quotes={quotes}
            plants={plants}
            onSelectTab={setCurrentTab}
            onPayInvoice={(inv) => setPayingInvoice(inv)}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onToggleChecklistTask={handleToggleChecklistTask}
            onOpenBookingDetails={(b) => setSelectedBookingForDetails(b)}
            onAlertActionApplied={(_alert, msg) => showToast(msg)}
          />
        )}

        {currentTab === 'bookings' && (
          <BookingCalendarView
            services={services}
            currentUser={currentUser}
            initialSelectedServiceId={activeServiceToBook}
            onAddBooking={handleAddBooking}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            bookings={bookings}
            onOpenBookingDetails={(b) => setSelectedBookingForDetails(b)}
          />
        )}

        {currentTab === 'quotes' && (
          <AiQuoteInvoiceView
            quotes={quotes}
            invoices={invoices}
            currentUser={currentUser}
            onAddQuote={handleAddQuote}
            onAddInvoice={handleAddInvoice}
            onPayInvoice={(inv) => setPayingInvoice(inv)}
            onBookFromQuote={(_quote) => setCurrentTab('bookings')}
            initialTab="estimator"
            onUpdateQuote={handleUpdateQuote}
          />
        )}

        {currentTab === 'payments' && (
          <AiQuoteInvoiceView
            quotes={quotes}
            invoices={invoices}
            currentUser={currentUser}
            onAddQuote={handleAddQuote}
            onAddInvoice={handleAddInvoice}
            onPayInvoice={(inv) => setPayingInvoice(inv)}
            onBookFromQuote={(_quote) => setCurrentTab('bookings')}
            initialTab="invoices"
            onUpdateQuote={handleUpdateQuote}
          />
        )}

        {currentTab === 'gardens' && (
          <GardensView
            plants={plants}
            onSelectPlant={handleUpdatePlant}
            onOpenGardenMap={() => setCurrentTab('ar_garden')}
            onWaterPlant={handleUpdatePlant}
            onAddPlant={handleAddPlant}
            onUpdatePlant={handleUpdatePlant}
            initialSelectedPlantId={selectedPlantId}
          />
        )}

        {currentTab === 'ai_assistant' && (
          <AiAssistantView
            onAddPlant={(newPlant) => {
              handleAddPlant(newPlant);
              showToast(`Added ${newPlant.speciesName} to your garden!`);
            }}
            onNavigateToGardens={() => setCurrentTab('gardens')}
            onNavigateToEstimator={() => setCurrentTab('quotes')}
          />
        )}

        {currentTab === 'ar_garden' && (
          <GardenTrackingArView
            plants={plants}
            onUpdatePlant={handleUpdatePlant}
            onAddPlant={handleAddPlant}
          />
        )}

        {currentTab === 'messages' && <MessagesView />}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateUser={(u) => {
              setCurrentUser(u);
              showToast('Profile updated');
            }}
            onLogout={() => {
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {currentTab === 'requests' && (
          <ClientRequestsView
            requests={clientRequests}
            stats={backendStats}
            onUpdateRequest={handleUpdateClientRequest}
            onDispatchRequestAction={handleDispatchRequestAction}
            onCreateRequest={handleCreateClientRequest}
            onDeleteRequest={handleDeleteClientRequest}
            initialSelectedRequestId={selectedRequestId}
          />
        )}

        {currentTab === 'unchanging_lane' && <UnchangingLaneStudioView />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-stone-200 bg-stone-100/60 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-stone-800 text-sm">
              Pastures Gardening & Landscaping
            </span>
            <span aria-hidden="true">·</span>
            <span>Est. 2018 Cotswolds, UK</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('bookings')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              Bookings
            </button>
            <button
              onClick={() => setCurrentTab('quotes')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              Quotes
            </button>
            <button
              onClick={() => setCurrentTab('gardens')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              Gardens
            </button>
            <button
              onClick={() => setCurrentTab('ai_assistant')}
              className="hover:text-stone-900 cursor-pointer transition-colors"
            >
              AI Assistant
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hover:text-emerald-900 font-semibold cursor-pointer transition-colors"
            >
              Onboarding Tour
            </button>
            <button
              onClick={() => setShowSplash(true)}
              className="hover:text-emerald-900 font-semibold cursor-pointer transition-colors"
            >
              Splash Welcome
            </button>
          </div>

          <div className="text-stone-400">
            © {new Date().getFullYear()} Pastures Gardening Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Fullscreen Splash Screen */}
      {showSplash && (
        <SplashScreen
          onEnterApp={() => setShowSplash(false)}
          onEnterClientPortal={() => {
            handleSwitchRole('customer');
            setCurrentTab('client_portal');
            setShowSplash(false);
          }}
          onEnterProviderPortal={() => {
            setShowSplash(false);
            handleOpenProviderPortal();
          }}
          onOpenOnboarding={() => {
            setShowSplash(false);
            setIsOnboardingOpen(true);
          }}
          onOpenAuth={() => {
            setShowSplash(false);
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBookingForDetails && (
        <BookingDetailsModal
          booking={selectedBookingForDetails}
          isOpen={Boolean(selectedBookingForDetails)}
          onClose={() => setSelectedBookingForDetails(null)}
          onReschedule={handleRescheduleBooking}
          onCancel={(id) => handleUpdateBookingStatus(id, 'cancelled')}
          onMessageGardener={(_name) => setCurrentTab('messages')}
          onViewInvoice={(_ref) => setCurrentTab('payments')}
          onPayInvoice={(_ref) => {
            const inv = invoices.find((i) => i.paymentStatus !== 'paid');
            if (inv) setPayingInvoice(inv);
          }}
        />
      )}

      {/* Stripe Payment Modal */}
      {payingInvoice && (
        <StripePaymentModal
          invoice={payingInvoice}
          isOpen={Boolean(payingInvoice)}
          onClose={() => setPayingInvoice(null)}
          onSuccess={handleInvoicePaid}
        />
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setCurrentTab('dashboard')}
      />

      {/* Auth / Profile Modal */}
      <AuthModal
        currentUser={currentUser}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenProviderLogin={() => setIsProviderAuthModalOpen(true)}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast('Profile information updated');
        }}
      />

      {/* Provider Staff Authentication Modal */}
      <ProviderAuthModal
        isOpen={isProviderAuthModalOpen}
        onClose={() => setIsProviderAuthModalOpen(false)}
        onAuthenticate={handleAuthenticateProvider}
        targetDestination="Service Provider Portal"
      />

      {/* User-Friendly Platform & Role Guide Modal */}
      <PortalGuideModal
        isOpen={isPortalGuideOpen}
        onClose={() => setIsPortalGuideOpen(false)}
        onSelectClientPortal={() => {
          handleSwitchRole('customer');
          setCurrentTab('client_portal');
        }}
        onSelectProviderPortal={handleOpenProviderPortal}
      />
    </div>
  );
}
