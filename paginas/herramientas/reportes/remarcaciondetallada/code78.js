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

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','#selectEdificio',function(event){
        if (paginaActiva.code == 78){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarRemarcaciones(this.value);
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 78){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                var idservicio = $("#selectServicio").val();
                var fecha = $("#textFecha").val();
                loadAsignacionesAlmacenadas(reporte,$("#selectRemarcacion").val(),"#tabla");
            }
        }
    }); 

    $(document).on('click','.descargar_boleta_asignacion',function(event){
        if (paginaActiva.code == 78){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            generar_boleta_array([this.id],this,'detallada',$("#selectEdificio").val(),true);
        }
    });

    $(document).on('click','.descargarSimple_boleta_asignacion',function(event){
        if (paginaActiva.code == 78){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            generar_boleta_array([this.id],this,'detallada',$("#selectEdificio").val(),false);
        }
    });

    function cargarRemarcaciones(idedificio){
        selectJs2(
            "#selectRemarcacion",
            {   
                value: "idremarcacion",
                show: {
                    fields:["idremarcacion","nombre","fecha"],
                    format: "%s-%s (%s)"
                },
                queries:[{
                    fieldsSelect: ["idremarcacion","nombre","fecha"],
                    tableName   :"remarcacion.vremarcaciones",
                    orderby:[{
                        field:"fecha",
                        type : "desc"
                    }],
                    where  :[{
                    field  :"activo",
                    oper   :"=",
                    value  :"true",
                    type   :"int",        
                },
                {
                    logical: "and",
                    field: "idedificio",
                    oper:  "=",
                    value: idedificio,
                    type:  "int",
                }]        
                }],
            },
            {
            }    
        );
    }

    /*function loadAsignacionesAlmacenadas(reporte,idremarcacion,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?loadRemarcacionesAlmacenadas",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*","case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName   :"remarcacion.vremarcacionesasignaciones",
                        orderby:[{
                            field:"idasignacion",
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
                 
                   /* reporte.activo = false;
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
                            //leftColumns: 2,
                            rightColumns: 2
                        },
                        order: [],
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
                            for (index=10;index<(Object.keys(reporte.data[0]).length-3)-1;index++){
                                total[index] = api.column(index).data().reduce( function (a, b) {
                                                    return intVal(a) + intVal(b);
                                                }, 0 ); 
                                $( api.column(index).footer()).html(convertirFormatoLocal(total[index])) ;                      
                            }
                        }
                    }

                    tableParams.columns=[
                        {data:"codigo",title:"Medidor"},
                        {data:"nombre",title:"Arrendatario"},
                        {data:"cons_rut",title:'Rut'},
                        {data:"cons_codigo",title:'Código'},
                        {data:"razonsocial",title:'Razón Social'},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [7,9], 
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
                        targets:[2,6,8],
                        className: 'minimo120',
                    },
                    {
                        targets:[1,4,5],
                        className: 'minimo200',
                    },                    
                    {
                        targets:[-1],
                        className: 'text-center',
                    },{
                        targets:[0,2,3],
                        className:'minimo80'
                    }];

                    var idremarcacionasignacion = data[1].resultados[0].idremarcacionasignacion;
                    var count = 0;
                    var indexColumn = 10;
                    dataLeidaFacturada.data = [];

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
                    tableParams.columns.push({data:"totaliva",title:"Total+IVA"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++); 
                    tableParams.columns.push({data:"boleta",title:"Boleta"});
                    columna = 1;
                    fila = 1;

                    $("#tab_graficos").empty();

                    data[0].resultados.forEach(function(element,index){
                        var registro = {};

                        registro = {
                            DT_RowId:element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            nombre:element.nombre,
                            cons_nombre:element.cons_nombre,
                            cons_rut:element.cons_rut,
                            cons_codigo:element.cons_codigo,
                            razonsocial:element.razonsocial,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                            total:0,
                            totaliva:0
                        };


                        var leidos =  data[1].resultados.filter(function(elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });
                        dataLeidaFacturada.data.push({
                            leidos:[],
                            facturados:[]
                        });    
                        leidos.forEach(function(e,i){
                            dataLeidaFacturada.data[index].leidos.push({idcargo:e.idcargo,valor:e.valor,fecha:e.fecha});
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });
                        
                        var facturados =  data[2].resultados.filter(function(elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion)
                             && (elemento.calc_nombre == "Valor Facturado"));
                        });


                        facturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.facturado;
                        });   
                        
                        var facturados =  data[2].resultados.filter(function(elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        facturados.forEach(function(e,i){
                            dataLeidaFacturada.data[index].facturados.push({idcargo:e.idcargo,facturado:e.facturado,monto:e.monto});
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);
                            registro.totaliva = Math.round(registro.total * 1.19);                            
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion)+"&nbsp"+
                                          '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);

                        //agregar_Grafico(fila,"#tab_graficos",element,element.hasta,{temporal:false});
                        columna = (columna <=2)?columna+1:1;
                        fila = (columna==1)?fila+1:fila;
                        reporte.data.push(registro); 
                    });

                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        for (i=1;i<=Object.keys(reporte.data[0]).length-3;i++){
                            cadena += "<th>-</th>";
                        }
                        $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        //tablaasignaciones.processing( true );
                    };                       
                        tableParams.data = reporte.data;
                        tableParams.buttons.buttons[2].orientation =  'landscape';
                        tableParams.buttons.buttons[2].pageSize = 'LEGAL';
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
    } */

    function loadAsignacionesAlmacenadas(reporte, idremarcacion, idtabla) {
        if (!(reporte.activo)) {
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?loadAsignacionesAlmacenadas",
                type: "POST",
                data: {
                    queries: [{
                        fieldsSelect: ["*", "case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName: "remarcacion.vremarcacionesasignaciones",
                        orderby: [{
                            field: "idasignacion",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    },
                    {
                        fieldsSelect: ["*"],
                        tableName: "remarcacion.vvaloresleidos",
                        orderby: [{
                            field: "idremarcacionasignacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    },
                    {
                        fieldsSelect: ["*"],
                        tableName: "remarcacion.vvaloresfacturados",
                        orderby: [{
                            field: "idremarcacionasignacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    }]
                },
                success: function (data) {
                    /*ACOMODAR LISTA*/
                    console.log(data);

                    reporte.activo = false;
                    reporte.data = [];
                    var tableParams = {
                        responsive: true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing: true,
                        //  scrollY: 300,
                        scrollX: true,
                        scrollCollapse: true,
                        autoWidth: false,
                        rowId: 'idasignacion',
                        fixedColumns: {
                            leftColumns: 2,
                            rightColumns: 1
                        },
                        order: [[0, 'asc']],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        //buttons: buttons,
                        language: spanish,
                        "footerCallback": function (row, data, start, end, display) {
                            var api = this.api(), data;

                            var intVal = function (i) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '') * 1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            total = [];
                            for (index = 7; index < (Object.keys(reporte.data[0]).length - 3) - 1; index++) {
                                total[index] = api.column(index).data().reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);
                                $(api.column(index).footer()).html(convertirFormatoLocal(total[index]));
                            }
                        }
                    }

                    tableParams.columns = [
                        { data: "codigo", title: "Medidor" },
                        { data: "nombre", title: "Arrendatario" },
                        { data: "espa_nombre", title: "Espacio" },
                        { data: "energiafechainicial", title: "Fecha Inicial" },
                        { data: "energiafechafinal", title: "Fecha Final" },
                        { data: "energialecturainicial", title: "Lectura Inicial (kWh)" },
                        { data: "energialecturafinal", title: "Lectura Final (kWh)" },
                    ];

                    tableParams.columnDefs = [{
                        targets: [5, 6],
                        render: $.fn.dataTable.render.number('.', ',', 2),
                        className: 'text-right',
                        type: 'html-num-fmt',
                        width: 200
                    },
                    {
                        targets: [],
                        render: $.fn.dataTable.render.number('.', ',', 0),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets: [2, 3, 4],
                        className: 'minimo120',
                    },
                    {
                        targets: [1],
                        className: 'minimo200',
                    },
                    {
                        targets: [-1],
                        className: 'text-center',
                    }, {
                        targets: [0],
                        className: 'minimo80'
                    }, {
                        targets: [],
                        className: 'minimo80 text-center'
                    }];

                    var idremarcacionasignacion = data[0].resultados[0].idremarcacionasignacion;
                    var count = 0;
                    var indexColumn = 7;
                    dataLeidaFacturada.data = [];
                    let filtrado = data[1].resultados.filter(element => (element.idremarcacionasignacion===idremarcacionasignacion));
                    filtrado.map((element,index) => {
                        tableParams.columns.push({ data: "valoresleidos%s".format(index), title: "%s leida".format(element.nombre), width: "300px" });
                        tableParams.columnDefs[0].targets.push(indexColumn++);                        
                    })

                    /*for (index = 0; index < data[1].resultados.length; index++) {
                        if (data[1].resultados[index].idremarcacionasignacion !== idremarcacionasignacion) {
                            break;
                        }
                        tableParams.columns.push({ data: "valoresleidos%s".format(count++), title: "%s leida".format(data[1].resultados[index].nombre), width: "300px" });
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    };*/

                    tableParams.columns.push({ data: "constante", title: "Constante" });
                    tableParams.columnDefs[6].targets.push(indexColumn++);

                    var idremarcacionasignacion = data[2].resultados[0].idremarcacionasignacion;

                    var facturados = data[2].resultados.filter(function (elemento) {
                        return ((elemento.idremarcacionasignacion == idremarcacionasignacion) &&
                            (elemento.calc_nombre == "Valor Facturado"));
                    });
                    count = 0;
                    facturados.forEach(function (element, index) {
                        tableParams.columns.push({ data: "valoresfacturados%s".format(count++), title: "%s facturada".format(element.nombre), width: 200 });
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });

                    var facturados = data[2].resultados.filter(function (elemento) {
                        return (elemento.idremarcacionasignacion == idremarcacionasignacion);
                    });
                    count = 0;
                    facturados.forEach(function (element, index) {
                        tableParams.columns.push({ data: "montos%s".format(count++), title: "Monto por %s".format(element.nombre), width: 200 });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });

                    tableParams.columns.push({ data: "total", title: "Total" });
                    tableParams.columnDefs[1].targets.push(indexColumn++);
                    var ivacargos = data[0].resultados[0].ivacargos;
                    if (ivacargos == 'f') {
                        tableParams.columns.push({ data: "totaliva", title: "Total+IVA" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    }
                    tableParams.columns.push({ data: "boleta", title: "Boleta" });
                    columna = 1;
                    fila = 1;

                    $("#tab_graficos").empty();

                    data[0].resultados.forEach(function (element, index) {
                        var registro = {};

                        registro = {
                            DT_RowId: element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo: element.codigo,
                            nombre: element.nombre,
                            cons_nombre: element.cons_nombre,
                            espa_nombre: element.espa_nombre,
                            energiafechainicial: element.energiafechainicial,
                            energialecturainicial: element.energialecturainicial,
                            energiafechafinal: element.energiafechafinal,
                            energialecturafinal: element.energialecturafinal,
                            constante: element.constante,
                            total: 0,
                        };
                        if (ivacargos == 'f') {
                            registro.totaliva = 0;
                        }


                        var leidos = data[1].resultados.filter(function (elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });
                        dataLeidaFacturada.data.push({
                            leidos: [],
                            facturados: []
                        });
                        leidos.forEach(function (e, i) {
                            dataLeidaFacturada.data[index].leidos.push({ idcargo: e.idcargo, valor: e.valor, fecha: e.fecha });
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });

                        var facturados = data[2].resultados.filter(function (elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion)
                                && (elemento.calc_nombre == "Valor Facturado"));
                        });


                        facturados.forEach(function (e, i) {
                            registro["valoresfacturados%s".format(i)] = e.facturado;
                        });

                        var facturados = data[2].resultados.filter(function (elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        facturados.forEach(function (e, i) {
                            dataLeidaFacturada.data[index].facturados.push({ idcargo: e.idcargo, facturado: e.facturado, monto: e.monto });
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);
                            if (ivacargos == 'f') {
                                registro.totaliva = Math.round(registro.total * 1.19);
                            }
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion) + "&nbsp" +
                            '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);

                        //agregar_Grafico(fila, "#tab_graficos", element, element.hasta, { temporal: false });
                        columna = (columna <= 1) ? columna + 1 : 1;
                        fila = (columna == 1) ? fila + 1 : fila;
                        reporte.data.push(registro);
                    });
                    if ($.fn.DataTable.isDataTable(idtabla)) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        for (i = 1; i <= Object.keys(reporte.data[0]).length - 3; i++) {
                            cadena += "<th>-</th>";
                        }
                        $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        //tablaasignaciones.processing( true );
                    };
                    tableParams.data = reporte.data;
                    //tableParams.buttons.buttons[2].orientation = 'landscape';
                    //tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaAsignaciones = $(idtabla).DataTable(tableParams);



                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg: errorThrown
                    });
                },
            });

        }
        else {
            error2({ size: 'normal', msg: "Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar" });
        }
    }

});