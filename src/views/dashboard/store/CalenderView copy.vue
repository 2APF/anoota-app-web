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
        <span v-for="d in ['D','S','T','Q','Q','S','S']" :key="d">{{ d }}</span>
      </div>
      <div class="days-grid">
        <div v-for="cell in monthCells" :key="cell.key"
             class="day-cell"
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
        <div v-for="apt in dayAppointments" :key="apt.id" class="item">
          <div class="time">{{ apt.time }}</div>
          <div class="details">
            <div class="client">{{ apt.client_name }}</div>
            <div class="service">
              <div v-for="s in apt.services_list" :key="s.id">{{ s.name }}</div>
            </div>
          </div>
          <div class="price">€{{ apt.total_price }}</div>
          <div class="duration">{{ apt.total_duration }}min</div>
          <div class="actions">
            <button @click="edit(apt)" class="edit"><i class="fas fa-edit"></i></button>
            <button @click="openDelete(apt)" class="delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>

    <button @click="openNew" class="fab">+</button>

    <teleport to="body">
      <div v-if="modal" class="modal-overlay" @click="modal = false">
        <div class="modal-card" @click.stop>
          <h3>{{ editMode ? 'Editar Marcação' : 'Nova Marcação' }}</h3>
          <p class="date">{{ formatDate(selectedDate) }}</p>

          <form @submit.prevent="save">
            <select v-model="form.client_id" required>
              <option value="">Cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.name }} {{ c.phone ? `(${c.phone})` : '' }}
              </option>
            </select>

            <div class="services-selection">
              <p class="label">Serviços <small>(vários permitidos)</small></p>
              <label v-for="s in services" :key="s.id" class="service-checkbox">
                <input type="checkbox" :value="s.id" v-model="form.service_ids" />
                <span class="checkmark"></span>
                <div class="info">
                  <strong>{{ s.name }}</strong>
                  <small>€{{ s.price }} • {{ s.duration_minutes }}min</small>
                </div>
              </label>
            </div>

            <div class="summary" v-if="selectedServices.length">
              <div class="line"><span>Total serviços:</span> <strong>{{ selectedServices.length }}</strong></div>
              <div class="line"><span>Preço total:</span> <strong class="price">€{{ totalPrice }}</strong></div>
              <div class="line"><span>Duração total:</span> <strong class="duration">{{ totalDuration }} min</strong></div>
            </div>

            <select v-model="form.time" required>
              <option value="">Horário</option>
              <option v-for="slot in availableTimeSlots" :key="slot" :value="slot" :disabled="isTimeSlotTaken(slot)">
                {{ slot }} {{ isTimeSlotTaken(slot) ? '(ocupado)' : '' }}
              </option>
            </select>

            <div class="form-actions">
              <button type="button" @click="modal = false">Cancelar</button>
              <button type="submit" class="primary" :disabled="!form.client_id || form.service_ids.length === 0 || !form.time">
                {{ editMode ? 'Atualizar' : 'Agendar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <!-- Modal Confirmação -->
    <teleport to="body">
      <div v-if="deleteModal" class="modal-overlay" @click="deleteModal = false">
        <div class="modal-card delete-modal" @click.stop>
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Remover marcação?</h3>
          <p><strong>{{ appointmentToDelete?.client_name }}</strong></p>
          <p>{{ appointmentToDelete?.time }} • {{ appointmentToDelete?.services_list.map(s => s.name).join(', ') }}</p>
          <div class="form-actions">
            <button @click="deleteModal = false">Cancelar</button>
            <button @click="confirmDelete" class="primary delete">Sim, remover</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'
const route = useRoute()

// === TEU USER EXACTAMENTE COMO TINHAS ===
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

let user: User = { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' }
if (typeof route.params.user === 'string') {
  user.id = route.params.user
} else if (Array.isArray(route.params.user)) {
  user.id = route.params.user[0]
} else if (route.params.user?.id) {
  user.id = route.params.user.id
}

interface Client { id: number; name: string; phone: string; email: string }
interface Service { id: number; name: string; price: string; duration_minutes: number }
interface Appointment {
  id: number
  client_id: number
  client_name: string
  services_list: Service[]
  time: string
  total_price: string
  total_duration: number
  date: string
}

const view = ref<'day' | 'month'>('day')
const selectedDate = ref(new Date())
const currentMonth = ref(new Date())

const clients = ref<Client[]>([])
const services = ref<Service[]>([])
const appointments = ref<Appointment[]>([])

const modal = ref(false)
const deleteModal = ref(false)
const editMode = ref(false)
const appointmentToDelete = ref<Appointment | null>(null)
const currentEditId = ref<number | null>(null)

const form = ref({
  client_id: '',
  service_ids: [] as number[],
  time: ''
})

const selectedServices = computed(() => 
  services.value.filter(s => form.value.service_ids.includes(s.id))
)

const totalPrice = computed(() => 
  selectedServices.value.reduce((s, v) => s + Number(v.price || 0), 0).toFixed(2)
)

const totalDuration = computed(() => 
  selectedServices.value.reduce((s, v) => s + v.duration_minutes, 0)
)

// Horários disponíveis (09:00 → 20:00 de 30 em 30)
const allTimeSlots = Array.from({ length: 23 }, (_, i) => {
  const h = Math.floor(i / 2) + 9
  const m = i % 2 === 0 ? '00' : '30'
  return `${h.toString().padStart(2, '0')}:${m}`
})

const availableTimeSlots = computed(() => allTimeSlots)

const isTimeSlotTaken = (time: string) => {
  const dateStr = format(selectedDate.value, 'yyyy-MM-dd')
  return appointments.value.some(a => a.date === dateStr && a.time === time)
}

const dayAppointments = computed(() => {
  const dateStr = format(selectedDate.value, 'yyyy-MM-dd')
  return appointments.value
    .filter(a => a.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time))
})

const monthName = computed(() => 
  format(currentMonth.value, 'MMMM yyyy', { locale: pt }).replace(/^\w/, c => c.toUpperCase())
)

const monthCells = computed(() => {
  const start = startOfMonth(currentMonth.value)
  const end = endOfMonth(currentMonth.value)
  const days = eachDayOfInterval({ start, end })
  const firstDay = getDay(start)
  const cells: any[] = Array(firstDay).fill(null).map(() => ({ num: '', otherMonth: true }))

  days.forEach(d => {
    const dateStr = format(d, 'yyyy-MM-dd')
    const count = appointments.value.filter(a => a.date === dateStr).length
    cells.push({
      key: d.toISOString(),
      num: d.getDate(),
      date: d,
      isToday: isToday(d),
      count
    })
  })

  while (cells.length < 42) cells.push({ num: '', otherMonth: true })
  return cells
})

const formatDay = (d: Date) => format(d, 'EEEE', { locale: pt }).replace(/^\w/, c => c.toUpperCase())
const formatDate = (d: Date) => format(d, "d 'de' MMMM yyyy", { locale: pt })

const prev = () => view.value === 'day' ? selectedDate.value = addDays(selectedDate.value, -1) : currentMonth.value = addMonths(currentMonth.value, -1)
const next = () => view.value === 'day' ? selectedDate.value = addDays(selectedDate.value, 1) : currentMonth.value = addMonths(currentMonth.value, 1)
const today = () => { selectedDate.value = new Date(); currentMonth.value = new Date() }
const selectDate = (date: Date) => { selectedDate.value = date; view.value = 'day' }

const openNew = () => {
  editMode.value = false
  currentEditId.value = null
  form.value = { client_id: '', service_ids: [], time: '' }
  modal.value = true
}

const edit = (apt: Appointment) => {
  editMode.value = true
  currentEditId.value = apt.id
  form.value = {
    client_id: String(apt.client_id),
    service_ids: apt.services_list.map(s => s.id),
    time: apt.time
  }
  modal.value = true
}

const save = async () => {
  if (!form.value.client_id || form.value.service_ids.length === 0 || !form.value.time) return

  const payload = {
    client_id: Number(form.value.client_id),
    service_ids: form.value.service_ids,
    date: format(selectedDate.value, 'yyyy-MM-dd'),
    time: form.value.time
  }

  try {
    if (editMode.value && currentEditId.value) {
      await axios.put(`${API_URL}/store/schedule/${currentEditId.value}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } else {

      console.log(payload)
      await axios.post(`${API_URL}/store/schedule/create`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    }
    modal.value = false
    loadData()
  } catch (err: any) {
    alert('Erro: ' + (err.response?.data?.message || 'Tente novamente'))
  }
}

const openDelete = (apt: Appointment) => {
  appointmentToDelete.value = apt
  deleteModal.value = true
}

const confirmDelete = async () => {
  if (!appointmentToDelete.value) return
  try {
    await axios.delete(`${API_URL}/store/schedule/${appointmentToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    deleteModal.value = false
    loadData()
  } catch (err) {
    alert('Erro ao remover')
  }
}

// CARREGA TUDO SEM ERRO
const loadData = async () => {
  try {
    // Usa 'me' se não houver user.id (funciona tanto logado como dono da loja)
    const userIdToUse = user.id || 'me'

    const res = await axios.get(`${API_URL}/store/calendary/${userIdToUse}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    const data = res.data || {}

    // Primeiro: garante que são arrays
    const clientsList = Array.isArray(data.clients) ? data.clients : []
    const servicesList = Array.isArray(data.services) ? data.services : []
    const schedulesList = Array.isArray(data.schedules) ? data.schedules : []

    // Atualiza os refs de uma vez (importante para reatividade)
    clients.value = clientsList
    services.value = servicesList

    // Agora sim: processa os agendamentos com os dados já carregados
    appointments.value = schedulesList.map((s: any) => {
      const client = clientsList.find((c: any) => c.id === s.client_id)
      
      // Suporta os dois formatos que a tua API pode devolver:
      // { services: [1,2,3] }  OU  { service_id: 5 } (versões antigas)
      const serviceIds: number[] = Array.isArray(s.services) 
        ? s.services 
        : (s.service_id ? [s.service_id] : [])

      const servicesListFound = serviceIds
        .map((id: number) => servicesList.find((sv: any) => sv.id === id))
        .filter(Boolean) as Service[]

      const totalPrice = servicesListFound
        .reduce((sum, sv) => sum + Number(sv.price || 0), 0)
        .toFixed(2)

      const totalDuration = servicesListFound
        .reduce((sum, sv) => sum + (sv.duration_minutes || 0), 0)

      return {
        id: s.id,
        client_id: s.client_id,
        client_name: client?.name || 'Cliente desconhecido',
        services_list: servicesListFound, // lista de objetos Service
        // time: s.start_datetime || '00:00',
        time: format(s.start_datetime, 'H:m') || '00:00',
        total_price: totalPrice,
        total_duration: totalDuration,
        date: s.date || format(selectedDate.value, 'yyyy-MM-dd')
      }
    })

    // Debug opcional (remove depois)
    console.log('Agenda carregada:', appointments.value.length, 'marcações')

  } catch (err: any) {
    console.error('Erro ao carregar agenda:', err.response?.data || err.message)
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
/* Todo o teu CSS original mantido – só adicionei os estilos dos checkboxes e summary */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.agenda { background: #f8fafc; min-height: 100vh; padding: 80px 16px 100px; margin-top: 60px; }
.header { max-width: 1000px; margin: 0 auto 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.header h1 { font-size: 2.4rem; font-weight: 900; color: #1e293b; margin: 0; }
.tabs { display: flex; gap: 8px; background: white; border-radius: 50px; padding: 6px; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
.tabs button { padding: 10px 24px; border-radius: 50px; border: none; font-weight: 700; cursor: pointer; }
.tabs button.active { background: #0ea5e9; color: white; }
.nav { display: flex; gap: 12px; }
.btn-nav, .btn-today { height: 52px; padding: 0 24px; border-radius: 50px; border: none; font-weight: 700; cursor: pointer; }
.btn-nav { width: 52px; background: white; color: #64748b; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
.btn-today { background: #0ea5e9; color: white; }

.month-view, .day-view { max-width: 1000px; margin: 0 auto; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.12); }
.month-title, .day-title { background: #0ea5e9; color: white; padding: 24px; text-align: center; position: relative; }
.month-title h2, .day-title h2 { margin: 0 0 8px; font-size: 2rem; font-weight: 900; }
.day-title span { font-size: 1.1rem; opacity: .9; }
.btn-add { position: absolute; top: 20px; right: 20px; background: white; color: #0ea5e9; border: 3px solid #0ea5e9; padding: 10px 20px; border-radius: 50px; font-weight: 700; }

.weekdays { display: grid; grid-template-columns: repeat(7, 1fr); background: #f1f5f9; padding: 16px 0; font-weight: 700; color: #475569; text-align: center; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e2e8f0; }
.day-cell { background: white; min-height: 80px; padding: 10px 6px; cursor: pointer; position: relative; display: flex; flex-direction: column; }
.day-cell:hover { background: #f0f9ff; }
.day-cell.other { opacity: 0.4; }
.day-cell.today { border: 3px solid #10b981; }
.day-cell.selected { background: #0ea5e9; color: white; }
.day-num { font-weight: 800; text-align: center; }
.dots { margin-top: auto; display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; padding-top: 4px; }
.dots span { width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%; }
.more { font-size: .65rem; color: #64748b; }

.empty { padding: 100px 40px; text-align: center; color: #94a3b8; }
.empty i { font-size: 4rem; margin-bottom: 20px; color: #cbd5e1; }

.list { padding: 16px; }
.item { display: grid; grid-template-columns: 90px 1fr 100px 80px 90px; align-items: center; gap: 16px; padding: 20px; margin-bottom: 12px; background: #f8fafc; border-radius: 20px; }
.item .time { font-size: 1.5rem; font-weight: 900; color: #0ea5e9; }
.item .client { font-weight: 800; color: #1e293b; }
.item .service { font-size: .9rem; color: #64748b; line-height: 1.4; }
.item .price { font-size: 1.5rem; font-weight: 900; color: #10b981; text-align: right; }
.item .duration { font-size: .9rem; color: #64748b; text-align: center; }
.actions { display: flex; gap: 12px; justify-content: flex-end; }
.actions button { width: 44px; height: 44px; border: none; border-radius: 14px; cursor: pointer; font-size: 1.1rem; }
.edit { background: #e0e7ff; color: #4338ca; }
.delete { background: #fee2e2; color: #dc2626; }

.fab { position: fixed; right: 20px; bottom: 20px; width: 64px; height: 64px; border-radius: 50%; background: #0ea5e9; color: white; border: none; font-size: 2rem; box-shadow: 0 10px 30px rgba(14,165,233,.4); cursor: pointer; z-index: 100; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 9999; backdrop-filter: blur(8px); }
.modal-card { background: white; border-radius: 32px; padding: 32px; width: 100%; max-width: 500px; }
.modal-card h3 { margin: 0 0 8px; font-size: 1.8rem; text-align: center; color: #1e293b; }
.date { text-align: center; color: #64748b; margin-bottom: 24px; font-weight: 600; }

.services-selection { margin: 20px 0; }
.services-selection .label { font-weight: 600; margin-bottom: 12px; display: block; color: #1e293b; }
.services-selection .label span { font-weight: normal; font-size: .9rem; color: #64748b; }

.service-checkbox { display: flex; align-items: center; margin-bottom: 14px; cursor: pointer; user-select: none; }
.service-checkbox input { opacity: 0; position: absolute; }
.service-checkbox .checkmark { width: 22px; height: 22px; border: 2px solid #cbd5e1; border-radius: 8px; margin-right: 12px; position: relative; transition: .2s; }
.service-checkbox input:checked + .checkmark { background: #0ea5e9; border-color: #0ea5e9; }
.service-checkbox input:checked + .checkmark::after { content: "✓"; color: white; font-weight: bold; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.service-checkbox .info strong { display: block; font-size: 1rem; color: #1e293b; }
.service-checkbox .info small { color: #64748b; font-size: .9rem; }

.summary { background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 16px; margin: 16px 0; }
.summary .line { display: flex; justify-content: space-between; margin: 8px 0; font-size: .95rem; }
.summary .price { color: #10b981; font-weight: 900; font-size: 1.1rem; }
.summary .duration { color: #f59e0b; font-weight: 700; }

.modal-card select, .modal-card input { width: 100%; padding: 16px; margin-bottom: 16px; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 1.1rem; }
.form-actions { display: flex; gap: 16px; margin-top: 24px; }
.form-actions button { flex: 1; padding: 16px; border: none; border-radius: 16px; font-weight: 700; font-size: 1.1rem; cursor: pointer; }
.form-actions button:first-child { background: #e2e8f0; color: #475569; }
.primary { background: #10b981; color: white; }
.primary.delete { background: #dc2626; }

.delete-modal i { font-size: 3.5rem; color: #dc2626; margin-bottom: 16px; }
.delete-modal h3 { color: #dc2626; }

@media (max-width: 640px) {
  .header { flex-direction: column; text-align: center; }
  .item { grid-template-columns: 80px 1fr 80px; }
  .item .price, .item .duration { grid-column: 3; text-align: right; }
  .actions { grid-column: 1 / -1; justify-content: flex-end; margin-top: 12px; }
  .btn-add { position: static; margin: 20px auto 0; }
}
</style>