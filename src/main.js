import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { req } from './api/index'
import path from './api/path'
import map from '@/utils/map.js'
import tinymce from 'tinymce'
import VueTinymce from "@packy-tang/vue-tinymce"

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueTinymce);
Vue.prototype.$http = req;
Vue.prototype.$path = path;
Vue.prototype.$map = map;
Vue.prototype.$tinymce = tinymce;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')