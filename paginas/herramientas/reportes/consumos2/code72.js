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
        if (paginaActiva.code == 72){
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
    
    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 72){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 72){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (Tabla.settings()[0].jqXHR != null) {
                Tabla.settings()[0].jqXHR.abort();   
            } 
            $(this).addClass("disabled");
            $('#btnBuscar').removeClass("disabled");
            Tabla.clear().draw('page');
            reporte.activo = false;
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 72){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#selectEdificio").val();
                var idservicio = $("#selectServicio").val();
                var fechainicial = $("#textFechaInicial").val();
                var fechafinal = $("#textFechaFinal").val();
                $("#tabla").data("export-title","Consumos %s-%s %s al %s".format($("#selectEdificio").select2('data')[0].text,$("#selectServicio").select2('data')[0].text,fechainicial,fechafinal));
                loadConsumo(reporte,idedificio,idservicio,fechainicial,fechafinal,tableParams,"#tabla");
            }
        }
    }); 

    function loadConsumo2(reporte,idedificio,idservicio,fechainicial,fechafinal,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $("#btnBuscar").addClass("disabled");
            $("#btnCancelar").removeClass("disabled");
            var ajaxParams = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["idmedidorfisico","case when (asig_codigo is null) or (asig_codigo = '') then codigo else asig_codigo end as codigo","cons_nombre","espa_nombre","energiafechainicial","energialecturainicial","energiafechafinal","energialecturafinal","energialecturafinal-energialecturainicial as consumo"],
                        tableName   :"remarcacion.consumos(%s,'%s','%s',%s,'%s')".format(
                            idedificio,
                            fechainicial,
                            fechafinal,
                            usuarioActivo,
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
                tableParams.columns[0].title = (["3","4","5","6","7","8"].includes($("#SelectEdificio").val()))?'PM Cherpa':'Código';
                tableParams.columns[0].sTitle=tableParams.columns[0].title; 
                tableParams.columns[4].title = 'Lect. Inicial %s'.format($("#selectServicio option:selected").attr('data-unidad'));
                tableParams.columns[6].title = 'Lect. Final %s'.format($("#selectServicio option:selected").attr('data-unidad'));
                tableParams.columns[7].title = 'Consumo %s'.format($("#selectServicio option:selected").attr('data-unidad')); 
                tableParams.columns[4].sTitle = tableParams.columns[4].title;
                tableParams.columns[6].sTitle = tableParams.columns[6].title;
                tableParams.columns[7].sTitle = tableParams.columns[7].title;
                tableParams.ajax = ajaxParams;
                Tabla = $(idtabla).DataTable(tableParams);    
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }        
    }   
    
    function loadConsumo(reporte,idedificio,idservicio,fechainicial,fechafinal,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $("#btnBuscar").addClass("disabled");
            $("#btnCancelar").removeClass("disabled");
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["idmedidorfisico","case when (asig_codigo is null) or (asig_codigo = '') then codigo else asig_codigo end as codigo","cons_nombre","espa_nombre","energiafechainicial","energialecturainicial","energiafechafinal","energialecturafinal","coalesce(energialecturafinal-energialecturainicial,0) as consumo"],
                        tableName   :"remarcacion.consumos(%s,'%s','%s',%s,'%s')".format(
                            idedificio,
                            fechainicial,
                            fechafinal,
                            usuarioActivo,
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
                        $(idtabla).append('<tfoot><tr><th>-</th><th>-</th><th>-</th><th>-</th><th></th><th></th><th></th><th></th></tr></tfoot>');
                    };               
                        reporte.data = data[0].resultados;        
                        tableParams.aaData = reporte.data;
                        tableParams.data = reporte.data;
                        tableParams.columns[0].title = (["3","4","5","6","7","8"].includes($("#SelectEdificio").val()))?'PM Cherpa':'Código';
                        tableParams.columns[0].sTitle=tableParams.columns[0].title; 
                        tableParams.columns[4].title = 'Lect. Inicial %s'.format($("#selectServicio option:selected").attr('data-unidad'));
                        tableParams.columns[6].title = 'Lect. Final %s'.format($("#selectServicio option:selected").attr('data-unidad'));
                        tableParams.columns[7].title = 'Consumo %s'.format($("#selectServicio option:selected").attr('data-unidad')); 
                        tableParams.columns[4].sTitle = tableParams.columns[4].title;
                        tableParams.columns[6].sTitle = tableParams.columns[6].title;
                        tableParams.columns[7].sTitle = tableParams.columns[7].title;
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

});