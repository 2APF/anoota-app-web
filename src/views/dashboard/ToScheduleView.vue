<template>
  <NavbarComponent />

  <div class="page">
    <header class="header py-7 mt-5">
      <!-- <button @click="router.back()" class="back">
        <i class="fas fa-arrow-left"></i>
      </button> -->
      <h1>Finalizar Agendamento</h1>
    </header>

    <div class="wrapper">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="shop-card">
          <img :src="shop.logo" class="logo" alt="Logo">
          <div>
            <h2>{{ shop.name }}</h2>
            <p>{{ shop.address }}</p>
          </div>
        </div>

        <div class="service-card">
          <h3>{{ service.name }}</h3>
          <div class="details">
            <div class="duration">
              <i class="fas fa-clock"></i> {{ service.duration }}
            </div>
            <div class="price">{{ service.price }}</div>
          </div>
          <div class="staff">
            <i class="fas fa-user"></i> com {{ staff }}
          </div>
        </div>

        <form @submit.prevent="book" class="form">
          <input v-model="name" placeholder="Nome completo" required>
          <input v-model="phone" type="tel" placeholder="Telemóvel" required>
          <textarea v-model="notes" placeholder="Notas ou pedidos especiais (opcional)" rows="3"></textarea>

          <button type="submit" :disabled="!date || !time" class="btn-submit">
            Confirmar Agendamento
          </button>
        </form>
      </aside>

      
      <main class="main-content">
        
        <section class="calendar-card">
          <div class="cal-header">
            <button @click="prev" class="nav-btn"><i class="fas fa-chevron-left"></i></button>
            <h2>{{ monthTitle }}</h2>
            <button @click="next" class="nav-btn"><i class="fas fa-chevron-right"></i></button>
          </div>

          <div class="weekdays">
            <span v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</span>
          </div>

          <div class="days-grid">
            <button
              v-for="d in days"
              :key="d.key"
              @click="select(d.date)"
              :disabled="d.past || !d.date"
              :class="{ empty: !d.date, past: d.past, today: d.today, selected: d.active }"
            >
              {{ d.num }}
            </button>
          </div>
        </section>

        <!-- HORÁRIOS -->
        <section v-if="date" class="times-card">
          <h3>{{ format(date, 'EEEE, d MMMM', { locale: pt }) }}</h3>
          <div class="slots">
            <button
              v-for="t in slots"
              :key="t"
              @click="time = t"
              :class="{ active: time === t }"
            >{{ t }}</button>
          </div>
        </section>

        
        <section v-if="date && time" class="summary-card">
          <div class="line"><span>Serviço</span><strong>{{ service.name }}</strong></div>
          <div class="line"><span>Data</span><strong>{{ format(date, 'dd/MM/yyyy') }}</strong></div>
          <div class="line"><span>Horário</span><strong>{{ time }}</strong></div>
          <div class="total-line"><span>Total a pagar</span><strong class="total-price">{{ service.price }}</strong></div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isToday, isSameDay, getDay } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()

const shop = ref({
  name: 'José Barber Premium',
  address: 'Av. da Liberdade 124, Lisboa',
  logo: 'https://images.unsplash.com/photo-1631118909886-9adf17d5fb3e?w=600'
})
const service = ref({ name: 'Corte Clássico + Barba', duration: '50 min', price: '45€' })
const staff = 'José Silva'

const month = ref(new Date())
const date = ref<Date | null>(null)
const time = ref('')

const name = ref('')
const phone = ref('')
const notes = ref('')

const monthTitle = computed(() => format(month.value, 'MMMM yyyy', { locale: pt }).replace(/^\w/, c => c.toUpperCase()))

const days: any = computed(() => {
  const start = startOfMonth(month.value)
  const end = endOfMonth(month.value)
  const list = eachDayOfInterval({ start, end })
  const firstWeekday = getDay(start)
  const empty = Array(firstWeekday).fill(null)
  const today = new Date(); today.setHours(0,0,0,0)

  return [
    ...empty.map((_, i) => ({ key: `e${i}`, num: '' })),
    ...list.map(d => ({
      key: d.toISOString(),
      date: d,
      num: d.getDate(),
      past: d < today,
      today: isToday(d),
      active: date.value && isSameDay(d, date.value)
    }))
  ]
})

const slots = ['09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00']

const prev = () => month.value = addMonths(month.value, -1)
const next = () => month.value = addMonths(month.value, 1)
const select = (d: Date | null) => { if (d) { date.value = d; time.value = '' }}

