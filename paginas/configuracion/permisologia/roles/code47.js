
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

    /*LISTO*/
    tablaRoles.on('select',function(event,dt,type,indexes){  
        if (paginaActiva.code == 47){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Roles");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteRoles.data,'idrol',tablaRoles.rows( indexes ).data()[0].idrol);
            rolActual = record;
            cargarrol(record);
        }
    });
    
    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('change','.booleano_activo_roles',function(event){   
        if (paginaActiva.code == 47){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"public.roles",
                primaryField: "idrol",
                primaryValue:id,
                fieldName:'activo',
                fieldValue:activo,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteRoles.data,'idrol',id);
                    record.activo = (activo)?"t":"f";
                    $("#checkActivo").attr("checked",(record.activo=='t'));
                    success2({msg : data} );
                    //tablaUsuarios.ajax.reload(null, false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            });
        }
    });

    $(document).on('click','#btnCancelar',function(event){
        if (paginaActiva.code == 47){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaRoles").offset().top}, "slow");
        }
    });

    /*LISTO*/
    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 47){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Ubicacion");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            $("#textNombre").val('');
            $("#textDescripcion").val('');
            $("#checkActivo").attr("checked",true);
        }
        //clearComponentes();       
    });

    /*LISTO*/
    $(document).on('click','#btnAceptar',function(event){
        if (paginaActiva.code == 47){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val()=="Ingresar") {
                if (validar("#FormaParametros")) {
                        guardar_roles();
                        tablaRoles.row({selected: true}).deselect();
                        tablaRoles.ajax.reload(false);
                } 
                else {
                }
            }
            else {
                if (validar("#FormaParametros")){
                    actualizar_roles(rolActual.idrol);
                }
                else{
                }
            }
        }
    });

    /*LISTO*/
    function cargarrol(record){
        $("#textNombre").val(record.nombre);
        $("#textDescripcion").val(record.descripcion);
        $("#checkActivo").attr("checked",(record.activo=='t'));
        loadPermisosAlmacenados(reportePermisos,record.idrol,tableParamsPermisos,'#tablaPermisos');
        loadDisponibles(reporteDisponibles,record.idrol,tableParamsDisponibles,"#tablaDisponibles");
    }

    /*LISTO*/
    function guardar_roles(){
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "public.roles";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "nombre"      : $("#textNombre").val(),
            "descripcion" : $("#textDescripcion").val(),
            "activo"   : $("#checkActivo").is(":checked")
        });
        elementos["returnFields"].push("idrol"); 
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

    /*LISTO*/
    function actualizar_roles(idrol){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "public.roles";
        elementos["primaryField"] = "idrol";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "text,text,boolean,integer";
        elementos["campos"].push({
            "update":{
                "nombre"      : $("#textNombre").val(),
                "descripcion" : $("#textDescripcion").val(),
                "activo"   : $("#checkActivo").is(":checked")
            },
            "primaryValue" : idrol,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    updaterecord(idrol);
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

    /*LISTO*/
    function updaterecord(idrol){
        var index = findObjectByKeyIndex(tablaRoles.rows().data(),'idrol',idrol);
        var record = tablaRoles.rows().data()[index]; 
        record.nombre = $("#textNombre").val();
        record.descripcion = $("#textDescripcion").val();
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_roles" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idrol,($("#checkActivo").is(":checked"))?"checked":"");
        tablaRoles.row("#"+record.idrol).data(record).invalidate().draw('page');                
        var record2 = findObjectByKey(reporteRoles.data,'idrol',idrol);
        record2.nombre = record.nombre;
        record2.descripcion = record.descripcion;
        record2.activo = ($("#checkActivo").is(":checked"))?"t":"f";
    }

    function loadPermisosAlmacenados(reporte,idrol,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/getTable2.php",
                type:"POST",
                dataType:'json',
                data:{
                    primaryField:"idrolpagina",
                    show : {
                        prefixid:1,
                        fields:["idrolpagina","nombretab","tipo_nombre","view","insert","update","delete"],
                        realtablename:'permisos',
                        deletebtn: false,
                        updatebtn:false
                    },
                    hide:["idrolpagina","idrol","idpagina"],
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"permisos_roles(%s,-1,'',true,'')".format(idrol),
                        orderby:[],
                        where:[],      
                    }
                ]
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
                    tablaPermisos = $(idtabla).DataTable(tableParams);   
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

    function loadDisponibles(reporte,idrol,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/getTable2.php",
                type:"POST",
                dataType:'json',
                data:{
                    primaryField:"idpagina",
                    show : {
                        prefixid:1,
                        fields:["idpagina","nombre","tipo_nombre","descripcion"],
                        realtablename:'Disponibles',
                        deletebtn: false,
                        updatebtn:false
                    },
                    hide:["idpagina"],
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"paginas_disponibles_rol(%s)".format(idrol),
                        orderby:[],
                        where:[],      
                    }
                ]
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
                    tablaDisponibles = $(idtabla).DataTable(tableParams);   
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
});