import { useEffect, useRef } from "react";
import * as THREE from "three";

// Placeholder portrait: a stylised 3D bust with an orbiting "workflow" ring.
// Replace with a real photo later.
export default function AvatarScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // the CSS gradient behind it stays as the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.3, 8.2);
    camera.lookAt(0, 0.05, 0);

    scene.add(new THREE.HemisphereLight(0xe8f0ff, 0x1e3a8a, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0x38bdf8, 3);
    rim.position.set(-4, 2, -3);
    scene.add(key, rim);

    const disposables = [];
    const mat = (color, roughness = 0.4) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08 });
      disposables.push(m);
      return m;
    };
    const geo = (g) => (disposables.push(g), g);

    const figure = new THREE.Group();
    const head = new THREE.Mesh(geo(new THREE.SphereGeometry(0.62, 64, 64)), mat(0xd4e2fd, 0.35));
    head.scale.set(0.92, 1.05, 0.95);
    head.position.y = 1.0;
    const neck = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.22, 0.27, 0.45, 32)), mat(0xa7c1f7));
    neck.position.y = 0.3;
    // shoulders: a horizontal capsule, flattened front to back
    const torso = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.62, 0.9, 16, 48)), mat(0x2563eb, 0.55));
    torso.rotation.z = Math.PI / 2;
    torso.scale.set(1.15, 1, 0.62);
    torso.position.y = -0.62;
    figure.add(head, neck, torso);
    scene.add(figure);

    // orbiting ring with three nodes, a nod to the workflows
    const orbit = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.7 });
    disposables.push(ringMat);
    const ring = new THREE.Mesh(geo(new THREE.TorusGeometry(1.45, 0.012, 8, 160)), ringMat);
    ring.rotation.x = Math.PI / 2;
    orbit.add(ring);
    const nodeGeo = geo(new THREE.SphereGeometry(0.075, 24, 24));
    [0xf97316, 0x2563eb, 0x14b8a6].forEach((c, i) => {
      const m = new THREE.MeshBasicMaterial({ color: c });
      disposables.push(m);
      const node = new THREE.Mesh(nodeGeo, m);
      const a = (i / 3) * Math.PI * 2;
      node.position.set(Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45);
      orbit.add(node);
    });
    orbit.position.y = 0.55;
    orbit.rotation.z = 0.22;
    scene.add(orbit);

    const pointer = { x: 0, sx: 0 };
    const onPointer = (e) => { pointer.x = (e.clientX / window.innerWidth) * 2 - 1; };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) frame(0);
    };

    const frame = (t) => {
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      figure.rotation.y = Math.sin(t * 0.5) * 0.25 + pointer.sx * 0.35;
      head.position.y = 1.0 + Math.sin(t * 1.2) * 0.02;
      orbit.rotation.y = t * 0.4;
      renderer.render(scene, camera);
    };

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const loop = () => {
      frame((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    // only animate while the portrait is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting && !running) { running = true; loop(); }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(mount);
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();
    if (reduced) frame(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="avatar-scene" aria-hidden="true" />;
}
