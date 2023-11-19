<template>
    <div class="bg-white min-h-screen flex items-center justify-center">
        <div class="bg-primary w-[80%] rounded-lg shadow-lg p-8">
            <div class="flex items-center justify-between">
                <div
                    class="flex justify-center items-center gap-2 bg-secondary rounded-lg p-2"
                >
                    <font-awesome-icon
                        icon="magnifying-glass"
                        style="color: #ffffff"
                    />
                    <input
                        type="text"
                        placeholder="Search for a city..."
                        class="placeholder-white bg-transparent border-none focus:outline-none text-white text-lg"
                    />
                </div>

                <div class="text-white text-3xl flex items-center gap-3">
                    <button>&deg;C</button>
                    <button>F&deg;</button>
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
            error.value = "There was a problem fetching the weather data.";
        } finally {
            loading.value = false;
        }
    };

    const fetchWeatherByLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                latitude.value = position.coords.latitude;
                longitude.value = position.coords.longitude;

                const url = `${API_URL}?lat=${latitude.value}&lon=${longitude.value}&appid=${apiKey}&units=metric`;

                try {
                    const response = await axios.get(url);
                    const data = response.data;
                    if (!data || !data.name || !data.weather || !data.main) {
                        throw new Error("Invalid response data");
                    }
                    weather.value = data;
                } catch (err) {
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
