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
        if (paginaActiva.code == 81){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 81){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                idpresupuesto = $("#selectEdificio option:selected").attr('data-idpresupuesto');
                idarrendatarios = $("#selectEdificio option:selected").attr('data-idarrendatarios');
                idgastocomun =  $("#selectEdificio option:selected").attr('data-idgastocomun');
                var ano = $("#selectAno").val();
                loadPresupuesto(reporte,idedificio,idpresupuesto,idarrendatarios,idgastocomun,ano,"#tabla",tableParams);
            }
        }
    }); 

    function loadPresupuesto(reporte,idedificio,idpresupuesto,idarrendatarios,idgastocomun,ano,idtabla,tableParams){
        if (!(reporte.activo)){
            reporte.activo = true;
            var miqueries = makeQueries(idedificio,idpresupuesto,idarrendatarios,idgastocomun,ano);
            $.ajax({
                url : "php/data.php?facturas", // Use href attribute as URL
                beforeSend: function( xhr ) {
                    //console.log('Hacer algo antes');
                    xhrPool.push(xhr);
                },
                type: "post",
                data:{
                    queries : miqueries     
                },
                })
            .then(function(data) {
                reporte.activo = false;
                reporte.data = [];

                data.map(function(element,index){
                    registro = {item:index};
                    nameMonto = '';
                    switch (index) {
                        case 0: registro["descripcion"] = 'Presupuesto';nameMonto="monto";break;
                        case 1: registro["descripcion"] = 'Facturas'   ;nameMonto="totalneto";break;
                        case 2: registro["descripcion"] = 'Tiendas'   ;nameMonto="total";break;
                        case 3: registro["descripcion"] = 'Gasto Común';nameMonto="total";break;
                    }
        
                    moment.monthsShort('es').map(function(element,index){
                        registro["monto%s".format(index+1)] = 0;
                    });
        
                    element.resultados.map(function(mensual,indexm){
                        if (index != 0) {
                            registro["monto%s".format(mensual.mes)] = Math.round(parseFloat(mensual[nameMonto])*1.19);
                        }
                        else {
                            registro["monto%s".format(mensual.mes)] = Math.round(parseFloat(mensual[nameMonto]));    
                        }
                    });
                    reporte.data.push(registro);
                });


                if (idgastocomun==-1){
                    registro ={item:3};
                    registro["descripcion"] = 'Gasto Común';
                    moment.monthsShort('es').map(function(element,index){
                        registro["monto%s".format(index+1)] = 0;
                    });
                    data[1].resultados.map(function(element,index){

                        let remarcacion = data[2].resultados.filter(item => item.mes == element.mes);
                        totalremarcacion = (remarcacion.length > 0)?remarcacion[0].total:0;
                        console.log('Total Remarcacion:'+totalremarcacion);
                        diff = Math.round((parseFloat(element.totalneto)-parseFloat(totalremarcacion))*1.19);
                        registro["monto%s".format(parseInt(element.mes))] = diff; 
                    });
                    reporte.data.push(registro);
                }





                
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


    function makeQueries(idedificio,idpresupuesto,idarrendatarios,idgastocomun,ano){
        var a = [];
        if (idpresupuesto != -1){ //SI HAY MEDIDOR DE PRESUPUESTO
            a.push({
                fieldsSelect:["*"],
                tableName:"mediciones.presupuestos",
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[
                    { 
                    field: 'mes',
                    type: 'asc',
                    }
                ],
                where:[{
                    field:'idmedidor',
                    oper:'=',
                    value:idpresupuesto,
                    type:'int'
                },{
                    logical:"and",
                    field:"ano",
                    oper:"=",
                    value:ano,
                    type:"int"
                }
            ]
            });
        }

        if (idedificio != -1){     //FACTURAS
            a.push({
                fieldsSelect:["extract(month from fecha)::integer as mes","totalneto"],
                tableName:"remarcacion.vgruposfacturas",
                orderby:[{
                    field:"extract(month from fecha)::integer",
                    type:"asc"
                }],
                where:[{
                    field:"extract(year from fecha)",
                    oper:"=",
                    value:ano,
                    type:"int"
                },{
                    logical:"and",
                    field:"idedificio",
                    oper:"=",
                    value:idedificio,
                    type:"int"
                }
                ]
            });
        }
        if (idarrendatarios != -1){ //TIENDAS O LOCALES
            a.push({
                fieldsSelect:["extract(month from fecha)::integer as mes","sum(total) as total"],
                tableName:"remarcacion.vremarcacionesasignaciones",
                orderby:[{
                    field:"extract(month from fecha)::integer",
                    type:"asc"
                }],
                where:[{
                    field:"extract(year from fecha)",
                    oper:"=",
                    value:ano,
                    type:"int"
                },{
                    logical:"and",
                    field:"idmedidor",
                    oper:"in",
                    value:"(select * from nuevas.getListMedidores(%s))".format(idarrendatarios),
                    type:"int"    
                },{
                    logical:"and",
                    field:"idedificio",
                    oper:"=",
                    value:idedificio,
                    type:"int"    
                }],
                groupby:["extract(month from fecha)"]             
            });
        }
        console.log(idgastocomun);
        if ((idgastocomun != -1)){ //SI GASTO COMUN ES POR MEDIDOR
            a.push({
                fieldsSelect:["extract(month from fecha)::integer as mes","total"],
                tableName:"remarcacion.vremarcacionesasignaciones",
                orderby:[{
                    field:"extract(month from fecha)::integer",
                    type:"asc"
                }],
                where:[{
                    field:"extract(year from fecha)",
                    oper:"=",
                    value:ano,
                    type:"int"
                },{
                    logical:"and",
                    field:"idmedidor",
                    oper:"=",
                    value:idgastocomun,
                    type:"int"    
                }]
            });
        }

        return a;
    }

});