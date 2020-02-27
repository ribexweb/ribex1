$( document ).ready(function() {
    $('.select2').select2();

    $('#iconoFecha').click(function(event){
        event.preventDefault();
        $('#TextFecha').focus();
    });

    $('#iconoFechaInicial').click(function(event){
        event.preventDefault();
        $('#TextFechaInicial').focus();
    });

    $('#iconoFechaFinal').click(function(event){
        event.preventDefault();
        $('#TextFechaFinal').focus();
    });

    $('#btnGenerar').click(function(event){
        event.preventDefault();
        $('#btnCalcular').removeClass("disabled");
        idtarifa = $("#SelectTarifa").val();
        loadCargosTarifas(reportePrecios,$("#SelectTarifa").val(),tableParamsPrecios,"#tablaPrecios");
    }); 

    $('#btnCalcular').click(function(event){
        event.preventDefault();
        loadAsignaciones2(reporteAsignaciones,$("#SelectEdificio").val(),$("#SelectTarifa").val(),"#tablaAsignaciones");
    }); 

    $('#btnGuardar').click(function(event){
        event.preventDefault();
        guardar_remarcaciones({
            fecha: $("#TextFecha").val(),
            idprecio : $("#SelectPrecio").val(),
            idedificio : $("#SelectEdificio").val(),
            idtarifa   : $("#SelectTarifa").val(),
        });
    }); 

    $('#tablaAsignaciones tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            $('#tablaAsignaciones tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $("#SelectPrecio").change(function(){        
        var rango = $(this).select2('data')[0].text.split("|")[1].split("al");
        $("#TextFechaInicial").val(rango[0].trim());
        $("#TextFechaFinal").val(rango[1].trim());
        loadCargosTarifas(reportePrecios,$("#SelectPrecio").val(),tableParamsPrecios,"#tablaPrecios");
    });


});