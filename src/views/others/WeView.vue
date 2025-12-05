<template>
  <NavbarComponent />

  <div class="about-page">
    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <h1 style="color: white;">Somos a <span>Anoota</span></h1>
        <p class="subtitle">A tua agenda digital que acabou com as filas e os telefonemas perdidos.</p>

        <div class="stats">
          <div class="stat" data-count="50">+50</div>
          <div class="stat" data-count="12000">+12.000</div>
          <p>Profissionais parceiros</p>
          <p>Agendamentos realizados</p>
        </div>
      </div>
    </section>

    <!-- MISSÃO / VISÃO / VALORES -->
    <section class="mvv">
      <div class="container">
        <div class="grid">
          <div class="card">
            <i class="fas fa-bullseye"></i>
            <h3>Missão</h3>
            <p>Conectar clientes aos melhores profissionais de beleza e bem-estar com tecnologia simples, rápida e confiável.</p>
          </div>
          <div class="card">
            <i class="fas fa-eye"></i>
            <h3>Visão</h3>
            <p>Ser a plataforma líder de serviços pessoais na lusofonia até 2027.</p>
          </div>
          <div class="card">
            <i class="fas fa-heart"></i>
            <h3>Valores</h3>
            <p>Inovação • Confiança • Proximidade • Excelência • Respeito</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SOBRE A Anoota -->
    <section class="about">
      <div class="container">
        <div class="grid-about">
          <div class="text">
            <h2>A Anoota nasceu para simplificar vidas</h2>
            <p>Pertencente à <strong>JANJATEK</strong>, empresa tecnológica portuguesa especializada em soluções digitais para pequenos negócios, a Anoota surgiu em 2024 com uma missão clara: acabar com as agendas de papel, os telefonemas perdidos e a gestão manual.</p>
            <p>Hoje operamos com força em <strong>Portugal</strong>, <strong>Brasil</strong> e <strong>Angola</strong>, conectando milhares de clientes a profissionais incríveis todos os dias.</p>

            <div class="features">
              <div><i class="fas fa-check-circle"></i> Agendamento online 24h</div>
              <div><i class="fas fa-check-circle"></i> Gestão completa de clientes</div>
              <div><i class="fas fa-check-circle"></i> Relatórios e contabilidade automática</div>
              <div><i class="fas fa-check-circle"></i> Notificações WhatsApp/SMS</div>
              <div><i class="fas fa-check-circle"></i> Perfil público personalizado</div>
              <div><i class="fas fa-check-circle"></i> Zero comissões por agendamento</div>
            </div>
          </div>
          <div class="image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200" alt="Equipe Anoota">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container">
        <h2>Junta-te à revolução Anoota</h2>
        <p>Se és profissional, cresce o teu negócio. Se és cliente, encontra o melhor perto de ti.</p>
        <div class="buttons">
          <button class="btn-primary">Sou Profissional</button>
          <button class="btn-secondary">Sou Cliente</button>
        </div>
      </div>
    </section>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand">
          <h3>Anoota</h3>
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
        <p>© 2025 Anoota • Pertencente à JANJATEK, Lda • Todos os direitos reservados</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
import { onMounted } from 'vue'

onMounted(() => {
  document.querySelectorAll('.stat').forEach(el => {
    const target = parseInt(el.getAttribute('data-count')!)
    let count = 0
    const inc = target / 80
    const timer = setInterval(() => {
      count += inc
      if (count >= target) {
        el.textContent = target === 98 ? '98%' : target === 3 ? '3' : target < 100 ? `+${target}` : `+${Math.round(count).toLocaleString()}`
        clearInterval(timer)
      } else {
        el.textContent = target === 98 ? `${Math.round(count)}%` : target === 3 ? '3' : `+${Math.round(count)}`
      }
    }, 30)
  })
})
</script>

