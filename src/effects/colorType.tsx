export type ColorType = 
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
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone';

export const ColorPresets: Record<ColorType, { light: string; dark: string }> = {
  'red': {
    light: '177, 3, 12',
    dark: '127, 6, 14',
  },
  'orange': {
    light: '204, 84, 0',
    dark: '127, 36, 0',
  },
  'amber': {
    light: '203, 123, 0',
    dark: '150, 62, 0',
  },
  'yellow': {
    light: '192, 142, 0',
    dark: '133, 76, 0',
  },
  'lime': {
    light: '99, 166, 0',
    dark: '48, 79, 0',
  },
  'green': {
    light: '0, 161, 65',
    dark: '0, 77, 55',
  },
  'emerald': {
    light: '0, 150, 100',
    dark: '0, 77, 55',
  },
  'teal': {
    light: '0, 150, 134',
    dark: '0, 76, 72',
  },
  'cyan': {
    light: '0, 147, 174',
    dark: '0, 76, 96',
  },
  'sky': {
    light: '0, 133, 195',
    dark: '0, 71, 110',
  },
  'blue': {
    light: '0, 71, 178',
    dark: '20, 48, 147',
  },
  'indigo': {
    light: '26, 8, 168',
    dark: '44, 34, 138',
  },
  'violet': {
    light: '54, 0, 155',
    dark: '74, 11, 154',
  },
  'purple': {
    light: '90, 0, 162',
    dark: '88, 14, 141',
  },
  'fuchsia': {
    light: '156, 3, 178',
    dark: '110, 1, 118',
  },
  'pink': {
    light: '171, 8, 84',
    dark: '130, 0, 61',
  },
  'rose': {
    light: '180, 0, 45',
    dark: '132, 0, 43',
  },
  'slate': {
    light: '78, 93, 114',
    dark: '23, 33, 49',
  },
  'gray': {
    light: '89, 96, 100',
    dark: '24, 33, 46',
  },
  'zinc': {
    light: '89, 96, 100',
    dark: '30, 33, 34',
  },
  'neutral': {
    light: '87, 94, 97',
    dark: '29, 31, 32',
  },
  'stone': {
    light: '86, 93, 97',
    dark: '29, 31, 33',
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

  // return preset ? preset[theme] : ColorPresets.none[theme]
  // if the color is not found in ColorPresets, return none color with the specified theme
  return preset ? preset[theme] : '';
}

export type ColorOption = ColorType | (string & {});