$(document).ready(function() {
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var request;
	var db;
	if(!window.indexedDB)	{
		console.log("Your Browser does not support IndexedDB");
		console.log("");
	}
	else {
		openDB();
	}
	//geoPos();
	addEventListeners();
});


/*function openDB_radios(){
	var request = window.indexedDB.open("BD_radios_prueba_5", 1);
	request.onsuccess = function(event) {
		console.log("Success opening DB - Users");
		db = event.target.result;
	}
	request.onupgradeneeded = function(event) {
		console.log("Upgrading");
		db = event.currentTarget.result;
		var objectStore = db.createObjectStore("table_users", { autoIncrement: true });// keyPath: numero_rfe,
		objectStore.createIndex('nombre_user', 'nombre_user', { unique: false });
		objectStore.createIndex('numero_user', 'numero_user', { unique: false });
	}
	request.onerror = function(event){
		console.log("Error opening DB", event.target.errorCode);
		console.log("La versión actual de la BD es inferior a una anteriormente ejecutada.")
	}
}*/

function openDB(){
	var db_name = "db_app_1";
	var db_version = 2;
	var request = window.indexedDB.open(db_name, db_version);
	request.onsuccess = function(event) {
		db = event.target.result;
		console.log("Success opening " + db_name + " version " +db_version);
	}
	request.onupgradeneeded = function(event) {
		db = event.currentTarget.result;
		var objectStore = db.createObjectStore("table_radios", { autoIncrement: true });// keyPath: numero_rfe,
		objectStore.createIndex('emisora_nombre', 'emisora_nombre', { unique: false });
		objectStore.createIndex('emisora_frecuencia', 'emisora_frecuencia', { unique: false });
		objectStore.createIndex('emisora_latitud', 'emisora_latitud', { unique: false });
		objectStore.createIndex('emisora_longitud', 'emisora_longitud', { unique: false });

		var objectStore = db.createObjectStore("table_users", { autoIncrement: true });// keyPath: numero_rfe,
		objectStore.createIndex('codigo_user', 'codigo_user', { unique: true });
		objectStore.createIndex('nombre_user', 'nombre_user', { unique: false });
		objectStore.createIndex('email_user', 'email_user', { unique: true });
		objectStore.createIndex('pass1_user', 'pass1_user', { unique: false });
		objectStore.createIndex('pass2_user', 'pass2_user', { unique: false });

		var objectStore = db.createObjectStore("table_emisiones_cercanas_rds", { autoIncrement: true });// keyPath: numero_rfe,
		objectStore.createIndex('codigo_emision', 'codigo_emision', { unique: true });
		objectStore.createIndex('nombre_emision', 'nombre_emision', { unique: false });
		objectStore.createIndex('frecuencia_emision', 'frecuencia_emision', { unique: false });

		console.log("Upgrading");
	}
	request.onerror = function(event){
		console.log("Error opening DB", event.target.errorCode);
		console.log("La versión actual de la BD es inferior a una anteriormente ejecutada.")
	}
}

/*function initDB(){
	var objectStore = db.transaction("table_users").objectStore("table_users");
}

function initDB_nombre_user(){
	var objectStore = db.transaction("table_users").objectStore("table_users");
	return objectStore.index('nombre_user');
}

function initDB_numero_user(){
	var objectStore = db.transaction("table_users").objectStore("table_users");
	return objectStore.index("numero_user");
}*/


function addEventListeners(){
	//Añadir usuario
	$("#id_article_logged_aniadir_usuario_btn_add").click(function(){
		var nombre_user = $("#id_article_logged_aniadir_usuario_nombre").val();
		var numero_user = $("#id_article_logged_aniadir_usuario_numero").val();

		if (nombre_user=="" || numero_user==""){
			console.log("Algún campo está vacio");
			imprimirTexto("Algún campo está vacio");
		}
		else{
			var transaction = db.transaction(["table_users"],"readwrite");
			transaction.oncomplete = function(event) {
				console.log("Usuario añadido."+
							"\nNombre: "+ nombre_user +
							"\nNumero: "+ numero_user );
				document.getElementById('id_article_prueba2_result').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">Usuario añadido!!<br></p>";
				document.getElementById('id_article_prueba2_result').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">"+ 
					"<br/>Nombre: " + nombre_user + 
					"<br/>Numero: " + numero_user +"</p>";
			};
			transaction.onerror = function(event) {
				console.log("Elemento NO añadido, error" 
						+ "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
						+ "\n-> Posibilidad 2: Problema con la tabla de la BD");
				document.getElementById('resultado_a_mostrar').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">Elemento NO añadido, error" 
						+ "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
						+ "\n-> Posibilidad 2: Problema con la tabla de la BD";
			};
			var objectStore = transaction.objectStore("table_users");
			objectStore.add({nombre_user: nombre_user, numero_user: numero_user});
		}
	});
}

