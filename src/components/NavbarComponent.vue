<template>
  <header class="header">
    <div class="container top-bar">
      <RouterLink :to="{ name: 'app.home' }" class="logo" aria-label="Página inicial">
        <img src="/logo.png" alt="Anoota" class="logo-img" />
      </RouterLink>

      <div class="header-actions">
        <RouterLink :to="{ name: 'app.home' }" class="action-btn location-btn">
          <i class="fas fa-map-marker-alt"></i>
        </RouterLink>

        <div class="user-menu-wrapper" ref="userMenuWrapper">
          <button v-if="user.name" class="action-btn user-btn" @click.stop="toggleUserMenu">
            <i class="fas fa-user-edit"></i>
          </button>

          <RouterLink v-else :to="{ name: 'app.auth.login' }" class="btn-login">
            Entrar
          </RouterLink>

          <Transition name="fade">
            <div v-if="userMenuOpen" class="user-dropdown">
              <RouterLink :to="{ name: 'app.user.profile' }" class="dropdown-item" @click="closeUserMenu">
                <i class="fas fa-user-edit"></i> Editar Perfil
              </RouterLink>

              <RouterLink v-if="user.type == '2'" :to="{ name: 'app.store.reports' }" class="dropdown-item" @click="closeUserMenu">
                <i class="fas fa-book-reader"></i> Relatórios
              </RouterLink>

              <RouterLink v-if="user.type == '2'" :to="{ name: 'app.user.schedules' }" class="dropdown-item" @click="closeUserMenu">
                <i class="fas fa-users-cog"></i> Administradores
              </RouterLink>

              <div class="dropdown-item disabled">
                <i class="fas fa-trophy"></i> Ranking & Votos
              </div>

              <button class="dropdown-item logout" @click="logout">
                <i class="fas fa-sign-out-alt"></i> Sair
              </button>
            </div>
          </Transition>
        </div>

        <button class="hamburger" :class="{ active: sidebarOpen }" @click="sidebarOpen = !sidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="sidebarOpen = false"></div>

  <aside class="sidebar" :class="{ active: sidebarOpen }">
    <div class="sidebar-header">
      <div class="logo-sidebar">
        <img src="/logo.png" alt="Anoota" class="logo-img" /></div>
      <button class="close-btn" @click="sidebarOpen = false">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <nav class="sidebar-menu">
      <div v-if="!user.name">
        <RouterLink :to="{ name: 'app.home' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-home"></i> Explorar
        </RouterLink>
        <RouterLink :to="{ name: 'app.we' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-users"></i> Quem Somos
        </RouterLink>
        <RouterLink :to="{ name: 'app.contact' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-phone"></i> Fale Connosco
        </RouterLink>
      </div>

      <div v-if="user.name && user.type == '3'">
        <RouterLink :to="{ name: 'app.user.homepage' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-home"></i> Home
        </RouterLink>
        <RouterLink :to="{ name: 'app.home' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-calendar-plus"></i> Explorar Profissionais
        </RouterLink>
        <RouterLink :to="{ name: 'app.user.schedules' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-calendar-day"></i> Minhas Marcações
        </RouterLink>
        <RouterLink :to="{ name: 'app.user.comunication' }" class="menu-item disabled">
          <i class="fas fa-bullhorn"></i> Comunicados
        </RouterLink>
        <RouterLink :to="{ name: 'app.user.foxia' }" class="menu-item disabled">
          <i class="fas fa-robot"></i> Fox AI
        </RouterLink>
      </div>

      <div v-if="user.name && user.type == '2'">
        <RouterLink :to="{ name: 'app.store.configuration' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-store"></i> Configurar Loja
        </RouterLink>
        <RouterLink :to="{ name: 'app.store.calender' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-calendar-day"></i> Marcações
        </RouterLink>
        <RouterLink :to="{ name: 'app.store.services' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-briefcase"></i> Serviços
        </RouterLink>
        <RouterLink :to="{ name: 'app.store.clients' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-users"></i> Clientes
        </RouterLink>
        <RouterLink :to="{ name: 'app.user.schedules' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-book-reader"></i> Marcações Particulares
        </RouterLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <RouterLink v-if="user.name && user.type != '2'" :to="{ name: 'app.user.to.professional' }" class="menu-item premium" @click="sidebarOpen = false">
        <i class="fas fa-crown"></i> Tornar-se Profissional
      </RouterLink>

      <RouterLink :to="{ name: 'app.contact' }" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-headset"></i> Suporte
      </RouterLink>

      <button class="btn-logout" @click="logout" v-if="user.name">
        <i class="fas fa-sign-out-alt"></i> Sair
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const route = useRoute()

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
  type?: string
}

const user = ref<User>({
  id: '',
  name: '',
  email: '',
  phone: '',
  about: '',
  address: '',
  provider: '',
  createdAt: '',
  photo: '',
  type: ''
})

const param = route.params.user
if (typeof param === 'string') {
  user.value.id = param
} else if (Array.isArray(param)) {
  user.value.id = param[0] || ''
} else if (param && typeof param === 'object') {
  Object.assign(user.value, param)
}

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuWrapper = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const logout = () => {
  Cookies.remove('token')
  Cookies.remove('auth')
  Cookies.remove('user')
  user.value = { name: '', type: '' } as User
  sidebarOpen.value = false
  router.push({ name: 'app.home' }).catch(() => {})
}

