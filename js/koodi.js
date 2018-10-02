var baseurl = "https://rata.digitraffic.fi/api/v1/live-trains/station/";

var asemat = [];
var lyhytkoodit = [];

//ASEMIEN DATA TÄLLÄ PYYNNÖLLÄ
var lahtoasema = "";
var tuloasema = "";


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

function haeAsemaData() {
    xhr.open('GET', 'https://rata.digitraffic.fi/api/v1/metadata/stations', false);
    console.log('https://rata.digitraffic.fi/api/v1/metadata/stations');
    xhr.send(null);
}

//JUNIEN KELLONAJAT TÄLLÄ PYYNNÖLLÄ
var xhr1 = new XMLHttpRequest();
xhr1.onreadystatechange = function () {
    if (xhr1.readyState === 4) {
        if (xhr1.status === 200) {
            // Tehdään jotakin, pyyntö on valmis
            var tulos = JSON.parse(xhr1.responseText);
            console.dir(tulos);
            filteroiKello(tulos);

        } else {
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }
};
haeKelloData();

//AVAA UUDEN HAUN TIETYLLE PÄIVÄMÄÄRÄLLE JOSTA SAADAAN LÄHTEVIEN JUNIEN AIKATAULUT

function haeKelloData() {
    xhr1.open('GET', 'https://rata.digitraffic.fi/api/v1/trains/2018-10-02/1', false);
    console.log('https://rata.digitraffic.fi/api/v1/trains/2018-10-02/1');
    xhr1.send(null);
}

function filteroiKello(tulos) {
    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
    for (var i = 0; i < tulos.length; ++i) {
        for (var j = 0; j < tulos[i].timeTableRows.length; j++) {
            if (tulos[i].timeTableRows[j].type === "DEPARTURE")
                console.log("Lähtee asemalta ("
                    + tulos[i].timeTableRows[j].stationShortCode
                    + ") "
                    + (new Date(tulos[i].timeTableRows[j].scheduledTime).toLocaleTimeString("fi", optiot)));

        }
    }
}

function filteroi(tulos) {
    for (var i = 0; i < tulos.length; ++i) {
        if (tulos[i].passengerTraffic === true) {
            console.log(tulos[i].stationName);
            lyhytkoodit.push(tulos[i].stationShortCode);
            asemat.push(tulos[i].stationName);
        }
    }
}

var valintalista = document.getElementById("lahto");
for (var j = 0; j < asemat.length; ++j) {
    var lahtoOption = document.createElement("option");
    lahtoOption.value = lyhytkoodit[j];
    lahtoOption.innerText = asemat[j];
    valintalista.appendChild(lahtoOption);
}

var saapumisasemat = document.getElementById("tulo");
for (var k = 0; k < asemat.length; ++k) {
    var tuloOption = document.createElement("option");
    tuloOption.value = lyhytkoodit[k];
    tuloOption.innerText = asemat[k];
    saapumisasemat.appendChild(tuloOption);
}


function haeData() {
    lahtoasema = document.getElementById("lahtoasemat").value + "/";
    tuloasema = document.getElementById("tuloasemat").value;
    var hakuURL = baseurl + lahtoasema + tuloasema;

    $ajaxUtils.sendGetRequest(hakuURL, function (res) {
        console.log(res);
    });
}




