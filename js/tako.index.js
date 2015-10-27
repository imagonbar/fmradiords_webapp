    Tako.init({
        articles     : [
                        //"pruebas.html",
                        //"db_local.html",
                        //"db_server.html",
                        //"pruebas4.html",
                        "poner_clavex.html"
                        ],
        logging      : Tako.logging.LOG,
        urlNavigation: true
    });

    Tako.onReady(function(){
        console.log("READY");


        //*************************************************************************************        
        //**** **** **** **** Other Part **** **** **** ****
        //CONFIGURAR LA DIRECCION DEL SERVIDOR
            //Devolver la raiz del servidor, según dispositivo (local/server) donde estemos!!
            //var tipo_disp = "local"; //"server"
            //var tipo_disp = "server"; //SIEMPRE VA A SER ESTA OPCION, ASÍ FUNCIONA DESDE CUALQUIER DISPOSITIVO
            /*if (tipo_disp == "server"){
                //server_path = "https://galan.ehu.es/imagonbar88/DAS/TFG/php_files_in_server/";
                server_path = "https://www.fmradiords.com/server_files/";
            } else{
                server_path = "../php_files_in_server/";
            }*/
            
            var server_path = "http://www.fmradiords.com/devserver_files/";
            //var server_path = "https://galan.ehu.es/imagonbar88/DAS/TFG/php_files_in_server/";
        
        //*************************************************************************************        
        //**** **** **** **** Other Part **** **** **** ****
        //INDEX -> AL INICIAR LA APP
            //##IGB funcion nueva
            comprobar_conexion();

            //**##IGB NUEVO, añadir en DS   
            function comprobar_conexion(){
                var online = Tako.Connection.isOnline();
                if (online){
                    //console.log("App now is online");

                    geoPos();

                     //Para mostrar los ddl con contenido, estos dos no van a cambiar "nunca"
                    show_content_bd_emisoras_alcance_ddl();
                    show_content_bd_emisoras_tipos_ddl();
                    show_content_bd_emisoras_alcance_ddl_scan();
                    show_content_bd_emisoras_tipos_ddl_scan();

                    if (localStorage.getItem('codigo_usuario')>0) {
                        comprobar_usuario_activo_server(function(existe){
                            if (existe == "noactivo"){
                                eliminar_usuario_datos_localStorage();
                                show_notify_close_session();
                                setTimeout(function(){
                                    redirect("article_index/section_index");
                                },0);
                            }
                            else{
                                setTimeout(function(){ 
                                    poner_datos_ultima_emision_logged();
                                    //poner_datos_ultima_emision_notlogged();
                                    poner_datos_nuevo_usuario_perfil();
                                    redirect("article_logged_radio_ui/section_logged_radio_ui");
                                    //if (document.getElementById("txtBD_radio_ui_logged_json").textContent == ""){
                                    $("#txtBD_radio_ui_logged_json").children("div").remove();
                                    show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                                    //}
                                }, 0);
                            }
                        });
                    }
                    else{
                        setTimeout(function(){redirect("article_index/section_index");}, 0);
                    }
                }
                else{
                    //console.log("App now is offline");
                    show_notify_offline();
                    if (localStorage.getItem('codigo_usuario')>0){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);                            
                    }
                    else{
                        setTimeout(function(){redirect("article_index/section_index");},0);
                    }
                }
                var connectionChange = function(online){
                    if(online){
                        //console.log("App now is online");
                        if (localStorage.getItem('codigo_usuario')>0){
                            setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);                            
                        }
                        else{
                            setTimeout(function(){redirect("article_index/section_index");},0);
                        }
                        localStorage.setItem('auto_rds_offline','false');
                    }
                    else{
                        //console.log("App now is offline");
                        show_notify_offline();

                        if (localStorage.getItem('codigo_usuario')>0){
                            setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);                            
                        }
                        else{
                            setTimeout(function(){redirect("article_index/section_index");},0);
                        }
                    }
                };
                Tako.Connection.onChange(connectionChange);
            }
            //**##IGB FIN NUEVO, añadir en DS


            //para ver si el usuario está activo en el sistema. Si no está y su sesión está abierta en otro dispositivo, cerramos su sesión
            function comprobar_usuario_activo_server(callback){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var params = "usuario_cod="+cod_usu;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_usuario_activo.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            localStorage.setItem('mapa_loaded',false);
            //load_map();

        //**** **** **** **** Other Part **** **** **** ****
        //INDEX -> INFO

            var viewURL_imagonbar_twitter = document.querySelector("#view_url_twitter_profile_imagonbar_firefoxos");
            if (viewURL_imagonbar_twitter) {
                viewURL_imagonbar_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/imagonbar"
                        }
                    });
                };
            }
            var viewURL_imagonbar_googleplus = document.querySelector("#view_url_googleplus_profile_imagonbar_firefoxos");
            if (viewURL_imagonbar_googleplus) {
                viewURL_imagonbar_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var writeEmail_imagonbar = document.querySelector("#write_email_imagonbar_firefoxos");
            if (writeEmail_imagonbar) {
                writeEmail_imagonbar.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:imagonbar88@gmail.com"
                        }
                    });
                };
            }

            var viewURL_fmradiords_twitter = document.querySelector("#view_url_twitter_profile_fmradiords_firefoxos");
            if (viewURL_fmradiords_twitter) {
                viewURL_fmradiords_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/fmradiords"
                        }
                    });
                };
            }
            var viewURL_fmradiords_twitter = document.querySelector("#id_registra_incidencia_btn_escribir_tw");
            if (viewURL_fmradiords_twitter) {
                viewURL_fmradiords_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/fmradiords"
                        }
                    });
                };
            }
            var viewURL_fmradiords_googleplus = document.querySelector("#view_url_googleplus_profile_fmradiords_firefoxos");
            if (viewURL_fmradiords_googleplus) {
                viewURL_fmradiords_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var viewURL_fmradiords_googleplus = document.querySelector("#id_registra_incidencia_btn_escribir_gp");
            if (viewURL_fmradiords_googleplus) {
                viewURL_fmradiords_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var writeEmail_fmradiords = document.querySelector("#write_email_fmradiords_firefoxos");
            if (writeEmail_fmradiords) {
                writeEmail_fmradiords.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:fmradiordsapp@gmail.com"
                        }
                    });
                };
            }
            var writeEmail_fmradiords = document.querySelector("#id_registra_incidencia_btn_escribir_em");
            if (writeEmail_fmradiords) {
                writeEmail_fmradiords.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:fmradiordsapp@gmail.com"
                        }
                    });
                };
            }

            //Colaboradores
            var viewURL_openstreetview = document.querySelector("#view_url_openstreetview_firefoxos");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://www.openstreetmap.org/"
                        }
                    });
                };
            }

            var viewURL_openstreetview = document.querySelector("#view_url_openstreetview_others");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://www.openstreetmap.org/"
                        }
                    });
                };
            }

            //Mozilla Developer Network
            var viewURL_openstreetview = document.querySelector("#view_url_mdn_firefoxos");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://developer.mozilla.org/es/"
                        }
                    });
                };
            }

            var viewURL_openstreetview = document.querySelector("#view_url_mdn_others");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://developer.mozilla.org/es/"
                        }
                    });
                };
            }

            //TakoJS
            var viewURL_takojs = document.querySelector("#view_url_takojs_firefoxos");
            if (viewURL_takojs) {
                viewURL_takojs.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "http://www.takojs.com"
                        }
                    });
                };
            }
            var viewURL_takojs = document.querySelector("#view_url_takojs_others");
            if (viewURL_takojs) {
                viewURL_takojs.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "http://www.takojs.com"
                        }
                    });
                };
            }    

            /*document.getElementById("id_article_info_patras").addEventListener("click",function(){
                setTimeout(function(){
                    redirect("article_index/section_index");
                },0);
            });*/
            

        //**** **** **** **** Other Part **** **** **** ****
        //INDEX -> IDENTIFY 
            document.getElementById("id_article_index_identify_btn_indentify").addEventListener("click",function() {
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_index/section_index");},0);
                    });
                }
                else{
                    var email_valido = false;
                    var valor_email = "";
                    var password_vacia = false;
                    var password_pequenia = false;
                    var valor_password = "";
                    var text = "";

                    //Comprobacion email
                    valor_email = document.getElementById("id_article_index_identify_email").value;
                    if (validarEmailRegExp(valor_email)){
                        email_valido = true;
                        text += imprimir_errores_email_valido();
                    }

                    //Comprobacion password
                    valor_password = document.getElementById("id_article_index_identify_pass").value;
                    if (validarPassRegExp(valor_password)){
                        password_vacia = true;
                        text += imprimir_errores_password_vacia();
                    }
                    else{
                        if (validarTextoTamanioMinimo(valor_password)) {
                            password_pequenia = true;                           
                            text += imprimir_errores_password_pequenia();
                        }
                    }
                    if (email_valido || password_vacia || password_pequenia){
                        Tako.Notification.error("deny", "Error!!",text, null, function(){
                        });                
                    }
                    else{
                        //Comprobacion usuario en db server
                        var existe = "";
                        nuevo_identificar_usuario_index_server(function(existe){
                            if (existe == "email" || existe == "emailclave" || existe == "usuarionoactivo"){
                                if (existe == "email") {
                                    text += imprimir_errores_identificar_usuario_email_inexistente();
                                }
                                else{
                                    if (existe == "emailclave") {
                                        text += imprimir_errores_identificar_usuario_email_clave_no_coinciden();
                                    }
                                    else{
                                        if (existe == "usuarionoactivo") {
                                            text += imprimir_errores_identificar_usuario_no_activo_info();
                                        }
                                    }
                                }
                                if (existe == "email" || existe == "emailclave"){
                                    Tako.Notification.error("deny", "Error!!",text, null, function(){
                                    });                
                                }
                                else{
                                    if (existe == "usuarionoactivo") {
                                        var reactivar_usuario_global = navigator.mozL10n.get("id_reactivar_usuario");
                                        Tako.Notification.custom(reactivar_usuario_global, text, true,"",null,function(){
                                            nuevo_reactivar_usuario_server();
                                            nuevo_poner_en_blanco_identificar_usuario_index();
                                            setTimeout(function(){redirect("article_index/section_index");},0);
                                        });
                                    }
                                }
                            }
                            else{
                                var correcto_global = navigator.mozL10n.get("id_correcto");
                                var identificacion_correcta_global = navigator.mozL10n.get("id_identificacion_correcta");
                                Tako.Notification.success("ok", correcto_global, identificacion_correcta_global, null, function(){
                                    poner_nuevo_usuario_identificar(existe);
                                    poner_datos_nuevo_usuario_perfil();
                                    nuevo_poner_en_blanco_identificar_usuario_index();
                                    show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                                    cerrar_sesion_eliminar_usuario_botones_radio();
                                    setTimeout(function(){
                                        redirect("article_logged_radio_ui/section_logged_radio_ui");},
                                    0);

                                });
                                //PARAR E INICIAR RADIO FM
                                console.log("Usuario identificado");
                                
                                //reproduccion_radiofm("resintoniza");
                                reproduccion_radiofm("versionWEB");
                                /* versWEB */
                            }
                        });
                    }
                }
            });

            function nuevo_identificar_usuario_index_server(callback){
                var usuario_email = $("#id_article_index_identify_email").val();
                var usuario_pass = $("#id_article_index_identify_pass").val();
                var params = "usuario_pass="+usuario_pass+"&usuario_email="+usuario_email;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "identificar_usuario.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.send(params);
            }

            function nuevo_reactivar_usuario_server(){
                var usuario_email = $("#id_article_index_identify_email").val();
                var usuario_pass = $("#id_article_index_identify_pass").val();
                var params = "usuario_email="+usuario_email+"&usuario_pass="+usuario_pass;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "reactivar_usuario.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_activar_usuario_index").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function poner_datos_nuevo_usuario_perfil(){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var idioma = idioma_navegador();
                var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_usuario_concreto.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_profile_datos").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function poner_nuevo_usuario_identificar(codigo_usuario){
                var cod_usuario = codigo_usuario;
                localStorage.setItem('codigo_usuario', cod_usuario);
            }

            function nuevo_poner_en_blanco_identificar_usuario_index(){
                document.getElementById("id_article_index_identify_email").value = "";
                document.getElementById("id_article_index_identify_pass").value = "";
            }

            //**** **** **** **** Other Part **** **** **** ****
            //De momento, queda aparcado
            /*
            //INDEX -> IDENTIFY -> RECUPERAR PASS
                document.getElementById("id_article_index_identify_recordar_pass_btn_indentify").addEventListener("click",function() {
                    var email_valido = false;
                    var valor_email = "";
                    var text = "";

                    //Comprobacion email
                    valor_email = document.getElementById("id_article_index_identify_recordar_pass_email").value;
                    if (validarEmailRegExp(valor_email)){
                        email_valido = true;
                        text += imprimir_errores_email_valido();
                    }

                    if (email_valido){
                        Tako.Notification.error("deny", "Error!!",text, null, function(){});                
                    }
                    else{
                        var correcto_global = navigator.mozL10n.get("id_correcto");
                        var registro_correcto_global = navigator.mozL10n.get("id_registro_correcto");
                        Tako.Notification.success("ok", correcto_global,registro_correcto_global, null, function(){
                            setTimeout(function(){redirect("article_index_identify/section_index_identify");},0);
                        });
                    }
                });
            */


        //**** **** **** **** Other Part **** **** **** ****
        //INDEX -> REGISTER 
            document.getElementById("id_article_index_register_btn_register").addEventListener("click",function() {
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_index/section_index");},0);
                    });
                }
                else{
                    var nombre_usuario_vacia = false;
                    var nombre_usuario_pequenia = false;
                    var nombre_usuario_grande = false;
                    var valor_nombre_usuario = "";
                    var email_valido = false;
                    var valor_email = "";
                    var password_vacia = false;
                    var password_pequenia = false;
                    var valor_password = "";
                    var password_vacia2 = false;
                    var password_pequenia2 = false;
                    var valor_password2 = "";
                    var no_coinciden_password = false;
                    var text = "";

                    //Comprobacion nombre_usuario
                    valor_nombre_usuario = document.getElementById("id_article_index_register_nombre_usuario").value;
                    if (validarNombreRegExp(valor_nombre_usuario)){
                        nombre_usuario_vacia = true;
                        text += imprimir_errores_nombre_usuario_vacia();
                    }else{
                        if (validarTextoTamanioMinimo(valor_nombre_usuario)) {
                            nombre_usuario_pequenia = true;                           
                            text += imprimir_errores_nombre_usuario_pequenia();
                        }
                        else{
                            if (validarTextoTamanioMaximo(valor_nombre_usuario)){
                                nombre_usuario_grande = true;
                                text += imprimir_errores_nombre_usuario_grande();
                            }
                        }
                    }

                    //Comprobacion email
                    valor_email = document.getElementById("id_article_index_register_email").value;
                    if (validarEmailRegExp(valor_email)){
                        email_valido = true;
                        text += imprimir_errores_email_valido();
                    }

                    //Comprobacion password
                    valor_password = document.getElementById("id_article_index_register_pass").value;
                    if (validarPassRegExp(valor_password)){
                        password_vacia = true;
                        text += imprimir_errores_password_vacia();
                    }else{
                        if (validarTextoTamanioMinimo(valor_password)) {
                            password_pequenia = true;                           
                            text += imprimir_errores_password_pequenia();  
                        }
                    }

                    //Comprobacion password_rep
                    valor_password2 = document.getElementById("id_article_index_register_pass_rep").value;
                    if (validarPassRegExp(valor_password2)){
                        password_vacia2 = true;
                        text += imprimir_errores_password_repetida_vacia();
                    }else{
                        if (validarTextoTamanioMinimo(valor_password2)) {
                            password_pequenia2 = true;                           
                            text += imprimir_errores_password_repetida_pequenia();
                        }
                    }
                    //Comprobacion password == password_rep
                    if (!(valor_password == valor_password2)) {
                        no_coinciden_password = true;
                        text += imprimir_errores_passwords_no_coinciden();
                    }
                        
                    if (nombre_usuario_vacia || nombre_usuario_pequenia || nombre_usuario_grande || email_valido ||
                        password_vacia || password_pequenia || password_vacia2 || 
                        password_pequenia2 || no_coinciden_password){

                        Tako.Notification.error("deny", "Error!!",text, null, function(){

                        });                
                    }
                    else{
                        //Comprobacion usuario en db server
                        var existe = "";
                        comprobacion_registro_usuario_index_server(function(existe){
                            if (existe == "estanombre" || existe == "estaemail" || existe == "estanambos"){
                                if (existe == "estanombre") {
                                    text += imprimir_errores_registrar_usuario_nombre_existente();
                                }
                                if (existe == "estaemail") {
                                    text += imprimir_errores_registrar_usuario_mail_existente();
                                }
                                if (existe == "estanambos") {
                                    text += imprimir_errores_registrar_usuario_nombre_mail_existente();
                                }
                                Tako.Notification.error("deny", "Error!!",text, null, function(){
                                });                
                            }
                            else{
                                var correcto_global = navigator.mozL10n.get("id_correcto");
                                var registro_correcto_global = navigator.mozL10n.get("id_registro_correcto");
                                Tako.Notification.success("ok", correcto_global, registro_correcto_global, null, function(){
                                    //registro_usuario_index_local();
                                    nuevo_aniadir_usuario_index_server();
                                    //subir_foto_perfil_server();
                                    nuevo_poner_en_blanco_aniadir_usuario_index();
                                    setTimeout(function(){redirect("article_index_identify/section_index_identify");},0);
                                });
                                console.log("Usuario registrado");
                            }
                        });
                    }
                }
            });

            //Comprobación que no se registren usuarios con nombre o email igual a los que exiten en la base de datos
            function comprobacion_registro_usuario_index_server(callback){
                var usuario_name = $("#id_article_index_register_nombre_usuario").val();
                var usuario_email = $("#id_article_index_register_email").val();
                var params = "usuario_name="+usuario_name+"&usuario_email="+usuario_email;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_usuario_registro.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            function nuevo_aniadir_usuario_index_server(){
                var usuario_nombre = $("#id_article_index_register_nombre_usuario").val();
                var usuario_pass = $("#id_article_index_register_pass").val();
                var usuario_email = $("#id_article_index_register_email").val();
                var params = "usuario_name="+usuario_nombre+"&usuario_pass="+usuario_pass+"&usuario_email="+usuario_email;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_usuario.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_usuario_index").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function nuevo_poner_en_blanco_aniadir_usuario_index(){
                document.getElementById("id_article_index_register_nombre_usuario").value = "";
                document.getElementById("id_article_index_register_email").value = "";
                document.getElementById("id_article_index_register_pass").value = "";
                document.getElementById("id_article_index_register_pass_rep").value = "";
            }

            // UPLOAD IMAGE - WebActivities
            //DE MOMENTO USAMOS EL OTRO METODO
            /*    var pickImage = document.querySelector("#pick-image");
                if (pickImage) {
                    pickImage.onclick = function () {
                        var pick = new MozActivity({
                            name: "pick",
                            data: {
                                type: ["image/png", "image/jpg", "image/jpeg"],
                                nocrop: false // don't allow the user to crop the image
                                // In FxOS 1.3 and before the user is allowed to crop the image by default, 
                                //but this can cause out-of-memory issues so we explicitly disable it.
                            }
                        });

                        pick.onsuccess = function () {
                            var img = document.createElement("img");
                            img.src = window.URL.createObjectURL(this.result.blob);
                            var imagePresenter = document.querySelector("#image-presenter");
                            imagePresenter.appendChild(img);
                            imagePresenter.style.display = "block";
                        };

                        pick.onerror = function () {
                            console.log("Can't view the image");
                        };
                    };
                }*/
            
            //******** Subida de foto
            /* Este método funciona. Sube la foto a la app después de haberla elegido a través de la galeria de imagenes
            y la muestra en la pantalla. No consigo hacer que el archivo se suba al servidor.*/

            
            /*QUIZA PARA FxOS, PERO DE MOMENTO LO DEJAMOS SIN USAR
            var pickImage = document.querySelector("#pick-image_register");
            if (pickImage) {
                pickImage.onclick = function () {
                    var pick = new MozActivity({
                        name: "pick",
                        data: {
                            type: ["image/png", "image/jpg", "image/jpeg"],
                            nocrop: false // don't allow the user to crop the image
                            // In FxOS 1.3 and before the user is allowed to crop the
                            // image by default, but this can cause out-of-memory issues
                            // so we explicitly disable it.
                        }
                    });

                    pick.onsuccess = function () {
                        var img = "";
                        img = document.createElement("img");
                        img.src = window.URL.createObjectURL(this.result.blob);
                        var imagePresenter = document.querySelector("#image-presenter");
                        imagePresenter.appendChild(img);
                        imagePresenter.style.display = "block";
                        console.log(this.result.blob);
                    };
                    
                    pick.onload = function(){
                        console.log("cargandoo");
                    }

                    pick.onerror = function () {
                        console.log("Can't view the image");
                    };
                };
            }*/

            /* Lo dejamos aplazado para un futuro porque no hace nada*/
            /*function subir_foto_perfil_server(){
                console.log("aqui");
                var fileInput = document.getElementById('foto_upload');
                var file = fileInput.files[0];
                var formData = new FormData();
                formData.append('file', file);
                localStorage.setItem('imagen_perfil', formData);
                console.log(formData);

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "profile_pictures";
                xmlhttp.open('POST', url, true);
                xmlhttp.setRequestHeader("Content-Type","multipart/form-data");
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        console.log("aqui estamos");
                    }
                }
                xmlhttp.send(formData);
                console.log("a -> "+xmlhttp);
            }*/

            
            //******* Almacenamiento local
            //Registrar usuario en local IDDB...lo dejamos apartado de momento##
            /*function registro_usuario_index_local(){
                var codigo_user = new Date().getTime();
                var nombre_user = $("#id_article_index_register_nombre_usuario").val();
                var email_user = $("#id_article_index_register_email").val();
                var pass1_user = $("#id_article_index_register_pass").val();
                var pass2_user = $("#id_article_index_register_pass_rep").val();

                if (nombre_user=="" || email_user == "" || pass1_user == "" || pass2_user==""){
                    console.log("Algún campo está vacio");
                    //imprimirTexto("Algún campo está vacio");
                }
                else{
                    var transaction = db.transaction(["table_users"],"readwrite");
                    transaction.oncomplete = function(event) {
                        console.log("Usuario añadido."+
                                    "\nCodigo: "+ codigo_user +
                                    "\nNombre: "+ nombre_user +
                                    "\nEmail: "+ email_user );
                    };
                    transaction.onerror = function(event) {
                        console.log("Elemento NO añadido, error" 
                                + "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
                                + "\n-> Posibilidad 2: Problema con la tabla de la BD");
                    /*  document.getElementById('resultado_a_mostrar').innerHTML += 
                            "<p id=\"listado_items\" class=\"listado_items\">Elemento NO añadido, error" 
                                + "\n-> Posibilidad 1: Ya existía elemento con ese nombre de emisora" 
                                + "\n-> Posibilidad 2: Problema con la tabla de la BD";
                    * /
                    };
                    var objectStore = transaction.objectStore("table_users");
                    objectStore.add({codigo_user: codigo_user, nombre_user: nombre_user, email_user: email_user, pass1_user : pass1_user, pass2_user: pass2_user});
                    poner_en_blanco();
                }
            }*/


        //**** **** **** **** Other Part **** **** **** ****
        //INDEX -> SHOW COMMENTS

            $("#section_comments").on("load", function(){
                show_content_bd_comentarios();
            });

            /*document.getElementById("id_btn_comments").addEventListener("click",function(){
            //$("section_comments").on("load",function(){
                //back_path_comment_index();
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_index/section_index");},0);
                    });
                }
                else{
                    var cargando = navigator.mozL10n.get("id_cargando");
                    Tako.Notification.loading(cargando, 2, function(){
                    });
                    show_content_bd_comentarios(); 
                }
            });*/
            
            
            //Esta función se llamará al pinchar en el botón de la interfaz inicial y se mostrará en la section correspondiente
            function show_content_bd_comentarios(){
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var idioma = idioma_navegador();
                var params = "posicion_lat="+pos_latitud+"&posicion_long="+pos_longitud+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_comentarios.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_comentarios").innerHTML = xmlhttp.responseText;
                        document.getElementById("txtBD_logged_comentarios").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            //Esta función se llamará cuando se haga scroll en la section correspondiente
            //Este método sólo lo vamos a definir una vez, de momento solo he conseguido hacerla una vez para que funcione
            //Así que carga en los dos sections ya que se llaman igual
            
            //**IGB FALLO AL TRADUCIR ESAS VARIABLES DE LOS ARCHIVOS DE IDIOMAS**
            //IMPOSIBLE USAR LAS FUNCIONES NI EL CONTENIDO DE LAS FUNCIONES DIRECTAMENTE
            //EN LAS VARIABLES. L10nError : Context not ready
            
            //Si quitamos estas, sales las que están por defecto en inglés.
            var variable_comments_pull_label = "Arrastrar";
            var variable_comments_release_label = "Soltar";
            var variable_comments_refresh_label = "Cargando...";

            //var variable_comments_pull_label = imprimir_mensaje_comments_pull_label();
            //var variable_comments_release_label = imprimir_mensaje_comments_release_label();
            //var variable_comments_refresh_label = imprimir_mensaje_comments_refresh_label();

            //Solución más trapera pero eficaz ya que falla L10N
            var idioma = idioma_navegador();
            var variable_comments_pull_label = "";
            var variable_comments_release_label = "";
            var variable_comments_refresh_label = "";

            if (idioma == "es"){
                variable_comments_pull_label = "Arrastra para actualizar";
                variable_comments_release_label = "Suelta para actualizar";
                variable_comments_refresh_label = "Cargando...";
            }
            else{
                if (idioma == "eu"){
                    variable_comments_pull_label = "Tiratu berritzeko";
                    variable_comments_release_label = "Askatu berritzeko";
                    variable_comments_refresh_label = "Lanean...";
                }
                else{
                    if (idioma == "fr"){
                        variable_comments_pull_label = "Faites glisser à jour";
                        variable_comments_release_label = "Relâchez à jour";
                        variable_comments_refresh_label = "Chargement...";
                    }
                    else{
                        if (idioma == "en-US"){
                            variable_comments_pull_label = "Pull to refresh";
                            variable_comments_release_label = "Release to refresh";
                            variable_comments_refresh_label = "Loading...";
                        }
                        else{
                            variable_comments_pull_label = "Pull to refresh";
                            variable_comments_release_label = "Release to refresh";
                            variable_comments_refresh_label = "Loading...";
                        }
                    }
                }
            }

            var options_puller = 
            {
                //Si quitamos estas, sales las que están por defecto en inglés.
                pullLabel: variable_comments_pull_label,
                releaseLabel: variable_comments_release_label,
                refreshLabel: variable_comments_refresh_label,
                onRefresh:function(){
                    setTimeout(function(){
                        if (localStorage.getItem('codigo_usuario')>0){
                            $("#txtBD_logged_comentarios").prepend(function(){ 
                                show_content_bd_comentarios();
                            });
                        }
                        else{
                            $("#txtBD_comentarios").prepend(function(){ 
                                show_content_bd_comentarios();
                            });
                        }
                        puller.hide();
                    }, 2000);
                }
            };
            //window.puller = Tako.Pull_Refresh("section_comments", options_puller);  
            //window.puller = Tako.Pull_Refresh("section_logged_comments", options_puller);
            //**IGB
            //Esto lo dejamos así, pero no funciona 100%. 
            //Si estamos loggeados, en ver comentarios el scroll funciona de maravilla todas las veces, hasta que nos desloggeamos,
            // abrimos ver comentarios siendo notlogged y el scroll se queda pillado.
            //Si estamos notlogged, no va. Y todo es por el orden que hemos puesto los window.puller de arriba. Se pelean entre si.

            //Se me ocurre dejar en logged como está, y en el inicio (notlogged) cambiar la manera que se muestran los comentarios
            //para hacerlos más atractivo. Lo dejo como una mejora futura.
            

        //**** **** **** **** Other Part **** **** **** ****
        //NOTLOGGED -> LISTADO INICIAL
            $("#section_notlogged_radio_ui").on("load", function(){
                /*
                var online = Tako.Connection.isOnline();
                if (!online){
                    document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML =  navigator.mozL10n.get("id_desconectado_titulo");
                    document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = --  + " Mhz";
                }
                else{
                */
                    poner_datos_ultima_emision_notlogged();
                    show_content_bd_radio_ui_notlogged_json(localStorage.getItem("last_codigo_emisora"));
        
                    if (localStorage.getItem('info_ppal_notlogged_visto') != "true"){
                        var variable_notlogged_info_ppal_titulo = navigator.mozL10n.get("id_notlogged_info_ppal_titulo");
                        var variable_notlogged_info_ppal_texto = navigator.mozL10n.get("id_notlogged_info_ppal_texto");
                        Tako.Notification.custom(variable_notlogged_info_ppal_titulo, variable_notlogged_info_ppal_texto, true,"",null,function(){
                            localStorage.setItem('info_ppal_notlogged_visto',"true");
                        });
                    }
                //}
            });
            
            function poner_datos_ultima_emision_notlogged(){
                if (localStorage.getItem('last_codigo_emisora')){
                    document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML = localStorage.getItem('last_nombre_emisora');
                    document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = localStorage.getItem('last_frecuencia_emision')  + " Mhz";
                    
                    //seleccionar_emision(localStorage.getItem('last_codigo_emision'),localStorage.getItem('last_frecuencia_emision'),localStorage.getItem('last_codigo_emisora'),localStorage.getItem('last_nombre_emisora'));
                }
                else{
                    //La primerisima vez que arranca la app
                    inicializar_valores_frecuencia_nombre_emisora_notlogged();
                }
            }

            function inicializar_valores_frecuencia_nombre_emisora_notlogged(){
                var primerisima_vez_usa_app_freq = "00.0";
                document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML = "----";
                document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = primerisima_vez_usa_app_freq  + " Mhz";
                
                //Colorear boton play/pause --> notlogged
                myRadioFM.disable();
                document.getElementById('btn_notlogged_btn_pause').classList.remove('orange');
                document.getElementById('btn_notlogged_btn_pause').classList.add('blue');
                document.getElementById('btn_notlogged_btn_play').classList.remove('orange');
                document.getElementById('btn_notlogged_btn_play').classList.add('blue');
                document.getElementById('btn_notlogged_btn_play').classList.remove('animated');
            }

            document.getElementById("btn_notlogged_radio_ui_reload").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var recargando = navigator.mozL10n.get("id_recargando");
                    Tako.Notification.loading(recargando, 1, function(){
                        geoPos();
                        show_content_bd_radio_ui_notlogged_json(localStorage.getItem("last_codigo_emisora"));
                    }); 
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });


            /* //Añadir las emisoras cercanas que hay en la bd_server a la bd_local (IDDB)
                function obtener_emisoras_cercanas_local(){
                var emisora_nombre = $("#ddl_emisoras_nombres option:selected").text();
                var emisora_frecuencia = $("#emisoras_frecuencia").val();
                var emisora_latitud = localStorage.getItem('mylatit');
                var emisora_longitud = localStorage.getItem('mylongit');

                if (emisora_nombre=="" || emisora_frecuencia == ""){
                    console.log("Algún campo está vacio");
                    //imprimirTexto("Algún campo está vacio");
                }
                else{
                    var transaction = db.transaction(["table_radios"],"readwrite");
                    transaction.oncomplete = function(event) {
                        console.log("Emisora añadida."+
                                    "\nNombre: "+ emisora_nombre +
                                    "\nFrecuencia: "+ emisora_frecuencia +
                                    "\nLatitud: "+ emisora_latitud +
                                    "\nLongitud: "+ emisora_longitud );
                    };
                    transaction.onerror = function(event) {
                        console.log("Elemento NO añadido, error" 
                                + "\n-> Posibilidad 1: Ya existía elemento igual" 
                                + "\n-> Posibilidad 2: Problema con la tabla de la BD");
                    };
                    var objectStore = transaction.objectStore("table_radios");
                    objectStore.add({emisora_nombre: emisora_nombre, emisora_frecuencia: emisora_frecuencia,
                                    emisora_latitud: emisora_latitud, emisora_longitud: emisora_longitud});
                    poner_en_blanco();
                }
            }
            */

            function show_content_bd_radio_ui_notlogged_json(emisora_act){
                $("#txtBD_radio_ui_notlogged_json").children("div").remove();

                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = "normal_prec";
                var url = server_path + "get_listado_ppal_json_post.php";
                var array_data = {"posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};
                
                var max_cercano_lat = 0; var max_cercano_long = 0; var cercano_lat = 0; var cercano_long = 0;
                var mejor_emision = 0; var mejor_frecuencia = 0; var nueva_linea = ""; var emisora_por_vuelta = 0;
                var emisora_anterior = null;

                $.post(url, array_data, function(emisoras) {
                    $.each(emisoras, function(i,emisoras){
                        each_emisora_codigo = emisoras.cod_emisora_json;
                        if ((emisora_anterior != each_emisora_codigo) || (emisora_anterior == 0)){ 
                            emisora_anterior = each_emisora_codigo;

                            if (emisora_anterior == emisora_act){
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json +
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            else{
                               nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json +
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }

                            $('#txtBD_radio_ui_notlogged_json').append(nueva_linea);
                        
                            //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                            var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                            var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                            var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                            if ((emisoras.cod_emisora_json == ultima_emisora_pulsada)&&(emisoras.cod_emision_json == ultima_emision_pulsada)){
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                });
                            }
                            else{
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(emisoras.cod_emision_json, emisoras.freq_emision_json, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                });
                            }
                        }
                    });

                    if (emisora_anterior == null){
                        var listado_ppal_notlogged_vacio = navigator.mozL10n.get("id_listado_ppal_notlogged_vacio");
                        nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                "<div class=\"info_vista_secund\">" + listado_ppal_notlogged_vacio +"</div>"+"</div>";
                                //No hay emisoras registradas en esta posición
                        $('#txtBD_radio_ui_notlogged_json').append(nueva_linea);
                        //console.log("a");
                        inicializar_valores_frecuencia_nombre_emisora_notlogged();
                    }
                },'json');

                /*$.getJSON(url, array_data, function(emisoras) {
                    $.each(emisoras, function(i,emisoras){
                        each_emisora_codigo = emisoras.cod_emisora_json;
                        if ((emisora_anterior != each_emisora_codigo) || (emisora_anterior == 0)){ 
                            emisora_anterior = each_emisora_codigo;
                    
                            if (emisora_anterior == emisora_act){
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json +
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            else{
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json +
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            $('#txtBD_radio_ui_notlogged_json').append(nueva_linea);

                            //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                            var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                            var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                            var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                            //if (emisoras.cod_emisora_json == ultima_emisora_pulsada){
                            if ((emisoras.cod_emisora_json == ultima_emisora_pulsada)&&(emisoras.cod_emision_json == ultima_emision_pulsada)){
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                });
                            }
                            else{
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(emisoras.cod_emision_json, emisoras.freq_emision_json, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                });
                            }
                        }
                    });
                    if (emisora_anterior == null){
                        var listado_ppal_notlogged_vacio = navigator.mozL10n.get("id_listado_ppal_notlogged_vacio");
                        nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                "<div class=\"info_vista_secund\">" + listado_ppal_notlogged_vacio +"</div>"+"</div>";
                                //No hay emisoras registradas en esta posición
                        $('#txtBD_radio_ui_notlogged_json').append(nueva_linea);
                        console.log("a");
                        inicializar_valores_frecuencia_nombre_emisora_notlogged();
                    }
                });*/
            }


        //**** **** **** **** Other Part **** **** **** ****
        //NOTLOGGED -> Click in RDS button
            document.getElementById("btn_section_notlogged_rds").addEventListener("click",function() {
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_index/section_index");},0);
                    });
                }
                else{
                
                    if (localStorage.getItem('codigo_emision')){
                        //document.getElementById("txtBD_rds_notlogged").textContent = "";
                        //document.getElementById("txtBD_rds_notlogged").style.visibility = "hidden";
                        //document.getElementById("txtBD_rds_notlogged_json").style.visibility = "hidden";
                        show_content_bd_rds_notlogged_json(localStorage.getItem('last_codigo_emision'));

                        if (document.getElementById(localStorage.getItem('codigo_emision'))){
                            document.getElementById(localStorage.getItem('codigo_emision')).classList.add("cada_emisora_seleccionada_rds");
                        }
                        
                        //var cargando = navigator.mozL10n.get("id_cargando");
                        //Tako.Notification.loading(cargando, 2, function(){
                            //document.getElementById("txtBD_rds_notlogged_json").style.visibility = "visible";
                        //});
                    }
                    else{
                        var variable_rds_aviso_no_seleccion_texto = navigator.mozL10n.get("id_rds_aviso_no_seleccion_texto");
                        document.getElementById("txtBD_rds_notlogged").textContent = variable_rds_aviso_no_seleccion_texto;
                    }
                }
            });

            function show_content_bd_rds_notlogged(emision_act){
                //var respuesta = "";
                var cod_emisora = localStorage.getItem('codigo_emisora');
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = "normal_prec";
                var params = "emisora_cod="+cod_emisora+"&posicion_lat="+pos_latitud+"&posicion_long="+pos_longitud+"&prec="+precision;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_rds.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_rds_notlogged_json").innerHTML = xmlhttp.responseText;
                        //respuesta = JSON.stringify(xmlhttp.responseText);
                        //console.log(respuesta);
                    }
                }
                xmlhttp.send(params);
            }

            document.getElementById('id_btn_notlogged_rds_info').addEventListener('click', function(){
                var variable_rds_info_titulo = navigator.mozL10n.get("id_article_logged_rds_titulo2");
                var variable_rds_info_texto = navigator.mozL10n.get("id_article_logged_rds_text2");

                Tako.Notification.custom(variable_rds_info_titulo, variable_rds_info_texto);
            });

            function show_content_bd_rds_notlogged_json(emision_act){
                //Vaciar el contenido de ese elemento: #txtBD_radio_ui_logged_json
                //document.getElementById("txtBD_radio_ui_logged_json").value = "";
                $("#txtBD_rds_notlogged_json").children("div").remove();
                $("#txtBD_rds_notlogged_json").children("br").remove();

                var cod_emisora = localStorage.getItem('codigo_emisora');
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = "normal_prec";
                var url = server_path + "get_rds_json_post.php";
                var array_data_rds = {"emisora_cod": cod_emisora, "posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};

                $.post(url, array_data_rds, function(rds) {
                    $.each(rds, function(k, rds){
                        if (rds.cod_emision_json == emision_act){
                            if (rds.puntos_json[k].puntos_json <= "1.5"){
                                nueva_linea_rds = 
                                "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                        "<div class=\"info_vista_secund_negrita texto_rojo\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund texto_rojo\">" + rds.posicion_emision_json +
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                        "<span class=\"icon heart texto_rojo\"></span>" + " " +
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " +
                                        "<span class=\"icon attention texto_rojo\"></span>" + " " +
                                        //rds.puntos_json[k].puntos_json +
                                        "</div>"+
                                    "</a>"+
                                "</div>"+
                                "<br>";
                            }
                            else{
                                if ((rds.puntos_json[k].puntos_json >= "1.5")&&(rds.puntos_json[k].puntos_json < "2.5")) {
                                    nueva_linea_rds = 
                                    "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                        "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                            "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            //rds.puntos_json[k].puntos_json +
                                            "</div>"+
                                        "</a>"+
                                    "</div>"+
                                    "<br>";
                                }
                                else{
                                    if ((rds.puntos_json[k].puntos_json >= "2.5")&&(rds.puntos_json[k].puntos_json < "3.5")) {
                                        nueva_linea_rds = 
                                        "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                            "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + " " +
                                                "<span class=\"icon heart\"></span>" + " " + 
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                //rds.puntos_json[k].puntos_json +
                                                "</div>"+
                                            "</a>"+
                                        "</div>"+
                                        "<br>";
                                    }
                                    else{
                                        if ((rds.puntos_json[k].puntos_json >= "3.5")&&(rds.puntos_json[k].puntos_json < "4.5")) {
                                            nueva_linea_rds = 
                                            "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                    "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart-empty\"></span>" + " " + 
                                                    //rds.puntos_json[k].puntos_json +
                                                    "</div>"+
                                                "</a>"+
                                            "</div>"+
                                            "<br>";
                                        }
                                        else{
                                            if (rds.puntos_json[k].puntos_json >= "4.5") {
                                                nueva_linea_rds = 
                                                "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                        "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        //rds.puntos_json[k].puntos_json +
                                                        "</div>"+
                                                    "</a>"+
                                                "</div>"+
                                                "<br>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else{
                            if (rds.puntos_json[k].puntos_json <= "1.5"){
                                nueva_linea_rds = 
                                "<div class=\"cada_emisora align-center\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                        "<div class=\"info_vista_secund_negrita texto_rojo\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund texto_rojo\">" + rds.posicion_emision_json +
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                        "<span class=\"icon heart texto_rojo\"></span>" + " " +
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " +
                                        "<span class=\"icon attention texto_rojo\"></span>" + " " +
                                        //rds.puntos_json[k].puntos_json +
                                        "</div>"+
                                    "</a>"+
                                "</div>"+
                                "<br>";
                            }
                            else{
                                if ((rds.puntos_json[k].puntos_json >= "1.5")&&(rds.puntos_json[k].puntos_json < "2.5")) {
                                    nueva_linea_rds = 
                                    "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                        "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                            "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            //rds.puntos_json[k].puntos_json +
                                            "</div>"+
                                        "</a>"+
                                    "</div>"+
                                    "<br>";
                                }
                                else{
                                    if ((rds.puntos_json[k].puntos_json >= "2.5")&&(rds.puntos_json[k].puntos_json < "3.5")) {
                                        nueva_linea_rds = 
                                        "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                            "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + " " +
                                                "<span class=\"icon heart\"></span>" + " " + 
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                //rds.puntos_json[k].puntos_json +
                                                "</div>"+
                                            "</a>"+
                                        "</div>"+
                                        "<br>";
                                    }
                                    else{
                                        if ((rds.puntos_json[k].puntos_json >= "3.5")&&(rds.puntos_json[k].puntos_json < "4.5")) {
                                            nueva_linea_rds = 
                                            "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                    "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart-empty\"></span>" + " " + 
                                                    //rds.puntos_json[k].puntos_json +
                                                    "</div>"+
                                                "</a>"+
                                            "</div>"+
                                            "<br>";
                                        }
                                        else{
                                            if (rds.puntos_json[k].puntos_json >= "4.5") {
                                                nueva_linea_rds = 
                                                "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                        "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        //rds.puntos_json[k].puntos_json +
                                                        "</div>"+
                                                    "</a>"+
                                                "</div>"+
                                                "<br>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                                    
                        $('#txtBD_rds_notlogged_json').append(nueva_linea_rds);

                        document.getElementById("emision_rds_"+rds.cod_emision_json).addEventListener("click",function(){
                            seleccionar_rds(rds.cod_emision_json, rds.freq_emision_json, rds.cod_emisora_json, rds.nombre_emisora_json);
                            //alert(rds.freq_emision_json);
                        });
                    });
                },'json');
            }

            //************************************End***************************************************

     
        //*************************************End***********************************************
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> LISTADO INICIAL && ULTIMA EMISION
            $("#section_logged_radio_ui").on("load", function(){
                /*
                if (localStorage.getItem('dentro_escaneo') != "true"){
                    poner_datos_ultima_emision_logged();
                }
                localStorage.setItem('dentro_escaneo','false');
                */

                //show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));

                //Para mostrar el mensaje de información la primera vez que usamos la app
                if (localStorage.getItem('info_ppal_logged_visto') != "true"){
                    var variable_logged_info_ppal_titulo = navigator.mozL10n.get("id_logged_info_ppal_titulo");
                    var variable_logged_info_ppal_texto = navigator.mozL10n.get("id_logged_info_ppal_texto");
                    Tako.Notification.custom(variable_logged_info_ppal_titulo,variable_logged_info_ppal_texto,true,"",null,function(){
                        localStorage.setItem('info_ppal_logged_visto',"true");
                    });
                }

                //Para que cuando cargue el listado, si la ultima emisora que la teniamos como favorita, la estrella se activa 
                ver_si_es_favoritos();
            });
        
            function poner_datos_ultima_emision_logged(){
                if (localStorage.getItem('last_codigo_emisora')){
                    document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = localStorage.getItem('last_nombre_emisora');
                    document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = localStorage.getItem('last_frecuencia_emision') + " Mhz";
                }
                else{
                    //La primerisima vez que arranca la app
                    inicializar_valores_frecuencia_nombre_emisora_logged();
                }
            }

            function inicializar_valores_frecuencia_nombre_emisora_logged(){
                var primerisima_vez_usa_app_freq = "00.0";
                document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = "----";
                document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = primerisima_vez_usa_app_freq + " Mhz";

                myRadioFM.disable();
                //Colorear boton play/pause --> logged
                document.getElementById('btn_logged_btn_pause').classList.remove('orange');
                document.getElementById('btn_logged_btn_pause').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('orange');
                document.getElementById('btn_logged_btn_play').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('animated');    
            }

            document.getElementById("btn_logged_radio_ui_reload").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var recargando = navigator.mozL10n.get("id_recargando");
                    Tako.Notification.loading(recargando, 1, function(){
                        geoPos();
                        show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                    });
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });

            function show_content_bd_radio_ui_logged_json(emisora_act){
                //Vaciar el contenido de ese elemento: #txtBD_radio_ui_logged_json
                $("#txtBD_radio_ui_logged_json").children("div").remove();

                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = "normal_prec";
                var url = server_path + "get_listado_ppal_json_post.php"; //POST
                //var url = server_path + "get_listado_ppal_json.php";        //GET
                var array_data = {"posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};

                var max_cercano_lat = 0; var max_cercano_long = 0; var cercano_lat = 0; var cercano_long = 0; var mejor_emision = 0; 
                var mejor_frecuencia = 0; var nueva_linea = ""; var emisora_por_vuelta = 0; 

                var emisora_anterior = 0;
                var emisora_anterior_nombre = 0;
                var emision_anterior = 0;
                var frecuencia_anterior = 0;
                var puntuacion_anterior = 0;

                //var codigo_emisora_anterior = 0;
                var puntuacion_emision_anterior = 0;
                //var mayor ="";

                //VOY A PROBAR CON POST //FUNCIONA COMO HASTA AHORA
                $.post(url, array_data, function(emisoras) {
                    $.each(emisoras, function(i,emisoras){
                        //console.log(emisoras);

                        if ((emisora_anterior != emisoras.cod_emisora_json) || (emisora_anterior == 0)){ 
                            emisora_anterior = emisoras.cod_emisora_json;
                            
                            if (emisora_anterior == emisora_act){
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            else{
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                            document.getElementById("emisora_"+emisoras.cod_emisora_json).addEventListener("click",function(){
                                seleccionar_emision_icono(emisoras.cod_emisora_json);
                            });

                            //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                            var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                            var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                            var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                            if ((emisoras.cod_emisora_json == ultima_emisora_pulsada)&&(emisoras.cod_emision_json == ultima_emision_pulsada)){
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                    ver_si_es_favoritos();
                                });
                            }
                            else{
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(emisoras.cod_emision_json, emisoras.freq_emision_json, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                    ver_si_es_favoritos();
                                });
                            }
                        }
                    });

                    if (emisora_anterior == 0){
                        var listado_ppal_vacio = navigator.mozL10n.get("id_listado_ppal_logged_vacio");
                        nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                "<div class=\"info_vista_secund\">" + listado_ppal_vacio +"</div>"+"</div>";
                                //No hay emisoras registradas en esta posición
                        $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                        inicializar_valores_frecuencia_nombre_emisora_logged();
                    }
                },'json');
                
                /*$.ajax({
                    async: true,
                    type: "POST",
                    url: url,
                    data: array_data,
                    success: function(emisoras) {
                        //emisoras=JSON.parse(emisoras);
                        $.each(emisoras, function(i,emisoras){
                            //console.log(emisoras);

                            if ((emisora_anterior != emisoras.cod_emisora_json) || (emisora_anterior == 0)){ 
                                emisora_anterior = emisoras.cod_emisora_json;
                                
                                if (emisora_anterior == emisora_act){
                                    nueva_linea = 
                                        "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                        "<div class=\"info_vista_secund\">" +
                                        "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                            "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                        "</a>"+
                                        "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                            emisoras.nombre_emisora_json + 
                                        "</a>"+
                                        "</div>" +
                                        "</div>";
                                }
                                else{
                                    nueva_linea = 
                                        "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                        "<div class=\"info_vista_secund\">" +
                                        "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                            "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                        "</a>"+
                                        "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                            emisoras.nombre_emisora_json + 
                                        "</a>"+
                                        "</div>" +
                                        "</div>";
                                }
                                $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                                document.getElementById("emisora_"+emisoras.cod_emisora_json).addEventListener("click",function(){
                                    seleccionar_emision_icono(emisoras.cod_emisora_json);
                                });

                                //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                                var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                                var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                                var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                                if ((emisoras.cod_emisora_json == ultima_emisora_pulsada)&&(emisoras.cod_emision_json == ultima_emision_pulsada)){
                                    document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                        seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisoras.cod_emisora_json,
                                            emisoras.nombre_emisora_json);
                                        ver_si_es_favoritos();
                                    });
                                }
                                else{
                                    document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                        seleccionar_emision(emisoras.cod_emision_json, emisoras.freq_emision_json, emisoras.cod_emisora_json,
                                            emisoras.nombre_emisora_json);
                                        ver_si_es_favoritos();
                                    });
                                }
                            }
                            alert(i);
                        });
                        if (emisora_anterior == 0){
                            var listado_ppal_vacio = navigator.mozL10n.get("id_listado_ppal_logged_vacio");
                            nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                    "<div class=\"info_vista_secund\">" + listado_ppal_vacio +"</div>"+"</div>";
                                    //No hay emisoras registradas en esta posición
                            $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                            inicializar_valores_frecuencia_nombre_emisora_logged();
                        }
                    }
                },'json');*/
                

                //FUNCIONA COMO HASTA AHORA
                /*
                $.getJSON(url, array_data, function(emisoras) {
                    $.each(emisoras, function(i,emisoras){
                        //console.log(emisoras);

                        if ((emisora_anterior != emisoras.cod_emisora_json) || (emisora_anterior == 0)){ 
                            emisora_anterior = emisoras.cod_emisora_json;
                            
                            if (emisora_anterior == emisora_act){
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            else{
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                            document.getElementById("emisora_"+emisoras.cod_emisora_json).addEventListener("click",function(){
                                seleccionar_emision_icono(emisoras.cod_emisora_json);
                            });

                            //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                            var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                            var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                            var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                            if ((emisoras.cod_emisora_json == ultima_emisora_pulsada)&&(emisoras.cod_emision_json == ultima_emision_pulsada)){
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                    ver_si_es_favoritos();
                                });
                            }
                            else{
                                document.getElementById("emision_"+emisoras.cod_emision_json).addEventListener("click",function(){
                                    seleccionar_emision(emisoras.cod_emision_json, emisoras.freq_emision_json, emisoras.cod_emisora_json,
                                        emisoras.nombre_emisora_json);
                                    ver_si_es_favoritos();
                                });
                            }
                        }
                    });
                    if (emisora_anterior == 0){
                        var listado_ppal_vacio = navigator.mozL10n.get("id_listado_ppal_logged_vacio");
                        nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                "<div class=\"info_vista_secund\">" + listado_ppal_vacio +"</div>"+"</div>";
                                //No hay emisoras registradas en esta posición
                        $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                        inicializar_valores_frecuencia_nombre_emisora_logged();
                    }
                });
                */

                /* ESTO FALLA A LA HORA DE SELECCIONAR LOS ITEMS, EL LISTADO LO MUESTRA SEGUN SUS VALORACIONES, PERFECTO
                $.getJSON(url, array_data, function(emisoras) {
                    $.each(emisoras, function(i,emisoras){
                        //mejor_puntuacion
                        
                        console.log(emisora_anterior);
                        console.log(emisora_anterior_nombre);
                        console.log(emision_anterior);
                        console.log(frecuencia_anterior);
                        console.log(puntuacion_anterior);

                        console.log(emisoras);

                        if (emisora_anterior != emisoras.cod_emisora_json){
                            if (emisora_anterior != 0){ 
                                $('#txtBD_radio_ui_logged_json').append(nueva_linea);   
                                document.getElementById("emisora_"+emisora_anterior).addEventListener("click",function(){
                                    seleccionar_emision_icono(emisora_anterior);
                                });

                                //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                                var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                                var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                                var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                                if (emisora_anterior == ultima_emisora_pulsada){
                                    document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                        seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisora_anterior, emisora_anterior_nombre);
                                        ver_si_es_favoritos();
                                    });
                                }
                                else{
                                    document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                        seleccionar_emision(emision_anterior, frecuencia_anterior, emisora_anterior, emisora_anterior_nombre);
                                        ver_si_es_favoritos();
                                    });
                                }
                            }

                            if (emisoras.cod_emisora_json == emisora_act){
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                    //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            else{
                                nueva_linea = 
                                    "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                    "<div class=\"info_vista_secund\">" +
                                    "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                        "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                    "</a>"+
                                    "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                        emisoras.nombre_emisora_json + 
                                    "</a>"+
                                    "</div>" +
                                    "</div>";
                            }
                            emisora_anterior = emisoras.cod_emisora_json;
                            emisora_anterior_nombre = emisoras.nombre_emisora_json;
                            emision_anterior = emisoras.cod_emision_json;
                            frecuencia_anterior = emisoras.freq_emision_json;
                            puntuacion_anterior = emisoras.puntos_json[i].puntos_json;
                        }
                        else{
                            //if (emisora_anterior == emisoras.cod_emisora_json) {
                                console.log(emisoras.puntos_json[i].puntos_json);
                                console.log("misma emisora");
                                if (puntuacion_anterior < emisoras.puntos_json[i].puntos_json){
                                    console.log("la nueva es mayor");
                                    puntuacion_anterior = emisoras.puntos_json[i].puntos_json;
                                    console.log(i);
                                    if (emisoras.cod_emisora_json == emisora_act){
                                        nueva_linea = 
                                            "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                            //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                            "<div class=\"info_vista_secund\">" +
                                            "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                                "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                            "</a>"+
                                            "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                                emisoras.nombre_emisora_json + 
                                            "</a>"+
                                            "</div>" +
                                            "</div>";
                                    }
                                    else{
                                        nueva_linea = 
                                            "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                            //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                            "<div class=\"info_vista_secund\">" +
                                            "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                                "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                            "</a>"+
                                            "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                                emisoras.nombre_emisora_json + 
                                            "</a>"+
                                            "</div>" +
                                            "</div>";
                                    }
                                    emisora_anterior = emisoras.cod_emisora_json;
                                    emisora_anterior_nombre = emisoras.nombre_emisora_json;
                                    emision_anterior = emisoras.cod_emision_json;
                                    frecuencia_anterior = emisoras.freq_emision_json;
                                    puntuacion_anterior = emisoras.puntos_json[i].puntos_json;
                                }
                                else{
                                    if (puntuacion_anterior == emisoras.puntos_json[i].puntos_json){
                                        console.log("la nueva es igual");
                                    }
                                    else{
                                        console.log("la nueva es menor");
                                    }
                                }
                            //}
                            /*else{
                                //no es la misma emisora, es diferente
                                $('#txtBD_radio_ui_logged_json').append(nueva_linea);   
                                document.getElementById("emisora_"+emisora_anterior).addEventListener("click",function(){
                                    seleccionar_emision_icono(emisora_anterior);
                                });

                                //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                                var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                                var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                                var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                                if (emisora_anterior == ultima_emisora_pulsada){
                                    document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                        seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisora_anterior, emisora_anterior_nombre);
                                        ver_si_es_favoritos();
                                    });
                                }
                                else{
                                    document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                        seleccionar_emision(emision_anterior, frecuencia_anterior, emisora_anterior, emisora_anterior_nombre);
                                        ver_si_es_favoritos();
                                    });
                                }
                                if (emisoras.cod_emisora_json == emisora_act){
                                    nueva_linea = 
                                        "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisoras.cod_emisora_json + ">"+
                                        //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                        "<div class=\"info_vista_secund\">" +
                                        "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                            "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                        "</a>"+
                                        "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                            emisoras.nombre_emisora_json + 
                                        "</a>"+
                                        "</div>" +
                                        "</div>";
                                }
                                else{
                                    nueva_linea = 
                                        "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                        //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                        "<div class=\"info_vista_secund\">" +
                                        "<a id=\"emisora_"+ emisoras.cod_emisora_json +"\">"+
                                            "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                        "</a>"+
                                        "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emisoras.cod_emision_json +"\">"+
                                            emisoras.nombre_emisora_json + 
                                        "</a>"+
                                        "</div>" +
                                        "</div>";
                                }
                                emisora_anterior = emisoras.cod_emisora_json;
                                emisora_anterior_nombre = emisoras.nombre_emisora_json;
                                emision_anterior = emisoras.cod_emision_json;
                                frecuencia_anterior = emisoras.freq_emision_json;
                                puntuacion_anterior = emisoras.puntos_json[i].puntos_json;
                            }* /
                        }
                    });
                    if (emisora_anterior == 0){
                        var listado_ppal_vacio = navigator.mozL10n.get("id_listado_ppal_logged_vacio");
                        nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\">"+
                                "<div class=\"info_vista_secund\">" + listado_ppal_vacio +"</div>"+"</div>";
                                //No hay emisoras registradas en esta posición
                        $('#txtBD_radio_ui_logged_json').append(nueva_linea);
                        inicializar_valores_frecuencia_nombre_emisora_logged();
                    }
                    else{
                        if (emisora_anterior == emisora_act){
                            nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom cada_emisora_seleccionada\" id="+ emisora_anterior + ">"+
                                //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                "<div class=\"info_vista_secund\">" +
                                "<a id=\"emisora_"+ emisora_anterior +"\">"+
                                    "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                "</a>"+
                                "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emision_anterior +"\">"+
                                    emisora_anterior_nombre + 
                                "</a>"+
                                "</div>" +
                                "</div>";
                        }
                        else{
                            nueva_linea = 
                                "<div class=\"cada_emisora align-center sin_margin_bottom\" id="+ emisora_anterior + ">"+
                                //"<div class=\"cada_emisora sin_margin_bottom\" id="+ emisoras.cod_emisora_json + ">"+
                                "<div class=\"info_vista_secund\">" +
                                "<a id=\"emisora_"+ emisora_anterior +"\">"+
                                    "<img class=\"icono_ppal_alineado\" src=\"./stylesheets/mine/icono_pua/icono_blanco_pua.png\" alt=\"\" />"+
                                "</a>"+
                                "<a class=\"texto_ppal_alineado\" id=\"emision_"+ emision_anterior +"\">"+
                                    emisora_anterior_nombre + 
                                "</a>"+
                                "</div>" +
                                "</div>";
                        }
                        $('#txtBD_radio_ui_logged_json').append(nueva_linea);   
                        document.getElementById("emisora_"+emisora_anterior).addEventListener("click",function(){
                            seleccionar_emision_icono(emisora_anterior);
                        });

                        //Este código es para mantener la frecuencia y emisión que se pulsa en el listado de RDS en el listado ppal
                        var ultima_emisora_pulsada = localStorage.getItem("last_codigo_emisora");
                        var ultima_emision_pulsada = localStorage.getItem("last_codigo_emision");
                        var ultima_frecuncia_pulsada = localStorage.getItem("last_frecuencia_emision");
                        if (emisora_anterior == ultima_emisora_pulsada){
                            document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                seleccionar_emision(ultima_emision_pulsada, ultima_frecuncia_pulsada, emisora_anterior, emisora_anterior_nombre);
                                ver_si_es_favoritos();
                            });
                        }
                        else{
                            document.getElementById("emision_"+emision_anterior).addEventListener("click",function(){
                                seleccionar_emision(emision_anterior, frecuencia_anterior, emisora_anterior, emisora_anterior_nombre);
                                ver_si_es_favoritos();
                            });
                        }
                    }
                });*/
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> INFO EMISORA
            $("#section_logged_info_emisora").on("load", function(){
                //cargar_info_emisora_logged();
                cargar_info_emisora_logged_nombre();
                cargar_info_emisora_logged_alcance();
                cargar_info_emisora_logged_tipo();
                cargar_info_emisora_logged_fecha_agrego();
                cargar_info_emisora_logged_sus_emisiones();
                
                //Solo para pc y android, para fxos no carga, asique lo quitamos de momento
                //cargar_info_emisora_logged_imagen_random();
            });

            //Esta metodo lo vamos a dejar comentado, ya que para que funcionara el multilenguaje, hemos dividio esta 
            //llamada en varias llamadas que devuelven solo un valor, para no imprimir las cabeceras desde php
            /*function cargar_info_emisora_logged(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.onload = function(){
                    console.log("onload");
                    document.getElementById("id_info_emisora_nombre").textContent = navigator.mozL10n.get("id_info_emisora_nombre");
                }
                xmlhttp.onerror = function(){
                    console.log("onerror");
                }
                xmlhttp.onabort = function(){
                    console.log("onabort");
                }
                xmlhttp.send(params);   
            }*/

            function cargar_info_emisora_logged_nombre(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_nombre.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_nombre").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            function cargar_info_emisora_logged_alcance(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_alcance.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_alcance").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            function cargar_info_emisora_logged_tipo(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_tipo.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_tipo").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            function cargar_info_emisora_logged_fecha_agrego(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_fecha_agrego.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_fecha_agrego").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            function cargar_info_emisora_logged_sus_emisiones(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_sus_emisiones.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_sus_emisiones").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            function cargar_info_emisora_logged_imagen_random(){
                var idioma = idioma_navegador();
                var codigo_emisora_selec = localStorage.getItem('codigo_emisora_seleccionada');
                var params = "cod_emisora_sel="+codigo_emisora_selec+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_info_emisora_logged_imagen_random.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_info_emisora_logged_imagen_random").innerHTML = xmlhttp.responseText;
                    }
                };
                xmlhttp.onload = function(){ };
                xmlhttp.onerror = function(){ };
                xmlhttp.onabort = function(){ };
                xmlhttp.send(params);   
            }

            /*Lo debería cargar via JS, pero por no liarme, cargo la foto tmb via php server
            var num_random = numero_aleatorio_entre(1,6);
            console.log(num_random);*/
            
            document.getElementById('id_logged_info_emisora').addEventListener('click', function(){
                var variable_info_emisora_info_titulo = navigator.mozL10n.get("id_article_logged_info_emisora_aviso_titulo");
                var variable_info_emisora_info_texto = navigator.mozL10n.get("id_article_logged_info_emisora_aviso_text");
                Tako.Notification.custom(variable_info_emisora_info_titulo, variable_info_emisora_info_texto);
            });

        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> Click in PUNTUACIONES button
            $("#btn_logged_btn_puntuaciones").bind("tap", function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
                else{
                    if (localStorage.getItem('codigo_emision') == null){
                        var variable_puntuaciones_aviso_no_seleccion_titulo = navigator.mozL10n.get("id_puntuaciones_aviso_no_seleccion_titulo");
                        var variable_puntuaciones_aviso_no_seleccion_texto = navigator.mozL10n.get("id_puntuaciones_aviso_no_seleccion_texto");
                        Tako.Notification.error("deny", variable_puntuaciones_aviso_no_seleccion_titulo, variable_puntuaciones_aviso_no_seleccion_texto, null, function(){ });
                    }else{
                        var text1 = navigator.mozL10n.get("id_puntuaciones_text1");
                        var text2 = navigator.mozL10n.get("id_puntuaciones_text2");
                        var text2_2 = '<input type="range" min="1" max="5" step="1" id="id_slide_puntuaciones">'+
                            '<strong><output for="id_slide_puntuaciones" id="txtBD_puntuaciones_notificacion_valor" class="texto_destacado"></output></strong>';
                        var text3 = navigator.mozL10n.get("id_puntuaciones_text3");
                        var text4 = navigator.mozL10n.get("id_puntuaciones_text4");

                        var callback_notify = function(result){
                            if(result){
                                nuevo_aniadir_puntuacion(document.getElementById("id_slide_puntuaciones").value);
                            }
                            else{
                                //console.log("Ahora no");
                            }
                        };

                        Tako.Notification.confirm("signal",text1, text2 + text2_2, text3, text4, callback_notify);
                        
                        if (document.getElementById("id_slide_puntuaciones")){
                            $("#id_slide_puntuaciones").change(function(event) {
                                $("#id_slide_puntuaciones").append(valorSliderPuntuacion(document.getElementById("id_slide_puntuaciones").value));
                            });
                        }
                    }
                }
            });
                


            function nuevo_aniadir_puntuacion(puntuac){ //de una emisión
                //Tendremos en LocalStorage los datos del usuario loggeado (nos interesa cod_usuario)
                var cod_usuario = localStorage.getItem('codigo_usuario');

                //Tendremos en LocalStorage los datos de la emision que está seleccionada y estemos escuchando. De esta emisión, sacaremos el cod_emision.
                var cod_emision = localStorage.getItem('codigo_emision');

                var puntuacion_latitud = localStorage.getItem('mylatit');
                var puntuacion_longitud = localStorage.getItem('mylongit');
                var puntos = puntuac;

                var params = "usuario_cod="+cod_usuario+"&emision_cod="+cod_emision+"&puntu_lat="+puntuacion_latitud+"&puntu_long="+puntuacion_longitud+"&puntuacion="+puntos;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_puntuacion.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_puntuacion").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> Click in FAVORITOS button
            //Para controlar si es favorita una emisora de un usuario   
            $("#btn_logged_btn_favoritos").bind("tap", function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
                else{
                    if (localStorage.getItem('codigo_emision') == null){
                        var variable_favoritos_aviso_no_seleccion_titulo = navigator.mozL10n.get("id_favoritos_aviso_no_seleccion_titulo");
                        var variable_favoritos_aviso_no_seleccion_texto = navigator.mozL10n.get("id_favoritos_aviso_no_seleccion_texto");
                        Tako.Notification.error("deny", variable_favoritos_aviso_no_seleccion_titulo, variable_favoritos_aviso_no_seleccion_texto, null, function(){ });
                    }else{
                        var  miDiv = document.getElementById('btn_logged_btn_favoritos');
                        if (miDiv.classList.contains('star-empty')){
                            miDiv.classList.remove('star-empty'); 
                            miDiv.classList.add('star');
                            aniadir_favorito();
                        }
                        else{
                            if (miDiv.classList.contains('star')){
                                miDiv.classList.remove('star'); 
                                miDiv.classList.add('star-empty');
                                quitar_favorito(); 
                            }
                        }
                    }
                }
            });
            function aniadir_favorito(){ // emisora favorita
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emisora = localStorage.getItem('codigo_emisora');
                var params = "usuario_cod="+cod_usuario+"&emisora_cod="+cod_emisora;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_favorito.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_favorito").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function quitar_favorito(){ // emisora favorita
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emisora = localStorage.getItem('codigo_emisora');
                var params = "usuario_cod="+cod_usuario+"&emisora_cod="+cod_emisora;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "quitar_favorito.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_quitar_favorito").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function ver_si_es_favoritos(){
                //console.log("existeeee");
                var  miDiv = document.getElementById('btn_logged_btn_favoritos');
                var existe = "";
                buscar_favoritos(function(existe){
                    //console.log("a "+ existe +" a");
                    if (existe == "noesfavorito"){
                        miDiv.classList.remove('star'); 
                        miDiv.classList.add('star-empty');
                        //console.log("noesfavorito");
                    }
                    else{
                        if (existe == "yaesfavorito"){
                            miDiv.classList.remove('star-empty'); 
                            miDiv.classList.add('star');
                            //console.log("yaesfavorito");
                        }   
                        else{
                            //console.log("Erroreaa");
                        }
                    }
                });
            }

            function buscar_favoritos(callback){
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emisora = localStorage.getItem('codigo_emisora');
                var params = "usuario_cod="+cod_usuario+"&emisora_cod="+cod_emisora;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_favoritos.php";
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);   
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> ADD -> Click in Añadir Emisión button -> Open Logged_Aniadir_Emision
            //document.getElementById("id_article_logged_aniadir_emisora_btn_add").addEventListener("click",function() {
            document.getElementById("id_article_logged_aniadir_emision_btn_aniadir_emision").addEventListener("click",function() {
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
                else{
                    var frec_vacia = false;
                    var frec_fuera_intervalo = false;
                    var valor_emisoras_frecuencia = "";
                    var ddl_nombre_vacia = false;

                    var valor_ddl_nombre_emisora = "";
                    var valor_ddl_nombre_emisora_plus = "";
                    var text = "";

                    //Comprobacion listado nombres
                    /*
                        valor_ddl_nombre_emisora = $("#ddl_article_logged_aniaidir_emision_nombre option:selected");
                        if ((ningunDDLSeleccionado(valor_ddl_nombre_emisora))){
                            ddl_nombre_vacia = true;
                            text += imprimir_errores_ddl_emisoras_no_seleccionada();
                        }
                    */
                    
                    valor_ddl_nombre_emisora = document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex;
                    valor_ddl_nombre_emisora_plus = document.getElementById("ddl_article_logged_aniaidir_emision_nombre").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex].value;

                    //if ((valor_ddl_nombre_emisora == "0") && (valor_ddl_nombre_emisora_plus == "192")){ //este es el indice del elemento por defecto "----"
                    if (primerDDLSeleccionado_nombre_emisora(valor_ddl_nombre_emisora,valor_ddl_nombre_emisora_plus)){
                        ddl_nombre_vacia = true;
                        text += imprimir_errores_ddl_emisoras_no_seleccionada();
                    }
                    else{
                        valor_ddl_nombre_emisora = $("#ddl_article_logged_aniaidir_emision_nombre option:selected");
                    }


                    //Comprobacion frecuencia
                    valor_emisoras_frecuencia = $("#id_article_logged_aniadir_emision_frecuencia").val();
                    if (validarFreqRegExp(valor_emisoras_frecuencia)){
                        frec_vacia = true;
                        text += imprimir_errores_frecuencia_vacia();
                    }else{
                        if (validarFrecuenciaIntervalo(valor_emisoras_frecuencia)){
                            frec_fuera_intervalo = true;
                            text += imprimir_errores_frecuencia_fuera_intervalo();
                        }
                    }

                    if ((ddl_nombre_vacia) || (frec_vacia) || (frec_fuera_intervalo)){
                        var error_global = navigator.mozL10n.get("id_error");
                        Tako.Notification.error("deny", error_global, text, null, function(){
                        });                
                    }
                    else{
                        geoPos();
                        
                        //##NEW 2015-04-21##
                        //Comprobacion emision en db server
                        var existe = "";
                        comprobacion_aniadir_emision_logged_server(function(existe){
                            if (existe == "yahayunaemision"){
                                text += imprimir_errores_aniadir_emision_existente();
                                Tako.Notification.error("deny", "Error!!",text, null, function(){
                                });                
                            }
                            else{
                                var correcto_global = navigator.mozL10n.get("id_correcto");
                                var emision_aniadida_global = navigator.mozL10n.get("id_emision_aniadida");
                                Tako.Notification.success("ok", correcto_global, emision_aniadida_global, null, function(){
                                    nuevo_aniadir_emision_server();

                                    //###IGB 03-06-2015
                                    obtener_codigo_emision_aniadida();
                                    //var codigo_emision_aniadida = localStorage.getItem('zzz_emision_codigo_puntual');
                                    //console.log(codigo_emision_aniadida);
                                    //nuevo_aniadir_puntuacion_inicial(puntuacion_inicial_estandar,codigo_emision_aniadida);
                                    //###IGB

                                    nuevo_poner_en_blanco_aniadir_emision();
                                    //listar_aniadidos_emisiones_propios_usuario_perfil();
                                    show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                                    setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                                });
                            }
                        });
                    }
                }
            });

            //Comprobación que no se añadan registros que ya existen en el sistema
            function comprobacion_aniadir_emision_logged_server(callback){
                var emisora_cod = document.getElementById("ddl_article_logged_aniaidir_emision_nombre").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex].value;
                var emision_frecuencia = $("#id_article_logged_aniadir_emision_frecuencia").val();
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');
                var params = "emisora_cod="+emisora_cod+"&emision_freq="+emision_frecuencia+"&emision_lat="+emision_latitud+"&emision_long="+emision_longitud;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_emision_aniadir.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            function nuevo_aniadir_emision_server(){
                var emisora_cod = document.getElementById("ddl_article_logged_aniaidir_emision_nombre").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex].value;
                var emision_frecuencia = $("#id_article_logged_aniadir_emision_frecuencia").val();
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');
                var emision_posicion = localStorage.getItem('myposicion');
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var params = "emisora_cod="+emisora_cod+"&emision_freq="+emision_frecuencia+"&emision_lat="+emision_latitud+"&emision_long="+emision_longitud+"&emision_pos="+emision_posicion+"&cod_usuario="+cod_usuario;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emision.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emision").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function nuevo_poner_en_blanco_aniadir_emision(){
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emision_nombre"));
                document.getElementById("id_article_logged_aniadir_emision_frecuencia").value = "";
            }

            $("#section_logged_aniadir_emision").on("load", function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    //nada
                }
                else{
                    show_content_bd_emisiones_nombre_ddl();
                }
            });

            //EMISIONES_NOMBRE_DDL
            function show_content_bd_emisiones_nombre_ddl(){
                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisiones_ddl_nombre.php";
                xmlhttp.open("GET", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisiones_nombre").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send();
            }

            //Añadir emisora en local IDDB...lo dejamos apartado de momento##
            /*#EN LOCAL SE HARÍA ASÍ. QUIZÁ HAY QUE CAMBIAR LO DE EMISORA POR EMISION#
            function aniadir_emisora_local(){
                var emisora_nombre = $("#ddl_emisoras_nombres option:selected").text();
                var emisora_frecuencia = $("#emisoras_frecuencia").val();
                var emisora_latitud = localStorage.getItem('mylatit');
                var emisora_longitud = localStorage.getItem('mylongit');

                if (emisora_nombre=="" || emisora_frecuencia == ""){
                    console.log("Algún campo está vacio");
                    //imprimirTexto("Algún campo está vacio");
                }
                else{
                    var transaction = db.transaction(["table_radios"],"readwrite");
                    transaction.oncomplete = function(event) {
                        console.log("Emisora añadida."+
                                    "\nNombre: "+ emisora_nombre +
                                    "\nFrecuencia: "+ emisora_frecuencia +
                                    "\nLatitud: "+ emisora_latitud +
                                    "\nLongitud: "+ emisora_longitud );
                    };
                    transaction.onerror = function(event) {
                        console.log("Elemento NO añadido, error" 
                                + "\n-> Posibilidad 1: Ya existía elemento igual" 
                                + "\n-> Posibilidad 2: Problema con la tabla de la BD");
                    };
                    var objectStore = transaction.objectStore("table_radios");
                    objectStore.add({emisora_nombre: emisora_nombre, emisora_frecuencia: emisora_frecuencia,
                                    emisora_latitud: emisora_latitud, emisora_longitud: emisora_longitud});
                    poner_en_blanco();
                }
            }##*/
            
            document.getElementById('id_btn_logged_add_broadcast_info').addEventListener('click', function(){
                var variable_add_broadcast_info_titulo = navigator.mozL10n.get("id_article_logged_add_broadcast_titulo2");
                var variable_add_broadcast_info_texto = navigator.mozL10n.get("id_article_logged_add_broadcast_text2");

                Tako.Notification.custom(variable_add_broadcast_info_titulo, variable_add_broadcast_info_texto);
            });

            //Buscar la emision guardada y obtener su codigo
            function obtener_codigo_emision_aniadida(){
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emisora = document.getElementById("ddl_article_logged_aniaidir_emision_nombre").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex].value;
                var emision_frecuencia = $("#id_article_logged_aniadir_emision_frecuencia").val();
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');

                var url = server_path + "get_emision_aniadida_codigo.php";
                
                var array_data_new_punt = {"usuario_cod": cod_usuario,"emisora_cod":cod_emisora,"emision_freq":emision_frecuencia,"emision_lat":emision_latitud,"emision_long":emision_longitud};

                var cont = 0;
                var emision_codigo_obtenido = "";
                $.getJSON(url, array_data_new_punt, function(new_punt) {
                    $.each(new_punt, function(k, new_punt){
                        if (cont == 0){
                            var puntuacion_inicial_estandar = "3";
                            nuevo_aniadir_puntuacion_inicial(puntuacion_inicial_estandar,new_punt.cod_emision_json);
                            //emision_codigo_obtenido = new_punt.cod_emision_json;
                            //console.log("cod_emisio_var: "+ emision_codigo_obtenido);
                            //localStorage.setItem('zzz_emision_codigo_puntual',emision_codigo_obtenido);
                            //console.log("localS: "+localStorage.getItem('zzz_emision_codigo_puntual'));
                        }
                        else{
                            console.log("Mas de un valor de resultado...");
                        }
                        //console.log("cont: "+cont);
                        cont++;
                    });
                });
            }

            //Añadir la puntuacion inicial a la emision guardada
            function nuevo_aniadir_puntuacion_inicial(puntuac, cod_emision_aniadida){
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emision = cod_emision_aniadida;
                var puntuacion_latitud = localStorage.getItem('mylatit');
                var puntuacion_longitud = localStorage.getItem('mylongit');
                var puntos = puntuac;

                var params = "usuario_cod="+cod_usuario+"&emision_cod="+cod_emision+"&puntu_lat="+puntuacion_latitud+"&puntu_long="+puntuacion_longitud+"&puntuacion="+puntos;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_puntuacion.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                /*xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_puntuacion").innerHTML = xmlhttp.responseText;
                    }
                }*/
                xmlhttp.send(params);

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        console.log("Puntuación añadida")
                    }
                }
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> ADD -> Click in Nueva Emisora -> AÑADIR NOMBRE EMISORA NUEVA
            document.getElementById("id_article_logged_aniadir_emisora_btn").addEventListener("click",function() {
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
                else{
                    var nombre_emisora_vacia = false;
                    var nombre_emisora_pequenia = false;
                    var nombre_emisora_grande = false;
                    var valor_nombre_emisora = "";
                    var ddl_alcance_vacia = false;
                    var valor_ddl_alcance_emisora = "";
                    var valor_ddl_alcance_emisora_plus = "";
                    var text = "";

                    //Comprobacion nombre_emisora
                    valor_nombre_emisora = document.getElementById("id_article_logged_aniadir_emisora_nueva_nombre").value;
                    if (validarNombreRegExp(valor_nombre_emisora)){
                        nombre_emisora_vacia = true;
                        text += imprimir_errores_nombre_emisora_vacia();
                    }else{
                        if (validarTextoTamanioMinimoEmisora(valor_nombre_emisora)) {
                            nombre_emisora_pequenia = true;                           
                            text += imprimir_errores_nombre_emisora_pequenia();
                        }
                        else{
                            if (validarTextoTamanioMaximoEmisora(valor_nombre_emisora)){
                                nombre_emisora_grande = true;
                                text += imprimir_errores_nombre_emisora_grande();
                            }
                        }
                    }

                    //Comprobacion listado alcance
                    /*
                        valor_ddl_alcance_emisora = $("#ddl_article_logged_aniaidir_emisora_nueva_alcance option:selected");
                        if ((ningunDDLSeleccionado(valor_ddl_alcance_emisora))){
                            ddl_alcance_vacia = true;
                            text += imprimir_errores_ddl_alcance_no_seleccionada();
                        }
                    */

                    valor_ddl_alcance_emisora = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance").selectedIndex;
                    valor_ddl_alcance_emisora_plus = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre").selectedIndex].value;
                    if (primerDDLSeleccionado_alcance(valor_ddl_alcance_emisora,valor_ddl_alcance_emisora_plus)){
                        ddl_alcance_vacia = true;
                        text += imprimir_errores_ddl_alcance_no_seleccionada();
                    }

                    //Comprobacion listado tipos
                    var ddl_tipos_vacia = false;
                    var select = document.getElementById('ddl_article_logged_aniaidir_emisora_nueva_tipos');
                    var tipos_valor  = [];
                    var opti = "";

                    for (var i=0, l=select.options.length; i<l ; i++){
                        opti = select.options[i];
                        if (opti.selected == true){
                            tipos_valor.push(opti.value);
                        }
                    }
                    if (!tipos_valor[0]){
                        ddl_tipos_vacia = true;
                        text += imprimir_errores_ddl_tipos_no_seleccionada();
                    }

                    if (nombre_emisora_vacia || nombre_emisora_pequenia || nombre_emisora_grande||
                        ddl_alcance_vacia || ddl_tipos_vacia){
                        var error_global = navigator.mozL10n.get("id_error");
                        Tako.Notification.error("deny", error_global, text, null, function(){
                        });                
                    }
                    else{
                        //Comprobacion emisora en db server
                        var existe = "";
                        comprobacion_aniadir_emisora_logged_server(function(existe){
                            if (existe == "estanombre"){
                                text += imprimir_errores_aniadir_emisora_existente();
                                Tako.Notification.error("deny", "Error!!",text, null, function(){
                                });                
                            }
                            else{
                                var correcto_global = navigator.mozL10n.get("id_correcto");
                                var emisora_aniadida_global = navigator.mozL10n.get("id_emisora_aniadida");
                                Tako.Notification.success("ok", correcto_global, emisora_aniadida_global, null, function(){
                                    nuevo_aniadir_emisora_server();
                                    for (i=0; i < tipos_valor.length; i++){
                                        //Pasamos "valor_nombre_emisora" para que busque su codigo 
                                        //Pasamos "tipos_valor[i]", uno para cada tipo que haya sido seleccionado
                                        nuevo_aniadir_emisora_tipos_server(valor_nombre_emisora,tipos_valor[i]);
                                    }
                                    //añadimos esta linea para actualizar el ddl de nueva emision ya que estamos añadiendo un nuevo elemento a la bd
                                    //show_content_bd_emisiones_nombre_ddl();
                                    //listar_aniadidos_emisoras_propios_usuario_perfil();
                                    nuevo_poner_en_blanco_emisora_aniadir();

                                    show_content_bd_emisiones_nombre_ddl();
                                    setTimeout(function(){redirect("article_logged_radio_ui/section_logged_aniadir_emision");},0);
                                });
                            }
                        });
                    }
                }
            });   

            //Comprobación que no se registren usuarios con nombre o email igual a los que exiten en la base de datos
            function comprobacion_aniadir_emisora_logged_server(callback){
                var emisora_name = $("#id_article_logged_aniadir_emisora_nueva_nombre").val();
                var params = "emisora_name="+emisora_name;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_emisora_aniadir.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }


            function nuevo_aniadir_emisora_server(){
                var emisora_nombre = $("#id_article_logged_aniadir_emisora_nueva_nombre").val();
                var emisora_alcance = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance").options[document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance").selectedIndex].value;
                var cod_usuario = localStorage.getItem('codigo_usuario');

                var params = "emisora_name="+emisora_nombre+"&emisora_alc="+emisora_alcance+"&cod_usuario="+cod_usuario;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emisora.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emisora_nueva").innerHTML = xmlhttp.responseText;
                    }   
                }
                xmlhttp.send(params);

                /*var formdata = new FormData();formdata.append('cod_emisora', 3);formdata.append('nombre_emisora', emisora_nombre);
                formdata.append('alcance_emisora', emisora_alcance);formdata.append('imagen_emisora', 0);console.log(formdata);
                xmlhttp.send(formdata);*/
            }

            function nuevo_aniadir_emisora_tipos_server(nombre_emisora,valor_tipo_emisora){
                var emisora_nombre = nombre_emisora;
                var emisora_tipo = valor_tipo_emisora;
                var params = "emisora_name="+emisora_nombre+"&emisora_tipo="+emisora_tipo;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emisoras_son_tipos.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emisora_nueva_tipos").innerHTML = xmlhttp.responseText;
                    }   
                }
                xmlhttp.send(params);
            }

            function nuevo_poner_en_blanco_emisora_aniadir(){
                document.getElementById("id_article_logged_aniadir_emisora_nueva_nombre").value = "";
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance"));
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_tipos"));
            }

            document.getElementById('id_btn_logged_add_station_info').addEventListener('click', function(){
                var variable_add_station_info_titulo = navigator.mozL10n.get("id_article_logged_add_station_titulo2");
                var variable_add_station_info_texto = navigator.mozL10n.get("id_article_logged_add_station_text2");

                Tako.Notification.custom(variable_add_station_info_titulo, variable_add_station_info_texto);
            });


            //EMISORAS_ALCANCE_DDL
            function show_content_bd_emisoras_alcance_ddl(){
                var idioma = idioma_navegador();
                var params = "idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisoras_ddl_alcance.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisoras_alcance").innerHTML = xmlhttp.responseText;
                        document.getElementById("txtBD_ddl_emisoras_alcance_scan").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            //EMISORAS_TIPOS_DDL
            function show_content_bd_emisoras_tipos_ddl(){
                var idioma = idioma_navegador();
                var params = "idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisoras_ddl_tipos.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisoras_tipos").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }


            /*document.getElementById("id_article_logged_aniadir_emision_btn_aniadir_emisora").addEventListener("click",function() {
                document.getElementById("id_scan_add_btn").getAttribute("data-section","section_logged_aniadir_emision");
            });*/


            /*
            document.getElementById('id_section_logged_aniadir_emision1').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_aniadir_emision2').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_aniadir_emision3').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_aniadir_emision4').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_aniadir_emision5').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });*/

        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> Click in RDS button

            //document.getElementById("btn_section_logged_rds").addEventListener("click",function() {
            $("#section_logged_rds").on("load", function(){
                //OFFLINE
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
                //ONLINE
                else{
                    if (localStorage.getItem('codigo_emision')){
                        //document.getElementById("txtBD_rds_logged").textContent = "";
                        //document.getElementById("txtBD_rds_logged").style.visibility = "hidden";
                        //document.getElementById("txtBD_rds_logged_json").style.visibility = "hidden";
                        //De primeras, normal
                        var prec = "normal_prec";
                        show_content_bd_rds_logged_json(localStorage.getItem('last_codigo_emision'),prec);
                        //Para que aparezca seleccionado el boton
                        document.getElementById("normal_prec").classList.add("btn_selected");
                        document.getElementById("poca_prec").classList.remove("btn_selected");

                        //if (document.getElementById("txtBD_rds_logged")){
                        //    document.getElementById(localStorage.getItem('codigo_emision')).classList.add("cada_emisora_seleccionada_rds");
                        //}

                        
                        //var cargando = navigator.mozL10n.get("id_cargando");
                        //Tako.Notification.loading(cargando, 2, function(){
                            //document.getElementById("txtBD_rds_logged_json").style.visibility = "visible";
                            //document.getElementById("normal_prec").style.visibility = "visible";
                            //document.getElementById("normal_prec_label").style.visibility = "visible";
                            //document.getElementById("poca_prec").style.visibility = "visible";
                            //document.getElementById("poca_prec_label").style.visibility = "visible";
                        
                            //Cambiamos el valor del label de los radio buttons al idioma en que estemos
                            /*var poca_precision = navigator.mozL10n.get("id_poca_prec");
                            document.getElementById("poca_prec").value = poca_precision;

                            var normal_precision = navigator.mozL10n.get("id_normal_prec");
                            document.getElementById("normal_prec").value = normal_precision;*/

                            //Para que aparezca seleccionada la emision que estamos escuchando actualmente
                            //var c_emision = localStorage.getItem('last_codigo_emision');
                            //document.getElementById(c_emision).classList.add("cada_emisora_seleccionada_rds");
                        //});
                    }
                    else{
                        var variable_rds_aviso_no_seleccion_texto = navigator.mozL10n.get("id_rds_aviso_no_seleccion_texto");
                        document.getElementById("txtBD_rds_logged").textContent = variable_rds_aviso_no_seleccion_texto;
                        document.getElementById("normal_prec").style.visibility = "hidden";
                        //document.getElementById("normal_prec_label").style.visibility = "hidden";
                        document.getElementById("poca_prec").style.visibility = "hidden";
                        //document.getElementById("poca_prec_label").style.visibility = "hidden";
                    }
                }
            });

            /*function show_content_bd_rds_logged(){
                var cod_emisora = localStorage.getItem('codigo_emisora');
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = que_precision();
                var params = "emisora_cod="+cod_emisora+"&posicion_lat="+pos_latitud+"&posicion_long="+pos_longitud+"&prec="+precision;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_rds.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_rds_logged_json").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }*/

            /*document.getElementById("mucha_prec").addEventListener("click",function() {
                document.getElementById("txtBD_rds_logged").style.visibility = "hidden";
                show_content_bd_rds_logged();
                //Para que aparezca seleccionada la emision que estamos escuchando actualmente
                if (document.getElementById("txtBD_rds_logged")){
                    document.getElementById(localStorage.getItem('codigo_emision')).classList.add("cada_emisora_seleccionada_rds");
                }
                var cargando = navigator.mozL10n.get("id_cargando");
                Tako.Notification.loading(cargando, 1, function(){
                    document.getElementById("txtBD_rds_logged").style.visibility = "visible";
                });
            });*/

            document.getElementById("normal_prec").addEventListener("click",function() {
                //document.getElementById("txtBD_rds_logged").style.visibility = "hidden";
                var prec = "normal_prec";
                show_content_bd_rds_logged_json(localStorage.getItem('last_codigo_emision'),prec);
                var cargando = navigator.mozL10n.get("id_cargando");
                //Tako.Notification.loading(cargando, 1, function(){
                    document.getElementById("txtBD_rds_logged_json").style.visibility = "visible";
                //});
                //Para que aparezca seleccionada la emision que estamos escuchando actualmente
                if (document.getElementById("txtBD_rds_logged_json")){
                    if (document.getElementById(localStorage.getItem('codigo_emision'))){
                        document.getElementById(localStorage.getItem('codigo_emision')).classList.add("cada_emisora_seleccionada_rds");
                    }
                }

                //Para que aparezca seleccionado el boton
                document.getElementById("normal_prec").classList.add("btn_selected");
                document.getElementById("poca_prec").classList.remove("btn_selected");

            });

            document.getElementById("poca_prec").addEventListener("click",function() {
                var prec = "poca_prec";
                document.getElementById("txtBD_rds_logged_json").style.visibility = "hidden";
                show_content_bd_rds_logged_json(localStorage.getItem('last_codigo_emision'),prec);
                var cargando = navigator.mozL10n.get("id_cargando");
                ///Tako.Notification.loading(cargando, 1, function(){
                    document.getElementById("txtBD_rds_logged_json").style.visibility = "visible";
                //});
                //Para que aparezca seleccionada la emision que estamos escuchando actualmente
                if (document.getElementById("txtBD_rds_logged_json")){
                    if (document.getElementById(localStorage.getItem('codigo_emision'))){
                        document.getElementById(localStorage.getItem('codigo_emision')).classList.add("cada_emisora_seleccionada_rds");
                    }
                }

                //Para que aparezca seleccionado el boton
                document.getElementById("poca_prec").classList.add("btn_selected");
                document.getElementById("normal_prec").classList.remove("btn_selected");
            });
            
            document.getElementById('id_btn_logged_rds_info').addEventListener('click', function(){
                var variable_rds_info_titulo = navigator.mozL10n.get("id_article_logged_rds_titulo2");
                var variable_rds_info_texto = navigator.mozL10n.get("id_article_logged_rds_text2");

                Tako.Notification.custom(variable_rds_info_titulo, variable_rds_info_texto);
            });

            function show_content_bd_rds_logged_json(emision_act,precis){
                //Vaciar el contenido de ese elemento: #txtBD_radio_ui_logged_json
                //document.getElementById("txtBD_radio_ui_logged_json").value = "";
                $("#txtBD_rds_logged_json").children("div").remove();
                $("#txtBD_rds_logged_json").children("br").remove();

                var cod_emisora = localStorage.getItem('codigo_emisora');
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                //var precision = que_precision();
                var precision = precis;
                var url = server_path + "get_rds_json_post.php";
                var array_data_rds = {"emisora_cod": cod_emisora, "posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};

                $.post(url, array_data_rds, function(rds) {
                    $.each(rds, function(k, rds){
                        //console.log(rds);
                        if (rds.cod_emision_json == emision_act){
                            if (rds.puntos_json[k].puntos_json <= "1.5"){
                                nueva_linea_rds = 
                                "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                        "<div class=\"info_vista_secund_negrita texto_rojo\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund texto_rojo\">" + rds.posicion_emision_json +
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                        "<span class=\"icon heart texto_rojo\"></span>" + " " +
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " +
                                        "<span class=\"icon attention texto_rojo\"></span>" + " " +
                                        //rds.puntos_json[k].puntos_json +
                                        "</div>"+
                                    "</a>"+
                                "</div>"+
                                "<br>";
                            }
                            else{
                                if ((rds.puntos_json[k].puntos_json >= "1.5")&&(rds.puntos_json[k].puntos_json < "2.5")) {
                                    nueva_linea_rds = 
                                    "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                        "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                            "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            //rds.puntos_json[k].puntos_json +
                                            "</div>"+
                                        "</a>"+
                                    "</div>"+
                                    "<br>";
                                }
                                else{
                                    if ((rds.puntos_json[k].puntos_json >= "2.5")&&(rds.puntos_json[k].puntos_json < "3.5")) {
                                        nueva_linea_rds = 
                                        "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                            "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + " " +
                                                "<span class=\"icon heart\"></span>" + " " + 
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                //rds.puntos_json[k].puntos_json +
                                                "</div>"+
                                            "</a>"+
                                        "</div>"+
                                        "<br>";
                                    }
                                    else{
                                        if ((rds.puntos_json[k].puntos_json >= "3.5")&&(rds.puntos_json[k].puntos_json < "4.5")) {
                                            nueva_linea_rds = 
                                            "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                    "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart-empty\"></span>" + " " + 
                                                    //rds.puntos_json[k].puntos_json +
                                                    "</div>"+
                                                "</a>"+
                                            "</div>"+
                                            "<br>";
                                        }
                                        else{
                                            if (rds.puntos_json[k].puntos_json >= "4.5") {
                                                nueva_linea_rds = 
                                                "<div class=\"cada_emisora align-center cada_emisora_seleccionada_rds\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                        "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        //rds.puntos_json[k].puntos_json +
                                                        "</div>"+
                                                    "</a>"+
                                                "</div>"+
                                                "<br>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else{
                            if (rds.puntos_json[k].puntos_json <= "1.5"){
                                nueva_linea_rds = 
                                "<div class=\"cada_emisora align-center\" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                        "<div class=\"info_vista_secund_negrita texto_rojo\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund texto_rojo\">" + rds.posicion_emision_json +
                                        "</div>"+
                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                        "<span class=\"icon heart texto_rojo\"></span>" + " " +
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " + 
                                        "<span class=\"icon heart-empty texto_rojo\"></span>" + " " +
                                        "<span class=\"icon attention texto_rojo\"></span>" + " " +
                                        //rds.puntos_json[k].puntos_json +
                                        "</div>"+
                                    "</a>"+
                                "</div>"+
                                "<br>";
                            }
                            else{
                                if ((rds.puntos_json[k].puntos_json >= "1.5")&&(rds.puntos_json[k].puntos_json < "2.5")) {
                                    nueva_linea_rds = 
                                    "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                        "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                            "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                            "</div>"+
                                            "<div class=\"info_vista_secund_secund\">" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart\"></span>" + " " +
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            "<span class=\"icon heart-empty\"></span>" + " " + 
                                            //rds.puntos_json[k].puntos_json +
                                            "</div>"+
                                        "</a>"+
                                    "</div>"+
                                    "<br>";
                                }
                                else{
                                    if ((rds.puntos_json[k].puntos_json >= "2.5")&&(rds.puntos_json[k].puntos_json < "3.5")) {
                                        nueva_linea_rds = 
                                        "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                            "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                "</div>"+
                                                "<div class=\"info_vista_secund_secund\">" + " " +
                                                "<span class=\"icon heart\"></span>" + " " + 
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart\"></span>" + " " +
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                "<span class=\"icon heart-empty\"></span>" + " " + 
                                                //rds.puntos_json[k].puntos_json +
                                                "</div>"+
                                            "</a>"+
                                        "</div>"+
                                        "<br>";
                                    }
                                    else{
                                        if ((rds.puntos_json[k].puntos_json >= "3.5")&&(rds.puntos_json[k].puntos_json < "4.5")) {
                                            nueva_linea_rds = 
                                            "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                    "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                    "</div>"+
                                                    "<div class=\"info_vista_secund_secund\">" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " + 
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart\"></span>" + " " +
                                                    "<span class=\"icon heart-empty\"></span>" + " " + 
                                                    //rds.puntos_json[k].puntos_json +
                                                    "</div>"+
                                                "</a>"+
                                            "</div>"+
                                            "<br>";
                                        }
                                        else{
                                            if (rds.puntos_json[k].puntos_json >= "4.5") {
                                                nueva_linea_rds = 
                                                "<div class=\"cada_emisora align-center \" id=\"emision_numero_"+ rds.cod_emision_json +"\">"+
                                                    "<a id=\"emision_rds_"+ rds.cod_emision_json +"\">"+
                                                        "<div class=\"info_vista_secund_negrita\">"+ rds.nombre_emisora_json +" - ["+ rds.freq_emision_json +" Mhz]"+
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + rds.posicion_emision_json +
                                                        "</div>"+
                                                        "<div class=\"info_vista_secund_secund\">" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " + 
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        "<span class=\"icon heart\"></span>" + " " +
                                                        //rds.puntos_json[k].puntos_json +
                                                        "</div>"+
                                                    "</a>"+
                                                "</div>"+
                                                "<br>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                                    
                        $('#txtBD_rds_logged_json').append(nueva_linea_rds);

                        document.getElementById("emision_rds_"+rds.cod_emision_json).addEventListener("click",function(){
                            seleccionar_rds(rds.cod_emision_json, rds.freq_emision_json, rds.cod_emisora_json, rds.nombre_emisora_json);
                            //alert(rds.freq_emision_json);
                        });
                    });
                },'json');
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> Click in SCAN button 

            /*$('#section_logged_escanear_emisoras').on('click',function(){
                $('#btn_logged_btn_scan_inicializar').toggle('slow');
            });*/

            //#IGB 02-07-2015
            function inicializar_valores_frecuencia_nombre_emisora_logged_scan(){
                var primerisima_vez_usa_app_freq = "00.0";
                document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = "----";
                document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = primerisima_vez_usa_app_freq + " Mhz";

                //Colorear boton play/pause --> logged
                document.getElementById('btn_logged_btn_pause').classList.remove('orange');
                document.getElementById('btn_logged_btn_pause').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('orange');
                document.getElementById('btn_logged_btn_play').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('animated');    
            }

            document.getElementById("btn_logged_btn_scan_inicializar").addEventListener("click",function(){
                //#IGB 02-07-2015
                //if (localStorage.getItem('auto_rds_activado') == "true"){
                    localStorage.setItem('auto_rds_activado','false');
                    parar_autords();
                    inicializar_valores_frecuencia_nombre_emisora_logged_scan();
                /*}
                localStorage.setItem('dentro_escaneo','true');*/


                console.log("Pulsado iniciar escaneo");
                if (myRadioFM.frequency == null){
                    enableFMRadio(87.5);
                }
                else{
                    myRadioFM.setFrequency(87.5);
                }
                mostrar_datos_radio_fm();
                var iniciando = navigator.mozL10n.get("id_iniciando");
                var freq_destacada = "";
                //var buscando = navigator.mozL10n.get("id_buscando");
                //var buscando_texto = navigator.mozL10n.get("id_buscando_texto");
                Tako.Notification.loading(iniciando, 4, function(){
                /*var progress = Tako.Notification.progress("spin2 animated", buscando, buscando_texto, 4, function(){*/
                    id_scan_emision_nueva_titulo_frecuencia.style.display = 'block';
                    freq_destacada = "<strong>"+myRadioFM.frequency+"</strong>";
                    document.getElementById("txtBD_scan_nueva_frecuencia").innerHTML = imprimir_scan_frecuencia() + freq_destacada;
                    show_content_bd_emisiones_nombre_ddl_scan();
                    btn_logged_scan_save.style.display = '';
                    btn_logged_btn_scan_inicializar.style.display = 'none';
                    btn_logged_btn_scan.style.display = '';
                    // ##IGB##
                    btn_logged_scan_aniadir_emisora.style.display = '';

                    scan_emisora_nueva_borde.style.display = 'block';
                    id_scan_emision_nueva_aniadirla.style.display = 'block';
                    document.getElementById("txtBD_usuario_logged_scan_emisiones_parecidas").innerHTML = "";
                    listar_emisiones_similares_misma_posicion_misma_frecuencia();
                });
            });
            
            document.getElementById("btn_logged_btn_scan").addEventListener("click",function(){
                //#IGB 02-07-2015
                //if (localStorage.getItem('auto_rds_activado') == "true"){
                    localStorage.setItem('auto_rds_activado','false');
                    parar_autords();
                    inicializar_valores_frecuencia_nombre_emisora_logged_scan();
                /*}
                localStorage.setItem('dentro_escaneo','true');*/

                //console.log("Pulsado escanear");
                myRadioFM.seekUp();
                mostrar_datos_radio_fm();
                var buscando = navigator.mozL10n.get("id_buscando"); 
                var buscando_texto = navigator.mozL10n.get("id_buscando_texto");           
                var freq_destacada = "";
                //Tako.Notification.loading(buscando, 4, function(){
                var progress = Tako.Notification.progress("search", buscando, buscando_texto, 4, function(){
                    id_scan_emision_nueva_titulo_frecuencia.style.display = 'block';
                    freq_destacada = "<strong>"+myRadioFM.frequency+"</strong>";
                    document.getElementById("txtBD_scan_nueva_frecuencia").innerHTML = imprimir_scan_frecuencia() + freq_destacada;
                    show_content_bd_emisiones_nombre_ddl_scan();
                    btn_logged_scan_save.style.display = '';
                    // ##IGB##
                    btn_logged_scan_aniadir_emisora.style.display = '';

                    //id_scan_emision_nueva_titulo_encontradas.style.display = 'block';
                    document.getElementById("txtBD_usuario_logged_scan_emisiones_parecidas").innerHTML = "";
                    listar_emisiones_similares_misma_posicion_misma_frecuencia();

                    //scan_emisora_coincidente_borde.style.display = 'block';
                });
                var valor_random_1 = numero_aleatorio_entre(10,30);
                var valor_random_2 = numero_aleatorio_entre(45,65);
                var valor_random_3 = numero_aleatorio_entre(85,95);
                var valor_random_4 = "100";
                setTimeout(function(){progress.percent(valor_random_1)},500);
                setTimeout(function(){progress.percent(valor_random_2)},1500);
                setTimeout(function(){progress.percent(valor_random_3)},2500);
                setTimeout(function(){progress.percent(valor_random_4)},3500);
                
            });

            document.getElementById('id_btn_logged_scan_info').addEventListener('click', function(){
                var variable_scan_info_titulo = navigator.mozL10n.get("id_article_logged_scan_titulo2");
                var variable_scan_info_texto = navigator.mozL10n.get("id_article_logged_scan_text2");

                var variable_scan_info_texto2 = navigator.mozL10n.get("id_scan_bucle_texto");
                var variable_scan_info_texto3 = navigator.mozL10n.get("id_scan_bucle_texto2");
                

                Tako.Notification.custom(variable_scan_info_titulo, variable_scan_info_texto+'. '+variable_scan_info_texto2+''+variable_scan_info_texto3);
            });
           
            //Repetimos funcion cambiando variables, se podría unificar para reutilizar **FUTURO**
            //EMISIONES_NOMBRE_DDL_SCAN
            function show_content_bd_emisiones_nombre_ddl_scan(){
                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisiones_ddl_nombre_scan.php";
                xmlhttp.open("GET", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisiones_nombre_scan").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send();
            }

            function listar_emisiones_similares_misma_posicion_misma_frecuencia(){
                var freq = myRadioFM.frequency;
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var idioma = idioma_navegador();
                var params = "freq="+freq+"&posicion_lat="+pos_latitud+"&posicion_long="+pos_longitud+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisiones_similares_segun_posicion_y_frecuencia.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_scan_emisiones_parecidas").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function mostrar_datos_radio_fm(){
                //controlo esos 4 segundos que tarda en cargar la info de la frecuencia correcta
                var cantidadDeLlamadas = 0;
                function mostrar_datos(){
                    //console.log(myRadioFM); 
                    cantidadDeLlamadas++;
                    if (cantidadDeLlamadas === 1){
                        clearInterval(funct);
                    }
                }
                clearInterval(funct);
                var funct = setInterval(function(){
                    mostrar_datos();
                }, 4000);
            }

            document.getElementById('btn_logged_scan_save').addEventListener('click', function(){            
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
                else{
                    var valor_ddl_nombre_emisora_scan = "";
                    var ddl_nombre_vacia_scan = false;
                    var frec_vacia_scan = false;
                    var frec_fuera_intervalo_scan = false;
                    var valor_emisoras_frecuencia_scan = "";
                    var valor_ddl_nombre_emisora_scan_plus = "";
                    var text_scan = "";

                    //Comprobacion listado nombres nuevo
                    /*
                        valor_ddl_nombre_emisora_scan = $("#ddl_article_logged_aniaidir_emision_nombre_scan option:selected");
                        if ((ningunDDLSeleccionado(valor_ddl_nombre_emisora_scan))){
                            ddl_nombre_vacia_scan = true;
                            text_scan += imprimir_errores_ddl_emisoras_no_seleccionada();
                        }
                    */
                    
                    valor_ddl_nombre_emisora_scan = document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").selectedIndex;
                    valor_ddl_nombre_emisora_scan_plus = document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").selectedIndex].value;
                    if (primerDDLSeleccionado_nombre_emisora(valor_ddl_nombre_emisora_scan,valor_ddl_nombre_emisora_scan_plus)){
                        ddl_nombre_vacia_scan = true;
                        text_scan += imprimir_errores_ddl_emisoras_no_seleccionada();
                    }
                    else{
                        valor_ddl_nombre_emisora_scan = $("#ddl_article_logged_aniaidir_emision_nombre_scan option:selected");
                    }

                    //Comprobacion frecuencia
                    valor_emisoras_frecuencia_scan = myRadioFM.frequency;
                    if (validarFreqRegExp(valor_emisoras_frecuencia_scan)){
                        frec_vacia_scan = true;
                        text_scan += imprimir_errores_frecuencia_vacia();
                    }
                    else{
                        if (validarFrecuenciaIntervalo(valor_emisoras_frecuencia_scan)){
                            frec_fuera_intervalo_scan = true;
                            text_scan += imprimir_errores_frecuencia_fuera_intervalo();
                        }
                    }

                    if ((ddl_nombre_vacia_scan) || (frec_vacia_scan) || (frec_fuera_intervalo_scan)){
                        var error_global = navigator.mozL10n.get("id_error");
                        Tako.Notification.error("deny", error_global, text_scan, null, function(){
                        });                
                    }
                    else{
                        geoPos();
                        var existe = "";
                        comprobacion_aniadir_emision_logged_server_scan(function(existe){
                            if (existe == "yahayunaemision"){
                                text_scan += imprimir_errores_aniadir_emision_existente();
                                Tako.Notification.error("deny", "Error!!",text_scan, null, function(){
                                });                
                            }
                            else{
                                var scan_add_text1 = navigator.mozL10n.get("id_scan_add_text1");
                                var scan_add_text2 = navigator.mozL10n.get("id_scan_add_text2");
                                var scan_add_text3 = navigator.mozL10n.get("id_scan_add_text3");
                                var scan_add_text4 = navigator.mozL10n.get("id_scan_add_text4");
                                Tako.Notification.confirm("bullseye", 
                                    scan_add_text1, scan_add_text2, scan_add_text3, scan_add_text4,
                                    function(result){
                                        if(result == true){
                                            nuevo_aniadir_emision_server_scan();
                                            obtener_codigo_emision_aniadida_scan();
                                            nuevo_poner_en_blanco_aniadir_emision_scan();
                                            show_content_bd_radio_ui_logged_json(localStorage.getItem("last_codigo_emisora"));
                                        }
                                        else{
                                            console.log("Cancelado el añadir nueva emisión");
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            });

            //Comprobación que no se añadan registros que ya existen en el sistema
            function comprobacion_aniadir_emision_logged_server_scan(callback){
                var emisora_cod = document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").selectedIndex].value;
                var emision_frecuencia = myRadioFM.frequency;
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');
                var params = "emisora_cod="+emisora_cod+"&emision_freq="+emision_frecuencia+"&emision_lat="+emision_latitud+"&emision_long="+emision_longitud;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_emision_aniadir.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            //Se añade la emisión al servidor
            function nuevo_aniadir_emision_server_scan(){
                var emisora_cod = document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").selectedIndex].value;
                var emision_frecuencia = myRadioFM.frequency;
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');
                var emision_posicion = localStorage.getItem('myposicion');
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var params = "emisora_cod="+emisora_cod+"&emision_freq="+emision_frecuencia+"&emision_lat="+emision_latitud+"&emision_long="+emision_longitud+"&emision_pos="+emision_posicion+"&cod_usuario="+cod_usuario;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emision.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emision_scan").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            //Buscar la emision guardada y obtener su codigo para añadir la puntuacion inicial
            function obtener_codigo_emision_aniadida_scan(){
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emisora = document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").options[document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan").selectedIndex].value;
                var emision_frecuencia = myRadioFM.frequency;
                emision_frecuencia = redondeo(emision_frecuencia,2);
                var emision_latitud = localStorage.getItem('mylatit');
                var emision_longitud = localStorage.getItem('mylongit');

                var url = server_path + "get_emision_aniadida_codigo.php";
                
                var array_data_new_punt = {"usuario_cod": cod_usuario,"emisora_cod":cod_emisora,"emision_freq":emision_frecuencia,"emision_lat":emision_latitud,"emision_long":emision_longitud};

                var cont = 0;
                var emision_codigo_obtenido_scan = "";
                $.getJSON(url, array_data_new_punt, function(new_punt) {
                    $.each(new_punt, function(k, new_punt){
                        if (cont == 0){
                            var puntuacion_inicial_estandar = "3";
                            nuevo_aniadir_puntuacion_inicial(puntuacion_inicial_estandar,new_punt.cod_emision_json);
                            //emision_codigo_obtenido = new_punt.cod_emision_json;
                            //console.log("cod_emisio_var: "+ emision_codigo_obtenido);
                            //localStorage.setItem('zzz_emision_codigo_puntual',emision_codigo_obtenido);
                            //console.log("localS: "+localStorage.getItem('zzz_emision_codigo_puntual'));
                        }
                        else{
                            console.log("Mas de un valor de resultado...");
                        }
                        //console.log("cont: "+cont);
                        cont++;
                    });
                });
            }

            //Añadir la puntuacion inicial a la emision guardada
            function nuevo_aniadir_puntuacion_inicial_scan(puntuac, cod_emision_aniadida_scan){
                var cod_usuario = localStorage.getItem('codigo_usuario');
                var cod_emision = cod_emision_aniadida_scan;
                var puntuacion_latitud = localStorage.getItem('mylatit');
                var puntuacion_longitud = localStorage.getItem('mylongit');
                var puntos = puntuac;

                var params = "usuario_cod="+cod_usuario+"&emision_cod="+cod_emision+"&puntu_lat="+puntuacion_latitud+"&puntu_long="+puntuacion_longitud+"&puntuacion="+puntos;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_puntuacion.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                /*xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_puntuacion").innerHTML = xmlhttp.responseText;
                    }
                }*/
                xmlhttp.send(params);

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        console.log("Puntuación añadida")
                    }
                }
            }

            //Se pone en blanco el dropdownlist / desplegable            
            function nuevo_poner_en_blanco_aniadir_emision_scan(){
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emision_nombre_scan"));
            }
            
            //OFFLINE
            //Son 4 funciones que se repiten, cambiando el nombre por un numero más, para nav inferior
            /*
            document.getElementById('id_section_logged_escanear_emisoras1').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_escanear_emisoras2').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_escanear_emisoras3').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });

            document.getElementById('id_section_logged_escanear_emisoras4').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });
            */

        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> SCAN ADD EMISORA -> Click in Nueva Emisora -> AÑADIR NOMBRE EMISORA NUEVA
            document.getElementById("id_article_logged_scan_aniadir_emisora_btn").addEventListener("click",function() {
                var nombre_emisora_vacia_scan = false;
                var nombre_emisora_pequenia_scan = false;
                var nombre_emisora_grande_scan = false;
                var valor_nombre_emisora_scan = "";
                var ddl_alcance_vacia_scan = false;
                var valor_ddl_alcance_emisora_scan = "";
                var valor_ddl_alcance_emisora_scan_plus = "";
                var text_scan = "";

                //Comprobacion nombre_emisora
                valor_nombre_emisora_scan = document.getElementById("id_article_logged_scan_aniadir_emisora_nombre").value;
                if (validarNombreRegExp(valor_nombre_emisora_scan)){
                    nombre_emisora_vacia_scan = true;
                    text_scan += imprimir_errores_nombre_emisora_vacia();
                }else{
                    if (validarTextoTamanioMinimoEmisora(valor_nombre_emisora_scan)) {
                        nombre_emisora_pequenia_scan = true;                           
                        text_scan += imprimir_errores_nombre_emisora_pequenia();
                    }
                    else{
                        if (validarTextoTamanioMaximoEmisora(valor_nombre_emisora_scan)){
                            nombre_emisora_grande_scan = true;
                            text_scan += imprimir_errores_nombre_emisora_grande();
                        }
                    }
                }

                //Comprobacion listado alcance
                /*
                    valor_ddl_alcance_emisora = $("#ddl_article_logged_aniaidir_emisora_nueva_alcance_scan option:selected");
                    if ((ningunDDLSeleccionado(valor_ddl_alcance_emisora))){
                        ddl_alcance_vacia = true;
                        text += imprimir_errores_ddl_alcance_no_seleccionada();
                    }
                */

                valor_ddl_alcance_emisora_scan_plus = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan").options[document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan").selectedIndex].value;
                valor_ddl_alcance_emisora_scan = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan").selectedIndex;
                if (primerDDLSeleccionado_alcance(valor_ddl_alcance_emisora_scan,valor_ddl_alcance_emisora_scan_plus)){
                    ddl_alcance_vacia_scan = true;
                    text_scan += imprimir_errores_ddl_alcance_no_seleccionada();
                }
                
                //Comprobacion listado tipos
                var ddl_tipos_vacia_scan = false;
                var select_scan = document.getElementById('ddl_article_logged_aniaidir_emisora_nueva_tipos_scan');
                var tipos_valor_scan = [];
                var opti_scan = "";

                for (var i=0, l=select_scan.options.length; i<l ; i++){
                    opti_scan = select_scan.options[i];
                    if (opti_scan.selected == true){
                        tipos_valor_scan.push(opti_scan.value);
                    }
                }
                if (!tipos_valor_scan[0]){
                    ddl_tipos_vacia_scan = true;
                    text_scan += imprimir_errores_ddl_tipos_no_seleccionada();
                }

                if (nombre_emisora_vacia_scan || nombre_emisora_pequenia_scan || nombre_emisora_grande_scan||
                    ddl_alcance_vacia_scan || ddl_tipos_vacia_scan){
                    var error_global_scan = navigator.mozL10n.get("id_error");
                    Tako.Notification.error("deny", error_global_scan, text_scan, null, function(){
                    });                
                }
                else{
                    //Comprobacion emisora en db server
                    var existe = "";
                    comprobacion_aniadir_emisora_logged_server_scan(function(existe){
                        if (existe == "estanombre"){
                            text_scan += imprimir_errores_aniadir_emisora_existente();
                            Tako.Notification.error("deny", "Error!!",text_scan, null, function(){
                            });                
                        }
                        else{
                            var correcto_global = navigator.mozL10n.get("id_correcto");
                            var emisora_aniadida_global = navigator.mozL10n.get("id_emisora_aniadida");
                            Tako.Notification.success("ok", correcto_global, emisora_aniadida_global, null, function(){
                                nuevo_aniadir_emisora_server_scan();
                                for (i=0; i < tipos_valor_scan.length; i++){
                                    //Pasamos "valor_nombre_emisora" para que busque su codigo 
                                    //Pasamos "tipos_valor[i]", uno para cada tipo que haya sido seleccionado
                                    nuevo_aniadir_emisora_tipos_server_scan(valor_nombre_emisora_scan,tipos_valor_scan[i]);
                                }
                                
                                //añadimos esta linea para actualizar el ddl de nueva emision ya que estamos añadiendo un nuevo elemento a la bd
                                show_content_bd_emisiones_nombre_ddl_scan();

                                //listar_aniadidos_emisoras_propios_usuario_perfil();
                                nuevo_poner_en_blanco_emisora_aniadir_scan();
                                setTimeout(function(){redirect("article_logged_radio_ui/section_logged_escanear_emisoras");},0);
                            });
                        }
                    });
                }
            });   

            //Comprobación que no se registren usuarios con nombre o email igual a los que exiten en la base de datos
            function comprobacion_aniadir_emisora_logged_server_scan(callback){
                var emisora_name = $("#id_article_logged_scan_aniadir_emisora_nombre").val();
                var params = "emisora_name="+emisora_name;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_emisora_aniadir.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            function nuevo_aniadir_emisora_server_scan(){
                var emisora_nombre = $("#id_article_logged_scan_aniadir_emisora_nombre").val();
                var emisora_alcance = document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan").options[document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan").selectedIndex].value;
                var cod_usuario = localStorage.getItem('codigo_usuario');

                var params = "emisora_name="+emisora_nombre+"&emisora_alc="+emisora_alcance+"&cod_usuario="+cod_usuario;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emisora.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emisora_nueva_scan").innerHTML = xmlhttp.responseText;
                    }   
                }
                xmlhttp.send(params);

                /*var formdata = new FormData();formdata.append('cod_emisora', 3);formdata.append('nombre_emisora', emisora_nombre);
                formdata.append('alcance_emisora', emisora_alcance);formdata.append('imagen_emisora', 0);console.log(formdata);
                xmlhttp.send(formdata);*/
            }

            function nuevo_aniadir_emisora_tipos_server_scan(nombre_emisora,valor_tipo_emisora){
                var emisora_nombre = nombre_emisora;
                var emisora_tipo = valor_tipo_emisora;
                var params = "emisora_name="+emisora_nombre+"&emisora_tipo="+emisora_tipo;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "aniadir_emisoras_son_tipos.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_aniadir_emisora_nueva_tipos_scan").innerHTML = xmlhttp.responseText;
                    }   
                }
                xmlhttp.send(params);
            }

            //Se pone en blanco el dropdownlist / desplegable            
            function nuevo_poner_en_blanco_emisora_aniadir_scan(){
                document.getElementById("id_article_logged_scan_aniadir_emisora_nombre").value = "";
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_alcance_scan"));
                deseleccionar_ddl(document.getElementById("ddl_article_logged_aniaidir_emisora_nueva_tipos_scan"));
            }

            document.getElementById('id_btn_logged_add_station_info_scan').addEventListener('click', function(){
                var variable_add_station_info_titulo = navigator.mozL10n.get("id_article_logged_add_station_titulo2");
                var variable_add_station_info_texto = navigator.mozL10n.get("id_article_logged_add_station_text2");

                Tako.Notification.custom(variable_add_station_info_titulo, variable_add_station_info_texto);
            });


            //EMISORAS_ALCANCE_DDL_SCAN
            function show_content_bd_emisoras_alcance_ddl_scan(){
                var idioma = idioma_navegador();
                var params = "idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisoras_ddl_alcance_scan.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisoras_alcance_scan").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            //EMISORAS_TIPOS_DDL_SCAN
            function show_content_bd_emisoras_tipos_ddl_scan(){
                var idioma = idioma_navegador();
                var params = "idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisoras_ddl_tipos_scan.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_ddl_emisoras_tipos_scan").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }


            /*document.getElementById("id_article_logged_aniadir_emision_btn_aniadir_emisora").addEventListener("click",function() {
                document.getElementById("id_scan_add_btn").getAttribute("data-section","section_logged_aniadir_emision");
            });*/

       
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE
            /*document.getElementById('id_article_logged_profile_btn').addEventListener('click', function(){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
            });*/
        

        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click Cambiar Password button
            document.getElementById("id_article_logged_profile_cambiar_pass_btn_guardar_cambios").addEventListener("click",function() {
                var email_valido = false;
                var valor_email = "";
                var password_vacia1 = false;
                var password_pequenia1 = false;
                var valor_password1 = "";
                var password_vacia2 = false;
                var password_pequenia2 = false;
                var valor_password2 = "";
                var password_vacia3 = false;
                var password_pequenia3 = false;
                var valor_password3 = "";
                var no_coinciden_password = false;
                var pass_vieja_pass_nueva_coinciden = false;
                var text = "";

                //Comprobacion email
                valor_email = document.getElementById("id_article_logged_profile_cambiar_pass_email").value;
                if (validarEmailRegExp(valor_email)){
                    email_valido = true;
                    text += imprimir_errores_email_valido();
                }

                //Comprobacion password_actual
                valor_password1 = document.getElementById("id_article_logged_profile_cambiar_pass_pass_actual").value;
                if (validarPassRegExp(valor_password1)){
                    password_vacia1 = true;
                    text += imprimir_errores_password_vacia_cambiar();
                }else{
                    if (validarTextoTamanioMinimo(valor_password1)) {
                        password_pequenia1 = true;                           
                        text += imprimir_errores_password_pequenia_cambiar();
                    }
                }

                //Comprobacion password_nueva
                valor_password2 = document.getElementById("id_article_logged_profile_cambiar_pass_pass_nueva").value;
                if (validarPassRegExp(valor_password2)){
                    password_vacia2 = true;
                    text += imprimir_errores_password_vacia_cambiar_nueva();
                }else{
                    if (validarTextoTamanioMinimo(valor_password2)) {
                        password_pequenia2 = true;                           
                        text += imprimir_errores_password_pequenia_cambiar_nueva();
                    }
                }

                //Comprobacion password_nueva_rep
                valor_password3 = document.getElementById("id_article_logged_profile_cambiar_pass_pass_nueva_rep").value;
                if (validarPassRegExp(valor_password3)){
                    password_vacia3 = true;
                    text += imprimir_errores_password_vacia_cambiar_nueva_rep();
                }else{
                    if (validarTextoTamanioMinimo(valor_password3)) {
                        password_pequenia3 = true;
                        text += imprimir_errores_password_pequenia_cambiar_nueva_rep();
                    }
                }

                //Comprobacion password_nueva == password_nueva_rep
                if ((!(valor_password2 == valor_password3))&&
                    (!(password_vacia2))&&(!(password_pequenia2))&&
                    (!(password_vacia3))&&(!(password_pequenia3))) {
                    no_coinciden_password = true;
                    text += imprimir_errores_passwords_no_coinciden();  
                }

                //Comprobacion password_vieja == password_nueva
                if (valor_password1 == valor_password2){
                    pass_vieja_pass_nueva_coinciden = true;
                    text += imprimir_errores_passwords_vieja_y_nueva_coinciden();
                }

                if (email_valido || password_vacia1 || password_pequenia1 || password_vacia2 || 
                    password_pequenia2 || password_vacia3 || password_pequenia3 || 
                    no_coinciden_password || pass_vieja_pass_nueva_coinciden){

                    var error_global = navigator.mozL10n.get("id_error");
                    Tako.Notification.error("deny", error_global, text, null, function(){
                    });                
                }
                else{
                    //Comprobacion usuario en db server
                    var existe = "";
                    comprobar_usuario_logged_cambiar_pass_server(function(existe){
                        if (existe == "email" || existe == "emailclave" || existe == "emailclaveusuarioidentificado" || existe == "passnuevasdiferentes"){
                            if (existe == "email") {
                                text += imprimir_errores_identificar_usuario_email_inexistente();
                            }
                            else{
                                if (existe == "emailclave") {
                                    text += imprimir_errores_identificar_usuario_email_clave_actual_no_coinciden();
                                }
                                else{
                                    if (existe == "emailclaveusuarioidentificado") {
                                        text += imprimir_errores_identificar_usuario_email_clave_usuario_identificado();
                                    }
                                    else{
                                       if (existe == "passnuevasdiferentes") {
                                            text += imprimir_errores_passwords_no_coinciden();
                                        }
                                    }
                                }
                            }
                            var error_global = navigator.mozL10n.get("id_error");
                            Tako.Notification.error("deny", error_global, text, null, function(){
                            });                
                        }
                        else{
                            var correcto_global = navigator.mozL10n.get("id_correcto");
                            var contrasenia_modificada_global = navigator.mozL10n.get("id_contrasenia_modificada");
                            Tako.Notification.success("ok", correcto_global,contrasenia_modificada_global, null, function(){
                                cambiar_pass_server();
                                poner_en_blanco_cambiar_pass();
                                setTimeout(function(){redirect("article_logged_profile/section_logged_profile");},0);
                            });
                        }
                    });
                }
            });


            //para ver si existe el usuario en la bd antes de hacer los cambios
            function comprobar_usuario_logged_cambiar_pass_server(callback){
                var usuario_email = $("#id_article_logged_profile_cambiar_pass_email").val();
                var usuario_pass = $("#id_article_logged_profile_cambiar_pass_pass_actual").val();
                var usuario_pass_nuevo = $("#id_article_logged_profile_cambiar_pass_pass_nueva").val();
                var usuario_pass_nuevo_rep = $("#id_article_logged_profile_cambiar_pass_pass_nueva_rep").val();
                var cod_usu = localStorage.getItem('codigo_usuario');
                var params = "usuario_pass="+usuario_pass+"&usuario_email="+usuario_email+"&usuario_pass_nuevo="+usuario_pass_nuevo+"&usuario_pass_nuevo_rep="+usuario_pass_nuevo_rep+"&usuario_cod="+cod_usu;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_usuario_cambio_pass.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            function cambiar_pass_server(callback){
                var usuario_email = $("#id_article_logged_profile_cambiar_pass_email").val();
                var usuario_pass_actual = $("#id_article_logged_profile_cambiar_pass_pass_actual").val();
                var usuario_pass_nuevo = $("#id_article_logged_profile_cambiar_pass_pass_nueva").val();
                var usuario_pass_nuevo_rep = $("#id_article_logged_profile_cambiar_pass_pass_nueva_rep").val();
                var params = "usuario_email="+usuario_email+"&usuario_pass_actual="+usuario_pass_actual+"&usuario_pass_nuevo="+usuario_pass_nuevo+"&usuario_pass_nuevo_rep="+usuario_pass_nuevo_rep;
                
                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "cambiar_password.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_cambiar_pass").innerHTML = xmlhttp.responseText;
                    }   
                }
                xmlhttp.send(params);
            }

            function poner_en_blanco_cambiar_pass(){
                document.getElementById("id_article_logged_profile_cambiar_pass_email").value = "";
                document.getElementById("id_article_logged_profile_cambiar_pass_pass_actual").value = "";
                document.getElementById("id_article_logged_profile_cambiar_pass_pass_nueva").value = "";
                document.getElementById("id_article_logged_profile_cambiar_pass_pass_nueva_rep").value = "";
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click Cerrar Sesion button
            //No se ha usado esto por problemas con la libreria l10n.js
            //var titulo_cerrar_sesion = imprimir_mensaje_notificacion_cerrar_sesion_titulo();
            //var subtitulo_cerrar_sesion = imprimir_mensaje_notificacion_cerrar_sesion_subtitulo();
            //var boton_ok_cerrar_sesion = imprimir_mensaje_notificacion_cerrar_sesion_boton_ok();
            //var boton_ko_cerrar_sesion = imprimir_mensaje_notificacion_cerrar_sesion_boton_ko();
            $("#btn_logged_profile_close_session").bind("tap", function(){
                Tako.Notification.confirm("logout", 
                    imprimir_mensaje_notificacion_cerrar_sesion_titulo(), 
                    imprimir_mensaje_notificacion_cerrar_sesion_subtitulo(), 
                    imprimir_mensaje_notificacion_cerrar_sesion_boton_ok(), 
                    imprimir_mensaje_notificacion_cerrar_sesion_boton_ko(),
                    function(result){
                        if(result == true){
                            cerrar_sesion_eliminar_usuario_botones_radio();
                            cerrar_sesion_datos_localStorage();
                            setTimeout(function(){
                                redirect("article_index/section_index");
                            },0);
                        }
                        else{
                        }
                    }
                );
            });

            function cerrar_sesion_eliminar_usuario_botones_radio(){
                myRadioFM.disable();
                document.getElementById('btn_logged_btn_pause').classList.remove('orange');
                document.getElementById('btn_logged_btn_pause').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('orange');
                document.getElementById('btn_logged_btn_play').classList.add('blue');
                document.getElementById('btn_logged_btn_play').classList.remove('animated');

                document.getElementById('btn_notlogged_btn_pause').classList.remove('orange');
                document.getElementById('btn_notlogged_btn_pause').classList.add('blue');
                document.getElementById('btn_notlogged_btn_play').classList.remove('orange');
                document.getElementById('btn_notlogged_btn_play').classList.add('blue');
                document.getElementById('btn_notlogged_btn_play').classList.remove('animated');
            }

            function cerrar_sesion_datos_localStorage(){
                //Habrá que limpiar simplemente los datos de la sesión, los almacenados en localStorage o sessionStorage
                //localStorage.clear();

                localStorage.removeItem('codigo_usuario');
                //localStorage.removeItem('codigo_emision');
                //localStorage.removeItem('codigo_emisora');
                localStorage.removeItem('codigo_emisora_seleccionada');
                localStorage.removeItem('seleccionado_alguna_vez');
            }


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click Position
            /*document.getElementById("section_logged_position").addEventListener("click",function(){
                if (localStorage.getItem('mapa_loaded') != true){
                    load_map();
                    localStorage.setItem('mapa_loaded',true);
                }
            });*/

            /*
            function load_map(){
                var map = L.map('map').setView([localStorage.getItem('mylatit'), localStorage.getItem('mylongit')], 13);

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    maxZoom: 18,
                    id: 'imagonbar.negn87jj',
                    accessToken: 'pk.eyJ1IjoiaW1hZ29uYmFyIiwiYSI6ImNpZWpvYWpreTAwNXJzemx6N2dpMW9tODYifQ.nPeFdwjNzhjPuJCgAXHl4g'
                }).addTo(map);

                var marker = L.marker([localStorage.getItem('mylatit'), localStorage.getItem('mylongit')]).addTo(map);
                marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
            }
            */


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click reload position
            document.getElementById("id_article_logged_profile_btn_reload_position").addEventListener("click",function(){
                var cargando_pos_actual = navigator.mozL10n.get("id_gps_info");            
                Tako.Notification.loading(cargando_pos_actual, 1, function(){
                    geoPos_manual();
                    show_content_bd_radio_ui_logged_json(localStorage.getItem("last_codigo_emisora"));
                });

            });

            function geoPos_manual(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_manual, errorFunction_manual);
                    //navigator.geolocation.watchPosition(getLatituteLongitude, errorFunction,geo_options);
                } else {
                    console.log("Errorr");
                    //if (localStorage.getItem('notif_gps' == false)){
                        show_notify_gps_desactivated();
                    //}
                }
            }

            // Error callback function
            function errorFunction_manual(pos) {
                console.log('Error!');
                //if (localStorage.getItem('notif_gps' == false)){
                    show_notify_gps_desactivated();
                //}
            }

            // Success callback function
            function getLatituteLongitude_manual(pos) {
                //localStorage.setItem('notif_gps', true);

                var mylat = pos.coords.latitude;
                mylat = redondeo(mylat,6);

                var mylong = pos.coords.longitude;
                mylong = redondeo(mylong,6);

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat +", "+ mylong +"]"; 

                localStorage.setItem('mylatit', mylat);
                localStorage.setItem('mylongit', mylong);

                var direccionObtenida = "";
                var direccionNoObtenida = "error city";
                
                var array_data = {"format":"json","lat": mylat, "lon": mylong, "zoom": 18, "addressdetails": 1};
                var url = "https://nominatim.openstreetmap.org/reverse?";

                $.getJSON(url, array_data, function(posic) {
                    var mycity = "";
                    if (posic.address.county){
                        mycity = posic.address.county;
                    }
                    else{
                        if (posic.address.city){
                            mycity = posic.address.city;
                        }
                        else{
                            if (posic.address.village){
                            mycity = posic.address.village;
                            }
                            else{
                                if (posic.address.town){
                                    mycity = posic.address.town;
                                }
                            }
                        }
                    }
                    if ((posic.address.state)&&(posic.address.country)){
                        mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                        document.getElementById('id_article_logged_profile_posicion').value = mycity;
                        localStorage.setItem('myposicion', mycity);
                        //console.log(mycity);
                    }
                });
            }


        //LOGGED -> PROFILE -- POSICION FIJA -- BURGOS
            /*
            document.getElementById("id_article_logged_profile_btn_position_burgos").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var cargando_pos_actual = navigator.mozL10n.get("id_gps_info");            
                    Tako.Notification.loading(cargando_pos_actual, 1, function(){
                        geoPos_manual_burgos();
                    });
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });

            function geoPos_manual_burgos(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_manual_burgos, errorFunction_manual_burgos);
                } else {
                    console.log("Errorr");
                    show_notify_gps_desactivated();
                }
            }

            function errorFunction_manual_burgos(pos) {
                console.log('Error!');
                show_notify_gps_desactivated();
            }

            function getLatituteLongitude_manual_burgos(pos) {
                var mylat = "42.3475";
                mylat = redondeo(mylat,6);

                var mylong = "-3.6920";
                mylong = redondeo(mylong,6);

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat +", "+ mylong +"]"; 

                localStorage.setItem('mylatit', mylat);
                localStorage.setItem('mylongit', mylong);

                var direccionObtenida = "";
                var direccionNoObtenida = "error city";
                
                var array_data = {"format":"json","lat": mylat, "lon": mylong, "zoom": 18, "addressdetails": 1};
                var url = "https://nominatim.openstreetmap.org/reverse?";

                $.getJSON(url, array_data, function(posic) {
                    var mycity = "";
                    if (posic.address.county){
                        mycity = posic.address.county;
                    }
                    else{
                        if (posic.address.city){
                            mycity = posic.address.city;
                        }
                        else{
                            if (posic.address.village){
                            mycity = posic.address.village;
                            }
                            else{
                                if (posic.address.town){
                                    mycity = posic.address.town;
                                }
                            }
                        }
                    }
                    if ((posic.address.state)&&(posic.address.country)){
                        mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                        document.getElementById('id_article_logged_profile_posicion').value = mycity;
                        localStorage.setItem('myposicion', mycity);
                    }
                });
            }
            */
        

        //LOGGED -> PROFILE -- POSICION FIJA -- DONOSTI
            /*
            document.getElementById("id_article_logged_profile_btn_position_donosti").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var cargando_pos_actual = navigator.mozL10n.get("id_gps_info");            
                    Tako.Notification.loading(cargando_pos_actual, 1, function(){
                        geoPos_manual_donosti();
                    });
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });

            function geoPos_manual_donosti(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_manual_donosti, errorFunction_manual_donosti);
                } else {
                    console.log("Errorr");
                    show_notify_gps_desactivated();
                }
            }

            function errorFunction_manual_donosti(pos) {
                console.log('Error!');
                show_notify_gps_desactivated();
            }

            function getLatituteLongitude_manual_donosti(pos) {
                var mylat = "43.317793";
                mylat = redondeo(mylat,6);

                var mylong = "-1.981424";
                mylong = redondeo(mylong,6);

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat +", "+ mylong +"]"; 

                localStorage.setItem('mylatit', mylat);
                localStorage.setItem('mylongit', mylong);

                var direccionObtenida = "";
                var direccionNoObtenida = "error city";
                
                var array_data = {"format":"json","lat": mylat, "lon": mylong, "zoom": 18, "addressdetails": 1};
                var url = "https://nominatim.openstreetmap.org/reverse?";

                $.getJSON(url, array_data, function(posic) {
                    var mycity = "";
                    if (posic.address.county){
                        mycity = posic.address.county;
                    }
                    else{
                        if (posic.address.city){
                            mycity = posic.address.city;
                        }
                        else{
                            if (posic.address.village){
                            mycity = posic.address.village;
                            }
                            else{
                                if (posic.address.town){
                                    mycity = posic.address.town;
                                }
                            }
                        }
                    }
                    if ((posic.address.state)&&(posic.address.country)){
                        mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                        document.getElementById('id_article_logged_profile_posicion').value = mycity;
                        localStorage.setItem('myposicion', mycity);
                    }
                });
            }
            */
        

        //LOGGED -> PROFILE -- POSICION FIJA -- MALAGA
            document.getElementById("id_article_logged_profile_btn_position_malaga").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var cargando_pos_actual = navigator.mozL10n.get("id_gps_info");            
                    Tako.Notification.loading(cargando_pos_actual, 1, function(){
                        geoPos_manual_malaga();
                    });
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });

            function geoPos_manual_malaga(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_manual_malaga, errorFunction_manual_malaga);
                } else {
                    console.log("Errorr");
                    show_notify_gps_desactivated();
                }
            }

            function errorFunction_manual_malaga(pos) {
                console.log('Error!');
                show_notify_gps_desactivated();
            }

            function getLatituteLongitude_manual_malaga(pos) {
                var mylat = "36.43";
                mylat = redondeo(mylat,6);

                var mylong = "-4.25";
                mylong = redondeo(mylong,6);

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat +", "+ mylong +"]"; 

                localStorage.setItem('mylatit', mylat);
                localStorage.setItem('mylongit', mylong);

                var direccionObtenida = "";
                var direccionNoObtenida = "error city";
                
                var array_data = {"format":"json","lat": mylat, "lon": mylong, "zoom": 18, "addressdetails": 1};
                var url = "https://nominatim.openstreetmap.org/reverse?";

                $.getJSON(url, array_data, function(posic) {
                    var mycity = "";
                    if (posic.address.county){
                        mycity = posic.address.county;
                    }
                    else{
                        if (posic.address.city){
                            mycity = posic.address.city;
                        }
                        else{
                            if (posic.address.village){
                            mycity = posic.address.village;
                            }
                            else{
                                if (posic.address.town){
                                    mycity = posic.address.town;
                                }
                            }
                        }
                    }
                    if ((posic.address.state)&&(posic.address.country)){
                        mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                        document.getElementById('id_article_logged_profile_posicion').value = mycity;
                        localStorage.setItem('myposicion', mycity);
                    }
                });
            }
            

        //LOGGED -> PROFILE -- POSICION FIJA -- TORREVIEJA
            document.getElementById("id_article_logged_profile_btn_position_torrevieja").addEventListener("click",function(){
                var online = Tako.Connection.isOnline();
                if (online){
                    var cargando_pos_actual = navigator.mozL10n.get("id_gps_info");            
                    Tako.Notification.loading(cargando_pos_actual, 1, function(){
                        geoPos_manual_torrevieja();
                    });
                }
                else{
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                    });
                }
            });

            function geoPos_manual_torrevieja(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_manual_torrevieja, errorFunction_manual_torrevieja);
                } else {
                    console.log("Errorr");
                    show_notify_gps_desactivated();
                }
            }

            function errorFunction_manual_torrevieja(pos) {
                console.log('Error!');
                show_notify_gps_desactivated();
            }

            function getLatituteLongitude_manual_torrevieja(pos) {
                var mylat = "37.9924";
                mylat = redondeo(mylat,6);

                var mylong = "-0.6725";
                mylong = redondeo(mylong,6);

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat +", "+ mylong +"]"; 

                localStorage.setItem('mylatit', mylat);
                localStorage.setItem('mylongit', mylong);

                var direccionObtenida = "";
                var direccionNoObtenida = "error city";
                
                var array_data = {"format":"json","lat": mylat, "lon": mylong, "zoom": 18, "addressdetails": 1};
                var url = "https://nominatim.openstreetmap.org/reverse?";

                $.getJSON(url, array_data, function(posic) {
                    var mycity = "";
                    if (posic.address.county){
                        mycity = posic.address.county;
                    }
                    else{
                        if (posic.address.city){
                            mycity = posic.address.city;
                        }
                        else{
                            if (posic.address.village){
                            mycity = posic.address.village;
                            }
                            else{
                                if (posic.address.town){
                                    mycity = posic.address.town;
                                }
                            }
                        }
                    }
                    if ((posic.address.state)&&(posic.address.country)){
                        mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                        document.getElementById('id_article_logged_profile_posicion').value = mycity;
                        localStorage.setItem('myposicion', mycity);
                    }
                });
            }

        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click Eliminar Usuario button
            //var titulo_eliminar_cuenta = imprimir_mensaje_notificacion_eliminar_cuenta_titulo();
            //var subtitulo_eliminar_cuenta = imprimir_mensaje_notificacion_eliminar_cuenta_subtitulo();
            //var boton_ok_eliminar_cuenta = imprimir_mensaje_notificacion_eliminar_cuenta_boton_ok();
            //var boton_ko_eliminar_cuenta = imprimir_mensaje_notificacion_eliminar_cuenta_boton_ko();
            document.getElementById("id_article_logged_profile_eliminar_usuario_btn_eliminar").addEventListener("click",function() {
                var email_valido = false;
                var valor_email = "";

                var password_vacia = false;
                var password_pequenia = false;
                var valor_password = "";
                var text = "";

                //Comprobacion email
                valor_email = document.getElementById("id_article_logged_profile_eliminar_usuario_email").value;
                if (validarEmailRegExp(valor_email)){
                    email_valido = true;
                    text += imprimir_errores_email_valido();    
                }

                //Comprobacion password
                valor_password = document.getElementById("id_article_logged_profile_eliminar_usuario_pass").value;
                if (validarPassRegExp(valor_password)){
                    password_vacia = true;
                    text += imprimir_errores_password_vacia();
                }else{
                    if (validarTextoTamanioMinimo(valor_password)) {
                        password_pequenia = true;                           
                        text += imprimir_errores_password_pequenia();
                    }
                }

                if (email_valido || password_vacia || password_pequenia){
                    var error_global = navigator.mozL10n.get("id_error");
                    Tako.Notification.error("deny", error_global, text, null, function(){
                    });                
                }
                else{
                    //Comprobacion usuario en db server
                    var existe = "";
                    comprobar_usuario_logged_server(function(existe){
                        if (existe == "email" || existe == "emailclave" || existe == "emailclaveusuarioidentificado"){
                            if (existe == "email") {
                                text += imprimir_errores_identificar_usuario_email_inexistente();
                            }
                            else{
                                if (existe == "emailclave") {
                                    text += imprimir_errores_identificar_usuario_email_clave_no_coinciden();
                                }
                                else{
                                    if (existe == "emailclaveusuarioidentificado") {
                                        text += imprimir_errores_identificar_usuario_email_clave_usuario_identificado();
                                    }
                                }
                            }
                            var error_global = navigator.mozL10n.get("id_error");
                            Tako.Notification.error("deny", error_global, text, null, function(){
                            });                
                        }
                        else{
                            function callbacks(result){ 
                                if (result == true){
                                    cerrar_sesion_eliminar_usuario_botones_radio();
                                    eliminar_usuario_server();
                                    eliminar_usuario_datos_localStorage();
                                    setTimeout(function(){
                                        redirect("article_index/section_index");
                                    },0);
                                }else{
                                    setTimeout(function(){
                                        redirect("article_logged_profile/section_logged_profile");
                                    },0);
                                }
                                poner_en_blanco_aniadir_usuario_logged();
                            };
                            Tako.Notification.confirm("unlink", 
                                    imprimir_mensaje_notificacion_eliminar_cuenta_titulo(),
                                    imprimir_mensaje_notificacion_eliminar_cuenta_subtitulo(),
                                    imprimir_mensaje_notificacion_eliminar_cuenta_boton_ok(),
                                    imprimir_mensaje_notificacion_eliminar_cuenta_boton_ko(),
                                    callbacks);
                        }
                    });
                }
            });

            //para ver si existe el usuario en la bd antes de borrarlo
            function comprobar_usuario_logged_server(callback){
                var usuario_email = $("#id_article_logged_profile_eliminar_usuario_email").val();
                var usuario_pass = $("#id_article_logged_profile_eliminar_usuario_pass").val();
                var cod_usu = localStorage.getItem('codigo_usuario');
                var params = "usuario_pass="+usuario_pass+"&usuario_email="+usuario_email+"&usuario_cod="+cod_usu;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "comprobar_usuario_a_eliminar.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(params);
            }

            function eliminar_usuario_server(){
                var usuario_email = $("#id_article_logged_profile_eliminar_usuario_email").val();
                var usuario_pass = $("#id_article_logged_profile_eliminar_usuario_pass").val();
                var params = "usuario_email="+usuario_email+"&usuario_pass="+usuario_pass;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "delete_usuario.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_delete_usuario").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function poner_en_blanco_aniadir_usuario_logged(){
                document.getElementById("id_article_logged_profile_eliminar_usuario_email").value = "";
                document.getElementById("id_article_logged_profile_eliminar_usuario_pass").value = "";
            }

            function eliminar_usuario_datos_localStorage(){
                //Habrá que limpiar simplemente los datos de la sesión, los almacenados en localStorage o sessionStorage
                //localStorage.clear();

                localStorage.removeItem('codigo_usuario');
                localStorage.removeItem('codigo_emision');
                localStorage.removeItem('codigo_emisora');
                localStorage.removeItem('codigo_emisora_seleccionada');
                localStorage.removeItem('seleccionado_alguna_vez');
                localStorage.removeItem('info_ppal_notlogged_visto');
                localStorage.removeItem('info_ppal_logged_visto');
            }

        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> Click Share button
            //var titulo_compartir = imprimir_mensaje_notificacion_compartir_titulo();
            //var subtitulo_compartir = imprimir_mensaje_notificacion_compartir_subtitulo();
            //var boton_ok_compartir = imprimir_mensaje_notificacion_compartir_boton_ok();
            //var boton_ko_compartir = imprimir_mensaje_notificacion_compartir_boton_ko();
            /*
            $("#btn_logged_profile_share_notification_firefoxos").bind("tap", function(){
                Tako.Notification.confirm("share", 
                        imprimir_mensaje_notificacion_compartir_titulo(),
                        imprimir_mensaje_notificacion_compartir_subtitulo(),
                        imprimir_mensaje_notificacion_compartir_boton_ok(),
                        imprimir_mensaje_notificacion_compartir_boton_ko(),
                        callback);
                function callback(result){
                    if(result){
                        var myURL = encodeURI("https://plus.google.com/+ImanolGonBar/posts");
                        new MozActivity({
                            name: "share",
                            data: {
                                //type: "url", // Possibly text/html in future versions,
                                number: 1,
                                url: myURL,
                            }
                        });
                    }
                }

            });
            $("#btn_logged_profile_share_notification_others").bind("tap", function(){
                Tako.Notification.confirm("share", 
                        imprimir_mensaje_notificacion_compartir_titulo(),
                        imprimir_mensaje_notificacion_compartir_subtitulo(),
                        imprimir_mensaje_notificacion_compartir_boton_ok(),
                        imprimir_mensaje_notificacion_compartir_boton_ko(),
                        callback);
                function callback(result){
                    if(result){
                        console.log("others");
                    }
                }
            });
            */
            /*function compartir_app(){
                var share = document.getElementById("btn_logged_profile_share_notification");
                if (share) {
                    share.click = function () {
                        new MozActivity({
                            name: "share",
                            data: {
                                //type: "url", // Possibly text/html in future versions,
                                number: 1,
                                url: "https://plus.google.com/+ImanolGonBar/posts"
                            }
                        });
                    };
                }
            }*/


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> LISTADO DE COMENTARIOS Y ADD COMMENT
            
            document.getElementById('btn_logged_profile_listado_comentarios').addEventListener('click', function(){
                var variable_profile_listado_comentarios_info_titulo = navigator.mozL10n.get("id_info");
                var variable_profile_listado_comentarios_info_texto = navigator.mozL10n.get("id_profile_listado_comentarios_info_texto");
                Tako.Notification.custom(variable_profile_listado_comentarios_info_titulo, variable_profile_listado_comentarios_info_texto, true,"",null,function(){});
            });

            $("#section_logged_profile_listado_comentarios").on("load", function(){
                listar_comentarios_propios_usuario_perfil();
            });

            //**** **** **** **** Other Part **** **** **** ****
            //LOGGED -> PROFILE -> ADD COMMENT
                document.getElementById("id_article_logged_profile_btn_guardar_comentario").addEventListener("click",function() {
                    var comentario_vacia = false;
                    var comentario_pequenia = false;
                    var comentario_grande = false;
                    var valor_comentario = "";
                    var text = "";

                    //Comprobacion comentario
                    valor_comentario = document.getElementById("id_article_logged_profile_listado_comentario_usuario_textarea").value;
                    if (validarComentarioRegExp(valor_comentario)){
                        comentario_vacia = true;
                        text += imprimir_errores_comentario_vacia();
                    }else{
                        if (validarTextoTamanioMinimoComentario(valor_comentario)){
                            comentario_pequenia = true;
                            text += imprimir_errores_comentario_pequenia();
                        }
                        else{
                            if (validarTextoTamanioMaximoComentario(valor_comentario)){
                            comentario_grande = true;
                            text += imprimir_errores_comentario_grande();
                            }
                        }
                    }
                    if ((comentario_vacia) || (comentario_pequenia) || (comentario_grande)){
                        var error_global = navigator.mozL10n.get("id_error");
                        Tako.Notification.error("deny", error_global, text, null, function(){
                        });                
                    }
                    else{
                        //Comprobacion comentario unico diario en db server
                        var existe = "";
                        comprobacion_logged_comentario_por_dia_server(function(existe){
                            if (existe == "yahaycomentario"){
                                text += imprimir_errores_add_comment_diario_ya_existe();
                                Tako.Notification.error("deny", "Error!!",text, null, function(){
                                });                
                            }
                            else{
                                var correcto_global = navigator.mozL10n.get("id_correcto");
                                var comentaio_aniadido_global = navigator.mozL10n.get("id_comentario_aniadido");
                                Tako.Notification.success("ok", correcto_global, comentaio_aniadido_global, null, function(){
                                    aniadir_comentario_server();
                                    listar_comentarios_propios_usuario_perfil();
                                    poner_en_blanco_aniadir_comment();
                                });
                                listar_comentarios_propios_usuario_perfil();
                            }
                        });
                    }
                });

                //Comprobación que a diario, un usuario solo pueda escribir un comentario
                function comprobacion_logged_comentario_por_dia_server(callback){
                    var cod_usuario = localStorage.getItem('codigo_usuario');
                    var params = "usuario_cod="+cod_usuario;

                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "comprobar_comentario_diario_usuario.php";
                    
                    xmlhttp.onload = function(){ // when the request is loaded
                       callback(xmlhttp.responseText);// we're calling our method
                    };
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    //xmlhttp.setRequestHeader("Content-length", params.length);
                    //xmlhttp.setRequestHeader("Connection", "close");
                    xmlhttp.send(params);
                }


                function aniadir_comentario_server(){
                    var comentario_latitud = localStorage.getItem('mylatit');
                    var comentario_longitud = localStorage.getItem('mylongit');
                    var comentario_texto = document.getElementById("id_article_logged_profile_listado_comentario_usuario_textarea").value;
                    var cod_usuario = localStorage.getItem('codigo_usuario');
                    var params = "usuario_cod="+cod_usuario+"&comment_lat="+comentario_latitud+"&comment_long="+comentario_longitud+"&comment_text="+comentario_texto+"&cod_usuario="+cod_usuario;

                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "aniadir_comentario.php";
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    //xmlhttp.setRequestHeader("Content-length", params.length);
                    //xmlhttp.setRequestHeader("Connection", "close");

                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_aniadir_comentario").innerHTML = xmlhttp.responseText;
                        }   
                    }
                    xmlhttp.send(params);
                }

                function poner_en_blanco_aniadir_comment(){
                    document.getElementById("id_article_logged_profile_listado_comentario_usuario_textarea").value = "";
                }

                document.getElementById("id_logged_profile_list_comentarios").addEventListener("click",function(){
                    listar_comentarios_propios_usuario_perfil();
                });

                function listar_comentarios_propios_usuario_perfil(){
                    var cod_usu = localStorage.getItem('codigo_usuario');
                    var idioma = idioma_navegador();
                    var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_comentarios_usuario_concreto.php";
                    xmlhttp.open("POST", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    //xmlhttp.setRequestHeader("Content-length", params.length);
                    //xmlhttp.setRequestHeader("Connection", "close");

                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_usuario_logged_profile_listado_comentarios_propios").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send(params);
                }


            //**** **** **** **** Other Part **** **** **** ****
            //LOGGED -> PROFILE -> SHOW COMMENT
                //document.getElementById("id_btn_comments_logged").addEventListener("click",function(){
                /*
                $("#section_logged_profile_listado_comentarios").on("load", function(){
                    //show_content_bd_comentarios_logged();
                    //back_path_comment_logged_profile();
                    var cargando = navigator.mozL10n.get("id_cargando");            
                    Tako.Notification.loading(cargando, 1, function(){
                        show_content_bd_comentarios();
                    });
                });
                */
                
                //La funcion de scroll hacia abajo de momento solo se puede llamar una vez, por lo que está en la parte de INDEX

                //Esta función se llamará al pinchar en el botón de la interfaz inicial y se mostrará en la section correspondiente
                /*function show_content_bd_comentarios_logged(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_comentarios.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_comentarios_logged").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }*/

                $("#section_logged_comments").on("load", function(){
                    show_content_bd_comentarios();
                });
        
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> LISTADO FAVORITOS
            //document.getElementById("id_logged_profile_list_favoritos").addEventListener("click",function(){
            $("#section_logged_profile_listado_favoritos").on("load", function(){
                listar_favoritos_propios_usuario_perfil();
            });

            function listar_favoritos_propios_usuario_perfil(){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var idioma = idioma_navegador();
                var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_favoritos_usuario_concreto.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_profile_listado_favoritos_propios").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            document.getElementById('btn_logged_profile_listado_favoritos').addEventListener('click', function(){
                var variable_profile_listado_favoritos_info_titulo = navigator.mozL10n.get("id_info");
                var variable_profile_listado_favoritos_info_texto = navigator.mozL10n.get("id_profile_listado_favoritos_info_texto");
                Tako.Notification.custom(variable_profile_listado_favoritos_info_titulo, variable_profile_listado_favoritos_info_texto, true,"",null,function(){});
            });


        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> LISTADO PUNTUADOS
            //document.getElementById("id_logged_profile_list_puntuados").addEventListener("click",function(){
            $("#section_logged_profile_listado_puntuados").on("load", function(){
                listar_puntuados_propios_usuario_perfil();
            });

            function listar_puntuados_propios_usuario_perfil(){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var idioma = idioma_navegador();
                var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_puntuaciones_usuario_concreto.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_profile_listado_puntuados_propios").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }


            document.getElementById('btn_logged_profile_listado_puntuados').addEventListener('click', function(){
                var variable_profile_listado_puntuados_info_titulo = navigator.mozL10n.get("id_info");
                var variable_profile_listado_puntuados_info_texto = navigator.mozL10n.get("id_profile_listado_puntuados_info_texto");
                Tako.Notification.custom(variable_profile_listado_puntuados_info_titulo, variable_profile_listado_puntuados_info_texto, true,"",null,function(){});
            });

  
        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> PROFILE -> LISTADO AÑADIDOS
            //document.getElementById("id_logged_profile_list_aniadidos").addEventListener("click",function(){
            $("#section_logged_profile_listado_aniadidos").on("load", function(){
                listar_aniadidos_emisoras_propios_usuario_perfil();
                listar_aniadidos_emisiones_propios_usuario_perfil();
            });
            function listar_aniadidos_emisoras_propios_usuario_perfil(){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var idioma = idioma_navegador();
                var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisoras_usuario_concreto.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_profile_listado_aniadidos_emisoras_propios").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }
            function listar_aniadidos_emisiones_propios_usuario_perfil(){
                var cod_usu = localStorage.getItem('codigo_usuario');
                var idioma = idioma_navegador();
                var params = "usuario_cod="+cod_usu+"&idioma_naveg="+idioma;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "get_emisiones_usuario_concreto.php";
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_usuario_logged_profile_listado_aniadidos_emisiones_propios").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            document.getElementById('btn_logged_profile_listado_aniadidos').addEventListener('click', function(){
                var variable_profile_listado_aniadidos_info_titulo = navigator.mozL10n.get("id_info");
                var variable_profile_listado_aniadidos_info_texto = navigator.mozL10n.get("id_profile_listado_aniadidos_info_texto");
                Tako.Notification.custom(variable_profile_listado_aniadidos_info_titulo, variable_profile_listado_aniadidos_info_texto, true,"",null,function(){});
            });
        

        //**** **** **** **** Other Part **** **** **** ****
        //LOGGED -> INFO APP

            var viewURL_imagonbar_twitter = document.querySelector("#view_url_twitter_profile_imagonbar_firefoxos_logged");
            if (viewURL_imagonbar_twitter) {
                viewURL_imagonbar_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/imagonbar"
                        }
                    });
                };
            }
            var viewURL_imagonbar_googleplus = document.querySelector("#view_url_googleplus_profile_imagonbar_firefoxos_logged");
            if (viewURL_imagonbar_googleplus) {
                viewURL_imagonbar_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var writeEmail_imagonbar = document.querySelector("#write_email_imagonbar_firefoxos_logged");
            if (writeEmail_imagonbar) {
                writeEmail_imagonbar.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:imagonbar88@gmail.com"
                        }
                    });
                };
            }

            var viewURL_fmradiords_twitter = document.querySelector("#view_url_twitter_profile_fmradiords_firefoxos_logged");
            if (viewURL_fmradiords_twitter) {
                viewURL_fmradiords_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/fmradiords"
                        }
                    });
                };
            }
            var viewURL_fmradiords_twitter = document.querySelector("#id_registra_incidencia_btn_escribir_tw_logged");
            if (viewURL_fmradiords_twitter) {
                viewURL_fmradiords_twitter.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://twitter.com/fmradiords"
                        }
                    });
                };
            }
            var viewURL_fmradiords_googleplus = document.querySelector("#view_url_googleplus_profile_fmradiords_firefoxos_logged");
            if (viewURL_fmradiords_googleplus) {
                viewURL_fmradiords_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var viewURL_fmradiords_googleplus = document.querySelector("#id_registra_incidencia_btn_escribir_gp_logged");
            if (viewURL_fmradiords_googleplus) {
                viewURL_fmradiords_googleplus.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://plus.google.com/+ImanolGonBar"
                        }
                    });
                };
            }
            var writeEmail_fmradiords = document.querySelector("#write_email_fmradiords_firefoxos_logged");
            if (writeEmail_fmradiords) {
                writeEmail_fmradiords.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:fmradiordsapp@gmail.com"
                        }
                    });
                };
            }
            var writeEmail_fmradiords = document.querySelector("#id_registra_incidencia_btn_escribir_em_logged");
            if (writeEmail_fmradiords) {
                writeEmail_fmradiords.onclick = function () {
                    new MozActivity({
                        name: "new", // Possibly compose-mail in future versions
                        data: {
                            type : "mail",
                            url: "mailto:fmradiordsapp@gmail.com"
                        }
                    });
                };
            }


            //TakoJS
            var viewURL_takojs = document.querySelector("#view_url_takojs_firefoxos_logged");
            if (viewURL_takojs) {
                viewURL_takojs.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "http://www.takojs.com"
                        }
                    });
                };
            }
            var viewURL_takojs = document.querySelector("#view_url_takojs_others_logged");
            if (viewURL_takojs) {
                viewURL_takojs.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "http://www.takojs.com"
                        }
                    });
                };
            }    

            //Colaboradores
            var viewURL_openstreetview = document.querySelector("#view_url_openstreetview_firefoxos_logged");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://www.openstreetmap.org/"
                        }
                    });
                };
            }
            var viewURL_openstreetview = document.querySelector("#view_url_openstreetview_others_logged");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://www.openstreetmap.org/"
                        }
                    });
                };
            }

            //Mozilla Developer Network
            var viewURL_openstreetview = document.querySelector("#view_url_mdn_firefoxos_logged");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://developer.mozilla.org/es/"
                        }
                    });
                };
            }
            var viewURL_openstreetview = document.querySelector("#view_url_mdn_others_logged");
            if (viewURL_openstreetview) {
                viewURL_openstreetview.onclick = function () {
                    new MozActivity({
                        name: "view",
                        data: {
                            type: "url", // Possibly text/html in future versions
                            url: "https://developer.mozilla.org/es/"
                        }
                    });
                };
            }    


        //************************************Start*************************************************        
        //PRUEBAS
            /*
                document.getElementById("btn_pruebas_conectado").addEventListener("click",function() {
                    console.log("Está conectado a la red?? "+Tako.Connection.isOnline()); //Connection state
                    document.getElementById("prueba_p_1").innerHTML = Tako.Connection.isOnline();
                });
               
                var online = Tako.Connection.isOnline();
                var connectionChange = function(online){
                    if(online){
                        //alert("App now is online");
                        console.log("App now is online");
                    }
                    else{
                        //alert("App now is offline");
                        console.log("App now is offline");
                    }
                };
                document.getElementById("prueba_p_2").innerHTML = Tako.Connection.onChange(connectionChange);

                //PRUEBA IDIOMA NAVEGADOR
                document.getElementById("id_pruebas_idioma").addEventListener("click",function(){
                    document.getElementById("id_pruebas_idioma_text").innerHTML = idioma_navegador();
                });
            */

            

            //PRUEBAS -> NOTIFICACION
            /*function showNotification() {
                var title = "Mi conexión a internet";
                var optionsBody= "Esto es una notificación";
                var options;
                if (!navigator.onLine){
                   options = {
                       body: optionsBody
                   };
                }
                else{
                    var optionIcon = "https://dl.dropboxusercontent.com/u/5094436/fmradiordsapp/icons/icon_64.png";
                    //var optionIcon = "https://galan.ehu.es/imagonbar88/DAS/Pruebas/TakoJS/takojsEjemplo2/stylesheets/mine/icono_pua/icon_64.png";
                    //var optionIcon = "";
                    options ={
                        body: optionsBody,
                        icon: optionIcon,
                        id: 1           
                    };
                }
                if ("Notification" in window){
                   var n = new Notification(title, options); 
                   alert("a");
                }
                else if ("mozNotification" in navigator){
                    //var n = new Notification(title, options); 
                    //ForefoxOS 1.1
                    //var notificaction = navigator.moznotification.createNotification(title, options);
                    //notification.show();
                    
                    alert("b");
                }   
                else{
                    //other browsers: do nothing
                    alert("c");
                    //alert(title + ": " + options.body);
                }    
            }*/

            
            /* ESTO PUEDE SER UTIL, DE MOMENTO OCULTADO
            document.getElementById('showNotificationButton').addEventListener('click', function(){
            //document.querySelector('#showNotificationButton').addEventListener('click', function(){
                //showNotification();
                show_notify_close_session();
            });
            */


            //NOTIFICACION BATERIA BAJA
                /*document.getElementById('id_btn_battery_notify').addEventListener('click', function(){
                //document.querySelector('#showNotificationButton').addEventListener('click', function(){
                    comprobar_bateria_baja();
                });*/

                /* FUNCIONA DE AQUI PARA ABAJO, PERO QUITADO TEMPORALMENTE
                $("#section_notlogged_radio_ui").on("load", function(){
                    localStorage.setItem('bateria_baja',"false");
                    comprobar_bateria_baja();
                    if (localStorage.getItem('bateria_baja') == "true"){
                        if (localStorage.getItem('bateria_baja_aviso') == "false"){
                            low_battery_notification();
                        }     
                        localStorage.setItem('bateria_baja_aviso',"true");
                    }
                });

                $("#section_logged_radio_ui").on("load", function(){
                    localStorage.setItem('bateria_baja',"false");
                    comprobar_bateria_baja();
                    if (localStorage.getItem('bateria_baja') == "true"){
                        if (localStorage.getItem('bateria_baja_aviso') == "false"){
                            low_battery_notification();
                        }     
                        localStorage.setItem('bateria_baja_aviso',"true");
                    }
                });
                
                function comprobar_bateria_baja(){
                    var batteryLevel = navigator.battery.level * 100;
                    if (batteryLevel < 25){
                        console.log("Descargada " + batteryLevel);
                        localStorage.setItem('bateria_baja',"true");
                    }
                    else{
                        console.log("Todo OK " + batteryLevel);
                        if (localStorage.getItem('bateria_baja_aviso') == "true"){
                            localStorage.setItem('bateria_baja_aviso',"false");
                        } 
                        localStorage.setItem('bateria_baja',"false");
                    }
                }
                
                function low_battery_notification() {
                    var title = "Nivel batería bajo";
                    var optionsBody= "Conecte el terminal a la corriente";
                    var options;
                    if (!navigator.onLine){
                       options = {
                           body: optionsBody
                       };
                    }
                    else{
                        var optionIcon = "https://dl.dropboxusercontent.com/u/5094436/fmradiordsapp/icons/low_battery.svg";
                        options ={
                            body: optionsBody,
                            icon: optionIcon,
                            id: 1           
                        };
                    }
                    if ("Notification" in window){
                       var n = new Notification(title, options); 
                       console.log("a");
                    }
                    else if ("mozNotification" in navigator){
                        //var n = new Notification(title, options); 
                        //ForefoxOS 1.1
                        //var notificaction = navigator.moznotification.createNotification(title, options);
                        //notification.show();
                        
                        alert(title +"<br/> "+optionsBody);
                    }   
                    else{
                        alert(title +"<br/> "+optionsBody);
                    }    
                }
                */


            //************************************End***************************************************


        //************************************Start************************************************* 
        //DB LOCAL
            //Listar todas las emisoras almacenadas en local (IndexedDB)
            //$("#btn_get_all_emisoras").click(function(){
            /*
            document.getElementById("btn_get_all_emisoras").addEventListener("click",function() {
                var cargando = navigator.mozL10n.get("id_cargando");
                Tako.Notification.loading(cargando, 1, function(){console.log("Cargando listado...");});
                poner_en_blanco();
                var i=1;
                var objectStore = db.transaction(["table_radios"],"readonly").objectStore("table_radios");
                objectStore.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        $("#listado_elementos_sin_enlace_emisoras").append("<li><strong>"+ cursor.value.emisora_nombre +"</strong>"+
                                //"<small><a href=\"./mis_radios_seleccionada.html\" class=\"nounderline\">"+
                                "<small><a href=\"#\" class=\"nounderline\">"+
                                "Frecuencia: " + cursor.value.emisora_frecuencia +
                                "<br/>Latitud: " + cursor.value.emisora_latitud +
                                "<br/>Longitud: " + cursor.value.emisora_longitud +"</p></a></small></li>");
                        i = i + 1;
                        cursor.continue();
                    }
                    else {
                        console.log("No elements");
                    }
                };
            });

            //Listar todas los usuarios almacenados en local (IndexedDB)
            document.getElementById("btn_get_all_usuarios").addEventListener("click",function() {
                var cargando = navigator.mozL10n.get("id_cargando");
                Tako.Notification.loading(cargando, 1, function(){console.log("Cargando listado...");});
                poner_en_blanco();
                var i=1;
                var objectStore = db.transaction(["table_users"],"readonly").objectStore("table_users");
                objectStore.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        $("#listado_elementos_sin_enlace_usuarios").append("<li><strong>"+ cursor.value.nombre_user +"</strong>"+
                                "<small><a href=\"#\" class=\"nounderline\">"+
                                "Email: " + cursor.value.email_user +
                                "<br/>Registrado el : " + cursor.value.codigo_user.toString() +
                                "</p></a></small></li>");
                        i = i + 1;
                        cursor.continue();
                    }
                    else {
                        console.log("No elements");
                    }
                };
            });

            function poner_en_blanco(){
                //localStorage.clear();
                document.getElementById('listado_elementos_sin_enlace_usuarios').innerHTML = "";
                document.getElementById('listado_elementos_sin_enlace_emisoras').innerHTML = "";
            }
            */

            /*document.getElementById("id_article_pruebas_texto_comprobar").addEventListener("click",function() {
                var texto_valido = false;
                var valor_texto = "";

                //Comprobacion texto
                valor_texto = document.getElementById("id_article_pruebas_texto").value;
                if (validarFreqRegExp(valor_texto)){
                    texto_valido = true;
                }

                if (texto_valido){
                    Tako.Notification.error("deny", "Error!!","mal", null, function(){});                
                }
                else{
                    Tako.Notification.success("ok", "Correcto!!","Texto correcto", null, function(){},0);
                }
            });*/



            //************************************End***************************************************


        //************************************Start*************************************************        
        //DB SERVER
            //EMISORAS
                //Listar Emisoras
                /*
                document.getElementById("id_section_pruebas3_emisoras").addEventListener("click",function(){
                    show_content_bd_emisoras();
                });
                document.getElementById("load_ajax_emisoras").addEventListener("click",function(){
                //document.getElementById("section_pruebas3_emisoras").addEventListener("click",function(){
                    show_content_bd_emisoras();
                });
            
                function show_content_bd_emisoras(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_emisoras.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_emisoras").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }

            //EMISIONES
                //Listar Emisiones
                document.getElementById("id_section_pruebas3_emisiones").addEventListener("click",function(){
                    show_content_bd_emisiones();
                });

                document.getElementById("load_ajax_emisiones").addEventListener("click",function(){
                    show_content_bd_emisiones();
                });
            
                function show_content_bd_emisiones(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_emisiones.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_emisiones").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }

            //************************************End***************************************************


            //************************************ Start LISTADOS DB SERVER  **************************************        
            //EMISORAS TIPOS
                //Listar Emisoras Tipos
                document.getElementById("id_section_pruebas3_emisoras_tipos").addEventListener("click",function(){
                    show_content_bd_emisoras_tipos();
                });

                document.getElementById("load_ajax_emisoras_tipos").addEventListener("click",function(){
                    show_content_bd_emisoras_tipos();
                });
            
                function show_content_bd_emisoras_tipos(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_emisoras_tipos.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_emisoras_tipos").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }
            

            //EMISORAS TIPOS JSON
            //Listar Emisoras Tipos json
                    document.getElementById("id_section_pruebas3_emisoras_tipos_json").addEventListener("click",function(){
                        show_content_bd_emisoras_tipos_json();
                    });

                    document.getElementById("load_ajax_emisoras_tipos_json").addEventListener("click",function(){
                        show_content_bd_emisoras_tipos_json();
                    });
            

                    function show_content_bd_emisoras_tipos_json(){
                        var url = server_path + "get_emisoras_tipos_json.php";
                        $.getJSON(url, function(emisora_tipo) {
                            $.each(emisora_tipo, function(i,emisora_tipo){
                                var nueva_linea = 
                                    "<li><strong class=\"ver_texto_completo\">"
                                       + i + " -> " + emisora_tipo.cod_emisora_tipo + " -- " + //emisora_tipo.nombre_emisora_tipo + "--"+
                                        "<a id=\"" + emisora_tipo.nombre_emisora_tipo_es + "\">"+emisora_tipo.nombre_emisora_tipo_es+"</a>"+
                                    "</li>" ;

                                $('#txtBD_emisoras_tipos_json').append(nueva_linea);
                                document.getElementById(emisora_tipo.nombre_emisora_tipo_es).addEventListener("click",function(){
                                    alert(emisora_tipo.nombre_emisora_tipo_es);
                                });
                                
                                


                                //obtener_emisoras_tipos_local(emisora_tipo);
                            });
                        });
                    }
            */

                    //Añadir las emisoras cercanas que hay en la bd_server a la bd_local (IDDB)
                    /*function obtener_emisoras_tipos_local(row){
                        var transaction = db.transaction(["table_emisoras_tipos"],"readwrite");
                        transaction.oncomplete = function(event) {
                            console.log("OK");
                        };
                        transaction.onerror = function(event) {
                            console.log("KO");
                        };
                        var objectStore = transaction.objectStore("table_emisoras_tipos");
                        objectStore.add({cod_emisora: row.cod_emisora, nombre_emisora: row.nombre_emisora});
                    }*/

            //EMISORAS SON TIPOS
            //Listar Emisoras Son Tipos
                /*
                document.getElementById("id_section_pruebas3_emisoras_son_tipos").addEventListener("click",function(){
                    show_content_bd_emisoras_son_tipos();
                });

                document.getElementById("load_ajax_emisoras_son_tipos").addEventListener("click",function(){
                    show_content_bd_emisoras_son_tipos();
                });
            
                function show_content_bd_emisoras_son_tipos(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_emisoras_son_tipos.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_emisoras_son_tipos").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }

            //FAVORITOS
            //Listar Favoritos
                document.getElementById("id_section_pruebas3_favoritos").addEventListener("click",function(){
                    show_content_bd_favoritos();
                });

                document.getElementById("load_ajax_favoritos").addEventListener("click",function(){
                    show_content_bd_favoritos();
                });
            
                function show_content_bd_favoritos(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_favoritos.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_favoritos").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }
                */

            //AÑADIDOS
            //Listar Añadidas
                /*document.getElementById("load_ajax_aniadidas").addEventListener("click",function(){
                    show_content_bd_aniadidas();
                });*/
            
                /*function show_content_bd_aniadidas(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_emisiones_aniadidas.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_aniadidas").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }*/


                //PUNTUACIONES
                //Listar Puntuaciones
                /*
                document.getElementById("id_section_pruebas3_puntuaciones").addEventListener("click",function(){
                    show_content_bd_puntuadas();
                });
                
                document.getElementById("load_ajax_puntuaciones").addEventListener("click",function(){
                    show_content_bd_puntuadas();
                });
            
                function show_content_bd_puntuadas(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_puntuaciones.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_puntuaciones").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }


                //USUARIOS
                //Listar Usuarios
                document.getElementById("id_section_pruebas3_usuarios").addEventListener("click",function(){
                    //Tako.Notification.loading("Cargando", 2, function(){
                        show_content_bd_usuarios();
                    //});
                });
                document.getElementById("load_ajax_usuarios").addEventListener("click",function(){
                    show_content_bd_usuarios();
                });
            
                function show_content_bd_usuarios(){
                    var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                    var url = server_path + "get_usuarios.php";
                    xmlhttp.open("GET", url, true);
                    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("txtBD_usuarios").innerHTML = xmlhttp.responseText;
                        }
                    }
                    xmlhttp.send();
                }
                */

                

                

            //************************************ End LISTADOS DB SERVER *****************************************


        //************************************Start*************************************************      
        //PRUEBAS 4
            // file selection
            /*function fileSelectHandler(e) {
                // cancel event and hover styling
                FileDragHover(e);

                // fetch FileList object
                var files = e.target.files || e.dataTransfer.files;

                // process all File objects
                for (var i = 0, f; f = files[i]; i++) {
                    uploadFile(f);
                }

            }*/

            // upload JPEG files
            /*function uploadFile(file) {
                var xhr = new XMLHttpRequest({ mozSystem: true });
                var formData = new FormData();
                formData.append("thefile", file);
                if (xhr.upload && file.type == "image/jpeg" && file.size <= $id("MAX_FILE_SIZE").value) {
                    // start upload
                    xhr.open("POST", $id("upload").action, true);
                    xhr.setRequestHeader("Content-Type","multipart/form-data");
                    xhr.send(formData);
                }
            }*/

            /*function uploadFile(){
                var file = _("image1").files[0];
                formdata.append("file1", file);
                var url = server_path + "file_upload_parser.php";
                var ajax = new XMLHttpRequest({ mozSystem: true });
                ajax.upload.addEventListener("progress", myProgressHandler, false);
                ajax.addEventListener("load", myCompleteHandler, false);
                ajax.addEventListener("error", myErrorHandler, false);
                ajax.addEventListener("abort", myAbortHandler, false);
                ajax.open("POST", url, true); 
                ajax.setRequestHeader("Content-Type","multipart/form-data");
                ajax.send(formdata);
            }

            function myProgressHandler(event){
                _("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
                var percent = (event.loaded / event.total) * 100;
                _("progressBar").value = Math.round(percent);
                _("status").innerHTML = Math.round(percent)+"% uploaded... please wait";
            }
            function myCompleteHandler(event){
                _("status").innerHTML = event.target.responseText;
                _("progressBar").value = 0;
            }
            function myErrorHandler(event){
                _("status").innerHTML = "Upload Failed";
            }
            function myAbortHandler(event){
                _("status").innerHTML = "Upload Aborted";
            }*/


            // grab the canvas element, get the context for API access and 
            // preset some variables
            /*
            var canvas = document.querySelector( 'canvas' ),
                c = canvas.getContext( '2d' ),
                mouseX = 0,
                mouseY = 0,
                width = 300,
                height = 300,
                colour = 'hotpink',
                mousedown = false;

            // resize the canvas
            canvas.width = width;
            canvas.height = height;

            function draw() {
              if (mousedown) {
                // set the colour
                c.fillStyle = colour; 
                // start a path and paint a circle of 20 pixels at the mouse position
                c.beginPath();
                c.arc( mouseX, mouseY, 10 , 0, Math.PI*2, true );
                c.closePath();
                c.fill();
              }
            }

            // get the mouse position on the canvas (some browser trickery involved)
            canvas.addEventListener( 'mousemove', function( event ) {
              if( event.offsetX ){
                mouseX = event.offsetX;
                mouseY = event.offsetY;
              } else {
                mouseX = event.pageX - event.target.offsetLeft;
                mouseY = event.pageY - event.target.offsetTop;
              }
              // call the draw function
              draw();
            }, false );

            canvas.addEventListener( 'mousedown', function( event ) {
                mousedown = true;
            }, false );
            canvas.addEventListener( 'mouseup', function( event ) {
                mousedown = false;
            }, false );
            var link = document.createElement('a');
            link.innerHTML = 'download image';
            link.addEventListener('click', function(ev) {
                link.href = canvas.toDataURL();
                link.download = "mypainting.png";
            }, false);
            //document.body.appendChild(link);
            document.getElementById("pruebas4_3_p").appendChild(link);
            */


            //************************************End***************************************************


        //************************************Start*************************************************      
        //PONER CLAVEX
            //Este apartado se creo para asignar a los usuarios que estaban ya en la base de datos una clave hash según su clave de registro.
            //No lo borro porque en el futuro podrá servirnos, lo único, dejamos el apartado oculto en el aside.
            
            /*TEMP
            document.getElementById("id_article_poner_clavex_btn_indentify").addEventListener("click",function() {
                var email_valido = false;
                var valor_email = "";

                var password_vacia = false;
                var password_pequenia = false;
                var valor_password = "";

                //Comprobacion email
                valor_email = document.getElementById("id_article_poner_clavex_email").value;
                if (validarEmailRegExp(valor_email)){
                    email_valido = true;
                    text += imprimir_errores_email_valido();
                }

                //Comprobacion password
                valor_password = document.getElementById("id_article_poner_clavex_pass").value;
                if (validarPassRegExp(valor_password)){
                    password_vacia = true;
                    text += imprimir_errores_password_vacia();
                }else{
                    if (validarTextoTamanioMinimo(valor_password)) {
                        password_pequenia = true;                           
                        text += imprimir_errores_password_pequenia();
                    }
                }
                var text = "";
                if (email_valido || password_vacia || password_pequenia){
                    Tako.Notification.error("deny", "Error!!",text, null, function(){
                    });                
                }
                else{
                    //Comprobacion usuario en db server
                    var existe = "";
                    poner_clavex_server(function(existe){
                        //console.log(existe);
                        if (existe == "email" || existe == "emailclave" || existe == "clavexvacia"){
                            if (existe == "email") {
                                text += imprimir_errores_identificar_usuario_email_inexistente();
                            }
                            else{
                                if (existe == "emailclave") {
                                    text += imprimir_errores_identificar_usuario_email_clave_no_coinciden();
                                }
                                else{
                                    if (existe == "clavexvacia") {
                                        text += "Clave X estaba vacía, ya está repuesta :) ";
                                    }
                                }
                            }
                            if (existe == "email" || existe == "emailclave"){
                                Tako.Notification.error("deny", "Error!!",text, null, function(){
                                });                
                            }
                            else{
                                if (existe == "clavexvacia") {
                                    //console.log("No tenía clavex este usuario, se la vamos a poner");
                                    Tako.Notification.custom("Poner Clave X",text, true,"",null,function(){
                                        poner_clavex_reactivar_server();
                                        nuevo_poner_en_blanco_poner_clavex();
                                        //console.log("Clavex puesta");        
                                    });
                                }
                            }
                        }
                        else{
                            Tako.Notification.success("ok", "Correcto!!"," Cambio clave correcta", null, function(){
                                nuevo_poner_en_blanco_poner_clavex();
                                //console.log("ya tenía clavex este usuario");
                            });
                        }
                    });
                }
            });


            function poner_clavex_server(callback){
                var usuario_email = $("#id_article_poner_clavex_email").val();
                var usuario_pass = $("#id_article_poner_clavex_pass").val();
                var params = "usuario_pass="+usuario_pass+"&usuario_email="+usuario_email;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "poner_clavex_identificar_usuario.php";
                
                xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");
                TEMP */
                /*
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_identificar_usuario_index").innerHTML = xmlhttp.responseText;
                        document.getElementById("txtBD_identificar_usuario_index").value = xmlhttp.responseText;
                    }
                }
                */
                /*TEMP
                xmlhttp.send(params);
            }

            function poner_clavex_reactivar_server(){
                var usuario_email = $("#id_article_poner_clavex_email").val();
                var usuario_pass = $("#id_article_poner_clavex_pass").val();
                var params = "usuario_email="+usuario_email+"&usuario_pass="+usuario_pass;

                var xmlhttp = new XMLHttpRequest({ mozSystem: true });
                var url = server_path + "poner_clave_reactivar_usuario.php";
                TEMP */
                /*xmlhttp.onload = function(){ // when the request is loaded
                   callback(xmlhttp.responseText);// we're calling our method
                };*/
                /* TEMP
                xmlhttp.open("POST", url, true);
                xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                //xmlhttp.setRequestHeader("Content-length", params.length);
                //xmlhttp.setRequestHeader("Connection", "close");

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("txtBD_activar_usuario_poner_clavex").innerHTML = xmlhttp.responseText;
                    }
                }
                xmlhttp.send(params);
            }

            function nuevo_poner_en_blanco_poner_clavex(){
                document.getElementById("id_article_poner_clavex_email").value = "";
                document.getElementById("id_article_poner_clavex_pass").value = "";
                //document.getElementById("txtBD_identificar_usuario_index").value = "";
            }
            TEMP */
            //************************************End***************************************************


        //************************************Start**********************************************  
        //PLAY / PAUSE RADIO FM
            //NOTLOGGED -> PLAY
            document.getElementById('btn_notlogged_btn_play').addEventListener('click', function(){
                if (localStorage.getItem('last_nombre_emisora') == null){
                    var variable_no_emisora_seleccionada_inicial_play_titulo = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_play_titulo");
                    var variable_no_emisora_seleccionada_inicial_play_texto = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_play_texto");
                    Tako.Notification.error("deny", variable_no_emisora_seleccionada_inicial_play_titulo, variable_no_emisora_seleccionada_inicial_play_texto, null, function(){ });
                }else{
                    //reproduccion_radiofm("play");
                    reproduccion_radiofm("versionWEB");
                    /* versWEB */
                }
            }, false);

            //LOGGED -> PLAY
            document.getElementById('btn_logged_btn_play').addEventListener('click', function(){
                if (localStorage.getItem('last_nombre_emisora') == null){
                    var variable_no_emisora_seleccionada_inicial_play_titulo = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_play_titulo");
                    var variable_no_emisora_seleccionada_inicial_play_texto = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_play_texto");
                    Tako.Notification.error("deny", variable_no_emisora_seleccionada_inicial_play_titulo,variable_no_emisora_seleccionada_inicial_play_texto, null, function(){ });
                }else{
                    //reproduccion_radiofm("play");   
                    reproduccion_radiofm("versionWEB");
                    /* versWEB */
                }
            }, false);

            //NOTLOGGED -> PAUSE
            document.getElementById('btn_notlogged_btn_pause').addEventListener('click', function(){
                if (localStorage.getItem('last_nombre_emisora') == null){
                    var variable_no_emisora_seleccionada_inicial_pause_titulo = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_pause_titulo");
                    var variable_no_emisora_seleccionada_inicial_pause_texto = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_pause_texto");
                    Tako.Notification.error("deny", variable_no_emisora_seleccionada_inicial_pause_titulo, variable_no_emisora_seleccionada_inicial_pause_texto, null, function(){ });
                }else{
                    //reproduccion_radiofm("pause");
                    reproduccion_radiofm("versionWEB");
                    /* versWEB */
                }
            }, false);

            //LOGGED -> PAUSE
            document.getElementById('btn_logged_btn_pause').addEventListener('click', function(){
                if (localStorage.getItem('last_nombre_emisora') == null){
                    var variable_no_emisora_seleccionada_inicial_pause_titulo = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_pause_titulo");
                    var variable_no_emisora_seleccionada_inicial_pause_texto = navigator.mozL10n.get("id_no_emisora_seleccionada_inicial_pause_texto");
                    Tako.Notification.error("deny", variable_no_emisora_seleccionada_inicial_pause_titulo, variable_no_emisora_seleccionada_inicial_pause_texto, null, function(){ });
                }else{
                    //reproduccion_radiofm("pause");
                    reproduccion_radiofm("versionWEB");
                    /* versWEB */
                }
            }, false);

            //************************************End***************************************************
    

        //GEOPOSICIONAMIENTO
            function geoPos(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude, errorFunction);
                    //navigator.geolocation.watchPosition(getLatituteLongitude, errorFunction,geo_options);
                } else {
                    console.log("Errorr");
                    //if (localStorage.getItem('notif_gps' == false)){
                        show_notify_gps_desactivated();
                        //alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
                    //}
                }
            }
            // Error callback function
            function errorFunction(pos) {
                console.log('Error!');
                //if (localStorage.getItem('notif_gps' == false)){
                    show_notify_gps_desactivated();
                //}
            }

            //Para calcular los valores del gps redondeados, como maximo 6 decimales.
            function redondeo(numero, cuantos_decimales){
                var decimales = parseFloat(numero);
                var resultado = Math.round(decimales*Math.pow(10,cuantos_decimales))/Math.pow(10,cuantos_decimales);
                return resultado;
            }

            //Para evitar que recalcule la ciudad en donde esta el dispositivo si las coordenadas son casi iguales a las ultimas
            function distancia_entre_posiciones(lat1,long1,lat2,long2){
                //var dif_lat = lat1 - lat2;
                //var dif_long = long1 - long2;
                var dif_lat = ((lat1*lat1)/lat1) - ((lat2*lat2)/lat2);
                var dif_long = ((long1*long1)/long1) - ((long2*long2)/long2);
                var texto_return = "";

                //if ((dif_lat < 0.05) && (dif_long < 0.05)){
                //if ((dif_lat < 0.05) || (dif_long < 0.05)){
                if ((dif_lat < 0.3) || (dif_long < 0.3)){
                    //console.log("Misma posicion, no actualizar las coordenadas ni la ciudad [geoPos()]");
                    texto_return = "mismolugar";
                }
                else{
                    //console.log("Cambia la posicion, actualizar las coordenadas y la ciudad [geoPos()]");
                    texto_return = "diferentelugar";   
                }
                return texto_return;
            }

            // Success callback function
            function getLatituteLongitude(pos) {
                //localStorage.setItem('notif_gps', true);
                var mylat2 = "";
                var mylong2 = "";

                //var mylat2 = "43.317793"; //donosti
                //var mylat2 = "43.0124"; //reinosa
                mylat2 = pos.coords.latitude;
                mylat2 = redondeo(mylat2,6);

                //var mylong2 = "-1.981424";//donosti
                //var mylong2 = "-4.11689";//reinosa
                mylong2 = pos.coords.longitude;
                mylong2 = redondeo(mylong2,6);

                //console.log("[mylat2,mylong2],["+ mylat2 +", "+ mylong2 +"]");
                //console.log("[lStg.getItem('mylatit'),lStg.getItem('mylongit')],["+ localStorage.getItem('mylatit') +", "+ localStorage.getItem('mylongit') +"]");

                document.getElementById('id_article_logged_profile_coordenadas').value = "["+ mylat2 +", "+ mylong2 +"]"; 
                var distancia = distancia_entre_posiciones(localStorage.getItem('mylatit'),localStorage.getItem('mylongit'),mylat2,mylong2);
                
                //################# 2015-05-25
                //distancia = "diferentelugar";

                if (distancia == "mismolugar"){
                    if (localStorage.getItem('myposicion')){
                        document.getElementById('id_article_logged_profile_posicion').value = localStorage.getItem('myposicion');
                    }
                }
                else{
                    if (distancia == "diferentelugar"){
                        //alert("si cambio");
                        localStorage.setItem('mylatit', mylat2);
                        localStorage.setItem('mylongit', mylong2);

                        var direccionObtenida = "";
                        var direccionNoObtenida = "error city";
                        
                        var array_data = {"format":"json","lat": mylat2, "lon": mylong2, "zoom": 18, "addressdetails": 1};
                        var url = "https://nominatim.openstreetmap.org/reverse?";
                        //var url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=54.9824031826&lon=9.2833114795&zoom=18&addressdetails=1";

                        $.getJSON(url, array_data, function(posic) {
                            var mycity = "";
                            if (posic.address.county){
                                mycity = posic.address.county;
                            }
                            else{
                                if (posic.address.city){
                                    mycity = posic.address.city;
                                }
                                else{
                                    if (posic.address.village){
                                    mycity = posic.address.village;
                                    }
                                    else{
                                        if (posic.address.town){
                                            mycity = posic.address.town;
                                        }
                                    }
                                }
                            }
                            if ((posic.address.state)&&(posic.address.country)){
                                mycity = mycity + ", " + posic.address.state + ", " + posic.address.country;
                                document.getElementById('id_article_logged_profile_posicion').value = mycity;
                                localStorage.setItem('myposicion', mycity);
                                //console.log(mycity);
                                //alert(mycity);
                            }
                        });
                    }   
                }
            }    


        //REPRODUCCION
            function reproduccion_radiofm(tipo){
                if (tipo == "versionWEB"){
                    //console.log("VersionWEB");
                }
                else {
                    if (tipo == "pause"){
                        console.log("Pause --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                        myRadioFM.disable();
                        document.getElementById('btn_logged_btn_pause').classList.remove('blue');
                        document.getElementById('btn_logged_btn_pause').classList.add('orange');
                        document.getElementById('btn_logged_btn_play').classList.remove('orange');
                        document.getElementById('btn_logged_btn_play').classList.add('blue');
                        document.getElementById('btn_logged_btn_play').classList.remove('animated');
                        
                        document.getElementById('btn_notlogged_btn_pause').classList.remove('blue');
                        document.getElementById('btn_notlogged_btn_pause').classList.add('orange');
                        document.getElementById('btn_notlogged_btn_play').classList.remove('orange');
                        document.getElementById('btn_notlogged_btn_play').classList.add('blue');
                        document.getElementById('btn_notlogged_btn_play').classList.remove('animated');

                        localStorage.setItem('auto_rds_activado','false');
                    }
                    else{
                        if ((tipo == "cambio_frecuencia") || (tipo == "cambio_emisora") || (tipo == "resintoniza") || (tipo == "autords")){
                            if (tipo == "cambio_frecuencia"){
                                console.log("Cambio frecuencia --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                            }
                            else{
                                if (tipo == "cambio_emisora"){
                                    console.log("Cambio emisora --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                                }
                                else{
                                    if (tipo == "resintoniza"){
                                        console.log("Resintonía de emisora --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                                    }
                                    else{
                                        if (tipo == "autords"){
                                            console.log("Cambiando emisora automáticamente vía RDS --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                                        }
                                    }
                                }
                            }                            
                            myRadioFM.disable();
                            //enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                            //enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                            enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                        }
                        else{
                            if (tipo == "play"){
                                console.log("Play --> "+localStorage.getItem('last_nombre_emisora')+" - "+localStorage.getItem('last_frecuencia_emision'));
                                enableFMRadio(localStorage.getItem('last_frecuencia_emision'));    
                            }
                        }
                        if (tipo != "autords"){
                            //Colorear boton play/pause --> notlogged
                            document.getElementById('btn_notlogged_btn_pause').classList.remove('orange');
                            document.getElementById('btn_notlogged_btn_pause').classList.add('blue');
                            document.getElementById('btn_notlogged_btn_play').classList.remove('blue');
                            document.getElementById('btn_notlogged_btn_play').classList.add('orange');
                            document.getElementById('btn_notlogged_btn_play').classList.add('animated');
                            //Colorear boton play/pause --> logged
                            document.getElementById('btn_logged_btn_pause').classList.remove('orange');
                            document.getElementById('btn_logged_btn_pause').classList.add('blue');
                            document.getElementById('btn_logged_btn_play').classList.remove('blue');
                            document.getElementById('btn_logged_btn_play').classList.add('orange');
                            document.getElementById('btn_logged_btn_play').classList.add('animated');

                            //AUTO RDS
                            lanzar_autords();
                        }
                    }
                }
            }


        //AUTO RDS - Se ejecuta cuando esta en reproducción
            function posicion_diferente_autords(){
                if (localStorage.getItem('auto_rds_activado') == "true"){
                    var online = Tako.Connection.isOnline();
                    if (!online){
                        if (localStorage.getItem('auto_rds_offline') == "false"){
                            var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                            var disconnect_text_rds = navigator.mozL10n.get("id_desconectado_texto_rds");
                            Tako.Notification.error("deny", disconnect_title, disconnect_text_rds, null, function(){
                                if (localStorage.getItem('codigo_usuario')>0){
                                    setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                                }
                                else{
                                    setTimeout(function(){redirect("article_index/section_index");},0);
                                }
                            });
                            localStorage.setItem('auto_rds_offline','true');
                        }
                    }
                    else{
                        //Se tiene en cuenta que no haya alguna notificación abierta, y se cierran las que haya
                        //console.log(Tako.Notification);
                        
                        //En fase de pruebas, funciona bien cuando hay una notif, sino cierra notif muy rapido :(
                        //cerrar_notif();
                        
                        abrir_notif();
                    }
                }
            }

            function cerrar_notif(){
                Tako.Notification.hide();
            }

            function abrir_notif(){
                var recargando_autords = navigator.mozL10n.get("id_recargando_autords");
                Tako.Notification.loading(recargando_autords, 3, function(){
                    geoPos_autords();
                    show_content_bd_radio_ui_logged_json(localStorage.getItem("last_codigo_emisora"));
                    show_content_bd_radio_ui_notlogged_json(localStorage.getItem("last_codigo_emisora"));
                });
            }

            function lanzar_autords(){
                console.log(document.getElementById('id_autords').checked);
                if (document.getElementById('id_autords').checked == true){
                    if (localStorage.getItem('auto_rds_activado') == "false"){
                        localStorage.setItem('auto_rds_activado','true');
                        clearInterval(intervalo);
                        intervalo = setInterval(posicion_diferente_autords,600000); //10min = 600000segs
                    }
                }
            }

            function parar_autords(){
                clearInterval(intervalo);
            }

        //GEOPOSICIONAMIENTO PUNTUAL AUTORDS
            function geoPos_autords(){
                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 5000, //tiempo maximo (en miliseg) que se le permite tomar al dispositivo para retornar a una posición
                  timeout           : 8000
                };
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatituteLongitude_autords, errorFunction_autords);
                    //navigator.geolocation.watchPosition(getLatituteLongitude, errorFunction,geo_options);
                } else {
                    console.log("Errorr");
                    show_notify_gps_desactivated();
                }
            }

            function errorFunction_autords(pos) {
                console.log('Error!');
                show_notify_gps_desactivated();
            }

            //Para calcular los valores del gps redondeados, como maximo 6 decimales.
            function redondeo_autords(numero, cuantos_decimales){
                var decimales = parseFloat(numero);
                var resultado = Math.round(decimales*Math.pow(10,cuantos_decimales))/Math.pow(10,cuantos_decimales);
                return resultado;
            }

            //Para evitar que recalcule la ciudad en donde esta el dispositivo si las coordenadas son casi iguales a las ultimas
            function distancia_entre_posiciones_autords(lat1,long1,lat2,long2){
                var dif_lat = ((lat1*lat1)/lat1) - ((lat2*lat2)/lat2);
                var dif_long = ((long1*long1)/long1) - ((long2*long2)/long2);
                var texto_return = "";

                //if ((dif_lat < 0.3) && (dif_long < 0.3)){
                if ((dif_lat < 0.3) || (dif_long < 0.3)){
                    //console.log("AUTORDS - No actualizar coordenadas y listado ppal");
                    texto_return = "mismolugar";
                }
                else{
                    //console.log("AUTORDS - Actualizar coordenadas y listado ppal");
                    texto_return = "diferentelugar";   
                }
                return texto_return;
            }

            function getLatituteLongitude_autords(pos) {
                var mylat_puntual_autords = pos.coords.latitude;
                mylat_puntual_autords = redondeo_autords(mylat_puntual_autords,6);

                var mylong_puntual_autords = pos.coords.longitude;
                mylong_puntual_autords = redondeo_autords(mylong_puntual_autords,6);

                localStorage.setItem('mylatit_puntual_autords', mylat_puntual_autords);
                localStorage.setItem('mylongit_puntual_autords', mylong_puntual_autords);

                var distancia = distancia_entre_posiciones_autords(localStorage.getItem('mylatit'),localStorage.getItem('mylongit'),mylat_puntual_autords,mylong_puntual_autords);
                //alert(distancia);
                //distancia = "diferentelugar";

                /*VERSION VIEJA*/
                    /*if (localStorage.getItem('codigo_usuario')>0){
                        if (distancia == "mismolugar"){
                            show_content_autords_puntual_json();
                        }
                        else{
                            show_content_autords_puntual_json();
                        }
                    }
                    else{
                        if (distancia == "diferentelugar"){
                            if (localStorage.getItem('codigo_usuario')>0){ // != null
                                show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                                show_content_autords_puntual_json();
                                reproduccion_radiofm("autords");
                            }
                            else{
                                show_content_bd_radio_ui_notlogged_json(localStorage.getItem('last_codigo_emisora'));
                                show_content_autords_puntual_json();
                                reproduccion_radiofm("autords");
                            }
                        }   
                    }*/

                /* 2015-06-22 FALTA ACTUALIZAR EL LISTADO PPAL TRAS AUTORDS*/

                if (localStorage.getItem('codigo_usuario')>0){
                    //logged
                    if (distancia == "mismolugar"){
                        show_content_autords_puntual_json();
                    }
                    else{
                        //distancia = "diferentelugar"
                        //show_content_bd_radio_ui_logged_json(localStorage.getItem('last_codigo_emisora'));
                        show_content_autords_puntual_json();
                        //reproduccion_radiofm("autords");
                        reproduccion_radiofm("versionWEB");
                        /* versWEB */
                    }
                }
                else{
                    //notlogged
                    if (distancia == "mismolugar"){
                        show_content_autords_puntual_json();
                    }
                    else{
                        //distancia = "diferentelugar"
                        //show_content_bd_radio_ui_notlogged_json(localStorage.getItem('last_codigo_emisora'));
                        show_content_autords_puntual_json();
                        //reproduccion_radiofm("autords");
                        reproduccion_radiofm("versionWEB");
                        /* versWEB */
                    }
                }

            } 
             
            function show_content_autords_puntual_json(){
                var cod_emisora = localStorage.getItem('last_codigo_emisora');
                var pos_latitud = localStorage.getItem('mylatit');
                var pos_longitud = localStorage.getItem('mylongit');
                var precision = "normal_prec";
                var url = server_path + "get_emision_puntual_json.php";
                var array_data = {"emisora_cod": cod_emisora, "posicion_lat": pos_latitud, "posicion_long": pos_longitud, "prec": precision};

                var cont = 0;
                var emision_frecuencia = 0;
                var nombre_emisora_json = "";
                var emision_codigo = 0;
                var req_dis = "";
                //var req_ena = "";

                //FUNCIONA COMO HASTA AHORA
                $.getJSON(url, array_data, function(emision_puntual) {
                    $.each(emision_puntual, function(j,emision_puntual){
                        //console.log(emision_puntual);
                        console.log(emision_puntual);
                        emision_codig = emision_puntual.cod_emision_json;
                        emision_frecuencia = emision_puntual.freq_emision_json;

                        if (localStorage.getItem('last_codigo_emision') != emision_codig){
                            //console.log(emision_frecuencia);
                            //nombre_emisora_json = localStorage.getItem('last_nombre_emisora');
                            localStorage.setItem('last_codigo_emision', emision_codig);
                            localStorage.setItem('last_frecuencia_emision', emision_frecuencia);
                            //console.log(emision_codigo);

                            document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = emision_frecuencia + " Mhz";
                            //document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML = nombre_emisora_json;

                            document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = emision_frecuencia  + " Mhz";
                            //document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = nombre_emisora_json;


                            //ESTOS SON PRUEBAS PARA QUE FUNCIONE EL RDS AUTO BIEN. NO LO CONSIGO 100%. 
                            // DURANTE UNA PASADA DE CADA DOS LO QUE SE DEBERÏA REPRODUCIR, NO LO ESTÁ HACIENDO
                            req_dis = myRadioFM.disable();
                            req_dis.onsuccess = enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                            //req_dis.onerror = console.log("eee");
                            //console.log(req_dis);
                            console.log("Cambiando emisora vía RDS");
                            //req_ena = enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                            //req_ena = myRadioFM.setFrequency(localStorage.getItem('last_frecuencia_emision'));
                            //console.log(req_ena);
                            
                        }
                        else{
                            console.log("No cambia la emisión vía RDS");
                        }

                    });
                    //Si al moverse de posición, no hay ningún elemento, entra por aqui.
                    //No haríamos nada
                });
            }


        //SELECCIONAR ELEMENTOS LISTADO
            //Al seleccionar en una emisión
            function seleccionar_emision(cod_emision,frec_emision,cod_emisora,nombre_emisora,es_fav){
                localStorage.setItem('seleccionado_alguna_vez',true);

                document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = frec_emision + " Mhz";
                document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML = nombre_emisora;

                document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = frec_emision  + " Mhz";
                document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = nombre_emisora;

                localStorage.setItem('codigo_emision',cod_emision);
                localStorage.setItem('codigo_emisora',cod_emisora);
                localStorage.setItem('codigo_emisora_seleccionada',cod_emisora);
                localStorage.setItem('last_codigo_emision',cod_emision);
                localStorage.setItem('last_frecuencia_emision',frec_emision);
                localStorage.setItem('last_codigo_emisora',cod_emisora);
                localStorage.setItem('last_nombre_emisora',nombre_emisora);

                //Eliminamos la clase "seleccionada" de todos los elementos del ul, de todos los div, tanto de logged como notlogged
                //LOGGED JSON
                var x = document.getElementById("txtBD_radio_ui_logged_json");
                var y = x.getElementsByTagName("div");
                for (var i = 0; i < y.length; i++) {
                    y[i].classList.remove("cada_emisora_seleccionada");
                }

                //NOTLOGGED JSON
                var x = document.getElementById("txtBD_radio_ui_notlogged_json");
                var y = x.getElementsByTagName("div");
                for (var i = 0; i < y.length; i++) {
                    y[i].classList.remove("cada_emisora_seleccionada");
                }

                //Añadimos la clase al div que se ha pulsado.
                document.getElementById(cod_emisora).classList.add("cada_emisora_seleccionada");

                //reproduccion_radiofm("cambio_emisora");
                reproduccion_radiofm("versionWEB");
                /* versWEB */
            }


            //Al seleccionar el icono de una emisión, accedemos a la información de la emisora
            function seleccionar_emision_icono(cod_emisora){
                var online = Tako.Connection.isOnline();
                if (!online){
                    var disconnect_title = navigator.mozL10n.get("id_desconectado_titulo");
                    var disconnect_text = navigator.mozL10n.get("id_desconectado_texto");
                    Tako.Notification.error("deny", disconnect_title, disconnect_text, null, function(){
                        setTimeout(function(){redirect("article_logged_radio_ui/section_logged_radio_ui");},0);
                    });
                }
                else{
                    localStorage.setItem('codigo_emisora_seleccionada',cod_emisora);
                    redirect("article_logged_info_emisora/section_logged_info_emisora");
                }
            }


            //Al seleccionar un elemento del listado RDS
            function seleccionar_rds(cod_emision,frec_emision,cod_emisora,nombre_emisora){
                document.getElementById("id_article_notlogged_frecuencia_emisora_seleccionada").innerHTML = frec_emision  + " Mhz";
                document.getElementById("id_article_notlogged_nombre_emisora_seleccionada").innerHTML = nombre_emisora;

                document.getElementById("id_article_logged_frecuencia_emisora_seleccionada").innerHTML = frec_emision  + " Mhz";
                document.getElementById("id_article_logged_nombre_emisora_seleccionada").innerHTML = nombre_emisora;

                localStorage.setItem('codigo_emision',cod_emision);
                localStorage.setItem('codigo_emisora',cod_emisora);
                localStorage.setItem('last_codigo_emision',cod_emision);
                localStorage.setItem('last_frecuencia_emision',frec_emision);
                localStorage.setItem('last_codigo_emisora',cod_emisora);
                localStorage.setItem('last_nombre_emisora',nombre_emisora);

                //Eliminamos la clase "seleccionada" de todos los elementos del ul, de todos los div, tanto de logged como notlogged
                //LOGGED JSON
                var x = document.getElementById("txtBD_rds_logged_json");
                var y = x.getElementsByTagName("div");
                for (var i = 0; i < y.length; i++) {
                    y[i].classList.remove("cada_emisora_seleccionada_rds");
                }

                //NOTLOGGED JSON
                var x = document.getElementById("txtBD_rds_notlogged_json");
                var y = x.getElementsByTagName("div");
                for (var i = 0; i < y.length; i++) {
                    y[i].classList.remove("cada_emisora_seleccionada_rds");
                }
                //Añadimos la clase al div que se ha pulsado.
                document.getElementById("emision_numero_"+cod_emision).classList.add("cada_emisora_seleccionada_rds");
                //document.getElementById("emision_"+cod_emisora).classList.add("cada_emisora_seleccionada");

                //reproduccion_radiofm("cambio_frecuencia");
                reproduccion_radiofm("versionWEB");
                /* versWEB */   
            }

        
        // RADIO FM , FUNCIONES VARIAS.
        /* versWEB */
        /*
            var myRadioFM = navigator.mozFM || navigator.mozFMRadio;
            myRadioFM.onantennaavailablechange = function onAntennaChange() {
                var textoAuric = "";
                if (myRadioFM.antennaAvailable){
                    textoAuric = "auriculares conectados";
                    console.log("Cambio estado auriculares: " + textoAuric);
                    localStorage.setItem("auric_conectados",true);
                    Tako.Notification.hide();
                    // If the FM radio is enabled or enabling when the antenna is unplugged, turn the FM radio on again.
                    if (!!window._previousFMRadioState || !!window._previousEnablingState) {
                        enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                    }
                }else{
                    textoAuric = "auriculares desconectados";
                    console.log("Cambio estado auriculares: " + textoAuric);
                    localStorage.setItem("auric_conectados",false);
                    var logo_auric = "<div class='icon headphones'></div>";
                    var variable_no_auriculares_titulo = navigator.mozL10n.get("id_no_auricular_titulo");
                    var variable_no_auriculares_texto = navigator.mozL10n.get("id_no_auricular_texto");
                    variable_no_auriculares_texto += logo_auric;
                    Tako.Notification.custom(variable_no_auriculares_titulo, variable_no_auriculares_texto, false,"",null,function(){
                    });
                    // Remember the current state of the FM radio
                    window._previousFMRadioState = myRadioFM.enabled;
                    window._previousEnablingState = enabling;
                    myRadioFM.disable();
                }
            };

            window.addEventListener("load", function load(event){
                console.log("iniciando tako.index.js");
                if (myRadioFM.antennaAvailable){
                    textoAuric = "auriculares conectados";
                    console.log("Inicialmente: " + textoAuric);
                    localStorage.setItem("auric_conectados",true);
                    Tako.Notification.hide();
                    // If the FM radio is enabled or enabling when the antenna is unplugged, turn the FM radio on again.
                    if (!!window._previousFMRadioState || !!window._previousEnablingState) {
                        enableFMRadio(localStorage.getItem('last_frecuencia_emision'));
                    }
                }else{
                    textoAuric = "auriculares desconectados";
                    console.log("Inicialmente: " + textoAuric);
                    localStorage.setItem("auric_conectados",false);
                    var logo_auric = "<div class='icon headphones'></div>";
                    var variable_no_auriculares_titulo = navigator.mozL10n.get("id_no_auricular_titulo");
                    var variable_no_auriculares_texto = navigator.mozL10n.get("id_no_auricular_texto");
                    variable_no_auriculares_texto += logo_auric;
                    Tako.Notification.custom(variable_no_auriculares_titulo, variable_no_auriculares_texto, false,"",null,function(){
                    });
                    // Remember the current state of the FM radio
                    window._previousFMRadioState = myRadioFM.enabled;
                    window._previousEnablingState = enabling;
                    myRadioFM.disable();
                }
            },false);
        */
    

        //INFO APP
        /*
        document.getElementById('id_section_index').addEventListener('click', function(){
            if (localStorage.getItem('codigo_usuario')>0){
                setTimeout(function(){ 
                    redirect("article_logged_radio_ui/section_logged_radio_ui");
                }, 0);
            }
            else{
                setTimeout(function(){ 
                    redirect("article_index/section_index");
                }, 0);
            }
        });*/
    });

    var intervalo = 0;
    localStorage.setItem('auto_rds_activado','false');
    localStorage.setItem('auto_rds_offline','false');
    


    //************************************Start*************************************************        

    //NOTIFICACIONES BARRA SUPERIOR
        //Notificación aviso cierre sesión inesperada por usuario inactivo
        function show_notify_close_session() {
            var title_notify_close_session = navigator.mozL10n.get("id_notify_title_close_session");
            var body_notify_close_session = navigator.mozL10n.get("id_notify_body_close_session");
            
            var title = title_notify_close_session;
            var optionsBody= body_notify_close_session;
            
            var options;
            if (!navigator.onLine){
               options = {
                   body: optionsBody
               };
            }
            else{
                var optionIcon = "https://dl.dropboxusercontent.com/u/5094436/fmradiordsapp/icons/icon_64.png";
                options ={
                    body: optionsBody,
                    icon: optionIcon,
                    id: 1           
                };
            }
            if ("Notification" in window){
                //var notif = new Notification(title, options); 
                if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if(!("permission" in Notification)) {
                            Notification.permission = permission;
                        }
                    });
                }

                if (Notification.permission === "granted") {
                    new Notification(title, options);
                }
            }
            else{
                if ("mozNotification" in navigator){
                //var n = new Notification(title, options); 
                //ForefoxOS 1.1
                    var notificaction = navigator.moznotification.createNotification(title, options);
                    notification.show();
                }   
                else{
                    //other browsers: do nothing
                    //alert(title + ": " + optionsBody);
                    alert("title : optionsBody");
                }    
            }
        }

        //Notificación aviso gps desactivado
        function show_notify_gps_desactivated() {
            //localStorage.setItem('notif_gps',true);
            var title_notify_gps_desact = navigator.mozL10n.get("id_notify_title_gps_desactivated");
            var body_notify_gps_desact = navigator.mozL10n.get("id_notify_body_gps_desactivated");
            
            var title = title_notify_gps_desact;
            var optionsBody= body_notify_gps_desact;
            
            var options;
            if (!navigator.onLine){
               options = {
                   body: optionsBody
               };
            }
            else{
                var optionIcon = "https://dl.dropboxusercontent.com/u/5094436/fmradiordsapp/icons/icon_64.png";
                options ={
                    body: optionsBody,
                    icon: optionIcon,
                    id: 1           
                };
            }
            if ("Notification" in window){
                //var notif = new Notification(title, options); 
                if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if(!("permission" in Notification)) {
                            Notification.permission = permission;
                        }
                    });
                }

                if (Notification.permission === "granted") {
                    new Notification(title, options);
                }
            }
            else{
                if ("mozNotification" in navigator){
                //var n = new Notification(title, options); 
                //ForefoxOS 1.1
                    var notificaction = navigator.moznotification.createNotification(title, options);
                    notification.show();
                }   
                else{
                    //other browsers: do nothing
                    //alert(title + ": " + optionsBody);
                    alert("title : optionsBody");
                }    
            }
        }

        //Notificación aviso sin conexión
        function show_notify_offline() {
            var title_notify_offline = navigator.mozL10n.get("id_notify_title_offline");
            var body_notify_offline = navigator.mozL10n.get("id_notify_body_offline");
            
            var title = title_notify_offline;
            var optionsBody= body_notify_offline;
            
            var options;
            if (!navigator.onLine){
               options = {
                   body: optionsBody
               };
            }
            else{
                var optionIcon = "https://dl.dropboxusercontent.com/u/5094436/fmradiordsapp/icons/icon_64.png";
                options ={
                    body: optionsBody,
                    icon: optionIcon,
                    id: 1           
                };
            }
            if ("Notification" in window){
                //var notif = new Notification(title, options); 
                if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if(!("permission" in Notification)) {
                            Notification.permission = permission;
                        }
                    });
                }

                if (Notification.permission === "granted") {
                    new Notification(title, options);
                }
            }
            else{
                if ("mozNotification" in navigator){
                //var n = new Notification(title, options); 
                //ForefoxOS 1.1
                    var notificaction = navigator.moznotification.createNotification(title, options);
                    notification.show();
                }   
                else{
                    //other browsers: do nothing
                    //alert(title + ": " + optionsBody);
                    alert("title : optionsBody");
                }    
            }
        }

    //REGISTRAR INCIDENCIA AGITANDO EL DISPOSITIVO, FUNCIONA PARA APP FxOS y WebAPP
        window.addEventListener('shake', shakeEvent, false);

        function shakeEvent(){
            var registrar_incidencia_global = navigator.mozL10n.get("id_registrar_incidencia");
            var registrar_incidencia_texto_global = navigator.mozL10n.get("id_registrar_incidencia_texto");
            var registrar_incidencia_ok_global = navigator.mozL10n.get("id_registrar_incidencia_ok");
            var registrar_incidencia_ko_global = navigator.mozL10n.get("id_registrar_incidencia_ko");
            vibrateOneTime();

            Tako.Notification.confirm("hammer", registrar_incidencia_global, registrar_incidencia_texto_global, registrar_incidencia_ok_global, registrar_incidencia_ko_global,
                function(result){
                if(result){
                    if (localStorage.getItem('codigo_usuario')>0){
                        setTimeout(function(){ 
                            //redirect("article_logged_info/section_logged_info");
                            redirect("article_logged_radio_ui/section_info_logged");
                        }, 0);
                    }
                    else{
                        setTimeout(function(){ 
                            redirect("article_index/section_info");
                        }, 0);
                    }
                }
            });
        };

        //VIBRATION SETUP
        function vibrateOneTime(){
            if (navigator.vibrate){
                navigator.vibrate(200);
                navigator.vibrate(0);
                navigator.vibrate(200);
            }
        }

    //FUNCIONES EXTRAS
        window.logger = function(){
            console.log.apply(console, arguments)
        };

        function redirect(path) { 
            window.location= "article_index.html#" + path; 
        }

    //FUNCIONES VALIDACIONES
        function validarEmailRegExp(email) {
            if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(email)){  
                return true;
            }
        }

        function validarNombreRegExp(text){
            //Esta expresión controla el tamaño mínimo y maximo de la cadena, pero ya lo hacemos de otros modos, con alerts/notifics
            //if (!(/^(([a-zA-Z0-9ÀÁÂÃÉÊÍÓÔÕÚÜàáâãéêíóôõúüÑñÇç_ ºª@#&]{6,20})+$)/).test(text)){  
            if (text == null || text.length == 0 || (!/^([a-zA-Z0-9ÀÁÂÃÉÊÍÓÔÕÚÜàáâãéêíóôõúüÑñÇç_ ºª@#&]+$)/.test(text))) { 
                return true;
            }
        }

        function validarComentarioRegExp(text){
            if (text == null || text.length == 0 || (!/^([a-zA-Z0-9ÀÁÂÃÉÊÍÓÔÕÚÜàáâãéêíóôõúüÑñÇç_ ºª@#&.,¡!¿?()]+$)/.test(text))) { 
            //if (text == null || text.length == 0 || (!/^\S+$/.test(text))) { 
                return true;
            }
        }

        function validarPassRegExp(text){
            if (text == null || text.length == 0 || (!/^([a-zA-Z0-9ÑñÇç_]+$)/.test(text))) {
                return true;
            }
        }

        function validarFreqRegExp(text){
            //Esta expresión controla el tamaño mínimo y maximo de la cadena, pero ya lo hacemos de otros modos, con alerts/notifics
            //if (!(/^(([0-9.]{2,6})+$)/).test(text)){  
            if (text == null || text.length == 0 || (!/^([0-9.]+$)/.test(text))) {
                return true;
            }
        }
         
        function validarTextoTamanioMinimo(text){
            if (text.length < 6) {
                return true;                           
            }
        }

        function validarTextoTamanioMaximo(text){
            if (text.length > 20) {
                return true;                           
            }
        }

        function validarTextoTamanioMinimoEmisora(text){
            if (text.length < 3) {
                return true;                           
            }
        }

        function validarTextoTamanioMaximoEmisora(text){
            if (text.length > 30) {
                return true;                           
            }
        }

        function validarTextoTamanioMinimoComentario(text){
            if (text.length < 20) {
                return true;                           
            }
        }

        function validarTextoTamanioMaximoComentario(text){
            if (text.length > 160) {
                return true;                           
            }
        }

        function validarFrecuenciaIntervalo(freq){
            if ((freq <= 87.0)||(freq >= 108.1)) {
                return true;
            }
        }
       
        function ningunDDLSeleccionado(ddl){ 
            if (ddl.length == 0){
                return true;
            }
            //if ($("#ddl_pruebas4_input_emisora_alcance option:selected").length == 0){
            //}
        }

        function primerDDLSeleccionado_nombre_emisora(ddl,ddl_cod_emisora){ 
            if ((ddl == "0") && (ddl_cod_emisora == "192")){ // el 192 es el valor en la BD del codigo de ese registro
                return true;
            }
        }

        function primerDDLSeleccionado_alcance(ddl,ddl_cod_alcance){ 
            if ((ddl == "0") && (ddl_cod_alcance == "7")){ // el 7 es el valor en la BD del codigo de ese registro
                return true;
            }
        }

        function deseleccionar_ddl(ddl){
            for (i=0; i < ddl.options.length; i++){
                ddl.options[i].selected = false;
            }
        }

        function numero_aleatorio_entre(min,max){
            return Math.floor(Math.random() * (max-min+1)) + min;
        }

    //FUNCIONES IMPRIMIR ERRORES
        function imprimir_errores_nombre_usuario_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_usuario_vacia") + "<br/>";
        }

        function imprimir_errores_nombre_usuario_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_usuario_pequenia") + "<br/>";
        }
        
        function imprimir_errores_nombre_usuario_grande(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_usuario_grande") + "<br/>";
        }

        function imprimir_errores_email_valido(){
            return navigator.mozL10n.get("id_imprimir_errores_email_valido") + "<br/>";
        }

        function imprimir_errores_password_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_password_vacia") + "<br/>";
        }

        function imprimir_errores_password_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_password_pequenia") + "<br/>";
        }

        function imprimir_errores_password_repetida_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_password_repetida_vacia") + "<br/>";
        }

        function imprimir_errores_password_repetida_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_password_repetida_pequenia") + "<br/>";
        }

        function imprimir_errores_password_vacia_cambiar(){
            return navigator.mozL10n.get("id_imprimir_errores_password_vacia_cambiar") + "<br/>";
        }

        function imprimir_errores_password_pequenia_cambiar(){
            return navigator.mozL10n.get("id_imprimir_errores_password_pequenia_cambiar") + "<br/>";
        }

        function imprimir_errores_password_vacia_cambiar_nueva(){
            return navigator.mozL10n.get("id_imprimir_errores_password_vacia_cambiar_nueva") + "<br/>";
        }

        function imprimir_errores_password_pequenia_cambiar_nueva(){
            return navigator.mozL10n.get("id_imprimir_errores_password_pequenia_cambiar_nueva") + "<br/>";
        }

        function imprimir_errores_password_vacia_cambiar_nueva_rep(){
            return navigator.mozL10n.get("id_imprimir_errores_password_vacia_cambiar_nueva_rep") + "<br/>";
        }

        function imprimir_errores_password_pequenia_cambiar_nueva_rep(){
            return navigator.mozL10n.get("id_imprimir_errores_password_pequenia_cambiar_nueva_rep") + "<br/>";
        }

        function imprimir_errores_password3_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_password3_vacia") + "<br/>";
        }

        function imprimir_errores_password3_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_password3_pequenia") + "<br/>";
        }

        function imprimir_errores_passwords_no_coinciden(){
            return navigator.mozL10n.get("id_imprimir_errores_passwords_no_coinciden") + "<br/>";  
        }

        function imprimir_errores_passwords_vieja_y_nueva_coinciden(){
            return navigator.mozL10n.get("id_imprimir_errores_passwords_vieja_y_nueva_coinciden") + "<br/>";
        }
        
        function imprimir_errores_identificar_usuario_email_inexistente(){
            return navigator.mozL10n.get("id_imprimir_errores_identificar_usuario_email_inexistente") + "<br/>";
        }

        function imprimir_errores_identificar_usuario_email_clave_no_coinciden(){
            return navigator.mozL10n.get("id_imprimir_errores_identificar_usuario_email_clave_no_coinciden") + "<br/>";
        }
        function imprimir_errores_identificar_usuario_email_clave_actual_no_coinciden(){
            return navigator.mozL10n.get("id_imprimir_errores_identificar_usuario_email_clave_actual_no_coinciden") + "<br/>";
        }
        function imprimir_errores_identificar_usuario_no_activo_info(){
            return navigator.mozL10n.get("id_imprimir_errores_identificar_usuario_no_activo_info") + "<br/>";
        }
        function imprimir_errores_identificar_usuario_email_clave_usuario_identificado(){
            return navigator.mozL10n.get("id_imprimir_errores_identificar_usuario_email_clave_usuario_identificado") + "<br/>";
        }

        


        function imprimir_errores_registrar_usuario_nombre_existente(){
            return navigator.mozL10n.get("id_imprimir_errores_registrar_usuario_nombre_existente") + "<br/>";
        }
        function imprimir_errores_registrar_usuario_mail_existente(){
            return navigator.mozL10n.get("id_imprimir_errores_registrar_usuario_mail_existente") + "<br/>";
        }
        function imprimir_errores_registrar_usuario_nombre_mail_existente(){
            return navigator.mozL10n.get("id_imprimir_errores_registrar_usuario_nombre_mail_existente") + "<br/>";
        }

        function imprimir_errores_comentario_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_comentario_vacia") + "<br/>";
        }

        function imprimir_errores_comentario_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_comentario_pequenia") + "<br/>";
        }
        
        function imprimir_errores_comentario_grande(){
            return navigator.mozL10n.get("id_imprimir_errores_comentario_grande") + "<br/>";
        }

        function imprimir_errores_add_comment_diario_ya_existe(){
            return navigator.mozL10n.get("id_imprimir_errores_add_comment_diario_ya_existe") + "<br/>";
        }

        //EMISORAS && FRECUENCIAS
        function imprimir_errores_nombre_emisora_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_emisora_vacia") + "<br/>";
        }

        function imprimir_errores_nombre_emisora_pequenia(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_emisora_pequenia") + "<br/>";
        }

        function imprimir_errores_nombre_emisora_grande(){
            return navigator.mozL10n.get("id_imprimir_errores_nombre_emisora_grande") + "<br/>";
        }

        function imprimir_errores_aniadir_emisora_existente(){
            return navigator.mozL10n.get("id_imprimir_errores_aniadir_emisora_existente") + "<br/>";
        }

        function imprimir_errores_aniadir_emision_existente(){
            return navigator.mozL10n.get("id_imprimir_errores_aniadir_emision_existente") + "<br/>";
        }
        
        function imprimir_errores_ddl_emisoras_no_seleccionada(){
            return navigator.mozL10n.get("id_imprimir_errores_ddl_emisoras_no_seleccionada") + "<br/>";
        }
        
        function imprimir_errores_ddl_alcance_no_seleccionada(){
            return navigator.mozL10n.get("id_imprimir_errores_ddl_alcance_no_seleccionada") + "<br/>";
        }
        
        function imprimir_errores_ddl_tipos_no_seleccionada(){
            return navigator.mozL10n.get("id_imprimir_errores_ddl_tipos_no_seleccionada") + "<br/>";
        }

        function imprimir_errores_frecuencia_vacia(){
            return navigator.mozL10n.get("id_imprimir_errores_frecuencia_vacia") + "<br/>";
        }
        
        function imprimir_errores_frecuencia_fuera_intervalo(){
            return navigator.mozL10n.get("id_imprimir_errores_frecuencia_fuera_intervalo") + "<br/>";
        }
    
    //MENSAJES DE PULL TO REFRESH
        function imprimir_mensaje_comments_pull_label(){
            navigator.mozL10n.get("id_comments_pull_label");
        }

        function imprimir_mensaje_comments_release_label(){
            return navigator.mozL10n.get("id_comments_release_label");
        }

        function imprimir_mensaje_comments_refresh_label(){
            return navigator.mozL10n.get("id_comments_refresh_label");
        }

    //MENSAJES DE NOTIFICACIONES
        function imprimir_mensaje_notificacion_cerrar_sesion_titulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_cerrar_sesion_titulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_cerrar_sesion_subtitulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_cerrar_sesion_subtitulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_cerrar_sesion_boton_ok(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_cerrar_sesion_boton_ok") + "<br/>";
        }
        function imprimir_mensaje_notificacion_cerrar_sesion_boton_ko(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_cerrar_sesion_boton_ko") + "<br/>";
        }
        function imprimir_mensaje_notificacion_eliminar_cuenta_titulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_eliminar_cuenta_titulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_eliminar_cuenta_subtitulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_eliminar_cuenta_subtitulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_eliminar_cuenta_boton_ok(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_eliminar_cuenta_boton_ok") + "<br/>";
        }
        function imprimir_mensaje_notificacion_eliminar_cuenta_boton_ko(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_eliminar_cuenta_boton_ko") + "<br/>";
        }

        function imprimir_mensaje_notificacion_compartir_titulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_compartir_titulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_compartir_subtitulo(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_compartir_subtitulo") + "<br/>";
        }
        function imprimir_mensaje_notificacion_compartir_boton_ok(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_compartir_boton_ok") + "<br/>";
        }
        function imprimir_mensaje_notificacion_compartir_boton_ko(){
            return navigator.mozL10n.get("id_imprimir_mensaje_notificacion_compartir_boton_ko") + "<br/>";
        }

        function imprimir_scan_frecuencia(){
            return navigator.mozL10n.get("id_imprimir_scan_frecuencia");
        }

    //NOTIFICACION SLIDER PUNTUACIONES
        function valorSliderPuntuacion(puntuacion) {
            var text = "";
            var text_final = "";
            if (puntuacion == "1"){
                text = navigator.mozL10n.get("id_senial_muy_mala");
            }
            else{
                if (puntuacion == "2"){
                    text = navigator.mozL10n.get("id_senial_mala");
                }
                else{
                    if (puntuacion == "3"){
                        text = navigator.mozL10n.get("id_senial_normal");
                    }
                    else{
                        if (puntuacion == "4"){
                           text = navigator.mozL10n.get("id_senial_buena");
                        }
                        else{
                            if (puntuacion == "5"){
                                text = navigator.mozL10n.get("id_senial_muy_buena");
                            }
                        }
                    }
                }
            }
            text_final = "¡¡" + puntuacion + "/5 : "+text+"!!";
            document.getElementById('txtBD_puntuaciones_notificacion_valor').value = text_final;
        }
    
    //PRECISION
        /*function que_precision(){
            var value="";
            if (document.getElementById('normal_prec').checked) {
                value = document.getElementById('normal_prec').value;
            }
            else{
                if (document.getElementById('poca_prec').checked) {
                    value = document.getElementById('poca_prec').value;
                }
                /*else{
                    if (document.getElementById('mucha_prec').checked) {
                        value = document.getElementById('mucha_prec').value;
                    }
                }* /
            }
            return value;
        }*/

    //************************************End***************************************************
    //PARA VER QUE IDIOMA TIENE EL NAVEGADOR, PARA MOSTRAR LOS LISTADOS DE ALCANCE Y TIPOS SEGÚN ESE IDIOMA
        function idioma_navegador(){
            return navigator.language;
        }

    //BUSQUEDAS INDEXEDDB
        /*
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
                        else if ((texto_busqueda_frec != "") && (texto_busqueda_nomb =="")){
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
    */
