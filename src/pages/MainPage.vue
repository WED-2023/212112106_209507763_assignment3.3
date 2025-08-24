

<!-- OPTION 3 FROM BOLT BELOW -->
<template>
  <div class="main-page">
    <BContainer fluid class="py-4">
      <BRow class="justify-content-center">
        <BCol cols="12" xl="11">
          <div class="welcome-section text-center mb-4">
            <h1 >Welcome to Goldfarb-Showgan Recipes</h1>
            <h3 >Discover amazing recipes and share your culinary adventures with the world!</h3>
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
                   size="xl"
                  @click="refreshRandomRecipes"
                  :disabled="loadingRandom"
                >
                 <!-- <RefreshCw class="me-2" :size="20" /> -->
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
                    <h5 class="card-title mb-3 welcome-title">New to Recipe World?</h5>
                    <p class="text-muted mb-3 welcome-subtext">Join our community and start your culinary journey!</p>
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
//import { RefreshCw } from 'lucide-vue-next';
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
        console.log(`Username found ${store.username}, fetching last viewed recipes...`);
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
        const response = await axios.get(`${store.server_domain}/api/recipes/random`, {
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
  /* background: linear-gradient(135deg, #b4d2de 0%, #bfd9dd 100%); */
  background: linear-gradient(135deg, #def6ff 0%, #dcf7f4 100%);

}

.RandomRecipes {
  margin: 10px 0;
}

.welcome-section h1 {

  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Segoe UI', 'Nunito', 'Avenir', Helvetica, Arial, sans-serif;
  color:black
}

.welcome-section h3 {

  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Segoe UI', 'Nunito', 'Avenir', Helvetica, Arial, sans-serif;
  color:black
}

.card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}


.welcome-title {
  color: #28a745; /* Bootstrap success green */
  font-size: 1.75rem;
  font-weight: 600;
}

.welcome-subtext {
  color: #28a745; /* Match green color */
  font-size: 1.1rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2.0rem;
  }
}
</style>
<!-- <style scoped>
.main-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #f8ffae 0%, #43c6ac 100%);
  padding-bottom: 40px;
  font-family: 'Segoe UI', 'Nunito', 'Avenir', Helvetica, Arial, sans-serif;
}

.welcome-section {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 32px;
  animation: fadeInDown 1s;
}

.welcome-section h2 {
  text-shadow: 2px 4px 18px rgba(67,198,172,0.12), 1px 1px 3px rgba(0,0,0,0.14);
  font-size: 2.6rem;
  font-weight: 800;
  color: #1a4e4d;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.welcome-section p {
  color: #277f79;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0;
}

.RandomRecipes {
  margin: 30px auto 0 auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

/* Card Styles */
.card {
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(67,198,172,0.13), 0 1.5px 0 rgba(255,255,255,0.08) inset;
  background: rgba(255,255,255,0.92);
  border: none;
  transition: transform 0.22s cubic-bezier(.36,1.44,.64,1), box-shadow 0.22s;
  overflow: hidden;
  min-width: 270px;
  max-width: 340px;
}

.card:hover {
  transform: translateY(-7px) scale(1.03);
  box-shadow: 0 12px 36px rgba(67,198,172,0.20), 0 2px 8px rgba(33,150,243,0.09);
}

.card-img-top {
  border-radius: 18px 18px 0 0;
  object-fit: cover;
  min-height: 180px;
  max-height: 220px;
  box-shadow: 0 2px 12px rgba(67,198,172,0.08);
}

.card-title {
  color: #1a4e4d;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #277f79;
  font-size: 1.08rem;
  font-weight: 450;
}

.btn-primary, .btn-primary:focus {
  background: linear-gradient(90deg, #43c6ac 0%, #191654 100%);
  border: none;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px rgba(33,150,243,0.09);
}

.btn-primary:hover {
  background: linear-gradient(90deg, #191654 0%, #43c6ac 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(67,198,172,0.16);
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .RandomRecipes {
    gap: 18px;
    max-width: 100%;
  }
  .card {
    min-width: 220px;
    max-width: 98vw;
  }
}

@media (max-width: 768px) {
  .welcome-section h2 {
    font-size: 1.7rem;
  }
  .RandomRecipes {
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .card {
    min-width: 90vw;
    max-width: 98vw;
  }
}
</style> -->
