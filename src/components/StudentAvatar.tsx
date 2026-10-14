import React, { useState } from 'react';

interface StudentAvatarProps {
  photoUrl?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  const initials = (name || '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-black',
    '2xl': 'w-28 h-28 text-3xl font-black',
  };

  const chosenSizeClass = sizeMap[size] || sizeMap['md'];

  if (photoUrl && !hasError) {
    return (
      <div className={`${chosenSizeClass} rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-slate-100 ${className}`}>
        <img
          src={photoUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${chosenSizeClass} rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 border-2 border-white shadow-xs ${className}`}>
      {initials}
    </div>
  );
};
