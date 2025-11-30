import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // 深い霧を追加して、奥のオブジェクトを闇に溶け込ませる
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- 1. DIGITAL TERRAIN (波打つ地形) ---
    // 地面のジオメトリ作成
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 60, 60);
    
    // 頂点の初期位置を保存してアニメーションに使用
    const count = planeGeometry.attributes.position.count;
    const initialZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        initialZ[i] = planeGeometry.attributes.position.getZ(i);
    }

    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, // Cyber Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });

    const terrain = new THREE.Mesh(planeGeometry, planeMaterial);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -10;
    scene.add(terrain);

    // 天井の地形（反転）
    const ceiling = terrain.clone();
    ceiling.position.y = 20;
    ceiling.material = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, // Magenta
        wireframe: true,
        transparent: true,
        opacity: 0.08, // 少し薄く
        side: THREE.DoubleSide
    });
    scene.add(ceiling);


    // --- 2. FLOATING ARTIFACTS (浮遊する幾何学体) ---
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0)
    ];

    const shapes: THREE.Mesh[] = [];

    // ランダムに配置
    for (let i = 0; i < 30; i++) {
        const geom = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00f3ff : 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const mesh = new THREE.Mesh(geom, mat);
        
        // ランダムな位置 (カメラの視界に入る範囲)
        mesh.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 80 - 20 // カメラより奥
        );
        
        // ランダムなサイズ
        const scale = Math.random() * 2 + 0.5;
        mesh.scale.set(scale, scale, scale);

        // 回転速度をカスタムプロパティとして追加
        (mesh as any).rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02
        };

        shapes.push(mesh);
        shapesGroup.add(mesh);
    }

    // --- 3. PARTICLES (データの粒子) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);


    // --- MOUSE INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
    };
    window.addEventListener('mousemove', handleMouseMove);


    // --- ANIMATION LOOP ---
    let time = 0;
    
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.015;

        // 1. Terrain Animation (Wave Effect)
        const positionAttribute = planeGeometry.attributes.position;
        for (let i = 0; i < count; i++) {
            // シンプレックスノイズのような波を作る
            // x座標とy座標に基づいてz(高さ)を変動させる
            
            const x = i % 60;
            const y = Math.floor(i / 60);
            
            const waveX = Math.sin(x * 0.5 + time) * 1.5;
            const waveY = Math.cos(y * 0.3 + time) * 1.5;
            
            // 地形をうねらせる
            positionAttribute.setZ(i, initialZ[i] + waveX + waveY);
        }
        positionAttribute.needsUpdate = true;
        
        // 2. Shapes Animation
        shapes.forEach(mesh => {
            mesh.rotation.x += (mesh as any).rotationSpeed.x;
            mesh.rotation.y += (mesh as any).rotationSpeed.y;
            
            // 少し浮遊させる
            mesh.position.y += Math.sin(time + mesh.position.x) * 0.02;
        });

        // 3. Camera Parallax (Mouse Smooth Follow)
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY + 10 - camera.position.y) * 0.05; // Base height 10
        
        camera.lookAt(0, 0, 0);

        // 4. Particles Flow
        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.position.z += 0.2;
        if (particlesMesh.position.z > 50) particlesMesh.position.z = -50;

        renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
        }
        planeGeometry.dispose();
        planeMaterial.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }} 
    />
  );
};

export default ThreeBackground;