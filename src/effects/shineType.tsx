import { ColorOption, ColorPresets, getColorStyle } from "./colorType";

/**
 * Okay future me, read this summary so you re-learn the stuff happened today regarding the use of constant 
 * and type for this util component to works.
 * 
 * Why we declare directions and sizes as `const` arrays instead of only using type unions:
 *
 * TypeScript types (like `type shineDirection = "top" | "bottom" | ...`) exist only at compile time.
 * They completely disappear at runtime — meaning you can’t do runtime operations such as `.includes()` checks
 * or loops with them.
 *
 * By declaring these as constant arrays (`as const`):
 * 
 *   export const ShineDirections = ["top", "bottom", "left", ...] as const;
 *
 * we achieve two important things:
 * 
 * Runtime Availability:
 *     - We can use them for logic in code (e.g., checking if a string is a valid direction).
 *       Example: `ShineDirections.includes(direction)`
 *
 * Type Safety & Autocomplete:
 *     - We can derive a *type* from the array using `typeof ShineDirections[number]`,
 *       giving us `"top" | "bottom" | "left" | ...` as a union type automatically.
 *     - This provides full IntelliSense/autocomplete support for valid values in VSCode or other editors.
 *
 * In short:
 * These const arrays act as the single source of truth — used both
 * at runtime (for parsing and matching) and at compile time (for type safety and suggestions).
 * 
 *  
 **/


export const ShineDirections = [ 
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
] as const;

export const ShineSizes = [
  'sm',
  'base',
  'md',
  'lg',
  'xl'
] as const;

export const ShineIntensities = [
  "soft",
  "base",
  "strong",
  "hard"
] as const;


// Derived types from the constant arrays above. Used in parsing and type-checking below.
export type shineDirection = typeof ShineDirections[number];
export type shineSize = typeof ShineSizes[number];
export type shineIntensity = typeof ShineIntensities[number];

// string = ColorOption | 'custom-color'
export type shineType = `${shineDirection}-${shineSize}-${string}-${string}` | `${shineDirection}-${shineSize}`;

export const ShinePresets: Record<string, string> = (() => {
  
  // Define base offset directions (X, Y)
  const directionOffsets: Record<shineDirection, [number, number]> = {
    top: [0, 1],
    bottom: [0, -1],
    left: [1, 0],
    right: [-1, 0],
    "top-left": [1, 1],
    "top-right": [-1, 1],
    "bottom-left": [1, -1],
    "bottom-right": [-1, -1],
  };

  // Define size profiles multipliers for scaling offsets and blurs
  const sizeProfiles: Record<shineSize, { offset: number; blur: number }> = {
    sm:   { offset: 1, blur: 1 },
    base: { offset: 2.25, blur: 1.4 },
    md:   { offset: 3.75, blur: 1.8 },
    lg:   { offset: 6, blur: 2.2 },
    xl:   { offset: 8, blur: 2.8 },
  };

  const intensityProfiles: Record<shineIntensity, { opacity: number; spread: number; contrast: number }> = {
    soft:   { opacity: 0.5, spread: 1.2, contrast: 0.8 },
    base:   { opacity: 1.0, spread: 1.0, contrast: 1.0 },
    strong: { opacity: 1.3, spread: 0.9, contrast: 1.1 },
    hard:   { opacity: 1.6, spread: 0.8, contrast: 1.3 },
  };

  const generateLayer = (
    x: number,
    y: number,
    size: { offset: number; blur: number },
    intensity: { opacity: number; spread: number; contrast: number }
  ) => {
    const o = size.offset * intensity.spread;
    const b = size.blur * intensity.spread;
    const a = intensity.opacity;
    const c = intensity.contrast;
  
    return [
      `inset ${x * 2 * o}px ${y * 2 * o}px ${2 * b}px -${1 * o}px rgba(var(--highlight), ${0.2 * a * c})`,
      `inset ${x * 1.5 * o}px ${y * 1.5 * o}px ${1.5 * b}px -${1 * o}px rgba(var(--highlight), ${0.1 * a})`,
      `inset ${x * 0.25 * o}px ${y * 0.25 * o}px ${0.5 * b}px -${0.25 * o}px rgba(var(--highlight), ${0.15 * a / c})`,
      `inset ${x * 0.25 * o}px ${y * 0.25 * o}px ${0.25 * b}px rgba(var(--highlight), ${0.08 * a / c})`,
      `inset 0 0 ${0.25 * b}px ${0.25 * o}px rgba(var(--highlight), ${0.03 * a / c})`
    ].join(", ");
  };

  const result: Record<string, string> = {};

  for (const [sizeKey, sizeVal] of Object.entries(sizeProfiles)) {
    for (const [intensityKey, intensityVal] of Object.entries(intensityProfiles)) {
      for (const [dir, [x, y]] of Object.entries(directionOffsets)) {
        const key = `${dir}-${sizeKey}-${intensityKey}`;
        result[key] = generateLayer(x, y, sizeVal, intensityVal);
      }
    }
  }
  return result; //fallback

})();

