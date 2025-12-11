<template>
  <NavbarComponent />

  <div class="profile-edit">
    <div class="container">
      <header class="page-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
      </header>

      <div class="grid">
        <main class="main-content">
          <section class="section">
            <h2>Informações Pessoais</h2>

            <form @submit.prevent="saveProfile">
              <div class="form-grid">
                <div class="input-group">
                  <label>Nome completo</label>
                  <input v-model="user.name" placeholder="Seu nome completo" />
                </div>
                <div class="input-group">
                  <label>E-mail *</label>
                  <input v-model="user.email" type="email" placeholder="seu@email.com" />
                </div>

                <div class="input-group">
                  <label>Telefone *</label>
                  <div class="phone-group w-full">
                    <div class="country-select">
                      <img :src="selectedCountry.flag" alt="" class="flag">
                      <select v-model="selectedCountry.code">
                        <option v-for="c in countries" :key="c.code" :value="c.code">
                          {{ c.code }} {{ c.name }}
                        </option>
                      </select>
                    </div>
                    <input v-model="phoneNumber" type="text" placeholder="912 345 678" @input="onlyNumbers" />
                  </div>
                </div>

                <div class="input-group">
                  <label>Cidade</label>
                  <input v-model="user.address" placeholder="Ex: Lisboa, Porto..." />
                </div>
              </div>
              <button class="btn-primary" type="submit" :disabled="loading">
                {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </form>
          </section>

          <section class="section">
            <h2>Segurança</h2>
            <button class="btn-outline" @click="openPasswordModal">Alterar senha</button>
          </section>

          <section class="section danger-zone">
            <h2>Excluir Conta</h2>
            <p>Após excluir, não será possível recuperar seus dados.</p>
            <button class="btn-danger" @click="showDeleteConfirm = true">
              Excluir minha conta
            </button>
          </section>
        </main>

        <aside class="sidebar">
          <div class="preview-card">
            <h3>Pré-visualização</h3>
            <div class="preview-user">
              <img :src="userAvatar" :alt="`Avatar de ${user.name}`" class="preview-avatar" />
              <div class="preview-info">
                <strong>{{ user.name || 'Seu Nome' }}</strong>
                <small>{{ user.address || 'Sua cidade' }}</small>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
          <div class="modal-password" @click.stop>
            <button class="close-btn" @click="closePasswordModal">
              <i class="fas fa-times"></i>
            </button>
            <h2>Alterar Senha</h2>
            <div class="modal-form">
              <div class="input-group">
                <label>Senha atual</label>
                <input v-model="pass.current" type="password" placeholder="••••••••" />
              </div>
              <div class="input-group">
                <label>Nova senha</label>
                <input v-model="pass.new" type="password" placeholder="••••••••" />
              </div>
              <div class="input-group">
                <label>Confirmar nova senha</label>
                <input v-model="pass.confirm" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closePasswordModal">Cancelar</button>
              <button class="btn-primary" @click="savePassword">Atualizar Senha</button>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
          <div class="modal-delete" @click.stop>
            <button class="close-btn" @click="showDeleteConfirm = false">
              <i class="fas fa-times"></i>
            </button>
            <div class="delete-icon">
              <i class="fas fa-trash-alt"></i>
            </div>
            <h2>Tem certeza?</h2>
            <p>Esta ação é <strong>irreversível</strong>. Todos os seus dados serão apagados permanentemente.</p>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showDeleteConfirm = false">Cancelar</button>
              <button class="btn-delete" @click="deleteAccount">Sim, excluir conta</button>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>


  <div v-if="notification.message" class="notification" :class="notification.type">
    {{ notification.message }}
  </div>


</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

const placeholder = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop&crop=center'

const router = useRouter()
const route = useRoute()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

interface User {
  id?: string
  name: string
  email: string
  phone: string
  about: string
  address?: string
  provider?: string
  createdAt?: string
  photo?: string
}

let user: User;
if (typeof route.params.user === 'string') {
  user = { id: route.params.user, name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else if (Array.isArray(route.params.user)) {
  user = { id: route.params.user[0], name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
} else {
  user = route.params.user || { id: '', name: '', phone: '', email: '', about: '', createdAt: '', provider: '', photo: '', address: '', type: '' };
}

const loading = ref(false)
const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}





const showPasswordModal = ref(false)
const showDeleteConfirm = ref(false)
const pass = reactive({ current: '', new: '', confirm: '' })

const phoneNumber = ref('')
const selectedCountry = ref({ code: '+351', flag: 'https://flagcdn.com/32x24/pt.png' })

const countries = [
  { code: '+351', flag: 'https://flagcdn.com/32x24/pt.png', name: 'Portugal' },
  { code: '+244', flag: 'https://flagcdn.com/32x24/ao.png', name: 'Angola' },
  { code: '+238', flag: 'https://flagcdn.com/32x24/cv.png', name: 'Cabo Verde' },
  { code: '+245', flag: 'https://flagcdn.com/32x24/gw.png', name: 'Guiné-Bissau' },
  { code: '+258', flag: 'https://flagcdn.com/32x24/mz.png', name: 'Moçambique' },
  { code: '+670', flag: 'https://flagcdn.com/32x24/tl.png', name: 'Timor-Leste' },
  { code: '+55', flag: 'https://flagcdn.com/32x24/br.png', name: 'Brasil' },
  { code: '+34', flag: 'https://flagcdn.com/32x24/es.png', name: 'Espanha' },
  { code: '+33', flag: 'https://flagcdn.com/32x24/fr.png', name: 'França' },
  { code: '+44', flag: 'https://flagcdn.com/32x24/gb.png', name: 'Reino Unido' },
  { code: '+1', flag: 'https://flagcdn.com/32x24/us.png', name: 'EUA/Canadá' },
  { code: '+49', flag: 'https://flagcdn.com/32x24/de.png', name: 'Alemanha' },
  { code: '+39', flag: 'https://flagcdn.com/32x24/it.png', name: 'Itália' }
]

watch(() => selectedCountry.value.code, (code) => {
  const country = countries.find(c => c.code === code)
  if (country) selectedCountry.value.flag = country.flag
})


const parts = user.phone ? user.phone.split(' ') : []
if (parts.length > 1) {
  selectedCountry.value.code = parts[0]
  phoneNumber.value = parts.slice(1).join(' ')
}

const onlyNumbers = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, '')
}

const userAvatar = computed(() =>
  'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0ea5e9&color=fff&size=128&rounded=true'
)



const saveProfile = async () => {

  loading.value = true

  if (!validateEmail(user.email)) {
    showNotification('Por favor, insira um email válido.', 'error')
    loading.value = false
    return
  }

  if (!user.name) {
    showNotification('O estabelecimento precisa de nome.', 'error')
    loading.value = false
    return
  }
  if (!phoneNumber.value) {
    showNotification('É importante colocar telefone.', 'error')
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${API_URL}/user/update/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        phone: selectedCountry.value.code + ' ' + phoneNumber.value,
        address: user.address
      })
    })
    const data = await res.json()

    showNotification('Perfil atualizado com sucesso!', 'success')

    loading.value = false
  } catch (err) {
    loading.value = false
    showNotification('Erro ao atualizar perfil. Tente novamente.', 'error')
  } finally {
    loading.value = false
  }
}

