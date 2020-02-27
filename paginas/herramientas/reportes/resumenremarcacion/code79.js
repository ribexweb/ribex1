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
        if (paginaActiva.code == 79){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            loadTarifas("#selectTarifa",$(this).val());
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 79){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                var ano = $("#selectAno").val();
                var idtarifaedificio = $("#selectTarifa").val();
                loadRemarcacionesCargos(reporte,idedificio,ano,idtarifaedificio,"#tabla");
            }
        }
    }); 

    function loadRemarcacionesCargos2(reporte,idedificio,ano,idtarifaedificio,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?loadRemarcacionesxCargosxAños",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"nuevas.getremarcacionxcargosxanos(%s,%s,%s)".format(idedificio,ano,idtarifaedificio),
                        orderby:[{
                            field:"extract(month from fecha)::integer",
                            type : "desc"
                        }]      
                    }]
                },
                success: function(data){
                    console.log(data);
                    /*ACOMODAR LISTA*/
                 
                    reporte.activo = false;
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
                        rowId: 'idremarcacion',
                        order: [],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                    }

                    tableParams.columns=[
                        {data:"idremarcacion",title:"N°"},
                        {data:"fecha",title:"Fecha"},
                        {data:"mes",title:'Mes'},
                        {data:"desde",title:'Desde'},
                        {data:"hasta",title:'Hasta'},
                        {data:"publicar",title:'Publicar'},
                     ];

                     tableParams.columnDefs = [{
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right minimo120',
                        type: 'currency',
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 2, ),
                        className: 'text-right minimo120',
                        type: 'currency',
                    },{
                        targets:[0,1],
                        className:'minimo80 text-center'
                    },{
                        targets:[1,3,4],
                        className:'minimo120'
                    },{
                        targets:[2],
                        className:'minimo60 text-center'
                    }
                    ];

                    const registrobase ={
                        idremarcacion:0,
                        fecha:'',
                        mes:'',
                        desde:'',
                        hasta:'',
                        publicar:false,
                        totalneto:0,
                        totaliva:0                            
                    }

                     if (data[0].resultados.length > 0){

                        valores = JSON.parse(data[0].resultados[0].valores_leidos);
                        for (var key in valores){
                            console.log(key);
                            if (valores[key].isleido == true){
                                tableParams.columns.push({data:"facturado%s".format(key),title:"%s (%s)".format(valores[key].nombre,valores[key].unidad),width:200});
                                registrobase["facturado%s".format(key)] = 0;
                                tableParams.columnDefs[0].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"monomico%s".format(key),title:"Monómico %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["monomico%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"totalneto%s".format(key),title:"Neto %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["totalneto%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"totaliva%s".format(key),title:"Monto+IVA %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["totaliva%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                            }
                            else{
                                tableParams.columns.push({data:"otrosneto%s".format(key),title:"Neto %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["otrosneto%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1); 
                                tableParams.columns.push({data:"otrosiva%s".format(key),title:"Monto+IVA %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["otrosiva%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);                                
                            }
                        }
                        tableParams.columns.push({data:"totalneto".format(key),title:"Neto (CLP)",width:200});
                        tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                        tableParams.columns.push({data:"totaliva".format(key),title:"Monto+IVA (CLP)",width:200});
                        tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                     }

                     data[0].resultados.map(function(element,index){
                        let registro = JSON.parse(JSON.stringify(registrobase));
                        registro['idremarcacion'] = element.idremarcacion;
                        registro['fecha'] = element.fecha;
                        registro['mes'] = element.mes;
                        registro['desde'] = element.desde;
                        registro['hasta'] = element.hasta;
                        registro['publicar'] = element.publicar;

                        valores = JSON.parse(element.valores_leidos);
                        for (var key in valores){
                            if (valores[key].isleido == true){
                                registro["facturado%s".format(key)] = valores[key].facturado; 
                                registro["monomico%s".format(key)] = valores[key].monomico;
                                registro["totalneto%s".format(key)] = valores[key].monto;
                                registro.totalneto += valores[key].monto;
                                registro["totaliva%s".format(key)] = Math.round(valores[key].monto*1.19);
                            }
                            else{
                                registro["otrosneto%s".format(key)] = valores[key].monto;
                                registro.totalneto += valores[key].monto;
                                registro["otrosiva%s".format(key)] = Math.round(valores[key].monto*1.19);
                            }
                        }
                        registro.totaliva = Math.round(registro.totalneto*1.19);
                        reporte.data.push(registro);
                     });


                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
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
    } 

    function loadRemarcacionesCargos(reporte,idedificio,ano,idtarifaedificio,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/getTable2.php?loadRemarcacionesxCargosxAños",
                type:"POST",
                data:{
                    primaryField : "idremarcacion",
                    show : {
                        fields:["idremarcacion","fecha","mes","desde","hasta","publicar","valores_leidos"],
                        realtablename:'remarcaciones',
                        deletebtn: false,
                        updatebtn:false
                    },
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"nuevas.getremarcacionxcargosxanos(%s,%s,%s)".format(idedificio,ano,idtarifaedificio),
                        orderby:[{
                            field:"extract(month from fecha)::integer",
                            type : "desc"
                        }] 
                    }],
                    otrosbotones:[  
                    ]
                },
                success: function(data){

                    data = JSON.parse(data);
                    console.log(data.data);
                    data = data.data;
                    /*ACOMODAR LISTA*/
                 
                    reporte.activo = false;
                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing:true,
                        pageLength: 12,
                      //  scrollY: 300,
                        scrollX:        true,
                        scrollCollapse: true,
                        autoWidth:false,
                        rowId: 'idremarcacion',
                        order: [],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                    }

                    tableParams.columns=[
                        {data:"idremarcacion",title:"N°"},
                        {data:"fecha",title:"Fecha"},
                        {data:"mes",title:'Mes'},
                        {data:"desde",title:'Desde'},
                        {data:"hasta",title:'Hasta'},
                        {data:"publicar",title:'Publicar'},
                     ];

                     tableParams.columnDefs = [{
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'text-right minimo120',
                        type: 'currency',
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 2, ),
                        className: 'text-right minimo120',
                        type: 'currency',
                    },{
                        targets:[0,1,5],
                        className:'minimo80 text-center'
                    },{
                        targets:[1,3,4],
                        className:'minimo120'
                    },{
                        targets:[2],
                        className:'minimo60 text-center'
                    }
                    ];

                    const registrobase ={
                        idremarcacion:0,
                        fecha:'',
                        mes:'',
                        desde:'',
                        hasta:'',
                        publicar:false,
                        totalneto:0,
                        totaliva:0                            
                    }

                     if (data.length > 0){

                        valores = JSON.parse(data[0].valores_leidos);
                        for (var key in valores){
                            console.log(key);
                            if (valores[key].isleido == true){
                                tableParams.columns.push({data:"facturado%s".format(key),title:"%s (%s)".format(valores[key].nombre,valores[key].unidad),width:200});
                                registrobase["facturado%s".format(key)] = 0;
                                tableParams.columnDefs[0].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"monomico%s".format(key),title:"Monómico %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["monomico%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"totalneto%s".format(key),title:"Neto %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["totalneto%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                                tableParams.columns.push({data:"totaliva%s".format(key),title:"Monto+IVA %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["totaliva%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                            }
                            else{
                                tableParams.columns.push({data:"otrosneto%s".format(key),title:"Neto %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["otrosneto%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1); 
                                tableParams.columns.push({data:"otrosiva%s".format(key),title:"Monto+IVA %s (CLP)".format(valores[key].nombre),width:200});
                                registrobase["otrosiva%s".format(key)] = 0;
                                tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);                                
                            }
                        }
                        tableParams.columns.push({data:"totalneto".format(key),title:"Neto (CLP)",width:200});
                        tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                        tableParams.columns.push({data:"totaliva".format(key),title:"Monto+IVA (CLP)",width:200});
                        tableParams.columnDefs[1].targets.push(tableParams.columns.length-1);
                     }

                     data.map(function(element,index){
                        let registro = JSON.parse(JSON.stringify(registrobase));
                        registro['idremarcacion'] = element.idremarcacion;
                        registro['fecha'] = element.fecha;
                        registro['mes'] = element.mes;
                        registro['desde'] = element.desde;
                        registro['hasta'] = element.hasta;
                        registro['publicar'] = element.publicar;

                        valores = JSON.parse(element.valores_leidos);
                        for (var key in valores){
                            if (valores[key].isleido == true){
                                registro["facturado%s".format(key)] = valores[key].facturado; 
                                registro["monomico%s".format(key)] = valores[key].monomico;
                                registro["totalneto%s".format(key)] = valores[key].monto;
                                registro.totalneto += valores[key].monto;
                                registro["totaliva%s".format(key)] = Math.round(valores[key].monto*1.19);
                            }
                            else{
                                registro["otrosneto%s".format(key)] = valores[key].monto;
                                registro.totalneto += valores[key].monto;
                                registro["otrosiva%s".format(key)] = Math.round(valores[key].monto*1.19);
                            }
                        }
                        registro.totaliva = Math.round(registro.totalneto*1.19);
                        reporte.data.push(registro);
                     });


                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
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
    } 

    function loadTarifas(control,idedificio){
        selectJs2(
            control,
            { 
                value: "idtarifaedificio",
                show: {
                    fields:["nombre"],
                },
                hide: ["idtarifa"],
                queries:[{
                    fieldsSelect:["idtarifa","idtarifaedificio","nombre"],
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
                        {
                        logical:"and",
                        field  :"idedificio",
                        oper   :"=",
                        value  :idedificio,
                        type   :"int",  
                        }]        
                }],
            },
            {
            }    
        );        
    }

    $(document).on('change','.booleano_publicar_remarcaciones',function(event){   
        if (paginaActiva.code == 79){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Remarcaciones",
                "remarcacion.remarcaciones",
                {field:"idremarcacion",value:id,type:'integer'},
                {name:'publicar',value:activo,type:'boolean'},
                {name:'idremarcacion',value:id},
                reporte,
                "#checkPublicar"
            );
        }
    });

});