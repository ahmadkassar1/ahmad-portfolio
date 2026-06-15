import * as THREE from "three";
import { mulberry32 } from "@/lib/prng";

/**
 * Procedural CanvasTextures. The CSP pins font-src/connect-src to 'self',
 * so nothing in the world may fetch a font or image at runtime — every
 * label and screen is painted here onto a canvas with system font stacks.
 * Callers own disposal.
 */

const MONO_STACK =
  '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Small uppercase mono label plate (station names, HUD echoes). */
export function makeLabelTexture(opts: {
  text: string;
  sub?: string;
  color?: string;
  background?: string;
}): THREE.CanvasTexture {
  const { text, sub, color = "#f2f0ea", background = "rgba(11,13,18,0.92)" } = opts;
  const { canvas, ctx } = makeCanvas(512, 160);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 512, 160);
  ctx.strokeStyle = "rgba(115,150,255,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 510, 158);

  ctx.fillStyle = color;
  ctx.font = `600 44px ${MONO_STACK}`;
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 28, sub ? 60 : 80);

  if (sub) {
    ctx.fillStyle = "rgba(168,165,154,0.9)";
    ctx.font = `400 26px ${MONO_STACK}`;
    ctx.fillText(sub.toUpperCase(), 28, 114);
  }

  return toTexture(canvas);
}

/** Terminal-style screen with scan lines and seeded "activity" rows. */
export function makeScreenTexture(opts: {
  seed: number;
  accent: string;
  rows?: number;
}): THREE.CanvasTexture {
  const { seed, accent, rows = 9 } = opts;
  const rand = mulberry32(seed);
  const { canvas, ctx } = makeCanvas(512, 320);

  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0, 0, 512, 320);

  // Activity rows: bars of varying width, a few in the accent tone.
  for (let i = 0; i < rows; i++) {
    const y = 28 + i * 30;
    const w = 80 + rand() * 360;
    ctx.fillStyle = rand() > 0.72 ? accent : "rgba(168,165,154,0.28)";
    ctx.fillRect(28, y, w, 10);
  }

  // Scan lines — cheap CRT read.
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  for (let y = 0; y < 320; y += 4) ctx.fillRect(0, y, 512, 2);

  return toTexture(canvas);
}

/** QR-ish plate for the menu station — decorative, deliberately unscannable. */
export function makeQrTexture(seed: number, accent: string): THREE.CanvasTexture {
  const rand = mulberry32(seed);
  const { canvas, ctx } = makeCanvas(256, 256);

  ctx.fillStyle = "#f2f0ea";
  ctx.fillRect(0, 0, 256, 256);

  const cell = 16;
  ctx.fillStyle = "#0b0d12";
  for (let y = 1; y < 15; y++) {
    for (let x = 1; x < 15; x++) {
      if (rand() > 0.55) ctx.fillRect(x * cell, y * cell, cell - 2, cell - 2);
    }
  }
  // Finder squares so it reads as "QR" at a glance.
  for (const [fx, fy] of [
    [1, 1],
    [11, 1],
    [1, 11],
  ] as const) {
    ctx.fillStyle = "#0b0d12";
    ctx.fillRect(fx * cell, fy * cell, cell * 4, cell * 4);
    ctx.fillStyle = "#f2f0ea";
    ctx.fillRect((fx + 1) * cell, (fy + 1) * cell, cell * 2, cell * 2);
    ctx.fillStyle = accent;
    ctx.fillRect((fx + 1.5) * cell, (fy + 1.5) * cell, cell, cell);
  }

  return toTexture(canvas);
}

/**
 * Stylized, recognizable tech mark for a constellation medallion. Drawn
 * procedurally — the CSP forbids fetching an SVG/PNG logo — as a simplified
 * symbol or wordmark in the tech's brand hue on a transparent ground. These
 * are on-brand stylizations, not pixel-exact trademarks.
 */
