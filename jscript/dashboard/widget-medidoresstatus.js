

function medidoresStatus(widget,update=false,debug=false){
    widget.processing = true;
    if (!(update)){
        //$("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    $.ajax({
        url : page+"?status", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   
                fieldsSelect:["*"],
                tableName:"control.medidores_status(%s,%s,%s,'%s')".format(widget.json[0],widget.json[4],widget.idusuario,widget.database),
                //fieldsSelect:["'Prueba' as edif_nombre","floor(random() * 10 + 1)::int as activos","floor(random() * 10 + 1)::int as inactivos"],
                //tableName:"(select 1) as foo",
                where:[]
            }]              
        },
        })
    .then(function(data) {
        widget.processing = false;
        widget.gauge.refresh(widget.gauge.originalValue, parseInt(data[0].resultados[0].activos)+parseInt(data[0].resultados[0].inactivos));
        widget.gauge.refresh(Math.round(parseInt(data[0].resultados[0].activos)));
        widget.gauge.txtLabel.attrs.text = 'hola';
        /*if (data[0].resultados.length > 0) {
            if (!(update)){
                widget.barGraph.data.datasets.push({labels:[],data:[],backgroundColor:[]});
                widget.barGraph.data.datasets[0].labels.push('Con\nComunicación');
                widget.barGraph.data.datasets[0].labels.push('Sin\nComunicación');
                widget.barGraph.data.datasets[0].data.push(data[0].resultados[0].activos);
                widget.barGraph.data.datasets[0].data.push(data[0].resultados[0].inactivos);
                widget.barGraph.data.datasets[0].backgroundColor.push(widget.json[2]);
                widget.barGraph.data.datasets[0].backgroundColor.push(widget.json[3]);
                widget.barGraph.data.datasets[0].borderWidth = 2;
            }
            else{
                widget.barGraph.data.datasets[0].data[0] = data[0].resultados[0].activos;
                widget.barGraph.data.datasets[0].data[1] = data[0].resultados[0].inactivos;
            }
            widget.barGraph.update();
        }
        else{

        }
        $("#container-loading-%s".format(widget.idwidget)).addClass("hidden");*/
    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
       console.log('error');
    });         
}

function dibujarWidgetMedidoresStatus2(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div class="col-lg-3 col-xs-6">').appendTo(idTablero);
        b = $('     <div class="small-box bg-green">').appendTo(a);
        c = $("         <div class='col col-md-12 text-center new-header'>").appendTo(b);
            $("             <h4 id='medidoresEdificio%s'></h4>".format(widget.idwidget)).appendTo(c);
            $("             <small id='medidoresServicio%s'>%s</small>".format(widget.idwidget,widget.servicio)).appendTo(c);
        c = $('         <div class="col col-md-6 bg-green">').appendTo(b);
        d = $('             <div class="inner">').appendTo(c);
            $('                 <h3 id="medidoresActValor%s">0</h3>'.format(widget.idwidget)).appendTo(d);
            $('                 <small>Medidores con Comunicación</small><br>').appendTo(d);
        d = $('             <div class="new-icon">').appendTo(d);
            $('                 <i class="fa fa-check-circle"></i>').appendTo(d);
        c = $('         <div class="col col-md-6 bg-red">').appendTo(b);
        d = $('             <div class="inner">').appendTo(c);
            $('                 <h3 id="medidoresInactValor%s">0</h3>'.format(widget.idwidget)).appendTo(d);
            $('                 <small>Medidores sin Comunicación</small><br>').appendTo(d);
        d = $('             <div class="new-icon">').appendTo(d);
            $('                 <i class="fa fa-times-circle"></i>').appendTo(d);
        c = $("         <div class='col col-md-12 text-center new-footer'>").appendTo(b);
        d = $("                 <a id='widgetStatus' data-idedificio='%s' data-idservicio='%s' href='#'>Más Información </a>".format(widget.idedificio,widget.idservicio)).appendTo(c);
            $("                     <i class='fa fa-arrow-circle-right'></i>").appendTo(d);
    }
    medidoresStatus(widget);
}

function dibujarWidgetMedidoresStatus(idTablero,widget,update = false){

    
    if (!(update)){
        a = $('<div id="container-widget-%s" class="col col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('<button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(a);
        b = $('<i class="fa fa-window-close">').appendTo(b);
        b = $('<button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(a);
        b = $('<i class="fa fa-pencil-alt">').appendTo(b);
        b = $('<div id="gauge%s" class="gauge">'.format(widget.idwidget)).appendTo(a);
        //b = $('     <div class="box box-info">').appendTo(a);
        //c = $('         <div class="box-header with-border">').appendTo(b);
        //d = $('             <h3 class="box-title">Estado de Medidores</h3>').appendTo(c);
        //e = $('             <div id="Informacion%s" class="small text-muted"></div>'.format(widget.idwidget)).appendTo(c);
        //f = $('             <div class="box-tools pull-right">').appendTo(c);
        //g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseDia%s" aria-controls="collapseDia%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        //h = $('         <div id="collapseDia%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idwidget)).appendTo(b);
        //i = $('             <div class="chart">').appendTo(h);
       //  i = $('             <div id="gauge%s" class="text-center gauge">'.format(widget.idwidget)).appendTo(a);
        //j = $('                 <canvas id="graph%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(widget.idwidget)).appendTo(i);
        //j = $('                 <div id="container-loading-%s" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">'.format(widget.idwidget)).appendTo(i);
        //h = $('                     <div id="loading-%s" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">'.format(widget.idwidget)).appendTo(j);
        //$("#loading-%s".format(widget.idwidget)).html(graphLoading());
        var titulo = "";
        if ((widget.json[6]=="true") && (widget.json[7]=="true")){
            titulo = "%s\n%s".format(widget.json[1],widget.json[5]);
        }
        else if (widget.json[6]=="true"){
            titulo = widget.json[1];
        }
        else if (widget.json[7]=="true"){
            titulo = widget.json[5];
        }
        widget.gauge = new JustGage({
            id: "gauge%s".format(widget.idwidget),
            title: titulo,
            value: 0,
            min: 0,
            max: 100,
            valueMinFontSize:10,
            relativeGaugeSize: true,
            label: "Comunicando",
            gaugeColor: widget.json[3],
            levelColors: [widget.json[2]],
            //textRenderer: customValue
          });
        /*widget.graphTarget = $("#graph%s".format(widget.idwidget));
        
        widget.barGraph = new Chart(widget.graphTarget, {
            type: "doughnut",
            data: [],
            options:{
                //maintainAspectRatio: false,
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI,
                responsive:true,
                cutoutPercentage: 40,
                legend: {
                    display: false
                },
                title: {
                    display: false,
                },
                tooltips: {
                    enabled: false
                },
                plugins:{
                    labels:[
                    {
                        render : function (args) {
                                    value = parseFloat(args.value);
                                    value = +(Math.round(value + "e+2")  + "e-2");
                                    o_value = value.toLocaleString("es");
                            return (args.dataset.labels[args.index] !==undefined)?args.dataset.labels[args.index]+'\n'+o_value:o_value;},
                        position: 'outside',
                        fontStyle: 'bold'
                    }],
                }
            }

        });*/
    }

    

    medidoresStatus(widget,update);
}

