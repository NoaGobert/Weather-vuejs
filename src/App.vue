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
      <div v-if="loading" class="mt-4 text-xl font-bold">Loading...</div>
      <div v-if="error" class="mt-4 text-xl font-bold">{{ error }}</div>
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
import axios from "axios";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = import.meta.env.VITE_API_KEY;
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
    fetchWeather() {
      this.loading = true;
      this.error = null;
      const url = `${API_URL}?q=${this.city}&appid=${apiKey}&units=metric`;

      axios
        .get(url)
        .then((response) => {
          const data = response.data;
          if (!data || !data.name || !data.weather || !data.main) {
            throw new Error("Invalid response data");
          }
          this.weather = data;
        })
        .catch((error) => {
          console.error(error);
          this.error = "There was a problem fetching the weather data.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
