
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
    tablaTarifas.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Tarifas");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteTarifas.data,'idtarifaedificio',tablaTarifas.rows( indexes ).data()[0].idtarifaedificio);
            idTarifaActual = record.idtarifaedificio;
            cargarTarifas(record);
        }
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
	}
    /*LISTO*/
    $(document).on('change','#SelectCargo',function(event){ 
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (this.value != -1) {
                $("#txtClasificacion").val($('option:selected',this).attr('data-clas_nombre'));
                $("#SelectCalculo").val($('option:selected',this).attr('data-idcalculo'));
                $("#SelectCalculo").select2().trigger('change');     
            }                 
            else {
                $("#txtClasificacion").val('');    
            }
        }
    }); 
    /*LISTO*/
    $(document).on('change','#SelectTarifa',function(event){ 
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ((($(this).select2('data') !== undefined) && ($(this).select2('data').length > 0)) && ($("#SelectEdificio").select2('data') !== undefined)) {
                var tarifa = $(this).select2('data')[0];
                var edificio = $("#SelectEdificio").select2('data')[0];
                var text = ($("#hdOperacion").val()=="Ingresar")?"Nueva":"";
                $("#lbTarifa").text("Cargos Asociados a la %s Tarifa %s de %s".format(text,tarifa.text,edificio.text));
                if (evento) {
                    loadCargosTarifas(reporteCargos,tarifa.id,edificio.id,tableParamsCargos,"#tablaCargos");
                }
            }
        }
    }); 
    /*LISTO*/
    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if (($(this).select2('data') !== undefined) && ($("#SelectTarifa").select2('data') !== undefined)) {
                var edificio = $(this).select2('data')[0];
                var tarifa = $("#SelectTarifa").select2('data')[0];
                var text = ($("#hdOperacion").val()=="Ingresar")?"Nueva":"";
                $("#lbTarifa").text("Cargos Asociados a la %s Tarifa %s de %s".format(text,tarifa.text,edificio.text));
    //          loadCargosTarifas(reporteCargos,tarifa.id,edificio.id,tableParamsCargos,"#tablaCargos");
            }
        }
    });
    /*LISTO*/
    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });
    /*LISTO*/
    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaTarifas").offset().top}, "slow");
        }
    });
    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Tarifa");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#SelectTarifa").val($("#SelectTarifa option:first").val());
            $("#SelectTarifa").select2().trigger('change');
            $("#textNombre").val('');
            $("#textDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });
    /*LISTO*/
    $(document).on('click','#btnEliminarCargo',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            tablaCargos.rows('.selected').data().map(function(element,index){
                var index = findObjectByKeyIndex(reporteCargos.data,'idcargo',element.idcargo);            
                reporteCargos.data.splice(index,1);
            });
            tablaCargos.rows('.selected').remove().draw(false);
            cargosDisponibles(reporteCargos.data.map(a => a.idcargo));   
            $("#btnEliminarCargo").attr("disabled",(reporteCargos.data.length == 0),true,false);
        }
    });
    /*LISTO*/
    $(document).on('click','#btnAgregar',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if (validar("#FormaActualizacion")) {
                agregarCargoLista();
                success2({msg:"Cargo agregado con Éxito"});
            }
        }
    })
    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_cargos();
                        confirmarModificar(tablaTarifas,{
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
                    actualizar_cargos(idTarifaActual);
                }
                else{
                }
            }
        }
    });
    /*LISTO*/
    $(document).on('change','.booleano_activo_tarifasedificios',function(event){   
        if (paginaActiva.code == 58){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Tarifas de Edificio",
                "remarcacion.tarifas_edificios",
                {field:"idtarifaedificio",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idtarifaedificio',value:id},
                reporteTarifas,
                "#checkActivo"
            );
        }
    });
    /*LISTO*/
    function cargarTarifas(record){
        $("#textNombre").val(record.nombre);
        $("#textDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        evento = false;
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');
        $("#SelectTarifa").val(record.idtarifa);
        $("#SelectTarifa").select2().trigger('change');
        $("#lbTarifa").text("Cargos Asociados a la Tarifa %s de %s".format(record.nombre,record.edif_nombre));
        loadCargosTarifasAlmacenados(reporteCargos,record.idtarifaedificio,tableParamsCargos,"#tablaCargos");        
    }
    /*LISTO*/
    function loadCargosTarifas(reporte,idtarifa,idedificio,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsCargos = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vcargostarifas",
                        orderby:[{
                            field:"idclasificacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idtarifa",
                            oper:"=",
                            value:idtarifa,
                            type:"int"    
                        }],      
                    },]
                },
                dataSrc: function(data){
                    reporte.activo = false;
                    reporte.data = data[0].resultados;
                    /*for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["idcargo"] = parseInt(data[0].resultados[i].idcargo);
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo;
                        reporte.data.push(elemento);
                    }*/
                    evento = true;
                    cargosDisponibles(reporte.data.map(a => a.idcargo));
                    $("#btnEliminarCargo").attr("disabled",(reporte.data.length == 0),true,false);
                    //console.log(reporte.data);
                    
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsCargos;
            tablaCargos = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 
    /*LISTO*/
    function loadCargosTarifasAlmacenados(reporte,idtarifaedificio,tableParams,idtabla){     
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsCargos = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vcargostarifasedificios",
                        orderby:[{
                            field:"idclasificacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idtarifaedificio",
                            oper:"=",
                            value:idtarifaedificio,
                            type:"int"    
                        }],      
                    }]
                },
                dataSrc: function(data){ 
                    console.log(data);              
                    reporte.activo = false;
                    //$('#btnCalcular').removeAttr('disabled');
                    reporte.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["idcargo"] = parseInt(data[0].resultados[i].idcargo);
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo; 
                        reporte.data.push(elemento);
                    }
                    evento = true;
                    cargosDisponibles(reporte.data.map(a => a.idcargo));
                    $("#btnEliminarCargo").attr("disabled",(reporte.data.length == 0),true,false);
                    return (reporte.data);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsCargos;
            tablaCargos = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 
    /*LISTO*/
    function cargosDisponibles(arrayCargos){
        selectJs2(
            "#SelectCargo",
            { 
                value: "idcargo",
                show: {
                    fields:["nombre"],
                },
                hide: ["idcalculo","clas_nombre"],
                queries:[{
                    fieldsSelect:["idcargo","nombre","clas_nombre","idcalculo"],
                    tableName   :"remarcacion.vcargos",
                    orderby:[{
                        field:"idcargo",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {
                            logical:"and",
                            field:"idcargo",
                            oper : "not in",
                            value: "(%s)".format((arrayCargos.toString()!= "")?arrayCargos.toString():"-1"),
                            type: "int",
                        }
                    ]        
                }],
            },
            {
            }    
        );
    }
    /*LISTO*/
    function agregarCargoLista(){
        var recordCargo = {};
        recordCargo.idcargo     = $("#SelectCargo").val();
        recordCargo.nombre      = $("#SelectCargo").select2('data')[0].text;
        recordCargo.clas_nombre = $("#txtClasificacion").val();
        recordCargo.idcalculo   = $("#SelectCalculo").val();
        recordCargo.calc_nombre = $("#SelectCalculo").select2('data')[0].text;
        recordCargo.idtarifaedificio = idTarifaActual;
        reporteCargos.data.push(recordCargo);
        tablaCargos.rows.add([recordCargo]).draw(); 
        cargosDisponibles(reporteCargos.data.map(a => a.idcargo));   
        $("#btnEliminarCargo").attr("disabled",(reporteCargos.data.length == 0),true,false);
    }
    /*LISTO*/
    function guardar_cargos(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.tarifas_edificios";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idtarifa"      : $("#SelectTarifa").val(),
            "idedificio"      : $("#SelectEdificio").val(),
            "nombre"      : $("#textNombre").val(),
            "descripcion" : $("#textDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idtarifaedificio"); 
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
                        if (tablaCargos.rows().data().length > 0) {
                            guardar_log(data[0].return[0]["idtarifaedificio"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                            guardar_cargos_tarifas_edificios({
                                idtarifaedificio:data[0].return[0]["idtarifaedificio"],
                                cargos:reporteCargos.data
                            });
                        }
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
    function guardar_cargos_tarifas_edificios(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "remarcacion.tarifas_edificios_cargos";
        elementos["operacion"] = "Ingresar";
        arguments[0].cargos.forEach(function (value, index){
            elementos["campos"].push({
                "idtarifaedificio"    : argumentos[0].idtarifaedificio,
                "idcargo"             : value.idcargo,
                "idcalculo"           : value.idcalculo,
            });
        });         
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
                    guardar_log(argumentos[0].idtarifaedificio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    tablaTarifas.row({selected: true}).deselect();
                    tablaTarifas.ajax.reload(false);
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }
    /*LISTO*/
    function eliminar_cargos_tarifas(idTarifaEdificio){
        var elementos = {}
        elementos["tableName"] = "remarcacion.tarifas_edificios_cargos";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"idtarifaedificio",
            oper:"=",
            value:idTarifaEdificio,
            type:"int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idTarifaEdificio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    if (tablaCargos.rows().data().length > 0) {
                        guardar_cargos_tarifas_edificios({
                            idtarifaedificio:idTarifaEdificio,
                            cargos:reporteCargos.data
                        });
                    }
                }
                else {
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
    function actualizar_cargos(idTarifaEdificio){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.tarifas_edificios";
        elementos["primaryField"] = "idtarifaedificio";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,integer,text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "idtarifa"      : $("#SelectTarifa").val(),
                "idedificio"      : $("#SelectEdificio").val(),
                "nombre"      : $("#textNombre").val(),
                "descripcion" : $("#textDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idTarifaEdificio,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idTarifaEdificio);
                    guardar_log(idTarifaEdificio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    eliminar_cargos_tarifas(idTarifaEdificio);
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
    function updaterecord(idTarifaEdificio){
        var index = findObjectByKeyIndex(tablaTarifas.rows().data(),'idtarifaedificio',idTarifaEdificio);
        var record = tablaTarifas.rows().data()[index]; 
        record.nombre = $("#textNombre").val();
        record.idedificio = $("#SelectEdificio").val()
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.idtarifa = $("#SelectTarifa").val()
        record.tari_codigo = $("#SelectTarifa").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_tarifasedificios" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idtarifaedificio,($("#checkActivo").is(":checked"))?"checked":"");
        tablaTarifas.row("#"+record.idtarifaedificio).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteTarifas.data,'idtarifaedificio',idTarifaEdificio);
        record2.nombre = record.nombre;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.idtarifa = record.idtarifa;
        record2.tari_codigo = record.tari_codigo;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }
});