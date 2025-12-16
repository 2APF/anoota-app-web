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
          <input v-model="data_start_search" type="date" placeholder="De" />
          <span>até</span>
          <input v-model="data_end_search" type="date" placeholder="Até" />
        </div>
<!-- 
        <div class="search-wrapper">
          <input v-model="searchClient" type="text" placeholder="Buscar por cliente ou serviço..." />
        </div> -->
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
          <div class="chart-wrapper">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <h3>Serviços Mais Realizados</h3>
          <div class="chart-wrapper">
            <canvas ref="servicesChart"></canvas>
          </div>
        </div>
      </div>

      <div class="table-section">
        <div class="table-header">
          <h3>Marcações </h3>
          <div class="export-buttons">
            <button @click="exportPDF" class="btn-export pdf">
              <i class="fas fa-file-pdf"></i> Exportar em PDF
            </button>
            <button @click="exportExcel" class="btn-export excel">
              <i class="fas fa-file-excel"></i> Exportar em Excel
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
                <td>{{ apt.duration_minutes_service }} min</td>
                <td>€{{ apt.price_paid }}</td>
                <td>
                  <span class="status-badge" :class="{ completed: apt.status === '3' }">
                    {{ apt.status === '3' ? 'Concluído' : 'Pendente' }}
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useRouter, useRoute } from 'vue-router'
import { format } from 'date-fns'
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
  start_datetime: string
  duration_minutes_service: number
  price: string
}

const period = ref<'week' | 'month' | 'custom'>('month')
const data_start_search = ref('')
const data_end_search = ref('')
const searchClient = ref('')

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

  if (searchClient.value.trim()) {
    const query = searchClient.value.toLowerCase()
    filtered = filtered.filter(s =>
      s.name_client.toLowerCase().includes(query) ||
      s.name_service.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime())

  return filtered
})

const formatDate = (dateStr: string) => format(new Date(dateStr), "dd MMM yyyy", { locale: pt })

const uniqueClients = computed(() => {
  const clientIds = new Set(filteredAppointments.value.map(s => s.name_client))
  return clientIds.size
})

const avgTicket = computed(() => 
  totalAppointments.value > 0 ? totalRevenue.value / totalAppointments.value : 0
)

const fetchReports = async () => {
  try {
    const params = new URLSearchParams()
    if (period.value === 'custom' && data_start_search.value && data_end_search.value) {
      params.append('start', data_start_search.value)
      params.append('end', data_end_search.value)
    }

    const url = `${API_URL}/store/report/all/${userId}?${params.toString()}`
    const res = await fetch(url)

    const data = await res.json()


    schedules.value = data.schedules || []
    totalRevenue.value = Number(data.total_revenue || 0)
    totalAppointments.value = data.total_schedules_finished || 0
    servicesMoreBooked.value = data.services_more_booked || []
  } catch (err) {
    schedules.value = []
    totalRevenue.value = 0
    totalAppointments.value = 0
    servicesMoreBooked.value = []
  }
}

const exportPDF = () => alert('Exportação PDF em desenvolvimento')
const exportExcel = () => alert('Exportação Excel em desenvolvimento')

onMounted(async () => {
  await fetchReports()
  await nextTick()
  createCharts()
})

watch([period, data_start_search, data_end_search, searchClient], async () => {
  await fetchReports()
  await nextTick()
  createCharts()
})

const createCharts = () => {
  const ctx1 = revenueChart.value?.getContext('2d')
  const ctx2 = servicesChart.value?.getContext('2d')

  if (chart1) chart1.destroy()
  if (chart2) chart2.destroy()

  const revenueData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Receita',
      data: [100, 100, 100, 100, 100, 100, 100],
      backgroundColor: '#0ea5e9',
      borderRadius: 8,
    }]
  }

  const servicesLabels = servicesMoreBooked.value.map(s => s.name.slice(0, 20))
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
        scales: { 
          y: { beginAtZero: true, grid: { display: false } }, 
          x: { grid: { display: false } } 
        }
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
        plugins: { 
          legend: { 
            position: 'bottom' as const, 
            labels: { padding: 16 } 
          } 
        }
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
  padding: 100px 16px 120px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.page-header {
  text-align: center;
}

.page-header h1 {
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px;
}

.page-header p {
  font-size: 1.15rem;
  color: #64748b;
}

.filters-bar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.period-selector {
  display: flex;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,.1);
}

.period-selector button {
  padding: 14px 24px;
  border: none;
  background: transparent;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all .3s;
  min-width: 110px;
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
  box-shadow: 0 8px 30px rgba(0,0,0,.1);
  width: 100%;
  max-width: 420px;
  justify-content: center;
}

.custom-range input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  flex: 1;
}

.search-wrapper {
  width: 100%;
  max-width: 420px;
  position: relative;
}

.search-wrapper input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  font-size: 1rem;
  box-shadow: 0 8px 30px rgba(0,0,0,.1);
  transition: all .3s;
}

.search-wrapper::before {
  content: '\f002';
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 24px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: transform .3s;
}

.stat-card:hover {
  transform: translateY(-6px);
}

.icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.icon.income { color: #10b981; }
.icon.appointments { color: #0ea5e9; }
.icon.clients { color: #8b5cf6; }
.icon.avg { color: #f59e0b; }

.value {
  font-size: 2.4rem;
  font-weight: 900;
  color: #1e293b;
  margin: 8px 0;
}

.label {
  font-size: 1.05rem;
  color: #64748b;
  font-weight: 600;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.chart-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 15px 50px rgba(0,0,0,.1);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
  text-align: center;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 300px;
}

.chart-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}

.table-section {
  background: white;
  border-radius: 24px;
  padding: 28px 20px;
  box-shadow: 0 15px 50px rgba(0,0,0,.1);
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.table-header h3 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.export-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 420px;
}

.btn-export {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform .3s;
}

.btn-export.pdf { background: #ef4444; }
.btn-export.excel { background: #10b981; }

.btn-export:hover { transform: translateY(-3px); }

.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 14px 10px;
  text-align: left;
  font-size: .95rem;
}

thead {
  background: #0ea5e9;
  color: white;
}

th {
  font-weight: 800;
}

tbody tr {
  border-bottom: 1px solid #f1f5f9;
}

tbody tr:hover {
  background: #f8fafc;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 50px;
  font-size: .85rem;
  font-weight: 700;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
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

.empty p {
  font-size: 1.2rem;
  font-weight: 500;
}

/* Responsividade aprimorada */
@media (min-width: 768px) {
  .charts-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .custom-range {
    width: auto;
  }
  
  .search-wrapper {
    width: auto;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 2.2rem;
  }
  
  .period-selector button {
    padding: 12px 16px;
    font-size: .95rem;
    min-width: auto;
  }
  
  .custom-range {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }
  
  .custom-range input {
    width: 100%;
  }
  
  .stat-card {
    padding: 24px 16px;
  }
  
  .value {
    font-size: 2.2rem;
  }
  
  .chart-card {
    padding: 20px;
  }
  
  .chart-wrapper {
    min-height: 260px;
  }
  
  .table-header h3 {
    font-size: 1.5rem;
  }
  
  .export-buttons {
    flex-direction: column;
  }
  
  th, td {
    padding: 12px 8px;
    font-size: .9rem;
  }
}
</style>