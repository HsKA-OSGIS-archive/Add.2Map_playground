# Add.2Map

## Who?
This project was created by Melanie Riester, Tibebu Galaso and Nina Kirschner in Wintersemester 2019 / 2020 in the study course Open Source GIS and the study program Geomatics at the University of Applied Science in Karlsruhe. The task was to implement a self-chosen open-source project, which includes the fields of Open Source, Web and GIS.

## What?
The result is the website Add.2Map.
The purpose of this project is to upload a photo with one or more addresses and to get the position of these address(es) on a map as a result. This makes sense especially when several analogue addresses are involved, as digitalization is automated and time can be saved.
It is recommended to use the webpage from a mobile device as a photo of addresses can be taken directly.

The project is divided into three parts:
  - Optical character recognition (OCR), for the address extraction from uploaded photos with the library tesseract.js
  - Geocoder, for finding the coordinates for each recognized address with the search engine Photon
  - Responsive webpage as a user interface with
      - navigation bar (home and about page)
      - user interaction, to validate the results from the character recognition and the geocoding
      - visualization of the geocoded addresses on a map
      - basic error handling
      - multilanguage support (English, German)


## Installation



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
