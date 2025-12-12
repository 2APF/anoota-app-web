<template>
  <NavbarComponent />

  <div class="loyalty-page">
    <div class="container">

      <header class="page-header">
        <h1>Programa de Pontos</h1>
        <p>Seus pontos, seu nível e o ranking geral</p>
      </header>

      <!-- <div class="my-points">
        <div class="card">
          <div class="circle" :style="{ '--p': progress + '%' }">
            <span class="points">{{ userPoints }}</span>
            <span class="label">pontos</span>
          </div>
          <div class="info">
            <h2>Nível {{ userLevel }}</h2>
            <p>Faltam {{ nextLevelPoints }} pts para {{ nextLevel }}</p>
            <div class="bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
          </div>
        </div>
      </div>

      <div class="benefits">
        <div class="item">
          <i class="fas fa-gift"></i>
          <div>
            <strong>Serviço grátis</strong>
            <small>a cada 10 agendamentos</small>
          </div>
        </div>
        <div class="item">
          <i class="fas fa-percentage"></i>
          <div>
            <strong>Descontos exclusivos</strong>
            <small>quanto maior o nível</small>
          </div>
        </div>
        <div class="item">
          <i class="fas fa-crown"></i>
          <div>
            <strong>Atendimento prioritário</strong>
            <small>em todos os parceiros</small>
          </div>
        </div>
      </div>

      <section class="ranking">
        <h2>Ranking Geral – Top 10</h2>
        <div class="list">
          <div v-for="(u,i) in top10" :key="u.id" class="rank" :class="{ me: u.isMe, top3: i < 3 }">
            <div class="pos">
              <div v-if="i < 3" class="medal"><i class="fas" :class="medal(i)"></i></div>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="avatar">{{ u.name[0] }}</div>
            <div class="name">{{ u.name.split(' ')[0] }}</div>
            <div class="pts">{{ u.points }} pts</div>
            <div class="lvl" :class="u.level.toLowerCase()">{{ u.level }}</div>
          </div>
        </div>

        <div v-if="myRank > 10" class="my-rank">
          <div class="rank me">
            <div class="pos">{{ myRank }}º</div>
            <div class="avatar">{{ userName[0] }}</div>
            <div class="name">Você ({{ userName.split(' ')[0] }})</div>
            <div class="pts">{{ userPoints }} pts</div>
            <div class="lvl" :class="userLevel.toLowerCase()">{{ userLevel }}</div>
          </div>
        </div>
      </section> -->

    </div>
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue'

const userPoints: any = '685'
const userName = 'Carolina Mendes'
const userLevel = 'Ouro'
const nextLevel = 40
const myRank = 12

const levels = [{name:'Bronze',min:0},{name:'Prata',min:300},{name:'Ouro',min:600},{name:'Diamante',min:1000}]
const current: any = levels.find(l => userPoints >= l.min && userPoints < (levels[levels.indexOf(l)+1]?.min || 99999))!
const next = levels[levels.indexOf(current)+1] || current
const nextLevelPoints = next.min - userPoints
const progress = Math.min(((userPoints - current.min) / (next.min - current.min)) * 100, 100)

const top10 = [
  {id:1,name:'Ana Silva',points:1840,level:'Diamante'},
  {id:2,name:'Pedro Costa',points:1790,level:'Diamante'},
  {id:3,name:'Mariana Lopes',points:1620,level:'Diamante'},
  {id:4,name:'João Santos',points:1380,level:'Ouro'},
  {id:5,name:'Beatriz Almeida',points:1290,level:'Ouro'},
  {id:6,name:'Tiago Oliveira',points:1150,level:'Ouro'},
  {id:7,name:'Sofia Ribeiro',points:1020,level:'Prata'},
  {id:8,name:'Lucas Mendes',points:980,level:'Prata'},
  {id:9,name:'Inês Ferreira',points:920,level:'Prata'},
  {id:10,name:'Miguel Pinto',points:880,level:'Prata'}
]

