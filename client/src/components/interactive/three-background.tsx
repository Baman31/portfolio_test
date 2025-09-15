import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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

// Device detection
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

interface ThreeBackgroundProps {
  variant?: 'particles' | 'geometric' | 'waves';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

export default function ThreeBackground({ 
  variant = 'particles', 
  intensity = 'medium',
  color = '#3b82f6',
  className = ''
}: ThreeBackgroundProps) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Disable Three.js background for mobile or reduced motion preference
  if (!isClient || isMobile || prefersReducedMotion) {
    return (
      <div 
        ref={mountRef} 
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{ 
          zIndex: -1,
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`
        }}
        data-testid="three-background-fallback"
      />
    );
  }
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particles?: THREE.Points;
    waveGeometry?: THREE.PlaneGeometry;
    animationId?: number;
    startTime?: number;
  }>({});
  const resizeObserverRef = useRef<ResizeObserver>();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit DPR for performance
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = { scene, camera, renderer, startTime: Date.now() };

    // Create content based on variant
    if (variant === 'particles') {
      const particles = createParticleSystem(scene, intensity, color);
      sceneRef.current.particles = particles;
    } else if (variant === 'geometric') {
      createGeometricShapes(scene, intensity, color);
    } else if (variant === 'waves') {
      const waveGeometry = createWaveEffect(scene, intensity, color);
      sceneRef.current.waveGeometry = waveGeometry;
    }

    camera.position.z = 5;

    // Animation loop with visibility check
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      
      // Skip rendering if not visible
      if (!isVisibleRef.current) {
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = (currentTime - (sceneRef.current.startTime || currentTime)) * 0.001;
      
      if (sceneRef.current.particles) {
        sceneRef.current.particles.rotation.x += 0.001;
        sceneRef.current.particles.rotation.y += 0.002;
      }

      // Animate geometric shapes
      scene.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          child.rotation.x += 0.005 * (index + 1);
          child.rotation.y += 0.003 * (index + 1);
        }
      });

      // Animate wave effect
      if (sceneRef.current.waveGeometry) {
        const positions = sceneRef.current.waveGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = Math.sin(x * 2 + elapsed) * Math.cos(y * 2 + elapsed) * 0.5;
          positions.setZ(i, z);
        }
        positions.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize with ResizeObserver
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height);
    };

    // Set up ResizeObserver
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(mountRef.current);

    // Visibility handling
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      // Dispose of all resources
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: THREE.Material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        } else if (child instanceof THREE.Points) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            child.material.dispose();
          }
        }
      });
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [variant, intensity, color]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      data-testid="three-background"
    />
  );
}

function createParticleSystem(scene: THREE.Scene, intensity: string, color: string): THREE.Points {
  // Reduce particle count for better performance
  const particleCount = intensity === 'low' ? 500 : intensity === 'medium' ? 1000 : 1500;
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorObj = new THREE.Color(color);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Random positions
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;

    // Colors with slight variation
    const variation = Math.random() * 0.3;
    colors[i] = colorObj.r + variation;
    colors[i + 1] = colorObj.g + variation;
    colors[i + 2] = colorObj.b + variation;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  return particles;
}

function createGeometricShapes(scene: THREE.Scene, intensity: string, color: string) {
  // Reduce shape count for better performance
  const shapeCount = intensity === 'low' ? 3 : intensity === 'medium' ? 6 : 9;
  
  const geometries = [
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.SphereGeometry(0.3, 8, 6),
    new THREE.ConeGeometry(0.3, 0.6, 6),
    new THREE.OctahedronGeometry(0.4)
  ];

  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });

  for (let i = 0; i < shapeCount; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );
    
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    scene.add(mesh);
  }
}

function createWaveEffect(scene: THREE.Scene, intensity: string, color: string): THREE.PlaneGeometry {
  // Reduce complexity for better performance
  const size = intensity === 'low' ? 16 : intensity === 'medium' ? 32 : 48;
  
  const geometry = new THREE.PlaneGeometry(8, 8, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.4,
    wireframe: true
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 4;
  
  scene.add(plane);
  
  return geometry;
}