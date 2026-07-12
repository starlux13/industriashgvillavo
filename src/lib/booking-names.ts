// Generate discreet, legible aliases for reservations.
// Not explicit — themed around night, romance, mountain, mystery.

const MALE = [
  "Jaguar", "Halcón", "Lobo", "Tigre", "Cóndor", "León",
  "Zorro", "Puma", "Búho", "Cuervo", "Águila", "Toro",
];
const FEMALE = [
  "Luna", "Estrella", "Aurora", "Selva", "Aurora", "Neblina",
  "Perla", "Ámbar", "Orquídea", "Brisa", "Ondina", "Zafira",
];
const NEUTRAL = [
  "Alba", "Ocaso", "Refugio", "Cima", "Bosque", "Ceniza",
  "Ámbar", "Iris", "Nébula", "Aura", "Vega", "Cielo",
];

export function generateAlias(gender?: "m" | "f" | "x"): string {
  const pool =
    gender === "m" ? MALE : gender === "f" ? FEMALE : NEUTRAL;
  const word = pool[Math.floor(Math.random() * pool.length)];
  const num = Math.floor(Math.random() * 900 + 100);
  return `Huésped ${word} ${num}`;
}
