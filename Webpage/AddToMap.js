/*
Used Libaries:

Bootstrap
Copyright (c) 2011-2018 Twitter, Inc.
Copyright (c) 2011-2018 The Bootstrap Authors

Font Awesome

Leaflet
Copyright (c) 2010-2019, Vladimir Agafonkin
Copyright (c) 2010-2011, CloudMade

Leaflet Fullscreen
Copyright (c) 2015, MapBox

i18next
Copyright (c) 2017 i18next

(Created by Melanie Riester, Tibebu Galaso und Nina Kirschner under MIT Licence)
*/





// Tesseract result array
lTesseractResults = [];

//Geocode resultsarray
lGeocodeResults = [];

var imageUrl = "";

/* Array of corrected tesseract results / input for photon request
 (filled onclick button NextToPhoton) */
lCorrectedTesseractAddresses = [];

////// Leaflet //////
var map;
function loadMap(tMapId){

	map = L.map(tMapId, {		//'map'
		center: [48.63, 9.19],
		zoom: 7,
		minZoom:6,
		//maxBounds:[[47.20,6.7],[49.97,10.94]]
	});

	// add basemap
	var basemap = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add Fullscreen
	map.addControl(new L.Control.Fullscreen());

};


/* function to show pop up*/
function showError(textErrorEN, textErrorDE) {
				if (i18next.language == "en"){
					document.getElementById("errormessage").innerHTML = textErrorEN;
				}
				else{
					document.getElementById("errormessage").innerHTML = textErrorDE;
				}
        console.log("in show error function");

        $("#errorPopup").modal();
    }

////// Bootstrap //////

// close welcometext
$(document).ready(function(){
	$("#closeWelcome").click(function(e){
		//e.preventDefault();
		$("#welcometext").hide();
	});
});

// hides processing steps & shows leaflet map
function hideStepsShowMap(){

	// check if enough selected (if not gives opportunity to do so)
	var iChecked = $('.form-check-input:checked').length;
	if (!iChecked){
		showError("No address is given! Please make sure that at least one address is given", "Keine Adresse wurde angegeben. Gebe mindestens eine Addresse an!");
		return;
	}

	var selectedIds = [];

	// hide processing steps
	$("#processTabs").hide();
	$("#tabContent").hide();
	$("#headingProcess").hide();

	// get checked addresses
	$('.form-check-input:checked').each(function(){
		selectedIds.push(parseInt($(this).attr('value')));
		//console.log("Checked : " + $(this).attr('id'));
	});

	// show map
	$("#headingMap").show();
	$("#mapdiv").show();
	$("#reloadDIV").show();
	loadMap("map");

	var allGeoJsons = [];
	const lPopupAttibutes = ["name", "street", "housenumber", "postalcode","city","state"];

	// add markers for addresses
	for (id in selectedIds){
		var lPropertyKeys = Object.keys(lGeocodeResults[id].features[0].properties);
		var lPopupText = [];
		var leafletGeojson = L.geoJSON(lGeocodeResults[id], {
    	style: {"color": "#ff0000"},
			onEachFeature: function(feature, layer){

				if (lPropertyKeys.includes("name")){
					lPopupText.push(feature.properties['name']);
				}
				if (lPropertyKeys.includes("street")){
					if (lPropertyKeys.includes("housenumber")){
						lPopupText.push(feature.properties['street']+" "+feature.properties['housenumber']);
					}else {
						lPopupText.push(feature.properties['street']);
					}
				}
				if (lPropertyKeys.includes("city")){
					if (lPropertyKeys.includes("postcode")){
						lPopupText.push(feature.properties['postcode']+" "+feature.properties['city']);
					}else {
						lPopupText.push(feature.properties['city']);
					}
				}
				if (lPropertyKeys.includes("state")){
					lPopupText.push(feature.properties['state']);
				}
				layer.bindPopup(lPopupText.join("<br>"));
			}
		});

		allGeoJsons.push(leafletGeojson);
		leafletGeojson.addTo(map);
	}

	// zoom to markers
	var group = new L.featureGroup(allGeoJsons);
	map.fitBounds(group.getBounds().pad(Math.sqrt(2) / 2));
	//map.invalidateSize()
};

// Global variable for index of html elements which show digitalization result
var iIndexDigiInput = 0;


var time = 0;

// Loading sign
var x = document.getElementById("snackbar");

