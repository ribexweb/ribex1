

function PotenciaMaxima(widget,update=false,debug=false){
    widget.processing = true;
    if (!(update)){
        //$("#container-loading-%s".format(widget.idwidget)).removeClass("hidden");
    }
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    $.ajax({
        url : page+"?potenciaMaxima", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[{   
                fieldsSelect:["coalesce(valor,0) as valor"],
                tableName:"mediciones.consultar_valor_medidor_where(%s,%s,'fecha','<=',now()::text,2,'%s')".format(widget.json[0],widget.json[15],widget.database),
            }]               
        },
        })
    .then(function(data) {
        widget.processing = false;
        widget.gauge.refresh(Math.round(data[0].resultados[0].valor));
        //widget.gauge.refresh(9999);
        //$("#container-loading-%s".format(widget.idwidget)).addClass("hidden");
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

function dibujarWidgetPotenciaMaxima(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
        b = $('<button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget)).appendTo(a);
        b = $('<i class="fa fa-window-close">').appendTo(b);
        b = $('<button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(a);
        b = $('<i class="fa fa-pencil-alt">').appendTo(b);
        a = $('<div id="gauge%s" class="gauge">'.format(widget.idwidget)).appendTo(a);
        //b = $('     <div class="box box-info">').appendTo(a);
        //c = $('         <div class="box-header with-border">').appendTo(b);
        //d = $('             <h3 class="box-title">Estado de Medidores</h3>').appendTo(c);
        //e = $('             <div id="Informacion%s" class="small text-muted"></div>'.format(widget.idwidget)).appendTo(c);
        //f = $('             <div class="box-tools pull-right">').appendTo(c);
        //g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseDia%s" aria-controls="collapseDia%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
        //h = $('         <div id="collapseDia%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idwidget)).appendTo(b);
        //i = $('             <div class="chart">').appendTo(h);
        //i = $('             <div id="gauge%s" class="text-center gauge">'.format(widget.idwidget)).appendTo(a);
        //j = $('                 <canvas id="graph%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(widget.idwidget)).appendTo(i);
        //j = $('                 <div id="container-loading-%s" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">'.format(widget.idwidget)).appendTo(i);
        //h = $('                     <div id="loading-%s" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">'.format(widget.idwidget)).appendTo(j);
        $("#loading-%s".format(widget.idwidget)).html(graphLoading());
        var titulo = "";
        if (widget.json[10] == "true"){
            titulo = widget.json[7];
        }
        if (widget.json[11] == "true"){
            titulo = (titulo == "")?widget.json[1]:"%s\n%s".format(titulo,widget.json[1]);
        }
        if (widget.json[12] == "true"){
            titulo = (titulo == "")?widget.json[2]:"%s\n%s".format(titulo,widget.json[2]);
        }
        if (widget.json[13] == "true"){
            titulo = (titulo == "")?widget.json[3]:"%s\n%s".format(titulo,widget.json[3]);
        }
        if (widget.json[14] == "true"){
            titulo = (titulo == "")?widget.json[9]:"%s\n%s".format(titulo,widget.json[9]);
        }

        widget.gauge = new JustGage({
            id: "gauge%s".format(widget.idwidget),
            title: titulo,
            value: 0,
            min: 0,
            max: parseFloat(widget.json[8]),
            relativeGaugeSize: true,
            label: "Potencia Actual",
            symbol: ' kW',
            pointer: true,
            pointerOptions: {
                toplength: -15,
                bottomlength: 8,
                bottomwidth: 4,
                color: '#000000',
                stroke: '#ffffff',
                stroke_width: 1,
                stroke_linecap: 'round'
            },
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

    

    PotenciaMaxima(widget,update);
}

function customValue(val){
    return "%s kW".format(val);
}

