var baseurl = "https://rata.digitraffic.fi/api/v1/live-trains/station/";

var asemat = [];
var lyhytkoodit = [];


var lahtoasema = "";
var tuloasema = "";

//ASEMIEN DATA TÄLLÄ PYYNNÖLLÄ
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
    xhr.open('GET', 'https://rata.digitraffic.fi/api/v1/metadata/stations/', false);
    console.log('https://rata.digitraffic.fi/api/v1/metadata/stations/');
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


//AVAA UUDEN HAUN TIETYLLE PÄIVÄMÄÄRÄLLE JOSTA SAADAAN LÄHTEVIEN JUNIEN AIKATAULUT

function haeKelloData() {
    function haePvm() {
        var pvm = document.getElementById("pvm").value;
    }
    haePvm();
    console.log(pvm);
    var x = document.getElementById("lahtoasemat").value;
    var y = document.getElementById("tuloasemat").value;
    if (x && y) {
        xhr1.open('GET', 'https://rata.digitraffic.fi/api/v1/live-trains/station/' + x + "/" + y, false);
        console.log('https://rata.digitraffic.fi/api/v1/live-trains/station/' + x + "/" + y);
        xhr1.send(null);
    }
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
    lahtoasema = document.getElementById("lahtoasemat").value;
    tuloasema = document.getElementById("tuloasemat").value;
    var hakuURL = baseurl + lahtoasema + "/" + tuloasema;

    $ajaxUtils.sendGetRequest(hakuURL, function (res) {
        kasitteleData(res);
    });
}

function kasitteleData(res) {

    var hakutulokset = document.getElementById("hakutulokset");
    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};
    for (var i = 0; i < res.length; ++i) {

        var juna = res[i];
        var vikarivi = juna.timeTableRows[juna.timeTableRows.length - 1];

        for (var indeksi = 0; indeksi < juna.timeTableRows.length; ++indeksi) {
            if (juna.timeTableRows[indeksi].stationShortCode === lahtoasema) {
                var lahtoaika = new Date(juna.timeTableRows[indeksi].scheduledTime).toLocaleTimeString("fi", optiot);
                break;
            }
        }

        for (var ind = 1; ind < juna.timeTableRows.length; ++ind) {
            if (juna.timeTableRows[ind].stationShortCode === tuloasema) {
                var haettusaapumisaika = new Date(juna.timeTableRows[ind].scheduledTime).toLocaleTimeString("fi", optiot);
                break;
            }
        }
        var solut = [];

        // var junatunnussolu = document.createElement("div"); junatunnussolu.innerText = junatunnus; junatunnussolu.classList.add("grid-item"); solut.push(junatunnussolu);
        var lahtoasemasolu =  document.createElement("div"); lahtoasemasolu.innerText = lahtoasema; lahtoasemasolu.classList.add("grid-item"); solut.push(lahtoasemasolu);
        var lahteesolu = document.createElement("div"); lahteesolu.innerText = lahtoaika; lahteesolu.classList.add("grid-item"); solut.push(lahteesolu);
        var perillasolu = document.createElement("div"); perillasolu.innerText = haettusaapumisaika; perillasolu.classList.add("grid-item"); solut.push(perillasolu);
        var maaraasemasolu = document.createElement("div"); maaraasemasolu.innerText = tuloasema; maaraasemasolu.classList.add("grid-item"); solut.push(maaraasemasolu);
        // var perillalopullinentd = document.createElement("grid-item"); perillalopullinentd.innerText = saapumisaikalopullinen; solut.push(perillalopullinentd);

        for(var l = 0 ; l < solut.length ; ++l) {
            hakutulokset.appendChild(solut[l]);
        }
    }
}





