<template>
  <GenericRecipePreviewPage
      title="My Favorite Recipes"
      fetch-path="/users/favoriteRecipes"
      log-purpose="Favorites Page"
      :is-favorite="true"
  />
</template>

<script>
import GenericRecipePreviewPage from '@/components/GenericRecipePreviewPage.vue';
export default {
  name: 'MyFavoritesPage',
  components: { GenericRecipePreviewPage }
}
</script>
