import { reactive } from 'vue';

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: process.env.VUE_APP_SERVER_DOMAIN || 'http://localhost:3000',
  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem('username');
    this.username = undefined;
  }
});

export default store;
