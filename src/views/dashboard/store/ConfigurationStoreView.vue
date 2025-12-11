<template>
  <NavbarComponent />

  <div class="container config-page">
    <div class="header">
      <h1>Configuração da Loja</h1>
    </div>

    <div class="grid">
      <main class="main-content">
        <div class="card">
          <h2>Informações Básicas</h2>
          <form @submit.prevent="submitBasicInformation" class="form">
            <div class="form-grid">
              <div class="input-group">
                <label>Nome da Loja *</label>
                <input v-model="store.name" type="text" placeholder="Nome *" />
              </div>
              <div class="input-group">
                <label>Categoria *</label>
                <select v-model="store.category">
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
              </div>
              <div class="input-group full">
                <label>Descrição *</label>
                <textarea v-model="store.description" rows="3" placeholder="Escreva alguma coisa..."></textarea>
              </div>

              <div class="input-group">
                <label>Telefone (WhatsApp) *</label>
                <div class="phone-group w-full">
                  <div class="country-select ">
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
                  </div>
                  <input v-model="phoneNumber" type="text" placeholder="912 345 678" @input="onlyNumbers" />
                </div>
              </div>

              <div class="input-group">
                <label>E-mail *</label>
                <input v-model="store.email" type="email" placeholder="E-mail *" />
              </div>
              <div class="input-group">
                <label>Instagram (opcional)</label>
                <input v-model="store.instagram" type="url" placeholder="https://..." />
              </div>
              <div class="input-group">
                <label>Link do Perfil da Loja</label>
                <div class="profile-link w-full">
                  <input type="text" :value="profileLink" readonly @focus="$event.target.select()" />
                  <button type="button" @click="copyToClipboard" class="copy-button">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="input-group full">
                <label>Endereço Completo *</label>
                <input v-model="store.address" type="text" placeholder="Vila Franca, Alverca, Lisba..." />
              </div>
            </div>

            <button type="submit" class="btn-save-section bottom" :disabled="loading || !isPhoneValid">
              <i v-show="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? 'A processar...' : 'Salvar Informações' }}
            </button>
          </form>
        </div>

        <div class="card">
          <h2>Horário de Funcionamento</h2>
          <form @submit.prevent="submitHours">
            <div class="hours-list">
              <div v-for="day in store.hours" :key="day.day" class="hour-item">
                <div class="day-header">
                  <span class="day-name">{{ day.day }}</span>
                  <label class="switch">
                    <input type="checkbox" v-model="day.active" :checked="day.active" />
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="time-wrapper" v-if="day.active">
                  <input type="time" v-model="day.start_time" required />
                  <span>às</span>
                  <input type="time" v-model="day.end_time" required />
                </div>
                <div class="closed" v-else>Fechado</div>
              </div>
            </div>

            <button type="submit" class="btn-save-section bottom" :disabled="loading">
              <i v-show="loading" class="fas fa-spinner fa-spin"></i>
              {{ loading ? 'A processar...' : 'Salvar Horário' }}
            </button>
          </form>
        </div>

        <div class="card">
          <h2>Galeria de Fotos</h2>
          <p style="color: gray; font-style: italic;">Em breve: Adicione fotos da sua loja para atrair mais clientes!</p>
        </div>
      </main>

      <aside class="sidebar">
        <div class="card preview-card">
          <h2>Pré-visualização</h2>
          <div class="preview">
            <div class="cover" :style="{ backgroundImage: `url(${store.cover_image || placeholder})` }"></div>
            <div class="logo-box">
              <img :src="store.profile_image || placeholderLogo" />
            </div>
            <div class="info">
              <h3>{{ store.name || 'Nome da Loja' }}</h3>
              <p class="category">{{ store.category || 'Categoria' }}</p>
              <p class="address">{{ store.address || 'Endereço' }}</p>
              <div class="status" :class="{ open: store.openNow }">{{ store.openNow ? 'Aberto' : 'Fechado' }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2>Imagens da Loja</h2>
          <div class="upload-grid">
            <div class="upload-box">
              <label>
                <span>Capa da Loja</span>
                <input type="file" accept="image/*" @change="uploadCover" />
                <img v-if="coverPreview" :src="coverPreview" />
                <div v-else class="placeholder">Clique para alterar capa</div>
              </label>
            </div>

            <div class="upload-box logo">
              <label>
                <span>Logo</span>
                <input type="file" accept="image/*" @change="uploadLogo" />
                <img v-if="logoPreview" :src="logoPreview" />
                <div v-else class="placeholder">Clique para alterar logo</div>
              </label>
            </div>
          </div>

          <button @click="saveImages" class="btn-save-section bottom" :disabled="uploadingImages">
            <i v-show="uploadingImages" class="fas fa-spinner fa-spin"></i>
            {{ uploadingImages ? 'Enviando...' : 'Salvar Capa e Logo' }}
          </button>
        </div>

        <!-- Sidebar of the bottons  -->
        
      </aside>
    </div>
  </div>

  <div v-if="notification.message" class="notification" :class="notification.type">
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavbarComponent from '@/components/NavbarComponent.vue'

var store: any = reactive({
  name: '',
  category: '',
  slogan: '',
  description: '',
  phone: '',
  store_id: '',
  slug: '',
  email: '',
  instagram: '',
  address: '',
  cover_image: '',
  profile_image: '',
  gallery: [],
  openNow: true,
  hours: [
    { day: 'Segunda', active: true, start_time: '10:00', end_time: '20:00' },
    { day: 'Terça', active: true, start_time: '10:00', end_time: '20:00' },
    { day: 'Quarta', active: true, start_time: '10:00', end_time: '20:00' },
    { day: 'Quinta', active: true, start_time: '10:00', end_time: '21:00' },
    { day: 'Sexta', active: true, start_time: '10:00', end_time: '21:00' },
    { day: 'Sábado', active: true, start_time: '09:00', end_time: '18:00' },
    { day: 'Domingo', active: false, start_time: '', end_time: '' }
  ],
  services: [
    { id: '', name: '', description: '', duration_minutes: '', price: '', active: true}
  ]
})

const route = useRoute()
const router = useRouter()
const API_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.cirimoveis.com/api/v1'

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

const loading = ref(false)
const countryCode = ref('+351')
const phoneNumber = ref('')

const fullPhone = computed(() => countryCode.value + ' ' + phoneNumber.value.replace(/\D/g, ''))

const selectedFlag = computed(() => {
  const opt = document.querySelector(`option[value="${countryCode.value}"]`) as HTMLOptionElement
  return opt?.dataset.flag || 'https://flagcdn.com/32x24/pt.png'
})

const placeholder = 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600'
const placeholderLogo = 'https://images.unsplash.com/photo-1631118909886-9adf17d5fb3e?w=400'

const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}

