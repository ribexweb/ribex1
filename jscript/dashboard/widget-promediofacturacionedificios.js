function PromedioFacturacion(widget,update=false,debug=false){
   if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var mesinicio = (!(update))?1:moment().format('M');
    var fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');
    $.ajax({
        url : page+"?promedio_x_facturacion_anual", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {
                    fieldsSelect:["*"],
                    tableName:"nuevas.getpromediofacturacionedificios(%s,%s,'%s')".format(usuarioActivo,widget.json[4],database),
                    orderby:[{field:'idedificio',type:'asc'},{field:'idcargo',type:'asc'}]
                }
            ]              
        },
        
        })
    .then(function(data) {
        widget.processing = false;
        if (!(update)){
            var edificios = filtrar(data[0].resultados,'nombre');
            var cargos = filtrar(data[0].resultados,'cargo');

            cargos.map(function(cargo,index){
                widget.barGraph.data.datasets.push({stack:'cargos',borderWidth: 1,label:cargo.cargo,borderColor: colores_ribex[index],backgroundColor:colores_ribex[index],data:[]});    ;
            });
            edificios.map(function(edificio,indexEd){
                widget.barGraph.data.labels.push(edificio.nombre);
                cargos = data[0].resultados.filter(function(cargo){return (cargo.idedificio==edificio.idedificio)});
                cargos.map(function(cargo,indexCar){
                    dataset = widget.barGraph.data.datasets.filter(function(dataset){return dataset.label==cargo.cargo});
                    dataset[0].data.push(parseFloat(cargo.promedio));
                });
            });

            var color = Chart.helpers.color;
            for (var i in widget.barGraph.data.datasets){
                widget.barGraph.data.datasets[i].backgroundColor = color(widget.barGraph.data.datasets[i].backgroundColor).alpha(0.5).rgbString();
            }


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

function dibujarWidgetPromedioFacturacion(idTablero,widget,update = false){
    if (!(update)){
        var titulo = '';
        if (widget.json[3] == "true"){
            titulo = (titulo == "")?widget.json[2]:"%s %s".format(titulo,widget.json[2]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Desglose Facturación 6 Meses Móviles</h5>'.format(widget.idwidget,widget.json[4])).appendTo(c);
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
                            stacked: true,
                            labelString: 'Pesos Chilenos (CLP)'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return (value/1000000).toLocaleString()+ ' MM';
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
                            o_value = (value/1000000).toLocaleString("es");
                            label = "%s: %s %s".format(data.datasets[tooltipItem.datasetIndex].label,o_value,' MM (CLP)');
                            return label; 
                        },
                    }
                },
                plugins:{
                    datalabels: {
						display: function(context) {
							return false;
						},
					},
                    labels:false,
                    /*[
                    {
                        render : function (args) {
                                    value = parseFloat(args.value);
                                    value = +(Math.round(value + "e+2")  + "e-2");
                                    o_value = (value/1000).toLocaleString("es")+' kWh';
                                    return (value>0)?o_value:"";    
                        },
                        position: 'outside',
                        FontSize: 14
                    }]*/
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
    PromedioFacturacion(widget,update);
}

    
        
            
            
                

