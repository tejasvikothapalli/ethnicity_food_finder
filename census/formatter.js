var fs = require("fs");

// fs.readFile("variableNameToEthnicty.txt", function(err, buf) {


//   allVariables = buf.toString().split("\n");

//   var obj = {};

//   for(var i = 0; i < allVariables.length; i++){
//   	var arrayOfWords = allVariables[i].split("\t");

//   	obj[arrayOfWords[0]] = arrayOfWords[1].trim();

//   }

//   fs.writeFile("variableNameToEthnicty.json", JSON.stringify(obj), (err) => {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// 	});
  
  
// });

fs.readFile("censusEthnictyToYelpCuisine.txt", function(err, buf) {


  allVariables = buf.toString().split("\n");

  var obj = {};

  for(var i = 0; i < allVariables.length; i++){
  	var arrayOfWords = allVariables[i].split("\t");

  	obj[arrayOfWords[0].trim()] = arrayOfWords.slice(1, arrayOfWords.length - 1).filter(function(element) {
    return element != '';
		});;

  }

  console.log(obj);

  fs.writeFile("censusEthnictyToYelpCuisine.json", JSON.stringify(obj), (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
	});
  
  
});





function arrayIntoString(arr) {
	var str = "";
	for(var i = 1; i < arr.length; i++){

		if(i != arr.length -1){
			str += arr[i] + " ";
		} else {
			str += arr[i];
		} 
		 
	}

	return str;
}
