import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  AlertCircle,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Leaf,
  Loader2,
  Droplet,
  Sun,
  ShieldCheck,
  RefreshCw,
  X,
  Plus,
  ArrowRight,
  Eye,
  Check,
  Image as ImageIcon,
  Zap,
} from 'lucide-react';
import { api } from '../api';
import { PlantRecognitionResult, PlantDiagnosisResult, GardenPlant } from '../types';

interface AiAssistantViewProps {
  onAddPlant?: (plant: GardenPlant) => void;
  onNavigateToGardens?: () => void;
  onNavigateToEstimator?: () => void;
}

// Sample photographic specimens for instant testing
const SAMPLE_SPECIMENS = [
  {
    name: 'English Lavender "Hidcote"',
    latin: 'Lavandula angustifolia',
    type: 'Shrub / Herb',
    notes: 'Fragrant purple spikes with silver foliage, ideal for dry borders.',
    svgColor: '#7c3aed',
    accentColor: 'from-purple-500 to-indigo-600',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23818cf8"/><stop offset="50%" stop-color="%237c3aed"/><stop offset="100%" stop-color="%234c1d95"/></linearGradient></defs><rect width="400" height="300" fill="%232e1065"/><circle cx="200" cy="180" r="110" fill="url(%23g)" opacity="0.85"/><path d="M190 280 C190 190, 210 190, 210 120" stroke="%2334d399" stroke-width="6" fill="none"/><ellipse cx="200" cy="110" rx="18" ry="45" fill="%23a78bfa"/><ellipse cx="215" cy="130" rx="14" ry="35" fill="%23c4b5fd"/><ellipse cx="185" cy="135" rx="14" ry="35" fill="%238b5cf6"/><text x="200" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ffffff" text-anchor="middle">Lavandula angustifolia</text></svg>',
  },
  {
    name: 'Annabelle Hydrangea',
    latin: 'Hydrangea arborescens',
    type: 'Flowering Shrub',
    notes: 'Large ivory globes, lush green leaves, partial shade preference.',
    svgColor: '#059669',
    accentColor: 'from-emerald-400 to-teal-700',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><radialGradient id="h" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="60%" stop-color="%23ecfdf5"/><stop offset="100%" stop-color="%23a7f3d0"/></radialGradient></defs><rect width="400" height="300" fill="%23064e3b"/><circle cx="200" cy="140" r="80" fill="url(%23h)"/><circle cx="160" cy="120" r="30" fill="%23ffffff" opacity="0.9"/><circle cx="240" cy="130" r="35" fill="%23ffffff" opacity="0.9"/><circle cx="190" cy="170" r="35" fill="%23d1fae5" opacity="0.9"/><path d="M200 220 L200 290" stroke="%2310b981" stroke-width="8"/><text x="200" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ffffff" text-anchor="middle">Hydrangea arborescens</text></svg>',
  },
  {
    name: 'Japanese Maple "Bloodgood"',
    latin: 'Acer palmatum',
    type: 'Ornamental Tree',
    notes: 'Deep burgundy palmate foliage with architectural branch structure.',
    svgColor: '#dc2626',
    accentColor: 'from-red-600 to-amber-700',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23450a0a"/><polygon points="200,60 215,110 260,85 230,130 270,160 215,160 200,210 185,160 130,160 170,130 140,85 185,110" fill="%23ef4444"/><polygon points="200,85 210,120 245,100 220,135 250,155 210,155 200,195 190,155 150,155 180,135 155,100 190,120" fill="%23b91c1c"/><text x="200" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23fecaca" text-anchor="middle">Acer palmatum (Crimson)</text></svg>',
  },
  {
    name: 'English Boxwood Topiary',
    latin: 'Buxus sempervirens',
    type: 'Evergreen Shrub',
    notes: 'Dense emerald topiary ball, formal entranceway specimen.',
    svgColor: '#15803d',
    accentColor: 'from-green-600 to-emerald-900',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%2314532d"/><circle cx="200" cy="130" r="75" fill="%2322c55e"/><circle cx="180" cy="115" r="55" fill="%234ade80" opacity="0.6"/><rect x="188" y="205" width="24" height="40" fill="%2378350f"/><rect x="160" y="240" width="80" height="40" rx="4" fill="%23d97706"/><text x="200" y="275" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle">Buxus sempervirens</text></svg>',
  },
];

