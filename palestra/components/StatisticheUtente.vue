<template>
    <div>
        <div v-if="loading">Caricamento statistiche...</div>
        <div v-else-if="errore" class="errore">{{ errore }}</div>
        <div
            v-else-if="!summary || typeof summary !== 'object' || summary.sessioni == null || summary.esercizi == null || summary.totalePeso == null">
            <p>Statistiche non disponibili.</p>
        </div>
        <div v-else>
            <div class="summary">
                <div class="summary-item">
                    <div class="summary-label">Sessioni</div>
                    <div class="summary-value">{{ summary.sessioni }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Esercizi</div>
                    <div class="summary-value">{{ summary.esercizi }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Totale peso</div>
                    <div class="summary-value">{{ summary.totalePeso }} kg</div>
                </div>
            </div>
            <div class="grafico-section">
                <label>Storico esercizio:</label>
                <select v-model="exerciseId">
                    <option v-for="es in eserciziStore.lista" :key="es.id" :value="es.id">{{ es.nome }}</option>
                </select>
                <Line v-if="chartData" :data="chartData" :options="chartOptions" class="grafico" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStatsStore } from '../stores/stats';
import { useEserciziStore } from '../stores/esercizi';
import { Line } from 'vue-chartjs';
import {
    Chart,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const statsStore = useStatsStore();
const eserciziStore = useEserciziStore();
const { summary, loading, errore, history } = statsStore;

// fallback per summary se non arriva nulla dal backend
if (summary == null) statsStore.summary = { sessioni: 0, esercizi: 0, totalePeso: 0 };

const exerciseId = ref('');
const userId = ref('1'); // Sostituire con userId reale se serve

const chartData = computed(() => {
    if (!history[exerciseId.value]) return null;
    const dati = history[exerciseId.value];
    return {
        labels: dati.map(d => d.data),
        datasets: [
            {
                label: 'Peso (kg)',
                data: dati.map(d => d.peso),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.2)',
                tension: 0.3,
                fill: true
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: false }
    },
    scales: {
        x: { title: { display: true, text: 'Data' } },
        y: { title: { display: true, text: 'Peso (kg)' } }
    }
};

onMounted(async () => {
    await statsStore.caricaSummary();
    if (!eserciziStore.lista.length) await eserciziStore.caricaEsercizi();
    if (eserciziStore.lista.length) {
        exerciseId.value = eserciziStore.lista[0].id;
    }
});

watch(exerciseId, (val) => {
    if (val) statsStore.caricaHistory(val, userId.value);
}, { immediate: true });
</script>

<style scoped>
.summary {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.summary-item {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    min-width: 120px;
    text-align: center;
    flex: 1 1 120px;
}

.summary-label {
    font-size: 0.95em;
    color: #666;
    margin-bottom: 4px;
}

.summary-value {
    font-size: 1.4em;
    font-weight: 600;
}

.grafico-section {
    margin-top: 32px;
}

.grafico {
    max-width: 100%;
    margin-top: 16px;
}

select {
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-left: 8px;
}

@media (max-width: 700px) {
    .summary {
        flex-direction: column;
        gap: 8px;
    }

    .summary-item {
        min-width: 0;
    }
}
</style>
