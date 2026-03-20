<template>
  <!-- <div class="login-page"> -->
    <AuthForm />
  <!-- </div> -->
</template>

<script setup lang="ts">
import AuthForm from '../components/auth/AuthForm.vue'
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>