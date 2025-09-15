import { useEffect, useRef, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';

// Client-side guard hook
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

// Reduced motion hook
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// Device detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  interactive?: boolean;
  autoStart?: boolean;
  className?: string;
  speed?: number;
  size?: { min: number; max: number };
  life?: { min: number; max: number };
}

export default function ParticleSystem({
  count = 50,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
  interactive = true,
  autoStart = true,
  className = '',
  speed = 1,
  size = { min: 2, max: 6 },
  life = { min: 1000, max: 3000 }
}: ParticleSystemProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  
  // Adjust settings based on device capabilities
  const effectiveCount = isMobile ? Math.min(count, 25) : count;
  const effectiveSpeed = prefersReducedMotion ? 0 : (isMobile ? speed * 0.5 : speed);
  const shouldDisableEffects = prefersReducedMotion || (!isClient);
  
  if (!isClient || shouldDisableEffects) {
    return (
      <div className={`relative ${className}`} data-testid="particle-system-disabled">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
      </div>
    );
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const resizeObserverRef = useRef<ResizeObserver>();
  const isVisibleRef = useRef(true);
  const [isActive, setIsActive] = useState(autoStart && !shouldDisableEffects);

  const springProps = useSpring({
    opacity: isActive ? 1 : 0.5,
    transform: isActive ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 30 }
  });

  // Initialize particles
  const createParticle = (x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const particleMaxLife = life.min + Math.random() * (life.max - life.min);
    return {
      id: Math.random(),
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      life: particleMaxLife,
      maxLife: particleMaxLife,
      size: size.min + Math.random() * (size.max - size.min),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  };

  // Update particle with throttled speed
  const updateParticle = (particle: Particle, deltaTime: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return particle;

    const newParticle = { ...particle };
    
    // Update position with effective speed
    newParticle.x += newParticle.vx * deltaTime * 0.016 * effectiveSpeed;
    newParticle.y += newParticle.vy * deltaTime * 0.016 * effectiveSpeed;

    // Update life
    newParticle.life -= deltaTime;

    // Bounce off edges
    if (newParticle.x <= 0 || newParticle.x >= canvas.width) {
      newParticle.vx *= -0.8;
      newParticle.x = Math.max(0, Math.min(canvas.width, newParticle.x));
    }
    if (newParticle.y <= 0 || newParticle.y >= canvas.height) {
      newParticle.vy *= -0.8;
      newParticle.y = Math.max(0, Math.min(canvas.height, newParticle.y));
    }

    // Interactive mode - attract to mouse (reduced on mobile)
    if (interactive && (!isMobile || effectiveCount < 20)) {
      const dx = mouseRef.current.x - newParticle.x;
      const dy = mouseRef.current.y - newParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const attractionRadius = isMobile ? 60 : 100;
      if (distance < attractionRadius && distance > 0) {
        const force = (attractionRadius - distance) / attractionRadius * (isMobile ? 0.25 : 0.5);
        newParticle.vx += (dx / distance) * force * deltaTime * 0.016 * effectiveSpeed;
        newParticle.vy += (dy / distance) * force * deltaTime * 0.016 * effectiveSpeed;
      }
    }

    // Apply friction
    newParticle.vx *= 0.99;
    newParticle.vy *= 0.99;

    return newParticle;
  };

  // Render particle
  const renderParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = particle.life / particle.maxLife;
    const currentSize = particle.size * alpha;

    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, currentSize * 2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Animation function
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || animationIdRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;
    let lastRenderTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      // Stop if not visible or not active
      if (!isVisibleRef.current || !isActive) {
        animationIdRef.current = undefined;
        return;
      }
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Throttle rendering for performance
      if (currentTime - lastRenderTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastRenderTime = currentTime;

      // Clear canvas (use CSS pixel dimensions since context is scaled)
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and render particles
      particlesRef.current = particlesRef.current
        .map(particle => updateParticle(particle, deltaTime))
        .filter(particle => particle.life > 0);

      // Add new particles if needed
      while (particlesRef.current.length < effectiveCount) {
        particlesRef.current.push(createParticle());
      }

      // Render particles
      particlesRef.current.forEach(particle => {
        renderParticle(ctx, particle);
      });

      // Draw connections (skip on mobile for performance)
      if (!isMobile || effectiveCount < 20) {
        drawConnections(ctx, particlesRef.current);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);
  }, [effectiveCount, isActive, isMobile, effectiveSpeed]);

  // Animation loop initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: effectiveCount }, () => createParticle());

    // Start animation if visible and active
    if (isVisibleRef.current && isActive) {
      startAnimation();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = undefined;
      }
    };
  }, [effectiveCount, colors, interactive, size, life, startAnimation]);

  // Handle active state changes
  useEffect(() => {
    if (isActive && isVisibleRef.current && !animationIdRef.current) {
      startAnimation();
    } else if (!isActive && animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
    }
  }, [isActive, startAnimation]);

  // Draw connections between particles
  const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.2;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Handle mouse movement
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // Handle click to add particles
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add burst of particles at click location
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push(createParticle(x, y));
    }
  };

  // Store DPR for consistent use
  const dprRef = useRef(1);
  
  // Handle resize with ResizeObserver
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
    dprRef.current = dpr;
    
    // Set canvas size with DPR scaling
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Scale context for DPR
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // Set up ResizeObserver and visibility handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Initial resize
    handleResize();

    // ResizeObserver for efficient resize handling
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === parent) {
          handleResize();
          break;
        }
      }
    });
    resizeObserverRef.current.observe(parent);

    // Intersection Observer for visibility detection
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting && !document.hidden;
        
        // Restart animation if becoming visible
        if (!wasVisible && isVisibleRef.current && isActive && !animationIdRef.current) {
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(canvas);

    // Visibility change handling for performance
    const handleVisibilityChange = () => {
      const wasVisible = isVisibleRef.current;
      isVisibleRef.current = !document.hidden;
      
      // Restart animation if becoming visible
      if (!wasVisible && isVisibleRef.current && isActive && !animationIdRef.current) {
        startAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleResize, isActive]);

  return (
    <animated.div 
      style={springProps}
      className={`relative ${className}`}
      data-testid="particle-system"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto"
        onMouseMove={interactive ? handleMouseMove : undefined}
        onClick={interactive ? handleClick : undefined}
        style={{ cursor: interactive ? 'crosshair' : 'default' }}
        data-testid="particle-canvas"
      />
      
      {interactive && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm transition-colors"
            data-testid={`button-${isActive ? 'pause' : 'play'}-particles`}
          >
            {isActive ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </animated.div>
  );
}