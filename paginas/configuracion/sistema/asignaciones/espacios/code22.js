
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
    tablaEspacios.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 22){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Espacios");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteEspacios.data,'idespacio',tablaEspacios.rows( indexes ).data()[0].idespacio);
            idEspacioActual = record.idespacio;
            cargarEspacio(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_espacios',function(event){   
        if (paginaActiva.code == 22){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"mediciones.espacios",
                primaryField: "idespacio",
                primaryValue:id,
                fieldName:'activo',
                fieldValue:activo,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteEspacios.data,'idespacio',id);
                    record.activo = (activo)?"t":"f";
                    $("#checkActivo").attr("checked",(record.activo=='t'));
                    success2({msg : data} );
                    //tablaUsuarios.ajax.reload(null, false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            });
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 22){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaTarifas").offset().top}, "slow");
        }
    });
    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 22){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Espacio");
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
        if (paginaActiva.code == 22){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_espacios();
                        tablaEspacios.row({selected: true}).deselect();
                        tablaEspacios.ajax.reload(false);
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_espacios(idEspacioActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarEspacio(record){
        $("#TextNombre").val(record.nombre);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');        
    }

    /*LISTO*/
    function guardar_espacios(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.espacios";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idedificio"      : $("#SelectEdificio").val(),
            "nombre"      : $("#TextNombre").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idespacio"); 
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
    function actualizar_espacios(idEspacio){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.espacios";
        elementos["primaryField"] = "idespacio";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "idedificio"      : $("#SelectEdificio").val(),
                "nombre"      : $("#TextNombre").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idEspacio,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idEspacio);
                    success2({
                        msg : data[0].mesg,
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

    /*LISTO*/
    function updaterecord(idEspacio){
        var index = findObjectByKeyIndex(tablaEspacios.rows().data(),'idespacio',idEspacio);
        var record = tablaEspacios.rows().data()[index]; 
        record.nombre = $("#TextNombre").val();
        record.descripcion = $("#TextDescripcion").val();
        record.idedificio = $("#SelectEdificio").val()
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_espacios" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idespacio,($("#checkActivo").is(":checked"))?"checked":"");
        tablaEspacios.row("#"+record.idespacio).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteEspacios.data,'idespacio',idEspacio);
        record2.nombre = record.nombre;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});