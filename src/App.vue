
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
              <!-- <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'createRecipe' }">Create Recipe</router-link>
              </li> -->

            <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="openCreateRecipeModal">Create Recipe</a>
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


        <!-- CreateRecipeModal component -->
    <CreateRecipeModal @recipe-created-success="onRecipeCreated" ref="createModal" />
    <router-view />
  </div>
</template>



<script>
import * as bootstrap from 'bootstrap';
import { getCurrentInstance } from 'vue';
import CreateRecipeModal from './components/CreateRecipeModal.vue';
import axios from 'axios';
export default {
  name: "App",
    components: {
    CreateRecipeModal,
    },
  methods: {
        openCreateRecipeModal() {
      // Use Bootstrap JS API to show modal
      const modalEl = document.getElementById('createRecipeModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    },
    onRecipeCreated() {
      // Optional: You can refresh a recipe list or show a toast here
      console.log('Recipe created successfully!');
    },
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

    // const openCreateRecipeModal = () => {
    //   const createModal = internalInstance.appContext.config.globalProperties.$refs.createModal;
    //   if (createModal) {
    //     createModal.show();
    //   } else {
    //     console.error("CreateRecipeModal reference not found");
    //   }
    // };

  
  const logout = async () => {
  try {
    await axios.post(`${process.env.VUE_APP_SERVER_DOMAIN}/auth/logout`, {}, { withCredentials: true });
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
