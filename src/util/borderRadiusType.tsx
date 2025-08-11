export type BorderRadiusType =
    | 'none'
    | 'sm'
    | 'base'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | 'full';

export const BorderRadiusPresets: Record<BorderRadiusType, string> = {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
};

export const getBorderRadiusStyle = (
    borderRadius: BorderRadiusType | string
): string => {
    if (typeof borderRadius === 'string' && !Object.keys(BorderRadiusPresets).includes(borderRadius)) {
        return borderRadius; // Return the string directly if it's not a preset
    }

    const preset = BorderRadiusPresets[borderRadius as BorderRadiusType];

    return preset ? preset : BorderRadiusPresets.none; // Return the preset or default to 'none'
}

// Combined type for all border radius options
export type BorderRadiusOption = (string & {}) | BorderRadiusType