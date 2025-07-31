export enum Color {
    Blue,
    Red,
    Green,
    Purple,
    Pink,
    Yellow,
    Indigo,
    Teal,
    Orange,
    Emerald,
}

export const RGBColors: Record<Color, { light: string; dark: string }> = {
    [Color.Blue]: {
      light: '59 130 246',   // Tailwind blue-500
      dark: '37 99 235',     // Tailwind blue-700
    },
    [Color.Red]: {
      light: '239 68 68',    // red-500
      dark: '153 27 27',     // red-800
    },
    [Color.Green]: {
      light: '34 197 94',    // green-500
      dark: '21 128 61',     // green-700
    },
    [Color.Purple]: {
      light: '168 85 247',   // purple-500
      dark: '126 34 206',    // purple-700
    },
    [Color.Pink]: {
      light: '236 72 153',   // pink-500
      dark: '157 23 77',     // pink-800
    },
    [Color.Yellow]: {
      light: '234 179 8',    // yellow-500
      dark: '161 98 7',      // yellow-700
    },
    [Color.Indigo]: {
      light: '79 70 229',    // indigo-500
      dark: '67 56 202',     // indigo-700
    },
    [Color.Teal]: {
      light: '13 148 136',   // teal-500
      dark: '19 78 74',      // teal-900
    },
    [Color.Orange]: {
      light: '249 115 22',   // orange-500
      dark: '154 52 18',     // orange-800
    },
    [Color.Emerald]: {
      light: '16 185 129',   // emerald-500
      dark: '6 95 70',       // emerald-900
    },
};