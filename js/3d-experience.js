/**
 * ==========================================================================
 * 3D WEBL EXPERIENCE & INTERACTIVE TILT ENGINE
 * Avinash Portfolio - Futuristic Full-Stack Architect
 * ==========================================================================
 */

(function () {
  'use strict';

  // Check WebGL & THREE support
  function hasWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  /* --------------------------------------------------------------------------
     1. COLOR PALETTES & THEME ADAPTATION
     -------------------------------------------------------------------------- */
  const THEME_COLORS = {
    dark: {
      coreWireframe: 0x00f2fe,
      coreSecondary: 0x8b5cf6,
      nodes: 0x00f2fe,
      innerGlow: 0x38bdf8,
      particles: 0x00f2fe,
      waveGrid: 0x0369a1,
      fog: 0x07090e
    },
    light: {
      coreWireframe: 0x2563eb,
      coreSecondary: 0x6366f1,
      nodes: 0x0284c7,
      innerGlow: 0x3b82f6,
      particles: 0x2563eb,
      waveGrid: 0x94a3b8,
      fog: 0xf8fafc
    }
  };

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  /* --------------------------------------------------------------------------
     2. THREE.JS 3D SCENE MANAGER
     -------------------------------------------------------------------------- */
  class WebGLSceneManager {
    constructor() {
      this.canvas = document.getElementById('webgl-3d-scene');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'webgl-3d-scene';
        document.body.prepend(this.canvas);
      }

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.coreGroup = null;
      this.outerMesh = null;
      this.innerMesh = null;
      this.ring1 = null;
      this.ring2 = null;
      this.nodePoints = null;
      this.particleSystem = null;
      this.wavePlane = null;
      this.waveGeometry = null;

      this.mouseX = 0;
      this.mouseY = 0;
      this.targetMouseX = 0;
      this.targetMouseY = 0;
      this.scrollY = 0;
      this.targetScrollY = 0;

      // Drag interaction state
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.dragRotation = { x: 0, y: 0 };

      this.isRunning = true;
      this.clock = new THREE.Clock();

      this.init();
    }

    init() {
      // 1. Scene & Camera
      this.scene = new THREE.Scene();
      const currentTheme = getCurrentTheme();
      const colors = THEME_COLORS[currentTheme];

      this.camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 0, 38);

      // 2. Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 3. Build Objects
      this.buildGeometricCore(colors);
      this.buildParticleConstellation(colors);
      this.buildCyberWaveHorizon(colors);

      // 4. Attach Events
      this.bindEvents();

      // 5. Start Render Loop
      this.animate();
    }

    buildGeometricCore(colors) {
      this.coreGroup = new THREE.Group();

      // A. Outer Wireframe Polyhedron (Dual Icosahedron)
      const outerGeo = new THREE.IcosahedronGeometry(7.2, 1);
      const outerMat = new THREE.MeshBasicMaterial({
        color: colors.coreWireframe,
        wireframe: true,
        transparent: true,
        opacity: 0.38
      });
      this.outerMesh = new THREE.Mesh(outerGeo, outerMat);
      this.coreGroup.add(this.outerMesh);

      // B. Inner Counter-Rotating Octahedron
      const innerGeo = new THREE.OctahedronGeometry(5.0, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: colors.coreSecondary,
        wireframe: true,
        transparent: true,
        opacity: 0.52
      });
      this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
      this.coreGroup.add(this.innerMesh);

      // C. Vertex Points for Holographic Sparks
      const nodeGeo = new THREE.BufferGeometry();
      const outerPositions = outerGeo.attributes.position.array;
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
      const nodeMat = new THREE.PointsMaterial({
        color: colors.nodes,
        size: 0.38,
        transparent: true,
        opacity: 0.95
      });
      this.nodePoints = new THREE.Points(nodeGeo, nodeMat);
      this.coreGroup.add(this.nodePoints);

      // D. Inner Floating Sphere Energy Pulse
      const coreSphereGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const coreSphereMat = new THREE.MeshBasicMaterial({
        color: colors.innerGlow,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      this.coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
      this.coreGroup.add(this.coreSphere);

      // E. Dual Gyroscope Orbital Rings
      const ring1Geo = new THREE.TorusGeometry(9.8, 0.035, 8, 80);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: colors.coreWireframe,
        transparent: true,
        opacity: 0.35
      });
      this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      this.ring1.rotation.x = Math.PI / 3;
      this.coreGroup.add(this.ring1);

      const ring2Geo = new THREE.TorusGeometry(11.2, 0.035, 8, 80);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: colors.coreSecondary,
        transparent: true,
        opacity: 0.28
      });
      this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      this.ring2.rotation.y = Math.PI / 4;
      this.coreGroup.add(this.ring2);

      // Position: On desktop, frame the Hero text nicely to the right side
      this.updateCorePosition();
      this.scene.add(this.coreGroup);
    }

    updateCorePosition() {
      if (!this.coreGroup) return;
      if (window.innerWidth > 992) {
        this.coreGroup.position.set(13, 0.8, 0);
        this.coreGroup.scale.set(1, 1, 1);
      } else if (window.innerWidth > 600) {
        this.coreGroup.position.set(8, 0.5, -5);
        this.coreGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        this.coreGroup.position.set(0, 1.5, -8);
        this.coreGroup.scale.set(0.68, 0.68, 0.68);
      }
    }

    buildParticleConstellation(colors) {
      const particleCount = window.innerWidth < 768 ? 600 : 1200;
      const positions = new Float32Array(particleCount * 3);
      const velocities = [];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 90;
        positions[i3 + 1] = (Math.random() - 0.5) * 70;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;

        velocities.push({
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
          origX: positions[i3],
          origY: positions[i3 + 1],
          origZ: positions[i3 + 2]
        });
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: colors.particles,
        size: 0.24,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });

      this.particleSystem = new THREE.Points(particleGeo, particleMat);
      this.particleVelocities = velocities;
      this.scene.add(this.particleSystem);
    }

    buildCyberWaveHorizon(colors) {
      const width = 110;
      const height = 55;
      const segmentsW = 36;
      const segmentsH = 22;

      this.waveGeometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);
      const waveMat = new THREE.MeshBasicMaterial({
        color: colors.waveGrid,
        wireframe: true,
        transparent: true,
        opacity: 0.16
      });

      this.wavePlane = new THREE.Mesh(this.waveGeometry, waveMat);
      this.wavePlane.rotation.x = -Math.PI / 2.3;
      this.wavePlane.position.set(0, -17, -10);
      this.scene.add(this.wavePlane);

      // Store initial Z positions for wave physics
      const pos = this.waveGeometry.attributes.position;
      this.waveInitialZ = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i++) {
        this.waveInitialZ[i] = pos.getZ(i);
      }
    }

    bindEvents() {
      // Mouse move parallax
      window.addEventListener('mousemove', (e) => {
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      // Window scroll tracking
      window.addEventListener('scroll', () => {
        this.targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
      }, { passive: true });

      // Resize debouncing
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.updateCorePosition();
        }, 120);
      });

      // Interactive Drag on Hero or Window
      window.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, input, textarea, .terminal-window')) return;
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.dragRotation.y += deltaX * 0.006;
        this.dragRotation.x += deltaY * 0.006;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      // Tab visibility pause to save battery/GPU
      document.addEventListener('visibilitychange', () => {
        this.isRunning = !document.hidden;
        if (this.isRunning) {
          this.clock.start();
          this.animate();
        } else {
          this.clock.stop();
        }
      });

      // Theme toggle observer
      const themeObserver = new MutationObserver(() => {
        this.updateThemeColors();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    updateThemeColors() {
      const theme = getCurrentTheme();
      const colors = THEME_COLORS[theme];

      if (this.outerMesh) this.outerMesh.material.color.setHex(colors.coreWireframe);
      if (this.innerMesh) this.innerMesh.material.color.setHex(colors.coreSecondary);
      if (this.nodePoints) this.nodePoints.material.color.setHex(colors.nodes);
      if (this.coreSphere) this.coreSphere.material.color.setHex(colors.innerGlow);
      if (this.ring1) this.ring1.material.color.setHex(colors.coreWireframe);
      if (this.ring2) this.ring2.material.color.setHex(colors.coreSecondary);
      if (this.particleSystem) this.particleSystem.material.color.setHex(colors.particles);
      if (this.wavePlane) this.wavePlane.material.color.setHex(colors.waveGrid);
    }

    animate() {
      if (!this.isRunning) return;
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Smooth mouse interpolation
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
      this.scrollY += (this.targetScrollY - this.scrollY) * 0.06;

      // 1. Rotate Geometric Core
      if (this.coreGroup) {
        // Base idle rotation + drag rotation + mouse sway
        this.outerMesh.rotation.x = time * 0.18 + this.dragRotation.x;
        this.outerMesh.rotation.y = time * 0.24 + this.dragRotation.y + this.mouseX * 0.6;
        this.nodePoints.rotation.copy(this.outerMesh.rotation);

        this.innerMesh.rotation.x = -time * 0.28 - this.dragRotation.x;
        this.innerMesh.rotation.y = -time * 0.35 - this.dragRotation.y;

        this.ring1.rotation.z = time * 0.3;
        this.ring2.rotation.z = -time * 0.25;

        // Subtle vertical breathing float
        this.coreGroup.position.y += Math.sin(time * 1.5) * 0.008;

        // Decelerate drag rotation over time
        this.dragRotation.x *= 0.96;
        this.dragRotation.y *= 0.96;
      }

      // 2. Animate Cyber Wave Horizon
      if (this.wavePlane && this.waveGeometry) {
        const pos = this.waveGeometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          const waveZ = Math.sin(u * 0.14 + time * 0.9) * Math.cos(v * 0.14 + time * 0.7) * 1.6;
          pos.setZ(i, waveZ);
        }
        pos.needsUpdate = true;
      }

      // 3. Animate Particle Constellation
      if (this.particleSystem) {
        const positions = this.particleSystem.geometry.attributes.position.array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const vel = this.particleVelocities[i];

          // Gentle drift around original center
          positions[i3] += vel.x;
          positions[i3 + 1] += vel.y;
          positions[i3 + 2] += vel.z;

          if (Math.abs(positions[i3] - vel.origX) > 4) vel.x *= -1;
          if (Math.abs(positions[i3 + 1] - vel.origY) > 4) vel.y *= -1;
          if (Math.abs(positions[i3 + 2] - vel.origZ) > 4) vel.z *= -1;
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;

        // Slow constellation drift
        this.particleSystem.rotation.y = time * 0.02 + this.mouseX * 0.15;
        this.particleSystem.rotation.x = this.mouseY * 0.1;
      }

      // 4. Camera Parallax & Scroll Depth
      this.camera.position.x = this.mouseX * 2.2;
      this.camera.position.y = -this.mouseY * 1.8 - this.scrollY * 0.009;

      this.renderer.render(this.scene, this.camera);
    }

    triggerCorePulse() {
      if (!this.coreGroup) return;
      let startScale = this.coreGroup.scale.x;
      let targetScale = startScale * 1.35;
      let duration = 400;
      let startTime = performance.now();

      const pulseStep = (now) => {
        let progress = (now - startTime) / duration;
        if (progress < 0.5) {
          let s = startScale + (targetScale - startScale) * (progress * 2);
          this.coreGroup.scale.set(s, s, s);
        } else if (progress <= 1) {
          let s = targetScale - (targetScale - startScale) * ((progress - 0.5) * 2);
          this.coreGroup.scale.set(s, s, s);
        } else {
          this.updateCorePosition();
          return;
        }
        requestAnimationFrame(pulseStep);
      };
      requestAnimationFrame(pulseStep);
    }
  }

  /* --------------------------------------------------------------------------
     3. INTERACTIVE 3D CARD TILT & SPECULAR GLARE ENGINE
     -------------------------------------------------------------------------- */
  function init3DCardTiltEngine() {
    // Select all interactive cards across the application
    const tiltSelectors = [
      '.project-card',
      '.terminal-window',
      '.service-card',
      '.process-step-card',
      '.about-card',
      '.contact-card'
    ];

    function attachTiltToElement(el) {
      if (!el || el.dataset.tiltBound === 'true') return;
      el.dataset.tiltBound = 'true';
      el.classList.add('has-3d-tilt');

      // Create glare overlay if not present
      let glare = el.querySelector('.card-3d-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-3d-glare';
        el.appendChild(glare);
      }

      let bounds = null;

      function onMouseEnter(e) {
        bounds = el.getBoundingClientRect();
      }

      function onMouseMove(e) {
        if (!bounds) bounds = el.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const percentX = mouseX / bounds.width;
        const percentY = mouseY / bounds.height;

        // Max rotation angle in degrees
        const maxTilt = 10;
        const rotateX = (-(percentY - 0.5) * (maxTilt * 2)).toFixed(2);
        const rotateY = ((percentX - 0.5) * (maxTilt * 2)).toFixed(2);

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`;

        // Update specular shine highlight
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const glareColor = isLight ? 'rgba(37, 99, 235, 0.18)' : 'rgba(255, 255, 255, 0.16)';
        glare.style.background = `radial-gradient(circle 320px at ${percentX * 100}% ${percentY * 100}%, ${glareColor} 0%, transparent 75%)`;
      }

      function onMouseLeave() {
        bounds = null;
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.background = 'transparent';
      }

      el.addEventListener('mouseenter', onMouseEnter, { passive: true });
      el.addEventListener('mousemove', onMouseMove, { passive: true });
      el.addEventListener('mouseleave', onMouseLeave, { passive: true });
    }

    // Attach to existing elements
    function refreshTiltTargets() {
      tiltSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(attachTiltToElement);
      });
    }

    refreshTiltTargets();

    // Re-bind when projects are dynamically re-rendered or filtered
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      const observer = new MutationObserver(() => {
        refreshTiltTargets();
      });
      observer.observe(projectsGrid, { childList: true, subtree: true });
    }

    // Expose refresh function globally
    window.refresh3DTilt = refreshTiltTargets;
  }

  /* --------------------------------------------------------------------------
     4. HERO 3D INTERACTIVE INDICATOR & ORBIT TRIGGER
     -------------------------------------------------------------------------- */
  function injectHero3DIndicator(webglManager) {
    const heroContent = document.querySelector('.hero-content .hero-badge-wrap');
    if (!heroContent) return;

    const indicator = document.createElement('div');
    indicator.className = 'hero-3d-indicator';
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');
    indicator.setAttribute('title', 'Click to trigger 3D quantum core warp');
    indicator.innerHTML = `
      <span class="indicator-dot-3d"></span>
      <span>3D WebGL Engine Active</span>
    `;

    indicator.addEventListener('click', () => {
      if (webglManager) {
        webglManager.triggerCorePulse();
      }
    });

    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        indicator.click();
      }
    });

    heroContent.appendChild(indicator);
  }

  /* --------------------------------------------------------------------------
     5. INITIALIZATION ENTRY POINT
     -------------------------------------------------------------------------- */
  function bootstrap3DExperience() {
    if (!hasWebGLSupport() || typeof THREE === 'undefined') {
      console.info('[DevCraft 3D] WebGL not supported or THREE library missing; falling back smoothly.');
      init3DCardTiltEngine();
      return;
    }

    const webglManager = new WebGLSceneManager();
    init3DCardTiltEngine();
    injectHero3DIndicator(webglManager);

    window.DEVCRAFT_3D = webglManager;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap3DExperience);
  } else {
    bootstrap3DExperience();
  }
})();
