function potenciaActual(widget,debug=false){
    widget.processing = true;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    $.ajax({
        url : page+"?potencia_actual", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[{   
                fieldsSelect:["*"],
                tableName:"mediciones.consultar_valor_medidor_where(%s,23,'fecha','<=',now()::text,2,'%s')".format(widget.json[0],widget.database),
            }]              
        },
        })
    .then(function(data) {
        widget.processing = false;
        $("#PotenciaActualValor%s".format(widget.idwidget)).html("%s kW".format(Math.round(data[0].resultados[0].valor)));
    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
        $("#PotenciaActualValor%s".format(widget.idwidget)).html('SC');      
    });           
}

function dibujarWidgetPotenciaActual(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,3)).appendTo(idTablero);
        b = $('<button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button" style="position:relative;z-index:10;">'.format(widget.idwidget,widget.idwidget)).appendTo(a);
        c = $('<i class="fa fa-window-close" style="color:#000 !important;">').appendTo(b);
        b = $('<button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button" style="position:relative;z-index:10">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(a);
        c = $('<i class="fa fa-pencil-alt" style="color:#000 !important;">').appendTo(b);        
        b = $('     <div class="small-box" style="background-color:%s;color:%s">'.format(widget.json[4],widget.json[7])).appendTo(a);
        c = $('         <div class="inner">').appendTo(b);
            $('              <h3 id="PotenciaActualValor%s">%s</h3>'.format(widget.idwidget,0)).appendTo(c);
            $('              <small>%s %s</small></br>'.format((widget.json[10]=="true")?widget.json[1]:"",(widget.json[8]=="true")?widget.json[6]:"")).appendTo(c);        
            $('              <small>%s %s</small></br>'.format((widget.json[9]=="true")?widget.json[2]:"",(widget.json[11]=="true")?widget.json[3]:"")).appendTo(c);
            $('              <small>Potencia Actual</h5><p>').appendTo(c);
        c = $('         <div class="icon">').appendTo(b);
            $('             <i class="fa fa-bolt"></i>').appendTo(c);
            $('         <a href="#" class="small-box-footer">Más Información <i class="fa fa-arrow-circle-right"></i></a>').appendTo(b);
    }
    potenciaActual(widget);
}
