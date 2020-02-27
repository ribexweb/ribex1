$( document ).ready(function() {
    $('.select2').select2();


    //Evento Change para el Control Select Edificio



    $('#SelectMedidor').select2({
        templateResult: function(data) {
            var r = data.text.split('|');
            var result = '<div>';
            for (var index=0;index<r.length;index++){
                result += '<div>' + r[index] + '</div>';
            }                            
                result += '</div>';
            return $(result);
        }
    });

    
    $(document).on('click','.descargar_boletas_periodo',function(){
        var ano = $(this).attr("data-ano");
        var mes = $(this).attr("data-mes");
        var idasignacion = $(this).attr("data-idasignacion");
        var idedificio = $(this).attr("data-idedificio");
        var grupo = $(this).attr("data-grupo");
        if (grupo != "0"){
            var File = "paginas/herramientas/boletas/archivos/%s/%s/%s/%s/%s.jpg".format(idedificio,ano,mes,grupo,idasignacion);
        }
        else {
            var File = "paginas/herramientas/boletas/archivos/%s/%s/%s/%s.jpg".format(idedificio,ano,mes,idasignacion);
        }
        descargar(File,ano,mes,idasignacion,grupo);
    });



});