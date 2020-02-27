function ultimaActualizacion(widget,debug=false){
    widget.processing = true;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    $.ajax({
        url : page+"?ultima_actualizacion", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[{   
                fieldsSelect:["fecha::date as fecha,fecha::time as hora,nombre"],
                tableName:"control.ultimaActualizacion(%s,'%s')".format(widget.json[0],widget.database),
            }]              
        },
        })
    .then(function(data) {
        //console.log(data);
        widget.processing = false;
        $("#UltimaActValor%s".format(widget.idwidget)).html(data[0].resultados[0].hora);
        $("#UltimaActNombre%s".format(widget.idwidget)).html(data[0].resultados[0].nombre);
        $("#UltimaActHora%s".format(widget.idwidget)).html("%s".format(data[0].resultados[0].fecha));
    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
        $("#UltimaActValor%s".format(widget.idwidget)).html('SC');
        $("#UltimaActNombre%s".format(widget.idwidget)).html('SC'); 
        $("#UltimaActHora%s".format(widget.idwidget)).html('SC');        
    });           
}

function dibujarWidgetUltimaActualizacion(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,3)).appendTo(idTablero);
        b = $('<button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button" style="position:relative;z-index:10;">'.format(widget.idwidget,widget.idwidget)).appendTo(a);
        c = $('<i class="fa fa-window-close" style="color:#000 !important;">').appendTo(b);
        b = $('<button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button" style="position:relative;z-index:10">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(a);
        c = $('<i class="fa fa-pencil-alt" style="color:#000 !important;">').appendTo(b);        
        b = $('     <div class="small-box" style="background-color:%s;color:%s">'.format(widget.json[2],widget.json[3])).appendTo(a);
        c = $('         <div class="inner">').appendTo(b);
            $('              <h3 id="UltimaActValor%s">%s</h3>'.format(widget.idwidget,0)).appendTo(c);
            $('              <small id="UltimaActNombre%s"></small></br>'.format(widget.idwidget)).appendTo(c);
            $('              <small id="UltimaActHora%s"></small></br>'.format(widget.idwidget)).appendTo(c);
            $('              <small>Ultima Actualización</small><p>').appendTo(c);
        c = $('         <div class="icon">').appendTo(b);
            $('             <i class="fa fa-clock"></i>').appendTo(c);
            $('         <a href="#" class="small-box-footer">Más Información <i class="fa fa-arrow-circle-right"></i></a>').appendTo(b);
    }
    ultimaActualizacion(widget);
}