/*function addEventListeners(){
	//RADIOS
	$("#btn_add_rfe").click(function() {
		//Cars
		var numero_rfe = new Date().getTime();
		var nombre_rfe = $("#nombre_rfe").val();
		var frecuencia_rfe = $("#frecuencia_rfe").val();
		var valor_inutil = $("#valor_inutil").val(); 
		//var mylatitud  = $("#hiddenInfo_latitude").val();
		//var mylongitud = $("#hiddenInfo_longitude").val();
		var mylatitud  = localStorage.getItem('mylatit');
		var mylongitud = localStorage.getItem('mylongit');

		if (nombre_rfe=="" || frecuencia_rfe==""){
			console.log("Algún campo está vacio");
			poner_en_blanco();
			imprimirTexto("Algún campo está vacio");
		}
		else{
			var transaction = db.transaction(["table_radios"],"readwrite");
			transaction.oncomplete = function(event) {
				console.log("Emisora añadida."+
							"\nCodigo: "+ numero_rfe +
							"\nRadio: "+ nombre_rfe +
							"\nFrecuencia: "+ frecuencia_rfe +
							"\nLatitud: "+ mylatitud +
							"\nLongitud: "+ mylongitud);
				document.getElementById('resultado_a_mostrar').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">Emisora añadida!!<br></p>";
				document.getElementById('resultado_a_mostrar').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">Codigo: " + numero_rfe + 
					"<br/>Radio: " + nombre_rfe + 
					"<br/>Frecuencia: " + frecuencia_rfe +
					"<br/>Latitud: " + mylatitud +
					"<br/>Longitud: " + mylongitud +"</p>";
			};
			transaction.onerror = function(event) {
				console.log("Elemento NO añadido, error" 
						+ "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
						+ "\n-> Posibilidad 2: Problema con la tabla de la BD");
				document.getElementById('resultado_a_mostrar').innerHTML += 
					"<p id=\"listado_items\" class=\"listado_items\">Elemento NO añadido, error" 
						+ "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
						+ "\n-> Posibilidad 2: Problema con la tabla de la BD";
			};
			var objectStore = transaction.objectStore("table_radios");
			objectStore.add({numero_rfe: numero_rfe, nombre_rfe: nombre_rfe, frecuencia_rfe: frecuencia_rfe, 
							valor_inutil: valor_inutil, latitud: mylatitud, longitud: mylongitud});
			poner_en_blanco();
		}
	});
*/

