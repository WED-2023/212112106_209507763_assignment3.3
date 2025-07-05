<template>
  <div class="container search-page">
    <h1 class="title">Search Recipes</h1>

    <!-- Search Bar & Filters -->
    <b-form @submit.prevent="onSearch">
      <div class="row align-items-end">
        <div class="col-md-5 mb-2">
          <b-form-group label="Search for recipes">
            <b-form-input
              v-model="searchQuery"
              placeholder="Enter recipe keyword..."
              autocomplete="off"
            />
          </b-form-group>
        </div>

        <div class="col-md-2 mb-2">
          <b-form-group label="Amount">
            <b-form-select v-model="amount" :options="amountOptions" />
          </b-form-group>
        </div>

        <div class="col-md-2 mb-2">
          <b-form-group label="Cuisine">
            <b-form-select v-model="selectedCuisine" :options="cuisineOptions" />
          </b-form-group>
        </div>

        <div class="col-md-2 mb-2">
          <b-form-group label="Diet">
            <b-form-select v-model="selectedDiet" :options="dietOptions" />
          </b-form-group>
        </div>

        <div class="col-md-2 mb-2">
          <b-form-group label="Intolerance">
            <b-form-select v-model="selectedIntolerance" :options="intoleranceOptions" />
          </b-form-group>
        </div>

        <div class="col-md-1 mb-2">
          <b-button type="submit" variant="primary" class="w-100">Search</b-button>
        </div>
      </div>
    </b-form>

   
    <!-- <div v-if="isLoggedIn && lastSearchResult" class="mt-4">
      <h5>Last Searched Recipe</h5>
      <RecipePreview :recipe="lastSearchResult" />
    </div>

  
    <div class="mt-4">
      <RecipePreviewList :recipes="recipes" v-if="recipes.length" />
      <div v-else-if="searched" class="alert alert-info mt-3">No results found.</div>
    </div>
  </div> -->

    
    <!-- Show last search results if logged in and no search yet -->
    <div class="mt-4" v-if="showLastSearch">
      <GenericRecipePreviewPage
        title="Your Last Search Results"
        fetch-path="/recipes/search"
        log-purpose="Last Search"
      />
    </div>

    <!-- Show current search results if a search was performed -->
    <div class="mt-4" v-if="showSearchResults">
      <GenericRecipePreviewPage
        :title="resultsTitle"
        :recipeIDs="recipeIDs"
        log-purpose="Recipe Search"
      />
    </div>
    </div>
</template>

<!-- <script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue';
import GenericRecipePreviewPage from '@/components/GenericRecipePreviewPage.vue';
import axios from 'axios';
import RecipePreview from '@/components/RecipePreview.vue';
import RecipePreviewList from '@/components/RecipePreviewList.vue';
import { normalizeRecipe} from '@/utils/recipeUtils.js'; // Adjust path 
// Bootstrap-Vue components assumed to be globally registered

const internalInstance = getCurrentInstance();
const store = internalInstance.appContext.config.globalProperties.store;

const searchQuery = ref('');
const amount = ref(5);
const selectedCuisine = ref('');
const selectedDiet = ref('');
const selectedIntolerance = ref('');
const recipes = ref([]);
 const lastSearchResult = ref(null);
 const searched = ref(false);

const showResults = ref(false); // Show last search results if logged in
const showSearchResults = ref(false);

const amountOptions = [
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
];

// Official Spoonacular options
const cuisineOptions = [
  { value: '', text: 'All Cuisines' },
  { value: 'African', text: 'African' },
  { value: 'American', text: 'American' },
  { value: 'British', text: 'British' },
  { value: 'Cajun', text: 'Cajun' },
  { value: 'Caribbean', text: 'Caribbean' },
  { value: 'Chinese', text: 'Chinese' },
  { value: 'Eastern European', text: 'Eastern European' },
  { value: 'European', text: 'European' },
  { value: 'French', text: 'French' },
  { value: 'German', text: 'German' },
  { value: 'Greek', text: 'Greek' },
  { value: 'Indian', text: 'Indian' },
  { value: 'Irish', text: 'Irish' },
  { value: 'Italian', text: 'Italian' },
  { value: 'Japanese', text: 'Japanese' },
  { value: 'Jewish', text: 'Jewish' },
  { value: 'Korean', text: 'Korean' },
  { value: 'Latin American', text: 'Latin American' },
  { value: 'Mediterranean', text: 'Mediterranean' },
  { value: 'Mexican', text: 'Mexican' },
  { value: 'Middle Eastern', text: 'Middle Eastern' },
  { value: 'Nordic', text: 'Nordic' },
  { value: 'Southern', text: 'Southern' },
  { value: 'Spanish', text: 'Spanish' },
  { value: 'Thai', text: 'Thai' },
  { value: 'Vietnamese', text: 'Vietnamese' },
];

