<template>
  <NavbarComponent />

  <div class="booking-page">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
    </div>

    <div v-else class="container">
      <header class="header">
        <h1>Agendar com {{ store.name }}</h1>
        <p class="subtitle">{{ store.category }} • {{ store.address }}</p>
      </header>

      <div class="booking-grid">
        <div class="calendar-section">
          <div class="calendar-header">
            <button @click="prevMonth" class="nav-btn"><i class="fas-chevron-left"></i></button>
            <h2>{{ currentMonthName }}</h2>
            <button @click="nextMonth" class="nav-btn"><i class="fas-chevron-right"></i></button>
          </div>

          <div class="weekdays">
            <span v-for="d in weekdays">{{ d }}</span>
          </div>

          <div class="days">
            <button
              v-for="day in calendarDays"
              :key="day.key"
              @click="selectDate(day.date)"
              :class="{ 
                empty: !day.date,
                past: day.isPast,
                today: day.isToday,
                selected: selectedDate && day.date && isSameDay(day.date, selectedDate),
                available: day.hasSlots
              }"
              :disabled="!day.date || day.isPast || !day.hasSlots"
            >
              {{ day.num }}
            </button>
          </div>
        </div>

        <div class="booking-form">
          <div v-if="!selectedDate" class="placeholder">
            <i class="fas-calendar-alt"></i>
            <p>Selecione uma data disponível no calendário</p>
          </div>

          <div v-else-if="!availableSlots.length && !loadingSlots" class="no-slots">
            <i class="fas-calendar-times"></i>
            <p>Nenhum horário disponível neste dia</p>
          </div>

          <div v-else class="form-content">
            <div class="selected-date">
              <i class="fas-calendar-check"></i>
              <strong>{{ format(selectedDate, 'EEEE, d MMMM yyyy', { locale: pt }) }}</strong>
            </div>

            <div class="services-section">
              <h3>Selecione os serviços</h3>
              <div class="services-list">
                <label v-for="service in store.services" :key="service.id" class="service-item">
                  <input type="checkbox" :value="service.id" v-model="selectedServices" />
                  <div class="service-info">
                    <div class="name">{{ service.name }}</div>
                    <div class="details">
                      <span class="price">€{{ service.price }}</span>
                      <span class="duration">{{ service.duration_minutes }} min</span>
                    </div>
                  </div>
                  <i class="fas-check check"></i>
                </label>
              </div>
            </div>

            <div v-if="selectedServices.length" class="summary">
              <div class="summary-row">
                <span>Serviços</span>
                <strong>{{ selectedServices.length }}</strong>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <strong class="price">€{{ totalPrice }}</strong>
              </div>
              <div class="summary-row">
                <span>Duração</span>
                <strong>{{ totalDuration }} min</strong>
              </div>
            </div>

            <div class="time-slots">
              <h3>Horários disponíveis</h3>
              <div class="slots-grid">
                <button
                  v-for="slot in availableSlots"
                  :key="slot"
                  @click="selectedTime = slot"
                  :class="{ active: selectedTime === slot }"
                  class="time-slot"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <button
              @click="confirmBooking"
              :disabled="!selectedTime || selectedServices.length === 0 || submitting"
              class="btn-book"
            >
              <i v-if="submitting" class="fas-spinner fa-spin"></i>
              {{ submitting ? 'A processar...' : 'Confirmar Agendamento' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="notification.message" class="notification" :class="notification.type">
    <i :class="notification.type === 'success' ? 'fas-check-circle' : 'fas-exclamation-circle'"></i>
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay, isPast } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

const route = useRoute()
const router = useRouter()
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'
const storeId = route.params.id

const loading = ref(true)
const loadingSlots = ref(false)
const submitting = ref(false)
const store = ref<any>({})
const currentMonth = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedTime = ref('')
const selectedServices = ref<number[]>([])

const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}

const availableSlots = ref<string[]>([])

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const currentMonthName = computed(() => format(currentMonth.value, 'MMMM yyyy', { locale: pt }).replace(/^\w/, c => c.toUpperCase()))

