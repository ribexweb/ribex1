function EnergiaAnual(widget, update = false, debug = false) {
    $("#titulo%s".format(widget.idwidget)).html("Energía Presupuestada vs Real %s".format(moment().format('YYYY')));
    if (!(update)) {
        $("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    widget.processing = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page = (debug !== undefined) ? ((debug) ? "php/getData2debug.php" : "php/data.php") : "includes/data.php";
    var mesinicio = (!(update)) ? 1 : moment().format('M');
    var fecha = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD 23:59:59');
    $.ajax({
        url: page + "?energia_anual", // Use href attribute as URL
        beforeSend: function (xhr) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data: {
            queries: [
                {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                    fieldsSelect: ["*"],
                    tableName: "mediciones.presupuestos",
                    // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                    orderby: [
                        {
                            field: 'mes',
                            type: 'asc',
                        }
                    ],
                    where: [{
                        field: 'idmedidor',
                        oper: '=',
                        value: widget.json[0],
                        type: 'int'
                    }, {
                        logical: "and",
                        field: "ano",
                        oper: '=',
                        value: (parseInt(moment().format('MM')) > 1) ? parseInt(moment().format('YYYY')) : parseInt(moment().format('YYYY')) - 1,
                        type: 'int'
                    }]
                },
                {
                    fieldsSelect: ["*"],
                    tableName: "mediciones.energia_anual(%s,%s,%s,'%s','%s')".format(widget.json[0], widget.idusuario, mesinicio, fecha, widget.database),
                    orderby: [{ field: 'mes', type: 'asc' }]
                }
            ]
        },
    })
        .then(function (data) {
            widget.processing = false;
            if (!(update)) {
                moment.monthsShort('es').map(function (element, index) {
                    if (parseInt(moment().format('MM')) > 1){
                        if (index < moment().format('MM')) {
                            widget.barGraph.data.labels.push(element);
                        }
                    }
                    else{
                        widget.barGraph.data.labels.push(element);
                    }
                });

                if (data[1].resultados.length > 0) {
                    widget.barGraph.data.datasets.push({ borderWidth: 3, label: 'Real', borderColor: widget.json[5], backgroundColor: widget.json[5], data: data[1].resultados.map(function (datos) { return parseFloat(datos.consumo); }) });
                }
                if (data[0].resultados.length > 0) {
                    var presupuesto = data[0].resultados.map(function (datos) {
                        if ((parseInt(datos.mes) <= parseInt(moment().format('MM'))) || (parseInt(moment().format('MM')) == 1)) {
                            return parseFloat(datos.energia);
                        }
                        else {
                            return null;
                        }
                    });
                    widget.barGraph.data.datasets.push({ borderWidth: 3, label: 'Presupuestado', borderColor: widget.json[4], backgroundColor: widget.json[4], data: presupuesto });
                }
            }
            else {
                data[0].resultados.map(function (element, index) {
                    if (element.energia != widget.barGraph.data.datasets[1].data[index]) {
                        widget.barGraph.data.datasets[1].data[index] = element.energia;
                    }
                });
                if (widget.barGraph.data.datasets[0].data[data[1].resultados[0].mes - 1] === undefined) {
                    widget.barGraph.data.datasets[0].data.push(data[1].resultados[0].consumo);
                }
                else {
                    if (widget.barGraph.data.datasets[0].data[widget.barGraph.data.datasets[0].data.length - 1] != data[1].resultados[0].consumo) {
                        widget.barGraph.data.datasets[0].data[widget.barGraph.data.datasets[0].data.length - 1] = data[1].resultados[0].consumo;
                    }
                }
            }




            widget.barGraph.options.scales.yAxes[0].ticks.suggestedMax = Math.max(Math.max.apply(null, data[0].resultados.map(function (datos) { return parseFloat(datos.energia); })), Math.max.apply(data[1].resultados.map(function (datos) { return parseFloat(datos.consumo); }))) + 1000;
            widget.barGraph.update();
            $("#container-loading-%s".format(widget.idwidget)).addClass("hidden");
        })
        .done(function (xhr) {
            var index = xhrPool.indexOf(xhr);
            if (index > -1) {
                xhrPool.splice(index, 1);
            }
        });
}

function dibujarWidgetEnergiaAnual(idTablero, widget, update = false) {
    if (!(update)) {
        var titulo = '';
        if (widget.json[9] == "true") {
            titulo = widget.json[7];
        }
        if (widget.json[10] == "true") {
            titulo = (titulo == "") ? widget.json[2] : "%s %s".format(titulo, widget.json[2]);
        }
        if (widget.json[11] == "true") {
            titulo = (titulo == "") ? widget.json[1] : "%s %s".format(titulo, widget.json[1]);
        }
        if (widget.json[12] == "true") {
            titulo = (titulo == "") ? widget.json[3] : "%s %s".format(titulo, widget.json[3]);
        }
        if (widget.json[13] == "true") {
            titulo = (titulo == "") ? widget.json[8] : "%s %s".format(titulo, widget.json[8]);
        }
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget, widget.tamano)).appendTo(idTablero);
        b = $('     <div class="box box-info">').appendTo(a);
        c = $('         <div class="box-header with-border">').appendTo(b);
        d = $('             <h5 id="titulo%s" class="box-title">Energía Presupuestada vs Real</h5>'.format(widget.idwidget)).appendTo(c);
        e = $('             <div id="medidorDia%s" class="text-muted font-weight-bold">%s</div>'.format(widget.idwidget, titulo)).appendTo(c);
        f = $('             <div class="box-tools pull-right">').appendTo(c);
        g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseDia%s" aria-controls="collapseDia%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget, widget.idwidget)).appendTo(f);
        g = $('                     <button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget, widget.idwidget, widget.tipo, widget.tipotexto)).appendTo(f);
        h = $('                          <i class="fa fa-pencil-alt">').appendTo(g);
        g = $('                     <button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget, widget.idwidget)).appendTo(f);
        h = $('                          <i class="fa fa-window-close">').appendTo(g);
        g = $('                     <button id="btnGuardarXLS%s" data-id="%s" data-tippy-content="Tooltip" class="close downloadWidgetXLS" type="button">'.format(widget.idwidget, widget.idwidget)).appendTo(f);
        h = $('                          <i class="fa fa-table">').appendTo(g);
        g = $('                     <button id="btnGuardar%s" data-id="%s" class="close downloadWidget" type="button">'.format(widget.idwidget, widget.idwidget)).appendTo(f);
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
        widget.image.height = 30;
        widget.barGraph = new Chart(widget.graphTarget, {
            type: 'line',
            data: null,
            options: {
                elements: {
                    point: {
                        radius: 3,
                    },
                },
                responsive: true,
                title: {
                    display: false,
                    text: ""
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Energia kWh'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                return (value / 1000).toFixed(0) + ' M';
                            }
                        }
                    }]
                },
                tooltips: {
                    mode: 'index',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2") + "e-2");
                            o_value = value.toLocaleString("es");
                            label = "%s: %s %s".format(data.datasets[tooltipItem.datasetIndex].label, o_value, ' kWh');
                            //return (value>0)?o_value+' CLP':""; 
                            return label;
                            //return (value>0)?o_value+' kW':""; 
                        },
                    }
                },
                plugins: {
                    datalabels: {
                        display: function (context) {
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
                }
            }
        });
    }
    EnergiaAnual(widget, update);
}







