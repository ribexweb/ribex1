$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_servicios',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"servicios",
            primaryField: "idservicio",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtServicios.ajax.reload(null, false);
            }
        });
    });


    $(document).on('click', '.delete_servicios', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtServicios,
                        {tablename:"servicios",
                        primaryfield : "idservicio",
                        idvalue: id,
                        });
    });
});