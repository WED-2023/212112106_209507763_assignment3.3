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

<!-- <template>
  <div id="app">
    <b-navbar type="dark" variant="primary" class="mb-4" toggleable="lg">
      <b-navbar-brand :to="{ name: 'main' }" tag="router-link">Vue Recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>

       
        <b-navbar-nav class="me-auto">
          <b-nav-item :to="{ name: 'main' }" tag="router-link">Home</b-nav-item>
          <b-nav-item :to="{ name: 'search' }" tag="router-link">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }" tag="router-link">About</b-nav-item>
        </b-navbar-nav>

   
        <b-navbar-nav class="ms-auto">
     
          <template v-if="!store.username">
            <b-nav-text class="text-white me-2">Hello guest</b-nav-text>
            <b-nav-item :to="{ name: 'login' }" tag="router-link">Login</b-nav-item>
            <b-nav-item :to="{ name: 'register' }" tag="router-link">Register</b-nav-item>
          </template>

    
          <template v-else>
            <b-nav-text class="text-white me-3">{{ store.username }}</b-nav-text>

            <b-nav-item :to="{ name: 'createRecipe' }" tag="router-link">Create Recipe</b-nav-item>

            <b-nav-item-dropdown text="Personal" right @click="console.log('clicked!')">
              <b-dropdown-item :to="{ name: 'favorites' }" tag="router-link">My Favorite Recipes</b-dropdown-item>
              <b-dropdown-item>
                <router-link :to="{ name: 'favorites' }" class="dropdown-item">My Favorite Recipes</router-link>
              </b-dropdown-item>
              <b-dropdown-item :to="{ name: 'myRecipes' }" tag="router-link">My Recipes</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'familyRecipes' }" tag="router-link">My Family Recipes</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-button variant="link" @click="logout" class="p-0 text-white ms-3">Logout</b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template> -->

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link class="navbar-brand" :to="{ name: 'main' }">Vue Recipes</router-link>

        <!-- Toggler for small screens -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <!-- Left side links -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'main' }">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'search' }">Search</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'about' }">About</router-link>
            </li>
          </ul>

          <!-- Right side user controls -->
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <!-- Guest view -->
            <template v-if="!store.username">
              <li class="nav-item">
                <span class="navbar-text text-white me-2">Hello guest</span>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'register' }">Register</router-link>
              </li>
            </template>

            <!-- Logged-in view -->
            <template v-else>
              <li class="nav-item">
                <span class="navbar-text text-white me-3">{{ store.username }}</span>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'createRecipe' }">Create Recipe</router-link>
              </li>
              <!-- Personal dropdown -->
       <!-- <li class="nav-item dropdown">
          <button
            class="nav-link dropdown-toggle btn btn-link text-white"
            type="button"
            id="personalDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Personal
          </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="personalDropdown">
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">My Family Recipes</router-link>
                  </li>
                </ul>
              </li> -->

                    <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'myRecipes' }">My Recipes</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'familyRecipes' }">My Family Recipes</router-link>
              </li>
              <li class="nav-item">
                <button class="btn btn-link nav-link text-white" @click="logout">Logout</button>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

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
