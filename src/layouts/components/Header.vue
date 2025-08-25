<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

const onEsc = e => { if (e.key === 'Escape') close() }

onMounted(() => window.addEventListener('keydown', onEsc))

onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>

<template>
  <header class="bg-slate-800 text-white shadow-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <!-- Logo -->
        <RouterLink
            to="/stations"
            class="text-2xl font-bold hover:text-emerald-400 transition-colors"
        >
            Campervans
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex gap-5">
            <RouterLink to="/stations" class="px-4 py-2 rounded hover:bg-white/10 transition-colors">Stations</RouterLink>
            <RouterLink to="/about" class="px-4 py-2 rounded hover:bg-white/10 transition-colors">About</RouterLink>
            <RouterLink to="/contact" class="px-4 py-2 rounded hover:bg-white/10 transition-colors">Contact</RouterLink>
        </nav>

        <!-- Desktop account -->
        <div class="hidden md:flex items-center">
            <button class="flex gap-2 px-3 py-2 rounded hover:bg-white/10 transition-colors cursor-pointer">
                admin@campervans.com
                <chevron-down-icon class="w-4 text-gray-300" />
            </button>
        </div>

        <!-- Mobile hamburger icon -->
        <bars3-icon
            @click="toggle" 
            class="md:hidden w-5"
        />
    </div>

    <!-- Overlay -->
    <div
        v-show="open"
        class="md:hidden fixed inset-0 bg-black/40 transition-opacity"
        :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @click="close"
    ></div>

    <!-- Mobile panel -->
    <div
        class="md:hidden absolute left-0 right-0 top-0 bg-slate-800 border-t border-slate-700 origin-top transition-all duration-200 ease-out"
        :class="open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'"
        @click.stop
    >
      <div class="flex items-center justify-between p-4 border-b border-slate-700">
        <RouterLink
            to="/stations"
            class="text-2xl font-bold hover:text-emerald-400 transition-colors"
            @click="close"
        >
          Campervans
        </RouterLink>

        <x-mark-icon
            @click="close"
            class="w-5"
        />
      </div>

      <!-- nav links -->
      <nav class="p-4 flex flex-col gap-2">
        <RouterLink to="/stations" class="py-2 rounded hover:bg-white/10 transition-colors" @click="close">Stations</RouterLink>
        <RouterLink to="/about" class="py-2 rounded hover:bg-white/10 transition-colors" @click="close">About</RouterLink>
        <RouterLink to="/contact" class="py-2 rounded hover:bg-white/10 transition-colors" @click="close">Contact</RouterLink>

        <div class="h-px bg-slate-700 my-3"></div>

        <button class="text-left rounded hover:bg-white/10 transition-colors" @click="close">
            admin@campervans.com
        </button>
      </nav>
    </div>
  </header>
</template>
