export type ColorType = | 'Default' | 'Blue' | 'Red' | 'Green' | 'Purple' | 'Pink' | 'Yellow' | 'Indigo' | 'Teal' | 'Orange' | 'Emerald'

export const ColorPresets: Record<ColorType, { light: string; dark: string }> = {
    'Default': {
      light: '255 255 255',
      dark: '255 255 255',
    },
    'Blue': {
      light: '59 130 246',
      dark: '37 99 235',
    },
    'Red': {
      light: '239 68 68',
      dark: '153 27 27',
    },
    'Green': {
      light: '34 197 94',
      dark: '21 128 61',
    },
    'Purple': {
      light: '168 85 247',
      dark: '126 34 206',
    },
    'Pink': {
      light: '236 72 153',
      dark: '157 23 77',
    },
    'Yellow': {
      light: '234 179 8',
      dark: '161 98 7',
    },
    'Indigo': {
      light: '79 70 229',
      dark: '67 56 202',
    },
    'Teal': {
      light: '13 148 136',
      dark: '19 78 74',
    },
    'Orange': {
      light: '249 115 22',
      dark: '154 52 18',
    },
    'Emerald': {
      light: '16 185 129',
      dark: '6 95 70',
    },
};

export const getColorStyle = (
  color: ColorType | string,
  theme: 'light' | 'dark' = 'light'
): string => {
  if(typeof color === 'string' && !Object.keys(ColorPresets).includes(color)){ //if the color is a string and not a ColorType
    return color; // Return the string directly
  }

  const preset = ColorPresets[color as ColorType];

  return preset ? preset[theme] : ColorPresets.Default[theme] // if the color is not found in ColorPresets, return Default color with the specified theme
}

export type CustomColor = {
  light: string;
  dark: string;
}

export type ColorOption = ColorType | CustomColor | string;