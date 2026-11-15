interface PeriodicTileProps {
  atomicNumber: number | string;
  symbol: string;
  atomicWeight?: string;
  variant?: 'emerald' | 'amber' | 'cobalt' | 'crimson';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_CLASSES: Record<NonNullable<PeriodicTileProps['variant']>, string> = {
  emerald: 'bg-gradient-to-br from-[#2d6d1f] to-[#112e0d] border-[#64c94b]/70 text-white',
  amber: 'bg-gradient-to-br from-[#b46418] to-[#4f2607] border-[#f0a54e]/70 text-white',
  cobalt: 'bg-gradient-to-br from-[#1d5e8c] to-[#0a243a] border-[#60c2f7]/70 text-white',
  crimson: 'bg-gradient-to-br from-[#8c1d18] to-[#3a0907] border-[#f87171]/70 text-white',
};

const SIZE_CLASSES: Record<NonNullable<PeriodicTileProps['size']>, { box: string; sym: string; num: string }> = {
  sm: { box: 'w-8 h-8 rounded', sym: 'text-sm leading-none', num: 'text-[9px] leading-none' },
  md: { box: 'w-11 h-11 rounded-md', sym: 'text-xl leading-none', num: 'text-[10px] leading-none' },
  lg: { box: 'w-16 h-16 rounded-md', sym: 'text-3xl leading-none', num: 'text-xs leading-none' },
};

export function PeriodicTile({
  atomicNumber,
  symbol,
  atomicWeight,
  variant = 'emerald',
  size = 'md',
}: PeriodicTileProps) {
  const s = SIZE_CLASSES[size];
  return (
    <span
      className={`relative inline-flex flex-col items-center justify-center border font-bold select-none shrink-0 ${VARIANT_CLASSES[variant]} ${s.box}`}
    >
      <span className={`absolute top-1 left-1 font-mono-tabular font-medium opacity-85 ${s.num}`}>
        {atomicNumber}
      </span>
      <span className={`font-sans tracking-tight mt-1 ${s.sym}`}>{symbol}</span>
      {atomicWeight && size === 'lg' && (
        <span className="mt-0.5 font-mono-tabular text-[9px] font-normal opacity-75">{atomicWeight}</span>
      )}
    </span>
  );
}
