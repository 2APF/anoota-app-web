<template>
  <NavbarComponent />

  <div class="store-header">
    <div class="cover-photo" :style="{ backgroundImage: `url(${store.cover})` }">
      <div class="cover-overlay"></div>
    </div>

    <div class="container store-info-header mt-4">
      <div class="logo-wrapper">
        <img :src="store.logo" alt="Logo" class="store-logo" />
      </div>
      <div class="store-main-info mt-4 "  style="margin-top: 40px; color: #000;">
        <h1 class="store-name mt-4">{{ store.name }}</h1>
        <div class="store-meta">
          <span class="category">{{ store.category }}</span>
          <span class="location"><i class="fas fa-map-marker-alt"></i> {{ store.location }}</span>
        </div>
        <div class="rating-badge">
          <i class="fas fa-star"></i> {{ store.rating }}
          <span class="reviews">({{ store.reviews }} avaliações)</span>
        </div>
        <div class="status" :class="{ open: store.openNow }">
          <i class="fas fa-circle"></i> {{ store.openNow ? 'Aberto agora' : 'Fechado' }}
        </div>
      </div>
      <button class="btn-schedule-cta" @click="openScheduleModal = true">
        Agendar Agora
      </button>
    </div>
  </div>

  <div class="container store-content">
    <div class="gallery-section">
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
          <p>{{ store.description }}</p>
        </section>

        <section class="services">
          <h2>Serviços</h2>
          <div class="service-list">
            <div v-for="service in store.services" :key="service.id" class="service-item"
              @click="openServiceModal(service)">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-details">
                <span class="duration">{{ service.duration }}</span>
                <span class="price">{{ service.price }}</span>
              </div>
              <div class="arrow-icon"><i class="fas fa-chevron-right"></i></div>
            </div>
          </div>
        </section>

        <section class="opening-hours">
          <h2>Horário de Funcionamento</h2>
          <div class="hours">
            <div v-for="day in store.hours" :key="day.day" class="hour-line"
              :class="{ today: day.today, closed: !day.open }">
              <span class="day">{{ day.day }}</span>
              <span class="time" v-if="day.open">{{ day.open }} - {{ day.close }}</span>
              <span class="closed-text" v-else>Fechado</span>
            </div>
          </div>
        </section>

        <section class="location-section">
          <h2>Localização</h2>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.845596987123!2d-9.141975!3d38.722252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19337a4a054b93%3A0x79f2d691f3c3e6f!2sAvenida%20da%20Liberdade%2C%20Lisboa!5e0!3m2!1spt-PT!2spt!4v1700000000000"
              width="100%" height="420" style="border:0;border-radius:24px" allowfullscreen="" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <div class="map-actions">
              <a :href="googleMapsLink" target="_blank" class="btn-map google"><i class="fab fa-google"></i> Google
                Maps</a>
              <a :href="wazeLink" target="_blank" class="btn-map waze"><i class="fas fa-car"></i> Waze</a>
              <a :href="appleMapsLink" target="_blank" class="btn-map apple"><i class="fab fa-apple"></i> Apple Maps</a>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <div class="schedule-card">
          <h3>Agendar Horário</h3>
          <div class="quick-schedule">
            <button v-for="slot in quickSlots" :key="slot" class="quick-slot"
              :class="{ selected: selectedSlot === slot }" @click="selectedSlot = slot">
              {{ slot }}
            </button>
          </div>
          <button class="btn-full-schedule" @click="openScheduleModal = true">Ver Todos os Horários</button>
        </div>

        <div class="contact-card">
          <h3>Contato</h3>
          <div class="contact-item"><i class="fas fa-phone"></i> {{ store.phone }}</div>
          <div class="contact-item"><i class="fas fa-envelope"></i> {{ store.email }}</div>
          <div class="contact-item"><i class="fas fa-globe"></i> {{ store.website }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" :class="{ active: openScheduleModal }" @click="openScheduleModal = false">
    <div class="schedule-modal" @click.stop>
      <div class="modal-header">
        <h3>Escolher Data e Horário</h3>
        <button @click="openScheduleModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="calendar-placeholder">Calendário completo aqui</div>
        <button class="btn-confirm-schedule">Confirmar Agendamento</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" :class="{ active: selectedService }" @click="selectedService = null">
    <div class="service-modal" @click.stop>
      <button @click="selectedService = null" class="close-modal">×</button>
      <div class="service-hero" :style="{ backgroundImage: `url(${store.gallery[1] || store.cover})` }"></div>
      <div class="service-info">
        <h2>{{ selectedService?.name }}</h2>
        <div class="price-tag">{{ selectedService?.price }} <span>• {{ selectedService?.duration }}</span></div>
        <p>{{ selectedService?.description || 'Serviço premium realizado com técnica apurada e produtos de alta qualidade.' }}</p>
        <button @click="openScheduleModal = true; selectedService = null" class="btn-service-cta">Agendar Este
          Serviço</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

const currentPhoto = ref(0)
const openScheduleModal = ref(false)
const selectedSlot = ref('')
const selectedService = ref<any>(null)

const store = ref({
  id: 1,
  name: 'José Barber Premium',
  category: 'Cabeleireiro Masculino & Barbearia',
  location: 'Avenida da Liberdade 124, Lisboa',
  rating: 4.9,
  reviews: 428,
  openNow: true,
  description: 'A José Barber Premium é referência em Lisboa no corte masculino clássico e moderno. Ambiente premium, barbeiros experientes e produtos de alta qualidade. Aqui o homem se sente rei.',
  phone: '+351 911 234 567',
  email: 'contato@josebarber.pt',
  website: 'www.josebarber.pt',
  cover: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600',
  logo: 'https://images.unsplash.com/photo-1631118909886-9adf17d5fb3e?w=400',
  gallery: [
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200',
    'https://images.unsplash.com/photo-1595475207547-529f05f1fd1a?w=1200',
    'https://images.unsplash.com/photo-1605497788044-5a28bbf2e49f?w=1200'
  ],
  services: [
    { id: 1, name: 'Corte Clássico + Barba', duration: '50 min', price: '45€', description: 'Corte tradicional com navalha + barba completa com toalha quente e finalização premium.' },
    { id: 2, name: 'Corte Moderno', duration: '35 min', price: '32€', description: 'Fade perfeito, acabamento impecável e estilo atualizado com as tendências.' },
    { id: 3, name: 'Barba Completa', duration: '40 min', price: '28€', description: 'Modelagem precisa, óleos premium e finalização com cera.' },
    { id: 4, name: 'Sobrancelha + Nariz', duration: '15 min', price: '15€' },
    { id: 5, name: 'Coloração', duration: '60 min', price: '55€' }
  ],
  hours: [
    { day: 'Segunda', open: '10:00', close: '20:00', today: false },
    { day: 'Terça', open: '10:00', close: '20:00', today: false },
    { day: 'Quarta', open: '10:00', close: '20:00', today: true },
    { day: 'Quinta', open: '10:00', close: '21:00', today: false },
    { day: 'Sexta', open: '10:00', close: '21:00', today: false },
    { day: 'Sábado', open: '09:00', close: '18:00', today: false },
    { day: 'Domingo', open: null, close: null, today: false }
  ]
})

const quickSlots = ['14:30', '15:00', '16:30', '17:00', '18:30', '19:00']

const googleMapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.value.location)}`)
const wazeLink = computed(() => `https://waze.com/ul?q=${encodeURIComponent(store.value.location)}`)
const appleMapsLink = computed(() => `http://maps.apple.com/?q=${encodeURIComponent(store.value.location)}`)

