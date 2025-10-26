import { BlurOption, getBlurStyle } from "./blurType";
import { TintOption, getTintStyle } from "./tintType";
import { TurbulenceOption, getTurbulenceStyle } from "./turbulenceType";
import { DisplacementOption, getDisplacementStyle } from "./displacementType";

export type EffectPresetType =
    | "none"
    | "frosted"
    | "crystal"
    | "misted"
    | "smoked"
    | "arctic"
    | "amber"
    | "opal"
    | "subtle"
    | "bold"
    | "vibrant"
    | "monochrome"

export interface EffectPresetConfig {
    blur?: BlurOption;
    tint?: TintOption;
    turbulence?: TurbulenceOption;
    displacement?: DisplacementOption;
}

export const EffectPresets: Record<EffectPresetType, EffectPresetConfig> = {
    none: {},
    frosted: {
        blur: 'lg',
        tint: 'frosted',
        turbulence: 'md',
        displacement: 'base'
    },
    misted: {
        blur: 'lg',
        tint: 'crystal',
        turbulence: 'base',
        displacement: 'base'
    },
    crystal: {
        blur: 'md',
        tint: 'slate',
        turbulence: 'base',
        displacement: 'lg'
    },
    smoked: {
        blur: 'xl',
        tint: 'smoke',
        turbulence: 'lg',
        displacement: 'lg'
    },
    arctic: {
        blur: 'lg',
        tint: 'cyan',
        turbulence: 'base',
        displacement: 'base'
    },
    amber: {
        blur: 'md',
        tint: 'amber',
        turbulence: 'sm',
        displacement: 'sm'
    },
    opal: {
        blur: 'xl',
        tint: 'glass',
        turbulence: 'base',
        displacement: 'base'
    },
    subtle: {
        blur: 'sm',
        tint: 'neutral',
        turbulence: 'none',
        displacement: 'none'
    },
    bold: {
        blur: 'xl',
        tint: 'zinc',
        turbulence: 'lg',
        displacement: 'lg'
    },
    vibrant: {
        blur: 'md',
        tint: 'fuchsia',
        turbulence: 'base',
        displacement: 'base'
    },
    monochrome: {
        blur: 'md',
        tint: 'neutral',
        turbulence: 'sm',
        displacement: 'sm'
    }
}

// Use ReturnType to get the actual return types from each getter
export interface EffectStyles {
    blur?: ReturnType<typeof getBlurStyle>;
    tint?: ReturnType<typeof getTintStyle>;
    turbulence?: ReturnType<typeof getTurbulenceStyle>;
    displacement?: ReturnType<typeof getDisplacementStyle>;
}

export const getEffectPresetStyle = (
    preset: EffectPresetType | string | EffectPresetOption,
    theme: 'light' | 'dark' = 'light',
    overrides?: Partial<EffectPresetConfig>
): EffectStyles => {
    
    let basePreset: string = 'none';
    let baseOverrides: Partial<EffectPresetConfig> = {};
    
    // Handle different input types
    if (typeof preset === 'string') {
        basePreset = preset;
    } else if (typeof preset === 'object' && 'preset' in preset) {
        basePreset = preset.preset;
        baseOverrides = preset.overrides ?? {};
    }
    
    // Get base preset configuration
    const base: EffectPresetConfig = EffectPresets[basePreset as EffectPresetType] ?? {};
    
    // Merge base with object overrides, then with parameter overrides (parameter overrides take precedence)
    const merged: EffectPresetConfig = {
        ...base,
        ...baseOverrides,
        ...overrides
    };
    
    // Filter out undefined or null values from overrides to only apply actual values
    const filteredMerged = Object.fromEntries(
        Object.entries(merged).filter(([_, value]) => value !== undefined && value !== null)
    ) as EffectPresetConfig;
    
    // Return the styles generated from the merged configuration
    return {
        blur: filteredMerged.blur ? getBlurStyle(filteredMerged.blur) : undefined,
        tint: filteredMerged.tint ? getTintStyle(filteredMerged.tint, theme) : undefined,
        turbulence: filteredMerged.turbulence ? getTurbulenceStyle(filteredMerged.turbulence, theme) : undefined,
        displacement: filteredMerged.displacement ? getDisplacementStyle(filteredMerged.displacement) : undefined
    };
};
  
export type EffectPresetOption = EffectPresetType | {
    preset: EffectPresetType;
    overrides?: Partial<EffectPresetConfig>;
}
