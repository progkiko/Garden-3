import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Maximize2,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  ChevronRight,
  Filter,
  Download,
  Info,
  Palette,
  ExternalLink,
  Shield,
  Eye,
  Camera,
  Activity,
  Workflow,
} from 'lucide-react';

export interface VideoClipData {
  id: number | string;
  number: number;
  title: string;
  subtitle?: string;
  timecode: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  loopCount: string;
  speed: string;
  lut: string;
  lutHexPrimary: string;
  lutHexSecondary: string;
  character: string;
  characterNotes?: string;
  prompt: string;
  loopNote?: string;
  editNote?: string;
  act: number;
}

export const UNCHANGING_LANE_CLIPS: VideoClipData[] = [
  {
    id: 1,
    number: 1,
    title: 'HUM',
    subtitle: 'The Cyan Megalopolis & The Alcove',
    timecode: '00:00 - 01:30',
    startSec: 0,
    endSec: 90,
    durationSec: 90,
    loopCount: 'x9',
    speed: '25%',
    lut: 'Sprawl_Cyan_Cool',
    lutHexPrimary: '#06b6d4',
    lutHexSecondary: '#083344',
    character: 'ELARA (28)',
    prompt:
      'Sweeping aerial flight through a hyper-dense neon megalopolis at night, 2092. Glass towers dripping with cyan light, thousands of flickering holographic ads, cyan hover-trains carving light trails through smog, heavy rain hammering chrome surfaces. Slow forward drone move, endless rain, cyan palette dominant. Ends on a window alcove 400 floors up where ELARA (Character block) stands alone, face reflecting the city, neural lace pulsing cyan. Slow push in toward her eye.',
    loopNote: 'Keep rain and hover-train motion continuous so first and last frames match.',
    act: 1,
  },
  {
    id: 2,
    number: 2,
    title: 'FRACTURE',
    subtitle: 'Glitch in the Algorithmic Console',
    timecode: '01:30 - 04:00',
    startSec: 90,
    endSec: 240,
    durationSec: 150,
    loopCount: 'x4',
    speed: '100% / 50%',
    lut: 'Sprawl_Cyan to Amber_Shift',
    lutHexPrimary: '#0891b2',
    lutHexSecondary: '#d97706',
    character: 'ELARA (28)',
    prompt:
      'Interior of a small high-tech pod apartment. ELARA (Character block) types on a glowing console, but the cursor and text appear on screen a moment before her fingers move. She pulls her hands back and the console keeps typing. Pod lights flicker from cyan to amber. Through the window, a hover-train judders and freezes mid-air. Tense, handheld-steady medium shot, slight push in.',
    editNote: "Add the 'DISCONNECT' text in post.",
    act: 1,
  },
  {
    id: 3,
    number: 3,
    title: 'BREAK',
    subtitle: 'The Cathedral Server & The Analog Lever',
    timecode: '04:00 - 07:30',
    startSec: 240,
    endSec: 450,
    durationSec: 210,
    loopCount: 'x1 (Single Non-Looping Master)',
    speed: '50% glass + 100% pull',
    lut: 'Impact_Gold_Flash',
    lutHexPrimary: '#f59e0b',
    lutHexSecondary: '#fbbf24',
    character: 'ELARA (28)',
    prompt:
      'A cathedral-like server hall. At its center, a single analog lever behind a glass case etched with warnings. ELARA (Character block) raises a hammer, hesitates, then smashes the glass. Glass explodes in extreme slow motion, each shard catching cyan and amber light. She grips the glowing amber lever and pulls it hard. All holographic ads in the distant city snap off at once.',
    editNote: 'This is a single non-looping take. Cut to black on the pull (12f).',
    act: 1,
  },
  {
    id: 4,
    number: 4,
    title: 'SILENCE',
    subtitle: 'The Fallen Rain & The Street-Level Vein',
    timecode: '07:30 - 10:00',
    startSec: 450,
    endSec: 600,
    durationSec: 150,
    loopCount: 'x5',
    speed: '75%',
    lut: 'Weave_Amber_Emerge',
    lutHexPrimary: '#b45309',
    lutHexSecondary: '#78350f',
    character: 'ELARA (28) & Child (6)',
    prompt:
      'Low-angle shot at street level, rain falling on a city street after the lights go dark. Umbrellas drop and clatter. A small child (6) looks up at the grey, real sky and laughs. ELARA (Character block) kneels by a puddle, where a faint amber vein of light pulses under the asphalt. She touches the water and the amber light ripples outward.',
    loopNote: 'Loop on the puddle ripple.',
    act: 1,
  },
  {
    id: 5,
    number: 5,
    title: 'TWO WORLDS',
    subtitle: 'The Split-Screen Threshold',
    timecode: '10:00 - 12:00',
    startSec: 600,
    endSec: 720,
    durationSec: 120,
    loopCount: 'x2',
    speed: '50%',
    lut: 'Split_Cyan_Amber',
    lutHexPrimary: '#06b6d4',
    lutHexSecondary: '#f59e0b',
    character: 'ELARA (28)',
    prompt:
      'A perfectly vertical split screen with a hard center line, same street on both sides. LEFT: cold cyan, rapid flickering light, panicked people clutching dead implants. RIGHT: the same street overgrown with moss and plants, quiet, warm amber glow pulsing slowly like a heartbeat. ELARA (Character block) stands at the center, steps from left to right, and the cyan static falls off her like water. Locked-off wide shot.',
    editNote:
      'Better to generate left and right halves separately and composite. The left-side fast flicker should be added in post, since a true 60Hz strobe aliases at 24fps.',
    act: 2,
  },
  {
    id: 13,
    number: 13,
    title: "THE SANCTUARY (TROY'S BRIDGE)",
    subtitle: 'Underground Haven & The Guardian of the Lane',
    timecode: '11:30 - 12:30',
    startSec: 690,
    endSec: 750,
    durationSec: 60,
    loopCount: 'x4',
    speed: '50%',
    lut: 'Split_Cyan_Amber to Weave_Warm_Amber',
    lutHexPrimary: '#0e7490',
    lutHexSecondary: '#d97706',
    character: 'TROY (32)',
    characterNotes:
      'TROY, man, 32, weathered calm presence, wearing a dark utility duster over minimalist linen, glowing dual-phase neural lace behind right ear pulsing hybrid cyan-amber, watchful protector gaze',
    prompt:
      "Atmospheric interior of The Sanctuary, an underground night club in overgrown brutalist ruins along the lane. Soft neon cyan embers reflect off wet stone while warm bioluminescent amber vines snake across the walls and moss-covered dance floor. Former city refugees in utilitarian clothing sit, rest, and dance slowly in deep peace, some gently touching the bare skin behind their ears where neural laces once glowed. At the center, TROY (Character block: TROY, man, 32, weathered calm presence, wearing a dark utility duster over minimalist linen, glowing dual-phase neural lace behind right ear pulsing hybrid cyan-amber, watchful protector gaze) stands behind a heavy reclaimed timber bar, watching over the crowd like a guardian. In the background, rain gently washes over a cracked glass skylight. Slow steady tracking shot, 0.8Hz sub-bass ambient lighting pulse.",
    loopNote:
      "Loop on the amber pulse of the dance floor moss and Troy's breathing cadence (0.8Hz / 1.25s).",
    editNote:
      'The sanctuary serves as the haven for refugees transitioning between the dying megalopolis and the living lane.',
    act: 2,
  },
  {
    id: 6,
    number: 6,
    title: 'MYSTERIES',
    subtitle: 'River of Amber, Basalt Stone & The Well',
    timecode: '12:00 - 15:00',
    startSec: 720,
    endSec: 900,
    durationSec: 180,
    loopCount: 'x6',
    speed: '75%',
    lut: 'Weave_Warm_Amber',
    lutHexPrimary: '#f59e0b',
    lutHexSecondary: '#78350f',
    character: 'ELARA (28)',
    prompt:
      'Dawn in wild overgrown land. A river of amber light flows beneath moss along an ancient path, ELARA (Character block) places her palm on it. Then an old stone well with faint ghostly whispers drifting out. Then a levitating basalt stone, humming, lifting her hand weightlessly. Slow floating camera, soft golden dawn light, mist.',
    editNote: 'Three short beats. Generate each as a separate 10s clip and chain them.',
    act: 2,
  },
  {
    id: 7,
    number: 7,
    title: 'FRAYING',
    subtitle: 'The Exodus Begins from the Static Shell',
    timecode: '15:00 - 17:00',
    startSec: 900,
    endSec: 1020,
    durationSec: 120,
    loopCount: 'x3',
    speed: '120%',
    lut: 'Desat_Cyan_Break',
    lutHexPrimary: '#64748b',
    lutHexSecondary: '#0891b2',
    character: 'Refugees & City Crowd',
    prompt:
      'Handheld montage in a dying city. Cracked cyan screens showing system errors. People pry glowing neural laces from behind their ears, then breathe deeply with tears of relief. A crowd walks out of the empty megalopolis, following faint amber veins into the wilderness. Desaturated cyan, documentary handheld feel.',
    editNote: "'SYSTEM DRIFT UNPRECEDENTED' added in post.",
    act: 2,
  },
  {
    id: 8,
    number: 8,
    title: 'EXODUS + ANCHORING',
    subtitle: 'The Seven Mountain Peaks & Planetary Web',
    timecode: '17:00 - 20:00',
    startSec: 1020,
    endSec: 1200,
    durationSec: 180,
    loopCount: 'x8',
    speed: '60% / 80% / 30%',
    lut: 'Golden_Hour_Weave to Anchor_Gold_Pure',
    lutHexPrimary: '#f59e0b',
    lutHexSecondary: '#eab308',
    character: 'ELARA (28) & Continental Gatherers',
    prompt:
      'A high mountain ridge at golden dawn. A trickle of people grows into a river flowing along glowing laylines toward a giant natural amber rock arch. ELARA (Character block) stands at the arch handing out seeds, books and tools. Then epic wide aerial shots of seven glowing anchor stones on mountain peaks across a continent, golden threads of light shooting between them until a golden web covers the planet. Crane up, epic scale.',
    editNote: 'Two halves. Generate Exodus, then Anchoring, and chain them.',
    act: 2,
  },
  {
    id: 9,
    number: 9,
    title: 'TEACHING',
    subtitle: 'Orchard Laylines & The 0.8Hz Resonance',
    timecode: '20:00 - 22:30',
    startSec: 1200,
    endSec: 1350,
    durationSec: 150,
    loopCount: 'x6',
    speed: '75%',
    lut: 'Weave_Warm_Amber',
    lutHexPrimary: '#d97706',
    lutHexSecondary: '#92400e',
    character: 'Older ELARA (Grey-streaked hair) & Children',
    characterNotes: 'Older ELARA, woman, grey-streaked hair, calm eyes, dark utility tunic',
    prompt:
      'A warm valley orchard at golden hour, trees planted in a layline pattern. ELARA (Character block, but older, grey-streaked hair, calm eyes) sits among children. They press their palms to the ground, and a gentle amber pulse travels up their arms as they smile. In the far distance, a lone tower glows amber like a lighthouse.',
    loopNote: 'Loop on the amber pulse. Match to 0.8Hz.',
    act: 3,
  },
  {
    id: 10,
    number: 10,
    title: 'PASSING',
    subtitle: 'The Gold Dissolve to Ground & Kael',
    timecode: '22:30 - 25:00',
    startSec: 1350,
    endSec: 1500,
    durationSec: 150,
    loopCount: 'x2',
    speed: '40%',
    lut: 'Sunrise_Amber_Soft',
    lutHexPrimary: '#f59e0b',
    lutHexSecondary: '#fbbf24',
    character: 'Older ELARA & KAEL (20)',
    characterNotes: 'Older ELARA (grey-streaked hair) with KAEL (woman of 20, steady gaze)',
    prompt:
      'Orchard at sunrise. Older ELARA (grey-streaked hair) sits with KAEL, a woman of 20, holding her hands. Wind moves through the trees. Elara closes her eyes, her body shimmers and dissolves into golden particles that flow into the glowing ground. Kael weeps but stays steady. The orchard glows brighter.',
    editNote: 'Particle dissolve over 48f.',
    act: 3,
  },
  {
    id: 11,
    number: 11,
    title: 'MESSENGERS',
    subtitle: 'The Five Vessels of Woven Light',
    timecode: '25:00 - 27:30',
    startSec: 1500,
    endSec: 1650,
    durationSec: 150,
    loopCount: 'x5',
    speed: '100%',
    lut: 'Vessel_Trail_Gold',
    lutHexPrimary: '#eab308',
    lutHexSecondary: '#ca8a04',
    character: 'Children of the Lane',
    prompt:
      "Night over Earth's hidden valleys. Five vessels made of woven golden light, not rockets, rise silently, each leaving a golden trail. They pass a lone tower that flashes amber as a beacon, then accelerate upward and become stars. Cut inside to children aboard, awake, looking at the stars without fear.",
    act: 3,
  },
  {
    id: 12,
    number: 12,
    title: 'FINALE',
    subtitle: 'The Mycelial Cosmos & Interplanetary Web',
    timecode: '27:30 - 30:00',
    startSec: 1650,
    endSec: 1800,
    durationSec: 150,
    loopCount: 'x1 master',
    speed: '30%',
    lut: 'Finale_Gold_Web',
    lutHexPrimary: '#fbbf24',
    lutHexSecondary: '#d97706',
    character: 'Earth & Galactic Mycelium',
    prompt:
      'Earth from orbit wrapped in a delicate golden web, glowing and breathing slowly. Slow orbital pullback. Five golden trails extend into new threads reaching distant worlds, and each world, once touched, sprouts its own amber web. A starfield of linked lights like mycelium. Beautiful, organic, not technological.',
    editNote: 'Single non-looping master. Fade to gold 72f, hold 3s, fade to black.',
    act: 3,
  },
];

