function haePaikkatiedot() {
    navigator.geolocation.getCurrentPosition(function (loc) {
            var latlon = {lat: loc.coords.latitude, lng: loc.coords.longitude};
            map.panTo(latlon);
        },
        function (errordata) {
            console.log("Virhe:" + errordata.message);
        },
        {enableHighAccuracy: true});
}

var map;

function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(60.171944, 24.941389),
        zoom: 15,
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

