import React, { useState } from 'react';
import { Booking, Invoice } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  MessageSquare,
  Upload,
  Receipt,
  CreditCard,
  Star,
  CheckCircle2,
  AlertTriangle,
  Camera,
} from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (bookingId: string, newDate: string, newSlot: 'morning' | 'afternoon' | 'full_day') => void;
  onCancel: (bookingId: string) => void;
  onMessageGardener: (gardenerName: string) => void;
  onViewInvoice?: (bookingRef: string) => void;
  onPayInvoice?: (bookingRef: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onReschedule,
  onCancel,
  onMessageGardener,
  onViewInvoice,
  onPayInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reschedule' | 'photos' | 'review'>('overview');
  const [newDate, setNewDate] = useState('2026-10-19');
  const [newSlot, setNewSlot] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Impeccable lawn stripes and tidy borders as always.');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  if (!isOpen || !booking) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhotos([...uploadedPhotos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setActiveTab('overview');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-900">
              {booking.bookingRef}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                booking.status === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : booking.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-900'
                  : booking.status === 'completed'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-stone-100 text-stone-800'
              }`}
            >
              {booking.status.replace('_', ' ')}
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            Garden Appointment Dossier
          </h2>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-semibold my-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'overview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reschedule')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'reschedule' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Reschedule
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'photos' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Photos ({uploadedPhotos.length})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'review' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Review
          </button>
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 text-xs">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="space-y-1">
                <div className="text-stone-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Scheduled Date & Window</span>
                </div>
                <div className="text-stone-900 font-bold text-sm">{booking.date}</div>
                <div className="text-stone-600 capitalize">{booking.timeSlot.replace('_', ' ')} Arrival Window</div>
              </div>

              <div className="space-y-1">
                <div className="text-stone-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Assigned Groundsman</span>
                </div>
                <div className="text-stone-900 font-bold text-sm">{booking.assignedGardener || 'Pending'}</div>
                <div className="text-stone-600">Allett & Stihl Electric Equipment</div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <div className="font-medium text-stone-700 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Property Address</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                {booking.address}
              </div>
            </div>

            {/* Client instructions */}
            <div className="space-y-1">
              <div className="font-medium text-stone-700">Client Scope & Gate Instructions</div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 leading-relaxed">
                {booking.notes}
              </div>
            </div>

            {/* Checklist */}
            {booking.checklist && (
              <div className="space-y-2">
                <div className="font-medium text-stone-700">Grounds Maintenance Checklist</div>
                <div className="space-y-1.5">
                  {Object.entries(booking.checklist).map(([task, done]) => (
                    <div
                      key={task}
                      className="flex items-center justify-between p-2 bg-stone-50 rounded border border-stone-200/80"
                    >
                      <span className={done ? 'line-through text-stone-400' : 'text-stone-800'}>
                        {task}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          done ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  onMessageGardener(booking.assignedGardener || 'Callum Brooks (Senior Groundsman)');
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Gardener</span>
              </button>

              {onViewInvoice && (
                <button
                  onClick={() => {
                    onViewInvoice(booking.bookingRef);
                    onClose();
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Invoice</span>
                </button>
              )}

              {booking.status === 'confirmed' && (
                <button
                  onClick={() => {
                    onCancel(booking.id);
                    onClose();
                  }}
                  className="ml-auto px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. RESCHEDULE */}
        {activeTab === 'reschedule' && (
          <div className="space-y-4 text-xs">
            <div>
              <div className="font-bold text-stone-900 text-sm">Select New Date & Slot</div>
              <p className="text-stone-500 mt-0.5">Free date modification up to 24 hours prior to arrival.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-700">New Service Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-stone-700">Arrival Window</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Morning (08:00 - 12:00)' },
                  { id: 'afternoon', label: 'Afternoon (13:00 - 17:00)' },
                  { id: 'full_day', label: 'Full Day' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setNewSlot(s.id as any)}
                    className={`p-2 rounded border text-center transition-colors cursor-pointer ${
                      newSlot === s.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onReschedule(booking.id, newDate, newSlot);
                onClose();
              }}
              className="w-full py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Confirm Reschedule
            </button>
          </div>
        )}

        {/* 3. UPLOAD PHOTOS */}
        {activeTab === 'photos' && (
          <div className="space-y-4 text-xs">
            <div>
              <div className="font-bold text-stone-900 text-sm">Site & Progress Photos</div>
              <p className="text-stone-500 mt-0.5">
                Upload photos of your overgrown areas before arrival or view completed work snapshots.
              </p>
            </div>

            <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center">
              <label className="cursor-pointer block space-y-2">
                <Camera className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="font-bold text-stone-700">Click to upload photos</div>
                <div className="text-[11px] text-stone-400">JPG, PNG up to 10MB</div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {uploadedPhotos.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Uploaded photo ${idx}`}
                    className="w-full h-24 object-cover rounded-lg border border-stone-200"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. REVIEW SERVICE */}
        {activeTab === 'review' && (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <div className="font-bold text-stone-900 text-sm">Rate & Review Groundsman Service</div>
              <p className="text-stone-500 mt-0.5">Help maintain Royal Horticultural Society standards.</p>
            </div>

            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
                <div className="font-bold">Review Received</div>
                <div>Thank you for rating {booking.assignedGardener}!</div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer p-1"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-700">Feedback Comments</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Submit Client Review
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
