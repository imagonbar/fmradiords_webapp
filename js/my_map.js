//MAPA JS
/*function load_map(){
    var map = L.map('map').setView([43.24896, -2.90658], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'imagonbar.negn87jj',
        accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
    }).addTo(map);

    var marker = L.marker([43.24896, -2.90658]).addTo(map);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    var popup = L.popup()
    .setLatLng([43.25, -2.91])
    .setContent("I am a standalone popup.")
    .openOn(map);
}

//load_map();
*/

/*
var map = L.map('map').setView([43.24896, -2.90658], 13);

L.tileLayer(
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
    {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'imagonbar.negn87jj',
        accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
    }
).addTo(map);
var marker_1 = L.marker([43.24896, -2.90658]).addTo(map);
marker_1.bindPopup("<b>Casa</b><br>Aquí estoy.").openPopup();

var marker_2 = L.marker([43.23, -2.908]).addTo(map);
marker_2.bindPopup("<b>Otra posicion</b><br>Aquí.").openPopup();

var popup_click = L.popup();

function onMapClick(e) {
    popup_click
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    
    var circle = L.circle(e.latlng, 1500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);
}

map.on('click', onMapClick);
*/

/*
var littleton = L.marker([43.24896, -2.90658]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([43.24896, -2.91]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([43.24896, -2.92]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([43.24896, -2.93]).bindPopup('This is Golden, CO.');


var cities = L.layerGroup([littleton, denver, aurora, golden]);
*/
/*
var grayscale = L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'imagonbar.nel9kj4a',
            accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
        }),
    color = L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'imagonbar.ciejoahv8005psvkhqxidzkaj',
            accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
        }),
    black = L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'imagonbar.negn87jj',
            accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
        });

var map = L.map('map', {
    center: [43.24896, -2.90658],
    zoom: 10,
    layers: [color]
    //layers: [grayscale, cities]
});

var baseMaps = {
    "Color": color,
    "Black": black,
    "Grayscale": grayscale,
};

/*
var overlayMaps = {
    "Cities": cities
};
*/

//L.control.layers(baseMaps, overlayMaps).addTo(map);

//L.control.layers(baseMaps).addTo(map);


/*
var marker_1 = L.marker([43.24896, -2.906158]).addTo(map);
marker_1.bindPopup("<b>Casa</b><br>Aquí estoy.").openPopup();

var marker_2 = L.marker([43.23, -2.908]).addTo(map);
marker_2.bindPopup("<b>Otra posicion</b><br>Aquí.").openPopup();
*/

/*
var popup_click = L.popup();

function onMapClick(e) {
    //var server_path = "http://www.fmradiords.com/devserver_files/";
    var server_path = "https://galan.ehu.es/imagonbar88/DAS/TFG/php_files_in_server/";
    
    function show_content_bd_radio_json(){
        var pos_latitud = e.latlng.lat;
        var pos_longitud = e.latlng.lng;
        var precision = "normal_prec";
        var url = server_path + "get_listado_ppal_json.php";
        var array_data = {"posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};
        var emisora_anterior = null;

        $.getJSON(url, array_data, function(emisoras) {
            $.each(emisoras, function(i,emisoras){
                nueva_linea = 
                    "<div id="+ emisoras.cod_emisora_json + ">"+
                        "<div class=\"info_vista_secund\">" +
                            "<a id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                emisoras.nombre_emisora_json +" -- "+ emisoras.freq_emision_json
                            "</a>"+
                        "</div>" +
                    "</div>";
                //$('#id_popup').append(nueva_linea);
            });
            $('#id_popup').append(emisoras.length);
        });
    }

    show_content_bd_radio_json();

    popup_click
        .setLatLng(e.latlng)
        .setContent("En estas coordenadas "+ e.latlng.toString() +" hay estos elementos registrados en el sistema <div id='id_popup'>")
        .openOn(map);

    var circle = L.circle(e.latlng, 3000, 
        {
            color: 'green',
            fillColor: '#70DB87',
            fillOpacity: 0.2
        }
    ).addTo(map);
    //map.removeLayer(cities);
}
map.on('click', onMapClick);
*/