import React from 'react';

interface SarLogoProps {
  className?: string;
  variant?: 'teal' | 'white' | 'monochrome' | 'dark';
  layout?: 'horizontal' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SarLogo: React.FC<SarLogoProps> = ({
  className = '',
  variant = 'teal',
  layout = 'horizontal',
  size = 'md',
}) => {
  const colors = (() => {
    switch (variant) {
      case 'white':
        return {
          main: '#FFFFFF',
          arabic: '#FFFFFF',
          english: '#E2E8F0',
          badgeBg: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.25)',
        };
      case 'monochrome':
        return {
          main: '#0F172A',
          arabic: '#0F172A',
          english: '#334155',
          badgeBg: '#F1F5F9',
          border: '#CBD5E1',
        };
      case 'dark':
        return {
          main: '#028489',
          arabic: '#0F172A',
          english: '#475569',
          badgeBg: '#E6F4F5',
          border: '#BCE3E5',
        };
      case 'teal':
      default:
        return {
          main: '#00707B',
          arabic: '#0B4D54',
          english: '#334155',
          badgeBg: '#F0F9FA',
          border: 'rgba(0, 112, 123, 0.25)',
        };
    }
  })();

  const sizeClasses = {
    sm: {
      svg: 'h-6 sm:h-7',
      textAr: 'text-xs',
      textEn: 'text-[8px]',
      padding: 'px-2 py-1',
    },
    md: {
      svg: 'h-8 sm:h-9',
      textAr: 'text-sm',
      textEn: 'text-[9.5px]',
      padding: 'px-2.5 py-1.5',
    },
    lg: {
      svg: 'h-10 sm:h-12',
      textAr: 'text-base',
      textEn: 'text-[11px]',
      padding: 'px-3 py-2',
    },
    xl: {
      svg: 'h-14 sm:h-16',
      textAr: 'text-lg',
      textEn: 'text-xs',
      padding: 'px-4 py-2.5',
    },
  }[size];

  const svgElement = (
    <svg
      viewBox="0 0 170 54"
      className={`${sizeClasses.svg} w-auto shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SAR"
    >
      {/* S */}
      <path
        d="M 44 14 C 42 10, 36 8, 26 8 C 15 8, 9 12, 9 18 C 9 23, 14 26, 25 28 C 37 30, 45 33, 45 40 C 45 47, 37 52, 25 52 C 13 52, 8 46, 7 42"
        stroke={colors.main}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* A */}
      <path
        d="M 64 52 L 85 8 L 106 52"
        stroke={colors.main}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="74"
        y1="38"
        x2="96"
        y2="38"
        stroke={colors.main}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* R */}
      <line
        x1="122"
        y1="8"
        x2="122"
        y2="52"
        stroke={colors.main}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 122 8 H 139 C 152 8, 156 14, 156 21 C 156 28, 150 34, 137 34 H 122"
        stroke={colors.main}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 137 34 L 157 52"
        stroke={colors.main}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );

  if (layout === 'stacked') {
    return (
      <div dir="ltr" className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="flex items-center justify-center">{svgElement}</div>
        <div
          dir="rtl"
          className={`${sizeClasses.textAr} font-black tracking-normal mt-1 leading-tight`}
          style={{ color: colors.arabic }}
        >
          الخطوط الحديدية السعودية
        </div>
        <div
          dir="ltr"
          className={`${sizeClasses.textEn} font-black tracking-[0.18em] uppercase mt-0.5 leading-tight`}
          style={{ color: colors.english }}
        >
          SAUDI ARABIA RAILWAYS
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        dir="ltr"
        className={`${sizeClasses.padding} rounded-xl flex items-center justify-center shrink-0 border`}
        style={{ backgroundColor: colors.badgeBg, borderColor: colors.border }}
      >
        {svgElement}
      </div>
      <div className="flex flex-col justify-center text-left">
        <span
          dir="rtl"
          className={`${sizeClasses.textAr} font-black leading-tight text-right`}
          style={{ color: colors.arabic }}
        >
          الخطوط الحديدية السعودية
        </span>
        <span
          dir="ltr"
          className={`${sizeClasses.textEn} font-black tracking-[0.16em] uppercase leading-tight mt-0.5`}
          style={{ color: colors.english }}
        >
          SAUDI ARABIA RAILWAYS
        </span>
      </div>
    </div>
  );
};
