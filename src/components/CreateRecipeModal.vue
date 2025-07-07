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
            <!-- Title -->
            <div class="mb-3">
              <label class="form-label">Recipe Title</label>
              <input
                  v-model="state.recipe_title"
                  @blur="v$.recipe_title.$touch()"
                  @input="v$.recipe_title.$touch()"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.recipe_title.$dirty && v$.recipe_title.$invalid }"
              />
              <div class="invalid-feedback" v-if="v$.recipe_title.$dirty && v$.recipe_title.$invalid">
                <div v-for="err in v$.recipe_title.$errors" :key="err.$uid">{{ err.$message }}</div>
              </div>
            </div>

            <!-- Image URL (not validated) -->
            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input v-model="state.recipe_image" type="text" class="form-control" />
            </div>

            <!-- Prep Duration -->
            <div class="mb-3">
              <label class="form-label">Preparation Duration (minutes)</label>
              <input
                  v-model.number="state.prep_duration"
                  @blur="v$.prep_duration.$touch()"
                  @input="v$.prep_duration.$touch()"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': v$.prep_duration.$dirty && v$.prep_duration.$invalid }"
              />
              <div class="invalid-feedback" v-if="v$.prep_duration.$dirty && v$.prep_duration.$invalid">
                <div v-for="err in v$.prep_duration.$errors" :key="err.$uid">{{ err.$message }}</div>
              </div>
            </div>

            <!-- Amount of Meals -->
            <div class="mb-3">
              <label class="form-label">Amount of Meals</label>
              <input
                  v-model.number="state.amount_of_meals"
                  @blur="v$.amount_of_meals.$touch()"
                  @input="v$.amount_of_meals.$touch()"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': v$.amount_of_meals.$dirty && v$.amount_of_meals.$invalid }"
              />
              <div class="invalid-feedback" v-if="v$.amount_of_meals.$dirty && v$.amount_of_meals.$invalid">
                <div v-for="err in v$.amount_of_meals.$errors" :key="err.$uid">{{ err.$message }}</div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="mb-3">
              <label class="form-label">Instructions</label>
              <textarea
                  v-model="state.instructions"
                  @blur="v$.instructions.$touch()"
                  @input="v$.instructions.$touch()"
                  class="form-control"
                  rows="4"
                  :class="{ 'is-invalid': v$.instructions.$dirty && v$.instructions.$invalid }"
              ></textarea>
              <div class="invalid-feedback" v-if="v$.instructions.$dirty && v$.instructions.$invalid">
                <div v-for="err in v$.instructions.$errors" :key="err.$uid">{{ err.$message }}</div>
              </div>
            </div>

            <!-- Ingredients -->
            <div class="mb-3">
              <label class="form-label">Add Ingredient</label>
              <div class="row g-2">
                <div class="col-md-5">
                  <input
                      v-model="state.ingredientInput.name"
                      type="text"
                      class="form-control"
                      placeholder="Ingredient name"
                  />
                </div>
                <div class="col-md-3">
                  <input
                      v-model.number="state.ingredientInput.amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      class="form-control"
                      placeholder="Amount"
                  />
                </div>
                <div class="col-md-3">
                  <input
                      v-model="state.ingredientInput.unit"
                      type="text"
                      class="form-control"
                      placeholder="Unit (e.g. grams, tbsp)"
                  />
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-primary w-100" @click="addIngredient">+</button>
                </div>
              </div>

              <!-- Ingredient list -->
              <div class="mt-3">
    <span
        class="badge bg-secondary me-1 mb-1"
        v-for="(ing, index) in state.extendedIngredients"
        :key="index"
    >
      {{ ing.name }} - {{ ing.amount }} {{ ing.unit }}
      <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove" @click="removeIngredient(index)"></button>
    </span>
              </div>

              <!-- Validation -->
              <div class="invalid-feedback d-block" v-if="v$.extendedIngredients.$dirty && v$.extendedIngredients.$invalid">
                <div v-for="err in v$.extendedIngredients.$errors" :key="err.$uid">{{ err.$message }}</div>
              </div>
            </div>

            <!-- Dietary Flags -->
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

            <!-- Submit -->
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
import { required, minLength, numeric, helpers } from '@vuelidate/validators';
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
      ingredientInput: {
        name: '',
        amount: null,
        unit: ''
      }
    });


    const rules = {
      recipe_title: {
        required: helpers.withMessage('Recipe title is required', required)
      },
      instructions: {
        required: helpers.withMessage('Instructions are required', required),
        minLength: helpers.withMessage('Instructions must be at least 10 characters', minLength(10))
      },
      prep_duration: {
        required: helpers.withMessage('Preparation time is required', required),
        numeric: helpers.withMessage('Must be a valid number', numeric)
      },
      amount_of_meals: {
        required: helpers.withMessage('Amount of meals is required', required),
        numeric: helpers.withMessage('Must be a valid number', numeric)
      },
      extendedIngredients: {
        required: helpers.withMessage(
            'At least one complete ingredient is required',
            () => state.extendedIngredients.length > 0
        )
      }
    };
    const v$ = useVuelidate(rules, state);

    const addIngredient = () => {
      const { name, amount, unit } = state.ingredientInput;

      if (name.trim() && amount > 0 && unit.trim()) {
        state.extendedIngredients.push({ name: name.trim(), amount, unit: unit.trim() });

        // Clear input fields
        state.ingredientInput.name = '';
        state.ingredientInput.amount = null;
        state.ingredientInput.unit = '';
      }
    };

    const removeIngredient = (index) => {
      state.extendedIngredients.splice(index, 1);
    };

    const submitRecipe = async () => {
      // 🔧 Fix: Push last ingredient if not yet added
      if (state.ingredientInput.name.trim() &&
          state.ingredientInput.amount > 0 &&
          state.ingredientInput.unit.trim()) {
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
          extendedIngredients: state.extendedIngredients.map(({ name, amount, unit }) => ({
            name,
            amount: `${amount} ${unit}`.trim()
          }))
        };

        console.log("Payload being sent:", payload);

        await axios.post(`${store.server_domain}/api/recipes/create`, payload, {
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
          ingredientInput: {
            name: '',
            amount: null,
            unit: ''
          }
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