const medal = (i:number) => i===0 ? 'fa-medal gold' : i===1 ? 'fa-medal silver' : 'fa-medal bronze'
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.loyalty-page{min-height:100vh;background:linear-gradient(135deg,#f8fafc,#e0f2fe 100%);padding:100px 0 140px}
.container{max-width:1000px;margin:0 auto;padding:0 24px}
.page-header{text-align:center;margin-bottom:48px}
.page-header h1{font-size:2.8rem;font-weight:900;background:linear-gradient(90deg,#1e293b,#0ea5e9);
  -webkit-background-clip: text;-webkit-text-fill-color:transparent;margin:0 0 8px}
.page-header p{font-size:1.2rem;color:#475569}

.my-points .card{background:white;border-radius:28px;padding:36px;display:flex;align-items:center;gap:36px;box-shadow:0 12px 40px rgba(0,0,0,.08);border:1px solid #e2e8f0;margin-bottom:48px}
.circle{width:160px;height:160px;border-radius:50%;background:conic-gradient(#0ea5e9 0% var(--p,0%),#e2e8f0 var(--p,0%) 100%);position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.circle::before{content:'';position:absolute;inset:10px;background:white;border-radius:50%}
.points{font-size:2.6rem;font-weight:900;color:#0ea5e9}
.label{font-size:1.1rem;color:#64748b}
.info h2{font-size:2.2rem;font-weight:900;color:#1e293b;margin:0 0 8px}
.info p{font-size:1.15rem;color:#475569;margin:0 0 16px}
.bar{height:12px;background:#e2e8f0;border-radius:50px;overflow:hidden}
.fill{height:100%;background:linear-gradient(90deg,#0ea5e9,#10b981);border-radius:50px;transition:width .6s ease}

.benefits{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-bottom:60px}
.item{background:white;border-radius:24px;padding:28px;display:flex;align-items:center;gap:20px;box-shadow:0 10px 35px rgba(0,0,0,.06);border:1px solid #e2e8f0}
.item i{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#10b981);color:white;font-size:1.8rem;display:flex;align-items:center;justify-content:center}
.item strong{font-size:1.2rem;font-weight:800;color:#1e293b;display:block;margin-bottom:4px}
.item small{color:#64748b}

.ranking h2{font-size:2.1rem;font-weight:900;color:#1e293b;text-align:center;margin:0 0 36px}
.list{display:flex;flex-direction:column;gap:16px;margin-bottom:32px}
.rank{background:white;border-radius:24px;padding:20px;display:grid;grid-template-columns:70px 60px 1fr 110px 100px;gap:16px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,.06);border:1px solid #e2e8f0;transition:transform .25s}
.rank:hover{transform:translateY(-4px)}
.rank.me{border:2px solid #0ea5e9;background:#f0f9ff}
.rank.top3{background:#fffbeb;border-color:#fbbf24}
.pos{text-align:center;font-size:1.8rem;font-weight:900;color:#64748b}
.medal{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.9rem;color:white}
.gold{background:linear-gradient(135deg,#fbbf24,#f59e0b)}
.silver{background:linear-gradient(135deg,#94a3b8,#64748b)}
.bronze{background:linear-gradient(135deg,#cd7f32,#b87333)}
.avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#0284c7);color:white;font-size:1.6rem;font-weight:700;display:flex;align-items:center;justify-content:center}
.name{font-size:1.2rem;font-weight:700;color:#1e293b}
.pts{font-size:1.05rem;color:#475569;font-weight:600}
.lvl{padding:6px 14px;border-radius:50px;font-size:.9rem;font-weight:800;color:white}
.diamante{background:#a78bfa}
.ouro{background:#f59e0b}
.prata{background:#94a3b8}
.bronze{background:#cd7f32}
.my-rank .rank{animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 8px 30px rgba(0,0,0,.06)}50%{box-shadow:0 16px 50px rgba(14,165,233,.2)}}

@media (max-width:840px){
  .my-points .card{flex-direction:column;text-align:center;padding:32px}
  .circle{margin-bottom:20px}
}
@media (max-width:640px){
  .loyalty-page{padding:80px 0 100px}
  .container{padding:0 20px}
  .page-header h1{font-size:2.4rem}
  .rank{grid-template-columns:60px 56px 1fr;gap:12px;padding:18px}
  .lvl,.pts{grid-column:1/-1;justify-self:center}
  .pts{margin-top:8px}
}
</style>