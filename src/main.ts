// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

import LiquidGlassUI from './components/index.js'
import './styles/style.scss'

const app = createApp(App)
app.use(LiquidGlassUI)

app.mount('#app')
