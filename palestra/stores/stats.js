import { defineStore } from "pinia";
import { fetchSummary, fetchExerciseHistory } from "../api/stats";

export const useStatsStore = defineStore("stats", {
  state: () => ({
    summary: null,
    history: {},
    loading: false,
    errore: null,
  }),
  actions: {
    async caricaSummary() {
      this.loading = true;
      try {
        this.summary = await fetchSummary();
        this.errore = null;
      } catch (e) {
        this.errore = e.message || "Errore caricamento statistiche";
      } finally {
        this.loading = false;
      }
    },
    async caricaHistory(exerciseId, userId) {
      this.loading = true;
      try {
        this.history[exerciseId] = await fetchExerciseHistory(
          exerciseId,
          userId,
        );
        this.errore = null;
      } catch (e) {
        this.errore = e.message || "Errore caricamento storico";
      } finally {
        this.loading = false;
      }
    },
  },
});
