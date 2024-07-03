<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="container">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/average">Average</RouterLink>
        <RouterLink to="/sending">Sending</RouterLink>
        <RouterLink to="/weight">Weight</RouterLink>
        <RouterLink to="/distance">Distance</RouterLink>
        <RouterLink to="/region">Region</RouterLink>
      </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.nav {
  display: flex;
  justify-content: center;
}
</style>
