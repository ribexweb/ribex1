$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_espacios',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"espacios",
            primaryField: "idespacio",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtEspacios.ajax.reload(null, false);
            }
        });
    });


    $(document).on('click', '.delete_espacios', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtEspacios,
                        {tablename:"espacios",
                        primaryfield : "idespacio",
                        idvalue: id,
                        });
    });
});