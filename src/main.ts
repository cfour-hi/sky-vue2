import './root.css';
import '@/plugins/use-plugin';

import Vue from 'vue';
import App from './App.vue';

import './tailwindcss/tailwind.css';
import './plugins/use-sky-editor';

Vue.config.productionTip = false;

(window as any).SkyAppVM = new Vue({ render: h => h(App) }).$mount('#app');
