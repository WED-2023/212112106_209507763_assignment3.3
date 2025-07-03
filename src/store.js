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
    // Clear cookies manually (optional, but ensures all cookies are cleared) BY ABED 03072025
    document.cookie = "session=; path=/; domain=goldfarb-showgan.cs.bgu.ac.il; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    this.username = undefined;
  }
});

export default store;
