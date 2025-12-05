<template>
  <div class="container-fluid settings-container">
    <div class="row">
      <!-- Coluna da Esquerda -->
      <div class="col-lg-6 col-md-12">
        <!-- Informações do Usuário -->
        <div class="settings-card">
          <div class="card-header">
            <i class="fas fa-user-cog settings-icon"></i>
            <h4>Informações do Usuário</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateUserInfo">
              <div class="mb-3">
                <label for="username" class="form-label">Nome de Usuário</label>
                <input
                  type="text"
                  id="username"
                  v-model="user.username"
                  class="form-control futuristic-input"
                  placeholder="Insira seu nome de usuário"
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input
                  type="email"
                  id="email"
                  v-model="user.email"
                  class="form-control futuristic-input"
                  placeholder="Insira seu e-mail"
                />
              </div>
              <button type="submit" class="btn btn-action">Atualizar Informações</button>
            </form>
          </div>
        </div>

        <!-- Alteração de Senha -->
        <div class="settings-card">
          <div class="card-header">
            <i class="fas fa-key settings-icon"></i>
            <h4>Alteração de Senha</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Senha Atual</label>
                <input
                  type="password"
                  id="currentPassword"
                  v-model="passwords.current"
                  class="form-control futuristic-input"
                  placeholder="Insira sua senha atual"
                />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Nova Senha</label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="passwords.new"
                  class="form-control futuristic-input"
                  placeholder="Insira sua nova senha"
                />
              </div>
              <button type="submit" class="btn btn-action">Alterar Senha</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Coluna da Direita -->
      <div class="col-lg-6 col-md-12">
        <!-- Preferências de Notificação -->
        <div class="settings-card">
          <div class="card-header">
            <i class="fas fa-bell settings-icon"></i>
            <h4>Preferências de Notificação</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="emailNotifications"
                  v-model="notifications.email"
                />
                <label class="form-check-label" for="emailNotifications">Receber notificações por e-mail</label>
              </div>
              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="smsNotifications"
                  v-model="notifications.sms"
                />
                <label class="form-check-label" for="smsNotifications">Receber notificações por SMS</label>
              </div>
              <button type="button" @click="updateNotifications" class="btn btn-action">Salvar Preferências</button>
            </form>
          </div>
        </div>

        <!-- Configurações de Moedas -->
        <div class="settings-card">
          <div class="card-header">
            <i class="fas fa-coins settings-icon"></i>
            <h4>Configurações de Moedas</h4>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="defaultCurrency" class="form-label">Moeda Padrão</label>
                <select id="defaultCurrency" v-model="currency.default" class="form-select futuristic-input">
                  <option value="" disabled>Selecione sua moeda</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="conversionRate" class="form-label">Taxa de Conversão</label>
                <input
                  type="number"
                  id="conversionRate"
                  v-model="currency.conversionRate"
                  class="form-control futuristic-input"
                  placeholder="Insira a taxa de conversão atual"
                />
              </div>
              <button type="button" @click="updateCurrencySettings" class="btn btn-action">Salvar Configurações</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Dados do Usuário
const user = ref({
  username: 'UsuárioExemplo',
  email: 'usuario@exemplo.com',
});

// Senhas
const passwords = ref({
  current: '',
  new: '',
});

// Notificações
const notifications = ref({
  email: true,
  sms: false,
});

// Configurações de Moedas
const currency = ref({
  default: 'USD',
  conversionRate: 1.0,
});

// Métodos
const updateUserInfo = () => {
  alert(`Informações atualizadas para: ${user.value.username}, ${user.value.email}`);
};

const changePassword = () => {
  if (passwords.value.current && passwords.value.new) {
    alert('Senha alterada com sucesso!');
  } else {
    alert('Preencha os campos de senha corretamente.');
  }
};

const updateNotifications = () => {
  alert(`Notificações atualizadas: Email - ${notifications.value.email}, SMS - ${notifications.value.sms}`);
};

const updateCurrencySettings = () => {
  alert(`Configurações de moeda salvas: Padrão - ${currency.value.default}, Taxa - ${currency.value.conversionRate}`);
};
</script>

<style scoped>
/* Container Principal */
.settings-container {
  padding: 30px 15px;
  background: radial-gradient(circle, #1a1c2a, #11121b);
  color: white;
  min-height: 100vh;
}

/* Cartões */
.settings-card {
  background: linear-gradient(145deg, #2b3047, #202538);
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.settings-icon {
  font-size: 30px;
  color: #00ffaa;
}

h4 {
  font-family: 'Orbitron', sans-serif;
}

.futuristic-input {
  background: #11121b;
  border: 1px solid #00ffaa;
  border-radius: 10px;
  color: white;
  padding: 10px 15px;
  font-size: 1rem;
  transition: all 0.3s;
}

.futuristic-input:focus {
  outline: none;
  border-color: #00cc88;
  box-shadow: 0 0 10px rgba(0, 255, 170, 0.5);
}

.btn-action {
  background: #00ffaa;
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #00cc88;
  transform: translateY(-3px);
}
</style>