/*	$("#btn_update_rfe").click(function() {
		var nombre_rfe = $("#nombre_rfe").val();
		var frecuencia_rfe = $("#frecuencia_rfe").val();
		//var valor_inutil = $("#valor_inutil").val();
		var transaction = db.transaction(["table_radios"],"readwrite");
		var objectStore = transaction.objectStore("table_radios");
		var request = objectStore.get(nombre_rfe);

		var com, mod, mar, mat = false;
		var texto_a_mostrar = "";
		var frecuencia_vieja = "";
		request.onsuccess = function(event) {
			var elemento = event.target.result;
			if (elemento){
				if (frecuencia_rfe != ""){
					frecuencia_vieja = request.result.frecuencia_rfe;
					request.result.frecuencia_rfe = frecuencia_rfe;
					com = true;
				}
				if (com){ 
					texto_a_mostrar = frecuencia_vieja + " to " + frecuencia_rfe;
					console.log("Emisora actualizada."+
						"\nCodigo: "+ elemento.numero_rfe +
						"\nRadio: "+ elemento.nombre_rfe +
						"\nFrecuencia: "+ elemento.frecuencia_rfe +
						"\nLatitud: "+ elemento.latitud +
						"\nLongitud: "+ elemento.longitud);	
					imprimirTexto("Emisora actualizada!!");
					imprimirResultadoConTexto(elemento);
				}
				else{
					console.log("No se actualiza ningún valor");
					imprimirTexto("No se actualiza ningún valor");
				}
				objectStore.put(request.result);
			}
			else{
				if (nombre_rfe=="" || frecuencia_rfe==""){
					console.log("Algún campo está vacio");	
					imprimirTexto("Algún campo está vacio");
				}
				else{
					console.log("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);	
					imprimirTexto("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);
	
				}
			}
		};
		poner_en_blanco();
	});
*/
/*
	$("#btn_update_same_text_rfe").click(function() {
		var texto_busqueda_nomb = $("#nombre_rfe").val();
		var texto_busqueda_frec = $("#frecuencia_rfe").val();
		var valor_inutil = $("#valor_inutil").val();
		var objectStore = db.transaction(["table_radios"],"readwrite").objectStore("table_radios");
		var i=0;
		console.log("------------------------");
		var hay_alguno = false;
		var nombre_rfe;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
		  		//nombre_rfe y frecuencia_rfe
		  		if ((texto_busqueda_nomb != "") && (texto_busqueda_frec != "") && (valor_inutil!="")) {

		  		 	if ((cursor.value.nombre_rfe == texto_busqueda_nomb) &&
		  				(cursor.value.frecuencia_rfe == texto_busqueda_frec)){
					  	console.log("Emisora actualizada " + i + 
					  				"\nCodigo: " + cursor.value.numero_rfe+
					  				"\nNombre: "+ cursor.value.nombre_rfe +
					  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
									"\nLatitud: " + cursor.value.latitud + 
									"\nLongitud: "+ cursor.value.longitud +
									"\nNumero inutil: " + cursor.value.valor_inutil);
						imprimirTexto("Emisora obtenida "+i);
						imprimirResultado(cursor);
						var request = objectStore.get(cursor.value.nombre_rfe);
						request.result.valor_inutil = valor_inutil;
						objectStore.put(request.result);

						//No nos hace falta en este caso, pero viene bien para asegurar lo que ocurre
							/*request.onsuccess = function(event){
								console.log("ELEMENTO BORRADO");
							}
							request.onerror = function(event){
								console.log("ELEMENTO NO BORRADO " + event);
							}* /
						hay_alguno = true;
				    }
				}
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			if (i > 1){
						console.log("Elementos actualizado: " + i);	
		  			}
		  			else{
		  				console.log("Elemento actualizado: " + i);		
		  			}
		  		}
		  		else{
	  				console.log("No hay radios en la colección");
	  				imprimirTexto("No hay radios en la colección");
			  	}
			}
		};
		poner_en_blanco();
	});

	$("#btn_get_same_text_rfe").click(function() {
		var texto_busqueda_nomb = $("#nombre_rfe").val();
		var texto_busqueda_frec = $("#frecuencia_rfe").val();
		var objectStore = db.transaction(["table_radios"],"readwrite").objectStore("table_radios");
		var i=0;
		console.log("------------------------");
		var hay_alguno = false;
		var hay_coincidentes = true;
		var nombre_rfe;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
		  		//nombre_rfe y frecuencia_rfe
		  		if ((texto_busqueda_nomb != "") && (texto_busqueda_frec != "")) {
		  		 	if ((cursor.value.nombre_rfe == texto_busqueda_nomb) &&
		  				(cursor.value.frecuencia_rfe == texto_busqueda_frec)){
			  			i = i + 1;
					  	console.log("Emisora obtenida " + i + 
					  				"\nCodigo: " + cursor.value.numero_rfe+
					  				"\nNombre: "+ cursor.value.nombre_rfe +
					  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
									"\nLatitud: " + cursor.value.latitud + 
									"\nLongitud: "+ cursor.value.longitud);
						imprimirTexto("Emisora obtenida "+i);
						imprimirResultado(cursor);
						var request = objectStore.get(cursor.key);
						//No nos hace falta en este caso, pero viene bien para asegurar lo que ocurre
							/*request.onsuccess = function(event){
								console.log("ELEMENTO BORRADO");
							}
							request.onerror = function(event){
								console.log("ELEMENTO NO BORRADO " + event);
							}* /
						hay_alguno = true;
				    }
				    else
				    {
				    	hay_coincidentes = false;
				    }
				}
				
		  		else {
		  			//nombre_rfe
		  			if ((texto_busqueda_nomb != "") && (texto_busqueda_frec =="")){
			  			if (cursor.value.nombre_rfe == texto_busqueda_nomb){
				  			i = i + 1;
						  	console.log("Emisora obtenida " + i + 
						  				"\nCodigo: " + cursor.value.numero_rfe+
						  				"\nNombre: "+ cursor.value.nombre_rfe +
						  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
										"\nLatitud: " + cursor.value.latitud + 
										"\nLongitud: "+ cursor.value.longitud);
							imprimirTexto("Emisora obtenida "+i);
							imprimirResultado(cursor);
							var request = objectStore.get(cursor.key);
							hay_alguno = true;
					    }
					    else {
				    		hay_coincidentes = false;	
				    	}
					}
					//frecuencia_rfe
					else if ((texto_busqueda_frec != "") &&	(texto_busqueda_nomb =="")){
						if ((cursor.value.frecuencia_rfe == texto_busqueda_frec)){
				  			i = i + 1;
						  	console.log("Emisora obtenida " + i + 
						  				"\nCodigo: " + cursor.value.numero_rfe+
						  				"\nNombre: "+ cursor.value.nombre_rfe +
						  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
										"\nLatitud: " + cursor.value.latitud + 
										"\nLongitud: "+ cursor.value.longitud);
							imprimirTexto("Emisora obtenida "+i);
							imprimirResultado(cursor);
							var request = objectStore.get(cursor.key);
							hay_alguno = true;
						}
					    else {
				    		hay_coincidentes = false;	
						}
					}
				}
				if ((texto_busqueda_nomb == "") && (texto_busqueda_frec == "")){
					console.log("Campos de input vacios");
					imprimirTexto("Campos de input vacios");
				}
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			if (i > 1){
						console.log("Elementos obtenido: " + i);	
		  			}
		  			else{
		  				console.log("Elemento obtenido: " + i);		
		  			}
		  		}
		  		else{
		  			if (!hay_coincidentes){
						console.log("No se han encontrado resultados");		
						imprimirTexto("No se han encontrado resultados");		
		  			}
		  			else
			  		{
		  				console.log("No hay radios en la colección");
		  				imprimirTexto("No hay radios en la colección");
			  		}
			  	}
			}
		};
		poner_en_blanco();
	});

	$("#btn_getAll_rfe").click(function() {
		var objectStore = db.transaction(["table_radios"],"readonly").objectStore("table_radios");
		var i=1;
		console.log("------------------------");
		var hay_alguno = false;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
		  		console.log("Emisora obtenida " + i + 
		  					"\nCodigo: "+ cursor.value.numero_rfe +
		  					"\nNombre: "+ cursor.value.nombre_rfe +
		  					"\nFrecuencia: "+ cursor.value.frecuencia_rfe	+ 
		  					"\nLatitud: "+cursor.value.latitud + 
		  					"\nLongitud: "+cursor.value.longitud);
				console.log("------------------------");
				imprimirTexto("Emisora obtenida " + i);
				imprimirResultado(cursor);
			  	
			  	i = i + 1;
			  	hay_alguno = true;
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			console.log("Fin de colección");
		  			console.log("***********************");	
		  		}
		  		else{
		  			console.log("No hay radios en la colección");
		  			imprimirTexto("No hay radios en la colección");
		  		}
			}
		};
		poner_en_blanco();
	});


	$("#btn_remove_same_text_rfe").click(function() {
		var texto_busqueda_nomb = $("#nombre_rfe").val();
		var texto_busqueda_frec = $("#frecuencia_rfe").val();
		var objectStore = db.transaction(["table_radios"],"readwrite").objectStore("table_radios");
		var i=0;
		console.log("------------------------");
		var hay_alguno = false;
		var hay_coincidentes = true;
		var nombre_rfe;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
		  		//nombre_rfe y frecuencia_rfe
		  		if ((texto_busqueda_nomb != "") && (texto_busqueda_frec != "")) {
		  		 	if ((cursor.value.nombre_rfe == texto_busqueda_nomb) &&
		  				(cursor.value.frecuencia_rfe == texto_busqueda_frec)){
			  			i = i + 1;
					  	console.log("Emisora borrada " + i + 
					  				"\nCodigo: " + cursor.value.numero_rfe+
					  				"\nNombre: "+ cursor.value.nombre_rfe +
					  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
									"\nLatitud: " + cursor.value.latitud + 
									"\nLongitud: "+ cursor.value.longitud);
						imprimirTexto("Emisora borrada "+i);
						imprimirResultado(cursor);
						var request = objectStore.delete(cursor.key);
						//No nos hace falta en este caso, pero viene bien para asegurar lo que ocurre
							/*request.onsuccess = function(event){
								console.log("ELEMENTO BORRADO");
							}
							request.onerror = function(event){
								console.log("ELEMENTO NO BORRADO " + event);
							}* /
						hay_alguno = true;
				    }
				    else
				    {
				    	hay_coincidentes = false;
				    }
				}
				
		  		else {
		  			//nombre_rfe
		  			if ((texto_busqueda_nomb != "") && (texto_busqueda_frec =="")){
			  			if (cursor.value.nombre_rfe == texto_busqueda_nomb){
				  			i = i + 1;
						  	console.log("Emisora borrada " + i + 
						  				"\nCodigo: " + cursor.value.numero_rfe+
						  				"\nNombre: "+ cursor.value.nombre_rfe +
						  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
										"\nLatitud: " + cursor.value.latitud + 
										"\nLongitud: "+ cursor.value.longitud);
							imprimirTexto("Emisora borrada "+i);
							imprimirResultado(cursor);
							var request = objectStore.delete(cursor.key);
							hay_alguno = true;
					    }
					    else {
				    		hay_coincidentes = false;	
				    	}
					}
					//frecuencia_rfe
					else if ((texto_busqueda_frec != "") &&	(texto_busqueda_nomb =="")){
						if ((cursor.value.frecuencia_rfe == texto_busqueda_frec)){
				  			i = i + 1;
						  	console.log("Emisora borrada " + i + 
						  				"\nCodigo: " + cursor.value.numero_rfe+
						  				"\nNombre: "+ cursor.value.nombre_rfe +
						  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
										"\nLatitud: " + cursor.value.latitud + 
										"\nLongitud: "+ cursor.value.longitud);
							imprimirTexto("Emisora borrada "+i);
							imprimirResultado(cursor);
							var request = objectStore.delete(cursor.key);
							hay_alguno = true;
						}
					    else {
				    		hay_coincidentes = false;	
						}
					}
				}
				if ((texto_busqueda_nomb == "") && (texto_busqueda_frec == "")){
					console.log("Campos de input vacios");
					imprimirTexto("Campos de input vacios");
				}
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			if (i > 1){
						console.log("Elementos borrados: " + i);	
		  			}
		  			else{
		  				console.log("Elemento borrado: " + i);		
		  			}
		  		}
		  		else{
		  			if (!hay_coincidentes){
						console.log("No se han encontrado resultados");		
						imprimirTexto("No se han encontrado resultados");		
		  			}
		  			else
			  		{
		  				console.log("No hay radios en la colección");
		  				imprimirTexto("No hay radios en la colección");
			  		}
			  	}
			}
		};
		poner_en_blanco();
	});
	
	$("#btn_remove_all_rfe").click(function() {
		/*var objectStore = db.transaction(["table_radios"],"readwrite").objectStore("table_radios");
		var i=1;
		console.log("------------------------");
		var hay_alguno = false;
		var nombre_rfe;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
				nombre_rfe = cursor.value.nombre_rfe;  		
			  	console.log("Emisora borrada " + i + 
			  				"\nCodigo: " + cursor.value.numero_rfe+
			  				"\nNombre: "+ cursor.value.nombre_rfe +
			  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
							"\nLatitud: " + cursor.value.latitud + 
							"\nLongitud: "+ cursor.value.longitud);
				imprimirTexto("Emisora borrada "+i);
				imprimirResultado(cursor);

			  	i = i + 1;
			  	hay_alguno = true;
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			console.log("Todo borrado");	
		  		}
		  		else{
		  			console.log("No hay radios en la colección");
		  			imprimirTexto("No hay radios en la colección");
		  		}
			}
			if (hay_alguno){
				db.transaction(["table_radios"],"readwrite").objectStore("table_radios").delete(nombre_rfe);
			}
		};
		poner_en_blanco();* /

		var texto_busqueda_nomb = $("#nombre_rfe").val();
		var texto_busqueda_frec = $("#frecuencia_rfe").val();
		var objectStore = db.transaction(["table_radios"],"readwrite").objectStore("table_radios");
		var i=0;
		console.log("------------------------");
		var hay_alguno = false;
		var hay_coincidentes = true;
		var nombre_rfe;
		objectStore.openCursor().onsuccess = function(event) {
		  	var cursor = event.target.result;
		  	if (cursor) {
	  			i = i + 1;
			  	console.log("Emisora borrada " + i + 
			  				"\nCodigo: " + cursor.value.numero_rfe+
			  				"\nNombre: "+ cursor.value.nombre_rfe +
			  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
							"\nLatitud: " + cursor.value.latitud + 
							"\nLongitud: "+ cursor.value.longitud);
				imprimirTexto("Emisora borrada "+i);
				imprimirResultado(cursor);
				var request = objectStore.delete(cursor.key);
				//No nos hace falta en este caso, pero viene bien para asegurar lo que ocurre
					/*request.onsuccess = function(event){
						console.log("ELEMENTO BORRADO");
					}
					request.onerror = function(event){
						console.log("ELEMENTO NO BORRADO " + event);
					}* /
				hay_alguno = true;
			    cursor.continue();
		  	}
		  	else {
		  		if (hay_alguno){
		  			if (i > 1){
						console.log("Elementos borrados: " + i);	
		  			}
		  			else{
		  				console.log("Elemento borrado: " + i);		
		  			}
		  		}
		  		else{
	  				console.log("No hay radios en la colección");
	  				imprimirTexto("No hay radios en la colección");
			  	}
			}
		};
		poner_en_blanco();
	});

	//BOTONES BUSQUEDAS CON INDICES
	//Muestra los elementos del indice NOMBRE_RFE que coincidan con el texto introducido
	/*$("#btn_busqueda_segun_nombre_rfe_listado").click(function() {
		var i=1;
		var hay_alguno = false;
		var texto_busqueda = $("#texto_busqueda_nombre_rfe").val();
		var indicefrecuencia_rfe = initDB_nombre_rfe();
		indicefrecuencia_rfe.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.key == texto_busqueda){
					imprimirTexto("Emisora obtenida " + i);
					//imprimirTexto(cursor.key);
					//imprimirTexto(cursor.primaryKey);
					//imprimirTexto(cursor.value.frecuencia_rfe);
					console.log("Emisora obtenida " + i + 
			  				"\nCodigo: " + cursor.value.numero_rfe+
			  				"\nNombre: "+ cursor.value.nombre_rfe +
			  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
							"\nLatitud: " + cursor.value.latitud + 
							"\nLongitud: "+ cursor.value.longitud);
					imprimirResultado(cursor);
					i = i + 1;
			  		hay_alguno = true;
				}
			    cursor.continue();
		  	}
		  	else{
		  		if (hay_alguno){
		  			console.log("Fin de colección");
		  			console.log("***********************");	
		  		}
		  		else if (texto_busqueda == ""){
					console.log("Campo de texto vacio");	
					imprimirTexto("Campo de texto vacio");	
				}
				else{
					console.log("Elemento no encontrado. \n Nombre Emisora : " + texto_busqueda);	
					imprimirTexto("Elemento no encontrado. \n Nombre Emisora : " + texto_busqueda);	
				}
		  	}
		};
		poner_en_blanco();
	});

	//Muestra los elementos del indice FRECUENCIA_RFE que coincidan con el numero introducido
	$("#btn_busqueda_segun_frecuencia_rfe_listado").click(function() {
		var i=1;
		var hay_alguno = false;
		var texto_busqueda = $("#texto_busqueda_frecuencia_rfe").val();
		var indicefrecuencia_rfe = initDB_frecuencia_rfe();
		indicefrecuencia_rfe.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.key == texto_busqueda){
					imprimirTexto("Emisora obtenida " + i);
					//imprimirTexto(cursor.key);
					//imprimirTexto(cursor.primaryKey);
					//imprimirTexto(cursor.value.frecuencia_rfe);
					console.log("Emisora obtenida " + i + 
			  				"\nCodigo: " + cursor.value.numero_rfe+
			  				"\nNombre: "+ cursor.value.nombre_rfe +
			  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
							"\nLatitud: " + cursor.value.latitud + 
							"\nLongitud: "+ cursor.value.longitud);
					imprimirResultado(cursor);
					i = i + 1;
			  		hay_alguno = true;
				}
			    cursor.continue();
		  	}
		  	else{
		  		if (hay_alguno){
		  			console.log("Fin de colección");
		  			console.log("***********************");	
		  		}
		  		else{
			  		if (texto_busqueda == ""){
						console.log("Campo de texto vacio");	
						imprimirTexto("Campo de texto vacio");	
					}
					else if (texto_busqueda){

					}
					else{
						console.log("Elemento no encontrado.\nFrecuencia : " + texto_busqueda);	
						imprimirTexto("Elemento no encontrado.\nFrecuencia : " + texto_busqueda);	
					}
				}
		  	}
		};
		poner_en_blanco();
	});

	//Muestra los elementos del indice NOMBRE_RFE además de coincidir tmb FRECUENCIA_RFE con el texto y numero introducido
	$("#btn_busqueda_segun_nombre_frecuencia_rfe_listado").click(function() {
		var i=1;
		var hay_alguno = false;
		var texto_busqueda_nomb = $("#texto_busqueda_nombre_rfe2").val();
		var texto_busqueda_frec = $("#texto_busqueda_frecuencia_rfe2").val();
		var indicefrecuencia_rfe = initDB_nombre_rfe();

		indicefrecuencia_rfe.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				//cursor.key == cursor.value.nombre_rfe
				if (cursor.key == texto_busqueda_nomb){
					if (cursor.value.frecuencia_rfe == texto_busqueda_frec){
						imprimirTexto("Emisora obtenida " + i);
						//imprimirTexto(cursor.key);
						//imprimirTexto(cursor.primaryKey);
						//imprimirTexto(cursor.value.frecuencia_rfe);
						console.log("Emisora obtenida " + i + 
				  				"\nCodigo: " + cursor.value.numero_rfe+
				  				"\nNombre: "+ cursor.value.nombre_rfe +
				  				"\nFrecuencia: "+ cursor.value.frecuencia_rfe +
								"\nLatitud: " + cursor.value.latitud + 
								"\nLongitud: "+ cursor.value.longitud);
						imprimirResultado(cursor);
						i = i + 1;
				  		hay_alguno = true;
				  	}
				}
			    cursor.continue();
		  	}
		  	else{
		  		if (hay_alguno){
		  			console.log("Fin de colección");
		  			console.log("***********************");	
		  		}
		  		else if (texto_busqueda_nomb == "" || texto_busqueda_frec == ""){
					console.log("Campo de texto vacio");	
					imprimirTexto("Campo de texto vacio");	
				}
				else{
					console.log("Elemento no encontrado. \nNombre Emisora : " + texto_busqueda_nomb + "\nFrecuencia: "+ texto_busqueda_frec);	
					imprimirTexto("Elemento no encontrado. \nNombre Emisora : " + texto_busqueda_nomb + "\nFrecuencia: "+ texto_busqueda_frec);	
				}
		  	}
		};
		poner_en_blanco();
	});


	/*$("#cleanTextBtn").click(function() {
		document.getElementById('result').innerHTML = "";
		document.getElementById('result_extra').innerHTML = "";
		console.log("Pantalla limpia");
	});
}
*/

