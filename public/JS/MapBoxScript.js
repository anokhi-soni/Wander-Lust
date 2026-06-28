mapboxgl.accessToken = mapToken; // this mapToken variable is defined and initialized inside the show_place.ejs only which contains the Access Token of our Account on MapBox
    
const map = new mapboxgl.Map({
    container: 'map', // this 'map' is the id given by us to the div element inisde which the map will be shown
        style: 'mapbox://styles/mapbox/standard-satellite', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: coordinates // center the map on this longitude and latitude ie., [longitude, latitude]
        // center: [73.01582, 19.03681] // location Of Navi Mumbai // map will be centered to this longitudnal and latitudnal position
});

// map.addControl(new mapboxgl.NavigationControl());
// map.scrollZoom.disable();

// map.on('style.load', () => {
//     map.setFog({}); // Set the default atmosphere style
// });

const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 }) // setting color of the pin marker to black
    .setLngLat(coordinates) // setLngLat => set longitude and Latitude  // coordinates => variable created by us in the script tag inside show_place.ejs which stores the coordinates of the listing location
    .setPopup( // setPopup is a method of the class Marker to set the Popup and inside this only we'll pass the object of class Popup

        new mapboxgl.Popup({offset: 25, className : "popupStyle"}) // an object of class Popup is created here
            .setHTML(`<h4>${placeLocation}</h4> <p>The exact location will be given once you book the place</p>`) // the contents that must be visisble onto the popup msg
            // .setMaxWidth("300px") // giving the max width to the popup msg
    )
    .addTo(map); // Means Add this marker to the specified map instance so it becomes visible.

