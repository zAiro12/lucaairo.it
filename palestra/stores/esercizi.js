import { defineStore } from "pinia";
import {
  fetchEsercizi,
  creaEsercizio,
  modificaEsercizio,
  eliminaEsercizio,
} from "../api/esercizi";

export const useEserciziStore = defineStore("esercizi", {
  state: () => ({
    lista: [],
    loading: false,
    errore: null,
  }),
  actions: {
    async caricaEsercizi() {
      this.loading = true;
      try {
        this.lista = await fetchEsercizi();
        this.errore = null;
      } catch (e) {
        this.errore = e.message || "Errore caricamento esercizi";
      } finally {
        this.loading = false;
      }
    },
    async aggiungiEsercizio(dati) {
      await creaEsercizio(dati);
      await this.caricaEsercizi();
    },
    async aggiornaEsercizio(id, dati) {
      await modificaEsercizio(id, dati);
      await this.caricaEsercizi();
    },
    async rimuoviEsercizio(id) {
      await eliminaEsercizio(id);
      await this.caricaEsercizi();
    },
  },
});
