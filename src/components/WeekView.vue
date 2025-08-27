<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDragAndDrop } from '../composables/useDragAndDrop'
import { useWeekNavigation } from '../composables/useWeekNavigation'
import { useWeekData } from '../composables/useWeekData'
import { useBookingDisplay } from '../composables/useBookingDisplay'
import { useStationsStore } from '@/stores/stations'
import ScheduleToolbar from './ScheduleToolbar.vue'
import DayColumn from './DayColumn.vue'

const props = defineProps({
    selectedDate: {
        type: Date,
        default: () => new Date()
    },
    selectedStation: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['week-change', 'booking-moved'])

const stations = useStationsStore()
const router = useRouter()

// Get bookings from store
const stationBookings = computed(() => {
    if (!props.selectedStation?.id) return []
    return stations.getBookings(props.selectedStation.id)
})

// Drag and drop logic
const canDragBooking = (booking) => {
    const startDate = new Date(booking.startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startDate >= today
}

const {
    draggedItem,
    isZoneActive,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
} = useDragAndDrop({
    canDrag: canDragBooking,
})

// Week navigation
const {
    currentWeekStart,
    getWeekStart,
    previousWeek,
    nextWeek,
    goToToday,
    isCurrentWeek,
    weekNumber
} = useWeekNavigation(props.selectedDate, (date) => emit('week-change', date))

// Week data
const {
    hasPreviousBookedWeek,
    hasNextBookedWeek,
    jumpToPreviousBookedWeek,
    jumpToNextBookedWeek,
    weekDays,
    monthDisplayText
} = useWeekData(stationBookings, currentWeekStart, getWeekStart)

// Booking display
const {
    formatTime,
    getBookingClass,
    getEdgeClass,
    isStartOnDay,
    isEndOnDay
} = useBookingDisplay()

// Navigation handlers
const handlePreviousWeek = () => {
    const targetDate = jumpToPreviousBookedWeek()
    if (targetDate) {
        currentWeekStart.value = targetDate
        emit('week-change', targetDate)
    }
}

const handleNextWeek = () => {
    const targetDate = jumpToNextBookedWeek()
    if (targetDate) {
        currentWeekStart.value = targetDate
        emit('week-change', targetDate)
    }
}

// Booking selection
const selectBooking = (booking) => {
    router.push(`/stations/${props.selectedStation.id}/bookings/${booking.id}`)
}

// Listen for touch drop events
onMounted(() => {
    document.addEventListener('touch-drop', (event) => {
        const payload = event.detail
        emit('booking-moved', {
            bookingId: payload.bookingId,
            newStartDate: payload.newStartDate,
            newEndDate: payload.newEndDate,
            originalStartDate: payload.originalStartDate,
            originalEndDate: payload.originalEndDate,
        })
    })
})
</script>

<template>
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <schedule-toolbar
            :month-text="monthDisplayText"
            :week-number="weekNumber"
            :is-current-week="isCurrentWeek"
            :has-prev-booked="hasPreviousBookedWeek"
            :has-next-booked="hasNextBookedWeek"
            @prev="previousWeek"
            @next="nextWeek"
            @today="goToToday"
            @jump-prev="handlePreviousWeek"
            @jump-next="handleNextWeek"
        />
    
        <div class="grid grid-cols-1 md:grid-cols-7 gap-px bg-gray-200">
            <day-column
                v-for="day in weekDays"
                :key="day.date.getTime()"
                :day="day"
                :active="isZoneActive(day.date)"
                :dragged="!!draggedItem"
                :can-drag="canDragBooking"
                :format-time="formatTime"
                :booking-class="getBookingClass"
                :edge-class="(b) => getEdgeClass(b, day.date)"
                :is-start-on-day="isStartOnDay"
                :is-end-on-day="isEndOnDay"
                @dragstart="(e, booking) => onDragStart(e, booking)"
                @dragend="(e, booking) => onDragEnd(e, booking)"
                @dragover="(e) => onDragOver(e, day.date)"
                @dragleave="(e, el) => onDragLeave(e, el)"
                @drop="(e) => onDrop(e, day.date, (p) => emit('booking-moved', {
                    bookingId: p.bookingId,
                    newStartDate: p.newStartDate,
                    newEndDate: p.newEndDate,
                    originalStartDate: p.originalStartDate,
                    originalEndDate: p.originalEndDate,
                }))"
                @touchstart="(e, booking) => onTouchStart(e, booking)"
                @booking-click="selectBooking"
            />
        </div>
    </div>
</template>
