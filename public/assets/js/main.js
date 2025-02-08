const searchInput = document.getElementById("search-location");
const searchButton = document.querySelector(".location-btn");

// Function to fetch weather data
async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=afd944b26f1a45e09b7153038250402&q=${city}&days=10&aqi=no&alerts=no`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Update current weather
        document.getElementById("city-name").textContent = data.location.name;
        document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
        document.getElementById("feels-like").textContent = `${data.current.feelslike_c}°C`;
        document.getElementById("weather-description").textContent = data.current.condition.text;
        document.getElementById("weather-icon").src = `https:${data.current.condition.icon}`;
        document.getElementById("humidity").textContent = `${data.current.humidity}%`;
        document.getElementById("wind-speed").textContent = `${data.current.wind_kph} km/h`;
        document.getElementById("pressure").textContent = `${data.current.pressure_mb} hPa`;
        document.getElementById("uv").textContent = data.current.uv;

        // Update sunrise/sunset
        document.getElementById("sunrise").textContent = data.forecast.forecastday[0].astro.sunrise;
        document.getElementById("sunset").textContent = data.forecast.forecastday[0].astro.sunset;

        // Update time and date
        const localTime = new Date(data.location.localtime);
        document.getElementById("time").textContent = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById("date").textContent = localTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

        // Update 5-day forecast
        const forecastList = document.getElementById("five-day-forecast");
        forecastList.innerHTML = "";
        
        data.forecast.forecastday.slice(2, 7).forEach((day) => {
            const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'short'
            });
        
            forecastList.innerHTML += `
                <div class="forecast-item">
                    <img src="https:${day.day.condition.icon}" alt="weather icon">
                    <span>${day.day.avgtemp_c}°C</span>
                    <span>${formattedDate}</span>
                </div>`;
        });

        // Update hourly forecast
        const hourlyList = document.getElementById("hourly-forecast");
        hourlyList.innerHTML = ""; 
        
        const filteredHours = data.forecast.forecastday[0].hour
            .filter((_, index) => index % 3 === 0)
            .slice(0, 5); 
        
        filteredHours.forEach((hour) => {
            const hourTime = hour.time.split(" ")[1]; 
        
            hourlyList.innerHTML += `
                <div class="hour">
                    <span>${hourTime}</span>
                    <img src="https:${hour.condition.icon}" alt="weather icon">
                    <span>${hour.temp_c}°C</span>
                    <span>💧 ${hour.humidity}%</span> <!-- Replaced Wind Speed with Humidity -->
                </div>`;
        });
        
    } catch (error) {
        console.log("Error fetching weather data:", error);
    }
}


// Event listener for search
searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Load default city on page load
getWeather("Toronto");
