import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入用户状态管理
import { useUserStore } from './stores/userStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化用户信息（在应用挂载前）
const userStore = useUserStore(pinia)
userStore.initUser()

app.mount('#app')
