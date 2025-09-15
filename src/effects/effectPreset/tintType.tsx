export type TintType = 
  // Neutral tints
  | 'none'
  | 'white'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  
  // Color tints
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  
  // Special effect tints
  | 'frosted'
  | 'glass'
  | 'crystal'
  | 'smoke';

export interface TintConfig {
  light: string;
  dark: string;
}

export const TintPresets: Record<TintType, TintConfig> = {
  // Neutral tints
  none: {
    light: '0, 0, 0, 0',
    dark: '0, 0, 0, 0'
  },
  
  white: {
    light: '255, 255, 255, 0.08',
    dark: '255, 255, 255, 0.05'
  },
  
  slate: {
    light: '100, 116, 139, 0.1',
    dark: '148, 163, 184, 0.08'
  },
  
  gray: {
    light: '107, 114, 128, 0.1',
    dark: '156, 163, 175, 0.08'
  },
  
  zinc: {
    light: '113, 113, 122, 0.1',
    dark: '161, 161, 170, 0.08'
  },
  
  neutral: {
    light: '115, 115, 115, 0.1',
    dark: '163, 163, 163, 0.08'
  },
  
  stone: {
    light: '120, 113, 108, 0.1',
    dark: '168, 162, 158, 0.08'
  },
  
  // Reds
  red: {
    light: '239, 68, 68, 0.12',
    dark: '248, 113, 113, 0.1'
  },
  
  // Oranges
  orange: {
    light: '249, 115, 22, 0.12',
    dark: '251, 146, 60, 0.1'
  },
  
  amber: {
    light: '245, 158, 11, 0.12',
    dark: '251, 191, 36, 0.1'
  },
  
  yellow: {
    light: '234, 179, 8, 0.14',
    dark: '250, 204, 21, 0.12'
  },
  
  // Greens
  lime: {
    light: '132, 204, 22, 0.12',
    dark: '163, 230, 53, 0.1'
  },
  
  green: {
    light: '34, 197, 94, 0.12',
    dark: '74, 222, 128, 0.1'
  },
  
  emerald: {
    light: '16, 185, 129, 0.12',
    dark: '52, 211, 153, 0.1'
  },
  
  teal: {
    light: '20, 184, 166, 0.12',
    dark: '45, 212, 191, 0.1'
  },
  
  // Blues
  cyan: {
    light: '6, 182, 212, 0.12',
    dark: '34, 211, 238, 0.1'
  },
  
  sky: {
    light: '14, 165, 233, 0.12',
    dark: '56, 189, 248, 0.1'
  },
  
  blue: {
    light: '59, 130, 246, 0.12',
    dark: '96, 165, 250, 0.1'
  },
  
  indigo: {
    light: '99, 102, 241, 0.12',
    dark: '129, 140, 248, 0.1'
  },
  
  // Purples
  violet: {
    light: '139, 92, 246, 0.12',
    dark: '167, 139, 250, 0.1'
  },
  
  purple: {
    light: '147, 51, 234, 0.12',
    dark: '168, 85, 247, 0.1'
  },
  
  fuchsia: {
    light: '217, 70, 239, 0.12',
    dark: '232, 121, 249, 0.1'
  },
  
  // Pinks
  pink: {
    light: '236, 72, 153, 0.12',
    dark: '244, 114, 182, 0.1'
  },
  
  rose: {
    light: '244, 63, 94, 0.12',
    dark: '251, 113, 133, 0.1'
  },
  
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