function poner_en_blanco(){
	document.form_rfe.nombre_rfe.value = "";
	document.form_rfe.frecuencia_rfe.value = "";
	//document.form_rfe.valor_inutil.value = "";
	//document.form1.hiddenInfo_latitude.value = "";
	//document.form1.hiddenInfo_longitude.value = "";
	//localStorage.clear();
	//document.getElementById('texto_busqueda_nombre_rfe').value = "";
	//document.getElementById('texto_busqueda_frecuencia_rfe').value = "";
	//document.getElementById('texto_busqueda_nombre_rfe2').value = "";
	//document.getElementById('texto_busqueda_frecuencia_rfe2').value = "";
	document.getElementById('resultado_a_mostrar').innerHTML = "";
}

//cursor
function imprimirResultado(elemento){
	document.getElementById('resultado_a_mostrar').innerHTML += 
		"<a href=\"./mis_radios_seleccionada.html\" title=\"hola\"><p id=\"listado_items\" class=\"listado_items\">Codigo: " + elemento.value.numero_rfe + 
		"<br/>Radio: " + elemento.value.nombre_rfe + 
		"<br/>Frecuencia: " + elemento.value.frecuencia_rfe +
		"<br/>Latitud: " + elemento.value.latitud +
		"<br/>Longitud: " + elemento.value.longitud +"</p></a>";
}

