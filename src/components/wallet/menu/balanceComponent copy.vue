<template>
  <div class="futuristic-section">
    <!-- Cartão Virtual -->
    <div class="user-card">
      <div class="card-header">
        <span class="card-logo">⚡</span>
        <h4>Cartão Virtual</h4>
      </div>
      <div class="card-info">
        <p class="card-number">XXXX XXXX XXXX 4578</p>
        <p class="card-expiry">EXP: 04/27</p>
        <p class="card-holder">NOME: JOÃO DA SILVA</p>
      </div>
    </div>

    <!-- Saldo Atual -->
    <div class="card futuristic-card">
      <div class="card-body">
        <h4 class="futuristic-text">Saldo Atual</h4>
        <p class="balance-text futuristic-text">{{ balance }} NoCoins</p>
      </div>
    </div>

    <!-- Cards de Moedas Futurísticas -->
    <div class="crypto-cards">
      <div class="crypto-card" v-for="crypto in cryptocurrencies" :key="crypto.name">
        <img :src="crypto.icon" :alt="crypto.name" class="crypto-icon" />
        <h5>{{ crypto.name }}</h5>
        <p class="crypto-value">{{ crypto.value }} {{ crypto.currency }}</p>
      </div>
    </div>

    <!-- Conversões Futurísticas -->
    <div class="conversion-table">
      <h4 class="section-title futuristic-text">Taxas de Conversão</h4>
      <div v-for="conversion in conversions" :key="conversion.currency" class="conversion-item">
        <p>1 NoCoin ≈ {{ conversion.value }} {{ conversion.currency }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Dados simulados
const balance = ref(1500); // Saldo em NoCoins
const cryptocurrencies = ref([
  { name: 'NeoBit', value: '0.0012', currency: 'NB', icon: 'https://via.placeholder.com/100/0ff/fff?text=N' },
  { name: 'StarCoin', value: '0.0457', currency: 'SC', icon: 'https://via.placeholder.com/100/f00/fff?text=S' },
  { name: 'MetaGrid', value: '1.002', currency: 'MG', icon: 'https://via.placeholder.com/100/00f/fff?text=M' },
]);

const conversions = ref([
  { currency: 'USD', value: 150 },
  { currency: 'EUR', value: 140 },
  { currency: 'BRL', value: 750 },
  { currency: 'YEN', value: 17000 },
]);
</script>

<style scoped>
.futuristic-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 20px auto;
  max-width: 900px;
  padding: 20px;
  background: radial-gradient(circle at center, #1e1f36, #0b0b12);
  border-radius: 20px;
  color: white;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.2);
}

.user-card {
  background: linear-gradient(135deg, #131a36, #1e2749);
  padding: 25px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.2);
  animation: glow 3s infinite alternate;
}

.card-logo {
  font-size: 30px;
  animation: rotate 5s linear infinite;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.card-info {
  text-align: left;
  font-family: 'Roboto Mono', monospace;
}

.card-number {
  font-size: 22px;
  font-weight: bold;
  color: #00ffee;
  letter-spacing: 2px;
}

.card-expiry,
.card-holder {
  margin-top: 10px;
  font-size: 14px;
  color: #bbbbbb;
}

.futuristic-card {
  background: #232746;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 255, 255, 0.5);
}

.futuristic-text {
  color: #00ffaa;
  font-family: 'Orbitron', sans-serif;
}

.balance-text {
  font-size: 30px;
  font-weight: bold;
}

.crypto-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.crypto-card {
  background: linear-gradient(135deg, #1e2338, #293045);
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  flex: 1 1 calc(33% - 20px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 255, 255, 0.4);
  color: #ffffff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.crypto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.6);
}

.crypto-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 50%;
  background: #0ff;
}

.crypto-card h5 {
  font-size: 16px;
  margin: 0;
}

.crypto-value {
  margin-top: 10px;
  color: #00ffaa;
  font-weight: bold;
}

.conversion-table {
  background: #232746;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 255, 255, 0.4);
}

.section-title {
  font-size: 20px;
  margin-bottom: 15px;
}

.conversion-item {
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

.conversion-item:last-child {
  border-bottom: none;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
  to {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.7);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
