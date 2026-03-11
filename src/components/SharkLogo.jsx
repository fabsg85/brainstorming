import { T } from "../constants";

export default function SharkLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="12" fill={T.text} />
      <path d="M7 27 C9 20,16 17,24 18 L31 16 L27 21 C31 21,36 23,37 27 C33 26,28 25,24 26 L22 30 L20 26 C15 26,11 26,7 27Z" fill="#FFF" />
      <path d="M20 18 L24 11 L28 18" fill="#FFF" opacity="0.65" />
      <circle cx="29" cy="23" r="1.4" fill={T.text} />
      <path d="M7 27 L4 23 M7 27 L4 31" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}
