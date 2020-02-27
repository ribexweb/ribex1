
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
    
    $('#SelectMedidor').select2({
        templateResult: function(data) {
            var r = data.text.split('|');
            var result = '<div>';
            for (var index=0;index<r.length;index++){
                result += '<div>' + r[index] + '</div>';
            }                            
                result += '</div>';
            return $(result);
        }
    });

    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 55){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            selectJs2(
                "#SelectPeriodo",
                { 
                    value: "desde",
                    show: {
                        fields:["desde","hasta"],
                        format: "Periodo: %s - %s "
                    },
                    hide: ["desde","hasta"],
                    queries:[{
                        fieldsSelect: ["distinct on (desde) desde::date","hasta::date","fecha::date"],
                        tableName   :"remarcacion.boletas left join mediciones.asignaciones using (idasignacion)",
                        orderby:[{
                            field:"desde",
                            type : "desc"
                        }],
                        where  :[{
                            field  :"idedificio",
                            oper   :"=",
                            value  :$("#SelectEdificio").val(),
                            type   :"int",        
                        }]        
                    }],
                },
                {
                }    
            );
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 55){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var edificio = $("#SelectEdificio").val();
            var desde = $("#SelectPeriodo option:selected").attr('data-desde');
            var hasta = $("#SelectPeriodo option:selected").attr('data-hasta');
            loadBoletas(reporte,edificio,desde,hasta,tableParams,"#tabla");       
        }     
    });
    
    $(document).on('click','.descargar_boletas_periodo_manuales',function(event){
        if (paginaActiva.code == 55){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var ano = $(this).attr("data-ano");
            var mes = $(this).attr("data-mes");
            var idasignacion = $(this).attr("data-idasignacion");
            var idedificio = $(this).attr("data-idedificio");
            var grupo = $(this).attr("data-grupo");
            if (grupo != "0"){
                var File = "paginas/herramientas/boletas/archivos/%s/%s/%s/%s/%s.jpg".format(idedificio,ano,mes,grupo,idasignacion);
            }
            else {
                var File = "paginas/herramientas/boletas/archivos/%s/%s/%s/%s.jpg".format(idedificio,ano,mes,idasignacion);
            }
            descargar(File,ano,mes,idasignacion,grupo);
        }
    });

    function loadBoletas(reporte,idedificio,desde,hasta,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParams = {
                url: "php/getTable2.php",
                type:"POST",
                data:function(d){
                    d.primaryField = "idboleta";
                    d.hide = ["ano","mes","idasignacion","idedificio","grupo"];
                    d.show = {
                      fields:["idboleta","desde","hasta","codigo","cons_nombre","monto"],
                      deletebtn:0,
                      updatebtn:0,
                      realtablename: "boletas_periodo_manuales",
                    };
                    d.queries = [{
                      fieldsSelect:["coalesce(boletas.grupo,'0') as grupo,boletas.idboleta,boletas.desde::date,boletas.hasta::date,boletas.fecha::date,boletas.idasignacion,boletas.monto,vmedidores.idedificio,extract('year' from fecha) as ano, lpad(extract('month' from fecha)::text,2,'0') as mes","cons_nombre","codigo"],
                      tableName   :"remarcacion.boletas left join mediciones.medidores_permisados(%s,%s) as vmedidores using(idasignacion)".format($("#SelectEdificio").val(),usuarioActivo),
                      orderby:[{
                        field:"idasignacion",
                        type : "asc"
                      }],
                      where  :[
                        { field:"vmedidores.idedificio",
                            oper:"=",
                            value:idedificio,
                            type: "int"
                        },
                        {
                            logical:'and',
                            field:'desde',
                            oper:'=',
                            value:desde,
                            type:'str'
                        },
                        {
                            logical:'and',
                            field:'hasta',
                            oper:'=',
                            value:hasta,
                            type:'str'
                        }],     
                    }];
                    d.otrosbotones = [{nombre:"descargar",tipo:"btn-info",accion:"descargar",icono:"fa-download"}];
                },
                dataSrc: function(data){                  
                    reporte.activo = false;
                    reporte.data = data.data;
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
                tableParams.ajax = ajaxParams;
                Tabla = $(idtabla).DataTable(tableParams);     
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

});