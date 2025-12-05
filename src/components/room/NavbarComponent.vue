<template>
  <div class="responsive-header-nav mt-5">
    <div class="nav-container" :class="{ 'nav-open': isMenuOpen }">
      <div class="nav-wrapper">
        <div class="nav-scroll-container">
          <RouterLink 
            v-for="route in routes" 
            :key="route.name"
            :to="route.path"
            class="nav-item"
            :class="{ 'active': isActiveRoute(route.path) }"
            @click="closeMenu"
          >
            <i :class="route.icon"></i>
            <span>{{ route.label }}</span>
          </RouterLink>

          
        </div>
      </div>

      
      
      <button 
        class="menu-toggle" 
        @click="toggleMenu"
        aria-label="Toggle Navigation Menu"
      >
        <span class="menu-icon" :class="{ 'open': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMenuOpen = ref(false);

const routes = [
  { 
    name: 'rooms', 
    path: '/rooms', 
    label: 'Salas', 
    icon: 'bi bi-grid-3x3-gap-fill' 
  },
  { 
    name: 'arena', 
    path: 'app.we', 
    label: 'Arena', 
    icon: 'bi bi-trophy-fill' 
  },
  { 
    name: 'meet', 
    path: '/meet',
    label: 'Meet', 
    icon: 'bi bi-camera-video-fill' 
  },
  { 
    name: 'others', 
    path: '/others', 
    label: 'Outros', 
    icon: 'bi bi-three-dots' 
  },
  { 
    name: 'upgrade', 
    path: '/upgrade', 
    label: 'Upgrade', 
    icon: 'bi bi-three-dots' 
  }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const isActiveRoute = (path: string) => {
  return route.path.startsWith(path);
};
</script>

<style scoped>
.responsive-header-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #2a2a2a;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
}

.nav-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.nav-wrapper {
  width: 100%;
  overflow: hidden;
}

.nav-scroll-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #81a1e6;
  padding: 12px 15px;
  border-radius: 10px;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
}

.nav-item i {
  font-size: 1.5rem;
  margin-bottom: 6px;
}

.nav-item span {
  font-size: 0.85rem;
  font-weight: 500;
}

.nav-item:hover, .nav-item.active {
  background-color: rgba(74, 144, 226, 0.2);
  color: #4a90e2;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  width: 25px;
}

.menu-icon span {
  height: 3px;
  width: 100%;
  background-color: #4a90e2;
  margin: 3px 0;
  transition: 0.4s;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 15px 25px;
  }
  
  .menu-toggle {
    display: block;
    position: absolute;
    right: 20px;
  }

  .nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    background-color: #2a2a2a;
    transition: max-height 0.3s ease;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  }

  .nav-container.nav-open .nav-wrapper {
    max-height: 350px;
  }

  .nav-scroll-container {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    gap: 10px;
  }

  .nav-item {
    justify-content: flex-start;
    flex-direction: row;
    gap: 15px;
    padding: 15px;
    border-radius: 10px;
  }

  .nav-item i {
    margin-bottom: 0;
    margin-right: 15px;
    font-size: 1.3rem;
  }

  .nav-item span {
    font-size: 1.1rem;
  }
}

/* Hamburger Menu Animation */
.menu-icon span:nth-child(1) {
  transform-origin: 0% 0%;
}

.menu-icon span:nth-child(2) {
  transform-origin: 0% 100%;
}

.menu-icon.open span:nth-child(1) {
  transform: rotate(45deg);
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
}

.menu-icon.open span:nth-child(3) {
  transform: rotate(-45deg);
}
</style>