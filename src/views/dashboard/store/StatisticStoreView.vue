<template>
  <NavbarComponent />

  <div class="container stats-page">
    <div class="header">
      <h1>Estatísticas da Loja</h1>
      <div class="period-selector">
        <button :class="{ active: period === '7d' }" @click="period = '7d'">7 dias</button>
        <button :class="{ active: period === '30d' }" @click="period = '30d'">30 dias</button>
        <button :class="{ active: period === '90d' }" @click="period = '90d'">90 dias</button>
        <button :class="{ active: period === '12m' }" @click="period = '12m'">12 meses</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon revenue"></div>
        <div class="value">€ 12.847</div>
        <div class="label">Receita Total</div>
        <div class="trend up">+28.4%</div>
      </div>
      <div class="stat-card">
        <div class="icon appointments"></div>
        <div class="value">284</div>
        <div class="label">Agendamentos</div>
        <div class="trend up">+19.2%</div>
      </div>
      <div class="stat-card">
        <div class="icon clients"></div>
        <div class="value">167</div>
        <div class="label">Novos Clientes</div>
        <div class="trend up">+42.1%</div>
      </div>
      <div class="stat-card">
        <div class="icon rating"></div>
        <div class="value">4.92</div>
        <div class="label">Avaliação Média</div>
        <div class="trend">de 428 avaliações</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>Receita por Dia</h3>
        <canvas ref="revenueChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>Serviços Mais Populares</h3>
        <canvas ref="servicesChart"></canvas>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="ranking-card">
        <h3>Melhores Horários</h3>
        <div class="ranking-list">
          <div v-for="slot in topHours" :key="slot.time" class="ranking-item">
            <span class="label">{{ slot.time }}</span>
            <div class="bar"><div class="fill" :style="{ width: slot.percent + '%' }"></div></div>
            <span class="count">{{ slot.count }}</span>
          </div>
        </div>
      </div>

      <div class="ranking-card">
        <h3>Melhores Dias</h3>
        <div class="ranking-list">
          <div v-for="day in topDays" :key="day.day" class="ranking-item">
            <span class="label">{{ day.day }}</span>
            <div class="bar"><div class="fill" :style="{ width: day.percent + '%' }"></div></div>
            <span class="count">{{ day.count }}</span>
          </div>
        </div>
      </div>

      <div class="activity-card">
        <h3>Atividade Recente</h3>
        <div class="activity-list">
          <div v-for="act in recentActivity" :key="act.id" class="activity-item">
            <div class="avatar" :style="{ backgroundImage: `url(${act.avatar})` }"></div>
            <div class="content">
              <div class="name">{{ act.name }}</div>
              <div class="action">{{ act.action }}</div>
            </div>
            <div class="time">{{ act.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import NavbarComponent from '@/components/NavbarComponent.vue'

const period = ref('30d')
const revenueChart = ref<HTMLCanvasElement | null>(null)
const servicesChart = ref<HTMLCanvasElement | null>(null)

let chart1: any = null
let chart2: any = null

const topHours = [
  { time: '18:00', percent: 100, count: 48 },
  { time: '17:00', percent: 92, count: 44 },
  { time: '19:00', percent: 85, count: 41 },
  { time: '16:00', percent: 78, count: 37 },
  { time: '15:00', percent: 65, count: 31 }
]

const topDays = [
  { day: 'Sábado', percent: 100, count: 89 },
  { day: 'Sexta', percent: 94, count: 84 },
  { day: 'Quinta', percent: 88, count: 79 },
  { day: 'Quarta', percent: 82, count: 73 },
  { day: 'Terça', percent: 76, count: 68 }
]

const recentActivity = [
  { id: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', name: 'Pedro Silva', action: 'agendou Corte + Barba', time: '2 min' },
  { id: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', name: 'Ana Costa', action: 'deixou avaliação 5 estrelas', time: '15 min' },
  { id: 3, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', name: 'João Mendes', action: 'agendou Corte Moderno', time: '28 min' },
  { id: 4, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', name: 'Miguel Santos', action: 'agendou Barba Completa', time: '1h' }
]

onMounted(() => createCharts())
watch(period, () => createCharts())

const createCharts = () => {
  if (chart1) chart1.destroy()
  if (chart2) chart2.destroy()

  if (!revenueChart.value || !servicesChart.value) return

  chart1 = new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [{
        data: [1240, 1380, 1520, 1890, 2240, 3120, 1450],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#0ea5e9'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' } } } }
  })

  chart2 = new Chart(servicesChart.value, {
    type: 'bar',
    data: {
      labels: ['Corte + Barba', 'Corte Moderno', 'Barba Completa', 'Coloração', 'Sobrancelha'],
      datasets: [{
        data: [98, 76, 62, 34, 28],
        backgroundColor: '#10b981',
        borderRadius: 8
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f1f5f9' } } } }
  })
}
</script>

<style scoped>
.container { max-width: 1480px; margin: 0 auto; padding: 0 20px; }
.stats-page { margin-top: 80px; padding: 40px 0; }

.header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap; 
  gap: 20px; 
  margin-bottom: 40px; 
}
h1 { font-size: 2.4rem; font-weight: 900; color: #1e293b; margin: 0; }

.period-selector {
  display: flex;
  background: #f8fafc;
  border-radius: 16px;
  padding: 6px;
  gap: 4px;
}
.period-selector button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}
.period-selector button.active {
  background: #0ea5e9;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 6px;
  height: 100%;
  background: #0ea5e9;
}
.icon {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 90px;
  height: 90px;
  border-radius: 24px;
  opacity: 0.12;
}
.icon.revenue { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
.icon.appointments { background: linear-gradient(135deg, #10b981, #22c55e); }
.icon.clients { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.icon.rating { background: linear-gradient(135deg, #f59e0b, #fbbf24); }

.value { font-size: 2.6rem; font-weight: 900; color: #1e293b; margin: 8px 0; }
.label { font-size: 1.1rem; color: #64748b; font-weight: 600; }
.trend { margin-top: 12px; font-weight: 700; font-size: 1rem; }
.trend.up { color: #10b981; }

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}
.chart-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
.chart-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
}
canvas { width: 100% !important; height: 300px !important; }

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
}
.ranking-card, .activity-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
.ranking-card h3, .activity-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 24px;
}
.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.ranking-item:last-child { margin-bottom: 0; }
.label { width: 70px; font-weight: 700; color: #1e293b; }
.bar {
  flex: 1;
  height: 10px;
  background: #e0e7ff;
  border-radius: 6px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #0ea5e9;
  border-radius: 6px;
  transition: width 0.8s ease;
}
.count { min-width: 60px; text-align: right; font-weight: 700; color: #0ea5e9; }

.activity-list { max-height: 360px; overflow-y: auto; }
.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}
.activity-item:last-child { border: none; }
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: center/cover no-repeat;
  flex-shrink: 0;
}
.content { flex: 1; }
.name { font-weight: 700; color: #1e293b; }
.action { color: #64748b; font-size: 0.95rem; margin-top: 2px; }
.time { color: #94a3b8; font-size: 0.9rem; }

@media (max-width: 1200px) {
  .bottom-grid { grid-template-columns: 1fr 1fr; }
  .activity-card { grid-column: 1 / -1; }
}
@media (max-width: 900px) {
  .charts-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .header { flex-direction: column; text-align: center; }
  .period-selector { justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .bottom-grid { grid-template-columns: 1fr; }
  h1 { font-size: 2rem; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>