const book = () => {
  alert(`Agendamento confirmado!\n${name.value} — ${format(date.value!, 'dd/MM/yyyy')} às ${time.value}`)
  router.push('/')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.page { background: #f8fafc; min-height: 100vh; padding: 90px 16px 120px; }
.wrapper { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
@media (min-width: 900px) { .wrapper { flex-direction: row; gap: 48px; }}

.header { position: relative; text-align: center; margin-bottom: 50px; margin-top: 60px; }
.back { position: absolute; left: 0; top: 50%; transform: translateY(-50%, -50%); width: 48px; height: 48px; background: #fff; border: none; border-radius: 50%; box-shadow: 0 6px 20px rgba(0,0,0,.1); font-size: 1.4rem; color: #475569; cursor: pointer; }
.header h1 { font-size: 1.75rem; font-weight: 900; color: #1e293b; }

/* SIDEBAR */
.sidebar { flex: 1; max-width: 420px; display: flex; flex-direction: column; gap: 20px; align-self: flex-start; }

.shop-card, .service-card, .form, .calendar-card, .times-card, .summary-card {
  background: #fff; border-radius: 24px; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,.06); border: 1px solid #e2e8f0;
}

.shop-card { display: flex; align-items: center; gap: 18px; }
.logo { width: 68px; height: 68px; border-radius: 16px; object-fit: cover; }
.shop-card h2 { font-size: 1.35rem; font-weight: 800; margin: 0; color: #1e293b; }
.shop-card p { font-size: 0.95rem; color: #64748b; margin-top: 4px; }

.service-card { text-align: center; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
.service-card h3 { font-size: 1.45rem; font-weight: 900; margin: 0 0 16px; color: #1e293b; }
.details { display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 1.05rem; color: #475569; }
.duration i { color: #0ea5e9; margin-right: 6px; }
.price { font-size: 2.4rem; font-weight: 900; color: #0ea5e9; }
.staff { margin-top: 14px; font-size: 1rem; color: #64748b; }

.form { display: flex; flex-direction: column; gap: 16px; }
.form input, .form textarea { padding: 16px 20px; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 1rem; background: #fff; transition: border .3s; }
.form input:focus, .form textarea:focus { outline: none; border-color: #0ea5e9; }
.form textarea { resize: none; }
.btn-submit { margin-top: 8px; padding: 18px; background: #10b981; color: #10b981; color: #fff; border: none; border-radius: 16px; font-size: 1.15rem; font-weight: 800; cursor: pointer; transition: .3s; }
.btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }
.btn-submit:not(:disabled):hover { background: #059669; transform: translateY(-2px); }

/* MAIN CONTENT */
.main-content { flex: 2; display: flex; flex-direction: column; gap: 28px; }

.calendar-card .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.calendar-card h2 { font-size: 1.55rem; font-weight: 800; color: #1e293b; }
.nav-btn { width: 44px; height: 44px; background: #fff; border: 2px solid #e2e8f0; border-radius: 50%; font-size: 1.3rem; color: #475569; cursor: pointer; transition: .3s; }
.nav-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }

.weekdays { display: grid; grid-template-columns: repeat(7,1fr); text-align: center; font-weight: 600; color: #64748b; font-size: .9rem; margin-bottom: 8px; }

.days-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 10px; }
.days-grid button { aspect-ratio: 1; border: none; border-radius: 16px; background: transparent; font-weight: 600; font-size: 1.05rem; color: #1e293b; cursor: pointer; transition: .3s; }
.days-grid button.empty { visibility: hidden; }
.days-grid button.past { opacity: .3; cursor: not-allowed; }
.days-grid button.today { background: #ecfdf5; color: #065f46; font-weight: 800; }
.days-grid button.selected { background: #0ea5e9; color: #fff; font-weight: 800; }

.times-card h3 { font-size: 1.35rem; font-weight: 800; color: #1e293b; margin-bottom: 18px; text-align: center; }
.slots { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
@media (min-width: 560px) { .slots { grid-template-columns: repeat(4,1fr); }}
@media (min-width: 900px) { .slots { grid-template-columns: repeat(6,1fr); }}
.slots button { padding: 14px 8px; border: 2px solid #e2e8f0; border-radius: 14px; background: #fff; font-weight: 600; cursor: pointer; transition: .3s; }
.slots button:hover { border-color: #0ea5e9; }
.slots button.active { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }

.summary-card { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; padding: 28px; border-radius: 24px; }
.summary-card .line { display: flex; justify-content: space-between; font-size: 1.1rem; margin: 12px 0; }
.summary-card .total-line { margin-top: 20px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,.4); font-size: 1.35rem; font-weight: 800; display: flex; justify-content: space-between; }
.total-price { font-size: 2.2rem; font-weight: 900; }
</style>