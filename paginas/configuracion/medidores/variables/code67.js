
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
    tablaVariables.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Variables");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteVariables.data,'idvariable',tablaVariables.rows( indexes ).data()[0].idvariable);
            variableActual = record;
            cargarvariable(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_variables',function(event){   
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Variables",
                "mediciones.variables",
                {field:"idvariable",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idvariable',value:id},
                reporteVariables,
                "#checkActivo"
            );
        }
    });

    $(document).on('change','.booleano_virtual_variables',function(event){   
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var virtual = $(this).is(":checked");
            updateFieldBoolean("Variables",
                "mediciones.variables",
                {field:"idvariable",value:id,type:'integer'},
                {name:'activo',value:virtual,type:'boolean'},
                {name:'idvariable',value:id},
                reporteVariables,
                "#checkVirtual"
            );
        }
    });

    $(document).on('change','.booleano_zero_variables',function(event){   
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var zero = $(this).is(":checked");
            updateFieldBoolean("Variables",
                "mediciones.variables",
                {field:"idvariable",value:id,type:'integer'},
                {name:'zero',value:zero,type:'boolean'},
                {name:'idvariable',value:id},
                reporteVariables,
                "#checkZero"
            );
        }
    });


    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaVariables").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar variable");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#TextCodigo").val('');
            $("#TextDescripcion").val('');
            $("#SelectUnidad").val($("#SelectUnidad option:first").val());
            $("#SelectUnidad").select2().trigger('change');
            $("#checkActivo").attr("checked",true);
            $("#checkVirtual").attr("checked",false);
            $("#checkZero").attr("checked",false);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 67){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_variables();
                        confirmarModificar(tablaVariables,{
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
                    actualizar_variables(variableActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarvariable(record){
        $("#TextCodigo").val(record.codigo);
        $("#TextDescripcion").val(record.descripcion);
        $("#SelectUnidad").val(record.idunidad);
        $("#SelectUnidad").select2().trigger('change');  
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#checkVirtual").attr("checked",(record.virtual=='t'));
        $("#checkZero").attr("checked",(record.zero=='t'));
    }

    /*LISTO*/
    function guardar_variables(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.variables";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "codigo"      : $("#TextCodigo").val(),
            "descripcion" : $("#TextDescripcion").val(),
            "idunidad"    : $("#SelectUnidad").val(),
            "activo"      : $("#checkActivo").is(":checked"),
            "virtual"     : $("#checkVirtual").is(":checked"),
            "zero"        : $("#checkZero").is(":checked")
        });
        elementos["returnFields"].push("idvariable"); 
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
                        guardar_log(data[0].return[0]["idvariable"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        tablaVariables.row({selected: true}).deselect();
                        tablaVariables.ajax.reload(false);
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
    function actualizar_variables(variable){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.variables";
        elementos["primaryField"] = "idvariable";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,text,integer,boolean,boolean,boolean,integer";
        elementos["campos"].push({
            "update":{
                "codigo"      : $("#TextCodigo").val(),
                "descripcion" : $("#TextDescripcion").val(),
                "idunidad"    : $("#SelectUnidad").val(),
                "activo"      : $("#checkActivo").is(":checked"),
                "virtual"     : $("#checkVirtual").is(":checked"),
                "zero"        : $("#checkZero").is(":checked")
            },
            "primaryValue" : variable.idvariable,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    console.log(elementos);
                    updaterecord(variable.idvariable);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(variable.idvariable,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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
    function updaterecord(idvariable){
        var index = findObjectByKeyIndex(tablaVariables.rows().data(),'idvariable',idvariable);
        var record = tablaVariables.rows().data()[index]; 
        console.log(record);
        record.codigo = $("#TextCodigo").val();
        record.descripcion = $("#TextDescripcion").val();
        record.idunidad= $("#SelectUnidad").val()
        record.unid_codigo = $("#SelectUnidad").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_variables" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idvariable,($("#checkActivo").is(":checked"))?"checked":"");
        record.virtual = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_virtual_variables" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idvariable,($("#checkVirtual").is(":checked"))?"checked":"");
        record.zero = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_zero_variables" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idvariable,($("#checkZero").is(":checked"))?"checked":"");
        tablaVariables.row("#"+record.idvariable).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteVariables.data,'idvariable',idvariable);
        record2.codigo = record.codigo;
        record2.descripcion = record.descripcion;
        record2.idunidad = record.idunidad;
        record2.unid_codigo = record.unid_nombre;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
        record2.virtual = ($("#checkVirtual").is(":checked"))?"t":"f";
        record2.zero = ($("#checkZero").is(":checked"))?"t":"f";
    }
});