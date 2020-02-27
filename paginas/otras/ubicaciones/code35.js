$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_ubicaciones',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"ubicaciones",
            primaryField: "idubicacion",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtUbicaciones.ajax.reload(null, false);
            }
        });
    });


    $(document).on('click', '.delete_ubicaciones', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtUbicaciones,
                        {tablename:"ubicaciones",
                        primaryfield : "idubicacion",
                        idvalue: id,
                        });
    });
});