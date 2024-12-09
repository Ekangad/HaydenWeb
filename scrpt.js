const periods = [
    { id: 'period1', start: '08:40', end: '09:55' },
    { id: 'period2', start: '10:00', end: '11:15' },
    { id: 'lunch', start: '11:15', end: '12:15' },
    { id: 'period3', start: '12:15', end: '13:30' },
    { id: 'period4', start: '13:35', end: '14:50' }
];

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
}

function updateTimer() {
    const now = new Date();
    let currentPeriod = null;
    let timeLeft = null;

    periods.forEach(period => {
        const periodStart = parseTime(period.start);
        const periodEnd = parseTime(period.end);

        if (now >= periodStart && now <= periodEnd) {
            currentPeriod = period;
            timeLeft = (periodEnd - now) / 1000; // time left in seconds
        }
    });

    // Update the timer display
    const timerElement = document.getElementById('timer');
    if (currentPeriod) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = Math.floor(timeLeft % 60);
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        timerElement.textContent = 'No active period';
    }

    // Highlight the current period
    periods.forEach(period => {
        const element = document.getElementById(period.id);
        if (period === currentPeriod) {
            element.classList.add('current');
        } else {
            element.classList.remove('current');
        }
    });
}

// Update the timer every second
setInterval(updateTimer, 1000);
updateTimer();

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('monthYear');
    const now = new Date();

    // Get current month and year
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed (January = 0)
    const monthName = now.toLocaleString('default', { month: 'long' });

    // Set the title
    monthYear.textContent = `${monthName} ${year}`;

    // Clear any existing days (but keep day names)
    const dayNames = 7; // First 7 items are day names
    while (calendarGrid.childElementCount > dayNames) {
        calendarGrid.lastChild.remove();
    }

    // Get the first and last day of the month
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0 = Sunday)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month

    // Add empty divs for days before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }

    // Add day numbers
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);
    }
}

// Generate the calendar on page load
generateCalendar();

const apiKey = "be7009a386e0e733d64c6146183554bf"; // Replace with your OpenWeatherMap API key
const city = "Burlington"; // Replace with your city
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

async function fetchWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const forecastContainer = document.getElementById("weather-forecast");
        forecastContainer.innerHTML = ""; // Clear previous content

        const now = new Date();

        // Find the closest forecast to the current time that belongs to today
        const todayDate = now.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        console.log(todayDate)
        const todayForecasts = data.list.filter(item => item.dt_txt.split(" ")[0] === todayDate);
        

        // Find the closest time forecast for today
        const closestForecast = todayForecasts.reduce((closest, current) => {
            const currentDateTime = new Date(current.dt * 1000);
            return Math.abs(currentDateTime - now) < Math.abs(new Date(closest.dt * 1000) - now)
                ? current
                : closest;
        });

        // Collect daily forecasts for the following days at 12:00 PM
        const dailyForecasts = data.list.filter(item => {
            const forecastTime = item.dt_txt.split(" ")[1];
            const forecastDate = item.dt_txt.split(" ")[0];
            return forecastTime === "12:00:00" && forecastDate !== todayDate;
        });

        // Insert the "Today" forecast as the first item
        dailyForecasts.unshift(closestForecast);

        let rowContainer = null;

        dailyForecasts.forEach((day, index) => {
            const dateLabel = index === 0 ? "Today" : new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
            const temp = Math.round(day.main.temp);
            const icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

            // Create weather card
            const weatherCard = document.createElement("div");
            weatherCard.classList.add("weather-day");
            weatherCard.innerHTML = `
                <div>${dateLabel}</div>
                <div><img src="${icon}" alt="${day.weather[0].description}" class="weather-icon"></div>
                <div>${temp}°C</div>
            `;

            // Create a new row container every 3 items
            if (index % 3 === 0) {
                rowContainer = document.createElement("div");
                rowContainer.classList.add("weather-row");
                forecastContainer.appendChild(rowContainer);
            }

            // Append the weather card to the current row container
            rowContainer.appendChild(weatherCard);
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}





// Call the function on page load
fetchWeather();
