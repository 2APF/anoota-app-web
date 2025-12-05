<template>
  <NavbarComponent />

  <div class="container appointments-page">
    <div class="header">
      <h1>Marcações</h1>
      <div class="actions">
        <button class="btn-filter" @click="showFilters = !showFilters">
          <i class="fas fa-filter"></i> Filtros
        </button>
        <button class="btn-new" @click="openNewAppointment">
          <i class="fas fa-plus"></i> Nova Marcação
        </button>
      </div>
    </div>

    <div class="tabs">
      <button :class="{ active: tab === 'today' }" @click="tab = 'today'">Hoje</button>
      <button :class="{ active: tab === 'week' }" @click="tab = 'week'">Esta Semana</button>
      <button :class="{ active: tab === 'all' }" @click="tab = 'all'">Todas</button>
      <button :class="{ active: tab === 'canceled' }" @click="tab = 'canceled'">Canceladas</button>
    </div>

    <Transition name="fade">
      <div v-if="showFilters" class="filters">
        <select v-model="filterStatus">
          <option value="all">Todos os estados</option>
          <option value="confirmed">Confirmado</option>
          <option value="pending">Pendente</option>
          <option value="completed">Concluído</option>
          <option value="canceled">Cancelado</option>
        </select>
        <input type="date" v-model="filterDate" />
        <input type="text" v-model="filterClient" placeholder="Procurar cliente..." />
        <button @click="clearFilters">Limpar</button>
      </div>
    </Transition>

    <div class="appointments-list">
      <div v-for="apt in filteredAppointments" :key="apt.id" class="appointment-card" :class="apt.status">
        <div class="time-badge">
          <div class="hour">{{ apt.time }}</div>
          <div class="duration">{{ apt.duration }}</div>
        </div>

        <div class="client-info">
          <div class="avatar" :style="{ backgroundImage: `url(${apt.avatar})` }"></div>
          <div class="details">
            <h4>{{ apt.client }}</h4>
            <p>{{ apt.service }}{{ apt.service }}</p>
            <div class="tags">
              <span class="tag" :class="apt.status">{{ statusText(apt.status) }}</span>
              <span v-if="apt.firstTime" class="tag new">Primeira vez</span>
            </div>
          </div>
        </div>

        <div class="price">€ {{ apt.price }}</div>

        <div class="actions">
          <button class="action-btn" @click="editAppointment(apt)"><i class="fas fa-edit"></i></button>
          <button class="action-btn" @click="confirmAppointment(apt)" v-if="apt.status === 'pending'"><i class="fas fa-check"></i></button>
          <button class="action-btn danger" @click="cancelAppointment(apt)"><i class="fas fa-times"></i></button>
        </div>
      </div>
    </div>

    <div class="summary">
      <div class="summary-item">
        <span>Hoje</span>
        <strong>18 marcações</strong>
      </div>
      <div class="summary-item">
        <span>Receita do dia</span>
        <strong>€ 842</strong>
      </div>
      <div class="summary-item">
        <span>Próximas 7 dias</span>
        <strong>124 marcações</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

const tab = ref('today')
const showFilters = ref(false)
const filterStatus = ref('all')
const filterDate = ref('')
const filterClient = ref('')

