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
            <div v-if="error" class="mt-4 text-xl font-bold text-red-500">
                {{ error }}
            </div>
            <div v-if="weather" class="mt-4">
                <h2 class="text-3xl font-bold">
                    {{ weather.name }}, {{ weather.sys.country }}
                </h2>
                <div class="flex items-center mt-4">
                    <img
                        :src="
                            'https://openweathermap.org/img/wn/' +
                            weather.weather[0].icon +
                            '@2x.png'
                        "
                        :alt="weather.weather[0].description"
                        class="w-16 h-16 mr-4"
                    />
                    <p class="text-xl">{{ weather.weather[0].description }}</p>
                </div>
                <p class="text-6xl font-bold mt-4">
                    {{ Math.round(weather.main.temp) }} &#8451;
                </p>

                <div class="mt-8 flex justify-between">
                    <div>
                        <p class="text-lg font-bold mb-2">Wind Speed</p>
                        <p
                            class="text-3xl font-bold text-green-500 leading-none"
                        >
                            {{ Math.round(weather.wind.speed) }} km/h
                        </p>
                    </div>
                    <div>
                        <p class="text-lg font-bold mb-2">Humidity</p>
                        <p
                            class="text-3xl font-bold text-blue-500 leading-none"
                        >
                            {{ weather.main.humidity }} %
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted } from "vue";
    import axios from "axios";

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = import.meta.env.VITE_API_KEY;

    const city = ref("");
    const weather = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const latitude = ref(null);
    const longitude = ref(null);

    const fetchWeather = async () => {
        loading.value = true;
        error.value = null;

        const url = `${API_URL}?q=${city.value}&appid=${apiKey}&units=metric`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            if (!data || !data.name || !data.weather || !data.main) {
                throw new Error("Invalid response data");
            }
            weather.value = data;
        } catch (err) {
            console.error(err);
            error.value = "There was a problem fetching the weather data.";
        } finally {
            loading.value = false;
        }
    };

    const fetchWeatherByLocation = async () => {
        console.log("call");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                console.log(
                    position.coords.latitude,
                    position.coords.longitude
                );
                latitude.value = position.coords.latitude;
                longitude.value = position.coords.longitude;
                console.log(latitude.value, longitude.value);

                const url = `${API_URL}?lat=${latitude.value}&lon=${longitude.value}&appid=${apiKey}&units=metric`;

                try {
                    const response = await axios.get(url);
                    const data = response.data;
                    if (!data || !data.name || !data.weather || !data.main) {
                        throw new Error("Invalid response data");
                    }
                    weather.value = data;
                } catch (err) {
                    console.error(err);
                    error.value =
                        "There was a problem fetching the weather data.";
                } finally {
                    loading.value = false;
                }
            });
        }
    };

    onMounted(fetchWeatherByLocation);
</script>
