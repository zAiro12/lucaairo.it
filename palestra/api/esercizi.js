import Cookies from "js-cookie";
const BASE = "https://lucaairo.it/api/exercises";

function getAuthHeaders() {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchEsercizi() {
  const res = await fetch(BASE, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore fetch esercizi");
  return await res.json();
}

export async function creaEsercizio(dati) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
  });
  if (!res.ok) throw new Error("Errore creazione esercizio");
  return await res.json();
}

export async function modificaEsercizio(id, dati) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
  });
  if (!res.ok) throw new Error("Errore modifica esercizio");
  return await res.json();
}

export async function eliminaEsercizio(id) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore eliminazione esercizio");
  return await res.json();
}