// loop: every loop takes five seconds; after every loop:check if addresses are found;
function myLoop () {
	 setTimeout(function () {
			time += 5000;
			console.log("time  "+ time+ " länge aaray "+  reco_Addr_Step2.length);

			// under 30 seconds; no address found: loop again
			if (time < 20000 && reco_Addr_Step2.length == 0) {
				 myLoop();
				 console.log("loop again");
			}

			// time out after 30 seconds
			if (time >= 20000 && reco_Addr_Step2.length == 0){
				console.log("time over");
				// hide loading sign
				setTimeout(function () {
					x.className = x.className.replace("show", "hide");
				}, 0);

				showError("It needs to much time to read this photo. Please make a new picture or cut the important parts. Make sure that there is an address.", "Es dauert zu lange das Bild zu lesen. Bitte mache ein neues Foto oder schneide es zu. Stell klar, dass eine Addresse sichtbar ist.");
				return;
			}

			// address is found
			if (reco_Addr_Step2.length !=0){
				console.log("address found");

				// hide
				setTimeout(function () {
					x.className = x.className.replace("show", "hide");
				}, 0);

				lTesseractResults = reco_Addr_Step2;
				// create html elements to show digitalization result
				createDigitalizationCheckboxes(lTesseractResults);
				// Enable and disable Tabs in Digitalization and Mapping Steps
				$('#verifyDigTab').removeClass('disabled');
				$('a[href="#verifyDigContent"]').trigger('click')
				$('#uploadTab').attr('class','nav-link disabled');
				return;
			}
			// found address in last step
			if (time >= 20000 && reco_Addr_Step2.length != 0){
				console.log("address found");
				setTimeout(function () {
					x.className = x.className.replace("show", "hide");
				}, 0);
				lTesseractResults = reco_Addr_Step2;
				// create html elements to show digitalization result
				createDigitalizationCheckboxes(lTesseractResults);
				// Enable and disable Tabs in Digitalization and Mapping Steps
				$('#verifyDigTab').removeClass('disabled');
				$('a[href="#verifyDigContent"]').trigger('click')
				$('#uploadTab').attr('class','nav-link disabled');
				return;
			}
	 }, 5000)
}

// OnClick event ButtonId: NextToTesseract
$("#NextToTesseract").click(function(e){
	e.preventDefault();

	// show loading sign in loop
  setTimeout(function () {
    x.className = "show";
  }, 0);

	// start tesseract with timeout
	setTimeout(runOCR(imageUrl),20000);

	// show loading sign
	x.className = "show";

	//error handling + generic wating time (5 seconds steps)
	myLoop();
});

// Photon Result
function get(yourUrl){
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.open("GET",yourUrl,false);
		Httpreq.send(null);
		return Httpreq.responseText;
}

// OnClick event ButtonId: NextToPhoton
$("#NextToPhoton").click(function(e){
	e.preventDefault();

	// check if enough selected (if not gives opportunity to do so)
	var iChecked = $('.digit-input-checkbox:checked').length;
	if (!iChecked){
		showError("No address is given! Please make sure that at least one address is given", "Keine Adresse wurde angegeben. Gebe mindestens eine Addresse an!");
		return;
	}

	// Enable and disable Tabs in Digitalization and Mapping Steps
	$('#verifyGeoTab').removeClass('disabled');
	$('a[href="#veryGeoContent"]').trigger('click');
	$('#verifyDigTab').attr('class','nav-link disabled');

	// for each checked address of tesseract result store address in array
	$('.digit-input-checkbox:checked').each(function(){
		var value = $(this).attr('value');
		var textInput = document.getElementById('digitInputText'+value);
		var address = textInput.value;

		// append selected address to array lCorrectedTesseractAddresses
		lCorrectedTesseractAddresses.push(address);

		//show loading sign
    var x = document.getElementById("snackbar");
    x.className = "show";

		icount = 0;
    if (document.readyState === "complete") {
      icount += 1;
			// All addresses are found
      if (icount == lCorrectedTesseractAddresses.length){
        setTimeout(function () {
          x.className = x.className.replace("show", "hide");
        }, 0);
      }
  	}
	});

  var corrAddress;

	// iteration trough all corrected and ckecked addresses. Photon GET request
  for (corrAddress = 0; corrAddress < lCorrectedTesseractAddresses.length; corrAddress++) {
    lGeocodeResults.push(JSON.parse(get("http://photon.komoot.de/api/?q="+lCorrectedTesseractAddresses[corrAddress]+"&limit=1")));
  }

	// error handling
	if (lGeocodeResults.length ==0 && lCorrectedTesseractAddresses.length ==0){
		showError("No address is given! Please make sure that at least one address is given", "Keine Adresse wurde angegeben. Gebe mindestens eine Addresse an!");
	}
	else if (lGeocodeResults.length != lCorrectedTesseractAddresses.length){
		console.log("Geocode Result length"+lGeocodeResults.length + " != " + lCorrectedTesseractAddresses);
		showError("No location could be found for at least one selected address", "Zu mindestens einer ausgewählten Adresse konnte kein Standort gefunden werden");

		// create html elemets to show geocoded addresses
		createGeocodingCheckboxes(lGeocodeResults);
	} else{

		// create html elemets to show geocoded addresses
		createGeocodingCheckboxes(lGeocodeResults);
	}
});

