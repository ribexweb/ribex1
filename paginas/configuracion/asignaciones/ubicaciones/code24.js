
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
    tablaUbicaciones.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 24){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Ubicaciones");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteUbicaciones.data,'idubicacion',tablaUbicaciones.rows( indexes ).data()[0].idubicacion);
            idUbicacionActual = record.idubicacion;
            cargarubicacion(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_ubicaciones',function(event){   
        if (paginaActiva.code == 24){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Ubicaciones",
                "mediciones.ubicaciones",
                {field:"idubicacion",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idubicacion',value:id},
                reporteUbicaciones,
                "#checkActivo"
            );
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 24){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaUbicaciones").offset().top}, "slow");
        }
    });
    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 24){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Ubicacion");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#SelectEdificio").val($("#SelectEdificio option:first").val());
            $("#SelectEdificio").select2().trigger('change');
            $("#TextNombre").val('');
            $("#TextDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 24){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_ubicaciones();
                        confirmarModificar(tablaUbicaciones,{
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
                    actualizar_ubicaciones(idUbicacionActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarubicacion(record){
        $("#TextNombre").val(record.nombre);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');        
    }

    /*LISTO*/
    function guardar_ubicaciones(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.ubicaciones";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idedificio"      : $("#SelectEdificio").val(),
            "nombre"      : $("#TextNombre").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idubicacion"); 
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
                        guardar_log(data[0].return[0]["idubicacion"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        tablaUbicaciones.row({selected: true}).deselect();
                        tablaUbicaciones.ajax.reload(false);
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
    function actualizar_ubicaciones(idubicacion){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.ubicaciones";
        elementos["primaryField"] = "idubicacion";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "idedificio"      : $("#SelectEdificio").val(),
                "nombre"      : $("#TextNombre").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idubicacion,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idubicacion);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(idubicacion,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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
    function updaterecord(idubicacion){
        var index = findObjectByKeyIndex(tablaUbicaciones.rows().data(),'idubicacion',idubicacion);
        var record = tablaUbicaciones.rows().data()[index]; 
        record.nombre = $("#TextNombre").val();
        record.descripcion = $("#TextDescripcion").val();
        record.idedificio = $("#SelectEdificio").val()
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_ubicaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idubicacion,($("#checkActivo").is(":checked"))?"checked":"");
        tablaUbicaciones.row("#"+record.idubicacion).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteUbicaciones.data,'idubicacion',idubicacion);
        record2.nombre = record.nombre;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});