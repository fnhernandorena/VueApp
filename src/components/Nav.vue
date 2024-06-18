<template>
  <div class="flex max-w-screen-sm w-full justify-around mb-10 text-2xl">
    <router-link href="#/" :class="{ active: currentPath === '/' }">Home</router-link>
    <router-link href="#/weather" :class="{ active: currentPath === '/weather' }">Weather</router-link>
    <router-link href="#/domain" :class="{ active: currentPath === '/domain' }">Domain</router-link>
  </div>
  <div class="max-w-screen-lg w-full flex justify-center ">
    <component :is="currentView"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Home from '../home/Home.vue'
import Domain from '../domain/Domain.vue'
import Weather from '../weather/Weather.vue'
import NotFound from '../notFound/NotFound.vue'

interface RouteMap {
  [key: string]: typeof Home | typeof Weather | typeof Domain | typeof NotFound
}

const routes: RouteMap = {
  '/': Home,
  '/weather': Weather,
  '/domain': Domain,
}

const currentPath = ref<string>(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1)] || NotFound
})
</script>
