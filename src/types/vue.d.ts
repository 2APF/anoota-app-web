declare module '@/views/wallet/shortcut/sendMoneyWalletView.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  

  declare module '@/views/wallet/shortcut/receiveMoneyWalletView.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  
  declare module '@/components/wallet/FooterComponent.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare module 'defuse-crypto' {
    export function encrypt(data: string, password: string): string;
    export function decrypt(encryptedData: string, password: string): string;
  }

    
  declare module '@/views/wallet/money/transationWalletView.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare module '@chenfengyuan/vue-qrcode'{
    
    import { QrcodeStream } from 'vue';
    const component: QrcodeStream<{}, {}, any>;
    export default component;
  }




    
  declare module '@date-fns/locale/pt' {
    const locale: any;
    export default locale;
  }


  declare module 'laravel-echo' {
    import { Channel } from 'pusher-js';
  
    export default class Echo {
      constructor(options: any);
      channel(channel: string): PusherChannel;
      leave(channel: string): void;
    }
  
    export interface PusherChannel extends Channel {
      whisper(eventName: string, data: any): PusherChannel;
      listen(eventName: string, callback: (e: any) => void): PusherChannel;
    }
  }