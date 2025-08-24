<!-- <template>
  <b-container>
    <h3>
      {{ title }}:
      <slot></slot>
    </h3>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      recipes: []
    };
  },
  mounted() {
    this.updateRecipes();
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
              // apiKey: process.env.spooncular_apiKey
              apiKey: 'b7b147413c244375812ccb826d79cdcc'
            }
          }
        );

        console.log("response: ", response);
        const recipes = response.data.recipes.map((r) => {
          return {
            id: r.id,
            title: r.title,
            readyInMinutes: r.readyInMinutes,
            image: r.image,
            aggregateLikes: r.aggregateLikes
          };
        });
        this.recipes = [];
        this.recipes.push(...recipes);
        console.log("recipes:  " , this.recipes);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style> -->


<!-- New by abed 24062025 below -->
<template>
  <b-container>
    <h3>
      {{ title }}
      <slot></slot>
    </h3>
    <b-row>
      <b-col v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}

h3 {
  font-size: 2rem;              // Slightly larger than default h3
  font-weight: 600;             // Semi-bold for a clean look
  color: #2c3e50;               // Deep gray-blue tone
  margin-bottom: 1.5rem;        // Spacing from the row below
  text-align: center;           // Center the title
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

h3::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 60%;
  height: 3px;
  background-color: #007bff;    // Bootstrap primary color
  transform: translateX(-50%);
  border-radius: 2px;
}

.recipePreview {
  margin-bottom: 1.5rem;        // Space between rows of recipes
}
</style>