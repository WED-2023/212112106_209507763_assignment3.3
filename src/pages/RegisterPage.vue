<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>

    <form @submit.prevent="register">
      <!-- Username -->
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': v$.username.$error, 'is-valid': !v$.username.$invalid && v$.username.$model !== '' }"
          v-model.trim="state.username"
          @blur="v$.username.$touch()"
        />
        <div class="invalid-feedback" v-if="v$.username.$error">
          <div v-if="v$.username.required.$invalid">Username is required.</div>
          <div v-else-if="v$.username.minLength.$invalid || v$.username.maxLength.$invalid">
            Username must be 3–8 characters.
          </div>
          <div v-else-if="v$.username.alpha.$invalid">Username must contain only letters.</div>
        </div>
      </div>

      <!-- First Name -->
      <div class="mb-3">
        <label for="firstname" class="form-label">First Name</label>
        <input
          id="firstname"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': v$.firstname.$error, 'is-valid': !v$.firstname.$invalid && v$.firstname.$model !== '' }"
          v-model.trim="state.firstname"
          @blur="v$.firstname.$touch()"
        />
        <div class="invalid-feedback" v-if="v$.firstname.$error">
          First name is required.
        </div>
      </div>

      <!-- Last Name -->
      <div class="mb-3">
        <label for="lastname" class="form-label">Last Name</label>
        <input
          id="lastname"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': v$.lastname.$error, 'is-valid': !v$.lastname.$invalid && v$.lastname.$model !== '' }"
          v-model.trim="state.lastname"
          @blur="v$.lastname.$touch()"
        />
        <div class="invalid-feedback" v-if="v$.lastname.$error">
          Last name is required.
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': v$.email.$error, 'is-valid': !v$.email.$invalid && v$.email.$model !== '' }"
          v-model.trim="state.email"
          @blur="v$.email.$touch()"
          autocomplete="email"
        />
        <div class="invalid-feedback" v-if="v$.email.$error">
          <div v-if="v$.email.required.$invalid">Email is required.</div>
          <div v-else-if="v$.email.email.$invalid">Must be a valid email.</div>
        </div>
      </div>

      <!-- Country -->
      <div class="mb-3">
        <label for="country" class="form-label">Country</label>
        <select
          id="country"
          class="form-select"
          :class="{ 'is-invalid': v$.country.$error, 'is-valid': !v$.country.$invalid && state.country !== '' }"
          v-model="state.country"
          @change="v$.country.$touch()"
        >
          <option value="" disabled>Select a country</option>
          <option v-for="(c, idx) in rawCountries" :key="idx" :value="c">
            {{ c }}
          </option>
        </select>
        <div class="invalid-feedback" v-if="v$.country.$error">
          Country is required.
        </div>
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': v$.password.$error, 'is-valid': !v$.password.$invalid && v$.password.$model !== '' }"
          v-model.trim="state.password"
          @blur="v$.password.$touch()"
          autocomplete="new-password"
        />
        <div class="invalid-feedback" v-if="v$.password.$error">
          <div v-if="v$.password.required.$invalid">Password is required.</div>
          <div v-else-if="v$.password.minLength.$invalid || v$.password.maxLength.$invalid">
            Password must be 5–10 characters.
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="mb-3">
        <label for="confirmedPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmedPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': v$.confirmedPassword.$error, 'is-valid': !v$.confirmedPassword.$invalid && v$.confirmedPassword.$model !== '' }"
          v-model.trim="state.confirmedPassword"
          @blur="v$.confirmedPassword.$touch()"
          autocomplete="new-password"
        />
        <div class="invalid-feedback" v-if="v$.confirmedPassword.$error">
          <div v-if="v$.confirmedPassword.required.$invalid">Confirmation is required.</div>
          <div v-else-if="v$.confirmedPassword.sameAsPassword.$invalid">
            Passwords do not match.
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-success w-100">Register</button>

      <div class="alert alert-danger mt-3" v-if="state.submitError">
        Registration failed: {{ state.submitError }}
      </div>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, email } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';
import rawCountries from '../assets/countries';

export default {
  name: 'RegisterPage',
  setup() {
    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      country: '',
      password: '',
      confirmedPassword: '',
      submitError: null,
    });

    const router = useRouter();

    // Custom validator for matching passwords
    const matchPassword = (value) => value === state.password;

    const rules = {
      username: { required, minLength: minLength(3), maxLength: maxLength(8), alpha },
      firstname: { required },
      lastname: { required },
      email: { required, email },
      country: { required },
      password: { required, minLength: minLength(5), maxLength: maxLength(10) },
      confirmedPassword: { required, sameAsPassword: matchPassword },
    };
    const v$ = useVuelidate(rules, state);

    // Reset confirm error when password changes:
    watch(() => state.password, () => {
      // Clear confirm validation state so it re-validates
      if (v$.value.confirmedPassword.$dirty) {
        v$.value.confirmedPassword.$reset();
      }
    });

    const register = async () => {
      console.log('password:', JSON.stringify(state.password));
      console.log('confirmedPassword:', JSON.stringify(state.confirmedPassword));
      // Touch all fields
      v$.value.$touch();
      // Await validation
      const valid = await v$.value.$validate();
      console.log('Validation result:', valid);
      if (!valid) {
        console.log('Errors:', v$.value.$errors);
        return;
      }
      // Proceed with POST
      try {
        const payload = {
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          country: state.country,
          password: state.password,
          password_confirmation: state.confirmedPassword,
        };
        console.log('Sending payload:', payload);
        await axios.post(`${process.env.VUE_APP_SERVER_DOMAIN}/api/auth/register`, payload);
        if (window.toast) window.toast('Registration successful', 'You can now login', 'success');
        else console.log('Registration successful');
        router.push('/login');
      } catch (err) {
        console.error(err);
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return {
      state,
      rawCountries,
      register,
      v$,
    };
  },
};
</script>