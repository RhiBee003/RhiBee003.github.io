(function initPortfolioMesh() {
  const canvas = document.getElementById("mesh-bg");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cell = 96;
  const mouse = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let points = [];
  let cols = 0;
  let rows = 0;

  const palette = {
    baseTop: [255, 247, 250],
    baseBottom: [236, 236, 236],
    accent: [246, 200, 215],
    glow: [255, 223, 232],
    white: [255, 255, 255],
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixColor(a, b, t) {
    return a.map((channel, index) => Math.round(lerp(channel, b[index], t)));
  }

  function colorString(rgb, alpha) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }

  function vertexColor(x, y, time) {
    const vertical = Math.min(1, Math.max(0, y / Math.max(height, 1)));
    let rgb = mixColor(palette.baseTop, palette.baseBottom, vertical);

    if (mouse.active) {
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.hypot(dx, dy);
      const glow = Math.max(0, 1 - dist / 420);
      const glowSq = glow * glow;
      rgb = mixColor(rgb, palette.glow, glowSq * 0.75);
      rgb = mixColor(rgb, palette.accent, glowSq * 0.55);
      rgb = mixColor(rgb, palette.white, glowSq * 0.35);
    }

    if (!reducedMotion) {
      const wave =
        Math.sin(time * 0.00045 + x * 0.012 + y * 0.01) * 0.04 +
        Math.cos(time * 0.00035 + x * 0.008 - y * 0.011) * 0.03;
      rgb = mixColor(rgb, palette.white, Math.max(0, wave));
    }

    return rgb;
  }

  function buildPoints() {
    cols = Math.ceil(width / cell) + 2;
    rows = Math.ceil(height / cell) + 2;
    points = [];

    for (let row = 0; row < rows; row += 1) {
      const rowPoints = [];
      for (let col = 0; col < cols; col += 1) {
        const jitterX = Math.sin(col * 1.73 + row * 0.91) * 14;
        const jitterY = Math.cos(row * 1.31 + col * 1.17) * 14;
        rowPoints.push({
          x: col * cell - cell * 0.5 + jitterX,
          y: row * cell - cell * 0.5 + jitterY,
        });
      }
      points.push(rowPoints);
    }
  }

  function paintBase() {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fff7fa");
    gradient.addColorStop(1, "#ececec");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawTriangle(a, b, c, time) {
    const ca = vertexColor(a.x, a.y, time);
    const cb = vertexColor(b.x, b.y, time);
    const cc = vertexColor(c.x, c.y, time);
    const center = {
      x: (a.x + b.x + c.x) / 3,
      y: (a.y + b.y + c.y) / 3,
    };
    const centerColor = vertexColor(center.x, center.y, time);

    const grad = ctx.createLinearGradient(a.x, a.y, c.x, c.y);
    grad.addColorStop(0, colorString(ca, 0.92));
    grad.addColorStop(0.5, colorString(centerColor, 0.88));
    grad.addColorStop(1, colorString(cc, 0.92));

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    const edgeGlow = mouse.active
      ? Math.max(
          0,
          1 -
            Math.hypot(mouse.x - center.x, mouse.y - center.y) / 460
        )
      : 0.08;

    ctx.strokeStyle = colorString(
      mixColor(palette.accent, palette.white, edgeGlow * 0.6),
      0.08 + edgeGlow * 0.22
    );
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawMesh(time) {
    paintBase();

    for (let row = 0; row < rows - 1; row += 1) {
      for (let col = 0; col < cols - 1; col += 1) {
        const tl = points[row][col];
        const tr = points[row][col + 1];
        const bl = points[row + 1][col];
        const br = points[row + 1][col + 1];

        drawTriangle(tl, tr, bl, time);
        drawTriangle(tr, br, bl, time);
      }
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPoints();
    drawMesh(performance.now());
  }

  function frame(time) {
    drawMesh(time);
    if (!reducedMotion) {
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    },
    { passive: true }
  );
  window.addEventListener(
    "pointerleave",
    () => {
      mouse.active = false;
    },
    { passive: true }
  );

  resize();
  if (reducedMotion) {
    return;
  }
  requestAnimationFrame(frame);
})();
