
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

    tablaHistPrecios.on('select',function(event,dt,type,indexes){    
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Precio");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteHistPrecios.data,'idprecio',tablaHistPrecios.rows( indexes ).data()[0].idprecio);
            idPrecioActual = record;
            cargarPrecios(record);
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
        }    
    });

    tablaPrecios.on( 'select', function (event, dt, type, indexes ) {
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var record = findObjectByKey(reportePrecios.data,'idcargo',tablaPrecios.rows( indexes ).data()[0]["idcargo"]);
            $("#divActualizaciones").removeClass("hidden");
            $("#hdIdCargo").val(record.idcargo);
            $("#txtCargo").val(record.nombre);
            $("#txtClasificacion").val(record.clas_nombre);
            $("#lbCargo").text(record.nombre);
            evento = false;
            $("#selectTipoCalculo").val(record.idcalculo);
            $("#selectTipoCalculo").select2().trigger('change');
            $("#txtObservaciones").val(record.observaciones);
            switch (parseInt(record.idcalculo)) {
                case 1: $("#txtMontoFijo").val(record.monto);
                        break;
                case 2: $("#txtMontoUnitario").val(record.monto);
                        if (record.parametros_json.idvariable !== undefined){   
                            $("#selectVariableFacturar").val(record.parametros_json.idvariable);
                            $("#selectVariableFacturar").select2().trigger('change'); 
                        }
                        else {
                            $("#selectVariableFacturar").val(parseInt(record.variable));
                            $("#selectVariableFacturar").select2().trigger('change');                             
                        }
                        break;
                case 3: $("#txtMontoMedidores").val(record.monto);
                        if (record.parametros_json.medidores !== undefined){
                            $("#txtCantidadMedidores").val(record.parametros_json.medidores);
                        }
                        break;
                case 4: $("#txtMontoUnitario2").val(record.monto);
                        if (record.parametros_json.idvariable !== undefined){ 
                            $("#selectVariableLeer").val(record.parametros_json.idvariable);
                            $("#selectVariableLeer").select2().trigger('change'); 
                        }
                        if (record.parametros_json.valortotal !== undefined){
                            $("#txtValorVariable").val(record.parametros_json.valortotal);
                        }
                        break;
                case 5: $("#txtMontoLista").val(record.monto);
                        if (record.parametros_json.idlista !== undefined){
                            $("#selectLista").val(record.parametros_json.idlista);
                            $("#selectLista").select2().trigger('change');
                        }
                        if (record.parametros_json.tipototal !== undefined){   
                            $("#selectTotalTipo").val(record.parametros_json.tipototal);
                            //$("#selectTotalTipo").select2().trigger('change'); 
                        }
                        if (record.parametros_json.valortotal !== undefined){
                            $("#txtMontoTotal").val(record.parametros_json.valortotal); 
                        }
                        $("#txtMontoTotal").attr("disabled",parseInt(record.parametros_json.tipototal)==1); 
                        break; 
                case 6: $("#txtMontoLista2").val(record.monto);
                        if (record.parametros_json.idlista !== undefined){
                            $("#selectLista2").val(record.parametros_json.idlista);
                            $("#selectLista2").select2().trigger('change');
                        }
                        break;
                case 8: 
                        if (record.parametros_json.idlista !== undefined){
                            $("#selectLista4").val(record.parametros_json.idlista);
                            $("#selectLista4").select2().trigger('change');
                        }
                        break;
                case 9: $("#txtPorcentaje").val(record.monto);
                        if (record.parametros_json.idvariable !== undefined){   
                            $("#selectVariablePorcentaje").val(record.parametros_json.idvariable);
                            $("#selectVariablePorcentaje").select2().trigger('change'); 
                        }
                        else {
                            $("#selectVariablePorcentaje").val(parseInt(record.variable));
                            $("#selectVariablePorcentaje").select2().trigger('change');                             
                        }
                        break;
            }   
            evento = true;
        } 
    });

    tablaAsignaciones.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            monto = 0;
            tablaAsignaciones.rows({ selected: true }).data().map(function(element,index){
                monto += Math.round(parseFloat(element.total),2);
            });     
            $("#lbMontoSel").text(convertirFormatoLocal(monto));
        }
    });

    tablaAsignaciones.on('deselect',function(event,dt,type,indexes){  
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (tablaAsignaciones.rows({ selected: true }).data().length == 0){
                $("#lbMontoSel").text('0');
            }
        }
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
	}
 

    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarTarifas(this.value);
            cargarFacturas(this.value,($("#SelectTarifa").val()));
            cargarListas(this.value,"#selectLista");
            cargarListas(this.value,"#selectLista2");
            cargarListas(this.value,"#selectLista3");
            cargarListas(this.value,"#selectLista4");
        }
    });

    $(document).on('click','#btnSeleccionar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            tablaAsignaciones.rows( {search:'applied'} ).select();
        }
    });

    $(document).on('change','#SelectTarifa',function(event){          
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ((($(this).select2('data') !== undefined) && ($(this).select2('data').length > 0)) && ($("#SelectEdificio").select2('data') !== undefined)) {
                var tarifa = $(this).select2('data')[0];
                var edificio = $("#SelectEdificio").select2('data')[0];
                cargarFacturas($("#SelectEdificio").val(),$("#SelectTarifa").val());
                $("#divActualizaciones").addClass("hidden");
                $('#btnCalcular').removeClass("disabled");
                idtarifaedificio = this.value;
                $("#lbTarifa").text("Cargos Asociados a la Tarifa %s de %s".format(tarifa.text,edificio.text));
                console.log(evento);
                console.log($("#hdOperacion").val());
                if ((evento) && ($("#hdOperacion").val()=="Ingresar")){
                    loadCargosTarifas(reportePrecios,tarifa.id,edificio.id,tableParamsPrecios,"#tablaPrecios");
                }    
            }           
        }
    }); 

    $(document).on('change','#selectTipoCalculo',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                $(".calculo").hide();
                console.log('tipo de calculo:'+this.value);
                $("#calculo"+this.value).show();
                if (evento) {
                    switch (parseInt(this.value)) {
                    case 1: $("#txtMontoFijo").val('0');
                            break;
                    case 2: $("#txtMontoUnitario").val('0');
                            $("#selectVariableFacturar").val(1);
                            $("#selectVariableFacturar").select2().trigger('change'); 
                            break;
                    case 3: $("#txtMontoMedidores").val('0');
                            $("#txtCantidadMedidores").val('1');
                            break;
                    case 4: $("#txtMontoUnitario2").val('0');
                            $("#selectVariableLeer").val(1);
                            $("#selectVariableLeer").select2().trigger('change'); 
                            $("#txtValorVariable").val('0');
                            break;
                    case 5: $("#txtMontoLista").val('0');
                            $("#selectTotalTipo").val(1);
                            $("#selectTotalTipo").select2().trigger('change'); 
                            $("#txtMontoTotal").val(0); 
                            break; 
                    case 6: $("#txtMontoLista2").val('0');break;
                    case 7: $("#txtMontoLista2").val('0');break;
                    case 9: $("#txtPorcentaje").val('0');break;
                }  
            }
        }  
    });

    $(document).on('change','#selectTotalTipo',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (evento){
                $("#txtMontoTotal").attr("disabled",parseInt(this.value)==1); 
                if ((this.value==1) && ($("#selectLista").val() != null)){
                    calcularSumaLista($("#selectLista").val(),"#txtMontoTotal");
                }
                else {
                    $("#txtMontoTotal").val('0');
                }
            }
        }
    });

    $(document).on('change','#selectLista',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if ($("#selectTotalTipo").val() == 1) {
                calcularSumaLista(this.value,"#txtMontoTotal");
            }
            else {
                $("#txtMontoTotal").val('0');    
            }
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Precio");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            clearComponentes();  
        }     
    });

    $(document).on('click','#btnCopiar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            console.log("Duplicar precio %s".format(idPrecioCopiar));
            $('#copiarPreciosModal').modal({keyboard: false});
        }     
    });

    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                    if (tablaPrecios.rows().data().count() > 0) {
                        guardar_precios();
                        confirmarModificar(tablaHistPrecios,{
                            titulo:'Confirmación',
                            msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                            btnSi : "#btnNuevo",
                        });
                    }
                    else {
                        error2({msg:'tabla de precios vacia'});
                    }
            } 
            else {
                //error2({msg:'error'});
            }
                
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_precios(idPrecioActual.idprecio);
                }
                else{
                    //error2({msg:'error'});
                }
            }
        }
    });

    $(document).on('click','#btnActualizar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#FormaActualizacion")) {
                var index = findObjectByKeyIndex(tablaPrecios.rows().data(),'idcargo',parseInt($("#hdIdCargo").val()));
                var record = tablaPrecios.rows().data()[index]; 
                record.idcalculo = $("#selectTipoCalculo").val();
                record.calc_nombre = $("#selectTipoCalculo").select2('data')[0].text;
                if (validar("#FormaActualizacion"+parseInt($("#selectTipoCalculo").val()))) {
                    switch (parseInt($("#selectTipoCalculo").val())){
                        case 1: 
                            record.monto = parseFloat($("#txtMontoFijo").val());
                            record.parametros = '{}'; 
                            break;
                        case 2:
                            record.monto = parseFloat($("#txtMontoUnitario").val()); 
                            record.parametros= '{"idvariable":"%s","variable":"%s"}'.format($("#selectVariableFacturar").val(),$("#selectVariableFacturar").select2('data')[0].text);
                            break;
                        case 3:
                            record.monto = parseFloat($("#txtMontoMedidores").val()); 
                            record.parametros = '{"medidores":"%s"}'.format($("#txtCantidadMedidores").val());
                            break;
                        case 4:
                            record.monto = parseFloat($("#txtMontoUnitario2").val()); 
                            record.parametros= '{"idvariable":"%s","variable":"%s","valortotal":"%s"}'.format($("#selectVariableLeer").val(),$("#selectVariableLeer").select2('data')[0].text,$("#txtValorVariable").val());
                            break;
                        case 5:
                            record.monto = parseFloat($("#txtMontoLista").val()); 
                            record.parametros= '{"idlista":"%s","lista":"%s","tipototal":"%s","valortotal":"%s"}'.format($("#selectLista").val(),$("#selectLista").select2('data')[0].text.split('|')[1],$("#selectTotalTipo").val(),$("#txtMontoTotal").val());
                            break;
                        case 6:
                            record.monto = parseFloat($("#txtMontoLista2").val()); 
                            record.parametros= '{"idlista":"%s","lista":"%s"}'.format($("#selectLista2").val(),$("#selectLista2").select2('data')[0].text.split('|')[1]);
                            break;
                        case 7:
                            record.monto = parseFloat($("#txtMontoLista3").val()); 
                            record.parametros= '{"idlista":"%s","lista":"%s"}'.format($("#selectLista3").val(),$("#selectLista3").select2('data')[0].text.split('|')[1]);
                            break;
                        case 8:
                            record.parametros= '{"idlista":"%s","lista":"%s"}'.format($("#selectLista4").val(),$("#selectLista4").select2('data')[0].text.split('|')[1]);
                            break;
                        case 9:
                            record.monto = parseFloat($("#txtPorcentaje").val()); 
                            record.parametros= '{"idvariable":"%s","variable":"%s"}'.format($("#selectVariablePorcentaje").val(),$("#selectVariablePorcentaje").select2('data')[0].text);
                            break;
                    }
                    record.parametros_json = JSON.parse(record.parametros);
                    success2({msg:"Precio de %s actualizado con Éxito".format($("#txtCargo").val())})
                    record.observaciones = $('#txtObservaciones').val();
                    tablaPrecios.row("#"+record.idcargo).data(record).invalidate().draw('page');
                }
            }
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaHistPrecios").offset().top}, "slow");
        }
    });

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnMontoLista',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                $('#remarcacionModal').modal({keyboard: false});
            }
        }
    });

    $(document).on('click','#btnAceptarRemar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            aceptarClose = true;
            $('#remarcacionModal').modal('hide');
        }
    });

    $(document).on('click','#btnAceptarCopiar',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#FormaParametrosCopiar")) {
                aceptarClose = true;
                $('#copiarModal').modal('hide');
            }
        }
    });

    $(document).on('change','.booleano_activo_precios',function(event){   
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Precios",
                "remarcacion.precios",
                {field:"idprecio",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idprecio',value:id},
                reporteHistPrecios,
                "#checkActivo"
            );
        }
    });

    $(document).on('click','.copiar_precios',function(event){   
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            idPrecioCopiar = $(this).attr("id");
           /* copiarPrecio(tablaHistPrecios,{
                titulo:'Confirmación',
                msg:"¿Desea copiar esta lista de precios y crear una Nueva?",
                btnSi : "#btnCopiar",
            });
        */
            $('#copiarModal').modal({keyboard: false});
        }
    });

    $('#copiarModal').on('show.bs.modal', function (event) {
        if (paginaActiva.code == 63){
            var modal = $(this);
            aceptarClose = false;
            console.log(idPrecioActual);
            modal.find('#textEdificioCopiar').val(idPrecioActual.edif_nombre);
            modal.find('#textTarifaCopiar').val(idPrecioActual.tari_nombre);
            modal.find('#textFechaCopiar').val(moment().format("YYYY-MM-DD"));
            loadCargosTarifasAlmacenados2(reportePrecios2,idPrecioActual.idprecio,tableParamsPrecios2,"#tablaPrecios2");    
        }
    });

    $('#remarcacionModal').on('show.bs.modal', function (event) {
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var modal = $(this);
            aceptarClose = false;
            modal.find('#hdIdEdificioRemar').val($("#SelectEdificio").val());
            modal.find('#textEdificioRemar').val($("#SelectEdificio").select2('data')[0].text);
            modal.find('#hdIdTarifaRemar').val($("#SelectTarifa").val());
            modal.find('#textTarifaRemar').val($("#SelectTarifa").select2('data')[0].text);
            modal.find('#textFechaRemar').val($("#textFecha").val());
            modal.find('#textFechaInicialRemar').val($("#textFechaInicial").val());
            modal.find('#textFechaFinalRemar').val($("#textFechaFinal").val());
            loadAsignaciones(reporteAsignaciones,$("#hdIdEdificioRemar").val(),$("#hdIdTarifaRemar").val(),$('#textFechaInicialRemar').val(),$('#textFechaFinalRemar').val(),"#tablaAsignaciones")
        }
    })

    $('#copiarModal').on('hidden.bs.modal', function (event) {
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (aceptarClose) {
                duplicarPrecios(idPrecioActual.idprecio,$('#textFechaInicialCopiar').val(),$("#textFechaFinalCopiar").val());
            }
        }
    })

    $('#remarcacionModal').on('hidden.bs.modal', function (event) {
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (aceptarClose) {
                $("#txtMontoLista").val(monto);
            }
        }
    })

    function calcularSumaLista(idlista,component){
        $.ajax({
            url: "php/data.php",
            type:"POST",
            data:{
                queries : [{
                    fieldsSelect:["coalesce(sum(valor),0) as total"],
                    tableName   :"remarcacion.valores_listas",
                    where:[{
                        field:"idlista",
                        oper:"=",
                        value:idlista,
                        type:"int"
                    }],
                }]
            },
            success: function(data){
                $(component).val(data[0].resultados[0].total);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        });

        
    }

    function cargarPrecios(record){
        $("#textFecha").val(record.fecha);
        $("#textFechaInicial").val(record.desde);
        $("#textFechaFinal").val(record.hasta);
        evento = false;
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');
        $("#checkActivo").attr("checked",(record.activo=='t'));
        //console.log(record.idtarifaedificio);
        //$("#SelectTarifa").val(record.idtarifaedificio);
        //$("#SelectTarifa").select2().trigger('change');
        $("#textAdjuntoPrecio").val(record.adjunto_cont);
        $("#lbTarifa").text("Cargos Asociados a la Tarifa %s de %s".format(record.tari_nombre,record.edif_nombre));
        loadCargosTarifasAlmacenados(reportePrecios,record.idprecio,tableParamsPrecios,"#tablaPrecios");    
    }

    function clearComponentes(){
        idPrecioActual = {};
        $("#textFecha").val(moment().format("YYYY-MM-DD"));
        $("#textFechaInicial").val('');
        $("#textFechaFinal").val('');  
        $("#textAdjuntoPrecio").val('');
        $("#checkActivo").attr("checked",true); 
        $("#SelectEdificio").val($("#SelectEdificio option:first").val());
        $("#SelectEdificio").select2().trigger('change'); 
        $("#divActualizaciones").addClass("hidden"); 
        $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");           
    }

    function loadCargosTarifas(reporte,idtarifaedificio,idedificio,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsPrecios = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*","0 as monto","'{}' as parametros,'' as observaciones"],
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
                    },]
                },
                dataSrc: function(data){
                    reporte.activo = false;
                    $('#btnCalcular').removeAttr('disabled');
                    reporte.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["idcargo"] = parseInt(data[0].resultados[i].idcargo);
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo;
                        elemento["parametros_json"] = JSON.parse(data[0].resultados[i].parametros); 
                        reporte.data.push(elemento);
                    }
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsPrecios;
            tablaPrecios = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

    function loadCargosTarifasAlmacenados(reporte,idprecio,tableParams,idtabla){     
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsPrecios = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*","array_to_json(array[parametros])->>0 as parametros"],
                        tableName   :"remarcacion.vcargosprecios",
                        orderby:[{
                            field:"idclasificacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idprecio",
                            oper:"=",
                            value:idprecio,
                            type:"int"    
                        }],      
                    }]
                },
                dataSrc: function(data){               
                    reporte.activo = false;
                    $('#btnCalcular').removeAttr('disabled');
                    reporte.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["idcargo"] = parseInt(data[0].resultados[i].idcargo);
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo;
                       // elemento["parametros_json"] = {}; 
                       elemento["parametros_json"] = JSON.parse(data[0].resultados[i].parametros);
                        reporte.data.push(elemento);
                    }
                    evento = true;
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsPrecios;
            tablaPrecios = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

    function loadCargosTarifasAlmacenados2(reporte,idprecio,tableParams,idtabla){     
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsPrecios = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*","array_to_json(array[parametros])->>0 as parametros"],
                        tableName   :"remarcacion.vcargosprecios",
                        orderby:[{
                            field:"idclasificacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idprecio",
                            oper:"=",
                            value:idprecio,
                            type:"int"    
                        }],      
                    }]
                },
                dataSrc: function(data){               
                    reporte.activo = false;
                    $('#btnCalcular').removeAttr('disabled');
                    reporte.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["idcargo"] = parseInt(data[0].resultados[i].idcargo);
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo;
                       // elemento["parametros_json"] = {}; 
                       elemento["parametros_json"] = JSON.parse(data[0].resultados[i].parametros);
                        reporte.data.push(elemento);
                    }
                    evento = true;
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsPrecios;
            tablaPrecio2s = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 


    function guardar_cargos_precios(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "remarcacion.precios_cargos";
        elementos["operacion"] = "Ingresar";
        arguments[0].cargos.forEach(function (value, index){
            elementos["campos"].push({
                "idprecio"    : argumentos[0].idprecio,
                "idcargo"     : value.idcargo,
                "monto"       : value.monto,
                "idcalculo"   : value.idcalculo,
                "parametros"  : JSON.stringify(value.parametros),
                "observaciones": value.observaciones
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
                    guardar_log(argumentos[0].idprecio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    tablaHistPrecios.row({selected: true}).deselect();
                    tablaHistPrecios.ajax.reload();
                    success2({
                        msg : data[0].mesg,
                    });
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

    function guardar_precios(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.precios";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "fecha"      : $("#textFecha").val(),
            "desde"      : $("#textFechaInicial").val(),
            "hasta"      : $("#textFechaFinal").val(),
            "idedificio" : $("#SelectEdificio").val(),
            "idtarifaedificio"   : $("#SelectTarifa").val(),
            "idgrupofactura" : ($("#SelectFactura").val() != -1)?$("#SelectFactura").val():'null',
            "adjunto" : $("#textAdjuntoPrecio").val(),
            "activo"     : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idprecio"); 
        console.log(elementos);
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
                        guardar_log(data[0].return[0]["idprecio"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        guardar_cargos_precios({
                            idprecio:data[0].return[0]["idprecio"],
                            cargos:reportePrecios.data
                        });

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

    function eliminar_cargos_precios(idPrecio){
        var elementos = {}
        elementos["tableName"] = "remarcacion.precios_cargos";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"idprecio",
            oper:"=",
            value:idPrecio,
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
                    guardar_log(idPrecio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    guardar_cargos_precios({
                        idprecio:idPrecio,
                        cargos:reportePrecios.data
                    });
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

    function actualizar_precios(idPrecio){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.precios";
        elementos["primaryField"] = "idprecio";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "date,timestamp,timestamp,integer,integer,text,boolean,integer,integer";
        elementos["campos"].push({
            "update":{
                "fecha"              : $("#textFecha").val(),
                "desde"              : $("#textFechaInicial").val(),
                "hasta"              : $("#textFechaFinal").val(),
                "idedificio"         : $("#SelectEdificio").val(),
                "idtarifaedificio"   : $("#SelectTarifa").val(),
                "adjunto"            : $("#textAdjuntoPrecio").val(),
                "activo"             : $("#checkActivo").is(":checked"),
                "idgrupofactura"     : ($("#SelectFactura").val() != -1)?$("#SelectFactura").val():'null',
            },
            "primaryValue" : idPrecio,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idPrecio);
                    guardar_log(idPrecio,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    eliminar_cargos_precios(idPrecio);
                    success2({
                        msg : data[0].mesg,
                    });
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

    function updaterecord(idPrecio){
        var index = findObjectByKeyIndex(tablaHistPrecios.rows().data(),'idprecio',idPrecio);
        var record = tablaHistPrecios.rows().data()[index]; 
        record.desde = $("#textFechaInicial").val();
        record.fecha = $("#textFecha").val();
        record.hasta = $("#textFechaFinal").val();
        record.idedificio = $("#SelectEdificio").val();
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.idtarifa = $("#SelectTarifa").val();
        record.tari_codigo = $("#SelectTarifa").select2('data')[0].text;
        record.adjunto_cont = $("#textAdjuntoPrecio").val();
        record.adjunto = (record.adjunto_cont != '')?'<button id="%s" name="descargar" data-file="%s"class="btn btn-info btn-xs descargar_adjunto"><i class="fa fa-download"></i></button>'.format(idPrecio,record.adjunto_cont):'';
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_precios" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idprecio,($("#checkActivo").is(":checked"))?"checked":"");
        record.infofactura = "Facturas:%s, Neto:%s CLP".format(($('#SelectFactura option:selected').attr('data-facturas') !== undefined)?$('#SelectFactura option:selected').attr('data-facturas'):0,($('#SelectFactura option:selected').attr('data-totalneto') !== undefined)?$('#SelectFactura option:selected').attr('data-totalneto'):0);
        tablaHistPrecios.row("#"+record.idprecio).data(record).invalidate().draw('page');  
        var record2 = findObjectByKey(reporteHistPrecios.data,'idprecio',idPrecio);
        record2.desde = record.desde;
        record2.fecha = record.fecha;
        record2.hasta = record.hasta;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.idtarifa = record.idtarifa;
        record2.tari_codigo = record.tari_codigo;
        record2.adjunto_cont = record.adjunto_cont;
        record2.adjunto = record.adjunto;
        record2.infofactura = record.infofactura;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";

    }

    function loadAsignaciones(reporte,idedificio,idtarifa,fechainicial,fechafinal,idtabla){
        console.log(arguments);
        var precios = [];
        var idlista = [];
        reportePrecios.data.map(function(value,index){
            var precio = JSON.parse(value.parametros);
            
            if (precio.idlista !== undefined) {
                if (idlista.indexOf(precio.idlista) === -1){
                    idlista.push(precio.idlista);
                }
            }
            precios.push({
                idcargo:value.idcargo,
                nombre:value.nombre,
                idcalculo:value.idcalculo,
                monto:value.monto,
                parametros:value.parametros,
                isleido:value.isleido
            });
        }); 
        if (!(reporte.activo)){
            reporte.activo = true;

            if ( $.fn.DataTable.isDataTable(idtabla) ) {
                $(idtabla).DataTable().destroy();
                $(idtabla).empty();
                //tablaasignaciones.processing( true );
            }; 

            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.getCalculos2(%s,%s,%s,'%s','%s','%s'::json,'%s')".format(
                            idedificio,
                            idtarifa,
                            usuarioActivo,
                            fechainicial,
                            fechafinal,
                            JSON.stringify(precios),
                            database,
                        ),
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[],      
                    },
                    {
                        fieldsSelect:["idlista","idvalorlista","idasignacion","valor"],
                        tableName : "remarcacion.listas left join remarcacion.valores_listas using(idlista)",
                        orderby:[
                            {field:"idlista",type:"asc"},
                            {field:"idasignacion",type:"asc"}
                        ],
                        where :[
                            {field:"listas.idlista",oper:"in",value:"(%s)".format(idlista.join(',')),type:"int"}
                        ],
                    }]
                },
                success: function(data){
                    /*ACOMODAR LISTA*/
                    listas = [];
                    data[1].resultados.forEach(function(element,index){
                        var registro = findObjectByKey(listas,'idlista',parseInt(element.idlista));
                        if (registro == null){
                            index = listas.push({
                                idlista:parseInt(element.idlista),
                                valores:[]        
                            });
                            registro = listas[index-1];
                        }
                        registro.valores.push({
                            idvalorlista:parseInt(element.idvalorlista),
                            idasignacion:parseInt(element.idasignacion),
                            valor:parseFloat(element.valor)
                        });
                    });

                    
                    reporte.activo = false;
                    $('#btnGuardar').removeAttr("disabled");

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing:true,
                      //  scrollY: 300,
                        scrollX:        true,
                        scrollCollapse: true,
                        autoWidth:false,
                        rowId: 'idasignacion',
                        fixedColumns:   {
                            leftColumns: 2,
                            rightColumns: 1
                        },
                        order: [[ 0, 'asc' ]],
                        select: {
                            style: 'os',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                    }




                    montosFijos = JSON.parse(data[0].resultados[0].montosfijos);
                    factoresCalculos = JSON.parse(data[0].resultados[0].factorescalculos);
                    valoresLeidos = JSON.parse(data[0].resultados[0].valoresleidos);
                    valoresFacturados = JSON.parse(data[0].resultados[0].valoresfacturados);    
                   //**********Inicio Construir Cabeceras Tabla */
                    tableParams.columns=[
                        {data:"idasignacion",title:"Asignación"},
                        {data:"codigo",title:"Medidor"},
                        {data:"cons_nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [5,7], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'text-right',
                        type:'html-num-fmt'
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets:[3,4,6],
                        className: 'minimo120',
                    },
                    {
                        targets:[2],
                        className: 'minimo200',
                    }];


                    var indexColumn = 8;
                    valoresLeidos.forEach(function(element,index) {
                        tableParams.columns.push({data:"valoresleidos%s".format(index),title:element.nombre,width:"120px"});
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });
                    valoresFacturados.forEach(function(element,index) {
                        tableParams.columns.push({data:"valoresfacturados%s".format(index),title:element.nombre,width:"120px"}); 
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });
                    montosFijos.forEach(function(element,index) {
                        tableParams.columns.push({data:"montosfijos%s".format(index),title:element.nombre,width:"120px"}); 
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });
                    factoresCalculos.forEach(function(element,index) {
                        tableParams.columns.push({data:"montoscalculados%s".format(index),title:element.nombre,width:"120px"}); 
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });

                    tableParams.columns.push({data:"total",title:"Total"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++);                
                    //**********Final Construir Cabeceras Tabla */

                    //**********Inicio Definiciones de Columnas */

                    //********Inicio Construir arreglo de valores (table)

                    //********Final Construir arreglo de valores (table)

                    dataLeidaFacturada.data = [];
                    data[0].resultados.forEach(function(element,index){
                        var registro = {};
                        dataLeidaFacturada.data.push({
                            leidos:[],
                            facturados:[]
                        });      

                        registro = {
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            cons_nombre:element.cons_nombre,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                        };
                        
                        JSON.parse(element.valoresleidos).forEach(function(e,i){
                            registro["valoresleidos%s".format(i)] = e.valor;  
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].leidos.push({
                                idcargo: parseInt(e.idcargo),
                                valor  : parseFloat(e.valor),
                                fecha  : null
                            });                   
                        });
                        valoresFacturados =  JSON.parse(element.valoresfacturados);
                        valoresFacturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.valor;                     
                        });
                        registro.total = 0;
                        JSON.parse(element.montosfijos).forEach(function(e,i){
                            registro["montosfijos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].facturados.push({
                                idcargo    : parseInt(e.idcargo),
                                facturado  : 1,
                                monto      : Math.round(parseFloat(e.monto))
                            });                     
                        });
                        JSON.parse(element.factorescalculos).forEach(function(e,i){
                            var valor = 0;
                            if (e.idvariable !== undefined) {
                                switch (parseInt(e.idvariable)) {
                                    case 1: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','4').valor);
                                    break;
                                    case 2: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','5').valor);
                                    break;
                                }
                            }
                            else if (e.idlista !== undefined) {
                                if (e.idlista != ""){
                                    var unico = ((e.unico !== undefined) && (e.unico == 1));
                                    lista = findObjectByKey(listas,'idlista',parseInt(e.idlista));
                                    asignacion = findObjectByKey(lista.valores,'idasignacion',parseInt(registro.idasignacion));
                                    valor = (asignacion != null)?(!(unico))?asignacion.valor:1:0;
                                }
                                else {
                                    valor = 0;
                                }
                            }
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].facturados.push({
                                idcargo    : parseInt(e.idcargo),
                                facturado  : valor,
                                monto      : Math.round(valor * parseFloat(e.factor))
                            }); 
                            registro["montoscalculados%s".format(i)] = Math.round(valor * parseFloat(e.factor));
                            registro.total += Math.round(valor * parseFloat(e.factor));
                        })
                        reporte.data.push(registro);                       
                    });
                        tableParams.data = reporte.data;
                        tablaAsignaciones = $(idtabla).DataTable(tableParams);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            });   
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    }  

    $(document).on('click','#btnAdjunto',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            document.getElementById("filePDFPrecio").click();
        }
    });

    document.getElementById('filePDFPrecio').addEventListener('change', uploadPrecio, false);

    function uploadPrecio(evt) {
        $('#submitFilePDFPrecio').click();
    }

    $(document).on('click',"#submitFilePDFPrecio",function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var file_data = $('#filePDFPrecio').prop('files')[0];
            if(file_data != undefined) {
                var form_data = new FormData();                  
                form_data.append('file', file_data);
                $.ajax({
                    type: 'POST',
                    url: 'php/uploadFile.php',
                    contentType: false,
                    processData: false,
                    data: form_data,
                    success:function(data) {
                        a = JSON.parse(data);
                        if (a[0].tipo == 'success') {
                            $("#textAdjuntoPrecio").val(a[0].file);
                        }
                        else{
                            error2({msg:a[0].mesg});
                        }
                        
                    }
                });
            }
            return false;
        }    
    });  

    $(document).on('click',"#btnLimpiarAdjunto",function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $('#textAdjuntoPrecio').val('');
        }    
    });

    $(document).on('click','.descargar_adjunto',function(event){
        if (paginaActiva.code == 63){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var File =  'php/uploads/%s'.format($(this).attr('data-file'));
            descargar2(File,$(this).attr('data-file'));
        }
    });

    function cargarTarifas(idedificio){
        selectJs2(
            "#SelectTarifa",
            {   Selected:(idPrecioActual != null)?idPrecioActual.idtarifaedificio:-1, 
                value: "idtarifaedificio",
                show: {
                    fields:["idtarifaedificio","nombre","tari_codigo"],
                    format: "%s - %s | (%s)"
                },
                hide: ["idtarifaedificio"],
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vtarifasedificios",
                    orderby:[{
                        field:"nombre",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "AND",
                        field  : "idtarifaedificio",
                        oper   : "in",
                        type   : "int",   
                        value  : "(select distinct(idtarifaedificio) from mediciones.vmedidores where (idedificio=%s))".format(idedificio), 
                        }
                    ]        
                }],
            },
            {startDisable:true,
            }    
        );
     
    }

    function cargarFacturas(idedificio,idtarifaedificio){
        selectJs2(
            "#SelectFactura",
            { 
                Selected:(idPrecioActual != null)?(idPrecioActual.idgrupofactura !== undefined)?idPrecioActual.idgrupofactura:-1:-1,
                Nulo :[ {
                    value: -1,
                    text : 'Ninguna'
                }],
                value: "idgrupofactura",
                show: {
                    
                    fields:["idgrupofactura","fecha","facturas","totalneto"],
                    format: "GF-%s | %s (Fact:%s, Neto: %s CLP)"
                },  
                queries:[{
                    
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vgruposfacturas",
                    orderby:[
                        {field:"idgrupofactura",type:"desc"}
                    ],
                    where:[{
                        field:"(idedificio",
                        oper:"=",
                        value:idedificio,
                        type:"int"
                    },{
                        logical:"and",
                        field:"activo",
                        oper:"=",
                        value:"true",
                        type:"int"
                    },
                    {
                        logical:"and",
                        field:"idgrupofactura",
                        oper:"not in",
                        value:"(select distinct(coalesce(idgrupofactura,0)) from remarcacion.precios where (idedificio=%s) and (idtarifaedificio=%s)))".format(idedificio,idtarifaedificio),
                        type:"int"
                    },
                    {
                        logical:"or",
                        field:"idgrupofactura",
                        oper:"=",
                        value:(idPrecioActual.idgrupofactura !== undefined) && (idPrecioActual.idgrupofactura != null) ?idPrecioActual.idgrupofactura:-1,
                        type:"int"
                    }]       
                }],
            },
            {
                startDisable:true,
            }
        );        
    }

    function cargarListas(idedificio,lista){
        selectJs2(
            lista,
            { 
            value: "idlista",
            show: {
                fields:["idlista","nombre","fecha"],
                format: "%s | %s (%s)"
            },
            queries:[{
                fieldsSelect:["*"],
                tableName   :"remarcacion.listas",
                orderby:[
                    {field:"tipo",type:"asc"},
                    {field:"idlista",type : "asc"}
                ],
                where:[{
                    field:"idedificio",
                    oper:"=",
                    value:idedificio,
                    type:"int"
                },
                {
                    logical:'and',
                    field:'activa',
                    oper:'=',
                    value:true,
                    type:'int'
                }]       
            }],
        });

    }

    function duplicarPrecios(idprecio,fechainicial,fechafinal){
        $.ajax({
            url: "php/data.php",
            type:"POST",
            data:{
                queries : [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.duplicar_precios(%s,'%s','%s',%s)".format(idprecio,fechainicial,fechafinal,usuarioActivo),
                    where:[],      
                }]
            },
            success: function(data){
                if (data[0].resultados[0].duplicar_precios == "1"){
                    success2({
                        msg : "Precio con id:%s fue duplicado con éxito".format(idprecio),    
                    });  
                    tablaHistPrecios.row({selected: true}).deselect();
                    tablaHistPrecios.ajax.reload();                    
                }
                else {
                    error2({
                        msg : "Ocurrio un error al tratar de suplicar el precio con id:%s".format(idprecio),    
                    });                    
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        });       
    }

});