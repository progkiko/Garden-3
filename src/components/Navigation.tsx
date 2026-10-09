import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserRole, UserProfile, Booking, GardenPlant, ServiceItem } from '../types';
import { ClientRequest } from '../../server/types';
import {
  Calendar,
  Sprout,
  ReceiptText,
  LayoutDashboard,
  Home,
  User,
  ShieldCheck,
  Shovel,
  Inbox,
  Bell,
  MessageSquare,
  Sparkles,
  Camera,
  Layers,
  CreditCard,
  Search,
  X,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  Tag,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'bookings'
  | 'quotes'
  | 'payments'
  | 'gardens'
  | 'ar_garden'
  | 'ai_assistant'
  | 'messages'
  | 'profile'
  | 'requests';

export interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenOnboarding: () => void;
  onOpenSplash?: () => void;
  pendingRequestsCount?: number;
  unreadNotificationsCount?: number;
  // Global search props
  services?: ServiceItem[];
  bookings?: Booking[];
  plants?: GardenPlant[];
  clientRequests?: ClientRequest[];
  onSelectBooking?: (booking: Booking) => void;
  onSelectPlant?: (plant: GardenPlant) => void;
  onSelectClientRequest?: (request: ClientRequest) => void;
}

type SearchCategory = 'all' | 'bookings' | 'plants' | 'requests';