//elemento
function imprimirResultadoConTexto(elemento){
	document.getElementById('resultado_a_mostrar').innerHTML += 
		"<a href=\"./mis_radios_seleccionada.html\" title=\"hola\"><p id=\"listado_items\" class=\"listado_items\">Codigo: " + elemento.numero_rfe + 
		"<br/>Radio: " + elemento.nombre_rfe + 
		"<br/>Frecuencia: " + elemento.frecuencia_rfe +
		"<br/>Latitud: " + elemento.latitud +
		"<br/>Longitud: " + elemento.longitud +"</p></a>";
}

function imprimirTexto(texto){
	document.getElementById('resultado_a_mostrar').innerHTML += 
		"<p id=\"listado_items\" class=\"listado_items\">"+ texto +"<br></p>";
}


//CODIGO ESCOMBRO
/*
$("#btn_get_rfe").click(function() {
		var nombre_rfe = $("#nombre_rfe").val();
		var request = db.transaction(["table_radios"],"readonly").objectStore("table_radios").get(nombre_rfe);
		request.onsuccess = function(event){
			var elemento = event.target.result;
			if (elemento){
				console.log("Emisora obtenida."+
						"\nCodigo: "+ elemento.numero_rfe +
						"\nRadio: "+ elemento.nombre_rfe +
						"\nFrecuencia: "+ elemento.frecuencia_rfe +
						"\nLatitud: "+ elemento.latitud +
						"\nLongitud: "+ elemento.longitud);	
				imprimirTexto("Emisora obtenida!!")
				imprimirResultadoConTexto(elemento);
			}
			else{
				if (nombre_rfe == ""){
					console.log("Campo del Nombre Emisora vacio");	
					imprimirTexto("Campo del Nombre Emisora vacio");
				}
				else{
					console.log("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);	
					imprimirTexto("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);	
				}
			}
		};
		request.onerror = function(event){
			console.log("Error getting data from DB", event);
			imprimirTexto("Error getting data from DB", event);
		};
		poner_en_blanco();
	});

//Muestra el ultimo elemento que tenga Diesel como frecuencia_rfe
$("#button_busqueda_fija").click(function() {
		var indicefrecuencia_rfe = initDB();
		indicefrecuencia_rfe.get("Diesel").onsuccess = function(event) {
			imprimirLogsConTexto(event.target.result);
			imprimirAlertasConTexto(event.target.result);
		};
});

//Muestra los elementos que tengan el texto introducido como frecuencia_rfe (xk este es el indice)
$("#button_busqueda_listado").click(function() {
		var indicefrecuencia_rfe = initDB();
		indicefrecuencia_rfe.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
			    imprimirLogs(cursor);
				imprimirAlertas(cursor);
			    cursor.continue();
		  	}
		};
});

//Muestra los elementos que tengan el texto introducido como frecuencia_rfe (xk este es el indice)
$("#button_busqueda_listado_postDiesel").click(function() {
		var lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Diesel", true);
		var indicefrecuencia_rfe = initDB();
		indicefrecuencia_rfe.openCursor(lowerBoundOpenKeyRange).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				imprimirLogs(cursor);
				imprimirAlertas(cursor);
			    cursor.continue();
		  	}
		};
});

//Muestra el ultimo elemento que tenga el texto introducido como frecuencia_rfe (xk este es el indice)
$("#button_busqueda_segun_texto").click(function() {
		var texto_busqueda = $("#texto_busqueda").val();
		var indicefrecuencia_rfe = initDB();
		indicefrecuencia_rfe.get(texto_busqueda).onsuccess = function(event) {
			imprimirLogsConTexto(event.target.result);
			imprimirAlertasConTexto(event.target.result);
		};
});
	

$("#btn_remove_rfe").click(function() {
		var nombre_rfe = $("#nombre_rfe").val();
		var request = db.transaction(["table_radios"],"readwrite").objectStore("table_radios").delete(nombre_rfe);
		request.onsuccess = function(event){
			var elemento = event.target.result;
			if (elemento){
			  	console.log("Emisora borrada."+
			  				"\nCodigo :" + request.result.numero_rfe +
			  				"\nNombre: "+ request.result.nombre_rfe +
			  				"\nFrecuencia: "+ request.result.frecuencia_rfe +
							"\nLatitud: " + request.result.latitud + 
							"\nLongitud: "+ request.result.longitud);
				imprimirTexto("Emisora borrada!!")
				imprimirResultadoConTexto(elemento);
				
			}
			else{
				if (nombre_rfe == ""){
					console.log("Campo del Nombre Emisora vacio");	
					imprimirTexto("Campo del Nombre Emisora vacio");	
				}
				else{
					console.log("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);	
					imprimirTexto("Elemento no encontrado. \n Nombre Emisora : " + nombre_rfe);	
				}
		  	}
		}
		poner_en_blanco();
});
*/