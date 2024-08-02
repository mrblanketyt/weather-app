document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '315ad28fafbb4dcb9ab165456243107';
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');
    const hourlyDiv = document.getElementById('hourly');
    const cityInput = document.getElementById('cityInput');
    const unitToggle = document.getElementById('unitToggle');
    const clearSearchBtn = document.createElement('button');
    clearSearchBtn.textContent = 'Clear Search';
    clearSearchBtn.classList.add('clear-search-btn');
    clearSearchBtn.addEventListener('click', clearSearch);
    document.querySelector('.search-bar').appendChild(clearSearchBtn);

    let isCelsius = localStorage.getItem('unit') === 'celsius';

    function fetchWeatherByCity() {
        const city = cityInput.value;
        if (city) {
            showLoadingSpinner();
            fetchWeather(city);
        }
    }

    function showLoadingSpinner() {
        weatherDiv.innerHTML = '<div class="spinner"></div>';
        forecastDiv.innerHTML = '';
        hourlyDiv.innerHTML = '';
    }

    function fetchWeather(city) {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
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
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&alerts=yes`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayForecast(data.forecast.forecastday);
                displayAlerts(data.alerts);
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
        const temp = isCelsius ? data.current.temp_c : data.current.temp_f;
        const unit = isCelsius ? '°C' : '°F';
        const weather = `
            <h2>${data.location.name}</h2>
            <p>${data.current.condition.text}</p>
            <p>Temperature: ${temp}${unit}</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind speed: ${data.current.wind_kph} kph</p>
        `;
        weatherDiv.innerHTML = weather;
    }

    function displayForecast(forecast) {
        let forecastHTML = '<h2>5-Day Forecast</h2>';
        forecast.forEach(day => {
            const maxTemp = isCelsius ? day.day.maxtemp_c : day.day.maxtemp_f;
            const minTemp = isCelsius ? day.day.mintemp_c : day.day.mintemp_f;
            const unit = isCelsius ? '°C' : '°F';
            forecastHTML += `
                <div class="forecast-item">
                    <p>${day.date}</p>
                    <p>${day.day.condition.text}</p>
                    <p>Max: ${maxTemp}${unit}</p>
                    <p>Min: ${minTemp}${unit}</p>
                </div>
            `;
        });
        forecastDiv.innerHTML = forecastHTML;
    }

    function displayHourly(hourly) {
        let hourlyHTML = '<h2>Hourly Forecast</h2>';
        hourly.forEach(hour => {
            const temp = isCelsius ? hour.temp_c : hour.temp_f;
            const unit = isCelsius ? '°C' : '°F';
            hourlyHTML += `
                <div class="hourly-item">
                    <p>${hour.time.split(' ')[1]}</p>
                    <p>${hour.condition.text}</p>
                    <p>Temperature: ${temp}${unit}</p>
                </div>
            `;
        });
        hourlyDiv.innerHTML = hourlyHTML;
    }

    function displayAlerts(alerts) {
        const alertsDiv = document.getElementById('alerts');
        if (alerts && alerts.alert.length > 0) {
            let alertsHTML = '<h2>Weather Alerts</h2>';
            alerts.alert.forEach(alert => {
                alertsHTML += `
                    <div class="alert-item">
                        <p><strong>${alert.headline}</strong></p>
                        <p>${alert.desc}</p>
                    </div>
                `;
            });
            alertsDiv.innerHTML = alertsHTML;
        } else {
            alertsDiv.innerHTML = '<p>No weather alerts</p>';
        }
    }

    function handleUnitToggle() {
        isCelsius = unitToggle.value === 'celsius';
        localStorage.setItem('unit', unitToggle.value);
        if (cityInput.value) {
            fetchWeather(cityInput.value);
        }
    }

    cityInput.addEventListener('input', function () {
        const query = cityInput.value;
        if (query.length > 0) {
            fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
                .then(response => response.json())
                .then(data => {
                    const suggestions = data.map(city => `<div class="suggestion-item">${city.name}, ${city.region}</div>`).join('');
                    let suggestionsContainer = document.querySelector('.suggestions-container');
                    if (!suggestionsContainer) {
                        suggestionsContainer = document.createElement('div');
                        suggestionsContainer.classList.add('suggestions-container');
                        document.querySelector('.search-bar').appendChild(suggestionsContainer);
                    }
                    suggestionsContainer.innerHTML = suggestions;
                    suggestionsContainer.addEventListener('click', function(e) {
                        cityInput.value = e.target.textContent;
                        suggestionsContainer.innerHTML = '';
                    });
                });
        }
    });

    function clearSearch() {
        cityInput.value = '';
        weatherDiv.innerHTML = '';
        forecastDiv.innerHTML = '';
        hourlyDiv.innerHTML = '';
        document.querySelector('.suggestions-container')?.remove();
        window.scrollTo(0, 0);
    }

    document.querySelector('button').addEventListener('click', fetchWeatherByCity);
    unitToggle.addEventListener('change', handleUnitToggle);

    if (!isCelsius) {
        unitToggle.value = 'fahrenheit';
    }
});
