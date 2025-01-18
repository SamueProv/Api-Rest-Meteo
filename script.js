const weatherDescriptions = {
    0: "Cielo sereno",
    1: "Principalmente sereno",
    2: "Parzialmente nuvoloso",
    3: "Coperto",
    45: "Nebbia",
    48: "Nebbia con brina",
    51: "Pioggia leggera",
    53: "Pioggia moderata",
    55: "Pioggia intensa",
    56: "Pioggia congelante leggera",
    57: "Pioggia congelante intensa",
    61: "Pioggia leggera",
    63: "Pioggia moderata",
    65: "Pioggia intensa",
    66: "Pioggia congelante leggera",
    67: "Pioggia congelante intensa",
    71: "Neve leggera",
    73: "Neve moderata",
    75: "Neve intensa",
    77: "Grani di neve",
    80: "Rovesci leggeri",
    81: "Rovesci moderati",
    82: "Rovesci violenti",
    85: "Nevischio leggero",
    86: "Nevischio intenso",
    95: "Temporale leggero o moderato",
    96: "Temporale con leggera grandine",
    99: "Temporale con grandine intensa"
};

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    loadWeatherData(city, new Date().toISOString().split('T')[0]); 
});

function loadWeatherData(city, date) {
    const cityCoordinates = {
        'Torino': { latitude: 45.1073, longitude: 7.664 },
    };

    const coordinates = cityCoordinates[city];
    if (!coordinates) {
        alert('Città non trovata. Per favore, inserisci una città valida.');
        return;
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m,weather_code&forecast_days=1&timezone=Europe/Rome`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const labels = data.hourly.time.map(time => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            const temperatureData = data.hourly.temperature_2m;
            const weatherCodeData = data.hourly.weather_code;

            const ctx = document.getElementById('weatherChart').getContext('2d');
            const weatherChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperatura (°C)',
                            data: temperatureData,
                            borderColor: 'rgba(0, 188, 212, 1)',
                            backgroundColor: 'rgba(0, 188, 212, 0.2)',
                            fill: false,
                            tension: 0.1,
                            pointBackgroundColor: 'rgba(0, 188, 212, 1)',
                            pointBorderColor: 'rgba(0, 188, 212, 1)',
                        },
                        {
                            label: 'Codice Meteo',
                            data: weatherCodeData,
                            borderColor: 'rgba(103, 58, 183, 1)',
                            backgroundColor: 'rgba(103, 58, 183, 0.2)',
                            fill: false,
                            tension: 0.1,
                            pointBackgroundColor: 'rgba(103, 58, 183, 1)',
                            pointBorderColor: 'rgba(103, 58, 183, 1)',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#ffffff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            });

            const weatherCodeDisplay = document.getElementById('weatherCodeDisplay');
            weatherCodeDisplay.innerHTML = weatherCodeData.map((code, index) => {
                return `Ore ${labels[index]}: ${weatherDescriptions[code]} (Codice: ${code})`;
            }).join('<br>');

            const timeSegments = document.getElementById('timeSegments');
            timeSegments.innerHTML = `
                <h3>Fasce Orarie</h3>
                <div>Notte (00:00 - 06:00): ${getWeatherForTimeSegment(data.hourly.weather_code, data.hourly.temperature_2m, labels, 0, 6)}</div>
                <div>Mattina (06:00 - 12:00): ${getWeatherForTimeSegment(data.hourly.weather_code, data.hourly.temperature_2m, labels, 6, 12)}</div>
                <div>Pomeriggio (12:00 - 18:00): ${getWeatherForTimeSegment(data.hourly.weather_code, data.hourly.temperature_2m, labels, 12, 18)}</div>
                <div>Sera (18:00 - 24:00): ${getWeatherForTimeSegment(data.hourly.weather_code, data.hourly.temperature_2m, labels, 18, 24)}</div>
            `;
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('Si è verificato un errore durante il recupero dei dati meteo.');
        });
}

document.querySelectorAll('.date-button').forEach(button => {
    button.addEventListener('click', function() {
        const selectedDate = this.id; 
        const city = document.getElementById('cityInput').value; 
        loadWeatherData(city, selectedDate); 
    });
});

function getWeatherForTimeSegment(weatherCodeData, temperatureData, labels, startHour, endHour) {
    const segmentWeather = weatherCodeData.slice(startHour, endHour).map((code, index) => {
        const temperature = temperatureData[startHour + index];
        return `${weatherDescriptions[code]} (Temp: ${temperature}°C)`;
    });
    return segmentWeather.join(', ') || 'Nessun dato disponibile';
}