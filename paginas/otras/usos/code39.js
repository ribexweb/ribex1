$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_funciones_medidores',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"funciones_medidores",
            primaryField: "idfuncionmedidor",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtFunciones.ajax.reload(null, false);
            }
        });
    });


    $(document).on('click', '.delete_funciones_medidores', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtFunciones,
                        {tablename:"funciones_medidores",
                        primaryfield : "idfuncionmedidor",
                        idvalue: id,
                        });
    });
});