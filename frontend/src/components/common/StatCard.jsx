import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  variant = 'default',
  badge,
  onClick
}) {
  const borderVariants = {
    default: 'border-slate-800 hover:border-slate-700 bg-slate-900/90',
    critical: 'border-rose-500/40 hover:border-rose-500/60 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30',
    high: 'border-orange-500/40 hover:border-orange-500/60 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20',
    warning: 'border-amber-500/30 hover:border-amber-500/50 bg-slate-900/90',
    success: 'border-emerald-500/30 hover:border-emerald-500/50 bg-slate-900/90',
    info: 'border-sky-500/30 hover:border-sky-500/50 bg-slate-900/90'
  };

  const textVariants = {
    default: 'text-slate-100',
    critical: 'text-rose-400',
    high: 'text-orange-400',
    warning: 'text-amber-400',
    success: 'text-emerald-400',
    info: 'text-sky-400'
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 ${borderVariants[variant] || borderVariants.default} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            {badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {badge}
              </span>
            )}
          </div>
          <p className={`mt-2 text-2xl lg:text-3xl font-bold tracking-tight ${textVariants[variant] || textVariants.default}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span className={trendDirection === 'up' ? 'text-rose-400' : trendDirection === 'down' ? 'text-emerald-400' : 'text-slate-400'}>
                {trend}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
