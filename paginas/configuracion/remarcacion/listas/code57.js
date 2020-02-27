
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

    tablaListas.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Listas");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            $("#fileCSV").val('');
            var record = findObjectByKey(reporteListas.data,'idlista',tablaListas.rows( indexes ).data()[0].idlista);
            ListaActual = record;
            cargarListas(record);    
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
        }     
    });

    tablaValores.on( 'select', function (event, dt, type, indexes ) {
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var record = findObjectByKey(reporteValores.data,'idasignacion',tablaValores.rows( indexes ).data()[0].idasignacion);
            $("#hdIdAsignacion").val(record.idasignacion);
            $("#TextAsignacion").val(record.idasignacion);
            $("#TextMedidor").val(record.codigo);
            $("#TextValor").val(record.valor); 
            $("#btnActualizar").attr("disabled",false);
        }
    });
 
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
	}



    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val() == "Ingresar") {
                loadValores(reporteValores,this.value,tableParamsValores,"#tablaValores");
            }
        }
    });

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    $(document).on('click','#btnActualizar',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar("#FormaActualizacion")) {
                var index = findObjectByKeyIndex(tablaValores.rows().data(),'idasignacion',$("#hdIdAsignacion").val());
                var record = tablaValores.rows().data()[index];
                record.valor = parseFloat($("#TextValor").val());
                success2({msg:"Valor para asignación %s actualizado con Éxito".format($("#TextAsignacion").val())})
                tablaValores.row("#"+record.idasignacion).data(record).invalidate().draw('page');
            }
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaListas").offset().top}, "slow");
        }
    });

    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
            if (validar("#FormaParametros")) {
                    if (tablaValores.rows().data().count() > 0) {
                        guardar_listas();
                        confirmarModificar(tablaListas,{
                            titulo:'Confirmación',
                            msg:"¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                            btnSi : "#btnNuevo",
                        });
                    }
                    else {
                        error2({msg:'Tabla de Valores Vacía'});
                    }
            } 
            else {
                //error2({msg:'error'});
            }
                
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_lista(ListaActual);
                }
                else{
                // error2({msg:'error'});
                }
            }
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Lista");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            clearComponentes();   
        }    
    });

    $(document).on('change','.booleano_activa_listas',function(event){   
        if (paginaActiva.code == 57){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Listas",
                "remarcacion.listas",
                {field:"idlista",value:id,type:'integer'},
                {name:'activa',value:activo,type:'boolean'},
                {name:'idlista',value:id},
                reporteListas,
                "#checkActivo"
            );
        }
    });

    function clearComponentes(){
        $("#SelectEdificio").val($("#SelectEdificio option:first").val());
        $("#SelectEdificio").select2().trigger('change');  
        $("#TextNombre").val('');
        $("#SelectTipo").val($("#SelectTipo option:first").val());
        $("#SelectTipo").select2().trigger('change'); 
        $("#SelectTipoDato").val($("#SelectTipoDato option:first").val());
        $("#SelectTipoDato").select2().trigger('change');            
        $("#TextFecha").val(moment().format("YYYY-MM-DD"));
        $("#TextDescripcion").val('');
        $("#checkActivo").attr("checked",true);
        $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");           
    }

    function cargarListas(record){
        $("#TextFecha").val(record.fecha);
        $("#TextNombre").val(record.nombre);
        $("#TextDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activa=='t'));
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');
        $("#SelectTipo").val(record.tipo);
        $("#SelectTipo").select2().trigger('change');
        $("#SelectTipoDato").val(record.tipodato);
        $("#SelectTipoDato").select2().trigger('change');        
        loadValoresAlmacenados(reporteValores,record.idlista,tableParamsValores,"#tablaValores");    
    }

    function loadValores(reporte,idedificio,tableParams,idtabla){
        console.log('nuevos');
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["idasignacion","codigo","cons_nombre","espa_nombre","0 as valor"],
                        tableName   :"mediciones.vmedidores",
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[{
                            field:"idedificio",
                            oper:"=",
                            value:idedificio,
                            type:"int"    
                        }],        
                    }
                ]
                },
                success: function(data){           
                    reporte.activo = false;  
                    reporte.data = data[0].resultados;  
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                    }; 
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaValores = $(idtabla).DataTable(tableParams);   
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

    function loadValoresAlmacenados(reporte,idlista,tableParams,idtabla){
        console.log('modificados');
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.vvaloreslistas",
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[{
                            field:"idlista",
                            oper:"=",
                            value:idlista,
                            type:"int"    
                        }],      
                    }
                ]
                },
                success: function(data){           
                    reporte.activo = false;  
                    reporte.data = data[0].resultados;  
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        $(idtabla).append('<tfoot><th></th><th></th><th></th><th></th><th></th></tfoot>');
                    }; 
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaValores = $(idtabla).DataTable(tableParams);   
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

    function guardar_valores_lista(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "remarcacion.valores_listas";
        elementos["operacion"] = "Ingresar";
        arguments[0].valores.forEach(function (value, index){
            elementos["campos"].push({
                "idlista"      : argumentos[0].idlista,
                "idasignacion" : value.idasignacion,
                "valor"        : value.valor,
            });
        });         
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
                    guardar_log(argumentos[0].idlista,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    tablaListas.row({selected: true}).deselect();
                    tablaListas.ajax.reload();
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

    function guardar_listas(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.listas";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "nombre"     : $("#TextNombre").val(),
            "fecha"      : $("#TextFecha").val(),
            "tipo"       : $("#SelectTipo").val(),
            "tipodato"   : $("#SelectTipoDato").val(),
            "idedificio" : $("#SelectEdificio").val(),
            "descripcion": $("#TextDescripcion").val(),
            "activa"     : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idlista"); 
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
                        guardar_log(data[0].return[0]["idlista"],elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                        guardar_valores_lista({
                            idlista:data[0].return[0]["idlista"],
                            valores:reporteValores.data
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

    function eliminar_valores_lista(idLista){
        var elementos = {}
        elementos["tableName"] = "remarcacion.valores_listas";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field:"idlista",
            oper:"=",
            value:idLista,
            type:"int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    guardar_log(idLista,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["where"]),usuarioActivo);
                    guardar_valores_lista({
                        idlista:idLista,
                        valores:reporteValores.data
                    });
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

    function actualizar_lista(Lista){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.listas";
        elementos["primaryField"] = "idlista";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,date,integer,integer,integer,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "nombre"     : $("#TextNombre").val(),
                "fecha"      : $("#TextFecha").val(),
                "tipo"       : $("#SelectTipo").val(),
                "tipodato"   : $("#SelectTipoDato").val(),
                "idedificio" : $("#SelectEdificio").val(),
                "descripcion": $("#TextDescripcion").val(),
                "activa"     : $("#checkActivo").is(":checked")
            },
            "primaryValue" : Lista.idlista,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(Lista.idlista);
                    guardar_log(Lista.idlista,elementos["tableName"],elementos["operacion"],JSON.stringify(elementos["campos"]),usuarioActivo);
                    eliminar_valores_lista(Lista.idlista);
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

    function updaterecord(idLista){
        var index = findObjectByKeyIndex(tablaListas.rows().data(),'idlista',idLista);
        var record = tablaListas.rows().data()[index]; 
        record.nombre = $("#TextNombre").val();
        record.idedificio = $("#SelectEdificio").val()
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.tipo = $("#SelectTipo").val();
        record.tipo_descripcion = $("#SelectTipo").select2('data')[0].text;
        record.tipodato = $("#SelectTipoDato").val();
        record.tipodato_descripcion = $("#SelectTipoDato").select2('data')[0].text;
        record.fecha = $("#TextFecha").val();
        record.descripcion = $("#TextDescripcion").val();
        record.activa = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_listas" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idtarifaedificio,($("#checkActivo").is(":checked"))?"checked":"");
        tablaListas.row("#"+record.idlista).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteListas.data,'idlista',idLista);
        record2.nombre = record.nombre;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.tipo = record.tipo;
        record2.tipo_descripcion = record.tipo_descripcion;
        record2.tipodato_descripcion = record.tipodato_descripcion;
        record2.tipodato = record.tipodato;
        record2.fecha = record.fecha;
        record2.descripcion = record.descripcion;
        record2.activa = ($("#checkActivo").is(":checked"))?"t":"f";
    }

    document.getElementById('fileCSV').addEventListener('change', upload, false);

    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
        }
        return isCompatible;
    }

    function upload(evt) {
        if (!browserSupportFileUpload()) {
            error2({msg:'Las API para manejo de Archivos no estan disponibles en este Navegador!'});
        } 
        else {
            console.log('importar csv '+evt.target.files[0]);
            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                csvData = csvData.replace(/"/g, "");
                data = $.csv.toArrays(csvData,{"separator" : ";"});
                reporteValores.data = [];
                var columnas = ["idasignacion","codigo","cons_nombre","espa_nombre","valor"];
                data.forEach(function(element,index){
                    if (index != 0) {
                        var record = {};
                        element.forEach(function(e,i){
                            record["%s".format(i)] = (columnas[i] == "valor")?e.replace(',','.'):e;
                            record[columnas[i]]    = (columnas[i] == "valor")?e.replace(',','.'):e;
                                
                        })
                        reporteValores.data.push(record);
                    }
                });
                console.log(tableParamsValores);
                tableParamsValores.aaData = reporteValores.data;
                tableParamsValores.data = reporteValores.data;
                tablaValores = $("#tablaValores").DataTable(tableParamsValores); 
                $("#fileCSV").val('');
            };
            reader.onerror = function() {
                error2({msg:'No se puede leer el archivo' + file.fileName});
            };
        }
    }
});