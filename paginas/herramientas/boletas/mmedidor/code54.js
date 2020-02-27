
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



    //Evento Change para el Control Select Edificio



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
        if (paginaActiva.code == 54){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            selectJs2(
                "#SelectMedidor",
                { 
                    value: "idmedidor",
                    show: {
                        fields:["codigo","cons_nombre","espa_nombre"],
                        format: "%s | %s | %s"
                    },
                    hide: ["idmedidorfisico","idasignacion"],
                    queries:[{
                        fieldsSelect: ["idmedidor","idmedidorfisico","idasignacion","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
                        tableName   :"mediciones.medidores_permisados(%s,%s)".format($("#SelectEdificio").val(),usuarioActivo),
                        orderby:[{
                            field:"idmedidorfisico",
                            type : "asc NULLS first"
                        }],
                        where  :[{
                            field  :"asig_activo",
                            oper   :"=",
                            value  :"true",
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
        if (paginaActiva.code == 54){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            loadBoletas(reporte,$("#SelectMedidor option:selected").attr('data-idasignacion'),tableParams,"#tabla");       
        }     
    });

    $(document).on('click','.descargar_boletas_medidor_manuales',function(event){
        if (paginaActiva.code == 54){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var ano = $(this).attr("data-ano");
            var mes = $(this).attr("data-mes");
            var idasignacion = $(this).attr("data-idasignacion");
            var idedificio = $(this).attr("data-idedificio");
            var grupo = $(this).attr("data-grupo");
            var File = "paginas/herramientas/boletas/archivos/";
            File += (grupo != "0")?"%s/%s/%s/%s/%s.jpg".format(idedificio,ano,mes,grupo,idasignacion):"%s/%s/%s/%s.jpg".format(idedificio,ano,mes,idasignacion);
            descargar(File,ano,mes,idasignacion,grupo);
        }
    });

    function loadBoletas(reporte,idasignacion,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            ajaxParams = {
                url: "php/getTable2.php",
                type:"POST",
                data:function(d){
                    d.primaryField = "idboleta";
                    d.hide = ["ano","mes","idasignacion","idedificio","grupo"];
                    d.show = {
                      fields:["idboleta","ano","mes","fecha","desde","hasta","monto"],
                      deletebtn:0,
                      updatebtn:0,
                      realtablename: "boletas_medidor_manuales",
                    };
                    d.queries = [{
                      fieldsSelect:["coalesce(boletas.grupo,'0') as grupo,boletas.idboleta,boletas.desde,boletas.hasta,boletas.fecha::date,boletas.idasignacion,boletas.monto,vmedidores.idedificio,extract('year' from fecha) as ano, lpad(extract('month' from fecha)::text,2,'0') as mes"],
                      tableName   :"remarcacion.boletas left join mediciones.vmedidores using(idasignacion)",
                      orderby:[{
                        field:"idboleta",
                        type : "desc"
                      }],
                      where  :[
                      { field:"boletas.idasignacion",
                        oper:"=",
                        value:idasignacion,
                        type: "int"
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