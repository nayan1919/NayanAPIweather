document.addEventListener("DOMContentLoaded", () => {
    updateDropdown();
});


// API Key and base URL setup
let apiKey = "ce841c5cffa60f901516715147260f60";
let urlBase = "https://api.openweathermap.org/data/2.5/";

// Fetch weather data by city name
async function getWeatherByCity(city) {
    let url = `${urlBase}weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
            displayWeather(result);
            addToRecentSearches(city);
        } else {
            showError("City not found. Please try another name.");
        }
    } catch (error) {
        showError("An error occurred. Please try again later.");
        console.error(error);
    }
}

// Fetch weather data by latitude and longitude
async function getWeatherByLocation(lat, lon) {
    let url = `${urlBase}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
            displayWeather(result);
        } else {
            showError("Unable to fetch location weather.");
        }
    } catch (error) {
        showError("An error occurred. Please try again later.");
        console.error(error);
    }
}

// Display weather data in the HTML
function displayWeather(data) {

	const cityElement = document.getElementById("city");
    console.log("City element:", cityElement);  // Checking if this element is found
    
    if (cityElement) {
        cityElement.textContent = data.city;
    } else {
        console.warn("City element not found!");
    }

	const weatherContainer = document.getElementById("nuke");
    if (weatherContainer) {
        weatherContainer.classList.remove("hidden");
    } else {
        console.warn("Weather container element not found!");
    }

    document.getElementById("nuke").classList.remove("hidden");
    document.getElementById("city").textContent = data.name;
    document.getElementById("temp1").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("temp2").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("temp3").textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById("temp4").textContent = data.weather[0].description;
    document.getElementById("weather").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Event listener for the search button
document.getElementById("sea").addEventListener("click", () => {
    let city = document.getElementById("studentName").value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError("Please enter a city name.");
    }
});

// Event listener for the current location button
document.querySelector(".bg-slate-600").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => getWeatherByLocation(position.coords.latitude, position.coords.longitude),
            () => showError("Location access denied. Enable location and try again.")
        );
    } else {
        showError("Geolocation is not supported by this browser.");
    }
});

// Add city to recent searches and create dropdown menu
function addToRecentSearches(city) {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem("recentCities", JSON.stringify(recentCities));
        updateDropdown();
    }
}

// Populate the dropdown with recent cities
function updateDropdown() {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    const dropdown = document.getElementById("recentCitiesDropdown");
    
    console.log("Recent Cities:", recentCities); // Debugging line
    console.log("Dropdown Element:", dropdown); // Debugging line

    if (!dropdown) {
        console.warn("Dropdown element not found!");
        return; // Exit function if dropdown element is missing
    }

    dropdown.innerHTML = "";  // Clear previous options

    recentCities.forEach(city => {
        let option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", () => {
        if (dropdown.value) {
            getWeatherByCity(dropdown.value);
        }
    });
}



// Show error message
function showError(message) {
    // const errorDiv = document.getElementById("error");
    // errorDiv.textContent = message;
    // errorDiv.classList.remove("hidden");
    // setTimeout(() => errorDiv.classList.add("hidden"), 3000);

	const errorElement = document.getElementById("error");
    console.log("Error element:", errorElement);  // Check if this element is found
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");  // Make it visible
    } else {
        console.warn("Error element not found!");
    }
}

// Initialize dropdown
document.addEventListener("DOMContentLoaded", updateDropdown);
