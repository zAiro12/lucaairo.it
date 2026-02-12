import { defineStore } from "pinia";
import { login, socialLogin, getProfile, logout } from "../api/auth";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    loading: false,
    errore: null,
    provider: Cookies.get("provider") || null,
    token: Cookies.get("token") || null,
  }),
  actions: {
    async loginEmail({ email, password }) {
      this.loading = true;
      try {
        const data = await login({ email, password });
        // data: { id, nome, cognome, email, token }
        this.user = {
          id: data.id,
          nome: data.nome,
          cognome: data.cognome,
          email: data.email,
        };
        this.provider = "local";
        this.token = data.token;
        if (data.token)
          Cookies.set("token", data.token, { sameSite: "strict" });
        Cookies.set("user", JSON.stringify(this.user), { sameSite: "strict" });
        Cookies.set("provider", this.provider, { sameSite: "strict" });
        this.errore = null;
      } catch (e) {
        this.errore = e.message;
      } finally {
        this.loading = false;
      }
    },
    socialLogin(provider) {
      socialLogin(provider); // redirect
    },
    async fetchProfile() {
      this.loading = true;
      try {
        const data = await getProfile();
        this.user = {
          id: data.user.id,
          nome: data.user.nome,
          cognome: data.user.cognome,
          email: data.user.email,
        };
        this.provider = data.provider;
        Cookies.set("user", JSON.stringify(this.user), { sameSite: "strict" });
        Cookies.set("provider", this.provider, { sameSite: "strict" });
        this.errore = null;
      } catch (e) {
        this.user = null;
        Cookies.remove("user");
        Cookies.remove("provider");
        this.errore = e.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await logout();
      this.user = null;
      this.provider = null;
      this.token = null;
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("provider");
    },
  },
});
