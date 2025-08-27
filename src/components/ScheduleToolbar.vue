<script setup>
import {
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
    monthText: { type: String, required: true },
    weekNumber: { type: Number, required: true },
    isCurrentWeek: { type: Boolean, default: false },
    hasPrevBooked: { type: Boolean, default: false },
    hasNextBooked: { type: Boolean, default: false },
})

const emit = defineEmits(['prev', 'next', 'today', 'jump-prev', 'jump-next'])
</script>

<template>
    <div class="px-5 py-3 text-center">
        <div class="text-xl md:text-2xl font-semibold text-slate-700">
            {{ monthText }} <span class="font-thin">| Week {{ weekNumber }}</span>
        </div>
    </div>

    <div class="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center gap-2">
            <button @click="$emit('prev')" class="bg-emerald-500 text-white px-3 py-2 rounded-md cursor-pointer text-lg hover:bg-emerald-600">
                <chevron-left-icon class="w-4" />
            </button>
            <button
                @click="$emit('jump-prev')"
                :disabled="!hasPrevBooked"
                class="bg-emerald-500 text-white px-3 py-2 rounded-md cursor-pointer text-sm hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Jump to previous week with bookings"
            >
                <chevron-double-left-icon class="w-4" />
            </button>
        </div>

        <div class="flex items-center gap-2">
            <button
                @click="$emit('today')"
                :disabled="isCurrentWeek"
                class="bg-gray-500 text-white px-3 py-2 rounded-md cursor-pointer text-xs hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Today
            </button>
            <button
                @click="$emit('jump-next')"
                :disabled="!hasNextBooked"
                class="bg-emerald-500 text-white px-3 py-2 rounded-md cursor-pointer text-sm hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Jump to next week with bookings"
            >
                <chevron-double-right-icon class="w-4" />
            </button>
            <button @click="$emit('next')" class="bg-emerald-500 text-white px-3 py-2 rounded-md cursor-pointer text-lg hover:bg-emerald-600">
                <chevron-right-icon class="w-4" />
            </button>
        </div>
    </div>
</template>
