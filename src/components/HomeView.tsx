import React from 'react';
import { ServiceItem } from '../types';
import { NavTab } from './Navigation';
import { Check, ArrowRight, Sparkles, Shield, Clock, Leaf, Scissors, SunMedium } from 'lucide-react';

interface HomeViewProps {
  services: ServiceItem[];
  onSelectTab: (tab: NavTab) => void;
  onSelectServiceToBook: (serviceId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  services,
  onSelectTab,
  onSelectServiceToBook,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-900 text-stone-100 shadow-md">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_lush_garden_1791387656845.jpg"
            alt="Lush British estate garden maintained by Pastures Gardening"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-95 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-12 sm:py-24 lg:py-28">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Master Horticultural Craftsmanship</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            English garden elegance, cultivated with precision.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
            From precision lawn striping and formal topiary sculpting to full seasonal clearances and
            AR-guided plant tracking. Trusted across the Cotswolds and South West.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectTab('bookings')}
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Book Garden Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('quotes')}
              className="px-6 py-3 text-sm font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Instant AI Quote</span>
            </button>

            <button
              onClick={() => onSelectTab('requests')}
              className="px-5 py-3 text-sm font-medium text-stone-200 hover:text-white border border-stone-700 hover:border-stone-500 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Client Requests</span>
            </button>
          </div>

          {/* Proof Adjacency Banner */}
          <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-stone-300">
            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">4,850+</div>
              <div className="text-xs text-stone-400 mt-0.5">Gardens Curated</div>
            </div>
            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">99.4%</div>
              <div className="text-xs text-stone-400 mt-0.5">On-Time Arrival</div>
            </div>
            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">100%</div>
              <div className="text-xs text-stone-400 mt-0.5">Green Waste Recycled</div>
            </div>
            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">RHS Certified</div>
              <div className="text-xs text-stone-400 mt-0.5">Horticultural Standards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Curated Garden & Grounds Services
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Transparent per-visit and day rates with zero hidden fees. Book single visits or recurring seasonal care.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('quotes')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Have custom garden dimensions? Use AI Estimator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between hover:border-emerald-600/40 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {service.name}
                  </h3>
                  {service.popular && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 whitespace-nowrap">
                      Signature
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[40px]">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-100 space-y-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                    £{service.basePrice}
                  </span>
                  <span className="text-xs text-stone-500 ml-1">/ {service.unit}</span>
                </div>

                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mechanism-to-Outcome Architecture */}
      <section className="bg-stone-100/70 border border-stone-200/90 rounded-2xl p-8 sm:p-10">
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            The Pastures Method
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            How we steward your outdoor living space
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Photometric AI & Soil Assessment
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload garden photos or input yard dimensions. Our horticultural algorithm calculates precise labor hours,
              turf health indexes, and debris volume down to the cubic yard.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Master Grounds Crew Deployment
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uniformed, background-vetted arborists and landscapers arrive with professional electric and commercial
              rotary equipment, respecting your property and pet safety protocols.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              AR Mapping & Botanical Longevity
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every specimen is logged on your interactive garden map. Track seasonal bloom cycles, automated watering
              schedules, and instant invoice payment via Stripe.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Feature Callout: AR Plant Tracking */}
      <section className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded border border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Augmented Reality</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            See your plants grow before you plant them.
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Our AR camera simulator projects mature lavender borders, hydrangea globes, and Japanese maples directly onto your lawn
            with accurate sunlight path simulation.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTab('ar_garden')}
              className="px-5 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              Launch AR Garden Simulator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