export function makeTechMark(opts: {
  id: string;
  name: string;
  color: string;
}): THREE.CanvasTexture {
  const { id, color, name } = opts;
  const S = 256;
  const { canvas, ctx } = makeCanvas(S, S);
  const ink = "#f2f0ea";
  const cx = S / 2;
  const cy = S / 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const word = (t: string, size: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.font = `700 ${size}px ${MONO_STACK}`;
    ctx.fillText(t, cx, cy + 2);
  };

  switch (id) {
    case "react": // nucleus + three electron rings
      ctx.strokeStyle = color;
      ctx.lineWidth = 9;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 96, 37, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "nextjs": // ringed bold N
      ctx.strokeStyle = ink;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 17;
      ctx.beginPath();
      ctx.moveTo(cx - 34, cy + 46);
      ctx.lineTo(cx - 34, cy - 46);
      ctx.lineTo(cx + 34, cy + 52);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 34, cy - 46);
      ctx.lineTo(cx + 34, cy + 4);
      ctx.stroke();
      break;

    case "typescript": // brand chip + TS
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(cx - 92, cy - 92, 184, 184, 28);
      ctx.fill();
      word("TS", 104, "#0b0d12");
      break;

    case "cpp": { // C with two plus signs
      ctx.strokeStyle = color;
      ctx.lineWidth = 17;
      ctx.beginPath();
      ctx.arc(cx - 18, cy, 62, Math.PI * 0.34, Math.PI * 1.66);
      ctx.stroke();
      ctx.lineWidth = 11;
      const plus = (px: number) => {
        ctx.beginPath();
        ctx.moveTo(px - 17, cy);
        ctx.lineTo(px + 17, cy);
        ctx.moveTo(px, cy - 17);
        ctx.lineTo(px, cy + 17);
        ctx.stroke();
      };
      plus(cx + 40);
      plus(cx + 84);
      break;
    }

    case "angular": // shield + A
      ctx.strokeStyle = color;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 94);
      ctx.lineTo(cx + 80, cy - 62);
      ctx.lineTo(cx + 58, cy + 80);
      ctx.lineTo(cx, cy + 98);
      ctx.lineTo(cx - 58, cy + 80);
      ctx.lineTo(cx - 80, cy - 62);
      ctx.closePath();
      ctx.stroke();
      word("A", 90, ink);
      break;

    case "tailwind": { // twin swooshes
      ctx.strokeStyle = color;
      ctx.lineWidth = 27;
      const swoosh = (oy: number) => {
        ctx.beginPath();
        ctx.moveTo(cx - 92, cy + oy + 16);
        ctx.bezierCurveTo(cx - 60, cy + oy - 24, cx - 30, cy + oy - 24, cx - 4, cy + oy + 8);
        ctx.bezierCurveTo(cx + 16, cy + oy + 26, cx + 42, cy + oy + 26, cx + 66, cy + oy - 2);
        ctx.stroke();
      };
      swoosh(-26);
      swoosh(30);
      break;
    }

    case "supabase": // two offset triangles (bolt)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 98);
      ctx.lineTo(cx, cy + 6);
      ctx.lineTo(cx + 72, cy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 98);
      ctx.lineTo(cx, cy - 6);
      ctx.lineTo(cx - 72, cy - 6);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      break;

    case "rxjs": // ringed Rx
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 88, 0, Math.PI * 2);
      ctx.stroke();
      word("Rx", 86, ink);
      break;

    case "sql": { // database cylinder
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      const rx = 68;
      const ry = 22;
      const top = cy - 54;
      const bot = cy + 54;
      ctx.beginPath();
      ctx.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - rx, top);
      ctx.lineTo(cx - rx, bot);
      ctx.ellipse(cx, bot, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(cx + rx, top);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
      break;
    }

    case "git": { // commit graph
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy - 72);
      ctx.lineTo(cx - 38, cy + 72);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy + 8);
      ctx.bezierCurveTo(cx - 38, cy - 32, cx + 42, cy - 18, cx + 42, cy - 58);
      ctx.stroke();
      const node = (nx: number, ny: number) => {
        ctx.beginPath();
        ctx.arc(nx, ny, 18, 0, Math.PI * 2);
        ctx.fill();
      };
      node(cx - 38, cy - 72);
      node(cx - 38, cy + 72);
      node(cx + 42, cy - 72);
      break;
    }

    default:
      word(name.slice(0, 2).toUpperCase(), 92, color);
  }

  return toTexture(canvas);
}

/** Radial-faded grid for the deck floor. */
export function makeFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const { canvas, ctx } = makeCanvas(size, size);

  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(77,124,255,0.16)";
  ctx.lineWidth = 1;
  const step = size / 24;
  for (let i = 0; i <= 24; i++) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step);
    ctx.lineTo(size, i * step);
    ctx.stroke();
  }

  // Fade the grid toward the rim so the floor dissolves into fog.
  const fade = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.18,
    size / 2,
    size / 2,
    size * 0.52,
  );
  fade.addColorStop(0, "rgba(11,13,18,0)");
  fade.addColorStop(1, "rgba(11,13,18,1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, size, size);

  return toTexture(canvas);
}
