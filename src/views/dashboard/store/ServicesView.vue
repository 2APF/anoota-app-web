<template>
  <NavbarComponent />

  <div class="services-page">
    <header class="header">
      <div class="title">
        <h1>Meus Serviços</h1>
        <p class="total-count">{{ services.length }} serviço{{ services.length !== 1 ? 's' : '' }} cadastrado{{ services.length !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="openNewService" class="btn-add">
        + Novo Serviço
      </button>
    </header>

    <div class="container">
      <div class="search-bar">
        <input v-model="searchQuery" @input="filterServices" placeholder="Pesquisar por nome do serviço..." />
      </div>

      <div v-if="filteredServices.length === 0" class="empty">
        <i class="fas fa-cut"></i>
        <h3>Nenhum serviço encontrado</h3>
        <p v-if="services.length === 0">Adicione seu primeiro serviço</p>
        <p v-else>Nenhum resultado para esta pesquisa</p>
      </div>

      <div v-else class="services-list">
        <div v-for="service in filteredServices" :key="service.id" class="service-item">
          <div class="main-info">
            <div class="icon">
              <i class="fas fa-scissors"></i>
            </div>
            <div class="details">
              <h3>{{ service.name }}</h3>
              <div class="meta">
                <span><i class="fas fa-clock"></i> {{ service.duration_minutes }} min</span>
                <span><i class="fas fa-euro-sign"></i> {{ service.price }}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button @click="editService(service)" class="edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="openDeleteModal(service)" class="delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-card" @click.stop>
          <h3>{{ editingService ? 'Editar Serviço' : 'Novo Serviço' }}</h3>
          <form @submit.prevent="saveService">
            <input v-model="form.name" placeholder="Nome do serviço *" required />
            <div class="row">
              <input v-model.number="form.duration_minutes" type="number" min="5" placeholder="Duração (min) *" required />
              <input v-model.number="form.price" type="number" step="0.01" min="0" placeholder="Preço € *" required />
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel">Cancelar</button>
              <button type="submit" class="save">
                {{ editingService ? 'Salvar' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="deleteModalOpen" class="modal-overlay" @click="closeDeleteModal">
        <div class="modal-card delete-modal text-center" @click.stop>
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <h3>Tem certeza?</h3>
          <p>Você está prestes a remover permanentemente:</p>
          <strong>{{ serviceToDelete?.name }}</strong>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'

const router = useRouter()
const route = useRoute()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

let userId = ''
if (typeof route.params.user === 'string') userId = route.params.user
else if (Array.isArray(route.params.user)) userId = route.params.user[0] || ''
else if (route.params.user && typeof route.params.user === 'object') userId = (route.params.user as any).id || ''

const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}

interface Service {
  id: number
  name: string
  duration_minutes: number
  price: string
}

const services = ref<Service[]>([])
const filteredServices = ref<Service[]>([])
const searchQuery = ref('')
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editingService = ref<Service | null>(null)
const serviceToDelete = ref<Service | null>(null)

const form = ref({
  name: '',
  duration_minutes: '',
  price: ''
})

const loadServices = async () => {
  try {
    const res = await axios.get(`${API_URL}/store/service/my/${userId}`)
    services.value = res.data.services || []
    filteredServices.value = [...services.value]
  } catch (err) {
    services.value = []
    filteredServices.value = []
  }
}

const filterServices = () => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) {
    filteredServices.value = [...services.value]
    return
  }
  filteredServices.value = services.value.filter(s =>
    s.name.toLowerCase().includes(q)
  )
}

const openNewService = () => {
  editingService.value = null
  form.value = { name: '', duration_minutes: '', price: '' }
  modalOpen.value = true
}

const editService = (service: Service) => {
  editingService.value = service
  form.value = {
    name: service.name,
    duration_minutes: service.duration_minutes,
    price: service.price
  }
  modalOpen.value = true
}


const saveService = async () => {
  if (!form.value.name || !form.value.duration_minutes || !form.value.price) return

  try {
    const payload = {
      name: form.value.name.trim(),
      duration_minutes: Number(form.value.duration_minutes),
      price: Number(form.value.price).toFixed(2)
    }

    if (editingService.value) {
      await axios.put(`${API_URL}/store/service/update/${editingService.value.id}`, payload)
      showNotification('Serviço atualizado com sucesso.', 'success')
    } else {
      await axios.post(`${API_URL}/store/service/create`, { ...payload, user_id: userId })
      showNotification('Serviço adicionado com sucesso.', 'success')
    }

    closeModal()
    loadServices()
  } catch (err) {
    showNotification('Erro ao salvar serviço.', 'error')
  }
}

const openDeleteModal = (service: Service) => {
  serviceToDelete.value = service
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  serviceToDelete.value = null
}

const confirmDelete = async () => {
  if (!serviceToDelete.value) return

  try {
    await axios.delete(`${API_URL}/store/service/delete/${serviceToDelete.value.id}`)
    closeDeleteModal()
    showNotification('Serviço removido com sucesso.', 'success')
    loadServices()
  } catch (err) {
    showNotification('Erro ao remover serviço.', 'error')
  }
}

const closeModal = () => {
  modalOpen.value = false
  editingService.value = null
}

onMounted(loadServices)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.services-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
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
}

