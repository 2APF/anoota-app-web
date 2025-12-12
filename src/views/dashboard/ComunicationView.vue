<template>
  <NavbarComponent />

  <div class="communications-page">
    <div class="container">
      <header class="page-header">
        <h1>Comunicações</h1>
        <p>Envie mensagens e novidades aos utilizadores</p>
      </header>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <Transition name="fade">
        <div v-if="activeTab === 'compose'" class="compose-section">
          <div class="compose-card">
            <h2>Nova Mensagem</h2>

            <div class="form-grid">
              <div class="form-group">
                <label>Tipo de destinatário</label>
                <select v-model="newMessage.recipientType">
                  <option value="all">Todos os utilizadores</option>
                  <option value="clients">Todos os clientes</option>
                  <option value="professionals">Todos os profissionais</option>
                  <option value="specific">Utilizador específico</option>
                </select>
              </div>

              <div class="form-group" v-if="newMessage.recipientType === 'specific'">
                <label>Procurar utilizador</label>
                <input v-model="newMessage.searchUser" placeholder="Nome, email ou telefone" />
                <!-- Simulação de resultados -->
                <div class="user-results" v-if="newMessage.searchUser.length >= 2">
                  <div class="user-option" @click="selectUser({ id: 1, name: 'João Silva', type: 'client' })">
                    João Silva (Cliente)
                  </div>
                  <div class="user-option" @click="selectUser({ id: 2, name: 'Beauty Salon', type: 'professional' })">
                    Beauty Salon (Profissional)
                  </div>
                </div>
              </div>

              <div class="form-group" v-if="selectedUser">
                <label>Destinatário selecionado</label>
                <div class="selected-user">
                  <strong>{{ selectedUser.name }}</strong>
                  <small>{{ selectedUser.type === 'client' ? 'Cliente' : 'Profissional' }}</small>
                  <button @click="selectedUser = null" class="remove-user">×</button>
                </div>
              </div>

              <div class="form-group">
                <label>Canal de envio</label>
                <div class="channel-options">
                  <label class="channel-label">
                    <input type="radio" v-model="newMessage.channel" value="email" />
                    <span>Email</span>
                  </label>
                  <label class="channel-label">
                    <input type="radio" v-model="newMessage.channel" value="sms" />
                    <span>SMS</span>
                  </label>
                  <label class="channel-label">
                    <input type="radio" v-model="newMessage.channel" value="whatsapp" />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label>Título</label>
                <input v-model="newMessage.title" placeholder="Assunto da mensagem" />
              </div>

              <div class="form-group full">
                <label>Mensagem</label>
                <textarea v-model="newMessage.body" rows="8" placeholder="Escreva a sua mensagem..."></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button @click="activeTab = 'sent'" class="btn-secondary">Cancelar</button>
              <button @click="sendMessage" class="btn-primary" :disabled="sending || !isFormValid">
                <i v-if="sending" class="fas fa-spinner fa-spin"></i>
                {{ sending ? 'A enviar...' : 'Enviar Mensagem' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="messages-list">
          <div v-if="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
          </div>

          <div v-else-if="filteredMessages.length === 0" class="empty">
            <i class="fas fa-envelope-open-text"></i>
            <h3>Nenhuma mensagem {{ activeTab === 'sent' ? 'enviada' : 'recebida' }}</h3>
            <p>Quando houver mensagens, aparecerão aqui.</p>
          </div>

          <div v-else class="messages-grid">
            <div
              v-for="msg in filteredMessages"
              :key="msg.id"
              class="message-card"
              :class="{ unread: activeTab === 'received' && !msg.read }"
            >
              <div class="message-header">
                <div class="sender">
                  <i class="fas fa-user-circle"></i>
                  <div>
                    <strong>{{ msg.from || 'Sistema' }}</strong>
                    <small>{{ formatDate(msg.created_at) }}</small>
                  </div>
                </div>
                <span v-if="activeTab === 'received' && !msg.read" class="unread-dot"></span>
              </div>
              <div class="message-body">
                <h4>{{ msg.title }}</h4>
                <p>{{ msg.body }}</p>
              </div>
              <div class="message-footer">
                <small>Enviado via {{ msg.channel || 'Email' }} • Para: {{ formatTarget(msg.target) }}</small>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'

const loading = ref(false)
const activeTab = ref('received')
const sending = ref(false)

const tabs = [
  { id: 'received', label: 'Recebidas', count: 3 },
  { id: 'sent', label: 'Enviadas', count: 0 },
  { id: 'compose', label: 'Nova Mensagem', count: 0 }
]

const newMessage = ref({
  recipientType: 'all',
  searchUser: '',
  title: '',
  body: '',
  channel: 'email'
})

const selectedUser = ref<any>(null)

const messages = ref([
  { id: 1, from: 'Suporte Anoota', title: 'Bem-vindo à plataforma!', body: 'Obrigado por se juntar a nós. Explore todas as funcionalidades.', created_at: '2025-12-10T10:00:00', read: false, target: 'all', channel: 'email' },
  { id: 2, from: 'Sistema', title: 'Atualização disponível', body: 'Nova versão com melhorias de desempenho.', created_at: '2025-12-09T14:30:00', read: false, target: 'professionals', channel: 'whatsapp' },
  { id: 3, from: 'Suporte Anoota', title: 'Dica do dia', body: 'Complete o seu perfil para atrair mais clientes.', created_at: '2025-12-08T09:15:00', read: true, target: 'professionals', channel: 'sms' }
])

const sentMessages = ref([
  { id: 4, title: 'Promoção de Natal', body: '20% de desconto em todos os serviços durante Dezembro.', created_at: '2025-12-07T12:00:00', target: 'users', channel: 'email' },
  { id: 5, title: 'Novo horário', body: 'A partir de Janeiro abriremos aos domingos.', created_at: '2025-12-05T16:45:00', target: 'all', channel: 'whatsapp' }
])

const filteredMessages: any = computed(() => {
  if (activeTab.value === 'received') return messages.value
  if (activeTab.value === 'sent') return sentMessages.value
  return []
})

const isFormValid = computed(() => {
  return newMessage.value.title.trim() && newMessage.value.body.trim() &&
    (newMessage.value.recipientType !== 'specific' || selectedUser.value)
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return format(date, "d 'de' MMMM',' HH:mm", { locale: pt })
}

const formatTarget = (target: string) => {
  switch (target) {
    case 'all': return 'Todos'
    case 'professionals': return 'Profissionais'
    case 'users': return 'Clientes'
    default: return 'Específico'
  }
}

const selectUser = (user: any) => {
  selectedUser.value = user
  newMessage.value.searchUser = ''
}

const sendMessage = () => {
  if (!isFormValid.value) return

  sending.value = true
  setTimeout(() => {
    sentMessages.value.unshift({
      id: sentMessages.value.length + messages.value.length + 1,
      title: newMessage.value.title,
      body: newMessage.value.body,
      created_at: new Date().toISOString(),
      target: selectedUser.value ? 'specific' : newMessage.value.recipientType,
      channel: newMessage.value.channel
    })

    tabs[1].count++
    newMessage.value = { recipientType: 'all', searchUser: '', title: '', body: '', channel: 'email' }
    selectedUser.value = null
    sending.value = false
    activeTab.value = 'sent'
  }, 1200)
}

onMounted(() => {
  tabs[0].count = messages.value.filter(m => !m.read).length
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.communications-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 20px 140px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 56px;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.25rem;
  color: #475569;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 14px 32px;
  background: white;
  border: 2.5px solid #e2e8f0;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.05rem;
  color: #475569;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tabs button.active {
  background: #0ea5e9;
  border-color: #0ea5e9;
  color: white;
}

.count {
  background: #ef4444;
  color: white;
  font-size: .8rem;
  padding: 4px 10px;
  border-radius: 20px;
  min-width: 24px;
}

.compose-section {
  max-width: 800px;
  margin: 0 auto;
}

.compose-card {
  background: white;
  border-radius: 32px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,.1);
}

.compose-card h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 40px;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-bottom: 32px;
}

.full {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 12px;
  font-weight: 700;
  color: #475569;
  font-size: 1.05rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  background: #fdfdfd;
  font-size: 1.05rem;
  transition: all .3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

.channel-options {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.channel-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
}

.channel-label input[type="radio"] {
  width: auto;
  margin: 0;
}

.user-results {
  margin-top: 12px;
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
}

.user-option {
  padding: 14px 20px;
  cursor: pointer;
  transition: .2s;
}

.user-option:hover {
  background: #e0f2fe;
}

.selected-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ecfdf5;
  padding: 14px 20px;
  border-radius: 16px;
  border: 2px solid #10b981;
}

.remove-user {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ef4444;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 20px;
  margin-top: 32px;
}

.btn-secondary {
  flex: 1;
  padding: 18px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  flex: 1;
  padding: 18px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
}

.btn-primary:disabled {
  opacity: .7;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 80px;
  color: #64748b;
  font-size: 1.3rem;
}

.empty {
  text-align: center;
  padding: 120px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 5rem;
  margin-bottom: 28px;
  opacity: .6;
}

.empty h3 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px;
}

.empty p {
  font-size: 1.2rem;
}

.messages-grid {
  display: grid;
  gap: 28px;
}

.message-card {
  background: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  transition: all .3s;
  position: relative;
}

.message-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0,0,0,.14);
}

.message-card.unread {
  border-left: 5px solid #0ea5e9;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.sender {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sender i {
  font-size: 2.4rem;
  color: #0ea5e9;
}

.sender strong {
  font-size: 1.2rem;
  color: #1e293b;
}

.sender small {
  font-size: .95rem;
  color: #64748b;
}

.unread-dot {
  width: 14px;
  height: 14px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 0 4px white;
}

.message-body h4 {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 14px;
}

.message-body p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.message-footer {
  margin-top: 24px;
  font-size: .95rem;
  color: #64748b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-actions {
    flex-direction: column;
  }
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .unread-dot {
    position: static;
  }
}

@media (max-width: 640px) {
  .communications-page {
    padding: 80px 16px 120px;
  }
  .page-header h1 {
    font-size: 2.4rem;
  }
  .tabs button {
    padding: 12px 20px;
    font-size: 1rem;
  }
  .compose-card,
  .message-card {
    padding: 32px 20px;
  }
}
</style>