const calendarDays = computed(() => {
  const start = startOfMonth(currentMonth.value)
  const end = endOfMonth(currentMonth.value)
  const days = eachDayOfInterval({ start, end })
  const firstWeekday = getDay(start)
  const today = new Date()
  today.setHours(0,0,0,0)

  const cells: any[] = []

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `empty-${i}`, num: '', date: null, isPast: true, hasSlots: false })
  }

  days.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const hasAppointments = store.value.schedules?.some((s: any) => 
      format(new Date(s.start_datetime), 'yyyy-MM-dd') === dateStr
    )
    const hasSlots = !hasAppointments && day >= today

    cells.push({
      key: day.toISOString(),
      num: day.getDate(),
      date: day,
      isToday: isToday(day),
      isPast: day < today,
      hasSlots
    })
  })

  while (cells.length < 42) {
    cells.push({ key: `fill-${cells.length}`, num: '', date: null, hasSlots: false })
  }

  return cells
})

const totalPrice = computed(() => {
  return store.value.services
    ?.filter((s: any) => selectedServices.value.includes(s.id))
    ?.reduce((sum: number, s: any) => sum + Number(s.price), 0)
    .toFixed(2) || '0.00'
})

const totalDuration = computed(() => {
  return store.value.services
    ?.filter((s: any) => selectedServices.value.includes(s.id))
    ?.reduce((sum: number, s: any) => sum + s.duration_minutes, 0) || 0
})

