<template>
  <div class="container mt-4">
    <h1 class="mb-4">{{ title }}</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading your {{title}}...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="recipes.length === 0" class="alert alert-info">
      You don't have any {{ title }} yet.
    </div>

    <div v-else>
      <RecipePreviewList
          title=""
          :recipes="sortedRecipes" 
          :is-favorite="isFavorite"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import RecipePreviewList from '@/components/RecipePreviewList.vue';
import { fetchRecipes } from '@/utils/recipeUtils';

export default {
  name: 'GenericRecipePreviewPage',
  components: { RecipePreviewList },
  props: {
    title: { type: String, required: true },
    fetchPath: { type: String, required: false },
    recipeIDs: { type: Array, required: false },
    logPurpose: { type: String, default: 'Recipe Page' },
    sortBy: { type: String, default: 'popularity' },
    isFavorite: { type: Boolean, default: false }
    
  },
  setup(props) {
    const recipes = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;
    const toast = appContext.config.globalProperties.toast;

    const sortedRecipes = computed(() => {
      if (!recipes.value || recipes.value.length === 0) return [];
      if (props.sortBy === 'duration') {
        return [...recipes.value].sort((a, b) => (a.readyInMinutes ?? 99999) - (b.readyInMinutes ?? 99999));
      } else {
        return [...recipes.value].sort((a, b) => (b.aggregateLikes ?? 0) - (a.aggregateLikes ?? 0));
      }
    });

    onMounted(async () => {
      try {
        recipes.value = await fetchRecipes({
          path: props.fetchPath,
          ids: props.recipeIDs || null, //by abed
          withCredentials: true, // by abed
          serverDomain: store.server_domain,
          logPurpose: props.logPurpose
        });
      console.log('Loaded recipes in genericPreview:', recipes.value); // <-- Add this
      } catch (err) {
        error.value = 'Failed to load recipes.';
        toast('Error', error.value, 'error');
      } finally {
        loading.value = false;
      }
    });

    return {
      recipes,
      sortedRecipes,
      loading,
      error
    };
  }
}
</script>
