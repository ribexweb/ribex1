
blog[paginaActiva.code].comments = blog[paginaActiva.code].comments || {};
blog[paginaActiva.code].comments.debugMode = false;

blog[paginaActiva.code].isFirstLoad = function(namesp, jsFile) {
	var isFirst = namesp.firstLoad === undefined;
	namesp.firstLoad = false;
	
	if (!isFirst) {
		console.log(
			"Warning: Javascript file is included twice: " + 
				jsFile);
	}
	return isFirst;
};
$( document ).ready(function() {

    $('.select2').select2();

    /*LISTO*/
    tablaConsumidores.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 31){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Arrendatario");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteConsumidores.data,'idconsumidor',tablaConsumidores.rows( indexes ).data()[0].idconsumidor);
            ConsumidorActual = record;
            cargarconsumidor(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }



    $(document).on('change','.booleano_activo_arrendatarios',function(event){   
        if (paginaActiva.code == 31){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var identidad = $(this).attr("data-identidad");
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Arrendatarios",
                "mediciones.entidades",
                {field:"identidad",value:identidad,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idconsumidor',value:id},
                reporteConsumidores,
                "#checkActivo"
            );
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 31){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaUbicaciones").offset().top}, "slow");
        }
    });
    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 31){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Arrendatario");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#selectEdificio").val($("#selectEdificio option:first").val());
            $("#selectEdificio").select2().trigger('change');
            $("#textNombre").val('');
            $("#textRut").val('');
            $("#textDireccion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 31){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_consumidores();
                        confirmarModificar(tablaConsumidores,{
                            titulo:'Confirmación',
                            msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                            btnSi : "#btnNuevo",
                        });
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_consumidores(ConsumidorActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarconsumidor(record){
        $("#textNombre").val(record.nombre);
        $("#textRut").val(record.rut);
        $("#textCodigo").val(record.codigo);
        $("#textRazon").val(record.razonsocial);
        $("#textDireccion").val(record.direccion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#selectEdificio").val(record.idedificio);
        $("#selectEdificio").select2().trigger('change');        
    }

    /*LISTO*/
    function guardar_consumidores(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.entidades";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "nombre"      : $("#textNombre").val(),
            "activo"      : $("#checkActivo").is(":checked"),
        });
        elementos["returnFields"].push("identidad"); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        guardar_log(data[0].return[0]["identidad"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        guardar_consumidor({
                            identidad:data[0].return[0]["identidad"],
                        });
                    }
                    else {
                        console.log(data);
                        error2({
                            msg : data[0].mesg,    
                        });
                    }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    function guardar_consumidor(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["realTableName"] = "Arrendatarios"; 
        elementos["tableName"] = "mediciones.consumidores";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "identidad"    : arguments[0].identidad,
            "rut"          : $("#textRut").val(),
            "direccion"    : $("#textDireccion").val(),
            "codigo"       : $("#textCodigo").val(),
            "razonsocial"  : $("#textRazon").val(),
            "idedificio"   : $("#selectEdificio").val()
        });
        elementos["returnFields"].push("idconsumidor"); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        success2({
                            msg : data[0].mesg,
                        });
                        guardar_log(data[0].return[0]["idconsumidor"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        tablaConsumidores.row({selected: true}).deselect();
                        tablaConsumidores.ajax.reload(false);
                    }
                    else {
                        console.log(data);
                        error2({
                            msg : data[0].mesg,    
                        });
                    }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    /*LISTO*/
    function actualizar_consumidor(idconsumidor){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];  
        elementos["realTableName"] = "Arrendatarios";      
        elementos["tableName"] = "mediciones.consumidores";
        elementos["primaryField"] = "idconsumidor";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,text,text,text,text,integer";
        elementos["campos"].push({
            "update":{
                "idedificio"  : $("#selectEdificio").val(),
                "rut"         : $("#textRut").val(),
                "codigo"      : $("#textCodigo").val(),
                "razonsocial" : $("#textRazon").val(), 
                "direccion"   : $("#textDescripcion").val(),
            },
            "primaryValue" : idconsumidor,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idconsumidor);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(idconsumidor,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });
                }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    function actualizar_consumidores(consumidor){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.entidades";
        elementos["primaryField"] = "identidad";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "nombre"      : $("#textNombre").val(),
                "activo"      : $("#checkActivo").is(":checked")
            },
            "primaryValue" : consumidor.identidad,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    actualizar_consumidor(consumidor.idconsumidor);
                    guardar_log(consumidor.identidad,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });
                }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }
    /*LISTO*/
    function updaterecord(idconsumidor){
        var index = findObjectByKeyIndex(tablaConsumidores.rows().data(),'idconsumidor',idconsumidor);
        var record = tablaConsumidores.rows().data()[index]; 
        record.nombre = $("#textNombre").val();
        record.rut = $("#textRut").val();
        record.codigo = $("#textCodigo").val();
        record.razonsocial = $("#textRazon").val();
        record.direccion = $("#textDireccion").val();
        record.idedificio = $("#selectEdificio").val()
        record.edif_nombre = $("#selectEdificio").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_arrendatarios" type="checkbox" %s data-identidad="%s"><span class="switcher"></span></label>'.format(record.idconsumidor,($("#checkActivo").is(":checked"))?"checked":"",record.identidad);
        tablaConsumidores.row("#"+record.idconsumidor).data(record).invalidate().draw('page');                
        console.log(record);
        var record2 = findObjectByKey(reporteConsumidores.data,'idconsumidor',idconsumidor);
        record2.nombre = record.nombre;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.rut = record.rut;
        record2.codigo = record.codigo;
        record2.razonsocial = record.razonsocial;
        record2.direccion = record.direccion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
        console.log(record2);
    }
});