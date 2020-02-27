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
        if (paginaActiva.code == 13){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    //Evento Click para el Control BtnBorrar
    $(document).on('click','#btnBorrar',function(event){
        if (paginaActiva.code == 13){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            graphDelete(barGraphDemandaGeneralDiaria);

        }
    });

    //Evento Click para el Boton BtnGuardar    
    $(document).on('click','#btnGuardar',function(event){     
        if (paginaActiva.code == 13){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var canvas = graphTargetDemandaGeneralDiaria.get(0);
            canvas.toBlob(function(blob) {
                saveAs(blob, "%s.png".format('Energia_Leida'));
            });
        }   
    });  

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 13){
            console.log
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (!(reporte.activo)){
                $("#container-loading").removeClass("hidden"); 
                $("#tbEdificio").html("<b>%s</b>".format($("#SelectEdificio option:selected").text()));
                $("#tbRango").html("<b>Rango Desde</b>:%s <b>Hasta</b>:%s".format($("#TextFechaInicial").val(),$("#TextFechaFinal").val()));
                barGraphDemandaGeneralDiaria.options.title.text = ['Energia Leida en %s'.format($("#SelectEdificio option:selected").text()),'%s al %s'.format($("#TextFechaInicial").val(),$("#TextFechaFinal").val())];
                graficoTortaJs2(
                    reporte,
                    { 
                        chartData:chartDataDemandaGeneralDiaria,
                        graph:barGraphDemandaGeneralDiaria,
                        queries:[
                        {   dataTb : "#tabla",
                            unidad: "kWh",
                            label:  ["consumidor","espacio","edificio"],
                            value: "consumo",
                            fieldsSelect: ["*,(valor_final-valor_inicial) as consumo"],
                            tableName   :  "mediciones.demanda_medidores_principales('%s','%s',%s,1,'%s')".format(
                                                $("#TextFechaInicial").val(),
                                                $("#TextFechaFinal").val(),
                                                $("#SelectEdificio").val(),
                                                database),
                            orderby:[{
                                field:"consumo",
                                type : "asc"
                            }],
                            where :[{
                                field: "principal",
                                oper : "=",
                                value: "true",
                                type : "int"
                            }],     
                        }],
                    },
                    {
                    }
                );


                /*graficoTortaJs(
                true,
                reporte,
                chartDataDemandaGeneralDiaria,
                barGraphDemandaGeneralDiaria,   
                ["consumidor","espacio","edificio"],
                "consumo",   
                ["*,(valor_final-valor_inicial) as consumo"],
                "demanda_medidores_principales('%s','%s',%s,1)".format(
                    $("#TextFechaInicial").val(),
                    $("#TextFechaFinal").val(),
                    $("#SelectEdificio").val()),
                ["consumo asc"],
                ["principal"],
                ["="],
                ["true"],
                ["int"],
                [""]);*/
            }
            else {
                error("Grafico Solicitado, espere a que finalice la consulta");
            }
        } 
    }); 

});