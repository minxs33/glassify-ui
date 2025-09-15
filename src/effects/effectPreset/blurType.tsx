export type BlurType = 
    | 'none' 
    | 'sm' 
    | 'base' 
    | 'md' 
    | 'lg' 
    | 'xl';

export const BlurPresets: Record<BlurType, string> = {
    none: '0px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
};

export const getBlurStyle = (blur: BlurType | string): string => {
    if (typeof blur === 'string' && !Object.keys(BlurPresets).includes(blur)) {
        return blur; // Return the string directly if it's not a preset
    }

    const preset = BlurPresets[blur as BlurType];

    return preset ? preset : BlurPresets.none; // Return the preset or default to 'none'
}

// Combined type for all blur options
export type BlurOption = BlurType | (string & {});