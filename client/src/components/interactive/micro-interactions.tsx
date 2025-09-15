import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

// Client-side guard hook
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
}

interface ButtonRippleProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function ButtonRipple({ 
  children, 
  className = '', 
  onClick,
  variant = 'primary'
}: ButtonRippleProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  // Simplified version for reduced motion or mobile
  if (!isClient || shouldReduceMotion || isMobile) {
    const baseClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    
    return (
      <button
        className={`px-4 py-2 rounded-md transition-colors ${baseClasses[variant]} ${className}`}
        onClick={onClick}
        data-testid={`button-simple-${variant}`}
      >
        {children}
      </button>
    );
  }

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  const baseClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  return (
    <motion.button
      className={`relative overflow-hidden px-4 py-2 rounded-md transition-colors ${baseClasses[variant]} ${className}`}
      onClick={createRipple}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      data-testid={`button-ripple-${variant}`}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          data-testid={`ripple-${ripple.id}`}
        />
      ))}
    </motion.button>
  );
}

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticElement({ 
  children, 
  strength = 0.3,
  className = ''
}: MagneticElementProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Disable magnetic effect on mobile or reduced motion
  if (!isClient || shouldReduceMotion || isMobile) {
    return (
      <div className={className} data-testid="magnetic-element-disabled">
        {children}
      </div>
    );
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      animate={position}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      data-testid="magnetic-element"
    >
      {children}
    </motion.div>
  );
}

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ 
  children, 
  className = '',
  maxTilt = 15
}: TiltCardProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  // Disable tilt effect on mobile or reduced motion
  if (!isClient || shouldReduceMotion || isMobile) {
    return (
      <div className={className} data-testid="tilt-card-disabled">
        {children}
      </div>
    );
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const tiltX = ((event.clientY - centerY) / (rect.height / 2)) * maxTilt;
    const tiltY = ((event.clientX - centerX) / (rect.width / 2)) * -maxTilt;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid="tilt-card"
    >
      {children}
    </motion.div>
  );
}

interface PulsingDotProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PulsingDot({ 
  size = 12,
  color = 'bg-primary',
  className = ''
}: PulsingDotProps) {
  return (
    <div className={`relative ${className}`} data-testid="pulsing-dot">
      <motion.div
        className={`rounded-full ${color}`}
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        data-testid="pulsing-dot-inner"
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${color} opacity-30`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        data-testid="pulsing-dot-outer"
      />
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 24,
  color = 'border-primary',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <motion.div
      className={`rounded-full border-2 border-transparent ${color} ${className}`}
      style={{
        width: size,
        height: size,
        borderTopColor: 'transparent',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      data-testid="loading-spinner"
    />
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export function GlowEffect({ 
  children, 
  color = '#3b82f6',
  intensity = 0.5,
  className = ''
}: GlowEffectProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  // Disable glow effect on mobile or reduced motion
  if (!isClient || shouldReduceMotion || isMobile) {
    return (
      <div className={className} data-testid="glow-effect-disabled">
        {children}
      </div>
    );
  }

  // Convert hex to rgba for glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(59, 130, 246, ${alpha})`; // Default blue fallback
  };

  const glowStyle = {
    boxShadow: isHovered 
      ? `0 0 ${20 * intensity}px ${hexToRgba(color, 0.4)}, 0 0 ${40 * intensity}px ${hexToRgba(color, 0.3)}, 0 0 ${60 * intensity}px ${hexToRgba(color, 0.2)}`
      : 'none',
  };

  return (
    <motion.div
      className={className}
      style={glowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
      data-testid="glow-effect"
    >
      {children}
    </motion.div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export function AnimatedProgressBar({ 
  progress, 
  className = '',
  color = 'bg-primary',
  showLabel = true
}: ProgressBarProps) {
  const springProps = useSpring({
    width: `${Math.min(100, Math.max(0, progress))}%`,
    config: config.gentle,
  });

  return (
    <div className={`relative ${className}`} data-testid="animated-progress-bar">
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <animated.div
          className={`h-2 rounded-full ${color} transition-all duration-300`}
          style={springProps}
          data-testid="progress-bar-fill"
        />
      </div>
      {showLabel && (
        <motion.span
          className="absolute -top-6 right-0 text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-testid="progress-bar-label"
        >
          {Math.round(progress)}%
        </motion.span>
      )}
    </div>
  );
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function AnimatedTooltip({ 
  children, 
  content, 
  position = 'top',
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      data-testid="animated-tooltip"
    >
      {children}
      
      <motion.div
        className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: 'none' }}
        data-testid="tooltip-content"
      >
        {content}
      </motion.div>
    </div>
  );
}