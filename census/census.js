

let census = require("citysdk");


var fs = require("fs");

const SmartQueue = require('smart-request-balancer');
const queue = new SmartQueue({
  rules: {
    telegramIndividual: { // Rule for sending private message via telegram API
      rate: 1,            // one message
      limit: 2,           // per second
      priority: 1
    },
    telegramGroup: {      // Rule for sending group message via telegram API
      rate: 20,           // 20 messages
      limit: 60           // per minute
    }
  }
});

const rule = 'telegramIndividual';

var allVariables;

fs.readFile("variableNames.txt", function(err, buf) {


  allVariables = buf.toString().split("\n");
  allVariables.push('NAME');

  censusPromise(getargs(allVariables.slice(0, 40)))
 
  censusPromise(getargs(allVariables.slice(40)));

  
  
});

function getargs(values) {
  var args = // strings are valid as vintages as well
{ 
  "vintage": "2017",
  "geoHierarchy": { "county": { "lat": 37.867861036276366, "lng": -122.26783393647236}, "county subdivision": "*"},
  "sourcePath": [ "acs", "acs5" ],
  "values": values,
  "statsKey" : "2fba547d92fbae801ed38065044c277469f1f311",
 
};

return args;

}

const requestCensus = (args, uniqueId) => queue.request(retry => censusPromise(args)
  .then(response => response)
  .catch(error => {
    
    if (error.response.statusCode === 429) {

      return retry(args); //not sure about this line lol
    }
    throw error;
  }), uniqueId, rule);


let censusPromise = function(args) {
  return new Promise(function(resolve, reject) {
    census(args, function(err, json) {
      if (!err) {
        console.log(JSON.stringify(json));
        // resolve(json);
      } else {
        // reject(err);
        console.log("error for this variable: " + args.values);
      }
    });
  });
};


// async function getCensusData(long, lat) {

  
  
// }







