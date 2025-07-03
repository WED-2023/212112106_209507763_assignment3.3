<template>
  <div class="modal fade" id="createRecipeModal" tabindex="-1" aria-labelledby="createRecipeLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createRecipeLabel">Create New Recipe</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRecipe">
            <div class="mb-3">
              <label class="form-label">Recipe Title</label>
              <input v-model="state.recipe_title" type="text" class="form-control" :class="{ 'is-invalid': v$.recipe_title.$invalid && v$.recipe_title.$dirty }" />
            </div>

            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input v-model="state.recipe_image" type="text" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Preparation Duration (minutes)</label>
              <input v-model.number="state.prep_duration" type="number" min="1" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Amount of Meals</label>
              <input v-model.number="state.amount_of_meals" type="number" min="1" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Instructions</label>
              <textarea v-model="state.instructions" class="form-control" rows="4"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Ingredients (comma separated)</label>
              <input v-model="state.ingredientInput" type="text" class="form-control" @keyup.enter.prevent="addIngredient" />
              <div class="mt-2">
                <span class="badge bg-secondary me-1" v-for="(ing, index) in state.extendedIngredients" :key="index">
                  {{ ing }}
                  <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove" @click="removeIngredient(index)"></button>
                </span>
              </div>
            </div>

            <div class="mb-3 form-check">
              <input v-model="state.vegetarian" type="checkbox" class="form-check-input" id="veg" />
              <label class="form-check-label" for="veg">Vegetarian</label>
            </div>

            <div class="mb-3 form-check">
              <input v-model="state.vegan" type="checkbox" class="form-check-input" id="vegan" />
              <label class="form-check-label" for="vegan">Vegan</label>
            </div>

            <div class="mb-3 form-check">
              <input v-model="state.gluten_free" type="checkbox" class="form-check-input" id="gluten" />
              <label class="form-check-label" for="gluten">Gluten Free</label>
            </div>

            <button type="submit" class="btn btn-primary">Create Recipe</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import * as bootstrap from 'bootstrap';
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, numeric } from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'CreateRecipeModal',
  emits: ['recipe-created-success'],
  setup(props, { emit }) {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    const state = reactive({
      recipe_title: '',
      recipe_image: '',
      prep_duration: null,
      vegetarian: false,
      vegan: false,
      gluten_free: false,
      amount_of_meals: null,
      instructions: '',
      extendedIngredients: [],
      ingredientInput: '',
    });

    const rules = {
      recipe_title: { required },
      instructions: { required, minLength: minLength(10) },
      prep_duration: { required, numeric },
      amount_of_meals: { required, numeric },
      extendedIngredients: {
        required: (val) => val.length > 0 || 'At least one ingredient is required'
      },
    };

    const v$ = useVuelidate(rules, state);

    const addIngredient = () => {
      const input = state.ingredientInput.trim();
      if (input) {
        state.extendedIngredients.push(input);
        state.ingredientInput = '';
      }
    };

    const removeIngredient = (index) => {
      state.extendedIngredients.splice(index, 1);
    };

    const submitRecipe = async () => {
      // 🔧 Fix: Push last ingredient if not yet added
      if (state.ingredientInput.trim()) {
        addIngredient();
      }

      v$.value.$touch();
      if (v$.value.$invalid) {
        console.warn("Validation failed", v$.value);
        return;
      }

      try {
        const payload = {
          recipe_title: state.recipe_title,
          recipe_image: state.recipe_image,
          prep_duration: Number(state.prep_duration),
          vegetarian: Boolean(state.vegetarian),
          vegan: Boolean(state.vegan),
          gluten_free: Boolean(state.gluten_free),
          amount_of_meals: Number(state.amount_of_meals),
          instructions: state.instructions,
          extendedIngredients: Array.isArray(state.extendedIngredients)
            ? state.extendedIngredients
            : [],
        };

        console.log("Payload being sent:", payload);

        await axios.post(`${store.server_domain}/recipes/create`, payload, {
          withCredentials: true,
        });

        emit('recipe-created-success');

        // Reset form
        Object.assign(state, {
          recipe_title: '',
          recipe_image: '',
          prep_duration: null,
          vegetarian: false,
          vegan: false,
          gluten_free: false,
          amount_of_meals: null,
          instructions: '',
          extendedIngredients: [],
          ingredientInput: '',
        });
        v$.value.$reset();

        // Close modal manually using Bootstrap API
        const modal = bootstrap.Modal.getInstance(document.getElementById('createRecipeModal'));
        if (modal) modal.hide();

      } catch (err) {
        console.error('Error creating recipe:', err.response?.data || err.message);
        alert('Failed to create recipe.');
      }
    };

    return {
      state,
      v$,
      addIngredient,
      removeIngredient,
      submitRecipe,
    };
  },
};
</script>

<style scoped>
.badge {
  font-size: 1rem;
}
</style>
