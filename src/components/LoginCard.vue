<template>
  <BCard class="shadow border-0">
    <BCardHeader class="bg-primary text-white">
      <h5 class="mb-0">
        <i class="fas fa-sign-in-alt me-2"></i>
        Welcome Back
      </h5>
    </BCardHeader>

    <BCardBody>
      <BForm @submit.prevent="login">
        <BFormGroup label="Username" label-for="username">
          <BFormInput
            id="username"
            v-model.trim="state.username"
            :state="getValidationState(v$.username)"
            @blur="v$.username.$touch()"
            placeholder="Enter your username"
            required
          />
          <BFormInvalidFeedback v-if="v$.username.$error">
            Username is required.
          </BFormInvalidFeedback>
        </BFormGroup>

        <BFormGroup label="Password" label-for="password">
          <BFormInput
            id="password"
            v-model.trim="state.password"
            type="password"
            :state="getValidationState(v$.password)"
            @blur="v$.password.$touch()"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          />
          <BFormInvalidFeedback v-if="v$.password.$error">
            Password is required.
          </BFormInvalidFeedback>
        </BFormGroup>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <!-- <BFormCheckbox v-model="state.rememberMe">
            Remember me
          </BFormCheckbox> -->
          <!-- <BLink href="#" class="text-decoration-none small">
            Forgot password?
          </BLink> -->
        </div>

        <BButton type="submit" variant="primary" size="lg" block :disabled="loading">
          <BSpinner v-if="loading" small class="me-2" />
          <i v-else class="fas fa-sign-in-alt me-2"></i>
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </BButton>
      </BForm>

      <BAlert v-if="state.submitError" variant="danger" show class="mt-3 mb-0">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ state.submitError }}
      </BAlert>
    </BCardBody>
  </BCard>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import axios from 'axios';

export default {
  name: 'LoginCard',
  emits: ['login-success'],
  setup(props, { emit }) {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = useRouter();

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
      v$.value.$touch();
      const valid = await v$.value.$validate();
      if (!valid) return;

      state.submitError = null;

      try {
        await axios.post(
          `${store.server_domain}/api/auth/login`,
          {
            username: state.username,
            password: state.password,
          },
          {
            withCredentials: true,
          }
        );
        store.login(state.username);
        emit('login-success');
        // Redirect to main/dashboard
        router.push('/');
      } catch (err) {
        const msg =
          err.response?.data?.message || err.response?.data || 'Unexpected error.';
        state.submitError = msg;
      }
    };

    return { state, v$, login, getValidationState };
  },
};
</script>

<style scoped>
.card-header {
  border-bottom: none;
}
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
</style>
