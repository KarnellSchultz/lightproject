// /Users/karnell.schultz/Documents/javaScript/lightProject
//nodemin index.js
const fs = require("fs"); // node.js file system package
const express = require("express"); //import express into the express binding
const app = express(); // puts the whole lib into this app binding
const Datastore = require("nedb"); //neDB is my database https://github.com/louischatriot/nedb
const fetch = require("node-fetch"); //allows me to use fetch in the server
require("dotenv").config(); //https://www.npmjs.com/package/dotenv
const formatDistance = require("date-fns/formatDistance");


//console.log(process.env); to view the env vars
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
app.use(express.static("public")); // references a place where express will be looking
// my content to host. I created a folder named 'public' and put my index.html file in there.
app.use(express.json({ limit: "100kb" }));

const database = new Datastore("database.db"); //create new database
database.loadDatabase(); //loads the db when the server is run

const logs = new Object;

// telling my server what to do when it gets a POST and setting up the endpont
// /api endpoint only repeats back the data it gets
app.post("/api", (request, response) => {
  const data = request.body;
  response.json(data);

  //for logging 
let currentDateToString = new Date(data.timestamp).toDateString()
  logs.locationInfo = data;
  logs.logtime = currentDateToString;
});

app.post("/date", (request, response) => {
  const date1 = request.body.sunriseTime;
  const date2 = request.body.sunsetTime;
  const now = new Date();
  //need logic for when it's night time and the sun is down
  //if "now" is after sunset >> then do something

  const untilSunset = formatDistance(now, new Date(date2))
  const sunlightHours = formatDistance(new Date(date2), new Date(date1));
  
  if (now > date2 ) {
    console.log(`It's after sunset`)
    sunlightHours = "The has already set";
  }


  const datePackage = { sunlightHours , untilSunset }
  response.json(datePackage)
  logs.datePackage = datePackage; //for logger
  console.log(datePackage)
});

//weather api endpoint >> makes a api call to darksky and returns that data to the client
const darkSkyKey = process.env.API_KEY;
app.get(`/weather/:latlon`, async (request, response) => {
  const latlon = request.params.latlon.split(`,`);
  const lat = latlon[0];
  const lon = latlon[1];
  const darkSkyForecastEndpoint = `https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lon}`;
  const fetch_response = await fetch(darkSkyForecastEndpoint);
  const json = await fetch_response.json();
  response.json(json); //returns the data from darksky back to the client
  

  const logger = (logs) => database.insert(logs)  //logging to the  db
  logger(logs);
  console.log(logs)


});      
