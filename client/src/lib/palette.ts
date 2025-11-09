/**
 * Brikk Brand Color Palette
 * 
 * Centralized color definitions for charts, visualizations, and JS utilities.
 * These colors match the CSS variables defined in index.css.
 */

export const brikkColors = {
  // Primary Palette
  blue: '#0057FF',
  blueDark: '#003FCC',
  blueLight: '#E5EEFF',
  
  // Accent Colors
  cyan: '#00C2FF',
  violet: '#7A5FFF',
  lime: '#A3FF12',
  coral: '#FF6B6B',
  
  // Neutrals
  dark: '#0A0B0F',
  light: '#F9FAFB',
  surfaceDark: '#16181E',
  surfaceLight: '#FFFFFF',
  borderDark: '#1F2229',
  borderLight: '#E5E7EB',
  textDark: '#F3F4F6',
  textLight: '#111827',
  textMuted: '#9CA3AF',
} as const;

/**
 * Chart color series for data visualizations
 * Use these for consistent chart styling across the dashboard
 */
export const chartColors = [
  brikkColors.blue,    // Primary
  brikkColors.cyan,    // Secondary
  brikkColors.violet,  // Tertiary
  brikkColors.lime,    // Success/Growth
  brikkColors.coral,   // Warning/Error
] as const;

/**
 * Status colors for indicators, badges, and alerts
 */
export const statusColors = {
  success: brikkColors.lime,
  warning: brikkColors.coral,
  error: brikkColors.coral,
  info: brikkColors.cyan,
  active: brikkColors.blue,
} as const;

/**
 * Gradient definitions matching CSS variables
 */
export const gradients = {
  core: 'linear-gradient(90deg, #0057FF 0%, #00C2FF 100%)',
  aiSpectrum: 'linear-gradient(90deg, #7A5FFF 0%, #00C2FF 50%, #A3FF12 100%)',
  error: 'linear-gradient(90deg, #FF6B6B 0%, #FF4D4D 100%)',
} as const;

/**
 * Get color by index for chart series
 * Cycles through chartColors array
 */
export function getChartColor(index: number): string {
  return chartColors[index % chartColors.length];
}

/**
 * Get status color by status type
 */
export function getStatusColor(status: keyof typeof statusColors): string {
  return statusColors[status];
}

/**
 * Convert hex color to RGB values
 * Useful for creating rgba() colors with opacity
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Create rgba color string from hex and opacity
 */
export function hexToRgba(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex;
}

