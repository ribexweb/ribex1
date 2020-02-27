function UltimosConsumosDinero(widget,update=false,debug=false){
    widget.processing = true;
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
//    var hoy = (medidor.ultimafecha == null)?moment().format('YYYY/MM/DD 00:00:00'):moment(medidor.ultimafecha,'YYYY/MM/DD HH:mm:ss').add(1,'seconds').format('YYYY/MM/DD HH:mm:ss');
    $.ajax({
        url : page+"?consumos_montos", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                fieldsSelect:["*"],
                tableName:"control.UltimosConsumosDinero(%s,%s,now()::timestamp)".format(widget.json[0],widget.json[4]),
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[
                    { 
                        field: 'ano',
                        type: 'asc',
                    },
                    {
                        field:'mes',
                        type:'asc'
                    }
                ],
                },
            ]              
        },
        })
    .then(function(data) {

        widget.processing = false;

        if (!(update)){
            widget.barGraph.data.labels = [];
            widget.barGraph.data.datasets.push({data:[],backgroundColor:widget.json[5],borderColor:widget.json[5]});
        }
        else{
            if (widget.barGraph.data.labels[widget.barGraph.data.labels.length-1] != data[0].resultados[data[0].resultados.length-1].nombremes){
               widget.barGraph.data.labels.shift();
               widget.barGraph.data.labels.push(data[0].resultados[ddata[0].resultados.length-1].nombremes);
               widget.barGraph.data.datasets[0].data.shift();
               widget.barGraph.data.datasets[0].data.push(0);
            }
        }


        data[0].resultados.map(function(element,index){
            if (!(update)){
                widget.barGraph.data.labels.push(element.nombremes);
                widget.barGraph.data.datasets[0].data.push(element.monto);
            }
            else {
                if (element.monto != widget.barGraph.data.datasets[0].data[index]){
                    widget.barGraph.data.datasets[0].data[index] = element.monto;
                }
            }
        });


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
function dibujarWidgetUltimosDinero(idTablero,widget,update=false){
    if (!(update)){
        var titulo = '';
        if (widget.json[8] == "true"){
            titulo = widget.json[7];
        }
        if (widget.json[9] == "true"){
            titulo = (titulo == "")?widget.json[2]:"%s %s".format(titulo,widget.json[2]);
        }
        if (widget.json[10] == "true"){
            titulo = (titulo == "")?widget.json[1]:"%s %s".format(titulo,widget.json[1]);
        }
        if (widget.json[11] == "true"){
            titulo = (titulo == "")?widget.json[3]:"%s %s".format(titulo,widget.json[3]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-success">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h3 class="box-title">Últimas Boletas Generadas</h3>').appendTo(c);
        e = $('             <div id="medidorUltimos%s" class="text-muted">%s</div>'.format(widget.idwidget,titulo)).appendTo(c);
        f = $('             <div class="box-tools pull-right">').appendTo(c);
        g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseUltimos%s" aria-controls="collapseUltimos%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        g = $('                     <button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(f);
        h = $('                          <i class="fa fa-pencil-alt">').appendTo(g);
        g = $('                     <button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        h = $('                          <i class="fa fa-window-close">').appendTo(g);
        h = $('         <div id="collapseUltimos%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idwidget)).appendTo(b);
        i = $('             <div class="chart">').appendTo(h);
        j = $('                 <canvas id="graph%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(widget.idwidget)).appendTo(i);
        j = $("                   <div id='container-loading-%s' class='hidden text-center' style='position:absolute;top:0px;left:5px;width:100%;height:100%;background-color:rgba(255,255,255,0.6);'>".format(widget.idwidget)).appendTo(i);
        
        $("#container-loading-%s".format(widget.idwidget)).html(graphLoading());
       widget.graphTarget = $("#graph%s".format(widget.idwidget));
        Chart.defaults.global.defaultFontColor = 'black';
        widget.barGraph= new Chart(widget.graphTarget, {
            type: 'bar',
            data: null,
            options: {
                responsive: true,
                legend: {
                    display:false,
                    position: 'top',
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Pesos CLP'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value.toLocaleString();
                            }
                        }
                    }]
                },
                plugins:{
                   /* labels:[
                    {
                        render : function (args) {

                                    value = parseFloat(args.value);
                                    value = +(Math.round(value + "e+2")  + "e-2");
                                    o_value = value.toLocaleString("es");
                                    return (value>0)?o_value+' CLP':"";    
                        },
                        position: 'outside'
                    }]*/
                    labels:false,
                    datalabels: {
                        rotation:-90,
						display: function(context) {
							return false;
                        },
                        formatter: (value, ctx) => {
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = value.toLocaleString("es");
                            return o_value + ' CLP';
                        },
					},
                },
                tooltips: { 
                    callbacks: {
                        label: function(tooltipItem, data) {
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2")  + "e-2");
                            o_value = value.toLocaleString("es");
                            return (value>0)?o_value+' CLP':""; 
                        },
                    }
                } 
            }
        });
    }
    UltimosConsumosDinero(widget,update);
}