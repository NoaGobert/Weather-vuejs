<template>
  <div class="bg-gray-200 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold mb-4">Search for a city</h1>
      <input
        type="text"
        class="w-full bg-gray-200 bg-opacity-50 rounded-lg p-4 focus:outline-none focus:bg-opacity-100"
        placeholder="Enter city name"
        v-model="city"
        @keyup.enter="fetchWeather"
      />
      <div v-if="loading">Loading...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="weather" class="mt-4">
        <h2 class="text-3xl font-bold">
          {{ weather.name }} {{ weather.sys.country }}
        </h2>
        <div class="flex items-center mt-4">
          <img
            :src="
              'https://openweathermap.org/img/w/' +
              weather.weather[0].icon +
              '.png'
            "
            :alt="weather.weather[0].description"
            class="w-16 h-16 mr-4"
          />
          <p class="text-xl">{{ weather.weather[0].description }}</p>
        </div>
        <p class="text-6xl font-bold mt-4">
          {{ Math.round(weather.main.temp) }} &#8451;
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const VUE_APP_API_KEY = process.env.VUE_APP_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
export default {
  data() {
    return {
      city: "",
      weather: null,
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchWeather() {
      try {
        this.loading = true;
        this.error = null;
        const url = `${API_URL}?q=${this.city}&appid=${VUE_APP_API_KEY}&units=metric`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (!data || !data.name || !data.weather || !data.main) {
          throw new Error("Invalid response data");
        }
        this.weather = data;
      } catch (error) {
        console.error(error);
        this.error = "There was a problem fetching the weather data.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
