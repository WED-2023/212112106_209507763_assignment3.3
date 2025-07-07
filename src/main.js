import { createApp, reactive } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';
import { checkSession } from './utils/session';

// Bootstrap CSS + JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { BContainer, BRow, BCol } from 'bootstrap-vue-3';


// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
});


// Guard only for protected routes
router.beforeEach(async (to, from, next) => {
    const protectedRoutes = ['/personal', '/favorites'];

    if (protectedRoutes.includes(to.path)) {
        const ok = await checkSession(store, app.config.globalProperties.toast);

        if (!ok) {
            router.push("/").catch(() => {});
            return;
        }
    }

    next();
});

// Shared store
const store = reactive({
  username: undefined,  // no longer trust localStorage blindly
  server_domain: process.env.VUE_APP_SERVER_DOMAIN || 'http://localhost:3000',

  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log(`${this.username} logged IN`);
  },

  logout() {
    console.log(`${this.username} logged OUT`);
    localStorage.removeItem('username');
    this.username = undefined;
  },
});



// Axios interceptors
axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));

(async () => {
    await checkSession(store, () => {}, false, true);
})();


// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);

// Register global BootstrapVue3 components
app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);



// Global store
app.config.globalProperties.store = store;

//toast by Abed
app.config.globalProperties.toast = (title, message, type) => {
  alert(`[${type.toUpperCase()}] ${title}: ${message}`);
};
//toast by Abed
// Mount app
app.mount('#app');
