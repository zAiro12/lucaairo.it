import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/esercizi",
    name: "Esercizi",
    component: () => import("../views/Esercizi.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/schede",
    name: "Schede",
    component: () => import("../views/Schede.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/sessioni",
    name: "Sessioni",
    component: () => import("../views/Sessioni.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/statistiche",
    name: "Statistiche",
    component: () => import("../views/Statistiche.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/profilo",
    name: "Profilo",
    component: () => import("../views/Profilo.vue"),
    meta: { requiresAuth: true },
  },
];

import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {}
    if (!authStore.user) return next({ path: "/login" });
  }
  next();
});

export default router;
