<template>
    <div class="profilo-container" v-if="user">
        <h2>Profilo</h2>
        <div class="info">
            <div><strong>Nome:</strong> {{ user.nome }}</div>
            <div><strong>Cognome:</strong> {{ user.cognome }}</div>
            <div><strong>Email:</strong> {{ user.email }}</div>
            <div><strong>Provider:</strong> {{ providerLabel }}</div>
        </div>
        <button @click="logout">Logout</button>
    </div>
    <div v-else>
        <p>Non sei loggato.</p>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const provider = computed(() => authStore.provider);

const providerLabel = computed(() => {
    if (provider.value === 'google') return 'Google';
    if (provider.value === 'apple') return 'Apple';
    if (provider.value === 'github') return 'GitHub';
    return 'Email/Password';
});

async function logout() {
    await authStore.logout();
    router.push('/login');
}

onMounted(() => {
    if (!authStore.user) authStore.fetchProfile();
});
</script>

<style scoped>
.profilo-container {
    max-width: 350px;
    margin: 40px auto;
    background: #fff;
    border-radius: 10px;
    padding: 24px;
    box-shadow: 0 2px 8px #0002;
}

.info {
    margin-bottom: 24px;
}

button {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: none;
    font-weight: 600;
    background: #e53e3e;
    color: #fff;
}

@media (max-width: 500px) {
    .profilo-container {
        padding: 12px;
    }
}
</style>
