<template>
    <nav class="navbar">
        <router-link to="/" class="logo">🏋️‍♂️ Palestra</router-link>
        <div class="links">
            <router-link v-if="isAuth" to="/esercizi">Esercizi</router-link>
            <router-link v-if="isAuth" to="/schede">Schede</router-link>
            <router-link v-if="isAuth" to="/sessioni">Sessioni</router-link>
            <router-link v-if="isAuth" to="/statistiche">Statistiche</router-link>
            <router-link v-if="!isAuth" to="/login">Login</router-link>
            <router-link v-if="isAuth" to="/profilo">Profilo</router-link>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isAuth = computed(() => !!authStore.user);
</script>

<style scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #222;
    color: #fff;
    padding: 12px 20px;
    border-radius: 0 0 12px 12px;
    margin-bottom: 18px;
}

.logo {
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    font-size: 1.2em;
}

.links {
    display: flex;
    gap: 16px;
}

.links a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    transition: background 0.2s;
}

.links a.router-link-exact-active {
    background: #3b82f6;
}

@media (max-width: 600px) {
    .navbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 10px;
    }

    .links {
        flex-wrap: wrap;
        gap: 8px;
    }
}
</style>
