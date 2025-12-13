<template>
  <NavbarComponent />

  <section class="hero">
    <div class="container">
      <h1>Encontre o melhor serviço<br><span class="typing">{{ typedText }}</span><span class="cursor">|</span></h1>
      <p class="subtitle">Mais de 2.000 profissionais prontos para te atender</p>

      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input v-model="searchQuery" @input="resetAndLoad" type="text" placeholder="Pesquise profissionais..." class="search-input" />
      </div>

      <div class="categories-wrapper">
        <button @click="categoryOpen = !categoryOpen" class="category-select">
          <span>{{ selectedCategory || 'Todas as categorias' }}</span>
          <i class="fas fa-chevron-down" :class="{ open: categoryOpen }"></i>
        </button>

        <Transition name="fade">
          <div v-if="categoryOpen" class="categories-dropdown">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="toggleCategory(cat)"
              :class="{ active: selectedCategory === cat }"
              class="cat-option"
            >
              {{ cat }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </section>

  <section class="results">
    <div class="container">
      <h2 v-if="total > 0" class="count">{{ total }} {{ total === 1 ? 'profissional encontrado' : 'profissionais encontrados' }}</h2>

      <div class="grid">
        <div v-for="(store, i) in stores" :key="store.id" class="card" :style="{ animationDelay: `${i * 0.06}s` }" @click="goToStore(store.slug)">
          <div class="img" :style="{ backgroundImage: `url(${store.cover})` }">
            <span class="tag">{{ store.category }}</span>
            <span class="badge" :class="store.recommend.toLowerCase()">{{ store.recommend }}</span>
            <span v-if="store.openNow" class="open"><i class="fas fa-circle"></i> Aberto</span>
            <span v-else class="close"><i class="fas fa-circle"></i> Fechado</span>
          </div>

          <div class="content">
            <div class="logo-circle">
              <img :src="store.logo" alt="logo" loading="lazy" />
            </div>
            <h3>{{ store.name }}</h3>
            <div class="meta">
              <div class="loc"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</div>
              <div class="rate">
                <i class="fas fa-star"></i> <strong>5.0</strong>
                <small>(0 avaliações)</small>
              </div>
            </div>
            <button class="btn">Ver Loja e Agendar</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> Carregando mais...
      </div>

      <div v-if="!loading && stores.length === 0" class="empty">
        <i class="fas fa-search fa-4x"></i>
        <h3>Nenhum profissional encontrado</h3>
        <p>Tenta outra palavra ou remove os filtros.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const stores = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const hasMore = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const categoryOpen = ref(false)

const categories = [
  'Todas as categorias',
  'Barbearia & Cabeleireiro',
  'Body Piercing & Tatuagem',
  'Cuidados Faciais & Laser',
  'Depilação & Laser',
  'Design de Sobrancelhas',
  'Estética Avançada',
  'Maquilhagem',
  'Massagem & Spa',
  'Nail Art & Unhas Gel',
  'Personal Trainer',
  'Salão de Beleza',
  'Spa & Massagem',
  'Tranças Africanas',
  'Yoga & Pilates',
  'Outro'
]

const typedText = ref('')
const phrases = ['perto de si', 'ao seu gosto', 'hoje mesmo', 'rápido']
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer: number | any = null

const type = () => {
  const current = phrases[phraseIndex % phrases.length]
  typedText.value = isDeleting ? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1)
  charIndex = isDeleting ? charIndex - 1 : charIndex + 1

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true
    typingTimer = setTimeout(type, 1500)
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    phraseIndex++
    typingTimer = setTimeout(type, 500)
  } else {
    typingTimer = setTimeout(type, isDeleting ? 50 : 100)
  }
}

const loadStores = async (append = false) => {
  
  if (loading.value || (!append && page.value > 1 && !hasMore.value)) return
  loading.value = true

  try {
    const params: any = { page: page.value, limit: 12 }
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    if (selectedCategory.value && selectedCategory.value !== 'Todas as categorias') params.category = selectedCategory.value

    const res = await axios.get(`${API_URL}/store/all`, { params })
    const data = res.data

    if (append) {
      stores.value = [...stores.value, ...data.stores]
    } else {
      stores.value = data.stores
    }

    total.value = data.total || data.stores.length
    hasMore.value = data.has_more !== false
    page.value++
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetAndLoad = () => {
  page.value = 1
  stores.value = []
  loadStores()
}

const toggleCategory = (cat: string) => {
  selectedCategory.value = selectedCategory.value === cat ? '' : cat
  categoryOpen.value = false
  resetAndLoad()
}

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600 && hasMore.value && !loading.value) {
    loadStores(true)
  }
}

