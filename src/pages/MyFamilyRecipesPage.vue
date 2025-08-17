<template>
  <GenericRecipePreviewPage
      title="My Family Recipes"
      fetch-path="/recipes/familyRecipes"
      log-purpose="Family recipes Page"
  />
</template>

<script>
import GenericRecipePreviewPage from '@/components/GenericRecipePreviewPage.vue';
export default {
  name: 'familyRecipes',
  components: { GenericRecipePreviewPage }
}
</script>
