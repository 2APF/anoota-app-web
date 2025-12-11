<template>
  <NavbarComponent />

  <div v-if="loading" class="loading-screen">
    <i class="fas fa-spinner fa-spin"></i>
  </div>

  <div v-else class="store-header">

    <div class="cover-photo" :style="{ backgroundImage: `url(${store.cover_image || store.gallery?.[0]})` }">
      <div class="cover-overlay"></div>
    </div>

    <div class="container store-info-header mt-4">
      <div class="logo-wrapper">
        <img :src="store.profile_image || store.gallery?.[0]" alt="Logo" class="store-logo" />
      </div>
      <div class="store-main-info mt-4">
        <h1 class="store-name mt-4">{{ store.name }}</h1>
        <div class="store-meta">
          <span class="category" style="color: black;"><i class="fas fa-list-alt"></i> {{ store.category }}</span>
          <span class="location" style="color: black;"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</span>
        </div>
        <div class="rating-badge" style="color: black;">
          <i class="fas fa-star"></i> {{ store.rating || '5.0' }}
          <span class="reviews">({{ store.reviews_count || 0 }} avaliações)</span>
        </div>
        <div class="status" :class="{ open: store.is_open_now }" style="color: black;">
          <i class="fas fa-circle"></i> {{ store.is_open_now ? 'Aberto agora' : 'Fechado' }}
        </div>
      </div>


       <RouterLink :scroll-behavior="{ behavior: 'smooth' }"
        :to="{ name: 'app.schedule', params: { id: store.id } }" class="btn-schedule-cta" @click="openScheduleModal = true">
        Marcar Agora
      </RouterLink>
    </div>
  </div>

  <div v-if="!loading" class="container store-content">
    <div class="gallery-section" v-if="store.gallery?.length">
      <div class="main-photo">
        <img :src="store.gallery[currentPhoto]" alt="Foto principal" />
      </div>
      <div class="thumbnail-grid">
        <div v-for="(photo, i) in store.gallery" :key="i" class="thumb" :class="{ active: i === currentPhoto }"
          @click="currentPhoto = i">
          <img :src="photo" :alt="`Foto ${i + 1}`" />
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="left-column">
        <section class="about">
          <h2>Sobre</h2>
          <p>{{ store.description || 'Sem descrição disponível.' }}</p>
        </section>

        <section class="services" v-if="services?.length">
          <h2>Serviços</h2>
          <div class="service-list">
            <div v-for="service in services" :key="service.id" class="service-item">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-details">
                <span class="duration">{{ service.duration_minutes }} min</span>
                <span class="price">€{{ service.price }}</span>
              </div>
              <!-- <div class="arrow-icon"><i class="fas fa-chevron-right"></i></div> -->
            </div>
          </div>
        </section>

        <section class="opening-hours">
          <h2>Horário de Funcionamento</h2>
          <div class="hours">
            <div v-for="day in formattedHours" :key="day.day" class="hour-line"
              :class="{ today: day.isToday, closed: !day.open }">
              <span class="day">{{ day.day }}</span>
              <span class="time" v-if="day.open">{{ day.open }} - {{ day.close }}</span>
              <span class="closed-text" v-else>Fechado</span>
            </div>
          </div>
        </section>

      </div>

      <div class="right-column">


        <div class="contact-card">
          <h3>Contacto</h3>
          <div class="contact-item"><i class="fas fa-phone"></i> {{ store.phone || 'Não informado' }}</div>
          <div class="contact-item"><i class="fas fa-envelope"></i> {{ store.email || 'Não informado' }}</div>
          <div v-if="store.instagram" class="contact-item"><i class="fab fa-instagram"></i> {{ store.instagram }}</div>
          <div v-if="store.whatsapp" class="contact-item"><i class="fab fa-whatsapp"></i> {{ store.whatsapp }}</div>
          <div v-if="store.address" class="contact-item"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</div>
        </div>

        <!-- <div class="schedule-card"> -->

        <section class="location-section">
          <h2>Localização</h2>
          <div class="map-container">
            <iframe
              :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(store.address)}`"
              width="100%" height="420" style="border:0;border-radius:24px" allowfullscreen="" loading="lazy">
            </iframe>
            <div class="map-actions">
              <a :href="googleMapsLink" target="_blank" class="btn-map google"><i class="fab fa-google"></i> Google
                Maps</a>
              <a :href="wazeLink" target="_blank" class="btn-map waze"><i class="fas fa-car"></i> Waze</a>
              <a :href="appleMapsLink" target="_blank" class="btn-map apple"><i class="fab fa-apple"></i> Apple
                Maps</a>
            </div>
          </div>
        </section>
        <!-- </div> -->
      </div>
    </div>
  </div>
  <!-- 
  <div class="modal-overlay" :class="{ active: openScheduleModal }" @click="openScheduleModal = false">
    <div class="schedule-modal" @click.stop>
      <div class="modal-header">
        <h3>Escolher Data e Horário</h3>
        <button @click="openScheduleModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="calendar-placeholder">Selecione uma data e horário disponível</div>
        <button class="btn-confirm-schedule" @click="openScheduleModal = false">Fechar</button>
      </div>
    </div>
  </div> -->
  <!-- 
  <div class="modal-overlay" :class="{ active: selectedService }" @click="selectedService = null">
    <div class="service-modal" @click.stop>
      <button @click="selectedService = null" class="close-modal">×</button>
      <div class="service-hero" :style="{ backgroundImage: `url(${store.gallery?.[1] || store.cover_image})` }"></div>
      <div class="service-info">
        <h2>{{ selectedService?.name }}</h2>
        <div class="price-tag">€{{ selectedService?.price }} <span>• {{ selectedService?.duration_minutes }} min</span></div>
        <p>{{ selectedService?.description || 'Serviço premium com técnica profissional e produtos de alta qualidade.' }}</p>
        <button @click="openScheduleModal = true; selectedService = null" class="btn-service-cta">Agendar Este Serviço</button>
      </div>
    </div>
  </div> -->

  <RouterLink :scroll-behavior="{ behavior: 'smooth' }"
        :to="{ name: 'app.schedule', params: { id: store.id } }" class="fab-schedule" @click="openScheduleModal = true">
    <i class="fas fa-calendar-plus" style="width: 20px; height: 20px;"></i>
    <span>Marcar</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'

const route = useRoute()
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'

const loading = ref(true)
const store = ref<any>({})
const work_schedules = ref<any[]>([])
const services = ref<any[]>([])
const currentPhoto = ref(0)
const openScheduleModal = ref(false)
const selectedSlot = ref('')
const selectedService = ref<any>(null)



const googleMapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.value.address || '')}`)
const wazeLink = computed(() => `https://waze.com/ul?q=${encodeURIComponent(store.value.address || '')}`)
const appleMapsLink = computed(() => `http://maps.apple.com/?q=${encodeURIComponent(store.value.address || '')}`)

