export type ColorType = 
  | 'none' 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'purple' 
  | 'pink' 
  | 'yellow' 
  | 'indigo' 
  | 'teal' 
  | 'orange' 
  | 'emerald'

export const ColorPresets: Record<ColorType, { light: string; dark: string }> = {
    'none': {
      light: '255 255 255',
      dark: '255 255 255',
    },
    'blue': {
      light: '59 130 246',
      dark: '37 99 235',
    },
    'red': {
      light: '239 68 68',
      dark: '153 27 27',
    },
    'green': {
      light: '34 197 94',
      dark: '21 128 61',
    },
    'purple': {
      light: '168 85 247',
      dark: '126 34 206',
    },
    'pink': {
      light: '236 72 153',
      dark: '157 23 77',
    },
    'yellow': {
      light: '234 179 8',
      dark: '161 98 7',
    },
    'indigo': {
      light: '79 70 229',
      dark: '67 56 202',
    },
    'teal': {
      light: '13 148 136',
      dark: '19 78 74',
    },
    'orange': {
      light: '249 115 22',
      dark: '154 52 18',
    },
    'emerald': {
      light: '16 185 129',
      dark: '6 95 70',
    },
};

export const getColorStyle = (
  color: ColorOption,
  theme: 'light' | 'dark' = 'light'
): string => {
  if(typeof color === 'string' && !Object.keys(ColorPresets).includes(color)){ //if the color is a string and not a ColorType
    return color; // Return the string directly
  }

  const preset = ColorPresets[color as ColorType];

  return preset ? preset[theme] : ColorPresets.none[theme] // if the color is not found in ColorPresets, return none color with the specified theme
}

export type ColorOption = ColorType | (string & {});