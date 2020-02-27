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

    
    $(document).on('click','.descargar_boletas_medidor',function(){
        var id = $(this).attr("data-idremarcacionasignacion");
        generar_boleta(id);
    });



});