document.addEventListener("DOMContentLoaded", () => {
    updateDropdown();
});

document.getElementById("sea").addEventListener("click", () => {
    let city = document.getElementById("studentName").value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        showError("Please enter a city name.");
    }
});

// API Key and base URL setup
let apiKey = "ce841c5cffa60f901516715147260f60";
let urlBase = "https://api.openweathermap.org/data/2.5/";
// const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric` // 5 days api url

// Fetch weather data by city name
async function getWeatherByCity(city) {
    let url = `${urlBase}weather?q=${city}&appid=${apiKey}&units=metric`;
    let forecastUrl = `${urlBase}forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const result = await response.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (forecastResponse.ok) {
            displayForecast(forecastData);
        } else {
            showError("Could not fetch forecast data.");
        }

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

    document.querySelector(".nuke").classList.remove("hidden");
    document.querySelector("#city").textContent = data.name;
    document.querySelector("#temp1").innerHTML = `
    <span style="display: inline-flex; align-items: center;">
        <img src="image/heat1.png" alt="Temperature Icon" style="width: 20px; margin-right: 5px;">
        Temperature: ${Math.floor(data.main.temp)}°C
    </span>`;

    document.querySelector("#temp2").innerHTML = `
    <span style="display: inline-flex; align-items: center;">
        <img src="image/humidity.png" alt="Humidity Icon" style="width: 20px; margin-right: 5px;">
        Humidity: ${data.main.humidity}%
    </span>`;

    document.querySelector("#temp3").innerHTML = `
    <span style="display: inline-flex; align-items: center;">
        <img src="image/windock.png" alt="Wind Speed Icon" style="width: 20px; margin-right: 5px;">
        Wind Speed: ${data.wind.speed} m/s
    </span>`;


    document.querySelector("#temp4").textContent = data.weather[0].description;
    document.querySelector("#weather").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

// Event listener for the search button

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

// 5 days weather data fetching and showing

function displayForecast(data) {
    const forecastList = data.list;
    const forecastContainer = document.getElementById("fox");
    const cells = forecastContainer.getElementsByClassName("cell");

    // Clear any existing error message
    document.getElementById("error").classList.add("hidden");

    // Show the forecast container
    document.querySelector(".nuke").classList.remove("hidden");

    // Iterate over the next 5 days of forecast (data every 3 hours, so we skip to approx every 24 hours)
    for (let i = 0; i < 5; i++) {
        const forecast = forecastList[i * 8]; // Approx every 24 hours
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const temp = forecast.main.temp;
        const tempMin = forecast.main.temp_min;
        const tempMax = forecast.main.temp_max;
        const description = forecast.weather[0].description;

        // Image selection based on temperature
        let imageSrc = ""; // Default to an empty source

        if (temp > 0 && temp <= 24) {
            imageSrc = "image/windy.png"; // Add your image path here for temperatures between 0 and 20
        } else if (temp <= 0) {
            imageSrc = "image/snow.png"; // Add your image path here for temperatures below 0
        } else if (temp > 24 && temp <= 35) {
            imageSrc = "image/sun.png"; // Add your image path here for temperatures between 20 and 30
        } else if (temp >= 36) {
            imageSrc = "image/hot.png"; // Add your image path here for temperatures 30 and above
        } else if (description == "Rain") {
            imageSrc = "image/thunder.png"
        }

        const iconElement = cells[i].querySelector(".for");
        iconElement.src = imageSrc;

        // Populate each cell with forecast details
        cells[i].querySelector("h6").textContent = date;
        cells[i].querySelector(".max").textContent = `Temp: ${temp}°C`;
        cells[i].querySelector(".max1").textContent = `Min: ${tempMin}°C`;
        cells[i].querySelector(".max2").textContent = `Max: ${tempMax}°C`;
        cells[i].querySelector(".max3").textContent = description;

        console.log(temp, "Temperature for the forecasted day");
    }
}

// Initialize dropdown
document.addEventListener("DOMContentLoaded", updateDropdown);






