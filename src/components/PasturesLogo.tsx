import React from 'react';

export interface PasturesLogoProps {
  variant?: 'full' | 'horizontal' | 'mark-only' | 'text-only';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light'; // 'dark' = green text on light bg; 'light' = white/emerald text on dark bg
  className?: string;
  showSubtitle?: boolean;
}

/**
 * Pastures Gardening and Maintenance official logo component.
 * Reproduces the authentic sprouted botanical emblem and typography
 * from the official brand identity.
 */
export const PasturesLogo: React.FC<PasturesLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  className = '',
  showSubtitle = true,
}) => {
  const isLight = theme === 'light';
  const primaryColor = isLight ? '#f4fbf6' : '#234933';
  const secondaryColor = isLight ? '#86efac' : '#2d5a3c';
  const groundColor = isLight ? '#4ade80' : '#234933';

  // Mark dimensions based on size
  const markSizeMap = {
    xs: { width: 22, height: 26 },
    sm: { width: 30, height: 35 },
    md: { width: 42, height: 49 },
    lg: { width: 64, height: 75 },
    xl: { width: 96, height: 112 },
  };

  const titleSizeMap = {
    xs: 'text-xs tracking-[0.16em]',
    sm: 'text-sm tracking-[0.18em]',
    md: 'text-lg tracking-[0.2em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.22em]',
    xl: 'text-4xl sm:text-5xl tracking-[0.25em]',
  };

  const subSizeMap = {
    xs: 'text-[9px] tracking-normal',
    sm: 'text-[10px] tracking-normal',
    md: 'text-xs tracking-normal',
    lg: 'text-sm tracking-normal',
    xl: 'text-base tracking-normal',
  };

  const { width: markW, height: markH } = markSizeMap[size] || markSizeMap.md;

  /**
   * The botanical emblem reproduces the exact two-leaf sprout
   * rising from an undulating horizon soil line.
   */
  const renderMark = (customWidth?: number, customHeight?: number) => (
    <svg
      width={customWidth || markW}
      height={customHeight || markH}
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300"
      aria-label="Pastures Sprout Emblem"
    >
      {/* Ground horizon wave */}
      <path
        d="M 28 198 C 65 194, 95 195, 115 186 C 130 180, 150 188, 172 198"
        stroke={groundColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main stem (two graceful convergent lines meeting the ground) */}
      {/* Left stem arc */}
      <path
        d="M 98 195 C 108 190, 114 176, 116 160 C 117 148, 117 135, 117 122"
        stroke={primaryColor}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Right stem arc */}
      <path
        d="M 136 190 C 124 186, 119 174, 117 160"
        stroke={primaryColor}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Left Leaf Contour */}
      <path
        d="M 116 142 
           C 98 140, 72 125, 68 95 
           C 65 72, 85 58, 111 68
           C 114 85, 115 110, 116 142 Z"
        stroke={primaryColor}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Leaf Center Vein */}
      <path
        d="M 115 138 C 103 115, 90 98, 80 82"
        stroke={secondaryColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Right Leaf Contour (larger, sweeping upward to the right) */}
      <path
        d="M 117 122 
           C 120 90, 134 50, 174 44
           C 185 85, 160 128, 118 148"
        stroke={primaryColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Leaf Center Vein */}
      <path
        d="M 118 132 C 132 108, 146 86, 164 56"
        stroke={secondaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'mark-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderMark()}</div>;
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex flex-col ${className}`}>
        <span
          className={`font-sans font-bold uppercase ${titleSizeMap[size]} leading-none`}
          style={{ color: primaryColor }}
        >
          PASTURES
        </span>
        {showSubtitle && (
          <span
            className={`font-sans font-normal ${subSizeMap[size]} mt-1 leading-tight`}
            style={{ color: secondaryColor }}
          >
            Gardening and Maintenance
          </span>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    // Stacked full logo (Emblem above, PASTURES below, subtitle at base) - exact image layout
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderMark()}
        <div className="mt-3 flex flex-col items-center">
          <span
            className={`font-sans font-bold uppercase ${titleSizeMap[size]} leading-none tracking-[0.24em]`}
            style={{ color: primaryColor }}
          >
            PASTURES
          </span>
          {showSubtitle && (
            <span
              className={`font-sans font-normal ${subSizeMap[size]} mt-1.5 leading-snug`}
              style={{ color: secondaryColor }}
            >
              Gardening and Maintenance
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: 'horizontal' lockup (mark on left, text on right)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderMark()}
      <div className="flex flex-col justify-center">
        <span
          className={`font-sans font-bold uppercase ${titleSizeMap[size]} leading-none tracking-[0.2em]`}
          style={{ color: primaryColor }}
        >
          PASTURES
        </span>
        {showSubtitle && (
          <span
            className={`font-sans font-normal ${subSizeMap[size]} mt-1 leading-tight`}
            style={{ color: secondaryColor }}
          >
            Gardening and Maintenance
          </span>
        )}
      </div>
    </div>
  );
};
