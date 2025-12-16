<template>
  <NavbarComponent />

  <div class="auth-wrapper">
    <div class="container">
      <div class="auth-box">
        <div class="auth-tabs">
          <button @click="isLogin = true" :class="{ active: isLogin }" class="tab">Entrar</button>
          <button @click="isLogin = false" :class="{ active: !isLogin }" class="tab">Criar Conta</button>
        </div>

        <form @submit.prevent="submitFormLogin" class="auth-form" v-if="isLogin">
          <div class="input-group">
            <input type="text" v-model="form.user" required placeholder="E-mail ou telefone" class="auth-input" />
          </div>

          <div class="input-group">
            <input :type="showPass ? 'text' : 'password'" v-model="form.password" required placeholder="Palavra-passe" class="auth-input" />
            <button type="button" @click="showPass = !showPass" class="toggle-eye">
              <i :class="showPass ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="form.remember" /> Lembrar-me
            </label>
            <router-link to="/recuperar" class="forgot-password">Esqueceu a senha?</router-link>
          </div>

          <button type="submit" class="btn-auth-primary" :disabled="loading">
            <i v-show="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <form @submit.prevent="submitFormSignup" class="auth-form" v-if="!isLogin">
          <div class="input-group">
            <input type="text" v-model="form.name" required placeholder="Seu Nome *" class="auth-input" />
          </div>

          <div class="input-group">
            <input type="email" v-model="form.email" required placeholder="Email *" class="auth-input" />
          </div>

          <div class="input-group">
            <input :type="showPass ? 'text' : 'password'" v-model="form.password" required minlength="6" placeholder="Palavra-passe (mín. 8 caracteres) *" class="auth-input" />
            <button type="button" @click="showPass = !showPass" class="toggle-eye">
              <i :class="showPass ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>

          <button type="submit" class="btn-auth-primary" :disabled="loading">
            <i v-show="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'A criar conta...' : 'Criar conta grátis' }}
          </button>
        </form>

        <div class="divider"><span>ou continua com</span></div>

        <button @click="googleLogin" class="btn-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 6.5c1.61 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 8.41 9.14 6.5 12 6.5z" />
          </svg>
          Continuar com Google
        </button>
      </div>
    </div>
  </div>

  <div v-if="notification.message" class="notification" :class="notification.type">
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Cookies from 'js-cookie'
import axios from 'axios'
import NavbarComponent from '@/components/NavbarComponent.vue'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tuadominio.pt/api/v1'
const router = useRouter()
const route = useRoute()

const isLogin = ref(true)
const showPass = ref(false)
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirm: '',
  user: '',
  remember: false
})

const notification = ref({ message: '', type: 'success' as 'success' | 'error' })

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const showNotification = (msg: string, type: 'success' | 'error') => {
  notification.value = { message: msg, type }
  setTimeout(() => notification.value.message = '', 5000)
}

const submitFormLogin = async () => {
  loading.value = true

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: form.value.user,
        password: form.value.password,
        remember: form.value.remember
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao autenticar. Tente novamente.');
    }

    Cookies.set('token', data.data.data.token, { expires: form.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify(data.data.data.id), { expires: form.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.data.access_token}`;

    // if (data.data.data.type == '3') {
      router.push({ name: 'app.user.homepage' }).catch(() => { });
    // } else {
    //   router.push({ name: 'app.store.configuration' }).catch(() => { });
    // }
  } catch (error: any) {
    showNotification(error.response?.data?.message || 'Erro ao efetuar login.', 'error')
  } finally {
    loading.value = false
  }
}

const submitFormSignup = async () => {
  if (!validateEmail(form.value.email)) {
    showNotification('Por favor, insira um email válido.', 'error')
    return
  }
  if (form.value.password.length < 6) {
    showNotification('A palavra-passe deve ter pelo menos 6 caracteres.', 'error')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao cadastrar. Tente novamente.');
    }

    Cookies.set('token', data.access_token, { expires: form.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    Cookies.set('user', JSON.stringify(data.user.id), { expires: form.value.remember ? 7 : undefined, secure: true, sameSite: 'Strict' });
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

    router.push({ name: 'app.user.homepage' }).catch(() => { });
  } catch (error: any) {
    showNotification(error.message || 'Erro ao criar conta.', 'error')
  } finally {
    loading.value = false
  }
}

const googleLogin = () => {
  window.location.href = `${API_URL}/auth/redirect/google`
}

onMounted(() => {
  const token = route.query.token as string
  const id = route.query.user_id || route.query.id
  if (token && id) {
    Cookies.set('token', token, { expires: 90, secure: true, sameSite: 'Strict' })
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    history.replaceState({}, '', '/')
    showNotification('Login com Google concluído!', 'success')
    setTimeout(() => router.push('/dashboard'), 1000)
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: 80px 20px 40px;
  display: flex;
  margin-top: 35px;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.auth-box {
  background: white;
  border-radius: 28px;
  padding: 44px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .25);
}

.auth-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 16px;
  margin-bottom: 28px;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  font-weight: 700;
  font-size: 1.1rem;
  color: #64748b;
  cursor: pointer;
  transition: .25s;
}

.tab.active {
  background: #0ea5e9;
  color: white;
}

.input-group {
  position: relative;
  margin-bottom: 18px;
}

.auth-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.05rem;
  transition: .25s;
}

.auth-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 5px rgba(14,165,233,.12);
}

.toggle-eye {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px 0;
  font-size: .95rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #475569;
}

.forgot-password {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-auth-primary {
  width: 100%;
  padding: 18px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
  transition: .25s;
  margin-top: 10px;
}

.btn-auth-primary:hover:not(:disabled) {
  background: #0284c7;
  transform: translateY(-2px);
}

.btn-auth-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 28px 0;
  position: relative;
  color: #94a3b8;
  font-weight: 600;
  font-size: .95rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  background: white;
  padding: 0 20px;
}

.btn-google {
  width: 100%;
  padding: 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: .25s;
}

.btn-google:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.notification {
  position: fixed;
  top: 90px;
  right: 20px;
  padding: 14px 24px;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 15px 40px rgba(0,0,0,.25);
}

.notification.success {
  background: #10b981;
}

.notification.error {
  background: #ef4444;
}

@media (max-width: 480px) {
  .auth-wrapper {
    padding: 60px 16px 40px;
  }

  .auth-box {
    padding: 36px 24px;
    border-radius: 24px;
  }

  .tab {
    padding: 12px;
    font-size: 1rem;
  }

  .auth-input {
    padding: 14px 18px;
    font-size: 1rem;
  }
}
</style>