<template>
  <NavbarComponent />

  <div class="agenda">
    <header class="header">
      <h1>Agenda</h1>
      <div class="tabs">
        <button @click="view = 'day'" :class="{ active: view === 'day' }">Dia</button>
        <button @click="view = 'month'" :class="{ active: view === 'month' }">Mês</button>
      </div>
      <div class="nav">
        <button @click="prev" class="btn-nav"><i class="fas fa-chevron-left"></i></button>
        <button @click="today" class="btn-today">Hoje</button>
        <button @click="next" class="btn-nav"><i class="fas fa-chevron-right"></i></button>
      </div>
    </header>

    <div v-if="view === 'month'" class="month-view">
      <div class="month-title">
        <h2 style="color: white;">{{ monthName }}</h2>
      </div>
      <div class="weekdays">
        <span v-for="d in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="d">{{ d }}</span>
      </div>
      <div class="days-grid">
        <div v-for="cell in monthCells" :key="cell.key" class="day-cell"
          :class="{ today: cell.isToday, selected: cell.date && isSameDay(cell.date, selectedDate), other: cell.otherMonth }"
          @click="cell.date && selectDate(cell.date)">
          <div class="day-num">{{ cell.num }}</div>
          <div v-if="cell.count" class="dots">
            <span v-for="n in Math.min(cell.count, 3)" :key="n"></span>
            <span v-if="cell.count > 3" class="more">+{{ cell.count - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="day-view">
      <div class="day-title">
        <h2 style="color: white;">{{ formatDay(selectedDate) }}</h2>
        <span>{{ formatDate(selectedDate) }}</span>
        <button @click="openNew" class="btn-add">+ Nova marcação</button>
      </div>

      <div v-if="dayAppointments.length === 0" class="empty">
        <i class="fas fa-calendar-check"></i>
        <p>Dia livre</p>
      </div>

      <div v-else class="list">
        <div v-for="apt in dayAppointments" :key="apt.id" class="item" :style="{ backgroundColor: apt.status === '3' ? '#d4edda' : ''}">
          <div class="time">{{ apt.time }}</div>
          <div class="details">
            <div class="client">{{ apt.client_name }}</div>
            <div class="service">
              <div v-for="s in apt.services_list" :key="s.id">{{ s.name }}</div>
            </div>
          </div>
          <div class="price">€{{ apt.total_price }}</div>
          <div class="duration">{{ apt.total_duration }}min</div>
          
          <div class="actions" v-if="apt.status != '3'">
            <button @click="openModalChecked(apt)" class="edit"><i class="fas fa-check"></i></button>
            <button @click="edit(apt)" class="edit"><i class="fas fa-edit"></i></button>
            <button @click="openDelete(apt)" class="delete"><i class="fas fa-trash"></i></button>
          </div>
           <div class="actions" v-else>
            <button @click="openDelete(apt)" class="delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- <button @click="openNew" class="fab">+</button> -->

    <teleport to="body">
      <Transition name="modal">
        <div v-if="modal" class="modal-overlay" @click="modal = false">
          <div class="modal-card pro" @click.stop v-if="availableTimes">
            <div class="modal-header">
              <h3>{{ editMode ? 'Editar Marcação' : 'Nova Marcação' }}</h3>
              <button @click="modal = false" class="close-btn">×</button>
            </div>

            <p class="date">{{ formatDate(selectedDate) }}</p>

            <form @submit.prevent="submitCreate" class="modal-form">
              <div class="field">
                <label>Cliente *</label>
                <select v-model="form.client_id" required>
                  <option value="">Selecione o cliente</option>
                  <option v-for="c in clients" :key="c.id" :value="c.id">
                    {{ c.name }} {{ c.phone ? `(${c.phone})` : '' }}
                  </option>
                </select>
              </div>

              <div class="field">
                <label>Serviços *</label>
                <div class="search-input">
                  <input type="text" v-model="searchService" placeholder="Buscar serviços..." />
                </div>
                <div class="services-grid">
                  <label v-for="s in filteredServices" :key="s.id" class="service-item"
                    :class="{ selected: form.service_ids.includes(s.id) }">
                    <input type="checkbox" :value="s.id" v-model="form.service_ids" />
                    <div class="content">
                      <div class="name">{{ s.name }}</div>
                      <div class="meta">€{{ s.price }} • {{ s.duration_minutes }}min</div>
                    </div>
                    <span class="checkmark"><i class="fas fa-check"></i></span>
                  </label>
                </div>
              </div>

              <div v-if="selectedServices.length" class="summary">
                <div class="summary-item"><span>Serviços: </span><strong>{{ selectedServices.length }}</strong></div>
                <div class="summary-item"><span>Total: </span><strong class="price">€{{ totalPrice }}</strong></div>
                <div class="summary-item"><span>Duração: </span><strong>{{ totalDuration }} min</strong></div>
              </div>

              <div class="field">
                <label>Horário *</label>
                <select v-model="form.time" required :disabled="loadingSlots">
                  <option :value="form.time" v-if="editMode" selected >{{ form.time }}</option>
                  <option value="">{{ loadingSlots ? 'Carregando...' : 'Selecione o horário' }}</option>
                  <option v-for="slot in availableTimeSlots" :key="slot" :value="slot" >{{ slot }}</option>
                </select>
              </div>

              <div class="form-actions">
                
                
                <button type="button" @click="modal = false">Manter</button>
                <button type="submit" class="primary" 
                  :disabled="!form.client_id || !form.service_ids.length || !form.time || loadingSlots || loading">
                  {{ editMode ? 'Atualizar' : 'Agendar' }}
                </button>
              </div>
            </form>
          </div>

            <div v-else class="modal-card pro" @click.stop>
            <div class="modal-header">
              <h3>Sem horários disponíveis</h3>
              <button @click="modal = false" class="close-btn">×</button>
            </div>
            <p class="date">{{ formatDate(selectedDate) }}</p>
            <div class="modal-form">
              <p>Não há horários disponíveis para este dia. Por favor, escolha outro dia.</p>
              <div class="form-actions">
                <button type="button" @click="modal = false">Fechar</button>
              </div>
            </div>
          </div>
        
        </div>
      </Transition>
    </teleport>

    <teleport to="body">
      <Transition name="modal">
        <div v-if="deleteModal" class="modal-overlay" @click="deleteModal = false">
          <div class="modal-card delete-modal" @click.stop>
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Remover marcação?</h3>
            <p><strong>{{ appointmentToDelete?.client_name }}</strong></p>
            <p>{{ appointmentToDelete?.time }} • {{appointmentToDelete?.services_list.map(s => s.name).join(', ')}}
            </p>
            <div class="form-actions">
              <button @click="deleteModal = false">Cancelar</button>
              <button @click="confirmDelete" :disabled="loading" class="primary delete">Sim, remover</button>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>


    <teleport to="body">
      <Transition name="modal">
      <div v-if="checkedModal" class="modal-overlay" @click="checkedModal = false">
        <div class="modal-card delete-modal" @click.stop>
        <i class="fas fa-check-circle"></i>
        <h3>Marcação concluída?</h3>
        <p><strong>{{ appointmentToCheck?.client_name }}</strong></p>
        <p>{{ appointmentToCheck?.time }} • {{appointmentToCheck?.services_list.map(s => s.name).join(', ')}}
        </p>
        <div class="form-actions">
          <button @click="checkedModal = false">Cancelar</button>
          <button @click="confirmChecked" :disabled="loading" class="primary check">Sim, concluir</button>
        </div>
        </div>
      </div>
      </Transition>
    </teleport>



  </div>

  
  <div v-if="notification.message" class="notification" :class="notification.type">
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'
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
  type?: string;
}

let user: User;
if (typeof route.params.user === 'string') {
  user = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else if (Array.isArray(route.params.user)) {
  user = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else {
  user = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
}


interface Client { id: number; name: string; phone: string; email: string }
interface Service { id: number; name: string; price: string; duration_minutes: number }
interface Appointment { id: number; client_id: number; client_name: string; services_list: Service[]; time: string; total_price: string; total_duration: number; date: string }

const view = ref<'day' | 'month'>('day')
const selectedDate = ref(new Date())
const currentMonth = ref(new Date())

const clients = ref<Client[]>([])
const services = ref<Service[]>([])
const appointments = ref<Appointment[]>([])
const availableTimeSlots = ref<string[]>([])
const loadingSlots = ref(false)

const modal = ref(false)
const deleteModal = ref(false)
const checkedModal = ref(false)
const appointmentToCheck = ref<Appointment | null>(null)
const editMode = ref(false)
const appointmentToDelete = ref<Appointment | null>(null)
const currentEditId = ref<number | null>(null)
const searchService = ref('')


const availableTimes = ref(true)

const form = ref({
  client_id: '',
  service_ids: [] as number[],
  time: ''
})

const filteredServices = computed(() => {
  if (!searchService.value.trim()) return services.value
  const q = searchService.value.toLowerCase()
  return services.value.filter(s => s.name.toLowerCase().includes(q))
})



const loading = ref(false)
const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}


const selectedServices = computed(() => services.value.filter(s => form.value.service_ids.includes(s.id)))
const totalPrice = computed(() => selectedServices.value.reduce((s, v) => s + Number(v.price || 0), 0).toFixed(2))
const totalDuration = computed(() => selectedServices.value.reduce((s, v) => s + v.duration_minutes, 0))

const dayAppointments: any = computed(() => {
  const dateStr = format(selectedDate.value, 'yyyy-MM-dd')
  return appointments.value.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time))
})

