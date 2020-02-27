
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
    tablaMedidores.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Medidores");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteMedidores.data,'idmedidor',tablaMedidores.rows( indexes ).data()[0].idmedidor);
            medidorActual = record;
            cargarmedidor(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_medidoresfisicos',function(event){   
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("data-idequipo");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Medidores Físicos",
                "mediciones.equipos",
                {field:"idequipo",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idequipo',value:id},
                reporteMedidores,
                "#checkActivo"
            );
        }
    });

    $(document).on('change','.booleano_principal_medidoresfisicos',function(event){   
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var principal = $(this).is(":checked");
            updateFieldBoolean("Medidores Físicos",
                "mediciones.medidores_fisicos",
                {field:"idmedidorfisico",value:id,type:'integer'},
                {name:'principal',value:principal,type:'boolean'},
                {name:'idmedidorfisico',value:id},
                reporteMedidores,
                "#checkPrincipal"
            );
        }
    });

    $(document).on('change','.booleano_perdida_medidoresfisicos',function(event){   
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var perdida= $(this).is(":checked");
            updateFieldBoolean("Medidores Físicos",
                "mediciones.medidores_fisicos",
                {field:"idmedidorfisico",value:id,type:'integer'},
                {name:'perdida',value:perdida,type:'boolean'},
                {name:'idmedidorfisico',value:id},
                reporteMedidores,
                "#checkPerdida"
            );
        }
    });


    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaMedidores").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar medidor");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#textCodigo").val('');
            $("#selectFases").val($("#selectFases option:first").val());
            $("#textCorriente").val('');
            $("#selectServicio").val($("#selectServicio option:first").val());
            $("#selectProtocolo").val($("#selectProtocolo option:first").val());
            $("#checkActivo").attr("checked",true);
            $("#checkPrincipal").attr("checked",false);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 69){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_Medidores();
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_Medidores(medidorActual);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarmedidor(record){
        codigo = record.codigo.split('-');
        $("#selectEdificio").val(codigo[1]);
        $("#selectEdificio").select().trigger('change');
        $("#textCodigo").val(codigo[2]);
        $("#selectFases").val(record.fases);
        $("#selectFases").select2().trigger("change");
        $("#textCorriente").val(record.corriente);
        $("#selectServicio").val(record.idservicio);
        $("#selectServicio").select2().trigger("change");
        $("#selectProtocolo").val(record.idprotocolo); 
        $("#selectProtocolo").select2().trigger("change"); 
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#checkPrincipal").attr("checked",(record.principal=='t'));
        $("#checkPerdida").attr("checked",(record.perdida=='t'));
    }

    /*LISTO*/
    function guardar_Medidores(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.equipos";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "codigo"      : "%s-%s-%s".format($("#selectServicio option:selected").attr('data-prefijo'),$("#selectEdificio").val(),$("#textCodigo").val()),
            "activo"      : $("#checkActivo").is(":checked"),
        });
        elementos["returnFields"].push("idequipo"); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        guardar_medidor({
                            idequipo:data[0].return[0]["idequipo"],
                        });
                        success2({
                            msg : data[0].mesg,
                        });
                        guardar_log(data[0].return[0]["idequipo"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

    function guardar_medidor(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.medidores";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idequipo"    : arguments[0].idequipo
        });
        elementos["returnFields"].push("idmedidor"); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        /*success2({
                            msg : data[0].mesg,
                        });*/
                        guardar_medidor_fisico({
                            idmedidor:data[0].return[0]["idmedidor"],
                        });
                        guardar_log(data[0].return[0]["idmedidor"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

    function guardar_medidor_fisico(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.medidores_fisicos";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idmedidor"    : arguments[0].idmedidor,
            "fases"        : $("#selectFases").val(),
            "corriente"    : $("#textCorriente").val(),
            "idservicio"   : $("#selectServicio").val(),
            "idprotocolo"  : $("#selectProtocolo").val(),
            "principal"    : $("#checkPrincipal").is(":checked"),
            "perdida"      : $("#checkPerdida").is(":checked"),
        });
        elementos["returnFields"].push("idmedidorfisico"); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        /*success2({
                            msg : data[0].mesg,
                        });*/
                        tablaMedidores.row({selected: true}).deselect();
                        tablaMedidores.ajax.reload(false);
                        guardar_log(data[0].return[0]["idmedidorfisico"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        confirmarModificar(tablaMedidores,{
                            titulo:'Confirmación',
                            msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                            btnSi : "#btnNuevo",
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
    function actualizar_Medidores(medidor){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.medidores_fisicos";
        elementos["primaryField"] = "idmedidorfisico";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "smallint,integer,integer,integer,boolean,boolean,integer";
        elementos["campos"].push({
            "update":{
                "fases"        : $("#selectFases").val(),
                "corriente"    : $("#textCorriente").val(),
                "idservicio"    : $("#selectServicio").val(),
                "idprotocolo"   : $("#selectProtocolo").val(),
                "principal"     : $("#checkPrincipal").is(":checked"),
                "perdida"       : $("#checkPerdida").is(":checked"),
            },
            "primaryValue" : medidor.idmedidorfisico,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    actualizar_equipo(medidor.idequipo);
                    updaterecord(medidor.idmedidorfisico);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(medidor.idmedidorfisico,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

    function actualizar_equipo(idequipo){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.equipos";
        elementos["primaryField"] = "idequipo";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "codigo"    : "%s-%s-%s".format($("#selectServicio option:selected").attr('data-prefijo'),$("#selectEdificio").val(),$("#textCodigo").val()),
                "activo"     : $("#checkActivo").is(":checked"),
            },
            "primaryValue" : idequipo,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    //updaterecord(medidor.idmedidorfisico);
                    /*success2({
                        msg : data[0].mesg,
                    });*/
                    guardar_log(idequipo,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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
    function updaterecord(idmedidorfisico){
        var index = findObjectByKeyIndex(tablaMedidores.rows().data(),'idmedidorfisico',idmedidorfisico);
        var record = tablaMedidores.rows().data()[index]; 
        console.log(record);
        record.codigo = "%s-%s-%s".format($("#selectServicio option:selected").attr('data-prefijo'),$("#selectEdificio").val(),$("#textCodigo").val()),
        record.idservicio= $("#selectServicio").val();
        record.idprotocolo = $("#selectProtocolo").val();
        record.fases = $("#selectFases").val(),
        record.corriente = $("#textCorriente").val(),
        record.proteccion = proteccion(record.fases,record.corriente);
        record.serv_nombre = $("#selectServicio").select2('data')[0].text;
        record.prot_nombre = $("#selectProtocolo").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_medidoresfisicos" type="checkbox" %s data-idequipo="%s" data-idmedidor="%s"><span class="switcher"></span></label>'.format(record.idmedidorfisico,($("#checkActivo").is(":checked"))?"checked":"",record.idequipo,record.idmedidor);
        record.principal = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_principal_medidoresfisicos" type="checkbox" %s data-idequipo="%s" data-idmedidor="%s"><span class="switcher"></span></label>'.format(record.idmedidorfisico,($("#checkPrincipal").is(":checked"))?"checked":"",record.idequipo,record.idmedidor);
        record.perdida = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_perdida_medidoresfisicos" type="checkbox" %s data-idequipo="%s" data-idmedidor="%s"><span class="switcher"></span></label>'.format(record.idmedidorfisico,($("#checkPerdida").is(":checked"))?"checked":"",record.idequipo,record.idmedidor);
        tablaMedidores.row("#"+record.idmedidorfisico).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteMedidores.data,'idmedidorfisico',idmedidorfisico);
        record2.codigo = record.codigo;
        record2.numero = record.numero;
        record2.prefijo = record.prefijo;
        record2.idservicio = record.idservicio;
        record2.idprotocolo= record.idprotocolo;
        record2.fases = record.fases;
        record2.corriente = record.corriente;
        record2.serv_nombre = record.serv_nombre;
        record2.prot_nombre = record.prot_nombre;
        record2.unid_codigo = record.unid_nombre;
        record2.proteccion = record.proteccion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
        record2.principal = ($("#checkPrincipal").is(":checked"))?"t":"f";
        record2.perdida = ($("#checkPerdida").is(":checked"))?"t":"f";
    }

    function proteccion(fases,corriente){
        var proteccion = 0;
        if (fases == 1){
            proteccion = 220*corriente*0.9;
        }
        else if (fases==3){
            proteccion = 380*corriente*0.9*Math.sqrt(3);
        }
        return Math.round(proteccion/1000);
    }
});