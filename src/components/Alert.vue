<script setup>
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alerts'
import { 
    CheckCircleIcon, 
    InformationCircleIcon, 
    ExclamationTriangleIcon,
    MinusCircleIcon,
    XMarkIcon
} from '@heroicons/vue/24/solid'

const alerts = useAlertStore()
const { current } = storeToRefs(alerts)

const color = (type) => type === 'success' ? 'bg-emerald-50 text-emerald-800'
    : type === 'info' ? 'bg-sky-50 text-sky-800'
    : type === 'warning' ? 'bg-amber-50 text-amber-800'
    : 'bg-red-50 text-red-800'
</script>

<template>
    <div v-if="current" class="mb-2">
        <div
            class="flex items-center p-4 rounded-lg border shadow-sm border-current/20"
            :class="color(current.type)"
        >
        <div class="mr-3">
            <span v-if="current.type==='success'">
                <check-circle-icon class="w-5" />
            </span>
            <span v-else-if="current.type==='info'">
                <information-circle-icon class="w-5" />
            </span>
            <span v-else-if="current.type==='warning'">
                <exclamation-triangle-icon class="w-5" />
            </span>
            <span v-else>
                <minus-circle-icon class="w-5" />
            </span>
        </div>
        <div class="flex-1">
            <span class="font-medium">{{ current.message }}</span>
        </div>
        <button class="ml-3 px-2 py-1 rounded hover:bg-black/5 cursor-pointer" @click="alerts.dismiss()">
            <x-mark-icon class="w-4" />
        </button>
        </div>
    </div>
</template>