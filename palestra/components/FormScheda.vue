<template>
    <div class="scheda-wrapper">
        <div class="scheda-card">
            <h1 class="titolo">Schede di allenamento</h1>
            <form class="form-scheda" @submit.prevent="creaScheda">
                <div class="input-row">
                    <div class="input-group input-top">
                        <label for="nome">Nome scheda</label>
                        <input
                            v-model="nome"
                            type="text"
                            id="nome"
                            required
                            placeholder="Es. Lunedì petto / schiena"
                        />
                    </div>
                    <div class="input-group input-top">
                        <label for="descrizione">Descrizione</label>
                        <textarea
                            v-model="descrizione"
                            id="descrizione"
                            rows="2"
                            required
                            placeholder="Note generali sulla seduta"
                        ></textarea>
                    </div>
                </div>
                <div class="liste-container">
                    <!-- Box 1: ricerca + aggiunta veloce -->
                    <div class="lista-box">
                        <span class="titolo-lista">Cerca o aggiungi un esercizio</span>
                        <div class="lista-header">
                            <input
                                v-model="search"
                                type="text"
                                autocomplete="off"
                                placeholder="Cerca esercizio..."
                                class="search-input"
                                @keyup.enter.prevent="onSearchEnter"
                            />
                            <button
                                type="button"
                                class="btn btn-secondary btn-small"
                                :disabled="!suggerisciNuovo || !search.trim()"
                                @click="aggiungiNuovoEsercizio"
                            >
                                Aggiungi nuovo
                            </button>
                        </div>
                        <div v-if="suggerisciNuovo" class="suggerimento-nuovo">
                            Nessun esercizio trovato con questo nome.
                            Clicca "Aggiungi nuovo" per creare "{{ search }}".
                        </div>
                    </div>

                    <!-- Box 2: tutti gli esercizi dal DB, scrollabili -->
                    <div class="lista-box lista-box-tutti">
                        <span class="titolo-lista">Tutti gli esercizi</span>
                        <div class="esercizi-list esercizi-list-disponibili">
                            <div v-if="loadingEsercizi">Caricamento esercizi...</div>
                            <div v-else>
                                <ul class="lista-esercizi">
                                    <li
                                        v-for="es in eserciziFiltrati"
                                        :key="es.id"
                                        class="riga-esercizio"
                                        @click="aggiungiEsercizioAllaScheda(es)"
                                    >
                                        {{ es.nome }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Box 3: esercizi presenti nella scheda -->
                    <div class="lista-box">
                        <span class="titolo-lista">Esercizi nella scheda</span>
                        <div class="esercizi-list esercizi-list-scheda">
                            <table v-if="eserciziScheda.length" class="tabella-scheda">
                                <thead>
                                    <tr>
                                        <th>Esercizio</th>
                                        <th>Serie</th>
                                        <th>Recupero (sec)</th>
                                        <th>Peso (kg)</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(riga, idx) in eserciziScheda" :key="riga.id || idx">
                                        <td>{{ riga.nome }}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                v-model.number="riga.serie"
                                                class="input-tabella"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                v-model.number="riga.recupero"
                                                class="input-tabella"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                v-model.number="riga.peso"
                                                class="input-tabella"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                class="btn btn-secondary btn-small"
                                                @click="rimuoviEsercizioDaScheda(idx)"
                                            >
                                                Rimuovi
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else class="vuota-helper">
                                Clicca un esercizio a sinistra per aggiungerlo alla scheda.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottoni">
                    <button type="submit" class="btn btn-primary">Crea</button>
                    <button type="button" class="btn btn-secondary" @click="annulla">Annulla</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useEserciziStore } from '../stores/esercizi';

const eserciziStore = useEserciziStore();

const nome = ref('');
const descrizione = ref('');
const search = ref('');

const suggerisciNuovo = ref(false);

const eserciziScheda = ref([]);

const esercizi = computed(() => eserciziStore.lista || []);
const loadingEsercizi = computed(() => eserciziStore.loading);

const eserciziFiltrati = computed(() => {
    const query = search.value.trim().toLowerCase();
    if (!query) return esercizi.value;
    return esercizi.value.filter((es) =>
        (es.nome || '').toLowerCase().includes(query)
    );
});

watch(
    () => search.value,
    (val) => {
        const query = val.trim().toLowerCase();
        if (!query) {
            suggerisciNuovo.value = false;
            return;
        }

        suggerisciNuovo.value = eserciziFiltrati.value.length === 0;
    }
);

onMounted(async () => {
    if (!eserciziStore.lista.length) {
        await eserciziStore.caricaEsercizi();
    }
});

function onSearchEnter() {
    if (suggerisciNuovo.value && search.value.trim()) {
        aggiungiNuovoEsercizio();
    }
}

function aggiungiEsercizioAllaScheda(es) {
    // evita duplicati semplici per id
    if (eserciziScheda.value.some((r) => r.esercizioId === es.id)) return;

    eserciziScheda.value.push({
        esercizioId: es.id,
        nome: es.nome,
        serie: 3,
        recupero: 60,
        peso: 0,
    });
}

