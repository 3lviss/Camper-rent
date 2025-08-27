<script setup>
const props = defineProps({
    day: {
        type: Object, // { date, dayName, dayNumber, isToday, bookings[] }
        required: true,
    },
    active: { type: Boolean, default: false },   // highlight drop zone
    dragged: { type: Boolean, default: false },  // booking being dragged
    canDrag: { type: Function, required: true },
    formatTime: { type: Function, required: true },
    bookingClass: { type: Function, required: true },
    edgeClass: { type: Function, required: true }, // (booking) => string
    isStartOnDay: { type: Function, required: true },
    isEndOnDay:   { type: Function, required: true },
})

const emit = defineEmits(['dragover', 'dragleave', 'drop', 'booking-click', 'touchstart', 'dragstart', 'dragend'])

const onDragOver = (e) => {
    emit('dragover', e, props.day.date)
}
const onDragLeave = (e) => {
    emit('dragleave', e, e.currentTarget)
}
const onDrop = (e) => {
    emit('drop', e, props.day.date)
}

// Drag handlers
const onDragStart = (e, booking) => {
    emit('dragstart', e, booking)
}

const onDragEnd = (e, booking) => {
    emit('dragend', e, booking)
}

// Touch handlers
const onTouchStart = (e, booking) => {
    emit('touchstart', e, booking)
}

// Handle booking click - only if not dragging
const onBookingClick = (booking, event) => {
    // Check if this was a touch drag or just a click
    const touchMoved = event.target.closest('[data-touch-dragged="true"]')
    if (!touchMoved) {
        emit('booking-click', booking)
    }
}
</script>

<template>
    <div
        class="min-h-[100px] md:min-h-[200px] p-3 flex flex-col"
        :class="day.isToday ? 'bg-teal-50 border-l-4 border-emerald-500' : 'bg-white'"
    >
        <div class="flex md:flex-col justify-center items-center gap-2 mb-3 pb-2 border-b border-gray-100">
            <div class="font-bold text-gray-500 text-sm uppercase">{{ day.dayName }}</div>
            <div class="text-sm md:text-xl font-bold text-slate-800">{{ day.dayNumber }}</div>
        </div>

        <div
            class="flex-1 overflow-y-auto transition-colors"
            data-drop-zone
            :data-zone-date="day.date.toISOString()"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            :class="{ 'bg-emerald-50 border-2 border-dashed border-emerald-500 rounded': active && dragged, 'bg-blue-50 border-2 border-dashed border-blue-500 rounded': dragged && !active }"
        >
            <div
                v-for="booking in day.bookings"
                :key="booking.id"
                @click="onBookingClick(booking, $event)"
                class="p-2 mb-2 rounded border-l-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md booking-item"
                :class="[ 
                    bookingClass(booking), 
                    edgeClass(booking), 
                    { 
                        'cursor-grab active:cursor-grabbing active:opacity-70 active:scale-102 active:transition-all active:duration-100 active:ease-in-out': canDrag(booking),
                        'draggable': canDrag(booking),
                        'no-select': canDrag(booking)
                    } 
                ]"
                :draggable="canDrag(booking)"
                @dragstart="onDragStart($event, booking)"
                @dragend="onDragEnd($event, booking)"
                @touchstart="onTouchStart($event, booking)"
                :data-touch-dragged="false"
            >
                <div class="text-sm font-bold text-slate-800 mb-1">
                    <!-- start time if booking starts on this day -->
                    <template v-if="isStartOnDay(booking, day.date)">
                        <span v-if="formatTime(booking.startDate) !== 'All day'" class="mr-1">⏰</span>
                        <span>{{ formatTime(booking.startDate) }}</span>
                    </template>

                    <!-- separator only if both start and end are on this day -->
                    <span
                        v-if="isStartOnDay(booking, day.date) && isEndOnDay(booking, day.date)"
                        class="mx-2 text-gray-400"
                    >|</span>

                    <!-- end time if booking ends on this day (covers both-only-end and start+end cases) -->
                    <template v-if="isEndOnDay(booking, day.date)">
                        <span v-if="formatTime(booking.endDate) !== 'All day'" class="mr-1">⏰</span>
                        <span>{{ formatTime(booking.endDate) }}</span>
                    </template>
                </div>

                <div class="text-sm text-gray-600">
                    {{ booking.customerName }}
                </div>
            </div>

            <div v-if="day.bookings.length === 0" class="text-center text-gray-400 italic text-sm py-8">
                No bookings
            </div>
        </div>
    </div>
</template>
