<template>
  <NavbarComponent />

  <div class="become-pro">
    <div class="container">
      <header class="header">
        <h1>Torne-se Profissional</h1>
        <p>Comece a receber agendamentos hoje</p>
      </header>

      <div class="benefits">
        <div class="b">
          <i class="fas fa-calendar-check"></i>
          <div>Agendamentos 24h</div>
        </div>
        <div class="b">
          <i class="fas fa-users"></i>
          <div>Mais clientes</div>
        </div>
        <div class="b">
          <i class="fas fa-credit-card"></i>
          <div>Pagamento garantido</div>
        </div>
        <div class="b">
          <i class="fas fa-chart-line"></i>
          <div>Agenda completa</div>
        </div>
      </div>

      <div class="card">
        <h2>Crie sua loja em 1 minuto</h2>

        <form @submit.prevent="submitProfissional" class="form">
          <input v-model="form.name" placeholder="Nome da loja ou teu nome" required />

          <div class="phone-group">
            <div class="country-select">
              <img :src="selectedFlag" alt="" class="flag">
              <select v-model="countryCode">
                <option value="+351" data-flag="https://flagcdn.com/32x24/pt.png" selected>+351 Portugal</option>
                <option value="+244" data-flag="https://flagcdn.com/32x24/ao.png">+244 Angola</option>
                <option value="+238" data-flag="https://flagcdn.com/32x24/cv.png">+238 Cabo Verde</option>
                <option value="+245" data-flag="https://flagcdn.com/32x24/gw.png">+245 Guiné-Bissau</option>
                <option value="+258" data-flag="https://flagcdn.com/32x24/mz.png">+258 Moçambique</option>
                <option value="+670" data-flag="https://flagcdn.com/32x24/tl.png">+670 Timor-Leste</option>
                <option value="+55" data-flag="https://flagcdn.com/32x24/br.png">+55 Brasil</option>
                <option value="+34" data-flag="https://flagcdn.com/32x24/es.png">+34 Espanha</option>
                <option value="+33" data-flag="https://flagcdn.com/32x24/fr.png">+33 França</option>
                <option value="+44" data-flag="https://flagcdn.com/32x24/gb.png">+44 Reino Unido</option>
                <option value="+1" data-flag="https://flagcdn.com/32x24/us.png">+1 EUA/Canadá</option>
                <option value="+49" data-flag="https://flagcdn.com/32x24/de.png">+49 Alemanha</option>
                <option value="+39" data-flag="https://flagcdn.com/32x24/it.png">+39 Itália</option>
              </select>
              <!-- <i class="fas fa-chevron-down"></i> -->
            </div>
            <input v-model="form.phoneNumber" type="number" placeholder="912 345 678" required />
          </div>

          <select v-model="form.category" required>
            <option value="" disabled selected>Escolha a categoria</option>
            <option>Barbearia & Cabeleireiro</option>
            <option>Body Piercing & Tatuagem</option>
            <option>Cuidados Faciais & Laser</option>
            <option>Depilação & Laser</option>
            <option>Design de Sobrancelhas</option>
            <option>Estética Avançada</option>
            <option>Estética & Unhas</option>
            <option>Lash & Brow Design</option>
            <option>Maquilhagem Profissional</option>
            <option>Massagem & Spa</option>
            <option>Nail Art & Unhas Gel</option>
            <option>Personal Trainer</option>
            <option>Salão de Beleza</option>
            <option>Serviços Holísticos (Reiki, Energia)</option>
            <option>Tranças Africanas</option>
            <option>Yoga & Pilates</option>
            <option>Outro</option>
          </select>


          <button type="submit" class="btn" :disabled="loading">
            <i v-show="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'A processar...' : 'Começar Agora' }}
          </button>
        </form>

        <p class="price">Apenas 10€ por mês</p>
        <p class="trust">Mais de 720 profissionais já estão conosco</p>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="showSuccess" class="success-modal">
      <div class="modal-content">
        <i class="fas fa-check-circle"></i>
        <h3>Parabéns!</h3>
        <p>A tua loja foi criada com sucesso.</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

const form = reactive({
  name: '',
  phoneNumber: '',
  category: ''
})

const countryCode = ref('+351')
const loading = ref(false)
const showSuccess = ref(false)


interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  address?: string;
  provider?: string;
  createdAt?: string;
  photo?: string;
  type?: string;
}

let user: User;
if (typeof route.params.user === 'string') {
  user = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else if (Array.isArray(route.params.user)) {
  user = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else {
  user = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
}


const fullPhone = computed(() => countryCode.value + ' ' + form.phoneNumber)

const selectedFlag = computed(() => {
  const opt = document.querySelector(`option[value="${countryCode.value}"]`) as HTMLOptionElement
  return opt?.dataset.flag || 'https://flagcdn.com/32x24/pt.png'
})

const submitProfissional = async () => {
  loading.value = true

  try {
    const res = await fetch(`${API_URL}/store/to-professional`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: fullPhone.value,
        category: form.category,
        user_id: user.id
      })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Erro na requisição')

    showSuccess.value = true
    setTimeout(() => {
      router.push({ name: 'app.store.configuration' }).catch(() => { })
    }, 3000)

  } catch (err: any) {
    alert(err.message || 'Ocorreu um erro. Tenta novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = route.query.token as string 
  if (token && user.id) {
    if (user.type == '2') {
      router.push({ name: 'app.store.configuration' }).catch(() => { })
    }
  }
})


</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.become-pro {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e0f2fe);
  padding: 90px 20px 140px
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px
}

@media(min-width:1200px) {
  .container {
    max-width: 840px
  }
}

.header {
  text-align: center;
  margin-bottom: 60px
}

.header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b, #0ea5e9);
  
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
  line-height: 1.2
}

.header p {
  font-size: 1.35rem;
  color: #475569;
  font-weight: 500
}

.benefits {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 70px
}

.b {
  background: #fff;
  border-radius: 24px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .07);
  transition: transform .3s
}

.b:hover {
  transform: translateY(-6px)
}

.b i {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  color: #fff;
  font-size: 1.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px
}

.b div {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b
}

.card {
  background: #fff;
  border-radius: 32px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .1);
  text-align: center
}

.card h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 40px
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px
}

.form input,
.form select {
  width: 100%;
  padding: 19px 22px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  background: #fdfdfd;
  font-size: 1.1rem;
  transition: all .3s
}

.form input:focus,
.form select:focus {
  outline: none;
  border-color: #0ea5e9;
  background: #fff;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, .12)
}

.phone-group {
  display: flex;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  transition: all .3s
}

.phone-group:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, .12)
}

.country-select {
  position: relative;
  width: 130px;
  background: #f8fafc;
  flex-shrink: 0
}

.country-select select {
  appearance: none;
  width: 100%;
  padding: 19px 36px 19px 52px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer
}

.flag {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 18px;
  border-radius: 4px;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2)
}

.country-select i {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none
}

.phone-group input {
  flex: 1;
  padding: 19px 22px;
  border: none;
  background: transparent;
  font-size: 1.1rem
}

.phone-group input:focus {
  outline: none
}

.btn {
  width: 100%;
  padding: 20px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px
}

.btn:hover {
  background: #059669;
  transform: translateY(-3px)
}

.btn:disabled {
  opacity: .7;
  cursor: not-allowed;
  transform: none
}

.price {
  margin: 12px 0 16px;
  color: #10b981;
  font-weight: 700;
  font-size: 1.2rem
}

.trust {
  color: #475569;
  font-size: 1.15rem;
  font-weight: 600
}


.success-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .3);
  max-width: 30%;
  animation: pop .4s ease
}

.modal-content i {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 20px
}

.modal-content h3 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 12px
}

.modal-content p {
  font-size: 1.1rem;
  color: #475569
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}

@keyframes pop {
  0% {
    transform: scale(.7);
    opacity: 0
  }

  100% {
    transform: scale(1);
    opacity: 1
  }
}

@media(max-width:480px) {
  .become-pro {
    padding: 70px 16px 120px
  }

  .header h1 {
    font-size: 2.4rem
  }

  .benefits {
    grid-template-columns: 1fr
  }

  .card {
    padding: 40px 24px
  }

  .phone-group {
    flex-direction: column
  }

  .country-select {
    width: 100%;
    border-bottom: 1px solid #e2e8f0
  }

  .country-select select {
    padding-left: 56px
  }

  .modal-content {
    padding: 32px 24px
  }
}
</style>