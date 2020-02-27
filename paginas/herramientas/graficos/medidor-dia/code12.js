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

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    //Evento Click para el Control BtnBorrar
    $(document).on('click','#btnBorrar',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            graphDelete(barGraphDemandaGeneralDiaria);
            tbMedidores= new Object({fechas:[],Medidores:new Object()});
        }
    });

    //Evento Click para el Boton BtnReset    
    $(document).on('click','#btnReset',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            graphResetZoom(barGraphDemandaGeneralDiaria); 
        }   
    });

    //Evento Click para el Boton BtnGuardar    
    $(document).on('click','#btnGuardar',function(event){    
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var canvas = graphTargetDemandaGeneralDiaria.get(0);
            canvas.toBlob(function(blob) {
                saveAs(blob, "%s.png".format('Variables_por_Dia'));
            });
        }   
    }); 

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                cargar_grafico(true);
            }
        }
    });    

    $(document).on('click','#btnAgregar',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                cargar_grafico(false);
            }
        }
    });

    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 12){
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

    $(document).on('change','#SelectMedidor',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if ($("#SelectMedidor").val() != -1) {
            // barGraphDemandaGeneralDiaria.options.watermark.image.src = "images/graph/logo%s.png".format($("#SelectEdificio").val());
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
                            tableName   :"mediciones.variables_permitidas(%s)".format($("#SelectMedidor").val()),
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
                            },
                            {
                                logical:"and",
                                field  :"idvariable",
                                oper   :"in",
                                value  :"(2,23,305)",
                                type   :"int",  
                            }]        
                        }],
                    },
                    {
                    }    
                );
            }
        }
    });

    //Evento Change del Control Select Variable
    $(document).on('change','#SelectVariable',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            indexVar = $(this).val();
        }
    });

    $(document).on('change','#chkTemperatura',function(event){
        if (paginaActiva.code == 12){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if ($(this).is(":checked")){
                addYEscala(barGraphDemandaGeneralDiaria,"right","y-axis-2","Temperatura");   
            }
            else{
                deleteYEscala(barGraphDemandaGeneralDiaria,1);
            }
            barGraphDemandaGeneralDiaria.update();
        }
    });

    function cargar_grafico(delPrevious){   
        animacion = true;
       
        if (delPrevious){
            graphDelete(barGraphDemandaGeneralDiaria);
            tbMedidores.fechas.length = 0;
            for (var indexMedidor in tbMedidores.Medidores){
                delete tbMedidores.Medidores[indexMedidor];
            }
        } 
        var medidor = $("#SelectMedidor option:selected").text().split('|');
        var tipo = $('input:radio[name=tipo]:checked').val();
        var variable = $("#SelectVariable option:selected").text().split('|');
        var fecha = $("#TextFecha").val();
        var fechainicial = "%s 00:00:00".format(fecha);
        var fechafinal = "%s 23:59:59".format(fecha);
        if (updateTable(tbMedidores,"tabla",medidor,variable,tipo,$("#SelectMedidor").val(),$("#SelectVariable").val(),fechainicial,fechafinal) ){
            $("#container-loading").removeClass("hidden"); 
            if (!(reporte.activo)){
                graficoLinealJs2(
                    reporte,
                    barGraphDemandaGeneralDiaria,
                    {   zero : !($("#SelectVariable option:selected").select2().data("zero") == 'f'),
                        titulo: "%s %s - Variable:%s - Fecha:%s".format(medidor[1],tipo,variable[2],fecha),
                        temperatura: { 
                            show: $("#chkTemperatura").is(":checked"),
                            idedificio:$("#SelectEdificio").val()
                        },    
                        fieldNameX:"tfecha",
                        fieldNameY:"valor",
                        parseFecha:"HH:mm:ss",
                        queries:[{
                            fieldsSelect:["TO_TIMESTAMP(CONCAT(extract(hour from fecha)::text,':',extract(minute from fecha)::text),'HH24:mi')::time as tfecha,(%s(valor)) as valor".format(tipo)],
                            tableName   :"mediciones.consultar_medidor_demanda(%s,%s,'%s','%s') group by TO_TIMESTAMP(CONCAT(extract(hour from fecha)::text,':',extract(minute from fecha)::text),'HH24:mi')".format(
                                            $("#SelectMedidor").val(),
                                            $("#SelectVariable").val(),
                                            fecha,
                                            database),
                            orderby:[{
                                field:"tfecha",
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
    
    function addYEscala(Graph,position,id,label){
        var Escala = {
                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: position,
                id: id,
                scaleLabel: {
                    display:     true,
                    labelString: label
                },
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, values) {
                        return value.toLocaleString();
                    },
                },
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                }    
        };
        Graph.options.scales.yAxes.push(Escala);
    }

    function deleteYEscala(Graph,index){
        Graph.options.scales.yAxes.splice(index,1);
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