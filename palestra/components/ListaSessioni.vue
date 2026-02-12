<template>
    <div>
        <button v-if="!showForm" @click="apriNuova">Aggiungi sessione</button>
        <FormSessione v-if="showForm" :sessione="sessioneEdit" :isEdit="!!sessioneEdit" @salva="salvaSessione"
            @annulla="annullaEdit" />
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="errore" class="errore">{{ errore }}</div>
        <ul v-else>
            <li v-for="s in lista" :key="s.id">
                <strong>{{ s.data }}</strong> <span v-if="s.workoutPlanId">(scheda: {{ getNomeScheda(s.workoutPlanId)
                    }})</span>
                <button @click="modifica(s)">Modifica</button>
                <button @click="elimina(s.id)">Elimina</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSessioniStore } from '../stores/sessioni';
import { useSchedeStore } from '../stores/schede';
import FormSessione from './FormSessione.vue';

const store = useSessioniStore();
const schedeStore = useSchedeStore();
const { lista, loading, errore } = store;

const showForm = ref(false);
const sessioneEdit = ref(null);

function getNomeScheda(id) {
    const sc = schedeStore.lista.find(s => s.id === id);
    return sc ? sc.nome : '';
}

function apriNuova() {
    sessioneEdit.value = null;
    showForm.value = true;
}
function modifica(s) {
    sessioneEdit.value = { ...s };
    showForm.value = true;
}
function annullaEdit() {
    showForm.value = false;
    sessioneEdit.value = null;
}
async function salvaSessione(dati) {
    if (sessioneEdit.value && sessioneEdit.value.id) {
        await store.aggiornaSessione(sessioneEdit.value.id, dati);
    } else {
        await store.aggiungiSessione(dati);
    }
    showForm.value = false;
    sessioneEdit.value = null;
}
async function elimina(id) {
    if (confirm('Eliminare questa sessione?')) {
        await store.rimuoviSessione(id);
    }
}

onMounted(() => {
    store.caricaSessioni();
    if (!schedeStore.lista.length) schedeStore.caricaSchede();
});
</script>

<style scoped>
.errore {
    color: red;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background: #fff;
    margin: 8px 0;
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 1px 3px #0001;
}

button {
    margin-right: 8px;
}
</style>
