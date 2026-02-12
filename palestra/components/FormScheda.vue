<template>
    <form @submit.prevent="onSubmit">
        <div class="form-header">
            <div>
                <label>Nome scheda</label>
                <input v-model="form.nome" required />
            </div>
            <div>
                <label>Descrizione</label>
                <textarea v-model="form.descrizione" />
            </div>
        </div>
        <div class="dual-list">
            <div class="list-col">
                <input v-model="search" placeholder="Cerca esercizio..." class="search" />
                <div class="list-title">Esercizi disponibili</div>
                <ul>
                    <li v-for="es in eserciziDisponibili" :key="es.id">
                        <button type="button" @click="aggiungiEsercizio(es)">+</button>
                        <span>{{ es.nome }} <em>({{ es.gruppoMuscolare }})</em></span>
                    </li>
                </ul>
            </div>
            <div class="list-col">
                <div class="list-title">Esercizi nella scheda</div>
                <draggable v-model="form.esercizi" item-key="exerciseId" handle=".drag-handle" :animation="200">
                    <template #item="{ element, index }">
                        <div class="draggable-item">
                            <span class="drag-handle">☰</span>
                            <span>{{ getNomeEsercizio(element.exerciseId) }}</span>
                            <input v-model="element.note" placeholder="Note" class="note-input" />
                            <button type="button" @click="rimuoviEsercizio(index)">🗑️</button>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
        <div class="form-footer">
            <button type="submit">{{ isEdit ? 'Salva' : 'Crea' }}</button>
            <button type="button" @click="$emit('annulla')">Annulla</button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import draggable from 'vuedraggable';
import { useEserciziStore } from '../stores/esercizi';

const props = defineProps({
    scheda: Object,
    isEdit: Boolean
});
const emit = defineEmits(['salva', 'annulla']);

const form = ref({ nome: '', descrizione: '', esercizi: [] });
const search = ref('');
const eserciziStore = useEserciziStore();

const eserciziDisponibili = computed(() => {
    return eserciziStore.lista.filter(es =>
        !form.value.esercizi.some(e => e.exerciseId === es.id) &&
        (es.nome.toLowerCase().includes(search.value.toLowerCase()) || es.gruppoMuscolare.toLowerCase().includes(search.value.toLowerCase()))
    );
});

function getNomeEsercizio(id) {
    const es = eserciziStore.lista.find(e => e.id === id);
    return es ? es.nome : '';
}

function aggiungiEsercizio(es) {
    form.value.esercizi.push({ exerciseId: es.id, note: '', ordine: form.value.esercizi.length + 1 });
}
function rimuoviEsercizio(idx) {
    form.value.esercizi.splice(idx, 1);
}

watch(() => props.scheda, (val) => {
    if (val) form.value = { ...val, esercizi: [...val.esercizi] };
    else form.value = { nome: '', descrizione: '', esercizi: [] };
}, { immediate: true });

onMounted(() => {
    if (!eserciziStore.lista.length) eserciziStore.caricaEsercizi();
});

function onSubmit() {
    // Aggiorna ordine
    form.value.esercizi.forEach((e, i) => e.ordine = i + 1);
    emit('salva', { ...form.value });
}
</script>

<style scoped>
.form-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.dual-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.list-col {
    flex: 1 1 220px;
    min-width: 220px;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
}

.list-title {
    font-weight: 600;
    margin-bottom: 8px;
}

.search {
    width: 100%;
    margin-bottom: 8px;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.draggable-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    background: #fff;
    border-radius: 6px;
    padding: 8px;
    box-shadow: 0 1px 2px #0001;
}

.drag-handle {
    cursor: grab;
    font-size: 1.2em;
}

.note-input {
    flex: 1;
    min-width: 80px;
}

.form-footer {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

@media (max-width: 700px) {
    .dual-list {
        flex-direction: column;
    }

    .list-col {
        min-width: 0;
    }
}
</style>
