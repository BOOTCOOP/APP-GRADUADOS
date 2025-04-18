import { createApp } from "vue";
import App from "./App.vue";
import FontAwesomeIcon from "./font-awesome";
import router from "./router";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/display.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";

/* Theme variables */
import "./theme/global.css";
import "./theme/variables.css";

/* Global components */
import GraduadosApp from "@/views/layout/GraduadosApp.vue";
import GraduadosBlank from "@/views/layout/GraduadosBlank.vue";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import store from "./store";

/* Form Validation configuration */
import { localize } from "@vee-validate/i18n";
import es from "@vee-validate/i18n/dist/locale/es.json";
import * as AllRules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

configure({ generateMessage: localize("es", es) });

Object.keys(AllRules).forEach((rule) => {
  if (typeof AllRules[rule] === "function") {
    defineRule(rule, AllRules[rule]);
  }
});
// defineRule('test', (value, params) => {
//   console.log(value)
//   console.log(params)
//   return true
// });
/* End Form Validation configuration */

const app = createApp(App).use(IonicVue).use(router).use(store);
// Global Components
app.component("graduados-app", GraduadosApp);
app.component("graduados-blank", GraduadosBlank);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(VueVirtualScroller);

router.isReady().then(() => {
  app.mount("#app");
});