const monthName = computed(() => format(currentMonth.value, 'MMMM yyyy', { locale: pt }).replace(/^\w/, c => c.toUpperCase()))

const monthCells = computed(() => {
  const start = startOfMonth(currentMonth.value)
  const end = endOfMonth(currentMonth.value)
  const days = eachDayOfInterval({ start, end })
  const firstDay = getDay(start)
  const cells: any[] = Array(firstDay).fill(null).map(() => ({ num: '', otherMonth: true }))

  days.forEach(d => {
    const dateStr = format(d, 'yyyy-MM-dd')
    const count = appointments.value.filter(a => a.date === dateStr).length
    cells.push({ key: d.toISOString(), num: d.getDate(), date: d, isToday: isToday(d), count })
  })
  while (cells.length < 42) cells.push({ num: '', otherMonth: true })
  return cells
})

const formatDay = (d: Date) => format(d, 'EEEE', { locale: pt }).replace(/^\w/, c => c.toUpperCase())
const formatDate = (d: Date) => format(d, "d 'de' MMMM yyyy", { locale: pt })

const prev = () => view.value === 'day' ? selectedDate.value = addDays(selectedDate.value, -1) : currentMonth.value = addMonths(currentMonth.value, -1)
const next = () => view.value === 'day' ? selectedDate.value = addDays(selectedDate.value, 1) : currentMonth.value = addMonths(currentMonth.value, 1)
const today = () => { selectedDate.value = new Date(); currentMonth.value = new Date() }

