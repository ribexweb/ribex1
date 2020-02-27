function medidoresInactivos(widget,debug=false){
    widget.processing = true;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    $.ajax({
        url : page+"?inactivos", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   
                fieldsSelect:["idedificio,edif_nombre,cantidad as cuenta"],
                tableName:"control.medidores_inactivos(%s,%s,%s,'%s')".format(widget.json[0],widget.json[3],widget.idusuario,widget.database),
                where:[]
            }]              
        },
        })
    .then(function(data) {
        widget.processing = false;
        $("#medidoresInactValor%s".format(widget.idwidget)).html(data[0].resultados[0].cuenta);
        $("#medidoresInactNombre%s".format(widget.idwidget)).html(data[0].resultados[0].edif_nombre);
    })
    .done(function(xhr){
        var index = xhrPool.indexOf(xhr);
        if (index > -1) {
            xhrPool.splice(index, 1);
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
        $("#medidoresInactValor%s".format(widget.idwidget)).html('SC');
        $("#medidoresInactNombre%s".format(widget.idwidget)).html('SC');        
    });         
}

function dibujarWidgetMedidoresInactivos(idTablero,widget,update = false){
    if (!(update)){
        a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,3)).appendTo(idTablero);
        b = $('<button id="btnCloseWidget%s" data-id="%s" class="close closeWidget hidden" type="button" style="position:relative;z-index:10;">'.format(widget.idwidget,widget.idwidget)).appendTo(a);
        c = $('<i class="fa fa-window-close" style="color:#000 !important;">').appendTo(b);
        b = $('<button id="btnEditWidget%s" data-id="%s" data-tipo="%s" data-tipotexto="%s" class="close editWidget hidden" type="button" style="position:relative;z-index:10">'.format(widget.idwidget,widget.idwidget,widget.tipo,widget.tipotexto)).appendTo(a);
        c = $('<i class="fa fa-pencil-alt" style="color:#000 !important;">').appendTo(b);        
        b = $('     <div class="small-box" style="background-color:%s;color:%s">'.format(widget.json[2],widget.json[5])).appendTo(a);
        c = $('         <div class="inner">').appendTo(b);
            $('              <h3 id="medidoresInactValor%s">%s</h3>'.format(widget.idwidget,0)).appendTo(c);
            $('              <small id="medidoresInactNombre%s"></small></br>'.format(widget.idwidget)).appendTo(c);
            $('              <small>Medidores Inactivos</small></br>').appendTo(c);
            $('              <small>%s</small><p>'.format(widget.json[4])).appendTo(c);
        c = $('         <div class="icon">').appendTo(b);
            $('             <i class="fa fa-times-circle"></i>').appendTo(c);
            $('         <a href="#" class="small-box-footer">Más Información <i class="fa fa-arrow-circle-right"></i></a>').appendTo(b);
    }
    medidoresInactivos(widget);
}
