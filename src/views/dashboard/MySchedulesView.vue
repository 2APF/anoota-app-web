<template>
  <NavbarComponent />

  <div class="appointments-page">
    <div class="container">

      <header class="page-header">
        <h1>Meus Agendamentos</h1>
        <p>Veja todos os seus serviços marcados</p>
      </header>

      <div class="search-box">
        <i class="fas fa-search"></i>
        <input v-model="search" placeholder="Buscar por serviço, local ou data..." />
      </div>

      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
          <span class="count">{{ filteredByTab(tab.id).length }}</span>
        </button>
      </div>

      <div class="list">
        <div 
          v-for="apt in filteredAppointments" 
          :key="apt.id" 
          class="item"
          :class="apt.status"
        >
          <div class="date">
            <div class="day">{{ apt.day }}</div>
            <div class="month">{{ apt.month }}</div>
          </div>

          <div class="info">
            <h3>{{ apt.service }}</h3>
            <p>{{ apt.place }} • com {{ apt.staff }}</p>
            <div class="time">
              <i class="fas fa-clock"></i>
              {{ apt.date }} às {{ apt.time }}
            </div>
          </div>

          <div class="status-badge" :class="apt.status">
            {{ statusText(apt.status) }}
          </div>
        </div>

        <div v-if="!filteredAppointments.length" class="empty">
          <i class="fas fa-calendar-times"></i>
          <p>Nenhum agendamento encontrado</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

const search = ref('')
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: 'upcoming', label: 'Em breve' },
  { id: 'completed', label: 'Realizados' }
]

const appointments = ref([
  { id: 1, service: 'Corte Clássico + Barba', place: 'José Barber Premium', staff: 'José Silva', date: '28 Nov', time: '14:30', day: '28', month: 'Nov', status: 'upcoming' },
  { id: 2, service: 'Manicure Completa', place: 'Beauty Touch', staff: 'Ana Costa', date: '25 Nov', time: '10:00', day: '25', month: 'Nov', status: 'completed' },
  { id: 3, service: 'Massagem Relaxante', place: 'Serenity Spa', staff: 'Maria Lima', date: '22 Nov', time: '16:00', day: '22', month: 'Nov', status: 'completed' },
  { id: 4, service: 'Corte Feminino', place: 'Style Salon', staff: 'Carla Mendes', date: '30 Nov', time: '11:30', day: '30', month: 'Nov', status: 'upcoming' },
])

const filteredByTab = (tab: string) => tab === 'all' ? appointments.value : appointments.value.filter(a => a.status === tab)
const filteredAppointments = computed(() => {
  let list = activeTab.value === 'all' ? appointments.value : filteredByTab(activeTab.value)
  if (!search.value.trim()) return list
  const q = search.value.toLowerCase()
  return list.filter(a => 
    a.service.toLowerCase().includes(q) ||
    a.place.toLowerCase().includes(q) ||
    a.staff.toLowerCase().includes(q) ||
    a.date.toLowerCase().includes(q)
  )
})

const statusText = (s: string) => s === 'upcoming' ? 'Em breve' : 'Realizado'
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.appointments-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 0 140px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 56px;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.2rem;
  color: #64748b;
}

.search-box {
  position: relative;
  max-width: 520px;
  margin: 0 auto 48px;
}

.search-box i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.2rem;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 18px 20px 18px 56px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  font-size: 1.05rem;
  transition: all .3s;
}

.search-box input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 14px 32px;
  background: white;
  border: 2.5px solid #e2e8f0;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.05rem;
  color: #475569;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tabs button.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
}

.tabs .count {
  background: rgba(0,0,0,.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: .9rem;
  min-width: 28px;
}

.tabs button.active .count {
  background: rgba(255,255,255,.25);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.item {
  background: white;
  border-radius: 28px;
  padding: 32px;
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 28px;
  align-items: center;
  box-shadow: 0 12px 48px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: all .3s;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,.12);
}

.date {
  text-align: center;
}

.day {
  font-size: 2.4rem;
  font-weight: 900;
  color: #0ea5e9;
  line-height: 1;
}

.month {
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 4px;
}

.info h3 {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.info p {
  color: #64748b;
  margin: 0 0 12px;
  font-size: 1.05rem;
}

.time {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-weight: 600;
  font-size: 1rem;
}

.status-badge {
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
}

.status-badge.upcoming {
  background: #ecfdf5;
  color: #10b981;
}

.status-badge.completed {
  background: #f0f9ff;
  color: #0ea5e9;
}

.empty {
  text-align: center;
  padding: 100px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 4.5rem;
  margin-bottom: 24px;
  opacity: .5;
}

.empty p {
  font-size: 1.35rem;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .item { grid-template-columns: 90px 1fr auto; gap: 24px; padding: 28px; }
}

@media (max-width: 640px) {
  .appointments-page { padding: 80px 0 100px; }
  .container { padding: 0 20px; }
  .page-header h1 { font-size: 2.4rem; }
  .search-box { margin-bottom: 40px; }
  .item { 
    grid-template-columns: 80px 1fr; 
    gap: 20px; 
    padding: 24px; 
  }
  .status-badge { 
    grid-column: 1 / -1; 
    justify-self: center; 
    max-width: 180px; 
  }
  .day { font-size: 2rem; }
}
</style>