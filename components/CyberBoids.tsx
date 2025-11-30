import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- CONFIGURATION ---
const BOID_COUNT = 40; // 少し増やす
const NEIGHBOR_DIST = 10;
const SPEED_LIMIT = 0.45;
const TURN_SPEED = 0.04;

type InteractionMode = 'NORMAL' | 'GATHER' | 'SCATTER';

// --- BOID CLASS (Small Fish) ---
class Boid {
  mesh: THREE.Group;
  body: THREE.Mesh;
  tail: THREE.Mesh;
  finL: THREE.Mesh;
  finR: THREE.Mesh;
  finDorsal: THREE.Mesh;

  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  color: number;
  offset: number; // For animation timing variance

  constructor(scene: THREE.Scene, color: number) {
    this.color = color;
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * SPEED_LIMIT,
      (Math.random() - 0.5) * SPEED_LIMIT,
      (Math.random() - 0.5) * SPEED_LIMIT * 0.5
    );
    this.acceleration = new THREE.Vector3();
    this.offset = Math.random() * 100;

    // --- CREATE GEOMETRY ---
    this.mesh = new THREE.Group();

    const wireframeMat = new THREE.MeshBasicMaterial({ 
      color: this.color, 
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const solidMat = new THREE.MeshBasicMaterial({ 
      color: this.color, 
      transparent: true, 
      opacity: 0.15,
      side: THREE.DoubleSide
    });

    // 1. Body: Pentagonal Cone (More organic than 4-sided)
    // Radius, Height, Segments
    const bodyGeom = new THREE.ConeGeometry(0.35, 1.4, 5);
    bodyGeom.rotateX(Math.PI / 2); // Point forward
    bodyGeom.scale(0.7, 1, 1); // Flatten slightly vertically
    this.body = new THREE.Mesh(bodyGeom, wireframeMat);
    // Add inner solid core for better visibility
    this.body.add(new THREE.Mesh(bodyGeom, solidMat));
    this.mesh.add(this.body);

    // 2. Tail: Triangular
    const tailGeom = new THREE.ConeGeometry(0.25, 0.6, 3);
    tailGeom.rotateX(Math.PI / 2); 
    tailGeom.scale(0.5, 1, 1); // Flatten
    tailGeom.translate(0, -0.3, 0); // Pivot offset
    
    this.tail = new THREE.Mesh(tailGeom, wireframeMat);
    this.tail.position.z = 0.6; // Behind body
    this.tail.rotation.x = Math.PI; // Point back
    this.mesh.add(this.tail);

    // 3. Pectoral Fins (Left & Right)
    const finGeom = new THREE.BufferGeometry();
    // Simple triangle shape for fins
    const finVertices = new Float32Array([
      0, 0, 0,   // pivot
      0.5, 0, 0.3, // tip back
      0.5, 0, -0.3 // tip front
    ]);
    finGeom.setAttribute('position', new THREE.BufferAttribute(finVertices, 3));

    this.finL = new THREE.Mesh(finGeom, wireframeMat);
    this.finL.position.set(0.15, -0.1, 0.2); // Side of body
    this.mesh.add(this.finL);

    this.finR = new THREE.Mesh(finGeom, wireframeMat);
    this.finR.position.set(-0.15, -0.1, 0.2);
    this.finR.rotation.z = Math.PI; // Flip
    this.mesh.add(this.finR);

    // 4. Dorsal Fin (Top)
    const dorsalGeom = new THREE.ConeGeometry(0.2, 0.5, 3);
    dorsalGeom.scale(0.1, 1, 0.5);
    dorsalGeom.rotateX(-Math.PI / 4); // Slant back
    this.finDorsal = new THREE.Mesh(dorsalGeom, wireframeMat);
    this.finDorsal.position.set(0, 0.25, 0);
    this.mesh.add(this.finDorsal);

    // Random Start Position
    this.mesh.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20 - 5 
    );

    scene.add(this.mesh);
  }