const profileLink = computed(() => store.slug ? `https://anoota.com/${store.slug}` : '')

const copyToClipboard = async () => {
  if (!profileLink.value) return
  try {
    await navigator.clipboard.writeText(profileLink.value)
    showNotification('Link copiado com sucesso!', 'success')
  } catch (err) {
    showNotification('Erro ao copiar o link.', 'error')
  }
}

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const onlyNumbers = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, '')
}

const isPhoneValid = computed(() => phoneNumber.value.replace(/\D/g, '').length >= 9)

const submitBasicInformation = async () => {
  loading.value = true

  if (!validateEmail(store.email)) {
    showNotification('Por favor, insira um email válido.', 'error')
    loading.value = false
    return
  }
  if (!store.address) {
    showNotification('Endereço é obrigatório.', 'error')
    loading.value = false
    return
  }
  if (!store.name) {
    showNotification('O estabelecimento precisa de nome.', 'error')
    loading.value = false
    return
  }
  if (!store.description) {
    showNotification('É importante colocar descrição.', 'error')
    loading.value = false
    return
  }
  if (!isPhoneValid.value) {
    showNotification('Telefone precisa de pelo menos 9 dígitos.', 'error')
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${API_URL}/store/update/information/${store.store_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: store.name,
        phone: fullPhone.value,
        category: store.category,
        description: store.description,
        email: store.email,
        address: store.address,
        instagram: store.instagram
      })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Erro na requisição')

    showNotification('Informações actualizadas com sucesso.', 'success')
  } catch (err: any) {
    showNotification('Ocorreu um erro. Tenta novamente.', 'error')
  } finally {
    loading.value = false
  }
}

const coverPreview = ref<string>('')
const logoPreview = ref<string>('')
const uploadingImages = ref(false)

const coverFile = ref<File | null>(null)
const logoFile = ref<File | null>(null)

const uploadCover = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

const uploadLogo = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    logoFile.value = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

