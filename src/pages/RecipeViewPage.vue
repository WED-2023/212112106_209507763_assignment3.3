<!-- <template>
    <div class="container">
      <div v-if="recipe">
        <div class="recipe-header mt-3 mb-4">
          <h1>{{ recipe.title }}</h1>
          <img :src="recipe.image" class="center" />
        </div>
        <div class="recipe-body">
          <div class="wrapper">
            <div class="wrapped">
              <div class="mb-3">
                <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
                <div>Likes: {{ recipe.aggregateLikes }} likes</div>
              </div>
              Ingredients:
              <ul>
                <li
                  v-for="(r, index) in recipe.extendedIngredients"
                  :key="index + '_' + r.id"
                >
                  {{ r.original }}
                </li>
              </ul>
            </div>
            <div class="wrapped">
              Instructions:
              <ol>
                <li v-for="s in recipe._instructions" :key="s.number">
                  {{ s.step }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        recipe: null
      };
    },
    async created() {
      try {
        let response;
        // response = this.$route.params.response;
  
        try {
          response = await this.axios.get(
            // "https://test-for-3-2.herokuapp.com/recipes/info",
            this.$root.store.server_domain + "/recipes/info",
            {
              params: { id: this.$route.params.recipeId }
            }
          );
  
          // console.log("response.status", response.status);
          if (response.status !== 200) this.$router.replace("/NotFound");
        } catch (error) {
          console.log("error.response.status", error.response.status);
          this.$router.replace("/NotFound");
          return;
        }
  
        let {
          analyzedInstructions,
          instructions,
          extendedIngredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title
        } = response.data.recipe;
  
        let _instructions = analyzedInstructions
          .map((fstep) => {
            fstep.steps[0].step = fstep.name + fstep.steps[0].step;
            return fstep.steps;
          })
          .reduce((a, b) => [...a, ...b], []);
  
        let _recipe = {
          instructions,
          _instructions,
          analyzedInstructions,
          extendedIngredients,
          aggregateLikes,
          readyInMinutes,
          image,
          title
        };
  
        this.recipe = _recipe;
      } catch (error) {
        console.log(error);
      }
    }
  };
  </script>
  
  <style scoped>
  .wrapper {
    display: flex;
  }
  .wrapped {
    width: 50%;
  }
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  </style>
   -->

<template>
  <div class="container mt-4" v-if="loaded">
    <div v-if="recipe">
      <!-- Header: title and image -->
      <div class="recipe-header text-center mb-4">
        <h1>{{ recipe.recipe_title }}</h1>
        <img
          v-if="recipe.recipe_image"
          :src="recipe.recipe_image"
          class="img-fluid mx-auto d-block"
          alt="Recipe image"
          style="max-height: 400px; object-fit: cover;"
        />
      </div>

      <!-- Basic info and actions -->
      <div class="d-flex flex-wrap align-items-center mb-3">
        <div class="me-4">
          <strong>Prep Duration:</strong> {{ recipe.prep_duration }}
        </div>
        <div class="me-4">
          <strong>Popularity:</strong> {{ recipe.popularity }}
        </div>
        <div class="me-4">
          <strong>Meals:</strong> {{ recipe.amount_of_meals }}
        </div>
        <div class="me-4">
          <strong>Status:</strong>
          <span v-if="viewed" class="text-success">Viewed</span>
          <span v-else class="text-muted">Not viewed before</span>
        </div>
        <div>
          <button
            class="btn"
            :class="favorite ? 'btn-danger' : 'btn-outline-danger'"
            @click="toggleFavorite"
            :disabled="favoriteLoading"
          >
            <span v-if="favorite">❤️ Favorited</span>
            <span v-else>🤍 Add to Favorites</span>
          </button>
        </div>
      </div>

      <!-- Dietary badges -->
      <div class="mb-4">
        <span v-if="recipe.vegan" class="badge bg-success me-1">Vegan</span>
        <span v-else-if="recipe.vegetarian" class="badge bg-info text-dark me-1">Vegetarian</span>
        <span v-if="recipe.gluten_free" class="badge bg-warning text-dark me-1">Gluten Free</span>
      </div>

      <!-- Ingredients -->
      <div class="mb-4">
        <h4>Ingredients</h4>
        <ul>
          <li v-for="(ing, idx) in recipe.ingredients" :key="ing.name + idx">
            {{ ing.name }} — {{ ing.amount }}
          </li>
        </ul>
      </div>

      <!-- Instructions -->
      <div class="mb-4">
        <h4>Instructions</h4>
        <pre style="white-space: pre-wrap;">{{ recipe.instructions }}</pre>
      </div>
    </div>
    <div v-else>
      <p class="text-danger">Recipe not found or failed to load.</p>
    </div>
  </div>
  <div v-else class="text-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, getCurrentInstance } from 'vue';

export default {
  name: "RecipeViewPage",
  setup() {
    const internal = getCurrentInstance();
    const store = internal.appContext.config.globalProperties.store;
    const toast = internal.appContext.config.globalProperties.toast;
    const router = internal.appContext.config.globalProperties.$router;
    const route = internal.appContext.config.globalProperties.$route;
    const server = store.server_domain;

    const recipe = ref(null);
    const loaded = ref(false);
    const viewed = ref(false);
    const favorite = ref(false);
    const favoriteLoading = ref(false);

    onMounted(async () => {
      const recipeId = route.params.recipeId;
      if (!recipeId) {
        router.replace("/NotFound");
        return;
      }

      // 1. Fetch full details
      try {
        const resp = await axios.get(`${server}/api/recipes/${recipeId}`, {
          withCredentials: true
        });
        const data = resp.data;
        if (!data) {
          router.replace("/NotFound");
          return;
        }
        recipe.value = data;

        // Initialize viewed/favorite from response flags
        viewed.value = Boolean(data.clicked_by_user);
        favorite.value = Boolean(data.saved_by_user);
      } catch (err) {
        console.error("Failed to fetch recipe details:", err);
        router.replace("/NotFound");
        return;
      }

      // 2. If not yet recorded view but user is logged in, send POST to record
      if (store.username && !viewed.value) {
        try {
          await axios.post(`${server}/users/clickOnRecipe`, { recipeId }, {
          withCredentials: true
        });
          viewed.value = true;
        } catch (err) {
          console.error("Failed to record view:", err);
          // ignore
        }
      }

      loaded.value = true;
    });

    const toggleFavorite = async () => {
      if (!store.username) {
        toast("Error", "Please log in to favorite recipes", "error");
        return;
      }
      if (favorite.value) {
        // Already saved; no removal implemented here
        return;
      }
      const recipeId = route.params.recipeId;
      favoriteLoading.value = true;
      try {
        // Use your POST /favoriteRecipes/:recipeId endpoint
        await axios.post(`${server}/users/favoriteRecipes/${recipeId}`, {}, {
          withCredentials: true
        });
        
        favorite.value = true;
        toast("Success", "Added to favorites", "success");
      } catch (err) {
        console.error("Failed to add favorite:", err);
        toast("Error", "Could not add to favorites", "error");
      } finally {
        favoriteLoading.value = false;
      }
    };

    return {
      recipe,
      loaded,
      viewed,
      favorite,
      favoriteLoading,
      toggleFavorite,
    };
  }
};
</script>

<style scoped>
.recipe-header img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
