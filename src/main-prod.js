import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')