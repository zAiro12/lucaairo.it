<template>
    <form @submit.prevent="onSubmit">
        <div class="form-header">
            <div>
                <label>Data</label>
                <input type="date" v-model="form.data" required />
            </div>
            <div>
                <label>Scheda</label>
                <select v-model="form.workoutPlanId" required>
                    <option value="" disabled>Seleziona scheda</option>
                    <option v-for="sc in schedeStore.lista" :key="sc.id" :value="sc.id">{{ sc.nome }}</option>
                </select>
            </div>
        </div>
        <div class="dual-list">
            <div class="list-col">
                <div class="list-title">Esercizi della scheda</div>
                <ul>
                    <li v-for="es in eserciziScheda" :key="es.exerciseId">
                        <span>{{ getNomeEsercizio(es.exerciseId) }}</span>
                        <button type="button" @click="aggiungiSet(es)">Aggiungi serie</button>
                    </li>
                </ul>
            </div>
            <div class="list-col">
                <div class="list-title">Serie inserite</div>
                <draggable v-model="form.sets" item-key="idx" handle=".drag-handle" :animation="200">
                    <template #item="{ element, index }">
                        <div class="draggable-item">
                            <span class="drag-handle">☰</span>
                            <span>{{ getNomeEsercizio(element.exerciseId) }}</span>
                            <input v-model.number="element.serie" type="number" min="1" placeholder="Serie"
                                class="input-small" />
                            <input v-model.number="element.ripetizioni" type="number" min="1" placeholder="Ripetizioni"
                                class="input-small" />
                            <input v-model.number="element.peso" type="number" min="0" step="0.5" placeholder="Peso"
                                class="input-small" />
                            <input v-model="element.recupero" placeholder="Recupero" class="input-small" />
                            <input v-model="element.note" placeholder="Note" class="note-input" />
                            <button type="button" @click="rimuoviSet(index)">🗑️</button>
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
import { useSchedeStore } from '../stores/schede';
import { useEserciziStore } from '../stores/esercizi';

const props = defineProps({
    sessione: Object,
    isEdit: Boolean
});
const emit = defineEmits(['salva', 'annulla']);

const form = ref({ data: '', workoutPlanId: '', sets: [] });
const schedeStore = useSchedeStore();
const eserciziStore = useEserciziStore();

const eserciziScheda = computed(() => {
    const sc = schedeStore.lista.find(s => s.id === form.value.workoutPlanId);
    return sc ? sc.esercizi : [];
});

function getNomeEsercizio(id) {
    const es = eserciziStore.lista.find(e => e.id === id);
    return es ? es.nome : '';
}

function aggiungiSet(es) {
    form.value.sets.push({
        exerciseId: es.exerciseId,
        serie: 1,
        ripetizioni: 10,
        peso: 0,
        recupero: '',
        note: ''
    });
}
function rimuoviSet(idx) {
    form.value.sets.splice(idx, 1);
}

watch(() => props.sessione, (val) => {
    if (val) form.value = { ...val, sets: [...val.sets] };
    else form.value = { data: '', workoutPlanId: '', sets: [] };
}, { immediate: true });

onMounted(() => {
    if (!schedeStore.lista.length) schedeStore.caricaSchede();
    if (!eserciziStore.lista.length) eserciziStore.caricaEsercizi();
});

function onSubmit() {
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

.input-small {
    width: 60px;
    margin-right: 4px;
}

.note-input {
    flex: 1;
    min-width: 80px;
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

    .draggable-item {
        flex-wrap: wrap;
    }
}
</style>
