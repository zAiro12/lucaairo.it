const BASE = "https://lucaairo.it/api/auth";

export async function login({ email, password }) {
  const res = await fetch("https://lucaairo.it/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenziali non valide");
  return await res.json();
}

export async function socialLogin(provider) {
  window.location.href = `${BASE}/${provider}`;
}

import { useAuthStore } from "../stores/auth";
export async function getProfile() {
  const authStore = useAuthStore();
  const email = authStore.user?.email;
  if (!email) throw new Error("Email utente non disponibile");
  const res = await fetch(
    `https://lucaairo.it/api/users?email=${encodeURIComponent(email)}`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Errore profilo");
  const user = await res.json();
  return { user, provider: authStore.provider || "local" };
}

export async function logout() {
  await fetch(`${BASE}/logout`, { method: "POST", credentials: "include" });
}
