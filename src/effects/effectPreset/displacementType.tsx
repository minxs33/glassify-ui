export type DisplacementType =
    | 'none'
    | 'sm'
    | 'base'
    | 'md'
    | 'lg'
    
export const DisplacementPresets: Record<DisplacementType, string> = {
    none: '0',
    sm: '25',
    base: '50',
    md: '75',
    lg: '100',
}

export const getDisplacementStyle = (
    displacement: DisplacementType | string
): string => {
    if (typeof displacement === 'string' && !Object.keys(DisplacementPresets).includes(displacement)) {
        return displacement; // Return the string directly if it's not a preset
    }

    const preset = DisplacementPresets[displacement as DisplacementType];

    return preset ? preset : DisplacementPresets.none; // Return the preset or default to 'none'
}

// Combined type for all displacement options
export type DisplacementOption = DisplacementType | (string & {});