<template>
  <NavbarComponent />

  <div class="appointments-page">
    <div v-if="loading" class="loading-screen">
      <i class="fas fa-spinner fa-spin"></i>
    </div>

    <div v-else class="container">
      <header class="page-header">
        <h1>Meus Agendamentos</h1>
        <p>Gestão completa dos teus serviços marcados</p>
      </header>

      <div class="search-box">
        <input v-model="search" placeholder="Buscar por serviço, loja ou data..." />
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
            <div class="day">{{ formatDate(apt.start_datetime).day }}</div>
            <div class="month">{{ formatDate(apt.start_datetime).month }}</div>
          </div>

          <div class="info">
            <h3>{{ apt.name_service }}</h3>
            <p>{{ apt.name_store || 'Loja' }}</p>
            <div class="time">
              <i class="fas fa-clock"></i>
              {{ format(apt.start_datetime, 'd MMMM yyyy • HH:mm', { locale: pt }) }}
            </div>
            <div class="price">€{{ apt.price_service }}</div>
          </div>

          <div class="actions">
            <div class="status-badge" :class="apt.status">
              {{ statusText(apt.status) }}
            </div>
            <button
              v-if="apt.status === 'upcoming'"
              @click.stop="openCancelModal(apt)"
              class="btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>

        <div v-if="!filteredAppointments.length" class="empty">
          <i class="fas fa-calendar-times"></i>
          <p v-if="search">Nenhum agendamento encontrado</p>
          <p v-else>Ainda não tens agendamentos</p>
          <button @click="router.push('/')" class="btn-explore">
            Explorar serviços
          </button>
        </div>
      </div>
    </div>
  </div>

  <teleport to="body">
    <transition name="fade">
      <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
        <div class="modal-card" @click.stop>
          <div class="modal-body">
            <h4>Certeza que queres cancelar?</h4>
            <div class="appointment-details">
              <strong>{{ selectedAppointment?.name_service }}</strong><br />
              {{ selectedAppointment?.name_store }}<br />
              {{ selectedAppointment && format(selectedAppointment.start_datetime, 'd MMMM yyyy • HH:mm', { locale: pt }) }}
            </div>

            <div class="reason-group">
              <label>Motivo do cancelamento <span>(obrigatório)</span></label>
              <textarea
                v-model="cancelReason"
                placeholder="Ex: mudança de planos, imprevisto..."
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="closeCancelModal" class="btn-secondary">
              Manter agendamento
            </button>
            <button
              @click="confirmCancel"
              :disabled="!cancelReason.trim() || cancelling"
              class="btn-danger"
            >
              <i v-show="cancelling" class="fas fa-spinner fa-spin"></i>
              {{ cancelling ? 'A cancelar...' : 'Confirmar cancelamento' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

let userId = ''
if (typeof route.params.user === 'string') {
  userId = route.params.user
} else if (Array.isArray(route.params.user)) {
  userId = route.params.user[0] || ''
} else if (route.params.user && typeof route.params.user === 'object') {
  userId = (route.params.user as any).id || ''
}

const loading = ref(true)
const search = ref('')
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: 'upcoming', label: 'Em breve' },
  { id: 'cancelled', label: 'Cancelados' }
]

const appointments = ref<any[]>([])

