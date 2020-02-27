function potenciaDia(widget,update=false,debug=false){
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var hoy = (widget.ultimafecha === undefined)?moment().subtract(1,'days').format('YYYY/MM/DD 23:57:00'):moment(widget.ultimafecha,'YYYY/MM/DD HH:mm:ss').add(4,'minutes').format('YYYY/MM/DD HH:mm:ss');
    $.ajax({
        url : page+"?potencia_dia", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            /*queries:[
                {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                fieldsSelect:["TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi') as fecha, avg(valor) as valor "],
                tableName:"mediciones.consultar_medidor_potencia(%s,'%s',now()::timestamp,'%s') group by TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi')".format(widget.json[0],hoy,widget.database),
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[
                    { 
                    field: 'fecha',
                    type: 'asc',
                    }
                ],
                },
                {
                fieldsSelect:["TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi') as fecha, avg(valor) as valor "],
                tableName   :"mediciones.consultar_medidor_potencia(%s,'%s','%s','%s') group by TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi')".format(widget.json[0],moment().subtract(1,'days').format('YYYY/MM/DD 00:00:00'),
                    moment().subtract(1,'days').format('YYYY/MM/DD 23:59:59'),widget.database),
                orderby :[{ 
                    field: 'fecha',
                    type: 'asc',
                    }
                ],
                },
            ] */   
            queries:[
                {
                    fieldsSelect:["*"],
                    tableName:"nuevas.getPotencia(%s,%s,%s,'%s',now()::timestamp,%s,'%s')".format(widget.json[0],widget.json[0],widget.idusuario,hoy,widget.json[8],widget.database),
                    orderby:[{field:"fecha",type:"asc"}]
                },
                {
                    fieldsSelect:["*"],
                    tableName:"nuevas.getPotencia(%s,%s,%s,'%s','%s',%s,'%s')".format(widget.json[0],widget.json[0],widget.idusuario,moment().subtract(2,'days').format('YYYY/MM/DD 23:55:00'),moment().subtract(1,'days').format('YYYY/MM/DD 23:45:45'),widget.json[8],widget.database),
                    orderby:[{field:"fecha",type:"asc"}]
                },{
                    fieldsSelect:["horainicial","horafinal"],
                    tableName:"mediciones.vmedidores left join mediciones.regiones using (idregion)"+
                              "left join mediciones.periodos using (idregion)"+
                              "where idmedidor=%s".format(widget.json[0]),
                }
            ]          
        },
        })
    .then(function(data) {
        widget.processing = false;

        if (!(update)){
            widget.barGraph.data.datasets.push({label:"Hoy",data:[],borderColor:widget.json[4],backgroundColor:widget.json[4],borderWidth:1,fill:true});
            widget.barGraph.data.datasets.push({label:"Ayer",data:[],borderColor:widget.json[5],backgroundColor:widget.json[5],borderWidth:1,fill:true});
            //$("#medidorDia%s".format(widget.idwidget)).html("%s %s".format(widget.json[2],widget.json[3]));  
            if (widget.json[14]=="true") {
                widget.barGraph.options.annotation.annotations.push({
                    drawTime: "afterDatasetsDraw",
                    id: "lineProteccion",
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value: widget.json[15],
                    borderColor: "rgba(90,0,0, 0.2)",
                    borderWidth: 2,  
                    label: {
                        position:'top',
                        backgroundColor: "white",
                        content: "Protección %s kW".format(widget.json[15]),
                        enabled: true,
                        fontColor: "#000",
                        fontStyle: "normal",
                        fontSize:15,
                      },                  
                });    
            }
        }

        var cambioDia = ((data[0].resultados.length > 0) && ((widget.barGraph.data.datasets[0].data.length == 0) || (data[0].resultados[0].fecha.split(' ')[0] != widget.primerDia))); 
        //console.log('cambio de dia:'+cambioDia);

        if ((cambioDia)) {
            widget.barGraph.data.datasets[0].data = [];
            widget.barGraph.data.datasets[1].data = [];
            widget.primerDia = (data[0].resultados.length != 0)?data[0].resultados[0].fecha.split(' ')[0]:"";
            data[1].resultados.map(function(element,index){
                widget.barGraph.data.datasets[1].data.push({
                    x:element.fecha.split(" ")[1],
                    y:element.valor
                });
            });
        }
        
        data[0].resultados.map(function(element,index){
            //console.log('%s-%s-%s'.format(widget.json[0],element.fecha,element.valor));
            widget.barGraph.data.datasets[0].data.push({
                x:element.fecha.split(" ")[1],
                y:element.valor
            });
            if (data[0].resultados.length-1 == index){
                widget.ultimafecha = element.fecha;
            }
        });

       /* var arrDatos = [];
        if (medidor.ultimafecha == null){
            medidor.barGraphConsumoDia.data.datasets.push({
                label: "Hoy",
                data: [],
                borderColor: medidor.backgroundcolortoday,
                backgroundColor: medidor.backgroundcolortoday,
                borderWidth: 1,
                fill:true
            });
            medidor.barGraphConsumoDia.data.datasets.push({
                label: "Ayer",
                data: [],
                borderColor: medidor.backgroundcoloryesterday,
                backgroundColor: medidor.backgroundcoloryesterday,
                borderWidth: 1,
                fill:true
            });                         
            for (var dataIndex in data[0].resultados){
                medidor.barGraphConsumoDia.data.datasets[0].data.push({x:data[0].resultados[dataIndex].fecha.split(" ")[1],
                                                    y:data[0].resultados[dataIndex].valor});
            }  

        }  

        $("#medidorDia%s".format(medidor.idwidget)).html(data[2].resultados[0].codigo+' '+data[2].resultados[0].cons_nombre+' '+data[2].resultados[0].espa_nombre);  
        for (var dataIndex in data[1].resultados){
            medidor.barGraphConsumoDia.data.datasets[1].data.push({x:data[1].resultados[dataIndex].fecha.split(" ")[1],
                                                y:data[1].resultados[dataIndex].valor});
        }  
        widget.ultimafecha = (data[0].resultados.length > 0)?data[0].resultados[data[0].resultados.length-1].fecha:hoy;             */
        widget.barGraph.options.scales.xAxes[0].time.parser = 'HH:mm:ss'; 

        if (data[2].resultados[0].horainicial !== undefined){
            widget.barGraph.options.annotation.annotations[0].xMin = data[2].resultados[0].horainicial;
        }
        if (data[2].resultados[0].horafinal !== undefined){
            widget.barGraph.options.annotation.annotations[0].xMax = data[2].resultados[0].horafinal;
        }

        widget.barGraph.update();
        $("#container-loading-%s".format(widget.idwidget)).addClass("hidden");
        //console.log(widget.ultimafecha);

    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    });         
}

