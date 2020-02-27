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
        var record = findObjectByKey(reporte.data,'idusuario',tablaUsuarios.rows( indexes ).data()[0]["idusuario"])
        $("#divOperaciones").removeClass("hidden").removeClass("box-warning").addClass("box-success");
        $("#lbTitulo").text("Modificar Usuario");
        $("#lbTituloDescripcion").text("Modificar usuario del Sistema");  
        usuarioActual = record;
        updateComponents(record)      
    });

});


$(document).ready(function(){




    $("#btnTogglePass").click(function(){
        var eye = $("#"+this.id+" i").hasClass('fa-eye');
        $("#"+this.id+" i").removeClass(eye?'fa-eye':'fa-eye-slash')
        .addClass(eye?'fa-eye-slash':'fa-eye'); 
        $('#'+$(this).attr("data-input")).attr("type",eye?"text":"password");
    });

    $("#btnRandomPass").click(function(){
        $('#'+$(this).attr("data-input")).val(makeid(10));
    });

    $("#btnSearchRut").click(function(){
        var rut = $("#"+$(this).attr("data-input")).val();
        loadPersona(rut);
    });

    $("#btnAceptar").click(function(){
        console.log($("#hdOperacion").val());
        
    });

    $("#btnNuevo").click(function(){
        $("#divOperaciones").removeClass("hidden").removeClass("box-warning").addClass("box-success");
        $("#lbTitulo").text("Ingresar Usuario");
        $("#lbTituloDescripcion").text("Ingresar nuevo usuario al Sistema");
        clearForm("#formUsuarios");
        $("#hdOperacion").val("ingresar");
        $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow");
    });

    $("#btnCancelar").click(function(){
        $("#divOperaciones").addClass("hidden");
        var divPosition = $("#btnNuevo").offset();
        $('html, body').animate({scrollTop: divPosition.top}, "slow");
        
    });

    /**
    * Transformar #TablaUsuarios a DataTables
    */

    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('change','.booleano_activo_usuarios',function(){       
        var id = $(this).attr("id");
        var activo = $(this).is(":checked");
        console.log(activo);
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
                var record = findObjectByKey(reporte.data,'idusuario',id);
                record.activo = (activo)?"t":"f";
                updateComponents(record);
                success( data );
                //tablaUsuarios.ajax.reload(null, false);
            }
        });
    });

            /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('change','.booleano_cambiar_usuarios',function(){
        var id = $(this).attr("id");
        var activo = $(this).is(":checked");
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"usuarios",
            primaryField: "idusuario",
            primaryValue:id,
            fieldName:'cambiar',
            fieldValue:activo,
            },
            dataType:'text',
            success:function(data){
                var record = findObjectByKey(reporte.data,'idusuario',id);
                record.cambiar = (activo)?"t":"f";
                updateComponents(record);
                success( data );
                tablaUsuarios.ajax.reload(null, false);
            }
        });
    });
});