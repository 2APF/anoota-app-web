<template>
  <NavbarComponent />

  <section class="hero">
    <div class="container">
      <h1>Encontre o melhor serviço<br><span class="typing">{{ typedText }}</span><span class="cursor">|</span></h1>
      <p class="subtitle">Mais de 2.000 profissionais prontos para te atender em segundos</p>

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
        <div v-for="(store, i) in stores" :key="store.id" class="card" :style="{ animationDelay: `${i * 0.08}s` }" @click="goToStore(store.slug)">
          <div class="img" :style="{ backgroundImage: `url(${store.cover})` }">
            <span class="tag">{{ store.category }}</span>
            <span class="badge" :class="store.recommend.toLowerCase()">{{ store.recommend }}</span>
            <span v-if="store.openNow" class="open"><i class="fas fa-circle"></i> Aberto</span>
            <span v-else class="close"><i class="fas fa-circle"></i> Fechado</span>
          </div>

          <div class="content">
            <div class="logo-circle">
              <img :src="store.logo" alt="logo" />
            </div>
            <h3>{{ store.name }}</h3>
            <div class="meta">
              <div class="loc"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</div>
              <div class="rate">
                <i class="fas fa-star"></i> <strong>5.0 </strong>
                <small>Called
(0 avaliações)</small>
                <!-- <small>({{ store.reviews }} avaliações)</small> -->
              </div>
            </div>
            <RouterLink  :scroll-behavior="{ behavior: 'smooth' }" class="btn" :to="{ name: 'app.store.detail', params: { id: store.slug } }">Ver Loja e Agendar</RouterLink>
         
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

const stores: any = ref([])
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
const phrases = ['perto de si', 'ao seu gosto', 'mantendo a fidelidade', 'hoje mesmo','com os melhores']
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer: any = null

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
    if (selectedCategory.value) params.category = (selectedCategory.value == 'Todas as categorias') ? '' : selectedCategory.value  

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

const goToStore = (id: number) => {
  router.push({ name: 'app.store.detail', params: { id } })
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
  clearTimeout(typingTimer)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
.hero { padding: 140px 20px 100px; text-align: center; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
h1 { font-size: clamp(2.6rem, 7vw, 4.8rem); font-weight: 900; line-height: 1.15; margin: 0 0 20px; color: #1e293b; }
.typing { color: #0ea5e9; font-weight: 900; }
.cursor { color: #0ea5e9; animation: blink 1s infinite; font-weight: 900; }
@keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
.subtitle { font-size: 1.3rem; color: #475569; max-width: 600px; margin: 0 auto 48px; line-height: 1.6; }

.search-wrapper { position: relative; max-width: 720px; margin: 0 auto 32px; }
.search-input { width: 100%; padding: 20px 24px 20px 64px; font-size: 1.15rem; border: 3px solid #e2e8f0; border-radius: 20px; background: white; box-shadow: 0 15px 40px rgba(0,0,0,.1); transition: all .3s; }
.search-input:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 8px rgba(14,165,233,.2); }
.search-icon { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); font-size: 1.5rem; color: #0ea5e9; pointer-events: none; }

.categories-wrapper { position: relative; max-width: 720px; margin: 0 auto; }
.category-select {
  width: 100%; padding: 18px 24px; background: white; border: 3px solid #e2e8f0; border-radius: 20px; font-size: 1.15rem; font-weight: 700; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; box-shadow: 0 15px 40px rgba(0,0,0,.1); transition: all .3s;
}
.category-select:hover { border-color: #0ea5e9; }
.category-select:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 8px rgba(14,165,233,.2); }
.category-select i { transition: transform .3s; }
.category-select i.open { transform: rotate(180deg); }

.categories-dropdown {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: white; border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,.15); max-height: 360px; overflow-y: auto; z-index: 10; padding: 12px 0;
}
.cat-option {
  width: 100%; padding: 14px 24px; text-align: left; background: none; border: none; font-weight: 600; cursor: pointer; transition: all .2s;
}
.cat-option:hover { background: #f0f9ff; }
.cat-option.active { background: #0ea5e9; color: white; }

.fade-enter-active, .fade-leave-active { transition: opacity .3s, transform .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

.results { padding: 60px 20px 120px; background: #f8fafc; }
.count { font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 40px; text-align: center; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1100px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; gap: 24px; }
  .hero { padding: 120px 16px 80px; }
  .count { font-size: 1.8rem; }
}

.card { background: white; border-radius: 28px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,.08); border: 1px solid #e2e8f0; cursor: pointer; opacity: 0; transform: translateY(30px); animation: appear .8s ease-out forwards; }
@keyframes appear { to { opacity: 1; transform: translateY(0); } }
.card:hover { transform: translateY(-16px); box-shadow: 0 40px 80px rgba(14,165,233,.25); border-color: #0ea5e9; }

.img { height: 220px; background-size: cover; background-position: center; position: relative; }
.tag { position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,.7); color: white; padding: 8px 18px; border-radius: 50px; font-size: .9rem; font-weight: 700; backdrop-filter: blur(8px); }
.badge { position: absolute; bottom: 16px; right: 16px; padding: 10px 20px; border-radius: 50px; font-weight: 900; font-size: .9rem; color: white; }
.badge.alta { background: #10b981; }
.badge.boa { background: #f59e0b; }
.open { position: absolute; top: 16px; right: 16px; background: #10b981; color: white; padding: 8px 16px; border-radius: 50px; font-size: .85rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.close { position: absolute; top: 16px; right: 16px; background: #ff3737; color: white; padding: 8px 16px; border-radius: 50px; font-size: .85rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }

.content { padding: 28px; position: relative; }
.logo-circle { width: 130px; height: 130px; border-radius: 50%; overflow: hidden; border: 4px solid white; box-shadow: 0 8px 20px rgba(0,0,0,.15); margin: -50px auto 16px; background: white; }
.logo-circle img { width: 100%; height: 100%; object-fit: cover; }
h3 { font-size: 1.55rem; font-weight: 900; margin: 0 0 14px; color: #1e293b; text-align: center; }
.meta { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; color: #475569; text-align: center; }
.loc i, .rate i { color: #0ea5e9; margin-right: 8px; }
.rate strong { color: #10b981; font-weight: 800; }

.btn { width: 100%; padding: 16px; background: #0ea5e9; color: white; border: none; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: .3s; }
.btn:hover { background: #0c8bd1; transform: translateY(-3px); }

.loading { text-align: center; padding: 60px; color: #64748b; font-size: 1.2rem; }
.empty { text-align: center; padding: 120px 20px; color: #64748b; }
.empty i { color: #cbd5e1; margin-bottom: 24px; }
</style>