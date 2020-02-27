
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

    $('.select2').select2();

    tablaAsignaciones.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Asignaciones");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteAsignaciones.data,'idasignacion',tablaAsignaciones.rows( indexes ).data()[0].idasignacion);
            asignacionActual = record;
            cargarasignacion(record);
        }
    });

    cargarUsos();

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaAsignaciones").offset().top}, "slow");
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Asignación");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            clearComponentes(); 
        
        }
              
    });

    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#formaParametros")) {
                    guardar_asignaciones();
                    confirmarModificar(tablaAsignaciones,{
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
                    actualizar_asignacion(asignacionActual);
                }
                else{
                // error2({msg:'error'});
                }
            }
        }
    });


    $(document).on('change','#selectEdificio',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            cargarMedidores($("option:selected", this).attr("data-prefijo"));
            cargarConsumidores(this.value);
            cargarUbicaciones(this.value);
            cargarEspacios(this.value);
            //cargarUsos(this.value);
            cargarTarifas(this.value);
            cargarAsignaciones(this.value);
        }
    });

    $(document).on('change','#selectMedidor',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#textServicio").val($("option:selected", this).attr('data-serv_nombre'));
        }
    });

    $(document).on('change','#selectConsumidor',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#textRut").val($("option:selected", this).attr('data-rut'));
            $("#textDireccion").val($("option:selected", this).attr('data-direccion'));
        }
    });

    $(document).on('change','#selectPrevia',function(event){
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#textConsumidorPrevio").val($("option:selected", this).attr('data-cons_nombre'));
            $("#textInicioPrevio").val($("option:selected", this).attr('data-asig_fechainicial'));
            $("#textCesePrevio").val($("option:selected", this).attr('data-asig_fechafinal'));
        }
    });

    $(document).on('change','.booleano_asig_activo_asignaciones',function(event){   
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Asignaciones",
                "mediciones.asignaciones",
                {field:"idasignacion",value:id,type:'integer'},
                {name:'activo',value:activo,type:'boolean'},
                {name:'idasignacion',value:id},
                reporteAsignaciones,
                "#checkActivo"
            );
        }
    });

    $(document).on('change','.booleano_local_asignaciones',function(event){   
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var local = $(this).is(":checked");
            updateFieldBoolean("Asignaciones",
                "mediciones.asignaciones",
                {field:"idasignacion",value:id,type:'integer'},
                {name:'local',value:local,type:'boolean'},
                {name:'idasignacion',value:id},
                reporteAsignaciones,
                "#checkActivo"
            );
        }
    });

    $(document).on('change','.booleano_calculos_asignaciones',function(event){   
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var calculos = $(this).is(":checked");
            updateFieldBoolean("Asignaciones",
                "mediciones.asignaciones",
                {field:"idasignacion",value:id,type:'integer'},
                {name:'calculos',value:calculos,type:'boolean'},
                {name:'idasignacion',value:id},
                reporteAsignaciones,
                "#checkCalculos"
            );
        }
    });

    $(document).on('change','.booleano_boleta_asignaciones',function(event){   
        if (paginaActiva.code == 25){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var boleta = $(this).is(":checked");
            updateFieldBoolean("Asignaciones",
                "mediciones.asignaciones",
                {field:"idasignacion",value:id,type:'integer'},
                {name:'boleta',value:boleta,type:'boolean'},
                {name:'idasignacion',value:id},
                reporteAsignaciones,
                "#checkBoleta"
            );
        }
    });

    function clearComponentes(){
        $("#selectEdificio").val($("#selectEdificio option:first").val());
        $("#selectEdificio").select2().trigger('change');  
        $("#selectMedidor").val($("#selectMedidor option:first").val());
        $("#selectMedidor").select2().trigger('change');    
        $("#textCodigo").val('');    
        $("#selectConsumidor").val($("#selectConsumidor option:first").val());
        $("#selectConsumidor").select2().trigger('change'); 
        $("#selectEspacio").val($("#selectEspacio option:first").val());
        $("#selectEspacio").select2().trigger('change'); 
        $("#selectUbicacion").val($("#selectUbicacion option:first").val());
        $("#selectUbicacion").select2().trigger('change'); 
        $("#selectTarifa").val($("#selectTarifa option:first").val());
        $("#selectTarifa").select2().trigger('change'); 
        $("#textPorcentaje").val('100');
        $("#selectPrevia").val($("#selectPrevia option:first").val());
        $("#selectPrevia").select2().trigger('change'); 
        $("#textInicio").val(moment().format("YYYY-MM-DD")+' 00:00');
        $("#textCese").val('');
    }

    /*LISTO*/
    function cargarasignacion(record){
        $("#selectEdificio").val(record.idedificio);
        $("#selectEdificio").select().trigger('change');
        $("#textCodigo").val(record.asig_codigo);
        $("#selectUso").val(record.iduso);
        $("#selectUso").select().trigger('change');
        $("#textInicio").val(record.asig_fechainicial);
        $("#textCese").val(record.asig_fechafinal);
        $("#textPorcentaje").val(record.asig_porcentaje); 
        $("#checkActivo").attr("checked",(record.activo=='t'));
        $("#checkLocal").attr("checked",(record.local=='t'));
        $("#checkCalculos").attr("checked",(record.calculos=='t'));
        $("#checkBoleta").attr("checked",(record.boleta=='t'));
    }

    function cargarMedidores(prefijo){
        selectJs2(
            "#selectMedidor",
            {   Selected:(asignacionActual != null)?asignacionActual.idmedidorfisico:-1,
                value: "idmedidorfisico",
                show: {
                    fields:["codigo","serv_nombre"],
                    format: "%s | %s"
                },
                hide: ["serv_nombre"],
                queries:[{
                    fieldsSelect:["idmedidorfisico","codigo","serv_nombre"],
                    tableName   :"mediciones.vmedidoresfisicos",
                    orderby:[{
                        field:"idmedidorfisico",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "split_part(codigo,'-',2)",
                         oper   : "=",
                         value  : prefijo,
                         type   : "str"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarConsumidores(idedificio){
        selectJs2(
            "#selectConsumidor",
            {   Selected:(asignacionActual != null)?asignacionActual.idconsumidor:-1,
                value: "idconsumidor",
                show: {
                    fields:["nombre"],
                    format: "%s"
                },
                hide:["rut","direccion"],
                queries:[{
                    fieldsSelect:["idconsumidor","nombre","rut","coalesce(direccion,'') as direccion"],
                    tableName   :"mediciones.vconsumidores",
                    orderby:[{
                        field:"idconsumidor",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarAsignaciones(idedificio){
        console.log(asignacionActual.idasignacionprevia);
        selectJs2(
            "#selectPrevia",
            {   Selected:(asignacionActual != null)?(asignacionActual.idasignacionprevia != null)?asignacionActual.idasignacionprevia:-1:-1,
                Nulo :[ {
                    value: -1,
                    text : 'Ninguno'
                }],
                value: "idasignacion",
                show: {
                    fields:["idasignacion","cons_nombre","codigo"],
                    format: "%s | %s | %s "
                },
                hide:["cons_nombre","asig_fechainicial","asig_fechafinal"],
                queries:[{
                    fieldsSelect:["idasignacion","codigo","cons_nombre","asig_fechainicial","CASE WHEN asig_fechafinal is null THEN '' ELSE asig_fechafinal::text END as asig_fechafinal"],
                    tableName   :"mediciones.vmedidores",
                    orderby:[{
                        field:"idasignacion",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"asig_activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarUbicaciones(idedificio){
        selectJs2(
            "#selectUbicacion",
            {   Selected:(asignacionActual != null)?asignacionActual.idubicacion:-1,
                value: "idubicacion",
                show: {
                    fields:["nombre"],
                    format: "%s"
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.ubicaciones",
                    orderby:[{
                        field:"idubicacion",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarEspacios(idedificio){
        console.log(asignacionActual.idespacio);
        selectJs2(
            "#selectEspacio",
            {   Selected:(asignacionActual != null)?asignacionActual.idespacio:-1,
                value: "idespacio",
                show: {
                    fields:["nombre"],
                    format: "%s"
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.espacios",
                    orderby:[{
                        field:"idespacio",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarTarifas(idedificio){
        selectJs2(
            "#selectTarifa",
            {   Selected:(asignacionActual != null)?asignacionActual.idtarifaedificio:-1,
                value: "idtarifaedificio",
                show: {
                    fields:["nombre"],
                    format: "%s"
                },
                queries:[{
                    fieldsSelect:["idtarifaedificio","nombre"],
                    tableName   :"remarcacion.vtarifasedificios",
                    orderby:[{
                        field:"idtarifaedificio",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "and",
                         field  : "idedificio",
                         oper   : "=",
                         value  : idedificio,
                         type   : "int"
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function cargarUsos(){
        selectJs2(
            "#selectUso",
            {   Selected:(asignacionActual != null)?asignacionActual.iduso:-1,
                value: "iduso",
                show: {
                    fields:["nombre"],
                    format: "%s"
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.usos",
                    orderby:[{
                        field:"iduso",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        }
                    ]        
                }],
            },
            {
            }    
        );        
    }

    function actualizar_asignacion(asignacion){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.asignaciones";
        elementos["primaryField"] = "idasignacion";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "integer,integer,integer,integer,integer,integer,integer,integer,text,numeric,timestamp,timestamp,boolean,boolean,boolean,boolean,integer";
        elementos["campos"].push({
            "update":{
                "idmedidorfisico"   : $("#selectMedidor").val(),
                "idedificio"        : $("#selectEdificio").val(),
                "idconsumidor"      : $("#selectConsumidor").val(),
                "idubicacion"       : $("#selectUbicacion").val(),   
                "idespacio"         : $("#selectEspacio").val(),
                "iduso"             : $("#selectUso").val(),
                "idtarifaedificio"  : $("#selectTarifa").val(),
                "idasignacionprevia": ($("#selectPrevia").val() != -1)?$("#selectPrevia").val():'null',
                "codigo"            : $("#textCodigo").val(),
                "porcentaje"        : $("#textPorcentaje").val(),
                "fechainicial"      : $("#textInicio").val(),
                "fechafinal"        : ($("#textCese").val() != '')?$("#textCese").val():'null',
                "local"             : $("#checkLocal").is(":checked"),
                "calculos"          : $("#checkCalculos").is(":checked"),
                "boleta"            : $("#checkBoleta").is(":checked"),
                "activo"            : $("#checkActivo").is(":checked")
            },
            "primaryValue" : asignacion.idasignacion,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(asignacion.idasignacion);
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_log(asignacion.idasignacion,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
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

    function guardar_asignaciones(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "mediciones.asignaciones";
        elementos["primaryField"] = "idasignacion";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
                "idmedidorfisico"   : $("#selectMedidor").val(),
                "idedificio"        : $("#selectEdificio").val(),
                "idconsumidor"      : $("#selectConsumidor").val(),
                "idubicacion"       : $("#selectUbicacion").val(),   
                "idespacio"         : $("#selectEspacio").val(),
                "iduso"             : $("#selectUso").val(),
                "idtarifaedificio"  : $("#selectTarifa").val(),
                "idasignacionprevia": ($("#selectPrevia").val() != -1)?$("#selectPrevia").val():'null',
                "codigo"            : $("#textCodigo").val(),
                "porcentaje"        : $("#textPorcentaje").val(),
                "fechainicial"      : $("#textInicio").val(),
                "fechafinal"        : ($("#textCese").val() != '')?$("#textCese").val():'null',
                "local"             : $("#checkLocal").is(":checked"),
                "calculos"          : $("#checkCalculos").is(":checked"),
                "boleta"            : $("#checkBoleta").is(":checked"),
                "activo"            : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idasignacion"); 
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
                    guardar_log(data[0].return[0]["idasignacion"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    tablaAsignaciones.row({selected: true}).deselect();
                    tablaAsignaciones.ajax.reload();
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

    function updaterecord(idasignacion){
        var index = findObjectByKeyIndex(tablaAsignaciones.rows().data(),'idasignacion',idasignacion);
        var record = tablaAsignaciones.rows().data()[index]; 
        record.idedificio = $("#selectEdificio").val();
        record.edif_nombre = $("#selectEdificio").select2('data')[0].text;
        record.idmedidor= $("#selectMedidor").val();
        record.codigo = $("#selectMedidor").select2('data')[0].text.split('|')[0].trim();
        record.asig_codigo = $("#textCodigo").val();
        record.idconsumidor= $("#selectConsumidor").val();
        record.cons_nombre = $("#selectConsumidor").select2('data')[0].text;  
        record.idubicacion= $("#selectUbicacion").val();
        record.ubic_nombre = $("#selectUbicacion").select2('data')[0].text;    
        record.idespacio= $("#selectEspacio").val();
        record.espa_nombre = $("#selectEspacio").select2('data')[0].text;   
        record.iduso= $("#selectUso").val();
        record.usos_nombre = $("#selectUso").select2('data')[0].text;   
        record.idtarifaedificio= $("#selectTarifa").val();
        record.tari_nombre = $("#selectTarifa").select2('data')[0].text;  
        record.asig_fechainicial = $("#textInicio").val();
        record.asig_fechafinal =   $("#textCese").val();  
        record.asig_porcentaje =   $("#textPorcentaje").val(); 
        record.idasignacionprevia = ($("#selectPrevia").val() != -1)?$("#selectPrevia").val():'';       
        record.asig_activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_asig_activo_asignaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idasignacion,($("#checkActivo").is(":checked"))?"checked":"");
        record.local  = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_local_asignaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idasignacion,($("#checkLocal").is(":checked"))?"checked":"");
        record.calculos  = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_calculos_asignaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idasignacion,($("#checkCalculos").is(":checked"))?"checked":"");
        record.boleta  = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_boleta_asignaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idasignacion,($("#checkBoleta").is(":checked"))?"checked":"");

        tablaAsignaciones.row("#"+record.idasignacion).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteAsignaciones.data,'idasignacion',idasignacion);
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.idmedidor= record.idmedidor;
        record2.codigo = record.codigo;
        record2.asig_codigo = record.asig_codigo;
        record2.idconsumidor= record.idconsumidor;
        record2.cons_nombre = record.cons_nombre;  
        record2.idubicacion= record.idubicacion;
        record2.ubic_nombre = record.ubic_nombre;    
        record2.iduso= record.iduso;
        record2.usos_nombre = record.usos_nombre;   
        record2.idtarifaedificio= record.idtarifaedificio;
        record2.tari_nombre = record.tari_nombre;  
        record2.asig_fechainicial = record.asig_fechainicial;
        record2.asig_fechafinal =   record.asig_fechafinal ;  
        record2.asig_porcentaje =  record.asig_porcentaje; 
        record2.idasignacionprevia = record2.idasignacionprevia;       
        record2.asig_activo = ($("#checkActivo").is(":checked"))?"t":"f";
        record2.local  = ($("#checkLocal").is(":checked"))?"t":"f";
        record2.calculos  = ($("#checkCalculos").is(":checked"))?"t":"f";
        record2.boleta  = ($("#checkBoleta").is(":checked"))?"t":"f";
    }

});