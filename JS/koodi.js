
var baseurl="https://rata.digitraffic.fi/api/v1";
var loppuurl = "/live-trains/station/";


var lista = document.getElementById("lista"); // oikeasti siis tbody
var xhr = new XMLHttpRequest();
var nykyinenasema = '';
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // Tehdään jotakin, pyyntö on valmis
            var tulos = JSON.parse(xhr.responseText);
            console.dir(tulos);

        } else {
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }
};



// function haedata() {
//     nykyinenasema = document.getElementById("asema").value;
//     xhr.open('get', baseurl+loppuurl+nykyinenasema);
//     console.log(baseurl+loppuurl+nykyinenasema);
//     xhr.send();
// }
// haedata();

function haeAsemaData() {
    xhr.open('GET', 'https://rata.digitraffic.fi/api/v1/metadata/stations', false);
    xhr.send(null);
}

function filteroi(tulos) {
    var output = '';
    for (var i = 0; i < tulos.length; ++i) {
        if (tulos[i].passengerTraffic === false && (!(tulos[i].type.includes("TURN")))) {
            output += '<li id="notpublic">' + tulos[i].stationName
                + " ("
                + tulos[i].stationShortCode + ") "
                + tulos[i].type + '</li>';
        } else
        if (!(tulos[i].type.includes("TURN"))) {
            output += '<li>' + tulos[i].stationName
                + " ("
                + tulos[i].stationShortCode + ") "
                + tulos[i].type + '</li>';
        }


    }
    document.getElementById("lista").innerHTML = output;

}