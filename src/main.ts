import { createApp } from "vue";
import "@/styles/main.scss";
import App from "@/App.vue";

import Router from "@/router";
import { Pinia } from "@/store";

const vueApp = createApp(App);

vueApp.use(Router);
vueApp.use(Pinia);

vueApp.mount("#app");
