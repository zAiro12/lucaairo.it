<template>
    <div>
        <FormEsercizio v-if="showForm" :esercizio="esercizioEdit" :isEdit="!!esercizioEdit" @salva="salvaEsercizio"
            @annulla="annullaEdit" />
        <button v-if="!showForm" @click="apriNuovo">Aggiungi esercizio</button>
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="errore" class="errore">{{ errore }}</div>
        <ul v-else>
            <li v-for="es in lista" :key="es.id">
                <strong>{{ es.nome }}</strong> <em>({{ es.gruppoMuscolare }})</em>
                <p>{{ es.descrizione }}</p>
                <button @click="modifica(es)">Modifica</button>
                <button @click="elimina(es.id)">Elimina</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEserciziStore } from '../stores/esercizi';
import FormEsercizio from './FormEsercizio.vue';

const store = useEserciziStore();
const { lista, loading, errore } = store;

const showForm = ref(false);
const esercizioEdit = ref(null);

function apriNuovo() {
    esercizioEdit.value = null;
    showForm.value = true;
}
function modifica(es) {
    esercizioEdit.value = { ...es };
    showForm.value = true;
}
function annullaEdit() {
    showForm.value = false;
    esercizioEdit.value = null;
}
async function salvaEsercizio(dati) {
    if (esercizioEdit.value && esercizioEdit.value.id) {
        await store.aggiornaEsercizio(esercizioEdit.value.id, dati);
    } else {
        await store.aggiungiEsercizio(dati);
    }
    showForm.value = false;
    esercizioEdit.value = null;
}
async function elimina(id) {
    if (confirm('Eliminare questo esercizio?')) {
        await store.rimuoviEsercizio(id);
    }
}

onMounted(() => {
    store.caricaEsercizi();
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
