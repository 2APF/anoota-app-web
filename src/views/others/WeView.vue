<template>
  <NavbarComponent />

  <div class="about-page">
    <section class="hero">
      <div class="container">
        <h1><span>Somos a Anoota</span></h1>
        <p class="subtitle">A tua agenda digital que acabou com as filas e os telefonemas perdidos.</p>
      </div>
    </section>

    <section class="stats-section">
      <div class="container">
        <div class="stats">
          <div class="stat-item">
            <div class="stat">+50</div>
            <p>Profissionais parceiros</p>
          </div>
          <div class="stat-item">
            <div class="stat">+12.000</div>
            <p>Agendamentos realizados</p>
          </div>
        </div>
      </div>
    </section>

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

    <section class="about">
      <div class="container">
        <div class="grid-about">
          <div class="text">
            <p>A <strong>anoota</strong> é uma plataforma da startup <strong>JANJATEK</strong>, sediada em Vila Franca de Xira, Lisboa. Surgiu em 2024 com uma missão clara: acabar com as agendas de papel, os telefonemas perdidos e a gestão manual.</p>
            <p>Hoje operamos com força em toda <strong>CPLP</strong>, conectando milhares de clientes a profissionais incríveis todos os dias.</p>

            <!-- <div class="features">
              <div><i class="fas fa-check-circle"></i> Agendamento 24h</div>
              <div><i class="fas fa-check-circle"></i> Gestão completa de clientes</div>
              <div><i class="fas fa-check-circle"></i> Relatórios e contabilidade automática</div>
              <div><i class="fas fa-check-circle"></i> Notificações WhatsApp/SMS</div>
              <div><i class="fas fa-check-circle"></i> Perfil público personalizado</div>
              <div><i class="fas fa-check-circle"></i> Zero comissões por agendamento</div>
            </div> -->
          </div>
          <div class="image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200" alt="Equipe anoota" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2 style="color: white;">Junta-te à revolução</h2>
        <p>Se és profissional, cresce o teu negócio. Se és cliente, encontra o melhor perto de ti.</p>
        <div class="buttons">
          <button class="btn-primary">Sou Profissional</button>
          <button class="btn-secondary">Sou Cliente</button>
        </div>
      </div>
    </section>
  </div>


  <FooterComponent />

</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.about-page {
  background: #fff;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  padding: 130px 20px 80px;
  text-align: center;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
}

.hero h1 {
  font-size: clamp(2.6rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 16px;
}

.hero h1 span {
  color: white;
  opacity: .9;
}

.subtitle {
  font-size: 1.25rem;
  max-width: 680px;
  margin: 0 auto;
  opacity: .95;
  line-height: 1.6;
}

.stats-section {
  padding: 60px 20px 80px;
  background: #f8fafc;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.stat-item .stat {
  font-size: 3.2rem;
  font-weight: 900;
  color: #0ea5e9;
  line-height: 1;
}

.stat-item p {
  font-size: 1.1rem;
  margin-top: 10px;
  color: #475569;
  font-weight: 600;
}

.mvv {
  padding: 80px 20px;
  background: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.card {
  background: #f8fafc;
  padding: 36px 28px;
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0,0,0,.05);
  text-align: center;
  transition: .3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(14,165,233,.08);
}

.card i {
  font-size: 2.8rem;
  color: #0ea5e9;
  margin-bottom: 18px;
}

.card h3 {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0 0 12px;
  color: #1e293b;
}

.card p {
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
}

.about {
  padding: 90px 20px;
  background: #f8fafc;
}

.grid-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.text h2 {
  font-size: 2.4rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 20px;
  line-height: 1.3;
}

.text p {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 18px;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 28px;
}

.features div {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 500;
}

.features i {
  color: #10b981;
  font-size: 1.2rem;
}

.image img {
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 15px 40px rgba(0,0,0,.08);
}

.cta {
  padding: 90px 20px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  text-align: center;
  color: white;
}

.cta h2 {
  font-size: 2.4rem;
  font-weight: 900;
  margin-bottom: 16px;
}

.cta p {
  font-size: 1.2rem;
  max-width: 640px;
  margin: 0 auto 40px;
  opacity: .95;
}

.buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: .3s;
}

.btn-primary {
  background: white;
  color: #0ea5e9;
}

.btn-primary:hover {
  background: #f0f9ff;
  transform: translateY(-4px);
}

.btn-secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: #0ea5e9;
}

.bottom {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #334155;
  font-size: .85rem;
  color: #64748b;
}

@media (max-width: 960px) {
  .grid-about {
    grid-template-columns: 1fr;
    gap: 50px;
    text-align: center;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 110px 20px 70px;
  }

  .hero h1 {
    font-size: clamp(2.4rem, 7vw, 3.4rem);
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .stat-item .stat {
    font-size: 2.8rem;
  }

  .mvv,
  .about,
  .cta {
    padding: 70px 20px;
  }

  .cta h2 {
    font-size: 2.2rem;
  }
}
</style>