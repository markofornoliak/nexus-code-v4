import { useEffect, useMemo, useRef, useState } from "react";
import type {
  BufferGeometry,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
  WebGLRenderer,
} from "three";
import type { UserPreferences } from "../../types";
import { buildSceneModel, type SceneKind } from "./sceneModel";

type SceneStatus = "loading" | "ready" | "fallback";

interface NexusSceneProps {
  kind: SceneKind;
  step?: number;
  labels?: string[];
  visualMode: UserPreferences["visualMode"];
  reducedMotion?: boolean;
  className?: string;
  ariaLabel: string;
  onNodeSelect?: (nodeId: string) => void;
}

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
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

function deterministicNoise(index: number, channel: number): number {
  const raw = Math.sin((index + 1) * 12.9898 + channel * 78.233) * 43_758.5453;
  return raw - Math.floor(raw);
}

function stateColor(state: "idle" | "active" | "complete"): number {
  if (state === "active") return 0xb7f36b;
  if (state === "complete") return 0x69d6cf;
  return 0x36574d;
}

export function NexusScene({
  kind,
  step = 0,
  labels = [],
  visualMode,
  reducedMotion = false,
  className = "",
  ariaLabel,
  onNodeSelect,
}: NexusSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onNodeSelectRef = useRef(onNodeSelect);
  onNodeSelectRef.current = onNodeSelect;
  const labelKey = labels.join("\u001f");
  const model = useMemo(
    () => buildSceneModel(kind, step, labelKey ? labelKey.split("\u001f") : []),
    [kind, labelKey, step],
  );
  const [status, setStatus] = useState<SceneStatus>(
    visualMode === "minimal" ? "fallback" : "loading",
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || visualMode === "minimal" || !webGlAvailable()) {
      setStatus("fallback");
      return;
    }

    let disposed = false;
    let renderer: WebGLRenderer | null = null;
    let frameId = 0;
    let cleanupScene = () => undefined;
    setStatus("loading");

    void import("three")
      .then((three) => {
        if (disposed) return;

        const geometries = new Set<BufferGeometry>();
        const materials = new Set<Material>();
        const nodeMeshes: Mesh[] = [];
        const activeMarkers: {
          mesh: Mesh;
          start: Vector3;
          end: Vector3;
          offset: number;
        }[] = [];
        const scene = new three.Scene();
        scene.fog = new three.FogExp2(0x06110e, kind === "call-stack" ? 0.036 : 0.052);
        const camera = new three.PerspectiveCamera(42, 1, 0.1, 60);
        camera.position.set(
          0,
          kind === "call-stack" ? 0.35 : 0,
          kind === "call-stack" ? 10.5 : 9,
        );

        renderer = new three.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: visualMode === "immersive",
          powerPreference: "high-performance",
        });
        renderer.outputColorSpace = three.SRGBColorSpace;
        renderer.toneMapping = three.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        const pixelRatio =
          visualMode === "immersive"
            ? Math.min(window.devicePixelRatio, 2)
            : Math.min(window.devicePixelRatio, 1.45);
        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(0x000000, 0);

        const root = new three.Group();
        scene.add(root);
        scene.add(new three.HemisphereLight(0xcdfdb1, 0x06110e, 1.7));
        const keyLight = new three.DirectionalLight(0x9ef8e1, 4.2);
        keyLight.position.set(4, 5, 7);
        scene.add(keyLight);
        const rimLight = new three.PointLight(0xa68cf3, 38, 16, 2);
        rimLight.position.set(-4, -2, 4);
        scene.add(rimLight);

        const nodeById = new Map(model.nodes.map((node) => [node.id, node]));

        for (const edge of model.edges) {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) continue;
          const start = new three.Vector3(...from.position);
          const end = new three.Vector3(...to.position);
          const middle = start
            .clone()
            .lerp(end, 0.5)
            .add(
              new three.Vector3(
                0,
                kind === "archive-core" ? 0.18 : 0,
                kind === "archive-core" ? 0.45 : 0.18,
              ),
            );
          const curve = new three.QuadraticBezierCurve3(start, middle, end);
          const geometry = new three.BufferGeometry().setFromPoints(curve.getPoints(24));
          const material = new three.LineBasicMaterial({
            color: stateColor(edge.state),
            transparent: true,
            opacity: edge.state === "idle" ? 0.22 : 0.76,
          });
          geometries.add(geometry);
          materials.add(material);
          root.add(new three.Line(geometry, material));

          if (edge.state === "active") {
            const markerGeometry = new three.SphereGeometry(0.075, 12, 8);
            const markerMaterial = new three.MeshBasicMaterial({ color: 0xd8ff9f });
            geometries.add(markerGeometry);
            materials.add(markerMaterial);
            const marker = new three.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(start);
            root.add(marker);
            activeMarkers.push({
              mesh: marker,
              start,
              end,
              offset: activeMarkers.length * 0.31,
            });
          }
        }

        const nodeRecords: {
          mesh: Mesh;
          material: MeshPhysicalMaterial;
          phase: number;
        }[] = [];
        model.nodes.forEach((node, index) => {
          let geometry: BufferGeometry;
          if (node.id === "core") {
            geometry = new three.IcosahedronGeometry(1.05, 2);
          } else if (kind === "call-stack") {
            geometry = new three.BoxGeometry(2.6, 0.56, 0.78, 2, 1, 1);
          } else if (kind === "graph-search") {
            geometry = new three.DodecahedronGeometry(0.58, 0);
          } else {
            geometry = new three.OctahedronGeometry(0.62, 1);
          }
          geometries.add(geometry);
          const material = new three.MeshPhysicalMaterial({
            color: node.state === "idle" ? 0x183a31 : node.color,
            emissive: node.state === "idle" ? 0x0b1a16 : node.color,
            emissiveIntensity: node.state === "active" ? 1.25 : 0.35,
            metalness: 0.42,
            roughness: node.state === "active" ? 0.2 : 0.48,
            transmission: node.id === "core" ? 0.16 : 0,
            transparent: true,
            opacity: node.state === "idle" ? 0.55 : 0.94,
            wireframe: node.id === "core" || node.state === "idle",
          });
          materials.add(material);
          const mesh = new three.Mesh(geometry, material);
          mesh.position.set(...node.position);
          mesh.scale.setScalar(node.scale);
          mesh.userData.nodeId = node.id;
          root.add(mesh);
          nodeMeshes.push(mesh);
          nodeRecords.push({ mesh, material, phase: index * 0.83 });

          if (node.state === "active" && node.id !== "core") {
            const haloGeometry = new three.TorusGeometry(
              kind === "call-stack" ? 1.5 : 0.72,
              0.018,
              8,
              64,
            );
            const haloMaterial = new three.MeshBasicMaterial({
              color: 0xb7f36b,
              transparent: true,
              opacity: 0.76,
            });
            geometries.add(haloGeometry);
            materials.add(haloMaterial);
            const halo = new three.Mesh(haloGeometry, haloMaterial);
            halo.position.copy(mesh.position);
            halo.rotation.x = Math.PI / 2;
            root.add(halo);
          }
        });

        const particleCount = visualMode === "immersive" ? 480 : 190;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let index = 0; index < particleCount; index += 1) {
          const radius = 3.3 + deterministicNoise(index, 0) * 3.6;
          const theta = deterministicNoise(index, 1) * Math.PI * 2;
          const phi = Math.acos(2 * deterministicNoise(index, 2) - 1);
          particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
          particlePositions[index * 3 + 1] =
            radius * Math.sin(phi) * Math.sin(theta) * 0.72;
          particlePositions[index * 3 + 2] = radius * Math.cos(phi);
        }
        const particleGeometry = new three.BufferGeometry();
        particleGeometry.setAttribute(
          "position",
          new three.BufferAttribute(particlePositions, 3),
        );
        const particleMaterial = new three.PointsMaterial({
          color: 0x8ccdb7,
          size: visualMode === "immersive" ? 0.035 : 0.028,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.54,
          depthWrite: false,
        });
        geometries.add(particleGeometry);
        materials.add(particleMaterial);
        const particles = new three.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        let width = 1;
        let height = 1;
        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          width = Math.max(1, Math.round(rect.width));
          height = Math.max(1, Math.round(rect.height));
          renderer?.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          if (reducedMotion) renderer?.render(scene, camera);
        };
        resize();

        let visible = true;
        let pointerX = 0;
        let pointerY = 0;
        let manualRotationX = 0;
        let manualRotationY = 0;
        let dragging = false;
        let dragDistance = 0;
        let lastPointerX = 0;
        let lastPointerY = 0;

        const pointerDown = (event: PointerEvent) => {
          dragging = true;
          dragDistance = 0;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          canvas.setPointerCapture?.(event.pointerId);
          canvas.classList.add("is-dragging");
        };
        const pointerMove = (event: PointerEvent) => {
          const rect = canvas.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
          pointerY = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
          if (!dragging) return;
          const deltaX = event.clientX - lastPointerX;
          const deltaY = event.clientY - lastPointerY;
          dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
          manualRotationY += deltaX * 0.006;
          manualRotationX += deltaY * 0.004;
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          if (reducedMotion) {
            root.rotation.x = manualRotationX;
            root.rotation.y = manualRotationY;
            renderer?.render(scene, camera);
          }
        };
        const pointerUp = (event: PointerEvent) => {
          dragging = false;
          canvas.releasePointerCapture?.(event.pointerId);
          canvas.classList.remove("is-dragging");
        };
        const pointerClick = (event: MouseEvent) => {
          if (dragDistance > 8 || !onNodeSelectRef.current) return;
          const rect = canvas.getBoundingClientRect();
          const pointer = new three.Vector2(
            ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
            -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1,
          );
          const raycaster = new three.Raycaster();
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(nodeMeshes, false)[0];
          const nodeId: unknown = hit?.object.userData["nodeId"];
          if (typeof nodeId === "string") onNodeSelectRef.current(nodeId);
        };
        const contextLost = (event: Event) => {
          event.preventDefault();
          setStatus("fallback");
        };
        canvas.addEventListener("pointerdown", pointerDown);
        canvas.addEventListener("pointermove", pointerMove);
        canvas.addEventListener("pointerup", pointerUp);
        canvas.addEventListener("pointercancel", pointerUp);
        canvas.addEventListener("click", pointerClick);
        canvas.addEventListener("webglcontextlost", contextLost);

        const resizeObserver =
          typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => resize());
        resizeObserver?.observe(canvas);
        if (!resizeObserver) window.addEventListener("resize", resize);

        const intersectionObserver =
          typeof IntersectionObserver === "undefined"
            ? null
            : new IntersectionObserver(
                (entries) => {
                  visible = entries[0]?.isIntersecting ?? true;
                },
                { rootMargin: "160px" },
              );
        intersectionObserver?.observe(canvas);

        const clock = new three.Clock();
        const renderFrame = () => {
          if (disposed || !renderer) return;
          const elapsed = clock.getElapsedTime();
          const motion = reducedMotion ? 0 : 1;
          root.rotation.y +=
            (manualRotationY + pointerX * 0.12 * motion - root.rotation.y) * 0.045;
          root.rotation.x +=
            (manualRotationX + pointerY * 0.06 * motion - root.rotation.x) * 0.045;
          if (!dragging && motion > 0) {
            manualRotationY += kind === "archive-core" ? 0.00055 : 0.00018;
          }
          particles.rotation.y = elapsed * 0.012 * motion;
          particles.rotation.x = Math.sin(elapsed * 0.08) * 0.05 * motion;
          nodeRecords.forEach(({ mesh, material, phase }) => {
            if (motion === 0) return;
            const pulse = 1 + Math.sin(elapsed * 1.8 + phase) * 0.035;
            mesh.scale.multiplyScalar(pulse / (mesh.userData.previousPulse ?? 1));
            mesh.userData.previousPulse = pulse;
            if (material.emissiveIntensity > 0.5) {
              material.emissiveIntensity = 1.05 + Math.sin(elapsed * 2.2 + phase) * 0.28;
            }
          });
          activeMarkers.forEach(({ mesh, start, end, offset }) => {
            const amount = motion === 0 ? 0.5 : (elapsed * 0.26 + offset) % 1;
            mesh.position.lerpVectors(start, end, amount);
          });
          if (visible || reducedMotion) renderer.render(scene, camera);
          if (!reducedMotion) frameId = window.requestAnimationFrame(renderFrame);
        };

        setStatus("ready");
        renderFrame();

        cleanupScene = () => {
          window.cancelAnimationFrame(frameId);
          resizeObserver?.disconnect();
          intersectionObserver?.disconnect();
          if (!resizeObserver) window.removeEventListener("resize", resize);
          canvas.removeEventListener("pointerdown", pointerDown);
          canvas.removeEventListener("pointermove", pointerMove);
          canvas.removeEventListener("pointerup", pointerUp);
          canvas.removeEventListener("pointercancel", pointerUp);
          canvas.removeEventListener("click", pointerClick);
          canvas.removeEventListener("webglcontextlost", contextLost);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer?.dispose();
          renderer = null;
        };
      })
      .catch(() => {
        if (!disposed) setStatus("fallback");
      });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      cleanupScene();
    };
  }, [kind, model, reducedMotion, visualMode]);

  return (
    <div
      className={`nexus-scene ${className}`.trim()}
      data-kind={kind}
      data-scene-status={status}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="nexus-scene-fallback" aria-hidden="true">
        <span className="fallback-core">NX</span>
        {model.nodes
          .filter((node) => node.id !== "core")
          .map((node, index) => (
            <span
              className={`fallback-node is-${node.state}`}
              key={node.id}
              style={
                {
                  "--node-index": index,
                  "--node-x": node.position[0] * 11,
                  "--node-y": node.position[1] * -11,
                } as React.CSSProperties
              }
            >
              <small>{node.label}</small>
            </span>
          ))}
        <i />
      </div>
      <span className="scene-render-state" aria-hidden="true">
        {status === "ready"
          ? "WEBGL / ACTIVE"
          : status === "loading"
            ? "WEBGL / INITIALIZING"
            : "SEMANTIC / FALLBACK"}
      </span>
    </div>
  );
}
