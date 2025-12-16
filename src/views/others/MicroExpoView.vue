<!-- views/HomePage.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
// import { Search, Clock, MapPin, Star, Filter, TrendingUp, Sparkles, Heart } from 'lucide-vue-next'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

interface Experience {
  id: number
  title: string
  host: string
  category: string
  duration: string
  price: string
  rating: number
  reviews: number
  image: string
  location: string
  featured: boolean
}

const selectedCategory = ref('Todas')
const selectedDuration = ref('Todas')
const searchQuery = ref('')
const typedText = ref('')
const typedIndex = ref(0)
const isDeleting = ref(false)
const showFilters = ref(false)

const phrases = [
  'Aula de Culinária',
  'Tour Fotográfico',
  'Sessão de Yoga',
  'Workshop de Arte',
  'Degustação Local'
]

const categories = ['Todas', 'Gastronomia', 'Arte', 'Bem-estar', 'Fotografia', 'Música', 'Artesanato']
const durations = ['Todas', '30min', '45min', '1h']

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Degustação de Café Especial',
    host: 'Maria Silva',
    category: 'Gastronomia',
    duration: '45min',
    price: '2500 Kz',
    rating: 4.9,
    reviews: 124,
    image: 'coffee',
    location: 'Talatona',
    featured: true
  },
  {
    id: 2,
    title: 'Tour Fotográfico Urbano',
    host: 'João Costa',
    category: 'Fotografia',
    duration: '1h',
    price: '3000 Kz',
    rating: 5.0,
    reviews: 89,
    image: 'camera',
    location: 'Cidade Baixa',
    featured: true
  },
  {
    id: 3,
    title: 'Yoga ao Pôr do Sol',
    host: 'Ana Ribeiro',
    category: 'Bem-estar',
    duration: '1h',
    price: '2000 Kz',
    rating: 4.8,
    reviews: 156,
    image: 'yoga',
    location: 'Ilha de Luanda',
    featured: false
  },
  {
    id: 4,
    title: 'Workshop de Pintura',
    host: 'Carlos Neto',
    category: 'Arte',
    duration: '1h',
    price: '3500 Kz',
    rating: 4.7,
    reviews: 67,
    image: 'paintbrush',
    location: 'Maianga',
    featured: true
  },
  {
    id: 5,
    title: 'Aula de Percussão',
    host: 'Pedro Manuel',
    category: 'Música',
    duration: '45min',
    price: '2800 Kz',
    rating: 4.9,
    reviews: 92,
    image: 'drum',
    location: 'Viana',
    featured: false
  },
  {
    id: 6,
    title: 'Origami Criativo',
    host: 'Lúcia Santos',
    category: 'Artesanato',
    duration: '30min',
    price: '1500 Kz',
    rating: 4.6,
    reviews: 43,
    image: 'crane',
    location: 'Miramar',
    featured: false
  }
]

const filteredExperiences = computed(() => {
  return experiences.filter(exp => {
    const matchCategory = selectedCategory.value === 'Todas' || exp.category === selectedCategory.value
    const matchDuration = selectedDuration.value === 'Todas' || exp.duration === selectedDuration.value
    const matchSearch = exp.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       exp.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchDuration && matchSearch
  })
})

const featuredExperiences = computed(() => {
  return filteredExperiences.value.filter(exp => exp.featured)
})

let typingInterval: number | null = null

const startTyping = () => {
  typingInterval = window.setInterval(() => {
    const currentPhrase = phrases[typedIndex.value]
    
    if (!isDeleting.value) {
      if (typedText.value.length < currentPhrase.length) {
        typedText.value = currentPhrase.slice(0, typedText.value.length + 1)
      } else {
        setTimeout(() => {
          isDeleting.value = true
        }, 2000)
      }
    } else {
      if (typedText.value.length > 0) {
        typedText.value = currentPhrase.slice(0, typedText.value.length - 1)
      } else {
        isDeleting.value = false
        typedIndex.value = (typedIndex.value + 1) % phrases.length
      }
    }
  }, isDeleting.value ? 50 : 100)
}

