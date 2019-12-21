/*<DOCTYPE html>
<html>

<script src="https://unpkg.com/tesseract.js@v2.0.0-alpha.13/dist/tesseract.min.js"></script>

<head>
	<meta name="viewport"  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" type="text/css" href="imageUploadWizard.css">
</head>
<body>
	<div class="container">
		Select a file to upload a Photo:
		<input type="file" id="myFile" size="50">
		<button type="button" id= "ok_button" onclick="displyResult()">ok</button>
		<p>Click the button below for recognition.</p>
		<button type="button" id= "go_button" onclick="runOCR()">Recognize</button>
		<textarea id="board" readonly rows="8" cols="80">Result: </textarea>
	</div>
	<script>*/
		this.result = null;
		var resultArray= [];
		var reco_Addr = [];
		var reco_Addr_Step2 = [];
		
		
		function runOCR(){
			console.log("document is ready!");
			console.log("OCR is Running!");
			
			const exampleImage = "../super.png";//File Source----------------------------
			const worker = new Tesseract.TesseractWorker();
			worker.recognize(exampleImage, 'deu+eng')
			.progress(progress => console.log('progress', progress))
			.then(result => {this.result = result.words; 
				worker.terminate();})
			.finally(()=> {
				recognizedTexts();
				foundAddress();
			});
			// return 

		}
        //total result
        function recognizedTexts(){
        	//Recognized Addresses are assigned to an array variable---------------------
        	var i;
        	for (var i = 0; i < this.result.length; i++) {
        		resultArray.push(this.result[i].text);	
        	}
        	var myJASON = JSON.stringify(resultArray);
        	console.log("Recognized:" + myJASON);
        }

        /*Regex: https://www.regexbuddy.com/javascript.html   
        https://help.relativity.com/9.0/Content/Relativity/Regular_expressions/Searching_with_regular_expressions.htm#Addition*/
        function foundAddress(){//This function successfully extract all the addresses except for the cities names with the combination of three words(eg. Frankfurt Am Main)
        	var j;
            var hNumber = /(([0-9]{1,3})([a-zA-Z][0-9]?)?(([+|-])([0-9]{1,3})([a-zA-Z][0-9]?)?)?)/;
            var pCode =/[0-9]{5}/;// /(\D\-)?[0-9]{5}/;
            var cityName = /[A-Zäöüß,]/;
            var amCase = /Am{1,2}/;
            var imCase = /Im{1,2}/;


            for (var j = 0; j < resultArray.length; j++) { 


                if (resultArray[j].includes("straße") ||resultArray[j].includes("straBe") || resultArray[j].includes("allee") || resultArray[j].includes("weg")
                || resultArray[j].includes("gasse") || resultArray[j].includes("pfad") || resultArray[j].includes("damm") || resultArray[j].includes("ring") || resultArray[j].includes("steig")|| resultArray[j].includes("stieg") || resultArray[j].includes("zeile") || resultArray[j].includes("wall") || resultArray[j].includes("platz") || resultArray[j].includes("chaussee") || resultArray[j].includes("promenade")) { //streetName  "straBe" if OCR misrecognize "straße"
                    //there are two options: PL and City Name are interchangable in position when they written 
                    // important only to use in GUI
        			if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(cityName) )|| (resultArray[j+3].match(pCode)) ) {//  streetNumber, Zip & city
        				console.log("Found Address:\n" + "streetName:" +resultArray[j]+ " " + resultArray[j+1] + "  PL:"+resultArray[j+3] + "  City:"+resultArray[j+2]);//for Gui
                        reco_Addr_Step2.push(resultArray[j]+ "," + resultArray[j+1] + "," +resultArray[j+3] + "," + resultArray[j+2]);//input for geocoder

        			}else if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(pCode)) || (resultArray[j+3].match(cityName))) {//houseNumber, city & Zip
        				//console.log("Found Address:" + "streetName:"+resultArray[j]+ " " +resultArray[j+1] + "  PL:"+resultArray[j+2] + "  City:"+resultArray[j+3]);//for Gui
                        reco_Addr_Step2.push(resultArray[j]+ "," + resultArray[j+1] + "," +resultArray[j+2] + "," + resultArray[j+3]);//input for geocoder
                    }
                }
                // Am, Im case in the beggining----------------------------------------------------------------------------------------------------------------
                else if (resultArray[j].match(amCase) || resultArray[j].match(imCase)){
                    console.log("This is Am case");
                    if (resultArray[j+2].match(hNumber)) {
                        reco_Addr_Step2.push(resultArray[j] + "," + resultArray[j+1] + "," + resultArray[j+2] + "," + resultArray[j+3] + "," + resultArray[j+4]);  
                    }
                 }// Am , Im case-------------------------------------------------------------------------------------------------------------------------------------
                 /*else if (resultArray[j].match(amCase)){
                    if (resultArray[j+2].match(pCode)) {
                      console.log("this case also happening");
                      reco_Addr_Step2.push(resultArray[j-2] + "," + resultArray[j-1] + "," + resultArray[j+2]);
                  }
              }*/
                 // Str. case---------------------------------------------------------------------------------------------------------------------------------------------
                else if ( resultArray[j].includes("Str.") || resultArray[j].includes("Straße")){// DONEEEEEEEEEEEEEEEEEEEE
                    if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(cityName) )|| (resultArray[j+3].match(pCode)) ) {//  streetNumber, Zip & city                        
                        //reco_Addr.push(resultArray[j+1], resultArray[j+3], resultArray[j+2]);//[j] is skipped here because Straße is replaced with ...straße
                        //console.log("Found Address:\n" + "streetName:" +resultArray[j]+ " " + resultArray[j+1] + "  PL:"+resultArray[j+3] + "  City:"+resultArray[j+2]);
                        reco_Addr_Step2.push(resultArray[j-1]+"straße" + "," + resultArray[j+1] + "," +resultArray[j+3] + "," + resultArray[j+2]);//input for geocoder
                    }
                    else if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(pCode) )|| (resultArray[j+3].match(cityName)) ) {
                       reco_Addr_Step2.push(resultArray[j-1]+"straße" + "," + resultArray[j+1] + "," + resultArray[j+2] + "," + resultArray[j+3]);
                   }
                }// Str. case----------------------------------------------------------------------------------------------------------------------------------------------
                // str. case---------------------------------------------------------------------------------------------------------------------------------------------------
                else if (resultArray[j].includes("str.")){// DONEEEEEEEEEEEEEEEEEEEE
                    let strName = strReplace(resultArray[j]);                   
                    //reco_Addr_Step2.push(strName); // Street Name
                    //there are two options: PL and City Name are interchangable in position when they written 
                    // important only to use in GUI
                    if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(cityName) )|| (resultArray[j+3].match(pCode)) ) {//  streetNumber, Zip & city                        
                        reco_Addr_Step2.push( strName + "," + resultArray[j+1] + "," +resultArray[j+3] + "," + resultArray[j+2]);//input for geocoder

                    }
                    else if ((resultArray[j+1].match(hNumber) || resultArray[j+2].match(pCode)) || (resultArray[j+3].match(cityName))) {//houseNumber, city & Zip
                        //console.log("Found Address:" + "streetName:"+resultArray[j]+ " " +resultArray[j+1] + "  PL:"+resultArray[j+2] + "  City:"+resultArray[j+3]);//for Gui
                        reco_Addr_Step2.push( strName + "," + resultArray[j+1] + "," +resultArray[j+2] + "," + resultArray[j+3]);//input for geocoder
                    }
                }// str. case-------------------------------------------------------------------------------------------------------------------------------------------------

            }
            //Print the result to console
            reco_Addr_Step2.forEach(element => console.log("Address: " + element));
            console.log("\nFound Address:" + "streetName:" +resultArray[j]+" " + resultArray[j+1] + "  PL:"+resultArray[j+2] + "  City:"+resultArray[j+3]);

            return reco_Addr_Step2;
        }     
        

        //replaces str. with straße (important to use as input for geocoder)
        function strReplace(y){
            var newStr = y.replace(/str./g, "straße");
            return newStr;
        }

    /*</script>
</body>
</html>*/