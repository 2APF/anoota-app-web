<template>
  <NavbarComponent />

  <div class="clients-page">
    <header class="header">
      <div class="title">
        <h1>Meus Clientes</h1>
        <p class="total-count">{{ clients.length }} cliente{{ clients.length !== 1 ? 's' : '' }} no total</p>
      </div>
      <button @click="openNewClient" class="btn-add">
        + Novo Cliente
      </button>
    </header>

    <div class="container">
      <div class="search-bar">
        <!-- <i class="fas fa-search"></i> -->
        <input v-model="searchQuery" @input="filterClients" placeholder="Pesquisar por nome, telefone ou email..." />
      </div>

      <div v-if="filteredClients.length === 0" class="empty">
        <i class="fas fa-users"></i>
        <h3>Nenhum cliente encontrado</h3>
        <p v-if="clients.length === 0">Adicione seu primeiro cliente</p>
        <p v-else>Nenhum resultado para esta pesquisa</p>
      </div>

      <div v-else class="clients-list">
        <div v-for="client in filteredClients" :key="client.id" class="client-item">
          <div class="main-info">
            <div class="avatar">
              {{ client.name.trim().charAt(0).toUpperCase() }}
            </div>
            <div class="details">
              <h3>{{ client.name }}</h3>
              <div class="contact">
                <span v-if="client.phone"><i class="fas fa-phone"></i> {{ client.phone }}</span>
                <span v-if="client.email"><i class="fas fa-envelope"></i> {{ client.email }}</span>
              </div>
              <small class="since">Desde {{ formatDate(client.created_at) }}</small>
            </div>
          </div>

          <div class="actions">
            <button @click="editClient(client)" class="edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="openDeleteModal(client)" class="delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Novo/Editar -->
  <teleport to="body">
    <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-card" @click.stop>
        <h3>{{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
        <form @submit.prevent="saveClient">
          <input v-model="form.name" placeholder="Nome completo *" required />
          <input v-model="form.phone" placeholder="Telefone (ex: 912345678) *" />
          <input v-model="form.email" type="email" placeholder="Email (opcional, mas recomendado)" />
          <textarea v-model="form.notes" placeholder="Notas (opcional)" rows="3"></textarea>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel">Cancelar</button>
            <button type="submit" class="save" >
              {{ editingClient ? 'Salvar' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>

  
  <teleport to="body">
    <div v-if="deleteModalOpen" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-card delete-modal" @click.stop>
        <i class="fas fa-exclamation-triangle warning-icon"></i>
        <h3>Tem certeza?</h3>
        <p>Você está prestes a remover permanentemente:</p>
        <strong>{{ clientToDelete?.name }}</strong>
        <p class="info">Esta ação não pode ser desfeita.</p>

        <div class="modal-actions">
          <button type="button" @click="closeDeleteModal" class="cancel">Cancelar</button>
          <button @click="confirmDelete" class="delete-confirm">
            Sim, remover
          </button>
        </div>
      </div>
    </div>
  </teleport>

   <div v-if="notification.message" class="notification" :class="notification.type">
    {{ notification.message }}
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import NavbarComponent from '@/components/NavbarComponent.vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'




const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}



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



interface Client {
  id: number
  name: string
  phone: string
  email: string
  notes: string
  created_at: string
}

const clients = ref<Client[]>([])
const filteredClients = ref<Client[]>([])
const searchQuery = ref('')
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editingClient = ref<Client | null>(null)
const clientToDelete = ref<Client | null>(null)

const form = ref({
  name: '',
  phone: '',
  email: '',
  notes: ''
})

const loadClients = async () => {
  try {
    const res = await axios.get(`${API_URL}/store/client/list/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    clients.value = res.data.data || []
    filteredClients.value = [...clients.value]
  } catch (err) {
    console.error('Erro ao carregar clientes', err)
  }
}

const filterClients = () => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) {
    filteredClients.value = [...clients.value]
    return
  }
  filteredClients.value = clients.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.phone && c.phone.includes(q)) ||
    (c.email && c.email.toLowerCase().includes(q))
  )
}

const openNewClient = () => {
  editingClient.value = null
  form.value = { name: '', phone: '', email: '', notes: '' }
  modalOpen.value = true
}

const editClient = (client: Client) => {
  editingClient.value = client
  form.value = {
    name: client.name,
    phone: client.phone || '',
    email: client.email || '',
    notes: client.notes || ''
  }
  modalOpen.value = true
}

const saveClient = async () => {
  try {
    const payload = { ...form.value, user_id: user.id }

    if (editingClient.value) {
      await axios.put(`${API_URL}/store/client/update/${editingClient.value.id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      showNotification('Cliente actualizado(a) com sucesso.', 'success')
    } else {
      await axios.post(`${API_URL}/store/client/create`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      showNotification('Cliente cadastrado(a) com sucesso.', 'success')
    }

    closeModal()
    loadClients()
  } catch (err) {
    alert('Erro ao salvar cliente')
  }
}

const openDeleteModal = (client: Client) => {
  clientToDelete.value = client
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  clientToDelete.value = null
}

const confirmDelete = async () => {
  if (!clientToDelete.value) return

  try {
    await axios.delete(`${API_URL}/store/client/delete/${clientToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    closeDeleteModal()
    showNotification('Cliente excluido(a) com sucesso.', 'success')
    loadClients()
  } catch (err) {
    alert('Erro ao remover cliente')
  }
}

const closeModal = () => {
  modalOpen.value = false
  editingClient.value = null
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd MMM yyyy", { locale: pt })
}

onMounted(loadClients)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.clients-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 90px 16px 120px;
}

.header {
  max-width: 1000px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 60px;
}

.title h1 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
}

.total-count {
  color: #0ea5e9;
  font-weight: 700;
  font-size: 1.1rem;
  margin: 8px 0 0;
}

.btn-add {
  padding: 14px 28px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(14,165,233,.3);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  margin-bottom: 28px;
}

.search-bar i {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #0ea5e9;
  font-size: 1.3rem;
  pointer-events: none;
}



.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 16px 28px;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.notification.success {
  background: #10b981;
}

.notification.error {
  background: #ef4444;
}

.search-bar input {
  width: 100%;
  padding: 16px 20px 16px 56px;
  border: 3px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  font-size: 1.05rem;
  box-shadow: 0 8px 25px rgba(0,0,0,.06);
}

.search-bar input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.15);
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 3.5rem;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.clients-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.client-item {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all .3s;
}

.client-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(14,165,233,.15);
}

.main-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0ea5e9;
  color: white;
  font-weight: 900;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.details h3 {
  margin: 0 0 6px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: .95rem;
  color: #475569;
}

.contact i {
  color: #0ea5e9;
  margin-right: 8px;
  font-size: .9rem;
}

.since {
  color: #94a3b8;
  font-size: .8rem;
  margin-top: 6px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.actions button {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all .2s;
}

.edit {
  background: #e0e7ff;
  color: #4338ca;
}

.delete {
  background: #fee2e2;
  color: #dc2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.modal-card {
  background: white;
  border-radius: 28px;
  padding: 28px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 30px 80px rgba(0,0,0,.4);
  text-align: center;
}

.modal-card h3 {
  margin: 0 0 20px;
  font-size: 1.7rem;
  color: #1e293b;
}

.modal-card input,
.modal-card textarea {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
}

.warning-icon {
  font-size: 3.5rem;
  color: #dc2626;
  margin-bottom: 16px;
}

.delete-modal p {
  color: #475569;
  margin: 12px 0;
}

.delete-modal strong {
  display: block;
  font-size: 1.3rem;
  color: #1e293b;
  margin: 12px 0;
}

.info {
  font-size: .9rem;
  color: #94a3b8;
  margin: 16px 0 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
}

.cancel {
  background: #e2e8f0;
  color: #475569;
}

.save,
.delete-confirm {
  background: #dc2626;
  color: white;
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .btn-add {
    width: 100%;
    padding: 16px;
  }

  .client-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
  }

  .main-info {
    width: 100%;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-card {
    padding: 24px;
    margin: 10px;
  }
}
</style>