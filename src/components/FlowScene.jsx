import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS = {
  trigger: "#f97316",
  ai: "#2563eb",
  app: "#0ea5e9",
  logic: "#f59e0b",
  data: "#14b8a6",
};

// A small invented workflow: purchase invoice -> AI reads it -> check -> book / approve / pay / archive
const NODES = [
  { id: "form", title: "Factuur ontvangen", sub: "Outlook-trigger", type: "trigger", icon: "mail", pos: [-7.2, 0.9, 0] },
  { id: "classify", title: "AI leest de pdf", sub: "AI-model", type: "ai", icon: "spark", pos: [-3.9, 2.3, -1.6] },
  { id: "draft", title: "Pdf gearchiveerd", sub: "SharePoint", type: "data", icon: "table", pos: [-3.9, -1.7, 1.2] },
  { id: "if", title: "Bedrag klopt?", sub: "Controle", type: "logic", icon: "branch", pos: [-0.9, 0.9, 0.2] },
  { id: "crm", title: "Factuur geboekt", sub: "Moneybird", type: "app", icon: "db", pos: [2.2, 2.5, -1.2] },
  { id: "slack", title: "Ter goedkeuring", sub: "Microsoft Teams", type: "app", icon: "chat", pos: [2.2, -0.5, 1.1] },
  { id: "mail", title: "Betaling ingepland", sub: "Bank", type: "app", icon: "euro", pos: [4.4, -2.1, -0.4] },
  { id: "sheet", title: "Overzicht bijgewerkt", sub: "Google Sheets", type: "data", icon: "table", pos: [5.4, 1.2, 1.4] },
];
const EDGES = [
  ["form", "classify"], ["form", "draft"], ["classify", "if"], ["if", "crm"],
  ["if", "slack"], ["draft", "mail"], ["crm", "sheet"], ["slack", "mail"],
];

