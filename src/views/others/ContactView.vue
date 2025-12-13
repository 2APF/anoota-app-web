<template>
  <NavbarComponent />

  <a href="https://wa.me/351912345678" target="_blank" class="whatsapp-float">
    <i class="fab fa-whatsapp"></i>
  </a>

  <div class="contact-page">
    <section class="hero">
      <div class="container">
        <h1>Fala connosco</h1>
        <p class="subtitle">Estamos aqui para te ajudar</p>
      </div>
    </section>

    <section class="contact">
      <div class="container">
        <div class="cards">
          <div class="card">
            <div class="icon"><i class="fab fa-whatsapp"></i></div>
            <h3>WhatsApp</h3>
            <p class="main">+351 91 234 5678</p>
            <p>Segunda a Sexta · 9h–19h</p>
            <a href="https://wa.me/351912345678" target="_blank" class="btn">Falar agora</a>
          </div>

          <div class="card">
            <div class="icon"><i class="fas fa-envelope"></i></div>
            <h3>Email</h3>
            <p class="main">ola@anoota.pt</p>
            <p>Resposta em menos de 2h úteis</p>
            <a href="mailto:ola@anoota.pt" class="btn">Enviar email</a>
          </div>

          <div class="card">
            <div class="icon"><i class="fas fa-phone-alt"></i></div>
            <h3>Telefone</h3>
            <p class="main">+351 211 234 567</p>
            <p>Segunda a Sexta · 10h–18h</p>
            <a href="tel:+351211234567" class="btn">Ligar agora</a>
          </div>

          <div class="card">
            <div class="icon"><i class="fas fa-map-marker-alt"></i></div>
            <h3>Escritório</h3>
            <p>Rua da Tecnologia, 123</p>
            <p>1000-001 Lisboa · Portugal</p>
            <a href="https://maps.google.com/?q=Rua+da+Tecnologia+123+Lisboa" target="_blank" class="btn">Ver no mapa</a>
          </div>
        </div>
      </div>
    </section>

    <section class="map">
      <div class="container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.8451567890123!2d-9.139336684684687!3d38.72225297959803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19337a2c58d9c5%3A0x79f7e9f9e9f9e9f9!2sLisboa!5e0!3m2!1spt-PT!2spt!4v1234567890"
          width="100%" height="420" style="border:0;border-radius:20px;" loading="lazy" allowfullscreen>
        </iframe>
      </div>
    </section>
  </div>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <h3>anoota</h3>
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
          <a href="#">Blog</a>
        </div>
        <div class="links">
          <h4>Empresa</h4>
          <a href="#">Quem Somos</a>
          <a href="#">Carreiras</a>
          <a href="#">Imprensa</a>
          <a href="#">Contacto</a>
        </div>
        <div class="links">
          <h4>Legal</h4>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Cookies</a>
        </div>
      </div>
      <div class="bottom">
        <p>© 2025 anoota • Pertencente à JANJATEK, Lda • Todos os direitos reservados</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.contact-page {
  background: #f8fafc;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  padding: 120px 20px 70px;
  text-align: center;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

.hero h1 {
  font-size: clamp(2.6rem, 5vw, 3.8rem);
  font-weight: 900;
  margin-bottom: 14px;
  color: white;
}

.subtitle {
  font-size: 1.2rem;
  max-width: 640px;
  margin: 0 auto;
  color: white;
  opacity: .95;
}

.contact {
  padding: 80px 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.card {
  background: white;
  padding: 32px;
  border-radius: 22px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, .06);
  text-align: center;
  transition: .3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(14, 165, 233, .1);
}

.icon {
  width: 68px;
  height: 68px;
  background: #0ea5e9;
  border-radius: 50%;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: white;
}

.card h3 {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 10px;
  color: #1e293b;
}

.main {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 10px 0;
  color: #0ea5e9;
}

.card p {
  font-size: .95rem;
  color: #475569;
  margin: 8px 0;
}

.btn {
  display: inline-block;
  margin-top: 16px;
  padding: 11px 28px;
  background: #0ea5e9;
  color: white;
  border-radius: 50px;
  font-weight: 700;
  font-size: .95rem;
  text-decoration: none;
  transition: .3s;
}

.btn:hover {
  background: #0284c7;
  transform: translateY(-3px);
}

.map {
  padding: 80px 20px;
}

.map iframe {
  box-shadow: 0 12px 40px rgba(0, 0, 0, .08);
}

.whatsapp-float {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 58px;
  height: 58px;
  background: #25d366;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2.1rem;
  box-shadow: 0 8px 25px rgba(37, 211, 102, .3);
  z-index: 1000;
  transition: .3s;
}

.whatsapp-float:hover {
  transform: scale(1.1);
}

.footer {
  background: #1e293b;
  color: #cbd5e1;
  padding: 80px 20px 40px;
}

.footer-grid {
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
  font-size: .9rem;
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
  .hero {
    padding: 110px 20px 60px;
  }

  .hero h1 {
    font-size: clamp(2.2rem, 7vw, 3.2rem);
  }

  .contact,
  .map {
    padding: 70px 20px;
  }

  .card {
    padding: 28px;
  }

  .footer {
    padding: 70px 20px 40px;
  }
}
</style>