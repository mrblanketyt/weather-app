document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '315ad28fafbb4dcb9ab165456243107';
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');
    const hourlyDiv = document.getElementById('hourly');

    function fetchWeatherByCity() {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchWeather(city);
        }
    }

    function fetchWeather(city) {
        weatherDiv.innerHTML = 'Loading...';
        forecastDiv.innerHTML = '';
        hourlyDiv.innerHTML = '';

        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                fetchForecast(city);
                fetchHourly(city);
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

    function fetchHourly(city) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&hours=24`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayHourly(data.forecast.forecastday[0].hour);
            })
            .catch(error => {
                hourlyDiv.innerHTML = '<p>Unable to retrieve hourly data.</p>';
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

    function displayHourly(hourly) {
        let hourlyHTML = '<h2>Hourly Forecast</h2>';
        hourly.forEach(hour => {
            hourlyHTML += `
                <div>
                    <p>${hour.time}</p>
                    <p>${hour.condition.text}</p>
                    <p>Temperature: ${hour.temp_c}°C</p>
                </div>
            `;
        });
        hourlyDiv.innerHTML = hourlyHTML;
    }

    document.querySelector('button').addEventListener('click', fetchWeatherByCity);
});
