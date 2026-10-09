import React, { useState, useRef, useEffect } from 'react';
import { GardenPlant, PlantDiagnosisResult, CameraVisionResult } from '../types';
import { api } from '../api';
import {
  Sprout,
  Sun,
  Droplet,
  Layers,
  Camera,
  Maximize2,
  Calendar,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Scissors,
  Loader2,
  RotateCcw,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react';

interface GardenTrackingArViewProps {
  plants: GardenPlant[];
  onUpdatePlant: (plant: GardenPlant) => void;
  onAddPlant: (plant: GardenPlant) => void;
}

export const GardenTrackingArView: React.FC<GardenTrackingArViewProps> = ({
  plants,
  onUpdatePlant,
  onAddPlant,
}) => {
  const [viewMode, setViewMode] = useState<'grid2d' | 'ar_simulator'>('grid2d');
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(plants[0] || null);
  const [showSunHeatmap, setShowSunHeatmap] = useState(false);
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('summer');

  // AR Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gemini AI Camera Vision state
  const [isInspectingVision, setIsInspectingVision] = useState(false);
  const [visionResult, setVisionResult] = useState<CameraVisionResult | null>(null);

  // AI Plant Doctor diagnosis state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<PlantDiagnosisResult | null>(null);
  const [customSymptom, setCustomSymptom] = useState('Leaves yellowing around edges, slow root development');

  // New plant library for drag/add
  const plantCatalog: Partial<GardenPlant>[] = [
    {
      speciesName: 'English Lavender',
      botanicalName: 'Lavandula angustifolia',
      category: 'shrub',
      sunlight: 'full_sun',
      waterCadenceDays: 5,
      notes: 'Fragrant purple flower spikes, attracts pollinating bees.',
      bloomSeason: 'Mid Summer',
    },
    {
      speciesName: 'Annabelle Hydrangea',
      botanicalName: 'Hydrangea arborescens',
      category: 'shrub',
      sunlight: 'partial_shade',
      waterCadenceDays: 2,
      notes: 'Prolific ivory blooms requiring moist, humus-rich soil.',
      bloomSeason: 'Summer to Autumn',
    },
    {
      speciesName: 'Japanese Maple',
      botanicalName: 'Acer palmatum',
      category: 'tree',
      sunlight: 'partial_shade',
      waterCadenceDays: 7,
      notes: 'Architectural specimen with fiery autumnal foliage.',
      bloomSeason: 'Foliage focus',
    },
    {
      speciesName: 'Boxwood Sphere',
      botanicalName: 'Buxus sempervirens',
      category: 'shrub',
      sunlight: 'partial_shade',
      waterCadenceDays: 6,
      notes: 'Formal evergreen topiary ball for entrance paths.',
      bloomSeason: 'Evergreen',
    },
    {
      speciesName: 'Heritage Tomato',
      botanicalName: 'Solanum lycopersicum',
      category: 'vegetable',
      sunlight: 'full_sun',
      waterCadenceDays: 2,
      notes: 'Sweet heirloom vine for warm sunny borders.',
      bloomSeason: 'Late Summer harvest',
    },
  ];

  // Camera toggle handler
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (err) {
        console.warn('Camera access unavailable, using high-resolution simulator backdrop', err);
        setIsCameraActive(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleWaterPlant = (plant: GardenPlant) => {
    const updated: GardenPlant = {
      ...plant,
      health: 'thriving',
      lastWatered: new Date().toISOString().split('T')[0],
    };
    onUpdatePlant(updated);
    setSelectedPlant(updated);
  };

  const handleDiagnoseHealth = async () => {
    if (!selectedPlant) return;
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    try {
      const res = await fetch('/api/plant-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantName: `${selectedPlant.speciesName} (${selectedPlant.botanicalName})`,
          symptoms: customSymptom,
          sunlight: selectedPlant.sunlight,
          soilType: 'Cotswold Brash & Loam blend',
        }),
      });

      const data = await res.json();
      if (data.success && data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
      }
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleInspectArCamera = async () => {
    setIsInspectingVision(true);
    try {
      let base64Image = '';
      if (isCameraActive && videoRef.current && arCanvasRef.current) {
        const video = videoRef.current;
        const canvas = arCanvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          base64Image = canvas.toDataURL('image/jpeg', 0.85);
        }
      }

      if (!base64Image) {
        // Fallback to sample garden image for simulation
        base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...';
      }

      const vision = await api.analyzeCameraVision(
        base64Image,
        'image/jpeg',
        `Current season: ${season}. Survey lawn grass health, weed infestation, and perimeter border shrub condition.`
      );
      setVisionResult(vision);
    } catch (err) {
      console.error('AR Camera vision inspection failed:', err);
    } finally {
      setIsInspectingVision(false);
    }
  };

  const handleCellClick = (x: number, y: number) => {
    const existing = plants.find((p) => p.x === x && p.y === y);
    if (existing) {
      setSelectedPlant(existing);
    } else {
      // Add a plant from catalog
      const template = plantCatalog[Math.floor(Math.random() * plantCatalog.length)];
      const newPlant: GardenPlant = {
        id: `plant-${Date.now()}`,
        x,
        y,
        speciesName: template.speciesName || 'Garden Specimen',
        botanicalName: template.botanicalName || 'Flora britannica',
        category: (template.category as any) || 'flower',
        health: 'good',
        sunlight: (template.sunlight as any) || 'full_sun',
        waterCadenceDays: template.waterCadenceDays || 4,
        lastWatered: new Date().toISOString().split('T')[0],
        plantedDate: new Date().toISOString().split('T')[0],
        notes: template.notes || 'Newly added border planting.',
        arScale: 1.0,
        bloomSeason: template.bloomSeason || 'Summer',
      };
      onAddPlant(newPlant);
      setSelectedPlant(newPlant);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Garden Mapping & AR Plant Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            2D coordinate zoning, sunlight heatmaps, and simulated AR projection with RHS botanical health diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-stone-200/80 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid2d')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid2d'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>2D Garden Grid</span>
            </button>
            <button
              onClick={() => setViewMode('ar_simulator')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewMode === 'ar_simulator'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>AR Camera Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {viewMode === 'grid2d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 2D Interactive Grid: 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900">
                    Estate Garden Plan (12 × 8 Zones)
                  </span>
                  <span className="text-[11px] text-stone-500">Click any cell to place or inspect</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSunHeatmap(!showSunHeatmap)}
                    className={`px-2.5 py-1 text-xs rounded border cursor-pointer transition-colors flex items-center gap-1.5 ${
                      showSunHeatmap
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showSunHeatmap ? 'Hide Sunlight Map' : 'Sunlight Overlay'}</span>
                  </button>
                </div>
              </div>

              {/* Grid Canvas */}
              <div className="relative overflow-x-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                <div
                  className="grid grid-cols-12 gap-1.5 min-w-[560px] select-none"
                  style={{ gridTemplateRows: 'repeat(8, minmax(46px, 1fr))' }}
                >
                  {Array.from({ length: 96 }).map((_, idx) => {
                    const x = idx % 12;
                    const y = Math.floor(idx / 12);
                    const plant = plants.find((p) => p.x === x && p.y === y);
                    const isSelected = selectedPlant?.id === plant?.id;

                    // Compute sunlight zone
                    // y: 0-2 (North border = partial shade), 3-5 (Middle = full sun), 6-7 (South hedge = deep shade)
                    let sunClass = 'bg-emerald-900/10 hover:bg-emerald-800/20';
                    if (showSunHeatmap) {
                      if (y >= 6) sunClass = 'bg-indigo-100/90 border-indigo-200'; // deep shade
                      else if (y <= 2) sunClass = 'bg-amber-100/80 border-amber-200'; // partial sun
                      else sunClass = 'bg-amber-200/90 border-amber-300'; // full sun
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleCellClick(x, y)}
                        className={`h-12 rounded-lg border text-center flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'ring-2 ring-emerald-700 border-emerald-700 bg-emerald-100'
                            : plant
                            ? 'bg-white border-stone-300 hover:border-emerald-600'
                            : `border-stone-200/80 ${sunClass}`
                        }`}
                      >
                        {plant ? (
                          <div className="flex flex-col items-center">
                            <span className="text-sm">
                              {plant.category === 'tree' && '🌳'}
                              {plant.category === 'flower' && '🌸'}
                              {plant.category === 'shrub' && '🌿'}
                              {plant.category === 'herb' && '🌱'}
                              {plant.category === 'vegetable' && '🍅'}
                            </span>
                            <span className="text-[9px] font-semibold text-stone-800 truncate max-w-[42px] leading-tight">
                              {plant.speciesName.split(' ')[0]}
                            </span>
                            {plant.health === 'needs_water' && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1" title="Needs Water" />
                            )}
                            {plant.health === 'prune_due' && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1" title="Pruning Due" />
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            +
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                    Thriving
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    Water Due
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Pruning Due
                  </span>
                </div>
                <div>Showing {plants.length} logged specimens</div>
              </div>
            </div>
          </div>

          {/* Plant Profile & RHS Doctor: 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            {selectedPlant ? (
              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs">
                <div className="border-b border-stone-100 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Botanical Profile
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      {selectedPlant.speciesName}
                    </h3>
                    <p className="text-xs text-stone-500 italic">
                      {selectedPlant.botanicalName}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      selectedPlant.health === 'thriving'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedPlant.health === 'needs_water'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {selectedPlant.health.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Category:</span>
                    <span className="font-medium text-stone-900 capitalize">{selectedPlant.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Sunlight Needs:</span>
                    <span className="font-medium text-stone-900 capitalize">{selectedPlant.sunlight.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Watering Frequency:</span>
                    <span className="font-medium text-stone-900">Every {selectedPlant.waterCadenceDays} days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Last Drenched:</span>
                    <span className="font-medium text-stone-900">{selectedPlant.lastWatered}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Prime Bloom Season:</span>
                    <span className="font-medium text-stone-900">{selectedPlant.bloomSeason}</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 border border-stone-200/70">
                  <div className="font-semibold text-stone-800 mb-1">Horticulturist Notes:</div>
                  <p>{selectedPlant.notes}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleWaterPlant(selectedPlant)}
                    className="flex-1 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Droplet className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Log Water Drench</span>
                  </button>
                </div>

                {/* AI Plant Doctor Section */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>RHS AI Plant Doctor</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Gemini 3.8 Flash</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-stone-600">Observed Condition / Symptoms</label>
                    <input
                      type="text"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      placeholder="e.g. Yellow leaves, powdery mildew, brown tips"
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <button
                    onClick={handleDiagnoseHealth}
                    disabled={isDiagnosing}
                    className="w-full py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-md cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDiagnosing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Botanical Symptoms...</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Diagnose Plant Health</span>
                      </>
                    )}
                  </button>

                  {/* Diagnosis Output */}
                  {diagnosisResult && (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs space-y-2 mt-2">
                      <div className="font-semibold text-emerald-950 flex items-center justify-between">
                        <span>Diagnosis: {diagnosisResult.severity} Severity</span>
                      </div>
                      <p className="text-emerald-900 text-[11px] leading-relaxed">
                        <strong>Probable Cause:</strong> {diagnosisResult.probableCause}
                      </p>
                      <p className="text-emerald-900 text-[11px] leading-relaxed">
                        <strong>Prescription:</strong> {diagnosisResult.immediateAction}
                      </p>
                      <div className="text-[10px] text-emerald-800 pt-1 border-t border-emerald-200">
                        {diagnosisResult.wateringSchedule} · {diagnosisResult.fertilizerGuidance}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                Click any plant specimen on the map to inspect care instructions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AR Camera Simulator View */}
      {viewMode === 'ar_simulator' && (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 sm:p-8 text-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Augmented Reality Spatial HUD</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">
                AR Plant Projection & Growth Simulator
              </h2>
              <p className="text-xs text-stone-400 mt-1 max-w-xl">
                Align your camera view with your lawn borders. Watch seasonal leaf colors and bloom stages unfold.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleCamera}
                className="px-3.5 py-2 text-xs font-semibold bg-stone-800 text-stone-200 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap border border-stone-700"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isCameraActive ? 'Stop Live Feed' : 'Start Live Camera'}</span>
              </button>

              <button
                onClick={handleInspectArCamera}
                disabled={isInspectingVision}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
              >
                {isInspectingVision ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Frame...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Inspect with Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Seasonal Simulation Slider */}
          <div className="bg-stone-950/80 rounded-xl p-4 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Simulate Season:</span>
            </div>

            <div className="flex items-center p-1 bg-stone-900 rounded-lg text-xs font-semibold border border-stone-800">
              {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors capitalize ${
                    season === s
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="text-xs text-emerald-400">
              {season === 'spring' && '🌱 Fresh foliage & emerging bud clusters'}
              {season === 'summer' && '🌸 Peak bloom & rich vibrant green'}
              {season === 'autumn' && '🍂 Crimson maple tones & seed heads'}
              {season === 'winter' && '❄️ Evergreen architectural silhouettes'}
            </div>
          </div>

          {/* AR Viewport Container */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-700/80 bg-stone-950 flex items-center justify-center">
            {/* Real Webcam Video or Realistic Garden Backdrop */}
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/src/assets/images/hero_lush_garden_1791387656845.jpg"
                alt="AR garden backdrop"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  season === 'spring'
                    ? 'filter saturate-125 brightness-105'
                    : season === 'autumn'
                    ? 'filter hue-rotate-15 sepia-25 saturate-110'
                    : season === 'winter'
                    ? 'filter contrast-110 brightness-90 saturate-60'
                    : 'filter saturate-100'
                }`}
              />
            )}

            {/* Overlaid AR HUD Reticle */}
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/30 rounded-xl m-4 flex flex-col justify-between p-4">
              <div className="flex justify-between items-start text-[11px] font-mono text-emerald-400 tracking-wider">
                <div className="bg-stone-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
                  AR HUD ACTIVE // 60 FPS // GROUND PLANE LOCKED
                </div>
                <div className="bg-stone-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
                  SUN ANGLE: 48° S · LUX: 45,000
                </div>
              </div>

              {/* Center Crosshair */}
              <div className="self-center flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-emerald-400/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
              </div>

              {/* Bottom AR telemetry */}
              <div className="flex justify-between items-end text-[11px] font-mono text-emerald-400">
                <div className="bg-stone-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
                  SEASON: {season.toUpperCase()} // TURF SOIL: OPTIMAL MOISTURE
                </div>
                <div className="bg-stone-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
                  SPECIES TRACKED: {plants.length}
                </div>
              </div>
            </div>

            {/* Interactive Projected AR Plant Markers */}
            <div className="absolute inset-0 pointer-events-auto">
              {plants.slice(0, 4).map((p, idx) => {
                // Spatial placement simulation
                const leftPos = `${20 + idx * 22}%`;
                const topPos = `${45 + (idx % 2) * 15}%`;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlant(p)}
                    style={{ left: leftPos, top: topPos }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-110"
                  >
                    {/* Pulsing ground anchor ring */}
                    <div className="w-14 h-6 rounded-full border-2 border-emerald-400/80 bg-emerald-500/20 shadow-lg shadow-emerald-500/30 flex items-center justify-center mx-auto animate-pulse" />

                    {/* Plant holographic icon */}
                    <div className="text-3xl text-center -mt-8 drop-shadow-md">
                      {p.category === 'tree' && (season === 'autumn' ? '🍁' : '🌳')}
                      {p.category === 'flower' && (season === 'winter' ? '❄️' : '🌸')}
                      {p.category === 'shrub' && '🌿'}
                      {p.category === 'herb' && '🌱'}
                    </div>

                    {/* AR Tag Pill */}
                    <div className="mt-1 bg-stone-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500 whitespace-nowrap shadow-md">
                      {p.speciesName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