const openPasswordModal = () => showPasswordModal.value = true
const closePasswordModal = () => {
  showPasswordModal.value = false
  pass.current = pass.new = pass.confirm = ''
}
const savePassword = () => {
  if (pass.new && pass.new === pass.confirm && pass.new.length >= 6) {
    alert('Senha alterada com sucesso!')
    closePasswordModal()
  } else {
    alert('Verifique os campos e tente novamente')
  }
}
const deleteAccount = async () => {

  try {
    const res = await fetch(`${API_URL}/user/delete/${user.id}`, {
      method: 'DELETE'
    })
    const data = await res.json()

    showNotification('Conta excluída com sucesso!', 'success')

    router.push({ name: 'app.home' })
  } catch (err) {
    showDeleteConfirm.value = false
    showNotification('Erro ao excluir conta. Tente novamente.', 'error')
  } finally {

    showDeleteConfirm.value = false
  }

}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.profile-edit {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  padding: 100px 0 140px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 56px;
}

.page-header h1 {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b 0%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px;
}

.page-header p {
  font-size: 1.2rem;
  color: #64748b;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 48px;
  align-items: start;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: white;
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, .08);
  border: 1px solid #e2e8f0;
}

h2 {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 32px;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #475569;
  font-size: 1.05rem;
}

