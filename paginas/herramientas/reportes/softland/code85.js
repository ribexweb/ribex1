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
        if (paginaActiva.code == 85){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarRemarcaciones(this.value);
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

    $(document).on('click','#btnGenerar',function(event){
        if (paginaActiva.code == 85){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idremarcacion = $("#selectRemarcacion").val();
                var fecha = $("#textFecha").val();
                var bodega = $("#textBodega").val();
                var folio = $("#textFolio").val();
                var cCosto = $("#textCCosto").val();
                var cCostoContable = $("#textCCostoContable").val();
                var salida = $("#textSalida").val();
                var pago = $("#textPago").val();
                loadSoftland(reporte,idremarcacion,fecha,bodega,folio,cCosto,cCostoContable,salida,pago,tableParams,"#tabla");
            }
        }
    }); 
  
    function loadSoftland(reporte,idremarcacion,fecha,bodega,folio,cCosto,cCostoContable,salida,pago,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?loadExportarSoftland",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"nuevas.softlandtemuco(%s,'%s','%s','%s','%s','%s','%s','%s')".format(idremarcacion,bodega,folio,fecha,salida,cCosto,cCostoContable,pago),
                        orderby:[]      
                    }]
                },
                success: function(data){
                    reporte.activo = false;
                    reporte.data = data[0].resultados;

                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                    };     
                              
                    //tableParams.buttons.buttons[2].orientation =  'landscape';
                    //tableParams.buttons.buttons[2].pageSize = 'LEGAL';        
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

});