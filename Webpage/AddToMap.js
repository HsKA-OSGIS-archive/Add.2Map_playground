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
		maxBounds:[[47.20,6.7],[49.97,10.94]]
	});

	// add basemap
	var basemap = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add Fullscreen
	map.addControl(new L.Control.Fullscreen());

};


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
	loadMap("map");

	var allGeoJsons = [];

	// add markers for addresses
	for (id in selectedIds){
		var leafletGeojson = L.geoJSON(lGeocodeResults[id], {
    	style: {"color": "#ff0000"},
			onEachFeature: function(feature, layer){layer.bindPopup("<strong>" + feature.properties['name'])}  //'<pre>'+JSON.stringify(feature.properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>'
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

function checkIfFinished(){
    return(lTesseractResults.length >= 0);
};

var isFinished = false;

// OnClick event ButtonId: NextToTesseract
$("#NextToTesseract").click(function(e){
	e.preventDefault();
	runOCR(imageUrl);
  //This is not a nice Solution, but works, if the recognigion does not need longer than 5 seconds. (Attemps with a THEN function werent successful)
  setTimeout(function afterFiveSeconds() {
    lTesseractResults = reco_Addr_Step2;
  }, 5000)
  setTimeout(function afterFiveFiveSeconds() {
    // create html elements to show digitalization result
    createDigitalizationCheckboxes(lTesseractResults);
    // Enable and disable Tabs in Digitalization and Mapping Steps
    $('#verifyDigTab').removeClass('disabled');
    $('a[href="#verifyDigContent"]').trigger('click')
    $('#uploadTab').attr('class','nav-link disabled');
  }, 5500)
/*
	runOCR(imageUrl)
	.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
	})
	.then(result => {
		console.log("In result!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");
		console.log("Result: " + result);
		this.lTesseract = result;})
	.catch(failureCallback);
	*/
});


// OnClick event ButtonId: NextToPhoton
$("#NextToPhoton").click(function(e){
	e.preventDefault();

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
		//console.log("InputTextId: " + textInput.id + " address: " + address);
	});

  // Photon Result
  function Get(yourUrl){
      var Httpreq = new XMLHttpRequest(); // a new request
      Httpreq.open("GET",yourUrl,false);
      Httpreq.send(null);
      return Httpreq.responseText;
  }

  var corrAddress;
  for (corrAddress = 0; corrAddress < lCorrectedTesseractAddresses.length; corrAddress++) {
    lGeocodeResults.push(JSON.parse(Get("http://photon.komoot.de/api/?q="+lCorrectedTesseractAddresses[corrAddress]+"&limit=1")));
  }

	// create html elemets to show geocoded addresses
	createGeocodingCheckboxes(lGeocodeResults);

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

// get point coordinates of photon geocoding result --> returns list
function getCoordinates(tGeojson){
	lCoords = [];
	lCoords = tGeojson.features[0].geometry.coordinates;
	return lCoords
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
	'english', 'german'];

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
