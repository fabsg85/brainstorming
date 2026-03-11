export default function SharkLogo({ size = 36 }) {
  const r = Math.round(size * 0.25);
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx={r} fill="var(--bg)"/>
      <path
        d="M8 24 L15 10 L18 17 L22 14 L27 24 Z"
        fill="none"
        stroke="url(#sharkGrad)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="6" y1="24" x2="30" y2="24" stroke="url(#sharkGrad)" strokeWidth="1.2" opacity="0.4"/>
      <line x1="9"  y1="27" x2="24" y2="27" stroke="url(#sharkGrad)" strokeWidth="0.8" opacity="0.18"/>
      <defs>
        <linearGradient id="sharkGrad" x1="6" y1="10" x2="30" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C5CE7"/>
          <stop offset="100%" stopColor="#00F5D4"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
