
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

    tablaGrupos.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Grupos");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteGrupos.data,'idgrupofactura',tablaGrupos.rows( indexes ).data()[0].idgrupofactura);
            GrupoActual = record;
            cargarGrupos(record);    
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
        }     
    });

    tablaFacturas.on( 'select', function (event, dt, type, indexes ) {
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var record = findObjectByKey(reporteFacturas.data,'idfactura',tablaFacturas.rows( indexes ).data()[0].idfactura);
            $("#hdIdFactura").val(record.idfactura);
            $("#selectProveedor").val(record.idproveedor);
            $("#selectProveedor").select2().trigger('change');
            $("#selectMedidor").val(record.idmedidorfisico);
            $("#selectMedidor").select2().trigger('change');
            $("#textBoleta").val(record.boleta);
            $("#textCliente").val(record.cliente);
            $("#textFechaFactura").val(record.fecha);
            $("#textConsumo").val(record.consumo);
            $("#textConsumoPP").val(record.consumopp);
            $("#textConsumoPPP").val(record.consumoppp);
            $("#textMontoNeto").val(record.monto);
            $("#textIVA").val(record.iva);
            $("#textCredito").val(record.credito);
            $("#textMontoNeto").trigger('keyup');
            $("#textAdjunto").val(record.adjunto_cont);
            $("#textObservaciones").val(record.observaciones);
            $("#btnActualizar").attr('disabled',false);
        }
    });
 
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
	}

    $(document).on('change','#selectEdificio',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            cargarMedidores(this.value);
            if ($("#hdOperacion").val() == "Ingresar") {
                
                //loadValores(reporteValores,this.value,tableParamsValores,"#tablaValores");
            }
        }
    });

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnActualizar',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#formaActualizacion")) {
                console.log(tablaFacturas.rows().data());
                var index = findObjectByKeyIndex(tablaFacturas.rows().data(),'idfactura',$("#hdIdFactura").val());
                var record = tablaFacturas.rows().data()[index];
                record.idproveedor = $("#selectProveedor").val();
                record.prov_nombre = $("#selectProveedor").select2('data')[0].text;
                record.idmedidorfisico = $("#selectMedidor").val();
                record.codigo = $("#selectMedidor").select2('data')[0].text.split('|')[0];
                record.boleta = $("#textBoleta").val();
                record.cliente = $("#textCliente").val();
                record.fecha = $("#textFechaFactura").val();
                record.consumo = $("#textConsumo").val();
                record.consumopp = ($("#textConsumoPP").val() != '')?$("#textConsumoPP").val():0;
                record.consumoppp = ($("#textConsumoPPP").val() != '')?$("#textConsumoPPP").val():0;
                record.monto = $("#textMontoNeto").val();
                record.iva = $("#textIVA").val();
                record.montoiva = $("#textMontoIVA").val();
                record.credito = ($("#textCredito").val() != '')?$("#textCredito").val():0;
                record.montosubtotal = $("#textSubTotal").val();
                record.montototal   = $("#textMontoTotal").val();
                record.adjunto      = ($("#textAdjunto").val() != '')?'<button id="%s" name="descargar" data-file="%s"class="btn btn-info btn-xs descargar_adjunto"><i class="fa fa-download"></i></button>'.format($("#hdIdFactura").val(),$("#textAdjunto").val()):'',
                record.adjunto_cont =$("#textAdjunto").val(),
                record.observaciones = $("#textObservaciones").val();
                tablaFacturas.row("#"+record.idfactura).data(record).invalidate().draw('page');
                success2({msg:"Factura actualizada con Éxito"});

            }
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaGrupos").offset().top}, "slow");
        }
    });

    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
            if (validar("#formaParametros")) {
                if (tablaFacturas.rows().data().count() > 0) {
                    guardar_grupos();
                    confirmarModificar(tablaGrupos,{
                        titulo:'Confirmación',
                        msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                        btnSi : "#btnNuevo",
                    });
                }
                else {
                    error2({msg:'Tabla de Facturas Vacía'});
                }
            } 
            else {
                //error2({msg:'error'});
            }
                
            }
            else {
                if (validar("#formaParametros")){
                    if (tablaFacturas.rows().data().count() > 0) {
                        actualizar_grupo(GrupoActual);
                        
                    }
                    else {
                        error2({msg:'Tabla de Facturas Vacía'});
                    }
                }
                else{
                // error2({msg:'error'});
                }
            }
        }
    });

    $(document).on('click','#btnEliminarFactura',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            tablaFacturas.rows('.selected').data().map(function(element,index){
                var index = findObjectByKeyIndex(reporteFacturas.data,'idfactura',element.idfactura);            
                reporteFacturas.data.splice(index,1);
            });
            tablaFacturas.rows('.selected').remove().draw(false);

            $("#btnEliminarFactura").attr("disabled",(reporteFacturas.data.length == 0),true,false);
            $("#btnActualizar").attr("disabled",(reporteFacturas.data.length == 0),true,false);
            $('#formaActualizacion').trigger("reset");
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Grupo de Facturas");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            clearComponentes(); 
        }    
    });

    $(document).on('click',"#btnLimpiar",function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $('#formaActualizacion').trigger("reset");
        }    
    });

    $(document).on('click',"#btnLimpiarAdjunto",function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $('#textAdjunto').val('');
        }    
    });

    $(document).on('click','#btnAgregar',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#formaActualizacion")) {
                if (reporteFacturas.data.filter(factura => (factura.boleta === $("#textBoleta").val())).length == 0) {
                    var index = agregarFactura(reporteFacturas.data);
                    console.log(reporteFacturas.data);
                    tablaFacturas.rows.add([reporteFacturas.data[index-1]]).draw(); 
                    success2({msg:"Factura agregada con Éxito"});
                }
                else{
                    error2({msg:"Factura para la boleta N° %s, ya se encuentra ingresada...".format($("#textBoleta").val())});    
                }
             }
        }    
    });

    $(document).on('change','.booleano_activo_gruposfacturas',function(event){   
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Grupos de Facturas",
                "remarcacion.grupos_facturas",
                {field:"idgrupofactura",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idgrupofactura',value:id},
                reporteGrupos,
                "#checkActivo"
            );
        }
    });

    $(document).on('reset','#formaActualizacion',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#selectProveedor").val($("#selectProveedor option:first").val());
            $("#selectProveedor").select2().trigger('change');  
            $("#selectMedidor").val($("#selectMedidor option:first").val());
            $("#selectMedidor").select2().trigger('change');    
            $("#textFechaFactura").val(moment().format("YYYY-MM-DD"));    
            $("#textIVA").val(19);
            $("#textMontoNeto").val(0);
            $("#textMontoIVA").val(0);
            $("#textSubTotal").val(0);
            $("#textCredito").val(0);
            $("#textMontoTotal").val(0);
            $("#textObservaciones").val('');
        }
    });

    $(document).on('keyup','#textMontoNeto',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var Monto = (!(isNaN(parseFloat(this.value))))?parseFloat(this.value):0;
            var IVA   = (!(isNaN(parseFloat($("#textIVA").val()))))?parseFloat($("#textIVA").val()):0;
            var Credito = (!(isNaN(parseFloat($("#textCredito").val()))))?parseFloat($("#textCredito").val()):0;
            var PIVA = Math.round((IVA/100) * 100) / 100;
            var MontoIVA = Math.round(Math.round(Monto*PIVA) * 100) / 100;
            var SubTotal = Math.round((Monto + MontoIVA) * 100) / 100;
            var Total = Math.round((Monto+MontoIVA-Credito) * 100) / 100; 
            $("#textMontoIVA").val(MontoIVA);       
            $("#textSubTotal").val(SubTotal);
            $("#textMontoTotal").val(Total);
        }
    });
    
    $(document).on('keyup','#textIVA',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var IVA = (!(isNaN(parseFloat(this.value))))?parseFloat(this.value):0;
            var Monto   = (!(isNaN(parseFloat($("#textMontoNeto").val()))))?parseFloat($("#textMontoNeto").val()):0;
            var Credito = (!(isNaN(parseFloat($("#textCredito").val()))))?parseFloat($("#textCredito").val()):0;
            var PIVA = Math.round((IVA/100) * 100) / 100;
            var MontoIVA = Math.round(Math.round(Monto*PIVA) * 100) / 100;
            var SubTotal = Math.round((Monto + MontoIVA) * 100) / 100;
            var Total = Math.round((Monto+MontoIVA-Credito) * 100) / 100; 
            $("#textMontoIVA").val(MontoIVA);       
            $("#textSubTotal").val(SubTotal);
            $("#textMontoTotal").val(Total);
        }
    });  
    
    $(document).on('keyup','#textCredito',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var Credito = (!(isNaN(parseFloat(this.value))))?parseFloat(this.value):0;
            var IVA   = (!(isNaN(parseFloat($("#textIVA").val()))))?parseFloat($("#textIVA").val()):0;
            var Monto   = (!(isNaN(parseFloat($("#textMontoNeto").val()))))?parseFloat($("#textMontoNeto").val()):0;
            var PIVA = Math.round((IVA/100) * 100) / 100;
            var MontoIVA = Math.round(Math.round(Monto*PIVA) * 100) / 100;
            var SubTotal = Math.round((Monto + MontoIVA) * 100) / 100;
            var Total = Math.round((Monto+MontoIVA-Credito) * 100) / 100; 
            $("#textMontoIVA").val(MontoIVA);       
            $("#textSubTotal").val(SubTotal);
            $("#textMontoTotal").val(Total);
        }
    });      

    function clearComponentes(){
        if (paginaActiva.code == 52){
            $("#selectEdificio").val($("#selectEdificio option:first").val());
            $("#selectEdificio").select2().trigger('change');           
            $("#textFecha").val(moment().format("YYYY-MM-DD"));
            $("#textDescripcion").val('');
            $("#checkActivo").attr("checked",true);
            $('#formaActualizacion').trigger("reset");
            if (tableParamsFacturas.aaData !== undefined) {
                tableParamsFacturas.aaData.length = 0;
            }
            if (tableParamsFacturas.data !== undefined) {
                tableParamsFacturas.data.length = 0;
            }
            if ($.fn.DataTable.isDataTable("#tablaFacturas") ) {
                $("#tablaFacturas").DataTable().destroy();
                $("#tablaFacturas").empty();
                $("#tablaFacturas").append('<tfoot><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot');
            }; 
            reporteFacturas.data.length = 0;
            tablaFacturas = $("#tablaFacturas").DataTable(tableParamsFacturas);  
            $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");    
        }       
    }

    function cargarGrupos(record){
        $("#textFecha").val(record.fecha);
        $("#textdescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#selectEdificio").val(record.idedificio);
        $("#selectEdificio").select2().trigger('change');     
        loadFacturasAlmacenadas(reporteFacturas,record.idgrupofactura,tableParamsFacturas,"#tablaFacturas");    
        $('#formaActualizacion').trigger("reset");
    }

    function loadFacturasAlmacenadas(reporte,idgrupofactura,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*","round(monto*(iva/100),2) as montoiva","round(monto + (monto*(iva/100)),2) as montosubtotal","(round(monto + (monto*(iva/100)),2)-coalesce(credito,0)) as montototal"],
                        tableName   :"remarcacion.vfacturas",
                        orderby:[{
                            field:"idfactura",
                            type : "asc"
                        }],
                        where:[{
                            field:"idgrupofactura",
                            oper:"=",
                            value:idgrupofactura,
                            type:"int"    
                        }],      
                    }
                ]
                },
                success: function(data){           
                    reporte.activo = false;
                    data[0].resultados.map(function(value,index){
                        value.adjunto_cont = value.adjunto;
                        value.adjunto = (value.adjunto_cont != '')?'<button id="%s" name="descargar" data-file="%s"class="btn btn-info btn-xs descargar_adjunto"><i class="fa fa-download"></i></button>'.format(value.idfactura,value.adjunto_cont):'';
                    });
                    reporte.data = data[0].resultados;  
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        $(idtabla).append('<tfoot><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot');
                    }; 
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaFacturas = $(idtabla).DataTable(tableParams);   
                    console.log(reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            }); 
        }    
        else {
//            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

    function guardar_facturas_grupo(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "remarcacion.facturas";
        elementos["operacion"] = "Ingresar";
        arguments[0].facturas.forEach(function (value, index){
            elementos["campos"].push({
                "idgrupofactura"      : argumentos[0].idgrupofactura,
                "idproveedor"         : value.idproveedor,
                "idmedidorfisico"     : value.idmedidorfisico,
                "fecha"               : value.fecha,
                "boleta"              : value.boleta,
                "cliente"             : value.cliente,
                "consumo"             : value.consumo,
                "consumopp"           : value.consumopp,
                "consumoppp"          : value.consumoppp,
                "iva"                 : value.iva,
                "monto"               : value.monto,
                "credito"             : value.credito,
                "observaciones"       : value.observaciones, 
                "adjunto"             : value.adjunto_cont
            });
        }); 
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(argumentos[0].idgrupofactura,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    tablaGrupos.row({selected: true}).deselect();
                    tablaGrupos.ajax.reload();
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
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_grupos(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.grupos_facturas";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "fecha"      : $("#textFecha").val(),
            "idedificio" : $("#selectEdificio").val(),
            "descripcion": $("#textDescripcion").val(),
            "activo"     : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idgrupofactura"); 
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
                        guardar_log(data[0].return[0]["idgrupofactura"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        guardar_facturas_grupo({
                            idgrupofactura:data[0].return[0]["idgrupofactura"],
                            facturas:reporteFacturas.data
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

    function eliminar_facturas_grupo(idGrupo){
        var elementos = {}
        elementos["tableName"] = "remarcacion.facturas";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"idgrupofactura",
            oper:"=",
            value:idGrupo,
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
                    guardar_log(idGrupo,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    guardar_facturas_grupo({
                        idgrupofactura:idGrupo,
                        facturas:reporteFacturas.data
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

    function actualizar_grupo(Grupo){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.grupos_facturas";
        elementos["primaryField"] = "idgrupofactura";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "date,integer,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "fecha"      : $("#textFecha").val(),
                "idedificio" : $("#selectEdificio").val(),
                "descripcion": $("#textDescripcion").val(),
                "activo"     : $("#checkActivo").is(":checked")
            },
            "primaryValue" : Grupo.idgrupofactura,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(Grupo.idgrupofactura);
                    guardar_log(Grupo.idgrupofactura,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    actualizar_facturas({
                        idgrupofactura:Grupo.idgrupofactura,
                        facturas:reporteFacturas.data
                    });
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

    function actualizar_facturas(){
        //event.preventDefault();
        var idgrupofactura = arguments[0].idgrupofactura;
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.facturas";
        elementos["primaryField"] = "idfactura";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,integer,date,text,text,numeric,numeric,numeric,numeric,numeric,numeric,text,text,integer";
        arguments[0].facturas.forEach(function (value, index){
            elementos["campos"].push({
                "update":{
                    "idproveedor"         : value.idproveedor,
                    "idmedidorfisico"     : value.idmedidorfisico,
                    "fecha"               : value.fecha,
                    "boleta"              : value.boleta,
                    "cliente"             : value.cliente,
                    "consumo"             : value.consumo,
                    "consumopp"           : value.consumopp,
                    "consumoppp"          : value.consumoppp,
                    "iva"                 : value.iva,
                    "monto"               : value.monto,
                    "credito"             : value.credito,
                    "observaciones"       : value.observaciones, 
                    "adjunto"             : value.adjunto_cont
                },
                "primaryValue" : value.idfactura,
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
                    //updaterecord(arguments[0].idgrupofactura);
                    guardar_log(idgrupofactura,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

    function updaterecord(idGrupoFactura){
        var index = findObjectByKeyIndex(tablaGrupos.rows().data(),'idgrupofactura',idGrupoFactura);
        var record = tablaGrupos.rows().data()[index]; 
        record.idedificio = $("#selectEdificio").val()
        record.edif_nombre = $("#selectEdificio").select2('data')[0].text;
        record.fecha = $("#textFecha").val();
        record.descripcion = $("#textDescripcion").val();
        record.facturas = reporteFacturas.data.length;
        record.totalconsumo = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.consumo);},0);
        record.totalneto = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.monto);},0);
        record.totaliva = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.montoiva);},0);
        record.subtotal = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.montosubtotal);},0);
        record.credito = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.credito);},0);
        record.total = reporteFacturas.data.reduce(function (acum, factura) {return acum + parseFloat(factura.montototal);},0);
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_grupos" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idgrupo,($("#checkActivo").is(":checked"))?"checked":"");
        tablaGrupos.row("#"+record.idgrupofactura).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteGrupos.data,'idgrupofactura',idGrupoFactura);
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.fecha = record.fecha;
        record2.descripcion = record.descripcion;
        record2.facturas = record.facturas;
        record2.totalconsumo = record.totalconsumo;
        record2.totalneto = record.totalneto;
        record2.totaliva = record.totaliva;
        record2.subtotal = record.subtotal;
        record2.credito = record2.credito;
        record2.total = record.total;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }

    function cargarMedidores(idedificio){
        selectJs2(
            "#selectMedidor",
            { 
                value: "idmedidorfisico",
                show: {
                    fields:["codigo","cons_nombre","espa_nombre"],
                    format: "%s | %s - %s"
                },
                hide: ["idmedidorfisico"],
                queries:[{
                    fieldsSelect:["idmedidorfisico","codigo","cons_nombre","espa_nombre"],
                    tableName   :"mediciones.vmedidores",
                    orderby:[{
                        field:"idmedidorfisico",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        },{
                            logical:"and",
                            field:"principal",
                            oper:"=",
                            value:"true",
                            type:"int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function agregarFactura(facturas){
        return facturas.push(
            {
                idfactura      :(facturas.length + 1).toString(),
                idproveedor    :$("#selectProveedor").val(),
                prov_nombre    :$("#selectProveedor").select2('data')[0].text,
                idmedidorfisico:$("#selectMedidor").val(),
                codigo         :$("#selectMedidor").select2('data')[0].text.split("|")[0].trim(),
                boleta         :$("#textBoleta").val(),
                cliente        :$("#textCliente").val(),
                fecha          :$("#textFechaFactura").val(),
                consumo        :$("#textConsumo").val(),
                consumopp      :($("#textConsumoPP").val() != '')?$("#textConsumoPP").val():0,
                consumoppp     :($("#textConsumoPPP").val() != '')?$("#textConsumoPPP").val():0,
                monto          :$("#textMontoNeto").val(),
                iva            :$("#textIVA").val(),
                montoiva       :$("#textMontoIVA").val(),
                montosubtotal  :$("#textSubTotal").val(),
                credito        :($("#textCredito").val() != '')?$("#textCredito").val():0,
                montototal     :$("#textMontoTotal").val(),
                adjunto        :($("#textAdjunto").val() != '')?'<button id="%s" name="descargar" data-file="%s"class="btn btn-info btn-xs descargar_adjunto"><i class="fa fa-download"></i></button>'.format(facturas.length + 1,$("#textAdjunto").val()):'',
                adjunto_cont   :$("#textAdjunto").val(),
                observaciones  :$("#textObservaciones").val(),
            }
        );
    }

    $(document).on('click','#btnAdjunto',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            document.getElementById("filePDF").click();
        }
    });

    document.getElementById('filePDF').addEventListener('change', upload, false);

    function upload(evt) {
        $('#submitFilePDF').click();
    }

    $(document).on('click',"#submitFilePDF",function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var file_data = $('#filePDF').prop('files')[0];
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
                            $("#textAdjunto").val(a[0].file);
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
    
    $(document).on('click','.descargar_adjunto',function(event){
        if (paginaActiva.code == 52){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var File =  'php/uploads/%s'.format($(this).attr('data-file'));
            descargar2(File,$(this).attr('data-file'));
        }
    });

});