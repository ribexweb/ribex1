function FacturacionAnual(widget,update=false,debug=false){
    $("#titulo%s".format(widget.idwidget)).html("Desglose Facturación %s".format(moment().format('YYYY')));
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var mesinicio = (!(update))?1:moment().format('M');
    var fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');
    $.ajax({
        url : page+"?facturacion_anual", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                fieldsSelect:["*"],
                tableName:"control.facturacion_anual(%s,%s)".format(widget.json[0],moment().format('YYYY')),
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[
                    { 
                        field: 'mes',
                        type: 'asc',
                    },
                    {
                        field:'idcargo',
                        type:'asc'
                    }
                ]
            }]              
        },
        })
    .then(function(data) {
        widget.processing = false;
        if (!(update)){

            moment.monthsShort('es').map(function(element,index){
                if (index < moment().format('MM')){
                    widget.barGraph.data.labels.push(element);
                }
            });

            var mes = 0;
            data[0].resultados.map(function(element,index){

                if (mes != element.mes){
                    serieIndex = 0;
                    mes = element.mes;
                }
                if (widget.barGraph.data.datasets[serieIndex] === undefined){
                    widget.barGraph.data.datasets.push({fill:(widget.barGraph.data.datasets.length ==0)?'origin':'-1',borderWidth: 1,label:element.nombre,borderColor: colores_ribex[serieIndex+2],backgroundColor:colores_ribex[serieIndex+2],data:[]});    
                }
                widget.barGraph.data.datasets[serieIndex].data.push(parseFloat(element.total));
                serieIndex++;
            });

            //Limpiar si todos los cargos son ceros -> set null
            if (widget.barGraph.data.datasets.length > 0) { 
                widget.barGraph.data.datasets[0].data.map(function(element,index){
                    var zerox = false;
                    widget.barGraph.data.datasets.map(function(element,index2){
                        zerox = zerox || (element.data[index] > 0);
                    });
                    if (!zerox){
                        widget.barGraph.data.datasets.map(function(element,index2){
                            element.data[index] = null;
                        });                       
                    }
                });
            }

            var color = Chart.helpers.color;
            for (var i in widget.barGraph.data.datasets){
                widget.barGraph.data.datasets[i].backgroundColor = color(widget.barGraph.data.datasets[i].backgroundColor).alpha(0.5).rgbString();
            }
        }
 /*       if (!(update)){
            moment.monthsShort('es').map(function(element,index){
                widget.barGraph.data.labels.push(element);
            });
            console.log(data[1].resultados);
            for (series=0;series<parseInt(data[0].resultados[0].maximo)-1;series++){
                cargos = data[1].resultados.filter(function (cargos) {
                            return parseInt(cargos.rank) === series+1;
                        });
                console.log(series);
                console.log(cargos);
                seriesName = (cargos.length > 0)?cargos[0].nombre:"serie%s".format(series);        
                widget.barGraph.data.datasets.push({stack: 'cargos',borderWidth: 1,label:seriesName,borderColor: colores_ribex[series],backgroundColor:colores_ribex[series],data:cargos.map(function(cargo){return parseFloat(cargo.total);})});

            }

            var color = Chart.helpers.color;
            for (var i in widget.barGraph.data.datasets){
                widget.barGraph.data.datasets[i].backgroundColor = color(widget.barGraph.data.datasets[i].backgroundColor).alpha(0.5).rgbString();
           }

        }
        else{

        }


   

        
        //widget.barGraph.options.scales.yAxes[0].ticks.suggestedMax = Math.max(Math.max.apply(null, data[0].resultados.map(function(datos){return parseFloat(datos.energia);})),Math.max.apply(data[1].resultados.map(function(datos){return parseFloat(datos.consumo);})))+1000;           
        */
       $("#medidorDia%s".format(widget.idwidget)).html(widget.json[1]); 
        widget.barGraph.update();
        $("#container-loading-%s".format(widget.idwidget)).addClass("hidden");
    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    });         
}

function dibujarWidgetFacturacionAnual(idTablero,widget,update = false){
    if (!(update)){
        var titulo = '';
        if (widget.json[5] == "true"){
            titulo = widget.json[1];
        }
        if (widget.json[6] == "true"){
            titulo = (titulo == "")?widget.json[4]:"%s %s".format(titulo,widget.json[4]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Desglose Facturación </h5>'.format(widget.idwidget)).appendTo(c);
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
        j = $("                   <div id='container-loading-%s' class='hidden text-center' style='position:absolute;top:0px;left:5px;width:100%;height:100%;background-color:rgba(255,255,255,0.6);'>".format(widget.idwidget)).appendTo(i);
        
        $("#container-loading-%s".format(widget.idwidget)).html(graphLoading());
        widget.graphTarget = $("#graph%s".format(widget.idwidget));
        Chart.defaults.global.defaultFontColor = 'black';
        widget.image = new Image();
        widget.image.src = "images/ribe50x50.png";
        widget.image.width = 120;
        widget.image.height= 30; 
        widget.barGraph = new Chart(widget.graphTarget, {
            type: 'line',
            data: null,
            options: {
                elements:{
                    point:{
                        radius:3,
                    },
                },
                responsive: true,
                title:{
                    display:false,
                    text:""
                },
                scales: {
                    yAxes: [{
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Pesos Chilenos (CLP)'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return (value/1000000).toFixed(0)+ ' MM';
                            }
                        }
                    }]
                },
                tooltips: { 
                    mode: 'index',
                    callbacks: {
                        label: function(tooltipItem, data) {

                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = (value/1000000).toFixed(2)+ ' MM';
                            label = "%s: %s %s".format(data.datasets[tooltipItem.datasetIndex].label,o_value,' CLP');
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
                    //position: "back",
                }, 
            }
        });
    }
    FacturacionAnual(widget,update);
}

    
        
            
            
                

