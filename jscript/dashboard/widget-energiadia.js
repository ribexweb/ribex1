var fechainicial = moment().format('YYYY/MM/01 00:00:00');
var fechafinal   = moment().format('YYYY/MM/DD HH:mm:ss');
var diff = 0;
function energiaDia(widget,update=false,debug=false){
    $("#titulo%s".format(widget.idwidget)).html("Energía Acumulada %s".format(moment.months('es')[parseInt(moment().format('M'))-1]));
    if (!(update)){
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    //var hoy = (medidor.ultimafecha == null)?moment().format('YYYY/MM/DD 00:00:00'):moment(medidor.ultimafecha,'YYYY/MM/DD HH:mm:ss').add(1,'seconds').format('YYYY/MM/DD HH:mm:ss');
    var mesinicial = moment().format('MM');
    var mesfinal   = moment().subtract(1,'days').format('MM');
    if (mesinicial != mesfinal) {
        fechainicial = moment().format('YYYY/%s/01 00:00:00'.format(mesfinal));
        $("#titulo%s".format(widget.idwidget)).html("Energía Acumulada %s".format(moment.months('es')[parseInt(moment().format('M'))-2]));
    }
    else {
        var fechainicial = moment().format('YYYY/MM/01 00:00:00');
        $("#titulo%s".format(widget.idwidget)).html("Energía Acumulada %s".format(moment.months('es')[parseInt(moment().format('M'))-1]));
    }
    var fechafinal   = moment().subtract(1,'days').format('YYYY/MM/DD 23:59:59');

    $.ajax({
        url : page+"?energia_dia", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                fieldsSelect:["energia.*","vmedidores.codigo","vmedidores.descripcion","vmedidores.espa_nombre","vmedidores.cons_nombre"],
                tableName:"control.energia_rango(%s,%s,'%s','%s','%s') as energia left join mediciones.vmedidores using (idmedidor)".format(widget.json[0],widget.idusuario,fechainicial,fechafinal,widget.database),
                // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                orderby :[/*{field:'energia.consumo',type:'desc'}*/],
                }
            ]              
        },
        })
    .then(function(data) {
        $("#medidorDia%s".format(widget.idwidget)).html("%s (%s kWh)".format(widget.titulo,parseFloat(data[0].resultados[0].consumo).toLocaleString("es")));
        widget.processing = false;
        if (!(update)){
            widget.barGraph.data.datasets.push({labels:[],data:[],backgroundColor:[]});
        }

        if (data[0].resultados.length > 2) {
            var otros = 0;
            data[0].resultados.map(function(element,index){
                if ((index > 0) && (element.consumo > 0)){
                    if ((((element.consumo/data[0].resultados[0].consumo*100)>parseFloat(widget.json[9])) || (data[0].resultados.length < parseInt(widget.json[8])))) {
                        if (!(update)){
                            var label = '';
                            if (element.idmedidor != -1){
                                if (widget.json[11] == "true"){
                                    label = (element.cons_nombre!=null)?'\n'+element.cons_nombre:(element.descripcion!=null)?'\n'+element.descripcion:''
                                }
                                if (widget.json[13] == "true"){
                                    label = (label == "")?element.espa_nombre:"%s\n%s".format(label,element.espa_nombre);
                                }
                            }
                            else{
                                label = '%s\n%s'.format(widget.json[10],widget.json[12]);
                            }
                                widget.barGraph.data.datasets[0].labels.push(label);
                                widget.barGraph.data.datasets[0].data.push(element.consumo);
                                widget.barGraph.data.datasets[0].backgroundColor = colores_ribex;
                                widget.barGraph.data.datasets[0].borderWidth = 2;
                            

                        }
                        else{
                            widget.barGraph.data.datasets[0].data[index-1] = element.consumo;
                        }
                    }
                    else {
                        otros += parseFloat(element.consumo);
                    }    
                }
            });
            if (otros > 0) {
                if (!(update)) {
                    widget.barGraph.data.datasets[0].data.push(otros);
                    widget.barGraph.data.datasets[0].labels.push('Otros');
                }
                else{
                    widget.barGraph.data.datasets[0].data[widget.barGraph.data.datasets[0].data.length-1] = otros;
                }    
            }
        }
        else if (data[0].resultados.length == 2){
            if (!(update)){
                widget.barGraph.data.datasets[0].labels.push("%s".format(data[0].resultados[0].codigo));
                widget.barGraph.data.datasets[0].data.push(data[0].resultados[0].consumo);
                widget.barGraph.data.datasets[0].backgroundColor = colores_ribex;
                widget.barGraph.data.datasets[0].borderWidth = 2;
            }
            else {
                widget.barGraph.data.datasets[0].data[0] = data[0].resultados[0].consumo;
            }
        }

        var color = Chart.helpers.color;
        for (var i in widget.barGraph.data.datasets[0].backgroundColor){
            widget.barGraph.data.datasets[0].backgroundColor[i] = color(widget.barGraph.data.datasets[0].backgroundColor[i]).alpha(0.5).rgbString();
        }
        if (widget.barGraph.data.datasets[0].data.length > 5) {
            widget.barGraph.options.plugins.labels = [{
                render : function (args) {return args.percentage+"%";},
                fontStyle: 'normal',
                fontSize:12,
            },{
                render: function (args) {//return +(Math.round(args.value + "e+2")  + "e-2").toLocaleString("es")+ ' kWh';
                                            return args.dataset.labels[args.index];
                                        },
                position:'outside',
                fontStyle: 'normal',
                fontSize:12,
            }];



        }
        widget.barGraph.options.tooltips = {
            callbacks: {
                label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var index = tooltipItem.index;
                    value = parseFloat(dataset.data[index]);
                    value = +(Math.round(value + "e+2")  + "e-2");
                    o_value = value.toLocaleString("es");
                    return dataset.labels[index] + ': ' + o_value +' kWh'+'\n Prom:'+Math.round(value/diff,2)+' kWh/Día';
                }
            }
        };
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

function dibujarWidgetEnergiaDia(idTablero,widget,update = false){
    fechainicial = moment().format('YYYY/MM/01 00:00');
    fechafinal   = moment().format('YYYY/MM/DD HH:mm');
    diff = (moment().diff(moment().startOf('month'),'hour')/24);
    if (!(update)){
        widget.titulo = '';
        if (widget.json[15] == "true"){
            widget.titulo = widget.json[7];
        }
        if (widget.json[16] == "true"){
            widget.titulo = (widget.titulo == "")?widget.json[2]:"%s %s".format(widget.titulo,widget.json[2]);
        }
        if (widget.json[17] == "true"){
            widget.titulo = (widget.titulo == "")?widget.json[1]:"%s %s".format(widget.titulo,widget.json[1]);
        }
        if (widget.json[18] == "true"){
            widget.titulo = (widget.titulo == "")?widget.json[3]:"%s %s".format(widget.titulo,widget.json[3]);
        }
        if (widget.json[19] == "true"){
            widget.titulo = (widget.titulo == "")?widget.json[14]:"%s %s".format(widget.titulo,widget.json[14]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h3 id="titulo%s" class="box-title small">Energía Acumulada </h3>'.format(widget.idwidget)).appendTo(c);
        e = $('             <div id="medidorDia%s" class="text-muted font-weight-bold">%s</div>'.format(widget.idwidget,widget.titulo)).appendTo(c);
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
            type: "doughnut",
            data: null,
            options:{
                responsive:true,
                title: {
                    display: true,
                    text: ''
                },
                tooltips: {
                    enabled: false
                },
                plugins:{
                    datalabels: {
						display: function(context) {
							return false;
                        },
					},
                    labels:[{
                        render : function (args) {return args.percentage+"%";},
                        fontStyle: 'normal',
                        fontSize:14,
                    },
                    {
                        render : function (args) {
                                    value = parseFloat(args.value);
                                    value = +(Math.round(value + "e+2")  + "e-2");
                                    o_value = value.toLocaleString("es");
                            //return args.dataset.labels[args.index]+'\n'+o_value+' kWh' +'\n Prom:' + +Math.round(value/diff,2)+' kWh/Día';},
                            return args.dataset.labels[args.index];},
                        position: 'outside',
                        fontStyle: 'normal',
                        fontSize:14,
                    }]
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
            }
        });
    }



    energiaDia(widget,update);
}