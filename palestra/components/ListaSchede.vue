<template>
    <div>
        <button v-if="!showForm" @click="apriNuova">Aggiungi scheda</button>
        <FormScheda v-if="showForm" :scheda="schedaEdit" :isEdit="!!schedaEdit" @salva="salvaScheda"
            @annulla="annullaEdit" />
        <div v-if="loading">Caricamento...</div>
        <div v-else-if="errore" class="errore">{{ errore }}</div>
        <ul v-else>
            <li v-for="sc in lista" :key="sc.id">
                <strong>{{ sc.nome }}</strong>
                <p>{{ sc.descrizione }}</p>
                <button @click="modifica(sc)">Modifica</button>
                <button @click="elimina(sc.id)">Elimina</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSchedeStore } from '../stores/schede';
import FormScheda from './FormScheda.vue';

const store = useSchedeStore();
const { lista, loading, errore } = store;

const showForm = ref(false);
const schedaEdit = ref(null);

function apriNuova() {
    schedaEdit.value = null;
    showForm.value = true;
}
function modifica(sc) {
    schedaEdit.value = { ...sc };
    showForm.value = true;
}
function annullaEdit() {
    showForm.value = false;
    schedaEdit.value = null;
}
async function salvaScheda(dati) {
    if (schedaEdit.value && schedaEdit.value.id) {
        await store.aggiornaScheda(schedaEdit.value.id, dati);
    } else {
        await store.aggiungiScheda(dati);
    }
    showForm.value = false;
    schedaEdit.value = null;
}
async function elimina(id) {
    if (confirm('Eliminare questa scheda?')) {
        await store.rimuoviScheda(id);
    }
}

onMounted(() => {
    store.caricaSchede();
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
