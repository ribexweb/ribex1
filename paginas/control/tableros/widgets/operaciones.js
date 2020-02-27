function agregarWidget(){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.widgets";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "iddashboard"      : $("#selectTablero").val(),
        "tamano"           : ((globalTipo != 1) && (globalTipo != 2 )&& (globalTipo != 3 )&& (globalTipo != 9))?$("#selectTamano").val():3,
        "activo"           : $("#checkActivo").is(":checked")
    });
    elementos["returnFields"].push("idwidget"); 
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(data[0].return[0]["idwidget"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    agregarWidgetEspecifico(data[0].return[0]["idwidget"],globalTipo);
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

function agregarWidgetEspecifico(idwidget,globalTipo){
    switch (globalTipo) {
        case 1 : agregarWidgetActivos(idwidget); break;
        case 2 : agregarWidgetActualizacion(idwidget); break;
        case 3 : agregarWidgetPotenciaActual(idwidget);break;
        case 4 : agregarWidgetPotenciaDia(idwidget);break; 
        case 5 : agregarWidgetUltimosEnergia(idwidget);break;
        case 7 : agregarWidgetUltimosDinero(idwidget);break;
        case 8 : agregarWidgetComparacion(idwidget);break;
        case 9 : agregarWidgetInactivos(idwidget); break;
        case 10: agregarWidgetEnergiaMes(idwidget); break;
        case 11: agregarWidgetEstado(idwidget); break;
        case 12: agregarWidgetPresupuestoAnualEnergia(idwidget); break;
        case 13: agregarWidgetPresupuestoMensualEnergia(idwidget); break;
        case 14: agregarWidgetPotenciaMaxima(idwidget);break;
        case 16: agregarWidgetFacturacionAnual(idwidget);break;
        case 15: agregarWidgetPresupuestoAnual(idwidget);break;
        case 17: agregarWidgetEnergiaMetrosEdificio(idwidget);break;
        case 18: agregarWidgetPotenciaMMA(idwidget);break;
    }
}

function agregarWidgetActivos(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresactivos";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"         : idwidget,
        "idedificio"       : $("#selectEdificio").val(),
        "idservicio"       : $("#selectServicio").val(),
        "backgroundcolor"  : $("#colorpicker1").val(),
        "fontcolor"        : $("#colorpicker2").val(),

    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetInactivos(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresinactivos";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"         : idwidget,
        "idedificio"               : $("#selectEdificio").val(),
        "idservicio"               : $("#selectServicio").val(),
        "backgroundcolor"          : $("#colorpicker1").val(),
        "fontcolor"                : $("#colorpicker2").val()
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetEstado(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresstatus";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"         : idwidget,
        "idedificio"               : $("#selectEdificio").val(),
        "idservicio"               : $("#selectServicio").val(),
        "backgroundcoloractivos"   : $("#colorpicker1").val(),
        "backgroundcolorinactivos" : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shservicio"               : $("#checkshServicio").is(":checked")
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetActualizacion(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimaactualizacion";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"         : idwidget,
        "idedificio"       : $("#selectEdificio").val(),
        "backgroundcolor"  : $("#colorpicker1").val(),
        "fontcolor"        : $("#colorpicker2").val(),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPotenciaActual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciaactual";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"         : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        "backgroundcolor"          : $("#colorpicker1").val(),
        "fontcolor"                : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "sharrendatario"           : $("#checkshArrendatario").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPotenciaDia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciadia";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        "idvariable"               : $("#selectVariable").val(),
        "backgroundcolortoday"     : $("#colorpicker1").val(),
        "backgroundcoloryesterday" : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shnombre"                 : $("#checkshNombre").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
        "shproteccion"             : $("#checkshProteccion").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetUltimosEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimosconsumos";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        "meses"                    : $("#selectMeses").val(),
        "backgroundcolor"          : $("#colorpicker1").val(),
        "backgroundcolorlast"      : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shnombre"                 : $("#checkshNombre").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetUltimosDinero(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimosconsumosdinero";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        "meses"                    : $("#selectMeses").val(),
        "backgroundcolor"          : $("#colorpicker1").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shnombre"                 : $("#checkshNombre").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetComparacion(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgscomparacionconsumosdinero";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        "meses"                    : $("#selectMeses").val(),
        "backgroundcolorenergia"   : $("#colorpicker1").val(),
        "backgroundcolordinero"    : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shnombre"                 : $("#checkshNombre").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetEnergiaMes(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiadia";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                  : $("#selectMedidor").val(),
        "idpaleta"                   : $("#selectPaleta").val(),
        "nombreotros"                : $("#textNombreOtros").val(),
        "espaciootros"               : $("#textEspacioOtros").val(),
        "titulo"                     : $("#textTitulo").val(),
        "porcentaje"                 : $("#textPorcentaje").val(),
        "primeros"                   : $("#textPrimeros").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shnombre"                   : $("#checkshNombre").is(":checked"),
        "shcodigo"                   : $("#checkshCodigo").is(":checked"),
        "shespacio"                  : $("#checkshEspacio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        "shnombreitem"               : $("#checkshNombreOtros").is(":checked"),
        "shespacioitem"              : $("#checkshEspacioOtros").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPresupuestoAnualEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiaanualpresupuestada";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                  : $("#selectMedidor").val(),
        "backgroundcolorpresupuesto" : $("#colorpicker1").val(),
        "backgroundcolormedida"      : $("#colorpicker2").val(),
        "titulo"                     : $("#textTitulo").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shnombre"                   : $("#checkshNombre").is(":checked"),
        "shcodigo"                   : $("#checkshCodigo").is(":checked"),
        "shespacio"                  : $("#checkshEspacio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPresupuestoMensualEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiamensualpresupuestada";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                  : $("#selectMedidor").val(),
        "backgroundcolorpresupuesto" : $("#colorpicker1").val(),
        "backgroundcolormedida"      : $("#colorpicker2").val(),
        "titulo"                     : $("#textTitulo").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shnombre"                   : $("#checkshNombre").is(":checked"),
        "shcodigo"                   : $("#checkshCodigo").is(":checked"),
        "shespacio"                  : $("#checkshEspacio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPotenciaMaxima(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciamaxima";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                : $("#selectMedidor").val(),
        //"backgroundcoloractivos"   : $("#colorpicker1").val(),
        //"backgroundcolorinactivos" : $("#colorpicker2").val(),
        "shedificio"               : $("#checkshEdificio").is(":checked"),
        "shmedidor"                : $("#checkshMedidor").is(":checked"),
        "shcodigo"                 : $("#checkshCodigo").is(":checked"),
        "shespacio"                : $("#checkshEspacio").is(":checked"),
        "shtitulo"                 : $("#checkshTitulo").is(":checked"),
        "maxima"                   : $("#textMaxima").val(),
        "titulo"                   : $("#textTitulo").val(),
        "idvariable"               : $("#selectVariable").val(),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetFacturacionAnual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsfacturacionanual";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idedificio"                 : $("#selectEdificio").val(),
        "idpaleta"                   : $("#selectPaleta").val(),
        "titulo"                     : $("#textTitulo").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPresupuestoAnual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspresupuestoanual";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idedificio"                 : $("#selectEdificio").val(),
        "tipo"                       : $("#selectTipo2").val(),
        "colorarrendatarios"         : $("#colorpickerArrend").val(),
        "colorgastocomun"            : $("#colorpickerGastoC").val(),
        "colorpresupuesto"           : $("#colorpickerPresup").val(), 
        "colorfacturacion"           : $("#colorpickerFactur").val(),
        "tituloarrendatarios"        : $("#textTituloArrend").val(),
        "titulogastocomun"           : $("#textTituloGastoC").val(),
        "titulopresupuesto"          : $("#textTituloPresup").val(),
        "titulofacturacion"          : $("#textTituloFactur").val(),
        "shporcentajes"              : $("#checkshPorcent").is(":checked"),
        "aplicariva"                 : $("#checkshIVA").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetEnergiaMetrosEdificio(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiametrosedificios";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idedificio"                 : $("#selectEdificio").val(),
        "backgroundcolor"            : $("#colorpicker1").val(),
        "titulo"                     : $("#textTitulo").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function agregarWidgetPotenciaMMA(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciamma";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "idwidget"                 : idwidget,
        "idmedidor"                  : $("#selectMedidor").val(),
        "backgroundcolormax"         : $("#colorpicker1").val(),
        "backgroundcolormin"         : $("#colorpicker2").val(),
        "backgroundcoloravg"         : $("#colorpicker3").val(),
        "titulo"                     : $("#textTitulo").val(),
        "shedificio"                 : $("#checkshEdificio").is(":checked"),
        "shnombre"                   : $("#checkshNombre").is(":checked"),
        "shcodigo"                   : $("#checkshCodigo").is(":checked"),
        "shespacio"                  : $("#checkshEspacio").is(":checked"),
        "shtitulo"                   : $("#checkshTitulo").is(":checked"),
    });
    $.ajax({
        url: 'php/operacion_multiple.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidget(idwidget,globalTipo){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.widgets";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer";
    elementos["campos"].push({
        "update":{
            "tamano"         : ((globalTipo != 1) && (globalTipo != 2 )&& (globalTipo != 3 )&& (globalTipo != 9))?$("#selectTamano").val():3,
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                actualizarWidgetEspecifico(idwidget,globalTipo);
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

function actualizarWidgetEspecifico(idwidget,globalTipo){
    switch (globalTipo) {
        case 1 : actualizarWidgetActivos(idwidget); break;
        case 2 : actualizarWidgetActualizacion(idwidget); break;
        case 3 : actualizarWidgetPotenciaActual(idwidget);break;
        case 4 : actualizarWidgetPotenciaDia(idwidget);break; 
        case 5 : actualizarWidgetUltimosEnergia(idwidget);break;
        case 7 : actualizarWidgetUltimosDinero(idwidget);break;
        case 8 : actualizarWidgetComparacion(idwidget);break;
        case 9 : actualizarWidgetInactivos(idwidget); break;
        case 11: actualizarWidgetEstado(idwidget); break;
        case 10: actualizarWidgetEnergiaMes(idwidget); break;
        case 12: actualizarWidgetPresupuestoAnualEnergia(idwidget); break;
        case 13: actualizarWidgetPresupuestoMensualEnergia(idwidget); break;
        case 14: actualizarWidgetPotenciaMaxima(idwidget);break;
        case 16: actualizarWidgetFacturacionAnual(idwidget);break;
        case 15: actualizarWidgetPresupuestoAnual(idwidget);break;
        case 17: actualizarWidgetEnergiaMetrosEdificio(idwidget);break;
        case 18: actualizarWidgetPotenciaMMA(idwidget);break;
    }
}

function actualizarWidgetEstado(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresstatus";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"               : $("#selectEdificio").val(),
            "idservicio"               : $("#selectServicio").val(),
            "backgroundcoloractivos"   : $("#colorpicker1").val(),
            "backgroundcolorinactivos" : $("#colorpicker2").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shservicio"               : $("#checkshServicio").is(":checked")
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPotenciaMaxima(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciamaxima";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,boolean,boolean,boolean,boolean,boolean,numeric,text,integer,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shmedidor"                : $("#checkshMedidor").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
            "shtitulo"                 : $("#checkshTitulo").is(":checked"),
            "maxima"                   : $("#textMaxima").val(),
            "titulo"                   : $("#textTitulo").val(),
            "idvariable"               : $("#selectVariable").val(),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetActivos(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresactivos";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"               : $("#selectEdificio").val(),
            "idservicio"               : $("#selectServicio").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "fontcolor"                : $("#colorpicker2").val()
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetInactivos(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsmedidoresinactivos";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"               : $("#selectEdificio").val(),
            "idservicio"               : $("#selectServicio").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "fontcolor"                : $("#colorpicker2").val()
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetActualizacion(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimaactualizacion";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"               : $("#selectEdificio").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "fontcolor"                : $("#colorpicker2").val()
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPotenciaActual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciaactual";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "fontcolor"                : $("#colorpicker2").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "sharrendatario"           : $("#checkshArrendatario").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPotenciaDia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciadia";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,boolean,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "idvariable"               : $("#selectVariable").val(),
            "backgroundcolortoday"     : $("#colorpicker1").val(),
            "backgroundcoloryesterday" : $("#colorpicker2").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shnombre"                 : $("#checkshNombre").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
            "shproteccion"             : $("#checkshProteccion").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetUltimosEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimosconsumos";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "meses"                    : $("#selectMeses").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "backgroundcolorlast"      : $("#colorpicker2").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shnombre"                 : $("#checkshNombre").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetUltimosDinero(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsultimosconsumosdinero";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "meses"                    : $("#selectMeses").val(),
            "backgroundcolor"          : $("#colorpicker1").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shnombre"                 : $("#checkshNombre").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetComparacion(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgscomparacionconsumosdinero";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                : $("#selectMedidor").val(),
            "meses"                    : $("#selectMeses").val(),
            "backgroundcolorenergia"   : $("#colorpicker1").val(),
            "backgroundcolordinero"    : $("#colorpicker2").val(),
            "shedificio"               : $("#checkshEdificio").is(":checked"),
            "shnombre"                 : $("#checkshNombre").is(":checked"),
            "shcodigo"                 : $("#checkshCodigo").is(":checked"),
            "shespacio"                : $("#checkshEspacio").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPresupuestoAnualEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiaanualpresupuestada";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,text,boolean,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                  : $("#selectMedidor").val(),
            "backgroundcolorpresupuesto" : $("#colorpicker1").val(),
            "backgroundcolormedida"      : $("#colorpicker2").val(),
            "titulo"                     : $("#textTitulo").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shnombre"                   : $("#checkshNombre").is(":checked"),
            "shcodigo"                   : $("#checkshCodigo").is(":checked"),
            "shespacio"                  : $("#checkshEspacio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPresupuestoMensualEnergia(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiamensualpresupuestada";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,text,boolean,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                  : $("#selectMedidor").val(),
            "backgroundcolorpresupuesto" : $("#colorpicker1").val(),
            "backgroundcolormedida"      : $("#colorpicker2").val(),
            "titulo"                     : $("#textTitulo").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shnombre"                   : $("#checkshNombre").is(":checked"),
            "shcodigo"                   : $("#checkshCodigo").is(":checked"),
            "shespacio"                  : $("#checkshEspacio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetFacturacionAnual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsfacturacionanual";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"                 : $("#selectEdificio").val(),
            "idpaleta"                   : $("#selectPaleta").val(),
            "titulo"                     : $("#textTitulo").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetEnergiaMetrosEdificio(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiametrosedificios";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"                 : $("#selectEdificio").val(),
            "backgroundcolor"            : $("#colorpicker1").val(),
            "titulo"                     : $("#textTitulo").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPotenciaMMA(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspotenciamma";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,text,text,boolean,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                  : $("#selectMedidor").val(),
            "backgroundcolormax"         : $("#colorpicker1").val(),
            "backgroundcolormin"         : $("#colorpicker2").val(),
            "backgroundcoloravg"         : $("#colorpicker3").val(),
            "titulo"                     : $("#textTitulo").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shnombre"                   : $("#checkshNombre").is(":checked"),
            "shcodigo"                   : $("#checkshCodigo").is(":checked"),
            "shespacio"                  : $("#checkshEspacio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetPresupuestoAnual(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgspresupuestoanual";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,text,text,text,text,text,text,text,text,text,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idedificio"                 : $("#selectEdificio").val(),
            "tipo"                       : $("#selectTipo2").val(),
            "colorarrendatarios"         : $("#colorpickerArrend").val(),
            "colorgastocomun"            : $("#colorpickerGastoC").val(),
            "colorpresupuesto"           : $("#colorpickerPresup").val(), 
            "colorfacturacion"           : $("#colorpickerFactur").val(),
            "tituloarrendatarios"        : $("#textTituloArrend").val(),
            "titulogastocomun"           : $("#textTituloGastoC").val(),
            "titulopresupuesto"          : $("#textTituloPresup").val(),
            "titulofacturacion"          : $("#textTituloFactur").val(),
            "shporcentajes"              : $("#checkshPorcent").is(":checked"),
            "aplicariva"                 : $("#checkshIVA").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

function actualizarWidgetEnergiaMes(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.wgsenergiadia";
    elementos["primaryField"] = "idwidget";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "integer,integer,text,text,text,integer,numeric,boolean,boolean,boolean,boolean,boolean,boolean,boolean,integer";
    elementos["campos"].push({
        "update":{
            "idmedidor"                  : $("#selectMedidor").val(),
            "idpaleta"                   : $("#selectPaleta").val(),
            "nombreotros"                : $("#textNombreOtros").val(),
            "espaciootros"               : $("#textEspacioOtros").val(),
            "titulo"                     : $("#textTitulo").val(),
            "porcentaje"                 : $("#textPorcentaje").val(),
            "primeros"                   : $("#textPrimeros").val(),
            "shedificio"                 : $("#checkshEdificio").is(":checked"),
            "shnombre"                   : $("#checkshNombre").is(":checked"),
            "shcodigo"                   : $("#checkshCodigo").is(":checked"),
            "shespacio"                  : $("#checkshEspacio").is(":checked"),
            "shtitulo"                   : $("#checkshTitulo").is(":checked"),
            "shnombreitem"               : $("#checkshNombreOtros").is(":checked"),
            "shespacioitem"              : $("#checkshEspacioOtros").is(":checked"),
        },
        "primaryValue" : idwidget,
    });
    console.log(elementos);
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(idwidget,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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