const saveImages = async () => {
  if (!coverFile.value && !logoFile.value) {
    showNotification('Selecione pelo menos uma imagem.', 'error')
    return
  }

  uploadingImages.value = true

  const formData = new FormData()
  if (coverFile.value) formData.append('cover_image', coverFile.value)
  if (logoFile.value) formData.append('profile_image', logoFile.value)

  try {
    const res = await fetch(`${API_URL}/store/update/images/${store.store_id}`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Erro ao enviar imagens')

    if (data.store.cover_image) {
      store.cover_image = data.store.cover_image
      coverPreview.value = store.cover_image
    }
    if (data.store.profile_image) {
      store.profile_image = data.store.profile_image
      logoPreview.value = store.profile_image
    }

    showNotification('Capa e logo atualizadas com sucesso!', 'success')

    coverFile.value = null
    logoFile.value = null

  } catch (err: any) {
    showNotification(err.message || 'Erro ao salvar imagens', 'error')
  } finally {
    uploadingImages.value = false
  }
}

const submitHours = async () => {
  loading.value = true

  const hoursPayload = store.hours.map((day: any) => ({
    day: day.day,
    active: day.active ? 1 : 0,
    start_time: day.active ? day.start_time : null,
    end_time: day.active ? day.end_time : null
  }))

  try {
    const res = await fetch(`${API_URL}/store/update/hours/${store.store_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workSchedules: hoursPayload
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Erro ao salvar horário')
    }

    showNotification('Horário atualizado com sucesso!', 'success')
  } catch (err) {
    showNotification('Erro ao salvar horário. Tenta novamente.', 'error')
  } finally {
    loading.value = false
  }
}

const fetchStore = async () => {
  try {
    const res = await fetch(`${API_URL}/store/my/${user.id}`)
    const data = await res.json()
    if (res.ok && data.store) {
      Object.assign(store, data.store)
      if (!store.gallery) store.gallery = []
      if (!store.services) store.services = []

      store.hours = data.workSchedules;
      store.services = data.services;
    
      if (store.phone) {
        const match = store.phone.match(/^([^ ]+)\s+(.*)$/)
        if (match) {
          countryCode.value = match[1]
          phoneNumber.value = match[2]
        }
      }
    } else {
      router.push({ name: 'app.user.homepage' }).catch(() => { });
    }
  } catch (err) {
      router.push({ name: 'app.user.homepage' }).catch(() => { });
  }
}

onMounted(() => {
  fetchStore()

  if (user.type != '1') {
    if (user.type != '2') {
      router.push({ name: 'app.user.homepage' }).catch(() => { })
    }
  }
})

const saveSection = async (section: string) => {
  const payload: any = { [section]: store[section] }
  if (section === 'info') payload.phone = fullPhone.value

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.cirimoveis.com/api/v1'}/store/update/10`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) alert('Seção salva com sucesso!')
  } catch (err) {
    console.error('Erro ao salvar:', err)
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box }
.container { max-width: 1400px; margin: 0 auto; padding: 0 24px }
.config-page { margin-top: 80px; padding: 40px 0 }
.header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 40px }
h1 { font-size: 2.3rem; font-weight: 900; color: #1e293b; margin: 0 }
.btn-save-all, .btn-save-section { background: #10b981; color: #fff; padding: 14px 32px; border: none; border-radius: 14px; font-weight: 800; cursor: pointer; transition: .3s; box-shadow: 0 6px 20px rgba(16,185,129,.3) }
.btn-save-all:hover, .btn-save-section:hover { background: #059669; transform: translateY(-2px) }
.btn-save-section.bottom { margin-top: 32px; width: 100%; padding: 16px; font-size: 1.1rem }

.grid { display: grid; grid-template-columns: 1fr 440px; gap: 40px }
.main-content { gap: 32px; display: flex; flex-direction: column }
.card { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 8px 32px rgba(0,0,0,.08); border: 1px solid #e2e8f0; overflow: hidden }
h2 { font-size: 1.7rem; font-weight: 800; color: #1e293b; margin: 0 0 24px }

.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px }
.input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #475569 }
.input-group input, .input-group select, .input-group textarea { width: 100%; padding: 14px 16px; border: 2px solid #e2e8f0; border-radius: 12px; background: #fdfdfd; font-size: 1rem; transition: .3s }
.input-group input:focus, .input-group select:focus, .input-group textarea:focus { outline: none; border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 4px rgba(14,165,233,.15) }
.full { grid-column: 1/-1 }

.phone-group { display: flex; border: 2px solid #e2e8f0; border-radius: 20px; overflow: hidden; background: #fff; transition: all .3s }
.phone-group:focus-within { border-color: #0ea5e9; box-shadow: 0 0 0 6px rgba(14,165,233,.12) }
.country-select { position: relative; width: 130px; background: #f8fafc; flex-shrink: 0 }
.country-select select { appearance: none; width: 100%; padding: 19px 36px 19px 52px; border: none; background: transparent; font-size: 1.1rem; font-weight: 600; color: #1e293b; cursor: pointer }
.flag { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 24px; height: 18px; border-radius: 4px; pointer-events: none; box-shadow: 0 1px 4px rgba(0,0,0,.2) }
.country-select i { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none }
.phone-group input { flex: 1; padding: 19px 22px; border: none; background: transparent; font-size: 1.1rem }
.phone-group input:focus { outline: none }

.profile-link {
  display: flex;
  position: relative;
}

.profile-link input {
  padding-right: 50px;
}

.copy-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #0ea5e9;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: .3s;
}

.copy-button:hover {
  background: #0284c7;
}

.hours-list { gap: 14px; display: flex; flex-direction: column }
.hour-item { background: #f8fafc; border-radius: 16px; padding: 20px }
.day-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px }
.day-name { font-weight: 700; font-size: 1.1rem; color: #1e293b }
.switch { position: relative; width: 56px; height: 32px }
.switch input { opacity: 0; width: 0; height: 0 }
.slider { position: absolute; inset: 0; background: #cbd5e1; border-radius: 34px; transition: .3s; cursor: pointer }
.slider:before { position: absolute; content: ""; width: 26px; height: 26px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s }
input:checked + .slider { background: #0ea5e9 }
input:checked + .slider:before { transform: translateX(24px) }
.time-wrapper { display: flex; align-items: center; gap: 10px; flex-wrap: wrap }
.time-wrapper input { width: 110px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px }
.closed { color: #94a3b8; font-style: italic; text-align: center; padding: 8px 0 }

.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; margin-bottom: 20px }
.gallery-item { position: relative; border-radius: 16px; overflow: hidden }
.gallery-item img { width: 100%; height: 130px; object-fit: cover }
.remove { position: absolute; top: 8px; right: 8px; background: rgba(239,68,68,.9); color: #fff; width: 34px; height: 34px; border-radius: 50%; border: none; font-size: 1.5rem; cursor: pointer }
.upload-area { background: #f0f9ff; border: 2px dashed #0ea5e9; border-radius: 16px; height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: #0ea5e9; font-weight: 600; position: relative }
.upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer }

.sidebar { gap: 32px; display: flex; flex-direction: column; position: sticky; top: 100px; height: fit-content }
.preview-card .preview { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,.25) }
.cover { height: 220px; background: center/cover no-repeat }
.logo-box { position: absolute; top: 155px; left: 30px; width: 115px; height: 115px; border-radius: 50%; overflow: hidden; border: 6px solid #fff; box-shadow: 0 12px 30px rgba(0,0,0,.4) }
.logo-box img { width: 100%; height: 100%; object-fit: cover }
.info { padding: 75px 24px 24px; background: #fff }
.info h3 { font-size: 1.75rem; font-weight: 900; margin: 0 0 6px }
.info p { margin: 4px 0; font-size: .95rem; color: #475569 }
.status { margin-top: 12px; padding: 8px 18px; border-radius: 50px; font-weight: 700; font-size: .9rem; display: inline-block }
.status.open { background: #ecfdf5; color: #10b981 }
.status:not(.open) { background: #fef2f2; color: #ef4444 }

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
.upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px }
.upload-box label { display: block; cursor: pointer; position: relative; overflow: hidden; border-radius: 16px }
.upload-box input { position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2 }
.upload-box span { display: block; padding: 12px 0; font-weight: 600; color: #475569; text-align: center }
.upload-box img { width: 100%; height: 170px; object-fit: cover }
.upload-box .placeholder { width: 100%; height: 170px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 1rem; padding: 16px }
.logo img, .logo .placeholder { height: 130px; border-radius: 50% }

.btn-add { width: 100%; padding: 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; margin: 20px 0; transition: .3s }
.btn-add:hover { background: #0c8bd1 }
.services-card { overflow: visible }
.services-list { gap: 16px; display: flex; flex-direction: column; margin-bottom: 20px }
.service-item { display: flex; flex-wrap: wrap; gap: 12px; align-items: center }
.service-item input { flex: 1; min-width: 200px; padding: 13px 14px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fdfdfd; font-size: .95rem }
.service-item input.small { flex: 0 0 100px; text-align: center }
.btn-remove { width: 48px; height: 48px; background: #ef4444; color: #fff; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: .2s }
.btn-remove:hover { background: #dc2626 }

@media (max-width:1100px) {
  .grid { grid-template-columns: 1fr }
  .sidebar { order: -1; position: static }
}
@media (max-width:768px) {
  .service-item { flex-direction: column; gap: 8px }
  .service-item input, .service-item input.small { width: 100% }
  .upload-grid { grid-template-columns: 1fr }
  .phone-group { flex-direction: column }
  .country-select { width: 100%; border-bottom: 1px solid #e2e8f0 }
  .country-select select { padding-left: 56px }
}
@media (max-width:480px) {
  .header { flex-direction: column; text-align: center }
  .card { padding: 24px }
}
</style>