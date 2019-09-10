// /Users/karnell.schultz/Documents/javaScript/lightProject
//nodemin index.js
const fs = require("fs"); // node.js file system package
const express = require("express"); //import express into the express binding
const app = express(); // puts the whole lib into this app binding
const Datastore = require("nedb"); //neDB is my database https://github.com/louischatriot/nedb
const fetch = require("node-fetch"); //allows me to use fetch in the server

app.listen(3000, () =>
  console.log("Running on port:3000 ===> http://localhost:3000")
);
app.use(express.static("public")); // references a place where express will be looking
// my content to host. I created a folder named 'public' and put my index.html file in there.
app.use(express.json({ limit: "100kb" }));

const database = new Datastore("database.db"); //create new database
database.loadDatabase(); //loads the db when the server is run

const logs = [];

const darkSkyKey = "bf18e6733f115b685ec69b561d9b042d";

//api.darksky.net/forecast/bf18e6733f115b685ec69b561d9b042d/37.8267,-122.4233

// telling my server what to do when it gets a POST and setting up the endpont
https: app.post("/api", (request, response) => {
  const data = request.body;

  logs.push(data);
  database.insert(data);
  response.json(data);

  console.log(logs);

  //logging data to a .txt file
  let logDataFormater = `:::: Latitude: ${data.lat}, Longitude: ${data.lon}
        Timestamp: ${data.timestamp} ::::`;
  fs.appendFile("swagy/logs.txt", logDataFormater, err => {
    if (err) throw err;
    console.log("Data_logged");
  });
});

//weather api endpoint >> makes a api call to darksky and returns that data to the client
app.get(`/weather/:latlon`, async (request, response) => {
  const latlon = request.params.latlon.split(`,`);
  const lat = latlon[0];
  const lon = latlon[1];
  const darkSkyForecastEndpoint = `https://api.darksky.net/forecast/bf18e6733f115b685ec69b561d9b042d/${lat},${lon}`;
  const fetch_response = await fetch(darkSkyForecastEndpoint);
  const json = await fetch_response.json();
  response.json(json); //returns the data from darksky back to the client
});