const fetchStore = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_URL}/user/store/schedule/${storeId}`)
    store.value = res.data.store || {}
    store.value.schedules = res.data.schedules || []
    store.value.services = res.data.services || []
  } catch (err) {
    showNotification('Erro ao carregar loja', 'error')
  } finally {
    loading.value = false
  }
}

const fetchAvailableSlots = async () => {
  if (!selectedDate.value) return
  loadingSlots.value = true
  selectedTime.value = ''
  try {
    const dateStr = format(selectedDate.value, 'yyyy-MM-dd')
    const res = await axios.get(`${API_URL}/user/store/available-times/${storeId}/${dateStr}`)
    availableSlots.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

const prevMonth = () => currentMonth.value = addMonths(currentMonth.value, -1)
const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1)

const selectDate = (date: Date | null) => {
  if (!date) return
  if (isPast(date)) return
  const dateStr = format(date, 'yyyy-MM-dd')
  const hasAppointment = store.value.schedules?.some((s: any) => 
    format(new Date(s.start_datetime), 'yyyy-MM-dd') === dateStr
  )
  if (hasAppointment) return

  selectedDate.value = date
  selectedServices.value = []
  fetchAvailableSlots()
}

const confirmBooking = async () => {
  if (!selectedDate.value || !selectedTime.value || selectedServices.value.length === 0) return

  submitting.value = true
  try {
    await axios.post(`${API_URL}/store/schedule/create`, {
      store_id: storeId,
      service_ids: selectedServices.value,
      date: format(selectedDate.value, 'yyyy-MM-dd'),
      time: selectedTime.value
    })

    showNotification('Agendamento realizado com sucesso!')
    setTimeout(() => router.push('/'), 1500)
  } catch (err: any) {
    showNotification(err.response?.data?.message || 'Erro ao agendar', 'error')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchStore)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.booking-page{background:#f8fafc;min-height:100vh;padding:90px 20px 140px}
.container{max-width:1100px;margin:0 auto}
.header{text-align:center;margin-bottom:40px}
.header h1{font-size:2.6rem;font-weight:900;color:#1e293b;margin:0}
.subtitle{font-size:1.1rem;color:#64748b;margin-top:8px}

.booking-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.calendar-section{background:white;border-radius:32px;padding:32px;box-shadow:0 20px 60px rgba(0,0,0,.12)}
.calendar-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.calendar-header h2{font-size:1.8rem;font-weight:800;color:#1e293b}
.nav-btn{width:48px;height:48px;border-radius:50%;border:none;background:white;box-shadow:0 4px 20px rgba(0,0,0,.1);cursor:pointer;font-size:1.3rem;color:#64748b;transition:all .2s}
.nav-btn:hover{background:#f0f9ff;color:#0ea5e9}
.weekdays{display:grid;grid-template-columns:repeat(7,1fr);background:#f1f5f9;padding:16px 0;font-weight:700;color:#475569;text-align:center}
.days{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;background:#e2e8f0;border-radius:16px;overflow:hidden}
.days button{background:white;padding:16px 8px;border:none;cursor:pointer;font-weight:700;transition:all .3s;position:relative;font-size:1rem}
.days button.empty{visibility:hidden}
.days button.past{opacity:.3;cursor:not-allowed;background:#f8fafc}
.days button.today{background:#ecfdf5;color:#065f46;border:2px solid #10b981}
.days button.selected{background:#0ea5e9;color:white;font-weight:900}
.days button.available:not(.past):not(.selected):hover{background:#f0f9ff;transform:scale(1.1)}
.days button.available:not(.past){cursor:pointer}
.days button.available:not(.past):not(.selected):active{transform:scale(0.98)}

.booking-form{background:white;border-radius:32px;padding:40px;box-shadow:0 20px 60px rgba(0,0,0,.12);min-height:600px;display:flex;flex-direction:column}
.placeholder,.no-slots,.form-content{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;color:#64748b}
.placeholder i,.no-slots i{font-size:4rem;margin-bottom:24px;color:#cbd5e1}
.selected-date{background:#f0f9ff;color:#0ea5e9;padding:16px 24px;border-radius:16px;font-size:1.2rem;font-weight:700;margin-bottom:32px;width:100%;text-align:center}

.services-section{margin-bottom:32px;flex:1}
.services-section h3{font-size:1.4rem;font-weight:800;color:#1e293b;margin-bottom:16px}
.services-list{display:grid;gap:12px;max-height:280px;overflow-y:auto;padding-right:8px}
.services-list::-webkit-scrollbar{width:6px}
.services-list::-webkit-scrollbar-track{background:#f1f5f9;border-radius:10px}
.services-list::-webkit-scrollbar-thumb{background:#0ea5e9;border-radius:10px}
.service-item{display:flex;align-items:center;gap:16px;padding:16px;background:#f8fafc;border-radius:16px;cursor:pointer;transition:all .3s;position:relative}
.service-item input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}
.service-info{flex:1}
.service-info .name{font-weight:700;color:#1e293b}
.service-info .details{font-size:.95rem;color:#64748b;margin-top:4px;display:flex;gap:12px}
.service-item:hover{background:#f0f9ff}
.service-item input:checked ~ .service-info{background:#ecfdf5;border-radius:12px;padding:12px;margin:-12px}
.check{position:absolute;right:16px;color:#10b981;font-weight:bold;opacity:0;transition:opacity .2s}
.service-item input:checked ~ .check{opacity:1}

.summary{background:#f0f9ff;border-radius:20px;padding:20px;margin:24px 0}
.summary-row{display:flex;justify-content:space-between;margin:12px 0;font-size:1.05rem}
.summary-row.total{font-size:1.4rem;font-weight:900;color:#0ea5e9}
.summary-row .price{color:#10b981;font-weight:900}

.time-slots{margin:32px 0}
.time-slots h3{font-size:1.4rem;font-weight:800;color:#1e293b;margin-bottom:16px}
.slots-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.time-slot{padding:16px;border:2px solid #e2e8f0;border-radius:16px;background:white;font-weight:700;cursor:pointer;transition:all .3s}
.time-slot:hover{border-color:#0ea5e9;background:#f0f9ff}
.time-slot.active{background:#0ea5e9;color:white;border-color:#0ea5e9}

.btn-book{width:100%;padding:20px;background:#10b981;color:white;border:none;border-radius:20px;font-size:1.3rem;font-weight:900;cursor:pointer;transition:all .3s;margin-top:auto}
.btn-book:hover:not(:disabled){background:#059669;transform:translateY(-3px)}
.btn-book:disabled{background:#94a3b8;cursor:not-allowed}

.loading{position:fixed;inset:0;background:rgba(248,250,252,.95);display:flex;align-items:center;justify-content:center;z-index:9999}
.loading i{font-size:3rem;color:#0ea5e9}

.notification{position:fixed;top:100px;right:20px;padding:16px 28px;border-radius:16px;color:white;font-weight:700;z-index:99999;box-shadow:0 20px 50px rgba(0,0,0,.3);display:flex;align-items:center;gap:12px}
.notification.success{background:#10b981}
.notification.error{background:#ef4444}

@media (max-width:968px){
  .booking-grid{grid-template-columns:1fr}
}
@media (max-width:640px){
  .slots-grid{grid-template-columns:repeat(2,1fr)}
  .header h1{font-size:2.2rem}
  .calendar-section,.booking-form{padding:24px}
}
</style>