// function removes element from html file
function removeElement(elementId) {
	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
};

// function resets the text input of the tesseract result
function resetInput(tInputId,iTesseractIndex){
	var inputText = document.getElementById(tInputId);
	var digitAddress = lTesseractResults[iTesseractIndex];
	inputText.value = digitAddress;
};

// onchange function for textinput of tesseract result
function updateInput(tText, tInputId){
	var inputText = document.getElementById(tInputId);
	// console.log("Textinput: " + tText + "ID: " + inputText.id);
  inputText.value = tText;
};

/* function creates html elements for input group with checkbox, text input,
trash button (and optional reset button)*/
function createInputCheckbox(bAdditionalInput){

	// create unique ids
	tInputCheckbId = "digitInputCheckb" + iIndexDigiInput;
	tInputTextId = "digitInputText" + iIndexDigiInput;
	tInputGroupId = "inputGroup" + iIndexDigiInput;

	var group = document.getElementById('digitalizationInputGroup');

	var inputGroup = document.createElement("div");
	inputGroup.setAttribute("class", "input-group my-3");
	inputGroup.setAttribute("id", tInputGroupId);

	var prepend = document.createElement("div")
	prepend.setAttribute("class", "input-group-prepend");

	var inputGroupText = document.createElement("div");
	inputGroupText.setAttribute("class", "input-group-text");

	// Checkbox input
	var inputCheckb = document.createElement("input");
	inputCheckb.setAttribute("type","checkbox");
	inputCheckb.setAttribute("class","digit-input-checkbox");
	inputCheckb.setAttribute("id",tInputCheckbId);
	inputCheckb.setAttribute("value", iIndexDigiInput.toString());
	inputCheckb.setAttribute("checked", "");

	// Text input
	var inputText = document.createElement("input");
	inputText.setAttribute("type","text");
	inputText.setAttribute("class", "form-control");
	inputText.setAttribute("id", tInputTextId);
	inputText.setAttribute("value","");
	inputText.setAttribute("onchange","updateInput(this.value,'" + tInputTextId +"')");
	// inputText.setAttribute("onchange","updateInput("+this.value+",'" + tInputTextId +"')");

	// Text input value: Show tesseract result
	if (bAdditionalInput===false){
		var digitAddress = lTesseractResults[iIndexDigiInput];
		inputText.setAttribute("value", digitAddress);
	}

	var append = document.createElement("div");
	append.setAttribute("class","input-group-append");

	// Reset button: shall a reset button be added?
	if (bAdditionalInput===false){
		var reset = document.createElement("button");
		reset.setAttribute("class","btn btn-outline-secondary")
		reset.setAttribute("type","button");
		reset.setAttribute("onclick","resetInput('"+tInputTextId+"','"+iIndexDigiInput+"')")

		var resetIcon = document.createElement("i");
		resetIcon.setAttribute("class","fas fa-undo");
		reset.appendChild(resetIcon);
		append.appendChild(reset);
	};

	// Trash button
	var trash = document.createElement("button");
	trash.setAttribute("class","btn btn-outline-secondary")
	trash.setAttribute("type","button");
	trash.setAttribute("onclick","removeElement('"+tInputGroupId+"')");

	var trashIcon = document.createElement("i");
	trashIcon.setAttribute("class","far fa-trash-alt");

	// add HTML Elements to parent elements
	trash.appendChild(trashIcon);
	append.appendChild(trash);
	inputGroupText.appendChild(inputCheckb);
	prepend.appendChild(inputGroupText);
	inputGroup.appendChild(prepend);
	inputGroup.appendChild(inputText);
	inputGroup.appendChild(append);
	group.appendChild(inputGroup);

	iIndexDigiInput+=1;

};

