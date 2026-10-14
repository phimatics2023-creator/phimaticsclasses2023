import React, { useState } from 'react';
import { useAppContent } from '../context/ContentContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  className = '',
  isDark = false
}) => {
  const [imageError, setImageError] = useState(false);
  const { content } = useAppContent();

  const appName = content?.general?.appName || 'PhiMatiCs Classes';
  const tagline = content?.general?.tagline || 'The Learning App';
  const customLogoUrl = content?.general?.logoUrl;

  const logoSrc = (!imageError && customLogoUrl && customLogoUrl.trim() !== '') 
    ? customLogoUrl 
    : '/phimatics-logo.svg';

  const badgeSizes = {
    sm: 'h-9 w-auto max-w-[44px]',
    md: 'h-11 w-auto max-w-[52px]',
    lg: 'h-16 w-auto max-w-[72px]'
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base font-extrabold',
    md: 'text-base sm:text-lg font-black',
    lg: 'text-xl sm:text-2xl font-black'
  };

  const subtitleSizes = {
    sm: 'text-[10px] sm:text-xs font-semibold',
    md: 'text-xs sm:text-sm font-semibold',
    lg: 'text-sm sm:text-base font-semibold'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Uploaded Logo Image used directly as it is */}
      <img 
        src={logoSrc} 
        alt={`${appName} Logo`} 
        onError={() => {
          if (logoSrc !== '/phimatics-logo.svg') {
            setImageError(true);
          }
        }}
        className={`${badgeSizes[size]} object-contain shrink-0 rounded-lg`}
      />

      {/* Beside Logo Heading */}
      <div className="flex flex-col justify-center leading-tight">
        <span className={`tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} ${titleSizes[size]}`}>
          {appName}
        </span>
        {showSubtitle && (
          <span className={`tracking-normal ${isDark ? 'text-sky-300' : 'text-sky-600'} ${subtitleSizes[size]}`}>
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};
