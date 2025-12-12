<template>
  <NavbarComponent />

  <div class="reports-page">
    <div class="container">
      <header class="page-header">
        <h1>Relatórios</h1>
        <p>Resumo financeiro e de atividade</p>
      </header>

      <div class="filters-bar">
        <div class="period-selector">
          <button @click="period = 'week'" :class="{ active: period === 'week' }">Semana</button>
          <button @click="period = 'month'" :class="{ active: period === 'month' }">Mês</button>
          <button @click="period = 'custom'" :class="{ active: period === 'custom' }">Personalizado</button>
        </div>

        <div class="custom-range" v-if="period === 'custom'">
          <input v-model="data_start_search" type="date" />
          <span>até</span>
          <input v-model="data_end_search" type="date" />
        </div>

        <input v-model="searchClient" type="text" placeholder="Buscar cliente..." class="search-input" />
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon income">€</div>
          <div class="value">€{{ totalRevenue.toFixed(2) }}</div>
          <div class="label">Receita Total</div>
        </div>
        <div class="stat-card">
          <div class="icon appointments">✔</div>
          <div class="value">{{ totalAppointments }}</div>
          <div class="label">Marcações Concluídas</div>
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

      <div class="table-section">
        <div class="table-header">
          <h3>Últimas Marcações</h3>
          <div class="export-buttons">
            <button @click="exportPDF" class="btn-export pdf">
              <i class="fas fa-file-pdf"></i> PDF
            </button>
            <button @click="exportExcel" class="btn-export excel">
              <i class="fas fa-file-excel"></i> Excel
            </button>
          </div>
        </div>

                <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Duração</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>


              
              <tr v-for="apt in filteredAppointments" :key="apt.id">
                <td>{{ formatDate(apt.start_datetime) }}</td>
                <td>{{ apt.name_client }}</td>
                <td>{{ apt.name_service }}</td>
                <td>{{ apt.duration_minutes_service }}</td>
                <td>€{{ apt.price }}</td>
                <td>
                  <span class="status" :class="apt.status">
                    {{ apt.status === 'confirmed' ? 'Concluído' : 'Pendente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredAppointments.length === 0" class="empty">
          <i class="fas fa-inbox"></i>
          <p>Nenhuma marcação neste período</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useRouter, useRoute } from 'vue-router'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

Chart.register(...registerables)

interface Schedule {
  id: number
  store_id: number
  price_paid: string
  status: string
  name_service: string
  name_client: string
  start_datetime: any
  duration_minutes_service: any
  price: string
}

const period = ref<'week' | 'month' | 'custom'>('month')
const data_start_search = ref('')
const data_end_search = ref('')
const searchClient = ref('')
const loading = ref(true)

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

const schedules = ref<Schedule[]>([])
const totalRevenue = ref(0)
const totalAppointments = ref(0)
const servicesMoreBooked = ref<{ id: number; name: string; total_bookings: number }[]>([])

const router = useRouter()
const route = useRoute()

let userId = ''
if (typeof route.params.user === 'string') userId = route.params.user
else if (Array.isArray(route.params.user)) userId = route.params.user[0] || ''
else if (route.params.user && typeof route.params.user === 'object') userId = (route.params.user as any).id || ''


const revenueChart = ref<HTMLCanvasElement | null>(null)
const servicesChart = ref<HTMLCanvasElement | null>(null)
let chart1: Chart | null = null
let chart2: Chart | null = null

const filteredAppointments = computed(() => {
  let filtered = schedules.value.filter(s => s.status === '3')

  if (searchClient.value) {
    filtered = filtered.filter(s => s.name_service.toLowerCase().includes(searchClient.value.toLowerCase()))
  }

  return filtered
})

const formatDate = (d: Date) => format(d, "dd MMM yyyy", { locale: pt })


const uniqueClients = computed(() => {
  const clients = new Set(filteredAppointments.value.map(s => s.id))
  return clients.size
})

const avgTicket = computed(() => 
  totalAppointments.value > 0 ? totalRevenue.value / totalAppointments.value : 0
)

const fetchReports = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (period.value === 'custom' && data_start_search.value && data_end_search.value) {
      params.start = data_start_search.value
      params.end = data_end_search.value
    }

    const res = await fetch(`${API_URL}/store/report/all/${userId}`, { method: 'GET' })
    const data = await res.json()

    schedules.value = data.schedules || []
    totalRevenue.value = Number(data.total_revenue || 0)
    totalAppointments.value = data.total_schedules_finished || 0
    servicesMoreBooked.value = data.services_more_booked || []
  } catch (err) {
    console.error('Erro ao carregar relatórios', err)
    schedules.value = []
    totalRevenue.value = 0
    totalAppointments.value = 0
    servicesMoreBooked.value = []
  } finally {
    loading.value = false
  }
}

