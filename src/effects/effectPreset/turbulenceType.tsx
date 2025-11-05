export type TurbulenceType =
    | 'none'
    | 'sm'
    | 'base'
    | 'md'
    | 'lg'
    | 'xl';

export interface TurbulenceConfig{
  numOctaves: number;
  baseFreq: number;
}

export interface TurbulenceThemeConfig {
  default?: TurbulenceConfig;
  theme?: {
      light: TurbulenceConfig
      dark: TurbulenceConfig
  }
}

export const TurbulencePresets: Record<TurbulenceType, TurbulenceThemeConfig> = {
  none: {
    default: { numOctaves: 0, baseFreq: 0 },
  },
  sm: {
    theme: {
      light: { numOctaves: 1, baseFreq: 0.005 },
      dark: { numOctaves: 1, baseFreq: 0.0075 },
    },
  },
  base: {
    theme: {
      light: { numOctaves: 1, baseFreq: 0.01 },
      dark: { numOctaves: 1, baseFreq: 0.015 },
    },
  },
  md: {
    theme: {
      light: { numOctaves: 2, baseFreq: 0.02 },
      dark: { numOctaves: 2, baseFreq: 0.03 },
    },
  },
  lg: {
    theme: {
      light: { numOctaves: 2, baseFreq: 0.03 },
      dark: { numOctaves: 2, baseFreq: 0.04 },
    },
  },
  xl: {
    theme: {
      light: { numOctaves: 3, baseFreq: 0.04 },
      dark: { numOctaves: 3, baseFreq: 0.05 },
    },
  },
};

// Type guard to check if a value is a TurbulenceConfig
function isTurbulenceConfig(value: unknown): value is Partial<TurbulenceConfig> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (
      'baseFreq' in value ||
      'numOctaves' in value
    )
  );
}

export const getTurbulenceStyle = (
  turbulence: TurbulenceType | string | Partial<TurbulenceConfig>,
  theme: 'light' | 'dark' = 'light'
): TurbulenceConfig => {
  const fallback: TurbulenceConfig = { numOctaves: 0, baseFreq: 0 };

  // Custom object case
  if (isTurbulenceConfig(turbulence)) {
    const preset =
    TurbulencePresets.none.theme?.[theme] ??
      TurbulencePresets.none.default ??
      fallback;
    
    return {
      ...preset,
      ...turbulence,
    };
  }

  const preset = TurbulencePresets[turbulence as TurbulenceType];
  console.log("[Glassify UI] Info: Using turbulence preset:", preset);
  return preset.theme?.[theme] ?? preset.default ?? fallback;
};

// Combined type for all turbulence options
// export type TurbulenceOption = TurbulenceType | Partial<TurbulenceConfig> | (string & {});
export type TurbulenceOption = TurbulenceType | (string & {}) | Partial<TurbulenceConfig>;
  