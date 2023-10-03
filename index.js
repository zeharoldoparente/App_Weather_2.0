const apiKey = "578075b676002ed4bc7b553362e7f810";
const locButton = document.querySelector(".loc-button");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector(".weather-temp");
const daysList = document.querySelector(".days-list");
const locationModal = document.getElementById("locationModal");
const locationInput = document.getElementById("locationInput");
const submitLocation = document.getElementById("submitLocation");
const modalBackground = document.getElementById("modalBackground");
const closeModalButton = document.getElementById("closeModalButton");

const weatherIconMap = {
   "01d": "sun",
   "01n": "moon",
   "02d": "sun",
   "02n": "moon",
   "03d": "cloud",
   "03n": "cloud",
   "04d": "cloud",
   "04n": "cloud",
   "09d": "cloud-rain",
   "09n": "cloud-rain",
   "10d": "cloud-rain",
   "10n": "cloud-rain",
   "11d": "cloud-lightning",
   "11n": "cloud-lightning",
   "13d": "cloud-snow",
   "13n": "cloud-snow",
   "50d": "water",
   "50n": "water",
};

const weatherImageMap = {
   "01d": "sunny.jpg",
   "01n": "clear-night.jpg",
   "02d": "partly-cloudy.jpg",
   "02n": "clear-night.jpg",
   "03d": "cloudy.jpg",
   "03n": "cloudy.jpg",
   "04d": "cloudy.jpg",
   "04n": "cloudy.jpg",
   "09d": "rainy.jpg",
   "09n": "rainy.jpg",
   "10d": "rainy.jpg",
   "10n": "rainy.jpg",
   "11d": "stormy.jpg",
   "11n": "stormy.jpg",
   "13d": "snowy.jpg",
   "13n": "snowy.jpg",
   "50d": "misty.jpg",
   "50n": "misty.jpg",
};

function fetchWeatherData(location) {
   const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&lang=pt_br&units=metric`;

   fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
         const todayWeather = data.list[0].weather[0].description;
         const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
         const todayWeatherIconCode = data.list[0].weather[0].icon;

         const backgroundImageName = weatherImageMap[todayWeatherIconCode];
         const backgroundUrl = `url('images/${backgroundImageName}')`;

         const leftInfo = document.querySelector(".left-info");
         leftInfo.style.backgroundImage = backgroundUrl;

         todayInfo.querySelector("h2").textContent =
            new Date().toLocaleDateString("pt-br", {
               weekday: "long",
            });
         todayInfo.querySelector("span").textContent =
            new Date().toLocaleDateString("pt-br", {
               day: "numeric",
               month: "long",
               year: "numeric",
            });
         todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
         todayTemp.textContent = todayTemperature;

         const locationElement = document.querySelector(
            ".today-info > div > span"
         );
         locationElement.textContent = `${data.city.name}, ${data.city.country}`;

         const weatherDescriptionElement = document.querySelector(
            ".today-weather > h3"
         );
         weatherDescriptionElement.textContent = todayWeather;

         const todayPrecipitation = `${data.list[0].pop}%`;
         const todayHumidity = `${data.list[0].main.humidity}%`;
         const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

         const dayInfoContainer = document.querySelector(".day-info");
         dayInfoContainer.innerHTML = `

          <div>
              <span class="title">Possibilidade de Chuva</span>
              <span class="value">${todayPrecipitation}</span>
          </div>
          <div>
              <span class="title">Umidade do Ar</span>
              <span class="value">${todayHumidity}</span>
          </div>
          <div>
              <span class="title">Velocidade do Vento</span>
              <span class="value">${todayWindSpeed}</span>
          </div>

      `;
         const today = new Date();
         const nextDaysData = data.list.slice(1);

         const uniqueDays = new Set();
         let count = 0;
         daysList.innerHTML = "";
         for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString("pt-br", {
               weekday: "short",
            });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            if (
               !uniqueDays.has(dayAbbreviation) &&
               forecastDate.getDate() !== today.getDate()
            ) {
               uniqueDays.add(dayAbbreviation);
               daysList.innerHTML += `
              
                  <li>
                      <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                      <span>${dayAbbreviation}</span>
                      <span class="day-temp">${dayTemp}</span>
                  </li>

              `;
               count++;
            }

            if (count === 4) break;
         }
      })
      .catch((error) => {
         alert(`Error fetching weather data: ${error} (Api Error)`);
      });
}

document.addEventListener("DOMContentLoaded", () => {
   const defaultLocation = "Araguaína";
   fetchWeatherData(defaultLocation);
});

locButton.addEventListener("click", () => {
   locationModal.style.display = "block";
   modalBackground.style.display = "block";
});

closeModalButton.addEventListener("click", () => {
   locationModal.style.display = "none";
   modalBackground.style.display = "none";
});

locationInput.addEventListener("keyup", function (event) {
   if (event.key === "Enter") {
      submitLocation.click();
   }
});

submitLocation.addEventListener("click", () => {
   const location = locationInput.value;
   if (location.trim() !== "") {
      fetchWeatherData(location);
      locationModal.style.display = "none";
      modalBackground.style.display = "none";
   } else {
      alert("Por favor, insira uma localidade válida.");
   }
});
