# Geocoder Photon

For this work, we used the geocoder Photon.
In our code, we are using the running Photon geocoder from komoot, which is available under this URL: http://photon.komoot.de/api/?
Before you run use this sourcecode: check if this url is still available!

If you run this project it is also possible to not use the Photon geocoder from komoot but to run your own Photon.
In the "Installation" section all the important information is given.

## Installation

Link to information about komoot: https://github.com/komoot/photon

Link to the last release: https://github.com/komoot/photon/releases

To fill it with data you can
1. Use the planet file from Graphhopper
	- Follow the description on https://github.com/komoot/photon/releases chapter (Installation)
	- Be aware that Graphhopper only provides a planet file, so you will need enough storage (53G gb compressed)
	- If you want to have a smaller extent (see point 2)
	
	
2. To create a running photon with an extent smaller than the whole planet. Follow these steps.
	- Build a nominatim database: a nominatim is another geocoder which is build in a postgres/postgis. Photon needs this database to create the elastic search instance. 
		Instructions how to build a nominatim database can be found here: https://nominatim.org/release-docs/develop/admin/Installation/
		The Source code for nominatim can be found under	https://github.com/openstreetmap/Nominatim
		It is necessary to have a postgres and postgis. Fill the data base with your desired extent with an osm-file for example from Geofabrik (https://download.geofabrik.de/)