import Cookies from "js-cookie";
import { useAuthStore } from "../stores/auth";
const BASE = "https://lucaairo.it/api/stats";

function getAuthHeaders() {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSummary() {
  const authStore = useAuthStore();
  const userId = authStore.user?.id;
  if (!userId) throw new Error("ID utente non disponibile");
  const res = await fetch(`${BASE}/users/stats?userId=${userId}`, {
    headers: {
      ...getAuthHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Errore fetch summary");
  return await res.json();
}

export async function fetchExerciseHistory(exerciseId, userId) {
  const res = await fetch(
    `${BASE}/exercises/history?exerciseId=${exerciseId}&userId=${userId}`,
    {
      headers: {
        ...getAuthHeaders(),
      },
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Errore fetch storico esercizio");
  return await res.json();
}
