import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Add heavy fog for depth and fading into darkness
    scene.fog = new THREE.FogExp2(0x050505, 0.0025);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;
    camera.position.y = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- Grid Floor ---
    const gridHelper = new THREE.GridHelper(2000, 50, 0x00f3ff, 0x222222);
    scene.add(gridHelper);

    // --- Second Grid (Ceiling) ---
    const gridHelperTop = new THREE.GridHelper(2000, 50, 0xff00ff, 0x222222);
    gridHelperTop.position.y = 200;
    scene.add(gridHelperTop);

    // --- Floating Particles (Data Bits) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        // Random positions around the camera path
        posArray[i] = (Math.random() - 0.5) * 1000;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Animation Loop ---
    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.005;

      // Move Grids to simulate forward movement
      // We reset position to create infinite loop illusion
      const speed = 1.5;
      gridHelper.position.z += speed;
      if (gridHelper.position.z > 50) {
        gridHelper.position.z = 0;
      }
      
      gridHelperTop.position.z += speed;
      if (gridHelperTop.position.z > 50) {
        gridHelperTop.position.z = 0;
      }

      // Animate Particles
      particlesMesh.rotation.y = time * 0.05;
      particlesMesh.position.z += speed * 1.5;
      if (particlesMesh.position.z > 200) {
          particlesMesh.position.z = -500;
      }

      // Gentle Camera sway
      camera.position.x = Math.sin(time) * 10;
      camera.lookAt(0, 50, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      
      // Robust cleanup
      if (mountRef.current && renderer.domElement) {
        if (mountRef.current.contains(renderer.domElement)) {
           mountRef.current.removeChild(renderer.domElement);
        }
      }
      
      // Cleanup Three.js resources
      gridHelper.dispose();
      gridHelperTop.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full -z-20 opacity-60 pointer-events-none mix-blend-screen"
    />
  );
};

export default ThreeBackground;