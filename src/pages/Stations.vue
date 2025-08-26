<script setup>
import Autocomplete from '@/components/Autocomplete.vue'
import { useApi } from '@/composables/useApi'
import { useAlertStore } from '@/stores/alerts'
import { ref, watch } from 'vue'

const api = useApi({ baseURL: 'https://605c94c36d85de00170da8b4.mockapi.io' })
const alerts = useAlertStore()

const suggestions = ref([])
const loading = ref(false)
const input = ref('')
const selectedStation = ref(null)

async function onSearch({ query }) {
    const q = (query ?? '').trim()

    if (!q) {
        suggestions.value = []
        return
    }

    loading.value = true

    try {
        const data = await api.get('/stations')

        suggestions.value = (Array.isArray(data) ? data : []).filter(
            s => s?.name?.toLowerCase().includes(q.toLowerCase())
        )
    } catch (err) {
        suggestions.value = []

        alerts.show({
            status: err?.status ?? -1,
            message: err?.message,
        })
    } finally {
        loading.value = false
    }
}

function onSelect(station) {
    selectedStation.value = station
}

watch(input, (newVal) => {
    const q = (newVal ?? '').trim()
    if (q === '') selectedStation.value = null
})
</script>

<template>
    <div class="max-w-6xl mx-auto px-5 py-5 min-h-[calc(100vh-200px)]">
        <div class="text-center mb-8">
        <h1 class="text-3xl md:text-5xl text-slate-800 mb-3">Station Bookings</h1>
        <p class="text-lg text-gray-600">View and manage bookings for each station</p>
        </div>

        <Autocomplete
            v-model="input"
            :suggestions="suggestions"
            :loading="loading"
            placeholder="Search stations…"
            item-name="name"
            item-key="id"
            @search="onSearch"
            @select="onSelect"
        />

        <div v-if="selectedStation">
            {{ selectedStation.name }}
        </div>
    </div>
</template>