# SKYFORGE Architecture

## Rendering direction

SKYFORGE is a **browser-first 3D game**. The target is high visual quality without requiring players to install a native game client.

The first prototype uses **Babylon.js**, with WebGPU where supported and WebGL fallback for compatibility. Babylon provides PBR rendering, WebGPU/WebGL, particles, physics integrations, animations and large-world tooling suitable for a serious browser game.

Unreal Engine 5 remains a reference for AAA asset production and a possible future native/streaming client. UE5's Nanite and Lumen are excellent for high-fidelity native games, but a normal Unreal project does not run directly inside a browser. For SKYFORGE's browser requirement, Babylon is the primary runtime.

## Layers

### Browser
- Next.js
- React
- Babylon.js
- WebGPU + WebGL fallback
- glTF/GLB assets
- PBR materials
- particles/VFX
- responsive desktop/mobile controls

### Game server
- Authoritative combat validation
- Mission state
- anti-cheat
- leaderboards
- reward eligibility

### Solana
- $SKY token
- wallet authentication/signing
- 20,000 $SKY access check
- player-owned helicopters
- player-owned weapons
- marketplace
- seasonal reward settlement

## Security
- Never trust client-submitted score.
- Never expose private keys in the browser.
- Never make every gameplay action an on-chain transaction.
- Validate high-value rewards server-side before settlement.

## Visual-quality target
1. High-quality helicopter GLB
2. PBR materials and HDR environment
3. Dynamic lighting and shadows
4. Particle-based rotor wash, muzzle flash, missiles and explosions
5. Terrain, fog, dust and atmospheric effects
6. LOD and asset streaming
7. WebGPU path with WebGL fallback
8. Mobile performance profile
