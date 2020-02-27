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
        if (paginaActiva.code == 77){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarRemarcaciones(this.value);
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 77){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                idedificio = $("#selectEdificio").val();
                idservicio = $("#selectServicio").val();
                fecha = $("#textFecha").val();
                idremarcacion = $("#selectRemarcacion").val();
                $("#tabla").data("export-title","Remarcacion %s".format($("#selectRemarcacion").select2('data')[0].text));
                loadRemarcaciones(reporte,idremarcacion,tableParams,"#tabla");
            }
        }
    }); 

    function loadRemarcaciones(reporte,idremarcacion,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $("#btnBuscar").addClass("disabled");
            $.ajax({
                url: "php/data.php?ConsumosArrendatarios",
                type:"POST",
                data:{
                    queries:[{
                        fieldsSelect:["*,total*1.19 as totaliva"],
                        tableName   :"remarcacion.consumosarrendatarios(%s)".format(idremarcacion),
                        orderby:[{
                            field:"idconsumidor",
                            type : "asc"
                        }],
                        where:[],      
                    }]   
                },
                success: function(data){
                    reporte.activo = false;
                    $("#btnBuscar").removeClass("disabled");
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        $(idtabla).append('<tfoot><tr><th>-</th><th>-</th><th>-</th><th>-</th><th></th><th></th><th></th><th></th><th>-</th></tr></tfoot>');
                    };               
                    data[0].resultados = data[0].resultados.map(function(registro){
                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_consumidor"><i class="fa fa-download"></i></button>'.format(registro.idconsumidor,idremarcacion);
                        return registro;
                    });
                        reporte.data = data[0].resultados;        
                        tableParams.aaData = reporte.data;
                        tableParams.data = reporte.data;
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

    $(document).on('click', '.descargar_boleta_consumidor', function (event) {
        if (paginaActiva.code ==77) {
            console.log(this);
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            generar_boleta_consumidor([this.id], this, 'detallada', idedificio,idremarcacion, true);
        }
    });

});