function rimuoviEsercizioDaScheda(index) {
    eserciziScheda.value.splice(index, 1);
}

async function aggiungiNuovoEsercizio() {
    const nomeEsercizio = search.value.trim();
    if (!nomeEsercizio) return;

    try {
        await eserciziStore.aggiungiEsercizio({
            nome: nomeEsercizio,
            descrizione: '',
        });
        // assicuriamoci di avere la lista aggiornata dal db
        await eserciziStore.caricaEsercizi();
        search.value = '';
        suggerisciNuovo.value = false;
        // opzionale: qui potresti emettere un evento per selezionare
        // automaticamente l'esercizio appena creato nella scheda
    } catch (error) {
        console.error('Errore creazione esercizio:', error);
    }
}

function creaScheda() {
    const payload = {
        nome: nome.value,
        descrizione: descrizione.value,
        esercizi: eserciziScheda.value.map((r) => ({
            esercizioId: r.esercizioId,
            serie: r.serie,
            recupero: r.recupero,
            peso: r.peso,
        })),
    };

    // TODO: emettere evento "salva" verso il parent con i dati
    // per ora facciamo solo console.log per non rompere l'API esistente
    console.log('creaScheda payload', payload);
}

function annulla() {
    // logica di annullamento
}
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.scheda-wrapper {
    min-height: 100vh;
    background: #f6f7fb;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.scheda-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 4px 32px 0 rgba(60, 72, 88, 0.13);
    padding: 2.2rem 1.2rem 1.5rem 1.2rem;
    max-width: 540px;
    width: 100%;
    margin-top: 0;
}

.titolo {
    color: #23272f;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
    letter-spacing: -0.5px;
}

.form-scheda {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.input-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.input-group.input-top {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1 1 100%;
}

.input-group.input-top label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #4b5563;
}

.input-group.input-top input,
.input-group.input-top textarea {
    padding: 0.85rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    border: 1.5px solid #d1d5db;
    background: #f9fafb;
    color: #111827;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    pointer-events: auto;
    position: relative;
    z-index: 1;
}

.input-group.input-top input:focus,
.input-group.input-top textarea:focus {
    border-color: #4f8cff;
    background: #ffffff;
    box-shadow: 0 0 0 1px rgba(79, 140, 255, 0.4);
}

.input-group.input-top textarea {
    resize: vertical;
    min-height: 80px;
}


.input-group.input-inline {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.7rem;
}

.input-group.input-inline .input-label {
    min-width: 110px;
    color: #7b7f87;
    font-size: 1rem;
    margin-bottom: 0;
    background: transparent;
    padding: 0;
    text-align: right;
}

.input-group.input-inline input,
.input-group.input-inline textarea {
    flex: 1;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    border: 1.5px solid #cfd8dc;
    border-radius: 8px;
    background: #f8fafd;
    color: #222;
    transition: border 0.2s;
    outline: none;
    box-sizing: border-box;
}

.input-group.input-inline input:focus,
.input-group.input-inline textarea:focus {
    border-color: #4f8cff;
    background: #fff;
}



.input-group input:focus,
.input-group textarea:focus {
    border-color: #4f8cff;
    box-shadow: 0 0 0 2px #e3edff;
}


/* stile base per altre input-group generiche */
.input-group label {
    color: #6b7280;
    font-size: 0.95rem;
}

.liste-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0.5rem 0 0.5rem 0;
}

.lista-box {
    background: #f9fafb;
    border-radius: 14px;
    box-shadow: 0 2px 12px 0 rgba(60, 72, 88, 0.07);
    flex: 1 1 0;
    min-width: 120px;
    min-height: 120px;
    padding: 1rem 1rem 1rem 1rem;

    /* Floating label moderno senza position absolute */
    .input-group {
        display: flex;
        flex-direction: column-reverse;
        position: relative;
        margin-bottom: 1.2rem;
    }

    .input-group input,
    .input-group textarea {
        width: 100%;
        padding: 1.2rem 1rem 0.5rem 1rem;
        font-size: 1rem;
        border: 1.5px solid #cfd8dc;
        border-radius: 12px;
        background: #f8fafd;
        color: #222;
        transition: border 0.2s;
        outline: none;
        box-sizing: border-box;
    }

    .input-group input:focus,
    .input-group textarea:focus {
        border-color: #4f8cff;
        background: #fff;
    }

    .input-group label {
        font-size: 1rem;
        color: #7b7f87;
        margin-left: 1rem;
        margin-bottom: -1.1rem;
        margin-top: 0.2rem;
        background: transparent;
        pointer-events: none;
        transition: all 0.18s cubic-bezier(.4, 0, .2, 1);
        z-index: 1;
        align-self: flex-start;
        padding: 0 0.2rem;
    }

    .input-group input:focus~label,
    .input-group input:not(:placeholder-shown)~label,
    .input-group textarea:focus~label,
    .input-group textarea:not(:placeholder-shown)~label {
        color: #4f8cff;
        font-size: 0.85rem;
        margin-bottom: -2.1rem;
        margin-top: -0.7rem;
        background: #fff;
        padding: 0 0.3rem;
    }

    display: flex;
    flex-direction: column;
}

