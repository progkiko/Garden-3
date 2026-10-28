import React, { useState } from 'react';
import { Booking, Invoice, GardenPlant, UserProfile, UserRole, QuoteEstimate, GardenCareAlert } from '../types';
import { NavTab } from './Navigation';
import { WeatherCareAlertsBanner } from './WeatherCareAlertsBanner';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  Receipt,
  CreditCard,
  Shovel,
  Sparkles,
  ArrowRight,
  TrendingUp,
  UserCheck,
  CheckSquare,
  Square,
  Phone,
  FileText,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile;
  bookings: Booking[];
  invoices: Invoice[];
  quotes: QuoteEstimate[];
  plants: GardenPlant[];
  onSelectTab: (tab: NavTab) => void;
  onPayInvoice: (invoice: Invoice) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onToggleChecklistTask: (bookingId: string, task: string) => void;
  onOpenBookingDetails?: (booking: Booking) => void;
  onAlertActionApplied?: (alert: GardenCareAlert, message: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  bookings,
  invoices,
  quotes,
  plants,
  onSelectTab,
  onPayInvoice,
  onUpdateBookingStatus,
  onToggleChecklistTask,
  onOpenBookingDetails,
  onAlertActionApplied,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Filter bookings
  const relevantBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const unpaidInvoices = invoices.filter((i) => i.paymentStatus !== 'paid');
  const needsWaterCount = plants.filter((p) => p.health === 'needs_water').length;
  const thrivingCount = plants.filter((p) => p.health === 'thriving').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {currentUser.role === 'customer' && 'Estate Client Portal'}
              {currentUser.role === 'gardener' && 'Field Operations Roster'}
              {currentUser.role === 'admin' && 'Central Command & Billing'}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Live Sync</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {currentUser.address}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('requests')}
            className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Shovel className="w-4 h-4 text-emerald-700" />
            <span>Client Requests</span>
          </button>
          <button
            onClick={() => onSelectTab('bookings')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </button>
          <button
            onClick={() => onSelectTab('payments')}
            className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>Invoices</span>
          </button>
        </div>
      </div>

      {/* Localized Weather Forecast & Gemini AI Care Alerts */}
      <WeatherCareAlertsBanner
        currentUser={currentUser}
        plants={plants}
        onSelectTab={onSelectTab}
        onAlertActionApplied={(alert, msg) => {
          setActionToast(msg);
          setTimeout(() => setActionToast(null), 5000);
          if (onAlertActionApplied) onAlertActionApplied(alert, msg);
        }}
      />

      {/* Action Directive Notification Banner */}
      {actionToast && (
        <div className="bg-emerald-900 text-emerald-100 border border-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{actionToast}</span>
          </div>
          <button
            onClick={() => setActionToast(null)}
            className="text-emerald-300 hover:text-white cursor-pointer ml-3 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <div className="text-xs text-stone-500 font-medium">Scheduled Visits</div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            {bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed').length}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed groundsman slot</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <div className="text-xs text-stone-500 font-medium">Outstanding Invoices</div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            £{unpaidInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-amber-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{unpaidInvoices.length} awaiting settlement</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <div className="text-xs text-stone-500 font-medium">Plant Health Index</div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            {Math.round((thrivingCount / (plants.length || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-stone-500">
            {thrivingCount} thriving · {needsWaterCount} need hydration
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2">
          <div className="text-xs text-stone-500 font-medium">Estate Property Size</div>
          <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
            {currentUser.gardenSpecs?.lawnAreaM2 || 180} m²
          </div>
          <div className="text-[11px] text-stone-500">
            Formal lawns & perimeter hedges
          </div>
        </div>
      </div>

      {/* ROLE 1: CUSTOMER VIEW */}
      {currentUser.role === 'customer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Bookings Feed: 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Active Gardening Appointments
              </h2>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
                {['all', 'confirmed', 'in_progress', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded capitalize cursor-pointer transition-colors ${
                      filterStatus === st
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {relevantBookings.length > 0 ? (
                relevantBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs hover:border-stone-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">{b.bookingRef}</span>
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
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b.date}</span>
                          <span>·</span>
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span className="capitalize">{b.timeSlot.replace('_', ' ')} Window</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                          £{b.totalEstimate}.00
                        </span>
                        <div className="text-[11px] text-stone-500">Estimated Total</div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <div className="font-medium text-stone-800">Notes & Work Scope:</div>
                      <p>{b.notes}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500 gap-2">
                      <div>
                        Assigned Lead: <strong className="text-stone-800">{b.assignedGardener || 'Pending Dispatch'}</strong>
                      </div>
                      <div className="flex items-center gap-3">
                        {onOpenBookingDetails && (
                          <button
                            onClick={() => onOpenBookingDetails(b)}
                            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                          >
                            Booking Dossier →
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                            className="text-stone-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                  No appointments found matching "{filterStatus}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Invoices, Quotes & Garden Summary: 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Unpaid Invoices Alert Box */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-800" />
                  <span>Statements & Payments</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                  {unpaidInvoices.length} due
                </span>
              </div>

              {unpaidInvoices.length > 0 ? (
                unpaidInvoices.map((inv) => (
                  <div key={inv.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between items-center font-medium">
                      <span className="font-mono text-stone-900">{inv.invoiceNumber}</span>
                      <span className="font-mono font-bold text-emerald-900 tabular-nums">
                        £{inv.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">Due by {inv.dueDate}</div>
                    <button
                      onClick={() => onPayInvoice(inv)}
                      className="w-full py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay via Stripe</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>All invoices are fully settled. Thank you!</span>
                </div>
              )}
            </div>

            {/* Recent Quotes Box */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  <span>Recent Quotes</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400 tabular-nums">
                  {quotes.length} total
                </span>
              </div>

              {quotes.slice(0, 2).map((q) => (
                <div key={q.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-stone-900">{q.quoteRef}</span>
                    <span className="font-mono font-bold text-emerald-900 tabular-nums">
                      £{q.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-1">{q.assessmentSummary}</p>
                  <button
                    onClick={() => onSelectTab('quotes_invoices' as any)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    View Breakdown →
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Garden Health Summary */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Garden Moisture & Health
              </h3>
              <div className="space-y-2.5 text-xs">
                {plants.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-1 border-b border-stone-100">
                    <div>
                      <div className="font-medium text-stone-900">{p.speciesName}</div>
                      <div className="text-[10px] text-stone-400">Watered: {p.lastWatered}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        p.health === 'thriving'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {p.health.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onSelectTab('gardens')}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Explore Interactive Garden (3D / 360° Views)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 2: GARDENER / GROUNDS CREW DISPATCH VIEW */}
      {currentUser.role === 'gardener' && (
        <div className="space-y-6">
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Shovel className="w-4 h-4 text-emerald-400" />
              <span>Grounds Crew Shift: 07:30 - 17:00</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Today's Field Route & Work Orders
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl">
              Execute job checklist items in order. Record waste sacks removed and submit customer completion sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.slice(0, 2).map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs">
                <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-900">
                      {booking.bookingRef}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">
                      {booking.customerName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{booking.address}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded capitalize ${
                      booking.status === 'in_progress' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-stone-900">Client Access & Pet Instructions:</div>
                  <p>{booking.notes}</p>
                </div>

                {/* Job Checklist Tasks */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-800">Job Task Checklist:</div>
                  {booking.checklist &&
                    Object.entries(booking.checklist).map(([task, done]) => (
                      <button
                        key={task}
                        onClick={() => onToggleChecklistTask(booking.id, task)}
                        className="w-full text-left flex items-center gap-2 p-2 rounded border border-stone-200/80 hover:bg-stone-50 cursor-pointer text-xs"
                      >
                        {done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400 shrink-0" />
                        )}
                        <span className={done ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                          {task}
                        </span>
                      </button>
                    ))}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
                    className="flex-1 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Generate Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROLE 3: ADMIN / OPERATIONS DIRECTOR VIEW */}
      {currentUser.role === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <div className="text-xs text-stone-500 font-medium">Monthly Contract Volume</div>
              <div className="font-mono text-3xl font-bold text-stone-900 tabular-nums">
                £{invoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
              </div>
              <div className="text-xs text-emerald-700 font-medium">+18.4% vs previous month</div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <div className="text-xs text-stone-500 font-medium">Active Groundsmen Roster</div>
              <div className="font-mono text-3xl font-bold text-stone-900 tabular-nums">
                12 Field Crews
              </div>
              <div className="text-xs text-stone-600">3 Cotswold depots fully mobilized</div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <div className="text-xs text-stone-500 font-medium">Service Completion Rate</div>
              <div className="font-mono text-3xl font-bold text-stone-900 tabular-nums">
                99.8%
              </div>
              <div className="text-xs text-emerald-700 font-medium">Zero safety incidents</div>
            </div>
          </div>

          {/* Central Bookings Table */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                All Client Bookings & Assignments
              </h3>
              <span className="text-xs text-stone-500">{bookings.length} total entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-medium">
                    <th className="py-2.5">Ref</th>
                    <th className="py-2.5">Client</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Crew Lead</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Value</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60">
                      <td className="py-3 font-mono font-bold text-stone-900">{b.bookingRef}</td>
                      <td className="py-3 font-medium text-stone-800">{b.customerName}</td>
                      <td className="py-3 text-stone-600">{b.date}</td>
                      <td className="py-3 text-stone-600">{b.assignedGardener || 'Unassigned'}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded capitalize bg-stone-100 text-stone-800">
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-stone-900 font-bold">
                        £{b.totalEstimate}.00
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
