
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
        if (paginaActiva.code == 60){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if ($("#SelectEdificio").val() != -1) {
            // barGraphDemandaGeneralDiaria.options.watermark.image.src = "images/graph/logo%s.png".format($("#SelectEdificio").val());
            }
            selectJs2(
                "#SelectPeriodo",
                { 
                    value: "desde",
                    show: {
                        fields:["tarifa","desde","hasta"],
                        format: "(%s) %s - %s "
                    },
                    hide: ["idremarcacion"],
                    queries:[{
                        fieldsSelect: ["idremarcacion","desde::date","hasta::date","fecha::date","nombre as tarifa"],
                        tableName   :"remarcacion.vremarcaciones",
                        orderby:[{
                            field:"fecha",
                            type : "desc"
                        }],
                        where  :[{
                            field  :"idedificio",
                            oper   :"=",
                            value  :$("#SelectEdificio").val(),
                            type   :"int",        
                        },{
                            logical:"and",
                            field  :"activo",
                            oper   :"=",
                            value  : true,
                            type   :"int"
                        }]        
                    }],
                },
                {
                }    
            );
        }
    });

    $(document).on('click','#btnBuscar',function(event){
        if (paginaActiva.code == 60){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            loadBoletas(reporte,$("#SelectPeriodo option:selected").attr('data-idremarcacion'),tableParams,"#tabla");      
        }     
    });

    $(document).on('click','.descargar_boletas_periodo_automaticas',function(event){  
        if (paginaActiva.code == 60){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
           // var id = $(this).attr("data-idremarcacionasignacion");
           // arrayId = [];
           // arrayId.push(id);
           var showCargos = ($("#SelectEdificio").val()!=15)?true:false;
            generar_boleta_array([$(this).attr("data-idremarcacionasignacion")],this,'detallada',$("#SelectEdificio").val(),showCargos);
        }
    });

    $(document).on('click','#descargarTodasPeriodo',function(event){
        if (paginaActiva.code == 60){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
           // var filtrado = Tabla.rows( { filter : 'applied'} ).data();
           // var arrayId = [];
           // filtrado.map(function(value,index){
           //     arrayId.push(value["idremarcacionasignacion"]);
           // });
            var showCargos = ($("#SelectEdificio").val()!=15)?true:false;
            generar_boleta_array(Tabla.rows( { filter : 'applied'} ).data().map(boleta => boleta.idremarcacionasignacion),this,'detallada',$("#SelectEdificio").val(),showCargos);
        }
    });

    function loadBoletas(reporte,idremarcacion,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
/*            var botonDescarga = ($("#SelectEdificio").val()!=15)?
                                [{nombre:"descargar",tipo:"btn-info",accion:"descargar",icono:"fa-download"}]:
                                [{nombre:"descargarSimple",tipo:"btn-info",accion:"descargarSimple",icono:"fa-download"}]
*/
            ajaxParams = {
                url: "php/getTable2.php",
                type:"POST",
                data:function(d){
                    d.primaryField = "idremarcacionasignacion";
                    d.hide = ["idremarcacionasignacion"];
                    d.show = {
                        fields:["desde","hasta","codigo","cons_nombre","idremarcacionasignacion","total","totaliva"],
                        deletebtn:0,
                        updatebtn:0,
                        realtablename: "boletas_periodo_automaticas",
                    };
                    d.queries=[{
                        fieldsSelect:["idremarcacionasignacion","desde","hasta","fecha::date","extract('year' from fecha) as ano","lpad(extract('month' from fecha)::text,2,'0') as mes","vremarcacionesasignaciones.cons_nombre","vremarcacionesasignaciones.codigo","case when ivacargos = false then sumavaloresfacturados.total else round(sumavaloresfacturados.total/1.19) end as total","case when ivacargos = false then sumavaloresfacturados.total*1.19 else sumavaloresfacturados.total end	 as totaliva"],
                        tableName   :"mediciones.medidores_permisados(%s,%s) ".format($("#SelectEdificio").val(),usuarioActivo)+
                                    "left join remarcacion.vremarcacionesasignaciones using (idasignacion)"+
                                    "left join ( select idremarcacionasignacion,sum(monto) as total " +
                                    "from remarcacion.valores_facturados group by idremarcacionasignacion" +
                                    ") as SumaValoresFacturados using (idremarcacionasignacion) ",
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where  :[
                        { field:"vremarcacionesasignaciones.idremarcacion",
                            oper:"=",
                            value:idremarcacion,  //$("#SelectMedidor option:selected").attr('data-idasignacion'),
                            type: "int"
                        },{
                            logical:"and",
                            field:"vremarcacionesasignaciones.activo",
                            oper :"=",
                            value:true,
                            type : "int"
                        },{
                            logical:"and",
                            field:"vremarcacionesasignaciones.publicar",
                            oper :"=",
                            value:true,
                            type : "int"
                        }],     
                    }];
                    d.otrosbotones=[{nombre:"descargar",tipo:"btn-info",accion:"descargar",icono:"fa-download"}];
                },
                dataSrc: function(data){   
                    console.log(data);                 
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