const dietOptions = [
  { value: '', text: 'All Diets' },
  { value: 'Gluten Free', text: 'Gluten Free' },
  { value: 'Ketogenic', text: 'Ketogenic' },
  { value: 'Vegetarian', text: 'Vegetarian' },
  { value: 'Lacto-Vegetarian', text: 'Lacto-Vegetarian' },
  { value: 'Ovo-Vegetarian', text: 'Ovo-Vegetarian' },
  { value: 'Vegan', text: 'Vegan' },
  { value: 'Pescetarian', text: 'Pescetarian' },
  { value: 'Paleo', text: 'Paleo' },
  { value: 'Primal', text: 'Primal' },
  { value: 'Low FODMAP', text: 'Low FODMAP' },
  { value: 'Whole30', text: 'Whole30' },
];

const intoleranceOptions = [
  { value: '', text: 'All Intolerances' },
  { value: 'Dairy', text: 'Dairy' },
  { value: 'Egg', text: 'Egg' },
  { value: 'Gluten', text: 'Gluten' },
  { value: 'Grain', text: 'Grain' },
  { value: 'Peanut', text: 'Peanut' },
  { value: 'Seafood', text: 'Seafood' },
  { value: 'Sesame', text: 'Sesame' },
  { value: 'Shellfish', text: 'Shellfish' },
  { value: 'Soy', text: 'Soy' },
  { value: 'Sulfite', text: 'Sulfite' },
  { value: 'Tree Nut', text: 'Tree Nut' },
  { value: 'Wheat', text: 'Wheat' },
];

const isLoggedIn = ref(false);

onMounted(async () => {
  // Detect login status
  isLoggedIn.value = !!store.username;

  // If logged in, fetch last search
  if (isLoggedIn.value) {
    try {
      const resp = await axios.get(`${store.server_domain}/recipes/search`, {
        withCredentials: true,
      });
      if (resp.data && Array.isArray(resp.data) && resp.data.length > 0) {
       // lastSearchResult.value = resp.data[0]; // Show first result from last search
        lastSearchResult.value = normalizeRecipe(resp.data[0]); // Normalize!
      }
    } catch (err) {
      lastSearchResult.value = null;
    }
  }
});

const onSearch = async () => {
  searched.value = false;
  // Build params
  const params = {
    query: searchQuery.value,
    number: amount.value,
  };
  if (selectedCuisine.value) params.cuisine = selectedCuisine.value;
  if (selectedDiet.value) params.diet = selectedDiet.value;
  if (selectedIntolerance.value) params.intolerances = selectedIntolerance.value;

  try {
    const resp = await axios.get(`${store.server_domain}/recipes/search`, {
      params,
      withCredentials: true,
    });
     recipes.value = Array.isArray(resp.data) ? resp.data : (resp.data.results || []);
     searched.value = true;

    console.log(" recipes in Search Page:", recipes.value); // Debugging line
    searched.value = true;
    // If logged in, update last search preview
    if (isLoggedIn.value && recipes.value.length > 0) {
      lastSearchResult.value = recipes.value[0];
    }
  } catch (err) {
    recipes.value = [];
    searched.value = true;
  }
};
</script> -->

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import GenericRecipePreviewPage from '@/components/GenericRecipePreviewPage.vue';

const internalInstance = getCurrentInstance();
const store = internalInstance?.appContext?.config?.globalProperties?.store || {};

const searchQuery = ref('');
const amount = ref(5);
const selectedCuisine = ref('');
const selectedDiet = ref('');
const selectedIntolerance = ref('');

const isLoggedIn = ref(false);
const showSearchResults = ref(false);
const recipeIDs = ref([]); // <-- This will hold your array of IDs

