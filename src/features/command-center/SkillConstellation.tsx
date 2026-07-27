import { ArrowUpRight, Orbit, RotateCcw } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type { BufferGeometry, Material, Mesh, WebGLRenderer } from "three";
import { Link, useNavigate } from "../../router";
import type { SkillSignal } from "../progress/progressSelectors";

interface SkillConstellationProps {
  signals: SkillSignal[];
  reducedMotion: boolean;
  minimal: boolean;
}

const accentColors: Record<SkillSignal["accent"], number> = {
  lime: 0xb7f36b,
  amber: 0xefc86b,
  cyan: 0x69d6cf,
  violet: 0xa68cf3,
  coral: 0xed8d70,
};

function webGlAvailable(): boolean {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof window.WebGLRenderingContext === "undefined"
  ) {
    return false;
  }

  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

export function SkillConstellation({
  signals,
  reducedMotion,
  minimal,
}: SkillConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedTrackRef = useRef(signals[0]?.trackId ?? "");
  const renderStaticRef = useRef<(() => void) | null>(null);
  const [selectedTrack, setSelectedTrack] = useState(signals[0]?.trackId ?? "");
  const [renderState, setRenderState] = useState<"loading" | "ready" | "fallback">(
    minimal ? "fallback" : "loading",
  );
  const [resetToken, setResetToken] = useState(0);
  const navigate = useNavigate();

  const activeTrack = signals.some((signal) => signal.trackId === selectedTrack)
    ? selectedTrack
    : (signals[0]?.trackId ?? "");
  const selectedSignal = useMemo(
    () => signals.find((signal) => signal.trackId === activeTrack) ?? signals[0],
    [activeTrack, signals],
  );

  useEffect(() => {
    selectedTrackRef.current = activeTrack;
    renderStaticRef.current?.();
  }, [activeTrack]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || minimal || !webGlAvailable()) {
      renderStaticRef.current = null;
      setRenderState("fallback");
      return;
    }

    let disposed = false;
    let renderer: WebGLRenderer | null = null;
    let animationFrame = 0;
    let cleanupScene = () => undefined;
    setRenderState("loading");

    void import("three")
      .then((three) => {
        if (disposed) return;

        const geometries = new Set<BufferGeometry>();
        const materials = new Set<Material>();
        const scene = new three.Scene();
        const camera = new three.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.3, 8.4);
        const root = new three.Group();
        scene.add(root);

        renderer = new three.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.outputColorSpace = three.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        const coreGeometry = new three.IcosahedronGeometry(1.28, 2);
        const coreMaterial = new three.MeshBasicMaterial({
          color: 0xb7f36b,
          wireframe: true,
          transparent: true,
          opacity: 0.42,
        });
        geometries.add(coreGeometry);
        materials.add(coreMaterial);
        const core = new three.Mesh(coreGeometry, coreMaterial);
        core.name = "archive-core";
        root.add(core);

        const innerCoreGeometry = new three.IcosahedronGeometry(0.58, 1);
        const innerCoreMaterial = new three.MeshBasicMaterial({
          color: 0x69d6cf,
          transparent: true,
          opacity: 0.38,
        });
        geometries.add(innerCoreGeometry);
        materials.add(innerCoreMaterial);
        const innerCore = new three.Mesh(innerCoreGeometry, innerCoreMaterial);
        root.add(innerCore);

        const orbitGeometry = new three.TorusGeometry(2.55, 0.012, 8, 160);
        const orbitMaterial = new three.MeshBasicMaterial({
          color: 0x6d9e3f,
          transparent: true,
          opacity: 0.42,
        });
        geometries.add(orbitGeometry);
        materials.add(orbitMaterial);
        const orbit = new three.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2.7;
        root.add(orbit);

        const nodes: Mesh[] = [];
        signals.forEach((signal, index) => {
          const angle = (index / Math.max(signals.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const radius = 2.65 + (index % 2) * 0.34;
          const position = new three.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.66,
            Math.sin(angle * 1.7) * 0.65,
          );
          const scale = 0.22 + signal.percent * 0.0022;
          const nodeGeometry = new three.SphereGeometry(scale, 24, 24);
          const nodeMaterial = new three.MeshBasicMaterial({
            color: accentColors[signal.accent],
            transparent: true,
            opacity: signal.percent > 0 ? 0.98 : 0.48,
          });
          geometries.add(nodeGeometry);
          materials.add(nodeMaterial);
          const node = new three.Mesh(nodeGeometry, nodeMaterial);
          node.position.copy(position);
          node.userData = { trackId: signal.trackId };
          nodes.push(node);
          root.add(node);

          const pathGeometry = new three.BufferGeometry().setFromPoints([
            new three.Vector3(),
            position,
          ]);
          const pathMaterial = new three.LineBasicMaterial({
            color: accentColors[signal.accent],
            transparent: true,
            opacity: 0.18 + signal.percent * 0.003,
          });
          geometries.add(pathGeometry);
          materials.add(pathMaterial);
          root.add(new three.Line(pathGeometry, pathMaterial));

          const haloGeometry = new three.RingGeometry(scale * 1.5, scale * 1.62, 32);
          const haloMaterial = new three.MeshBasicMaterial({
            color: accentColors[signal.accent],
            transparent: true,
            opacity: 0.34,
            side: three.DoubleSide,
          });
          geometries.add(haloGeometry);
          materials.add(haloMaterial);
          const halo = new three.Mesh(haloGeometry, haloMaterial);
          halo.position.copy(position);
          halo.lookAt(camera.position);
          root.add(halo);
        });

        const starGeometry = new three.BufferGeometry();
        const starPositions = new Float32Array(180 * 3);
        for (let index = 0; index < 180; index += 1) {
          const offset = index * 3;
          const theta = index * 2.399963229728653;
          const radius = 3.5 + ((index * 31) % 100) / 28;
          starPositions[offset] = Math.cos(theta) * radius;
          starPositions[offset + 1] = Math.sin(theta) * radius * 0.7;
          starPositions[offset + 2] = ((index * 17) % 100) / 25 - 2;
        }
        starGeometry.setAttribute(
          "position",
          new three.BufferAttribute(starPositions, 3),
        );
        const starMaterial = new three.PointsMaterial({
          color: 0xcad7cc,
          size: 0.025,
          transparent: true,
          opacity: 0.34,
        });
        geometries.add(starGeometry);
        materials.add(starMaterial);
        const stars = new three.Points(starGeometry, starMaterial);
        root.add(stars);

        const pointer = new three.Vector2(3, 3);
        const raycaster = new three.Raycaster();
        let hovered: Mesh | null = null;
        let visible = true;
        let dragging = false;
        let dragDistance = 0;
        let lastX = 0;
        let lastY = 0;
        let rotationX = 0;
        let rotationY = 0;

        const resize = () => {
          if (!renderer) return;
          const rect = canvas.getBoundingClientRect();
          const width = Math.max(1, Math.round(rect.width));
          const height = Math.max(1, Math.round(rect.height));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };

        const updatePointer = (clientX: number, clientY: number) => {
          const rect = canvas.getBoundingClientRect();
          pointer.x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
          pointer.y = -(((clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
        };

        const updateNodeScales = (immediate: boolean) => {
          nodes.forEach((node) => {
            const isSelected = node.userData["trackId"] === selectedTrackRef.current;
            const target = isSelected ? 1.32 : node === hovered ? 1.35 : 1;
            if (immediate) {
              node.scale.setScalar(target);
              return;
            }
            const next = node.scale.x + (target - node.scale.x) * 0.1;
            node.scale.setScalar(next);
          });
        };

        const renderOnce = () => {
          if (disposed || !renderer) return;
          updateNodeScales(true);
          renderer.render(scene, camera);
        };
        renderStaticRef.current = renderOnce;

        const selectFromPointer = () => {
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(nodes, false)[0]?.object;
          const next = hit instanceof three.Mesh ? hit : null;
          if (next === hovered) return;
          hovered = next;
          canvas.style.cursor = hovered ? "pointer" : dragging ? "grabbing" : "grab";
          if (reducedMotion) renderOnce();
        };

        const pointerMove = (event: PointerEvent) => {
          updatePointer(event.clientX, event.clientY);
          if (dragging) {
            const deltaX = event.clientX - lastX;
            const deltaY = event.clientY - lastY;
            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            rotationY += deltaX * 0.006;
            rotationX += deltaY * 0.004;
            lastX = event.clientX;
            lastY = event.clientY;
            if (reducedMotion) {
              root.rotation.x = rotationX;
              root.rotation.y = rotationY;
            }
          }
          selectFromPointer();
          if (reducedMotion) renderOnce();
        };

        const pointerDown = (event: PointerEvent) => {
          dragging = true;
          dragDistance = 0;
          lastX = event.clientX;
          lastY = event.clientY;
          updatePointer(event.clientX, event.clientY);
          selectFromPointer();
          canvas.setPointerCapture?.(event.pointerId);
          canvas.style.cursor = "grabbing";
        };

        const pointerUp = (event: PointerEvent) => {
          dragging = false;
          canvas.releasePointerCapture?.(event.pointerId);
          canvas.style.cursor = hovered ? "pointer" : "grab";
        };

        const pointerLeave = () => {
          if (dragging) return;
          hovered = null;
          canvas.style.cursor = "grab";
          if (reducedMotion) renderOnce();
        };

        const activateNode = (event: MouseEvent) => {
          if (dragDistance > 8) return;
          updatePointer(event.clientX, event.clientY);
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(nodes, false)[0]?.object;
          const trackId = hit?.userData["trackId"] as string | undefined;
          if (!trackId) return;
          setSelectedTrack(trackId);
          navigate(`/tracks/${trackId}`);
        };

        const loseContext = (event: Event) => {
          event.preventDefault();
          visible = false;
          window.cancelAnimationFrame(animationFrame);
          setRenderState("fallback");
        };

        const restoreContext = () => {
          if (!disposed) setResetToken((value) => value + 1);
        };

        const resizeObserver =
          typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
        resizeObserver?.observe(canvas);
        if (!resizeObserver) window.addEventListener("resize", resize);

        const intersectionObserver =
          typeof IntersectionObserver === "undefined"
            ? null
            : new IntersectionObserver(
                ([entry]) => {
                  visible = entry?.isIntersecting ?? true;
                },
                { rootMargin: "120px" },
              );
        intersectionObserver?.observe(canvas);

        canvas.addEventListener("pointermove", pointerMove);
        canvas.addEventListener("pointerdown", pointerDown);
        canvas.addEventListener("pointerup", pointerUp);
        canvas.addEventListener("pointercancel", pointerUp);
        canvas.addEventListener("pointerleave", pointerLeave);
        canvas.addEventListener("click", activateNode);
        canvas.addEventListener("webglcontextlost", loseContext);
        canvas.addEventListener("webglcontextrestored", restoreContext);

        const clock = new three.Clock();
        const renderFrame = () => {
          if (disposed || !renderer) return;
          animationFrame = window.requestAnimationFrame(renderFrame);
          if (!visible) return;
          const elapsed = clock.getElapsedTime();
          root.rotation.x += (rotationX - root.rotation.x) * 0.08;
          root.rotation.y += (rotationY + elapsed * 0.055 - root.rotation.y) * 0.06;
          core.rotation.x = elapsed * 0.11;
          core.rotation.y = elapsed * 0.15;
          innerCore.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.07);
          stars.rotation.z = elapsed * 0.006;
          updateNodeScales(false);
          renderer.render(scene, camera);
        };

        resize();
        setRenderState("ready");
        if (reducedMotion) renderOnce();
        else renderFrame();

        cleanupScene = () => {
          window.cancelAnimationFrame(animationFrame);
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          if (!resizeObserver) window.removeEventListener("resize", resize);
          canvas.removeEventListener("pointermove", pointerMove);
          canvas.removeEventListener("pointerdown", pointerDown);
          canvas.removeEventListener("pointerup", pointerUp);
          canvas.removeEventListener("pointercancel", pointerUp);
          canvas.removeEventListener("pointerleave", pointerLeave);
          canvas.removeEventListener("click", activateNode);
          canvas.removeEventListener("webglcontextlost", loseContext);
          canvas.removeEventListener("webglcontextrestored", restoreContext);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer?.dispose();
          renderer = null;
          renderStaticRef.current = null;
        };
      })
      .catch(() => {
        if (!disposed) setRenderState("fallback");
      });

    return () => {
      disposed = true;
      cleanupScene();
      renderStaticRef.current = null;
    };
  }, [minimal, navigate, reducedMotion, resetToken, signals]);

  return (
    <section className="skill-constellation" aria-labelledby="skill-constellation-title">
      <header>
        <div>
          <span className="eyebrow">Spatial mastery model</span>
          <h2 id="skill-constellation-title">Skill constellation</h2>
        </div>
        <button
          className="constellation-reset"
          type="button"
          onClick={() => setResetToken((value) => value + 1)}
          disabled={minimal}
        >
          <RotateCcw aria-hidden="true" /> Reset orbit
        </button>
      </header>
      <div className="constellation-stage">
        <canvas
          ref={canvasRef}
          className="constellation-canvas"
          aria-label="Interactive 3D model of language-track progress. Drag to rotate and select a node to open its expedition."
          hidden={renderState === "fallback"}
        />
        {renderState === "loading" && (
          <div className="constellation-loading" role="status">
            <Orbit aria-hidden="true" /> Calibrating spatial archive…
          </div>
        )}
        {renderState === "fallback" && (
          <div className="constellation-fallback" role="img" aria-label="Skill network">
            <div className="constellation-fallback-core">
              <span>NX</span>
            </div>
            {signals.map((signal, index) => (
              <span
                key={signal.id}
                className={`constellation-fallback-node constellation-fallback-node-${index + 1}`}
                style={
                  {
                    "--signal-strength": `${Math.max(0.3, signal.percent / 100)}`,
                  } as CSSProperties
                }
              >
                {signal.label.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </div>
        )}
        <aside className="constellation-readout" aria-live="polite">
          <span>{selectedSignal?.label ?? "Archive"}</span>
          <strong>{selectedSignal?.percent ?? 0}% synchronized</strong>
          <p>{selectedSignal?.detail ?? "No active signal."}</p>
        </aside>
      </div>
      <div className="constellation-track-list" aria-label="Language mastery controls">
        {signals.map((signal) => (
          <button
            type="button"
            key={signal.id}
            className={signal.trackId === activeTrack ? "is-selected" : undefined}
            onClick={() => setSelectedTrack(signal.trackId)}
            onDoubleClick={() => navigate(`/tracks/${signal.trackId}`)}
          >
            <span>{signal.label}</span>
            <strong>{signal.percent}%</strong>
            <small>{signal.detail}</small>
            <i style={{ width: `${signal.percent}%` }} />
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="constellation-actions">
        <p className="constellation-instruction">
          Drag the spatial model to inspect the archive. Select a language card to focus
          its node, or activate a 3D node to enter the expedition.
        </p>
        {selectedSignal && (
          <Link className="text-link" to={`/tracks/${selectedSignal.trackId}`}>
            Open {selectedSignal.label} expedition <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
