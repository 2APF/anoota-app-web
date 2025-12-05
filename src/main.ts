interface Window {
    Pusher: any;
    Echo: any;
}

declare const window: Window & typeof globalThis;

import './assets/main.css'

import './assets/main.css'
import './assets/js/fontawesome/all.min.js'

import './assets/js/no.js'
import VueTheMask from 'vue-the-mask';

// import axios from './../axiosConfig.ts'; /// Para rejeit
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'




/////
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '97b9f375f41a19024489',
    cluster: 'mt1',
    wsHost: '127.0.0.1',            
    wsPort: 6001,                  
    // forceTLS: false,               
    forceTLS: true,
});


const app = createApp(App)

app.use(createPinia())
app.use(router)

//app.use(VueTheMask);
const APP_VERSION = '1.0.0'; // Define a versão do aplicativo
const storedVersion = localStorage.getItem('app_version');

if (storedVersion !== APP_VERSION) {
  localStorage.clear();
  sessionStorage.clear();
  caches.keys().then(keys => keys.forEach(key => caches.delete(key))).catch(() => {});
  localStorage.setItem('app_version', APP_VERSION);
  window.location.reload();
}

// app.config.globalProperties.$http = axios;
app.mount('#app')

