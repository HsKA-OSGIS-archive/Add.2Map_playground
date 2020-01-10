# Add.2Map Website
The webpage represents the graphical user interface and combines all the functionality
of the project. It supports the English and German language, which can be
selected in the menu.

## Home page
On the home page, the process chain from the uploading of a photo of address(es)
to the visualization on the map is divided into three process steps.

In the first step "Upload" the user can upload a photo
with addresses. If the website is accessed with a mobile device, the user gets
the opportunity to directly take a photo or to choose one from the photo galery.
After the upload a preview of the photo is shown.

Afterwards, in the second step "Digitalization" the photo is delivered to the
optical character recognition (see [OCR Tesseract](https://github.com/HsKA-OSGIS/Add.2Map_playground/tree/master/OCR%20Tesseract)),
which returns all recognized addresses. The result is shown in a checklist.
Depending on the image quality and the type of addresses, the OCR may exhibit
missinterpretations of letters or may not recognize some addresses at all
(see OCR Tesseract README). Therefore the user gets the possibility to edit or
delete the recognized addresses and to manually add new addresses. Furthermore
the user can select, which addresses should be shown on the map.

In the third step, the "Geocoding" all selected addresses from the secend step are
delivered to the geocoder Photon, hosted by komoot (see [Geocoder Photon](https://github.com/HsKA-OSGIS/Add.2Map_playground/tree/master/Geocoder%20Photon)).
The query returns for each address the coordinates, as well as additional
information. All found addresses are shown as a checklist. To validate the geocoding
result, The user has the option to select all addresses, which should be shown on
the map.

Finally the process steps are hidden and all selected addresses are shown on a
Leaflet map, represented by markers.
If the user clicks on a marker, the address is shown in a popup.

For the text recognition, the geocoding and unselected checkboxes a basic error
handling is implemented. The user is informed if something went wrong.

## About page
The about page gives information about the project and lists all used open-source
libaries with their corresponding license.


## Possible further development
- Upload: Adding possibilities for image editing to improve the result of the OCR
(e.g. cropping the image to the section with addresses)
- Digitalization, Geocoding, Map: Add back buttons to go back to the previous step
- Map: Add possibility to go back to the Upload step and upload another photo of
addresses. These addresses should be added on the map in addition to the addresses
already determined with the first photo.
