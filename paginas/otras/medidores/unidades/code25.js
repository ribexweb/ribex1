$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_unidades',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"unidades",
            primaryField: "idunidad",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtUnidades.ajax.reload(null, false);
            }
        });
    });

            /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_cambiar_vusuarios',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"usuarios",
            primaryField: "idusuario",
            primaryValue:id,
            fieldName:'cambiar',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtUsuarios.ajax.reload(null, false);
            }
        });
    });

    $(document).on('click', '.delete_unidades', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtUnidades,
                        {tablename:"unidades",
                        primaryfield : "idunidad",
                        idvalue: id,
                        });
    });
});