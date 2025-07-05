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
          :recipes="recipes"
          :is-favorite="isFavorite"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
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
    isFavorite: { type: Boolean, default: false }
  },
  setup(props) {
    const recipes = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;
    const toast = appContext.config.globalProperties.toast;

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
      loading,
      error
    };
  }
}
</script>
