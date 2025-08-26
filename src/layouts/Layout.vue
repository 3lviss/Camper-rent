<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Alert from '@/components/Alert.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <Header />

        <main class="flex-1 bg-gray-50 p-4">
            <Alert />

            <router-view />
        </main>

        <Footer />
    </div>
</template>
