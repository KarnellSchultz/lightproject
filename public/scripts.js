

document.getElementById("geolocate").addEventListener("click", event => {
  if ("geolocation" in navigator) {
    console.log("Geolocation Available");
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = await position.coords.latitude; //lat only
      const lon = await position.coords.longitude; // lon only
      const timestamp = await position.timestamp;
      // console.log(`lat:${lat}, lon:${lon} timestamp:${timestamp}`);
      document.getElementById("latitude").textContent = lat.toFixed(2);
      document.getElementById("longitude").textContent = lon.toFixed(2);

      //weather/ endpoint is going to handle the api call to darksky
      const darkSky_url = `/weather/${lat},${lon}`;
      const darkSky_response = await fetch(darkSky_url);
      const darkSky_json = await darkSky_response.json();
      console.log(darkSky_json);
      // for (item in darkSky_json) {console.log(item)}
      const location = await darkSky_json.timezone; // add to the dom
      document.getElementById("location").textContent = await location;

      const sunriseTime = darkSky_json.daily.data[0].sunriseTime * 1000; //time in miliseconds
      const sunsetTime = darkSky_json.daily.data[0].sunsetTime * 1000;

      let formattedSunrise = timeFormater(sunriseTime);
      let formattedSunset = timeFormater(sunsetTime);
      document.getElementById("sunrise-time").textContent = formattedSunrise;
      document.getElementById("sunset-time").textContent = formattedSunset;

      mapBuilder(lat, lon);

      // gets the time in a human readable format, 05:23
      function timeFormater(timeData) {
        let time = new Date(timeData);
        let hours = time.getHours().toString();
        if (hours < 10) {
          hours = "0" + hours;
        }
        let minutes = time.getMinutes().toString();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        let results = `${hours}:${minutes}`;
        return results;
      }

      const dateData = { sunriseTime, sunsetTime };
      const dateOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dateData)
      };
      const dateResponse = await fetch("/date", dateOptions); //post request to my server
      const sunlightTimeDiscription = await dateResponse.json();

      document.getElementById(
        "sunlight-hours-today"
      ).textContent = await sunlightTimeDiscription.sunlightHours;
      document.getElementById(
        "sunlight-hours-remaining"
      ).textContent = await sunlightTimeDiscription.untilSunset;
      console.log(sunlightTimeDiscription);

      const data = { lat, lon, timestamp };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      const response = await fetch("/api", options);
      const json = await response.json();
      // console.log(json);
    });
  } else {
    console.log("Geolocation is NOT available");
  }
});



async function mapBuilder(lat, lon) {
  console.log({lon, lat})

  let mymap = await L.map("mapid").setView([lat, lon], 3);

  await L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 50,
      id: "mapbox.streets",
      accessToken:
        "pk.eyJ1Ijoia2FybmVsbCIsImEiOiJjazB3ZnE5Z3EwOGVtM25xY3I3czg5ZXEyIn0.JgVjWKQbIy_-zjMcX2VYmA"
    }
  ).addTo(mymap);
  
}