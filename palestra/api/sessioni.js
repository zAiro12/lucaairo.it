import Cookies from "js-cookie";
const BASE = "https://lucaairo.it/api/workouts";

function getAuthHeaders() {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSessioni() {
  const res = await fetch(BASE, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore fetch sessioni");
  return await res.json();
}

export async function creaSessione(dati) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
  });
  if (!res.ok) throw new Error("Errore creazione sessione");
  return await res.json();
}

export async function modificaSessione(id, dati) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
  });
  if (!res.ok) throw new Error("Errore modifica sessione");
  return await res.json();
}

export async function eliminaSessione(id) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore eliminazione sessione");
  return await res.json();
}
