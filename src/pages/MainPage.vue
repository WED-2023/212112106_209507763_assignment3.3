<template>
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
</style>
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
