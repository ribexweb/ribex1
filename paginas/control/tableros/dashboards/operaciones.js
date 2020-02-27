function agregarDashboard(){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.dashboards";
    elementos["operacion"] = "Ingresar";
    elementos["campos"].push({
        "nombre"      : $("#textNombre").val(),
        "descripcion" : $("#textDescripcion").val(),
        "idusuario"   : usuarioActivo,
        "activo"      : $("#checkActivo").is(":checked")
    });
    elementos["returnFields"].push("iddashboard"); 
    $.ajax({
        url: 'php/operacion_multiple.php',
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


function actualizarDashboard(idwidget){
    var elementos = {}
    elementos["campos"] = [];
    elementos["returnFields"] = [];        
    elementos["tableName"] = "control.dashboards";
    elementos["primaryField"] = "iddashboard";
    elementos["operacion"] = "Modificar";
    elementos["types"] = "text,integer";
    elementos["campos"].push({
        "update":{
            "nombre"         : $("#textNombre").val(),
        },
        "primaryValue" : iddashboard,
    });
    $.ajax({
        url: 'php/operacion_multiple.php?widget',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
            if (data[0].tipo == "success"){
                guardar_log(iddashboard,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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