const selectDate = async (date: Date) => {
  selectedDate.value = date
  view.value = 'day'
  await fetchAvailableTimes()
}

const fetchAvailableTimes = async () => {
  if (!user.id) return
  loadingSlots.value = true
  try {
    const dateStr = format(selectedDate.value, 'yyyy-MM-dd')

    const res = await axios.get(`${API_URL}/store/available-times/${user.id}/${dateStr}`, {
      // params: { date: dateStr },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    
    availableTimeSlots.value = Array.isArray(res.data) ? res.data : []

    if (!res.data[0]) {
      availableTimes.value = false
    } else {
      availableTimes.value = true
    }

    if (modal.value) form.value.time = ''
  } catch {
    availableTimeSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

watch(selectedDate, fetchAvailableTimes)
watch(modal, (val) => { if (val) fetchAvailableTimes() })

const openNew = () => {
  editMode.value = false
  currentEditId.value = null
  form.value = { client_id: '', service_ids: [], time: '' }
  searchService.value = ''
  modal.value = true
}

const edit = (apt: Appointment) => {
  console.log('ed: ', apt)
  editMode.value = true
  currentEditId.value = apt.id
  form.value = {
    client_id: String(apt.client_id),
    service_ids: apt.services_list.map(s => s.id),
    time: apt.time
  }
  searchService.value = ''
  modal.value = true
}

const submitCreate = async () => {

  loading.value = true

  if (!form.value.client_id || form.value.service_ids.length === 0 || !form.value.time) return

  const payload = {
    client_id: Number(form.value.client_id),
    service_ids: form.value.service_ids,
    date: format(selectedDate.value, 'yyyy-MM-dd'),
    time: form.value.time,
    user_id: user.id
  }

  try {
    if (editMode.value && currentEditId.value) {
      await axios.put(`${API_URL}/store/schedule/update/${currentEditId.value}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } else {
      await axios.post(`${API_URL}/store/schedule/create`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

    }
    showNotification(editMode.value ? 'Marcação atualizada com sucesso' : 'Marcação criada com sucesso', 'success')
    loading.value = false

    modal.value = false
    loadData()
  } catch (err: any) {
    console.log(err)
    showNotification(err.response?.data?.message || 'Tente novamente', 'error')
    loading.value = false
  }
}

const openDelete = (apt: Appointment) => {
  appointmentToDelete.value = apt
  deleteModal.value = true
}

const openModalChecked = (apt: Appointment) => {
  appointmentToCheck.value = apt
  checkedModal.value = true
}

const confirmChecked = async () => {

  loading.value = true

  if (!appointmentToCheck.value) return
  try {
    await axios.post(`${API_URL}/store/schedule/complete/${appointmentToCheck.value.id}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    showNotification('Marcação concluída com sucesso', 'success')
      loading.value = false

    checkedModal.value = false
    loadData()
  } catch (err: any) {
    console.log(err)
    showNotification(err.response?.data?.message || 'Tente novamente', 'error')
    loading.value = false
  }
}


const confirmDelete = async () => {

  loading.value = true

  if (!appointmentToDelete.value) return
  await axios.delete(`${API_URL}/store/schedule/delete/${appointmentToDelete.value.id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  showNotification('Agendamento excluido com sucesso', 'success')
    loading.value = false

  deleteModal.value = false
  loadData()
}

const loadData = async () => {
  try {
    
    const res = await axios.get(`${API_URL}/store/calendary/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    const data = res.data || {}
    clients.value = Array.isArray(data.clients) ? data.clients : []
    services.value = Array.isArray(data.services) ? data.services : []

    const schedules = Array.isArray(data.schedules) ? data.schedules : []
    
    appointments.value = schedules.map((s: any) => {

      const client = clients.value.find(c => c.id === s.client_id) || { name: 'Cliente desconhecido' }
      const serviceIds = Array.isArray(s.services) ? s.services : (s.service_id ? [s.service_id] : [])
      const servicesList = serviceIds
        .map((id: number) => services.value.find(sv => sv.id === id))
        .filter(Boolean) as Service[]

      const totalPrice = servicesList.reduce((sum, sv) => sum + Number(sv.price || 0), 0).toFixed(2)
      const totalDuration = servicesList.reduce((sum, sv) => sum + (sv.duration_minutes || 0), 0)

      return {
        id: s.id,
        client_id: s.client_id,
        client_name: client.name,
        services_list: servicesList,
        status: s.status,
        time: format(new Date(s.start_datetime), 'HH:mm'),
        total_price: s.price ? Number(s.price).toFixed(2) : totalPrice,
        total_duration: s.duration_minutes ? s.duration_minutes : totalDuration,
        date: format(new Date(s.start_datetime), 'yyyy-MM-dd')
      }
    })
  } catch {
    clients.value = []
    services.value = []
    appointments.value = []
  }
}

onMounted(() => {
  today()
  loadData()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.agenda {
  background: #f8fafc;
  min-height: 100vh;
  padding: 80px 16px 100px;
  margin-top: 60px;
}

.header {
  max-width: 1000px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header h1 {
  font-size: 2.4rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 8px;
  background: white;
  border-radius: 50px;
  padding: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .1);
}

.tabs button {
  padding: 10px 24px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.tabs button.active {
  background: #0ea5e9;
  color: white;
}

.nav {
  display: flex;
  gap: 12px;
}

.btn-nav,
.btn-today {
  height: 52px;
  padding: 0 24px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.btn-nav {
  width: 52px;
  background: white;
  color: #64748b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .1);
}

.btn-today {
  background: #0ea5e9;
  color: white;
}

.month-view,
.day-view {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .12);
}

.month-title,
.day-title {
  background: #0ea5e9;
  color: white;
  padding: 24px;
  text-align: center;
  position: relative;
}

.month-title h2,
.day-title h2 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 900;
}

.day-title span {
  font-size: 1.1rem;
  opacity: .9;
}

.btn-add {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  color: #0ea5e9;
  border: 3px solid #0ea5e9;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 700;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f1f5f9;
  padding: 16px 0;
  font-weight: 700;
  color: #475569;
  text-align: center;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
}

.day-cell {
  background: white;
  min-height: 80px;
  padding: 10px 6px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}

.day-cell:hover {
  background: #f0f9ff;
}

.day-cell.other {
  opacity: 0.4;
}

.day-cell.today {
  border: 3px solid #10b981;
}

.day-cell.selected {
  background: #0ea5e9;
  color: white;
}

.day-num {
  font-weight: 800;
  text-align: center;
}

.dots {
  margin-top: auto;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 4px;
}

.dots span {
  width: 6px;
  height: 6px;
  background: #0ea5e9;
  border-radius: 50%;
}

.more {
  font-size: .65rem;
  color: #64748b;
}

.empty {
  padding: 100px 40px;
  text-align: center;
  color: #94a3b8;
}

.empty i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #cbd5e1;
}

.list {
  padding: 16px;
}

.item {
  display: grid;
  grid-template-columns: 90px 1fr 100px 80px 90px;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 12px;
  background: #f8fafc;
  border-radius: 20px;
}

.item .time {
  font-size: 1.2rem;
  font-weight: 900;
  color: #0ea5e9;
}

.item .client {
  font-weight: 800;
  color: #1e293b;
}

.item .service {
  font-size: .9rem;
  color: #64748b;
  line-height: 1.4;
}

.item .price {
  font-size: 1.1rem;
  font-weight: 900;
  color: #10b981;
  text-align: right;
}

.item .duration {
  font-size: .9rem;
  color: #64748b;
  text-align: center;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.actions button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.1rem;
}

.edit {
  background: #e0e7ff;
  color: #4338ca;
}

.delete {
  background: #fee2e2;
  color: #dc2626;
}

.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #0ea5e9;
  color: white;
  border: none;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(14, 165, 233, .4);
  cursor: pointer;
  z-index: 100;
}



.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 16px 28px;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.notification.success {
  background: #10b981;
}

.notification.error {
  background: #ef4444;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity .3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.modal-card.pro {
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 540px;
  max-height: 92vh;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, .35);
  display: flex;
  flex-direction: column;
}


.modal-card.delete-modal {
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 400px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 25px 80px rgba(0, 0, 0, .35);
}

.modal-header {
  padding: 24px 32px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #94a3b8;
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.date {
  text-align: center;
  color: #0ea5e9;
  font-weight: 700;
  margin: 12px 0 20px;
  font-size: 1.1rem;
}

.modal-form {
  padding: 0 32px 32px;
  overflow-y: auto;
  flex: 1;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: .95rem;
}

select,
.search-input input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  background: white;
  transition: all .2s;
}

select:focus,
.search-input input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, .15);
}

.search-input {
  position: relative;
  margin-bottom: 12px;
}

.search-input i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input input {
  padding-left: 48px;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-height: 340px;
  overflow-y: auto;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.service-item {
  background: white;
  padding: 14px;
  border-radius: 14px;
  cursor: pointer;
  transition: all .2s;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .05);
}

.service-item:hover {
  background: #f0fdf4;
}

.service-item.selected {
  background: #ecfdf5;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, .2);
}

.service-item input {
  opacity: 0;
  position: absolute;
}

.service-item .content {
  flex: 1;
}

.service-item .name {
  font-weight: 700;
  color: #1e293b;
  font-size: .95rem;
}

.service-item .meta {
  font-size: .85rem;
  color: #64748b;
  margin-top: 2px;
}

.service-item .checkmark {
  width: 28px;
  height: 28px;
  background: #10b981;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: .2s;
}

.service-item.selected .checkmark {
  opacity: 1;
}

.summary {
  display: flex;
  justify-content: space-between;
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  padding: 14px 18px;
  border-radius: 14px;
  margin: 20px 0;
  font-size: .95rem;
  font-weight: 600;
  color: #1e40af;
}

.summary-item span {
  color: #64748b;
  font-weight: normal;
}

.summary-item .price {
  color: #10b981;
  font-weight: 800;
}

.summary-item strong {
  font-weight: 800;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 28px;
}

.form-actions button {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
}

.form-actions button:first-child {
  background: #f1f5f9;
  color: #475569;
}

.primary {
  background: #10b981;
  color: white;
}

.primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.primary.delete {
  background: #ef4444;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .item {
    grid-template-columns: 80px 1fr 80px;
  }

  .item .price,
  .item .duration {
    grid-column: 3;
    text-align: right;
  }

  .actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
    margin-top: 12px;
  }

  .btn-add {
    position: static;
    margin: 20px auto 0;
  }

  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-card.pro {
    border-radius: 28px 28px 0 0;
    max-height: 95vh;
  }
  .modal-card.delete-modal {
    border-radius: 28px 28px 0 0;
    max-width: 100%;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-form {
    padding: 0 20px 20px;
  }

  .services-grid {
    grid-template-columns: 1fr;
    max-height: 300px;
  }

  .summary {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>