import { motion, useScroll, useTransform, useInView as useFramerInView, useMotionValue, animate, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

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

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.8,
  className = ''
}: ScrollRevealProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  
  const { ref, inView } = useInView({
    threshold: isMobile ? 0.05 : 0.1, // Reduce threshold on mobile
    triggerOnce: true,
    rootMargin: isMobile ? '50px' : '100px', // Trigger earlier on mobile
  });
  
  // Return simple fade if motion should be reduced or not on client
  if (!isClient || shouldReduceMotion) {
    return (
      <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    );
  }

  // Reduce animation distance on mobile
  const animationDistance = isMobile ? 20 : 50;
  const effectiveDuration = isMobile ? duration * 0.7 : duration; // Faster on mobile
  
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -animationDistance : direction === 'right' ? animationDistance : 0,
      y: direction === 'up' ? animationDistance : direction === 'down' ? -animationDistance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: effectiveDuration,
        delay: isMobile ? delay * 0.5 : delay, // Reduce delay on mobile
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      data-testid="scroll-reveal"
    >
      {children}
    </motion.div>
  );
}

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxContainer({ 
  children, 
  speed = 0.5,
  className = ''
}: ParallaxContainerProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  
  // Disable parallax on mobile or if reduced motion is preferred
  if (!isClient || shouldReduceMotion || isMobile) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    );
  }
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Reduce parallax effect
  const effectiveSpeed = Math.min(speed, 0.3); // Limit parallax speed
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${effectiveSpeed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} data-testid="parallax-container">
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface StaggeredChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredChildren({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}: StaggeredChildrenProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  
  const { ref, inView } = useInView({
    threshold: isMobile ? 0.05 : 0.1,
    triggerOnce: true,
    rootMargin: isMobile ? '50px' : '100px',
  });
  
  // Simplified animation for reduced motion
  if (!isClient || shouldReduceMotion) {
    return (
      <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {children}
      </div>
    );
  }

  // Faster stagger on mobile
  const effectiveStaggerDelay = isMobile ? staggerDelay * 0.6 : staggerDelay;
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: effectiveStaggerDelay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 10 : 20, // Reduce movement on mobile
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6, // Faster on mobile
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      data-testid="staggered-children"
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={childVariants} data-testid={`staggered-child-${index}`}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={childVariants} data-testid="staggered-child-single">{children}</motion.div>
      }
    </motion.div>
  );
}

interface CounterAnimationProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CounterAnimation({ 
  end, 
  start = 0, 
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}: CounterAnimationProps) {
  const ref = useRef(null);
  const isInView = useFramerInView(ref, { once: true });
  const count = useMotionValue(start);
  const [displayValue, setDisplayValue] = useState(start);

  // Subscribe to motion value changes and update display state
  useMotionValueEvent(count, 'change', (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, end, {
        duration,
        ease: 'easeOut',
      });
      return animation.stop;
    }
  }, [isInView, end, duration, count]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      data-testid="counter-animation"
    >
      <motion.span>
        {prefix}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          data-testid="counter-value"
        >
          {displayValue}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.div>
  );
}

interface HoverLiftProps {
  children: React.ReactNode;
  lift?: number;
  scale?: number;
  className?: string;
}

export function HoverLift({ 
  children, 
  lift = -10,
  scale = 1.02,
  className = ''
}: HoverLiftProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: lift,
        scale: scale,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }}
      whileTap={{ scale: 0.98 }}
      data-testid="hover-lift"
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({ 
  children, 
  amplitude = 10,
  duration = 3,
  delay = 0,
  className = ''
}: FloatingElementProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  
  // Disable floating animation if reduced motion or mobile
  if (!isClient || shouldReduceMotion || isMobile) {
    return (
      <div className={className} data-testid="floating-element-static">
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      data-testid="floating-element"
    >
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ 
  text, 
  className = '',
  delay = 0
}: TextRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      data-testid="text-reveal"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-2"
          data-testid={`text-word-${index}`}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}