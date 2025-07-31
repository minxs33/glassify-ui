import { useState, useEffect, CSSProperties } from 'react'
import { ColorType, ColorOption, getColorStyle, ColorPresets, CustomColor} from '../util/colorType'

interface GlassifyProps {
  children?: React.ReactNode
  className?: string
  color?: ColorOption
  darkColor?: string
  theme?: 'light' | 'dark'
}

export const Glassify: React.FC<GlassifyProps> = ({ children, className, color:colorProps, darkColor, theme }) => {
  const [seed, setSeed] = useState<number | null>(null)
  const [freq, setFreq] = useState<number | null>(null)

  // randomize seed and frequency on mount
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 10000))
    setFreq(0.01 + Math.random() * (0.02 - 0.01))
  }, [])
  
  // make sure seed and freq are set before rendering also check if this is client-side
  if (seed === null || freq === null) return null

  // Determine the current theme
  const currentTheme = theme || 'light';

  // Function to get styles based on color and seed
  const getStyles = (color: string, seed: number) => {
    return {
      wrapper: {
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.05)',
        borderRadius: '0.75rem',
        padding: '2rem',
      } as CSSProperties,
  
      effect: {
        position: 'absolute',
        zIndex: 0,
        inset: 0,
        backdropFilter: 'blur(2px)',
        filter: `url(#vibrancyFilter-${seed})`,
        overflow: 'hidden',
        isolation: 'isolate',
        pointerEvents: 'none',
      } as CSSProperties,
  
      tint: {
        zIndex: 3,
        position: 'absolute',
        inset: 0,
        background: 'rgb(255, 255, 255, 0.05)',
      } as CSSProperties,
  
      shine: {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)',
        borderRadius: '0.75rem',
        backdropFilter: 'blur(10px)', //ngefek ke visibility
        boxShadow: `
          inset 4px 2px 3px 0 rgb(${color} / 0.1),
          inset 1px -2px 5px 1px rgb(${color} / 0.1)
        `,
      } as CSSProperties,
  
      bottomGlow: {
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        borderRadius: '16px',
        filter: 'blur(10px)',
        // boxShadow: `
        //   inset 0 -20px 20px -20px rgb(${color} / 0.5),
        //   inset 0px 0px 0px 1px rgb(${color} / 0.2)
        // `,
      } as CSSProperties,
  
      content: {
        zIndex: 3,
      } as CSSProperties,
    };
  };

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

  // Initialize styles for the divs

  const colorValue = getColorValue(colorProps ?? "Default", currentTheme, darkColor);
  
  const styles = getStyles(colorValue, seed)

  return (
    <>
      <svg style={{ display: 'none' }}>
        <filter
          id={`vibrancyFilter-${seed}`}
          x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${freq} ${freq}`}
            numOctaves="1"
            seed={seed}
            result="turbulence"
          />
          <feFlood floodColor="white" result="whiteFlood" />
          <feImage
            xlinkHref={`data:image/svg+xml;utf8,${encodeURIComponent(`
              <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <radialGradient id='grad' cx='50%' cy='50%' r='75%'>
                  <stop offset='85%' stop-color='white' stop-opacity='0' />
                  <stop offset='100%' stop-color='white' stop-opacity='1' />
                </radialGradient>
                <rect width='100%' height='100%' fill='url(%23grad)' />
              </svg>
            `)}`}
            result="edgeHighlight"
          />
          <feBlend in="turbulence" in2="edgeHighlight" mode="lighten" result="highlightedEdges" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="#aabbff"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feBlend 
            in="highlightedEdges" 
            in2="specLight" 
            mode="overlay" 
            result="litImage" 
          />
          <feFlood floodColor="#00aaff" floodOpacity="0.4" result="glowColor" />
          <feOffset in="softMap" dx="5" dy="5" result="offsetMap" />
          <feComposite
            in="softMap"
            in2="offsetMap"
            operator="arithmetic"
            k2="0.7"
            k3="0.3"
            result="bentMap"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="bentMap"
            scale="90"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div style={styles.wrapper} className={`${className || ''} rounded-xl p-8`}>
        <div style={styles.effect} />
        <div style={styles.tint} />
        <div  style={styles.shine} />
        <div style={styles.bottomGlow} />
        <div style={styles.content}>{children}</div>
      </div>
    </>
  )
}

export default Glassify;