import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/others/HomeView.vue'
import Cookies from 'js-cookie'
import NotFoundView from '@/views/others/NotFoundView.vue'
import LoginView from '@/views/dashboard/LoginView.vue'
import SettingsView from '@/views/others/MicroExpoView.vue'
import StoreDetailView from '@/views/others/StoreDetailView.vue'
import ConfigurationStoreView from '@/views/dashboard/store/ConfigurationStoreView.vue'
import StatisticStoreView from '@/views/dashboard/store/StatisticStoreView.vue'
import ReadingStoreView from '@/views/dashboard/store/ReadingStoreView.vue'
import FinancesStoreView from '@/views/dashboard/store/FinancesStoreView.vue'
import CalenderView from '@/views/dashboard/store/CalenderView.vue'
import WeView from '@/views/others/WeView.vue'
import ContactView from '@/views/others/ContactView.vue'
import HomeStoreView from '@/views/dashboard/store/HomeView.vue'
import ProfileView from '@/views/dashboard/ProfileView.vue'
import ToScheduleView from '@/views/dashboard/ToScheduleView.vue'
import MySchedulesView from '@/views/dashboard/MySchedulesView.vue'
import MyNotesView from '@/views/dashboard/MyNotesView.vue'
import PointsView from '@/views/dashboard/PointsView.vue'
import ToProfessionalView from '@/views/dashboard/ToProfessionalView.vue'
import ClientsView from '@/views/dashboard/store/ClientsView.vue'
import ReportsView from '@/views/dashboard/store/ReportsView.vue'
import HomeUserView from '@/views/dashboard/HomeView.vue'
import ScheduleUserView from '@/views/dashboard/scheduleUserView.vue'
import ScheduleUserFinishView from '@/views/dashboard/scheduleUserFinishView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'app.home',
      component: HomeView,
      meta: {
        title: 'Home - A revolução',
        description: 'Estamos redefinindo todo conceito de comunicação segura.',
        keywords: 'Anoota, segurança, chat, mensagens seguras, criptomoeda, criptografia',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },


    
    {
      path: '/we',
      name: 'app.we',
      component: WeView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },

    
    
    {
      path: '/contact',
      name: 'app.contact',
      component: ContactView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },


    
    {
      path: '/store-detail/:id',
      name: 'app.store.detail',
      component: StoreDetailView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },

        
    {
      path: '/schedule/:id',
      name: 'app.schedule',
      component: ScheduleUserView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },


    
        
    {
      path: '/schedule/finish',
      name: 'app.schedule.finish',
      component: ScheduleUserFinishView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },


    


    
    {
      path: '/auth/access',
      name: 'app.auth.login',
      component: LoginView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },

    
    
















    
    {
      path: '/user/homepage',
      name: 'app.user.homepage',
      component: HomeUserView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    

    
    {
      path: '/user/profile',
      name: 'app.user.profile',
      component: ProfileView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },



    
    {
      path: '/user/to-schedule',
      name: 'app.user.to.schedule',
      component: ToScheduleView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    
    {
      path: '/user/schedules',
      name: 'app.user.schedules',
      component: MySchedulesView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    

    
    {
      path: '/user/notes',
      name: 'app.user.notes',
      component: MyNotesView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    
    {
      path: '/user/ranking',
      name: 'app.user.ranking',
      component: PointsView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },

 
    {
      path: '/user/to-professional',
      name: 'app.user.to.professional',
      component: ToProfessionalView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },






    /* 
    * Routes profissional full
    */

    {
      path: '/store/configuration',
      name: 'app.store.configuration',
      component: ConfigurationStoreView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    
    
    {
      path: '/store/clients',
      name: 'app.store.clients',
      component: ClientsView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuth: true
      },
    },


    
    {
      path: '/store/calender',
      name: 'app.store.calender',
      component: CalenderView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },

    
    
    {
      path: '/store/readings',
      name: 'app.store.readings',
      component: ReadingStoreView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },

    
    {
      path: '/store/reports',
      name: 'app.store.reports',
      component: ReportsView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },
    {
      path: '/store/finances',
      name: 'app.store.finances',
      component: FinancesStoreView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },
    
    {
      path: '/store/stats',
      name: 'app.store.stats',
      component: StatisticStoreView,
      meta: {
        title: 'Login - Anoota',
        description: 'Faça login na sua conta Anoota.',
        keywords: 'login, autenticação, Anoota',
        ogImage: 'https://Anoota.online/logo-black.png',
        requiresAuthUser: true
      },
    },


    

    
    // {
    //   path: '/auth/create',
    //   name: 'app.auth.create',
    //   component: CreateAccountView,
    //   meta: {
    //     title: 'Criar Conta - Anoota',
    //     description: 'Crie uma nova conta Anoota.',
    //     keywords: 'criar conta, registro, Anoota',
    //     ogImage: 'https://Anoota.online/logo-black.png'
    //   },
    // },





    
    
    {
      path: '/settings',
      name: 'app.settings',
      component: SettingsView,
      meta: {
        title: 'Configurações - FacturaPro',
        description: 'Gerencie as configurações da sua conta no FacturaPro.',
        keywords: 'histórico, faturas, FacturaPro',
        ogImage: 'https://facturapro.online/logo-black.png'
      }
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Página Não Encontrada - Anoota',
        description: 'A página que você tentou acessar não foi encontrada.',
        ogImage: 'https://Anoota.online/logo-black.png'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});







router.beforeEach(async (to, from, next) => {

  const user = Cookies.get('user') || null
  const token = Cookies.get('token') || null

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

  if (to.matched.some((record) => record.meta.requiresAuth)) {

    const token = Cookies.get('token') || null
    try {

      const userData = JSON.parse(user || '');
      const response = await fetch(`${apiBase}/auth/request/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next()

      }
    } catch (error) {
        return next()
    }
  }






  if (to.matched.some((record) => record.meta.requiresAuthUser)) {
    if (!user) {
      return next({ name: 'app.auth.login' })
    }

    const token = Cookies.get('token') || null
    try {
      const userData = JSON.parse(user);
      const response = await fetch(`${apiBase}/auth/request/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        console.log(userData);
        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next({ name: 'app.auth.login' })
      }
    } catch (error) {
      return next({ name: 'app.auth.login' })
    }
  }








  if (to.matched.some((record) => record.meta.requiresAuthProfissional)) {
    if (!user) {
      return next({ name: 'app.auth.login' })
    }

    const token = Cookies.get('token') || null
    try {
      const userData = JSON.parse(user);
      const response = await fetch(`${apiBase}/auth/request/profissional/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      if (response.ok) {
        const userData = await response.json()

        // console.log(userData);
        if (Array.isArray(to.params.user)) {
          to.params.user.push(userData)
        } else {
          to.params.user = userData
        }
        return next()
      } else {
        return next({ name: 'app.auth.login' })
      }
    } catch (error) {
      // console.error('Error fetching user data:', error);
      return next({ name: 'app.auth.login' })
    }
  }

  return next()
})

router.afterEach((to) => {
  const title: any = to.meta.title || 'Cirimóveis - Encontre o imóvel dos seus sonhos'
  document.title = title

  const description: any = to.meta.description || 'A Cirimóveis é a sua plataforma confiável para encontrar imóveis em Angola. Explore nossas ofertas de apartamentos, casas e terrenos para compra ou aluguel.'
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', description)
  } else {
    const newMetaDescription = document.createElement('meta')
    newMetaDescription.name = 'description'
    newMetaDescription.content = description
    document.head.appendChild(newMetaDescription)
  }

  const keywords: any = to.meta.keywords || 'imóveis, Angola, apartamentos, casas, terrenos, compra, aluguel'
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  if (metaKeywords) {
    metaKeywords.setAttribute('content', keywords)
  } else {
    const newMetaKeywords = document.createElement('meta')
    newMetaKeywords.name = 'keywords'
    newMetaKeywords.content = keywords
    document.head.appendChild(newMetaKeywords)
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: window.location.href
  }
  const oldScript = document.querySelector('#structured-data')
  if (oldScript) {
    oldScript.remove()
  }
  const script = document.createElement('script')
  script.id = 'structured-data'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)

  const canonicalLink = document.querySelector('link[rel="canonical"]')
  if (canonicalLink) {
    canonicalLink.setAttribute('href', window.location.href)
  } else {
    const newLink = document.createElement('link')
    newLink.rel = 'canonical'
    newLink.href = window.location.href
    document.head.appendChild(newLink)
  }
})

export default router