.lista-header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.6rem;
}

.suggerimento-nuovo {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 0.7rem;
}

.form-nuovo-esercizio {
    background: #f9fafb;
    border-radius: 12px;
    padding: 1rem 1rem 1rem 1rem;
    margin-bottom: 1rem;
    border: 1.5px solid #d1d5db;
    box-shadow: 0 2px 12px 0 rgba(60, 72, 88, 0.07);
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    position: static;
    z-index: auto;
    align-items: stretch;
}

.bottoni-mini {
    display: flex;
    gap: 0.7rem;
    justify-content: flex-start;
    margin-top: 0.7rem;
    flex-wrap: wrap;
    position: static;
    z-index: auto;
}

.bottoni-mini .btn {
    display: inline-block;
    min-width: 100px;
    text-align: center;
    box-shadow: none;
    float: none;
    margin: 0;
}

@media (max-width: 600px) {
    .bottoni-mini .btn {
        width: 100%;
        min-width: 0;
        margin-bottom: 0.5rem;
    }

    .bottoni-mini {
        flex-direction: column;
        align-items: stretch;
    }
}

.btn-small {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    border-radius: 6px;
}

.esercizi-list {
    flex: 1;
}

.esercizi-list-disponibili {
    max-height: 220px;
    overflow-y: auto;
}

.esercizi-list-scheda {
    margin-top: 0.2rem;
}

.lista-box-tutti {
    min-height: 220px;
}

.lista-esercizi {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.riga-esercizio {
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
}

.riga-esercizio:last-child {
    border-bottom: none;
}

.tabella-scheda {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.tabella-scheda th,
.tabella-scheda td {
    padding: 0.35rem 0.3rem;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

.input-tabella {
    width: 70px;
    padding: 0.2rem 0.3rem;
    font-size: 0.9rem;
    border-radius: 5px;
    border: 1px solid #d1d5db;
}

.vuota-helper {
    font-size: 0.9rem;
    color: #6b7280;
}

.search-input {
    flex: 1;
    padding: 0.7rem 1rem;
    border-radius: 7px;
    border: 1px solid #d1d5db;
    background: #fff;
    color: #23272f;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
}

.search-input:focus {
    border-color: #4f8cff;
}

.titolo-lista {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    color: #4b5563;
    margin-left: 0.1rem;
    margin-bottom: 0.25rem;
}

.bottoni {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    flex-wrap: wrap;
    position: static;
    z-index: auto;
}

.btn {
    border: none;
    border-radius: 9px;
    padding: 0.7rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    box-shadow: 0 1px 4px 0 rgba(60, 72, 88, 0.07);
}

.btn-primary {
    background: #4f8cff;
    color: #fff;
}

.btn-primary:hover {
    background: #2563eb;
}

.btn-secondary {
    background: #e5e7eb;
    color: #23272f;
}

.btn-secondary:hover {
    background: #cbd5e1;
}

@media (max-width: 900px) {
    .scheda-card {
        padding: 1rem 0.2rem;
        max-width: 99vw;
    }

    .input-row {
        flex-direction: column;
        gap: 0.7rem;
    }

    .form-nuovo-esercizio {
        padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    }
}

/* DARK MODE */
@media (prefers-color-scheme: dark) {
    .scheda-wrapper {
        background: #181a20;
    }

    .scheda-card {
        background: #23272f;
        box-shadow: 0 4px 32px 0 rgba(0, 0, 0, 0.32);
    }

    .titolo {
        color: #fff;
    }

    .input-group input,
    .input-group textarea {
        background: #262a33;
        color: #e5e7eb;
        border: 1.5px solid #3a3f4a;
    }

    .input-group input:focus,
    .input-group textarea:focus {
        border-color: #4f8cff;
        box-shadow: 0 0 0 2px #22304a;
    }

    .input-group label {
        color: #e5e7eb;
        background: transparent;
    }

    .input-group input:focus+label,
    .input-group input:not(:placeholder-shown)+label,
    .input-group textarea:focus+label,
    .input-group textarea:not(:placeholder-shown)+label {
        color: #4f8cff;
        background: #262a33;
    }

    .lista-box {
        background: #262a33;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.18);
        border: 1.5px solid #3a3f4a;
    }

    .search-input {
        background: #23272f;
        color: #e5e7eb;
        border: 1.5px solid #3a3f4a;
    }

    .search-input:focus {
        border-color: #4f8cff;
    }

    .titolo-lista {
        color: #4f8cff;
    }

    .btn-primary {
        background: #4f8cff;
        color: #fff;
    }

    .btn-secondary {
        background: #353a45;
        color: #e5e7eb;
    }

    .form-nuovo-esercizio {
        background: #3a3f4a;
        border: 1px solid #4a4f5a;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.18);
    }
}
</style>