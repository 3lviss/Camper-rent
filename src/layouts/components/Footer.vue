<script setup>
import { PhoneIcon, AtSymbolIcon, ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/solid';
</script>

<template>
    <footer class="bg-slate-800 text-white py-10 mt-auto">
        <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h4 class="text-2xl text-emerald-400 font-semibold">Campervans</h4>
                </div>
            <div>

            <h4 class="text-emerald-400 font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
                <li><router-link to="/stations" class="text-gray-300 hover:text-emerald-400 transition-colors">Find Stations</router-link></li>
                <li><router-link to="/about" class="text-gray-300 hover:text-emerald-400 transition-colors">About Us</router-link></li>
                <li><router-link to="/contact" class="text-gray-300 hover:text-emerald-400 transition-colors">Contact</router-link></li>
            </ul>
        </div>

        <div>
            <h4 class="text-emerald-400 font-semibold mb-4">Support</h4>
            <ul class="space-y-2">
                <li><a href="#" class="text-gray-300 hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" class="text-gray-300 hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" class="text-gray-300 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
        </div>

        <div>
            <h4 class="text-emerald-400 font-semibold mb-4">Connect</h4>
            <div class="flex gap-4">
                <a href="#" class="text-2xl text-gray-300 hover:text-emerald-400 transition-colors">
                    <phone-icon class="w-5 text-gray-300" />
                </a>
                <a href="#" class="text-2xl text-gray-300 hover:text-emerald-400 transition-colors">
                    <at-symbol-icon class="w-5 text-gray-300" />
                </a>
                <a href="#" class="text-2xl text-gray-300 hover:text-emerald-400 transition-colors">
                    <chat-bubble-bottom-center-icon class="w-5 text-gray-300" />
                </a>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-700 pt-5 text-center">
            <p class="text-gray-400">&copy; 2025 Campervans.</p>
        </div>
      </div>
    </footer>
</template>