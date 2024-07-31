document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_API_KEY';
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');

    function fetchWeatherByCity() {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchWeather(city);
        }
    }

    function fetchWeather(city) {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                fetchForecast(city);
            })
            .catch(error => {
                weatherDiv.innerHTML = '<p>Unable to retrieve weather data.</p>';
            });
    }

    function fetchForecast(city) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayForecast(data.forecast.forecastday);
            })
            .catch(error => {
                forecastDiv.innerHTML = '<p>Unable to retrieve forecast data.</p>';
            });
    }

    function displayWeather(data) {
        const weather = `
            <h2>${data.location.name}</h2>
            <p>${data.current.condition.text}</p>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind speed: ${data.current.wind_kph} kph</p>
        `;
        weatherDiv.innerHTML = weather;
    }

    function displayForecast(forecast) {
        let forecastHTML = '<h2>5-Day Forecast</h2>';
        forecast.forEach(day => {
            forecastHTML += `
                <div>
                    <p>${day.date}</p>
                    <p>${day.day.condition.text}</p>
                    <p>Max: ${day.day.maxtemp_c}°C</p>
                    <p>Min: ${day.day.mintemp_c}°C</p>
                </div>
            `;
        });
        forecastDiv.innerHTML = forecastHTML;
    }
});