const amountOptions = [
  { value: 5, text: '5' },
  { value: 10, text: '10' },
  { value: 15, text: '15' },
];
// ...cuisineOptions, dietOptions, intoleranceOptions...
// Official Spoonacular options
const cuisineOptions = [
  { value: '', text: 'All Cuisines' },
  { value: 'African', text: 'African' },
  { value: 'American', text: 'American' },
  { value: 'British', text: 'British' },
  { value: 'Cajun', text: 'Cajun' },
  { value: 'Caribbean', text: 'Caribbean' },
  { value: 'Chinese', text: 'Chinese' },
  { value: 'Eastern European', text: 'Eastern European' },
  { value: 'European', text: 'European' },
  { value: 'French', text: 'French' },
  { value: 'German', text: 'German' },
  { value: 'Greek', text: 'Greek' },
  { value: 'Indian', text: 'Indian' },
  { value: 'Irish', text: 'Irish' },
  { value: 'Italian', text: 'Italian' },
  { value: 'Japanese', text: 'Japanese' },
  { value: 'Jewish', text: 'Jewish' },
  { value: 'Korean', text: 'Korean' },
  { value: 'Latin American', text: 'Latin American' },
  { value: 'Mediterranean', text: 'Mediterranean' },
  { value: 'Mexican', text: 'Mexican' },
  { value: 'Middle Eastern', text: 'Middle Eastern' },
  { value: 'Nordic', text: 'Nordic' },
  { value: 'Southern', text: 'Southern' },
  { value: 'Spanish', text: 'Spanish' },
  { value: 'Thai', text: 'Thai' },
  { value: 'Vietnamese', text: 'Vietnamese' },
];

const dietOptions = [
  { value: '', text: 'All Diets' },
  { value: 'Gluten Free', text: 'Gluten Free' },
  { value: 'Ketogenic', text: 'Ketogenic' },
  { value: 'Vegetarian', text: 'Vegetarian' },
  { value: 'Lacto-Vegetarian', text: 'Lacto-Vegetarian' },
  { value: 'Ovo-Vegetarian', text: 'Ovo-Vegetarian' },
  { value: 'Vegan', text: 'Vegan' },
  { value: 'Pescetarian', text: 'Pescetarian' },
  { value: 'Paleo', text: 'Paleo' },
  { value: 'Primal', text: 'Primal' },
  { value: 'Low FODMAP', text: 'Low FODMAP' },
  { value: 'Whole30', text: 'Whole30' },
];

const intoleranceOptions = [
  { value: '', text: 'All Intolerances' },
  { value: 'Dairy', text: 'Dairy' },
  { value: 'Egg', text: 'Egg' },
  { value: 'Gluten', text: 'Gluten' },
  { value: 'Grain', text: 'Grain' },
  { value: 'Peanut', text: 'Peanut' },
  { value: 'Seafood', text: 'Seafood' },
  { value: 'Sesame', text: 'Sesame' },
  { value: 'Shellfish', text: 'Shellfish' },
  { value: 'Soy', text: 'Soy' },
  { value: 'Sulfite', text: 'Sulfite' },
  { value: 'Tree Nut', text: 'Tree Nut' },
  { value: 'Wheat', text: 'Wheat' },
];
const resultsTitle = computed(() =>
  searchQuery.value
    ? `Search Results${searchQuery.value ? ` for "${searchQuery.value}"` : ''}`
    : 'Search Results'
);

const onSearch = async () => {
  showSearchResults.value = false;
  // Build params
  const params = {
    query: searchQuery.value,
    number: amount.value,
  };
  if (selectedCuisine.value) params.cuisine = selectedCuisine.value;
  if (selectedDiet.value) params.diet = selectedDiet.value;
  if (selectedIntolerance.value) params.intolerances = selectedIntolerance.value;

  try {
    const resp = await axios.get(`${store.server_domain}/recipes/search`, {
      params,
      withCredentials: true,
    });
    // resp.data is expected to be an array of IDs (number[])
    recipeIDs.value = Array.isArray(resp.data) ? resp.data : [];
    showSearchResults.value = true;
  } catch (err) {
    recipeIDs.value = [];
    showSearchResults.value = true;
  }
};

const showLastSearch = computed(() =>
  isLoggedIn.value && !showSearchResults.value
);

onMounted(() => {
  isLoggedIn.value = !!store.username;
});
</script>

<style scoped>
.search-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 0;
}
.title {
  font-size: 2.2rem;
  margin-bottom: 24px;
  text-align: center;
}
.form-group label {
  font-weight: 500;
}
</style>
