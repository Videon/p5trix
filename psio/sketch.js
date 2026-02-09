// Seamless triangle grid rendered as an infinite tiled pattern.
// Triangles are opaque; background is black; scrolling never clips triangle geometry.
let elapsedTime = 0;

let tile;

// ---- Grid parameters (layout density) ----
let triBaseSize = 32;     // Base size that defines cell spacing.
let triGapX = 10;         // Horizontal gap between cells.
let triGapY = 12;         // Vertical gap between rows.
let rowOffset = 0.0;      // 0..1: odd-row horizontal shift (brick pattern).

// ---- Triangle geometry parameters (shape-only scaling) ----
let triScale = 1.0;       // Scales triangles only; does not scale the rendered background.
let deform = 0.0;         // -1..1: deterministic shear.

// ---- Scroll offset (moves the triangles) ----
let scrollX = 0;
let scrollY = 0;

function setup() {
  createCanvas(900, 520);
  rebuildTile();
}

function draw() {
  elapsedTime += deltaTime;


  // Scroll offsets wrap in tile space for infinite motion with constant cost.
  const ox = modPositive(scrollX, tile.width);
  const oy = modPositive(scrollY, tile.height);

  // Draw enough tiles to cover the canvas regardless of offset.
  // Starting at -tile.width/-tile.height ensures coverage when ox/oy are near tile edges.
  for (let y = -tile.height; y < height + tile.height; y += tile.height) {
    for (let x = -tile.width; x < width + tile.width; x += tile.width) {
      image(tile, x - ox, y - oy);
    }
  }

  // Optional HUD for quick tuning (remove if not needed).
  fill(255);
  textSize(12);
  text(
      `triBaseSize=${triBaseSize} triScale=${triScale.toFixed(2)} deform=${deform.toFixed(2)} rowOffset=${rowOffset.toFixed(2)}\n` +
      `Arrows: scroll  Z/X: triScale  [/] base  ;/L: deform  O/P: rowOffset  R: rebuild`,
      12, 18
  );
}

function rebuildTile() {
  // Tile size chosen as an integer multiple of cell size to avoid drift and ensure repeatability.
  const cellW = triBaseSize + triGapX;
  const cellH = triBaseSize + triGapY;

  // Large tile reduces visible repetition while staying manageable in memory.
  const target = 1024;
  const tileW = max(cellW * 4, ceil(target / cellW) * cellW);
  const tileH = max(cellH * 4, ceil(target / cellH) * cellH);

  tile = createGraphics(tileW, tileH);
  tile.background(0);
  tile.noStroke();
  tile.fill(255); // Fully opaque triangles.

  // Margin approximates max vertex reach; used to decide when to wrap-draw across edges.
  const triSize = triBaseSize * triScale;
  const margin = triSize * 1.1 + abs(deform) * triSize * 0.5;

  // Row-major grid: "arranged in rows" means y steps define structure.
  let row = 0;
  for (let y = 0; y < tileH; y += cellH, row++) {
    const xOffset = (row % 2 === 1) ? rowOffset * cellW : 0;

    let col = 0;
    for (let x = xOffset; x < tileW; x += cellW, col++) {
      const pointUp = ((row + col) % 2 === 0);

      // Draw with wrap copies so triangles crossing tile borders are fully represented.
      drawWrappedTriangle(tile, x, y, triSize, deform, pointUp, margin, tileW, tileH);
    }
  }
}

function drawWrappedTriangle(g, x, y, size, deformAmt, pointUp, margin, tileW, tileH) {
  // Always draw the primary instance.
  drawDeformedTriangle(g, x, y, size, deformAmt, pointUp);

  // If the triangle can extend beyond an edge, draw a counterpart on the opposite side.
  const wrapXLeft  = (x < margin);
  const wrapXRight = (x > tileW - margin);
  const wrapYTop   = (y < margin);
  const wrapYBot   = (y > tileH - margin);

  // Horizontal wraps
  if (wrapXLeft)  drawDeformedTriangle(g, x + tileW, y, size, deformAmt, pointUp);
  if (wrapXRight) drawDeformedTriangle(g, x - tileW, y, size, deformAmt, pointUp);

  // Vertical wraps
  if (wrapYTop)   drawDeformedTriangle(g, x, y + tileH, size, deformAmt, pointUp);
  if (wrapYBot)   drawDeformedTriangle(g, x, y - tileH, size, deformAmt, pointUp);

  // Corner wraps (only when both axes can overflow)
  if (wrapXLeft && wrapYTop)   drawDeformedTriangle(g, x + tileW, y + tileH, size, deformAmt, pointUp);
  if (wrapXLeft && wrapYBot)   drawDeformedTriangle(g, x + tileW, y - tileH, size, deformAmt, pointUp);
  if (wrapXRight && wrapYTop)  drawDeformedTriangle(g, x - tileW, y + tileH, size, deformAmt, pointUp);
  if (wrapXRight && wrapYBot)  drawDeformedTriangle(g, x - tileW, y - tileH, size, deformAmt, pointUp);
}

function drawDeformedTriangle(g, cx, cy, size, deformAmt, pointUp) {
  // Bounded shear keeps triangles predictable and prevents self-intersection from extreme values.
  const shear = constrain(deformAmt, -1, 1) * size * 0.35;

  // Centered local triangle simplifies layout; (cx, cy) is the triangle center.
  const halfBase = size * 0.55;
  const h = size * 0.70;

  let ax, ay, bx, by, cx2, cy2;
  if (pointUp) {
    ax = 0 + shear;          ay = -h;
    bx = +halfBase - shear;  by = +h * 0.6;
    cx2 = -halfBase - shear; cy2 = +h * 0.6;
  } else {
    ax = 0 + shear;          ay = +h;
    bx = +halfBase - shear;  by = -h * 0.6;
    cx2 = -halfBase - shear; cy2 = -h * 0.6;
  }

  g.beginShape();
  g.vertex(cx + ax,  cy + ay);
  g.vertex(cx + bx,  cy + by);
  g.vertex(cx + cx2, cy + cy2);
  g.endShape(CLOSE);
}

function keyPressed() {
  // Tile rebuild is required whenever geometry/layout changes (tile content is baked).
  if (key === 'R') rebuildTile();

  // Base size affects grid density.
  if (key === '/') { triBaseSize = min(200, triBaseSize + 2); rebuildTile(); }
  if (key === '.') { triBaseSize = max(6, triBaseSize - 2);   rebuildTile(); }

  // Triangle-only scaling.
  if (key === 'Z') { triScale = max(0.25, triScale * 0.95); rebuildTile(); }
  if (key === 'X') { triScale = min(4.00, triScale * 1.05); rebuildTile(); }

  // Deformation.
  if (key === ';') { deform = min(1.0, deform + 0.05); rebuildTile(); }
  if (key === 'L') { deform = max(-1.0, deform - 0.05); rebuildTile(); }

  // Row offset.
  if (key === 'O') { rowOffset = max(0.0, rowOffset - 0.05); rebuildTile(); }
  if (key === 'P') { rowOffset = min(1.0, rowOffset + 0.05); rebuildTile(); }

  // Scrolling moves the pattern; using pixels keeps it intuitive.
  const step = 20;
  if (keyCode === LEFT_ARROW)  scrollX -= step;
  if (keyCode === RIGHT_ARROW) scrollX += step;
  if (keyCode === UP_ARROW)    scrollY -= step;
  if (keyCode === DOWN_ARROW)  scrollY += step;
}

function modPositive(n, m) {
  // Positive modulo keeps scroll wrapping stable for negative offsets.
  return ((n % m) + m) % m;
}
