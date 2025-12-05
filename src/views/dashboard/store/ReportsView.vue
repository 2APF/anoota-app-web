<template>
  <NavbarComponent />

  <div class="reports-page">
    <header class="page-header">
      <h1>Relatórios</h1>
      <div class="filters">
        <select v-model="period">
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
          <option value="year">Este ano</option>
        </select>
        <input v-model="searchClient" type="text" placeholder="Buscar cliente..." />
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon income">€</div>
        <div class="value">€{{ totalRevenue.toFixed(2) }}</div>
        <div class="label">Receita Total</div>
      </div>
      <div class="stat-card">
        <div class="icon appointments">✔</div>
        <div class="value">{{ totalAppointments }}</div>
        <div class="label">Marcações</div>
      </div>
      <div class="stat-card">
        <div class="icon clients">👤</div>
        <div class="value">{{ uniqueClients }}</div>
        <div class="label">Clientes Únicos</div>
      </div>
      <div class="stat-card">
        <div class="icon avg">⌛</div>
        <div class="value">€{{ avgTicket.toFixed(2) }}</div>
        <div class="label">Ticket Médio</div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>Receita por Dia</h3>
        <canvas ref="revenueChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>Serviços Mais Realizados</h3>
        <canvas ref="servicesChart"></canvas>
      </div>
    </div>

    <div class="recent-table">
      <h3>Últimas Marcações</h3>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Hora</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apt in filteredAppointments" :key="apt.id">
              <td>{{ formatDate(apt.date) }}</td>
              <td>{{ apt.client }}</td>
              <td>{{ apt.service }}</td>
              <td>{{ apt.time }}</td>
              <td>€{{ apt.price }}</td>
              <td>
                <span class="status" :class="apt.status">{{ apt.status === 'confirmed' ? 'Concluído' : 'Pendente' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

Chart.register(...registerables)

interface Appointment {
  id: number
  date: Date
  time: string
  client: string
  service: string
  price: number
  status: 'confirmed' | 'pending'
}

const period = ref('month')
const searchClient = ref('')

const appointments = ref<Appointment[]>([
  { id: 1, date: new Date(2025, 10, 23), time: '10:00', client: 'Ricardo Alves', service: 'Corte + Barba', price: 45, status: 'confirmed' },
  { id: 2, date: new Date(2025, 10, 23), time: '14:30', client: 'Miguel Santos', service: 'Corte Moderno', price: 32, status: 'confirmed' },
  { id: 3, date: new Date(2025, 10, 22), time: '16:00', client: 'Ana Costa', service: 'Barba Completa', price: 28, status: 'confirmed' },
  { id: 4, date: new Date(2025, 10, 21), time: '11:00', client: 'João Mendes', service: 'Corte Clássico', price: 32, status: 'pending' },
  { id: 5, date: new Date(2025, 10, 20), time: '17:30', client: 'Pedro Silva', service: 'Corte + Coloração', price: 85, status: 'confirmed' },
  { id: 6, date: new Date(2025, 10, 19), time: '09:30', client: 'Luís Ferreira', service: 'Corte + Barba', price: 45, status: 'confirmed' },
  { id: 7, date: new Date(2025, 10, 18), time: '13:00', client: 'Tiago Costa', service: 'Barba Completa', price: 28, status: 'confirmed' },
  { id: 8, date: new Date(2025, 10, 17), time: '18:00', client: 'Fábio Lima', service: 'Corte Moderno', price: 32, status: 'confirmed' },
  { id: 9, date: new Date(2025, 10, 23), time: '19:30', client: 'Ricardo Alves', service: 'Corte + Barba', price: 45, status: 'confirmed' },
])

const revenueChart = ref<HTMLCanvasElement | null>(null)
const servicesChart = ref<HTMLCanvasElement | null>(null)
let chart1: Chart | null = null
let chart2: Chart | null = null

const filteredAppointments = computed(() => {
  let filtered = appointments.value.filter(a => a.status === 'confirmed')
  if (searchClient.value) {
    filtered = filtered.filter(a => a.client.toLowerCase().includes(searchClient.value.toLowerCase()))
  }
  return filtered.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)
})

const totalRevenue = computed(() => filteredAppointments.value.reduce((sum, a) => sum + a.price, 0))
const totalAppointments = computed(() => filteredAppointments.value.length)
const uniqueClients = computed(() => new Set(filteredAppointments.value.map(a => a.client)).size)
const avgTicket = computed(() => totalAppointments.value > 0 ? totalRevenue.value / totalAppointments.value : 0)

const formatDate = (d: Date) => format(d, "dd MMM", { locale: pt })

onMounted(() => {
  createCharts()
})

watch([period, filteredAppointments], () => {
  createCharts()
}, { deep: true })

const createCharts = () => {
  const ctx1 = revenueChart.value?.getContext('2d')
  const ctx2 = servicesChart.value?.getContext('2d')

  if (chart1) chart1.destroy()
  if (chart2) chart2.destroy()

  const revenueData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Receita',
      data: [420, 380, 510, 460, 620, 550, 480],
      backgroundColor: '#0ea5e9',
      borderRadius: 8,
    }]
  }

  const servicesData = {
    labels: ['Corte + Barba', 'Corte Moderno', 'Barba Completa', 'Coloração', 'Outros'],
    datasets: [{
      data: [38, 28, 18, 10, 6],
      backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
      borderWidth: 0,
    }]
  }

  if (ctx1) {
    chart1 = new Chart(ctx1, {
      type: 'bar',
      data: revenueData,
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }

  if (ctx2) {
    chart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: servicesData,
      options: { responsive: true, plugins: { legend: { position: 'bottom' as const } } }
    })
  }
}
</script>

