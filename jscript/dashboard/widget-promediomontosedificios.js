function PromedioMontos(widget,update=false,debug=false){
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var mesinicio = (!(update))?1:moment().format('M');
    var fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');
    $.ajax({
        url : page+"?promedio_x_montos", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {
                    fieldsSelect:["*"],
                    tableName:"nuevas.getpromediomontosedificios(%s,'%s',%s,'%s')".format(usuarioActivo,moment().format('YYYY-MM-DD'),widget.json[2],database),
                    orderby:[]
                }
            ]              
        },
        
        })
    .then(function(data) {

        widget.processing = false;
        if (!(update)){

            widget.barGraph.data.datasets.push({borderWidth: 1,label:widget.json[7],borderColor: widget.json[3],backgroundColor:widget.json[3],data:[]});    
            widget.barGraph.data.datasets.push({stack:'stack',borderWidth: 1,label:widget.json[8],borderColor: widget.json[4],backgroundColor:widget.json[4],data:[]});    
            widget.barGraph.data.datasets.push({stack:'stack',borderWidth: 1,label:widget.json[9],borderColor: widget.json[5],backgroundColor:widget.json[5],data:[]});    


            data[0].resultados.map(function(element,index){
                widget.barGraph.data.labels.push(element.nombre);
                widget.barGraph.data.datasets[0].data.push(element.facturacion);    
                widget.barGraph.data.datasets[1].data.push(element.remarcacion); 
                widget.barGraph.data.datasets[2].data.push(element.gastocomun);
            });

        }
        else{

        }
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



function dibujarWidgetPromedioMontos(idTablero,widget,update = false){
    if (!(update)){
        var titulo = '';
        if (widget.json[1] == "true"){
            titulo = (titulo == "")?widget.json[0]:"%s %s".format(titulo,widget.json[0]);
        }

        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Recuperos Energía 6 Meses Móviles</h5>'.format(widget.idwidget)).appendTo(c);
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
            type: 'bar',
            data: null,
            options: {
                responsive: true,
                title:{
                    display:false,
                    text:""
                },
                legend:{
                    display:true,
                },
                scales: {
                    yAxes: [{
                        stacked:true,
                        scaleLabel: {
                            display: true,
                            labelString: 'kWh / mts2'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return (value/1000000).toLocaleString()+ ' MM';
                            }
                        }
                    }],
                    xAxes: [{
                        //categoryPercentage: 1.0,
                        barPercentage: 1.0
                    }]
                },
                tooltips: { 
                    mode:'index',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var o_perc = '';
                            if ((tooltipItem.datasetIndex == 1) || (tooltipItem.datasetIndex == 2)){
                                var value = parseFloat(tooltipItem.yLabel);
                                var total = value + parseFloat(data.datasets[(tooltipItem.datasetIndex==1)?2:1].data[tooltipItem.index]);
                                var perc = (total>0)?Math.round(value/total*100,2):0;
                                o_perc = perc.toLocaleString("es");    
                            }
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = (value/1000000).toFixed(2) + ' MM';
                            var valueLabel = (value>0)?o_value+' CLP ':"";
                            var percLabel =  (o_perc != '')?o_perc+" %":"";
                            return valueLabel+percLabel; 
                        },
                    }
                },  
                plugins:{
                    labels:false,
                    datalabels: {
						color: 'black',
						display: function(context) {
                            return (((context.datasetIndex == 1) || (context.datasetIndex == 2))
                                    && (context.dataset.data[context.dataIndex] > 0) 
                                   );
						},
                        //rotation:-90,
                        defaultFontSize:14,
						formatter: (value, ctx) => {
                            let percentaje = 0;
                            if (ctx.chart.data.datasets[0].data[ctx.dataIndex] > 0) {
                                percentage = Math.round(value*100 / ctx.chart.data.datasets[0].data[ctx.dataIndex])+"%";
                            }
                            else{
                                percentage = 100+'%';
                            } 
                            return percentage;
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
    PromedioMontos(widget,update);
}

    
        
            
            
                

