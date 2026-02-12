import { defineStore } from "pinia";
import {
  fetchSessioni,
  creaSessione,
  modificaSessione,
  eliminaSessione,
} from "../api/sessioni";

export const useSessioniStore = defineStore("sessioni", {
  state: () => ({
    lista: [],
    loading: false,
    errore: null,
  }),
  actions: {
    async caricaSessioni() {
      this.loading = true;
      try {
        this.lista = await fetchSessioni();
        this.errore = null;
      } catch (e) {
        this.errore = e.message || "Errore caricamento sessioni";
      } finally {
        this.loading = false;
      }
    },
    async aggiungiSessione(dati) {
      await creaSessione(dati);
      await this.caricaSessioni();
    },
    async aggiornaSessione(id, dati) {
      await modificaSessione(id, dati);
      await this.caricaSessioni();
    },
    async rimuoviSessione(id) {
      await eliminaSessione(id);
      await this.caricaSessioni();
    },
  },
});
