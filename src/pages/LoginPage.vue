<!-- 
<template>
  <div class="container mt-4" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>
    <b-form @submit.prevent="login">
   
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          :state="getValidationState(v$.username)"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

   
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          :state="getValidationState(v$.password)"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100">Login</b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Login failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Don’t have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export default {
  name: 'LoginPage',
  setup() {
    const state = reactive({
      username: '',
      password: '',
      submitError: null,
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const login = async () => {
      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        await window.axios.post('/login', {
          username: state.username,
          password: state.password,
        });
        window.store.login(state.username);
        window.router.push('/main');
      } catch (err) {
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return { state, v$, login, getValidationState };
  },
};
</script> -->
<template>
  <div class="container mt-4" style="max-width: 400px;">
    <h2 class="mb-4">Login</h2>
    <b-form @submit.prevent="login">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model.trim="state.username"
          :state="getValidationState(v$.username)"
          @blur="v$.username.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model.trim="state.password"
          :state="getValidationState(v$.password)"
          @blur="v$.password.$touch()"
          autocomplete="current-password"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100">Login</b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Login failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Don’t have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue'; //

export default {
  name: 'LoginPage',
  setup() {
    const state = reactive({
      username: '',
      password: '',
      submitError: null,
    });

    const internalInstance = getCurrentInstance(); //Abed
    const store = internalInstance.appContext.config.globalProperties.store; //Abed
 
    const router = useRouter();

    const rules = {
      username: { required },
      password: { required },
    };
    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const login = async () => {
      // Touch to show errors if empty
      v$.value.$touch();
      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        // If using a dev-server proxy to backend: call '/auth/login'
        // Otherwise, use full URL: 'http://localhost:3000/auth/login'
        //const url = `${store.server_domain}/auth/login`;
        const url = `${store.server_domain}/auth/login`;
        await axios.post(
          url,
          {
            username: state.username,
            password: state.password,
          },
          {
            withCredentials: true, // include cookies for session if backend sets them
          }
        );
        // On successful login: adjust according to your store/auth handling
        // e.g., commit Vuex or set a flag
        // Example: window.store.login(state.username);
        // For now:
        console.log('Login successful');
        store.login(state.username); // ??
        console.log('Login successful:', store.username);
        // Redirect to main/dashboard
        router.push('/');
      } catch (err) {
        console.error(err);
        // If backend responds with text, ensure you read it consistently:
        const msg = err.response?.data?.message || err.response?.data || 'Unexpected error.';
        state.submitError = msg;
      }
    };

    return { state, v$, getValidationState, login };
  },
};
</script>