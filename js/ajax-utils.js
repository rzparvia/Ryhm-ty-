//IIFE("iffy") Immediately-invoked function expression
(function (global) {

        var ajaxUtils = {};

        function getRequestObject() {
            if (window.XMLHttpRequest) {
                return (new XMLHttpRequest());
            } else if (window.ActiveXObject) {
                return new (ActiveXObject('MSXML2.XMLHTTP.3.0'));
            } else {
                global.alert("Your browser does not support Ajax");
                return (null);
            }

        }

        ajaxUtils.sendGetRequest =
            function (requestURL, responseHandler, isJsonResponse) {
                var request = getRequestObject();
                request.onreadystatechange =
                    function () {
                        handleResponse(request, responseHandler, isJsonResponse);
                    };
                request.open("GET", requestURL, true);
                request.send(null);
            };

        function handleResponse(request, responseHandler, isJsonResponse) {
            if ((request.readyState == 4) &&
                (request.status == 200)) {

                if (isJsonResponse == undefined) {
                    isJsonResponse = true;
                }
                if (isJsonResponse) {
                    responseHandler(JSON.parse(request.responseText))
                } else {
                    responseHandler(request);
                }
            }
        }

        global.$ajaxUtils = ajaxUtils;

    }

)(window);