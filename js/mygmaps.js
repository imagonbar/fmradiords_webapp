(function(){
  var content = document.getElementById("geolocation-test");

  if (navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(objPosition)
    {
      var lon = objPosition.coords.longitude;
      var lat = objPosition.coords.latitude;
      var dir = "";
      var latlng = new google.maps.LatLng(lat, lon);
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({"latLng": latlng}, function(results, status)
      {
        if (status == google.maps.GeocoderStatus.OK)
        {
          if (results[0])
          {
            /*dir0 = "<p><strong>Dirección: </strong>" + results[0].formatted_address + "</p>";
            dir1 = "<p><strong>Dirección: </strong>" + results[1].formatted_address + "</p>";
            dir2 = "<p><strong>Dirección: </strong>" + results[2].formatted_address + "</p>";
            dir3 = "<p><strong>Dirección: </strong>" + results[3].formatted_address + "</p>";*/
            dir4 = "<p><strong>Dirección: </strong>" + results[4].formatted_address + "</p>";
            /*dir5 = "<p><strong>Dirección: </strong>" + results[5].formatted_address + "</p>";
            dir6 = "<p><strong>Dirección: </strong>" + results[6].formatted_address + "</p>";
            dir7 = "<p><strong>Dirección: </strong>" + results[7].formatted_address + "</p>";
            dir8 = "<p><strong>Dirección: </strong>" + results[8].formatted_address + "</p>";*/
            /*console.log(dir0);
            console.log(dir1);
            console.log(dir2);
            console.log(dir3);*/
            console.log(dir4);
            /*console.log(dir5);
            console.log(dir6);
            console.log(dir7);
            console.log(dir8);*/
          }
          else
          {
            dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
          }
        }
        else
        {
          dir = "<p>El Servicio de Codificación Geográfica ha fallado con el siguiente error: " + status + ".</p>";
        }

        content.innerHTML = "<p><strong>Latitud:</strong> " + lat + "</p><p><strong>Longitud:</strong> " + lon + "</p>" + dir;
      });
    }, function(objPositionError)
    {
      switch (objPositionError.code)
      {
        case objPositionError.PERMISSION_DENIED:
          content.innerHTML = "No se ha permitido el acceso a la posición del usuario.";
        break;
        case objPositionError.POSITION_UNAVAILABLE:
          content.innerHTML = "No se ha podido acceder a la información de su posición.";
        break;
        case objPositionError.TIMEOUT:
          content.innerHTML = "El servicio ha tardado demasiado tiempo en responder.";
        break;
        default:
          content.innerHTML = "Error desconocido.";
      }
    }, {
      maximumAge: 75000,
      timeout: 15000
    });
  }
  else
  {
    content.innerHTML = "Su navegador no soporta la API de geolocalización.";
  }
})();