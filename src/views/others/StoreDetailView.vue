<template>
  <NavbarComponent />

  <div v-if="loading" class="loading-screen">
    <i class="fas fa-spinner fa-spin"></i>
  </div>

  <div v-else class="store-header">
    <div class="cover-photo"
      :style="{ backgroundImage: `url(${store.cover_image || store.gallery?.[0] || placeholder})` }">
      <div class="cover-overlay"></div>
    </div>

    <div class="container store-info-header">
      <div class="logo-wrapper">
        <img :src="store.profile_image || store.gallery?.[0] || placeholder" alt="Logo" class="store-logo" />
      </div>

      <div class="store-main-info">
        <h1 class="store-name">{{ store.name }}</h1>
        <div class="store-meta">
          <span class="category"><i class="fas fa-list-alt"></i> {{ store.category }}</span>
          <span class="location"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</span>
        </div>
        <div class="rating-badge">
          <i class="fas fa-star"></i> {{ store.rating || '5.0' }}
          <span class="reviews">({{ store.reviews_count || 0 }} avaliações)</span>
        </div>
        <div class="rating-badge" style="margin-left: 10px; color: darkslategray;" :class="{ open: store.openNow }">
          <i class="fas fa-circle"></i> {{ store.openNow ? 'Aberto' : 'Fechado' }}
        </div>
      </div>

      <RouterLink :to="{ name: 'app.schedule', params: { id: store.slug } }" class="btn-schedule-cta mb-3">
        Marcar Agora
      </RouterLink>
    </div>
  </div>

  <div v-if="!loading" class="container store-content">
    <div class="gallery-section" v-if="store.gallery?.length">
      <div class="main-photo">
        <img :src="store.gallery[currentPhoto] || placeholder" alt="Foto principal" loading="lazy" />
      </div>
      <div class="thumbnail-grid">
        <div v-for="(photo, i) in store.gallery" :key="i" class="thumb" :class="{ active: i === currentPhoto }"
          @click="currentPhoto = i">
          <img :src="photo || placeholder" :alt="`Foto ${i + 1}`" loading="lazy" />
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
          <div class="contact-item" v-if="store.phone"><i class="fas fa-phone"></i> {{ store.phone }}</div>
          <div class="contact-item" v-if="store.email"><i class="fas fa-envelope"></i> {{ store.email }}</div>
          <div class="contact-item" v-if="store.instagram">
            <i class="fab fa-instagram"></i>
            <a :href="store.instagram" target="_blank">Visitar Instagram</a>
          </div>
          <div class="contact-item" v-if="store.whatsapp"><i class="fab fa-whatsapp"></i> {{ store.whatsapp }}</div>
          <div class="contact-item" v-if="store.address"><i class="fas fa-map-marker-alt"></i> {{ store.address }}</div>
        </div>

        <section class="location-section">
          <h2>Localização</h2>
          <div class="map-container">
            <iframe
              :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(store.address)}`"
              width="100%" height="380" style="border:0;border-radius:20px" loading="lazy" allowfullscreen>
            </iframe>
            <div class="map-actions">
              <a :href="googleMapsLink" target="_blank" class="btn-map google"><i class="fab fa-google"></i> Google Maps</a>
              <a :href="wazeLink" target="_blank" class="btn-map waze"><i class="fas fa-car"></i> Waze</a>
              <a :href="appleMapsLink" target="_blank" class="btn-map apple"><i class="fab fa-apple"></i> Apple Maps</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <RouterLink :to="{ name: 'app.schedule', params: { id: store.slug } }" class="fab-schedule">
    <i class="fas fa-calendar-plus"></i>
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

const placeholder = 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600'

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

const fetchStore = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/user/store/detail/${id}`)
    store.value = res.data.store || {}
    work_schedules.value = res.data.workSchedules || []
    services.value = res.data.services || []
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
  font-size: 2.5rem;
  color: #0ea5e9;
}

.store-header {
  position: relative;
  margin-top: 60px;
}

.cover-photo {
  height: 400px;
  background-size: cover;
  background-position: center;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, .75) 100%);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.store-info-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: end;
  gap: 28px;
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

