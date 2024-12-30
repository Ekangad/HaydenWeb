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
// Function to calculate the weighted average
function calculateGrade() {
    let totalWeightedSum = 0; // To store the sum of weighted scores
    let totalProvidedWeight = 0; // To store the sum of provided weights
  
    // Loop through all 10 grade slots
    for (let i = 1; i <= 10; i++) {
      let grade = parseFloat(document.getElementById(`grade${i}`).value);
      let weight = parseFloat(document.getElementById(`weight${i}`).value);
  
      // Skip if any field in this slot is empty or invalid
      if (isNaN(grade) || isNaN(weight) || weight <= 0) {
        continue;
      }
  
      // Add the weighted score to the total
      totalWeightedSum += (grade * weight);
  
      // Add the weight to the total provided weight
      totalProvidedWeight += weight;
    }
  
    // Validate that some weight was provided
    if (totalProvidedWeight === 0) {
      document.getElementById("result").innerHTML =
        "Please enter valid grades and weights.";
      return;
    }
  
    // Normalize the totalWeightedSum by the provided weight
    let weightedAverage = totalWeightedSum / totalProvidedWeight;
  
    // Display the result
    document.getElementById("result").innerHTML = `The Weighted Average is: ${weightedAverage.toFixed(
      2
    )}%`;
  }
  
  // Add event listener to the button to calculate grades on click
  document
    .getElementById("calculateButton")
    .addEventListener("click", calculateGrade);