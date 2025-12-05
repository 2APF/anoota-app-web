<template>
  <nav class="bottom-nav">
    <ul>
      <li 
        :class="{ active: activeTab === 'home' }" 
        @click="setActive('home')">
        <RouterLink :to="{ name: 'app.wallet.dash' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-btn">
          <i class="fas fa-home"></i>
          <span>Início</span>
        </RouterLink>
      </li>
      <li 
        :class="{ active: activeTab === 'balance' }" 
        @click="setActive('balance')">
        <RouterLink :to="{ name: 'app.wallet.transations' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-btn">
          <i class="fas fa-coins"></i>
          <span>Transações</span>
        </RouterLink>
      </li>
      <li 
        :class="{ active: activeTab === 'payments' }" 
        @click="setActive('payments')">
        <RouterLink :to="{ name: 'app.wallet.payment.nocoin' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-btn">
          <i class="fas fa-exchange-alt"></i>
          <span>Pagamentos</span>
        </RouterLink>
      </li>
      <li 
        :class="{ active: activeTab === 'settings' }" 
        @click="setActive('settings')">
        <RouterLink :to="{ name: 'app.wallet.configuration' }" :scroll-behavior="{ behavior: 'smooth' }" class="nav-btn">
          <i class="fas fa-user-cog"></i>
          <span>Configurações</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";

// Estado do botão ativo
const activeTab = ref("home");

function setActive(tab) {
  activeTab.value = tab;
}
</script>

<style scoped>
/* Estilização do menu inferior */
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #11121b;
  border-top: 1px solid #444;
  z-index: 100;
}

.bottom-nav ul {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  margin: 0;
  list-style: none;
}

.bottom-nav li {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease, transform 0.3s ease;
}

.bottom-nav li .nav-btn {
  background: none;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: inherit;
  cursor: pointer;
  text-decoration: none; /* Remove underline de links */
  transition: transform 0.3s ease, color 0.3s ease;
}

.bottom-nav li.active .nav-btn {
  color: #00ffaa;
  transform: scale(1.1);
}

.bottom-nav li.active .nav-btn i {
  color: #00ffaa;
}

.bottom-nav li .nav-btn:focus {
  outline: none;
}
</style>
