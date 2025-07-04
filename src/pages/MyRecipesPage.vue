<template>
  <GenericRecipePreviewPage
      title="My Recipes"
      fetch-path="/users/myRecipes"
      log-purpose="My Recipes Page"
  />
</template>

<script>
import GenericRecipePreviewPage from '@/components/GenericRecipePreviewPage.vue';
export default {
  name: 'myRecipes',
  components: { GenericRecipePreviewPage }
}
</script>
