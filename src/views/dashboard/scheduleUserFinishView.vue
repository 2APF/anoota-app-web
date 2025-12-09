<template>
  <NavbarComponent />

  <div class="success-page">
    <div class="container">
      <div class="success-card mt-3">
        <div class="confetti">
          <div v-for="n in 30" :key="n" class="particle"></div>
        </div>

        <div class="icon-wrapper">
          <i class="fas fa-check-circle"></i>
        </div>

        <h1>Marcação Feita!</h1>
        <!-- <p>O teu agendamento foi realizado com sucesso.</p> -->
        <!-- <p class="detail">Em breve receberás uma confirmação por SMS e email.</p> -->


        <div class="contact">
          <p>Qualquer dúvida, entra em contacto com a loja diretamente.</p>
        </div>

        <div class="actions">
          <button @click="router.push('/')" class="btn-primary">
            Explorar mais serviços
          </button>

          <button v-if="user.id" @click="router.push('/')" class="btn-secondary">
            Ver minhas marcações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
}

const user: User = {
  id: '',
  name: '',
  email: '',
  phone: '',
  about: ''
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  padding: 80px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 620px;
  margin: 0 auto;
}

.success-card {
  background: white;
  border-radius: 40px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 25px 70px rgba(16, 185, 129, 0.18);
  position: relative;
  overflow: hidden;
}

.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  opacity: 0;
  animation: confetti-fall 3s ease-out forwards;
}

.particle:nth-child(odd) {
  background: #0ea5e9;
}

.particle:nth-child(3n) {
  background: #f59e0b;
}

.particle:nth-child(4n) {
  background: #ec4899;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.icon-wrapper {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}

.icon-wrapper i {
  font-size: 4.5rem;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

h1 {
  font-size: 2.8rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 16px;
  background: linear-gradient(90deg, #10b981, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.25rem;
  color: #475569;
  margin: 12px 0;
  line-height: 1.6;
}

.detail {
  font-size: 1.1rem;
  color: #10b981;
  font-weight: 600;
  margin: 20px 0 32px;
}

.contact {
  background: #f0fdf4;
  border-radius: 20px;
  padding: 20px;
  margin: 32px 0;
  border: 2px dashed #86efac;
}

.contact p {
  margin: 0;
  color: #065f46;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
}

.btn-primary {
  padding: 18px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  padding: 18px;
  background: transparent;
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f0f9ff;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  .success-card {
    padding: 48px 24px;
  }

  h1 {
    font-size: 2.4rem;
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
  }

  .icon-wrapper i {
    font-size: 3.8rem;
  }
}
</style>