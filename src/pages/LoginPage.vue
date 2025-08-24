<template>
  <div class="container mt-4" style="max-width: 400px;">
    <LoginCard @login-success="onLoginSuccess" />
    <div class="mt-3 text-center">
      Don’t have an account?
      <router-link to="/register">Register here</router-link>
    </div>
  </div>
</template>

<script>
import LoginCard from '@/components/LoginCard.vue'; // Adjust the path as needed

export default {
  name: 'LoginPage',
  components: {
    LoginCard,
  },
  methods: {
    // Optional: handle login success if you want to do something extra
    onLoginSuccess() {
      // This can be left empty, or you can add analytics, etc.
    },
  },
};
</script>

<style scoped>
.body {
    background: linear-gradient(135deg, #def6ff 0%, #dcf7f4 100%);
}
</style>