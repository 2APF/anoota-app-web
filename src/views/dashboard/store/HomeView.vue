<template>
  <NavbarComponent />

  <div class="home">
    <div class="container">

      <header class="welcome">
        <h1>Olá, {{ user.name.split(' ')[0] }}!</h1>
        <p v-if="appointmentsCount === 0">Vamos começar sua jornada de beleza?</p>
        <p v-else>Você já fez <strong>{{ appointmentsCount }}</strong> agendamento{{ appointmentsCount > 1 ? 's' : '' }}</p>
      </header>

      <div class="loyalty-card">
        <div class="title">
          <div class="gift-icon"><i class="fas fa-gift"></i></div>
          <div>
            <h2>Serviço Grátis a Cada 10</h2>
            <p>Complete 10 agendamentos e ganhe 1 serviço grátis até 80€</p>
          </div>
        </div>

        <div class="progress-bar">
          <div class="fill" :style="{ width: progressPercent + '%' }"></div>
          <div class="dots">
            <div v-for="n in 10" :key="n" class="dot" :class="{ active: n <= appointmentsCount, next: n === appointmentsCount + 1 }">
              <span>{{ n }}</span>
            </div>
          </div>
        </div>

        <div class="status">
          <strong v-if="appointmentsCount < 10">
            Faltam apenas {{ 10 - appointmentsCount }} agendamento{{ 10 - appointmentsCount > 1 ? 's' : '' }}
          </strong>
          <strong v-else class="won">Você ganhou 1 serviço grátis!</strong>
        </div>

        <button @click="goToSearch" class="btn-primary">
          {{ appointmentsCount < 10 ? 'Fazer próximo agendamento' : 'Resgatar meu prêmio' }}
        </button>
      </div>

      <div class="ads-carousel">
        <div class="slides" :style="{ transform: `translateX(-${currentAd * 100}%)` }">
          <div v-for="(ad, i) in ads" :key="i" class="ad-slide">
            <img :src="ad.image" :alt="ad.title">
            <div class="ad-overlay">
              <h3>{{ ad.title }}</h3>
              <p>{{ ad.subtitle }}</p>
              <button @click="goToSearch">Aproveitar agora</button>
            </div>
          </div>
        </div>
        <div class="ad-dots">
          <span v-for="(ad, i) in ads" :key="i" :class="{ active: i === currentAd }" @click="currentAd = i"></span>
        </div>
      </div>

      <button @click="router.push('/onboarding-profissional')" class="pro-cta">
        <div class="icon"><i class="fas fa-crown"></i></div>
        <div class="text">
          <strong>Ganhe dinheiro com sua habilidade</strong>
          <span>Seja um profissional premium • Zero comissão por 90 dias</span>
        </div>
        <div class="arrow"><i class="fas fa-arrow-right"></i></div>
      </button>

      <section v-if="recentAppointments.length" class="recent">
        <h2>Últimos agendamentos</h2>
        <div class="list">
          <div v-for="apt in recentAppointments" :key="apt.id" class="item" @click="router.push(`/agendamento/${apt.id}`)">
            <div class="left">
              <div class="day">{{ apt.day }}</div>
              <div class="time">{{ apt.time }}</div>
            </div>
            <div class="center">
              <div class="service">{{ apt.service }}</div>
              <div class="place">{{ apt.place }}</div>
            </div>
            <div class="status" :class="apt.status">
              {{ apt.status === 'confirmed' ? 'Confirmado' : 'Pendente' }}
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()


interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  address?: string;
  provider?: string;
  createdAt?: string;
  photo?: string;
  isProfessional?: boolean
}

// const user = reactive({
//   name: 'Carolina Mendes',
//   email: 'carolina@email.com',
//   phone: '+351 912 345 678',
//   address: 'Lisboa',
//   avatar: ''
// })

// const user = ref({
//   name: 'Carolina Mendes',
//   isProfessional: false,
//   rating: '4.92'
// })

let user: User;
if (typeof route.params.user === 'string') {
  user = { id: route.params.user, name: '', phone: '', email: '', 
  about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false };
} else if (Array.isArray(route.params.user)) {
  user = { id: route.params.user[0], name: '', phone: '', email: '', 
  about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false };
} else {
  user = route.params.user || { id: '', name: '', phone: '', email: '', 
  about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false };
}



// const firstName = 'Carolina'
const appointmentsCount = ref(6)
const currentAd = ref(0)

const progressPercent = computed(() => Math.min((appointmentsCount.value / 10) * 100, 100))

