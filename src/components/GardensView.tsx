import React, { useState } from 'react';
import { GardenPlant } from '../types';
import {
  Sprout,
  Sun,
  Droplet,
  MapPin,
  Calendar,
  Layers,
  History,
  Scissors,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Map,
  Box,
  Globe,
  Camera,
} from 'lucide-react';
import { GardenTrackingArView, GardenViewMode } from './GardenTrackingArView';

interface GardensViewProps {
  plants: GardenPlant[];
  onSelectPlant: (plant: GardenPlant) => void;
  onOpenGardenMap: () => void;
  onWaterPlant: (plant: GardenPlant) => void;
  onAddPlant?: (plant: GardenPlant) => void;
  onUpdatePlant?: (plant: GardenPlant) => void;
  initialSelectedPlantId?: string;
  initialGardenMapMode?: GardenViewMode;
}

export const GardensView: React.FC<GardensViewProps> = ({
  plants,
  onSelectPlant,
  onOpenGardenMap,
  onWaterPlant,
  onAddPlant,
  onUpdatePlant,
  initialSelectedPlantId,
  initialGardenMapMode = 'interactive_layout',
}) => {
  const [selectedGardenId, setSelectedGardenId] = useState('g1');
  const [activeTab, setActiveTab] = useState<'layout' | 'zones' | 'plants' | 'timeline' | 'history'>('layout');
  const [gardenMapMode, setGardenMapMode] = useState<GardenViewMode>(initialGardenMapMode);
  const [selectedSpecimen, setSelectedSpecimen] = useState<GardenPlant | null>(plants[0] || null);

  React.useEffect(() => {
    if (initialSelectedPlantId) {
      const match = plants.find((p) => p.id === initialSelectedPlantId);
      if (match) {
        setSelectedSpecimen(match);
        setActiveTab('plants');
      }
    }
  }, [initialSelectedPlantId, plants]);

  const gardens = [
    {
      id: 'g1',
      name: 'High Meadow House - South Formal Grounds',
      location: 'Chipping Campden, Cotswolds',
      areaM2: 180,
      soil: 'Limestone loam with rich humus top-dressing',
      aspect: 'South-South-West (High natural light)',
      zonesCount: 4,
    },
    {
      id: 'g2',
      name: 'Victorian Walled Herbarium & Orchard',
      location: 'Broadway Road, Gloucestershire',
      areaM2: 95,
      soil: 'Sheltered chalk-clay blend with gravel drainage',
      aspect: 'East facing (Morning sun, sheltered afternoon)',
      zonesCount: 3,
    },
  ];

  const currentGarden = gardens.find((g) => g.id === selectedGardenId) || gardens[0];

  const zones = [
    {
      id: 'za',
      name: 'Zone A: Roller Striped Lawn',
      type: 'Fine Turf',
      exposure: 'Full Sunlight',
      status: 'Recently scarified & cylinder striped',
      coverage: '85 m²',
    },
    {
      id: 'zb',
      name: 'Zone B: Herbaceous Lavender & Perennial Border',
      type: 'Cottage Border',
      exposure: 'Full Sunlight',
      status: 'Dense flower spikes, linalool aroma',
      coverage: '35 m²',
    },
    {
      id: 'zc',
      name: 'Zone C: Shaded Terrace & Acer Specimen',
      type: 'Sheltered Foliage',
      exposure: 'Partial Shade',
      status: 'Japanese Maple thriving',
      coverage: '30 m²',
    },
    {
      id: 'zd',
      name: 'Zone D: Culinary Stone Herb Beds',
      type: 'Raised Beds',
      exposure: 'Full Sunlight',
      status: 'Rosemary, thyme, and sage flourishing',
      coverage: '30 m²',
    },
  ];

  const maintenanceHistory = [
    { date: '04 Oct 2026', action: 'Lawn Cylinder Striping & Precision Edging', crew: 'Callum Brooks', bags: '2 sacks' },
    { date: '22 Sep 2026', action: 'Boxwood Topiary Sphere Leveling & Sweep', crew: 'Toby Miller', bags: '1 sack' },
    { date: '08 Sep 2026', action: 'Organic Mushroom Compost Mulch Application', crew: 'Callum Brooks', bags: '3 bulk bags' },
    { date: '15 Aug 2026', action: 'Smart Drip Irrigation Pressure Check', crew: 'Toby Miller', bags: 'None' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Quick Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Estate Topography & Flora Digital Twin
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Gardens & Spatial Landscape Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Interactive garden layout, 3D terrain orbit, 360° panoramic grounds tour, and verified arborist logs.
          </p>
        </div>

        {/* Quick View Mode Pills (Direct access to interactive layout, 3D, and 360) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/90 rounded-xl text-xs font-semibold shadow-inner self-start lg:self-auto">
          <button
            onClick={() => {
              setActiveTab('layout');
              setGardenMapMode('interactive_layout');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'layout' && gardenMapMode === 'interactive_layout'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Layout</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('layout');
              setGardenMapMode('view_3d');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'layout' && gardenMapMode === 'view_3d'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-300" />
            <span>3D Terrain Map</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('layout');
              setGardenMapMode('panorama_360');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'layout' && gardenMapMode === 'panorama_360'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>360° Panoramic Tour</span>
          </button>

          <button
            onClick={onOpenGardenMap}
            className="px-3 py-1.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
            title="Launch Dedicated AR HUD"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">AR HUD</span>
          </button>
        </div>
      </div>

      {/* Garden Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gardens.map((g) => {
          const isSelected = selectedGardenId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGardenId(g.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-700 bg-white ring-1 ring-emerald-700 shadow-sm'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-stone-900">{g.name}</span>
                {isSelected && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{g.location}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>{g.areaM2} m² grounds</span>
                <span>{g.zonesCount} distinct micro-zones</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
        {[
          { id: 'layout', label: '🗺️ Interactive Layout & 3D/360°' },
          { id: 'zones', label: 'Garden Zones' },
          { id: 'plants', label: `Specimens (${plants.length})` },
          { id: 'timeline', label: 'Plant Timeline' },
          { id: 'history', label: 'Maintenance History' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ${
              activeTab === t.id ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 0. INTERACTIVE GARDEN LAYOUT, 3D MAP & 360° PANORAMA */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <GardenTrackingArView
            plants={plants}
            onUpdatePlant={onUpdatePlant || onSelectPlant}
            onAddPlant={onAddPlant || ((p) => {})}
            initialMode={gardenMapMode}
          />
        </div>
      )}

      {/* 1. GARDEN ZONES */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">{zone.name}</h3>
                  <div className="text-xs text-stone-500">{zone.type} · {zone.coverage}</div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {zone.exposure}
                </span>
              </div>

              <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                <strong>Current State:</strong> {zone.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. PLANTS LIST */}
      {activeTab === 'plants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            {plants.map((p) => {
              const isSelected = selectedSpecimen?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedSpecimen(p)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {p.category === 'tree' && '🌳'}
                      {p.category === 'flower' && '🌸'}
                      {p.category === 'shrub' && '🌿'}
                      {p.category === 'herb' && '🌱'}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-stone-900">{p.speciesName}</div>
                      <div className="italic text-[11px] text-stone-500">{p.botanicalName}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      p.health === 'thriving' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {p.health.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Plant Detail View */}
          <div className="lg:col-span-6">
            {selectedSpecimen && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
                <div className="border-b border-stone-100 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Botanical Dossier
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                      {selectedSpecimen.speciesName}
                    </h3>
                    <div className="italic text-xs text-stone-500">{selectedSpecimen.botanicalName}</div>
                  </div>

                  <button
                    onClick={() => onWaterPlant(selectedSpecimen)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Droplet className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Log Water Drench</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-stone-700">
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                    <strong>Sunlight:</strong> {selectedSpecimen.sunlight.replace('_', ' ')}
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                    <strong>Watering:</strong> Every {selectedSpecimen.waterCadenceDays} days
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                    <strong>Last Drenched:</strong> {selectedSpecimen.lastWatered}
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                    <strong>Bloom Period:</strong> {selectedSpecimen.bloomSeason}
                  </div>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 leading-relaxed">
                  <strong>Groundsman Notes:</strong> {selectedSpecimen.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PLANT TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-xs text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Phenological Lifecycle Timeline
            </h3>
            <p className="text-stone-500 mt-0.5">Annual progression of your estate flora.</p>
          </div>

          <div className="space-y-4">
            {[
              { month: 'April', title: 'Spring Bud Break & Root Wake', note: 'Lavender produces fresh silver-green shoots.' },
              { month: 'June – July', title: 'Full Blossom & Pollinator Peak', note: 'Hydrangeas display 25cm ivory globes.' },
              { month: 'September', title: 'Autumn Harvest & Post-Bloom Pruning', note: 'Prune spent flower heads back to green buds.' },
              { month: 'November – February', title: 'Winter Dormancy & Frost Guard', note: 'Topiary boxwoods retain architectural structure.' },
            ].map((t, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-emerald-900 w-24 shrink-0">{t.month}</span>
                <div>
                  <div className="font-bold text-stone-900">{t.title}</div>
                  <div className="text-stone-600 mt-0.5">{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAINTENANCE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Verified Groundskeeper Work Log
            </h3>
            <span className="text-stone-400 font-mono">BS 4428 Certified</span>
          </div>

          <div className="divide-y divide-stone-100">
            {maintenanceHistory.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-stone-900">{item.action}</div>
                  <div className="text-stone-500">Lead: {item.crew} · Green Waste: {item.bags}</div>
                </div>
                <span className="font-mono text-stone-400">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
