export function parseZIndex(value?: string): number | undefined {
    if (!value) return undefined;
  
    // Tailwind pattern: z-10, z-50, z-[999], etc.
    const tailwindMatch = value.match(/^z-(\d+)$|^z-\[(\d+)\]$/);
    
    if (tailwindMatch) {
      return Number(tailwindMatch[1] || tailwindMatch[2]);
    }
  
    // Raw number string: "1000"
    if(!isNaN(Number(value))) {
      return Number(value);
    }
    return undefined;
}