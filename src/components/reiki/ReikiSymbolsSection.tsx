import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SYMBOL_POINTS } from '../../data/symbolPoints';

export default function ReikiSymbolsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const labelEl = labelRef.current;
    if (!stage || !canvas || !labelEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const pr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(pr);

    const getSize = () => ({ w: stage.clientWidth, h: stage.clientHeight });
    let size = getSize();
    renderer.setSize(size.w, size.h);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, size.w / size.h, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // More particles for richer animation
    const FULL_N = SYMBOL_POINTS.choku.length / 2;
    const N = isMobile ? Math.min(FULL_N, 500) : Math.min(FULL_N, 800);
    const step = FULL_N / N;
    const indices: number[] = [];
    for (let j = 0; j < N; j++) indices.push(Math.floor(j * step));

    const aTargetA = new Float32Array(N * 3);
    const aTargetB = new Float32Array(N * 3);
    const aTargetC = new Float32Array(N * 3);
    const aScatter = new Float32Array(N * 3);
    const aRandom = new Float32Array(N);
    const aSize = new Float32Array(N);

    const scatterRadius = 3.8;
    const xOffset = isMobile ? 0 : 1.1;

    for (let k = 0; k < N; k++) {
      const s = indices[k];
      const o3 = k * 3;
      const chokuLen = SYMBOL_POINTS.choku.length;
      const seihekiLen = SYMBOL_POINTS.seiheki.length;
      const honshaLen = SYMBOL_POINTS.honsha.length;

      aTargetA[o3] = SYMBOL_POINTS.choku[(s * 2) % chokuLen] + xOffset;
      aTargetA[o3 + 1] = SYMBOL_POINTS.choku[(s * 2 + 1) % chokuLen];
      aTargetA[o3 + 2] = (Math.random() - 0.5) * 0.25;

      aTargetB[o3] = SYMBOL_POINTS.seiheki[(s * 2) % seihekiLen] + xOffset;
      aTargetB[o3 + 1] = SYMBOL_POINTS.seiheki[(s * 2 + 1) % seihekiLen];
      aTargetB[o3 + 2] = (Math.random() - 0.5) * 0.25;

      aTargetC[o3] = SYMBOL_POINTS.honsha[(s * 2) % honshaLen] + xOffset;
      aTargetC[o3 + 1] = SYMBOL_POINTS.honsha[(s * 2 + 1) % honshaLen];
      aTargetC[o3 + 2] = (Math.random() - 0.5) * 0.25;

      const ang = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.5) * scatterRadius;
      const elev = (Math.random() - 0.5) * 2.4;
      aScatter[o3] = Math.cos(ang) * rad;
      aScatter[o3 + 1] = elev;
      aScatter[o3 + 2] = Math.sin(ang) * rad * 0.6 - 0.6;

      aRandom[k] = Math.random();
      aSize[k] = Math.random() < 0.14 ? (3.4 + Math.random() * 2.2) : (1.3 + Math.random() * 1.5);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(aScatter.slice(), 3));
    geo.setAttribute('aTargetA', new THREE.BufferAttribute(aTargetA, 3));
    geo.setAttribute('aTargetB', new THREE.BufferAttribute(aTargetB, 3));
    geo.setAttribute('aTargetC', new THREE.BufferAttribute(aTargetC, 3));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(aScatter, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));

    const vertexShader = `
      attribute vec3 aTargetA, aTargetB, aTargetC, aScatter;
      attribute float aRandom, aSize;
      uniform float uTime, uMorph, uSymbolIndex, uHover, uPixelRatio;
      uniform vec2 uMouse;
      varying float vAlpha, vRandom, vSizeFrac;

      vec3 turbulence(vec3 p, float t) {
        float n1 = sin(p.x * 1.4 + t * 0.7) * cos(p.y * 1.8 - t * 0.5);
        float n2 = cos(p.y * 1.2 - t * 0.6) * sin(p.z * 2.0 + t * 0.35);
        float n3 = sin(p.z * 1.6 + t * 0.8) * cos(p.x * 1.3 - t * 0.4);
        return vec3(n1, n2, n3);
      }

      void main() {
        vec3 target;
        if (uSymbolIndex < 0.5) target = aTargetA;
        else if (uSymbolIndex < 1.5) target = aTargetB;
        else target = aTargetC;

        float ease = uMorph * uMorph * (3.0 - 2.0 * uMorph);
        vec3 base = mix(aScatter, target, ease);

        // Richer turbulence
        float stability = mix(1.0, 0.35, uHover);
        float turbAmp = mix(0.34, 0.05, ease) * stability;
        vec3 turb = turbulence(base * 0.9 + aRandom * 12.0, uTime * 0.3 + aRandom * 6.2832) * turbAmp;

        // Mouse repulsion
        vec2 toMouse = uMouse - base.xy;
        float mouseDist = length(toMouse);
        float mouseInfluence = smoothstep(1.6, 0.0, mouseDist) * mix(0.22, 0.06, ease);
        vec2 mousePush = -normalize(toMouse + 0.0001) * mouseInfluence;

        vec3 pos = base + turb;
        pos.xy += mousePush;

        // Twinkle + brightness
        float twinkle = 0.5 + 0.5 * sin(uTime * 1.4 + aRandom * 40.0);
        float brightBoost = mix(1.0, 1.25, uHover);
        vAlpha = (0.30 + twinkle * 0.55) * brightBoost;
        vRandom = aRandom;
        vSizeFrac = aSize;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * uPixelRatio * (11.0 / -mvPosition.z) * (0.7 + 0.3 * twinkle);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vAlpha, vRandom, vSizeFrac;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.0, d);
        // Soft glow halo for larger particles
        float halo = smoothstep(0.5, 0.0, d * 0.55) * step(3.0, vSizeFrac) * 0.3;
        float alpha = (core + halo) * vAlpha;
        // Gold → olive gradient per particle
        vec3 col = mix(vec3(0.55, 0.45, 0.18), vec3(0.32, 0.48, 0.28), vRandom);
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.85));
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uSymbolIndex: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uPixelRatio: { value: pr },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);

    // Mouse interaction
    const mouseTarget = new THREE.Vector2(999, 999);
    const mouseCurrent = new THREE.Vector2(999, 999);
    let hoverTarget = 0;
    let hoverCurrent = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTarget.set(nx * 2.8, ny * 1.8);
      hoverTarget = 1;
    };
    const handleMouseLeave = () => {
      hoverTarget = 0;
      mouseTarget.set(999, 999);
    };

    stage.addEventListener('mousemove', handleMouseMove);
    stage.addEventListener('mouseleave', handleMouseLeave);

    // Animation timing — longer holds, smoother transitions
    const names = ['Cho Ku Rei', 'Sei He Ki', 'Hon Sha Ze Sho Nen'];
    const FORM = 3.2, HOLD = 4.6, DIS = 2.6;
    const PER = FORM + HOLD + DIS, TOTAL = PER * 3;
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const localT = elapsed % TOTAL;
      const symbolIndex = Math.floor(localT / PER);
      const tIn = localT - symbolIndex * PER;
      const morph = tIn < FORM ? tIn / FORM : tIn < FORM + HOLD ? 1.0 : 1.0 - (tIn - FORM - HOLD) / DIS;

      // Smooth mouse lerp
      hoverCurrent += (hoverTarget - hoverCurrent) * 0.06;
      mouseCurrent.lerp(mouseTarget, 0.08);

      mat.uniforms.uTime.value = elapsed;
      mat.uniforms.uMorph.value = morph;
      mat.uniforms.uSymbolIndex.value = symbolIndex;
      mat.uniforms.uHover.value = hoverCurrent;
      mat.uniforms.uMouse.value.copy(mouseCurrent);

      labelEl.textContent = names[symbolIndex];
      labelEl.classList.toggle('show', tIn > FORM * 0.6 && tIn < FORM + HOLD);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const s = getSize();
      if (!s.w || !s.h) return;
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      renderer.setSize(s.w, s.h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <section id="reiki" className="reiki-section" style={{ padding: 0 }}>
      <div className="reiki-stage" ref={stageRef}>
        <canvas ref={canvasRef} aria-hidden="true"></canvas>
        <div className="reiki-overlay">
          <div className="kanji-block">
            霊<br />気<small>Rei · Ki</small>
          </div>
          <div className="reiki-text">
            <p>Reiki is a Japanese practice of gentle, hands-on relaxation, developed by Mikao Usui in 1922.</p>
            <p>The word joins two ideas: <em>Rei</em> — universal wisdom, and <em>Ki</em> — the life energy that moves through every living thing.</p>
            <p>In a session, hands are placed lightly on or just above a fully clothed body; the rest happens quietly.</p>
            <p>The symbols forming behind these words belong to the second degree of the Usui tradition — passed from teacher to student, and used to focus and extend the work.</p>
            <p>Reiki is a complementary practice: it sits alongside medical or psychological care, never in place of it.</p>
          </div>
        </div>
        <div className="sym-label" ref={labelRef}></div>
      </div>
    </section>
  );
}
