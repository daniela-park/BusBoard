/*
-In the terminal:
npm install
npm install node-fetch
-In the file:
import fetch from ‘node-fetch'
-In 'packge.json':
Add 'type' : 'module' above 'dependencies'
-In the terminal:
npm install
node BusBoards.js

Postman Tool: https://web.postman.co/workspace/My-Workspace~0d7dd333-65ee-4f4d-8adc-b19aa1f501c3/request/32420121-c637de57-3a45-4deb-a2e7-79bc99899385
*/

import promptSync from 'prompt-sync';
const prompt = promptSync();
import fetch from 'node-fetch';

/*
//PART 1: BUS TIMES
// 1. Requesting the user for the bus stop code
const busStop = prompt('Bus Stop ID: '); // Stop code: 490008660N

// 2. List of the next 5 buses with their routes, destinations, time until they arrive in minutes
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const baseUrl = 'https://api.tfl.gov.uk/StopPoint/' // Info about the next 6 buses in the format: [{21 info, {}}, {21 info, {}}]
const endUrl = '/Arrivals'
const url = baseUrl + busStop + endUrl // https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals

var content;
fetch(url)
  .then(response => response.json())
  .then(body => {content = body})
  .then(() => {content.map( item => {console.log(item.lineId + ' - ' + item.destinationName + ' - ' + (parseInt(item.timeToStation/60) + ' min'))})});
    //console.log(item.lineId + ' - ' + item.destinationName + ' - ' + (parseInt(item.expectedArrival.substring(11,16)) - parseInt(item.timestamp.substring(11,16))) + ' min')})});
*/



// PART 2: BUS STOPS
// 1. Requesting the user for a postcode + Fetching latitude and longitude from postcode API
var postcode = prompt('Postcode: '); // Requesting the user for a postcode
var postcodeUrl = `https://api.postcodes.io/postcodes/${postcode}` // Adding the postcode into the API URL

// Error handling invalid postcodes
var fetchPostcodeApi = async () => {let postcodeApi = await fetch(postcodeUrl); return postcodeApi.json();}; // Fetching the postcode status form the API
var postcodeInfo = await fetchPostcodeApi(); // Saving the postcode information into a variable
var postcodeStatus = postcodeInfo.status // Overwriting the postcode information for the postcode status
//var postcodeRegex = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})\$/
while (postcodeStatus != 200)
{
  try
  {
    if (postcodeStatus != 200) {
      throw 'Invalid postcode';
    }
  }
  catch (error)
  {
    console.log('Invalid postcode. Please try again.')
    postcode = prompt('Postcode: ');
    var fetchPostcodeApi = async () => {let postcodeApi = await fetch(`https://api.postcodes.io/postcodes/${postcode}`); return postcodeApi.json();};
    postcodeInfo = await fetchPostcodeApi();
    postcodeStatus = postcodeInfo.status
    console.log(postcodeInfo)
  }
}

// Fetching latitude and longitude
const fetchLat = async () => {let lat = await fetch(postcodeUrl); return lat.json();};
let lat = await fetchLat();
lat = lat.result.latitude
console.log('Latitude: ' + lat)

const fetchLon = async () => {let lon = await fetch(postcodeUrl); return lon.json();};
let lon = await fetchLon();
lon = lon.result.longitude
console.log('Longitude: ' + lon)

/// 2. Requesting the user for the stop type + Fetching bus stops within a latitude and longitude range
var stopType;
stopType = prompt('Stop Type: '); // Stop Type: bus stop


while (tflStopType != 'NaptanPublicBusCoachTram')
{//(bus, bus stop, busstop).includes(pomrp)
    var tflStopType = stopType.replace('bus stop', 'NaptanPublicBusCoachTram') // Tfl Stop Type: NaptanPublicBusCoachTram
  try
  {
    if (tflStopType != 'NaptanPublicBusCoachTram') {
      throw 'Invalid stop type';
    }
  }
  catch (error)
  {
    stopType = null
    console.log('Invalid stop type. Please try again.')
    stopType = prompt('Stop Type: ');
  }
}

  const stopsBaseUrl = 'https://api.tfl.gov.uk/StopPoint/?lat='
  const stopsMidUrl = '&lon='
  const stopsEndUrl = '&stopTypes='
  const stopsUrl = stopsBaseUrl + lat + stopsMidUrl + lon + stopsEndUrl + tflStopType // 'https://api.tfl.gov.uk/StopPoint/?lat=51.576&lon=-0.147&stopTypes=NaptanPublicBusCoachTram'
  
  fetch(stopsUrl)
    .then(response => response.json())
    .then(body => {console.log('The near buses are: ' + body.stopPoints[0].lineGroup[0].lineIdentifier)});

// ERROR HANDLING
/*
let text: String;
let date: Datetime? = null;

while (isNaN(date))
{
  try
  {
    text = AskUserToTypeDate();
    date = new Date(text);
      if (isNaN(date.getTime())) {
        throw 'Invalid Date';
      }
  }
  catch (err)
  {
    date = null
    console.log('Invalid Date - Please try again');
  }
}

import * as winston from 'winston';
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'combined.log'})
  ]
});
*/

// PART 3: JOURNEY PLANNING

// node 4.BusBoard