.title h1 {
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.total-count {
  color: #0ea5e9;
  font-weight: 700;
  font-size: 1.15rem;
  margin: 8px 0 0;
}

.btn-add {
  padding: 14px 32px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(16,185,129,.3);
  transition: all .3s;
}

.btn-add:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(16,185,129,.4);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  margin-bottom: 32px;
}

.search-bar input {
  width: 100%;
  padding: 18px 24px;
  border: 3px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  font-size: 1.1rem;
  box-shadow: 0 8px 30px rgba(0,0,0,.06);
  transition: all .3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 8px rgba(14,165,233,.15);
}

.empty {
  text-align: center;
  padding: 100px 20px;
  color: #94a3b8;
}

.empty i {
  font-size: 4.5rem;
  color: #cbd5e1;
  margin-bottom: 20px;
}

.empty h3 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 12px;
}

.empty p {
  font-size: 1.15rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-item {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,.08);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  transition: all .3s;
}

.service-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(14,165,233,.15);
}

.main-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.details h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 900;
  color: #1e293b;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 1rem;
  color: #475569;
  font-weight: 600;
}

.meta i {
  color: #0ea5e9;
  margin-right: 8px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.actions button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all .3s;
}

.edit {
  background: #ecfdf5;
  color: #10b981;
}

.delete {
  background: #fee2e2;
  color: #ef4444;
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
  border-radius: 32px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 30px 80px rgba(0,0,0,.4);
}

.modal-card h3 {
  margin: 0 0 24px;
  font-size: 1.9rem;
  font-weight: 900;
  color: #1e293b;
  text-align: center;
}

.modal-card input {
  width: 100%;
  padding: 16px 18px;
  margin-bottom: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.05rem;
  transition: all .3s;
}

.modal-card input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14,165,233,.12);
}

.row {
  display: flex;
  gap: 16px;
}

.row input {
  flex: 1;
}

.warning-icon {
  font-size: 4rem;
  color: #dc2626;
  margin-bottom: 16px;
}

.delete-modal p {
  color: #475569;
  margin: 12px 0;
}

.delete-modal strong {
  display: block;
  font-size: 1.4rem;
  color: #1e293b;
  margin: 16px 0;
}

.info {
  font-size: .95rem;
  color: #94a3b8;
  margin: 20px 0 28px;
}

.modal-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  font-size: 1.05rem;
}

.cancel {
  background: #e2e8f0;
  color: #475569;
}

.save,
.delete-confirm {
  background: #ef4444;
  color: white;
}

.save {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 18px 32px;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 20px 50px rgba(0,0,0,.3);
}

.notification.success {
  background: #10b981;
}

.notification.error {
  background: #ef4444;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  .btn-add {
    width: 100%;
    padding: 16px;
  }
  .service-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  .main-info {
    width: 100%;
  }
  .actions {
    width: 100%;
    justify-content: flex-end;
  }
  .row {
    flex-direction: column;
  }
}
</style>