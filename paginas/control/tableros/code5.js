blog[paginaActiva.code].comments = blog[paginaActiva.code].comments || {};
blog[paginaActiva.code].comments.debugMode = false;

blog[paginaActiva.code].isFirstLoad = function(namesp, jsFile) {
	var isFirst = namesp.firstLoad === undefined;
	namesp.firstLoad = false;
	
	if (!isFirst) {
		console.log(
			"Warning: Javascript file is included twice: " + 
				jsFile);
	}
	return isFirst;
};

$( document ).ready(function() {



    cargar_tableros(tableros,widgets,usuarioActivo);

    timers.push(setInterval(function() {
        actualizarWidgets();
    },300000));

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }  

    $(document).on('click','#priorDashboard',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            dashboardActual(tableros,(tableros.actual == 0)?tableros.resultados.length-1:tableros.actual-1,widgets);
        }
    });
    
    $(document).on('click','#nextDashboard',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            dashboardActual(tableros,(tableros.actual == tableros.resultados.length-1)?0:tableros.actual+1,widgets);
        }
    });

    $(document).on('click','#widgetActivos',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            console.log($(this).attr("data-exid"));
            console.log($(this).attr("data-sxid"));
        }
    });


    function cargar_tableros2(t,w,idusuario){
        $.ajax({
        url:"php/data.php?tableros",
            method:"POST",
            data:{
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"control.dashboards",
                    orderby:[{
                        field:"posicion",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",       
                    },
                    {
                        logical:"and",
                        field  :"idusuario",
                        oper   :"=",
                        value  :idusuario,
                        type   :"int",  
                    }]        
                }],
            },
            dataType:'json',
            success:function(data){
                if (data.length > 0) {
                    $("#priorDashboard").attr("disabled",!(data[0].resultados.length>1));
                    $("#nextDashboard").attr("disabled",!(data[0].resultados.length>1));
                    if (data[0].resultados.length > 0){
                        t.resultados = data[0].resultados;
                        dashboardActual(t,0,w);
                    }
                }        
            }
      });
    }

    function cargar_tableros(t,w,idusuario){
        $.ajax({
        url:"php/data.php?tableros",
            method:"POST",
            data:{
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"control.dashboards",
                    orderby:[{
                        field:"posicion",
                        type : "desc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",       
                    },
                    {
                        logical:"and",
                        field  :"idusuario",
                        oper   :"=",
                        value  :idusuario,
                        type   :"int",  
                    }]        
                }],
            },
            dataType:'json',
            success:function(data){
                if (data.length > 0) {
                    t.resultados = data[0].resultados;
                    $("#tab_dashboard").html("");
                    $("#context_dashboard").html("");
                    data[0].resultados.map(function(element,index){
                        $('<li class="%s"><a href="#dashboard%s" data-toggle="tab" aria-expanded="%s">%s<button id="btnCloseDashboard%s" data-id="%s" class="close closeDashboard hidden" type="button" ><i class="fa fa-window-close"></i></button><button id="btnEditDashboard%s" data-id="%s" class="close editDashboard hidden" type="button" ><i class="fa fa-pencil-alt"></i></button></a></li>'.format((index==0)?"active":"",element.iddashboard,(index==0)?"true":"false",element.nombre,element.iddashboard,element.iddashboard,element.iddashboard,element.iddashboard)).appendTo("#tab_dashboard");
                        a = $('<div class="tab-pane %s" id="dashboard%s">'.format((index==0)?"active":"",element.iddashboard)).appendTo("#context_dashboard");
                        b = $("<div id='topWidgets%s' class='row'></div>".format(element.iddashboard)).appendTo(a);
                        c = $("<div id='widgets%s' class='widgets row'></div>".format(element.iddashboard)).appendTo(a);
                        //console.log(t.resultados[index].iddashboard);
                    });
                    cargar_widgets(idusuario,w);
                }        
            }
      });
    }
    
    function cargar_widgets(idusuario,w){
        $.ajax({
        url:"php/data.php?widgets",
            method:"POST",
            data:{
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"control.mywidgets()",
                    orderby:[{
                        field:"posicion",
                        type : "asc"
                    },{
                        field:'widg_posicion',
                        type:'asc'
                    }],
                    where  :[
                    {
                        field  :"idusuario",
                        oper   :"=",
                        value  :idusuario,
                        type   :"int",  
                    },
                    {
                        logical : "and",
                        field  :"activo",
                        oper   :"=",
                        value  :true,
                        type   :"int",                         
                    },{
                        logical : "and",
                        field  :"widg_activo",
                        oper   :"=",
                        value  :true,
                        type   :"int",                         
                    }]        
                }],
            },
            dataType:'json',
            success:function(data){
                if (data.length > 0) {
                    //$("#bodyDBActual").html("");
                    //$("<div id='topWidgets' class='row'></div>").appendTo("#bodyDBActual");
                    //$("<div id='widgets' class='row'></div>").appendTo("#bodyDBActual");
                    if (data[0].resultados.length > 0){
                        w.data = data[0].resultados;
                        for (var indexWidget in w.data){
                            w.data[indexWidget].processing = false;
                            
                            dibujarWidget(w.data[indexWidget]);
                        }    
                    }
                }        
            }
        });
    }

    function dibujarWidget(widget,update=false){
        widget.json      = JSON.parse(widget.parametros);
        widget.idusuario = usuarioActivo;
        widget.database  = database;
        var topWidget = "#topWidgets%s".format(widget.iddashboard);
        var bottomWidget   = "#widgets%s".format(widget.iddashboard);
        if (!(widget.processing)) {
            switch (parseInt(widget.tipo)) {
                case  1: dibujarWidgetMedidoresActivos(topWidget,widget,update); break;
                case  2: dibujarWidgetUltimaActualizacion(topWidget,widget,update);break;
                case  3: dibujarWidgetPotenciaActual(topWidget,widget,update); break;
                case  4: dibujarWidgetPotenciaDia(bottomWidget,widget,update);break;
                case  5: dibujarWidgetUltimos(bottomWidget,widget,update);break;
                case  7: dibujarWidgetUltimosDinero(bottomWidget,widget,update);break;
                case  8: dibujarWidgetComparacionDinero(bottomWidget,widget,update); break;
                case  9: dibujarWidgetMedidoresInactivos(topWidget,widget,update);break;
                case 10: dibujarWidgetEnergiaDia(bottomWidget,widget,update);break;
                case 11: dibujarWidgetMedidoresStatus(topWidget,widget,update); break;
                case 12: dibujarWidgetEnergiaAnual(bottomWidget,widget,update);break;
                case 13: dibujarWidgetEnergiaMensual(bottomWidget,widget,update);break;
                case 14: dibujarWidgetPotenciaMaxima(topWidget,widget,update);break;
                case 15: dibujarWidgetMontoAnual(bottomWidget,widget,update);break;
                case 16: dibujarWidgetFacturacionAnual(bottomWidget,widget,update);break;
                case 17: dibujarWidgetEnergiaMetrosEdificio(bottomWidget,widget,update);break;
                case 18: dibujarWidgetPotenciaMMA(bottomWidget,widget,update);break;
                case 19: dibujarWidgetPromedioMetros(bottomWidget,widget,update);break;
                case 20: dibujarWidgetPromedioEnergia(bottomWidget,widget,update);break;
                case 21: dibujarWidgetPromedioFacturacion(bottomWidget,widget,update);break;
                case 22: dibujarWidgetPromedioMontos(bottomWidget,widget,update);break;
            }
        }
    }
    
    function dashboardActual(t,index,w){
        t.actual = index;
        $("#tituloDBActual").html(t.resultados[index].nombre);
        cargar_widgets(t.resultados[index].iddashboard,w);
    }

    function actualizarWidgets(){
        if (widgets.data != null){
            widgets.data.map(function(value,index){
                if (["1","2","3","4","5","7","8","9","10","11","12","13","14"].includes(value.tipo)){
                    dibujarWidget(value,true);                 
                }
            });
        }
    }

    //AL HACER CLICK EN EL BOTON ELIMINAR DE CADA DASHBOARD
    $(document).on('click','.closeDashboard',function (event) {
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
            $(document).find(this).confirmation({
                title:'¿Esta seguro de Eliminar este Tablero?',
                btnOkLabel:'Si',
                btnOkClass:'btn-success',
                btnCancelLabel:'No',
                btnCancelClass:'btn-danger',
                rootSelector: '.closeDashboard',
                container: 'body',
                singleton: true,
                popout: true,
            });  
        }
    });

    //ACTIVAR O DESACTIVAR BOTON REMOVER DASHBOARD
    $(document).on('click','#remove_dashboard',function (event) {
        if (paginaActiva.code == 5){
            $(".closeDashboard").toggleClass("hidden");            
            $(this).data("toggle",!($(this).data("toggle")));
            $(this).html(!($(this).data("toggle"))?'Activar Remover Tablero':'Desactivar Remover Tablero');
        }
    });

    //ACTIVAR O DESACTIVAR BOTON EDIT DASHBOARD
    $(document).on('click','#edit_dashboard',function (event) {
        if (paginaActiva.code == 5){
            $(".editDashboard").toggleClass("hidden");            
            $(this).data("toggle",!($(this).data("toggle")));
            $(this).html(!($(this).data("toggle"))?'Activar Editar Tablero':'Desactivar Editar Tablero');
        }
    });

    //ACTIVAR O DESACTIVAR BOTON AGREGAR DASHBOARD
    $(document).on('click','#add_dashboard',function (event) {
        if (paginaActiva.code == 5){
            modalAddDashboard();
        }
    });

    //AL HACER CLICK EN EL BOTON 'SI' ELIMINAR DASHBOARD
    $(document).on('confirmed.bs.confirmation','.closeDashboard',function(event){
        var iddashboard = $(this).data("id");
        eliminar_dashboard(iddashboard);
        widgets.data = widgets.data.filter(function(widget){
            return parseInt(widget[0]) != parseInt(iddashboard);
        });
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
        $('#tab_dashboard a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content
    });

    //AL HACER CLICK EN EL BOTON EDIT DE CADA DASHBOARD
    $(document).on('click','.editDashboard',function (event) {
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            modalEditDashboard($(this).data("id"));
        }
    });

    //ACTIVAR O DESACTIVAR BOTON REMOVER WIDGET
    $(document).on('click','#remove_widget',function (event) {
        if (paginaActiva.code == 5){
            $(".closeWidget").toggleClass("hidden");            
            $(this).data("toggle",!($(this).data("toggle")));
            $(this).html(!($(this).data("toggle"))?'Activar Remover Widget':'Desactivar Remover Widget');
        }
    });

    //ACTIVAR O DESACTIVAR BOTON EDIT WIDGET
    $(document).on('click','#edit_widget',function (event) {
        if (paginaActiva.code == 5){
            $(".editWidget").toggleClass("hidden");            
            $(this).data("toggle",!($(this).data("toggle")));
            $(this).html(!($(this).data("toggle"))?'Activar Editar Widget':'Desactivar Editar Widget');
        }
    }); 

    //ACTIVAR O DESACTIVAR BOTON AGREGAR DASHBOARD
    $(document).on('click','#add_widget',function (event) {
        if (paginaActiva.code == 5){
            modalAddWidget();
        }
    });
    
    //AL HACER CLICK EN EL BOTON ELIMINAR DE CADA WIDGET
    $(document).on('click','.closeWidget',function (event) {
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $(document).find(this).confirmation({
                title:'¿Esta seguro de Eliminar este Widget?',
                btnOkLabel:'Si',
                btnOkClass:'btn-success',
                btnCancelLabel:'No',
                btnCancelClass:'btn-danger',
                rootSelector: '.closeWidget',
                container: 'body',
                singleton: true,
                popout: true,
            });        
        }
    });

    //AL HACER CLICK EN EL BOTON EDIT DE CADA WIDGET
    $(document).on('click','.editWidget',function (event) {
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            modalEditWidget($(this).data('id'),parseInt($(this).data('tipo')),$(this).data("tipotexto"));
        }
    });

    //AL HACER CLICK EN EL BOTON 'SI' ELIMINAR WIDGET
    $(document).on('confirmed.bs.confirmation','.closeWidget',function(event){
        var idwidget = $(this).data("id");
        eliminar_widgets(idwidget)
        widgets.data = widgets.data.filter(function(widget){
            return parseInt(widget[6]) != parseInt(idwidget);
        });
        console.log(this);
        $("#container-widget-%s".format(idwidget)).remove();
        //$(this).parent().remove(); //remove 
    });



    function eliminar_widgets(idwidget){
        var elementos = {}
        elementos["tableName"] = "control.widgets";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"idwidget",
            oper:"=",
            value:idwidget,
            type:"int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php?delete_widget',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    success2({msg:'Widget eliminado con éxito'});
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });
                }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    function eliminar_dashboard(iddashboard){
        var elementos = {}
        elementos["tableName"] = "control.dashboards";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"iddashboard",
            oper:"=",
            value:iddashboard,
            type:"int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php?delete_widget',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(iddashboard,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    success2({msg:'Dashboard eliminado con éxito'});
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });
                }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    function modalEditDashboard(iddashboard){
        operDashboard = 2;
        var page = "paginas/control/tableros/dashboards/editdashboard.php";
        $('#modal-box-body-dashboard').load(page+"?id="+iddashboard,function(){
            $("#modal-descripcion-dashboard").html('Editar parametros de Tablero');
            $('#dashboardConfig').modal({show:true});
        });
    }

    function modalAddDashboard(){
        operDashboard = 1;
        var page = "paginas/control/tableros/dashboards/adddashboard.php";
        $('#modal-box-body-dashboard').load(page,function(){
            $("#modal-descripcion-dashboard").html('Agregar Nuevo Tablero');
            $('#dashboardConfig').modal({show:true});
        });
    }

    function modalAddWidget(){
        operWidget = 1;
        var page = "paginas/control/tableros/widgets/addwidget.php";
        $('#modal-box-body-widget').load(page,function(){
            $("#modal-descripcion-widget").html('Editar parametros del Widget');
            $("#modal-titulo-widget").html('Widget');
            $('#widgetConfig').modal({show:true});
        });
    }

    function modalEditWidget(idwidget,tipo,tipotexto){
        operWidget = 2;
        globalTipo = tipo;
        var page = "paginas/control/tableros/widgets/editwidget%s.php".format(tipo);
        $('#modal-box-body-widget').load(page+"?id="+idwidget,function(){
            $("#modal-descripcion-widget").html('Editar parametros del Widget');
            $("#modal-titulo-widget").html(tipotexto);
            $('#widgetConfig').modal({show:true});
        });
    }

    //AL HACER CLICK EN EL BOTON ACEPTAR DE MODIFICAR WIDGET
    $(document).on('click','#btnModalAceptarWidget',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            console.log("operacion:"+operWidget);
            switch (operWidget) {
                case 1: agregarWidget();break;
                case 2: actualizarWidget(idwidget,globalTipo);break;
            }
        }
    });

    //AL HACER CLICK EN EL BOTON ACEPTAR DE MODIFICAR DASHBOARD
    $(document).on('click','#btnModalAceptarDashboard',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            switch (operDashboard) {
                case 1: agregarDashboard();break;
                case 2: actualizarDashboard(iddashboard); break;
            }
            
        }
    });

    $(document).on('click','.downloadWidgetPNG',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var idwidget = $(this).data("id");
            var widget = widgets.data.filter(function (widget) {
                return parseInt(widget.idwidget) === parseInt(idwidget);
            });
            if (widget[0] !== undefined){
                var canvas = widget[0].graphTarget.get(0);
                canvas.toBlob(function(blob) {
                    saveAs(blob, "%s.png".format(widget[0].tipotexto));
                });
            }
        }
    });

    $(document).on('click','.downloadWidgetXLS',function(event){
        if (paginaActiva.code == 5){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var idwidget = $(this).data("id");
            var widget = widgets.data.filter(function (widget) {
                return parseInt(widget.idwidget) === parseInt(idwidget);
            });
            if (widget[0] !== undefined){
                chartToExcel(widget[0].tipo,widget[0].barGraph.config.data,"%s".format(widget[0].tipotexto));
            }
        }
    });

    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

    function chartToExcel(tipo,data,fileName){
        var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: fileName,
            Subject: "Exportar",
            Author: "Ribex 1.2",
        };
        wb.SheetNames.push("Datos");
        var ws_data = [[fileName]];
        meses = data.labels;
        meses.unshift("");
        ws_data.push(meses);
        data.datasets.map(function(element,index){
            console.log(element.data);
            serie = [];
            serie.push(element.label);
            for (i=0;i<element.data.length;i++){
                serie.push(element.data[i] || 0);
            }
            ws_data.push(serie);
        });
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["Datos"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), '%s.xlsx'.format(fileName));

    }


});



