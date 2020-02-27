var Datos = null;
function PotenciaMMA(widget,update=false,debug=false){
    $("#titulo%s".format(widget.idwidget)).html("Potencias Máx, Mín y Prom Últimos 30 Días");
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = false;
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
                tableName:"nuevas.getPotenciasMaxMinAvg(%s,%s,now()::timestamp,%s,%s,'%s')".format(widget.json[0],widget.idusuario,30,2,widget.database),
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[
                    { 
                        field: 'hora',
                        type: 'asc',
                    }
                ]
            }]              
        },
        })
    .then(function(data) {
        console.log(data);
        widget.processing = false;
        Datos = data[0].resultados;
        if (!(update)){
           widget.barGraph.data.labels = data[0].resultados.map(function(registro){return registro.hora});
           widget.barGraph.data.datasets.push({fill:false,borderWidth: 2,label:'Mínimo',borderColor: widget.json[5],backgroundColor:widget.json[5],data:data[0].resultados.map(function(registro){return registro.min})});      
           widget.barGraph.data.datasets.push({fill:false,borderWidth: 2,label:'Promedio',borderColor: widget.json[6],backgroundColor:widget.json[6],data:data[0].resultados.map(function(registro){return registro.prom})});    
           widget.barGraph.data.datasets.push({fill:false,borderWidth: 2,label:'Máximo',borderColor: widget.json[4],backgroundColor:widget.json[4],data:data[0].resultados.map(function(registro){return registro.max})});  

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
       $("#medidorDia%s".format(widget.idwidget)).html("%s %s %s".format(widget.json[2],widget.json[3],widget.json[8])); 
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

function dibujarWidgetPotenciaMMA(idTablero,widget,update = false){
    if (!(update)){
        var titulo = '';
        if (widget.json[10] == "true"){
            titulo = widget.json[8];
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
        if (widget.json[14] == "true"){
            titulo = (titulo == "")?widget.json[9]:"%s %s".format(titulo,widget.json[9]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Potencias Máx, Mín y Prom Últimos 30 Días</h5>'.format(widget.idwidget)).appendTo(c);
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
                        //stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Potencia Kw'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value.toLocaleString();
                            }
                        }
                    }],
                    xAxes: [{
                        //stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Horas del Día'
                        },
                    }]

                },
                tooltips: { 
                    mode: 'index',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            console.log(tooltipItem);
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = value.toLocaleString("es");
                            valor = '';
                            switch (tooltipItem.datasetIndex) {
                                case 2: valor = '%s Kw %s'.format(o_value,Datos[tooltipItem.index].maxfecha);break;
                                case 1: valor = '%s kW'.format(o_value);break;
                                case 0: valor = '%s kW %s'.format(o_value,Datos[tooltipItem.index].minfecha);break;
                            }
                            return valor;
                        },
                    }
                },
                plugins:{
                    labels:false,
                    datalabels: {
                        rotation:-90,
						display: function(context) {
							return false;
                        },
                        formatter: (value, ctx) => {
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = value.toLocaleString("es");
                            return o_value + ' kWh';
                        },
                    },
                }  
            }
        });
    }
    PotenciaMMA(widget,update);
}

    
        
            
            
                

