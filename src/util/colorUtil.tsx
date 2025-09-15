// util/colorUtils.ts

export const clamp = (v: number, min = 0, max = 255) =>
    Math.max(min, Math.min(max, Math.round(v)));
  
export const extractRGBNumbers = (input?: string): [number, number, number] => {
  if (!input) return [255, 255, 255];

  // Match numeric values (handles rgb(), rgba(), and "255, 255, 255")
  const nums = input.match(/-?\d+(\.\d+)?/g) || [];
  if (nums.length >= 3) {
    return [
      clamp(parseFloat(nums[0] || '0')),
      clamp(parseFloat(nums[1] || '0')),
      clamp(parseFloat(nums[2] || '0'))
    ];
  }

  // Match hex (#fff or #ffffff)
  const hexMatch = input.trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    console.log(
      `Extracted hex: ${hex}, converted to RGB: [${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}]`
    )
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  
  // Fallback to white
  return [255, 255, 255];
};

export const rgbComma = (input?: string) =>
  extractRGBNumbers(input).join(', ');
  