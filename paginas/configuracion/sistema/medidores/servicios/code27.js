
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
    tablaServicios.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 27){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar servicios");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteServicios.data,'idservicio',tablaServicios.rows( indexes ).data()[0].idservicio);
            idServicioActual = record.idservicio;
            cargarservicio(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_servicios',function(event){   
        if (paginaActiva.code == 27){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"mediciones.servicios",
                primaryField: "idservicio",
                primaryValue:id,
                fieldName:'activo',
                fieldValue:activo,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteServicios.data,'idservicio',id);
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
        if (paginaActiva.code == 27){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaServicios").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 27){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Servicio");
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
        if (paginaActiva.code == 27){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_servicios();
                        tablaServicios.row({selected: true}).deselect();
                        tablaServicios.ajax.reload(false);
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_servicios(idServicioActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarservicio(record){
        $("#TextNombre").val(record.nombre);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
    }

    /*LISTO*/
    function guardar_servicios(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.servicios";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "nombre"      : $("#TextNombre").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idservicio"); 
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
    function actualizar_servicios(idservicio){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.servicios";
        elementos["primaryField"] = "idservicio";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "nombre"      : $("#TextNombre").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idservicio,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idservicio);
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
    function updaterecord(idservicio){
        var index = findObjectByKeyIndex(tablaServicios.rows().data(),'idservicio',idservicio);
        var record = tablaServicios.rows().data()[index]; 
        record.nombre = $("#TextNombre").val();
        record.descripcion = $("#TextDescripcion").val();
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_servicios" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idservicio,($("#checkActivo").is(":checked"))?"checked":"");
        tablaServicios.row("#"+record.idservicio).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteServicios.data,'idservicio',idservicio);
        record2.nombre = record.nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});