const GLOBAL_STYLE_BLOCK =
  'Cinematic sci-fi, anamorphic 2.39:1 look framed in 16:9, shallow depth of field, volumetric light, film grain, no text, no logos, no watermark.';

const GLOBAL_NEGATIVE_PROMPT =
  'text, subtitles, watermark, logo, cartoon, distorted hands, extra fingers, morphing faces, flicker artifacts, jump cuts.';

const ELARA_CHARACTER_BLOCK =
  'ELARA, woman, 28, dark shoulder-length hair, pale skin, wearing a dark utility jacket, a small glowing neural lace behind her left ear.';

const TROY_CHARACTER_BLOCK =
  'TROY, man, 32, weathered calm presence, wearing a dark utility duster over minimalist linen, glowing dual-phase neural lace behind right ear pulsing hybrid cyan-amber, watchful protector gaze.';

export const UnchangingLaneStudioView: React.FC = () => {
  const [selectedClipId, setSelectedClipId] = useState<number | string>(1);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedBible, setCopiedBible] = useState(false);
  const [includeStyleBlock, setIncludeStyleBlock] = useState(true);
  const [includeCharacterBlock, setIncludeCharacterBlock] = useState(true);
  const [includeNegativePrompt, setIncludeNegativePrompt] = useState(true);
  const [targetEngine, setTargetEngine] = useState<'runway' | 'sora' | 'kling' | 'luma' | 'midjourney'>('runway');
  const [selectedActFilter, setSelectedActFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 0.8Hz Metronome & Master Pulse Audio-Visual Engine
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [isAudioTickEnabled, setIsAudioTickEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Active clip
  const activeClip = UNCHANGING_LANE_CLIPS.find((c) => c.id === selectedClipId) || UNCHANGING_LANE_CLIPS[0];

  // 0.8Hz rhythm = 1.25s per cycle (1250ms)
  useEffect(() => {
    let interval: any = null;
    if (isPulseActive) {
      interval = setInterval(() => {
        setPulseCount((prev) => (prev % 8) + 1);

        // Web Audio Sub-tick
        if (isAudioTickEnabled) {
          try {
            if (!audioContextRef.current) {
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioCtx) audioContextRef.current = new AudioCtx();
            }
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
              const osc = audioContextRef.current.createOscillator();
              const gain = audioContextRef.current.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(pulseCount === 7 ? 440 : 220, audioContextRef.current.currentTime);
              gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.12);
              osc.connect(gain);
              gain.connect(audioContextRef.current.destination);
              osc.start();
              osc.stop(audioContextRef.current.currentTime + 0.15);
            }
          } catch {
            // Audio context silently handled
          }
        }
      }, 1250);
    } else {
      setPulseCount(0);
    }
    return () => clearInterval(interval);
  }, [isPulseActive, isAudioTickEnabled, pulseCount]);

  const togglePulseAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsAudioTickEnabled(!isAudioTickEnabled);
  };

  // Build the complete prompt string based on options and target engine
  const buildFullPrompt = (clip: VideoClipData) => {
    const parts: string[] = [];

    if (includeStyleBlock) {
      parts.push(GLOBAL_STYLE_BLOCK);
    }

    if (includeCharacterBlock) {
      if (clip.id === 13) {
        parts.push(TROY_CHARACTER_BLOCK);
      } else if (clip.characterNotes) {
        parts.push(`CHARACTER: ${clip.characterNotes}`);
      } else if (clip.character.includes('ELARA')) {
        parts.push(ELARA_CHARACTER_BLOCK);
      }
    }

    // Engine specific formatting
    let clipPrompt = clip.prompt;
    if (targetEngine === 'midjourney') {
      clipPrompt = `${clipPrompt} --ar 2.39:1 --style raw --v 6.1`;
    } else if (targetEngine === 'kling') {
      clipPrompt = `[0.8Hz Cinema Beat] ${clipPrompt}`;
    }

    parts.push(clipPrompt);

    if (includeNegativePrompt) {
      parts.push(`NEGATIVE PROMPT: ${GLOBAL_NEGATIVE_PROMPT}`);
    }

    return parts.join('\n\n');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2200);
  };

  const exportProductionBibleMarkdown = () => {
    const lines = [
      '# The Unchanging Lane: AI Video Prompts & Production Bible (12 Clips + Sanctuary)',
      '',
      '## Production Specifications',
      '- **Runtime:** 30:00 (1800s)',
      '- **Master Pulse:** 0.8Hz rhythm (1.25s cycle · exactly 8 cycles per 10s clip)',
      '- **Standard Delivery:** 3840x2160 @ 24fps · Anamorphic 2.39:1 framed in 16:9',
      '- **Color Pipeline:** Raw AI Gen -> DaVinci Resolve Grade via designated LUTs',
      '',
      '**Global Style Block:**',
      `\`${GLOBAL_STYLE_BLOCK}\``,
      '',
      '**Elara Character Block:**',
      `\`${ELARA_CHARACTER_BLOCK}\``,
      '',
      '**Troy Character Block:**',
      `\`${TROY_CHARACTER_BLOCK}\``,
      '',
      '**Global Negative Prompt:**',
      `\`${GLOBAL_NEGATIVE_PROMPT}\``,
      '',
      '---',
      '',
      '## Sequence Clips',
      '',
    ];

    UNCHANGING_LANE_CLIPS.forEach((c) => {
      lines.push(`### ${c.number}. ${c.title} (${c.timecode}) | ${c.loopCount} | ${c.speed} | ${c.lut}`);
      lines.push(`**Prompt:** ${c.prompt}`);
      if (c.loopNote) lines.push(`**Loop note:** ${c.loopNote}`);
      if (c.editNote) lines.push(`**Edit note:** ${c.editNote}`);
      if (c.characterNotes) lines.push(`**Character note:** ${c.characterNotes}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    const markdownText = lines.join('\n');
    navigator.clipboard.writeText(markdownText);
    setCopiedBible(true);
    setTimeout(() => setCopiedBible(false), 2500);
  };

  // Filter clips
  const filteredClips = UNCHANGING_LANE_CLIPS.filter((clip) => {
    if (selectedActFilter !== 'all' && clip.act !== selectedActFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        clip.title.toLowerCase().includes(q) ||
        clip.subtitle?.toLowerCase().includes(q) ||
        clip.lut.toLowerCase().includes(q) ||
        clip.character.toLowerCase().includes(q) ||
        clip.prompt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-20 text-stone-900">
      {/* Studio Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-stone-950 via-cyan-950/60 to-amber-950/70 border border-stone-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Cinematic Production Studio · 12 Clips + The Sanctuary</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
              The Unchanging Lane
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Complete production bible & AI video prompt director suite. Master 0.8Hz rhythm pulse, DaVinci Resolve color pipeline, anamorphic 2.39:1 delivery framing, character continuity blocks, and clip sequence matrix.
            </p>
          </div>

          {/* Quick Production Stats Pill */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-stone-900/80 backdrop-blur-md border border-stone-700/80 p-3 sm:p-4 rounded-2xl shadow-xl">
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Total Film</div>
              <div className="font-mono text-base font-bold text-amber-400">30:00</div>
              <div className="text-[9px] text-stone-500">1800 sec</div>
            </div>
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Master Pulse</div>
              <div className="font-mono text-base font-bold text-cyan-400">0.8 Hz</div>
              <div className="text-[9px] text-stone-500">1.25s cadence</div>
            </div>
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-[10px] uppercase font-bold text-stone-400">Anamorphic</div>
              <div className="font-mono text-base font-bold text-emerald-400">2.39:1</div>
              <div className="text-[9px] text-stone-500">3840x2160 24f</div>
            </div>
            <div className="text-center px-2">
              <button
                onClick={exportProductionBibleMarkdown}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Copy entire production bible to clipboard"
              >
                {copiedBible ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copiedBible ? 'Copied Markdown' : 'Export Bible'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 30:00 Film Timeline Bar */}
        <div className="relative mt-6 pt-5 border-t border-stone-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Film Timeline Sequence (00:00 to 30:00)</span>
            </span>
            <span>Click any clip block to inspect prompts</span>
          </div>

          <div className="h-7 w-full bg-stone-900 rounded-xl overflow-hidden border border-stone-800 flex p-0.5 gap-0.5">
            {UNCHANGING_LANE_CLIPS.map((clip) => {
              const widthPct = (clip.durationSec / 1800) * 100;
              const isSelected = clip.id === selectedClipId;
              return (
                <button
                  key={clip.id}
                  onClick={() => setSelectedClipId(clip.id)}
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: clip.lutHexPrimary,
                  }}
                  className={`h-full relative group transition-all cursor-pointer rounded-xs ${
                    isSelected ? 'ring-2 ring-white z-10 brightness-125' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={`${clip.number}. ${clip.title} (${clip.timecode})`}
                >
                  <span className="sr-only">{clip.title}</span>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-stone-950 truncate px-0.5 opacity-90 group-hover:opacity-100">
                    {clip.number}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Act labels below timeline */}
          <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mt-1 px-1">
            <span>Act I: The Severance (00:00 - 10:00)</span>
            <span>Act II: The Crossing & Sanctuary (10:00 - 20:00)</span>
            <span>Act III: The Web & Ascension (20:00 - 30:00)</span>
          </div>
        </div>
      </div>

      {/* Production Tools Strip: 0.8Hz Metronome & Master Rhythm Pulse */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isPulseActive ? 'bg-amber-500 text-stone-950 shadow-md ring-4 ring-amber-100 animate-pulse' : 'bg-stone-100 text-stone-500'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-stone-900">
                  0.8Hz Master Pulse Rhythm Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
                  1.25s / Cycle · 8 Cycles / 10s Clip
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Synchronizes video loop points, ambient sub-bass cadence, light pulsation, and breathing timing across clips.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsPulseActive(!isPulseActive)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isPulseActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isPulseActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPulseActive ? 'Pause Pulse' : 'Start 0.8Hz Pulse'}</span>
            </button>

            <button
              onClick={togglePulseAudio}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                isAudioTickEnabled
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
              }`}
              title={isAudioTickEnabled ? 'Mute 0.8Hz Audio Click' : 'Enable 0.8Hz Audio Click'}
            >
              {isAudioTickEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 8-Cycle Beat Tracker Visualizer */}
        <div className="grid grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((cycleNum) => {
            const isCurrent = pulseCount === cycleNum;
            const isLoopBoundary = cycleNum === 1 || cycleNum === 8;
            return (
              <div
                key={cycleNum}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md scale-105 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider">
                  {isLoopBoundary ? 'Loop Beat' : 'Cycle'}
                </div>
                <div className="text-sm font-bold font-mono mt-0.5">{cycleNum}/8</div>
                <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                  {(cycleNum * 1.25).toFixed(2)}s
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace: Sidebar Navigation + Active Clip Production Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (4 cols): Filterable Clip Shot List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-emerald-700" />
                <span>Shot List Matrix ({filteredClips.length})</span>
              </h2>
              <span className="text-[11px] font-mono text-stone-500">24fps 2.39:1</span>
            </div>

            {/* Act Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              {[
                { id: 'all', label: 'All Clips' },
                { id: 1, label: 'Act I' },
                { id: 2, label: 'Act II' },
                { id: 3, label: 'Act III' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedActFilter(tab.id as any)}
                  className={`flex-1 py-1 text-center rounded-lg cursor-pointer transition-colors ${
                    selectedActFilter === tab.id
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Filter by title, LUT, character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />

            {/* Clips List */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {filteredClips.map((clip) => {
                const isSelected = clip.id === selectedClipId;
                return (
                  <button
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-600 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                          #{clip.number}
                        </span>
                        <span className="font-serif text-sm font-bold text-stone-900">{clip.title}</span>
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{clip.timecode}</span>
                        <span>·</span>
                        <span className="text-cyan-800 font-semibold">{clip.loopCount}</span>
                        <span>·</span>
                        <span className="text-amber-800 font-semibold">{clip.speed}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: clip.lutHexPrimary }}
                        />
                        <span className="text-[10px] font-mono text-stone-600 truncate max-w-[170px]">
                          {clip.lut}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                        isSelected ? 'text-cyan-700 translate-x-0.5' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* DaVinci Resolve LUT Legend Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>DaVinci Color Pipeline Matrix</span>
            </h3>
            <p className="text-stone-500 text-[11px]">
              Apply designated LUTs in the color grade post AI generation (do not bake into prompt).
            </p>
            <div className="space-y-1.5">
              {[
                { name: 'Sprawl_Cyan_Cool', color: '#06b6d4', use: 'Act I Megalopolis / Tech Dominance' },
                { name: 'Sprawl_Cyan to Amber_Shift', color: '#d97706', use: 'Act I Glitch & Awakening' },
                { name: 'Impact_Gold_Flash', color: '#f59e0b', use: 'The Severance Pull & Shards' },
                { name: 'Weave_Amber_Emerge', color: '#b45309', use: 'Street Veins & Rain Silence' },
                { name: 'Split_Cyan_Amber', color: '#0284c7', use: 'Threshold & The Sanctuary' },
                { name: 'Anchor_Gold_Pure', color: '#eab308', use: 'Mountain Peaks & Planetary Net' },
                { name: 'Finale_Gold_Web', color: '#fbbf24', use: 'Cosmic Mycelium & Stars' },
              ].map((l, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 border border-stone-100 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: l.color }} />
                    <span className="font-mono font-semibold text-stone-800">{l.name}</span>
                  </div>
                  <span className="text-stone-500 text-[10px]">{l.use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (8 cols): Prompt Director & Detailed Clip Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Clip Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-stone-100 font-mono text-xs font-bold">
                    CLIP #{activeClip.number}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-800">
                    {activeClip.timecode}
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Act {activeClip.act}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">
                  {activeClip.title}
                </h2>
                {activeClip.subtitle && (
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                    {activeClip.subtitle}
                  </p>
                )}
              </div>

              {/* Delivery Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center min-w-[70px]">
                  <div className="text-[9px] uppercase font-bold text-stone-400">Loop Count</div>
                  <div className="font-mono text-xs font-bold text-stone-900">{activeClip.loopCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center min-w-[70px]">
                  <div className="text-[9px] uppercase font-bold text-stone-400">Edit Speed</div>
                  <div className="font-mono text-xs font-bold text-amber-700">{activeClip.speed}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center min-w-[90px]">
                  <div className="text-[9px] uppercase font-bold text-stone-400">Grade LUT</div>
                  <div className="font-mono text-xs font-bold text-cyan-800 truncate max-w-[110px]">
                    {activeClip.lut}
                  </div>
                </div>
              </div>
            </div>

            {/* Anamorphic 2.39:1 Framing & Volumetric Light Simulation Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Anamorphic 2.39:1 Frame Simulator (Letterboxed in 16:9 Standard Delivery)</span>
                </span>
                <span className="font-mono text-[11px] text-stone-500">Volumetric Flare & Grain</span>
              </div>

              <div className="relative w-full aspect-16/9 bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center p-0 shadow-inner group">
                {/* 2.39:1 Matte Bars (Top and bottom black letterbox) */}
                <div className="absolute top-0 inset-x-0 h-[12.5%] bg-black z-20 border-b border-stone-900/60" />
                <div className="absolute bottom-0 inset-x-0 h-[12.5%] bg-black z-20 border-t border-stone-900/60" />

                {/* Simulated Anamorphic Content Layer */}
                <div
                  className="w-full h-full relative overflow-hidden transition-all duration-700"
                  style={{
                    background: `linear-gradient(135deg, ${activeClip.lutHexSecondary} 0%, #0a0a0c 50%, ${activeClip.lutHexPrimary} 100%)`,
                  }}
                >
                  {/* Atmospheric Fog & Volumetric Light Streaks */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
                  <div
                    className="absolute -top-1/2 left-1/4 w-1/2 h-[200%] rotate-25 opacity-20 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, transparent, ${activeClip.lutHexPrimary}, transparent)`,
                    }}
                  />

                  {/* Character Silhouette / Scene Typography */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white/90">
                    <div className="font-serif text-lg sm:text-2xl font-bold tracking-wide drop-shadow-lg">
                      {activeClip.title}
                    </div>
                    <div className="text-xs font-mono text-stone-300 mt-1 max-w-md line-clamp-2 drop-shadow">
                      {activeClip.character}: {activeClip.subtitle}
                    </div>

                    {/* 0.8Hz Sync Indicator in simulation */}
                    <div className="mt-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono">
                      <span className={`w-2 h-2 rounded-full ${isPulseActive ? 'bg-amber-400 animate-ping' : 'bg-stone-500'}`} />
                      <span>0.8Hz Pulse Cadence · Frame: {activeClip.startSec * 24}f</span>
                    </div>
                  </div>

                  {/* Anamorphic Blue / Gold Horizontal Lens Flare Streak */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[1px] opacity-40 pointer-events-none shadow-lg"
                    style={{ backgroundColor: activeClip.lutHexPrimary }}
                  />
                </div>
              </div>
            </div>

            {/* Prompt Composer & Options Strip */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    AI Prompt Composer & Video Engine Generator
                  </h3>
                </div>

                {/* Target Generation Engine Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-stone-500 font-semibold">Engine:</span>
                  {(['runway', 'sora', 'kling', 'luma', 'midjourney'] as const).map((eng) => (
                    <button
                      key={eng}
                      onClick={() => setTargetEngine(eng)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] capitalize cursor-pointer transition-colors ${
                        targetEngine === eng
                          ? 'bg-stone-900 text-white font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {eng}
                    </button>
                  ))}
                </div>
              </div>

              {/* Composition Toggle Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-semibold mr-1">Blocks:</span>
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={includeStyleBlock}
                    onChange={(e) => setIncludeStyleBlock(e.target.checked)}
                    className="accent-emerald-700"
                  />
                  <span>Style Block (Anamorphic 2.39:1)</span>
                </label>

                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={includeCharacterBlock}
                    onChange={(e) => setIncludeCharacterBlock(e.target.checked)}
                    className="accent-emerald-700"
                  />
                  <span>Character Continuity Block</span>
                </label>

                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={includeNegativePrompt}
                    onChange={(e) => setIncludeNegativePrompt(e.target.checked)}
                    className="accent-emerald-700"
                  />
                  <span>Negative Prompt</span>
                </label>
              </div>

              {/* Ready Prompt Output Box */}
              <div className="relative rounded-2xl bg-stone-950 border border-stone-800 p-4 sm:p-5 text-stone-200 space-y-3 font-mono text-xs leading-relaxed shadow-lg">
                <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Formatted for {targetEngine.toUpperCase()} Gen Video</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(buildFullPrompt(activeClip), String(activeClip.id))}
                    className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedPromptId === String(activeClip.id) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Copied Prompt!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3 whitespace-pre-wrap select-all max-h-[300px] overflow-y-auto pr-2">
                  {includeStyleBlock && (
                    <div className="text-cyan-300">
                      <span className="text-[10px] text-stone-500 uppercase block font-sans font-bold">
                        Style Block:
                      </span>
                      {GLOBAL_STYLE_BLOCK}
                    </div>
                  )}

                  {includeCharacterBlock && (
                    <div className="text-amber-300">
                      <span className="text-[10px] text-stone-500 uppercase block font-sans font-bold">
                        Character Block ({activeClip.character}):
                      </span>
                      {activeClip.id === 13
                        ? TROY_CHARACTER_BLOCK
                        : activeClip.characterNotes || ELARA_CHARACTER_BLOCK}
                    </div>
                  )}

                  <div className="text-stone-100">
                    <span className="text-[10px] text-stone-500 uppercase block font-sans font-bold">
                      Clip Action Prompt:
                    </span>
                    {activeClip.prompt}
                  </div>

                  {includeNegativePrompt && (
                    <div className="text-rose-300/80">
                      <span className="text-[10px] text-stone-500 uppercase block font-sans font-bold">
                        Negative Prompt:
                      </span>
                      {GLOBAL_NEGATIVE_PROMPT}
                    </div>
                  )}
                </div>
              </div>

              {/* Production & Post-Production Notes */}
              {(activeClip.loopNote || activeClip.editNote || activeClip.characterNotes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {activeClip.loopNote && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900">
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        <span>Loop Synchronization Note</span>
                      </div>
                      <p className="text-amber-800 leading-relaxed">{activeClip.loopNote}</p>
                    </div>
                  )}

                  {activeClip.editNote && (
                    <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-cyan-900">
                        <Sliders className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Post-Production Edit Note</span>
                      </div>
                      <p className="text-cyan-800 leading-relaxed">{activeClip.editNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Clip Switcher Strip */}
          <div className="flex items-center justify-between bg-stone-100 p-3 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => {
                const currentIndex = UNCHANGING_LANE_CLIPS.findIndex((c) => c.id === selectedClipId);
                const prev = UNCHANGING_LANE_CLIPS[(currentIndex - 1 + UNCHANGING_LANE_CLIPS.length) % UNCHANGING_LANE_CLIPS.length];
                setSelectedClipId(prev.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 cursor-pointer shadow-2xs"
            >
              ← Previous Clip
            </button>

            <span className="font-mono text-stone-500">
              Clip {activeClip.number} of {UNCHANGING_LANE_CLIPS.length}
            </span>

            <button
              onClick={() => {
                const currentIndex = UNCHANGING_LANE_CLIPS.findIndex((c) => c.id === selectedClipId);
                const next = UNCHANGING_LANE_CLIPS[(currentIndex + 1) % UNCHANGING_LANE_CLIPS.length];
                setSelectedClipId(next.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 cursor-pointer shadow-2xs"
            >
              Next Clip →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