  update(boids: Boid[], mousePos: THREE.Vector3, time: number, mode: InteractionMode) {
    // --- FLOCKING RULES ---
    const alignment = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    const separation = new THREE.Vector3();
    let count = 0;

    for (const other of boids) {
      if (other === this) continue;

      const dist = this.mesh.position.distanceTo(other.mesh.position);

      if (dist < NEIGHBOR_DIST) {
        alignment.add(other.velocity);
        cohesion.add(other.mesh.position);
        
        const diff = new THREE.Vector3().subVectors(this.mesh.position, other.mesh.position);
        diff.divideScalar(dist); 
        separation.add(diff);
        
        count++;
      }
    }

    if (count > 0) {
      alignment.divideScalar(count).normalize().multiplyScalar(SPEED_LIMIT).sub(this.velocity).multiplyScalar(TURN_SPEED);
      cohesion.divideScalar(count).sub(this.mesh.position).normalize().multiplyScalar(SPEED_LIMIT).sub(this.velocity).multiplyScalar(TURN_SPEED);
      separation.divideScalar(count).normalize().multiplyScalar(SPEED_LIMIT).sub(this.velocity).multiplyScalar(TURN_SPEED * 1.5);

      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
    }

    // --- INTERACTION LOGIC (GATHER / SCATTER) ---
    const dirToMouse = new THREE.Vector3().subVectors(mousePos, this.mesh.position);
    const distToMouse = dirToMouse.length();

    if (mode === 'GATHER') {
      // Strong Attraction
      dirToMouse.normalize().multiplyScalar(0.08); // Stronger pull
      this.acceleration.add(dirToMouse);
    } else if (mode === 'SCATTER') {
      // Strong Repulsion (Fear)
      if (distToMouse < 25) {
        dirToMouse.normalize().multiplyScalar(-0.2); // Very strong push
        this.acceleration.add(dirToMouse);
      }
    } else {
      // Normal weak attraction
      if (distToMouse < 40) {
        dirToMouse.normalize().multiplyScalar(0.002);
        this.acceleration.add(dirToMouse);
      }
    }

    // --- PHYSICS UPDATE ---
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, mode === 'SCATTER' ? SPEED_LIMIT * 2 : SPEED_LIMIT);
    this.mesh.position.add(this.velocity);
    this.acceleration.set(0, 0, 0); 

    // --- BOUNDARY ---
    const rangeX = 40;
    const rangeY = 25;
    const rangeZ = 10;
    const turnFactor = TURN_SPEED * 1.5;

    if (this.mesh.position.x > rangeX) this.velocity.x -= turnFactor;
    if (this.mesh.position.x < -rangeX) this.velocity.x += turnFactor;
    if (this.mesh.position.y > rangeY) this.velocity.y -= turnFactor;
    if (this.mesh.position.y < -rangeY) this.velocity.y += turnFactor;
    if (this.mesh.position.z > rangeZ) this.velocity.z -= turnFactor;
    if (this.mesh.position.z < -rangeZ - 15) this.velocity.z += turnFactor;

    // --- ORIENTATION & ANIMATION ---
    const lookTarget = this.mesh.position.clone().add(this.velocity);
    this.mesh.lookAt(lookTarget);

    const bankAngle = this.velocity.x * -3.0; 
    this.mesh.rotateZ(bankAngle);

    // Animation Speed based on velocity
    const speedFactor = this.velocity.length() * 30;
    
    // Tail wag
    this.tail.rotation.y = Math.sin(time * speedFactor + this.offset) * 0.6;
    
    // Fins flap (Paddle motion)
    const finCycle = Math.sin(time * speedFactor * 1.5 + this.offset);
    this.finL.rotation.y = -0.5 + finCycle * 0.3;
    this.finL.rotation.z = 0.2 + finCycle * 0.2;
    
    this.finR.rotation.y = 0.5 - finCycle * 0.3;
    this.finR.rotation.z = -0.2 - finCycle * 0.2;
  }

  dispose() {
    this.mesh.children.forEach((c: any) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
  }
}

// --- LEVIATHAN CLASS (Big Independent Fish) ---
class Leviathan {
  mesh: THREE.Group;
  body: THREE.Mesh;
  tail: THREE.Mesh;
  finL: THREE.Mesh;
  finR: THREE.Mesh;
  
  velocity: THREE.Vector3;
  target: THREE.Vector3;
  speed: number;
  turnSpeed: number;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    this.speed = 0.12; 
    this.turnSpeed = 0.008; 

    const mainColor = 0xff00ff; // Magenta

