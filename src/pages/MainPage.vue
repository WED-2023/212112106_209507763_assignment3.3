<!-- <template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <RecipePreviewList title="Random Recipes" class="RandomRecipes center" />

    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>

    <RecipePreviewList
      title="Last Viewed Recipes"
      :class="{
        RandomRecipes: true,
        blur: !store.username,
        center: true
      }"
      disabled
    />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";



export default {
  name: "MainPage",
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style> -->



<!-- OPTION 2 BELOW -->
<!-- <template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <RecipePreviewList title="Random Recipes" class="RandomRecipes center" />

    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>

    <RecipePreviewList
      v-if="lastViewed.length"
      title="Last Viewed Recipes"
      :recipes="lastViewed"
      :class="{ RandomRecipes: true, blur: !store.username, center: true }"
    />
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from "vue";
import RecipePreviewList from "../components/RecipePreviewList.vue";
import axios from "axios";

export default {
  name: "MainPage",
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const lastViewed = ref([]);

    onMounted(async () => {
      if (!store.username) return;

      try {
        // Step 1: Get last viewed IDs
        const res = await axios.get(`${store.server_domain}/users/last`, {
          withCredentials: true
        });
        const ids = res.data;

        // Step 2: Fetch full data for each ID
        const requests = ids.map(id =>
          axios.get(`${store.server_domain}/recipes/${id}`, {
            withCredentials: true
          })
        );

        const responses = await Promise.allSettled(requests);
        lastViewed.value = responses
          .filter(r => r.status === "fulfilled")
          .map(r => r.value.data);

      } catch (err) {
        console.error("Failed to fetch last viewed recipes:", err);
      }
    });

    return { store, lastViewed };
  }
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px);
  filter: blur(2px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
</style> -->



<!-- OPTION 3 FROM BOLT BELOW -->

<template>
  <div class="main-page">
    <BContainer fluid class="py-4">
      <BRow class="justify-content-center">
        <BCol cols="12" xl="11">
          <div class="welcome-section text-center mb-4">
            <h2 class="text-white fw-bold mb-2">Welcome to Recipe World</h2>
            <p class="lead text-white-50">Discover amazing recipes and share your culinary adventures</p>
          </div>

          <BRow class="g-3">
            <!-- Left Column - Random Recipes -->
            <BCol cols="12" md="7">
              <!-- <RecipePreviewList title="Random Recipes" class="RandomRecipes center" /> -->
                <RecipePreviewList 
                title="Random Recipes" 
                class="RandomRecipes center"
                :recipes="randomRecipes"
              />

            <div class="text-center mt-3">
                <BButton 
                  variant="outline-primary" 
                  @click="refreshRandomRecipes"
                  :disabled="loadingRandom"
                >
                  <BSpinner 
                    small 
                    v-if="loadingRandom" 
                    class="me-2"
                  />
                  <i v-else class="fas fa-sync-alt me-2"></i>
                  {{ loadingRandom ? 'Refreshing...' : 'Get New Recipes' }}
                </BButton>
              </div>

            </BCol>

            <!-- Right Column -->
            <BCol cols="12" md="5">
              <div v-if="!store.username">
                <LoginCard class="mb-3" @login-success="fetchLastViewedRecipes" />
                <BCard class="shadow border-0">
                  <BCardBody class="text-center">
                    <h5 class="card-title mb-3">New to Recipe World?</h5>
                    <p class="text-muted mb-3">Join our community and start your culinary journey!</p>
                    <BButton
                      variant="success"
                      size="lg"
                      block
                      @click="$router.push('/register')"
                    >
                      <i class="fas fa-user-plus me-2"></i> Create Account
                    </BButton>
                  </BCardBody>
                </BCard>
              </div>

              <div v-else>
                <RecipePreviewList
                  title="Last Viewed Recipes"
                  :recipes="lastRecipes"
                  :class="{
                    //RandomRecipes: true,
                    center: true,
                  }"
                />
              </div>
            </BCol>
          </BRow>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue';
import { BContainer, BRow, BCol, BCard, BCardBody, BButton } from 'bootstrap-vue-3';
import RecipePreviewList from '../components/RecipePreviewList.vue';
import LoginCard from '../components/LoginCard.vue';
import {fetchRecipes} from "@/utils/recipeUtils";
import axios from 'axios';
export default {
  name: 'MainPage',
  components: {
    BContainer, BRow, BCol, BCard, BCardBody, BButton,
    RecipePreviewList,
    LoginCard
  },
  setup() {

    const randomRecipes = ref([]); //Random Recipes
    const loadingRandom = ref(false); //Loading spinner
    const loadingLast = ref(false); //Loading spinner

    const lastRecipes = ref([]);
    const error = ref(null);

    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;
    const toast = appContext.config.globalProperties.toast;

  // Log when the component is mounted
    onMounted(() => {
      console.log('MainPage Component Mounted');
      if (store.username) {
        console.log('Username found, fetching last viewed recipes...');
        fetchLastViewedRecipes();
      } else {
        console.log('No username found during onMounted.');
      }
      refreshRandomRecipes();
    });



    const fetchLastViewedRecipes = async () => {
      error.value = null;
      loadingLast.value = true;
      try {
        lastRecipes.value = await fetchRecipes({
          path: '/users/last',
          serverDomain: store.server_domain,
          logPurpose: 'Last Viewed'
        });
      } catch (err) {
        error.value = 'Failed to load favorite recipes.';
        toast('Error', error.value, 'error');
      } finally {
        loadingLast.value = false;
      }
    }


    const refreshRandomRecipes = async () => {
      loadingRandom.value = true;
      try {
        const response = await axios.get(`${store.server_domain}/recipes/random`, {
          withCredentials: true
        });
        console.log("Random recipes in refresh:", response.data); //  Check image/title/etc. here
        randomRecipes.value = response.data;
      } catch (err) {
        console.error("Error fetching random recipes:", err);
      }finally {
        loadingRandom.value = false;
      }
    };

    // onMounted(() => {
    //   if (store.username) {
    //     fetchLastViewedRecipes();
    //   }
    //   refreshRandomRecipes();
    // });

    return {
      store,
      lastRecipes,
      randomRecipes,
      loadingLast,
      loadingRandom,
      error,
      fetchLastViewedRecipes,
      refreshRandomRecipes
    };
  }
};
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%);
}

.RandomRecipes {
  margin: 10px 0;
}

.welcome-section h2 {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  font-size: 2.2rem;
}

.card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .welcome-section h2 {
    font-size: 1.8rem;
  }
}
</style>
