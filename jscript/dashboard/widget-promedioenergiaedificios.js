function PromedioEnergia(widget,update=false,debug=false){
   if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var mesinicio = (!(update))?1:moment().format('M');
    var fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');
    $.ajax({
        url : page+"?promedio_x_energia_anual", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {
                    fieldsSelect:["*"],
                    tableName:"nuevas.getpromedioenergiaedificios(%s,'%s',%s,'%s')".format(usuarioActivo,moment().format('YYYY-MM-DD'),6,database),
                    orderby:[{field:'idedificio',type:'asc'}]
                }
            ]              
        },
        
        })
    .then(function(data) {
        widget.processing = false;
        if (!(update)){

            widget.barGraph.data.datasets.push({borderWidth: 1,label:'Presupuestada',borderColor: widget.json[3],backgroundColor:widget.json[3],data:[]});    
            widget.barGraph.data.datasets.push({borderWidth: 1,label:'Real',borderColor: widget.json[4],backgroundColor:widget.json[4],data:[]});    

            


            data[0].resultados.map(function(element,index){
                widget.barGraph.data.labels.push(element.nombre);
                widget.barGraph.data.datasets[0].data.push(element.energia_presupuesto);    
                widget.barGraph.data.datasets[1].data.push(element.energia_real); 
            });

           /* var color = Chart.helpers.color;
            for (var i in widget.barGraph.data.datasets){
                widget.barGraph.data.datasets[i].backgroundColor = color(widget.barGraph.data.datasets[i].backgroundColor).alpha(0.5).rgbString();
            }*/
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

function dibujarWidgetPromedioEnergia(idTablero,widget,update = false){
    if (!(update)){
        var titulo = '';
        if (widget.json[1] == "true"){
            titulo = (titulo == "")?widget.json[0]:"%s %s".format(titulo,widget.json[0]);
        }

        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Promedio Energía 6 Meses Móviles</h5>'.format(widget.idwidget,widget.json[2])).appendTo(c);
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
                        scaleLabel: {
                            display: true,
                            //stacked: true,
                            labelString: 'Energía GWh'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return (value/1000000).toLocaleString();
                            }
                        }
                    }]
                },
                tooltips: { 
                    callbacks: {
                        label: function(tooltipItem, data) {
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = (value/1000000).toLocaleString("es");
                            return (value>0)?o_value+' GWh':""; 
                        },
                    }
                },
                plugins:{
                    datalabels: {
						display: function(context) {
							return false;
						},
					},
                    labels:[
                    {
                        render : function (args) {
                                    value = parseFloat(args.value);
                                    value = +(Math.round(value + "e+2")  + "e-2");
                                    o_value = (value/1000000).toLocaleString("es")+' GWh';
                                    return (value>0)?o_value:"";    
                        },
                        position: 'outside',
                        FontSize: 14
                    }]
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
    PromedioEnergia(widget,update);
}

    
        
            
            
                

