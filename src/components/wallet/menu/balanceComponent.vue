<template>
  <div class="container-fluid futuristic-container">
    <div class="row">
      <!-- Seção Esquerda -->
      <div class="col-lg-4 col-md-12">
        <!-- Cartão Virtual -->
        <div class="user-card mb-4">
          <div class="card-header">
            <span class="card-logo">⚡</span>
            <h4 class="text-dark">Cartão NoCoin</h4>
          </div>
          <div class="card-info">
            <p class="card-number">**** **** **** ****</p>
            <p class="card-expiry">EXP: ***********</p>
            <p class="card-holder">NOME: ***********</p>
          </div>
        </div>

        <!-- Conversões Futurísticas -->
        <!-- <div class="conversion-table">
          <h4 class="section-title futuristic-text">Taxas de Conversão</h4>
          <div v-for="conversion in conversions" :key="conversion.currency" class="conversion-item">
            <p>1 NoCoin ≈ {{ conversion.value }} {{ conversion.currency }}</p>
          </div>
        </div> -->
      </div>

      <!-- Seção Central -->
      <div class="col-lg-4 col-md-12">
        <div class="card futuristic-card text-center mb-4">
          <div class="card-body">
            <h4 class="futuristic-text">Saldo Atual</h4>
            <p class="balance-text futuristic-text">{{ balance }} NoCoins</p>
          </div>
        </div>
      </div>

      <!-- Seção Direita -->
      <div class="col-lg-4 col-md-12">
        <div class="conversion-table">
          <h4 class="section-title futuristic-text">Taxas de Conversão</h4>
          <div v-for="conversion in conversions" :key="conversion.currency" class="conversion-item">
            <p>1 NoCoin ≈ {{ conversion.value }} {{ conversion.currency }}</p>
          </div>
        </div>
        <!-- <div class="crypto-cards">
          <h4 class="section-title futuristic-text">Moedas Futurísticas</h4>
          <div
            class="crypto-card mb-3"
            v-for="crypto in cryptocurrencies"
            :key="crypto.name"
          >
            <img :src="crypto.icon" :alt="crypto.name" class="crypto-icon" />
            <h5>{{ crypto.name }}</h5>
            <p class="crypto-value">{{ crypto.value }} {{ crypto.currency }}</p>
          </div>
        </div> -->
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
.futuristic-container {
  padding: 20px;
  background: radial-gradient(circle at center, #1e1f36, #0b0b12);
  color: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.2);
}

.user-card,
.futuristic-card,
.crypto-card,
.conversion-table {
  background: linear-gradient(135deg, #1e2338, #293045);
  padding: 20px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.3);
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

.crypto-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.crypto-card {
  text-align: center;
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

.futuristic-text {
  color: #00ffaa;
  font-family: 'Orbitron', sans-serif;
}

.balance-text {
  font-size: 30px;
  font-weight: bold;
}

.conversion-table .conversion-item {
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

.conversion-item:last-child {
  border-bottom: none;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  }
  to {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
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
