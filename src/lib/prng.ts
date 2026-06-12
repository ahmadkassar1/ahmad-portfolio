/**
 * Deterministic PRNG (mulberry32). Every procedural element in the world —
 * particle positions, prop jitter, texture noise — draws from a seeded
 * stream so the deck looks identical on every visit and SSR snapshots
 * never disagree with the client.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random float in [min, max). */
export function range(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}
