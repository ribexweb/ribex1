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
        if (paginaActiva.code == 83){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 83){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                idpresupuesto = $("#selectEdificio option:selected").attr('data-idpresupuesto');
                var ano = $("#selectAno").val();
                loadEnergia(reporte,idpresupuesto,ano,"#tabla",tableParams);
            }
        }
    }); 

    function loadEnergia(reporte,idpresupuesto,ano,idtabla,tableParams){
        if (!(reporte.activo)){
            $('.dataTables_processing', $(idtabla).closest('.dataTables_wrapper')).show();
            reporte.activo = true;
            var fecha = '';
            console.log(ano+'-'+parseInt(moment().format('YYYY')));
            if (ano != parseInt(moment().format('YYYY'))){
                fecha = '%s-12-31 23:59:59'.format(ano);
            }
            else {
                if (parseInt(moment().format('MM'))>1){
                    fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');        
                }
                else{
                    fecha = '%s-01-01 00:00'.format(ano);
                }
            }
            $.ajax({
                url : "php/data.php?energia_presupuesto", // Use href attribute as URL
                beforeSend: function( xhr ) {
                    //console.log('Hacer algo antes');
                    xhrPool.push(xhr);
                },
                type: "post",
                data:{
                    queries:[
                        {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
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
                        },{ logical:"and",
                            field:"ano",
                            oper:"=",
                            value:ano,
                            type:"int"
                        },]
                        },
                        {
                            fieldsSelect:["*"],
                            tableName:"mediciones.energia_anual(%s,%s,%s,'%s','%s')".format(idpresupuesto,usuarioActivo,1,fecha,database),
                            orderby:[{field:'mes',type:'asc'}]
                        }
                    ]              
                        },
                })
            .then(function(data) {
                reporte.activo = false;
                reporte.data = [];


                registro = {item:1,descripcion:"Presupuestado"};
                moment.monthsShort('es').map(function(element,index){
                    registro["monto%s".format(index+1)] = 0;
                });
                data[0].resultados.map(function(element,index){
                    registro["monto%s".format(element.mes)] = parseFloat(element.energia);
                });

                reporte.data.push(registro);

                registro = {item:1,descripcion:"Real"};
                moment.monthsShort('es').map(function(element,index){
                    registro["monto%s".format(index+1)] = 0;
                });
                data[1].resultados.map(function(element,index){
                    console.log(element.consumo);
                    registro["monto%s".format(element.mes)] = ((element.consumo !== undefined)&&(element.consumo != null))?parseFloat(element.consumo):0;
                });

                reporte.data.push(registro);




                $('.dataTables_processing', $(idtabla).closest('.dataTables_wrapper')).hide(); 
                
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