    const wireMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: mainColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });

    // 1. Body: Segmented look (Pentagonal)
    const bodyGeom = new THREE.CylinderGeometry(0.2, 1.5, 7, 5);
    bodyGeom.rotateX(Math.PI / 2);
    this.body = new THREE.Mesh(bodyGeom, wireMat);
    this.body.add(new THREE.Mesh(bodyGeom, glowMat));
    this.mesh.add(this.body);

    // Head
    const headGeom = new THREE.ConeGeometry(1.5, 3, 5);
    headGeom.rotateX(Math.PI / 2);
    headGeom.translate(0, 0, 5); // Front
    const head = new THREE.Mesh(headGeom, wireMat);
    this.body.add(head);

    // 2. Tail: Articulated
    const tailGeom = new THREE.ConeGeometry(0.8, 3, 5);
    tailGeom.rotateX(Math.PI / 2);
    tailGeom.scale(0.5, 1, 1);
    tailGeom.translate(0, -1.5, 0); // Offset pivot
    
    this.tail = new THREE.Mesh(tailGeom, wireMat);
    this.tail.position.z = -3.5; // Back of body
    this.tail.rotation.x = Math.PI;
    this.mesh.add(this.tail);

    // 3. Pectoral Fins (Large Wings)
    const finGeom = new THREE.BufferGeometry();
    const finVerts = new Float32Array([
       0, 0, 0,
       2.5, 0, -1,
       2.5, 0, 1.5
    ]);
    finGeom.setAttribute('position', new THREE.BufferAttribute(finVerts, 3));

    // Left Fin
    this.finL = new THREE.Mesh(finGeom, wireMat);
    this.finL.position.set(0.8, -0.5, 1.5); 
    this.mesh.add(this.finL);

    // Right Fin
    this.finR = new THREE.Mesh(finGeom, wireMat);
    this.finR.position.set(-0.8, -0.5, 1.5);
    this.finR.rotation.z = Math.PI;
    this.finR.rotation.y = Math.PI;
    this.mesh.add(this.finR);

    // Initial Position (Far back)
    this.mesh.position.set(-40, -10, -20);
    this.velocity = new THREE.Vector3(1, 0, 0);
    this.target = new THREE.Vector3(40, 10, -15);

    scene.add(this.mesh);
  }

  update(time: number) {
    // --- MOVEMENT LOGIC ---
    // Move towards target
    const dir = new THREE.Vector3().subVectors(this.target, this.mesh.position);
    const dist = dir.length();

    // If close to target, pick new random target
    if (dist < 10) {
      this.target.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 15 
      );
    }

    // Steer
    dir.normalize();
    const desiredVelocity = dir.multiplyScalar(this.speed);
    const steer = new THREE.Vector3().subVectors(desiredVelocity, this.velocity);
    steer.clampLength(0, this.turnSpeed);
    
    this.velocity.add(steer);
    this.mesh.position.add(this.velocity);

    // --- ANIMATION ---
    // Look ahead
    const lookTarget = this.mesh.position.clone().add(this.velocity);
    this.mesh.lookAt(lookTarget);

    // Banking
    const bankAngle = this.velocity.x * -1.0;
    this.mesh.rotateZ(bankAngle);

    // Tail Swim (Slow, heavy)
    this.tail.rotation.y = Math.sin(time * 1.5) * 0.3;

    // Fins Swim (Slow flap)
    this.finL.rotation.z = Math.sin(time * 1.5) * 0.3 - 0.2;
    this.finR.rotation.z = Math.PI - (Math.sin(time * 1.5) * 0.3 - 0.2);
  }

  dispose() {
    this.mesh.children.forEach((c: any) => {
      // Recursive dispose helper could be better, but simple loop works for 1 level
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
      if (c.children) {
          c.children.forEach((cc: any) => {
              if(cc.geometry) cc.geometry.dispose();
              if(cc.material) cc.material.dispose();
          })
      }
    });
  }
}


const CyberBoids: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for animation loop
  const boidsRef = useRef<Boid[]>([]);
  const leviathanRef = useRef<Leviathan | null>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  
  // Interaction State
  const interactionModeRef = useRef<InteractionMode>('NORMAL');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- THREE JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Initialize Boids
    const boids: Boid[] = [];
    for (let i = 0; i < BOID_COUNT; i++) {
      const color = Math.random() > 0.5 ? 0x00f3ff : 0xff00ff;
      boids.push(new Boid(scene, color));
    }
    boidsRef.current = boids;

    // Initialize Leviathan
    const leviathan = new Leviathan(scene);
    leviathanRef.current = leviathan;

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(x, y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        mouseRef.current.copy(pos);
    };

    // Interaction Handlers
    const setMode = (mode: InteractionMode, duration: number) => {
        interactionModeRef.current = mode;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            interactionModeRef.current = 'NORMAL';
        }, duration);
    };

    const handleClick = () => {
        // Double click will trigger this too, but that's okay, dblclick event will override shortly after
        if (interactionModeRef.current !== 'SCATTER') {
             setMode('GATHER', 3000);
        }
    };

    const handleDoubleClick = () => {
        setMode('SCATTER', 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('dblclick', handleDoubleClick);

    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
      // Update Boids
      boidsRef.current.forEach(boid => {
        boid.update(boidsRef.current, mouseRef.current, time, interactionModeRef.current);
      });

      // Update Leviathan
      if (leviathanRef.current) {
        leviathanRef.current.update(time);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('resize', handleResize);
      if (timerRef.current) clearTimeout(timerRef.current);
      
      boidsRef.current.forEach(b => b.dispose());
      if (leviathanRef.current) leviathanRef.current.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CyberBoids;