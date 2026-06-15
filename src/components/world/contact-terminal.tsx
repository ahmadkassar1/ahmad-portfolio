"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useCursor, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { contactArea } from "@/data/areas";
import { makeLabelTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { moods, worldPalette } from "@/lib/moods";

const MONO_STACK =
  '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

/** Terminal screen painted once — the cursor blink is a separate tiny
 *  mesh so the texture never has to repaint. */
function makeTerminalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");

  ctx.fillStyle = "#0b0d12";
  ctx.fillRect(0, 0, 512, 384);
  ctx.fillStyle = "rgba(111,174,138,0.9)";
  ctx.font = `400 30px ${MONO_STACK}`;
  ctx.fillText("$ contact --ahmad", 32, 64);
  ctx.fillStyle = "rgba(168,165,154,0.85)";
  ctx.fillText("> products, interfaces,", 32, 128);
  ctx.fillText("  and systems", 32, 168);
  ctx.fillStyle = "rgba(115,150,255,0.9)";
  ctx.fillText("> say hello", 32, 248);
  // Scan lines.
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  for (let y = 0; y < 384; y += 4) ctx.fillRect(0, y, 512, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * The Contact terminal — a standing console kiosk on the deck's right
 * wing with a terminal screen and a blinking cursor. Clicking it flies
 * the camera in and opens the contact panel.
 */
export function ContactTerminal() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const focusOn = useExperience((s) => s.focusOn);
  const setHoveredTarget = useExperience((s) => s.setHovered);
  const isFocused = useExperience((s) => s.focusTarget?.kind === "contact");

  const screenTexture = useMemo(() => makeTerminalTexture(), []);
  const labelTexture = useMemo(
    () => makeLabelTexture({ text: "Contact", sub: "Open a channel" }),
    [],
  );
  useEffect(
    () => () => {
      screenTexture.dispose();
      labelTexture.dispose();
    },
    [screenTexture, labelTexture],
  );

  const trimRef = useRef<THREE.MeshStandardMaterial>(null);
  const cursorRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const trim = trimRef.current;
    if (trim)
      trim.emissiveIntensity = THREE.MathUtils.damp(
        trim.emissiveIntensity,
        isFocused ? 2.0 : hovered ? 1.4 : 0.6,
        8,
        delta,
      );
    // Cursor blink — skipped (held visible) when ambient motion stills.
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.visible = useExperience.getState().ambientStill
        ? true
        : Math.floor(state.clock.elapsedTime * 1.6) % 2 === 0;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredTarget({ kind: "contact", id: "contact" });
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredTarget(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    focusOn({ kind: "contact", id: "contact" });
  };

  return (
    <group position={contactArea.position} rotation={[0, contactArea.rotation, 0]}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {/* Contiguous click/hover proxy over the whole kiosk — the base and
            angled head are separate meshes, so one invisible collider makes
            the whole console a single reliable target. visible={false} keeps
            it out of every render pass (no contact shadow), but three's
            Raycaster ignores .visible, so it still catches the click. */}
        <mesh position={[0, 1.0, 0.05]} visible={false}>
          <boxGeometry args={[1.2, 2.3, 1.0]} />
          <meshBasicMaterial />
        </mesh>

        {/* Kiosk base and angled console head. */}
        <RoundedBox args={[0.9, 1.1, 0.45]} radius={0.05} position={[0, 0.55, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={worldPalette.panel} roughness={0.7} metalness={0.35} />
        </RoundedBox>
        <group position={[0, 1.35, 0.05]} rotation={[-0.35, 0, 0]}>
          <RoundedBox args={[1.05, 0.78, 0.08]} radius={0.03} castShadow>
            <meshStandardMaterial color="#0f1117" roughness={0.6} metalness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[0.94, 0.68]} />
            <meshBasicMaterial map={screenTexture} />
          </mesh>
          {/* Blinking cursor block, aligned to the "say hello" line. */}
          <mesh ref={cursorRef} position={[0.04, -0.1, 0.05]}>
            <planeGeometry args={[0.05, 0.06]} />
            <meshBasicMaterial color={moods.sage.bright} />
          </mesh>
        </group>

        {/* Mood trim around the kiosk waist. */}
        <mesh position={[0, 1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.02, 8, 40]} />
          <meshStandardMaterial
            ref={trimRef}
            color={moods.sage.color}
            emissive={moods.sage.color}
            emissiveIntensity={0.6}
            roughness={0.35}
          />
        </mesh>
      </group>

      <pointLight position={[0, 2.2, 0.6]} intensity={1.8} distance={4} decay={2} color={moods.sage.color} />

      {/* Floating label, revealed on hover. */}
      <mesh position={[0, 2.3, 0]} visible={hovered || isFocused}>
        <planeGeometry args={[1.4, 0.44]} />
        <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
