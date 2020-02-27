
function MontoAnual(widget,update=false,debug=false){
    //console.log(moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59'))
    if (widget.json[2] == "monto"){
        $("#titulo%s".format(widget.idwidget)).html("Monto Presupuestado Anual %s".format(moment().format('YYYY')));
    }
    else{
        $("#titulo%s".format(widget.idwidget)).html("Energía Presupuestada Anual %s".format(moment().format('YYYY')));    
    }    
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var mesinicio = (!(update))?1:moment().format('M');
    var fecha = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD 23:59:59');


    $.ajax({
        url : page+"?monto_anual", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   
                fieldsSelect:["*"],
                tableName:"nuevas.resumenMensualGeneral(%s)".format(widget.json[0]),
                orderby:[{field:"mes",type:"asc"}],
                where:[{
                    field:"ano",
                    oper:"=",
                    value:moment().format('YYYY'),
                    type:"int"
                }]
            }]              
        },
    })
    .then(function(data) {
        if (!(update)){
            moment.monthsShort('es').map(function(element,index){
                if (index < moment().format('MM')){
                    widget.barGraph.data.labels.push(element);
                }
            });
            //var tipo = (false)?"monto":"energia";
            //porcentaje de iva
            var iva = ((widget.json[12]=="true")&&(widget.json[2]=="monto"))?1.19:1.0;
            
            //barra de facturacion 
            widget.barGraph.data.datasets.push({type:'bar',borderWidth: 1,label:widget.json[7],borderColor: widget.json[3],backgroundColor:widget.json[3],data:[]});
            //barra de remarcacion
            widget.barGraph.data.datasets.push({stack: 'real',type:'bar',borderWidth: 1,label:widget.json[8],borderColor: widget.json[4],backgroundColor:widget.json[4],data:[]});
            //barra de gasto comun
            widget.barGraph.data.datasets.push({stack: 'real',type:'bar',borderWidth: 1,label:widget.json[9],borderColor: widget.json[5],backgroundColor:widget.json[5],data:[]});
            //linea de presupuesto
            widget.barGraph.data.datasets.push({type:'line',fill:false,borderWidth: 2,label:widget.json[10],borderColor: widget.json[6],backgroundColor:widget.json[6],data:[]});
            data[0].resultados.map(function(element,index){
                widget.barGraph.data.datasets[0].data.push(Math.round(parseFloat(element["factura_%s".format(widget.json[2])])*iva));
                widget.barGraph.data.datasets[1].data.push(Math.round(parseFloat(element["remarcacion_%s".format(widget.json[2])])*iva));
                widget.barGraph.data.datasets[2].data.push(Math.round(parseFloat(element["gastocomun_%s".format(widget.json[2])])*iva));
                widget.barGraph.data.datasets[3].data.push(Math.round(parseFloat(element["presupuesto_%s".format(widget.json[2])])*iva));
            });
        }

        widget.processing = false;

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
function dibujarWidgetMontoAnual(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div id="container-widget-%s" class="container-widget col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Presupuesto Anual</h5>'.format(widget.idwidget)).appendTo(c);
        e = $('             <div id="medidorDia%s" class="text-muted font-weight-bold">%s</div>'.format(widget.idwidget,widget.json[1])).appendTo(c);
        f = $('             <div class="box-tools pull-right">').appendTo(c);
        g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseDia%s" aria-controls="collapseDia%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        g = $('                     <button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(f);
        h = $('                          <i class="fa fa-pencil-alt">').appendTo(g);
        g = $('                     <button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        h = $('                          <i class="fa fa-window-close">').appendTo(g);
        g = $('                     <button id="btnGuardarXLS%s" data-id="%s" data-tippy-content="Tooltip" class="close downloadWidgetXLS" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(f);                                    
        h = $('                          <i class="fa fa-table">').appendTo(g);
        g = $('                     <button id="btnGuardarPNG%s" data-id="%s" data-tippy-content="Tooltip" class="close downloadWidgetPNG" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(f);                                    
        h = $('                          <i class="fa fa-download">').appendTo(g);
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
            type:'bar',
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
                        scaleLabel: {
                            display: true,
                            stacked: true,
                            labelString: (widget.json[2] == "monto")?'Pesos Chilenos (CLP)':'Energia (MWh)'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                var divisor = (widget.json[2] == "monto")?1000000:1000;
                                var escala = (widget.json[2] == "monto")?' MM':' MWh';
                                return (value/divisor).toFixed(1)+escala;
                            }
                        }
                    }]
                },
                plugins:{
                    labels:false,
                    datalabels: {
						color: 'black',
						display: function(context) {
                            return (((context.datasetIndex == 1) || (context.datasetIndex == 2))
                                    && (context.dataset.data[context.dataIndex] > 0) && (widget.json[11] == "true")
                                   );
						},
                        rotation:-90,
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
                    /*labels: [
                        {
                            render : function (args) {
                                if (args.dataset.stack !== undefined){
                                    if ((widget.facturas[args.index] > 0) && (args.value > 0)) {
                                        console.log(widget.facturas);
                                        return Math.round((args.value/widget.facturas[args.index])*100)+'%';
                                    }
                                }
                            },
                            position: 'inside'
                        }]*/
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
                            var divisor = (widget.json[2] == "monto")?1000000:1000;
                            var escala = (widget.json[2] == "monto")?' MM':'';
                            var unidad = (widget.json[2] == "monto")?' CLP':' MWh';
                            o_value = (value/divisor).toFixed(0) + escala;
                            var valueLabel = (value>0)?o_value+unidad:"";
                            var percLabel =  (o_perc != '')?o_perc+" %":"";
                            return valueLabel+' '+percLabel; 
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
    MontoAnual(widget,update);
}

function makeQueries(widget){
    var a = [];

    if (parseInt(widget.json[0]) != -1){     //FACTURAS
        a.push({
            fieldsSelect:["extract(month from fecha)::integer as mes","totalneto"],
            tableName:"remarcacion.vgruposfacturas",
            orderby:[{
                field:"extract(month from fecha)::integer",
                type:"asc"
            }],
            where:[{
                field:"extract(year from fecha)",
                oper:"=",
                value:moment().format('YYYY'),
                type:"int"
            },{
                logical:"and",
                field:"idedificio",
                oper:"=",
                value:widget.json[0],
                type:"int"
            }
            ]
        });
    }
    if (parseInt(widget.json[2]) != -1){ //TIENDAS O LOCALES
        a.push({
            fieldsSelect:["extract(month from fecha)::integer as mes","sum(total) as total"],
            tableName:"remarcacion.vremarcacionesasignaciones",
            orderby:[{
                field:"extract(month from fecha)::integer",
                type:"asc"
            }],
            where:[{
                field:"extract(year from fecha)",
                oper:"=",
                value:moment().format('YYYY'),
                type:"int"
            },{
                logical:"and",
                field:"idmedidor",
                oper:"in",
                value:"(select * from nuevas.getListMedidores(%s))".format(widget.json[2]),
                type:"int"    
            },{
                logical:"and",
                field:"idedificio",
                oper:"=",
                value:widget.json[0],
                type:"int"    
            }],
            groupby:["extract(month from fecha)"]             
        });
    }
    if (widget.json[5] === 'false'){ //SI GASTO COMUN ES POR MEDIDOR
        if (parseInt(widget.json[3]) != -1){  //SI HAY MEDIDOR DE GASTO COMUN
            a.push({
                fieldsSelect:["extract(month from fecha)::integer as mes","total"],
                tableName:"remarcacion.vremarcacionesasignaciones",
                orderby:[{
                    field:"extract(month from fecha)::integer",
                    type:"asc"
                }],
                where:[{
                    field:"extract(year from fecha)",
                    oper:"=",
                    value:moment().format('YYYY'),
                    type:"int"
                },{
                    logical:"and",
                    field:"idmedidor",
                    oper:"=",
                    value:widget.json[3],
                    type:"int"    
                }]
            });
        }
    }
    if (parseInt(widget.json[4]) != -1){ //SI HAY MEDIDOR DE PRESUPUESTO
        a.push({
            fieldsSelect:["*"],
            tableName:"mediciones.presupuestos",
            // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
            orderby :[
                { 
                field: 'mes',
                type: 'asc',
                }
            ],
            where:[{
                field:'idmedidor',
                oper:'=',
                value:widget.json[4],
                type:'int'
            },{
                logical:"and",
                field:"ano",
                oper:"=",
                value:moment().format('YYYY'),
                type:"int"
            }]
        });
    }
    return a;
}

function calcularStackedPerc(args){
    if ((!(isNaN(args.value))) && (!(isNaN(args.percentage))) && (args.dataset.stack !== undefined)){
        console.log(facturas);    
    }
    return 0;
}

    
        
            
            
                

