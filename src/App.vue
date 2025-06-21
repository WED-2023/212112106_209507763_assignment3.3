<!-- <template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        {{ store.username }}:
        <button @click="logout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div>


    <router-view />
  </div>
</template> -->

<template>
  <div id="app">
    <!-- Bootstrap Navbar -->
    <b-navbar type="dark" variant="primary" class="mb-4" toggleable="lg">
      <b-navbar-brand :to="{ name: 'main' }" tag="router-link">Vue Recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>

        <!-- Common Tabs -->
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }" tag="router-link">Home</b-nav-item>
          <b-nav-item :to="{ name: 'search' }" tag="router-link">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }" tag="router-link">About</b-nav-item>
        </b-navbar-nav>

        <!-- User-Specific Tabs -->
        <b-navbar-nav class="ml-auto">
          <!-- Guest View -->
          <template v-if="!store.username">
            <b-nav-text class="text-white mr-2">Hello guest</b-nav-text>
            <b-nav-item :to="{ name: 'login' }" tag="router-link">Login</b-nav-item>
            <b-nav-item :to="{ name: 'register' }" tag="router-link">Register</b-nav-item>
          </template>

          <!-- Logged-In View -->
          <template v-else>
            <b-nav-text class="text-white mr-3">{{ store.username }}</b-nav-text>

            <b-nav-item-dropdown text="My Area" right>
              <b-dropdown-item :to="{ name: 'favorites' }" tag="router-link">My Favorite Recipes</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'myRecipes' }" tag="router-link">My Recipes</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'familyRecipes' }" tag="router-link">My Family Recipes</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item :to="{ name: 'createRecipe' }" tag="router-link">Create New Recipe</b-nav-item>

            <b-button variant="link" @click="logout" class="p-0 text-white ml-3">Logout</b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>
 

<script>
import { getCurrentInstance } from 'vue';
import axios from 'axios';
export default {
  name: "App",
    components: {

    },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    // const logout = () => {
    //   store.logout();
    //   toast("Logout", "User logged out successfully", "success");
    //   router.push("/").catch(() => {});
    // };
  const logout = async () => {
  try {
    await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    store.logout(); // your custom logout method
    toast("Logout", "User logged out successfully", "success");
    router.push("/").catch(() => {});
  } catch (error) {
    toast("Error", "Failed to log out", "error");
    console.error(error);
  }
};
    return { store, logout };
  }
}

</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
