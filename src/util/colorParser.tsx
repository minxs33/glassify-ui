// Value Parser
type ParsedValue = {
    dark?: string;
    light?: string;
    raw?: string;
};
  
function parseThemeProp(input?: string): ParsedValue {
    if (!input) return {};
  
    const parts = input.split(/dark:/i).map(p => p.trim());

    if (parts.length === 1) {
      // only light/raw provided
      return { raw: parts[0] };
    }
  
    // No prefix, treat as default/light
    return {
      raw: parts[0] || undefined,
      dark: parts[1] || undefined,
      light: parts[0] || undefined,
    };
}

// Resolver
export const resolveThemedValue = (
  input?: string, 
  theme: "dark" | "light" = "light"
): string | undefined => {
    const parsed = parseThemeProp(input);
  
    return theme === 'dark'
    ? parsed.dark ?? parsed.raw ?? parsed.light
    : parsed.light ?? parsed.raw ?? parsed.dark;
}