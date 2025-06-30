<template>
  <div>
    <ol>
      <RecipePreview
        v-for="r in recipes"
        :key="r.id"
        :id="r.id"
        :title="r.title"
        :readyInMinutes="r.readyInMinutes"
        :image="r.image"
        :aggregateLikes="r.aggregateLikes"
      />
    </ol>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RandomRecipes",
  components: {
    RecipePreview,
  },
  data() {
    return {
      recipes: [],
    };
  },
  methods: {
    async updateRecipes() {
      try {
        const response = await this.axios.get(
          "https://api.spoonacular.com/recipes/random",
          {
            params: {
              limitLicense: true,
              number: 3,
              apiKey: process.env.spoonacular_apiKey,
            },
          }
        );
        const recipes = response.data.recipes.map((r) => ({
          id: r.id,
          title: r.title,
          readyInMinutes: r.readyInMinutes,
          image: r.image,
          aggregateLikes: r.aggregateLikes,
        }));
        this.recipes = recipes;
      } catch (error) {
        console.log("Error loading recipes:", error);
      }
    },
  },
  mounted() {
    this.updateRecipes();
  },
};
</script>

<style>
</style>