.logo-wrapper {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid white;
  box-shadow: 0 12px 35px rgba(0, 0, 0, .3);
  background: white;
}

.store-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-main-info {
  color: white;
  padding-bottom: 12px;
}

.store-name {
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0 0 10px;
  line-height: 1.2;
}

.store-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 1.05rem;
  margin: 10px 0;
}

.category,
.location {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, .15);
  padding: 6px 14px;
  border-radius: 50px;
  backdrop-filter: blur(8px);
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, .2);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 12px 0;
  backdrop-filter: blur(8px);
}

.reviews {
  font-weight: 500;
  opacity: .9;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
}

.status i {
  font-size: .7rem;
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
  padding: 16px 36px;
  border: none;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 35px rgba(14, 165, 233, .4);
  transition: .3s;
  align-self: end;
}

.btn-schedule-cta:hover {
  background: #0284c7;
  transform: translateY(-5px);
}

.gallery-section {
  margin: 60px 0;
}

.main-photo {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, .15);
  margin-bottom: 20px;
}

.main-photo img {
  width: 100%;
  height: 420px;
  object-fit: cover;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 14px;
}

.thumb {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  opacity: .7;
  transition: all .3s;
  height: 100px;
  position: relative;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s;
}

.thumb:hover,
.thumb.active {
  opacity: 1;
  transform: scale(1.06);
}

.thumb.active::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 3px solid #0ea5e9;
  border-radius: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  margin: 40px 0;
}

.left-column h2 {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 40px 0 20px;
  color: #1e293b;
  position: relative;
}

.left-column h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 5px;
  background: #0ea5e9;
  border-radius: 3px;
}

.about p {
  line-height: 1.7;
  font-size: 1.05rem;
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
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item:hover {
  background: #f0f9ff;
  border-radius: 12px;
  margin: 0 -24px;
  padding: 16px 24px;
}

.service-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: #1e293b;
}

.service-item:hover .service-name {
  color: #0ea5e9;
}

.service-details span {
  margin-left: 16px;
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1.1rem;
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
  font-size: 1rem;
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

.contact-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .08);
  border: 1px solid #e2e8f0;
  margin-bottom: 36px;
}

.contact-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #1e293b;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 0;
  font-size: 1.05rem;
  color: #475569;
}

.contact-item i {
  color: #0ea5e9;
  font-size: 1.2rem;
  width: 28px;
}

.contact-item a {
  color: #0ea5e9;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.location-section h2 {
  font-size: 1.7rem;
  font-weight: 900;
  margin: 0 0 20px;
  color: #1e293b;
}

.map-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, .15);
}

.map-actions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.btn-map {
  background: white;
  color: #333;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  box-shadow: 0 12px 35px rgba(0, 0, 0, .25);
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
}

.btn-map:hover {
  transform: translateY(-6px);
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

.fab-schedule {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 68px;
  height: 68px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 12px 40px rgba(14, 165, 233, .5);
  z-index: 999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  transition: all .3s;
}

.fab-schedule:hover {
  background: #0284c7;
  transform: translateY(-6px) scale(1.1);
}

@media (max-width: 1024px) {
  .store-info-header {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
  }

  .logo-wrapper {
    margin: 0 auto;
  }

  .btn-schedule-cta {
    align-self: center;
    max-width: 360px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .cover-photo {
    height: 340px;
  }

  .store-info-header {
    margin-top: -80px;
  }

  .logo-wrapper {
    width: 140px;
    height: 140px;
  }

  .store-name {
    font-size: 2.3rem;
  }

  .main-photo img {
    height: 360px;
  }

  .thumbnail-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .map-actions {
    flex-direction: column;
    width: 80%;
  }
}

@media (max-width: 480px) {
  .cover-photo {
    height: 300px;
  }

  .store-info-header {
    margin-top: -60px;
    padding: 0 16px;
  }

  .logo-wrapper {
    width: 120px;
    height: 120px;
  }

  .store-name {
    font-size: 2rem;
  }

  .store-meta {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .main-photo img {
    height: 280px;
  }

  .thumbnail-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .fab-schedule {
    width: 60px;
    height: 60px;
    right: 16px;
    bottom: 16px;
  }
}
</style>