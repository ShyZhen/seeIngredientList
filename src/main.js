import Vue from 'vue'
import App from './App'
import store from './store'
import { toast, loading, toLogin, toBack, toHome, reLunchBack } from './utils/global.js'

// 字体图标库
import './common/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.prototype.$loading = loading
Vue.prototype.$toast = toast
Vue.prototype.$toLogin = toLogin
Vue.prototype.$toBack = toBack
Vue.prototype.$toHome = toHome
Vue.prototype.$reLunchBack = reLunchBack

// 兼容H5
Vue.prototype.$systemInfoSync = uni.getSystemInfoSync()
Vue.prototype.$menuButtonRect = uni.getMenuButtonBoundingClientRect()

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