const CARD_W = 3;
const CARD_H = 1.5;
// Width of the whole graph in world units at scale 1, and the page container width (--max) plus
// a little bleed. On large screens the graph is sized to the container instead of the viewport,
// so it stays next to the hero copy and the card textures are never blown up beyond their resolution.
const GRAPH_W = 13.3;
const CONTAINER_PX = 1240;
const CAMERA_Z = 13.5;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawIcon(ctx, kind, cx, cy, s, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  switch (kind) {
    case "bolt":
      ctx.moveTo(s * 0.1, -s * 0.5); ctx.lineTo(-s * 0.35, s * 0.1); ctx.lineTo(0, s * 0.1);
      ctx.lineTo(-s * 0.1, s * 0.5); ctx.lineTo(s * 0.35, -s * 0.1); ctx.lineTo(0, -s * 0.1);
      ctx.closePath(); ctx.fill();
      break;
    case "spark":
      ctx.moveTo(0, -s * 0.5); ctx.quadraticCurveTo(0, 0, s * 0.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, s * 0.5); ctx.quadraticCurveTo(0, 0, -s * 0.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s * 0.5); ctx.fill();
      break;
    case "branch":
      ctx.moveTo(-s * 0.4, 0); ctx.lineTo(-s * 0.05, 0);
      ctx.lineTo(s * 0.3, -s * 0.32); ctx.moveTo(-s * 0.05, 0); ctx.lineTo(s * 0.3, s * 0.32);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.38, -s * 0.34, s * 0.1, 0, 7); ctx.arc(s * 0.38, s * 0.34, s * 0.1, 0, 7); ctx.fill();
      break;
    case "db":
      ctx.ellipse(0, -s * 0.28, s * 0.4, s * 0.16, 0, 0, 7);
      ctx.moveTo(-s * 0.4, -s * 0.28); ctx.lineTo(-s * 0.4, s * 0.28);
      ctx.moveTo(s * 0.4, -s * 0.28); ctx.lineTo(s * 0.4, s * 0.28);
      ctx.moveTo(-s * 0.4, s * 0.28); ctx.ellipse(0, s * 0.28, s * 0.4, s * 0.16, 0, Math.PI, 0, true);
      ctx.stroke();
      break;
    case "chat":
      roundRect(ctx, -s * 0.42, -s * 0.38, s * 0.84, s * 0.6, s * 0.14);
      ctx.moveTo(-s * 0.15, s * 0.22); ctx.lineTo(-s * 0.2, s * 0.46); ctx.lineTo(s * 0.08, s * 0.22);
      ctx.stroke();
      break;
    case "mail":
      roundRect(ctx, -s * 0.44, -s * 0.32, s * 0.88, s * 0.64, s * 0.1);
      ctx.moveTo(-s * 0.42, -s * 0.28); ctx.lineTo(0, s * 0.06); ctx.lineTo(s * 0.42, -s * 0.28);
      ctx.stroke();
      break;
    case "euro":
      ctx.font = `700 ${s * 0.9}px 'Space Grotesk', system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("€", 0, s * 0.04);
      break;
    case "table":
      roundRect(ctx, -s * 0.42, -s * 0.4, s * 0.84, s * 0.8, s * 0.1);
      ctx.moveTo(-s * 0.42, -s * 0.05); ctx.lineTo(s * 0.42, -s * 0.05);
      ctx.moveTo(-s * 0.05, -s * 0.4); ctx.lineTo(-s * 0.05, s * 0.4);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

function makeCardTexture(node) {
  const W = 720, H = 360;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const color = COLORS[node.type];

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(1, "#eef3fb");
  roundRect(ctx, 6, 6, W - 12, H - 12, 44);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = color + "dd";
  ctx.stroke();

  // icon tile
  const g = ctx.createLinearGradient(60, 80, 220, 240);
  g.addColorStop(0, color);
  g.addColorStop(1, color + "88");
  roundRect(ctx, 56, 88, 184, 184, 44);
  ctx.fillStyle = g;
  ctx.fill();
  drawIcon(ctx, node.icon, 148, 180, 100, node.type === "logic" ? "#0b1630" : "#ffffff");

  ctx.fillStyle = "#0b1630";
  ctx.font = "600 52px 'Space Grotesk', system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(node.title, 276, 170, 400);
  ctx.fillStyle = "#4a5873";
  ctx.font = "500 36px 'DM Sans', system-ui, sans-serif";
  ctx.fillText(node.sub, 276, 226, 400);

  // status dot
  ctx.beginPath();
  ctx.arc(W - 62, 62, 12, 0, 7);
  ctx.fillStyle = "#16a34a";
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function FlowScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // CSS gradient backdrop stays as the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf5f8fd, 0.035);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const world = new THREE.Group();
    scene.add(world);

    const glowTex = makeGlowTexture();
    const disposables = [glowTex];
    const nodeMeshes = new Map();
    let cancelled = false;
    let raf = 0;
    let built = false;

    // --- background dust ---
    const dustCount = 420;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 30;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.05, color: 0x2563eb, transparent: true, opacity: 0.4, depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    disposables.push(dustGeo, dustMat);

    // --- build graph once fonts are ready so card textures use the real typefaces ---
    const edges = [];
    const pulses = [];
    const build = () => {
      if (cancelled) return;
      const bodyGeo = new THREE.BoxGeometry(CARD_W, CARD_H, 0.16);
      const faceGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
      const portGeo = new THREE.SphereGeometry(0.07, 16, 16);
      disposables.push(bodyGeo, faceGeo, portGeo);

      NODES.forEach((n, i) => {
        const group = new THREE.Group();
        const color = new THREE.Color(COLORS[n.type]);
        const tex = makeCardTexture(n);
        const faceMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, fog: false });
        const bodyMat = new THREE.MeshBasicMaterial({ color: 0x0b0b16, transparent: true, opacity: 0.0 });
        const face = new THREE.Mesh(faceGeo, faceMat);
        face.position.z = 0.09;
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex, color, transparent: true, opacity: 0.2, depthWrite: false,
        }));
        glow.scale.set(CARD_W * 1.9, CARD_H * 2.4, 1);
        glow.position.z = -0.1;
        const portMat = new THREE.MeshBasicMaterial({ color });
        const pIn = new THREE.Mesh(portGeo, portMat);
        const pOut = new THREE.Mesh(portGeo, portMat);
        pIn.position.set(-CARD_W / 2, 0, 0.09);
        pOut.position.set(CARD_W / 2, 0, 0.09);
        group.add(glow, body, face, pIn, pOut);
        group.position.set(n.pos[0] * 0.82, n.pos[1], n.pos[2]);
        group.rotation.y = -0.18 + (i % 3) * 0.09;
        world.add(group);
        disposables.push(tex, faceMat, bodyMat, glow.material, portMat);
        nodeMeshes.set(n.id, { group, base: new THREE.Vector3(n.pos[0] * 0.82, n.pos[1], n.pos[2]), phase: i * 1.7, color });
      });

      EDGES.forEach(([a, b], i) => {
        const A = nodeMeshes.get(a), B = nodeMeshes.get(b);
        const start = A.base.clone().add(new THREE.Vector3(CARD_W / 2, 0, 0.09));
        const end = B.base.clone().add(new THREE.Vector3(-CARD_W / 2, 0, 0.09));
        const dx = Math.max(1.4, Math.abs(end.x - start.x) * 0.5);
        const curve = new THREE.CubicBezierCurve3(
          start, start.clone().add(new THREE.Vector3(dx, 0, 0)),
          end.clone().add(new THREE.Vector3(-dx, 0, 0)), end,
        );
        const geo = new THREE.TubeGeometry(curve, 64, 0.022, 8, false);
        const mat = new THREE.MeshBasicMaterial({ color: A.color, transparent: true, opacity: 0.8 });
        world.add(new THREE.Mesh(geo, mat));
        disposables.push(geo, mat);
        edges.push({ curve, a, b });

        const count = 2;
        for (let k = 0; k < count; k++) {
          const pm = new THREE.SpriteMaterial({
            map: glowTex, color: 0x2563eb, transparent: true, opacity: 0.95, depthWrite: false,
          });
          const sprite = new THREE.Sprite(pm);
          sprite.scale.setScalar(0.55);
          world.add(sprite);
          disposables.push(pm);
          pulses.push({ sprite, curve, offset: k / count + i * 0.13, speed: 0.07 + (i % 3) * 0.015 });
        }
      });
      built = true;
      if (reduced) frame(0);
    };
    document.fonts.ready.then(build);

    // --- interaction state ---
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let scroll = 0, scrollSmooth = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // full strength on the hero, faint ambient backdrop behind content sections
      const fade = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
      mount.style.opacity = String(1 - fade * 0.92);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let wide = true;
    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      wide = camera.aspect > 1.1;
      camera.updateProjectionMatrix();
      if (reduced && built) frame(0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // --- render loop ---
    const t0 = performance.now();
    const tmp = new THREE.Vector3();
    function frame(t) {
      scrollSmooth += (scroll - scrollSmooth) * 0.06;
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;

      // graph sits right of the hero copy on wide screens, centred and dimmer on phones
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const visW = 2 * camera.position.z * tanHalf * camera.aspect;
      const pxPerUnit = mount.clientHeight / (2 * CAMERA_Z * tanHalf);
      const containerPx = Math.min(mount.clientWidth, CONTAINER_PX);
      const sc = wide ? Math.min(1.1, 0.45 * camera.aspect, (containerPx * 0.56) / (GRAPH_W * pxPerUnit)) : 0.5;
      const targetX = wide ? Math.min(visW * 0.225 + 0.74 * sc, (containerPx * 0.26) / pxPerUnit) : 0;
      world.scale.setScalar(sc);
      world.position.x = targetX - scrollSmooth * 5;
      world.position.y = scrollSmooth * 3.2 + (wide ? 0 : -3.9);
      world.rotation.y = -0.38 + scrollSmooth * 1.15 + pointer.sx * 0.12;
      world.rotation.x = 0.05 + pointer.sy * 0.06 - scrollSmooth * 0.2;

      camera.position.set(0, 0.4, CAMERA_Z - scrollSmooth * 4);
      camera.lookAt(0, 0.2, 0);

      nodeMeshes.forEach((m) => {
        m.group.position.y = m.base.y + Math.sin(t * 0.8 + m.phase) * 0.12;
      });
      for (const p of pulses) {
        const u = reduced ? (p.offset % 1) : (t * p.speed + p.offset) % 1;
        p.curve.getPoint(u, tmp);
        p.sprite.position.copy(tmp);
        p.sprite.material.opacity = Math.sin(u * Math.PI) * 0.95;
      }
      dust.rotation.y = t * 0.012;
      dust.position.y = scrollSmooth * 2;
      renderer.render(scene, camera);
    }
    const loop = () => {
      frame((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    if (!reduced) loop();
    else frame(0);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="flow-scene" aria-hidden="true" />;
}
