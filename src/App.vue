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
              <!-- <li class="nav-item">
                <span class="navbar-text text-white me-3">{{ store.username }}</span>
              </li> -->
                <li class="nav-item d-flex align-items-center">
            <span class="navbar-text text-white me-3">
                  {{ store.username ? store.username : 'Hello Guest' }}
                </span>
              </li>
          </ul>

          <!-- Right side user controls -->
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <!-- Guest view -->
            <template v-if="!store.username">
              <!-- <li class="nav-item">
                <span class="navbar-text text-white me-2">Hello guest</span>
              </li> -->
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
                <a class="nav-link" href="#" @click.prevent="openCreateRecipeModal">Create Recipe</a>
              </li>
              <!-- <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'myRecipes' }">My Recipes</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" :to="{ name: 'familyRecipes' }">My Family Recipes</router-link>
              </li> -->
            <!-- Personal Dropdown -->
            <li class="nav-item dropdown">
           <a
              class="nav-link dropdown-toggle"
              href="#"
              id="personalDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
                Personal
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="personalDropdown">
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">Family Recipes</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" :to="{ name: 'favorites' }">My Favorite Recipes</router-link>
                </li>
              </ul>
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
    <!-- Session loading spinner (below nav) -->
    <div v-if="loadingSession" class="text-center my-5">
      <b-spinner class="me-2" />
      <span>Loading session...</span>
    </div>

    <!--  Actual route content (after session is ready) -->
    <router-view v-else />
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { ref, getCurrentInstance, onMounted  } from 'vue';
import CreateRecipeModal from './components/CreateRecipeModal.vue';
import axios from 'axios';
import { checkSession } from '@/utils/session';

export default {
  name: "App",
  components: {
    CreateRecipeModal
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
    }
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const loadingSession = ref(true);


    onMounted(async () => {
      await checkSession(store, toast, false);
      loadingSession.value = false;
    });

    const logout = async () => {
      try {
        await axios.post(`${process.env.VUE_APP_SERVER_DOMAIN}/api/auth/logout`, {}, { withCredentials: true });
        store.logout(); // your custom logout method
        toast("Logout", "User logged out successfully", "success");
        router.push("/").catch(() => {});
      } catch (error) {
        toast("Error", "Failed to log out", "error");
        console.error(error);
      }
    };

    return { store, logout, loadingSession };
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


//by ABed
.navbar-text {
  font-weight: 500;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}

/* Stylish Navbar */
.navbar.bg-primary {
  background: linear-gradient(90deg, #1565c0 0%, #1976d2 60%, #2196f3 100%) !important;
  border-radius: 2px;
  box-shadow: 0 4px 18px rgba(21, 101, 192, 0.12), 0 1.5px 0 rgba(255,255,255,0.08) inset;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0.5rem 2rem;
  position: relative;
}

/* Brand */
.navbar-brand {
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #fff !important;
  text-shadow: 0 2px 6px rgba(33,150,243,0.18);
  transition: color 0.18s;
}

/* Nav links */
.navbar-nav .nav-link {
  color: #fff !important;
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 8px;
  margin-right: 6px;
  padding: 0.5rem 1rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link:focus {
  background: rgba(255,255,255,0.12);
  color: #ffd600 !important;
  box-shadow: 0 2px 8px rgba(33,150,243,0.13);
  text-decoration: none;
}

.navbar-nav .nav-link.router-link-exact-active {
  background: rgba(255,255,255,0.18);
  color: #ffd600 !important;
  font-weight: 700;
}

/* Navbar text (Hello user) */
.navbar-text {
  color: #fff !important;
  font-size: 1.09rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 5px;
  text-shadow: 0 1px 4px rgba(33,150,243,0.16);
}

/* Dropdown menu */
.navbar-nav .dropdown-menu {
  background: #1976d2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(33,150,243,0.13);
  min-width: 200px;
  border: none;
  padding: 0.5rem 0;
}

.navbar-nav .dropdown-item {
  color: #fff;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  transition: background 0.14s, color 0.14s;
}

.navbar-nav .dropdown-item:hover,
.navbar-nav .dropdown-item:focus {
  background: #1565c0;
  color: #ffd600;
}

/* Logout button styling */
.btn-link.nav-link {
  color: #fff !important;
  font-weight: 600;
  text-decoration: underline;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.14s, color 0.14s;
}

.btn-link.nav-link:hover,
.btn-link.nav-link:focus {
  background: rgba(255,255,255,0.12);
  color: #ffd600 !important;
}

/* Responsive tweaks */
@media (max-width: 991px) {
  .navbar.bg-primary {
    padding: 0.5rem 1rem;
    border-radius: 0 0 18px 18px;
  }
  .navbar-brand {
    font-size: 1.3rem;
  }
  .navbar-text {
    font-size: 1rem;
  }
}

// by ABed
</style>