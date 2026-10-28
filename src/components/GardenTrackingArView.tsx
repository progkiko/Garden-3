import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Compass,
  Eye,
  Globe,
  Box,
  Map,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Sliders,
  Wind,
  Clock,
  Check,
} from 'lucide-react';

interface GardenTrackingArViewProps {
  plants: GardenPlant[];
  onUpdatePlant: (plant: GardenPlant) => void;
  onAddPlant: (plant: GardenPlant) => void;
  initialMode?: GardenViewMode;
}

export type { GardenViewMode };

type GardenViewMode = 'interactive_layout' | 'view_3d' | 'panorama_360' | 'ar_camera';

interface PanoramaVantagePoint {
  id: string;
  name: string;
  description: string;
  backgroundGradient: string;
  bgSvgDataUri: string;
  hotspots: Array<{
    id: string;
    yaw: number; // 0 to 360
    pitch: number; // -30 to 30
    title: string;
    category: string;
    plantId?: string;
    health: string;
    note: string;
  }>;
}

export const GardenTrackingArView: React.FC<GardenTrackingArViewProps> = ({
  plants,
  onUpdatePlant,
  onAddPlant,
  initialMode = 'interactive_layout',
}) => {
  const [viewMode, setViewMode] = useState<GardenViewMode>(initialMode);
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(plants[0] || null);

  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode);
    }
  }, [initialMode]);

  // 2D & Overlay controls
  const [showSunHeatmap, setShowSunHeatmap] = useState(false);
  const [showIrrigationLines, setShowIrrigationLines] = useState(true);
  const [showLawnStripes, setShowLawnStripes] = useState(true);
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('summer');
  const [activeZoneFilter, setActiveZoneFilter] = useState<'all' | 'lawn' | 'borders' | 'terrace' | 'kitchen'>('all');
  const [zoomLevel2D, setZoomLevel2D] = useState(1);
  const [isRepositionMode, setIsRepositionMode] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 3D Orbit Controls
  const [orbitRotation, setOrbitRotation] = useState<number>(45); // horizontal rotation in degrees
  const [orbitTilt, setOrbitTilt] = useState<number>(55); // vertical tilt in degrees
  const [orbitZoom, setOrbitZoom] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState<number>(14); // 7 to 20 (hours)
  const [isOrbitDragging, setIsOrbitDragging] = useState(false);
  const orbitDragStartRef = useRef<{ x: number; y: number; rot: number; tilt: number }>({ x: 0, y: 0, rot: 45, tilt: 55 });

  // 360 Panoramic View Controls
  const [panoYaw, setPanoYaw] = useState<number>(60); // 0 to 360 degrees
  const [panoPitch, setPanoPitch] = useState<number>(0); // -25 to 25 degrees
  const [panoFov, setPanoFov] = useState<number>(85); // Field of View in degrees
  const [isPanoDragging, setIsPanoDragging] = useState(false);
  const [isPanoAutoTour, setIsPanoAutoTour] = useState(true);
  const [activeVantageId, setActiveVantageId] = useState<string>('terrace');
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);
  const panoDragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({ x: 0, y: 0, yaw: 60, pitch: 0 });

  // AR Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInspectingVision, setIsInspectingVision] = useState(false);
  const [visionResult, setVisionResult] = useState<CameraVisionResult | null>(null);

  // AI Plant Doctor diagnosis state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<PlantDiagnosisResult | null>(null);
  const [customSymptom, setCustomSymptom] = useState('Leaves yellowing around edges, slow root development');

  // New plant library for drag/add
  const plantCatalog: Partial<GardenPlant>[] = [
    {
      speciesName: 'English Lavender "Hidcote"',
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
      speciesName: 'Japanese Maple "Bloodgood"',
      botanicalName: 'Acer palmatum',
      category: 'tree',
      sunlight: 'partial_shade',
      waterCadenceDays: 7,
      notes: 'Architectural specimen with fiery autumnal crimson foliage.',
      bloomSeason: 'Foliage focus',
    },
    {
      speciesName: 'Boxwood Sphere Topiary',
      botanicalName: 'Buxus sempervirens',
      category: 'shrub',
      sunlight: 'partial_shade',
      waterCadenceDays: 6,
      notes: 'Formal evergreen topiary ball for entrance terrace.',
      bloomSeason: 'Evergreen',
    },
    {
      speciesName: 'David Austin Climbing Rose',
      botanicalName: 'Rosa "Gertrude Jekyll"',
      category: 'flower',
      sunlight: 'full_sun',
      waterCadenceDays: 3,
      notes: 'Heavy fragrant double-pink blooms along stone wall trellises.',
      bloomSeason: 'Summer to Autumn',
    },
    {
      speciesName: 'Cotswold Wildflower Meadow',
      botanicalName: 'Papaver rhoeas & Centaurea',
      category: 'flower',
      sunlight: 'full_sun',
      waterCadenceDays: 4,
      notes: 'Native British cornfield mix attracting pollinating fauna.',
      bloomSeason: 'June to October',
    },
  ];

  // 360 Panoramic Vantage Points
  const VANTAGE_POINTS: PanoramaVantagePoint[] = useMemo(() => [
    {
      id: 'terrace',
      name: 'South Terrace & Formal Striped Lawn',
      description: 'Expansive view overlooking precision cylinder lawn stripes, lavender walkway, and Cotswold stone facade.',
      backgroundGradient: 'from-amber-100 via-sky-200 to-emerald-950',
      bgSvgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="500" viewBox="0 0 1600 500">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%237dd3fc"/><stop offset="60%" stop-color="%23bae6fd"/><stop offset="100%" stop-color="%23fef08a"/></linearGradient>
          <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2315803d"/><stop offset="50%" stop-color="%23166534"/><stop offset="100%" stop-color="%2314532d"/></linearGradient>
          <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23d6d3d1"/><stop offset="100%" stop-color="%23a8a29e"/></linearGradient>
        </defs>
        <rect width="1600" height="260" fill="url(%23sky)"/>
        <!-- Distant Cotswold Hills -->
        <path d="M0 240 Q300 200 600 230 T1200 210 Q1400 230 1600 240 L1600 270 L0 270 Z" fill="%234ade80" opacity="0.4"/>
        <path d="M0 250 Q400 220 800 250 T1600 245 L1600 280 L0 280 Z" fill="%2322c55e" opacity="0.6"/>
        <!-- Manor Stone Balustrade (Back) -->
        <rect x="0" y="270" width="1600" height="230" fill="url(%23lawn)"/>
        <!-- Lawn Stripes Pattern -->
        <g opacity="0.25">
          <polygon points="100,270 240,500 290,500 130,270" fill="%2386efac"/>
          <polygon points="300,270 460,500 520,500 340,270" fill="%2386efac"/>
          <polygon points="540,270 720,500 790,500 590,270" fill="%2386efac"/>
          <polygon points="820,270 1020,500 1100,500 880,270" fill="%2386efac"/>
          <polygon points="1120,270 1340,500 1430,500 1190,270" fill="%2386efac"/>
        </g>
        <!-- Terrace Stone Paving Foreground -->
        <path d="M0 430 L1600 430 L1600 500 L0 500 Z" fill="url(%23stone)" opacity="0.9"/>
        <!-- Topiary & Urns -->
        <circle cx="280" cy="380" r="35" fill="%23166534"/>
        <circle cx="1320" cy="380" r="35" fill="%23166534"/>
        <text x="800" y="100" font-family="serif" font-size="28" font-weight="bold" fill="%230f172a" text-anchor="middle" opacity="0.3">High Meadow House · Cotswold South Grounds</text>
      </svg>`,
      hotspots: [
        { id: 'hs-1', yaw: 45, pitch: -6, title: 'English Lavender Promenade', category: 'shrub', plantId: 'plant-1', health: 'thriving', note: 'Dense flower spikes along gravel path. Attracts pollinating bees.' },
        { id: 'hs-2', yaw: 110, pitch: -2, title: 'Formal Ryegrass Lawn', category: 'lawn', health: 'thriving', note: 'Precision cylinder mower roller stripe finish. Moisture level 85%.' },
        { id: 'hs-3', yaw: 215, pitch: -8, title: 'Boxwood Sphere Topiary', category: 'shrub', plantId: 'plant-4', health: 'good', note: 'Clipped evergreen ball flanking stone entrance balustrade.' },
        { id: 'hs-4', yaw: 310, pitch: 4, title: 'David Austin Climbing Roses', category: 'flower', health: 'thriving', note: 'Trained against Cotswold limestone courtyard wall.' },
      ],
    },
    {
      id: 'herbaceous',
      name: 'Herbaceous Sanctuary & Japanese Acer Grove',
      description: 'Shaded garden sanctuary featuring fiery Japanese Maple, ivory Annabelle Hydrangeas, and carved stone fountain.',
      backgroundGradient: 'from-emerald-900 via-stone-800 to-amber-950',
      bgSvgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="500" viewBox="0 0 1600 500">
        <rect width="1600" height="500" fill="%23064e3b"/>
        <!-- Lush Woodland Foliage Backdrop -->
        <circle cx="200" cy="200" r="280" fill="%23022c22" opacity="0.8"/>
        <circle cx="800" cy="180" r="320" fill="%2314532d" opacity="0.7"/>
        <circle cx="1400" cy="210" r="290" fill="%237f1d1d" opacity="0.75"/>
        <!-- Japanese Maple Crimson Canopy -->
        <polygon points="1350,120 1450,90 1520,180 1420,260 1300,210" fill="%23dc2626" opacity="0.9"/>
        <polygon points="1280,180 1370,160 1440,240 1340,300" fill="%23b91c1c"/>
        <!-- Stone Water Fountain -->
        <ellipse cx="800" cy="380" rx="140" ry="45" fill="%2378716c"/>
        <ellipse cx="800" cy="370" rx="120" ry="35" fill="%2338bdf8" opacity="0.8"/>
        <!-- Hydrangea White Blossom Clouds -->
        <circle cx="450" cy="320" r="55" fill="%23f1f5f9" opacity="0.9"/>
        <circle cx="520" cy="300" r="60" fill="%23ffffff" opacity="0.95"/>
        <circle cx="590" cy="330" r="50" fill="%23e2e8f0" opacity="0.9"/>
      </svg>`,
      hotspots: [
        { id: 'hs-5', yaw: 65, pitch: -4, title: 'Annabelle Hydrangea Border', category: 'shrub', plantId: 'plant-2', health: 'needs_water', note: 'Massive ivory globe blossoms. Morning dew evaporating.' },
        { id: 'hs-6', yaw: 180, pitch: -10, title: 'Carved Cotswold Water Fountain', category: 'water', health: 'optimal', note: 'Gentle water recirculation keeps ambient humidity at 78%.' },
        { id: 'hs-7', yaw: 275, pitch: 2, title: 'Japanese Maple "Bloodgood"', category: 'tree', plantId: 'plant-3', health: 'thriving', note: 'Architectural crimson foliage sheltered from northern winds.' },
      ],
    },
    {
      id: 'walled',
      name: 'Walled Kitchen Garden & Cedar Planters',
      description: 'Heritage Victorian walled herbarium with raised cedar planter beds, culinary thyme, and espalier fruit trees.',
      backgroundGradient: 'from-amber-200 via-orange-100 to-stone-900',
      bgSvgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="500" viewBox="0 0 1600 500">
        <rect width="1600" height="240" fill="%23fef08a"/>
        <!-- Weathered Red Brick & Stone Wall -->
        <rect x="0" y="200" width="1600" height="120" fill="%239a3412" opacity="0.8"/>
        <!-- Cedar Planter Boxes -->
        <rect x="250" y="340" width="300" height="90" rx="8" fill="%2378350f"/>
        <rect x="750" y="340" width="300" height="90" rx="8" fill="%2378350f"/>
        <rect x="1200" y="340" width="280" height="90" rx="8" fill="%2378350f"/>
        <!-- Gravel Pathway -->
        <rect x="0" y="420" width="1600" height="80" fill="%23d6d3d1"/>
      </svg>`,
      hotspots: [
        { id: 'hs-8', yaw: 50, pitch: -8, title: 'Culinary Herb Spiral (Rosemary & Thyme)', category: 'herb', plantId: 'plant-5', health: 'thriving', note: 'Free draining limestone gravel mulch with aromatic oils.' },
        { id: 'hs-9', yaw: 165, pitch: -6, title: 'Heritage Beefsteak Tomato Vine', category: 'vegetable', health: 'good', note: 'Warm south-facing brick wall thermal storage.' },
        { id: 'hs-10', yaw: 290, pitch: -4, title: 'Wildflower Pollinator Meadow', category: 'flower', plantId: 'plant-6', health: 'thriving', note: 'Poppies and cornflowers buzzing with Cotswold bees.' },
      ],
    },
    {
      id: 'topiary',
      name: 'Topiary Promenade & Pergola Walk',
      description: 'Geometric clipped boxwood topiary cones along cedar timber pergolas with climbing David Austin roses.',
      backgroundGradient: 'from-sky-300 via-stone-200 to-emerald-950',
      bgSvgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="500" viewBox="0 0 1600 500">
        <rect width="1600" height="260" fill="%2338bdf8" opacity="0.5"/>
        <rect x="0" y="260" width="1600" height="240" fill="%2315803d"/>
        <!-- Pergola Timber Beams -->
        <g stroke="%2378350f" stroke-width="12">
          <line x1="200" y1="140" x2="200" y2="400"/>
          <line x1="600" y1="140" x2="600" y2="400"/>
          <line x1="1000" y1="140" x2="1000" y2="400"/>
          <line x1="1400" y1="140" x2="1400" y2="400"/>
          <line x1="150" y1="150" x2="1450" y2="150" stroke-width="16"/>
        </g>
        <!-- Clipped Boxwood Cones -->
        <polygon points="350,220 310,380 390,380" fill="%23166534"/>
        <polygon points="750,220 710,380 790,380" fill="%23166534"/>
        <polygon points="1150,220 1110,380 1190,380" fill="%23166534"/>
      </svg>`,
      hotspots: [
        { id: 'hs-11', yaw: 70, pitch: -6, title: 'English Boxwood Pyramidal Cone', category: 'shrub', health: 'thriving', note: 'Hand-sheared with Japanese okatsune shears.' },
        { id: 'hs-12', yaw: 195, pitch: 6, title: 'Pergola Climbing Rose Canes', category: 'flower', health: 'thriving', note: 'Heavy lateral training encouraging maximum basal flower buds.' },
      ],
    },
  ], []);

  const activeVantage = useMemo(
    () => VANTAGE_POINTS.find((v) => v.id === activeVantageId) || VANTAGE_POINTS[0],
    [activeVantageId, VANTAGE_POINTS]
  );

  // 360 Auto-Tour Rotation Effect
  useEffect(() => {
    if (viewMode !== 'panorama_360' || !isPanoAutoTour || isPanoDragging) return;
    const interval = setInterval(() => {
      setPanoYaw((prev) => (prev + 0.25) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [viewMode, isPanoAutoTour, isPanoDragging]);

  // Handle Plant Selection
  const handleSelectPlant = (plant: GardenPlant) => {
    setSelectedPlant(plant);
    setDiagnosisResult(null);
  };

  // Water Plant Handler
  const handleWaterPlant = (plant: GardenPlant) => {
    const updated: GardenPlant = {
      ...plant,
      health: 'thriving',
      lastWatered: new Date().toISOString().split('T')[0],
    };
    onUpdatePlant(updated);
    setSelectedPlant(updated);
  };

  // Prune Plant Handler
  const handlePrunePlant = (plant: GardenPlant) => {
    const updated: GardenPlant = {
      ...plant,
      health: 'thriving',
      notes: `${plant.notes} (Pruned & deadheaded on ${new Date().toLocaleDateString('en-GB')})`,
    };
    onUpdatePlant(updated);
    setSelectedPlant(updated);
  };

  // Camera Toggle
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
        console.warn('Camera failed:', err);
        setIsCameraActive(false);
      }
    }
  };

  // Gemini AI Snapshot Analysis
  const handleRunCameraVisionInspection = async () => {
    if (!videoRef.current || !arCanvasRef.current) return;
    setIsInspectingVision(true);
    try {
      const video = videoRef.current;
      const canvas = arCanvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 0.85);
        const result = await api.analyzeCameraVision(dataUri, 'image/jpeg', 'Turf quality and botanical species');
        setVisionResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInspectingVision(false);
    }
  };

  // Diagnose Plant with Gemini AI
  const handleDiagnosePlant = async () => {
    if (!selectedPlant) return;
    setIsDiagnosing(true);
    try {
      const diagnosis = await api.diagnosePlant({
        plantName: `${selectedPlant.speciesName} (${selectedPlant.botanicalName})`,
        symptoms: customSymptom,
        sunlight: selectedPlant.sunlight,
      });
      setDiagnosisResult(diagnosis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Calculate compass heading string from yaw
  const getCompassHeading = (deg: number) => {
    const val = Math.floor((deg / 45) + 0.5) % 8;
    const arr = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return arr[val];
  };

  // 3D Orbit Drag Handlers (Mouse + Touch)
  const handleOrbitMouseDown = (e: React.MouseEvent) => {
    setIsOrbitDragging(true);
    orbitDragStartRef.current = { x: e.clientX, y: e.clientY, rot: orbitRotation, tilt: orbitTilt };
  };

  const handleOrbitMouseMove = (e: React.MouseEvent) => {
    if (!isOrbitDragging) return;
    const deltaX = e.clientX - orbitDragStartRef.current.x;
    const deltaY = e.clientY - orbitDragStartRef.current.y;
    setOrbitRotation((orbitDragStartRef.current.rot + deltaX * 0.5) % 360);
    setOrbitTilt(Math.max(20, Math.min(80, orbitDragStartRef.current.tilt - deltaY * 0.4)));
  };

  const handleOrbitMouseUp = () => {
    setIsOrbitDragging(false);
  };

  const handleOrbitTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsOrbitDragging(true);
      orbitDragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, rot: orbitRotation, tilt: orbitTilt };
    }
  };

  const handleOrbitTouchMove = (e: React.TouchEvent) => {
    if (!isOrbitDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - orbitDragStartRef.current.x;
    const deltaY = e.touches[0].clientY - orbitDragStartRef.current.y;
    setOrbitRotation((orbitDragStartRef.current.rot + deltaX * 0.5) % 360);
    setOrbitTilt(Math.max(20, Math.min(80, orbitDragStartRef.current.tilt - deltaY * 0.4)));
  };

  const handleOrbitTouchEnd = () => {
    setIsOrbitDragging(false);
  };

  // 360 Pano Drag Handlers (Mouse + Touch)
  const handlePanoMouseDown = (e: React.MouseEvent) => {
    setIsPanoDragging(true);
    setIsPanoAutoTour(false);
    panoDragStartRef.current = { x: e.clientX, y: e.clientY, yaw: panoYaw, pitch: panoPitch };
  };

  const handlePanoMouseMove = (e: React.MouseEvent) => {
    if (!isPanoDragging) return;
    const deltaX = e.clientX - panoDragStartRef.current.x;
    const deltaY = e.clientY - panoDragStartRef.current.y;
    const newYaw = (panoDragStartRef.current.yaw - deltaX * 0.35 + 360) % 360;
    const newPitch = Math.max(-25, Math.min(25, panoDragStartRef.current.pitch + deltaY * 0.25));
    setPanoYaw(newYaw);
    setPanoPitch(newPitch);
  };

  const handlePanoMouseUp = () => {
    setIsPanoDragging(false);
  };

  const handlePanoTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanoDragging(true);
      setIsPanoAutoTour(false);
      panoDragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, yaw: panoYaw, pitch: panoPitch };
    }
  };

  const handlePanoTouchMove = (e: React.TouchEvent) => {
    if (!isPanoDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - panoDragStartRef.current.x;
    const deltaY = e.touches[0].clientY - panoDragStartRef.current.y;
    const newYaw = (panoDragStartRef.current.yaw - deltaX * 0.35 + 360) % 360;
    const newPitch = Math.max(-25, Math.min(25, panoDragStartRef.current.pitch + deltaY * 0.25));
    setPanoYaw(newYaw);
    setPanoPitch(newPitch);
  };

  const handlePanoTouchEnd = () => {
    setIsPanoDragging(false);
  };

  // Keyboard controls for 360 panorama
  useEffect(() => {
    if (viewMode !== 'panorama_360') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        setIsPanoAutoTour(false);
        if (e.key === 'ArrowLeft') setPanoYaw((y) => (y - 4 + 360) % 360);
        if (e.key === 'ArrowRight') setPanoYaw((y) => (y + 4) % 360);
        if (e.key === 'ArrowUp') setPanoPitch((p) => Math.min(25, p + 2.5));
        if (e.key === 'ArrowDown') setPanoPitch((p) => Math.max(-25, p - 2.5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Interactive 2D Map Click to move / plant specimen
  const handleMapCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedPlant) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const svgX = (clickX / rect.width) * 800;
    const svgY = (clickY / rect.height) * 520;

    // Convert to grid coordinates (0-11 x, 0-7 y)
    const newGridX = Math.max(0, Math.min(11, Math.round(((svgX - 100) / 600) * 11)));
    const newGridY = Math.max(0, Math.min(7, Math.round(((svgY - 120) / 360) * 7)));

    const updated: GardenPlant = {
      ...selectedPlant,
      x: newGridX,
      y: newGridY,
    };
    onUpdatePlant(updated);
    setSelectedPlant(updated);
    setIsRepositionMode(false);
    setActionNotice(`Re-planted ${selectedPlant.speciesName} at coordinates (${newGridX}, ${newGridY})`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Calculate sun shadow angle based on time of day
  const shadowAngleDeg = (timeOfDay - 12) * 15;
  const shadowLength = Math.abs(timeOfDay - 12) * 2 + 4;
  const ambientLightStyle = timeOfDay < 9
    ? 'rgba(254, 240, 138, 0.15)' // dawn warm gold
    : timeOfDay > 17
    ? 'rgba(249, 115, 22, 0.2)' // golden hour amber
    : 'rgba(255, 255, 255, 0)';

  return (
    <div className="space-y-6 pb-16">
      {/* Header and View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Cotswolds Estate Digital Twin
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">High Meadow House (180 m²)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Garden Spatial Map & Panoramic Views
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Explore your garden via interactive 2D landscape layout, 3D terrain orbit, or 360° panoramic grounds tour.
          </p>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/90 rounded-xl text-xs font-semibold shadow-inner self-start lg:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setViewMode('interactive_layout')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'interactive_layout'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Layout</span>
          </button>

          <button
            onClick={() => setViewMode('view_3d')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'view_3d'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-300" />
            <span>3D Terrain Map</span>
          </button>

          <button
            onClick={() => setViewMode('panorama_360')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'panorama_360'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>360° Panoramic Tour</span>
          </button>

          <button
            onClick={() => setViewMode('ar_camera')}
            className={`px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'ar_camera'
                ? 'bg-stone-900 text-emerald-300 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-500" />
            <span>AR Camera HUD</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE LANDSCAPE LAYOUT (REPLACING OLD PLAIN SQUARE GRID) */}
      {/* ========================================================================= */}
      {viewMode === 'interactive_layout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Landscape Canvas: 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-stone-700">Layers:</span>
                  <button
                    onClick={() => setShowSunHeatmap(!showSunHeatmap)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border cursor-pointer transition-colors flex items-center gap-1 ${
                      showSunHeatmap
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Sunlight Aspect</span>
                  </button>

                  <button
                    onClick={() => setShowIrrigationLines(!showIrrigationLines)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border cursor-pointer transition-colors flex items-center gap-1 ${
                      showIrrigationLines
                        ? 'bg-sky-100 text-sky-900 border-sky-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Droplet className="w-3 h-3 text-sky-600" />
                    <span>Drip Lines</span>
                  </button>

                  <button
                    onClick={() => setShowLawnStripes(!showLawnStripes)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border cursor-pointer transition-colors flex items-center gap-1 ${
                      showLawnStripes
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Sliders className="w-3 h-3 text-emerald-700" />
                    <span>Lawn Stripes</span>
                  </button>

                  <button
                    onClick={() => setIsRepositionMode(!isRepositionMode)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border cursor-pointer transition-colors flex items-center gap-1 ${
                      isRepositionMode
                        ? 'bg-emerald-800 text-white border-emerald-900 animate-pulse'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                    title="Click any position on the garden map to relocate selected plant"
                  >
                    <Map className="w-3 h-3" />
                    <span>{isRepositionMode ? 'Click Map to Move' : 'Move Selected Plant'}</span>
                  </button>
                </div>

                {/* Season selector */}
                <div className="flex items-center gap-1 text-[11px] bg-stone-100 p-1 rounded-lg">
                  {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`px-2 py-0.5 rounded capitalize cursor-pointer transition-colors ${
                        season === s ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-stone-500 font-semibold shrink-0">Filter Zone:</span>
                {[
                  { id: 'all', label: 'All Grounds' },
                  { id: 'lawn', label: 'Zone A: Fine Turf' },
                  { id: 'borders', label: 'Zone B: Lavender Borders' },
                  { id: 'terrace', label: 'Zone C: Manor Terrace' },
                  { id: 'kitchen', label: 'Zone D: Cedar Planters' },
                ].map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setActiveZoneFilter(z.id as any)}
                    className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      activeZoneFilter === z.id
                        ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>

              {/* Master Landscape Interactive Canvas */}
              <div className="relative overflow-hidden rounded-xl border border-stone-300 bg-stone-900 select-none shadow-inner p-1">
                {/* Active Action Notice Toast over Canvas */}
                {actionNotice && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/95 text-emerald-200 border border-emerald-500/70 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in pointer-events-none">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{actionNotice}</span>
                  </div>
                )}

                {isRepositionMode && (
                  <div className="absolute top-4 left-4 z-20 bg-amber-950/90 text-amber-200 border border-amber-500/60 px-3 py-1 rounded-lg text-[11px] font-semibold pointer-events-none animate-pulse">
                    Click anywhere on the lawn or borders to place: {selectedPlant?.speciesName}
                  </div>
                )}

                {/* SVG Landscape Masterplan */}
                <svg
                  viewBox="0 0 800 520"
                  onClick={handleMapCanvasClick}
                  className="w-full h-auto cursor-crosshair rounded-lg block"
                  style={{
                    backgroundColor: season === 'autumn' ? '#3f311c' : season === 'winter' ? '#292524' : '#14532d',
                  }}
                >
                  <defs>
                    {/* Roller Stripe Gradient */}
                    <pattern id="lawnStripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <rect width="30" height="60" fill="#15803d" />
                      <rect x="30" width="30" height="60" fill="#166534" />
                    </pattern>
                    {/* Gravel Texture */}
                    <pattern id="gravelPath" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect width="20" height="20" fill="#d6d3d1" />
                      <circle cx="5" cy="5" r="1.5" fill="#a8a29e" />
                      <circle cx="15" cy="12" r="1.5" fill="#a8a29e" />
                    </pattern>
                    {/* Stone Terrace Paving */}
                    <pattern id="pavingStone" width="40" height="30" patternUnits="userSpaceOnUse">
                      <rect width="40" height="30" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1" />
                    </pattern>
                    {/* Sunlight Overlay */}
                    <linearGradient id="sunAspect" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#fef08a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#312e81" stopOpacity="0.35" />
                    </linearGradient>
                  </defs>

                  {/* 1. ESTATE ZONES BACKGROUND */}
                  {/* North Terrace & Cotswold Manor Paving (Top: y = 0 to 110) */}
                  <rect
                    x="0"
                    y="0"
                    width="800"
                    height="110"
                    fill="url(#pavingStone)"
                    stroke={activeZoneFilter === 'terrace' ? '#34d399' : 'none'}
                    strokeWidth={activeZoneFilter === 'terrace' ? 4 : 0}
                  />
                  <text x="400" y="45" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#44403c" textAnchor="middle" opacity="0.6">
                    MANOR HOUSE SOUTH STONE TERRACE
                  </text>
                  <text x="400" y="70" fontSize="11" fill="#78716c" textAnchor="middle">
                    French Doors · Sun Loungers · Perimeter Herb Pots
                  </text>

                  {/* 2. CENTRAL FORMAL LAWN (y = 130 to 420, x = 120 to 680) */}
                  <rect
                    x="120"
                    y="130"
                    width="560"
                    height="280"
                    rx="16"
                    fill={showLawnStripes ? 'url(#lawnStripes)' : '#166534'}
                    stroke={activeZoneFilter === 'lawn' ? '#34d399' : '#14532d'}
                    strokeWidth={activeZoneFilter === 'lawn' ? 5 : 3}
                  />
                  <text x="400" y="270" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#ffffff" textAnchor="middle" opacity="0.35">
                    FORMAL LAWN · ROLLER STRIPED TURF (85 m²)
                  </text>

                  {/* 3. PERIMETER GRAVEL PATHWAY */}
                  <path
                    d="M 60 110 L 60 440 L 740 440 L 740 110 L 680 110 L 680 390 L 120 390 L 120 110 Z"
                    fill="url(#gravelPath)"
                    opacity="0.85"
                  />

                  {/* 4. HERBACEOUS BORDER & LAVENDER BEDS (West Border: x = 10 to 60, East Border: x = 740 to 790) */}
                  <rect
                    x="10"
                    y="120"
                    width="45"
                    height="310"
                    rx="8"
                    fill="#4c1d95"
                    opacity={activeZoneFilter === 'borders' ? 0.75 : 0.35}
                    stroke={activeZoneFilter === 'borders' ? '#34d399' : 'none'}
                    strokeWidth={activeZoneFilter === 'borders' ? 3 : 0}
                  />
                  <rect
                    x="745"
                    y="120"
                    width="45"
                    height="310"
                    rx="8"
                    fill="#4c1d95"
                    opacity={activeZoneFilter === 'borders' ? 0.75 : 0.35}
                    stroke={activeZoneFilter === 'borders' ? '#34d399' : 'none'}
                    strokeWidth={activeZoneFilter === 'borders' ? 3 : 0}
                  />

                  {/* 5. WALLED KITCHEN GARDEN & CEDAR HERB PLANTERS (South: y = 445 to 510) */}
                  <rect
                    x="180"
                    y="445"
                    width="440"
                    height="65"
                    rx="6"
                    fill="#78350f"
                    opacity="0.85"
                    stroke={activeZoneFilter === 'kitchen' ? '#34d399' : 'none'}
                    strokeWidth={activeZoneFilter === 'kitchen' ? 4 : 0}
                  />
                  <text x="400" y="482" fontSize="12" fontWeight="bold" fill="#fef3c7" textAnchor="middle">
                    RAISED CEDAR PLANTER BEDS & HERB SPIRAL
                  </text>

                  {/* 6. ORNAMENTAL FOUNTAIN (Center: 400, 270) */}
                  <circle cx="400" cy="270" r="28" fill="#78716c" stroke="#e7e5e4" strokeWidth="3" />
                  <circle cx="400" cy="270" r="20" fill="#38bdf8" opacity="0.85" />
                  <circle cx="400" cy="270" r="8" fill="#ffffff" opacity="0.9" />

                  {/* 7. IRRIGATION DRIP LINES OVERLAY */}
                  {showIrrigationLines && (
                    <g stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" fill="none" opacity="0.8">
                      <path d="M 30 130 L 30 420" />
                      <path d="M 765 130 L 765 420" />
                      <path d="M 200 460 L 600 460" />
                      <path d="M 200 490 L 600 490" />
                      <circle cx="30" cy="130" r="4" fill="#38bdf8" />
                      <circle cx="765" cy="130" r="4" fill="#38bdf8" />
                    </g>
                  )}

                  {/* 8. SUNLIGHT HEATMAP OVERLAY */}
                  {showSunHeatmap && (
                    <rect x="0" y="0" width="800" height="520" fill="url(#sunAspect)" pointerEvents="none" />
                  )}

                  {/* 9. INTERACTIVE BOTANICAL SPECIMEN MARKERS */}
                  {plants.map((p, idx) => {
                    // Position mapping with fallback
                    const posX = 130 + ((p.x !== undefined ? p.x : (idx * 2) % 11) / 11) * 540;
                    const posY = 140 + ((p.y !== undefined ? p.y : (idx * 1.5) % 7) / 7) * 250;
                    const isSelected = selectedPlant?.id === p.id;

                    return (
                      <g
                        key={p.id}
                        transform={`translate(${posX}, ${posY})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlant(p);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Selected Pulsing Halo */}
                        {isSelected && (
                          <circle r="22" fill="#10b981" opacity="0.3" className="animate-ping" />
                        )}

                        {/* Status Ring */}
                        <circle
                          r="16"
                          fill={p.health === 'needs_water' ? '#d97706' : '#ffffff'}
                          stroke={isSelected ? '#059669' : '#ffffff'}
                          strokeWidth={isSelected ? '3' : '1.5'}
                          className="drop-shadow-md group-hover:scale-110 transition-transform"
                        />

                        {/* Plant Emoji Icon */}
                        <text
                          y="4"
                          fontSize="14"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {p.category === 'tree' && '🌳'}
                          {p.category === 'flower' && '🌸'}
                          {p.category === 'shrub' && '🌿'}
                          {p.category === 'herb' && '🌱'}
                          {p.category === 'vegetable' && '🍅'}
                        </text>

                        {/* Label Plaque */}
                        <g transform="translate(0, 26)" pointerEvents="none">
                          <rect
                            x="-45"
                            y="-9"
                            width="90"
                            height="18"
                            rx="4"
                            fill="#1c1917"
                            opacity="0.9"
                          />
                          <text
                            y="4"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#ffffff"
                            textAnchor="middle"
                          >
                            {p.speciesName.split(' ')[0]}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Masterplan Legend & Quick Add Advice */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-2xs" />
                    <span>Thriving Specimen</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-2xs" />
                    <span>Hydration Alert</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-2xs" />
                    <span>Drip Irrigation Head</span>
                  </span>
                </div>

                <div className="text-[11px] text-stone-500">
                  Tip: Click any marker to view botanical health or execute groundskeeping tasks.
                </div>
              </div>
            </div>

            {/* Nursery Catalog: Click-to-plant Palette */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    Cotswolds Nursery Planting Palette
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    One-click add certified RHS cultivars to your estate map.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Ready to Bed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {plantCatalog.map((specimen, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newPlant: GardenPlant = {
                        id: `plant-${Date.now()}-${idx}`,
                        speciesName: specimen.speciesName || 'Estate Flora',
                        botanicalName: specimen.botanicalName || 'Botanica specimen',
                        category: specimen.category as any || 'shrub',
                        health: 'thriving',
                        sunlight: specimen.sunlight as any || 'full_sun',
                        waterCadenceDays: specimen.waterCadenceDays || 4,
                        lastWatered: new Date().toISOString().split('T')[0],
                        plantedDate: new Date().toISOString().split('T')[0],
                        notes: specimen.notes || 'Planted from nursery catalog',
                        arScale: 1.0,
                        bloomSeason: specimen.bloomSeason || 'Summer',
                        x: Math.floor(Math.random() * 8) + 1,
                        y: Math.floor(Math.random() * 5) + 1,
                      };
                      onAddPlant(newPlant);
                      setSelectedPlant(newPlant);
                    }}
                    className="p-2.5 bg-white rounded-xl border border-stone-200 hover:border-emerald-600 text-left transition-all cursor-pointer group hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">
                        {specimen.category === 'tree' && '🌳'}
                        {specimen.category === 'flower' && '🌸'}
                        {specimen.category === 'shrub' && '🌿'}
                        {specimen.category === 'herb' && '🌱'}
                        {specimen.category === 'vegetable' && '🍅'}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                    </div>
                    <div className="font-semibold text-xs text-stone-900 mt-1 truncate">
                      {specimen.speciesName}
                    </div>
                    <div className="text-[10px] text-stone-400 truncate">
                      {specimen.botanicalName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Botanical Specimen Dossier & RHS Diagnostics: 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            {selectedPlant ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
                <div className="border-b border-stone-100 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Botanical Dossier
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      {selectedPlant.speciesName}
                    </h3>
                    <p className="text-xs text-stone-500 italic">
                      {selectedPlant.botanicalName}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded capitalize ${
                      selectedPlant.health === 'thriving'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {selectedPlant.health.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Category:</span>
                    <span className="font-medium text-stone-900 capitalize">{selectedPlant.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Sunlight Aspect:</span>
                    <span className="font-medium text-stone-900 capitalize">{selectedPlant.sunlight.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Watering Cadence:</span>
                    <span className="font-medium text-stone-900">Every {selectedPlant.waterCadenceDays} days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Last Drenched:</span>
                    <span className="font-medium text-stone-900">{selectedPlant.lastWatered}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Prime Bloom:</span>
                    <span className="font-medium text-stone-900">{selectedPlant.bloomSeason}</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-600 border border-stone-200/80">
                  <div className="font-semibold text-stone-800 mb-1">Groundskeeper Field Notes:</div>
                  <p>{selectedPlant.notes}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleWaterPlant(selectedPlant)}
                    className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Drench Root Zone</span>
                  </button>
                  <button
                    onClick={() => handlePrunePlant(selectedPlant)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    title="Prune deadheads"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Prune</span>
                  </button>
                </div>

                {/* Gemini AI Diagnostic Card */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Gemini Botanical Doctor</span>
                    </span>
                    <button
                      onClick={handleDiagnosePlant}
                      disabled={isDiagnosing}
                      className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isDiagnosing ? 'Analyzing...' : 'Run Diagnostics'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Observed leaf or soil symptoms..."
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />

                  {diagnosisResult && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1.5 animate-fade-in">
                      <div className="font-bold text-emerald-900">
                        {diagnosisResult.probableCause}
                      </div>
                      <p className="text-stone-700">{diagnosisResult.immediateAction}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
                Select any plant from the masterplan map to inspect botanical parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 3D ISOMETRIC TERRAIN MAP */}
      {/* ========================================================================= */}
      {viewMode === 'view_3d' && (
        <div className="space-y-5">
          {/* 3D Viewport Container */}
          <div className="bg-stone-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
            {/* Top 3D Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      3D Isometric Estate Terrain Model
                    </h3>
                    <p className="text-xs text-stone-400">
                      Drag to orbit 360° · Rotate {Math.round(orbitRotation)}° · Pitch {Math.round(orbitTilt)}°
                    </p>
                  </div>
                </div>

                {/* Preset Camera Angles */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 mr-1">Angles:</span>
                  {[
                    { label: 'Isometric 45°', rot: 45, tilt: 55 },
                    { label: 'South Lawn', rot: 180, tilt: 42 },
                    { label: 'West Pergola', rot: 270, tilt: 48 },
                    { label: 'Top-Down Plan', rot: 0, tilt: 80 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setOrbitRotation(preset.rot);
                        setOrbitTilt(preset.tilt);
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-900 hover:bg-emerald-900 border border-stone-700 hover:border-emerald-500 text-stone-200 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day Sun Simulator */}
              <div className="flex items-center gap-3 bg-stone-900/90 px-3.5 py-1.5 rounded-xl border border-stone-800 text-xs self-start sm:self-auto">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-stone-300 whitespace-nowrap">Sun Position:</span>
                <input
                  type="range"
                  min="7"
                  max="20"
                  step="1"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseInt(e.target.value, 10))}
                  className="w-24 sm:w-32 accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-emerald-400 font-bold w-12 text-right">
                  {timeOfDay}:00
                </span>
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div
              onMouseDown={handleOrbitMouseDown}
              onMouseMove={handleOrbitMouseMove}
              onMouseUp={handleOrbitMouseUp}
              onMouseLeave={handleOrbitMouseUp}
              onTouchStart={handleOrbitTouchStart}
              onTouchMove={handleOrbitTouchMove}
              onTouchEnd={handleOrbitTouchEnd}
              className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
              style={{
                perspective: '1200px',
                backgroundColor: ambientLightStyle,
              }}
            >
              {/* Interactive 3D Rotated Terrain Board */}
              <div
                className="relative transition-transform duration-75"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${orbitTilt}deg) rotateZ(${orbitRotation}deg) scale(${orbitZoom})`,
                  width: '460px',
                  height: '460px',
                }}
              >
                {/* 3D Ground Base Slab (Extruded Limestone) */}
                <div
                  className="absolute inset-0 rounded-2xl border-4 border-stone-700 shadow-2xl"
                  style={{
                    backgroundColor: season === 'autumn' ? '#451a03' : season === 'winter' ? '#1c1917' : '#14532d',
                    transform: 'translateZ(-15px)',
                    boxShadow: `0 ${shadowLength * 2}px ${shadowLength * 4}px rgba(0,0,0,0.8)`,
                  }}
                />

                {/* 3D Manor House Terrace Base (Raised 15px) */}
                <div
                  className="absolute top-0 left-0 right-0 h-28 rounded-t-2xl bg-stone-300 border-b-4 border-stone-500 shadow-md flex items-center justify-center"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  <span className="text-[11px] font-serif font-bold text-stone-700 tracking-wider">
                    MANOR RESIDENCE PATIO & BALUSTRADE
                  </span>
                </div>

                {/* 3D Central Striped Lawn Slab */}
                <div
                  className="absolute top-32 left-10 right-10 bottom-16 rounded-xl border-2 border-emerald-950/40 shadow-inner overflow-hidden"
                  style={{
                    backgroundColor: '#15803d',
                    transform: 'translateZ(2px)',
                  }}
                >
                  {/* Stripes */}
                  <div className="w-full h-full flex flex-col opacity-30">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${i % 2 === 0 ? 'bg-emerald-300' : 'bg-emerald-900'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 3D Fountain in Center */}
                <div
                  className="absolute top-1/2 left-1/2 -ml-8 -mt-8 w-16 h-16 rounded-full bg-stone-300 border-2 border-stone-400 shadow-lg flex items-center justify-center"
                  style={{ transform: 'translateZ(18px)' }}
                >
                  <div className="w-10 h-10 rounded-full bg-sky-400 animate-pulse" />
                </div>

                {/* 3D Raised Cedar Planter Boxes (South: bottom) */}
                <div
                  className="absolute bottom-2 left-16 right-16 h-10 rounded-lg bg-amber-900 border-2 border-amber-950 flex items-center justify-center shadow-lg"
                  style={{ transform: 'translateZ(16px)' }}
                >
                  <span className="text-[9px] font-bold text-amber-200">
                    CEDAR HERB BEDS
                  </span>
                </div>

                {/* Interactive 3D Extruded Plants */}
                {plants.map((p, idx) => {
                  const leftPos = 40 + ((p.x * 38) % 360);
                  const topPos = 40 + ((p.y * 36) % 360);
                  const isSelected = selectedPlant?.id === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlant(p);
                      }}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${leftPos}px`,
                        top: `${topPos}px`,
                        transformStyle: 'preserve-3d',
                        transform: `translateZ(${isSelected ? 38 : 24}px) rotateZ(${-orbitRotation}deg) rotateX(${-orbitTilt}deg)`,
                      }}
                    >
                      {/* Dynamic Sunlight Shadow */}
                      <div
                        className="absolute w-8 h-8 rounded-full bg-black/60 blur-xs pointer-events-none"
                        style={{
                          transform: `translate(${shadowLength}px, ${shadowLength}px) scaleY(0.5)`,
                        }}
                      />

                      {/* 3D Foliage Dome */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 shadow-xl transition-transform ${
                          isSelected
                            ? 'scale-125 border-emerald-400 ring-2 ring-emerald-300'
                            : 'border-white/80 hover:scale-110'
                        }`}
                        style={{
                          backgroundColor:
                            p.category === 'tree'
                              ? '#dc2626'
                              : p.category === 'flower'
                              ? '#ec4899'
                              : p.category === 'shrub'
                              ? '#15803d'
                              : '#d97706',
                        }}
                      >
                        {p.category === 'tree' && '🌳'}
                        {p.category === 'flower' && '🌸'}
                        {p.category === 'shrub' && '🌿'}
                        {p.category === 'herb' && '🌱'}
                        {p.category === 'vegetable' && '🍅'}
                      </div>

                      {/* Floating Name Badge in 3D */}
                      <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-stone-950/90 text-[9px] font-bold px-2 py-0.5 rounded border border-stone-700 whitespace-nowrap text-stone-200">
                        {p.speciesName.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Viewport Overlay Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setOrbitZoom((z) => Math.min(1.4, z + 0.1))}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOrbitZoom((z) => Math.max(0.7, z - 0.1))}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setOrbitRotation(45);
                    setOrbitTilt(55);
                    setOrbitZoom(1);
                  }}
                  className="p-1.5 hover:bg-stone-800 rounded text-stone-300 cursor-pointer"
                  title="Reset 3D Camera"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Compass Bearing Indicator */}
              <div className="absolute top-4 left-4 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800 flex items-center gap-2 text-xs">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-stone-200">
                  {getCompassHeading(orbitRotation)} ({Math.round(orbitRotation)}°)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: 360° PANORAMIC GROUNDS TOUR ("360 palanomic views") */}
      {/* ========================================================================= */}
      {viewMode === 'panorama_360' && (
        <div className="space-y-5">
          {/* Panoramic Player Container */}
          <div className="bg-stone-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
            {/* Top Bar: Vantage Points & Compass */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    360° Panoramic Spatial Tour
                  </span>
                  <span className="text-stone-500 text-xs">Cotswolds Grounds</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  {activeVantage.name}
                </h3>
              </div>

              {/* Vantage Point Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
                {VANTAGE_POINTS.map((vp) => (
                  <button
                    key={vp.id}
                    onClick={() => {
                      setActiveVantageId(vp.id);
                      setSelectedHotspot(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeVantageId === vp.id
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {vp.name.split('&')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Cardinal Direction Turn Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-semibold text-stone-400">Quick Orient:</span>
                {[
                  { label: 'Facing North (0°)', yaw: 0 },
                  { label: 'Facing East (90°)', yaw: 90 },
                  { label: 'Facing South (180°)', yaw: 180 },
                  { label: 'Facing West (270°)', yaw: 270 },
                ].map((dir) => (
                  <button
                    key={dir.label}
                    onClick={() => {
                      setIsPanoAutoTour(false);
                      setPanoYaw(dir.yaw);
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-emerald-500 cursor-pointer transition-colors"
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-stone-400 hidden sm:block">
                Drag mouse/finger or press ← → ↑ ↓ keys to look around
              </div>
            </div>

            {/* Panoramic Interactive Viewport */}
            <div
              onMouseDown={handlePanoMouseDown}
              onMouseMove={handlePanoMouseMove}
              onMouseUp={handlePanoMouseUp}
              onMouseLeave={handlePanoMouseUp}
              onTouchStart={handlePanoTouchStart}
              onTouchMove={handlePanoTouchMove}
              onTouchEnd={handlePanoTouchEnd}
              className="relative w-full h-[460px] sm:h-[520px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-stone-800"
            >
              {/* Seamless Panoramic Cylindrical Canvas */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-75"
                style={{
                  backgroundImage: `url('${activeVantage.bgSvgDataUri}')`,
                  backgroundPosition: `${(-panoYaw / 360) * 1600}px ${panoPitch * 3}px`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: '1600px 100%',
                }}
              />

              {/* Vignette Overlay for Depth */}
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-stone-950/70 pointer-events-none" />

              {/* 360° Interactive Hotspot Markers */}
              {activeVantage.hotspots.map((hs) => {
                // Calculate horizontal position relative to current yaw & FOV
                const diff = (hs.yaw - panoYaw + 540) % 360 - 180;
                const isVisible = Math.abs(diff) < panoFov / 2;

                if (!isVisible) return null;

                const screenPercentX = 50 + (diff / (panoFov / 2)) * 50;
                const screenPercentY = 50 - hs.pitch * 1.5;

                return (
                  <div
                    key={hs.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(hs);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${screenPercentX}%`,
                      top: `${screenPercentY}%`,
                    }}
                  >
                    {/* Pulsing Beacon Halo */}
                    <div className="w-8 h-8 rounded-full bg-emerald-400/30 animate-ping absolute -top-1 -left-1 pointer-events-none" />

                    {/* Beacon Pin */}
                    <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Floating Label */}
                    <div className="mt-1 bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-stone-700 whitespace-nowrap shadow-md group-hover:bg-emerald-900">
                      {hs.title}
                    </div>
                  </div>
                );
              })}

              {/* Selected Hotspot Detail Card Overlay */}
              {selectedHotspot && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-96 bg-stone-900/95 border border-emerald-500/70 rounded-2xl p-5 shadow-2xl backdrop-blur-md animate-fade-in space-y-3 z-30"
                >
                  <div className="flex items-start justify-between border-b border-stone-800 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Botanical Specimen in View
                      </span>
                      <h4 className="font-serif text-base font-bold text-white mt-0.5">
                        {selectedHotspot.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedHotspot(null)}
                      className="text-stone-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedHotspot.note}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => {
                        const matched = plants.find((p) => p.id === selectedHotspot.plantId);
                        if (matched) handleWaterPlant(matched);
                        setSelectedHotspot(null);
                      }}
                      className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Water Specimen</span>
                    </button>

                    <button
                      onClick={() => {
                        setViewMode('interactive_layout');
                        const matched = plants.find((p) => p.id === selectedHotspot.plantId);
                        if (matched) setSelectedPlant(matched);
                      }}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      View on 2D Map →
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Center 360 Tour Controls Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 px-4 py-2 rounded-xl border border-stone-800 flex items-center gap-4 text-xs z-20 shadow-lg">
                <button
                  onClick={() => setIsPanoAutoTour(!isPanoAutoTour)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    isPanoAutoTour
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                  title="Toggle Auto Pan Rotation Tour"
                >
                  {isPanoAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPanoAutoTour ? 'Auto Tour Playing' : 'Start Auto Tour'}</span>
                </button>

                <div className="h-4 w-px bg-stone-700 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-2 text-stone-300">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Heading:</span>
                  <span className="font-mono font-bold text-white">
                    {getCompassHeading(panoYaw)} ({Math.round(panoYaw)}°)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPanoFov((f) => Math.max(60, f - 10))}
                    className="p-1 hover:bg-stone-800 rounded text-stone-300 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPanoFov((f) => Math.min(110, f + 10))}
                    className="p-1 hover:bg-stone-800 rounded text-stone-300 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: LIVE AR CAMERA HUD (GEMINI VISION INSPECTION) */}
      {/* ========================================================================= */}
      {viewMode === 'ar_camera' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Augmented Reality Viewport
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Real-Time Grounds & Foliage Scanner
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCamera}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isCameraActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCameraActive ? 'Close Camera' : 'Activate Live Camera'}</span>
                </button>
              </div>
            </div>

            {/* Video Viewfinder */}
            <div className="relative w-full h-[400px] sm:h-[480px] bg-black rounded-xl overflow-hidden flex items-center justify-center border border-stone-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              />
              <canvas ref={arCanvasRef} className="hidden" />

              {!isCameraActive && (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-300">
                    Live AR Viewport Inactive
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm">
                    Activate the camera to superimpose AR coordinates over your lawn, or use Gemini AI to diagnose soil and plant pathology.
                  </p>
                  <button
                    onClick={toggleCamera}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Start Camera Feed
                  </button>
                </div>
              )}

              {/* HUD Reticle */}
              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono text-emerald-400">
                      REC · 1080p 60FPS
                    </div>
                    <button
                      onClick={handleRunCameraVisionInspection}
                      disabled={isInspectingVision}
                      className="pointer-events-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isInspectingVision ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Inspecting with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Inspect with Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="self-center w-36 h-36 border border-emerald-400/40 rounded-xl flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  </div>

                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/20 text-xs text-stone-300 self-start">
                    Direct viewfinder towards borders, hedges, or turf grass.
                  </div>
                </div>
              )}
            </div>

            {/* Vision Result Card */}
            {visionResult && (
              <div className="p-5 bg-stone-950 border border-emerald-500/60 rounded-xl space-y-3 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Gemini AI Groundskeeping Analysis:</span>
                  </div>
                  <span className="text-stone-400">Lawn: {visionResult.lawnCondition}</span>
                </div>
                <p className="text-stone-300">{visionResult.immediateRecommendation}</p>
                <div className="text-[11px] text-stone-400">
                  Detected Species: {visionResult.detectedSpecies?.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
