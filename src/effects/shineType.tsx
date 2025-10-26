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

export const ShineSizes = [
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl'
] as const;

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

// Derived types from the constant arrays above. Used in parsing and type-checking below.
export type shineDirection = typeof ShineDirections[number];
export type shineSize = typeof ShineSizes[number];

// string = ColorOption | 'custom-color'
export type shineType = `${shineDirection}-${shineSize}-${string}` | `${shineDirection}-${shineSize}`;

export const ShinePresets: Record<string, string> = (() => {
  const sizeMultipliers: Record<shineSize, number> = {
    sm: 1,
    base: 1.5,
    md: 2.25,
    lg: 3.75,
    xl: 6,
    "2xl": 8,
  };

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

  const generateLayer = (x: number, y: number, scale: number) => {
    const offset = Math.pow(scale, 0.9);
    const blur = Math.pow(scale, 1.3);
  
    return [
      `inset ${x * offset * 2}px ${y * offset * 2}px ${blur * 2}px -${scale * 1}px rgba(var(--highlight), 0.2)`,
      `inset ${x * offset * 1.5}px ${y * offset * 1.5}px ${blur * 1.5}px -${scale * 1}px rgba(var(--highlight), 0.1)`,
      `inset ${x * offset * 0.25}px ${y * offset * 0.25}px ${blur * 0.5}px -${scale * 0.25}px rgba(var(--highlight), 0.15)`,
      `inset ${x * offset * 0.25}px ${y * offset * 0.25}px ${blur * 0.25}px rgba(var(--highlight), 0.08)`,
      `inset 0 0 ${blur * 0.25}px ${scale * 0.25}px rgba(var(--highlight), 0.03)`
    ].join(', ');
  };

  const result: Record<string, string> = {};
  const sizeEntries = Object.entries(sizeMultipliers);
  const dirEntries = Object.entries(directionOffsets);

  for (let i = 0; i < sizeEntries.length; i++) {
    const [size, multiplier] = sizeEntries[i];
    for (let j = 0; j < dirEntries.length; j++) {
      const [dir, [x, y]] = dirEntries[j];
      result[`${dir}-${size}`] = generateLayer(x, y, multiplier).trim();
    }
  }

  return result;
})();

// Helper function to parse shineType into its components (direction, size, and color)
function parseShine(shine: shineType) {
    const normalized = shine.trim();

    // match longest valid direction prefix (top-left before top, etc.)
    const sortedDirections = [...ShineDirections].sort((a, b) => b.length - a.length);
    const direction = sortedDirections.find(dir => normalized.startsWith(dir + "-")) as shineDirection;

    if (!direction) {
      return { direction: "top-left" as shineDirection, size: "base" as shineSize, color: "neutral" };
    }

    // remove direction and split the rest
    const remaining = normalized.slice(direction.length + 1);
    const parts = remaining.split("-");

    // extract size
    const size = parts.find(p => ShineSizes.includes(p as any)) as shineSize;
    const sizeIndex = size ? parts.indexOf(size) : -1;

    // color after size
    let colorPart: string | undefined;
    if (sizeIndex !== -1 && parts.length > sizeIndex + 1) {
      colorPart = parts.slice(sizeIndex + 1).join("-").trim();
    }

    // no color provided → default
    if (!colorPart) {
      return { direction, size, color: "neutral" };
    }

    // Is a valid ColorOption?
    const isPresetColor = colorPart in ColorPresets;

    // Is a custom numeric RGB triplet (e.g. "24 124 19")?
    const isCustomRGB = /^(\d{1,3}\s+){2}\d{1,3}$/.test(colorPart);

    const color =
      colorPart === "neutral" || isPresetColor || isCustomRGB
        ? colorPart
        : "neutral"; // fallback

    return { direction, size, color };
}


export function getShineStyle(shine: string, theme: "light" | "dark" = "light"): string {
  
  // Parse the shine string to get direction, size, and color
  const { direction, size, color } = parseShine(shine as shineType);
  // console.log(direction, size, color);

  // Get the corresponding shine style from presets, default to empty string if not found
  const presetKey = `${direction}-${size}`;
  let shineStyle = ShinePresets[presetKey] || "";

  // If the color exists in presets, get its HSL string, else use the raw color
  const colorValue = color in ColorPresets
    ? getColorStyle(color as ColorOption, theme)
    : color;

    shineStyle = shineStyle
    .replace(/\s*\n\s*/g, ' ')  // remove line breaks
    .replace(/\s{2,}/g, ' ')    // collapse extra spaces
    .replace(/\s*,\s*/g, ', ')  // normalize comma spacing
    .trim();
    
  // console.log(shineStyle);
  return shineStyle.replace(/var\(--highlight\)/g, colorValue);
}

export type ShineOption = shineType | (string & {});