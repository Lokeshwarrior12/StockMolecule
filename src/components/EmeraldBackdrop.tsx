export function EmeraldBackdrop({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle geometric square grid matching the Fundora video */}
      <div className="fundora-grid-bg absolute inset-0" />

      {/* Top volumetric emerald spotlight shafts */}
      <div
        className={`emerald-beam-left absolute -top-28 left-[12%] h-[420px] w-[190px] rounded-full bg-emerald-500/25 blur-[76px] ${
          compact ? 'opacity-30' : ''
        }`}
      />
      <div
        className={`emerald-beam-center absolute -top-32 left-1/2 -translate-x-1/2 h-[440px] w-[260px] rounded-full bg-emerald-400/25 blur-[88px] ${
          compact ? 'opacity-30' : ''
        }`}
      />
      <div
        className={`emerald-beam-right absolute -top-28 right-[12%] h-[420px] w-[190px] rounded-full bg-emerald-500/20 blur-[76px] ${
          compact ? 'opacity-25' : ''
        }`}
      />

      {/* Top radial crown glow */}
      <div
        className="absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.04) 55%, transparent 100%)',
        }}
      />
    </div>
  );
}