<style scoped>
.about-page{background:#fff;min-height:100vh;font-family:system-ui,-apple-system,sans-serif}
.container{max-width:1280px;margin:0 auto;padding:0 20px}

/* HERO */
.hero{padding:160px 20px 120px;text-align:center;background:linear-gradient(135deg,#0ea5e9 0%,#0c8bd1 100%);color:white}
.hero h1{font-size:clamp(2.8rem,7vw,5rem);font-weight:900;margin:0 0 20px}
.hero h1 span{color:#fff176}
.subtitle{font-size:1.35rem;max-width:720px;margin:0 auto 56px;opacity:0.95;line-height:1.6}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;max-width:1300px;margin:0 auto}
.stat{font-size:3.8rem;font-weight:900;color:#fff176;line-height:1}
.stat + p{font-size:1.1rem;margin-top:8px;opacity:0.9;font-weight:600}

/* MVV */
.mvv{padding:120px 20px;background:#f8fafc}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px}
.card{background:white;padding:40px 28px;border-radius:24px;box-shadow:0 15px 50px rgba(0,0,0,.08);text-align:center;transition:.3s}
.card:hover{transform:translateY(-10px);box-shadow:0 25px 60px rgba(14,165,233,.15)}
.card i{font-size:3.2rem;color:#0ea5e9;margin-bottom:20px}
.card h3{font-size:1.6rem;font-weight:900;margin:0 0 14px;color:#1e293b}
.card p{font-size:1.05rem;color:#475569;line-height:1.6}

/* ABOUT */
.about{padding:140px 20px;background:white}
.grid-about{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.text h2{font-size:2.6rem;font-weight:900;color:#1e293b;margin-bottom:24px;line-height:1.2}
.text p{font-size:1.1rem;color:#475569;line-height:1.8;margin-bottom:20px}
.features{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:32px}
.features div{display:flex;align-items:center;gap:12px;font-size:1.05rem;font-weight:500}
.features i{color:#10b981;font-size:1.3rem}
.image img{width:100%;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.15)}

/* CTA */
.cta{padding:140px 20px;background:linear-gradient(135deg,#0ea5e9,#0c8bd1);text-align:center;color:white}
.cta h2{font-size:2.8rem;font-weight:900;margin-bottom:20px}
.cta p{font-size:1.3rem;max-width:720px;margin:0 auto 48px;opacity:0.95}
.buttons{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}
.btn-primary,.btn-secondary{padding:18px 44px;border-radius:50px;font-size:1.2rem;font-weight:800;cursor:pointer;transition:.3s}
.btn-primary{background:#fff176;color:#1e293b}
.btn-primary:hover{background:#fde047;transform:translateY(-5px)}
.btn-secondary{background:transparent;border:3px solid white;color:white}
.btn-secondary:hover{background:white;color:#0ea5e9}

/* FOOTER */
.footer{background:#1e293b;color:#cbd5e1;padding:100px 20px 40px}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:48px;max-width:1280px;margin:0 auto 48px}
.brand h3{font-size:2.6rem;font-weight:900;color:#0ea5e9;margin-bottom:12px}
.brand p{font-size:1rem;margin-bottom:28px}
.social a{font-size:1.7rem;color:#64748b;margin-right:18px;transition:.3s}
.social a:hover{color:#0ea5e9;transform:scale(1.2)}
.links h4{font-size:1.2rem;font-weight:800;color:white;margin-bottom:20px}
.links a{display:block;color:#94a3b8;margin:10px 0;transition:.3s;font-size:1rem}
.links a:hover{color:#0ea5e9;transform:translateX(6px)}
.bottom{text-align:center;padding-top:32px;border-top:1px solid #334155;font-size:.9rem;color:#64748b}

/* RESPONSIVO */
@media (max-width:960px){
  .grid-about{grid-template-columns:1fr;gap:60px;text-align:center}
  .features{grid-template-columns:1fr}
}
@media (max-width:640px){
  .hero{padding:120px 20px 100px}
  .stats{grid-template-columns:1fr 1fr;gap:28px}
  .stat{font-size:3rem}
  .mvv,.about,.cta{padding:100px 20px}
  .cta h2{font-size:2.4rem}
  .footer-grid{grid-template-columns:1fr}
  .brand{text-align:center}
}
</style>