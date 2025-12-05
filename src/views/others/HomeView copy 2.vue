<template>
  <NavbarComponent />

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <h1>
        Encontre o melhor serviço
        <!-- <span class="highlight">perto de si</span> --><br>
        <span class="typing">{{ typedText }}</span>
        <span class="cursor">|</span>
      </h1>
      <p class="subtitle">Mais de 2.000 profissionais prontos para te atender em segundos</p>

      <div class="search-wrapper">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          @input="filterCompanies"
          type="text"
          placeholder="Cabeleireiro, manicure, massagem, spa, personal trainer..."
          class="search-input"
        />
      </div>

      <div class="categories">
        <button
          v-for="cat in popularCategories"
          :key="cat"
          @click="selectedCategory = selectedCategory === cat ? '' : cat"
          :class="{ active: selectedCategory === cat }"
          class="cat-btn"
        >
          {{ cat }}
        </button>
      </div>
    </div>
  </section>

  <!-- RESULTADOS -->
  <section class="results">
    <div class="container">
      <h2 v-if="filteredCompanies.length" class="count">
        {{ filteredCompanies.length }} {{ filteredCompanies.length === 1 ? 'resultado' : 'resultados' }} encontrado{{ filteredCompanies.length === 1 ? '' : 's' }}
      </h2>

      <div class="grid">
        <div
          v-for="(company, i) in filteredCompanies"
          :key="company.id"
          class="card"
          :style="{ animationDelay: `${i * 0.08}s` }"
          @click="goToStore(company.id)"
        >
          <div class="img" :style="{ backgroundImage: `url(${company.image})` }">
            <span class="tag">{{ company.category }}</span>
            <span class="badge" :class="company.recommend.toLowerCase()">
              Recomendação {{ company.recommend }}
            </span>
            <span v-if="company.openNow" class="open">
              <i class="fas fa-circle"></i> Aberto agora
            </span>
          </div>

          <div class="content">
            <h3>{{ company.name }}</h3>
            <div class="meta">
              <div class="loc">
                <i class="fas fa-map-marker-alt"></i>
                {{ company.location }}
              </div>
              <div class="rate">
                <i class="fas fa-star"></i>
                <strong>{{ company.rating }}</strong>
                <small>({{ company.reviews }} avaliações)</small>
              </div>
            </div>
            <button class="btn">Ver Loja e Agendar</button>
          </div>
        </div>
      </div>

      <div v-if="!filteredCompanies.length" class="empty">
        <i class="fas fa-search fa-4x"></i>
        <h3>Sem resultados</h3>
        <p>Tenta outra palavra ou remove os filtros.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('')

// Typing Effect (perfeito)
const typedText = ref('')
const phrases = ['perto de si', 'em segundos', 'hoje mesmo', 'com os melhores']
let i = 0
let j = 0
let isDeleting = false
let timer: any = null

const type = () => {
  const current = phrases[i]
  typedText.value = isDeleting ? current.substring(0, j - 1) : current.substring(0, j + 1)
  j = isDeleting ? j - 1 : j + 1

  if (!isDeleting && j === current.length) {
    isDeleting = true
    timer = setTimeout(type, 1600)
  } else if (isDeleting && j === 0) {
    isDeleting = false
    i = (i + 1) % phrases.length
    timer = setTimeout(type, 500)
  } else {
    timer = setTimeout(type, isDeleting ? 60 : 100)
  }
}

onMounted(() => setTimeout(type, 600))
onUnmounted(() => clearTimeout(timer))

