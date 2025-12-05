<template>
  <header class="header">
    <div class="container top-bar">

      <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.home' }" class="logo">
        anoota
      </RouterLink>



      <div class="header-actions">
        <button class="location-btn" @click="openLocation">
          <i class="fas fa-star"></i>
        </button>
        <button class="location-btn" @click="openLocation">
          <i class="fas fa-map-marker-alt"></i>
        </button>

        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.user.profile' }" class="btn-login" v-if="user.name">
          <i class="fas fa-user"></i>
        </RouterLink>
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.auth.login' }" class="btn-login " v-else>
          <!-- <i class="fas fa-sign-in-alt"></i> -->
           Entrar
        </RouterLink>

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
      <div class="logo-sidebar">inene</div>
      <button class="close-btn" @click="sidebarOpen = false">
        <i class="fas fa-times"></i>
      </button>
    </div>



    <nav class="sidebar-menu">

      <div v-if="!user.name">
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.home' }" :class="{ active: activeItem === '/' || activeItem === 'app.home' }"
          class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-home"></i>
          <span>Explorar</span>
        </RouterLink>  
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.we' }" :class="{ active: activeItem === 'we' }" class="menu-item"
          @click="sidebarOpen = false">
          <i class="fas fa-users"></i>
          <span>Quem Somos</span>
        </RouterLink>
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.contact' }" :class="{ active: activeItem === 'we' }" class="menu-item"
          @click="sidebarOpen = false">
          <i class="fas fa-phone"></i>
       Fale Connosco
        </RouterLink>
      </div>


      <div v-if="user.name && user.type == '3'">
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.home' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-calendar-plus"></i>
          <span>Explorar Profissionais</span>
        </RouterLink>
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.user.schedules' }" class="menu-item" @click="sidebarOpen = false">
         <i class="fas fa-calendar-day"></i>
          <span>Meus Agendamentos</span>
        </RouterLink>

        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.user.notes' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-book-reader"></i>
          <span>Minhas Notas</span>
        </RouterLink>

        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.user.ranking' }" class="menu-item" @click="sidebarOpen = false">
          <i class="fas fa-star"></i>
          <span>Pontos & Ranking</span>
        </RouterLink>
      </div>



      <div v-if="user.name && user.type == '2'">
       
        <RouterLink :to="{ name: 'app.store.configuration' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
          <i class="fas fa-calendar-plus"></i>
          <span>Configurar Loja</span>
        </RouterLink>
        
        <RouterLink :to="{ name: 'app.store.calender' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
         <i class="fas fa-calendar-day"></i>
          <span>Marcações</span>
        </RouterLink>

        
        <RouterLink :to="{ name: 'app.store.clients' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
         <i class="fas fa-calendar-day"></i>
          <span>Clientes</span>
        </RouterLink>

        <RouterLink :to="{ name: 'app.user.notes' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
         <i class="fas fa-calendar-day"></i>
          <span>Minhas Notas</span>
        </RouterLink>

        <RouterLink :to="{ name: 'app.store.reports' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
          <i class="fas fa-book-reader"></i>
          <span>Relatórios</span>
        </RouterLink>

        <RouterLink :to="{ name: 'app.store.finances' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
          <i class="fas fa-book-reader"></i>
          <span>Finanças</span>
        </RouterLink>

        
        <RouterLink :to="{ name: 'app.store.finances' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
          <i class="fas fa-book-reader"></i>
          <span>Marcações Particulares</span>
        </RouterLink>
<!-- 
        <RouterLink :to="{ name: 'app.store.configuration' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
         <i class="fas fa-calendar-day"></i>
          <span>Outros</span>
        </RouterLink> -->
<!-- 
        <RouterLink :to="{ name: 'app.store.configuration' }" class="menu-item" :scroll-behavior="{ behavior: 'smooth' }" @click="sidebarOpen = false">
          <i class="fas fa-star"></i>
          <span>Pontos & Ranking</span>
        </RouterLink> -->
      </div>

      <!-- <RouterLink to="/notificacoes" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-bell"></i>
        <span>Notificações</span>
        <span class="badge">3</span>
      </RouterLink> -->

    </nav>




    <div class="sidebar-footer">

      
        <RouterLink v-if="user.name && user.type != '2'"  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.user.to.professional' }" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-crown"></i> 
          <span>Torna-se Profissional</span>
        </RouterLink>

        
        <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.contact' }"  class="menu-item mb-2" @click="sidebarOpen = false">
          <i class="fas fa-phone"></i>
          <span>Suporte</span>
        </RouterLink>
