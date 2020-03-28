console.log(`Client Side JavaScript loaded!`);

const locationForm = document.getElementById("location-form");
const locationName = document.getElementById("location-name");
let searchedLocation = document.getElementById("searched-location");
let locationCurrentTime = document.getElementById("location-current-time");
let temperature = document.getElementById("temperature");
let rainProbability = document.getElementById("rain-probability");
let summary = document.getElementById("summary");

locationForm.addEventListener("submit", event => {
  event.preventDefault();
  fetch(`http://localhost:3000/weather?address=${locationName.value}`).then(
    response => {
      response
        .json()
        .then(data => {
          if (data.error) searchedLocation.textContent = data.error;
          else {
            searchedLocation.textContent = data.location;
            locationCurrentTime.textContent = data.forecast.weatherTime;
            temperature.textContent = `Temperature: ${data.forecast.temperature}˚C`;
            rainProbability.textContent = `Rain Probability ${data.forecast.rainProbability}%`;
            summary.textContent = `Summary: ${data.forecast.summary}`;
          }
        })
        .catch(e => console.log(e));
    }
  );
});
