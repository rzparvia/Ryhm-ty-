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
    var marker = new google.maps.Marker({
        position: {lat: 60.171944, lng: 24.941389},
        map: map,
        title: 'Hello Academy!'
    });

}

