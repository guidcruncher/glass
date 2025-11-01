import { createApp } from 'vue'
import App from './App.vue'

// 1. Import the Component Library Plugin
import '@/scss/style.scss'
import LiquidGlassUI from './components/index.js'

const app = createApp(App)
app.use(LiquidGlassUI)

app.mount('#app')
