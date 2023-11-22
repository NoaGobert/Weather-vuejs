<template>
    <div
        class="bg-primary md:bg-white min-h-screen flex items-center justify-center"
    >
        <div
            class="bg-primary min-w-[80%] md:rounded-lg md:shadow-lg p-8 md:min-w-[60%]"
        >
            <div class="flex items-center justify-between">
                <div
                    class="flex justify-center items-center gap-2 bg-secondary rounded-lg p-2"
                >
                    <font-awesome-icon
                        icon="magnifying-glass"
                        class="text-white cursor-pointer"
                        @click="fetchWeather"
                    />
                    <input
                        type="text"
                        placeholder="Search city"
                        v-model="city"
                        @keyup.enter="fetchWeather"
                        class="placeholder-white bg-transparent border-none focus:outline-none text-white text-lg w-24 sm:w-48 md:w-64"
                    />
                </div>
                <div class="text-white text-2xl flex items-center gap-5">
                    <button @click="toggleUnit">
                        {{ isCelsius ? "°C" : "°F" }}
                    </button>
                </div>
            </div>
            <div
                class="flex flex-col justify-center items-center text-white mt-12 gap-6"
                v-if="weather"
            >
                <h1 class="font-bold text-4xl">
                    {{ weather.name }}, {{ weather.sys.country }}
                </h1>
                <h4 class="bg-secondary rounded-full py-2 px-8">
                    {{ weather.weather[0].main }}
                </h4>
                <img
                    :src="
                        'https://openweathermap.org/img/wn/' +
                        weather.weather[0].icon +
                        '@2x.png'
                    "
                    :alt="weather.weather[0].description"
                    class="w-28 h-28"
                />
                <p class="text-3xl font-bold">
                    {{ Math.round(weather.main.temp) }}°
                </p>
                <div class="flex justify-center items-center gap-4">
                    <p>Min : {{ Math.round(weather.main.temp_min) }}°</p>
                    <p>Max : {{ Math.round(weather.main.temp_max) }}°</p>
                </div>
                <div class="grid grid-cols-2 gap-4 w-full text-left text-sm">
                    <div
                        class="bg-secondary py-7 px-10 rounded-lg flex items-center gap-4"
                    >
                        <i
                            class="fa-solid fa-temperature-three-quarters text-2xl"
                        ></i>

                        <div>
                            <p>Real Feel</p>
                            <p>{{ Math.round(weather.main.feels_like) }}°</p>
                        </div>
                    </div>
                    <div
                        class="bg-secondary py-7 px-10 rounded-lg flex items-center gap-4"
                    >
                        <i class="fa-solid fa-droplet text-2xl"></i>
                        <div>
                            <p>Humidity</p>
                            <p>{{ weather.main.humidity }}%</p>
                        </div>
                    </div>
                    <div
                        class="bg-secondary py-7 px-10 rounded-lg flex items-center gap-4"
                    >
                        <i class="fa-solid fa-wind text-2xl"></i>
                        <div>
                            <p>Wind</p>
                            <p>{{ windSpeed }} m/s</p>
                        </div>
                    </div>
                    <div
                        class="bg-secondary py-7 px-10 rounded-lg flex items-center gap-4"
                    >
                        <i class="fa-solid fa-gauge-high text-2xl"></i>
                        <div>
                            <p>Pressure</p>
                            <p>{{ weather.main.pressure }} hPa</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted, computed, watch } from "vue";
    import axios from "axios";

    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = import.meta.env.VITE_API_KEY;

    const city = ref("");
    const weather = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const latitude = ref(null);
    const longitude = ref(null);

    const isCelsius = ref(true);
    const toggleUnit = () => {
        isCelsius.value = !isCelsius.value;
    };
    const url = computed(
        () =>
            `${API_URL}?q=${city.value}&appid=${apiKey}&units=${
                isCelsius.value ? "metric" : "imperial"
            }`
    );
    const fetchWeather = async () => {
        loading.value = true;
        error.value = null;

        try {
            const response = await axios.get(url.value);

            const data = response.data;

            if (!data || !data.name || !data.weather || !data.main) {
                throw new Error("Invalid response data");
            }
            weather.value = data;
            console.log(response);
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

                const url = `${API_URL}?lat=${latitude.value}&lon=${
                    longitude.value
                }&appid=${apiKey}&units=${
                    isCelsius.value ? "metric" : "imperial"
                }`;

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
    watch(isCelsius, () => {
        if (city.value) {
            fetchWeather();
        } else {
            fetchWeatherByLocation();
        }
    });
    const windSpeed = computed(() => {
        if (!isCelsius.value && weather.value && weather.value.wind) {
            return (weather.value.wind.speed * 0.44704).toFixed(2);
        } else if (weather.value && weather.value.wind) {
            return weather.value.wind.speed;
        } else {
            return null;
        }
    });

    onMounted(fetchWeatherByLocation);
</script>