const formattedHours = computed(() => {
  if (!work_schedules.value?.length) return []
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const today = new Date().getDay()

  return work_schedules.value.map((item: any) => {
    const dayName = days[item.day_of_week]
    const isToday = item.day_of_week === today
    return {
      day: dayName,
      open: item.start_time?.slice(0, 5) || null,
      close: item.end_time?.slice(0, 5) || null,
      isToday
    }
  })
})

// const openServiceModal = (service: any) => selectedService.value = service

const fetchStore = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/user/store/detail/${id}`)
    store.value = res.data.store || {}
    work_schedules.value = res.data.workSchedules || []
    services.value = res.data.services || []
    // console.log(store.value)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
  
}

onMounted(fetchStore)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.loading-screen {
  position: fixed;
  inset: 0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-size: 2rem;
  color: #0ea5e9;
}

.store-header {
  position: relative;
  margin-top: 80px;
}

.cover-photo {
  height: 420px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, .7) 100%);
}

.store-info-header {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  margin-top: -100px;
  position: relative;
  z-index: 2;
  padding: 0 20px;
}

.logo-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .3);
  background: white;
  flex-shrink: 0;
}

.store-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-main-info {
  flex: 1;
  color: white;
  margin-bottom: 20px;
}

.store-name {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0;
}

.store-meta {
  font-size: 1.1rem;
  opacity: .95;
  margin: 8px 0;
}

.category {
  background: rgba(255, 255, 255, .2);
  padding: 6px 14px;
  border-radius: 50px;
  margin-right: 12px;
  font-weight: 600;
}

.location i {
  margin-right: 8px;
}

.rating-badge {
  background: rgba(255, 255, 255, .25);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

.reviews {
  font-weight: 500;
  opacity: 0.9;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 8px;
}

.status i {
  font-size: .6rem;
}

.status.open {
  color: #10b981;
}

.status.open i {
  color: #10b981;
}

.btn-schedule-cta {
  background: #0ea5e9;
  color: white;
  padding: 18px 36px;
  border: none;
  border-radius: 16px;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(14, 165, 233, .4);
  transition: .3s;
  align-self: flex-end;
  margin-bottom: 20px;
}

.btn-schedule-cta:hover {
  background: #0c8bd1;
  transform: translateY(-4px);
}

.gallery-section {
  margin: 60px 0;
}

.main-photo {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, .15);
  margin-bottom: 20px;
}

.main-photo img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.thumb {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  opacity: .7;
  transition: all .3s;
  position: relative;
  height: 120px;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s;
}

.thumb.active,
.thumb:hover {
  opacity: 1;
  transform: scale(1.05);
}

.thumb.active::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 4px solid #0ea5e9;
  border-radius: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 60px;
  margin: 40px 0;
}

.left-column h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 40px 0 20px;
  color: #1e293b;
  position: relative;
}

.left-column h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 70px;
  height: 5px;
  background: #0ea5e9;
  border-radius: 3px;
}

.about p {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #475569;
}

.service-list {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all .3s;
  position: relative;
}

.service-item:hover {
  background: #f0f9ff;
  border-radius: 16px;
  margin: 0 -24px;
  padding: 20px 24px;
}

.service-item:last-child {
  border-bottom: none;
}

.service-name {
  font-weight: 700;
  font-size: 1.2rem;
}

.service-item:hover .service-name {
  color: #0ea5e9;
  font-weight: 900;
}

.service-details span {
  margin-left: 16px;
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1.15rem;
}

.arrow-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all .3s;
  font-size: 1.4rem;
  color: #0ea5e9;
}

.service-item:hover .arrow-icon {
  opacity: 1;
  right: 16px;
}

.hours {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.hour-line {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-weight: 600;
}

.hour-line.today {
  color: #0ea5e9;
  font-weight: 800;
  background: #f0f9ff;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 0 -16px;
}

.closed-text {
  color: #ef4444;
  font-weight: 700;
}

.location-section {
  margin-top: 60px;
}

.map-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .2);
}

.map-actions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
  z-index: 10;
}

.btn-map {
  background: white;
  color: #333;
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 10;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .25);
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.btn-map:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, .3);
}

.btn-map.google:hover {
  background: #4285f4;
  color: white;
}

.btn-map.waze {
  background: #33ccff;
  color: white;
}

.btn-map.apple {
  background: #000;
  color: white;
}

.right-column .schedule-card,
.contact-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .08);
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
}

.right-column h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.quick-schedule {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.quick-slot {
  background: #f0f9ff;
  border: 2px solid transparent;
  padding: 14px;
  text-align: center;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: .3s;
}

.quick-slot.selected,
.quick-slot:hover {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.btn-full-schedule {
  width: 100%;
  padding: 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  font-size: 1.05rem;
  color: #475569;
}

.contact-item i {
  color: #0ea5e9;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all .4s;
  backdrop-filter: blur(8px);
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.schedule-modal {
  background: white;
  border-radius: 28px;
  width: 90%;
  max-width: 560px;
  overflow: hidden;
  box-shadow: 0 30px 100px rgba(0, 0, 0, .4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.6rem;
  font-weight: 800;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 32px;
  text-align: center;
}

.calendar-placeholder {
  background: #f8fafc;
  padding: 80px;
  border-radius: 20px;
  margin-bottom: 32px;
  font-size: 1.2rem;
  color: #64748b;
}

.btn-confirm-schedule {
  width: 100%;
  padding: 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.4rem;
  font-weight: 800;
  cursor: pointer;
  transition: .3s;
}

.btn-confirm-schedule:hover {
  background: #059669;
  transform: translateY(-3px);
}

.service-modal {
  background: white;
  border-radius: 32px;
  overflow: hidden;
  max-width: 520px;
  width: 94%;
  box-shadow: 0 40px 120px rgba(0, 0, 0, .5);
  position: relative;
}

.service-hero {
  height: 360px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.service-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, .85), transparent 40%);
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(0, 0, 0, .7);
  color: white;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  font-size: 2.2rem;
  z-index: 10;
  cursor: pointer;
  transition: .3s;
}

.close-modal:hover {
  background: #000;
}

.service-info {
  padding: 40px 32px;
  text-align: center;
  position: relative;
  z-index: 2;
  margin-top: -100px;
}

.service-info h2 {
  font-size: 2.6rem;
  font-weight: 900;
  margin-bottom: 16px;
  color: #1e293b;
}

.price-tag {
  font-size: 3.2rem;
  font-weight: 900;
  color: #0ea5e9;
  margin: 20px 0;
}

.price-tag span {
  font-size: 1.4rem;
  color: #64748b;
  font-weight: 600;
}

.service-info p {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #475569;
  margin: 24px 0;
}

.btn-service-cta {
  width: 100%;
  padding: 20px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  transition: all .3s;
  box-shadow: 0 12px 30px rgba(14, 165, 233, .4);
}

.btn-service-cta:hover {
  background: #0c8bd1;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(14, 165, 233, .5);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

.fab-schedule {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 70px;
  height: 70px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 10px 35px rgba(14, 165, 233, .6);
  z-index: 9999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .5px;
  transition: all .3s ease;
}

.fab-schedule:hover {
  background: #0c8bd1;
  transform: translateY(-6px) scale(1.08);
  box-shadow: 0 15px 40px rgba(14, 165, 233, .7);
}

@media (max-width: 640px) {
  .fab-schedule {
    width: 64px;
    height: 64px;
    right: 16px;
    bottom: 16px;
  }

  .fab-schedule span {
    font-size: 10px;
  }
}

@media (max-width: 968px) {
  .store-info-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .logo-wrapper {
    margin: 0 auto -60px;
  }

  .btn-schedule-cta {
    align-self: stretch;
    margin: 30px 0 0;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .thumbnail-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-photo img {
    height: 380px;
  }

  .map-actions {
    flex-direction: column;
    text-align: center;
    width: 86%;
    /* left: 7%; */
  }
}

@media (max-width: 640px) {
  .store-name {
    font-size: 2.2rem;
  }

  .main-photo img {
    height: 300px;
  }

  .price-tag {
    font-size: 2.6rem;
  }
}
</style>