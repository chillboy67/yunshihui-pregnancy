import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)

	//添加全局变量
	// app.config.globalProperties.$apiUrl = 'http://localhost:8000/api/' //网页端
	app.config.globalProperties.$apiUrl = 'http://192.168.137.1:8000/api/' //手机端

	return {
		app
	}
}
// #endif