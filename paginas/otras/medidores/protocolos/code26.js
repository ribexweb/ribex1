$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_protocolos',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"protocolos",
            primaryField: "idprotocolo",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtProtocolos.ajax.reload(null, false);
            }
        });
    });

    $(document).on('click', '.delete_protocolos', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtProtocolos,
                        {tablename:"protocolos",
                        primaryfield : "idprotocolo",
                        idvalue: id,
                        });
    });
});