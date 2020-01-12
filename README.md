# Add.2Map

## Who?
This project was created by Melanie Riester, Tibebu Galaso and Nina Kirschner in Wintersemester 2019 / 2020 in the study course Open Source GIS and the study program Geomatics at the University of Applied Science in Karlsruhe.

## What?
The task was to implement a self-chosen open-source project, which includes the fields of Open Source, Web and GIS.

The result is the project Add.2Map (abbreviation for "Address to map" or "Add point to map").
The purpose of this project is to upload a photo with one or more addresses and to get the position of these address(es) on a map as a result. This makes sense especially when several analogue addresses are involved, as digitalization is automated and time can be saved.
It is recommended to use the webpage Add.2Map from a mobile device as a photo of addresses can be taken directly.

The project is divided into three parts:
  - Optical Character Recognition (OCR), for the address extraction from uploaded photos with the library tesseract.js
  - Geocoder, for finding the coordinates for each recognized address with the search engine Photon
  - Responsive webpage as a user interface with
      - navigation bar (Home and About page)
      - user interaction, to validate the results from the character recognition and the geocoding
      - visualization of the geocoded addresses on a map
      - basic error handling
      - multilanguage support (English, German)


## Installation
To run this website:
1. Download the latest release
2. Unzip the folder
3. Check if the URL: http://photon.komoot.de/api/?q=Berlin is available.
	- If not, change it to a available photon api, or use your own: change the url in the file AddToMap.js.
	- If you want to use your own geocoder anyway: change the url in the file AddToMap.js. (Instructions in the readme of the geocoder photon-folder)
	- If it is availabe, you do not have to change anything
4. Run the index.html in the folder Webpage (The usage of a webserver is not necessary)


## What happened if I don't get a result or not the result that I expected?

That could have many different reasons:
  - Image size is too small
  - Image quality is too low (try to cut the addresses out and increase contrast)
  - Address(es) does not exist or the Geocoder couldn't find them
  - If the address is shown on the map in a wrong position, it might be that to less information was given
  - If the internet connection is too bad, the image recognition takes to long and stops after 30 seconds


## AUTHORS
  - [Melanie Riester](https://github.com/rime1014 "Link to GitHub Profile")
  - [Nina Kirschner](https://github.com/kini1022 "Link to GitHub Profile")
  - [Tibebu Galaso](https://github.com/tibebuGalaso "Link to GitHub Profile")

## LICENSE
The software is under the MIT License. For more details please check the LICENSE file.

## Used libraries

### Bootstrap
The MIT License (MIT)

Copyright (c) 2011-2018 Twitter, Inc.

Copyright (c) 2011-2018 The Bootstrap Authors

### Leaflet
BSD 2-Clause "Simplified" License

Copyright (c) 2010-2019, Vladimir Agafonkin

Copyright (c) 2010-2011, CloudMade

All rights reserved.

### Leaflet Fullscreen
ISC License

Copyright (c) 2015, MapBox

### i18next
The MIT License (MIT)

Copyright (c) 2017 i18next

### Tesseract.js
Apache License 2.0

### Font Awesome
Font Awesome Free License

Font Awesome Free is free, open source, and GPL friendly. You can use it for commercial projects, open source projects, or really almost whatever you want. Full Font Awesome Free license: https://fontawesome.com/license/free.
