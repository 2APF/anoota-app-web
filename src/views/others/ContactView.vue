<template>
  <NavbarComponent />

  <a href="https://wa.me/351912345678" target="_blank" class="whatsapp-float">
    <i class="fab fa-whatsapp"></i>
  </a>

  <div class="contact-page">

    <section class="hero">
      <div class="container">
        <h1 style="color: white;">Fala connosco</h1>
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
            <p class="main">ola@inene.pt</p>
            <p>Resposta em menos de 2h úteis</p>
            <a href="mailto:ola@inene.pt" class="btn">Enviar email</a>
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
          width="100%" 
          height="500" 
          style="border:0;border-radius:28px;" 
          allowfullscreen="" 
          loading="lazy">
        </iframe>
      </div>
    </section>

  </div>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <h3>inene</h3>
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
        <p>© 2025 inene • Pertencente à JANJATEK, Lda • Todos os direitos reservados</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<style scoped>
.contact-page{background:#f8fafc;min-height:100vh}
.container{max-width:1280px;margin:0 auto;padding:0 20px}

.hero{padding:160px 20px 100px;text-align:center;background:linear-gradient(135deg,#0ea5e9,#0c8bd1);color:white}
.hero h1{font-size:clamp(2.8rem,7vw,5rem);font-weight:900;margin-bottom:16px}
.subtitle{font-size:1.35rem;max-width:720px;margin:0 auto;opacity:0.95}

.contact{padding:100px 20px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px}

.card{background:white;padding:40px;border-radius:28px;box-shadow:0 20px 60px rgba(0,0,0,.08);text-align:center;transition:.3s}
.card:hover{transform:translateY(-12px);box-shadow:0 30px 80px rgba(14,165,233,.15)}

.icon{width:84px;height:84px;background:#0ea5e9;border-radius:50%;margin:0 auto 24px;display:grid;place-items:center;font-size:2.4rem;color:white}
.card h3{font-size:1.8rem;font-weight:900;margin-bottom:12px;color:#1e293b}
.main{font-size:1.4rem;font-weight:800;color:#0;margin:12px 0;color:#0ea5e9}
.card p{font-size:1.05rem;color:#475569;margin:8px 0}

.btn{display:inline-block;margin-top:20px;padding:14px 32px;background:#0ea5e9;color:white;border-radius:50px;font-weight:800;transition:.3s}
.btn:hover{background:#0c8bd1;transform:translateY(-4px)}

.map{padding:80px 20px}
.map iframe{box-shadow:0 30px 80px rgba(0,0,0,.15)}

.whatsapp-float{position:fixed;right:24px;bottom:24px;width:64px;height:64px;background:#25d366;color:white;border-radius:50%;display:grid;place-items:center;font-size:2.4rem;box-shadow:0 10px 30px rgba(37,211,102,.4);z-index:1000;transition:.3s}
.whatsapp-float:hover{transform:scale(1.15)}

.footer{background:#1e293b;color:#cbd5e1;padding:100px 20px 40px}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:48px;max-width:1280px;margin:0 auto 48px}
.brand h3{font-size:2.6rem;font-weight:900;color:#0ea5e9;margin-bottom:12px}
.social a{font-size:1.7rem;color:#64748b;margin-right:18px;transition:.3s}
.social a:hover{color:#0ea5e9}
.links h4{font-size:1.2rem;font-weight:800;color:white;margin-bottom:20px}
.links a{display:block;color:#94a3b8;margin:10px 0;transition:.3s}
.links a:hover{color:#0ea5e9;transform:translateX(6px)}
.bottom{text-align:center;padding-top:32px;border-top:1px solid #334155;font-size:.9rem;color:#64748b}

@media (max-width:640px){
  .hero{padding:120px 20px 80px}
  .contact,.map{padding:80px 20px}
  .card{padding:32px}
}
</style>