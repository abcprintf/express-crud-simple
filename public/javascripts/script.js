var baseUrlSave = window.location.hostname;
var port = "3000";
var httpStr = "http://";
var domain = httpStr + baseUrlSave;
var httpServer = domain + ":" + port;
var socket = io.connect(httpServer);

$(document).ready(function() {
    socket.on("user online", function (obj) {
        console.log(obj);
    });
});