<style scoped>
.reports-page{background:#f8fafc;min-height:100vh;padding:90px 16px 60px}
.page-header{max-width:1280px;margin:0 auto 40px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
.page-header h1{font-size:2.4rem;font-weight:900;color:#1e293b;margin:0}
.filters{display:flex;gap:16px;flex:1;max-width:500px}
.filters select,.filters input{padding:14px 20px;border:2px solid #e2e8f0;border-radius:16px;font-size:1rem;flex:1}
.filters select{background:white}

.stats-grid{max-width:1280px;margin:0 auto 48px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
.stat-card{background:white;border-radius:24px;padding:28px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.08);border:1px solid #e2e8f0}
.icon{font-size:3rem;margin-bottom:16px}
.icon.income{color:#10b981}
.icon.appointments{color:#0ea5e9}
.icon.clients{color:#8b5cf6}
.icon.avg{color:#f59e0b}
.value{font-size:2.4rem;font-weight:900;color:#1e293b;margin:8px 0}
.label{font-size:1.1rem;color:#64748b;font-weight:600}

.charts-container{max-width:1280px;margin:0 auto 48px;display:grid;grid-template-columns:1fr;gap:32px}
.chart-card{background:white;border-radius:24px;padding:32px;box-shadow:0 15px 50px rgba(0,0,0,.1);border:1px solid #e2e8f0}
.chart-card h3{font-size:1.6rem;font-weight:800;color:#1e293b;margin-bottom:24px}

.recent-table{max-width:1280px;margin:0 auto}
.recent-table h3{font-size:1.8rem;font-weight:800;color:#1e293b;margin-bottom:24px}
.table-wrapper{overflow-x:auto;border-radius:24px;box-shadow:0 15px 50px rgba(0,0,0,.1)}
table{width:100%;border-collapse:collapse;background:white}
thead{background:#0ea5e9;color:white;font-weight:800}
th,td{padding:18px 20px;text-align:left}
th{font-size:.95rem}
tbody tr{border-bottom:1px solid #f1f5f9}
tbody tr:last-child{border:none}
tbody tr:hover{background:#f8fafc}
.status{padding:6px 14px;border-radius:50px;font-size:.85rem;font-weight:700}
.status.confirmed{background:#ecfdf5;color:#10b981}
.status.pending{background:#fff7ed;color:#f97316}

@media (max-width:768px){
  .page-header{flex-direction:column;align-items:stretch}
  .filters{flex-direction:column}
  .stats-grid{grid-template-columns:1fr 1fr;gap:20px}
  .stat-card{padding:24px}
  .value{font-size:2rem}
  .charts-container{grid-template-columns:1fr}
}
@media (max-width:480px){
  .stats-grid{grid-template-columns:1fr}
  .chart-card{padding:24px}
  th,td{padding:14px 12px;font-size:.95rem}
}
</style>