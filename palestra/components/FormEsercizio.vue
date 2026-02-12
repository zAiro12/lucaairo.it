<template>
    <form @submit.prevent="onSubmit">
        <div>
            <label>Nome</label>
            <input v-model="form.nome" required />
        </div>
        <div>
            <label>Gruppo muscolare</label>
            <input v-model="form.gruppoMuscolare" required />
        </div>
        <div>
            <label>Descrizione</label>
            <textarea v-model="form.descrizione" />
        </div>
        <button type="submit">{{ isEdit ? 'Salva' : 'Aggiungi' }}</button>
        <button v-if="isEdit" type="button" @click="$emit('annulla')">Annulla</button>
    </form>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';
const props = defineProps({
    esercizio: Object,
    isEdit: Boolean
});
const emit = defineEmits(['salva', 'annulla']);

const form = ref({ nome: '', gruppoMuscolare: '', descrizione: '' });

watch(() => props.esercizio, (val) => {
    if (val) form.value = { ...val };
    else form.value = { nome: '', gruppoMuscolare: '', descrizione: '' };
}, { immediate: true });

function onSubmit() {
    emit('salva', { ...form.value });
    if (!props.isEdit) form.value = { nome: '', gruppoMuscolare: '', descrizione: '' };
}
</script>

<style scoped>
form {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px #0001;
    margin-bottom: 16px;
}

div {
    margin-bottom: 10px;
}

label {
    display: block;
    font-weight: 500;
    margin-bottom: 4px;
}

input,
textarea {
    width: 100%;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

button {
    margin-right: 8px;
}
</style>
