import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Sun,
  Cloud,
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Clock,
  MapPin,
  Calendar,
  Check,
  Compass,
  Thermometer,
  Layers,
} from 'lucide-react';
import { WeatherCareAlertsData, GardenCareAlert, GardenPlant, UserProfile } from '../types';
import { api } from '../api';
import { NavTab } from './Navigation';

interface WeatherCareAlertsBannerProps {
  currentUser: UserProfile;
  plants?: GardenPlant[];
  onSelectTab: (tab: NavTab) => void;
  onAlertActionApplied?: (alert: GardenCareAlert, message: string) => void;
}

const PRESET_LOCATIONS = [
  { name: 'Chipping Norton, Cotswolds', lat: 51.9427, lon: -1.5458 },
  { name: 'Woodstock & Blenheim, Oxfordshire', lat: 51.8488, lon: -1.3533 },
  { name: 'Oxford City & Meadows', lat: 51.7520, lon: -1.2577 },
  { name: 'Cheltenham & North Cotswolds', lat: 51.8994, lon: -2.0783 },
];

export const WeatherCareAlertsBanner: React.FC<WeatherCareAlertsBannerProps> = ({
  currentUser,
  plants = [],
  onSelectTab,
  onAlertActionApplied,
}) => {
  const [data, setData] = useState<WeatherCareAlertsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0]);
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState<boolean>(false);

  const fetchWeatherAlerts = async (loc = selectedLocation, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const plantNames = plants.map((p) => p.speciesName);
      const res = await api.getWeatherCareAlerts({
        lat: loc.lat,
        lon: loc.lon,
        locationName: loc.name,
        plants: plantNames,
      });
      setData(res);
      if (res.alerts.length > 0 && !activeAlertId) {
        setActiveAlertId(res.alerts[0].id);
      }
    } catch (err) {
      console.error('Failed to load weather care alerts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherAlerts(selectedLocation);
  }, [selectedLocation]);

  const handleApplyAction = (alert: GardenCareAlert) => {
    setAppliedActions((prev) => ({ ...prev, [alert.id]: true }));
    const msg = alert.type === 'watering'
      ? 'Irrigation delay applied! Automatic garden watering paused for 48 hours.'
      : alert.type === 'mowing'
      ? 'Lawn schedule updated: Grounds maintenance delayed until turf dries.'
      : `${alert.actionButtonLabel || 'Action'} acknowledged for ${alert.affectedTarget}.`;

    if (onAlertActionApplied) {
      onAlertActionApplied(alert, msg);
    }
  };

  const getWeatherIcon = (icon?: string, className = 'w-6 h-6') => {
    switch (icon) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud-rain':
        return <CloudRain className={`${className} text-sky-500`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'wind':
        return <Wind className={`${className} text-teal-500`} />;
      default:
        return <Cloud className={`${className} text-stone-400`} />;
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md border border-stone-800 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-stone-800 rounded w-48"></div>
          <div className="h-4 bg-stone-800 rounded w-28"></div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-stone-800/60 rounded-xl"></div>
          <div className="h-24 bg-stone-800/60 rounded-xl"></div>
          <div className="h-24 bg-stone-800/60 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentAlert = data.alerts.find((a) => a.id === activeAlertId) || data.alerts[0];
  const isRainy = data.weather.precipitationProbability >= 45 || data.weather.expectedRainMm >= 2.0;

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/80 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-emerald-900/40 relative overflow-hidden">
      {/* Decorative botanical pattern subtle background */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Live Weather & Location */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini AI Weather & Care Intelligence</span>
          </div>

          {/* Location selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-800/90 hover:bg-stone-800 px-3 py-1 rounded-lg border border-stone-700/80 transition-colors cursor-pointer"
              title="Change micro-climate location"
            >
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-medium truncate max-w-[200px]">{selectedLocation.name}</span>
              <span className="text-stone-400 text-[10px]">▼</span>
            </button>

            {isLocationMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-xl z-50 py-1.5 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-800">
                  Select Estate Location
                </div>
                {PRESET_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                      selectedLocation.name === loc.name ? 'text-emerald-400 font-semibold' : 'text-stone-300'
                    }`}
                  >
                    <span>{loc.name}</span>
                    {selectedLocation.name === loc.name && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[11px] text-stone-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {data.weather.updatedAt}</span>
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => fetchWeatherAlerts(selectedLocation, true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs border border-stone-700/70 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh local forecast and Gemini Care Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Scanning...' : 'Refresh Forecast'}</span>
          </button>

          <button
            onClick={() => onSelectTab('ai_assistant')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 text-xs border border-emerald-500/40 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Weather Telemetry (Left) + Prominent Care Alert (Center/Right) */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Live Meteorological Telemetry (4 cols) */}
        <div className="lg:col-span-4 bg-stone-950/70 rounded-xl p-5 border border-stone-800/90 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                Current Conditions
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {data.weather.temperature}°C
                </span>
                <span className="text-xs text-stone-400">
                  Feels like {data.weather.feelsLike}°C
                </span>
              </div>
              <div className="text-sm font-medium text-emerald-300 mt-1 flex items-center gap-2">
                <span>{data.weather.conditionText}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 shadow-inner">
              {getWeatherIcon(
                data.weather.dailyForecast[0]?.conditionIcon || 'cloud-rain',
                'w-8 h-8'
              )}
            </div>
          </div>

          {/* Meteorological Metrics Pill Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-800/70 flex items-center gap-2.5">
              <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">Precipitation</div>
                <div className="font-mono font-bold text-sky-200">
                  {data.weather.precipitationProbability}% ({data.weather.expectedRainMm}mm)
                </div>
              </div>
            </div>

            <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-800/70 flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">Relative Humidity</div>
                <div className="font-mono font-bold text-stone-200">{data.weather.humidity}%</div>
              </div>
            </div>

            <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-800/70 flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">Wind Gusts</div>
                <div className="font-mono font-bold text-stone-200">{data.weather.windSpeedKmH} km/h</div>
              </div>
            </div>

            <div className="bg-stone-900/80 p-2.5 rounded-lg border border-stone-800/70 flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">Soil Moisture</div>
                <div className="font-mono font-bold text-amber-200 truncate">
                  {data.groundskeepingWindow?.soilMoistureStatus || 'Optimal'}
                </div>
              </div>
            </div>
          </div>

          {/* 3-Day Micro Forecast */}
          <div className="border-t border-stone-800/80 pt-3">
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
              3-Day Groundskeeping Outlook
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {data.weather.dailyForecast.slice(0, 3).map((f) => (
                <div
                  key={f.day}
                  className="bg-stone-900/60 p-2 rounded-lg border border-stone-800/60 flex flex-col items-center justify-between"
                >
                  <span className="text-[11px] font-semibold text-stone-300">{f.day}</span>
                  <div className="my-1">{getWeatherIcon(f.conditionIcon, 'w-4 h-4')}</div>
                  <div className="text-[11px] font-mono font-bold text-stone-200">
                    {f.tempMax}° / {f.tempMin}°
                  </div>
                  <div className="text-[10px] text-sky-400 flex items-center gap-0.5 mt-0.5">
                    <span>{f.precipitationProbability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Primary Care Alert with Biological Context (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          {/* Alert Tabs Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Localized Alerts:</span>
            {data.alerts.map((alert, idx) => {
              const isSelected = alert.id === (currentAlert?.id || '');
              const isDone = appliedActions[alert.id];
              return (
                <button
                  key={alert.id}
                  onClick={() => setActiveAlertId(alert.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/60'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  ) : alert.urgency === 'urgent' || alert.urgency === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span>
                    {alert.type === 'watering' && 'Watering Directive'}
                    {alert.type === 'mowing' && 'Turf & Mowing'}
                    {alert.type === 'wind' && 'Wind & Staking'}
                    {alert.type === 'frost' && 'Frost Watch'}
                    {alert.type === 'pest_disease' && 'Foliage Check'}
                    {alert.type === 'soil' && 'Soil Nutrition'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Highlighted Care Alert Card */}
          {currentAlert && (
            <div
              className={`rounded-xl p-5 sm:p-6 border transition-all ${
                currentAlert.urgency === 'urgent'
                  ? 'bg-amber-950/40 border-amber-500/60'
                  : currentAlert.urgency === 'warning'
                  ? 'bg-stone-900/90 border-emerald-500/50 shadow-md'
                  : 'bg-stone-900/80 border-emerald-600/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        currentAlert.urgency === 'urgent'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : currentAlert.urgency === 'warning'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {currentAlert.type.replace('_', ' ')} · {currentAlert.urgency.toUpperCase()}
                    </span>
                    <span className="text-xs text-stone-400">Target: {currentAlert.affectedTarget}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide mt-1">
                    {currentAlert.headline}
                  </h3>
                </div>

                {/* Status indicator */}
                {appliedActions[currentAlert.id] && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Directive Applied</span>
                  </div>
                )}
              </div>

              {/* Message & RHS Botanical Rationale */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-3">
                {currentAlert.message}
              </p>

              {/* Direct groundskeeping instruction box */}
              <div className="mt-4 p-3 bg-stone-950/70 rounded-lg border border-stone-800 text-xs text-stone-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300">Groundskeeper Action: </strong>
                  <span>{currentAlert.actionAdvice}</span>
                </div>
              </div>

              {/* Interactive Action Bar */}
              <div className="mt-5 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyAction(currentAlert)}
                    disabled={appliedActions[currentAlert.id]}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      appliedActions[currentAlert.id]
                        ? 'bg-stone-800 text-stone-400 border border-stone-700 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-900/30'
                    }`}
                  >
                    {appliedActions[currentAlert.id] ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Directive Logged in Schedule</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{currentAlert.actionButtonLabel || 'Apply Care Directive'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectTab('ai_assistant')}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consult AI Assistant</span>
                  </button>
                </div>

                <div className="text-[11px] text-stone-400 flex items-center gap-2">
                  <span>Mowing: <strong className="text-white">{data.groundskeepingWindow?.mowingViability}</strong></span>
                  <span>·</span>
                  <span>Spraying: <strong className="text-white">{data.groundskeepingWindow?.sprayingViability}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Groundskeeping Readiness Summary Strip */}
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-stone-200">
                {data.groundskeepingWindow?.summary}
              </span>
            </div>

            <button
              onClick={() => onSelectTab('bookings')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 whitespace-nowrap cursor-pointer text-xs"
            >
              <span>Schedule Next Grounds Visit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
