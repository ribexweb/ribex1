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
        if (paginaActiva.code == 84){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 84){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                idarrendatarios = $("#selectEdificio option:selected").attr('data-idarrendatarios');
                var ano = $("#selectAno").val();
                loadTiendas(reporte,idedificio,idarrendatarios,ano,"#tablaMontos",tableParamsMontos,"#tablaEnergia",tableParamsEnergia);
            }
        }
    }); 

    function loadTiendas(reporte,idedificio,idarrendatarios,ano,idtablaMontos,tableParamsMontos,idtablaEnergia,tableParamsEnergia){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url : "php/data.php?facturas", // Use href attribute as URL
                beforeSend: function( xhr ) {
                    //console.log('Hacer algo antes');
                    xhrPool.push(xhr);
                },
                type: "post",
                data:{
                    queries:[
                        {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                        fieldsSelect:["idasignacion","idremarcacion","fecha","extract(year from fecha) as ano","extract(month from fecha) as mes",
                            "codigo","cons_nombre","espa_nombre","total","totalconsumo"],
                        tableName:"remarcacion.vremarcacionesasignaciones",
                        // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                        orderby :[
                            { 
                                field: 'idasignacion',
                                type: 'asc',
                            },
                            {
                                field:'extract(month from fecha)::integer',
                                type:'asc'
                            }
                        ],
                        where:[{
                            field:"idedificio",
                            oper:'=',
                            value:idedificio,
                            type:'int'
                        },{
                            logical:'and',
                            field:"extract(year from fecha)",
                            oper:'=',
                            value:ano,
                            type:'int'
                        },{
                            logical:'and',
                            field:"idmedidor",
                            oper:'in',
                            value:"(select * from nuevas.getListMedidores(%s))".format(idarrendatarios),
                            type:'int'
                        }]
                    }]              
                },
                })
            .then(function(data) {
                reporte.activo = false;
                reporte.data.montos = [];
                reporte.data.energia = [];
                var idasignacion = -1;
                serieIndex = -1;
                data[0].resultados.map(function(element,index){
                    if (idasignacion != element.idasignacion){
                        serieIndex++;
                        idasignacion = element.idasignacion;

                    }
                    if (reporte.data.montos[serieIndex] === undefined){
                        reporte.data.montos.push({item:idasignacion,codigo:element.codigo,cons_nombre:element.cons_nombre,espa_nombre:element.espa_nombre});      
                        moment.monthsShort('es').map(function(element,index){
                            reporte.data.montos[serieIndex]["monto%s".format(index+1)] = 0;
                        });
                    }
                    reporte.data.montos[serieIndex]["monto%s".format(element.mes)]=((element.total !== undefined)&&(element.total != null))?Math.round(parseFloat(element.total)*1.19):0;

                    if (reporte.data.energia[serieIndex] === undefined){
                        reporte.data.energia.push({item:idasignacion,codigo:element.codigo,cons_nombre:element.cons_nombre,espa_nombre:element.espa_nombre});      
                        moment.monthsShort('es').map(function(element,index){
                            reporte.data.energia[serieIndex]["consumo%s".format(index+1)] = 0;
                        });
                    }
                    reporte.data.energia[serieIndex]["consumo%s".format(element.mes)]=((element.totalconsumo !== undefined)&&(element.totalconsumo != null))?parseFloat(element.totalconsumo):0;

                });

                if ( $.fn.DataTable.isDataTable(idtablaMontos) ) {
                    tableParamsMontos.data = [];
                    $(idtablaMontos).DataTable().destroy();
                    $(idtablaMontos).empty();
                };                       
                    tableParamsMontos.data = reporte.data.montos;
                    tableParamsMontos.aaData = reporte.data.montos;
                    tableParamsMontos.buttons.buttons[2].orientation =  'landscape';
                    tableParamsMontos.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaMontos = $(idtablaMontos).DataTable(tableParamsMontos); 

                    if ( $.fn.DataTable.isDataTable(idtablaEnergia) ) {
                        tableParamsEnergia.data = [];
                        $(idtablaEnergia).DataTable().destroy();
                        $(idtablaEnergia).empty();
                    };  

                    tableParamsEnergia.data = reporte.data.energia;
                    tableParamsEnergia.aaData = reporte.data.energia;
                    tableParamsEnergia.buttons.buttons[2].orientation =  'landscape';
                    tableParamsEnergia.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaEnergia = $(idtablaEnergia).DataTable(tableParamsEnergia); 
            })
            .done(function(xhr){
                var index = xhrPool.indexOf(xhr);
                if (index > -1) {
                    xhrPool.splice(index, 1);
                }
            }); 
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }           
    }


});