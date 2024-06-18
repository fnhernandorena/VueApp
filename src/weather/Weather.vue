<template>
  <div class="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fade-up animate-once animate-ease-in-out">
    <h1 class="text-3xl font-semibold text-center my-6">
      Weather Forecast for {{ location }}
    </h1>

    <div class="flex max-w-xs mx-auto mb-6">
      <input
        type="text"
        placeholder="Enter city name"
        class="border border-gray-400 rounded-l-lg px-4 py-2 w-full"
        v-model="city"
        @keydown.enter="handleKeydown"
      />
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-lg"
        @click="searchWeather"
      >
        Search
      </button>
    </div>

    <div v-if="isLoading" class="flex flex-col justify-center items-center my-6">
      <div v-html="svgContent"></div>
    </div>

    <template v-else>
      <div v-if="todayWeather" class="bg-blue-100 shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">
          Today: {{ new Date(todayWeather.datetimeStr).toLocaleDateString() }}
        </h2>
        <div class="grid grid-cols-2">
          <p class="mb-2">
            <strong>Max Temperature:</strong>
            {{ convertToCelsius(todayWeather.maxt).toFixed(1) }} °C
          </p>
          <p class="mb-2">
            <strong>Humidity:</strong>
            {{ todayWeather.humidity }} %
          </p>
          <p class="mb-2">
            <strong>Min Temperature:</strong>
            {{ convertToCelsius(todayWeather.mint).toFixed(1) }} °C
          </p>
          <p class="mb-2">
            <strong>Precipitation:</strong>
            {{ todayWeather.precip }} mm
          </p>
          <p class="mb-2">
            <strong>Conditions:</strong>
            {{ todayWeather.conditions }}
          </p>
          <p class="mb-2">
            <strong>Wind Speed:</strong>
            {{ todayWeather.wspd }} mph
          </p>
          <p class="mb-2">
            <strong>UV Index:</strong>
            {{ todayWeather.uvindex }}
          </p>
          <p class="mb-2">
            <strong>Visibility:</strong>
            {{ todayWeather.visibility }} km
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(weather, index) in weatherData.slice(1)" :key="index" class="bg-white shadow-md rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-2">
            {{ new Date(weather.datetimeStr).toLocaleDateString() }}
          </h2>
          <p class="mb-1">
            <strong>Max Temperature:</strong>
            {{ convertToCelsius(weather.maxt).toFixed(1) }} °C
          </p>
          <p class="mb-1">
            <strong>Min Temperature:</strong>
            {{ convertToCelsius(weather.mint).toFixed(1) }} °C
          </p>
          <p class="mb-1"><strong>Conditions:</strong> {{ weather.conditions }}</p>
          <p class="mb-1"><strong>Precipitation:</strong> {{ weather.precip }} mm</p>
          <p class="mb-1"><strong>UV Index:</strong> {{ weather.uvindex }}</p>
          <p class="mb-1"><strong>Wind Speed:</strong> {{ weather.wspd }} mph</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

interface WeatherData {
  datetimeStr: string;
  maxt: number;
  mint: number;
  conditions: string;
  precip: number;
  uvindex: number;
  wspd: number;
  humidity: number;
  visibility: number;
}

