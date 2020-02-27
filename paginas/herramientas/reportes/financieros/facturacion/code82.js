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
        if (paginaActiva.code == 82){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 82){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                var ano = $("#selectAno").val();
                loadFacturacion(reporte,idedificio,ano,"#tabla",tableParams);
            }
        }
    }); 

    function loadFacturacion(reporte,idedificio,ano,idtabla,tableParams){
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
                        fieldsSelect:["*"],
                        tableName:"control.facturacion_anual(%s,%s)".format(idedificio,ano),
                        // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                        orderby :[
                            { 
                                field: 'mes',
                                type: 'asc',
                            },
                            {
                                field:'idcargo',
                                type:'asc'
                            }
                        ]
                    }]              
                },
                })
            .then(function(data) {
                console.log(data);
                reporte.activo = false;
                reporte.data = [];
                var mes = 0;
                data[0].resultados.map(function(element,index){
                    if (mes != element.mes){
                        serieIndex = 0;
                        mes = element.mes;
                    }
                    if (reporte.data[serieIndex] === undefined){
                        reporte.data.push({item:element.idcargo,cargo:element.nombre});      
                    }
                    reporte.data[serieIndex]["monto%s".format(element.mes)]=((element.total !== undefined)&&(element.total != null))?Math.round(parseFloat(element.total)*1.19):0;
                    serieIndex++;
                });

                if ( $.fn.DataTable.isDataTable(idtabla) ) {
                    tableParams.data = [];
                    $(idtabla).DataTable().destroy();
                    $(idtabla).empty();
                };                       
                    tableParams.data = reporte.data;
                    tableParams.aaData = reporte.data;
                    tableParams.buttons.buttons[2].orientation =  'landscape';
                    tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaAsignaciones = $(idtabla).DataTable(tableParams); 
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