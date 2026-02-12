<template>
    <div class="login-container">
        <h2>Accedi</h2>
        <div v-if="errore" class="errore">{{ errore }}</div>
        <form @submit.prevent="onLogin" v-if="!authStore.loading">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <div class="divider">oppure</div>
        <div class="social-buttons">
            <button @click="authStore.socialLogin('google')" class="google">Accedi con Google</button>
            <button @click="authStore.socialLogin('apple')" class="apple">Accedi con Apple</button>
            <button @click="authStore.socialLogin('github')" class="github">Accedi con GitHub</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

const errore = authStore.errore;

async function onLogin() {
    await authStore.loginEmail({ email: email.value, password: password.value });
    if (authStore.user) router.push('/');
}
</script>

<style scoped>
.login-container {
    max-width: 350px;
    margin: 40px auto;
    background: #fff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 2px 8px #0002;
}

input {
    width: 100%;
    margin-bottom: 12px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    width: 100%;
    margin-bottom: 8px;
    padding: 10px;
    border-radius: 4px;
    border: none;
    font-weight: 600;
}

.divider {
    text-align: center;
    margin: 16px 0;
    color: #888;
}

.social-buttons button {
    margin-bottom: 8px;
}

.google {
    background: #fff;
    color: #222;
    border: 1px solid #ccc;
}

.apple {
    background: #222;
    color: #fff;
}

.github {
    background: #24292f;
    color: #fff;
}

.errore {
    color: red;
    margin-bottom: 12px;
}

@media (max-width: 500px) {
    .login-container {
        padding: 12px;
    }
}
</style>
