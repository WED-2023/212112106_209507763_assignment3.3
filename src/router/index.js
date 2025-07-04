import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

// / → MainPage.vue

// /search → SearchPage.vue

// /login → LoginPage.vue

// /register → RegisterPage.vue

// /about → AboutPage.vue

// /favorites → MyFavoritesPage.vue

// /my-recipes → MyRecipesPage.vue

// /family-recipes → FamilyRecipesPage.vue

// /recipe/:id → RecipeViewPage.vue

// /prepare/:id → PrepareRecipePage.vue (Bonus)

// /meal-plan → MealPlanPage.vue (Bonus)

// * → NotFoundPage.vue

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
    {
    path: "/about",
    name: "",
    component: () => import("../pages/AboutPage.vue"),
  },
   {
    path: "/createRecipe",
    name: "",
    component: () => import("../pages/CreateRecipePage.vue"),
  },
   {
    path: "/personal",
    name: "myRecipes",
    component: () => import("../pages/MyRecipesPage.vue"),
  },
   {
    path: "/favorites",
    name: "favorites",
    component: () => import("../pages/MyFavoritesPage.vue"),
  },
   {
    path: "/family",
    name: "familyRecipes",
    component: () => import("../pages/MyFamilyRecipesPage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },

      {
      path: '/about',
      name: 'about',
      component: () => import("../pages/AboutPage.vue")
    },
    {
      path: '/create',
      name: 'createRecipe',
      component: () => import("../pages/CreateRecipePage.vue")
    },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;
