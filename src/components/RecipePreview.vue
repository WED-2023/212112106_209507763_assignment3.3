<!-- <template>
  <div class="card h-100">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">{{ recipe.aggregateLikes }} likes</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style> -->

<template>
  <div class="card h-100 recipe-card">
    <div class="position-relative overflow-hidden recipe-image-container" @click="goToDetail">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image"
        alt="Recipe image"
      />
      <div class="overlay">
        <span class="overlay-text">View Recipe</span>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">
        <a href="#" class="stretched-link text-decoration-none text-dark" @click.prevent="goToDetail">
          {{ recipe.title }}
        </a>
      </h5>

      <p class="card-text mb-1">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text mb-2">{{ recipe.aggregateLikes }} likes</p>

      <div class="mb-2">
        <span v-if="recipe.vegan" class="badge bg-success me-1">Vegan</span>
        <span v-else-if="recipe.vegetarian" class="badge bg-info text-dark me-1">Vegetarian</span>
        <span v-if="recipe.glutenFree" class="badge bg-warning text-dark me-1">Gluten Free</span>
      </div>

      <div class="mt-auto d-flex align-items-center justify-content-between">
        <span v-if="viewed" class="text-muted small">👁 Viewed</span>
        <span v-else class="text-muted small">&nbsp;</span>

        <button
          class="btn btn-link p-0 favorite-btn"
          @click.stop="toggleFavorite"
          :disabled="favoriteLoading"
          :title="favorite ? 'Favorited' : 'Add to favorites'"
        >
          <span v-if="favorite">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const internal = getCurrentInstance();
    const store = internal.appContext.config.globalProperties.store;
    const toast = internal.appContext.config.globalProperties.toast;
    const server = store.server_domain;

    const viewed = ref(false);
    const favorite = ref(false);
    const favoriteLoading = ref(false);

    onMounted(async () => {
      const id = props.recipe.id;
      if (!id) return;
      // if (store.username) {
      //   // fetch favorites
      //   try {
      //     const resp = await axios.get(`${server}/api/users/favoriteRecipes`, { withCredentials: true });
      //     if (Array.isArray(resp.data) && resp.data.includes(String(id)) || resp.data.includes(id)) {
      //       favorite.value = true;
      //     }
      //   } catch (err) {
      //     console.error("Failed to fetch favorites:", err);
      //   }
      //   // fetch last viewed
      //   try {
      //     const resp2 = await axios.get(`${server}/api/users/last`, { withCredentials: true });
      //     if (Array.isArray(resp2.data) && (resp2.data.includes(String(id)) || resp2.data.includes(id))) {
      //       viewed.value = true;
      //     }
      //   } catch (err) {
      //     console.error("Failed to fetch last viewed:", err);
      //   }
      // }
    });

    async function goToDetail() {
      const id = props.recipe.id;
      if (!id) return;
      if (store.username) {
        try {
          await axios.post(`${server}/api/users/clickOnRecipe`, { recipeId: id }, { withCredentials: true });
          viewed.value = true;
        } catch (err) {
          console.error("Failed to record view:", err);
        }
      }
      // navigate using your route name; here assumed "recipe" with param recipeId
      router.push({ name: 'recipe', params: { recipeId: id } }).catch(() => {});
    }

    async function toggleFavorite() {
      if (!store.username) {
        toast("Error", "Please log in to favorite recipes", "error");
        return;
      }
      const id = props.recipe.id;
      if (!id || favorite.value) return;
      favoriteLoading.value = true;
      try {
        // use POST /favoriteRecipes/:recipeId
        await axios.post(`${server}/users/favoriteRecipes/${id}`, {}, { withCredentials: true });
        favorite.value = true;
        toast("Success", "Added to favorites", "success");
      } catch (err) {
        console.error("Failed to add favorite:", err);
        toast("Error", "Could not add to favorites", "error");
      } finally {
        favoriteLoading.value = false;
      }
    }

    return {
      viewed,
      favorite,
      favoriteLoading,
      goToDetail,
      toggleFavorite,
    };
  }
}
</script>

<style scoped>
.recipe-image-container {
  cursor: pointer;
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
.recipe-image-container .overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease-in-out;
}
.recipe-image-container:hover .overlay {
  opacity: 1;
}
.recipe-image-container .overlay-text {
  color: #fff;
  font-weight: bold;
}
.card-body {
  display: flex;
  flex-direction: column;
}
.favorite-btn {
  font-size: 1.2rem;
  color: red;
  background: none;
  border: none;
}
.favorite-btn:disabled {
  cursor: default;
  opacity: 0.7;
}
</style>
