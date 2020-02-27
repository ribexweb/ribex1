
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
    tablaProtocolos.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 26){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Protocolos");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteProtocolos.data,'idprotocolo',tablaProtocolos.rows( indexes ).data()[0].idprotocolo);
            idProtocoloActual = record.idprotocolo;
            cargarprotocolo(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_protocolos',function(event){   
        if (paginaActiva.code == 26){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Protocolos",
                "mediciones.protocolos",
                {field:"idprotocolo",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idprotocolo',value:id},
                reporteProtocolos,
                "#checkActivo"
            );
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 26){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaProtocolos").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 26){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Protocolo");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#TextNombre").val('');
            $("#TextDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 26){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_protocolos();
                        confirmarModificar(tablaProtocolos,{
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
                    actualizar_protocolos(idProtocoloActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarprotocolo(record){
        $("#TextNombre").val(record.nombre);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
    }

    /*LISTO*/
    function guardar_protocolos(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.protocolos";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "nombre"      : $("#TextNombre").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idprotocolo"); 
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
                        guardar_log(data[0].return[0]["idprotocolo"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        tablaProtocolos.row({selected: true}).deselect();
                        tablaProtocolos.ajax.reload(false);
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
    function actualizar_protocolos(idprotocolo){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.protocolos";
        elementos["primaryField"] = "idprotocolo";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "nombre"      : $("#TextNombre").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idprotocolo,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idprotocolo);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(idprotocolo,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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
    function updaterecord(idprotocolo){
        var index = findObjectByKeyIndex(tablaProtocolos.rows().data(),'idprotocolo',idprotocolo);
        var record = tablaProtocolos.rows().data()[index]; 
        record.nombre = $("#TextNombre").val();
        record.descripcion = $("#TextDescripcion").val();
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_protocolos" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idprotocolo,($("#checkActivo").is(":checked"))?"checked":"");
        tablaProtocolos.row("#"+record.idprotocolo).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteProtocolos.data,'idprotocolo',idprotocolo);
        record2.nombre = record.nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});