/* function inserts input form groups for each found address of tesseract and
fills the input with the corresponding addresses*/
function createDigitalizationCheckboxes(lTesseractResults){
	var i;
	for (i = 0; i < lTesseractResults.length; i++){
		createInputCheckbox(bAdditionalInput=false);
	}
};

/* function inserts form-check-groups for each geocoding result and fills the
label with the corresponding address*/
function createGeocodingCheckboxes(lJsonResults){
	var i;
	for (i = 0; i < lJsonResults.length; i++){

		var jsonResult = lJsonResults[i];

		// create unique ids
		tCheckboxId = "geoCheckbox" + i;
		tLabelId = "geoCheckboxLabel" + i;

		// create HTML Checkbox input
		var group = document.getElementById('geocodingCeckboxGroup');
		var formGroup = document.createElement("div");
		formGroup.setAttribute("class", "form-group form-check");

		var input = document.createElement("input");
		input.setAttribute("type","checkbox");
		input.setAttribute("class","form-check-input");
		input.setAttribute("id",tCheckboxId);
		input.setAttribute("value", i.toString());
		input.setAttribute("checked", "");

		// get address from geocoding result
		var oAddress = getPhotonAddress(jsonResult);
		const addr_values = Object.values(oAddress);

		// add addresses as label for checkbox
		var label = document.createElement("label");
		label.setAttribute("for",tCheckboxId);
		label.setAttribute("class","form-check-label");
		label.setAttribute("id",tLabelId);
		label.innerHTML = addr_values.join(", ");

		// add HTML Elements to parent elements
		formGroup.appendChild(input);
		formGroup.appendChild(label);
		group.appendChild(formGroup);
	}
};

// Reload of Page
function reloadPage(){
	location.reload(true);
};

// Preview of uploaded image
var loadFile = function(event) {
    var previewImage = document.getElementById('previewImage');
		imageUrl = URL.createObjectURL(event.target.files[0]);
    previewImage.src = imageUrl;

	$('#NextToTesseract').prop('disabled', false);
	$('#NextToTesseract').attr('aria-disabled','false');
  };

// get address data of photon geocoding result --> returns object
function getPhotonAddress(tGeojson){
	addr = {};
	lKeys = ["name","street", "housenumber", "postcode", "city", "state", "country","blablub"];
	oGeojsonProperties = tGeojson.features[0].properties;

	for (i = 0; i < lKeys.length; i++){
		tKey = lKeys[i];
		if(tKey in oGeojsonProperties){
			tValue = oGeojsonProperties[tKey];
			addr[tKey] = tValue;
		} else {
			// console.log(tKey + " is not in geojson");
			continue;
		}
	};

	return addr;
};


i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
			// langEN.js var englishTranslation
      translation: englishTranslation
    },
    de: {
			// langDE.js var germanTranslation
      translation: germanTranslation
    }
  }
}, function(err, t) {
  // init set content
  updateContent();
});

// Change Text for TextElements which are on actual webpage
function updateContent() {

	lTextElementIds = ['home', 'about', 'welcomeHeading', 'welcomeDescription',
	'processStepsHeading', 'uploadTab', 'verifyDigTab', 'verifyGeoTab', 'chooseFile',
	'NextToTesseract', 'NextToPhoton', 'NextToMap', 'digitDescription',
	'geocDescription', 'cancel1', 'cancel2', 'mapHeading', 'navbarDropdown',
	'english', 'german', 'errorTitle', 'load', 'description', 'who', 'whoT', 'what','whatT', 'hList', 'uhList', 'li1', 'li2', 'li3', 'li4', 'osT'];

	var i;
	for (i=0; i < lTextElementIds.length; i++){
		tText = lTextElementIds[i];
		try {
			document.getElementById(lTextElementIds[i]).innerHTML = i18next.t(lTextElementIds[i]);
		} catch {
			continue;
		}
	}
};

function changeLng(lng) {
  i18next.changeLanguage(lng);
};

i18next.on('languageChanged', () => {
  updateContent();
});
