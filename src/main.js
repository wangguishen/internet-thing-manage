import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
/*import axios from 'axios';*/
import '@/config/api'
//import '@/style/style.scss'
import store from './store/index.js';
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import ElementUI from 'element-ui';
/*import 'element-ui/lib/theme-chalk/index.css';*/
import './assets/iconfont.css'
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(preview)
/*Vue.prototype.$axios = axios;*/
Vue.config.productionTip = false;
Vue.prototype.NAME_MAX_LENGTH = '50'
Vue.prototype.DESC_MAX_LENGTH = '200'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
