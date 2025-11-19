import { useTheme } from '@/contexts/ThemeContext';

interface BrikkLogoProps {
  className?: string;
  alt?: string;
}

export default function BrikkLogo({ className = "h-8", alt = "Brikk" }: BrikkLogoProps) {
  const { theme } = useTheme();
  
  // Use dark logo (white text) on dark theme, light logo (black text) on light theme
  const logoSrc = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';
  
  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={className}
    />
  );
}
