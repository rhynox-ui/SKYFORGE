# SKYFORGE Architecture

## Principle
Keep real-time combat off-chain. Use Solana for ownership, access, valuable assets, marketplace settlement and selected rewards.

## Planned layers

### Browser
- Next.js
- React
- Phaser prototype
- Later: richer 3D renderer when the core loop is proven

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

## Security rules
- Never trust client-submitted score.
- Never expose private keys in the browser.
- Never make every gameplay action an on-chain transaction.
- Validate high-value rewards server-side before settlement.
