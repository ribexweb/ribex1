$(document).ready(function(){
    /**
    * Transformar #TablaUsuarios a DataTables
    */


    /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_activo_vvariables',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"variables",
            primaryField: "idvariable",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtVariables.ajax.reload(null, false);
            }
        });
    });

            /**
    * Evento que ocurre al hacer click en el boton 
    * Activar o Desactivarde la Datatable Usuarios
    */
    $(document).on('click','.booleano_virtual_vvariables',function(){
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
            url:"php/updateField.php",
            method:"POST",
            data:{
            tableName:"variables",
            primaryField: "idvariable",
            primaryValue:id,
            fieldName:'virtual',
            fieldValue:!(activo),
            },
            dataType:'text',
            success:function(data){
                success( data );
                dtVariables.ajax.reload(null, false);
            }
        });
    });

    $(document).on('click', '.delete_vvariables', function(){
    var id = $(this).attr("id");
    var a = confirmar(dtVariables,
                        {tablename:"variables",
                        primaryfield : "idvariable",
                        idvalue: id,
                        });
    });
});