interface SearchResultItem {
  id: string;
  category: 'booking' | 'plant' | 'request';
  title: string;
  subtitle: string;
  detail: string;
  badge: string;
  badgeColor: string;
  rawItem: Booking | GardenPlant | ClientRequest;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchRole,
  onOpenAuth,
  onOpenNotifications,
  onOpenOnboarding,
  onOpenSplash,
  pendingRequestsCount = 0,
  unreadNotificationsCount = 2,
  services = [],
  bookings = [],
  plants = [],
  clientRequests = [],
  onSelectBooking,
  onSelectPlant,
  onSelectClientRequest,
}) => {
  // Global Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts (Cmd+K, Ctrl+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively in another textarea/input
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Click outside to dismiss search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & match items
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // Helper to resolve service name
    const getBookingTitle = (b: Booking) => {
      if (b.serviceIds && b.serviceIds.length > 0 && services.length > 0) {
        const found = services.find((s) => b.serviceIds.includes(s.id));
        if (found) return found.name;
      }
      return `Grounds Service ${b.bookingRef}`;
    };

    // Map bookings
    const matchedBookings: SearchResultItem[] = bookings
      .filter((b) => {
        const title = getBookingTitle(b).toLowerCase();
        if (!q) return true;
        return (
          title.includes(q) ||
          b.bookingRef.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.status.toLowerCase().includes(q) ||
          (b.notes && b.notes.toLowerCase().includes(q))
        );
      })
      .map((b) => {
        const title = getBookingTitle(b);
        return {
          id: `booking-${b.id}`,
          category: 'booking' as const,
          title,
          subtitle: `${b.bookingRef} • ${b.customerName}`,
          detail: `${b.date} (${b.timeSlot}) • ${b.address}`,
          badge: b.status.replace('_', ' ').toUpperCase(),
          badgeColor:
            b.status === 'confirmed'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : b.status === 'in_progress'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : b.status === 'completed'
              ? 'bg-stone-100 text-stone-700 border-stone-300'
              : 'bg-amber-100 text-amber-800 border-amber-300',
          rawItem: b,
        };
      });

    // Map plants
    const matchedPlants: SearchResultItem[] = plants
      .filter((p) => {
        if (!q) return true;
        return (
          p.speciesName.toLowerCase().includes(q) ||
          p.botanicalName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.health.toLowerCase().includes(q) ||
          p.bloomSeason.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q)
        );
      })
      .map((p) => ({
        id: `plant-${p.id}`,
        category: 'plant' as const,
        title: p.speciesName,
        subtitle: p.botanicalName,
        detail: `Category: ${p.category} • Bloom: ${p.bloomSeason} • Water every ${p.waterCadenceDays}d`,
        badge: p.health.replace('_', ' ').toUpperCase(),
        badgeColor:
          p.health === 'thriving'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : p.health === 'needs_water'
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-red-100 text-red-800 border-red-300',
        rawItem: p,
      }));

    // Map client requests
    const matchedRequests: SearchResultItem[] = clientRequests
      .filter((r) => {
        if (!q) return true;
        return (
          r.referenceNo.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.propertyAddress.toLowerCase().includes(q) ||
          r.priority.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          (r.assignedStaff && r.assignedStaff.toLowerCase().includes(q))
        );
      })
      .map((r) => ({
        id: `request-${r.id}`,
        category: 'request' as const,
        title: r.title || `Client Request ${r.referenceNo}`,
        subtitle: `${r.referenceNo} • ${r.clientName}`,
        detail: `${r.propertyAddress} • Type: ${r.type.replace('_', ' ')} • Priority: ${r.priority.toUpperCase()}`,
        badge: r.priority.toUpperCase(),
        badgeColor:
          r.priority === 'urgent'
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : r.priority === 'high'
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-stone-100 text-stone-700 border-stone-300',
        rawItem: r,
      }));

    return {
      all: [...matchedBookings, ...matchedPlants, ...matchedRequests],
      bookings: matchedBookings,
      plants: matchedPlants,
      requests: matchedRequests,
    };
  }, [searchQuery, services, bookings, plants, clientRequests]);

  // Current list filtered by category
  const filteredList = useMemo(() => {
    if (activeCategory === 'bookings') return searchResults.bookings;
    if (activeCategory === 'plants') return searchResults.plants;
    if (activeCategory === 'requests') return searchResults.requests;
    return searchResults.all;
  }, [searchResults, activeCategory]);

  // Reset selected index on query/category change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, activeCategory]);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);

    if (item.category === 'booking') {
      const booking = item.rawItem as Booking;
      if (onSelectBooking) {
        onSelectBooking(booking);
      } else {
        onSelectTab('bookings');
      }
    } else if (item.category === 'plant') {
      const plant = item.rawItem as GardenPlant;
      if (onSelectPlant) {
        onSelectPlant(plant);
      } else {
        onSelectTab('gardens');
      }
    } else if (item.category === 'request') {
      const req = item.rawItem as ClientRequest;
      if (onSelectClientRequest) {
        onSelectClientRequest(req);
      } else {
        onSelectTab('requests');
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredList.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredList[selectedIndex]) {
        handleSelectItem(filteredList[selectedIndex]);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand mark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <span className="font-serif text-lg sm:text-xl xl:text-2xl font-bold tracking-tight text-emerald-950 group-hover:text-emerald-800 transition-colors">
            Pastures Gardening
          </span>
        </button>

        {/* Global Search Bar (Center / Desktop & Tablet) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search bookings, plants, requests..."
              className="w-full pl-9 pr-14 sm:pr-18 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/90 hover:bg-white focus:bg-white border border-stone-300/80 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 rounded-xl text-stone-800 placeholder-stone-400 transition-all shadow-xs outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 hidden sm:flex items-center gap-1 pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 border border-stone-200 rounded">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>

          {/* Autocomplete / Search Results Popover */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:w-[560px] top-full mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Category Filter Chips Bar */}
              <div className="p-2.5 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    All ({searchResults.all.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('bookings')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                      activeCategory === 'bookings'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Bookings ({searchResults.bookings.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('plants')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                      activeCategory === 'plants'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    <Sprout className="w-3 h-3" />
                    <span>Plants ({searchResults.plants.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('requests')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                      activeCategory === 'requests'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200/60'
                    }`}
                  >
                    <Inbox className="w-3 h-3" />
                    <span>Requests ({searchResults.requests.length})</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
                {filteredList.length > 0 ? (
                  filteredList.slice(0, 15).map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 text-left ${
                          isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-700' : 'hover:bg-stone-50'
                        }`}
                      >
                        {/* Type Icon */}
                        <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-stone-100 border border-stone-200 text-emerald-900">
                          {item.category === 'booking' && <Calendar className="w-4 h-4 text-emerald-700" />}
                          {item.category === 'plant' && <Sprout className="w-4 h-4 text-emerald-700" />}
                          {item.category === 'request' && <Inbox className="w-4 h-4 text-amber-700" />}
                        </div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-stone-900 truncate">
                              {item.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider border shrink-0 ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                            {item.subtitle}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">
                            {item.detail}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="self-center pl-1 text-stone-400 shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-800">
                      No matches found {searchQuery ? `for "${searchQuery}"` : ''}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      Try searching by booking reference (e.g. BKG-), plant botanical name (e.g. Lavandula), or client request ticket (e.g. REQ-).
                    </p>
                    {/* Suggested tags */}
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[11px]">
                      <span className="text-stone-400 py-1">Quick searches:</span>
                      {['Cylinder Lawn', 'Lavender', 'Urgent', 'Emergency', 'Orchard'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg text-stone-700 border border-stone-200 cursor-pointer transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Popover Footer with keyboard helpers */}
              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[9px]">↑</kbd>
                    <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[9px]">↓</kbd>
                    <span>navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[9px]">↵</kbd>
                    <span>select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[9px]">esc</kbd>
                    <span>dismiss</span>
                  </span>
                </div>
                <span className="font-medium text-stone-400">
                  {filteredList.length} total matches
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden 2xl:flex items-center gap-4 text-xs font-semibold text-stone-600">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('bookings')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'bookings'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bookings</span>
          </button>

          <button
            onClick={() => onSelectTab('quotes')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'quotes'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <ReceiptText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quotes</span>
          </button>

          <button
            onClick={() => onSelectTab('payments')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'payments'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>Payments</span>
          </button>

          <button
            onClick={() => onSelectTab('gardens')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'gardens'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>Gardens</span>
          </button>

          <button
            onClick={() => onSelectTab('requests')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 flex items-center gap-1.5 relative ${
              currentTab === 'requests'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent hover:text-emerald-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-emerald-700" />
            <span>Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-bold bg-amber-500 text-white rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Splash button */}
          {onOpenSplash && (
            <button
              onClick={onOpenSplash}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-md border border-emerald-300/60 cursor-pointer transition-colors"
              title="Welcome Splash"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-800" />
              <span>Splash</span>
            </button>
          )}

          {/* Notifications button with badge */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5" />
            )}
          </button>

          {/* Role selector dropdown */}
          <div className="hidden sm:flex items-center text-xs bg-stone-200/70 rounded-md p-0.5 border border-stone-300/60">
            <button
              onClick={() => onSwitchRole('customer')}
              title="View as Client"
              className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                currentUser.role === 'customer'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => onSwitchRole('gardener')}
              title="View as Field Groundsman"
              className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                currentUser.role === 'gardener'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Gardener
            </button>
            <button
              onClick={() => onSwitchRole('admin')}
              title="View as Operations Admin"
              className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-white text-emerald-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors whitespace-nowrap ${
              currentTab === 'profile'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/60'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden md:inline">{currentUser.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar / Navigation for mobile and desktop tabs */}
      <div className="flex overflow-x-auto px-4 py-2 border-t border-stone-200 gap-4 text-xs font-medium text-stone-600 scrollbar-none bg-stone-50/50">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'dashboard' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('bookings')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'bookings' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => onSelectTab('quotes')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'quotes' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Quotes
        </button>
        <button
          onClick={() => onSelectTab('payments')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'payments' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Payments
        </button>
        <button
          onClick={() => onSelectTab('gardens')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'gardens' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Gardens ({plants.length} Plants)
        </button>
        <button
          onClick={() => onSelectTab('ar_garden')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'ar_garden' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          AR Garden
        </button>
        <button
          onClick={() => onSelectTab('ai_assistant')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'ai_assistant' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          AI Assistant
        </button>
        <button
          onClick={() => onSelectTab('messages')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'messages' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Messages
        </button>
        <button
          onClick={() => onSelectTab('requests')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'requests' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Client Requests ({pendingRequestsCount})
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`shrink-0 cursor-pointer pb-0.5 ${currentTab === 'profile' ? 'text-emerald-800 font-bold border-b-2 border-emerald-700' : 'hover:text-stone-900'}`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
