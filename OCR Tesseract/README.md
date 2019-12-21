# OCR Tesseract

For this project, we used [Tesseract.js](https://github.com/tesseract-ocr/tesseract) for recognition of texts from image. The extraction of Addresses from unstructured text (the result of tesseract) was conducted by the use of Regex.
* Goal: 
	Extracting all German addresses

* Limmitations:
	Since City names are irregular in their pattern, some city names with three words (Frankfurt Am Main) are not extracted.
	

To increase the robustness of the address extraction additional Regex's can be applied in further development.




 