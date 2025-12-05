<template>
  <div class="container-fluid send-receive-container">
    <div class="row">
      <!-- Enviar Dinheiro -->
      <div class="col-lg-6 col-md-12">
        <div class="action-card send-card">
          <div class="card-header">
            <i class="fas fa-paper-plane action-icon"></i>
            <h4 class="text-dark">Enviar Dinheiro</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="sendMoney">
              <div class="mb-3">
                <label for="send-amount" class="form-label">Quantidade</label>
                <input
                  type="number"
                  id="send-amount"
                  v-model="sendAmount"
                  class="form-control"
                  placeholder="Insira o valor"
                />
              </div>
              <div class="mb-3">
                <label for="send-to" class="form-label">Destinatário</label>
                <input
                  type="text"
                  id="send-to"
                  v-model="sendTo"
                  class="form-control"
                  placeholder="Nome ou ID do destinatário"
                />
              </div>
              <button type="submit" class="btn btn-action">Enviar</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Receber Dinheiro -->
      <div class="col-lg-6 col-md-12">
        <div class="action-card receive-card">
          <div class="card-header">
            <i class="fas fa-download action-icon"></i>
            <h4 class="text-dark">Receber Dinheiro</h4>
          </div>
          <div class="card-body">
            <p class="instruction-text">
              Compartilhe este código com quem vai enviar dinheiro:
            </p>
            <div class="receive-code">
              {{ receiveCode }}
            </div>
            <button class="btn btn-action" @click="generateNewCode">
              Gerar Novo Código
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Estados
const sendAmount = ref(0);
const sendTo = ref('');
const receiveCode = ref('ABCD-1234');

// Funções
const sendMoney = () => {
  alert(`Enviando ${sendAmount.value} para ${sendTo.value}`);
  sendAmount.value = 0;
  sendTo.value = '';
};

const generateNewCode = () => {
  receiveCode.value = Math.random().toString(36).substr(2, 8).toUpperCase();
  alert('Novo código gerado!');
};
</script>

<style scoped>
/* Container principal */
.send-receive-container {
  padding: 20px;
  background: radial-gradient(circle, #1a1c2a, #11121b);
  color: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.1);
}

/* Cartões */
.action-card {
  background: linear-gradient(135deg, #1e2338, #2c3454);
  padding: 20px;
  border-radius: 15px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.action-icon {
  font-size: 30px;
  color: #00ffaa;
}

h4 {
  font-family: 'Orbitron', sans-serif;
}

.form-label {
  color: #00ffaa;
}

.form-control {
  background: #1a1c2a;
  border: 1px solid #00ffaa;
  color: white;
  border-radius: 10px;
}

.form-control:focus {
  border-color: #00ffaa;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.btn-action {
  background: #00ffaa;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

.btn-action:hover {
  background: #00cc88;
  transform: translateY(-3px);
}

/* Código para receber dinheiro */
.receive-code {
  background: #0b0c18;
  color: #00ffaa;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  border-radius: 8px;
  margin: 15px 0;
  font-family: 'Roboto Mono', monospace;
}

.instruction-text {
  font-size: 14px;
  color: #aaaaaa;
}
</style>
