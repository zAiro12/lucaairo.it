<template>
    <Navbar />
    <router-view />
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style scoped>
body {
    font-family: 'Inter', sans-serif;
}
</style>