const openServiceModal = (service: any) => selectedService.value = service
</script>

<style scoped>
.store-header {
  position: relative;
  margin-top: 80px
}

.cover-photo {
  height: 420px;
  background-size: cover;
  background-position: center;
  position: relative
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, .7) 100%)
}

.store-info-header {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  margin-top: -100px;
  position: relative;
  z-index: 2;
  padding: 0 20px
}

.logo-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .3);
  background: white;
  flex-shrink: 0
}

.store-logo {
  width: 100%;
  height: 100%;
  object-fit: cover
}

.store-main-info {
  flex: 1;
  color: white;
  margin-bottom: 20px
}

.store-name {
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0
}

.store-meta {
  font-size: 1.1rem;
  opacity: .95;
  margin: 8px 0
}

.category {
  background: rgba(255, 255, 255, .2);
  padding: 6px 14px;
  border-radius: 50px;
  margin-right: 12px;
  font-weight: 600
}

.location i {
  margin-right: 8px
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
  margin: 12px 0
}

.reviews {
  font-weight: 500;
  opacity: 0.9;
  color:#000;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 8px
}

.status i {
  font-size: .6rem
}

.status.open {
  color: #10b981
}

.status.open i {
  color: #10b981
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
  margin-bottom: 20px
}

.btn-schedule-cta:hover {
  background: #0c8bd1;
  transform: translateY(-4px)
}

.gallery-section {
  margin: 60px 0
}

.main-photo {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, .15);
  margin-bottom: 20px
}

.main-photo img {
  width: 100%;
  height: 500px;
  object-fit: cover
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px
}

.thumb {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  opacity: .7;
  transition: all .3s;
  position: relative;
  height: 120px
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .3s
}

.thumb.active,
.thumb:hover {
  opacity: 1;
  transform: scale(1.05)
}

.thumb.active::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 4px solid #0ea5e9;
  border-radius: 16px
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 60px;
  margin: 40px 0
}

.left-column h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 40px 0 20px;
  color: #1e293b;
  position: relative
}