// Sample diseased leaf specimens for pathology
const SAMPLE_DISEASE_SPECIMENS = [
  {
    plant: 'Rose (Rosa "Gertrude Jekyll")',
    symptom: 'Black powdery circular spots with yellow halos on lower leaves',
    diseaseName: 'Black Spot (Diplocarpon rosae)',
    notes: 'Common fungal condition in damp British summers.',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231c1917"/><ellipse cx="200" cy="150" rx="110" ry="60" fill="%2365a30d" transform="rotate(-15 200 150)"/><circle cx="160" cy="140" r="18" fill="%230f172a"/><circle cx="160" cy="140" r="24" stroke="%23facc15" stroke-width="4" fill="none" opacity="0.7"/><circle cx="230" cy="160" r="14" fill="%230f172a"/><circle cx="230" cy="160" r="20" stroke="%23facc15" stroke-width="3" fill="none" opacity="0.7"/><text x="200" y="270" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle">Rose Black Spot (Foliage)</text></svg>',
  },
  {
    plant: 'Hydrangea macrophylla',
    symptom: 'Interveinal yellowing with scorched leaf tips and alkalinity stress',
    diseaseName: 'Iron Chlorosis & High Soil pH',
    notes: 'Limestone Cotswold soil causing inability to uptake iron.',
    imageDataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231c1917"/><ellipse cx="200" cy="150" rx="120" ry="70" fill="%23eab308"/><path d="M120 150 C160 150, 240 150, 280 150" stroke="%2315803d" stroke-width="6"/><path d="M160 150 L140 110" stroke="%2315803d" stroke-width="4"/><path d="M200 150 L190 100" stroke="%2315803d" stroke-width="4"/><path d="M240 150 L230 110" stroke="%2315803d" stroke-width="4"/><text x="200" y="270" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle">Interveinal Chlorosis</text></svg>',
  },
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onAddPlant,
  onNavigateToGardens,
  onNavigateToEstimator,
}) => {
  const [activeTab, setActiveTab] = useState<'recognition' | 'disease' | 'recommendations' | 'care_plans'>('recognition');

  // Recognition Camera & Upload State
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(SAMPLE_SPECIMENS[0].imageDataUri);
  const [imageMimeType, setImageMimeType] = useState<string>('image/svg+xml');
  const [userObservation, setUserObservation] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<PlantRecognitionResult | null>(null);
  const [savedToGarden, setSavedToGarden] = useState(false);

  // Disease Pathology State
  const [plantInput, setPlantInput] = useState('Hydrangea macrophylla (Annabelle)');
  const [symptomsInput, setSymptomsInput] = useState('Leaves yellowing between veins, scorched flower heads in afternoon sun');
  const [diseasePhoto, setDiseasePhoto] = useState<string | null>(null);
  const [diseaseCameraActive, setDiseaseCameraActive] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<PlantDiagnosisResult | null>(null);

  // Video and Canvas Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const diseaseVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const diseaseFileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop media stream utility
  const stopMediaStream = (videoElement: HTMLVideoElement | null) => {
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream(videoRef.current);
      stopMediaStream(diseaseVideoRef.current);
    };
  }, []);

  // Start Recognition Live Camera
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    try {
      stopMediaStream(videoRef.current);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: targetFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Unable to access camera:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image or select a sample specimen below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    stopMediaStream(videoRef.current);
    setCameraActive(false);
  };

  const flipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap photo from live camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.88);
      setCurrentImage(dataUri);
      setImageMimeType('image/jpeg');
      stopCamera();
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
        setImageMimeType(file.type || 'image/jpeg');
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Real Gemini AI Plant Recognition
  const handleRunRecognition = async () => {
    if (!currentImage) return;
    setIsRecognizing(true);
    setSavedToGarden(false);

    try {
      const result = await api.recognizePlant(currentImage, imageMimeType, userObservation);
      setRecognitionResult(result);
    } catch (err) {
      console.error('Plant recognition failed:', err);
    } finally {
      setIsRecognizing(false);
    }
  };

  // Save recognized plant to the estate inventory
  const handleSaveToInventory = () => {
    if (!recognitionResult || !onAddPlant) return;
    const newPlant: GardenPlant = {
      id: `plant-${Date.now()}`,
      speciesName: recognitionResult.commonName,
      botanicalName: recognitionResult.botanicalName,
      category: recognitionResult.category || 'shrub',
      health: recognitionResult.healthAssessment.status === 'thriving' ? 'thriving' : 'good',
      sunlight: recognitionResult.sunlight.toLowerCase().includes('full')
        ? 'full_sun'
        : recognitionResult.sunlight.toLowerCase().includes('partial')
        ? 'partial_shade'
        : 'deep_shade',
      waterCadenceDays: recognitionResult.wateringSchedule.toLowerCase().includes('daily') ? 2 : 5,
      lastWatered: new Date().toISOString().split('T')[0],
      plantedDate: new Date().toISOString().split('T')[0],
      notes: `${recognitionResult.professionalAdvice} (Hardiness: ${recognitionResult.hardiness})`,
      arScale: 1.0,
      bloomSeason: 'Summer',
      x: Math.floor(Math.random() * 4),
      y: Math.floor(Math.random() * 4),
    };
    onAddPlant(newPlant);
    setSavedToGarden(true);
  };

  // Disease Camera Start
  const startDiseaseCamera = async () => {
    try {
      stopMediaStream(diseaseVideoRef.current);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (diseaseVideoRef.current) {
        diseaseVideoRef.current.srcObject = stream;
        diseaseVideoRef.current.play();
      }
      setDiseaseCameraActive(true);
    } catch (err) {
      console.warn('Disease camera error:', err);
      setDiseaseCameraActive(false);
    }
  };

  const captureDiseasePhoto = () => {
    if (!diseaseVideoRef.current || !canvasRef.current) return;
    const video = diseaseVideoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.88);
      setDiseasePhoto(dataUri);
      stopMediaStream(diseaseVideoRef.current);
      setDiseaseCameraActive(false);
    }
  };

  // Run Multimodal Disease Diagnosis
  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDiagnosing(true);
    try {
      const res = await api.diagnosePlant({
        plantName: plantInput,
        symptoms: symptomsInput,
        sunlight: 'Partial Sun / Afternoon Exposure',
        soilType: 'Cotswolds Limestone Loam',
        imageBase64: diseasePhoto || undefined,
        mimeType: diseasePhoto?.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
      });
      setDiagnosisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hidden canvas for video snapshot capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Camera Vision & AI Intelligence</span>
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-mono">Gemini 3.8 Flash Vision</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Pastures AI Horticultural Assistant
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Certified RHS botanical diagnostics, live camera plant identification, disease pathology, and estate care planning.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-900 text-xs font-medium self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Vision Active</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold max-w-2xl">
        <button
          onClick={() => setActiveTab('recognition')}
          className={`flex-1 py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'recognition' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-700" />
          <span>Plant Recognition</span>
        </button>
        <button
          onClick={() => setActiveTab('disease')}
          className={`flex-1 py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'disease' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Disease Detection</span>
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'recommendations' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Companion Guides</span>
        </button>
        <button
          onClick={() => setActiveTab('care_plans')}
          className={`flex-1 py-2.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'care_plans' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>12-Month Care Plan</span>
        </button>
      </div>

      {/* 1. PLANT RECOGNITION (CAMERA & IMAGE ACCESS WITH GEMINI AI) */}
      {activeTab === 'recognition' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Camera Viewfinder / Image Input */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-stone-900">
                      Live Camera & Photo Inspector
                    </h2>
                    <p className="text-[11px] text-stone-500">Capture or upload any specimen in your garden</p>
                  </div>
                </div>

                {/* Camera Actions */}
                <div className="flex items-center gap-2">
                  {cameraActive ? (
                    <>
                      <button
                        type="button"
                        onClick={flipCamera}
                        className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        title="Switch Front/Rear Camera"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Flip</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Close</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-800" />
                      <span>Start Live Camera</span>
                    </button>
                  )}
                </div>
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Viewfinder or Image Canvas */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Reticle Overlay */}
                    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs self-start">
                        <span>LIVE CAMERA // READY</span>
                      </div>
                      <div className="self-center w-28 h-28 border-2 border-dashed border-emerald-400/70 rounded-xl flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      </div>
                      <div className="text-center text-[11px] text-white/90 bg-black/60 py-1 px-3 rounded-full backdrop-blur-xs self-center">
                        Align flower or leaf inside the reticle
                      </div>
                    </div>

                    {/* Snap Button inside active camera */}
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-stone-950" />
                      <span>Snap Photo Frame</span>
                    </button>
                  </>
                ) : currentImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={currentImage}
                      alt="Selected botanical specimen"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-stone-950/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                      FRAME READY
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-stone-400 space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto text-stone-600" />
                    <p className="text-xs">No image selected. Snap with camera or upload below.</p>
                  </div>
                )}
              </div>

              {/* Upload Controls & Optional Notes */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Upload Image File</span>
                </button>

                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{cameraActive ? 'Snap Frame' : 'Take Camera Photo'}</span>
                </button>
              </div>

              {/* Extra note field for higher accuracy */}
              <div className="space-y-1 text-xs">
                <label className="font-medium text-stone-700 flex items-center justify-between">
                  <span>Groundsman Observation (Optional)</span>
                  <span className="text-[10px] text-stone-400">e.g. flower color, smell, bark texture</span>
                </label>
                <input
                  type="text"
                  value={userObservation}
                  onChange={(e) => setUserObservation(e.target.value)}
                  placeholder="e.g. Sweet lavender fragrance, square stems, planted in sunny border"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs"
                />
              </div>

              {/* Run Recognition CTA */}
              <button
                type="button"
                onClick={handleRunRecognition}
                disabled={isRecognizing || !currentImage}
                className="w-full py-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              >
                {isRecognizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Analyzing Image with Gemini Vision & RHS Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Identify Specimen with Gemini AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Test: Sample Specimen Gallery */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Instant Test Specimens</span>
                </span>
                <span className="text-[11px] text-stone-500">Click to load instantly</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_SPECIMENS.map((specimen, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentImage(specimen.imageDataUri);
                      setImageMimeType('image/svg+xml');
                      setUserObservation(specimen.notes);
                      stopCamera();
                    }}
                    className="p-2.5 bg-white hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="aspect-video w-full rounded-md overflow-hidden bg-stone-900 mb-2">
                      <img src={specimen.imageDataUri} alt={specimen.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-serif font-bold text-[11px] text-stone-900 group-hover:text-emerald-900 line-clamp-1">
                      {specimen.name}
                    </div>
                    <div className="text-[10px] text-stone-500 italic line-clamp-1">{specimen.latin}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Recognition Output Dossier */}
          <div className="lg:col-span-6 space-y-6">
            {isRecognizing ? (
              <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4 shadow-xs">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-800" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Botanical Analysis in Progress
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    Gemini 3.8 Flash is cross-referencing foliage morphology, flower geometry, and RHS hardiness tables...
                  </p>
                </div>
              </div>
            ) : recognitionResult ? (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 space-y-6 shadow-xs animate-in fade-in duration-300">
                {/* Dossier Header */}
                <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      RHS Verified Identification
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                      {recognitionResult.commonName}
                    </h2>
                    <div className="italic text-xs text-stone-500 font-mono mt-0.5">
                      {recognitionResult.botanicalName} · Family: {recognitionResult.family}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {Math.round(recognitionResult.confidence * 100)}% Match
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-stone-100 text-stone-700 capitalize">
                      {recognitionResult.category}
                    </span>
                  </div>
                </div>

                {/* Photographic Health Assessment */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Visual Health Assessment (From Photo)</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        recognitionResult.healthAssessment.status === 'thriving' ||
                        recognitionResult.healthAssessment.status === 'healthy'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {recognitionResult.healthAssessment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {recognitionResult.healthAssessment.summary}
                  </p>
                  {recognitionResult.healthAssessment.identifiedIssues &&
                    recognitionResult.healthAssessment.identifiedIssues.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {recognitionResult.healthAssessment.identifiedIssues.map((issue, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded"
                          >
                            ⚠️ {issue}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                {/* Key Botanical Parameters Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                    <strong className="text-stone-700 flex items-center gap-1 text-[11px]">
                      <Sun className="w-3 h-3 text-amber-600" /> Sunlight:
                    </strong>
                    <div className="text-stone-900 font-medium">{recognitionResult.sunlight}</div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1">
                    <strong className="text-stone-700 flex items-center gap-1 text-[11px]">
                      <Droplet className="w-3 h-3 text-blue-600" /> Watering:
                    </strong>
                    <div className="text-stone-900 font-medium">{recognitionResult.wateringSchedule}</div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 col-span-2 sm:col-span-1">
                    <strong className="text-stone-700 text-[11px]">RHS Hardiness:</strong>
                    <div className="text-stone-900 font-medium">{recognitionResult.hardiness}</div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 col-span-2 sm:col-span-1">
                    <strong className="text-stone-700 text-[11px]">Ideal Soil:</strong>
                    <div className="text-stone-900 font-medium">{recognitionResult.idealSoil}</div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-1 col-span-2">
                    <strong className="text-stone-700 text-[11px]">RHS Pruning Schedule:</strong>
                    <div className="text-stone-900 font-medium">{recognitionResult.pruningSchedule}</div>
                  </div>
                </div>

                {/* Companion Plants */}
                {recognitionResult.companionPlants && recognitionResult.companionPlants.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-stone-800">Beneficial Companion Plants:</span>
                    <div className="flex flex-wrap gap-2">
                      {recognitionResult.companionPlants.map((plant, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-medium"
                        >
                          🌿 {plant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Groundskeeper Advice */}
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <strong className="text-emerald-900 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    Pastures Groundskeeper Directive:
                  </strong>
                  <p className="leading-relaxed">{recognitionResult.professionalAdvice}</p>
                </div>

                {/* Actions: Save to Garden or Book Service */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {savedToGarden ? (
                    <div className="flex-1 py-2.5 px-4 bg-emerald-100 text-emerald-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-emerald-300">
                      <Check className="w-4 h-4 text-emerald-800" />
                      <span>Added to Estate Inventory</span>
                      {onNavigateToGardens && (
                        <button
                          type="button"
                          onClick={onNavigateToGardens}
                          className="underline ml-2 text-emerald-900 hover:text-black cursor-pointer"
                        >
                          View Gardens →
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToInventory}
                      className="flex-1 py-2.5 px-4 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-emerald-800" />
                      <span>Add to My Estate Garden Inventory</span>
                    </button>
                  )}

                  {onNavigateToEstimator && (
                    <button
                      type="button"
                      onClick={onNavigateToEstimator}
                      className="py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Get Pruning Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3 shadow-xs">
                <Camera className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  Ready to Inspect Flora
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Click <strong>"Identify Specimen with Gemini AI"</strong> or select one of the instant test specimens to see real-time RHS identification and care instructions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DISEASE DETECTION (WITH CAMERA & IMAGE ACCESS) */}
      {activeTab === 'disease' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleDiagnose} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h2 className="font-serif text-base font-bold text-stone-900">
                Botanical Pathology & Leaf Inspection
              </h2>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-stone-700">Plant / Specimen Species</label>
              <input
                type="text"
                required
                value={plantInput}
                onChange={(e) => setPlantInput(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-stone-700">Observed Foliage & Soil Symptoms</label>
              <textarea
                rows={3}
                required
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs"
              />
            </div>

            {/* Disease Photo Attachment / Live Camera */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-stone-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Attach Foliage / Stem Photo (Optional)</span>
                </label>
                {diseasePhoto && (
                  <button
                    type="button"
                    onClick={() => setDiseasePhoto(null)}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
                  >
                    Clear Photo
                  </button>
                )}
              </div>

              {diseaseCameraActive ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                  <video ref={diseaseVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={captureDiseasePhoto}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500 text-stone-950 font-bold text-xs shadow cursor-pointer"
                  >
                    Capture Disease Spot
                  </button>
                </div>
              ) : diseasePhoto ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200">
                  <img src={diseasePhoto} alt="Disease specimen" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={diseaseFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setDiseasePhoto(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => startDiseaseCamera()}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-stone-600" />
                    <span>Take Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => diseaseFileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-600" />
                    <span>Upload File</span>
                  </button>
                </div>
              )}

              {/* Sample Diseased Specimens */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-500 block mb-1">Quick Sample Pathologies:</span>
                <div className="flex gap-2">
                  {SAMPLE_DISEASE_SPECIMENS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPlantInput(sample.plant);
                        setSymptomsInput(sample.symptom);
                        setDiseasePhoto(sample.imageDataUri);
                      }}
                      className="px-2 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded text-stone-700 text-left truncate flex-1 cursor-pointer"
                    >
                      {sample.diseaseName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDiagnosing}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consulting RHS Botanical Knowledge Base...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Run Multimodal Disease Detection</span>
                </>
              )}
            </button>
          </form>

          {/* Pathology Results Card */}
          <div className="lg:col-span-7">
            {diagnosisResult ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 shadow-xs animate-in fade-in">
                <div className="border-b border-stone-100 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Pathology Report
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                      {diagnosisResult.botanicalName}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    {diagnosisResult.severity} Severity
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="font-bold text-stone-900">Probable Cause:</span>
                    <p className="text-stone-700 mt-0.5">{diagnosisResult.probableCause}</p>
                  </div>

                  {diagnosisResult.visualSignsIdentified && diagnosisResult.visualSignsIdentified.length > 0 && (
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-950">
                      <span className="font-bold text-amber-900">Visual Camera Symptoms Verified:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {diagnosisResult.visualSignsIdentified.map((sign, idx) => (
                          <span key={idx} className="bg-white px-2 py-0.5 rounded text-[11px] border border-amber-200 text-amber-900 font-medium">
                            🔍 {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                    <span className="font-bold text-emerald-900">Immediate Action Plan:</span>
                    <p className="mt-0.5">{diagnosisResult.immediateAction}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-stone-600">
                    <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                      <strong>Watering Schedule:</strong>
                      <div className="mt-1">{diagnosisResult.wateringSchedule}</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded border border-stone-100">
                      <strong>Pruning Guidance:</strong>
                      <div className="mt-1">{diagnosisResult.seasonalPruningAdvice}</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded border border-stone-100 text-stone-600">
                    <strong>Fertilizer & Soil Treatment:</strong>
                    <div className="mt-1">{diagnosisResult.fertilizerGuidance}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                Submit observed symptoms or capture a foliage photo to receive an instant pathology report and treatment plan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. COMPANION PLANTING & RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Companion Planting</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pair English Lavender with climbing roses. Lavender flowers naturally emit linalool, deterring aphids while drawing pollinators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Soil pH Balancing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cotswold limestone loam is naturally alkaline. For blue hydrangea blossoms, dress soil with sulfur pellets and pine needle mulch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">Water Conservation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Install 16mm subsurface drip lines beneath bark mulch to cut summer evaporation losses by over 60%.
            </p>
          </div>
        </div>
      )}

      {/* 4. 12-MONTH CARE PLANS */}
      {activeTab === 'care_plans' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              12-Month Estate Groundskeeper Schedule
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Curated by Pastures horticulturalists for British climate zones 8 & 9.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Spring</span>
              <div className="font-bold text-stone-900">Lawn Scarification & Feeding</div>
              <p className="text-stone-600 leading-relaxed">
                Rake out winter moss, overseed patchy lawn zones, and apply high-nitrogen slow release lawn dressing.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Summer</span>
              <div className="font-bold text-stone-900">Cylinder Striping & Deadheading</div>
              <p className="text-stone-600 leading-relaxed">
                Mow weekly at 30mm height, deadhead spent rose blossoms, and monitor drip irrigation timers.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded w-max">
                Current Season
              </span>
              <div className="font-bold text-stone-900">Hedge Reduction & Mulch</div>
              <p className="text-stone-600 leading-relaxed">
                Trim formal hornbeam hedges before frosts. Layer 3 inches of compost over borders to insulate perennial roots.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Winter</span>
              <div className="font-bold text-stone-900">Dormant Pruning & Clearance</div>
              <p className="text-stone-600 leading-relaxed">
                Prune apple and wisteria vines, service electric mowers, and clear storm debris from gravel carriage paths.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
