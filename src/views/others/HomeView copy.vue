<template>
  <NavbarComponent />

  <section class="hero">
    <div class="container">
      <h1>Agende em <span class="text-primary">{{ typedText }}</span><span class="text-primary blink">|</span></h1>
      <p>Agendamento rápido, simples e sem complicações</p>
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input v-model="searchQuery" @input="filterCards" type="text" placeholder="Cabeleireiro, manicure, massagem, PT, spa...">
      </div>
    </div>
  </section>

  <div class="container">
    <div class="grid">
      <div v-for="(company, index) in filteredCompanies" :key="company.id" class="card"
        :style="{ animationDelay: `${(index % 6) * 0.1}s` }">
        <div class="card-img" :style="{ backgroundImage: `url(${company.image})` }">
          <div class="card-tag">{{ company.category }}</div>
          <div :class="['recommend', company.recommend === 'ALTA' ? 'alta' : 'boa']">
            {{ company.recommend }}
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ company.name }}</h3>
          <div class="card-info">
            <div><i class="fas fa-map-marker-alt text-primary"></i> {{ company.location }}</div>
            <div class="rating">
              <i class="fas fa-star text-warning"></i> 
              {{ company.rating }} ({{ company.reviews }} avaliações)
            </div>
            <div v-if="company.openNow" class="text-success fw-bold">
              <i class="fas fa-clock"></i> Aberto agora
            </div>
          </div>
          <button class="btn-card">Ver Loja e Agendar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

const searchQuery = ref('')

const typedText = ref('')
const phrases = ['10 segundos', '3 cliques', 'instantes']
let phraseIndex = 0
let charIndex = 0
let typingTimer: any = null
let pauseTimer: any = null

const type = () => {
  if (charIndex < phrases[phraseIndex].length) {
    typedText.value += phrases[phraseIndex][charIndex]
    charIndex++
    typingTimer = setTimeout(type, 130)
  } else {
    pauseTimer = setTimeout(erase, 2000)
  }
}
const erase = () => {
  if (charIndex > 0) {
    typedText.value = phrases[phraseIndex].slice(0, charIndex - 1)
    charIndex--
    typingTimer = setTimeout(erase, 80)
  } else {
    phraseIndex = (phraseIndex + 1) % phrases.length
    type()
  }
}
onMounted(() => type())
onUnmounted(() => {
  clearTimeout(typingTimer)
  clearTimeout(pauseTimer)
})

const companies = ref([
  { id: 1, name: 'José Barber Premium', rating: 4.9, reviews: 428, category: 'Cabeleireiro', location: 'Lisboa • 1.8 km', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200', recommend: 'ALTA', openNow: true },
  { id: 2, name: 'Cátia Beauty Studio', rating: 5.0, reviews: 312, category: 'Estética & Unhas', location: 'Porto • Baixa', image: 'https://images.unsplash.com/photo-1605497788044-5a28bbf2e49f?w=1200', recommend: 'ALTA', openNow: true },
  { id: 3, name: 'Serenity Spa & Wellness', rating: 4.8, reviews: 189, category: 'Spa & Massagem', location: 'Albufeira', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200', recommend: 'BOA', openNow: true },
  { id: 4, name: 'Ana Fit Personal', rating: 4.9, reviews: 267, category: 'Personal Trainer', location: 'Online ou Presencial', image: 'https://images.unsplash.com/photo-1581093458791-9d6c92f10a2c?w=1200', recommend: 'ALTA', openNow: false },
  { id: 5, name: 'Equilibrium Yoga', rating: 4.9, reviews: 198, category: 'Yoga & Pilates', location: 'Coimbra • 2.1 km', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac68b8?w=1200', recommend: 'ALTA', openNow: true },
  { id: 6, name: 'AutoFix Rápida', rating: 4.7, reviews: 156, category: 'Oficina Mecânica', location: 'Braga', image: 'https://images.unsplash.com/photo-1596462501599-510f80f7e6ed?w=1200', recommend: 'BOA', openNow: true },
])

const filteredCompanies = computed(() => {
  if (!searchQuery.value.trim()) return companies.value
  const q = searchQuery.value.toLowerCase()
  return companies.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.container{max-width:1240px;margin:0 auto;padding:0 20px}
.hero{padding:140px 20px 80px;text-align:center;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)}
.hero h1{font-size:clamp(2.5rem,8vw,4rem);font-weight:900;margin-bottom:16px;line-height:1.1}
.hero p{font-size:1.2rem;color:#475569;margin-bottom:40px;max-width:600px;margin-left:auto;margin-right:auto}
.search-box{position:relative;max-width:720px;margin:0 auto}
.search-box input{width:100%;padding:18px 20px 18px 56px;font-size:1.1rem;border:2px solid #e2e8f0;border-radius:18px;background:white;box-shadow:0 10px 30px rgba(0,0,0,.08);transition:all .3s}
.search-box input:focus{outline:none;border-color:#0ea5e9;box-shadow:0 0 0 6px rgba(14,165,233,.15)}
.search-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);font-size:1.4rem;color:#0ea5e9;pointer-events:none;z-index:1}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px;padding:60px 0}
.card{background:white;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.07);transition:all .4s ease;border:1px solid #e2e8f0;opacity:0;transform:translateY(40px);animation:fadeUp .7s ease-out forwards}
@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
.card:hover{transform:translateY(-14px);box-shadow:0 30px 60px rgba(14,165,233,.22);border-color:#0ea5e9}
.card-img{height:210px;background-size:cover;background-position:center;position:relative}
.card-tag{position:absolute;top:16px;left:16px;background:rgba(0,0,0,.65);color:white;padding:8px 16px;border-radius:30px;font-size:.85rem;font-weight:700;backdrop-filter:blur(10px)}
.recommend{position:absolute;bottom:16px;right:16px;padding:8px 18px;border-radius:30px;font-weight:800;font-size:.85rem;color:white}
.alta{background:#10b981}
.boa{background:#f59e0b}
.card-body{padding:22px}
.card-title{font-size:1.45rem;font-weight:800;margin-bottom:10px}
.card-info{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;color:#475569;font-size:.95rem}
.rating{display:flex;align-items:center;gap:6px;color:#10b981;font-weight:700}
.btn-card{width:100%;padding:15px;background:#0ea5e9;color:white;border:none;border-radius:14px;font-weight:700;font-size:1.05rem;cursor:pointer;transition:.3s}
.btn-card:hover{background:#0c8bd1;transform:translateY(-2px)}
.text-primary{color:#0ea5e9}
.text-warning{color:#f59e0b}
.text-success{color:#10b981}
.fw-bold{font-weight:700}
.blink{animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@media (max-width:480px){
  .hero{padding:120px 16px 60px}
  .search-box input{padding:16px 20px 16px 52px;font-size:1rem}
  .search-icon{font-size:1.3rem;left:18px}
}
</style>