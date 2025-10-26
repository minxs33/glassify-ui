import { ColorType, ColorPresets } from '../colorType';
export type TintType = 
  'none'
  // Imported from colorType.tsx
  | ColorType
  
  // Special effect tints
  | 'frosted'
  | 'glass'
  | 'crystal'
  | 'smoke';

export interface TintConfig {
  light: string;
  dark: string;
}

// Generate color tints from ColorPresets with alpha adjusted
// TODO: Make this helper more flexible for other component and move it to colorType.tsx instead
const colorTints: Record<ColorType, { light: string; dark: string }> =
  Object.fromEntries(
    Object.entries(ColorPresets).map(([key, value]) => [
      key,
      { light: `${value.light} , 0.2`, dark: `${value.dark} , 0.15` }
    ])
  ) as Record<ColorType, { light: string; dark: string }>;

export const TintPresets: Record<TintType, TintConfig> = {
  // Neutral tints
  none: {
    light: '0, 0, 0, 0',
    dark: '0, 0, 0, 0'
  },
  
  // Imported from colorType.tsx with alpha adjusted using colorTints helper
  ...colorTints,
  
  // Special effects
  frosted: {
    light: '240, 248, 255, 0.2',
    dark: '240, 248, 255, 0.15'
  },
  
  glass: {
    light: '255, 255, 255, 0.1',
    dark: '255, 255, 255, 0.05'
  },
  
  crystal: {
    light: '230, 230, 250, 0.18',
    dark: '230, 230, 250, 0.14'
  },
  
  smoke: {
    light: '0, 0, 0, 0.08',
    dark: '255, 255, 255, 0.05'
  }
};

// Helper function to get tint style
export const getTintStyle = (
  tint: TintType | string, 
  theme: 'light' | 'dark' = 'light'
): string => {
  // If it's a custom string, return it directly
  if (typeof tint === 'string' && !Object.keys(TintPresets).includes(tint)) {
    return tint;
  }
  
  // If it's a preset, get the appropriate theme value
  const preset = TintPresets[tint as TintType];
  return preset ? preset[theme] : TintPresets.none[theme];
};

// Combined type for all tint options
export type TintOption = TintType | (string & {});