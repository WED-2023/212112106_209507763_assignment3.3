<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>
    <b-form @submit.prevent="register">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          @blur="v$.username.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          <div v-if="!v$.username.required">Username is required.</div>
          <div v-else-if="!v$.username.minLength || !v$.username.maxLength">
            Username must be 3–8 characters.
          </div>
          <div v-else-if="!v$.username.alpha">Username must contain only letters.</div>
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- First Name -->
      <b-form-group label="First Name" label-for="firstname">
        <b-form-input
          id="firstname"
          v-model="state.firstname"
          @blur="v$.firstname.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.firstname.$error">
          First name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Last Name -->
      <b-form-group label="Last Name" label-for="lastname">
        <b-form-input
          id="lastname"
          v-model="state.lastname"
          @blur="v$.lastname.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.lastname.$error">
          Last name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email -->
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          type="email"
          v-model="state.email"
          @blur="v$.email.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.email.$error">
          Email is required.
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- Country -->
      <b-form-group label="Country" label-for="country">
        <b-form-select
          id="country"
          v-model="state.country"
          :options="countries"
          @change="v$.country.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.country.$error">
          Country is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          @blur="v$.password.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-else-if="!v$.password.minLength || !v$.password.maxLength">
            Password must be 5–10 characters.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password" label-for="confirmedPassword">
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="state.confirmedPassword"
          @blur="v$.confirmedPassword.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
          <div v-if="!v$.confirmedPassword.required">Confirmation is required.</div>
          <div v-else-if="!v$.confirmedPassword.sameAsPassword">
            Passwords do not match.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="success" class="w-100">Register</b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Registration failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </b-form>
  </div>
</template>

<!-- <script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, sameAs } from '@vuelidate/validators';
import rawCountries from '../assets/countries';

export default {
  name: 'RegisterPage',
  setup() {
    const state = reactive({
      username: '',
      password: '',
      confirmedPassword: '',
      country: '',
      submitError: null,
    });

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs(() => state.password),
      },
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        await window.axios.post('/register', {
          username: state.username,
          password: state.password,
          country: state.country,
        });
        window.toast('Registration successful', 'You can now login', 'success');
        window.router.push('/login');
      } catch (err) {
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
    };
  },
};
</script> -->

<script>
// import { reactive, ref, onMounted } from 'vue';
import { reactive } from 'vue';
import rawCountries from '../assets/countries';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, sameAs } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';


export default {
  name: 'RegisterPage',
  setup() {
    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmedPassword: '',
      country: '',
      submitError: null,
    });

    
    const router = useRouter(); //by Abed 19062025
    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      firstname: { required },
      lastname: { required },
      email: { required },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs(() => state.password),
      },
    };
    // const countries = ref([{ value: '', text: 'Loading countries...' }]);
    const v$ = useVuelidate(rules, state);

    // Fetch countries from backend
    // const fetchCountries = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/countries');
    //     const data = await response.json();
    //     countries.value = [{ value: '', text: 'Select a country' }, ...data.map(c => ({ value: c, text: c }))];
    //   } catch (err) {
    //     countries.value = [{ value: '', text: 'Error loading countries' }];
    //     console.error('Failed to load countries', err);
    //   }
    // };

    // onMounted(fetchCountries);

    const countries = [{ value: '', text: 'Select a country' }, ...rawCountries.map(c => ({ value: c, text: c }))];
    // Submit registration to backend
    const register = async () => {
      const valid = await v$.value.$validate();
      console.log('minimal submit Register')
      if (!valid) return;

      try {
        console.log('minimal submi try register')
        await axios.post('http://localhost:3000/auth/register', {
           username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          country: state.country,
          password: state.password,
          password_confirmation: state.confirmedPassword,
        });
        window.toast('Registration successful', 'You can now login', 'success');
        router.push('/login');
      } catch (err) {
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return {
      state,
      countries,
      register,
      v$,
    };
  },
};
</script>


