import { useState, useEffect, CSSProperties } from 'react'
import {
  parseZIndex,
  ColorType,
  ColorOption,
  getColorStyle,
  ColorPresets,
  TintOption,
  BorderRadiusType,
  BorderRadiusOption,
  getBorderRadiusStyle,
  BorderRadiusPresets,
  BlurOption,
  EffectPresetOption,
  TurbulenceOption,
  DisplacementOption,
  getEffectPresetStyle,
} from '../util';

interface GlassifyProps {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  zIndex?: string
  color?: ColorOption
  darkColor?: string
  borderRadius?: BorderRadiusOption
  tint?: TintOption
  darkTint?: string
  blur?: BlurOption
  turbulence?: TurbulenceOption
  turbulenceDark?: TurbulenceOption
  displacement?: DisplacementOption
  effectPreset?: EffectPresetOption
  theme?: 'light' | 'dark'
}

export const Glassify: React.FC<GlassifyProps> = ({ 
  children, 
  className, 
  contentClassName,
  zIndex,
  color:colorProps, 
  darkColor, 
  tint:tintProps, 
  darkTint, 
  borderRadius,
  blur,
  turbulence,
  turbulenceDark,
  displacement,
  effectPreset, 
  theme, 
}) => {
  const [seed, setSeed] = useState<number | null>(null)

  // randomize seed on mount
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 10000))
  }, [])
  
  // make sure seed is set before rendering also check if this is client-side
  if (seed === null) return null

  // Determine the current theme
  const currentTheme = theme || 'light';

  // getting them defined object values
  
  const getColorValue = (colorOption: ColorOption, theme: 'light' | 'dark', darkColor?: string):string => {
    if (currentTheme == 'dark' && darkColor) {
      if (Object.keys(ColorPresets).includes(darkColor)) {
        return getColorStyle(darkColor as ColorType, 'dark');
      }
      return darkColor;
    }
    
    if(typeof colorOption === 'string'){
      if(Object.keys(ColorPresets).includes(colorOption)) {
        return getColorStyle(colorOption as ColorType, theme);
      }

      return colorOption;
    }

    if (typeof colorOption === 'object' && 'light' in colorOption && 'dark' in colorOption) {
      return colorOption[currentTheme];
    }

    return getColorStyle('Default', currentTheme);
  }

  const getBorderRadiusValue = (borderRadius: BorderRadiusOption): string => {
    if (typeof borderRadius === 'string'){
      if(Object.keys(BorderRadiusPresets).includes(borderRadius)) {
        return getBorderRadiusStyle(borderRadius as BorderRadiusType);
      }

      return borderRadius; // Return the string directly if it's not a preset
    }

    return getBorderRadiusStyle('none'); // Default to 'none' if no valid border radius is provided
  }

  // Function that returns the value of types inside the EffectPresets
  const effectPresetStyles = getEffectPresetStyle(
    effectPreset ?? 'none',
    currentTheme,
    {
      ...(blur !== undefined && { blur }),
      ...((currentTheme === 'dark' ? darkTint ?? tintProps : tintProps) !== undefined && { 
        tint: currentTheme === 'dark' ? darkTint ?? tintProps : tintProps 
      }),
      ...((currentTheme === 'dark' ? turbulenceDark ?? turbulence : turbulence) !== undefined && { 
        turbulence: currentTheme === 'dark' ? turbulenceDark ?? turbulence : turbulence 
      }),
      ...(displacement !== undefined && { displacement })
    }
  );
  
  const zIndexValue = parseZIndex(zIndex) ??
  (() => {
    const match = className?.split(/\s+/).find((cls) => cls.startsWith("z-"));
    return parseZIndex(match);
  })() ?? 0;
  const colorValue = getColorValue(colorProps ?? "Default", currentTheme, darkColor);
  const borderRadiusValue = getBorderRadiusValue(borderRadius ?? 'none');
  const tintValue = effectPresetStyles.tint ?? 'rgba(255, 255, 255, 0.1)';
  const blurValue = effectPresetStyles.blur ?? '8px';
  const turbulenceValue = effectPresetStyles.turbulence ?? { numOctaves: 1, baseFreq: 0.1 };
  const displacementValue = effectPresetStyles.displacement ?? '0';
  
  // Function to get styles with specific values
  const getStyles = (color: string, tint: string, borderRadius: string, blur: string, seed: number) => {
    return {
      wrapper: {
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        // boxShadow: '0 0 5px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.05)',
        borderRadius: borderRadius,
        zIndex: zIndexValue,
      } as CSSProperties,
  
      effect: {
        position: 'absolute',
        zIndex: zIndexValue,
        inset: 0,
        backdropFilter: `blur(${blur})`,
        filter: `url(#vibrancyFilter-${seed})`,
        borderRadius: borderRadius,
        overflow: 'hidden',
        isolation: 'isolate',
        pointerEvents: 'none',
      } as CSSProperties,
  
      tint: {
        zIndex: zIndexValue+3,
        position: 'absolute',
        inset: 0,
        background: `rgba(${tint})`,
      } as CSSProperties,
  
      shine: {
        position: 'absolute',
        inset: 0,
        zIndex: zIndexValue + 2,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)',
        borderRadius: borderRadius,
        boxShadow: `
          inset 0 0 0 2px rgba(${(() => {
            const [r, g, b] = colorValue.split(",").map(v => parseInt(v.trim(), 10));
            return `${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 1`;
          })()}), /* dark border */
          inset 0px 2px 1px 2px rgba(${colorValue}, 0.5), /* light source */
          inset 0px -2px 1px 1px rgba(${colorValue}, 0.5) /* light source */
        `,
      } as CSSProperties,
      bottomGlow: {
        position: 'absolute',
        inset: 0,
        zIndex: zIndexValue+3,
        borderRadius: typeof borderRadius === 'number' ? borderRadius / 2 : borderRadius,
        filter: 'blur(10px)',
        boxShadow: `
          inset 0 -20px 20px -20px rgb(${color} / 0.5),
          inset 0px 0px 0px 1px rgb(${color} / 0.2)
        `,
      } as CSSProperties,
  
      content: {
        zIndex: zIndexValue+3,
      } as CSSProperties,
    };
  };
  
  // Get them styles for the divs
  const styles = getStyles(colorValue, tintValue, borderRadiusValue, blurValue, seed)

  return (
    <>
      <svg style={{ display: 'none' }}>
        <defs>
          <radialGradient id={`grad-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
        </defs>
        <filter
          id={`vibrancyFilter-${seed}`}
          x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox"
        >
          {/* Turbulence pattern for displacement */}
          <feTurbulence
            type="turbulence"
            baseFrequency={`${turbulenceValue.baseFreq} ${turbulenceValue.baseFreq + 0.01}`}
            numOctaves={turbulenceValue.numOctaves}
            seed={seed}
            result="turbulence"
          />

          {/* Radial highlight on edges */}
          <feImage
            xlinkHref={`data:image/svg+xml;utf8,${encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='200%' height='200%'>
                <rect width='100%' height='100%' fill='url(%23grad-${seed})' />
              </svg>
            `)}`}
            result="edgeHighlight"
            x="0" y="0"
            width="100%" height="100%"
          />

          {/* Blend turbulence with edge gradient */}
          <feBlend in="turbulence" in2="edgeHighlight" mode="lighten" result="highlightedEdges" />

          {/* Blur turbulence for lighting */}
          <feGaussianBlur in="turbulence" stdDeviation="4" result="softMap" />

          {/* Add specular lighting */}
          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="40"
            lightingColor="#ffffff"
            result="specLight"
          >
            <fePointLight x="100" y="100" z="200" />
          </feSpecularLighting>

          {/* Combine highlights and lighting */}
          <feBlend in="highlightedEdges" in2="specLight" mode="screen" result="litImage" />

          {/* Offset + combine to create bent map */}
          <feOffset in="softMap" dx="5" dy="5" result="offsetMap" />
          <feComposite
            in="softMap"
            in2="offsetMap"
            operator="arithmetic"
            k2="0.7"
            k3="0.3"
            result="bentMap"
          />

          {/* Final displacement */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="bentMap"
            scale={displacementValue}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div style={styles.wrapper} className={`${className || ''}`}>
        <div style={styles.effect} />
        <div style={styles.tint} />
        <div  style={styles.shine} />
        {/* <div style={styles.bottomGlow} /> */}
        <div style={styles.content} className={`${contentClassName || ''}`}>{children}</div>
      </div>
    </>
  )
}

export default Glassify;