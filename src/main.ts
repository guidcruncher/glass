// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

import "./styles/style.scss";
import LiquidGlassUI from "./components/index.js";

const app = createApp(App);
app.use(LiquidGlassUI);

app.mount("#app");