onMounted(() => {
  startTyping()
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">
    <!-- NavbarComponent -->
    <NavbarComponent />

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent pointer-events-none"></div>
      <div class="absolute top-20 left-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
     
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-12">
          <div class="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6 animate-fadeIn">
            <TrendingUp class="w-4 h-4 text-yellow-400" />
            <span class="text-sm text-yellow-400 font-medium">Mais de 500 experiências disponíveis</span>
          </div>
         
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transforme seu<br />
            <span class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient">
              Tempo Livre
            </span>
          </h1>
         
          <p class="text-xl md:text-2xl text-gray-300 mb-4">
            em momentos memoráveis com
          </p>
         
          <div class="text-3xl md:text-4xl font-bold text-yellow-400 h-16 flex items-center justify-center">
            {{ typedText }}<span class="animate-blink ml-1">|</span>
          </div>
         
          <p class="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
            Experiências únicas de até 1 hora. Perfeito para o almoço, intervalos ou fins de semana.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-3 shadow-2xl">
          <div class="flex flex-col md:flex-row gap-3">
            <div class="flex-1 relative">
              <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="O que você quer experimentar?"
                v-model="searchQuery"
                class="w-full bg-black/50 border border-yellow-400/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-all duration-300"
              />
            </div>
            <button
              @click="showFilters = !showFilters"
              class="md:hidden flex items-center justify-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-6 py-4 hover:bg-yellow-400/20 transition-all duration-300"
            >
              <Filter class="w-5 h-5 text-yellow-400" />
              <span class="font-medium">Filtros</span>
            </button>
            <button class="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/30">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="px-4 pb-12" id="explorar">
      <div class="max-w-7xl mx-auto">
        <div :class="[showFilters ? 'block' : 'hidden', 'md:block']" class="bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 mb-8 animate-fadeIn">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-3">Categoria</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  @click="selectedCategory = cat"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    selectedCategory === cat
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50'
                      : 'bg-white/5 text-gray-300 border border-yellow-400/20 hover:border-yellow-400/50 hover:bg-white/10'
                  ]"
                >
                  {{ cat }}
                </button>
              </div>
            </div>
           
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-3">Duração</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="dur in durations"
                  :key="dur"
                  @click="selectedDuration = dur"
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    selectedDuration === dur
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50'
                      : 'bg-white/5 text-gray-300 border border-yellow-400/20 hover:border-yellow-400/50 hover:bg-white/10'
                  ]"
                >
                  {{ dur }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Experiences -->
    <section v-if="featuredExperiences.length > 0" class="px-4 pb-12" id="destaques">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center space-x-3 mb-8">
          <Sparkles class="w-6 h-6 text-yellow-400" />
          <h2 class="text-3xl font-bold">Destaques da Semana</h2>
        </div>
       
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(exp, index) in featuredExperiences"
            :key="exp.id"
            class="group bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 animate-fadeIn"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="relative">
              <div class="aspect-video bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center text-6xl">
                {{ exp.image }}
              </div>
              <div class="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                Destaque
              </div>
              <button class="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <Heart class="w-5 h-5 text-white" />
              </button>
            </div>
           
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-xl font-bold mb-1 group-hover:text-yellow-400 transition-colors">{{ exp.title }}</h3>
                  <p class="text-sm text-gray-400">por {{ exp.host }}</p>
                </div>
              </div>
             
              <div class="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div class="flex items-center space-x-1">
                  <Clock class="w-4 h-4" />
                  <span>{{ exp.duration }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <MapPin class="w-4 h-4" />
                  <span>{{ exp.location }}</span>
                </div>
              </div>
             
              <div class="flex items-center justify-between pt-4 border-t border-yellow-400/20">
                <div class="flex items-center space-x-2">
                  <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span class="font-bold">{{ exp.rating }}</span>
                  <span class="text-sm text-gray-400">({{ exp.reviews }})</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-yellow-400">{{ exp.price }}</div>
                </div>
              </div>
             
              <button class="w-full mt-4 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-300 transform group-hover:scale-105">
                Reservar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Experiences -->
    <section class="px-4 pb-20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-8">
          Todas as Experiências
          <span class="text-yellow-400 ml-3">({{ filteredExperiences.length }})</span>
        </h2>
       
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(exp, index) in filteredExperiences"
            :key="exp.id"
            class="group bg-white/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 animate-fadeIn"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="relative">
              <div class="aspect-video bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center text-6xl">
                {{ exp.image }}
              </div>
              <button class="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <Heart class="w-5 h-5 text-white" />
              </button>
            </div>
           
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-xl font-bold mb-1 group-hover:text-yellow-400 transition-colors">{{ exp.title }}</h3>
                  <p class="text-sm text-gray-400">por {{ exp.host }}</p>
                </div>
              </div>
             
              <div class="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                <div class="flex items-center space-x-1">
                  <Clock class="w-4 h-4" />
                  <span>{{ exp.duration }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <MapPin class="w-4 h-4" />
                  <span>{{ exp.location }}</span>
                </div>
              </div>
             
              <div class="flex items-center justify-between pt-4 border-t border-yellow-400/20">
                <div class="flex items-center space-x-2">
                  <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span class="font-bold">{{ exp.rating }}</span>
                  <span class="text-sm text-gray-400">({{ exp.reviews }})</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-yellow-400">{{ exp.price }}</div>
                </div>
              </div>
             
              <button class="w-full mt-4 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-300 transform group-hover:scale-105">
                Reservar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-4 pb-20">
      <div class="max-w-4xl mx-auto bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-3xl p-12 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400isdiction/5 to-transparent animate-pulse"></div>
        <div class="relative z-10">
          <Sparkles class="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h2 class="text-4xl font-bold mb-4">Tem um talento único?</h2>
          <p class="text-xl text-gray-300 mb-8">
            Transforme suas habilidades em rendimento. Crie experiências de até 1 hora e conecte-se com pessoas da sua cidade.
          </p>
          <button class="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-400/50">
            Comece a Ganhar Hoje
          </button>
        </div>
      </div>
    </section>





    <FooterComponent />
  </div>




</template>

<style scoped>
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>