const exportPDF = () => alert('Exportação PDF em desenvolvimento')
const exportExcel = () => alert('Exportação Excel em desenvolvimento')

onMounted(() => {
  fetchReports()
  createCharts()
})

watch([period, data_start_search, data_end_search], () => {
  fetchReports()
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

  const servicesLabels = servicesMoreBooked.value.map(s => s.name)
  const servicesValues = servicesMoreBooked.value.map(s => s.total_bookings)

  const servicesData = {
    labels: servicesLabels.length ? servicesLabels : ['Sem dados'],
    datasets: [{
      data: servicesValues.length ? servicesValues : [1],
      backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
      borderWidth: 0,
    }]
  }

  if (ctx1) {
    chart1 = new Chart(ctx1, {
      type: 'bar',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    })
  }

  if (ctx2) {
    chart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: servicesData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' as const } }
      }
    })
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.reports-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  
  padding: 80px 80px 80px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
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
  font-size: 1.25rem;
  color: #475569;
}

.filters-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 48px;
}

.period-selector {
  display: flex;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
  width: fit-content;
}

.period-selector button {
  padding: 14px 28px;
  background: transparent;
  border: none;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all .3s;
}

.period-selector button.active {
  background: #0ea5e9;
  color: white;
}

.custom-range {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
  width: fit-content;
}

.custom-range input {
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
}

.search-input {
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,.08);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 56px;
}

.stat-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: all .3s;
}

.stat-card:hover {
  transform: translateY(-8px);
}

.icon {
  font-size: 3.2rem;
  margin-bottom: 16px;
}

.icon.income { color: #10b981; }
.icon.appointments { color: #0ea5e9; }
.icon.clients { color: #8b5cf6; }
.icon.avg { color: #f59e0b; }

.value {
  font-size: 2.6rem;
  font-weight: 900;
  color: #1e293b;
  margin: 8px 0;
}

.label {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 64px;
}

.chart-card {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 50px rgba(0,0,0,.1);
  border: 1px solid #e2e8f0;
  height: 380px;
  position: relative;
}

.chart-card h3 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 24px;
  text-align: center;
}

.chart-card canvas {
  height: 100% !important;
  width: 100% !important;
}

.table-section {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 50px rgba(0,0,0,.1);
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.table-header h3 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.export-buttons {
  display: flex;
  gap: 12px;
}

.btn-export {
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-export.pdf {
  background: #ef4444;
  color: white;
}

.btn-export.excel {
  background: #10b981;
  color: white;
}

.btn-export:hover {
  transform: translateY(-3px);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
}

table {
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
}

table th,
table td {
  padding: 16px 12px;
  text-align: left;
  white-space: nowrap;
}

thead {
  background: #0ea5e9;
  color: white;
}

th {
  font-weight: 800;
  font-size: .95rem;
}

tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: .2s;
}

tbody tr:hover {
  background: #f8fafc;
}

tbody tr:last-child {
  border-bottom: none;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: .6;
}

@media (max-width: 640px) {
  .reports-page {
    padding: 80px 16px 120px;
  }
  .page-header h1 {
    font-size: 2.4rem;
  }
  .period-selector {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  .period-selector button {
    flex: 1;
    padding: 14px 12px;
    font-size: .95rem;
  }
  .custom-range {
    flex-direction: column;
    width: 100%;
  }
  .custom-range input {
    width: 100%;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .stat-card {
    padding: 24px;
  }
  .value {
    font-size: 2.4rem;
  }
  .chart-card {
    padding: 24px;
    height: 340px;
  }
  .table-header {
    align-items: stretch;
  }
  .export-buttons {
    width: 100%;
    justify-content: center;
  }
  .btn-export {
    flex: 1;
  }
}
</style>