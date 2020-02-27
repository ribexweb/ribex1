
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
    tablaUnidades.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 35){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Unidad");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteUnidades.data,'idunidad',tablaUnidades.rows( indexes ).data()[0].idunidad);
            idUnidadActual = record.idunidad;
            cargarunidad(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_unidades',function(event){   
        if (paginaActiva.code == 35){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"mediciones.unidades",
                primaryField: "idunidad",
                primaryValue:id,
                fieldName:'activo',
                fieldValue:activo,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteUnidades.data,'idunidad',id);
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
        if (paginaActiva.code == 35){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaUnidades").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 35){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar unidad");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#TextCodigo").val('');
            $("#TextDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 35){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_unidades();
                        tablaUnidades.row({selected: true}).deselect();
                        tablaUnidades.ajax.reload(false);
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_unidades(idUnidadActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarunidad(record){
        $("#TextCodigo").val(record.codigo);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
    }

    /*LISTO*/
    function guardar_unidades(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.unidades";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "codigo"      : $("#TextCodigo").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idunidad"); 
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
    function actualizar_unidades(idunidad){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.unidades";
        elementos["primaryField"] = "idunidad";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "codigo"      : $("#TextCodigo").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idunidad,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idunidad);
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
    function updaterecord(idunidad){
        var index = findObjectByKeyIndex(tablaUnidades.rows().data(),'idunidad',idunidad);
        var record = tablaUnidades.rows().data()[index]; 
        record.codigo = $("#TextCodigo").val();
        record.descripcion = $("#TextDescripcion").val();
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_unidades" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idunidad,($("#checkActivo").is(":checked"))?"checked":"");
        tablaUnidades.row("#"+record.idunidad).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteUnidades.data,'idunidad',idunidad);
        record2.codigo = record.codigo;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});