.left-column h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 70px;
  height: 5px;
  background: #0ea5e9;
  border-radius: 3px
}

.about p {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #475569
}

.service-list {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all .3s;
  position: relative
}

.service-item:hover {
  background: #f0f9ff;
  border-radius: 16px;
  margin: 0 -24px;
  padding: 20px 24px
}

.service-item:last-child {
  border-bottom: none
}

.service-name {
  font-weight: 700;
  font-size: 1.2rem;
  transition: .3s
}

.service-item:hover .service-name {
  color: #0ea5e9;
  font-weight: 900
}

.service-details span {
  margin-left: 16px;
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1.15rem
}

.arrow-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all .3s;
  font-size: 1.4rem;
  color: #0ea5e9
}

.service-item:hover .arrow-icon {
  opacity: 1;
  right: 16px
}

.hours {
  background: #f8fafc;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0
}

.hour-line {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-weight: 600
}

.hour-line.today {
  color: #0ea5e9;
  font-weight: 800;
  background: #f0f9ff;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 0 -16px
}

.closed-text {
  color: #ef4444;
  font-weight: 700
}

.location-section {
  margin-top: 60px
}

.map-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .2)
}

.map-actions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
  z-index: 10
}

.btn-map {
  background: white;
  color: #333;
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .25);
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem
}

.btn-map:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, .3)
}

.btn-map.google:hover {
  background: #4285f4;
  color: white
}

.btn-map.waze {
  background: #33ccff;
  color: white
}

.btn-map.apple {
  background: #000;
  color: white
}

.right-column .schedule-card,
.contact-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .08);
  border: 1px solid #e2e8f0;
  margin-bottom: 32px
}

.right-column h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 20px
}

.quick-schedule {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px
}

.quick-slot {
  background: #f0f9ff;
  border: 2px solid transparent;
  padding: 14px;
  text-align: center;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: .3s
}

.quick-slot.selected,
.quick-slot:hover {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9
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
  cursor: pointer
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  font-size: 1.05rem;
  color: #475569
}

.contact-item i {
  color: #0ea5e9
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
  backdrop-filter: blur(8px)
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible
}

.schedule-modal {
  background: white;
  border-radius: 28px;
  width: 90%;
  max-width: 560px;
  overflow: hidden;
  box-shadow: 0 30px 100px rgba(0, 0, 0, .4)
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0
}

.modal-header h3 {
  font-size: 1.6rem;
  font-weight: 800
}

.modal-header button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748b
}

.modal-body {
  padding: 32px;
  text-align: center
}

.calendar-placeholder {
  background: #f8fafc;
  padding: 80px;
  border-radius: 20px;
  margin-bottom: 32px;
  font-size: 1.2rem;
  color: #64748b
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
  transition: .3s
}

.btn-confirm-schedule:hover {
  background: #059669;
  transform: translateY(-3px)
}

.service-modal {
  background: white;
  border-radius: 32px;
  overflow: hidden;
  max-width: 520px;
  width: 94%;
  box-shadow: 0 40px 120px rgba(0, 0, 0, .5);
  position: relative
}

.service-hero {
  height: 360px;
  background-size: cover;
  background-position: center;
  position: relative
}

.service-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, .85), transparent 40%)
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
  transition: .3s
}

.close-modal:hover {
  background: #000
}

.service-info {
  padding: 40px 32px;
  text-align: center;
  position: relative;
  z-index: 2;
  margin-top: -100px
}

.service-info h2 {
  font-size: 2.6rem;
  font-weight: 900;
  margin-bottom: 16px;
  color: #1e293b
}

.price-tag {
  font-size: 3.2rem;
  font-weight: 900;
  color: #0ea5e9;
  margin: 20px 0
}

.price-tag span {
  font-size: 1.4rem;
  color: #64748b;
  font-weight: 600
}

.service-info p {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #475569;
  margin: 24px 0
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
  box-shadow: 0 12px 30px rgba(14, 165, 233, .4)
}

.btn-service-cta:hover {
  background: #0c8bd1;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(14, 165, 233, .5)
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px
}

@media (max-width:968px) {
  .store-info-header {
    flex-direction: column;
    align-items: center;
    text-align: center
  }

  .logo-wrapper {
    margin: 0 auto -60px
  }

  .btn-schedule-cta {
    align-self: stretch;
    margin: 30px 0 0
  }

  .content-grid {
    grid-template-columns: 1fr
  }

  .thumbnail-grid {
    grid-template-columns: repeat(2, 1fr)
  }

  .main-photo img {
    height: 380px
  }

  .map-actions {
    flex-direction: column;
    width: 86%;
    left: 7%
  }
}

@media (max-width:640px) {
  .store-name {
    font-size: 2.2rem
  }

  .main-photo img {
    height: 300px
  }

  .price-tag {
    font-size: 2.6rem
  }
}
</style>