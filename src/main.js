import { createApp } from 'vue'
import '@/style.css'
import App from './App.vue'
import { createAppRouter } from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
const router = createAppRouter()

app.use(pinia)
app.use(router)
app.mount('#app')