function dibujarWidgetPotenciaDia(idTablero,widget,update=false){
    if (!(update)){
        var titulo = '';
        if (widget.json[10] == "true"){
            titulo = widget.json[7];
        }
        if (widget.json[11] == "true"){
            titulo = (titulo == "")?widget.json[2]:"%s %s".format(titulo,widget.json[2]);
        }
        if (widget.json[12] == "true"){
            titulo = (titulo == "")?widget.json[1]:"%s %s".format(titulo,widget.json[1]);
        }
        if (widget.json[13] == "true"){
            titulo = (titulo == "")?widget.json[3]:"%s %s".format(titulo,widget.json[3]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h3 class="box-title small">Potencia del dia</h3>').appendTo(c);
        e = $('             <div id="medidorDia%s" class="text-muted font-weight-bold">%s</div>'.format(widget.idwidget,titulo)).appendTo(c);
        f = $('             <div class="box-tools pull-right">').appendTo(c);
        g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseDia%s" aria-controls="collapseDia%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        g = $('                     <button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(f);
        h = $('                          <i class="fa fa-pencil-alt">').appendTo(g);
        g = $('                     <button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        h = $('                          <i class="fa fa-window-close">').appendTo(g);
        h = $('         <div id="collapseDia%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idwidget)).appendTo(b);
        i = $('             <div class="chart">').appendTo(h);
        j = $('                 <canvas id="graph%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(widget.idwidget)).appendTo(i);
        //j = $('                 <div id="container-loading-%s" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">'.format(widget.idwidget)).appendTo(i);
        //h = $('                     <div id="loading-%s" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">'.format(widget.idwidget)).appendTo(j);
        j = $("                   <div id='container-loading-%s' class='hidden text-center' style='position:absolute;top:0px;left:5px;width:100%;height:100%;background-color:rgba(255,255,255,0.6);'>".format(widget.idwidget)).appendTo(i);
        
        $("#container-loading-%s".format(widget.idwidget)).html(graphLoading());
        //Chart.defaults.global.defaultFontStyle = 'bold';
        Chart.defaults.global.defaultFontColor = 'black';
        widget.image = new Image();
        widget.image.src = "images/ribe50x50.png";
        widget.image.width = 120;
        widget.image.height= 30; 
        widget.graphTarget = $("#graph%s".format(widget.idwidget));
        widget.barGraph = new Chart(widget.graphTarget, {
            type: 'line',
            data: [],
            options: {
                elements:{
                    point:{
                        radius:0,
                    },
                },
                responsive: true,
                title:{
                    display:false,
                    text:""
                },
                scales: {
                    xAxes: [{
                        type: "time",
                        time: {
                            unit:'hour',
                            stepSize:1,
                            displayFormats: {
                                hour: 'HH'
                            }
                        },
                        scaleLabel: {
                            display: true,
                        },
                        ticks: {
                            maxRotation: 90,
                            minRotation: 90,
                            autoSkip:false,
                        }
                    }, ],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Potencia kW'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value.toLocaleString();
                            }
                        }
                    }]
                },
                tooltips: { 
                    mode:'index',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = value.toLocaleString("es");
                            label = "%s: %s %s".format(data.datasets[tooltipItem.datasetIndex].label,o_value,' kW');
                            //return (value>0)?o_value+' CLP':""; 
                            return label;
                        },
                    }
                },
                plugins:{
                    datalabels: {
						display: function(context) {
							return false;
						},
					}                    
                },
                watermark: {
                    image: widget.image,
                    //width: 108,
                    //height: 39,
                    opacity: 0.3,
                    alignX: "right",
                    alignY: "top",
                    alignToChartArea: false,
                    //position: "back",
                }, 
				annotation: {
                    annotations:[{
                        id:'box0',
						type: 'box',
						xScaleID: 'x-axis-0',
						yScaleID: 'y-axis-0',
						xMin: "18:00:00",
						xMax: "23:00:00",
						//yMin: 0,
						//yMax: 100,
						backgroundColor: 'rgba(90,0,0, 0.1)',
						borderColor: 'rgba(90,0,0, 0.2)',
                        borderWidth: 1,                      
                    },{
                        drawTime: "afterDatasetsDraw",
                        id: "hline",
                        type: "line",
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: '20:30:00',
                        borderColor: "transparent",
                        borderWidth: 1,
                        label: {
                          position:'top',
                          backgroundColor: "transparent",
                          content: "Horario Punta",
                          enabled: true,
                          fontColor: "#000",
                          fontStyle: "normal",
                          fontSize:15,
                        },

                    }]
				}
            }
        });
    }
    potenciaDia(widget,update);
}

    
        
            
            
                

