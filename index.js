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
