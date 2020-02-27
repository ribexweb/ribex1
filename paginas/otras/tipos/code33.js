$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_tipos_proveedores',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"tipos_proveedores",
            primaryField: "idtipoproveedor",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtTipos.ajax.reload(null, false);
            }
        });
    });


    $(document).on('click', '.delete_tipos_proveedores', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtTipos,
                        {tablename:"tipos_proveedores",
                        primaryfield : "idtipoproveedor",
                        idvalue: id,
                        });
    });
});