const ads = ref([
  { title: '20% OFF no 1º agendamento', subtitle: 'Use o código BEMVINDO20', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600' },
  { title: 'Indique um amigo e ganhe 15€', subtitle: 'Vocês dois saem ganhando', image: 'https://images.unsplash.com/photo-1605497788044-5a28bbf2e49f?w=1600' },
  { title: 'Combo Corte + Barba por 55€', subtitle: 'Apenas esta semana', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600' }
])

const recentAppointments = ref([
  { id: 1, day: 'Hoje', time: '14:00', service: 'Manicure + Pedicure', place: 'Beauty Touch', status: 'confirmed' },
  { id: 2, day: 'Hoje', time: '10:30', service: 'Corte + Barba', place: 'José Barber Premium', status: 'confirmed' },
  { id: 3, day: 'Amanhã', time: '16:30', service: 'Massagem Relaxante', place: 'Serenity Spa', status: 'pending' },
])

const goToSearch = () => router.push('/')

let interval: any
onMounted(() => {
  interval = setInterval(() => {
    currentAd.value = (currentAd.value + 1) % ads.value.length
  }, 5000)
})
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.home{min-height:100vh;background:linear-gradient(135deg,#f8fafc 0%,#e0f2fe 100%);padding:100px 20px 140px}
.container{max-width:1000px;margin:0 auto}

.welcome{text-align:center;margin-bottom:48px}
.welcome h1{font-size:clamp(2.8rem,7vw,4.5rem);font-weight:900;background:linear-gradient(90deg,#1e293b,#0ea5e9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 16px}
.welcome p{font-size:1.35rem;color:#475569;font-weight:500}

.loyalty-card{background:white;border-radius:32px;padding:40px 32px;box-shadow:0 20px 60px rgba(0,0,0,.12);margin-bottom:48px;border:1px solid #e0e7ff}
.title{display:flex;align-items:center;gap:20px;margin-bottom:32px}
.gift-icon{width:68px;height:68px;background:linear-gradient(135deg,#10b981,#34d399);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:2.2rem;color:white}
.title h2{font-size:1.9rem;font-weight:900;color:#1e293b;margin:0 0 8px}
.title p{color:#64748b;margin:0;font-size:1.05rem}

.progress-bar{position:relative;height:12px;background:#e2e8f0;border-radius:999px;margin:32px 0;overflow:hidden}
.fill{height:100%;background:linear-gradient(90deg,#10b981,#34d399);border-radius:999px;transition:width .8s cubic-bezier(0.16,1,0.3,1)}
.dots{position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);display:flex;justify-content:space-between;padding:0 6px;pointer-events:none}
.dot{width:44px;height:44px;background:#e2e8f0;border:4px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#94a3b8;font-size:1rem;transition:all .4s;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.dot.active{background:#10b981;color:white;transform:scale(1.2)}
.dot.next{background:#0ea5e9;color:white;animation:pulse 2s infinite;transform:scale(1.35)}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(14,165,233,.5)}70%{box-shadow:0 0 0 14px rgba(14,165,233,0)}}

.status{text-align:center;font-size:1.4rem;font-weight:700;color:#1e293b;margin:24px 0 32px}
.won{color:#10b981;font-size:1.5rem}

.btn-primary{width:100%;padding:20px;background:linear-gradient(135deg,#10b981,#34d399);color:white;border:none;border-radius:20px;font-size:1.25rem;font-weight:800;cursor:pointer;transition:all .3s}
.btn-primary:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(16,185,129,.3)}

.ads-carousel{position:relative;border-radius:28px;overflow:hidden;margin:40px 0 60px;box-shadow:0 20px 50px rgba(0,0,0,.15)}
.slides{display:flex;height:320px;transition:transform .6s ease-in-out}
.ad-slide{flex-shrink:0;width:100%;position:relative}
.ad-slide img{width:100%;height:100%;object-fit:cover}
.ad-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.8),transparent 70%);display:flex;flex-direction:column;justify-content:center;padding:0 60px;color:white}
.ad-overlay h3{font-size:2.8rem;font-weight:900;margin:0 0 12px}
.ad-overlay p{font-size:1.4rem;margin:0 0 24px;opacity:.95}
.ad-overlay button{background:#0ea5e9;color:white;padding:16px 36px;border:none;border-radius:50px;font-weight:800;cursor:pointer;transition:.3s}
.ad-overlay button:hover{background:#0284c7;transform:scale(1.05)}
.ad-dots{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px}
.ad-dots span{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4);cursor:pointer;transition:.3s}
.ad-dots span.active{background:white;width:30px;border-radius:20px}

.pro-cta{display:flex;align-items:center;gap:20px;width:100%;padding:32px;background:linear-gradient(135deg,#fefce8,#fbbf24);border:2px dashed #f59e0b;border-radius:28px;margin-bottom:60px;cursor:pointer;transition:all .4s}
.pro-cta:hover{transform:translateY(-8px);box-shadow:0 25px 50px rgba(245,158,11,.2);background:linear-gradient(135deg,#fbbf24,#f59e0b);color:white}
.pro-cta .icon{font-size:2.8rem;color:#f59e0b}
.pro-cta:hover .icon{color:white}
.pro-cta .text strong{font-size:1.4rem;display:block;margin-bottom:6px}
.pro-cta .text span{font-size:1.05rem;opacity:.9}
.pro-cta .arrow{font-size:2rem;margin-left:auto;color:#f59e0b}
.pro-cta:hover .arrow{color:white}

.recent h2{text-align:center;font-size:2rem;font-weight:900;color:#1e293b;margin:0 0 32px}
.list{display:flex;flex-direction:column;gap:16px}
.item{background:white;border-radius:24px;padding:24px;display:grid;grid-template-columns:100px 1fr auto;gap:20px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.08);cursor:pointer;transition:.3s}
.item:hover{transform:translateY(-6px)}
.left .day{font-size:.95rem;color:#64748b}
.left .time{font-size:1.8rem;font-weight:900;color:#0ea5e9}
.center .service{font-weight:700;color:#1e293b}
.center .place{color:#64748b;font-size:.95rem;margin-top:4px}
.status{padding:8px 20px;border-radius:50px;font-size:.9rem;font-weight:700}
.status.confirmed{background:#ecfdf5;color:#10b981}
.status.pending{background:#fffbeb;color:#d97706}

@media (max-width:640px){
  .item{grid-template-columns:1fr;text-align:center;gap:16px}
  .status{justify-self:center}
  .pro-cta{padding:24px;text-align:center;flex-direction:column}
  .pro-cta .arrow{transform:rotate(90deg);margin:16px auto 0}
  .ad-overlay{padding:0 32px;text-align:center}
  .ad-overlay h3{font-size:2.2rem}
}
</style>