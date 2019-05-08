// Map via Mapbox GL
// let census = require("citysdk");

// the key from the Mapbox examples (not mine)
const mapAccessToken = "pk.eyJ1IjoidGVqYXN2aWtvdGhhcGFsbGkiLCJhIjoiY2p2ZHFjM3Z3MGhxNjRlcGMyZGtxeGJuNCJ9.S0JanzALmWBdbZE_OrFCDw";

init();
function init() {
  // horizontalBarGraphOfCensusPopulations();

  var labelandDataArrCensus = getLabelAndData();
  var colorArr = getRandomColorArray(labelandDataArrCensus[0].length);
  updateHorizontalBarGraph('myChart', "Population Size", labelandDataArrCensus[0], labelandDataArrCensus[1], colorArr);
  // console.log();

  var yelpData = getYelpDataArray(labelandDataArrCensus[0]);

  updateHorizontalBarGraph('myChart2', "Yelp Cuisine Count", labelandDataArrCensus[0], yelpData, colorArr);

  var dataTableinfo = [labelandDataArrCensus[0], labelandDataArrCensus[1], yelpData, getPercentagesArray(labelandDataArrCensus[1]), getPercentagesArray(yelpData)];
  
  setChiSq(labelandDataArrCensus[1], yelpData);

  $('#example').DataTable( {
        data: transpose(dataTableinfo),
        columns: [
            { title: "Group" },
            { title: "Population Count" },
            { title: "Cuisine Count" },
            { title: "Percentage of Population Count" },
            { title: "Percentage of Cuisine Count" }
        ]
    } );

  // for(var i = 0; i < labelandDataArrCensus[0].length; i++){
  //   var key = labelandDataArrCensus[0][i];
  //   if(window.censusEthnictyToYelpCuisine[key] == null){
  //     console.log(key);
  //   }
  // }

  initMap();

  /*
  // user clicks some button
  $('#someButton').on('click', function () {
      // do something here
  });

  */
}

function setChiSq(populationArr, cuisineArr){
  document.getElementsByName("df")[0].value = (populationArr.length - 1) + "";
  document.getElementsByName("df")[0].onchange();


  document.getElementsByName("x")[0].value = calculateChiSqX(populationArr, cuisineArr) + "";
  document.getElementsByName("x")[0].onchange();

  document.getElementsByName("x")[0].disabled = true;
  document.getElementsByName("df")[0].disabled = true;
  document.getElementsByName("p")[0].disabled = true;
  document.getElementsByName("mydropdown")[0].disabled = true;
}

function calculateChiSqX(populationArr, cuisineArr){
  var x = 0;
  var totalPopulation = populationArr.reduce((a,b) => a + b, 0);
  var totalCuisines = cuisineArr.reduce((a,b) => a + b, 0);

  for(var i = 0; i < populationArr.length; i++){
    var expectedNumberOfRests = ((populationArr[i] * 1.0)/totalPopulation) * totalCuisines;
    var actual = cuisineArr[i];
    // console.log(expectedNumberOfRests + " "+actual)
    x += (((actual - expectedNumberOfRests) * (actual - expectedNumberOfRests)) * 1.0)/expectedNumberOfRests;
  }
  return x;
}

function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}


function getPercentagesArray(arr){
  var percentages = [];
  var sum = arr.reduce((a,b) => a + b, 0)
  for(var i = 0; i < arr.length; i++){
    var percentage = ((arr[i] * 1.0)/sum) *100;
    percentages.push(percentage.toFixed(2) + "%")
  }

  return percentages;

}

function getYelpDataArray(labelArr){
  var dataArr = [];
  for(var i = 0; i < labelArr.length; i++){
    var total = 0;
    var yelpCategories = window.censusEthnictyToYelpCuisine[labelArr[i]];
    for(var j = 0; j < yelpCategories.length; j++){
      
      total += window.BerkeleyRestaurants[yelpCategories[j]].length;

    }
    dataArr.push(total);
  }

  return dataArr;
}

function updateHorizontalBarGraph(chartId, label, labelArray, dataArray, colorArray ) {
   var ctx = document.getElementById(chartId);
  

  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: labelArray,
        datasets: [{
            label: label,
            data: dataArray,
            backgroundColor: colorArray,
            // [
            //     'rgba(255, 99, 132, 0.2)',
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            // ],
            // borderColor: [
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
            // ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: false,
    }
});
}

function horizontalBarGraphOfCensusPopulations(){
  var ctx = document.getElementById('myChart');
  var labelandDataArr = getLabelAndData();

  

  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: labelandDataArr[0],
        datasets: [{
            label: 'Population Size',
            data: labelandDataArr[1],
            backgroundColor: getRandomColorArray(labelandDataArr[0].length),
            // [
            //     'rgba(255, 99, 132, 0.2)',
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            // ],
            // borderColor: [
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
            // ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
    }
});
}

function getRandomColorArray(number){
  var arr = [];
  for(var i = 0; i < number; i++){
    arr.push(random_rgba());
  }

  return arr;
}

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}


function getLabelAndData(){
  //window.variableNameToEthnicty
    var keys = Object.keys(window.alameda);

    var labels = [];
    var data = [];

    for(var i = 0; i < keys.length; i++){
      if(window.variableNameToEthnicty[keys[i]] != null){
        labels.push(window.variableNameToEthnicty[keys[i]]);
        data.push(window.alameda[keys[i]]);
      }
    }

    return [labels, data];
}


var mapCoordinates = [42.885441,-78.878464];
var mapZoom = 11;



var map = null;
var geocoder = null;

function initMap() {
  map = MapGL();
}

function MapGL() {
  L.mapbox.accessToken = mapAccessToken;

  // initialize map
  var newMap = L.mapbox.map('map')
    .setView([40, -74.50], 9)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

  
  
  // event handlers
  newMap.on("load", mapLoaded);
    return newMap;
}

function mapLoaded() {
  // do stuff here
  console.log(map);
  
}