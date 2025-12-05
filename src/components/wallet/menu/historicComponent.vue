<template>
  
    <div class="row justify-content-center">
      <div class="col-lg-12 col-md-12">
        <!-- Filtro de Intervalo de Datas -->
        <div class="filter-card">
          <div class="card-body">
            <h4 class="card-title">Filtrar Transações</h4>
            <form @submit.prevent="filterTransactions">
              <div class="row">
                <div class="col-md-5 mb-3">
                  <label for="startDate" class="form-label">Data Inicial</label>
                  <input
                    type="date"
                    id="startDate"
                    v-model="startDate"
                    class="form-control futuristic-input"
                  />
                </div>
                <div class="col-md-5 mb-3">
                  <label for="endDate" class="form-label">Data Final</label>
                  <input
                    type="date"
                    id="endDate"
                    v-model="endDate"
                    class="form-control futuristic-input"
                  />
                </div>
                <div class="col-md-2 align-items-end">
                  <button type="submit" class="btn btn-action w-100">Filtrar</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="transactions-card">
          <div class="card-body">
            <h4 class="card-title">Histórico de Transações</h4>
            <div v-if="filteredTransactions.length" class="transaction-list">
              <div
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="transaction-item"
              >
                <div class="transaction-header">
                  <span>{{ transaction.date }}</span>
                  <span :class="transaction.type === 'credit' ? 'credit' : 'debit'">
                    {{ transaction.type === 'credit' ? '+ ' : '- ' }}{{ transaction.amount }} Moedas
                  </span>
                </div>
                <p class="transaction-description">{{ transaction.description }}</p>
              </div>
            </div>
            <div v-else class="no-transactions">
              <p>Nenhuma transação encontrada para o intervalo selecionado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Dados simulados
const transactions = ref([
  { id: 1, date: '2024-12-01', amount: 100, type: 'credit', description: 'Depósito via banco.' },
  { id: 2, date: '2024-12-03', amount: 50, type: 'debit', description: 'Pagamento de serviço.' },
  { id: 3, date: '2024-12-10', amount: 200, type: 'credit', description: 'Recebimento de transferência.' },
  { id: 4, date: '2024-12-12', amount: 75, type: 'debit', description: 'Compra de produto.' },
]);

// Estados para filtro de datas
const startDate = ref('');
const endDate = ref('');

// Computed para filtrar transações
const filteredTransactions = computed(() => {
  if (!startDate.value && !endDate.value) return transactions.value;

  return transactions.value.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    return (
      (!start || transactionDate >= start) &&
      (!end || transactionDate <= end)
    );
  });
});

// Função de filtro
const filterTransactions = () => {
  console.log('Filtrando transações...');
};
</script>

<style scoped>
/* Container Principal */
.transactions-container {
  background: radial-gradient(circle, #1a1c2a, #11121b);
  color: white;
  min-height: 100vh;
  padding: 30px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cartão de Filtro */
.filter-card {
  background: linear-gradient(145deg, #2b3047, #202538);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

.card-title {
  font-family: 'Orbitron', sans-serif;
  color: #00ffaa;
  margin-bottom: 15px;
}

.futuristic-input {
  background: #11121b;
  border: 1px solid #00ffaa;
  border-radius: 10px;
  color: #e0e0e0;
  padding: 10px 15px;
  font-size: 1rem;
  transition: all 0.3s;
}

.futuristic-input:focus {
  outline: none;
  border-color: #00cc88;
  box-shadow: 0px 0px 10px rgba(0, 255, 170, 0.5);
}

/* Botão de Filtro */
.btn-action {
  background: #00ffaa;
  color: #11121b;
  font-weight: bold;
  border: none;
  padding: 12px;
  font-size: 1.1rem;
  border-radius: 10px;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #00cc88;
  box-shadow: 0px 5px 15px rgba(0, 255, 170, 0.5);
  transform: translateY(-3px);
}

/* Histórico de Transações */
.transactions-card {
  background: linear-gradient(145deg, #2b3047, #202538);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.transaction-list {
  margin-top: 15px;
}

.transaction-item {
  padding: 10px 15px;
  margin-bottom: 15px;
  background: #11121b;
  border-radius: 10px;
  border-left: 5px solid #00ffaa;
  transition: all 0.3s;
}

.transaction-item:hover {
  background: #1a1c2a;
  transform: translateY(-3px);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.transaction-header span {
  font-size: 0.9rem;
  font-weight: bold;
}

.transaction-header .credit {
  color: #00ffaa;
}

.transaction-header .debit {
  color: #ff5555;
}

.transaction-description {
  font-size: 0.85rem;
  color: #cccccc;
}

.no-transactions {
  text-align: center;
  font-size: 1rem;
  color: #999;
  margin-top: 20px;
}
</style>
