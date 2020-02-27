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
    
    $(document).on('click','#iconoFecha',function(event){
        if (paginaActiva.code == 10){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $('#TextFecha').focus();
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 10){
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
        if (paginaActiva.code == 10){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#SelectEdificio").val();
                var fecha = $("#TextFecha").val();
                loadEnergia(reporte,idedificio,fecha,tableParams,"#tabla");
            }
        }
    }); 

    function loadEnergia(reporte,idedificio,fecha,tableParams,idtabla){
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
                            field:"idservicio",
                            oper:"=",
                            value:3,
                            type:"int"
                        }],      
                    }];
                },
                dataSrc: function(data){
                    console.log(data);
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
                tableParams.ajax = ajaxParams;
                Tabla = $(idtabla).DataTable(tableParams);    
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }        
    }

});