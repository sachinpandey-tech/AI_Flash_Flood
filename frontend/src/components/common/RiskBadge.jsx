import React from 'react';

export default function RiskBadge({ level = 'low', size = 'md', pulse = true, className = '' }) {
  const norm = (level || 'low').toLowerCase();

  const configs = {
    low: {
      label: 'LOW RISK',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400'
    },
    moderate: {
      label: 'MODERATE',
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400'
    },
    high: {
      label: 'HIGH RISK',
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      dot: 'bg-orange-500'
    },
    critical: {
      label: 'CRITICAL',
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      dot: 'bg-rose-500'
    },
    info: {
      label: 'INFORMATIONAL',
      bg: 'bg-sky-500/15',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400'
    }
  };

  const cfg = configs[norm] || configs.low;
  const isHighOrCrit = norm === 'high' || norm === 'critical';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wide'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="relative flex h-2 w-2">
        {pulse && isHighOrCrit && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
      </span>
      {cfg.label}
    </span>
  );
}
