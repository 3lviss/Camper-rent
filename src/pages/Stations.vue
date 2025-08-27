<script setup>
import Autocomplete from '@/components/Autocomplete.vue'
import WeekView from '@/components/WeekView.vue'
import { useApi } from '@/composables/useApi'
import { useAlertStore } from '@/stores/alerts'
import { useStationsStore } from '@/stores/stations'
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const api = useApi({ baseURL: 'https://605c94c36d85de00170da8b4.mockapi.io' })
const alerts = useAlertStore()
const stations = useStationsStore()
const { selectedStationId, selectedWeekStartISO } = storeToRefs(stations)

const suggestions = ref([])
const loading = ref(false)
const selectedStationName = ref('')
const selectedStation = ref(null)
const currentDate = ref(new Date())

// Restore persisted week start if present
if (selectedWeekStartISO.value) {
    const restored = new Date(selectedWeekStartISO.value)
    if (!isNaN(restored)) currentDate.value = restored
}

const onSearch = async ({ query }) => {
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

const onSelect = async (station) => {
    selectedStation.value = station
    selectedStationName.value = station?.name ?? ''
    stations.setSelectedStationId(station?.id ?? null)
    
    // Load bookings for the selected station
    await loadBookings(station.id)
}

const loadBookings = async (stationId) => {
    try {
        const data = await api.get(`/stations/${stationId}/bookings`)
        stations.setBookings(stationId, data || [])
    } catch (err) {
        alerts.show({
            status: err?.status ?? -1,
            message: `Failed to load bookings: ${err?.message}`,
        })
    }
}

const onBookingMoved = async (payload) => {
    const { bookingId, newStartDate, newEndDate } = payload
    
    if (!selectedStation.value) return
    
    const result = await stations.rescheduleBooking(
        selectedStation.value.id,
        bookingId,
        newStartDate,
        newEndDate
    )
    
    if (result.success) {
        alerts.show({
            type: 'success',
            message: 'Booking rescheduled successfully!',
            timeout: 3000
        })
    } else {
        alerts.show({
            type: 'error',
            message: `Failed to reschedule booking: ${result.error}`,
        })
    }
}

const onWeekChange = (newDate) => {
    currentDate.value = newDate
    stations.setSelectedWeekStart(newDate)
}

watch(selectedStationName, (newVal) => {
    const q = (newVal ?? '').trim()
    if (q === '') selectedStation.value = null
})

onMounted(async () => {
    if (selectedStationId.value) {
        try {
            const data = await api.get('/stations')

            const found = data.find(s => String(s.id) === String(selectedStationId.value))
            if (found) {
                selectedStation.value = found
                selectedStationName.value = found.name
            }
        } catch (e) {
        // ignore restore errors
        }
    }
})
</script>

<template>
    <div class="max-w-6xl mx-auto px-5 py-5 min-h-[calc(100vh-200px)]">
        <div class="text-center mb-8">
            <h1 class="text-3xl md:text-5xl text-slate-800 mb-3">Station Bookings</h1>
            <p class="text-lg text-gray-600">View and manage bookings for each station</p>
        </div>

        <Autocomplete
            class="mb-8"
            v-model="selectedStationName"
            :suggestions="suggestions"
            :loading="loading"
            placeholder="Search stations…"
            item-name="name"
            item-key="id"
            @search="onSearch"
            @select="onSelect"
        />

        <WeekView
            v-if="selectedStation"
            :selected-station="selectedStation"
            :selected-date="currentDate"
            @week-change="onWeekChange"
            @booking-moved="onBookingMoved"
        />
    </div>
</template>