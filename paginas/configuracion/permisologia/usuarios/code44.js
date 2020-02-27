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

    tablaUsuarios.on( 'select', function ( e, dt, type, indexes ) {
        $("#hdOperacion").val("modificar");
        var record = findObjectByKey(reporteUsuarios.data,'idusuario',tablaUsuarios.rows( indexes ).data()[0]["idusuario"])
        $("#divOperaciones").removeClass("hidden").removeClass("box-warning").addClass("box-success");
        $("#lbTitulo").text("Modificar Usuario");
        $("#lbTituloDescripcion").text("Modificar usuario del Sistema");  
        usuarioActual = record;
        cargarUsuario(record);     
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }

    $(document).on('click','#btnTogglePass',function(event){
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var eye = $("#"+this.id+" i").hasClass('fa-eye');
            $("#"+this.id+" i").removeClass(eye?'fa-eye':'fa-eye-slash')
            .addClass(eye?'fa-eye-slash':'fa-eye'); 
            $('#'+$(this).attr("data-input")).attr("type",eye?"text":"password");
        }
    });

    $(document).on('click','#btnRandomPass',function(event){
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $('#'+$(this).attr("data-input")).val(makeid(10));
        }
    });

    $(document).on('change','.booleano_activo_usuarios',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var activo= $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios",
                primaryField: "idusuario",
                primaryValue:id,
                fieldName:'activo',
                fieldValue:activo,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteUsuarios.data,'idusuario',id);
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

    $(document).on('change','.booleano_cambiar_usuarios',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("id");
            var cambiar= $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios",
                primaryField: "idusuario",
                primaryValue:id,
                fieldName:'cambiar',
                fieldValue:cambiar,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reporteUsuarios.data,'idusuario',id);
                    record.cambiar = (cambiar)?"t":"f";
                    $("#checkCambiar").attr("checked",(record.cambiar=='t'));
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

    $(document).on('change','.booleano_view_permisos',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("data-idusuariopagina");
            var view= $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios_paginas",
                primaryField: "idusuariopagina",
                primaryValue:id,
                fieldName:'view',
                fieldValue:view,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reportePermisos.data,'idusuariopagina',id);
                    record.view = (view)?"t":"f";
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

    $(document).on('change','.booleano_insert_permisos',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("data-idusuariopagina");
            var insert= $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios_paginas",
                primaryField: "idusuariopagina",
                primaryValue:id,
                fieldName:'insert',
                fieldValue:insert,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reportePermisos.data,'idusuariopagina',id);
                    record.insert = (insert)?"t":"f";
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

    $(document).on('change','.booleano_update_permisos',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("data-idusuariopagina");
            var update = $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios_paginas",
                primaryField: "idusuariopagina",
                primaryValue:id,
                fieldName:'update',
                fieldValue:update,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reportePermisos.data,'idusuariopagina',id);
                    record.update = (update)?"t":"f";
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

    $(document).on('change','.booleano_delete_permisos',function(event){   
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var id = $(this).attr("data-idusuariopagina");
            var del= $(this).is(":checked");
            $.ajax({
                url:"php/updateField.php",
                method:"POST",
                data:{
                tableName:"usuarios_paginas",
                primaryField: "idusuariopagina",
                primaryValue:id,
                fieldName:'delete',
                fieldValue:del,
                },
                dataType:'text',
                success:function(data){
                    var record = findObjectByKey(reportePermisos.data,'idusuariopagina',id);
                    record.delete = (del)?"t":"f";
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
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            $("#divOperaciones").addClass("hidden");    
            $('html, body').animate({scrollTop: $("#tablaUsuarios").offset().top}, "slow");
        }
    });

    $(document).on('click','#btnNuevo',function(event){
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Ubicacion");
            $("#btnAceptar i").text("Ingresar"); 
            $("#hdOperacion").val("Ingresar");
            clearComponentes(); 
        }
        //clearComponentes();       
    });

    $(document).on('change','#selectRol',function(event){          
        if (paginaActiva.code == 44){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (evento) {
                loadPermisos(reportePermisos,this.value,tableParamsPermisos,"#tablaPermisos");
            }             
        }
    }); 

    function clearComponentes(){
        $("#textRut").val('');    
        $("#textNombres").val('');    
        $("#textApellidos").val('');    
        $("#textTelefono").val('');    
        $("#textDireccion").val('');    
        $("#textEmail").val('');    
        $("#textLogin").val('');    
        $("#textPassword").val('');    
        $("#selectRol").val($("#selectRol option:first").val());
        $("#selectRol").select2().trigger('change');  
        $("#selectDatabase").val($("#selectDatabase option:first").val());
        $("#selectDatabase").select2().trigger('change'); 
        $("#checkCambiar").attr("checked",true);   
        $("#checkActivo").attr("checked",true); 
    }

    function cargarUsuario(record){
        $("#textRut").val(record.rut); 
        $("#textNombres").val(record.nombres);
        $("#textApellidos").val(record.apellidos);
        $("#textTelefono").val(record.telefono);
        $("#textEmail").val(record.email);
        $("#textDireccion").val(record.direccion);
        $("#textLogin").val(record.login);
        $("#textPassword").val(record.dcry);
        $("#selectRol").val(record.idrol);
        $("#selectRol").select().trigger('change');
        $("#selectDatabase").val(record.database);
        $("#selectDatabase").select().trigger('change');
        $("#checkActivo").attr("checked",(record.asig_activo=='t'));
        $("#checkLocal").attr("checked",(record.local=='t'));
        loadPermisosAlmacenados(reportePermisos,record.idusuario,tableParamsPermisos,'#tablaPermisos');
    }

    function loadPermisosAlmacenados(reporte,idusuario,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/getTable2.php",
                type:"POST",
                dataType:'json',
                data:{
                    primaryField:"idusuariopagina",
                    show : {
                        prefixid:1,
                        fields:["idusuariopagina","nombretab","tipo_nombre","view","insert","update","delete"],
                        realtablename:'permisos',
                        deletebtn: false,
                        updatebtn:false
                    },
                    hide:["idusuariopagina"],
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"permisos_usuarios(%s,-1,'',true,'')".format(idusuario),
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


});