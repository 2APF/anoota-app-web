<template>
  <NavbarComponent />

  <div class="home">
    <div class="container">

      <header class="welcome">
        <h1>Olá, {{ user.name.split(' ')[0] }}!</h1>
        <p v-if="appointmentsCount === 0">Vamos começar sua jornada de beleza?</p>
        <p v-else>Você já fez <strong>{{ appointmentsCount }}</strong> agendamento{{ appointmentsCount > 1 ? 's' : '' }}</p>
      </header>

      <div class="ads-carousel" v-if="ads.length">
        <div class="slides" :style="{ transform: `translateX(-${currentAd * 100}%)` }">
          <div v-for="(ad, i) in ads" :key="i" class="ad-slide">
            <img :src="ad.image" :alt="ad.title" class="">
            <div class="ad-overlay ">
              <h4 class="mt-3"><strong>{{ ad.title }}</strong></h4>
              <p style="font-size: 10pt;">{{ ad.subtitle }}</p>

              <a target="_blank" :href="ad.link" v-if="ad.link" class="btn btn-primary mt-2">Saber mais</a>
            </div>
          </div>
        </div>
        <div class="ad-dots">
          <span v-for="(ad, i) in ads" :key="i" :class="{ active: i === currentAd }" @click="currentAd = i"></span>
        </div>
      </div>

      <!-- <section v-if="recentAppointments.length" class="recent">
        <h2>Próximas actividades</h2>
        <div class="list">
          <div v-for="apt in recentAppointments" :key="apt.id" class="item" @click="router.push(`/agendamento/${apt.id}`)">
            <div class="left">
              <div class="day">{{ formatDay(apt.start_datetime) }}</div>
              <div class="time">{{ formatTime(apt.start_datetime) }}</div>
            </div>
            <div class="center">
              <div class="service">{{ apt.name_service }}</div>
              <div class="place">{{ apt.store_name || 'Loja' }}</div>
            </div>
            <div class="status confirmed">Confirmado</div>
          </div>
        </div>
      </section> -->

      <div  class="empty-state" v-if="!recentAppointments.length">
        <i class="fas fa-calendar-alt"></i>
        <p >Ainda não tens agendamentos</p>
        <button @click="goToSearch" class="btn-explore">Explorar serviços</button>
      </div>
      <div v-else class="empty-state">
        <i class="fas fa-calendar-check"></i>
        <p>Bora explorar mais serviços?</p>
        <button @click="goToSearch" class="btn-explore">Explorar serviços
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'


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
}

let user: User;
if (typeof route.params.user === 'string') {
  user = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '' };
} else if (Array.isArray(route.params.user)) {
  user = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '' };
} else {
  user = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '' };
}



const loading = ref(true)
const appointmentsCount = ref(0)
const currentAd = ref(0)

const ads = ref<any[]>([])
const recentAppointments = ref<any[]>([])

let interval: any

const fetchData = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/user/homepage/${user.id}`)
    const data = res.data

    ads.value = data.publicities || []
    recentAppointments.value = (data.schedules || []).slice(0, 5)
    appointmentsCount.value = data.total || 0
  } catch (err) {
    ads.value = []
    recentAppointments.value = []
    appointmentsCount.value = 0
  } finally {
    loading.value = false
  }
}

const formatDay = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Hoje'
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã'
  return format(date, 'd MMM', { locale: pt })
}

const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm')

const goToSearch = () => router.push('/')

onMounted(() => {
  fetchData()
  interval = setInterval(() => {
    if (ads.value.length > 1) {
      currentAd.value = (currentAd.value + 1) % ads.value.length
    }
  }, 5000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 20px 140px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  margin-bottom: 48px;
}

.welcome h1 {
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b, #0ea5e9);
  
  -webkit-text-fill-color: transparent;
  margin: 0 0 16px;
}

.welcome p {
  font-size: 1.35rem;
  color: #475569;
  font-weight: 500;
}

.ads-carousel {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  margin: 40px 0 60px;
  box-shadow: 0 20px 50px rgba(0,0,0,.15);
}

.slides {
  display: flex;
  height: 320px;
  transition: transform .6s ease-in-out;
}

.ad-slide {
  flex-shrink: 0;
  width: 100%;
  position: relative;
}

.ad-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ad-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,.8), transparent 70%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
  color: white;
}

.ad-overlay h3 {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0 0 12px;
}

.ad-overlay p {
  font-size: 1.4rem;
  margin: 0 0 24px;
  opacity: .95;
}

.ad-overlay button {
  background: #0ea5e9;
  color: white;
  padding: 16px 36px;
  border: none;
  border-radius: 50px;
  font-weight: 800;
  cursor: pointer;
  transition: .3s;
  align-self: flex-start;
}

.ad-overlay button:hover {
  background: #0284c7;
  transform: scale(1.05);
}

.ad-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.ad-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,.4);
  cursor: pointer;
  transition: .3s;
}

.ad-dots span.active {
  background: white;
  width: 30px;
  border-radius: 20px;
}

.recent h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 32px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  background: white;
  border-radius: 24px;
  padding: 24px;
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 20px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  cursor: pointer;
  transition: .3s;
}

.item:hover {
  transform: translateY(-6px);
}

.left .day {
  font-size: .95rem;
  color: #64748b;
}

.left .time {
  font-size: 1.8rem;
  font-weight: 900;
  color: #0ea5e9;
}

.center .service {
  font-weight: 700;
  color: #1e293b;
}

.center .place {
  color: #64748b;
  font-size: .95rem;
  margin-top: 4px;
}

.status {
  padding: 8px 20px;
  border-radius: 50px;
  font-size: .9rem;
  font-weight: 700;
}

.status.confirmed {
  background: #ecfdf5;
  color: #10b981;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

.empty-state i {
  font-size: 4.5rem;
  margin-bottom: 24px;
  opacity: .6;
}

.empty-state p {
  font-size: 1.4rem;
  margin: 0 0 32px;
}

.btn-explore {
  padding: 16px 40px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}

.btn-explore:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(16,185,129,.3);
}

@media (max-width:640px) {
  .item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 16px;
  }
  .status {
    justify-self: center;
  }
  .ad-overlay {
    padding: 0 32px;
    text-align: center;
  }
  .ad-overlay h3 {
    font-size: 2.2rem;
  }
  .ad-overlay button {
    align-self: center;
  }
}
</style>