<!-- 
      <RouterLink  :to="{ name: 'app.user.to.professional' }" class="btn btn-info mb-3"  :scroll-behavior="{ behavior: 'smooth' }" style="width: 100%;" v-if="user.name && user.type != '2'">
        <i class="fas fa-crown"></i>
        Tornar-se Profissional
      </RouterLink> -->
      
      <!-- <RouterLink  :to="{ name: 'app.contact' }" class="btn btn-success mb-3"  :scroll-behavior="{ behavior: 'smooth' }"  style="width: 100%;" v-if="user.name && user.type != '2'">
        <i class="fas fa-phone"></i>
       Suporte Anoota
      </RouterLink> -->
      <button class="btn-logout" @click="logout" v-if="user.name">
        <i class="fas fa-sign-out-alt me-2"></i>
        Sair
      </button>
      <!-- <RouterLink  :scroll-behavior="{ behavior: 'smooth' }"  :to="{ name: 'app.auth.login' }" class="btn btn-info mb-3" style="width: 100%;" v-else">
        <i class="fas fa-user"></i>
       Criar Conta
      </RouterLink> -->
    </div>



    <!-- <nav class="sidebar-menu">
      <router-link to="/" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-home"></i>
        <span>Início</span>
      </router-link>
      <router-link to="/marcacoes" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-calendar-check"></i>
        <span>Minhas Marcações</span>
      </router-link>
      <router-link to="/favoritos" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-heart"></i>
        <span>Favoritos</span>
      </router-link>
      <router-link to="/notificacoes" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-bell"></i>
        <span>Notificações</span>
        <span class="badge">3</span>
      </router-link>
      <router-link to="/perfil" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-user"></i>
        <span>Perfil</span>
      </router-link>
      <router-link to="/configuracoes" class="menu-item" @click="sidebarOpen = false">
        <i class="fas fa-cog"></i>
        <span>Configurações</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout">
        <i class="fas fa-sign-out-alt"></i>
        Terminar Sessão
      </button>
    </div> -->

  </aside>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tuadominio.pt/api/v1'
const router = useRouter()
const route = useRoute()


const props = defineProps<{
  active?: string
}>()


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
  isProfessional?: boolean
}

// const user = reactive({
//   name: 'Carolina Mendes',
//   email: 'carolina@email.com',
//   phone: '+351 912 345 678',
//   address: 'Lisboa',
//   avatar: ''
// })

// const user = ref({
//   name: 'Carolina Mendes',
//   isProfessional: false,
//   rating: '4.92'
// })

let user: User;
if (typeof route.params.user === 'string') {
  user = {
    id: route.params.user, name: '', phone: '', email: '',
    about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false, type: '',
  };
} else if (Array.isArray(route.params.user)) {
  user = {
    id: route.params.user[0], name: '', phone: '', email: '',
    about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false, type: '',
  };
} else {
  user = route.params.user || {
    id: '', name: '', phone: '', email: '',
    about: '', createdAt: '', provider: '', photo: '', address: '', isProfessional: false, type: '',
  };
}




const sidebarOpen = ref(false)
const activeItem = computed(() => props.active)

const isActive = (name: string) => computed(() => route.name === name)



const logout = async () => {
  try {

    await new Promise(resolve => setTimeout(resolve, 500))
    Cookies.remove('token');
    Cookies.remove('auth');
    Cookies.remove('user');

    router.push({ name: 'app.home' }).catch(() => { });

  } catch (error: any) {
    // showNotification(error.response?.data?.message || 'Erro ao efetuar login.', 'error')
    console.log('aaak')
  }

}



const openLocation = () => {
  alert('Selecionar localização')
}

watch(sidebarOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, .06);
  border-bottom: 1px solid #e2e8f0;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-size: 2rem;
  font-weight: 900;
  color: #0ea5e9;
  letter-spacing: -1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.location-btn,
.hamburger {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f8fafc;
  border: none;
  font-size: 1.38rem;
  color: #0ea5e9;
  cursor: pointer;
  transition: all .3s;
  display: grid;
  place-items: center;
}

.location-btn:hover,
.hamburger:hover,
.btn-login:hover {
  transform: translateY(-2px);
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
  box-shadow: 0 6px 20px rgba(14, 165, 233, .3);
}

.btn-login:hover {
  background: #0c8bd1;
  box-shadow: 0 10px 30px rgba(14, 165, 233, .4);
}

.hamburger {
  position: relative;
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
  background: rgba(0, 0, 0, .65);
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
  transition: transform .5s cubic-bezier(.23, 1, .32, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 60px rgba(0, 0, 0, .22);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  padding: 24px 28px;
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
  padding: 19px 28px;
  color: #475569;
  font-weight: 600;
  font-size: 1.12rem;
  transition: all .35s;
  text-decoration: none;
  position: relative;
}

.menu-item i {
  font-size: 1.45rem;
  width: 32px;
  color: #94a3b8;
  transition: .3s;
}

.menu-item:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  padding-left: 38px;
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

.badge {
  margin-left: auto;
  background: #ef4444;
  color: white;
  font-size: .75rem;
  font-weight: 800;
  padding: 5px 11px;
  border-radius: 50px;
}

.sidebar-footer {
  padding: 24px 28px;
  border-top: 1px solid #e2e8f0;
}

.btn-logout {
  width: 100%;
  padding: 17px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  transition: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-logout:hover {
  background: #fecaca;
  transform: translateY(-3px);
}

@media (max-width: 480px) {
  .top-bar {
    padding: 12px 16px;
  }

  .header-actions {
    gap: 10px;
  }

  .btn-login {
    padding: 10px 18px;
    font-size: .95rem;
  }

  .location-btn,
  .hamburger {
    width: 44px;
    height: 44px;
  }
}
</style>