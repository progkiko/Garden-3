import React, { useState } from 'react';
import { QuoteEstimate, Invoice, UserProfile } from '../types';
import {
  Sparkles,
  Receipt,
  FileText,
  Printer,
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Check,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { PasturesLogo } from './PasturesLogo';

interface AiQuoteInvoiceViewProps {
  quotes: QuoteEstimate[];
  invoices: Invoice[];
  currentUser: UserProfile;
  onAddQuote: (quote: QuoteEstimate) => void;
  onAddInvoice: (invoice: Invoice) => void;
  onPayInvoice: (invoice: Invoice) => void;
  onBookFromQuote: (quote: QuoteEstimate) => void;
  initialTab?: 'estimator' | 'invoices';
  onUpdateQuote?: (quote: QuoteEstimate) => void;
}

export const AiQuoteInvoiceView: React.FC<AiQuoteInvoiceViewProps> = ({
  quotes,
  invoices,
  currentUser,
  onAddQuote,
  onAddInvoice,
  onPayInvoice,
  onBookFromQuote,
  initialTab = 'estimator',
  onUpdateQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'estimator' | 'invoices'>(initialTab);
  const [quoteSubView, setQuoteSubView] = useState<'estimator' | 'list'>('estimator');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'history'>('all');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Estimator Form State
  const [gardenSize, setGardenSize] = useState('Medium cottage garden (approx 140 m²)');
  const [condition, setCondition] = useState('Overgrown borders, brambles present, and thatched lawn');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Lawn Mowing & Edge Sharpening',
    'Perimeter Hedge Reduction',
    'Border Clearance & Mulching',
  ]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestEstimate, setLatestEstimate] = useState<QuoteEstimate | null>(quotes[0] || null);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(invoices[0] || null);

  const availableServicesList = [
    'Lawn Mowing & Edge Sharpening',
    'Perimeter Hedge Reduction',
    'Border Clearance & Mulching',
    'Bramble & Ivy Excavation',
    'Turf Stripping & New Lawn Laying',
    'Smart Drip Irrigation Installation',
  ];

  const handleToggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gardenSize,
          condition,
          services: selectedServices,
          notes: customerNotes,
          imageBase64: uploadedImage || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.estimate) {
        const est = data.estimate;
        const newQuote: QuoteEstimate = {
          id: `quote-${Date.now()}`,
          quoteRef: `QUO-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: currentUser.name,
          customerEmail: currentUser.email,
          propertyAddress: currentUser.address,
          gardenSizeDesc: gardenSize,
          assessmentSummary: est.assessmentSummary,
          difficultyRating: est.difficultyRating,
          estimatedHours: est.estimatedHours,
          recommendedCrewSize: est.recommendedCrewSize,
          lineItems: est.lineItems,
          wasteVolumeBags: est.wasteVolumeBags,
          subtotal: est.subtotal,
          greenWasteFee: est.greenWasteFee,
          taxVat: est.taxVat,
          total: est.total,
          equipmentRecommended: est.equipmentRecommended || [],
          proGardenerTips: est.proGardenerTips || [],
          status: 'draft',
          createdAt: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        };

        onAddQuote(newQuote);
        setLatestEstimate(newQuote);
      }
    } catch (err) {
      console.error('Estimate failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConvertToInvoice = (quote: QuoteEstimate) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      quoteId: quote.id,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerAddress: quote.propertyAddress || currentUser.address,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      lineItems: quote.lineItems,
      subtotal: quote.subtotal,
      greenWasteFee: quote.greenWasteFee,
      taxVat: quote.taxVat,
      total: quote.total,
      paymentStatus: 'unpaid',
    };

    onAddInvoice(newInvoice);
    setActiveInvoice(newInvoice);
    setActiveTab('invoices');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {activeTab === 'estimator' ? 'Quotations & AI Estimator' : 'Billing Ledger & Payments'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {activeTab === 'estimator'
              ? 'Generate photometric quotes, upload photos, and accept or reject estimates.'
              : 'Download tax invoices, inspect payment history, and settle with Stripe.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-stone-200/80 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('estimator')}
            className={`px-3.5 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'estimator'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quotes & AI Estimator ({quotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
            <span>Payments & Invoices ({invoices.length})</span>
          </button>
        </div>
      </div>

      {/* Quote selector bar when in Quotes tab */}
      {activeTab === 'estimator' && quotes.length > 0 && (
        <div className="bg-stone-100/70 p-3 rounded-xl border border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="font-semibold text-stone-700">Quote List:</span>
            {quotes.map((q) => (
              <button
                key={q.id}
                onClick={() => setLatestEstimate(q)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  latestEstimate?.id === q.id
                    ? 'bg-white text-emerald-950 font-bold shadow-2xs border border-emerald-300'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                <span>{q.quoteRef}</span>
                <span className="font-mono text-[10px] tabular-nums text-stone-500">£{q.total}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    q.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : q.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {q.status || 'draft'}
                </span>
              </button>
            ))}
          </div>
          <span className="text-[11px] text-stone-500">Click quote to view details or use form below to run new estimate</span>
        </div>
      )}

      {/* TAB 1: AI QUOTE ESTIMATOR */}
      {activeTab === 'estimator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleRunAiEstimate} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Garden Job Parameters</span>
                </h2>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Gemini 3.8 Flash
                </span>
              </div>

              {/* Photo Upload Slot */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">
                  Garden Photo (Optional Photometric Analysis)
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center hover:border-emerald-600/70 transition-colors">
                  {uploadedImage ? (
                    <div className="relative group">
                      <img
                        src={uploadedImage}
                        alt="Uploaded garden"
                        className="h-32 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer hover:bg-stone-900"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-1">
                      <Upload className="w-5 h-5 text-stone-400 mx-auto" />
                      <div className="text-xs text-stone-600 font-medium">
                        Click to upload yard or overgrown hedge photo
                      </div>
                      <div className="text-[10px] text-stone-400">PNG, JPG up to 10MB</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Yard Size & Terrain */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">
                  Approximate Yard Area & Dimensions
                </label>
                <select
                  value={gardenSize}
                  onChange={(e) => setGardenSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  <option value="Compact Courtyard / Patio (under 50 m²)">Compact Courtyard / Patio (under 50 m²)</option>
                  <option value="Medium cottage garden (approx 140 m²)">Medium cottage garden (approx 140 m²)</option>
                  <option value="Substantial suburban garden (approx 280 m²)">Substantial suburban garden (approx 280 m²)</option>
                  <option value="Estate grounds / Acreage (over 600 m²)">Estate grounds / Acreage (over 600 m²)</option>
                </select>
              </div>

              {/* Current Terrain Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">
                  Current Condition & Growth Level
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-white"
                >
                  <option value="Routine Maintenance (healthy lawn, light hedge growth)">Routine Maintenance (healthy lawn, light hedge growth)</option>
                  <option value="Overgrown borders, brambles present, and thatched lawn">Overgrown borders, brambles present, and thatched lawn</option>
                  <option value="Heavy Jungle Overhaul (neglected 12+ months, high brush)">Heavy Jungle Overhaul (neglected 12+ months, high brush)</option>
                  <option value="Post-Winter Rejuvenation & Spring Bed Preparation">Post-Winter Rejuvenation & Spring Bed Preparation</option>
                </select>
              </div>

              {/* Services Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-700">
                  Services to Include in Estimate
                </label>
                <div className="space-y-1.5">
                  {availableServicesList.map((srv) => {
                    const isChecked = selectedServices.includes(srv);
                    return (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => handleToggleService(srv)}
                        className={`w-full text-left px-3 py-2 rounded-md border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium'
                            : 'border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <span>{srv}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">
                  Specific Requests or Access Details
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g., Narrow alleyway access, take away all waste..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating Garden Estimates...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Calculate Instant AI Quote</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Display: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {latestEstimate ? (
              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-xs">
                {/* Quote Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {latestEstimate.quoteRef}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        Difficulty: {latestEstimate.difficultyRating}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                      Horticultural Job Estimate
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {latestEstimate.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated: QuoteEstimate = { ...latestEstimate, status: 'approved' };
                          setLatestEstimate(updated);
                          if (onUpdateQuote) onUpdateQuote(updated);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Quote</span>
                      </button>
                    )}
                    {latestEstimate.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated: QuoteEstimate = { ...latestEstimate, status: 'rejected' };
                          setLatestEstimate(updated);
                          if (onUpdateQuote) onUpdateQuote(updated);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300 rounded-md cursor-pointer transition-colors"
                      >
                        <span>Reject Quote</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleConvertToInvoice(latestEstimate)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Convert to Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookFromQuote(latestEstimate)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </button>
                  </div>
                </div>

                {/* Botanical Assessment Callout */}
                <div className="bg-stone-50 rounded-lg p-4 border border-stone-200/80 text-xs space-y-2">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Botanical & Site Overview</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    {latestEstimate.assessmentSummary}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-stone-500 font-medium">
                    <span>Crew Required: <strong className="text-stone-900">{latestEstimate.recommendedCrewSize} gardeners</strong></span>
                    <span>·</span>
                    <span>Estimated Labor: <strong className="text-stone-900 tabular-nums">{latestEstimate.estimatedHours} hours</strong></span>
                    <span>·</span>
                    <span>Waste Bags: <strong className="text-stone-900 tabular-nums">~{latestEstimate.wasteVolumeBags} bags</strong></span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 font-medium pb-2">
                        <th className="py-2">Description</th>
                        <th className="py-2">Category</th>
                        <th className="py-2 text-right">Qty</th>
                        <th className="py-2 text-right">Unit Price</th>
                        <th className="py-2 text-right">Total (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {latestEstimate.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 font-medium text-stone-900 pr-2">
                            {item.description}
                          </td>
                          <td className="py-2.5 text-stone-500">{item.category}</td>
                          <td className="py-2.5 text-right font-mono tabular-nums text-stone-700">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2.5 text-right font-mono tabular-nums text-stone-700">
                            £{item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold tabular-nums text-stone-900">
                            £{item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation breakdown */}
                <div className="pt-3 border-t border-stone-200 flex justify-end">
                  <div className="w-full sm:w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Services Subtotal:</span>
                      <span className="font-mono tabular-nums">£{latestEstimate.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Green Waste Disposal:</span>
                      <span className="font-mono tabular-nums">£{latestEstimate.greenWasteFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>VAT (20%):</span>
                      <span className="font-mono tabular-nums">£{latestEstimate.taxVat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Estimated Total:</span>
                      <span className="font-mono text-emerald-900 tabular-nums">
                        £{latestEstimate.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equipment & Pro Tips */}
                {latestEstimate.proGardenerTips && latestEstimate.proGardenerTips.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
                    <div className="font-semibold text-stone-800">Horticultural Guidance Notes:</div>
                    <ul className="list-disc list-inside space-y-1 text-stone-600">
                      {latestEstimate.proGardenerTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
                <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-stone-800">No Quote Generated Yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Select your garden criteria on the left and run our photometric estimator to receive a comprehensive quote.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & FORMAL PDF BILLING */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Invoices List: 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Invoices & Ledger ({invoices.length})
              </h3>
              <div className="flex items-center bg-stone-100 p-0.5 rounded-md text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setInvoiceFilter('all')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    invoiceFilter === 'all' ? 'bg-white text-emerald-950 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceFilter('history')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    invoiceFilter === 'history' ? 'bg-white text-emerald-950 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Payment History
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {invoices
                .filter((inv) => (invoiceFilter === 'history' ? inv.paymentStatus === 'paid' : true))
                .map((inv) => {
                const isSelected = activeInvoice?.id === inv.id;
                return (
                  <button
                    key={inv.id}
                    onClick={() => setActiveInvoice(inv)}
                    className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-700 bg-white shadow-sm ring-1 ring-emerald-700'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 mt-2 truncate">
                      {inv.customerName}
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400">Due: {inv.dueDate}</span>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        £{inv.total.toFixed(2)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Invoice Document Viewer: 8 cols */}
          <div className="lg:col-span-8">
            {activeInvoice ? (
              <div className="space-y-4">
                {/* Action Bar */}
                <div className="flex items-center justify-between bg-stone-100/80 p-3 rounded-lg border border-stone-200 no-print">
                  <div className="text-xs text-stone-600">
                    Status:{' '}
                    <strong
                      className={`capitalize ${
                        activeInvoice.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {activeInvoice.paymentStatus}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-md cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>

                    {activeInvoice.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => onPayInvoice(activeInvoice)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via Stripe</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Printable Invoice Container */}
                <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8 invoice-card">
                  {/* Top Branding & Invoice Meta */}
                  <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-stone-200 pb-8">
                    <div>
                      <PasturesLogo variant="horizontal" size="md" className="mb-2" />
                      <div className="text-xs text-stone-500 mt-1 leading-relaxed">
                        Cotswold Horticultural Depot · Stroud Valley · GL5 3PQ<br />
                        Company No. 09482103 · VAT Reg: GB 284 9281 92<br />
                        contact@pasturesgardening.co.uk
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="font-serif text-2xl font-bold text-stone-900">
                        TAX INVOICE
                      </div>
                      <div className="font-mono text-xs font-bold text-emerald-900 mt-1">
                        {activeInvoice.invoiceNumber}
                      </div>
                      <div className="text-xs text-stone-500 mt-2">
                        Issue Date: <strong className="text-stone-800">{activeInvoice.issueDate}</strong><br />
                        Due Date: <strong className="text-stone-800">{activeInvoice.dueDate}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Billed To Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div>
                      <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        Billed To
                      </div>
                      <div className="font-bold text-stone-900 text-sm">{activeInvoice.customerName}</div>
                      <div className="text-stone-600 mt-0.5 leading-relaxed">
                        {activeInvoice.customerAddress}<br />
                        {activeInvoice.customerEmail}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
                        Payment Terms
                      </div>
                      <div className="text-stone-600 leading-relaxed">
                        Net 14 Days<br />
                        Stripe Online Card, BACS Transfer, or Apple Pay<br />
                        Account: 40-18-20 / 92837461
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b-2 border-stone-200 text-stone-600 font-bold">
                          <th className="py-2.5">Item Description</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5 text-right">Quantity</th>
                          <th className="py-2.5 text-right">Unit Rate</th>
                          <th className="py-2.5 text-right">Amount (£)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {activeInvoice.lineItems.map((li) => (
                          <tr key={li.id}>
                            <td className="py-3 font-medium text-stone-900">{li.description}</td>
                            <td className="py-3 text-stone-500">{li.category}</td>
                            <td className="py-3 text-right font-mono tabular-nums text-stone-700">
                              {li.quantity} {li.unit}
                            </td>
                            <td className="py-3 text-right font-mono tabular-nums text-stone-700">
                              £{li.unitPrice.toFixed(2)}
                            </td>
                            <td className="py-3 text-right font-mono font-bold tabular-nums text-stone-900">
                              £{li.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Breakdown */}
                  <div className="pt-4 border-t-2 border-stone-200 flex justify-end">
                    <div className="w-full sm:w-64 space-y-2 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Services Subtotal:</span>
                        <span className="font-mono tabular-nums">£{activeInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Green Waste Recycling:</span>
                        <span className="font-mono tabular-nums">£{activeInvoice.greenWasteFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>VAT (20%):</span>
                        <span className="font-mono tabular-nums">£{activeInvoice.taxVat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                        <span>Total Due:</span>
                        <span className="font-mono text-emerald-950 tabular-nums">
                          £{activeInvoice.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Terms */}
                  <div className="pt-6 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
                    <p>All gardening works executed according to British Horticultural Standards (BS 4428:1989).</p>
                    <p>Thank you for partnering with Pastures Gardening to nurture your landscape.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <Receipt className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-700 mt-2">No Invoice Selected</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