const appointments = ref([
  { id: 1, time: '09:30', duration: '50 min', client: 'Ricardo Alves', service: 'Corte Clássico + Barba', price: 45, status: 'confirmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', firstTime: true },
  { id: 2, time: '10:30', duration: '35 min', client: 'Miguel Santos', service: 'Corte Moderno', price: 32, status: 'pending', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', firstTime: false },
  { id: 3, time: '11:00', duration: '40 min', client: 'Ana Costa', service: 'Barba Completa', price: 28, status: 'completed', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', firstTime: false },
  { id: 4, time: '14:00', duration: '50 min', client: 'João Mendes', service: 'Corte + Barba', price: 45, status: 'confirmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', firstTime: true },
  { id: 5, time: '15:30', duration: '35 min', client: 'Pedro Silva', service: 'Corte Moderno', price: 32, status: 'confirmed', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', firstTime: false },
  { id: 6, time: '17:00', duration: '1h 20min', client: 'Luís Ferreira', service: 'Corte + Coloração', price: 85, status: 'pending', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', firstTime: false }
])

const filteredAppointments = computed(() => {
  let list = appointments.value

  if (tab.value === 'today') list = list.filter(a => ['09:30','10:30','11:00','14:00','15:30','17:00'].includes(a.time))
  if (tab.value === 'canceled') list = []

  if (filterStatus.value !== 'all') list = list.filter(a => a.status === filterStatus.value)
  if (filterDate.value) list = list.filter(a => true)
  if (filterClient.value) list = list.filter(a => a.client.toLowerCase().includes(filterClient.value.toLowerCase()))

  return list
})

const statusText = (status: string) => {
  const map: any = { confirmed: 'Confirmado', pending: 'Pendente', completed: 'Concluído', canceled: 'Cancelado' }
  return map[status] || status
}

const openNewAppointment = () => alert('Abrir modal de nova marcação')
const editAppointment = (apt: any) => alert(`Editar marcação de ${apt.client}`)
const confirmAppointment = (apt: any) => { apt.status = 'confirmed'; alert('Marcacão confirmada!') }
const cancelAppointment = (apt: any) => { apt.status = 'canceled'; alert('Marcacão cancelada') }
const clearFilters = () => { filterStatus.value = 'all'; filterDate.value = ''; filterClient.value = '' }
</script>

<style scoped>
.container { max-width: 1360px; margin: 0 auto; padding: 0 24px; }
.appointments-page { margin-top: 80px; padding: 40px 0; min-height: 100vh; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
}
h1 { font-size: 2.6rem; font-weight: 900; color: #1e293b; margin: 0; }

.actions { display: flex; gap: 12px; }
.btn-filter, .btn-new {
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-filter { background: #f1f5f9; color: #475569; border: none; }
.btn-filter:hover { background: #e2e8f0; }
.btn-new { background: #10b981; color: white; border: none; box-shadow: 0 8px 25px rgba(16,185,129,.3); }
.btn-new:hover { background: #059669; transform: translateY(-3px); }

.tabs {
  display: flex;
  background: #f8fafc;
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 8px;
}
.tabs button {
  padding: 12px 28px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}
.tabs button.active {
  background: #0ea5e9;
  color: white;
  box-shadow: 0 6px 20px rgba(14,165,233,.3);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 32px;
  align-items: end;
}
.filters select, .filters input, .filters button {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
}
.filters button {
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}
.appointment-card {
  background: white;
  border-radius: 20px;
  padding: 20px 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 120px 1fr 100px 120px;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}
.appointment-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }

.time-badge {
  text-align: center;
  font-weight: 700;
}
.hour { font-size: 1.6rem; color: #1e293b; }
.duration { font-size: 0.95rem; color: #64748b; margin-top: 4px; }

.client-info { display: flex; align-items: center; gap: 16px; }
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: center/cover no-repeat;
  flex-shrink: 0;
  border: 3px solid #f0f9ff;
}
.details h4 { margin: 0; font-size: 1.2rem; font-weight: 800; color: #1e293b; }
.details p { margin: 4px 0 8px; color: #64748b; font-size: 0.95rem; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}
.tag.confirmed { background: #ecfdf5; color: #10b981; }
.tag.pending { background: #fff7ed; color: #f97316; }
.tag.completed { background: #f0f9ff; color: #0ea5e9; }
.tag.canceled { background: #fef2f2; color: #ef4444; }
.tag.new { background: #f3e8ff; color: #a855f7; }

.price {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1e293b;
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn:hover { background: #e2e8f0; transform: translateY(-2px); }
.action-btn.danger:hover { background: #fecaca; color: #dc2626; }

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
}
.summary-item {
  background: white;
  border-radius: 20px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
.summary-item span { display: block; color: #64748b; font-weight: 600; margin-bottom: 8px; }
.summary-item strong { font-size: 2rem; font-weight: 900; color: #1e293b; }

@media (max-width: 992px) {
  .appointment-card { grid-template-columns: 100px 1fr 100px auto; gap: 16px; }
}
@media (max-width: 768px) {
  .appointment-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .actions { justify-content: center; margin-top: 16px; }
  .price { text-align: center; margin: 12px 0; }
}
@media (max-width: 480px) {
  .header { flex-direction: column; text-align: center; }
  .tabs { justify-content: center; }
  h1 { font-size: 2.1rem; }
}
</style>