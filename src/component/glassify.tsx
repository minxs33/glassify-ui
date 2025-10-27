import { useState, useEffect, CSSProperties } from 'react'
import { 
  parseZIndex,
  rgbComma,
  resolveThemedValue
} from '../util';
import {
  ColorType,
  ColorOption,
  getColorStyle,
  ColorPresets,
  TintOption,
  TintPresets,
  BorderRadiusType,
  BorderRadiusOption,
  getBorderRadiusStyle,
  BorderRadiusPresets,
  BlurOption,
  ShineOption,
  getShineStyle,
  ShinePresets,
  EffectPresetOption,
  TurbulenceOption,
  TurbulencePresets,
  DisplacementOption,
  getEffectPresetStyle,
  GlowOption,
  EffectStyles,
} from '../effects';

interface GlassifyProps {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  zIndex?: string
  color?: ColorOption
  borderRadius?: BorderRadiusOption
  tint?: TintOption
  blur?: BlurOption
  shine?: ShineOption;
  turbulence?: TurbulenceOption
  displacement?: DisplacementOption
  effectPreset?: EffectPresetOption
  glow?: GlowOption;
  theme?: 'light' | 'dark'
}

export const Glassify: React.FC<GlassifyProps> = ({ 
  children, 
  className, 
  contentClassName,
  zIndex,
  color:colorProps,
  tint:tintProps, 
  borderRadius,
  blur,
  shine,
  turbulence,
  displacement,
  effectPreset,
  glow,
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

  // Defining functions to get all the values of the props
  const getColorValue = (
    colorOption: ColorOption,
    theme: 'light' | 'dark',
  ):string => {
    const resolved = resolveThemedValue(colorOption, theme); // Resolve the themed value (e.g., "red dark:blue" -> "red" or "blue")

    if (!resolved) return getColorStyle('Default', theme); // Fallback to 'Default' if no color is provided
    // if (typeof resolved === 'string' && !Object.keys(ColorPresets).includes(resolved)) {
    //   return rgbComma(resolved);
    // }
    // Future proofing for custom colors
    return getColorStyle(resolved as ColorType, theme);
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

  const getShineValue = (shine: ShineOption, currentTheme: 'light' | 'dark'): string => {
    // console.log(shine);
    // Im making some changes here, instead of having to type assert the value, im making getShineStyle to accept plain strings because
    // it already handles parsing and sanitize invalid input logic internally where Color, Tint, and Turbulence get methods do not.
    const resolvedShine = resolveThemedValue(shine, currentTheme) ?? '';
    return getShineStyle(resolvedShine, currentTheme);
  };

  // Function that returns the value of types inside the EffectPresets
  const getEffectPresetValue = (
    // Same logic as getColorValue but needs to return an undefined if no value is provided so the getEffectPresetStyle can handle overrides
    blur : BlurOption | undefined,
    tintProps: TintOption | undefined,
    turbulence: TurbulenceOption | undefined,
    displacement: DisplacementOption | undefined,
  ): EffectStyles =>{

      const resolvedTint = tintProps ? resolveThemedValue(tintProps, currentTheme) : undefined;
      const resolvedTurbulence = turbulence ? resolveThemedValue(turbulence, currentTheme) : undefined;
      
      return getEffectPresetStyle(
      effectPreset ?? 'none',
      currentTheme,
      {
        ...(blur !== undefined && { blur }),
        ...(tintProps !== undefined && { tint : resolvedTint }),
        ...(turbulence !== undefined && { turbulence: resolvedTurbulence }),
        ...(displacement !== undefined && { displacement })
      }
    );
  }

  const getZIndex = (zIndex: string | undefined, className?: string): number => {
    if (zIndex) {
      const parsedZIndex = parseZIndex(zIndex);
      if (parsedZIndex !== null) return parsedZIndex ?? 0;
    }
    if (className) {
      const match = className.split(/\s+/).find((cls) => cls.startsWith("z-"));
      if (match) {
        const parsedClassZIndex = parseZIndex(match);
        if (parsedClassZIndex !== null) return parsedClassZIndex ?? 0;
      }
    }
    return 0;
  };

  // const getGlowValue = (glow: GlowOption): string => {
  //   if (typeof glow === 'string') {
  //     if (Object.keys(GlowPresets).includes(glow)) {
  //       return GlowPresets[glow as keyof typeof GlowPresets];
  //     }
  //     return glow; // Return the string directly if it's not a preset
  //   }

  //   // If it's an object, we assume it has 'gradient' property
  //   if (typeof glow === 'object' && 'gradient' in glow) {
  //     return glow.gradient;
  //   }

  //   // Default to no glow
  //   return 'none';
  // }

  // value initialization
  const zIndexValue = getZIndex(zIndex, className);
  const colorValue = getColorValue(colorProps ?? "Default", currentTheme);
  const borderRadiusValue = getBorderRadiusValue(borderRadius ?? 'none');
  const shineValue = getShineValue(shine ?? 'bottom-right-sm-neutral', currentTheme);
  
  const effectPresetStyles = getEffectPresetValue(blur, tintProps, turbulence, displacement);

  const tintValue = effectPresetStyles.tint ?? 'rgba(255, 255, 255, 0.1)';
  const blurValue = effectPresetStyles.blur ?? '8px';
  const turbulenceValue = effectPresetStyles.turbulence ?? { numOctaves: 1, baseFreq: 0.1 };
  const displacementValue = effectPresetStyles.displacement ?? '0';

  console.log("Glassify.tsx shineProp: "+shine);
  console.log("Glassify.tsx shine: "+shineValue);
  // const glowValue = getGlowValue(glow ?? 'none');
  
  // Function to get styles with specific values
  const getStyles = (color: string, tint: string, borderRadius: string, blur: string, shine: string, seed: number) => {
    // console.log({color, tint, borderRadius, blur, shine});
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
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)',
        borderRadius: borderRadius,
        boxShadow: shine,
      } as CSSProperties,

      glow: {
        // position: 'absolute',
        // inset: 0,
        // zIndex: zIndexValue+3,
        // borderRadius: typeof borderRadius === 'number' ? borderRadius / 2 : borderRadius,
        // filter: 'blur(10px)',
        // boxShadow: `
        //   inset 0 -20px 20px -20px rgb(${color} / 1),
        //   inset 0px 0px 0px 1px rgb(${color} / 1)
        // `,
        // background: glowValue,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // pointerEvents: 'none'
      } as CSSProperties,
  
      content: {
        zIndex: zIndexValue+3,
      } as CSSProperties,
    };
  };
  
  // Get them styles for the divs
  const styles = getStyles(colorValue, tintValue, borderRadiusValue, blurValue, shineValue, seed)
  
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
              <svg xmlns='http://www.w3.org/2000/svg' width='10%' height='200%'>
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
        <div style={styles.shine} />
        <div style={styles.glow} />
        <div style={styles.content} className={`${contentClassName || ''}`}>{children}</div>
      </div>
    </>
  )
}

export default Glassify;