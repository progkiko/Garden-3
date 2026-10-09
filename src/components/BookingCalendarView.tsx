import React, { useState } from 'react';
import { ServiceItem, Booking, UserProfile } from '../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, User, ShieldAlert, ArrowRight } from 'lucide-react';

interface BookingCalendarViewProps {
  services: ServiceItem[];
  currentUser: UserProfile;
  initialSelectedServiceId?: string;
  onAddBooking: (booking: Booking) => void;
  onGoToDashboard: () => void;
  bookings?: Booking[];
  onOpenBookingDetails?: (booking: Booking) => void;
}

export const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  services,
  currentUser,
  initialSelectedServiceId,
  onAddBooking,
  onGoToDashboard,
  bookings = [],
  onOpenBookingDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'list'>('book');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    initialSelectedServiceId ? [initialSelectedServiceId] : ['srv-lawn']
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [address, setAddress] = useState(currentUser.address || 'High Meadow House, Willow Lane, Chipping Campden');
  const [postcode, setPostcode] = useState(currentUser.postcode || 'GL55 6HB');
  const [notes, setNotes] = useState(currentUser.notes || 'Side wooden gate code is 4821. Friendly retriever on site.');
  const [gardenerPreference, setGardenerPreference] = useState('Callum Brooks (Senior Groundsman)');
  const [lawnSizeM2, setLawnSizeM2] = useState<number>(currentUser.gardenSpecs?.lawnAreaM2 || 150);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Available upcoming dates generator (next 14 days)
  const availableDates = [
    { date: '2026-10-12', label: 'Mon 12 Oct', slotsAvailable: 2 },
    { date: '2026-10-13', label: 'Tue 13 Oct', slotsAvailable: 1 },
    { date: '2026-10-14', label: 'Wed 14 Oct', slotsAvailable: 3 },
    { date: '2026-10-15', label: 'Thu 15 Oct', slotsAvailable: 0 }, // fully booked
    { date: '2026-10-16', label: 'Fri 16 Oct', slotsAvailable: 2 },
    { date: '2026-10-17', label: 'Sat 17 Oct', slotsAvailable: 1 },
    { date: '2026-10-19', label: 'Mon 19 Oct', slotsAvailable: 4 },
    { date: '2026-10-20', label: 'Tue 20 Oct', slotsAvailable: 3 },
    { date: '2026-10-21', label: 'Wed 21 Oct', slotsAvailable: 2 },
  ];

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((s) => s !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Calculate total estimate & duration
  const activeServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const estimatedPrice = activeServices.reduce((sum, s) => {
    if (s.id === 'srv-turf') return sum + s.basePrice * Math.round(lawnSizeM2 * 0.4);
    return sum + s.basePrice;
  }, 0);

  const estimatedMinutes = activeServices.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingRef: `PG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      address: `${address}, ${postcode}`,
      serviceIds: selectedServiceIds,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed',
      notes,
      totalEstimate: estimatedPrice,
      assignedGardener: gardenerPreference,
      checklist: {
        'Initial site inspection & safety walk': false,
        'Execute booked service specifications': false,
        'Path sweep & debris collection': false,
        'Client sign-off inspection': false,
      },
      createdAt: '2026-10-07',
    };

    onAddBooking(newBooking);
    setSubmittedBooking(newBooking);
  };

  if (submittedBooking) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Your appointment is secured
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Reference code: <span className="font-mono font-bold text-stone-900">{submittedBooking.bookingRef}</span>
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-left text-xs space-y-3">
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">Service Date:</span>
              <span className="font-semibold text-stone-900">{submittedBooking.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">Arrival Window:</span>
              <span className="font-semibold text-stone-900 capitalize">
                {submittedBooking.timeSlot === 'morning' && 'Morning (08:00 - 12:00)'}
                {submittedBooking.timeSlot === 'afternoon' && 'Afternoon (13:00 - 17:00)'}
                {submittedBooking.timeSlot === 'full_day' && 'Full Day (08:00 - 17:00)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">Assigned Groundsman:</span>
              <span className="font-semibold text-stone-900">{submittedBooking.assignedGardener}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Estimated Total:</span>
              <span className="font-mono font-bold text-stone-900 tabular-nums">£{submittedBooking.totalEstimate}.00</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={onGoToDashboard}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSubmittedBooking(null)}
              className="px-5 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg cursor-pointer transition-colors"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Garden Bookings & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Browse service catalogue, select availability calendar windows, or manage existing visits.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center p-1 bg-stone-200/80 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'book'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Catalogue & Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Booking List ({bookings.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Status filters */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
              {(['all', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBookingFilter(st)}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors capitalize ${
                    bookingFilter === st
                      ? 'bg-white text-emerald-950 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('book')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Book New Visit</span>
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div className="font-serif text-lg font-bold text-stone-800">No bookings in this category</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No appointments match your filter. You can reserve a new visit anytime using our availability calendar.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('book')}
                className="mt-2 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
              >
                Schedule Garden Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((b) => {
                const bookedServices = services.filter((s) => b.serviceIds.includes(s.id));
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-700/60 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-emerald-950">
                          {b.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-900'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-bold text-stone-900">
                          {bookedServices.map((s) => s.name).join(', ') || 'Custom Horticultural Care'}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate">{b.address}</span>
                        </div>
                      </div>

                      <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 text-xs space-y-1.5">
                        <div className="flex justify-between text-stone-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Date:</span>
                          </span>
                          <span className="font-semibold text-stone-900">{b.date}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Window:</span>
                          </span>
                          <span className="font-medium text-stone-900 capitalize">
                            {b.timeSlot.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>Groundsman:</span>
                          <span className="font-medium text-stone-900">{b.assignedGardener || 'Pending'}</span>
                        </div>
                        <div className="flex justify-between text-stone-900 font-bold pt-1 border-t border-stone-200">
                          <span>Total:</span>
                          <span className="font-mono tabular-nums">£{b.totalEstimate}.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onOpenBookingDetails && onOpenBookingDetails(b)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Manage & Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[10px] text-stone-400">
                        {b.notes ? 'Gate notes attached' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'book' && (
      <form onSubmit={handleBookAppointment} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Services & Property details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Services Selection */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                1. Select Services Needed
              </h2>
              <span className="text-xs text-stone-500">
                {selectedServiceIds.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{service.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        £{service.basePrice}
                      </span>
                      <span className="text-[11px] text-stone-500">~{service.estimatedMinutes} mins</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Yard size slider if lawn/clearance is active */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-stone-700">Approximate Yard Size:</span>
                <span className="font-mono font-bold text-stone-900 tabular-nums">{lawnSizeM2} m²</span>
              </div>
              <input
                type="range"
                min="30"
                max="600"
                step="10"
                value={lawnSizeM2}
                onChange={(e) => setLawnSizeM2(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Small Townhouse (30 m²)</span>
                <span>Medium (150 m²)</span>
                <span>Substantial Grounds (600 m²)</span>
              </div>
            </div>
          </div>

          {/* Step 2: Date & Slot Picker */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              2. Select Date & Window
            </h2>

            {/* Date selection row */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.date;
                const isFull = item.slotsAvailable === 0;
                return (
                  <button
                    type="button"
                    key={item.date}
                    disabled={isFull}
                    onClick={() => setSelectedDate(item.date)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isFull
                        ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200'
                        : isSelected
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                        : 'border-stone-200 hover:border-emerald-600/60 bg-white text-stone-800'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {isFull ? 'Booked' : `${item.slotsAvailable} slots`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Arrival windows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlot('morning')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  selectedSlot === 'morning'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Morning Window</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-1">08:00 – 12:00 arrival</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('afternoon')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  selectedSlot === 'afternoon'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Afternoon Window</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-1">13:00 – 17:00 arrival</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('full_day')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                  selectedSlot === 'full_day'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Full Day Overhaul</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-1">08:00 – 17:00 dedicated</div>
              </button>
            </div>
          </div>

          {/* Step 3: Property & Access Details */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              3. Property Location & Security Access
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-stone-700">Property Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    placeholder="e.g. 14 High Meadow Way"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Postcode</label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 uppercase"
                  placeholder="e.g. GL55 6HB"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                <span>Access Instructions, Gate Codes & Pets</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Side gate combination, pet safety, parking restrictions..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>Preferred Groundsman / Lead Gardener</span>
              </label>
              <select
                value={gardenerPreference}
                onChange={(e) => setGardenerPreference(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
              >
                <option value="Callum Brooks (Senior Groundsman)">Callum Brooks (Senior Groundsman)</option>
                <option value="Toby Miller (Topiary & Pruning Specialist)">Toby Miller (Topiary & Pruning Specialist)</option>
                <option value="First Available RHS Certified Team">First Available RHS Certified Team</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-24 space-y-5 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Visit Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Date:</span>
                <span className="font-semibold text-stone-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Time Window:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {selectedSlot === 'morning' && 'Morning (08:00 - 12:00)'}
                  {selectedSlot === 'afternoon' && 'Afternoon (13:00 - 17:00)'}
                  {selectedSlot === 'full_day' && 'Full Day'}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Crew Duration:</span>
                <span className="font-semibold text-stone-900">~{Math.round(estimatedMinutes / 60 * 10) / 10} hours</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="text-xs font-semibold text-stone-800">Selected Services:</div>
              {activeServices.map((s) => (
                <div key={s.id} className="flex justify-between text-xs text-stone-600">
                  <span className="truncate max-w-[170px]">{s.name}</span>
                  <span className="font-mono font-medium text-stone-900 tabular-nums">£{s.basePrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Green Waste Recycling:</span>
                <span className="text-emerald-700 font-medium">Included</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Estimated VAT (20%):</span>
                <span className="font-mono tabular-nums">£{(estimatedPrice * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Estimated Cost:</span>
                <span className="font-mono text-emerald-900 tabular-nums">
                  £{(estimatedPrice * 1.2).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Confirm & Reserve Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-stone-500 text-center leading-tight">
              Pay upon completion or via instant Stripe invoice. Free cancellation up to 24 hours prior.
            </p>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};