const fetchAppointments = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/user/schedule/my/${userId}`)
    const schedules = res.data.schedules || []
    appointments.value = schedules.map((apt: any) => ({
      ...apt,
      status: apt.cancelled_at
        ? 'cancelled'
        : new Date(apt.start_datetime) < new Date()
        ? 'completed'
        : 'upcoming'
    }))
  } catch (err) {
    appointments.value = []
  } finally {
    loading.value = false
  }
}

const filteredByTab = (tab: string) => {
  if (tab === 'all') return appointments.value
  return appointments.value.filter(a => a.status === tab)
}

const filteredAppointments = computed(() => {
  let list = filteredByTab(activeTab.value)
  if (!search.value.trim()) return list.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())

  const q = search.value.toLowerCase()
  return list.filter(a =>
    a.name_service.toLowerCase().includes(q) ||
    (a.name_store || '').toLowerCase().includes(q) ||
    format(new Date(a.start_datetime), 'd MMMM yyyy').toLowerCase().includes(q)
  )
})

const statusText = (status: string) => {
  switch (status) {
    case 'upcoming': return 'Em breve'
    case 'completed': return 'Realizado'
    case 'cancelled': return 'Cancelado'
    default: return status
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    day: format(date, 'd'),
    month: format(date, 'MMM', { locale: pt }).toUpperCase()
  }
}

const showCancelModal = ref(false)
const selectedAppointment = ref<any>(null)
const cancelReason = ref('')
const cancelling = ref(false)

const openCancelModal = (apt: any) => {
  selectedAppointment.value = apt
  cancelReason.value = ''
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedAppointment.value = null
}

const confirmCancel = async () => {
  if (!selectedAppointment.value || !cancelReason.value.trim()) return

  cancelling.value = true
  try {
    await axios.post(`${API_URL}/store/schedule/cancel/${selectedAppointment.value.id}/${userId}`, {
      reason_cancelled: cancelReason.value.trim(),
    })
    await fetchAppointments()
    closeCancelModal()
  } catch (err) {
    console.log('erro: ', err)
  } finally {
    cancelling.value = false
  }
}

onMounted(fetchAppointments)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.appointments-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 0 120px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-screen {
  position: fixed;
  inset: 0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-size: 3rem;
  color: #0ea5e9;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.15rem;
  color: #64748b;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-box input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  font-size: 1rem;
  transition: all .3s;
}

.search-box input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

.search-box::before {
  content: '\f002';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.2rem;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 12px 28px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  color: #475569;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: .85rem;
  min-width: 26px;
}

.tabs button.active .count {
  background: rgba(255,255,255,.25);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item {
  background: white;
  border-radius: 24px;
  padding: 28px;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 24px;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: all .3s;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0,0,0,.12);
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
  font-size: .95rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 4px;
  text-transform: uppercase;
}

.info h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
}

.info p {
  color: #64748b;
  margin: 0 0 10px;
  font-size: 1rem;
}

.time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-weight: 600;
  font-size: .95rem;
  margin-bottom: 6px;
}

.price {
  font-size: 1.2rem;
  font-weight: 900;
  color: #10b981;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 700;
  font-size: .9rem;
}

.status-badge.upcoming {
  background: #ecfdf5;
  color: #10b981;
}

.status-badge.completed {
  background: #f0f9ff;
  color: #0ea5e9;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #ef4444;
}

.btn-cancel {
  padding: 8px 18px;
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 50px;
  font-weight: 700;
  font-size: .9rem;
  cursor: pointer;
  transition: all .3s;
}

.btn-cancel:hover {
  background: #fee2e2;
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
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0 0 28px;
}

.btn-explore {
  padding: 14px 32px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}

.btn-explore:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(16,185,129,.3);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.modal-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 30px 80px rgba(0,0,0,.35);
  text-align: center;
}

.modal-card h4 {
  margin: 0 0 20px;
  font-size: 1.6rem;
  color: #1e293b;
  font-weight: 800;
}

.appointment-details {
  background: #f8fafc;
  padding: 18px;
  border-radius: 16px;
  margin-bottom: 24px;
  font-size: 1.05rem;
  color: #1e293b;
}

.reason-group label {
  display: block;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  text-align: left;
}

.reason-group label span {
  font-weight: 500;
  color: #ef4444;
  font-size: .9rem;
}

.reason-group textarea {
  width: 100%;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  resize: vertical;
  transition: all .3s;
}

.reason-group textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 5px rgba(14,165,233,.12);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  flex: 1;
  padding: 14px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all .3s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  flex: 1;
  padding: 14px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .item {
    grid-template-columns: 80px 1fr;
    gap: 20px;
    padding: 24px;
  }

  .actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .status-badge {
    order: 2;
    padding: 8px 16px;
    font-size: .85rem;
  }

  .btn-cancel {
    order: 1;
    padding: 8px 16px;
    font-size: .9rem;
  }

  .day {
    font-size: 2.2rem;
  }

  .info h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .appointments-page {
    padding: 80px 0 100px;
  }

  .container {
    padding: 0 16px;
  }

  .page-header {
    margin-bottom: 36px;
  }

  .page-header h1 {
    font-size: 2.2rem;
  }

  .page-header p {
    font-size: 1.1rem;
  }

  .search-box {
    margin-bottom: 32px;
  }

  .search-box input {
    padding: 14px 18px 14px 48px;
    font-size: .95rem;
  }

  .tabs {
    gap: 10px;
    margin-bottom: 32px;
  }

  .tabs button {
    padding: 10px 20px;
    font-size: .95rem;
  }

  .item {
    padding: 20px;
    border-radius: 20px;
  }

  .day {
    font-size: 2rem;
  }

  .info h3 {
    font-size: 1.2rem;
  }

  .time,
  .price {
    font-size: .95rem;
  }

  .empty {
    padding: 80px 20px;
  }

  .empty i {
    font-size: 4rem;
  }

  .empty p {
    font-size: 1.2rem;
  }

  .btn-explore {
    padding: 12px 28px;
    font-size: 1rem;
  }

  .modal-card {
    padding: 24px;
    margin: 0 10px;
    border-radius: 24px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-secondary,
  .btn-danger {
    padding: 14px;
    font-size: 1rem;
  }
}
</style>