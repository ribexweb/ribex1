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

    //Formatear Despliegue del Select Variable
    $('#SelectVariable').select2({
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

    //Formatear Despliegue del Control Select Medidor
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

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            selectJs2(
                "#SelectMedidor",
                { 
                    value: "idmedidor",
                    show: {
                        fields:["codigo","cons_nombre","espa_nombre"],
                        format: "%s | %s | %s"
                    },
                    hide: ["idmedidorfisico"],
                    queries:[{
                        fieldsSelect: ["idmedidor","idmedidorfisico","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
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

    // Evento Change para el Control Select Medidor
    $(document).on('change','#SelectMedidor',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            console.log('indice de variable:'+indexVar);
            selectJs2(
                "#SelectVariable",
                {   Selected:indexVar,
                    value: "idvariable",
                    show: {
                        fields:["idvariable","descripcion","codigo","unid_descripcion","unid_codigo"],
                        format: "%s | %s | %s | %s (%s)"
                    },
                    hide: ["codigo","unid_descripcion","zero"],
                    queries:[{
                        fieldsSelect:["*"],
                        tableName   :"mediciones.variables_permitidas(%s)".format(this.value),
                        orderby:[{
                            field:"idvariable",
                            type : "asc"
                        }],
                        where  :[{
                            field  :"vari_activo",
                            oper   :"=",
                            value  :"true",
                            type   :"int",     
                        },
                        {
                            logical:"and",
                            field  :"varimedi_activo",
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

    //Evento Change del Control Select Variable
    $(document).on('change','#SelectVariable',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var r = $(this).text().split('|');
            barGraphDemandaGeneralDiaria.options.scales.yAxes[0].scaleLabel.labelString = r[3];
            barGraphDemandaGeneralDiaria.update();
            indexVar = $(this).val();
        }
    });

    //Evento Click del Control btnNuevo
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                cargarGrafico(true);
            }
        }    
    }); 
    
    //Evento Click para el Control BtnAgregar
    $(document).on('click','#btnAgregar',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                cargarGrafico(false);
            }
        }
    }) ;

    //Evento Click para el Control BtnBorrar
    $(document).on('click','#btnBorrar',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            graphDelete(barGraphDemandaGeneralDiaria);
        }
    });

    //Evento Click para el Boton BtnReset    
    $(document).on('click','#btnReset',function(event){
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            graphResetZoom(barGraphDemandaGeneralDiaria);  
        }  
    });

    //Evento Click para el Boton BtnGuardar    
    $(document).on('click','#btnGuardar',function(event){   
        if (paginaActiva.code == 11){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var canvas = graphTargetDemandaGeneralDiaria.get(0);
            canvas.toBlob(function(blob) {
                saveAs(blob, "%s.png".format('Variables_por_Medidor'));
            });
        }   
    }); 

    function cargarGrafico(borrar){
        animacion = true;
        
        if (borrar){
            graphDelete(barGraphDemandaGeneralDiaria);
            tbMedidores= new Object({fechas:[],Medidores:new Object()});
            /*for (var indexMedidor in tbMedidores.Medidores){
                delete tbMedidores.Medidores[indexMedidor];
            }*/


        }
        var scale = setXScale(moment($("#TextFechaInicial").val()),moment($("#TextFechaFinal").val()));
        var medidor = $("#SelectMedidor option:selected").text().split('|');
        var tipo = $('input:radio[name=tipo]:checked').val();
        var variable = $("#SelectVariable option:selected").text().split('|');
        var fechainicial = $("#TextFechaInicial").val();
        var fechafinal = $("#TextFechaFinal").val();
        if (updateTable(tbMedidores,"tabla",medidor,variable,tipo,$("#SelectMedidor").val(),$("#SelectVariable").val(),fechainicial,fechafinal) ){
            $("#container-loading").removeClass("hidden");
            if (!(reporte.activo)){
                barGraphDemandaGeneralDiaria.options.scales.xAxes[0].time.unit = scale.medida;
    
                graficoLinealJs2(
                    reporte,
                    barGraphDemandaGeneralDiaria,
                    {   
                        zero : !($("#SelectVariable option:selected").select2().data("zero") == 'f'),
                        titulo: "%s %s - Variable:%s - Fecha:%s - %s".format(medidor[1],tipo,variable[2],fechainicial,fechafinal),
                        fieldNameX:"fecha",
                        fieldNameY:"valor",
                        parseFecha: "YYYY-MM-DD HH:mm:ss",
                        queries:[{
                            fieldsSelect:["TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi') as fecha, (%s(valor)) as valor ".format(tipo)],
                            tableName   :"mediciones.consultar_medidor_variable(%s,%s,'%s','%s','%s') group by TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi')".format($("#SelectMedidor").val(),$("#SelectVariable").val(),fechainicial,fechafinal,database),
                            orderby:[{
                                field:"fecha",
                                type : "asc"
                            }],        
                        }],
                    },
                    {   
                        medidor:medidor,
                        variable: variable,
                        tipo:tipo,
                        fechainicial:fechainicial,
                        fechafinal:fechafinal,
                        medidores:tbMedidores,
                    }
                );
            }
            else {
                error("Grafico Solicitado, espere a que finalice la consulta");
            }
        }
        else{
            error("Busqueda ya graficada, no se admiten datos repetidos");  
        }
    }

    function updateTable(_Medidores,tablaName,medidor,variable,tipo,idmedidor,idvariable,fechainicial,fechafinal){
        var nombreMedidor  = medidor[0];
        var nombreVariable = variable[2]; 
        var unixfechainicial = moment(fechainicial, "YYYY-MM-DD hh:mm").valueOf();
        var unixfechafinal   = moment(fechafinal, "YYYY-MM-DD hh:mm").valueOf();
        var medidores = _Medidores.Medidores;
        var anexado = false;
        if (medidores['%s'.format(nombreMedidor)] === undefined){
            medidores['%s'.format(nombreMedidor)] = new Object();
            medidores['%s'.format(nombreMedidor)]['id'] = idmedidor;
            medidores['%s'.format(nombreMedidor)]['data'] = new Object();
            anexado = true;
        }
        if (medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)] === undefined){
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)] = new Object();
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['id'] = idvariable;
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data'] = new Object();
            anexado = true;
        }

        if (medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)] === undefined){
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)] = new Object();
            anexado = true;
        }
        if (medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)]['%s-%s'.format(unixfechainicial,unixfechafinal)] === undefined){
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)]['%s-%s'.format(unixfechainicial,unixfechafinal)] = new Object();
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)]['%s-%s'.format(unixfechainicial,unixfechafinal)]["fechainicial"] = fechainicial;
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)]['%s-%s'.format(unixfechainicial,unixfechafinal)]["fechafinal"] = fechafinal;
            medidores['%s'.format(nombreMedidor)]['data']['%s'.format(nombreVariable)]['data']['%s'.format(tipo)]['%s-%s'.format(unixfechainicial,unixfechafinal)]['valores'] = [];
            anexado = true; 
        }
        return anexado;

    }
});