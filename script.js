const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelectorAll('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "mumbai";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
})

form.addEventListener('submit', (e) => {
    // If the input field (search bar) is empty, throw an alert
    if (search.value.length == 0) {
        alert('Please type in a city name');
    } else {
        // Change from default city to the one written in the input field
        cityInput = search.value;
        // console.log(search.value);
        fetchWeatherData();
        // Remove all the text from the input field
        search.value = "";
        // Fade out the app (simple animation)
        app.style.opacity = "0";
    };

    // Prevents the default behaviour of the form
    e.preventDefault();
});

// Function that returns a day of the week (Monday, Tuesday, Friday...) from a date (12.03.2021) We will use this function later
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    return weekday[new Date(`${year}/${month}/${day}`).getDay()];
};



// Function that fetches and displays the data from the Weather API
function fetchWeatherData() {
    // YOUR API KEY HERE
    const apiKey = "95e4cb29a5b74dd8af8190618221407";

    const weatherApi = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}`;

    fetch(weatherApi)
        .then(response => response.json())
        .then(data => {
            // You can console log the data to see that is available
            console.log(data);
            // Lets start by adding the temperature and weather condition to the page
            try {
                temp.innerHTML = data.current.temp_c + "&#176;";
                conditionOutput.innerHTML = data.current.condition.text;

                // Get the date and time from the city and extract the day, month, year and time into individual variables              
                date = data.location.localtime;
                y = parseInt(date.substr(0, 4));
                m = parseInt(date.substr(5, 2));
                d = parseInt(date.substr(8, 2));
                time = date.substr(11);
            } catch {
                console.log('Time Error');
            }
            // console.log(y);
            // Reformat the date into something more appealing and add it to the page
            // Original Format: 2021-10-09 17:53
            // New Format: 17:53 - Friday 9, 10 2021
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
            timeOutput.innerHTML = time;

            //Add the name of the city into the image
            nameOutput.innerHTML = data.location.name;

            // Get the corresponding icon url for the weather and extract a part of it
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            // console.log(iconId);
            // Reformat the icon url to your own local folder path and it to the page
            icon.src = "./icons/" + iconId;

            // Add the weather details to the page
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + " km/h";

            // Set default time of day
            let timeOfDay = "day";
            // Get the unique id for each weather condition
            const { code } = data.current.condition;

            // Change to night if the night time in the city
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
                // Set the background image to clear if the weather is clear
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                // Change the button bg color depending on if its day or night
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }

            // Same thing for cloudy weather
            else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1887 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
                // And rain
            } else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `./images/${timeOfDay}/rainy.jpg`;
                btn.style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
                // And finally...snow
            } else {
                app.style.backgroundImage = `./images/${timeOfDay}/snow.jpg`;
                btn.style.background = "#4d72aa";
                if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                }
            }
            // Fade in the page once all is done
            app.style.opacity = "1";

        })

        // If the user types a city that doesn't exist throw an alert
        .catch(() => {
            alert('City not found, please try again');
            app.style.opacity = "1";
        })
}
//Call the function on page load
fetchWeatherData();