import Cookies from "js-cookie";
const BASE = "https://lucaairo.it/api/workout-plans";

function getAuthHeaders() {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchSchede() {
  const res = await fetch(BASE, {
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore fetch schede");
  return await res.json();
}

export async function creaScheda(dati) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Errore creazione scheda");
  return await res.json();
}

export async function modificaScheda(id, dati) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(dati),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Errore modifica scheda");
  return await res.json();
}

export async function eliminaScheda(id) {
  const res = await fetch(`${BASE}?id=${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Errore eliminazione scheda");
  return await res.json();
}
