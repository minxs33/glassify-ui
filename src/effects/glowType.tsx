// add (or keep) your existing types
export type GlowDirection = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'all';
export type GlowIntensity = `${number}%` | number;
export type GlowPreset = 'none' | 'soft' | 'medium' | 'strong';

export interface GlowConfig {
  gradient: string;
  intensity: number;
}

// internal shape for presets (store params, not gradient)
interface GlowPresetDef {
  direction: GlowDirection;
  intensity: number;
}

export const DEFAULT_GLOW_INTENSITY = 0.5;

// presets store direction + intensity only
export const GlowPresets: Record<GlowPreset, GlowPresetDef> = {
  none:   { direction: 'all', intensity: 0 },
  soft:   { direction: 'all', intensity: 0.2 },
  medium: { direction: 'all', intensity: 0.5 },
  strong: { direction: 'all', intensity: 0.8 },
};

// color-aware gradient builder
export function makeGlowGradient(
  direction: GlowDirection,
  intensity: number,
  colorRGB: string = '255,255,255'
): string {
  const a = Math.max(0, Math.min(1, intensity));
  const colorStop = `rgba(${colorRGB}, ${a})`;
  const transparent = `rgba(${colorRGB}, 0)`;

  switch (direction) {
    case 'top':    return `linear-gradient(to top, ${colorStop}, ${transparent})`;
    case 'bottom': return `linear-gradient(to bottom, ${colorStop}, ${transparent})`;
    case 'left':   return `linear-gradient(to left, ${colorStop}, ${transparent})`;
    case 'right':  return `linear-gradient(to right, ${colorStop}, ${transparent})`;
    case 'center': return `radial-gradient(circle at center, ${colorStop}, ${transparent})`;
    case 'all':
    default:       return `radial-gradient(circle, ${colorStop}, ${transparent})`;
  }
}

export const getGlowStyle = (
  glow: GlowOption,
  colorRGB: string = '255,255,255'
): GlowConfig => {
  // preset
  if (glow in GlowPresets) {
    const { direction, intensity } = GlowPresets[glow as GlowPreset];
    // special-case 'none'
    if (intensity === 0) return { gradient: 'none', intensity: 0 };
    return {
      gradient: makeGlowGradient(direction, intensity, colorRGB),
      intensity,
    };
  }

  // direction only
  if (!glow.includes(':')) {
    return {
      gradient: makeGlowGradient(glow as GlowDirection, DEFAULT_GLOW_INTENSITY, colorRGB),
      intensity: DEFAULT_GLOW_INTENSITY,
    };
  }

  // direction + intensity
  const [dir, val] = glow.split(':') as [GlowDirection, GlowIntensity];
  const parsed =
    typeof val === 'string' && val.endsWith('%')
      ? parseFloat(val) / 100
      : parseFloat(String(val));

  const finalIntensity = isNaN(parsed) ? DEFAULT_GLOW_INTENSITY : parsed;

  return {
    gradient: makeGlowGradient(dir, finalIntensity, colorRGB),
    intensity: finalIntensity,
  };
};

export type GlowOption = GlowPreset | GlowDirection | `${GlowDirection}:${GlowIntensity}`;