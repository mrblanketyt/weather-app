document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '315ad28fafbb4dcb9ab165456243107';
    const weatherDiv = document.getElementById('weather');

    function fetchWeather() {
        // Use the geolocation API to get the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const weather = `
                            <h2>${data.location.name}</h2>
                            <p>${data.current.condition.text}</p>
                            <p>Temperature: ${data.current.temp_c}°C</p>
                            <p>Humidity: ${data.current.humidity}%</p>
                            <p>Wind speed: ${data.current.wind_kph} kph</p>
                        `;
                        weatherDiv.innerHTML = weather;
                    })
                    .catch(error => {
                        weatherDiv.innerHTML = '<p>Unable to retrieve weather data.</p>';
                    });
            }, error => {
                weatherDiv.innerHTML = '<p>Unable to retrieve your location.</p>';
            });
        } else {
            weatherDiv.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
        }
    }

    fetchWeather();
});
