import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(autoStart);

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

  // Update particle
  const updateParticle = (particle: Particle, deltaTime: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return particle;

    const newParticle = { ...particle };
    
    // Update position
    newParticle.x += newParticle.vx * deltaTime * 0.016;
    newParticle.y += newParticle.vy * deltaTime * 0.016;

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

    // Interactive mode - attract to mouse
    if (interactive) {
      const dx = mouseRef.current.x - newParticle.x;
      const dy = mouseRef.current.y - newParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100 && distance > 0) {
        const force = (100 - distance) / 100 * 0.5;
        newParticle.vx += (dx / distance) * force * deltaTime * 0.016;
        newParticle.vy += (dy / distance) * force * deltaTime * 0.016;
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

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => createParticle());

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActive) {
        // Update and render particles
        particlesRef.current = particlesRef.current
          .map(particle => updateParticle(particle, deltaTime))
          .filter(particle => particle.life > 0);

        // Add new particles if needed
        while (particlesRef.current.length < count) {
          particlesRef.current.push(createParticle());
        }

        // Render particles
        particlesRef.current.forEach(particle => {
          renderParticle(ctx, particle);
        });

        // Draw connections between nearby particles
        drawConnections(ctx, particlesRef.current);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [count, colors, isActive, interactive, speed, size, life]);

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

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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