

        async function fetchWeatherData() {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=45.1073&longitude=7.664&hourly=temperature_2m,weather_code&forecast_days=1');
            const data = await response.json();
            return data;
        }
        async function createChart() {
            const weatherData = await fetchWeatherData();
            const temperatures = weatherData.hourly.temperature_2m;
            const hours = weatherData.hourly.time.map(time => new Date(time).getHours() + 'h');

            const ctx = document.getElementById('weatherChart').getContext('2d');
            const weatherChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: temperatures,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        window.onload = createChart;