.input-group input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  background: #fdfdfd;
  font-size: 1.05rem;
  transition: all .3s;
}

.input-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, .12);
}

.phone-group {
  display: flex;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  transition: all .3s;
}

.phone-group:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, .12);
}

.country-select {
  position: relative;
  width: 140px;
  background: #f8fafc;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.country-select select {
  appearance: none;
  width: 100%;
  padding: 18px 32px 18px 44px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, .2);
}

.phone-group input {
  flex: 1;
  padding: 18px 20px;
  border: none;
  background: transparent;
  font-size: 1.1rem;
}

.phone-group input:focus {
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 18px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .3s;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-3px);
}

.btn-outline {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2.5px solid #0ea5e9;
  color: #0ea5e9;
  border-radius: 18px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all .3s;
}

.btn-outline:hover {
  background: #0ea5e9;
  color: white;
}

.danger-zone {
  border: 2px solid #fca5a5;
  background: #fef2f2;
}

.danger-zone h2 {
  color: #dc2626;
}

.danger-zone p {
  color: #991b1b;
  margin: 16px 0 28px;
  line-height: 1.6;
  font-size: 1rem;
}

.btn-danger {
  background: #dc2626;
  color: white;
  padding: 16px 36px;
  border: none;
  border-radius: 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-danger:hover {
  background: #b91c1c;
}

.sidebar {
  position: sticky;
  top: 100px;
}

.preview-card {
  background: white;
  border-radius: 28px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, .08);
  border: 1px solid #e2e8f0;
}

.preview-card h3 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 32px;
}

.preview-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 12px 32px rgba(0, 0, 0, .15);
}

.preview-info strong {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  display: block;
}

.preview-info small {
  color: #64748b;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.modal-password,
.modal-delete {
  background: white;
  border-radius: 28px;
  width: 100%;
  max-width: 500px;
  padding: 48px;
  position: relative;
  box-shadow: 0 30px 90px rgba(0, 0, 0, .4);
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  font-size: 1.6rem;
  color: #64748b;
  cursor: pointer;
  transition: .2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-password h2,
.modal-delete h2 {
  font-size: 2rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0 0 40px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.modal-form .input-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #475569;
}

.modal-form input {
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  background: #fdfdfd;
  font-size: 1.05rem;
  transition: .3s;
}

.modal-form input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, .12);
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
  padding: 16px;
  border: none;
  border-radius: 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary,
.btn-delete {
  background: #10b981;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 18px;
  font-weight: 800;
  cursor: pointer;
}

.btn-delete {
  background: #dc2626;
}

.delete-icon {
  width: 90px;
  height: 90px;
  background: #fee2e2;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: #dc2626;
}

.modal-delete p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 32px;
}

.modal-delete p strong {
  color: #dc2626;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .sidebar {
    order: -1;
    position: static;
  }
}

@media (max-width: 640px) {
  .profile-edit {
    padding: 80px 0 100px;
  }

  .container {
    padding: 0 20px;
  }

  .page-header h1 {
    font-size: 2.4rem;
  }

  .section {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-password,
  .modal-delete {
    padding: 40px 24px;
    border-radius: 24px;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }
}
</style>