// Helper function to parse shineType into its components (direction, size, and color)
function parseShine(shine: shineType) {
  const normalized = shine.trim();

  // Match longest valid direction prefix
  const sortedDirections = [...ShineDirections].sort((a, b) => b.length - a.length);
  
  const direction = sortedDirections.find(dir => {
    if (normalized === dir) return true;
    if (!normalized.startsWith(dir)) return false;
    return normalized.charAt(dir.length) === '-';
  }) as shineDirection;

  if (!direction) {
    return {
      direction: "top-left" as shineDirection,
      size: "base" as shineSize,
      intensity: "base" as shineIntensity,
      color: "white"
    };
  }

  // Remove direction and split the remaining string
  const remaining = normalized.slice(direction.length + 1);
  const parts = remaining.split("-");

  // Extract size and intensity if present
  const size = parts.find(p => ShineSizes.includes(p as any)) as shineSize | undefined;
  const intensity = parts.find(p => ShineIntensities.includes(p as any)) as shineIntensity | undefined;

  // Determine parsing order
  const sizeIndex = size ? parts.indexOf(size) : -1;
  const intensityIndex = intensity ? parts.indexOf(intensity) : -1;
  const lastKnownIndex = Math.max(sizeIndex, intensityIndex);

  // Extract color (anything after size or intensity)
  let colorPart: string | undefined;
  if (lastKnownIndex !== -1 && parts.length > lastKnownIndex + 1) {
    colorPart = parts.slice(lastKnownIndex + 1).join("-").trim();
  }

  // Validate color
  const isPresetColor = colorPart && colorPart in ColorPresets;
  const isCustomRGB = /^(\d{1,3}([-,\s])){2}\d{1,3}$/.test(colorPart ?? "");

  // Normalize custom RGB (replace any dash or comma with space)
  const normalizedColor = isCustomRGB
  ? colorPart!.replace(/[-,]/g, " ").trim()
  : colorPart;

  const color = normalizedColor 
    && (normalizedColor === "white" || normalizedColor in ColorPresets || isCustomRGB)
    ? normalizedColor
    : "white";

  return {
    direction,
    size: size ?? "base",
    intensity: intensity ?? "base",
    color
  };
}

export function getShineStyle(shine: string, theme: "light" | "dark" = "light"): string {
  const { direction, size, intensity, color } = parseShine(shine as shineType);

  const presetKey = `${direction}-${size}-${intensity}`;
  let shineStyle = ShinePresets[presetKey] || "";

  const colorValue = color in ColorPresets
    ? getColorStyle(color as ColorOption, theme)
    : color;

  // Normalize spaces/newlines and insert color
  shineStyle = shineStyle
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/var\(--highlight\)/g, colorValue);

  return shineStyle;
}

export type ShineOption = shineType | (string & {});