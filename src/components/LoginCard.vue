<template>
  <BCard class="shadow border-0">
    <BCardHeader class="bg-primary text-white">
      <h3 class="mb-0">
        <i class="fas fa-sign-in-alt me-2"></i>
        Welcome Back
      </h3>
        <div class="underline-title"></div>
    </BCardHeader>

    <BCardBody>
      <BForm @submit.prevent="login">
        <BFormGroup label="Username" label-for="username" label-class="semibold-label">
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

        <BFormGroup label="Password" label-for="password" label-class="semibold-label">
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

        <BButton class="login-btn" type="submit" size="lg" block :disabled="loading">
          <BSpinner v-if="loading" small class="me-2" />
          <i v-else class="fas fa-sign-in-alt me-2"></i>
          {{ loading ? 'Signing In...' : 'Login' }}
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


/* Use a clean, modern font stack */
* {
  font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
}
.underline-title {
  background: -webkit-linear-gradient(right, #ffffff, #ffffff);
  height: 2px;
  margin: -1.1rem auto 0 auto;
  width: 89px;
}


.card-header h3 {
  font-size: 2.0rem;
  font-weight: 600;
  font-family: "Raleway Thin", sans-serif;
  letter-spacing: 2px;
  padding-bottom: 23px;
  padding-top: 13px;
  text-align: center;
}

.semi-bold{
  font-weight: 600;
}

.login-btn {
  background: -webkit-linear-gradient(right, #2855f7, #2855f7);
  border: none;
  border-radius: 21px;
  box-shadow: 0px 1px 8px #0d6efd;
  cursor: pointer;
  color: white;
  font-family: "Raleway SemiBold", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  height: 50px;
  margin: 0 auto;
  margin-top: 20px;
  transition: 0.25s;
  width: 250px;
  align-items: center;
  text-align: center;
}
.login-btn:hover {
  box-shadow: 0px 1px 18px #1b76f5;
}



.b-card-body {
  font-size: 1rem;
}

label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.form-control {
  font-size: 1rem;
  padding: 0.6rem 0.75rem;
}

.b-button {
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.b-alert {
  font-size: 0.95rem;
}

.fas {
  font-size: 1rem;
}
</style>
