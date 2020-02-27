
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

function formatColor (state) {
    if (!state.id) { return state.text; }
    var $color = $(
      '<span class="pantone-color-block '+state.text+'"></span><span>' + state.text + '</span>'
    );
    return $color;
  };

$( document ).ready(function() {



    $(".selectColor").select2({
        templateResult: formatColor,
        templateSelection: formatColor,
    });

    tablaTableros.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Tableros");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteTableros.data,'iddashboard',tablaTableros.rows( indexes ).data()[0].iddashboard);
            tableroActual = record;
            cargarTablero(record);    
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
        }     
    });

    tablaWidgets.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divActualizaciones").removeClass("hidden");
            var record = findObjectByKey(reporteWidgets.data,'idwidget',tablaWidgets.rows( indexes ).data()[0].idwidget);
            widgetActual = record;
            cargarWidget(record);    
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
        }     
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','#selectTipoWidget',function(event){
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            mostrar_Componentes(this.value);
        }
    });

    $("#selectEdificio").change(function(){
        cargarMedidores("#selectMedidor",$(this).val(),medidorActual,usuarioActivo);
    });

    $(document).on('change','.booleano_activo_tableros',function(event){   
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Tableros",
                "control.dashboards",
                {field:"iddashboard",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'iddashboard',value:id},
                reporteTableros,
                "#checkActivo"
            );
        }
    });

    $(document).on('change','.booleano_activo_widgets',function(event){   
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Widgets",
                "control.widgets",
                {field:"idwidget",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idwidget',value:id},
                reporteWidgets,
                "#checkActivo"
            );
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Tablero");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#textNombre").val('');
            $("#textDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
            if (validar("#formaParametros")) {
                guardar_tablero();
                tablaTableros.row({selected: true}).deselect();
                tablaTableros.ajax.reload();
                confirmarModificar(tablaTableros,{
                    titulo:'Confirmación',
                    msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                    btnSi : "#btnNuevo",
                });
            } 
            else {
                //error2({msg:'error'});
            }
                
            }
            else {
                if (validar("#formaParametros")){
                    actualizar_tablero(tableroActual);
                }
                else{
                // error2({msg:'error'});
                }
            }
        }
    });

    $(document).on('click','#btnEliminarWidget',function(event){
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            tablaWidgets.rows('.selected').data().map(function(element,index){
                var index = findObjectByKeyIndex(reporteWidgets.data,'idwidget',element.idwidget);            
                reporteWidgets.data.splice(index,1);
            });
            tablaWidgets.rows('.selected').remove().draw(false); 
            $("#btnEliminarWidget").attr("disabled",(reporteWidgets.data.length == 0),true,false);
        }
    });

    $(document).on('click','#btnAgregar',function(event){
        if (paginaActiva.code == 20){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#formaActualizacion")) {
                //if (reporteFacturas.data.filter(factura => (factura.boleta === $("#textBoleta").val())).length == 0) {
                    var index = agregarWidget(reporteWidgets.data);
                    if (index >= 0) {
                        tablaWidgets.rows.add([reporteWidgets.data[index-1]]).draw(); 
                        success2({msg:"Widget agregado con Éxito"});
                        $("#btnEliminarWidget").attr("disabled",(reporteWidgets.data.length == 0),true,false);
                    }
                /*}
                else{
                    error2({msg:"Factura para la boleta N° %s, ya se encuentra ingresada...".format($("#textBoleta").val())});    
                }*/
             }
        }    
    });

    function widgetRepetido(widget,tipo,json){
        jsonWg = JSON.parse(widget.json);
        if (widget.tipo == tipo){
            switch (tipo) {
                case '1':
                case '9':
                    return ((jsonWg[0]==json[0]) && (jsonWg[3]==json[3])); 
                break;
                case '2':
                case '3':
                case '4':
                case '5':
                case '7':
                case '8':
                case '11':
                    return (jsonWg[0]==json[0])
                break;
            }
        }
        else {
            return false;
        }
    }

    function filtrarPorTipo(widgets,tipo,json) {
        return widgets.filter(function(widget) {
            return (widgetRepetido(widget,tipo,json));
        })
      }

    function agregarWidget(widgets){
        var tp = $("#selectTipoWidget").val();
        var datos = construir_datos($("#selectTipoWidget").val());
        json = JSON.parse(datos.json);
        var randomid = Math.floor(Math.random() * 1000000) + 1000000;
        var filtro = filtrarPorTipo(widgets,tp,json);
        console.log(filtro);
        if (filtro.length == 0) {
            return widgets.push(
                {
                    idwidget       :randomid,
                    tipotexto      :$("#selectTipoWidget").select2('data')[0].text, 
                    datos          : datos.data,
                    activo         :$("#checkActivoWg").is(":checked"),
                    activo_switch  :'<label class="cl-switch cl-switch-green"><input id="629" class="booleano_activo_widgets" type="checkbox" checked data-idwidget="%s"><span class="switcher"></span></label>'.format(randomid),
                    tipo           :$("#selectTipoWidget").val(),
                    tamano         :((tp == 1) || (tp == 2) || (tp == 3) || (tp == 9))?3:$("#selectTamano").val(),
                    json           : datos.json,
                    posicion       : "",
                }
            );
        }
        else {
            filtro[0].datos          = datos.data;
            filtro[0].activo         =$("#checkActivoWg").is(":checked");
            filtro[0].activo_switch  ='<label class="cl-switch cl-switch-green"><input id="629" class="booleano_activo_widgets" type="checkbox" checked data-idwidget="%s"><span class="switcher"></span></label>'.format(filtro[0].randomid);
            filtro[0].tipo           =$("#selectTipoWidget").val();
            filtro[0].tamano         =((tp == 1) || (tp == 2) || (tp == 3) || (tp == 9))?3:$("#selectTamano").val();
            filtro[0].json           = datos.json;
            warning2({msg:"Widget repetido, se actualizara con los nuevos valores"});
        }

    }

    function construir_datos(tipo){
        var dt = "";
        var datos = {data:"",json:""};
        switch (tipo){
            case '1': 
            case '2': 
            case '9': dt = '"%s","%s","%s","%s","%s"'.format($("#selectEdificio").val(),$("#selectEdificio").select2('data')[0].text,$("#selectColor").val(),$("#selectServicio").val(),$("#selectServicio").select2('data')[0].text);
            break;
            case '3': dt = '"%s","%s","%s","%s"'.format($("#selectMedidor").val(),$("#selectMedidor").select2('data')[0].text.split('|')[0].trim(),$("#selectColor").val(),($("#selectMedidor option:selected").attr('data-idmedidorfisico')=='null')?'Virtual':$("#selectEdificio").val());
            break;
            case '4': dt = '"%s","%s","avg","%s","%s","%s"'.format($("#selectMedidor").val(),$("#selectMedidor").select2('data')[0].text.split('|')[0].trim(),$("#colorpicker1").val(),$("#colorpicker2").val(),($("#selectMedidor option:selected").attr('data-idmedidorfisico')=='null')?'Virtual':$("#selectEdificio").val());
            break;
            case '5': 
            case '8': dt = '"%s","%s",%s,"%s","%s","%s"'.format($("#selectMedidor").val(),$("#selectMedidor").select2('data')[0].text.split('|')[0].trim(),$("#selectMeses").val(),$("#colorpicker1").val(),$("#colorpicker2").val(),($("#selectMedidor option:selected").attr('data-idmedidorfisico')=='null')?'Virtual':$("#selectEdificio").val());
            break;
            case '7': dt = '"%s","%s","%s","%s","%s"'.format($("#selectMedidor").val(),$("#selectMedidor").select2('data')[0].text.split('|')[0].trim(),$("#selectMeses").val(),$("#colorpicker1").val(),($("#selectMedidor option:selected").attr('data-idmedidorfisico')=='null')?'Virtual':$("#selectEdificio").val());
            break;
            case '11':dt = '"%s","%s","%s","%s","%s","%s"'.format($("#selectEdificio").val(),$("#selectEdificio").select2('data')[0].text,$("#colorpicker1").val(),$("#colorpicker2").val(),$("#selectServicio").val(),$("#selectServicio").select2('data')[0].text);
        }
        datos.data = "{%s}".format(dt);
        datos.json = "[%s]".format(dt);
        return datos;
    }


    function cargarTablero(record){
        $("#textNombre").val(record.nombre);
        $("#textdescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));    
        loadWidgetsAlmacenados(reporteWidgets,record.iddashboard,tableParamsWidgets,"#tablaWidgets");    
        $('#formaActualizacion').trigger("reset");
    }

    function cargarWidget(record){
        $("#selectTipoWidget").val(record.tipo);
        $("#selectTipoWidget").select2().trigger('change');
        json = JSON.parse(record.json);
        switch (record.tipo) {
            case '1':
            case '2':
            case '9':
                $("#selectEdificio").val(parseInt(json[0]));
                $("#selectEdificio").select2().trigger('change');   
                $("#selectColor").val(json[2]);
                $("#selectColor").select2().trigger('change'); 
                $(".selectColor").select2({
                    templateResult: formatColor,
                    templateSelection: formatColor,
                });
                $("#selectServicio").val(parseInt(json[3]));
                $("#selectServicio").select2().trigger('change');  
            break; 
            case '3':
            medidorActual = parseInt(json[0]);
            if (json[3] != 'Virtual') {
                $("#selectEdificio").val(parseInt(json[3]));
                $("#selectEdificio").select2().trigger('change');
            }
            else {
                $("#selectEdificio").val($("#selectEdificio option:first").val());
                $("#selectEdificio").select2().trigger('change');                      
            }
            $("#selectColor").val(json[2]);
            $("#selectColor").select2().trigger('change'); 
            $(".selectColor").select2({
                templateResult: formatColor,
                templateSelection: formatColor,
            });
            break;        
            case '4':
                medidorActual = parseInt(json[0]);
                if (json[5] != 'Virtual') {
                    $("#selectEdificio").val(parseInt(json[5]));
                    $("#selectEdificio").select2().trigger('change');
                }
                else {
                    $("#selectEdificio").val($("#selectEdificio option:first").val());
                    $("#selectEdificio").select2().trigger('change');                      
                }
                $("#selectTamano").val(record.tamano);
                $("#selectTamano").select().trigger('change'); 
                $("#colorpicker1").val(json[3]);
                $("#colorpicker2").val(json[4]);
            break;
            case '5':
                medidorActual = parseInt(json[0]);
                if (json[5] != 'Virtual') {
                    $("#selectEdificio").val(parseInt(json[5]));
                    $("#selectEdificio").select2().trigger('change');
                }
                else {
                    $("#selectEdificio").val($("#selectEdificio option:first").val());
                    $("#selectEdificio").select2().trigger('change');                      
                }
                $("#selectTamano").val(record.tamano);
                $("#selectTamano").select().trigger('change'); 
                $("#selectMeses").val(parseInt(json[2]));
                $("#selectMeses").select().trigger('change'); 
                $("#colorpicker1").val(json[3]); 
                $("#colorpicker2").val(json[4]);  
            break;
            case '7':
                medidorActual = parseInt(json[0]);
                if (json[4] != 'Virtual') {
                    $("#selectEdificio").val(parseInt(json[4]));
                    $("#selectEdificio").select2().trigger('change');
                }
                else {
                    $("#selectEdificio").val($("#selectEdificio option:first").val());
                    $("#selectEdificio").select2().trigger('change');                      
                }
                $("#selectTamano").val(record.tamano);
                $("#selectTamano").select().trigger('change'); 
                $("#selectMeses").val(parseInt(json[2]));
                $("#selectMeses").select().trigger('change'); 
                $("#colorpicker1").val(json[3]);        
            break;
            case '8':
                medidorActual = parseInt(json[0]);
                if (json[5] != 'Virtual') {
                    $("#selectEdificio").val(parseInt(json[5]));
                    $("#selectEdificio").select2().trigger('change');
                }
                else {
                    $("#selectEdificio").val($("#selectEdificio option:first").val());
                    $("#selectEdificio").select2().trigger('change');                      
                }
                $("#selectTamano").val(record.tamano);
                $("#selectTamano").select().trigger('change'); 
                $("#selectMeses").val(parseInt(json[2]));
                $("#selectMeses").select().trigger('change'); 
                $("#colorpicker1").val(json[3]); 
                $("#colorpicker2").val(json[4]);         
            break;
            case '11':
                $("#selectEdificio").val(parseInt(json[0]));
                $("#selectEdificio").select2().trigger('change'); 
                $("#selectTamano").val(record.tamano);
                $("#selectTamano").select().trigger('change');
                $("#selectServicio").val(parseInt(json[4]));
                $("#selectServicio").select2().trigger('change');  
                $("#colorpicker1").val(json[2]); 
                $("#colorpicker2").val(json[3]);   
            break;
        }
        $(".colorrgb").minicolors('settings', {
        });
    }

    function loadWidgetsAlmacenados(reporte,iddashboard,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/getTable3.php?widgets",
                type:"POST",
                dataType: 'json',
                data:{
                    primaryField : "idwidget",
                    show : {
                        fields:["idwidget","tipotexto","datos","posicion","activo","tipo","tamano","iddashboard","json"],
                        realtablename:'widgets',
                        group:["iddashboard"],
                        deletebtn: false,
                        updatebtn:false
                    },
                    hide:["idwidget"],
                    queries : [{
                        fieldsSelect:["*","array_to_json(datos) as json"],
                        tableName   :"control.vwidgets3",
                        orderby:[{
                            field:"posicion",
                            type : "asc"
                        }],
                        where  :[{ 
                            field:"iddashboard",
                            oper:"=",
                            value:iddashboard,
                            type: "int"
                        }]
                    }]
                },
                success: function(data){        
                    reporte.activo = false;
                    reporte.data = data.data;
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                    }; 
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaWidgets = $(idtabla).DataTable(tableParams);   
                    $("#btnEliminarWidget").attr("disabled",(reporte.data.length == 0),true,false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            }); 
        }    
        else {
//            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    }
    
    function cargarMedidores(control,idedificio,indexSelected,idusuario){
        if (edificios != '') { //Si tiene uno o varios edificios en permisologia
          selectJs2(
            control,
            { Selected:indexSelected,
              value: "idmedidor",
              show: {
                  fields:["codigo","cons_nombre","espa_nombre"],
                  format: "%s | %s | %s"
              },
              hide: ["idmedidorfisico"],
              queries:[{
                fieldsSelect: ["idmedidor","idmedidorfisico","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
                tableName   :"mediciones.medidores_permisados(%s,%s)".format(idedificio,idusuario),
                orderby:[{
                  field:"idmedidorfisico",
                  type : "asc NULLS first"
                }],
                where  :[{
                  field  :"asig_activo",
                  oper   :"=",
                  value  :"true",
                  type   :"int",                            
                },
                {
                    logical: "or",
                    field: "idmedidorvirtual",
                    oper:  " is not ",
                    value: "null",
                    type:  "int",
                }]        
              }],
            },
            {
            }    
          );
        }
      } 

    function mostrar_Componentes(tipoWidget){
        $(".widget").hide();
        $("#container-edificio").show();  
        $("#container-activo").show();  
        if ((tipoWidget == 1) || (tipoWidget == 2) || (tipoWidget == 3)|| (tipoWidget == 9)){
            $("#container-color").show();
            if (tipoWidget == 3) {
                $("#container-medidor").show();
            }
            else if ((tipoWidget == 1) || (tipoWidget == 9)){
                $("#container-servicio").show();
            }
        }
        else if (tipoWidget == 4) {
            $("#container-medidor").show();
            $("#container-tamano").show();
            $("#container-colorpicker1").show();
            $("#container-colorpicker2").show();
            $($("#container-colorpicker1").find("label")[0]).text('Color Día de Hoy');
            $("#colorpicker1").val("rgba(0,166,90,0.6)");
            $($("#container-colorpicker2").find("label")[0]).text('Color Día de Ayer');
            $("#colorpicker2").val("rgba(243,156,18,0.6)");
            $(".colorrgb").minicolors('settings', {
              });

        }
        else if ((tipoWidget == 5) || (tipoWidget == 8)) {
            $("#container-medidor").show();
            $("#container-tamano").show();
            $("#container-meses").show();
            $("#container-colorpicker1").show();
            $("#container-colorpicker2").show();
            if (tipoWidget == 5) {
                $($("#container-colorpicker1").find("label")[0]).text('Color Barras Anteriores');
                $("#colorpicker1").val("rgba(0,166,90,0.6)");
                $($("#container-colorpicker2").find("label")[0]).text('Color última Barra');
                $("#colorpicker2").val("rgba(243,156,18,0.6)");
                $(".colorrgb").minicolors('settings', {
                  });
            }
            else {
                $($("#container-colorpicker1").find("label")[0]).text('Color Barras de Energia');
                $("#colorpicker1").val("rgba(45,10,80,0.6)");
                $($("#container-colorpicker2").find("label")[0]).text('Color Barras de Monto Boleta');
                $("#colorpicker2").val("rgba(0,166,90,0.6)");
                $(".colorrgb").minicolors('settings', {
                  });
            }
        }
        else if ((tipoWidget == 7)) {
            $("#container-medidor").show();
            $("#container-tamano").show();
            $("#container-meses").show();
            $("#container-colorpicker1").show();
            $($("#container-colorpicker1").find("label")[0]).text('Color Barras');
            $("#colorpicker1").val("rgba(0,166,90,0.6)");
            $(".colorrgb").minicolors('settings', {
              });
        }
        else if (tipoWidget == 11) {
            $("#container-tamano").show();
            $("#container-colorpicker1").show();
            $("#container-colorpicker2").show();   
            $("#container-servicio").show();         
        }
    }

    function guardar_tablero(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "control.dashboards";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "idusuario"      : usuarioActivo,
            "nombre"         : $("#textNombre").val(),
            "descripcion"    : $("#textDescripcion").val(),
            "activo"         : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("iddashboard"); 
        $.ajax({
            url: 'php/operacion_multiple.php?dashboard',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        success2({
                            msg : data[0].mesg,
                        });
                        guardar_log(data[0].return[0]["iddashboard"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        if (reporteWidgets.data.length > 0) {
                            guardar_widgets_tablero({
                                iddashboard:data[0].return[0]["iddashboard"],
                                widgets:reporteWidgets.data
                            });
                        }

                    }
                    else {
                        console.log(data);
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

    function eliminar_widgets_tablero(iddashboard){
        var elementos = {}
        elementos["tableName"] = "control.widgets";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"iddashboard",
            oper:"=",
            value:iddashboard,
            type:"int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php?delete_widgets',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(iddashboard,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    if (reporteWidgets.data.length > 0) {
                        guardar_widgets_tablero({
                            iddashboard:iddashboard,
                            widgets:reporteWidgets.data
                        });
                    }
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

    function guardar_widget_medidores_activos(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsmedidoresactivos";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idedificio"          : json[0],
            "backgroundcolor"     : json[2],
            "idservicio"          : json[3],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?activos',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_medidores_inactivos(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsmedidoresinactivos";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idedificio"          : json[0],
            "backgroundcolor"     : json[2],
            "idservicio"          : json[3],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?inactivos',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_ultima_actualizacion(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsultimaactualizacion";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idedificio"          : json[0],
            "backgroundcolor"     : json[2],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?ultima_actualizacion',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_potencia_del_dia(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgspotenciadia";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idmedidor"           : json[0],
            "calculo"             : json[2],
            "backgroundcolortoday"     : json[3],
            "backgroundcoloryesterday"     : json[4],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?widget_potenciadia',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_potencia_actual(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgspotenciaactual";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idmedidor"           : json[0],
            "backgroundcolor"     : json[2],
        });
        $.ajax({
            url: 'php/operacion_multiple.php?widget_potenciaactual',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_ultimos_consumos(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsultimosconsumos";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idmedidor"           : json[0],
            "meses"               : json[2],
            "backgroundcolor"     : json[3],
            "backgroundcolorlast" : json[4],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?widget_energia',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_ultimos_montos(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsultimosconsumosdinero";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"            : idwidget,
            "idmedidor"           : json[0],
            "meses"               : json[2],
            "backgroundcolor"     : json[3],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?widget_dinero',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_comparacion(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgscomparacionconsumosdinero";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"               : idwidget,
            "idmedidor"              : json[0],
            "meses"                  : json[2],
            "backgroundcolorenergia" : json[3],
            "backgroundcolordinero"  : json[4],
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?widget_comparacion',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widget_estado_medidores(datos,idwidget){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.wgsmedidoresstatus";
        elementos["operacion"] = "Ingresar";
        var json = JSON.parse(datos);
        elementos["campos"].push({
            "idwidget"                  : idwidget,
            "idedificio"                : json[0],
            "backgroundcoloractivos"    : json[2],
            "backgroundcolorinactivos"  : json[3],
            "idservicio"                : json[4]
        });
        console.log(elementos);
        $.ajax({
            url: 'php/operacion_multiple.php?widget_estado_medidores',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_widgets_especificos(iddashboard,idwidgets){
        console.log(idwidgets);
        reporteWidgets.data.map(function(element,index){
            switch (element.tipo) {
                case '1': guardar_widget_medidores_activos(element.json,idwidgets[index].idwidget);
                break;
                case '2': guardar_widget_ultima_actualizacion(element.json,idwidgets[index].idwidget);
                break;
                case '3': guardar_widget_potencia_actual(element.json,idwidgets[index].idwidget);
                break;
                case '4': guardar_widget_potencia_del_dia(element.json,idwidgets[index].idwidget);
                break;
                case '5': guardar_widget_ultimos_consumos(element.json,idwidgets[index].idwidget);
                break;
                case '7': guardar_widget_ultimos_montos(element.json,idwidgets[index].idwidget);
                break;
                case '8': guardar_widget_comparacion(element.json,idwidgets[index].idwidget);
                break;
                case '9' : guardar_widget_medidores_inactivos(element.json,idwidgets[index].idwidget);
                break;
                case '11': guardar_widget_estado_medidores(element.json,idwidgets[index].idwidget);
                break;
            }
        });
  
    }

    function guardar_widgets_tablero(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "control.widgets";
        elementos["operacion"] = "Ingresar";
        elementos["returnFields"] = [];
        arguments[0].widgets.forEach(function (value, index){
            elementos["campos"].push({
                "iddashboard"         : argumentos[0].iddashboard,
                "tamano"              : value.tamano,
                "activo"              : value.activo,
            });
        }); 
        elementos["returnFields"].push("idwidget");
        $.ajax({
            url: 'php/operacion_multiple.php?widgets',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            type: "POST",
            data:elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(argumentos[0].iddashboard,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    guardar_widgets_especificos(argumentos[0].iddashboard,data[0].return);
                }
                else {
                    console.log(data);
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function actualizar_tablero(tablero){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "control.dashboards";
        elementos["primaryField"] = "iddashboard";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "idusuario"      : usuarioActivo,
                "nombre"         : $("#textNombre").val(),
                "descripcion"    : $("#textDescripcion").val(),
                "activo"         : $("#checkActivo").is(":checked")
            },
            "primaryValue" : tablero.iddashboard,
        });
        $.ajax({
            url: 'php/operacion_multiple.php?dashboard',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(tablero.iddashboard);
                    guardar_log(tablero.iddashboard,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    eliminar_widgets_tablero(tablero.iddashboard);
                    success2({
                        msg : data[0].mesg,
                    });
                }
                else {
                    console.log(data);
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

    function updaterecord(idtablero){
        var index = findObjectByKeyIndex(tablaTableros.rows().data(),'iddashboard',idtablero);
        var record = tablaTableros.rows().data()[index]; 
        record.nombre = $("#textNombre").val()
        record.descripcion = $("#textDescripcion").val();
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_tableros" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.iddashboard,($("#checkActivo").is(":checked"))?"checked":"");
        tablaTableros.row("#"+record.iddashboard).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteTableros.data,'iddashboard',idtablero);
        record2.nombre = record.nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }

    $(document).on('click','.posicion_widgets',function(event){
        var id = $(this).attr("id");
        var operacion = $(this).data("operacion");
        var posicion = $(this).data("posicion");
        var iddashboard = $(this).data("iddashboard");
        $.ajax({
          url:"php/changePosicion.php",
          method:"POST",
          data:{
            tableName:"control.widgets",
            idGroupField: "iddashboard",
            idGroupValue: iddashboard,
            primaryField: "idwidget",
            primaryValue:id,
            posicion:posicion,
            operacion:operacion,
          },
          dataType:'text',
          success:function(data){
            
            var origen = tablaWidgets.rows().data().map(function(e) { return e.idwidget; }).indexOf(id);
            var destino = (operacion=='+')?origen+1:origen-1;
            swapDataTableRows(tablaWidgets,origen,destino,'widgets')
          }
        });      
      });

    function swapDataTableRows(tabla, row1Index, row2Index,tablaName){
        console.log('%s=>%s',row1Index,row2Index);
        var row1Data = tabla.row(row1Index).data();
        var row2Data = tabla.row(row2Index).data();
        var temp = row1Data.posicion;
        row1Data.posicion = actualizarPosicion($(row1Data.posicion)[0].id,row2Data.posicion,tablaName);
        row2Data.posicion = actualizarPosicion($(row2Data.posicion)[0].id,temp,tablaName); 

        tabla.row(row1Index).data(row2Data).draw();
        tabla.row(row2Index).data(row1Data).draw();
    //    datatable.drow();
    }

    function actualizarPosicion(id,posicion,tablaName){
        data0 = $($(posicion)[0]).data();
        data1 = $($(posicion)[1]).data();
        str = '';
        dataStr0 = '';
        dataStr1 = '';
        for (var key in data0) {
            dataStr0 += "data-%s='%s' ".format(key,data0[key]);
            dataStr1 += "data-%s='%s' ".format(key,data1[key]);
        }

        if (data0.total == 1){
            str   = "<button id='%s' %s name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>".format(id,dataStr0)+
                    "<button id='%s' %s name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>".format(id,dataStr1);

        }
        else{
            if (data0.posicion == 1) {
                str = "<button id='%s' %s name='posicion' class='btn btn-danger btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>".format(id,dataStr0,tablaName)+
                      "<button id='%s' %s name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>".format(id,dataStr1);
            }
            else if (data0.posicion == data0.total){
                str = "<button id='%s' %s name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>".format(id,dataStr0)+
                      "<button id='%s' %s name='posicion' class='btn btn-success btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>".format(id,dataStr1,tablaName);
            }
            else {
                str = "<button id='%s' %s name='posicion' class='btn btn-danger btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>".format(id,dataStr0,tablaName)+
                      "<button id='%s' %s name='posicion' class='btn btn-success btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>".format(id,dataStr1,tablaName);

            }    
        
        }
        console.log(str);
        return str;

    }

});
