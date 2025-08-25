/**
 * ParceloLogo – a lightweight, dependency-free SVG logo component.
 *
 * Features
 * - Three variants: "horizontal" (icon + wordmark), "stacked" (icon above wordmark), and "icon" (mark only)
 * - Customizable colors and size
 * - Accessible (title/aria-label)
 *
 * Example:
 *   <ParceloLogo />
 *   <ParceloLogo variant="icon" size={40} />
 *   <ParceloLogo primary="#0ea5e9" secondary="#22c55e" textColor="#0f172a" />
 */
export type ParceloLogoProps = {
  variant?: "horizontal" | "stacked" | "icon";
  size?: number; // height in px for the whole logo
  primary?: string; // main brand color
  secondary?: string; // accent color (gradient end)
  textColor?: string; // wordmark color
  title?: string; // accessible title
  className?: string;
};

export default function Logo({
  variant = "horizontal",
  size = 48,
  primary = "#0EA5E9", // tailwind sky-500
  secondary = "#22C55E", // tailwind green-500
  textColor = "#0F172A", // tailwind slate-900
  title = "Parcelo logo",
  className,
}: ParceloLogoProps) {
  // Shared mark (the icon) rendered into an <svg> so it can be reused across variants
  const Mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id="parceloGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Parcel badge container */}
      <rect
        x="6"
        y="6"
        width="84"
        height="84"
        rx="18"
        fill="url(#parceloGrad)"
        filter="url(#softShadow)"
      />

      {/* Lid cut + seam lines (subtle) */}
      <path
        d="M18 40h60M48 18v60"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Route forming a stylized 'P' with pickup dot and arrow delivery */}
      <circle cx="30" cy="34" r="4" fill="#fff" />
      <path
        d="M30 34
           C30 50 46 50 54 50
           C66 50 70 42 70 36
           C70 26 62 22 54 22
           C42 22 36 28 36 36
           C36 44 42 48 52 48"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      {/* Arrow head for delivery */}
      <path
        d="M56 44l14 -4l-6 14"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
    </svg>
  );

  const Wordmark = ({ inline = false }: { inline?: boolean }) => (
    <svg
      height={inline ? size * 0.62 : size * 0.9}
      viewBox="0 0 560 120"
      aria-hidden="true"
    >
      {/* Using <text> keeps file size down and allows live theming. */}
      <text
        x="0"
        y="84"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight={800}
        fontSize="86"
        letterSpacing="1"
        fill={textColor}
      >
        Parcelo
      </text>
      {/* Little smile arc under the 'celo' — evokes friendly delivery */}
      <path
        d="M300 94c22 18 92 18 114 0"
        fill="none"
        stroke={textColor}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.15"
      />
    </svg>
  );

  if (variant === "icon") return Mark;

  if (variant === "stacked") {
    return (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: Math.round(size * 0.25),
        }}
        className={className}
        aria-label={title}
      >
        {Mark}
        <Wordmark />
      </div>
    );
  }

  // default: horizontal lockup
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.35),
      }}
      className={className}
      aria-label={title}
    >
      {Mark}
      <Wordmark inline />
    </div>
  );
}
