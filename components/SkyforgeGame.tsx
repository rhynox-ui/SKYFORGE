"use client";

import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  MeshBuilder,
  ParticleSystem,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
  WebGPUEngine
} from "@babylonjs/core";

export default function SkyforgeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: Engine | WebGPUEngine | undefined;
    let scene: Scene | undefined;
    let disposed = false;

    const start = async () => {
      const webgpuSupported = await WebGPUEngine.IsSupportedAsync;

      if (webgpuSupported) {
        const gpu = new WebGPUEngine(canvas, {
          antialias: true,
          adaptToDeviceRatio: true
        });
        await gpu.initAsync();
        engine = gpu;
      } else {
        engine = new Engine(canvas, true, {
          preserveDrawingBuffer: true,
          stencil: true
        }, true);
      }

      if (disposed || !engine) {
        engine?.dispose();
        return;
      }

      scene = new Scene(engine);
      scene.clearColor = new Color4(0.018, 0.028, 0.034, 1);

      const camera = new ArcRotateCamera(
        "combat-camera",
        -Math.PI / 2,
        Math.PI / 3.1,
        42,
        new Vector3(0, 3, 0),
        scene
      );
      camera.lowerRadiusLimit = 24;
      camera.upperRadiusLimit = 80;
      camera.wheelPrecision = 80;
      camera.attachControl(canvas, true);

      const light = new HemisphericLight(
        "desert-sun",
        new Vector3(0.15, 1, 0.15),
        scene
      );
      light.intensity = 1.15;
      light.diffuse = new Color3(1, 0.92, 0.78);
      light.groundColor = new Color3(0.18, 0.13, 0.1);

      const ground = MeshBuilder.CreateGround(
        "dustfall-terrain",
        { width: 180, height: 180, subdivisions: 64 },
        scene
      );

      const terrain = new StandardMaterial("desert-material", scene);
      terrain.diffuseColor = new Color3(0.22, 0.16, 0.105);
      terrain.specularColor = new Color3(0.025, 0.02, 0.015);
      ground.material = terrain;

      const helicopter = MeshBuilder.CreateBox(
        "AH-9-Viper",
        { width: 2.8, height: 0.72, depth: 5.2 },
        scene
      );
      helicopter.position = new Vector3(0, 5, 0);

      const heliMaterial = new StandardMaterial("viper-material", scene);
      heliMaterial.diffuseColor = new Color3(0.15, 0.19, 0.2);
      heliMaterial.specularColor = new Color3(0.6, 0.65, 0.66);
      helicopter.material = heliMaterial;

      const tail = MeshBuilder.CreateBox(
        "viper-tail",
        { width: 0.34, height: 0.34, depth: 4.4 },
        scene
      );
      tail.parent = helicopter;
      tail.position.z = 3.25;
      tail.material = heliMaterial;

      const rotor = MeshBuilder.CreateBox(
        "main-rotor",
        { width: 7.2, height: 0.08, depth: 0.22 },
        scene
      );
      rotor.parent = helicopter;
      rotor.position.y = 0.58;

      const rotorMaterial = new StandardMaterial("rotor-material", scene);
      rotorMaterial.diffuseColor = new Color3(0.025, 0.03, 0.03);
      rotor.material = rotorMaterial;

      const cockpit = MeshBuilder.CreateSphere(
        "cockpit",
        { diameter: 1.65, segments: 24 },
        scene
      );
      cockpit.parent = helicopter;
      cockpit.scaling = new Vector3(1.15, 0.58, 1.05);
      cockpit.position = new Vector3(0, 0.18, -1.2);

      const glass = new StandardMaterial("cockpit-glass", scene);
      glass.diffuseColor = new Color3(0.04, 0.13, 0.16);
      glass.specularColor = new Color3(0.9, 0.95, 1);
      glass.alpha = 0.72;
      cockpit.material = glass;

      const enemyMaterial = new StandardMaterial("enemy-material", scene);
      enemyMaterial.diffuseColor = new Color3(0.42, 0.045, 0.03);
      enemyMaterial.emissiveColor = new Color3(0.075, 0.006, 0.002);

      for (let i = 0; i < 10; i++) {
        const enemy = MeshBuilder.CreateBox(
          `enemy-${i}`,
          { width: 2, height: 1.5, depth: 2.5 },
          scene
        );
        enemy.position = new Vector3(
          -42 + (i % 5) * 20,
          1,
          -32 + Math.floor(i / 5) * 42
        );
        enemy.material = enemyMaterial;
      }

      const dust = new ParticleSystem("rotor-dust", 900, scene);
      dust.particleTexture = new Texture(
        "https://assets.babylonjs.com/textures/flare.png",
        scene
      );
      dust.emitter = helicopter;
      dust.minEmitBox = new Vector3(-2.2, -0.6, -2.2);
      dust.maxEmitBox = new Vector3(2.2, -0.2, 2.2);
      dust.color1 = new Color4(0.58, 0.42, 0.25, 0.26);
      dust.color2 = new Color4(0.25, 0.19, 0.13, 0.08);
      dust.minSize = 0.15;
      dust.maxSize = 0.8;
      dust.minLifeTime = 0.25;
      dust.maxLifeTime = 1.3;
      dust.emitRate = 180;
      dust.start();

      const keys = new Set<string>();
      const onKeyDown = (event: KeyboardEvent) => keys.add(event.key.toLowerCase());
      const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      scene.onBeforeRenderObservable.add(() => {
        if (!engine) return;

        const dt = engine.getDeltaTime() / 1000;
        const speed = 17 * dt;

        if (keys.has("w") || keys.has("arrowup")) helicopter.position.z -= speed;
        if (keys.has("s") || keys.has("arrowdown")) helicopter.position.z += speed;
        if (keys.has("a") || keys.has("arrowleft")) helicopter.position.x -= speed;
        if (keys.has("d") || keys.has("arrowright")) helicopter.position.x += speed;

        helicopter.position.x = Math.max(-70, Math.min(70, helicopter.position.x));
        helicopter.position.z = Math.max(-70, Math.min(70, helicopter.position.z));

        rotor.rotation.y += dt * 18;
        camera.target.copyFrom(helicopter.position);
      });

      engine.runRenderLoop(() => scene?.render());
    };

    void start();

    return () => {
      disposed = true;
      if (engine) engine.dispose();
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#050b0e", color: "#e7eef0" }}>
      <header style={{
        padding: "16px 22px",
        borderBottom: "1px solid #1c2b31",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <strong style={{ letterSpacing: "4px" }}>SKYFORGE</strong>
        <button style={{
          background: "#122128",
          color: "#e7eef0",
          border: "1px solid #39505a",
          borderRadius: 8,
          padding: "10px 16px"
        }}>
          CONNECT SOLANA WALLET
        </button>
      </header>

      <section style={{ position: "relative", height: "calc(100vh - 65px)", minHeight: 520 }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
        />
        <div style={{
          position: "absolute",
          top: 18,
          left: 18,
          pointerEvents: "none",
          textShadow: "0 2px 8px #000"
        }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#9aabb0" }}>
            OPERATION DUSTFALL
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>AH-9 VIPER</div>
          <div style={{ color: "#9aabb0", marginTop: 4 }}>WAR SCORE 000000</div>
        </div>
      </section>
    </main>
  );
}
