<template>
    <div class="scheda-wrapper">
        <div class="scheda-card">
            <h1 class="titolo">Schede di allenamento</h1>
            <form class="form-scheda" @submit.prevent="creaScheda">
                <div class="input-row">
                    <div class="input-group">
                        <input v-model="nome" type="text" id="nome" required placeholder=" " />
                        <label for="nome">Nome scheda</label>
                    </div>
                    <div class="input-group">
                        <textarea v-model="descrizione" id="descrizione" rows="2" required placeholder=" "></textarea>
                        <label for="descrizione">Descrizione</label>
                    </div>
                </div>
                <div class="liste-container">
                    <div class="lista-box">
                        <div class="lista-header">
                            <input v-model="search" placeholder="Cerca esercizio..." class="search-input" />
                            <span class="titolo-lista">Esercizi disponibili</span>
                            <button type="button" class="btn btn-secondary btn-small"
                                @click="mostraFormEsercizio = !mostraFormEsercizio">
                                {{ mostraFormEsercizio ? 'Annulla' : 'Aggiungi nuovo' }}
                            </button>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.7rem;">
                            <div v-if="mostraFormEsercizio" class="form-nuovo-esercizio">
                                <div class="input-group input-inline">
                                    <label for="nuovo-nome" class="input-label">Nome esercizio</label>
                                    <input v-model="nuovoEsercizio.nome" id="nuovo-nome" type="text" required />
                                </div>
                                <div class="input-group input-inline">
                                    <label for="nuova-descrizione" class="input-label">Descrizione</label>
                                    <textarea v-model="nuovoEsercizio.descrizione" id="nuova-descrizione"
                                        rows="2"></textarea>
                                </div>
                                <div class="bottoni-mini">
                                    <button type="button" class="btn btn-primary btn-small"
                                        @click="aggiungiNuovoEsercizio">Salva</button>
                                    <button type="button" class="btn btn-secondary btn-small"
                                        @click="annullaNuovoEsercizio">Annulla</button>
                                </div>
                            </div>
                            <div class="esercizi-list">
                                <slot name="disponibili"></slot>
                            </div>
                        </div>
                    </div>
                    <div class="lista-box">
                        <div class="lista-header">
                            <span class="titolo-lista">Esercizi nella scheda</span>
                        </div>
                        <div class="esercizi-list">
                            <slot name="selezionati"></slot>
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
import { ref } from 'vue';
import { useEserciziStore } from '../stores/esercizi';

const eserciziStore = useEserciziStore();

const nome = ref('');
const descrizione = ref('');
const search = ref('');

const nuovoEsercizio = ref({ nome: '', descrizione: '' });
const mostraFormEsercizio = ref(false);

async function aggiungiNuovoEsercizio() {
    if (nuovoEsercizio.value.nome.trim()) {
        try {
            await eserciziStore.aggiungiEsercizio(nuovoEsercizio.value);
            nuovoEsercizio.value = { nome: '', descrizione: '' };
            mostraFormEsercizio.value = false;
            // Emetti evento per selezionare automaticamente il nuovo esercizio nella scheda
            // (assumendo che il parent gestisca la selezione)
        } catch (error) {
            console.error('Errore creazione esercizio:', error);
        }
    }
}

function annullaNuovoEsercizio() {
    nuovoEsercizio.value = { nome: '', descrizione: '' };
    mostraFormEsercizio.value = false;
}

function creaScheda() {
    // logica di creazione scheda
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


.input-group label {
    color: #7b7f87;
    font-size: 1rem;
    pointer-events: none;
    background: transparent;
    transition: 0.2s cubic-bezier(.4, 0, .2, 1);
    padding: 0 0.2rem;
    position: static;
    left: unset;
    top: unset;
}


.input-group input:focus+label,
.input-group input:not(:placeholder-shown)+label,
.input-group textarea:focus+label,
.input-group textarea:not(:placeholder-shown)+label {
    font-size: 0.95rem;
    color: #4f8cff;
    background: #fff;
}

.liste-container {
    display: flex;
    gap: 1.2rem;
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
    margin-bottom: 1rem;
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
    min-height: 60px;
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
    font-weight: 600;
    font-size: 1.1rem;
    color: #4f8cff;
    margin-left: 0.2rem;
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

    .liste-container {
        flex-direction: column;
        gap: 1rem;
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