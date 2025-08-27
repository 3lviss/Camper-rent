<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    router.push('/stations')
}
</script>

<template>
    <div>
        <div class="flex items-center mb-8 gap-5">
            <button @click="goBack" class="bg-gray-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer transition-colors hover:bg-gray-600">← Back to Stations</button>
            <h1 class="text-slate-800 m-0">Booking Details</h1>
        </div>
    </div>
</template>