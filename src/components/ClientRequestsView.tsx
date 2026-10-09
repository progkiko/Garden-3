import React, { useState } from 'react';
import { ClientRequest, BackendStats, RequestStatus, RequestPriority, RequestType } from '../../server/types';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Shovel,
  Sparkles,
  MessageSquare,
  FileCheck,
  ChevronRight,
  X,
  Trash2,
} from 'lucide-react';

interface ClientRequestsViewProps {
  requests: ClientRequest[];
  stats: BackendStats | null;
  onUpdateRequest: (id: string, updates: Partial<ClientRequest>) => Promise<void>;
  onDispatchRequestAction: (
    id: string,
    action: 'assign_crew' | 'convert_to_booking' | 'mark_completed',
    params?: { staffName?: string; scheduledDate?: string }
  ) => Promise<void>;
  onCreateRequest: (req: Partial<ClientRequest>) => Promise<void>;
  onDeleteRequest: (id: string) => Promise<void>;
  initialSelectedRequestId?: string;
}

export const ClientRequestsView: React.FC<ClientRequestsViewProps> = ({
  requests,
  stats,
  onUpdateRequest,
  onDispatchRequestAction,
  onCreateRequest,
  onDeleteRequest,
  initialSelectedRequestId,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(requests[0] || null);

  React.useEffect(() => {
    if (initialSelectedRequestId) {
      const match = requests.find((r) => r.id === initialSelectedRequestId);
      if (match) {
        setSelectedRequest(match);
      }
    }
  }, [initialSelectedRequestId, requests]);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [assigneeSelect, setAssigneeSelect] = useState('Callum Brooks (Senior Groundsman)');

  // Modal for creating phone/walk-in request
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newPropertyAddress, setNewPropertyAddress] = useState('');
  const [newPostcode, setNewPostcode] = useState('');
  const [newRequestType, setNewRequestType] = useState<RequestType>('emergency_clearance');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<RequestPriority>('urgent');

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.clientName.toLowerCase().includes(q) ||
        r.referenceNo.toLowerCase().includes(q) ||
        r.propertyAddress.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleAddStaffNote = async () => {
    if (!selectedRequest || !newNoteText.trim()) return;
    const author = 'Staff Log';
    const noteEntry = `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${author}]: ${newNoteText.trim()}`;
    await onUpdateRequest(selectedRequest.id, {
      internalNotes: [noteEntry],
    });
    setNewNoteText('');
    // refresh selected
    const updated = {
      ...selectedRequest,
      internalNotes: [...(selectedRequest.internalNotes || []), noteEntry],
    };
    setSelectedRequest(updated);
  };

  const handleAssignCrew = async () => {
    if (!selectedRequest) return;
    await onDispatchRequestAction(selectedRequest.id, 'assign_crew', {
      staffName: assigneeSelect,
    });
    setSelectedRequest({
      ...selectedRequest,
      assignedStaff: assigneeSelect,
      status: 'under_review',
    });
  };

  const handleConvertToBooking = async () => {
    if (!selectedRequest) return;
    await onDispatchRequestAction(selectedRequest.id, 'convert_to_booking');
    setSelectedRequest({
      ...selectedRequest,
      status: 'scheduled',
    });
  };

  const handleCreateNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateRequest({
      clientName: newClientName,
      clientEmail: newClientEmail,
      clientPhone: newClientPhone,
      propertyAddress: newPropertyAddress,
      postcode: newPostcode,
      type: newRequestType,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: 'new',
    });
    setIsCreateModalOpen(false);
    // Reset form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewPropertyAddress('');
    setNewPostcode('');
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Central Operations Dispatch
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Backend System Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Client Requests & Triage Board
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Authoritative backend repository managing quote requests, service bookings, emergency clearances, and crew dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Log Client Request</span>
          </button>
        </div>
      </div>

      {/* Backend Live Telemetry Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">Total Requests</div>
            <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
              {stats.totalRequests}
            </div>
            <div className="text-[10px] text-stone-400">All client tickets</div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">New / Triage</div>
            <div className="font-mono text-xl font-bold text-amber-700 tabular-nums">
              {stats.newRequestsCount}
            </div>
            <div className="text-[10px] text-amber-600">Requires review</div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">Under Review</div>
            <div className="font-mono text-xl font-bold text-blue-700 tabular-nums">
              {stats.underReviewCount}
            </div>
            <div className="text-[10px] text-blue-600">Site assessing</div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">Scheduled Jobs</div>
            <div className="font-mono text-xl font-bold text-emerald-800 tabular-nums">
              {stats.scheduledCount}
            </div>
            <div className="text-[10px] text-emerald-600">Assigned & booked</div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">Field Crews</div>
            <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
              {stats.activeFieldCrews} Crews
            </div>
            <div className="text-[10px] text-stone-400">Cotswolds active</div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-1">
            <div className="text-[11px] text-stone-500 font-medium">Unpaid Revenue</div>
            <div className="font-mono text-xl font-bold text-emerald-900 tabular-nums">
              £{stats.unpaidRevenueGBP.toFixed(2)}
            </div>
            <div className="text-[10px] text-stone-400">Total pipeline</div>
          </div>
        </div>
      )}

      {/* Main Board: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client, ref code, or location..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-stone-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 text-xs border border-stone-200 rounded bg-stone-50 text-stone-800"
                >
                  <option value="all">All ({requests.length})</option>
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[11px] text-stone-500">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2 py-1 text-xs border border-stone-200 rounded bg-stone-50 text-stone-800"
                >
                  <option value="all">All Types</option>
                  <option value="emergency_clearance">Emergency Clearance</option>
                  <option value="booking">Booking</option>
                  <option value="quote_estimation">AI Quote</option>
                  <option value="planting_consultation">Consultation</option>
                  <option value="turf_installation">Turf Grading</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Request Cards */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const isSelected = selectedRequest?.id === req.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900">
                            {req.referenceNo}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              req.priority === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : req.priority === 'high'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {req.priority}
                          </span>
                        </div>
                        <div className="font-serif text-sm font-bold text-stone-900 mt-1 line-clamp-1">
                          {req.title}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize whitespace-nowrap ${
                          req.status === 'new'
                            ? 'bg-amber-100 text-amber-900'
                            : req.status === 'scheduled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'completed'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 mt-2 flex items-center justify-between">
                      <span className="font-medium text-stone-800">{req.clientName}</span>
                      <span className="text-[11px] text-stone-400">{req.postcode}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{req.assignedStaff || 'Unassigned Crew'}</span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        £{req.estimatedValue ? req.estimatedValue.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                No client requests found matching the current filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Request Dossier & Operational Controls (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-20">
              {/* Request Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-900">
                      {selectedRequest.referenceNo}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {selectedRequest.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        selectedRequest.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {selectedRequest.priority} Priority
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                    {selectedRequest.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteRequest(selectedRequest.id)}
                    className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Archive request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Client & Property Information Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs">
                <div className="space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Client Credentials</span>
                  </div>
                  <div className="text-stone-900 font-semibold">{selectedRequest.clientName}</div>
                  <div className="text-stone-600 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{selectedRequest.clientEmail}</span>
                  </div>
                  <div className="text-stone-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{selectedRequest.clientPhone}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Property & Yard Terrain</span>
                  </div>
                  <div className="text-stone-900">{selectedRequest.propertyAddress}</div>
                  <div className="font-mono text-stone-600">{selectedRequest.postcode}</div>
                  <div className="text-[11px] text-stone-500">
                    Dimensions: {selectedRequest.yardDimensions || 'Standard residential grounds'}
                  </div>
                </div>
              </div>

              {/* Description & Work Scope */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-stone-800">Client Specification & Notes:</div>
                <p className="text-stone-600 leading-relaxed bg-stone-50/60 p-3 rounded-lg border border-stone-100">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Operational Action Controls */}
              <div className="pt-2 border-t border-stone-200 space-y-4">
                <div className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Shovel className="w-4 h-4 text-emerald-800" />
                  <span>Operations & Dispatch Control</span>
                </div>

                {/* Crew Assignment Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">
                      Assign Lead Groundsman
                    </label>
                    <select
                      value={assigneeSelect}
                      onChange={(e) => setAssigneeSelect(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="Callum Brooks (Senior Groundsman)">Callum Brooks (Senior Groundsman)</option>
                      <option value="Toby Miller (Topiary & Irrigation Specialist)">Toby Miller (Topiary Specialist)</option>
                      <option value="Arthur Pendelton (Site Director)">Arthur Pendelton (Site Director)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAssignCrew}
                      className="w-full py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md cursor-pointer transition-colors"
                    >
                      Assign Crew
                    </button>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {selectedRequest.status !== 'scheduled' && selectedRequest.status !== 'completed' && (
                    <button
                      onClick={handleConvertToBooking}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Convert to Scheduled Booking</span>
                    </button>
                  )}

                  {selectedRequest.status !== 'completed' && (
                    <button
                      onClick={() => onDispatchRequestAction(selectedRequest.id, 'mark_completed')}
                      className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mark Work Completed</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[11px] text-stone-500">Status:</span>
                    <select
                      value={selectedRequest.status}
                      onChange={(e) =>
                        onUpdateRequest(selectedRequest.id, {
                          status: e.target.value as RequestStatus,
                        })
                      }
                      className="px-2 py-1 text-xs border border-stone-300 rounded bg-white font-medium capitalize"
                    >
                      <option value="new">New</option>
                      <option value="under_review">Under Review</option>
                      <option value="quote_sent">Quote Sent</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Internal Staff Log & Timeline */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                    <span>Internal Staff Audit Log</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Updated {new Date(selectedRequest.updatedAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto bg-stone-50 p-3 rounded-lg border border-stone-200/80 text-[11px] text-stone-700">
                  {selectedRequest.internalNotes && selectedRequest.internalNotes.length > 0 ? (
                    selectedRequest.internalNotes.map((note, idx) => (
                      <div key={idx} className="border-b border-stone-200/60 pb-1 last:border-b-0 last:pb-0">
                        {note}
                      </div>
                    ))
                  ) : (
                    <div className="text-stone-400 italic">No staff notes recorded.</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Append staff log entry (e.g. verified tree order, customer phoned)..."
                    className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddStaffNote()}
                  />
                  <button
                    onClick={handleAddStaffNote}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 rounded-md cursor-pointer transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              Select a request from the list to view the operational dossier.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Log New Client Request */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateNewRequest} className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Dispatch Intake
                </span>
                <h2 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                  Log Inbound Client Request
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Record telephone, walk-in, or emergency call-outs directly into the backend management system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Client Name</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Sir Jasper Thorne"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Telephone Number</label>
                  <input
                    type="tel"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+44 7700 900..."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-medium text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="jasper.thorne@cotswolds.co.uk"
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="col-span-2 space-y-1">
                  <label className="font-medium text-stone-700">Property Address</label>
                  <input
                    type="text"
                    required
                    value={newPropertyAddress}
                    onChange={(e) => setNewPropertyAddress(e.target.value)}
                    placeholder="Manor House, Church Lane"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Postcode</label>
                  <input
                    type="text"
                    required
                    value={newPostcode}
                    onChange={(e) => setNewPostcode(e.target.value)}
                    placeholder="GL54 1AA"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Request Category</label>
                  <select
                    value={newRequestType}
                    onChange={(e) => setNewRequestType(e.target.value as RequestType)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="emergency_clearance">Emergency Clearance</option>
                    <option value="booking">Direct Booking</option>
                    <option value="quote_estimation">Quote Valuation</option>
                    <option value="planting_consultation">Planting Consultation</option>
                    <option value="turf_installation">Turf Grading</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Initial Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as RequestPriority)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-medium text-stone-700">Request Subject Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Tree Branch Clearance or Complete Lawn Re-turfing"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-medium text-stone-700">Detailed Description & Notes</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide scope of work, access details, gate lock combinations..."
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Log Ticket into Backend Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