// Dados
const companies = ref([
  { id: 1, name: 'José Barber Premium', rating: 4.9, reviews: 428, category: 'Cabeleireiro', location: 'Lisboa • 1.8 km', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200', recommend: 'ALTA', openNow: true },
  { id: 2, name: 'Cátia Beauty Studio', rating: 5.0, reviews: 312, category: 'Estética & Unhas', location: 'Porto • Baixa', image: 'https://images.unsplash.com/photo-1605497788044-5a28bbf2e49f?w=1200', recommend: 'ALTA', openNow: true },
  { id: 3, name: 'Serenity Spa & Wellness', rating: 4.8, reviews: 189, category: 'Spa & Massagem', location: 'Albufeira • Algarve', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', recommend: 'BOA', openNow: true },
  { id: 4, name: 'Ana Fit Personal', rating: 4.9, reviews: 267, category: 'Personal Trainer', location: 'Online ou Presencial', image: 'https://images.unsplash.com/photo-1581093458791-9d6c92f10a2c?w=1200', recommend: 'ALTA', openNow: false },
  { id: 5, name: 'Equilibrium Yoga', rating: 4.9, reviews: 198, category: 'Yoga & Pilates', location: 'Coimbra • 2.1 km', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac68b8?w=1200', recommend: 'ALTA', openNow: true },
  { id: 6, name: 'Beauty Touch', rating: 4.9, reviews: 156, category: 'Estética & Unhas', location: 'Faro • Centro', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', recommend: 'ALTA', openNow: true },
  { id: 7, name: 'Elite Barbershop', rating: 4.8, reviews: 389, category: 'Cabeleireiro', location: 'Braga • 900 m', image: 'https://images.unsplash.com/photo-1559595500-9a5f0a12e3e4?w=1200', recommend: 'BOA', openNow: true },
  { id: 8, name: 'Pure Relax Spa', rating: 5.0, reviews: 102, category: 'Spa & Massagem', location: 'Cascais', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', recommend: 'ALTA', openNow: true },
])

const popularCategories = ['Cabeleireiro', 'Estética & Unhas', 'Spa & Massagem', 'Personal Trainer', 'Yoga & Pilates']

const filteredCompanies = computed(() => {
  let list = companies.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.category.toLowerCase().includes(q) || 
      c.location.toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value) {
    list = list.filter(c => c.category === selectedCategory.value)
  }
  return list
})

const goToStore = (id: number) => router.push(`/loja/${id}`)
</script>

<style scoped>
.container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }

.hero {
  padding: 140px 20px 100px;
  text-align: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

h1 {
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  font-weight: 900;
  line-height: 1.15;
  margin: 0 0 20px;
  color: #1e293b;
}

.highlight { color: #0ea5e9; }
.typing { color: #0ea5e9; font-weight: 900; }
.cursor { color: #0ea5e9; animation: blink 1s infinite; font-weight: 900; }
@keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }

.subtitle {
  font-size: 1.3rem;
  color: #475569;
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
}

/* SEARCH BOX - ÍCONE 100% ALINHADO */
.search-wrapper {
  position: relative;
  max-width: 720px;
  margin: 0 auto 48px;
}

.search-input {
  width: 100%;
  padding: 20px 24px 20px 64px;
  font-size: 1.15rem;
  border: 3px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  box-shadow: 0 15px 40px rgba(0,0,0,.1);
  transition: all .3s;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 8px rgba(14,165,233,.2);
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #0ea5e9;
  pointer-events: none;
  z-index: 2;
}

/* CATEGORIAS */
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.cat-btn {
  padding: 12px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all .3s;
}

.cat-btn:hover { border-color: #0ea5e9; background: #f0f9ff; }
.cat-btn.active { background: #0ea5e9; color: white; border-color: #0ea5e9; }

/* RESULTADOS */
.results { padding: 60px 20px 120px; background: #f8fafc; }
.count { font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 40px; text-align: center; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
}

.card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px);
  animation: appear .8s ease-out forwards;
}

@keyframes appear { to { opacity: 1; transform: translateY(0); } }

.card:hover {
  transform: translateY(-16px);
  box-shadow: 0 40px 80px rgba(14,165,233,.25);
  border-color: #0ea5e9;
}

.img { height: 220px; background-size: cover; background-position: center; position: relative; }
.tag { position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,.7); color: white; padding: 8px 18px; border-radius: 50px; font-size: .9rem; font-weight: 700; backdrop-filter: blur(8px); }
.badge { position: absolute; bottom: 16px; right: 16px; padding: 10px 20px; border-radius: 50px; font-weight: 900; font-size: .9rem; color: white; }
.badge.alta { background: #10b981; }
.badge.boa { background: #f59e0b; }
.open { position: absolute; top: 16px; right: 16px; background: #10b981; color: white; padding: 8px 16px; border-radius: 50px; font-size: .85rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }

.content { padding: 28px; }
h3 { font-size: 1.55rem; font-weight: 900; margin: 0 0 14px; color: #1e293b; }
.meta { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; color: #475569; }
.loc i, .rate i { color: #0ea5e9; margin-right: 8px; }
.rate strong { color: #10b981; font-weight: 800; }

.btn {
  width: 100%;
  padding: 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: .3s;
}

.btn:hover { background: #0c8bd1; transform: translateY(-3px); }

.empty { text-align: center; padding: 120px 20px; color: #64748b; }
.empty i { color: #cbd5e1; margin-bottom: 24px; }

/* MOBILE */
@media (max-width: 640px) {
  .hero { padding: 120px 16px 80px; }
  .search-input { padding: 18px 20px 18px 58px; font-size: 1.1rem; }
  .search-icon { left: 20px; font-size: 1.4rem; }
  .categories { gap: 10px; }
  .cat-btn { padding: 10px 18px; font-size: .95rem; }
  .grid { grid-template-columns: 1fr; gap: 24px; }
  .count { font-size: 1.8rem; }
}
</style>