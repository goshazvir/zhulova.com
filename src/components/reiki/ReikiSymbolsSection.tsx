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

    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const getSize = () => ({ w: stage.clientWidth, h: stage.clientHeight });
    let size = getSize();
    renderer.setSize(size.w, size.h);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, size.w / size.h, 0.1, 100);
    camera.position.set(0, 0, 6);

    const N = 300;
    const positions = new Float32Array(N * 3);
    const targetA = new Float32Array(N * 3);
    const targetB = new Float32Array(N * 3);
    const targetC = new Float32Array(N * 3);
    const randoms = new Float32Array(N);
    const sizes = new Float32Array(N);
    const xOff = window.innerWidth < 768 ? 0 : 1.0;

    const chokuLen = SYMBOL_POINTS.choku.length;
    const seihekiLen = SYMBOL_POINTS.seiheki.length;
    const honshaLen = SYMBOL_POINTS.honsha.length;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.5) * 3.5;
      positions[i3] = Math.cos(ang) * rad;
      positions[i3 + 1] = (Math.random() - 0.5) * 2.2;
      positions[i3 + 2] = Math.sin(ang) * rad * 0.5 - 0.5;

      targetA[i3] = SYMBOL_POINTS.choku[(i * 2) % chokuLen] * 2.2 + xOff;
      targetA[i3 + 1] = SYMBOL_POINTS.choku[(i * 2 + 1) % chokuLen] * 2.2;
      targetA[i3 + 2] = (Math.random() - 0.5) * 0.2;

      targetB[i3] = SYMBOL_POINTS.seiheki[(i * 2) % seihekiLen] * 2.2 + xOff;
      targetB[i3 + 1] = SYMBOL_POINTS.seiheki[(i * 2 + 1) % seihekiLen] * 2.2;
      targetB[i3 + 2] = (Math.random() - 0.5) * 0.2;

      targetC[i3] = SYMBOL_POINTS.honsha[(i * 2) % honshaLen] * 2.2 + xOff;
      targetC[i3 + 1] = SYMBOL_POINTS.honsha[(i * 2 + 1) % honshaLen] * 2.2;
      targetC[i3 + 2] = (Math.random() - 0.5) * 0.2;

      randoms[i] = Math.random();
      sizes[i] = Math.random() < 0.15 ? 3 + Math.random() * 2 : 1 + Math.random() * 1.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('aTargetA', new THREE.BufferAttribute(targetA, 3));
    geo.setAttribute('aTargetB', new THREE.BufferAttribute(targetB, 3));
    geo.setAttribute('aTargetC', new THREE.BufferAttribute(targetC, 3));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const vShader = `
      attribute vec3 aTargetA, aTargetB, aTargetC, aScatter;
      attribute float aRandom, aSize;
      uniform float uTime, uMorph, uSymbolIndex, uPR;
      varying float vAlpha, vRandom;
      void main(){
        vec3 target = uSymbolIndex < 0.5 ? aTargetA : uSymbolIndex < 1.5 ? aTargetB : aTargetC;
        float ease = uMorph*uMorph*(3.0-2.0*uMorph);
        vec3 base = mix(aScatter, target, ease);
        float turbAmp = mix(0.3, 0.04, ease);
        base.x += sin(base.y*1.4 + uTime*0.5 + aRandom*6.28) * turbAmp;
        base.y += cos(base.x*1.2 + uTime*0.4) * turbAmp;
        float twinkle = 0.5 + 0.5*sin(uTime*1.2 + aRandom*40.0);
        vAlpha = 0.25 + twinkle*0.55;
        vRandom = aRandom;
        vec4 mv = modelViewMatrix * vec4(base, 1.0);
        gl_PointSize = aSize * uPR * (10.0 / -mv.z) * (0.7 + 0.3*twinkle);
        gl_Position = projectionMatrix * mv;
      }
    `;

    const fShader = `
      varying float vAlpha, vRandom;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        float alpha = core * vAlpha;
        vec3 col = mix(vec3(0.78,0.66,0.30), vec3(0.48,0.61,0.43), vRandom);
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.8));
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uSymbolIndex: { value: 0 },
        uPR: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: vShader,
      fragmentShader: fShader,
      transparent: true,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);

    const names = ['Cho Ku Rei', 'Sei He Ki', 'Hon Sha Ze Sho Nen'];
    const FORM = 3.2, HOLD = 4.6, DIS = 2.6, PER = FORM + HOLD + DIS, TOTAL = PER * 3;
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const lt = t % TOTAL;
      const si = Math.floor(lt / PER);
      const ti = lt - si * PER;
      const morph = ti < FORM ? ti / FORM : ti < FORM + HOLD ? 1 : 1 - (ti - FORM - HOLD) / DIS;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMorph.value = morph;
      mat.uniforms.uSymbolIndex.value = si;
      labelEl.textContent = names[si];
      const showLabel = ti > FORM * 0.6 && ti < FORM + HOLD;
      labelEl.classList.toggle('show', showLabel);
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
