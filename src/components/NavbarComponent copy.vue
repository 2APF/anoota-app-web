<!-- components/Navbar.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, Sparkles } from 'lucide-vue-next'

defineProps<{
  isScrolled?: boolean
}>()

const isMenuOpen = ref(false)
</script>

<template>
  <nav class="fixed top-0 w-full bg-black/95 backdrop-blur-xl border-b border-yellow-500/20 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <Sparkles class="w-8 h-8 text-yellow-400 animate-pulse" />
          <span class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            MicroExp
          </span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#explorar" class="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">Explorar</a>
          <a href="#destaques" class="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">Destaques</a>
          <a href="#" class="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">Como Funciona</a>
          <a href="#" class="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium">Seja Anfitrião</a>
          <button class="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/50">
            Acessar
          </button>
        </div>

        <!-- Mobile Toggle -->
        <button
          class="md:hidden text-yellow-400"
          @click="isMenuOpen = !isMenuOpen"
        >
          <X v-if="isMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-black/95 backdrop-blur-xl border-t border-yellow-500/20 animate-fadeIn">
      <div class="px-4 py-4 space-y-3">
        <a href="#explorar" class="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-medium">Explorar</a>
        <a href="#destaques" class="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-medium">Destaques</a>
        <a href="#" class="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-medium">Como Funciona</a>
        <a href="#" class="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-medium">Seja Anfitrião</a>
        <button class="w-full bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300">
          Acessar
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>