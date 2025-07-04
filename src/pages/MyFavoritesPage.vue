<template>
  <div class="container mt-4">
    <h1 class="mb-4">My Favorite Recipes</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading your favorite recipes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="recipes.length === 0" class="alert alert-info">
      You don't have any favorite recipes yet.
    </div>

    <!-- Recipe List -->
    <div v-else>
      <RecipePreviewList
          title="My Favorite Recipes"
          :recipes="recipes"
          :is-favorite="true"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';

import RecipePreviewList from '@/components/RecipePreviewList.vue';
import { fetchRecipes } from '@/utils/recipeUtils';
export default {
  name: 'MyFavoritesPage',
  components: {
    RecipePreviewList
  },
  setup() {
    const recipes = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;
    const toast = appContext.config.globalProperties.toast;

    async function fetchFavorites() {
      loading.value = true;
      error.value = null;

      try {
        recipes.value = await fetchRecipes({
          path: '/users/favoriteRecipes',
          serverDomain: store.server_domain,
          logPurpose: 'Favorites Page'
        });
      } catch (err) {
        error.value = 'Failed to load favorite recipes.';
        toast('Error', error.value, 'error');
      } finally {
        loading.value = false;
      }
    }


    onMounted(fetchFavorites);

    return {
      recipes,
      loading,
      error,
    };
  }
}
</script>

<style scoped>
/* optional styling */
</style>