watch(sidebarOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

const handleClickOutside = (e: MouseEvent) => {
  if (userMenuWrapper.value && !userMenuWrapper.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  box-shadow: 0 4px 25px rgba(0,0,0,.06);
  border-bottom: 1px solid #e2e8f0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  height: 72px;
}

.logo-img {
  height: 46px;
  width: auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f8fafc;
  border: none;
  color: #0ea5e9;
  font-size: 1.38rem;
  cursor: pointer;
  transition: all .3s;
  display: grid;
  place-items: center;
}

.action-btn:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.user-btn {
  font-size: 1.8rem;
}

.btn-login {
  padding: 12px 24px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all .3s;
  box-shadow: 0 6px 20px rgba(14,165,233,.3);
}

.btn-login:hover {
  background: #0c8bd1;
  box-shadow: 0 10px 30px rgba(14,165,233,.4);
}

.user-menu-wrapper {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,.2);
  min-width: 240px;
  overflow: hidden;
  z-index: 1100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  color: #475569;
  font-weight: 600;
  text-decoration: none;
  transition: all .3s;
}

.dropdown-item:hover {
  background: #f0f9ff;
  color: #0ea5e9;
}

.dropdown-item i {
  width: 20px;
  color: #94a3b8;
}

.dropdown-item:hover i {
  color: #0ea5e9;
}

.dropdown-item.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.dropdown-item.logout {
  color: #ef4444;
  border-top: 1px solid #e2e8f0;
}

.dropdown-item.logout:hover {
  background: #fee2e2;
}

.dropdown-item.logout i {
  color: #ef4444;
}

.hamburger {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  transition: all .3s;
  display: grid;
  place-items: center;
}

.hamburger:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.hamburger span {
  width: 24px;
  height: 3px;
  background: #0ea5e9;
  border-radius: 3px;
  transition: all .4s cubic-bezier(.4, 0, .2, 1);
  position: relative;
}

.hamburger span::before,
.hamburger span::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0ea5e9;
  border-radius: 3px;
  transition: all .4s cubic-bezier(.4, 0, .2, 1);
}

.hamburger span::before {
  top: -8px;
}

.hamburger span::after {
  top: 8px;
}

.hamburger.active span {
  background: transparent;
}

.hamburger.active span::before {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active span::after {
  transform: translateY(-8px) rotate(-45deg);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(12px);
  opacity: 0;
  visibility: hidden;
  transition: all .4s ease;
  z-index: 1099;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 380px;
  height: 100vh;
  background: white;
  z-index: 1100;
  transform: translateX(100%);
  transition: transform .5s cubic-bezier(.23,1,.32,1);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 60px rgba(0,0,0,.22);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  padding: 2px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.logo-sidebar {
  font-size: 2.2rem;
  font-weight: 900;
  color: #0ea5e9;
}

.close-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  font-size: 1.7rem;
  color: #64748b;
  cursor: pointer;
  transition: .3s;
  display: grid;
  place-items: center;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.sidebar-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 28px;
  color: #475569;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all .35s;
  text-decoration: none;
}

.menu-item i {
  font-size: 1.4rem;
  width: 32px;
  color: #94a3b8;
  transition: .3s;
}

.menu-item:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  padding-left: 36px;
}

.menu-item:hover i {
  color: #0ea5e9;
}

.menu-item.router-link-active {
  background: linear-gradient(90deg, #f0f9ff 0%, transparent 100%);
  color: #0ea5e9;
  font-weight: 800;
  border-left: 5px solid #0ea5e9;
  padding-left: 23px;
}

.menu-item.router-link-active i {
  color: #0ea5e9;
}

.menu-item.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.menu-item.premium {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 16px 24px;
  border: 2px solid #10b981;
  box-shadow: 0 8px 25px rgba(16,185,129,.15);
}

.menu-item.premium i {
  color: #10b981;
}

.menu-item.premium:hover {
  background: #d1fae5;
  transform: translateY(-2px);
}

.sidebar-footer {
  padding: 20px 28px;
  border-top: 1px solid #e2e8f0;
}

.btn-logout {
  width: 100%;
  padding: 15px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-logout:hover {
  background: #fecaca;
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 480px) {
  .top-bar {
    padding: 12px 16px;
    height: 68px;
  }

  .logo-img {
    height: 42px;
  }

  .header-actions {
    gap: 10px;
  }

  .action-btn,
  .hamburger {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }

  .user-btn {
    font-size: 1.65rem;
  }

  .btn-login {
    padding: 10px 18px;
    font-size: .95rem;
  }

  .sidebar {
    max-width: 100%;
  }

  .menu-item {
    padding: 16px 24px;
    font-size: 1.05rem;
  }

  .menu-item.premium {
    margin: 12px 20px;
    padding: 14px 20px;
    font-size: 1rem;
  }

  .sidebar-footer {
    padding: 18px 24px;
  }

  .btn-logout {
    padding: 14px;
    font-size: .98rem;
  }
}
</style>