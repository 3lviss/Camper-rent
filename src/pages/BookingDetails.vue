<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAlertStore } from '@/stores/alerts'
import { useStationsStore } from '@/stores/stations'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const alerts = useAlertStore()
const stations = useStationsStore()
const api = useApi({ baseURL: 'https://605c94c36d85de00170da8b4.mockapi.io' })

const booking = ref(null)
const error = ref(null)

const stationId = computed(() => route.params.stationId)
const bookingId = computed(() => route.params.bookingId)
const stationName = computed(() => stations.getStationName(stationId.value))

const isBookingActive = computed(() => {
    if (!booking.value) return false
    return new Date(booking.value.endDate) > new Date()
})

const goBack = () => {
    router.push('/stations')
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A'
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day'
    return `${diffDays} days`
}

const loadBookingDetails = async () => {
    error.value = null
    
    try {
        const data = await api.get(`/stations/${stationId.value}/bookings/${bookingId.value}`)
        booking.value = data
    } catch (err) {
        error.value = err.message || 'Failed to load booking details'
        alerts.show({
            type: 'error',
            message: `Failed to load booking details: ${err.message}`,
        })
    }
}

onMounted(() => {
    loadBookingDetails()
})
</script>

<template>
    <div class="max-w-4xl mx-auto p-6">
        <div class="flex items-center mb-8 gap-5">
            <button 
                @click="goBack" 
                class="bg-gray-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer transition-colors hover:bg-gray-600"
            >
                ← Back to Stations
            </button>
            <h1 class="text-slate-800 m-0 text-3xl font-bold">Booking Details</h1>
        </div>

        <!-- Booking Details -->
        <div v-if="booking" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <h2 class="text-xl font-semibold text-white">Booking #{{ booking.id }}</h2>
            </div>
            
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Customer Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Customer Information
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                                <p class="mt-1 text-lg text-gray-900">{{ booking.customerName }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Station ID</label>
                                <p class="mt-1 text-lg text-gray-900">{{ stationName }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Booking Duration -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            Booking Duration
                        </h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Duration</label>
                                <p class="mt-1 text-lg text-gray-900">{{ calculateDuration(booking.startDate, booking.endDate) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dates -->
                <div class="mt-8 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Booking Dates
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Start Date</label>
                            <p class="mt-1 text-lg text-gray-900">{{ formatDate(booking.startDate) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">End Date</label>
                            <p class="mt-1 text-lg text-gray-900">{{ formatDate(booking.endDate) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="mt-8">
                    <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Booking Status
                    </h3>
                    <div class="flex justify-between items-center rounded-full text-sm font-medium">
                        <div 
                            :class="{
                                'bg-green-100 text-green-800': isBookingActive,
                                'bg-red-100 text-red-800': !isBookingActive
                            }"
                            class="px-3 py-1 rounded-full"
                        >
                            {{ isBookingActive ? 'Active' : 'Completed' }}
                        </div>

                        <button
                            v-if="isBookingActive"
                            class="inline-flex gap-1 items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none transition-colors cursor-pointer"
                        >
                            <pencil-square-icon class="w-5" />
                            Edit Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- No Booking Found -->
        <div v-if="error" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">No booking found</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                        The booking you're looking for doesn't exist or has been removed.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>