const goToStore = (slug: string) => {
  router.push({ name: 'app.store.detail', params: { id: slug } })
}

onMounted(() => {
  type()
  loadStores()
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', (e) => {
    if (e.target instanceof Element && !e.target.closest('.categories-wrapper')) {
      categoryOpen.value = false
    }
  })
})

onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  padding: 120px 20px 80px;
  text-align: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

h1 {
  font-size: clamp(2.4rem, 6vw, 3.8rem);
  font-weight: 900;
  line-height: 1.2;
  margin: 0 0 16px;
  color: #1e293b;
}

.typing {
  color: #0ea5e9;
  font-weight: 900;
}

.cursor {
  color: #0ea5e9;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.subtitle {
  font-size: 1.15rem;
  color: #475569;
  max-width: 560px;
  margin: 0 auto 40px;
  line-height: 1.5;
}

.search-wrapper {
  position: relative;
  max-width: 640px;
  margin: 0 auto 24px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 56px;
  font-size: 1.1rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transition: all .3s;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.15);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: #0ea5e9;
  pointer-events: none;
}

.categories-wrapper {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
}

.category-select {
  width: 100%;
  padding: 14px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transition: all .3s;
}

.category-select:hover {
  border-color: #0ea5e9;
}

.category-select i {
  transition: transform .3s;
}

.category-select i.open {
  transform: rotate(180deg);
}

.categories-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0,0,0,.12);
  max-height: 320px;
  overflow-y: auto;
  z-index: 10;
  padding: 8px 0;
}

.cat-option {
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
}

.cat-option:hover {
  background: #f0f9ff;
}

.cat-option.active {
  background: #0ea5e9;
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s, transform .25s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.results {
  padding: 60px 20px 100px;
  background: #f8fafc;
}

.count {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 36px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,.06);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  animation: appear .7s ease-out forwards;
}

@keyframes appear {
  to { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(14,165,233,.18);
  border-color: #0ea5e9;
}

.img {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,.65);
  color: white;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: .85rem;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

.badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 800;
  font-size: .85rem;
  color: white;
}

.badge.alta { background: #10b981; }
.badge.boa { background: #f59e0b; }

.open, .close {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: .8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.open { background: #10b981; color: white; }
.close { background: #ef4444; color: white; }

.content {
  padding: 24px;
  position: relative;
}

.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 6px 16px rgba(0,0,0,.12);
  margin: -50px auto 14px;
  background: white;
}

.logo-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 12px;
  color: #1e293b;
  text-align: center;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  color: #475569;
  font-size: .95rem;
  text-align: center;
}

.loc i, .rate i {
  color: #0ea5e9;
  margin-right: 6px;
}

.rate strong {
  color: #10b981;
  font-weight: 800;
}

.btn {
  width: 100%;
  padding: 14px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: .3s;
}

.btn:hover {
  background: #0284c7;
}

.loading {
  text-align: center;
  padding: 50px;
  color: #64748b;
  font-size: 1.1rem;
}

.empty {
  text-align: center;
  padding: 100px 20px;
  color: #64748b;
}

.empty i {
  color: #cbd5e1;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .hero { padding: 100px 16px 60px; }
  .subtitle { font-size: 1.05rem; margin-bottom: 32px; }
  .search-input, .category-select { padding: 14px 18px 14px 52px; font-size: 1rem; }
  .search-icon { left: 18px; }
  .results { padding: 50px 16px 80px; }
  .count { font-size: 1.6rem; margin-bottom: 28px; }

  
  .grid {
  display: block;
  
  max-width: 400px;
   gap: 20px; }

   
  .card {
    margin-bottom: 15px;
  }

  .card:hover { transform: none; }
}
</style>