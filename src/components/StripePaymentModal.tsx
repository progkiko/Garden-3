import React, { useState } from 'react';
import { Invoice } from '../types';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Lock } from 'lucide-react';

interface StripePaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoiceId: string) => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  // Card input mock states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('11/28');
  const [cvc, setCvc] = useState('883');
  const [cardHolder, setCardHolder] = useState(invoice.customerName);

  if (!isOpen) return null;

  const tipAmount = (invoice.total * tipPercentage) / 100;
  const grandTotal = invoice.total + tipAmount;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidSuccess(true);

      setTimeout(() => {
        onSuccess(invoice.id);
        setIsPaidSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {isPaidSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Payment Successful
            </h3>
            <p className="text-xs text-stone-600">
              £{grandTotal.toFixed(2)} received for {invoice.invoiceNumber}. Receipt dispatched to {invoice.customerEmail}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Stripe 256-Bit TLS Encryption</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Pay Pastures Invoice
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Statement: <strong className="font-mono text-stone-800">{invoice.invoiceNumber}</strong>
              </p>
            </div>

            {/* Payment method selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'card' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'apple_pay' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <span> Pay</span>
              </button>
            </div>

            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-stone-700">Security CVC</label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-center text-xs text-stone-600">
                Double click side button to complete with Apple Pay on registered device.
              </div>
            )}

            {/* Groundsman Tip Selector */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <label className="text-xs font-medium text-stone-700">
                Optional Grounds Crew Gratuity
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTipPercentage(pct)}
                    className={`py-1.5 rounded border transition-colors cursor-pointer ${
                      tipPercentage === pct
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {pct === 0 ? 'No tip' : `+${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Ledger */}
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Invoice Subtotal & VAT:</span>
                <span className="font-mono tabular-nums">£{invoice.total.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Crew Tip ({tipPercentage}%):</span>
                  <span className="font-mono tabular-nums">£{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                <span>Total Charge:</span>
                <span className="font-mono text-emerald-900 tabular-nums">
                  £{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Stripe Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Pay £{grandTotal.toFixed(2)} GBP</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
