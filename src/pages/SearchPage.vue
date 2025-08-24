<template>
  <div class="container-fluid search-page">
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
        <!-- In your b-form row: -->
        <div class="col-md-2 mb-2">
          <b-form-group label="Sort By">
            <b-form-select v-model="sortBy" :options="sortOptions" />
          </b-form-group>
        </div>

        <!-- <div class="col-md-1 mb-2">
          <b-button type="submit" variant="primary" class="w-100">Search</b-button>
        </div>
          -->
      <div class="row mt-3">
        <div class="col-12 d-flex justify-content-center">
          <b-button type="submit" variant="primary" class="btn-search">
            Search
          </b-button>
        </div>
      </div>
      </div> 
    </b-form>

   
   
  
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
        :sort-by="sortBy"
        log-purpose="Recipe Search"
      />
    </div>
    </div>
</template>

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
const sortBy = ref('popularity');

// Sort options for the search results
const sortOptions = [
  { value: 'popularity', text: 'Popularity (Most Likes)' },
  { value: 'duration', text: 'Duration (Shortest First)' }
];

// Amount options for the search results
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
    const resp = await axios.get(`${store.server_domain}/api/recipes/search`, {
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

  margin: 0 auto;
  padding: 36px 0 55px 0;
  font-family: 'Merriweather', 'Segoe UI', serif;
  background: linear-gradient(135deg, #def6ff 0%, #dcf7f4 100%);
  min-height: 100vh;
}
.title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #27747f;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Playfair Display', serif;
}

/* FORM DESIGN */


.form-group label,
.b-form-group label {
  font-weight: 600;
  font-size: 1.08rem;
  color: #31445b;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}
.b-form-input,
.b-form-select {
  font-size: 1.07rem;
  border-radius: 8px;
  height: 46px;
  padding: 10px 12px;
  background: #f5fafe;
  border: 1px solid #bde2e6;
  margin-bottom: 4px;
  transition: box-shadow 0.15s;
}
.b-form-input:focus,
.b-form-select:focus {
  box-shadow: 0 0 6px #98e2c6;
  border-color: #11ba71;
}

/* Center and restrict width of the form only */
.b-form {
  max-width: 60vw;   /* about 60% of viewport width */
  margin-left: auto;
  margin-right: auto;
  padding: 1.2rem 1rem 1.5rem 1rem;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(39, 64, 70, 0.10);
}

/* Maintain spacing around form groups */
.b-form-group {
  margin-bottom: 1.2rem;
}

/* Center the search button below fields */
.search-btn-holder {
  display: flex;
  justify-content: center;
  margin-top: 1.8rem;
  width: 100%;
}

/* Style for submit button inside the form */
.btn-search {
  width: 240px;
  font-size: 1.38rem;
  font-weight: 700;
  border-radius: 32px;
  padding: 0.75em 0;
  background: linear-gradient(90deg, #a6f77b 0%, #2dbd6e 100%);
  color: white;
  box-shadow: 0px 3px 16px #24c64f88;
  border: none;
  letter-spacing: 1.2px;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-search:hover,
.btn-search:focus {
  background: linear-gradient(90deg, #2dbd6e 0%, #a6f77b 100%);
  box-shadow: 0px 4px 26px #24c64fcc;
  transform: scale(1.06);
}

/* Responsive spacing */
@media (max-width: 768px) {
    .b-form {
    max-width: 90vw;
    padding: 1rem 0.5rem 1.3rem 0.5rem;
  }
  .search-page {
    padding: 20px 12px 48px 12px;
  }
  .title {
    font-size: 1.9rem;
  }
  .btn-search {
    width: 100%;
    font-size: 1.3rem;
  }
}

.b-button[type="submit"], .b-btn[type="submit"], .btn-search {
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
  border-radius: 32px;
  padding: 0.7em 2.2em;
  background: linear-gradient(90deg, #a6f77b 0%, #2dbd6e 100%);
  color: #fff;
  box-shadow: 0px 2px 14px #24c64f59;
  border: none;
  margin: 0 auto;
  transition: all 0.18s;
  letter-spacing: 1px;
}
.b-button[type="submit"]:hover, .b-btn[type="submit"]:hover, .btn-search:hover {
  box-shadow: 0px 1px 28px #24c64f79;
  background: linear-gradient(90deg, #2dbd6e 0%, #a6f77b 100%);
  opacity: 0.97;
  transform: scale(1.04);
}

/* Move button to bottom and center it */
.b-form .row {
  margin-bottom: 0;
}
.b-form .search-btn-holder {
  margin-top: 18px;
}
.b-form .search-btn-holder .b-button[type="submit"] {
  margin-bottom: 0;
}

/* Responsive: stack inputs on small screens */
@media (max-width: 768px) {
  .b-form {
    padding: 22px 6px 38px 6px;
  }
  .row {
    flex-direction: column;
  }
  .col-md-2, .col-md-5, .col-md-1 {
    width: 100%;
    max-width: 100%;
  }
}

/* PREVIEW COMPONENT SPACING */
.mt-4 {
  margin-top: 2.2rem !important;
}

/* Card or preview styling (if not handled inside GenericRecipePreviewPage) */
.generic-recipe-preview-page {
  margin-bottom: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 22px rgba(46,116,110,0.06);
  background: #fff;
}
</style>
