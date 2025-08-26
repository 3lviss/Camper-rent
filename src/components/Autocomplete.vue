<script setup>
import { ref, watch, onUnmounted } from 'vue'
import Spinner from './Spinner.vue'

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search…' },
    disabled: { type: Boolean, default: false },
    debounceMs: { type: Number, default: 300 },
    minQueryLength: { type: Number, default: 1 },
    suggestions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    itemName: { type: String, default: 'name' },
    itemKey: { type: String, default: 'id' },
})

const emit = defineEmits(['update:modelValue', 'search', 'select', 'open', 'close'])

const searchQuery = ref('')
const showDropdown = ref(false)
const hoveredIndex = ref(-1)
const hasSearched = ref(false)
let debounceTimer = null

const labelOf = (item) => item?.[props.itemName] ?? String(item)
const keyOf = (item, i) => item?.[props.itemKey] ?? i

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal !== searchQuery.value) searchQuery.value = newVal
        if ((newVal ?? '').trim() === '') {
            clearTimeout(debounceTimer)
            showDropdown.value = false
            hoveredIndex.value = -1
            hasSearched.value = false
            emit('search', { query: '', results: [] })
        }
    }, { immediate: true }
)

// Debounced search function
function debouncedSearch(q) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        emit('search', { query: q })
        hasSearched.value = true
    }, props.debounceMs)
}

function handleInput() {
    emit('update:modelValue', searchQuery.value)
    const q = (searchQuery.value ?? '').trim()

    if (q.length === 0) {
        clearTimeout(debounceTimer)
        showDropdown.value = false
        hoveredIndex.value = -1
        hasSearched.value = false
        emit('search', { query: '', results: [] })
        return
    }

    showDropdown.value = true
    hoveredIndex.value = -1

    if (q.length >= props.minQueryLength) {
        debouncedSearch(q)
    }
}

function handleKeydown(e) {
    if (!showDropdown.value || props.suggestions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); hoveredIndex.value = Math.min(hoveredIndex.value + 1, props.suggestions.length - 1) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); hoveredIndex.value = Math.max(hoveredIndex.value - 1, -1) }
    if (e.key === 'Enter' && hoveredIndex.value >= 0) { e.preventDefault(); selectSuggestion(props.suggestions[hoveredIndex.value]) }
    if (e.key === 'Escape') { showDropdown.value = false; hoveredIndex.value = -1 }
}

function selectSuggestion(s) {
    const label = labelOf(s)
    emit('update:modelValue', label)
    emit('select', s)
    hasSearched.value = false
    showDropdown.value = false
    hoveredIndex.value = -1
}

function handleBlur() {
    setTimeout(() => {
        showDropdown.value = false
        hoveredIndex.value = -1
        hasSearched.value = false
        emit('close')
    }, 200)
}

onUnmounted(() => clearTimeout(debounceTimer))
</script>

<template>
    <div class="relative">
        <div class="relative w-full md:w-3xl mx-auto">
            <input
                :placeholder="placeholder"
                :disabled="disabled"
                type="text"
                v-model="searchQuery"
                autocomplete="off"
                @input="handleInput"
                @focus="showDropdown = true; emit('open')"
                @blur="handleBlur"
                @keydown="handleKeydown"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <!-- Results -->
            <div v-if="showDropdown && suggestions.length > 0"
                class="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 border-t-0 rounded-b-lg max-h-48 overflow-y-auto z-50 shadow-lg">
                <div v-for="(s,i) in suggestions" :key="keyOf(s,i)"
                    @click="selectSuggestion(s)"
                    @mouseenter="hoveredIndex = i"
                    :class="['px-4 py-3 cursor-pointer transition-colors', { 'bg-gray-50': hoveredIndex === i }]"
                >
                    {{ labelOf(s) }}
                </div>
            </div>

            <!-- Empty -->
            <div v-if="showDropdown && suggestions.length === 0 && searchQuery && hasSearched && !loading"
                class="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 border-t-0 rounded-b-lg z-50 shadow-lg">
                <div class="px-4 py-3 text-gray-500 italic">No results found</div>
            </div>

            <!-- Loading -->
            <div v-if="showDropdown && searchQuery && loading"
                class="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 border-t-0 rounded-b-lg z-50 shadow-lg">
                <div class="px-4 py-3 text-gray-500 italic">
                    <Spinner />
                    Searching…
                </div>
            </div>
        </div>
    </div>
</template>
