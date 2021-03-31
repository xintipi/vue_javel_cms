// Import Core
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// import Plugins
import './plugins'
import './plugins/progress-bar'
import './plugins/lazyload'
import './plugins/validation'
import './plugins/antdesign'
import i18n from './plugins/i18n'

// import filter
import './utils/filters'
import './mixins/global.mixin'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n: i18n, // language
  render: h => h(App)
}).$mount('#app')
