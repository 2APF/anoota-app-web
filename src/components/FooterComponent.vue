<!-- views/HowItWorks.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
    <!-- NavbarComponet -->
    <NavbarComponet />

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none"></div>
      <div class="absolute top-20 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div class="max-w-7xl mx-auto text-center relative z-10">
        <h1 class="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
          COMO FUNCIONA?
        </h1>
        <p class="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Em <span class="text-yellow-400 font-bold">3 passos simples</span>, você transforma qualquer momento livre em uma <span class="text-yellow-400 font-bold">experiência épica</span>.
        </p>
      </div>
    </section>

    <!-- Step by Step -->
    <section class="px-4 pb-32">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-12">
          <!-- Step 1 -->
          <div class="group relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-white/5 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-10 text-center hover:border-yellow-400/70 transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-400/20">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl font-black text-black shadow-xl">
                1
              </div>
              <h3 class="text-3xl font-black mb-4 text-yellow-400">ESCOLHA</h3>
              <p class="text-gray-300 leading-relaxed">
                Navegue por <span class="text-yellow-400 font-bold">centenas de micro-experiências</span> de até 1 hora. Filtro por categoria, duração ou localização.
              </p>
              <div class="mt-6 flex justify-center">
                <Search class="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="group relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-white/5 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-10 text-center hover:border-yellow-400/70 transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-400/20">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl font-black text-black shadow-xl">
                2
              </div>
              <h3 class="text-3xl font-black mb-4 text-yellow-400">RESERVE</h3>
              <p class="text-gray-300 leading-relaxed">
                Escolha o horário, pague em <span class="text-yellow-400 font-bold">segundos</span> e receba confirmação instantânea. Sem burocracia.
              </p>
              <div class="mt-6 flex justify-center">
                <Calendar class="w-12 h-12 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="group relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative bg-white/5 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-10 text-center hover:border-yellow-400/70 transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-yellow-400/20">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl font-black text-black shadow-xl">
                3
              </div>
              <h3 class="text-3xl font-black mb-4 text-yellow-400">VIVA</h3>
              <p class="text-gray-300 leading-relaxed">
                Chegue, curta, aprenda, sinta. <span class="text-yellow-400 font-bold">60 minutos que valem por um dia inteiro.</span>
              </p>
              <div class="mt-6 flex justify-center">
                <Sparkles class="w-12 h-12 text-yellow-400 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Extra Explanation -->
    <section class="px-4 pb-32 bg-gradient-to-t from-yellow-400/5 to-transparent">
      <div class="max-w-5xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Por que MicroExp?
            </h2>
            <ul class="space-y-6 text-lg text-gray-300">
              <li class="flex items-start space-x-4">
                <CheckCircle class="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <strong class="text-white">Experiências curtas</strong> – até 1 hora
                </div>
              </li>
              <li class="flex items-start space-x-4">
                <CheckCircle class="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <strong class="text-white">100% local</strong> – com anfitriões da sua cidade
                </div>
              </li>
              <li class="flex items-start space-x-4">
                <CheckCircle class="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <strong class="text-white">Pagamento seguro</strong> – só pague após confirmação
                </div>
              </li>
              <li class="flex items-start space-x-4">
                <CheckCircle class="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <strong class="text-white">Avaliações reais</strong> – só de quem viveu
                </div>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-3xl p-12 text-center backdrop-blur-sm border border-yellow-400/30">
              <h3 class="text-3xl font-black mb-4">Pronto para viver?</h3>
              <p class="text-xl text-gray-300 mb-8">Comece agora. Sua próxima experiência está a 1 clique.</p>
              <button class="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-10 py-5 rounded-full font-black text-xl hover:shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-300">
                Explorar Experiências
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { Search, Calendar, Sparkles, CheckCircle } from 'lucide-vue-next'
</script>

<style scoped>
@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
.animate-spin-slow {
  animation: spin 15s linear infinite;
}
</style>