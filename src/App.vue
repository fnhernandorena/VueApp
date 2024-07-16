<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <nav class="max-w-screen-sm w-full flex justify-around text-xl bg-slate-300 rounded-3xl p-2 mt-1">
      <RouterLink class="duration-300" to="/">Home</RouterLink>
      <RouterLink class="duration-300" to="/weather">Weather</RouterLink>
      <RouterLink class="duration-300" to="/domain">Domain</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
<style>
nav a.router-link-exact-active {
  text-decoration: underline;
  color: rgb(0, 128, 255);
}
</style>