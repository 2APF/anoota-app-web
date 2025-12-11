<template>
  <NavbarComponent />

  <div class="payment-page">
    <div class="container">
      <header class="page-header">
        <h1>Tornar-se Profissional</h1>
        <p>Comece a receber agendamentos hoje mesmo</p>
      </header>

      <div class="pricing-card">
        <div class="price-header">
          <div class="amount">6€</div>
          <div class="period">/ mês</div>
        </div>

        <ul class="features">
          <li><i class="fas fa-check"></i> Agendamentos 24h online</li>
          <li><i class="fas fa-check"></i> Perfil profissional destacado</li>
          <li><i class="fas fa-check"></i> Gestão completa de horários</li>
          <li><i class="fas fa-check"></i> Galeria de fotos e serviços</li>
          <li><i class="fas fa-check"></i> Pagamentos garantidos</li>
          <li><i class="fas fa-check"></i> Suporte prioritário</li>
        </ul>

        <div class="card-element">
          <div id="card-element"></div>
          <div v-if="cardError" class="error">{{ cardError }}</div>
        </div>

        <button @click="processPayment" class="btn-pay" :disabled="processing || !cardComplete">
          <i v-if="processing" class="fas fa-spinner fa-spin"></i>
          {{ processing ? 'A processar...' : 'Pagar 6€ e Ativar' }}
        </button>

        <p class="secure">
          <i class="fas fa-lock"></i>
          Pagamento seguro com Stripe • Sem compromisso • Cancela quando quiseres
        </p>
      </div>

      <div class="trust">
        <p>Mais de 720 profissionais já confiam em nós</p>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div v-if="showSuccess" class="success-overlay">
      <div class="success-modal">
        <div class="icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Parabéns!</h2>
        <p>A tua conta profissional foi ativada com sucesso.</p>
        <button @click="goToDashboard" class="btn-dashboard">
          Ir para o Dashboard
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { loadStripe } from '@stripe/stripe-js'

const router = useRouter()

const stripe = ref<any>(null)
const elements = ref<any>(null)
const card = ref<any>(null)

const cardComplete = ref(false)
const cardError = ref('')
const processing = ref(false)
const showSuccess = ref(false)

const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

onMounted(async () => {
  stripe.value = await loadStripe('pk_test_51ScpUSBroBphJTqBelNdVcBIwGdtWzqJKC4Wxxxxxxxxxxxxeeeeeeeeeeeee')
  if (stripe.value) {
    elements.value = stripe.value.elements()
    const style = {
      base: {
        color: '#1e293b',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '18px',
        '::placeholder': {
          color: '#94a3b8'
        }
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444'
      }
    }

    card.value = elements.value.create('card', { style })
    card.value.mount('#card-element')

    card.value.on('change', (event: any) => {
      cardComplete.value = event.complete
      cardError.value = event.error ? event.error.message : ''
    })
  }
})

const processPayment = async () => {
  if (!cardComplete.value || !stripe.value) return

  processing.value = true
  cardError.value = ''

  try {
    const { paymentMethod, error } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: card.value
    })

    if (error) {
      cardError.value = error.message
      processing.value = false
      return
    }

    const res = await fetch(`${API_URL}/store/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_method_id: paymentMethod.id
      })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Erro no pagamento')

    if (data.requires_action) {
      const { error: confirmError } = await stripe.value.confirmCardPayment(data.client_secret)
      if (confirmError) throw confirmError
    }

    showSuccess.value = true
  } catch (err: any) {
    cardError.value = err.message || 'Ocorreu um erro no pagamento. Tenta novamente.'
  } finally {
    processing.value = false
  }
}

const goToDashboard = () => {
  router.push('/configuracao-loja')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.payment-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 20px 140px;
  display: flex;
  align-items: center;
}

.container {
  max-width: 560px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.35rem;
  color: #475569;
  font-weight: 500;
}

.pricing-card {
  background: white;
  border-radius: 36px;
  padding: 48px 40px;
  box-shadow: 0 25px 70px rgba(0,0,0,.15);
  text-align: center;
}

.price-header {
  margin-bottom: 40px;
}

.amount {
  font-size: 5rem;
  font-weight: 900;
  color: #10b981;
  line-height: 1;
}

.period {
  font-size: 1.5rem;
  color: #64748b;
  font-weight: 600;
}

.features {
  list-style: none;
  padding: 0;
  margin: 40px 0;
  text-align: left;
}

.features li {
  padding: 12px 0;
  font-size: 1.15rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 16px;
}

.features i {
  color: #10b981;
  font-size: 1.3rem;
}

.card-element {
  margin: 32px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  transition: all .3s;
}

.card-element:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

#card-element {
  background: white;
  padding: 16px;
  border-radius: 16px;
}

.error {
  color: #ef4444;
  margin-top: 12px;
  font-size: 1rem;
}

.btn-pay {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.4rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
  margin: 24px 0;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(16,185,129,.3);
}

.btn-pay:disabled {
  opacity: .7;
  cursor: not-allowed;
}

.secure {
  font-size: 1rem;
  color: #64748b;
  margin: 24px 0 0;
}

.secure i {
  color: #10b981;
  margin-right: 8px;
}

.trust {
  text-align: center;
  margin-top: 48px;
  font-size: 1.15rem;
  color: #475569;
  font-weight: 600;
}

.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.success-modal {
  background: white;
  border-radius: 36px;
  padding: 60px 40px;
  text-align: center;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 30px 80px rgba(0,0,0,.3);
}

.success-modal .icon {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
}

.success-modal i {
  font-size: 5rem;
  color: white;
}

.success-modal h2 {
  font-size: 2.4rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 16px;
}

.success-modal p {
  font-size: 1.25rem;
  color: #475569;
  margin: 0 0 32px;
}

.btn-dashboard {
  padding: 18px 40px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}

.btn-dashboard:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(16,185,129,.3);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .pricing-card {
    padding: 40px 24px;
  }
  .amount {
    font-size: 4rem;
  }
  .success-modal {
    padding: 48px 24px;
  }
}
</style>