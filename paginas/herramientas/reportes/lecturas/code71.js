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
        if (paginaActiva.code == 71){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            selectJs2(
                "#selectServicio",
                { 
                    value: "idservicio",
                    show: {
                        fields:["nombre","prefijo"],
                        format:"%s (%s)",
                    },
                    hide:["prefijo","valor","unidad"],
                    queries:[{
                        fieldsSelect:["distinct on (vmedidores.idservicio) vmedidores.idservicio","vmedidores.serv_nombre as nombre","coalesce(servicios.valor,'') as valor","coalesce(servicios.unidad,'') as unidad","servicios.prefijo"],
                        tableName   :"mediciones.vmedidores left join mediciones.servicios using (idservicio)",
                        orderby:[],
                        where  :[{
                                field  :"servicios.activo",
                                oper   :"=",
                                value  :"true",
                                type   :"int",                    
                            },
                            {   logical : "and",
                                field: "vmedidores.idedificio",
                                oper : "=",
                                value: this.value,
                                type : "int"
                            }
                        ]        
                    }],
                },
                {
                }    
            );
        }
    });
    
    $(document).on('click','#iconoFecha',function(event){
        if (paginaActiva.code == 71){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $('#TextFecha').focus();
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 71){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (Tabla.settings()[0].jqXHR != null) {
            Tabla.settings()[0].jqXHR.abort();   
            } 
            $(this).addClass("disabled");
            Tabla.clear().draw('page');
            reporte.activo = false;
            $("#btnBuscar").removeClass('disabled');
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        console.log(paginaActiva.code);
        if (paginaActiva.code == 71){
            console.log('si');
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                var idservicio = $("#selectServicio").val();
                var fecha = $("#textFecha").val();
                $("#tabla").data("export-title","Lecturas %s-%s al %s".format($("#selectEdificio").select2('data')[0].text,$("#selectServicio").select2('data')[0].text,fecha));
                loadEnergia(reporte,idedificio,idservicio,fecha,tableParams,"#tabla");
            }
        }
    }); 

    function loadEnergia(reporte,idedificio,idservicio,fecha,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $("#btnBuscar").addClass("disabled");
            $("#btnCancelar").removeClass("disabled");
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries:[{
                        fieldsSelect:["idmedidorfisico","case when (codigocliente is null) or (codigocliente = '') then codigo else codigocliente end as codigo","cons_nombre","espa_nombre","fecha::date as fecha","fecha::time as hora","valor"],
                        tableName   :"mediciones.valoralafecha2(%s,%s,'%s'::timestamp,'%s')".format(
                            idedificio,
                            usuarioActivo,
                            fecha,
                            database),
                        orderby:[{
                            field:"idmedidorfisico",
                            type : "asc"
                        }],
                        where:[{
                            field:'idservicio',
                            oper:'=',
                            value:idservicio,
                            type:'int'
                        }],      
                    }]   
                },
                success: function(data){
                    reporte.activo = false;
                    $("#btnCancelar").addClass("disabled");
                    $("#btnBuscar").removeClass("disabled");
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        $(idtabla).append('<tfoot><tr><th>-</th><th>-</th><th>-</th><th>-</th><th></th><th></th></tr></tfoot>');
                    };               
                        reporte.data = data[0].resultados;        
                        tableParams.aaData = reporte.data;
                        tableParams.data = reporte.data;
                        tableParams.columns[0].title = (["3","4","5","6","7","8"].includes($("#SelectEdificio").val()))?'PM Cherpa':'Código';
                        tableParams.columns[0].sTitle=tableParams.columns[0].title; 
                        tableParams.columns[tableParams.columns.length-1].title = 'Lectura %s'.format($("#selectServicio option:selected").attr('data-valor'),$("#selectServicio option:selected").attr('data-unidad'));
                        tableParams.columns[tableParams.columns.length-1].sTitle = tableParams.columns[tableParams.columns.length-1].title;        
                        Tabla = $(idtabla).DataTable(tableParams);    
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


    function loadEnergia2(reporte,idedificio,idservicio,fecha,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $("#btnBuscar").addClass("disabled");
            $("#btnCancelar").removeClass("disabled");
            var ajaxParams = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["idmedidorfisico","case when (codigocliente is null) or (codigocliente = '') then codigo else codigocliente end as codigo","cons_nombre","espa_nombre","fecha::date as fecha","fecha::time as hora","valor"],
                        tableName   :"mediciones.valoralafecha2(%s,%s,'%s'::timestamp,'%s')".format(
                            idedificio,
                            usuarioActivo,
                            fecha,
                            database),
                        orderby:[{
                            field:"idmedidorfisico",
                            type : "asc"
                        }],
                        where:[{
                            field:'idservicio',
                            oper:'=',
                            value:idservicio,
                            type:'int'
                        }],      
                    }];
                },
                dataSrc: function(data){
                    reporte.activo = false;
                    $("#btnCancelar").addClass("disabled");
                    $("#btnBuscar").removeClass("disabled");
                    return (data[0].resultados);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                },
            };
               
                $(idtabla).append('<tfoot><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></tfoot>');
                tableParams.columns[0].title = (["3","4","5","6","7","8"].includes($("#SelectEdificio").val()))?'PM Cherpa':'Código';
                tableParams.columns[0].sTitle=tableParams.columns[0].title; 
                tableParams.columns[tableParams.columns.length-1].title = '%s %s'.format($("#selectServicio option:selected").attr('data-valor'),$("#selectServicio option:selected").attr('data-unidad'));
                tableParams.columns[tableParams.columns.length-1].sTitle = tableParams.columns[tableParams.columns.length-1].title;
                tableParams.ajax = ajaxParams;
                Tabla = $(idtabla).DataTable(tableParams);
       }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }        
    }

});