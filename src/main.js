import { createApp } from 'vue'
import '@/style.css'
import App from './App.vue'
import { createAppRouter } from './router'

const app = createApp(App)
const router = createAppRouter()

app.use(router)
app.mount('#app')
