import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: '97b9f375f41a19024489',
  cluster: 'mt1',
  encrypted: true,
  //authEndpoint: 'http://localhost:8000/api/v1/pusher/auth', // Ajuste para sua URL no Hostinger
});

export default echo;