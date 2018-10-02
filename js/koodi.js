var asemat = [];

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // Tehdään jotakin, pyyntö on valmis
            var tulos = JSON.parse(xhr.responseText);
            console.dir(tulos);
            filteroi(tulos);

        } else {
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }
};
haeAsemaData();
haeKelloData();

function haeAsemaData() {
    xhr.open('GET', 'https://rata.digitraffic.fi/api/v1/metadata/stations', false);
    console.log('https://rata.digitraffic.fi/api/v1/metadata/stations');
    xhr.send(null);
}

function haeKelloData() {
    xhr.open('GET', 'https://rata.digitraffic.fi/api/v1/trains/2018-10-02/1', false);
    console.log('https://rata.digitraffic.fi/api/v1/trains/2018-10-02/1');
    xhr.send(null);
}

function filteroi(tulos) {
    for (var i = 0; i < tulos.length; ++i) {
        if (tulos[i].passengerTraffic === true) {
            console.log(tulos[i].stationName);
            asemat.push(tulos[i].stationName);
        }
    }
}

var valintalista = document.getElementById("lahto");
for (var j = 0; j < asemat.length; ++j) {
    var lahtoOption = document.createElement("option");
    lahtoOption.value = asemat[j];
    lahtoOption.innerText = asemat[j];
    valintalista.appendChild(lahtoOption);
}

var saapumisasemat = document.getElementById("tulo");
for (var k = 0; k < asemat.length; ++k) {
    var tuloOption = document.createElement("option");
    tuloOption.value = asemat[k];
    tuloOption.innerText = asemat[k];
    saapumisasemat.appendChild(tuloOption);
}
console.log(asemat);



