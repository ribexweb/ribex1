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
    
    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 53){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 53){
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
        if (paginaActiva.code == 53){
            if (validar('#FormaParametros')){
                console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
                var idedificio = $("#SelectEdificio").val();
                var fechainicial = $("#TextFechaInicial").val();
                var fechafinal = $("#TextFechaFinal").val();
                loadConsumo(reporte,idedificio,fechainicial,fechafinal,tableParams,"#tabla");
            }
        }
    }); 

    function loadConsumo(reporte,idedificio,fechainicial,fechafinal,tableParams,idtabla){
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
                        tableName   :"remarcacion.consumoenergia(%s,'%s','%s',%s,'%s')".format(
                            idedificio,
                            fechainicial,
                            fechafinal,
                            usuarioActivo,
                            database),
                        orderby:[{
                            field:"idmedidorfisico",
                            type : "asc"
                        }],
                        where:[],      
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
                tableParams.ajax = ajaxParams;
                Tabla = $(idtabla).DataTable(tableParams);    
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }        
    }    

});