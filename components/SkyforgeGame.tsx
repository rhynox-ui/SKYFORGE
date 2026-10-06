"use client";

import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";

const ACCESS_REQUIREMENT = 20_000;

export default function SkyforgeGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class Battlefield extends Phaser.Scene {
      score = 0;
      helicopter!: Phaser.GameObjects.Rectangle;
      enemies: Phaser.GameObjects.Rectangle[] = [];

      constructor() {
        super("Battlefield");
      }

      create() {
        this.cameras.main.setBackgroundColor("#071016");
        this.add.text(24, 22, "SKYFORGE // OPERATION DUSTFALL", {
          color: "#d9e7ea",
          fontSize: "20px",
          fontStyle: "bold"
        });

        this.add.text(24, 52, "WASD / ARROWS — FLY    SPACE — FIRE", {
          color: "#7f9ba3",
          fontSize: "13px"
        });

        this.helicopter = this.add.rectangle(480, 300, 74, 30, 0x94a7ad);
        this.add.rectangle(480, 300, 92, 5, 0x26363c);
        this.add.text(444, 318, "AH-9", { color: "#9fb3b8", fontSize: "11px" });

        for (let i = 0; i < 7; i++) {
          const enemy = this.add.rectangle(
            120 + i * 120,
            130 + (i % 3) * 120,
            30,
            30,
            0xb94a48
          );
          this.enemies.push(enemy);
        }

        const keys = this.input.keyboard?.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE");
        this.input.on("pointerdown", () => this.fire());
        this.input.keyboard?.on("keydown-SPACE", () => this.fire());

        this.events.on("update", () => {
          const speed = 4;
          if (keys?.W.isDown || keys?.UP.isDown) this.helicopter.y -= speed;
          if (keys?.S.isDown || keys?.DOWN.isDown) this.helicopter.y += speed;
          if (keys?.A.isDown || keys?.LEFT.isDown) this.helicopter.x -= speed;
          if (keys?.D.isDown || keys?.RIGHT.isDown) this.helicopter.x += speed;
          this.helicopter.x = Phaser.Math.Clamp(this.helicopter.x, 50, 910);
          this.helicopter.y = Phaser.Math.Clamp(this.helicopter.y, 90, 510);
        });
      }

      fire() {
        const target = this.enemies.find((enemy) => enemy.active);
        if (!target) return;
        const distance = Phaser.Math.Distance.Between(this.helicopter.x, this.helicopter.y, target.x, target.y);
        if (distance < 300) {
          target.destroy();
          this.score += 100;
          this.add.text(target.x, target.y, "+100", { color: "#e5c46a", fontSize: "14px" });
        }
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 960,
      height: 540,
      parent: gameRef.current,
      physics: { default: "arcade" },
      scene: Battlefield,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
    });

    return () => game.destroy(true);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#071016" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1d2c32" }}>
        <div>
          <strong style={{ letterSpacing: "3px" }}>SKYFORGE</strong>
          <span style={{ marginLeft: 12, color: "#71878e", fontSize: 12 }}>WARZONE</span>
        </div>
        <button
          onClick={() => setWallet(wallet ? null : "Connect Phantom / Solana wallet")}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #38515a", background: "#102027", color: "#dce9ec" }}
        >
          {wallet ?? "CONNECT WALLET"}
        </button>
      </header>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#71878e", fontSize: 12 }}>ACCESS REQUIREMENT</div>
            <strong>{ACCESS_REQUIREMENT.toLocaleString()} $SKY</strong>
          </div>
          <div>
            <div style={{ color: "#71878e", fontSize: 12 }}>MISSION</div>
            <strong>OPERATION DUSTFALL</strong>
          </div>
          <div>
            <div style={{ color: "#71878e", fontSize: 12 }}>STATUS</div>
            <strong style={{ color: "#d9e7ea" }}>{wallet ? "WALLET CONNECTED" : "GUEST MODE"}</strong>
          </div>
        </div>
        <div ref={gameRef} style={{ width: "100%", minHeight: 320, background: "#0a151b", border: "1px solid #1d2c32", borderRadius: 12, overflow: "hidden" }} />
      </section>
    </main>
  );
}
