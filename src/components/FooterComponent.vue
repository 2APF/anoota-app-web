<!-- views/HowItWorks.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <img src="/public/logo.png" style="width: 160px; height: 60px;"/>
          <p>A tua agenda digital.</p>
          <div class="social">
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-tiktok"></i></a>
            <a href="#"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
        <div class="links">
          <h4>Plataforma</h4>
          <a href="#">Como funciona</a>
          <a href="#">Preços</a>
          <a href="#">Profissionais</a>
        </div>
        <div class="links">
          <h4>Empresa</h4>
           <RouterLink :to="{ name: 'app.we' }" :scroll-behavior="{ behavior: 'smooth' }">Quem Somos</RouterLink>
          <a href="#">Carreiras</a>
          <a href="#">Imprensa</a>
           <RouterLink :to="{ name: 'app.contact' }" :scroll-behavior="{ behavior: 'smooth' }">Contacto</RouterLink>
        </div>
        <div class="links">
          <h4>Legal</h4>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Cookies</a>
        </div>
      </div>
      <div class="bottom">
        <p>© 2025 Anoota - Todos os direitos reservados</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { Search, Calendar, Sparkles, CheckCircle } from 'lucide-vue-next'
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

 

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer {
  background: #1e293b;
  color: #cbd5e1;
  padding: 80px 20px 40px;
}

.footer-grid {
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 36px;
  margin-bottom: 36px;
}

.brand h3 {
  font-size: 2.2rem;
  font-weight: 900;
  color: #0ea5e9;
  margin-bottom: 10px;
}

.social a {
  font-size: 1.4rem;
  color: #64748b;
  margin-right: 14px;
  transition: .3s;
}

.social a:hover {
  color: #0ea5e9;
}

.links h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: white;
  margin-bottom: 14px;
}

.links a {
  display: block;
  color: #94a3b8;
  margin: 8px 0;
  font-size: .95rem;
  text-decoration: none;
  transition: .3s;
}

.links a:hover {
  color: #0ea5e9;
  transform: translateX(4px);
}

.bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #334155;
  font-size: .85rem;
  color: #64748b;
}



@media (max-width: 640px) {

  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>