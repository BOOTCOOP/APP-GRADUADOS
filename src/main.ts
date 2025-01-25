import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

/* Global components */
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import VueVirtualScroller from 'vue-virtual-scroller';
import GraduadosApp from "@/views/layout/GraduadosApp.vue";
import GraduadosBlank from "@/views/layout/GraduadosBlank.vue";

import store from './store';

/* Form Validation configuration */
import { configure, defineRule } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import es from '@vee-validate/i18n/dist/locale/es.json';
import AllRules from '@vee-validate/rules';

configure({ generateMessage: localize('es', es) });

Object.keys(AllRules).forEach(rule => defineRule(rule, AllRules[rule]) );

// defineRule('test', (value, params) => {
//   console.log(value)
//   console.log(params)
//   return true
// });
/* End Form Validation configuration */

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
;

// Global Components
app.component('graduados-app', GraduadosApp);
app.component('graduados-blank', GraduadosBlank);
app.use(VueVirtualScroller)
  
router.isReady().then(() => {
  app.mount('#app');
});

