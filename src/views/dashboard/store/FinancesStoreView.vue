<template>
  <NavbarComponent />

  <div class="container finances-page">
    <div class="header">
      <h1>Finanças</h1>
      <div class="quick-stats">
        <div class="stat">
          <span>Este mês</span>
          <strong>€ 18.420</strong>
        </div>
        <div class="stat up">
          <span>vs mês passado</span>
          <strong>+24,8%</strong>
        </div>
      </div>
    </div>

    <!-- MINI CARDS MOBILE-FIRST -->
    <div class="mobile-cards">
      <div class="mini-card income">
        <div class="icon">€</div>
        <div class="info">
          <div class="label">Receita Total</div>
          <div class="value">€ 18.420</div>
          <div class="sub">+€ 3.680 vs mês anterior</div>
        </div>
      </div>

      <div class="mini-card services">
        <div class="icon">Scissors</div>
        <div class="info">
          <div class="label">Serviços</div>
          <div class="value">412</div>
          <div class="sub">média €44,70 por serviço</div>
        </div>
      </div>

      <div class="mini-card cash">
        <div class="icon">Cash</div>
        <div class="info">
          <div class="label">Dinheiro</div>
          <div class="value">€ 9.180</div>
          <div class="sub">49,9% do total</div>
        </div>
      </div>

      <div class="mini-card card">
        <div class="icon">Credit Card</div>
        <div class="info">
          <div class="label">Cartão / MB Way</div>
          <div class="value">€ 9.240</div>
          <div class="sub">50,1% do total</div>
        </div>
      </div>
    </div>

    <!-- GRÁFICO PRINCIPAL -->
    <div class="chart-section">
      <h3>Receita Diária – Últimos 30 dias</h3>
      <canvas ref="mainChart"></canvas>
    </div>

    <!-- ÚLTIMAS TRANSAÇÕES -->
    <div class="transactions">
      <h3>Últimas Transações</h3>
      <div v-for="t in transactions" :key="t.id" class="transaction-item">
        <div class="left">
          <div class="client-avatar" :style="{ backgroundImage: `url(${t.avatar})` }"></div>
          <div class="details">
            <div class="name">{{ t.client }}</div>
            <div class="service">{{ t.service }}</div>
          </div>
        </div>
        <div class="right">
          <div class="amount" :class="t.method">{{ t.amount }}</div>
          <div class="time">{{ t.time }}</div>
        </div>
      </div>
    </div>

    <!-- RESUMO MENSAL -->
    <div class="monthly-summary">
      <h3>Resumo do Mês</h3>
      <div class="summary-grid">
        <div class="summary-box">
          <span>Média diária</span>
          <strong>€ 614</strong>
        </div>
        <div class="summary-box">
          <span>Melhor dia</span>
          <strong>Sábado € 1.920</strong>
        </div>
        <div class="summary-box">
          <span>Pico horário</span>
          <strong>18h–19h</strong>
        </div>
        <div class="summary-box">
          <span>Ticket médio</span>
          <strong>€ 44,70</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import NavbarComponent from '@/components/NavbarComponent.vue'

const mainChart = ref<HTMLCanvasElement | null>(null)

const transactions = [
  { id: 1, client: 'Ricardo Alves', service: 'Corte + Barba', amount: '€45', method: 'card', time: 'há 12 min', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  { id: 2, client: 'Miguel Santos', service: 'Corte Moderno', amount: '€32', method: 'cash', time: 'há 28 min', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
  { id: 3, client: 'Ana Costa', service: 'Barba Completa', amount: '€28', method: 'mbway', time: 'há 1h', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80' },
  { id: 4, client: 'João Mendes', service: 'Corte + Coloração', amount: '€95', method: 'card', time: 'há 2h', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
  { id: 5, client: 'Pedro Silva', service: 'Corte Clássico', amount: '€32', method: 'cash', time: 'há 3h', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80' }
]

onMounted(() => {
  if (!mainChart.value) return

  new Chart(mainChart.value, {
    type: 'bar',
    data: {
      labels: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '30'],
      datasets: [{
        label: 'Receita €',
        data: [420, 580, 610, 720, 680, 920, 1180, 820, 740, 890, 780, 1420, 1680, 920, 880, 920],
        backgroundColor: '#10b981',
        borderRadius: 10,
        barThickness: 14
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', callback: v => '€' + v } }
      }
    }
  })
})
</script>

<style scoped>
.container { max-width: 1400px; margin: 0 auto; padding: 0 16px; }
.finances-page { margin-top: 70px; padding: 32px 0; min-height: 100vh; background: #f8fafc; }

.header {
  margin-bottom: 32px;
  text-align: center;
}
h1 { font-size: 2.6rem; font-weight: 900; color: #1e293b; margin: 0 0 12px; }
.quick-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  font-size: 1.1rem;
}
.quick-stats .stat span { color: #64748b; }
.quick-stats .stat strong { font-size: 2rem; font-weight: 900; color: #1e293b; }
.quick-stats .up strong { color: #10b981; }

.mobile-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}
.mini-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}
.mini-card .icon {
  width: 64px; height: 64px;
  border-radius: 18px;
  background: #10b981;
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.mini-card.income .icon { background: linear-gradient(135deg,#10b981,#22c55e); }
.mini-card.services .icon { background: linear-gradient(135deg,#0ea5e9,#06b6d4); }
.mini-card.cash .icon { background: linear-gradient(135deg,#f59e0b,#fbbf24); }
.mini-card.card .icon { background: linear-gradient(135deg,#8b5cf6,#a78bfa); }

.mini-card .label { font-size: 0.95rem; color: #64748b; }
.mini-card .value { font-size: 1.8rem; font-weight: 900; color: #1e293b; margin: 4px 0; }
.mini-card .sub { font-size: 0.85rem; color: #10b981; }

.chart-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  margin-bottom: 40px;
  border: 1px solid #e2e8f0;
}
.chart-section h3 { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 20px; text-align: center; }
canvas { height: 280px !important; }

.transactions {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  margin-bottom: 40px;
  border: 1px solid #e2e8f0;
}
.transactions h3 { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 20px; }
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}
.transaction-item:last-child { border: none; }
.left { display: flex; align-items: center; gap: 14px; }
.client-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: center/cover no-repeat;
  flex-shrink: 0;
}
.details .name { font-weight: 700; color: #1e293b; }
.details .service { font-size: 0.9rem; color: #64748b; }
.right { text-align: right; }
.amount { font-size: 1.4rem; font-weight: 900; color: #1e293b; }
.amount.cash { color: #f59e0b; }
.amount.card, .amount.mbway { color: #8b5cf6; }
.time { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; }

.monthly-summary {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
.monthly-summary h3 { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 20px; text-align: center; }
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.summary-box {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}
.summary-box span { display: block; color: #64748b; font-size: 0.95rem; margin-bottom: 8px; }
.summary-box strong { font-size: 1.5rem; font-weight: 900; color: #1e293b; }

/* RESPONSIVO PERFEITO */
@media (max-width: 480px) {
  .mobile-cards { grid-template-columns: 1fr; }
  .summary-grid { grid-template-columns: 1fr; }
  h1 { font-size: 2.2rem; }
}
@media (min-width: 640px) {
  .mobile-cards { grid-template-columns: repeat(4, 1fr); }
}
</style>