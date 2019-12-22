// Photon Result
////// hs to be dynamic!!!!!!
var test_geojson = {"features":[{"geometry":{"coordinates":[8.385558897150922,49.01233445],"type":"Point"},"type":"Feature","properties":{"osm_id":109861108,"osm_type":"W","extent":[8.3852704,49.0124502,8.385848,49.012223],"country":"Germany","osm_key":"building","housenumber":"3","city":"Karlsruhe","street":"Hoffstraße","osm_value":"university","postcode":"76133","name":"Hochschule Karlsruhe - Gebäude HO","state":"Baden-Württemberg"}}],"type":"FeatureCollection"}
var test_geojson2 = {"features":[{"geometry":{"coordinates":[8.392054,49.013238],"type":"Point"},"type":"Feature","properties":{"osm_id":6576279444,"osm_type":"N","country":"Germany","osm_key":"amenity","housenumber":"30","city":"Karlsruhe","street":"Moltkestraße","osm_value":"university","postcode":"76133","name":"Hochschule Karlsruhe - Fakultät für Wirtschaftswissenschaften (W)","state":"Baden-Württemberg"}}],"type":"FeatureCollection"}

// list of geocoding json results
lGeocodedAddr = [test_geojson, test_geojson2];

// Tesseract result array
lTesseract = ["Hoffstraße,3,76133,Karlsruhe", "Moltkestraße,30,76133,Karlsuhe"];

// Global variable
var iIndexDigiInput = 0;

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
		var leafletGeojson = L.geoJSON(lGeocodedAddr[id], {
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



// Enable and disable Tabs in Digitalization and Mapping Steps
$("#NextToTesseract").click(function(e){
	e.preventDefault();
	$('#verifyDigTab').removeClass('disabled');
	$('a[href="#verifyDigContent"]').trigger('click');
	$('#uploadTab').attr('class','nav-link disabled');
	// fill Tesseract array
	createDigitalizationCheckboxes(lTesseract);
});


$("#NextToPhoton").click(function(e){
	e.preventDefault();
	$('#verifyGeoTab').removeClass('disabled');
	$('a[href="#veryGeoContent"]').trigger('click');
	$('#verifyDigTab').attr('class','nav-link disabled');
	// fill geocoding array
	createGeocodingCheckboxes(lGeocodedAddr);

});

// removes element from html file
function removeElement(elementId) {
	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
}

// resets the text input of the tesseract result
function resetInput(tInputId,iTesseractIndex){
	var inputText = document.getElementById(tInputId);
	var digitAddress = lTesseract[iTesseractIndex];
	inputText.value = digitAddress;
}

function createInputCheckbox(bAdditionalInput){

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

	var inputCheckb = document.createElement("input");
	inputCheckb.setAttribute("type","checkbox");
	inputCheckb.setAttribute("id",tInputCheckbId);
	inputCheckb.setAttribute("value", iIndexDigiInput.toString());
	inputCheckb.setAttribute("checked", "");

	var inputText = document.createElement("input");
	inputText.setAttribute("type","text");
	inputText.setAttribute("class", "form-control");
	inputText.setAttribute("id", tInputTextId);

	if (bAdditionalInput===false){
		var digitAddress = lTesseract[iIndexDigiInput];
		inputText.setAttribute("value", digitAddress);
	}

	var append = document.createElement("div");
	append.setAttribute("class","input-group-append");

	// shall a reset button be added?
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

	var trash = document.createElement("button");
	trash.setAttribute("class","btn btn-outline-secondary")
	trash.setAttribute("type","button");
	trash.setAttribute("onclick","removeElement('"+tInputGroupId+"')");

	var trashIcon = document.createElement("i");
	trashIcon.setAttribute("class","far fa-trash-alt");

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

// function inserts input form groups for each found address of tesseract and fills the input with the corresponding addresses
function createDigitalizationCheckboxes(lTesseract){
	var i;
	for (i = 0; i < lTesseract.length; i++){
		createInputCheckbox(bAdditionalInput=false);
	}
};

// function inserts form-check-groups for each geocoding result and fills the label with the corresponding address
function createGeocodingCheckboxes(lJsonResults){
	var i;
	for (i = 0; i < lJsonResults.length; i++){

		var jsonResult = lJsonResults[i];
		tCheckboxId = "geoCheckbox" + i;
		tLabelId = "geoCheckboxLabel" + i;

		//console.log("Ids: " + tCheckboxId + ", " + tLabelId);

		// create HTML Checkbox with empty label
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

		var label = document.createElement("label");
		label.setAttribute("for",tCheckboxId);
		label.setAttribute("class","form-check-label");
		label.setAttribute("id",tLabelId);
		label.innerHTML = addr_values.join(", ");

		// add HTML Elements
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
    previewImage.src = URL.createObjectURL(event.target.files[0]);

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
