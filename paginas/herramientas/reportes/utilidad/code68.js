
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
    tablaUtilidades.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 68){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            var record = findObjectByKey(reporteUtilidades.data,'idgrupofactura',tablaUtilidades.rows( indexes ).data()[0].idgrupofactura);
            grupoActual = record;
            $('#tabletas li:first').addClass('active');  
            $('#tabletas-contenido .tab-pane:first').addClass('active'); 
            loadFacturasAlmacenadas(reporteFacturas,record.idgrupofactura,tableParamsFacturas,"#tablaFacturas");    
            loadPrecios(record.idgrupofactura);
//            $("#lbTitulo").text("Modificar Tarifas");
//            $("#btnAceptar i").text("Modificar");
//            $("#hdOperacion").val("Modificar");
//            var record = findObjectByKey(reporteUtilidades.data,'idtarifaedificio',tablaTarifas.rows( indexes ).data()[0].idtarifaedificio);
//            utilidadActual = record.idtarifaedificio;
//            cargarTarifas(record);
        }
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    function loadFacturasAlmacenadas(reporte,idgrupofactura,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?facturas",
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
                        var columns = $(idtabla).DataTable().columns().count();
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena ="";
                        for (i=0;i<columns;i++){
                            cadena += '<th>-</th>';
                        }
                        $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                    }; 
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaFacturas = $(idtabla).DataTable(tableParams);   
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

    function loadPrecios(idgrupofactura){
        $.ajax({
            url: "php/data.php?precios",
            type:"POST",
            data:{
                queries : [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vprecios",
                    orderby:[{
                        field:"idprecio",
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
                $('#tabletas li').slice(1).remove();  
                $('#tabletas-contenido .tab-pane').slice(1).remove(); 
                reportePrecios.length = 0;  
                reporteRemarcacionesLocales.length = 0;   
                reporteRemarcacionesGastosComunes.length = 0;
                data[0].resultados.map(function(element,index){
                    var tabPrecio='#tab_precio_%s'.format(element.idprecio);
                    $('<li class=""><a href="#tab_precio_%s" data-toggle="tab" aria-expanded="false">Precios %s</a></li>'.format(element.idprecio,element.tari_nombre)).appendTo('#tabletas');
                    $('<div class="tab-pane" id="tab_precio_%s"><div class="box-body"></div></div>'.format(element.idprecio)).appendTo('#tabletas-contenido');
                    agregar_tabla('%s div'.format(tabPrecio),'tablaPrecio_%s'.format(element.idprecio));
                    var param = getParamsPrecios();
                    reportePrecios.push({
                        idprecio:element.idprecio,
                        activo:false,
                        inicio:0,
                        final:0,
                        data:[],
                        params : param,
                        tabla : $('#tablaPrecio_%s'.format(element.idprecio)).DataTable(param),
                    });
                    var ultimoReporte = reportePrecios[reportePrecios.length-1];
                    loadCargosTarifasAlmacenados(ultimoReporte,element.idprecio,ultimoReporte.params,'#tablaPrecio_%s'.format(element.idprecio),ultimoReporte.tabla);
                    //loadRemarcaciones(element.idprecio);
                });

                data[0].resultados.map(function(element,index){
                    loadRemarcaciones(element.idprecio);
                });

               

            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        });        
    }

    function loadRemarcaciones(idprecio){
        $.ajax({
            url: "php/data.php?remarcaciones",
            type:"POST",
            data:{
                queries : [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vremarcaciones",
                    orderby:[{
                        field:"idremarcacion",
                        type : "asc"
                    }],
                    where:[{
                        field:"idprecio",
                        oper:"=",
                        value:idprecio,
                        type:"int"    
                    }],      
                }
            ]
            },
            success: function(data){         
                data[0].resultados.map(function(element,index){
                    var tabRemarcacionLocal='#tab_remarcacion_local_%s'.format(element.idremarcacion);
                    var tabRemarcacionGC='#tab_remarcacion_GC_%s'.format(element.idremarcacion);
                    var tabRemarcacionClima='#tab_remarcacion_Clima_%s'.format(element.idremarcacion);
                    $('<li id="tab_local_%s" class="hidden"><a href="#tab_remarcacion_local_%s" data-toggle="tab" aria-expanded="false">Locales %s (%s)</a></li>'.format(element.idremarcacion,element.idremarcacion,element.nombre,element.idremarcacion)).appendTo('#tabletas');
                    $('<div class="tab-pane" id="tab_remarcacion_local_%s"><div class="box-body"></div></div>'.format(element.idremarcacion)).appendTo('#tabletas-contenido');
                    $('<li id="tab_gastoc_%s"class="hidden"><a href="#tab_remarcacion_GC_%s" data-toggle="tab" aria-expanded="false">Gasto Común %s (%s)</a></li>'.format(element.idremarcacion,element.idremarcacion,element.nombre,element.idremarcacion)).appendTo('#tabletas');
                    $('<div class="tab-pane" style="height:100%" id="tab_remarcacion_GC_%s"><div class="box-body"></div></div>'.format(element.idremarcacion)).appendTo('#tabletas-contenido');
                    $('<li id="tab_clima_%s" class="hidden"><a href="#tab_remarcacion_Clima_%s" data-toggle="tab" aria-expanded="false">Clima %s (%s)</a></li>'.format(element.idremarcacion,element.idremarcacion,element.nombre,element.idremarcacion)).appendTo('#tabletas');
                    $('<div class="tab-pane" style="height:100%" id="tab_remarcacion_Clima_%s"><div class="box-body"></div></div>'.format(element.idremarcacion)).appendTo('#tabletas-contenido');
                    agregar_tabla('%s div'.format(tabRemarcacionLocal),'tablaRemarcacionLocal_%s'.format(element.idremarcacion));
                    agregar_tabla('%s div'.format(tabRemarcacionGC),'tablaRemarcacionGC_%s'.format(element.idremarcacion));
                    agregar_tabla('%s div'.format(tabRemarcacionClima),'tablaRemarcacionClima_%s'.format(element.idremarcacion));
                    var param = getParamsRemarcacion();
                    reporteRemarcacionesLocales.push({
                        idremarcacion:element.idremarcacion,
                        activo:false,
                        inicio:0,
                        final:0,
                        data:[],
                        params : param,
                        tabla  : $('#tablaRemarcacionLocal_%s'.format(element.idremarcacion)).DataTable(param),
                        tab    : "tab_local_%s".format(element.idremarcacion),
                    });
                    var ultimoReporte = reporteRemarcacionesLocales[reporteRemarcacionesLocales.length-1];
                    loadAsignacionesLocales(ultimoReporte,element.idremarcacion,'#tablaRemarcacionLocal_%s'.format(element.idremarcacion),ultimoReporte.tabla);
                    var param = getParamsRemarcacion();
                    reporteRemarcacionesGastosComunes.push({
                        idremarcacion:element.idremarcacion,
                        activo:false,
                        inicio:0,
                        final:0,
                        data:[],
                        params : param,
                        tabla : $('#tablaRemarcacionGC_%s'.format(element.idremarcacion)).DataTable(param),
                        tab   : "tab_gastoc_%s".format(element.idremarcacion),
                    });
                    var ultimoReporte = reporteRemarcacionesGastosComunes[reporteRemarcacionesGastosComunes.length-1];
                    loadAsignacionesGastos(ultimoReporte,element.idremarcacion,'#tablaRemarcacionGC_%s'.format(element.idremarcacion),ultimoReporte.tabla);
                    var param = getParamsRemarcacion();
                    reporteRemarcacionesClima.push({
                        idremarcacion:element.idremarcacion,
                        activo:false,
                        inicio:0,
                        final:0,
                        data:[],
                        params : param,
                        tabla : $('#tablaRemarcacionClima_%s'.format(element.idremarcacion)).DataTable(param),
                        tab   : "tab_clima_%s".format(element.idremarcacion),
                    });
                    var ultimoReporte = reporteRemarcacionesClima[reporteRemarcacionesClima.length-1];
                    loadAsignacionesClima(ultimoReporte,element.idremarcacion,'#tablaRemarcacionClima_%s'.format(element.idremarcacion),ultimoReporte.tabla);


                });


            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        });        
    }

    function loadCargosTarifasAlmacenados(reporte,idprecio,tableParams,idtabla,table){     
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParamsPrecios = {
                url: "php/data.php?cargos-"+idprecio,
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*","array_to_json(array[parametros])->>0 as parametros"],
                        tableName   :"remarcacion.vcargosprecios left join remarcacion.vprecios using (idprecio)",
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
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };


            tableParams.ajax = ajaxParamsPrecios;


            table = $(idtabla).DataTable(tableParams);        
        }    
        else {
            //error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

    function loadAsignacionesLocales(reporte,idremarcacion,idtabla,table){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php"+"?locales-"+idremarcacion,
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["vremarcacionesasignaciones.*","case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName   :"remarcacion.vremarcacionesasignaciones left join mediciones.asignaciones using (idasignacion)",
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        },{
                            logical:'and',
                            field:'local',
                            oper:'=',
                            value:true,
                            type:'int'
                        },
                        {
                            logical:'and',
                            field:'idasignacion',
                            oper:'not in',
                            value: '(1874,1875,1876,1883)',
                            type:'int'
                        }],      
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vvaloresleidos",
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        }],                           
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vvaloresfacturados",
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        }],                           
                    }]
                },
                success: function(data){
                    /*ACOMODAR LISTA*/

                    
                    reporte.activo = false;

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                      //  scrollY: 300,
                        scrollX:        true,
                        scrollCollapse: true,
                        //autoWidth:true,
                        rowId: 'idasignacion',
                        order: [[ 0, 'asc' ]],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                        "footerCallback": function ( row, data, start, end, display ) {
                            var api = this.api(), data;
                
                            var intVal = function ( i ) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '')*1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            total = [];
                            if (reporte.data.length > 0){
                                for (index=7;index<(Object.keys(reporte.data[0]).length-3)-1;index++){
                                    total[index] = api.column(index).data().reduce( function (a, b) {
                                                        return intVal(a) + intVal(b);
                                                    }, 0 ); 
                                    $( api.column(index).footer()).html(convertirFormatoLocal(total[index])) ;                      
                                }
                            }
                        }
                    }

                    tableParams.columns=[
                        {data:"codigo",title:"Medidor"},
                        {data:"nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [4,6], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'text-right',
                        type:'html-num-fmt',
                        width: 200
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets:[2,3,5],
                        className: 'minimo120',
                    },
                    {
                        targets:[1],
                        className: 'minimo200',
                    },                    
                    {
                        targets:[-1],
                        className: 'text-center',
                    },{
                        targets:[0],
                        className:'minimo80'
                    }];

                    var idremarcacionasignacion = data[1].resultados[0].idremarcacionasignacion;
                    var count = 0;
                    var indexColumn = 7;
                    for (index=0;index<data[1].resultados.length;index++){
                        if (data[1].resultados[index].idremarcacionasignacion !== idremarcacionasignacion){
                            break;
                        }
                        tableParams.columns.push({data:"valoresleidos%s".format(count++),title:"%s leida".format(data[1].resultados[index].nombre),width:"300px"});
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    };

                    var idremarcacionasignacion = data[2].resultados[0].idremarcacionasignacion;

                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  ((elemento.idremarcacionasignacion == idremarcacionasignacion) &&
                                (elemento.calc_nombre == "Valor Facturado"));
                    });
                    count = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"valoresfacturados%s".format(count++),title:"%s facturada".format(element.nombre),width:200});
                        tableParams.columnDefs[0].targets.push(indexColumn++);                        
                    });
                    
                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  (elemento.idremarcacionasignacion == idremarcacionasignacion);
                    });
                    count = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"montos%s".format(count++),title:"Monto por %s".format(element.nombre),width:200});
                        tableParams.columnDefs[1].targets.push(indexColumn++);                        
                    });

                    tableParams.columns.push({data:"total",title:"Total"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++); 
                    tableParams.columns.push({data:"boleta",title:"Boleta"});

                    data[0].resultados.forEach(function(element,index){
                        var registro = {};

                        registro = {
                            DT_RowId:element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            nombre:element.nombre,
                            cons_nombre:element.cons_nombre,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                            total:0
                        };

                        var leidos =  data[1].resultados.filter(function(elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });

                        leidos.forEach(function(e,i){
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });
                        
                        var facturados =  data[1].resultados.filter(function(elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion) &&
                                    (elemento.calc_nombre == "Valor Facturado"));
                        });

                        facturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.valor;
                        });   
                        
                        var facturados =  data[2].resultados.filter(function(elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        facturados.forEach(function(e,i){
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);                            
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion)+"&nbsp"+
                                          '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);
                        reporte.data.push(registro);                       
                    });
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {

                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        if (reporte.data.length > 0) {

                            for (i=1;i<=Object.keys(reporte.data[0]).length-3;i++){
                                cadena += "<th>-</th>";
                            }
                            $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        }
                        //tablaasignaciones.processing( true );
                    };           
                    
                        if (reporte.data.length > 0){
                            $("#%s".format(reporte.tab)).removeClass('hidden');
                            tableParams.data = reporte.data;
                            tableParams.buttons.buttons[2].orientation =  'landscape';
                            tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                            tabla = $(idtabla).DataTable(tableParams); 
                            tabla.row(':eq(0)').select();   
                        }

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

    function loadAsignacionesGastos(reporte,idremarcacion,idtabla,table){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?gastosc-"+idremarcacion,
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["gastos_comun.*","case when (gastos_comun.asig_codigo <> '') and (gastos_comun.asig_codigo is not null) then gastos_comun.asig_codigo else gastos_comun.cons_nombre end as nombre "],
                        tableName   :"remarcacion.gasto_comun_patio(%s) as gastos_comun  left join mediciones.asignaciones using (idasignacion)".format(idremarcacion),
                        orderby:[{
                                field:"gastos_comun.idtarifaedificio",
                                type:"desc"
                            },{
                                field:"idasignacion",
                                type : "asc"
                        }],
                        where:[],      
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.gasto_comun_valores_leidos(%s)".format(idremarcacion),
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "desc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[],                           
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.gasto_comun_valores_facturados(%s)".format(idremarcacion),
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "desc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[],                           
                    }]
                },
                success: function(data){
                    /*ACOMODAR LISTA*/

                    reporte.activo = false;

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                      //  scrollY: 300,
                        scrollX:        true,
                        scrollCollapse: true,
                        autoWidth:true,
                        rowId: 'idasignacion',
                        order: [[ 0, 'asc' ]],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                        "footerCallback": function ( row, data, start, end, display ) {
                            var api = this.api(), data;
                
                            var intVal = function ( i ) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '')*1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            total = [];
                            if (reporte.data.length > 0){
                                for (index=7;index<(Object.keys(reporte.data[0]).length-3)-1;index++){
                                    total[index] = api.column(index).data().reduce( function (a, b) {
                                                        return intVal(a) + intVal(b);
                                                    }, 0 ); 
                                    $( api.column(index).footer()).html(convertirFormatoLocal(total[index])) ;                      
                                }
                            }
                        }
                    }

                    tableParams.columns=[
                        {data:"codigo",title:"Medidor"},
                        {data:"nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [4,6], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'text-right',
                        type:'html-num-fmt',
                        width: 200
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets:[2,3,5],
                        className: 'minimo120',
                    },
                    {
                        targets:[1],
                        className: 'minimo200',
                    },                    
                    {
                        targets:[-1],
                        className: 'text-center',
                    },{
                        targets:[0],
                        className:'minimo80'
                    }];
                    if (data[1].resultados.length > 0) {
                        var idremarcacionasignacion = data[1].resultados[0].idremarcacionasignacion;
                    }
                    var count = 0;
                    var indexColumn = 7;
                    val_leidos = 0;
                    for (index=0;index<data[1].resultados.length;index++){
                        if (data[1].resultados[index].idremarcacionasignacion !== idremarcacionasignacion){
                            break;
                        }
                        tableParams.columns.push({data:"valoresleidos%s".format(count++),title:"%s leida".format(data[1].resultados[index].nombre),width:"300px"});
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                        val_leidos++;
                    };
                    if (data[2].resultados.length > 0) {
                        var idremarcacionasignacion = data[2].resultados[0].idremarcacionasignacion;
                    }

                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  ((elemento.idremarcacionasignacion == idremarcacionasignacion) &&
                                (elemento.calc_nombre == "Valor Facturado"));
                    });
                    count = 0;
                    val_facturados = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"valoresfacturados%s".format(count++),title:"%s facturada".format(element.nombre),width:200});
                        tableParams.columnDefs[0].targets.push(indexColumn++);   
                        val_facturados++;                     
                    });
                    
                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  (elemento.idremarcacionasignacion == idremarcacionasignacion);
                    });
                    count = 0;
                    val_montos = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"montos%s".format(count++),title:"Monto por %s".format(element.nombre),width:200});
                        tableParams.columnDefs[1].targets.push(indexColumn++);  
                        val_montos++;                      
                    });

                    tableParams.columns.push({data:"total",title:"Total"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++); 
                    tableParams.columns.push({data:"boleta",title:"Boleta"});

                    
                    data[0].resultados.forEach(function(element,index){
                        var registro = {};
                        
                        registro = {
                            DT_RowId:element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            nombre:element.nombre,
                            cons_nombre:element.cons_nombre,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                            total:0
                        };

                        var leidos =  data[1].resultados.filter(function(elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });


                        for (i=0;i<val_leidos;i++){
                            registro["valoresleidos%s".format(i)] = 0;    
                        }
                        
                        leidos.forEach(function(e,i){
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });

                        console.log(data[1].resultados);
                        var facturados =  data[1].resultados.filter(function(elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion) &&
                                    (elemento.calc_nombre == "Valor Facturado"));
                        });

                        for (i=0;i<val_facturados;i++){
                            registro["valoresfacturados%s".format(i)] = 0;    
                        }

                        facturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.valor;
                        });   
                        
                        var facturados =  data[2].resultados.filter(function(elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        for (i=0;i<val_montos;i++){
                            registro["montos%s".format(i)] = 0;    
                        }
                        facturados.forEach(function(e,i){
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);                            
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion)+"&nbsp"+
                                          '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);
                        reporte.data.push(registro);                       
                    });
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {

                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        if (reporte.data.length > 0) {

                            for (i=1;i<=Object.keys(reporte.data[0]).length-3;i++){
                                cadena += "<th>-</th>";
                            }
                            $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        }
                        //tablaasignaciones.processing( true );
                    };           
                    
                        if (reporte.data.length > 0){
                            $("#%s".format(reporte.tab)).removeClass('hidden');
                            tableParams.data = reporte.data;
                            tableParams.buttons.buttons[2].orientation =  'landscape';
                            tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                            console.log(tableParams);
                            tabla = $(idtabla).DataTable(tableParams); 
                            tabla.row(':eq(0)').select();   
                        }

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
    
    function loadAsignacionesClima(reporte,idremarcacion,idtabla,table){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?clima-"+idremarcacion,
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["vremarcacionesasignaciones.*","case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName   :"remarcacion.vremarcacionesasignaciones left join mediciones.asignaciones using (idasignacion)",
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        },
                        {
                            logical:'and',
                            field:'idasignacion',
                            oper:'in',
                            value: '(1874,1875,1876,1883)',
                            type:'int'
                        }],      
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vvaloresleidos",
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        }],                           
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vvaloresfacturados",
                        orderby:[{
                            field:"idremarcacionasignacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idremarcacion",
                            oper:"=",
                            value:idremarcacion,
                            type:"int"
                        }],                           
                    }]
                },
                success: function(data){
                    /*ACOMODAR LISTA*/

                    
                    reporte.activo = false;

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                      //  scrollY: 300,
                        scrollX:        true,
                        scrollCollapse: true,
                        autoWidth:true,
                        rowId: 'idasignacion',
                        order: [[ 0, 'asc' ]],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                        "footerCallback": function ( row, data, start, end, display ) {
                            var api = this.api(), data;
                
                            var intVal = function ( i ) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '')*1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };
                
                            total = [];
                            if (reporte.data.length > 0) {    
                                for (index=7;index<(Object.keys(reporte.data[0]).length-3)-1;index++){
                                    total[index] = api.column(index).data().reduce( function (a, b) {
                                                        return intVal(a) + intVal(b);
                                                    }, 0 ); 
                                    $( api.column(index).footer()).html(convertirFormatoLocal(total[index])) ;                      
                                }
                            }
                        }
                    }

                    tableParams.columns=[
                        {data:"codigo",title:"Medidor"},
                        {data:"nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [4,6], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'text-right',
                        type:'html-num-fmt',
                        width: 200
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets:[2,3,5],
                        className: 'minimo120',
                    },
                    {
                        targets:[1],
                        className: 'minimo200',
                    },                    
                    {
                        targets:[-1],
                        className: 'text-center',
                    },{
                        targets:[0],
                        className:'minimo80'
                    }];

                    var idremarcacionasignacion = data[1].resultados[0].idremarcacionasignacion;
                    var count = 0;
                    var indexColumn = 7;
                    for (index=0;index<data[1].resultados.length;index++){
                        if (data[1].resultados[index].idremarcacionasignacion !== idremarcacionasignacion){
                            break;
                        }
                        tableParams.columns.push({data:"valoresleidos%s".format(count++),title:"%s leida".format(data[1].resultados[index].nombre),width:"300px"});
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    };

                    var idremarcacionasignacion = data[2].resultados[0].idremarcacionasignacion;

                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  ((elemento.idremarcacionasignacion == idremarcacionasignacion) &&
                                (elemento.calc_nombre == "Valor Facturado"));
                    });
                    count = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"valoresfacturados%s".format(count++),title:"%s facturada".format(element.nombre),width:200});
                        tableParams.columnDefs[0].targets.push(indexColumn++);                        
                    });
                    
                    var facturados =  data[2].resultados.filter(function(elemento) {
                        return  (elemento.idremarcacionasignacion == idremarcacionasignacion);
                    });
                    count = 0;
                    facturados.forEach(function(element,index){
                        tableParams.columns.push({data:"montos%s".format(count++),title:"Monto por %s".format(element.nombre),width:200});
                        tableParams.columnDefs[1].targets.push(indexColumn++);                        
                    });

                    tableParams.columns.push({data:"total",title:"Total"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++); 
                    tableParams.columns.push({data:"boleta",title:"Boleta"});

                    data[0].resultados.forEach(function(element,index){
                        var registro = {};

                        registro = {
                            DT_RowId:element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            nombre:element.nombre,
                            cons_nombre:element.cons_nombre,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                            total:0
                        };

                        var leidos =  data[1].resultados.filter(function(elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });

                        leidos.forEach(function(e,i){
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });
                        
                        var facturados =  data[1].resultados.filter(function(elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion) &&
                                    (elemento.calc_nombre == "Valor Facturado"));
                        });

                        facturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.valor;
                        });   
                        
                        var facturados =  data[2].resultados.filter(function(elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        facturados.forEach(function(e,i){
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);                            
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion)+"&nbsp"+
                                          '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);
                        reporte.data.push(registro);                       
                    });

                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        if (reporte.data.length > 0){
                            for (i=1;i<=Object.keys(reporte.data[0]).length-3;i++){
                                cadena += "<th>-</th>";
                            }
                            $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        }
                        //tablaasignaciones.processing( true );
                    };                       
                    if (reporte.data.length > 0){
                        $("#%s".format(reporte.tab)).removeClass('hidden');
                        tableParams.data = reporte.data;
                        tableParams.buttons.buttons[2].orientation =  'landscape';
                        tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                        tabla = $(idtabla).DataTable(tableParams); 
                        tabla.row(':eq(0)').select();   
                    }
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

    function agregar_tabla(padre,idtabla){
        a = $('<table id="%s" class="table table-bordered table-striped" style="width:100%">'.format(idtabla)).appendTo(padre)
        b = $('<thead>').appendTo(a);
           /* $('<td>Cargo</td>').appendTo(b);
            $('<td>Nombre</td>').appendTo(b);
            $('<td>Clasificación</td>').appendTo(b);
            $('<td>Tipo Cálculo</td>').appendTo(b);
            $('<td>Monto</td>').appendTo(b);
            $('<td>Parametros</td>').appendTo(b);*/
        b = $('<tbody></body>').appendTo(a);
        b = $('<tfoot></tfoot>').appendTo(a);
    }

    function getParamsPrecios(){
        return { 
            responsive:true,
            destroy: true,
            paging: true,
            searching: true,
            scrollX:        true,
            scrollCollapse: true,
            autoWidth: true,
            rowId: 'idcargo',
            columnDefs : [{ 
                targets: [-2], 
                render: $.fn.dataTable.render.number( '.', ',', 2 ),
                className: 'text-right',
                width:"100px",
                type:'html-num-fmt' 
                },
                {
                    targets : [3,4],
                    className:'text-center'
                },
                {
                    targets : [-1],
                    width:"200px",
                }
            ],
            columns:[
                {data:"idcargo",title:"Cargo"},
                {data:"desde",title:"Desde"},
                {data:"hasta",title:"Hasta"},
                {data:"nombre",title:"Nombre"},
                {data:"clas_nombre",title:"Clasificación"},
                {data:"calc_nombre",title:"Tipo de Cálculo"},
                {data:"monto",title:"Monto"},
                {data:"parametros",title:"Parametros"},
            ],
            order: [],
            select: {
                style: 'single',
            },
            dom: 'Bfrtip',
            buttons: buttons,
            language: spanish,
        };
    }

    function getParamsRemarcacion(){
        return  { 
            responsive:true,
            destroy: true,
            paging: true,
            searching: true,
            scrollX:        true,
            scrollCollapse: true,
            autoWidth: true,
            rowId: 'idasignacion',
            columns:[
                {data:"codigo",title:"Medidor"},
                {data:"cons_nombre",title:"Arrendatario"},
                {data:"espa_nombre",title:"Espacio"},
                {data:"energiafechainicial",title:"Fecha Inicial"},
                {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                {data:"energiafechafinal",title:"Fecha Final"},
                {data:"energialecturafinal",title:"Lectura Final (kWh)"},
            ],
          order: [],
            select: {
                style: 'single',
            },
            dom: 'Bfrtip',
            buttons: buttons,
            language: spanish,
        }
    }

});