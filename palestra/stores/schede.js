import { defineStore } from "pinia";
import {
  fetchSchede,
  creaScheda,
  modificaScheda,
  eliminaScheda,
} from "../api/schede";

export const useSchedeStore = defineStore("schede", {
  state: () => ({
    lista: [],
    loading: false,
    errore: null,
  }),
  actions: {
    async caricaSchede() {
      this.loading = true;
      try {
        this.lista = await fetchSchede();
        this.errore = null;
      } catch (e) {
        this.errore = e.message || "Errore caricamento schede";
      } finally {
        this.loading = false;
      }
    },
    async aggiungiScheda(dati) {
      await creaScheda(dati);
      await this.caricaSchede();
    },
    async aggiornaScheda(id, dati) {
      await modificaScheda(id, dati);
      await this.caricaSchede();
    },
    async rimuoviScheda(id) {
      await eliminaScheda(id);
      await this.caricaSchede();
    },
  },
});
