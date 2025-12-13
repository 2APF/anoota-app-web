<template>
  <NavbarComponent />

  <div class="success-page" style="margin-top: 25px;">
    <div class="container">
      <div class="success-card">
        <div class="confetti">
          <div v-for="n in 30" :key="n" class="particle"></div>
        </div>

        <div class="icon-wrapper">
          <i class="fas fa-check-circle"></i>
        </div>

        <h1>Marcação Feita!</h1>

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
  id?: string
  name: string
  email: string
  phone: string
  about: string
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
  max-width: 560px;
  margin: 0 auto;
}

.success-card {
  background: white;
  border-radius: 32px;
  padding: 52px 36px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(16, 185, 129, .15);
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
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  opacity: 0;
  animation: confetti-fall 3s ease-out forwards;
}

.particle:nth-child(odd) {
  background: #0ea5e9;
}

.particle:nth-child(3n) {
  background: #34d399;
}

.particle:nth-child(4n) {
  background: #86efac;
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
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  box-shadow: 0 12px 35px rgba(16, 185, 129, .3);
  animation: pulse 2s infinite;
}

.icon-wrapper i {
  font-size: 3.8rem;
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
  font-size: 2.5rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 14px;
  background: linear-gradient(90deg, #10b981, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.contact {
  background: #f0fdf4;
  border-radius: 18px;
  padding: 18px;
  margin: 28px 0;
  border: 2px dashed #86efac;
}

.contact p {
  margin: 0;
  color: #065f46;
  font-weight: 600;
  font-size: 1.05rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 36px;
}

.btn-primary {
  padding: 16px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(16, 185, 129, .25);
}

.btn-secondary {
  padding: 16px;
  background: transparent;
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
  border-radius: 18px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all .3s;
}

.btn-secondary:hover {
  background: #f0f9ff;
  transform: translateY(-3px);
}

@media (max-width: 480px) {
  .success-card {
    padding: 44px 24px;
    border-radius: 28px;
  }

  h1 {
    font-size: 2.2rem;
  }

  .icon-wrapper {
    width: 90px;
    height: 90px;
  }

  .icon-wrapper i {
    font-size: 3.4rem;
  }

  .contact {
    padding: 16px;
    margin: 24px 0;
  }
}
</style>