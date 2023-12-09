let satelliteURL = 'https://api.wheretheiss.at/v1/satellites/25544';

// Longitude and Latitude DOM elements
let issLat = document.querySelector('#ISS_Lat');
let issLong = document.querySelector('#ISS_Longitude');
let updateTime = 10000; // milliseconds

let maxFailedAttempt = 3; // max attempts to fetch, if failed

let timeStampCount = document.querySelector('#timeStampUpdate'); // Time stamp countdown of current time

// New map and setting view from leaflet
let map = L.map('map').setView([0, 0], 1);

// Tile layer details for leaflet
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let satelliteMarker; // satellite marker
// Custom Icon
let satelliteIcon = L.icon({
    iconUrl: 'satelliteIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});

iss(maxFailedAttempt); // Initial start, with max failed attempts as argument

// setInterval(iss, updateTime); // setting the function of fetching lat / long coordinates to specific time ;
function iss(attempts) {
    if (attempts <= 0) {
        alert(
            'Failed to fetch ISS server 3 times, contact server for more information!'
        );
        return;
    }
    // Fetch call from JS
    // instead of using callbacks, use .then to grab the response
    fetch(satelliteURL)
        .then((response) => {
            return response.json(); // Specifically extract raw data and return a Json type data response, in other words, expecting JSON type data
        }) // this is our data
        .then((issLocationData) => {
            // JSON data
            console.log(issLocationData);
            let lat = issLocationData.latitude;

            let long = issLocationData.longitude;

            // marker
            // bind pop up of the satellite location
            // If there is no marker, add it to the map
            if (!satelliteMarker) {
                // marker
                satelliteMarker = L.marker([lat, long], {
                    icon: satelliteIcon,
                }).addTo(map);

                // Date
                let date = new Date();

                let dateMessage = `At ${date}, the ISS is over the following coordinate: `;

                // Put time inside the innerHTML
                timeStampCount.innerHTML = dateMessage;
            } else {
                satelliteMarker.setLatLng([lat, long]);
            }

            satelliteMarker
                .bindPopup(
                    `<b>ISS Satellite</b><br></br <p>Latitude : ${lat}</p><br></br<p>Longitude : ${long}</p> <p>Icon by Creative Commons (Attribution 3.0 unported)</p>`
                )
                .addTo(map);

            // data from JSON will be in the span tag of DOM
            issLat.innerHTML = lat;

            issLong.innerHTML = long;
        })
        .catch((err) => {
            console.log('Error:', err);
            attempts--; // subtract the max attempts when failed
        }) // Error!
        // Finally is the last layer to see if the processed code failed or worked
        .finally(() => {
            setTimeout(iss, updateTime, attempts); // wait (time based on variable on top), and call itself again after that time has passed
        });
}