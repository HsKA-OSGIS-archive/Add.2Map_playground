# Add.2Map

##Who?
This project was created by Melanie Riester, Tibebu Galaso and Nina Kirschner in Wintersemester 2019 / 2020 in the study course Open Source GIS and the study program Geomatics at the university of applied science in Karlsruhe. The task was to do a project which is built on open source programs or libaries.

##What?
The result is this website: Add.2Map. This Website is responive.
The purpose is to upload a photo with one or more addresses and to get the position of this address(es) on a map as a result.
It is recomended to use the webpage from a mobile device as a photo of addresses can be taken directly

The project is divided into three parts:
  1. The optical character recognition (OCR), for the address extraction from uploaded photos with the library tesseract.js
  2. The geocoder, for finding the coordinates for each recognized address with the search engine photon
  3. The responsive webpage as user interface with
      - navigation bar with home and about page
      - user interaction, to validate the results from the character recognition and the geocoding
      - visualisation of the geocoded addresses on a map
      - Basic error handling
      - multilanguage support (English, German)
  

## Installation



##What happend if i don't get a result or not the result that I expected?

That could have many different reasons:
    - Image size is too small
    - Image quality is too low (try to cut the addresses out and increase contrast)
    - Adress(es) does not exists or the Geocoder couldn't find them
    - If the address is at a wrong position, it might be that to less information was given
    - If the internet connection is too bad, the image recognition takes to long and stops after 30 seconds


# AUTHORS
- [Melanie Riester] (https://github.com/rime1014)
- [Nina Kirschner] (https://github.com/kini1022)
- [Tibebu Galaso] (https://github.com/tibebuGalaso)

# LICENSE
The software is under the MIT License. For more details please chekc the LICENSE file.