export default defineComponent({
  name: 'Weather',
  setup() {
    const weatherData = ref([] as WeatherData[]);
    const city = ref('Washington,DC,USA');
    const todayWeather = ref(null as WeatherData | null);
    const isLoading = ref(false);
    const location = ref('');
    let svgContent = ref('');

    const fetchWeather = async () => {
      isLoading.value = true;
      const apiKey = 'faa271f72fmshfe9df8831015cddp121d98jsn308069e51507';
      const options = {
        method: 'GET',
        url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
        params: {
          aggregateHours: '24',
          location: city.value,
          contentType: 'json',
          unitGroup: 'us',
          shortColumnNames: '0',
        },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        weatherData.value = response.data.locations[city.value].values;
        location.value = response.data.locations[city.value].address;
        todayWeather.value = weatherData.value[0];
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const convertToCelsius = (fahrenheit: number): number => {
      return ((fahrenheit - 32) * 5) / 9;
    };

    const searchWeather = () => {
      fetchWeather();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        searchWeather();
      }
    };

    const smallScreenSvg = `
    <svg
  role="img"
  width="384"
  height="1000"
  aria-labelledby="loading-aria"
  viewBox="0 0 384 1000"
  preserveAspectRatio="none"
>
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <rect x="0" y="0" rx="0" ry="0" width="384" height="272" /> 
        <rect x="0" y="296" rx="0" ry="0" width="384" height="236" /> 
        <rect x="0" y="556" rx="0" ry="0" width="384" height="236" /> 
        <rect x="0" y="816" rx="0" ry="0" width="384" height="236" />
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ffffff"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>
  `;

  const mediumScreenSvg = `
    <svg
  role="img"
  width="576"
  height="1000"
  aria-labelledby="loading-aria"
  viewBox="0 0 576 1000"
  preserveAspectRatio="none"
>
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <rect x="0" y="0" rx="0" ry="0" width="576" height="224" /> 
        <rect x="300" y="248" rx="0" ry="0" width="276" height="236" /> 
        <rect x="0" y="248" rx="0" ry="0" width="276" height="236" /> 
        <rect x="300" y="511" rx="0" ry="0" width="276" height="236" /> 
        <rect x="0" y="511" rx="0" ry="0" width="276" height="236" /> 
        <rect x="300" y="773" rx="0" ry="0" width="276" height="236" /> 
        <rect x="0" y="773" rx="0" ry="0" width="276" height="236" />
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ffffff"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>
  `;

  const largeScreenSvg = `
    <svg
  role="img"
  width="672"
  height="1000"
  aria-labelledby="loading-aria"
  viewBox="0 0 672 1000"
  preserveAspectRatio="none"
>
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <rect x="0" y="0" rx="0" ry="0" width="672" height="224" /> 
        <rect x="-1" y="248" rx="0" ry="0" width="324" height="236" /> 
        <rect x="348" y="248" rx="0" ry="0" width="324" height="236" /> 
        <rect x="0" y="773" rx="0" ry="0" width="324" height="236" /> 
        <rect x="349" y="773" rx="0" ry="0" width="324" height="236" /> 
        <rect x="0" y="511" rx="0" ry="0" width="324" height="236" /> 
        <rect x="349" y="511" rx="0" ry="0" width="324" height="236" />
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ffffff"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>
  `;
  const extraLargeScreenSvg = `
    <svg
  role="img"
  width="896"
  height="1000"
  aria-labelledby="loading-aria"
  viewBox="0 0 896 1000"
  preserveAspectRatio="none"
>
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <rect x="0" y="0" rx="0" ry="0" width="896" height="224" /> 
        <rect x="306" y="248" rx="0" ry="0" width="282" height="236" /> 
        <rect x="612" y="248" rx="0" ry="0" width="282" height="236" /> 
        <rect x="0" y="248" rx="0" ry="0" width="282" height="236" /> 
        <rect x="306" y="773" rx="0" ry="0" width="282" height="236" /> 
        <rect x="612" y="773" rx="0" ry="0" width="282" height="236" /> 
        <rect x="0" y="773" rx="0" ry="0" width="282" height="236" /> 
        <rect x="306" y="511" rx="0" ry="0" width="282" height="236" /> 
        <rect x="612" y="511" rx="0" ry="0" width="282" height="236" /> 
        <rect x="0" y="511" rx="0" ry="0" width="282" height="236" />
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ffffff"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#b5b5b5"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>
  `;

    const selectSvg = () => {
      const width = window.innerWidth;
      if (width < 640) {
        svgContent.value = smallScreenSvg;
      } else if (width < 768) {
        svgContent.value = mediumScreenSvg;
      } else if (width < 1024) {
        svgContent.value = largeScreenSvg;
      } else {
        svgContent.value = extraLargeScreenSvg;
      }
    };

    onMounted(() => {
      selectSvg();
      fetchWeather();
      window.addEventListener('resize', selectSvg);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', selectSvg);
    });

    return {
      weatherData,
      city,
      todayWeather,
      isLoading,
      location,
      svgContent,
      fetchWeather,
      convertToCelsius,
      searchWeather,
      handleKeydown,
    };
  },
});
</script>
