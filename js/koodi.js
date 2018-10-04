var baseurl = "https://rata.digitraffic.fi/api/v1/live-trains/station/";

var asemat = [];
var lyhytkoodit = [];

var lahtoasema = "";
var tuloasema = "";
var hakutulokset = document.getElementById("hakutulokset");
// Haetaan kaikki matkustajaliikenteen asemat ja luodaan niistä valintalistat
haeAsemaData();

function haeAsemaData() {
    $ajaxUtils.sendGetRequest('https://rata.digitraffic.fi/api/v1/metadata/stations', function (asematulos) {
        filteroiAsemat(asematulos);

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
    });
}

//JUNIEN KELLONAJAT TÄLLÄ PYYNNÖLLÄ
var xhr1 = new XMLHttpRequest();
xhr1.onreadystatechange = function () {
    if (xhr1.readyState === 4) {
        if (xhr1.status === 200) {
            // Tehdään jotakin, pyyntö on valmis
            var tulos = JSON.parse(xhr1.responseText);
            console.dir(tulos);


        } else {
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }
};

//AVAA UUDEN HAUN TIETYLLE PÄIVÄMÄÄRÄLLE JOSTA SAADAAN LÄHTEVIEN JUNIEN AIKATAULUT
function haeJunienAikataulut() {
    var x = document.getElementById("lahtoasemat").value;
    var y = document.getElementById("tuloasemat").value;
    var a = 20;
    var depY = document.getElementById("vu").value;
    if (depY < 2000) {
        depY = a + depY;
    }
    var depD = document.getElementById("pv").value;
    if (depD < 10) {
        depD = "0" + depD;
    }
    var depM = document.getElementById("kk").value;
    if (depM < 10) {
        depM = "0" + depM;
    }
    var depdate = (depY + "-"
        + depD + "-"
        + depM);
    var depdateISO = (depY + "-"
        + depD + "-"
        + depM + "T"
        + document.getElementById("tun").value + ":"
        + document.getElementById("min").value + ":00.000Z");

    if (x && y) {
        //tämä pätkä määrittelee miltä aikaväliltä junat haetaan, limit=15 on että listataan 15 tulosta, saa muuttaa
        xhr1.open('GET', baseurl
            + x + "/"
            + y + '?departure_date='
            + depdate + '&startDate='
            + depdateISO + '&endDate=&limit=15', false);
        // TÄSSÄ TULOSTETAAN KONSOLIIN KASAAN PARSITUN URLIN LINKKI
        console.log(baseurl
            + x + "/"
            + y + '?departure_date='
            + depdate + '&startDate='
            + depdateISO + '&endDate=&limit=15');
        xhr1.send(null);
    }
};

function filteroiAsemat(tulos) {
    for (var i = 0; i < tulos.length; ++i) {
        if (tulos[i].passengerTraffic === true) {
            lyhytkoodit.push(tulos[i].stationShortCode);
            asemat.push(tulos[i].stationName);
        }
    }
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
    while (hakutulokset.firstChild) {
        hakutulokset.removeChild(hakutulokset.firstChild);
    }
    var optiot = {hour: '2-digit', minute: '2-digit', hour12: false};

    // Ilmoitetaan käyttäjälle ettei yhteyksiä ole, mikäli tulos palauttaa virheen.

    if (res.code === "TRAIN_NOT_FOUND") {
        var eiYhteyksia = document.createElement("div");
        eiYhteyksia.innerText = "Hakemiesi asemien välilä ei löytynyt suoria yhteyksiä.";
        eiYhteyksia.classList.add("grid-item")
        hakutulokset.appendChild(eiYhteyksia);
    } else {
        for (var i = 0; i < res.length; ++i) {

            var juna = res[i];
            var junatunnus = juna.trainType + juna.trainNumber;


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

            var junatunnussolu = document.createElement("div");
            junatunnussolu.innerText = junatunnus;
            junatunnussolu.classList.add("grid-item");
            solut.push(junatunnussolu);
            var lahtoasemasolu = document.createElement("div");
            lahtoasemasolu.innerText = lahtoasema;
            lahtoasemasolu.classList.add("grid-item");
            solut.push(lahtoasemasolu);
            var lahteesolu = document.createElement("div");
            lahteesolu.innerText = lahtoaika;
            lahteesolu.classList.add("grid-item");
            solut.push(lahteesolu);
            var maaraasemasolu = document.createElement("div");
            maaraasemasolu.innerText = tuloasema;
            maaraasemasolu.classList.add("grid-item");
            solut.push(maaraasemasolu);
            var perillasolu = document.createElement("div");
            perillasolu.innerText = haettusaapumisaika;
            perillasolu.classList.add("grid-item");
            solut.push(perillasolu);

            for (var l = 0; l < solut.length; ++l) {
                hakutulokset.appendChild(solut[l]);
            }
        }
    }
}
