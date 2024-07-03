<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand">Navigation</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/average" class="nav-link">Average</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/weight" class="nav-link">Total Weight</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/distance" class="nav-link">Distance</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/region" class="nav-link">Region</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <RouterView />
</template>

<style scoped>
</style>
