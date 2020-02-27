<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content-header">
    <h1>
        Promedio de Consumo
        <small>Grupo de Medidores en Franja Horaria</small>
    </h1>
</section>
<style>
.only-timepicker .datepicker--nav,
.only-timepicker .datepicker--content {
    display: none;
}
.only-timepicker .datepicker--time {
    border-top: none;
}
</style>
<section class="content">
    <div class="row">
        <!-- left column -->
        <div class="col-md-3">
            <!-- general form elements -->
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Parámetros</h3>
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                <form id="Forma" role="form">
                    <div class="box-body">
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Edificio</label>
                                <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Grupos</label>
                                <select id="SelectCategoria" name="SelectCategoria" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Fecha Inicial</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off">
                                    <span id="iconoFechaInicial" class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                </div>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Fecha Final</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="TextFechaFinal" name="TextFechaFinal" autocomplete="off">
                                    <span id="iconoFechaFinal" class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                </div>
                            </div>
                        </div>  
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Hora Inicial</label>
                                <div class="input-group">
                                    <input type="text" class="form-control only-time" id="TextHoraInicial" name="TextHoraInicial" autocomplete="off">
                                    <span id="iconoHoraInicial" class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                                </div>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Hora Final</label>
                                <div class="input-group">
                                    <input type="text" class="form-control only-time" id="TextHoraFinal" name="TextHoraFinal" autocomplete="off">
                                    <span id="iconoHoraFinal" class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                                </div>
                            </div>
                        </div>      
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                        <button id="btnCancelar" type="button" class="btn btn-danger pull-right disabled" style='margin-left: 5px'><i class="fa fa-stop-circle"> </i> Cancelar</button>
                        <button id="btnBuscar" type="button" class="btn btn-primary pull-right"><i class="fa fa-search"> </i> Buscar</button>    
                    </div>
                </form>
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header">
                    <h3 class="box-title">Consumos Promedios de Energia</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body"> 
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box-tools pull-right">
                                <a id="btnSalvar" class="btn"><i class="fa fa-save"></i></a>                                    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <canvas id="graphConsumoFranja"  style="height: 295px; width: 590px;" width="590" height="295"></canvas>
                            <div id="container-loading" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">
                                <div id="loading" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">

                                </div>
                            </div>
                        </div>   
                    </div>           
                </div>
                <!-- /.box-body -->
            </div>
            <div id='box-detalle' class="box box-primary hidden">
                <div class="box-header">
                    <h3 class="box-title">Consumo de Energia en Detalle</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body"> 
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box-tools pull-right">
                                <a id="btnResetDetalle" class="btn"><i class="fa fa-refresh"></i></a>
                                <a id="btnBorrarDetalle" class="btn"><i class="fa fa-eraser"></i></a>
                                <a id="btnSalvarDetalle" class="btn"><i class="fa fa-save"></i></a>                                    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <canvas id="graphConsumoFranjaDetalle"  style="height: 295px; width: 590px;" width="590" height="295"></canvas>
                            <div id="container-loading-detalle" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">
                                <div id="loading-detalle" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">

                                </div>
                            </div>
                        </div>  
                    </div>            
                </div>
                <!-- /.box-body -->
            </div>
        </div>
    </div>
</section>

<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>

<script type="text/javascript" language="javascript">
var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
reporte = {activo:false,inicio:0,final:0,hidden:null};
tbMedidores= new Object({fechas:[],Medidores:new Object()});
dataSQL = {todo:null};
$("#loading").html(graphLoading());

    var graphTargetConsumoFranja = $("#graphConsumoFranja"); 

    var barChartData = {
        labels: [],
        datasets: [{
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            data: []
        }]
    };

    var barGraphConsumoFranja = new Chart(graphTargetConsumoFranja, {
        type: 'bar',
        data: barChartData,
        options: {
            events: ['click'],
            responsive: true,
            legend: {
                display:false,
                position: 'top',
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Energía kWh'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }]
            },
            plugins:{
                labels:[
                {
                     render : function (args) {

                                value = parseFloat(args.value);
                                value = +(Math.round(value + "e+2")  + "e-2");
                                o_value = value.toLocaleString("es");
                                return (value>0)?o_value+' kWh':"";    
                     },
                     position: 'outside'
                }]
            },
            tooltips: { 
                callbacks: {
                    label: function(tooltipItem, data) {
                        value = parseFloat(tooltipItem.yLabel);
                        value = +(Math.round(value + "e+2")  + "e-2");
                        o_value = value.toLocaleString("es");
                        return (value>0)?o_value+' kWh':""; 
                    },
                }
            } 
        }
    });

    $("#loading").html(graphLoading());
    var image = new Image();
    image.src = "images/logo.png";
    image.width = 200;
    image.height= 200; 

    $("#loading-detalle").html(graphLoading());

    var graphTargetConsumoFranjaDetalle = $("#graphConsumoFranjaDetalle");
    var timeFormat = 'MM/DD/YYYY HH:mm';
    var chartDataConsumoFranjaDetalle = {
        labels: [],
        datasets: []
    };

    var barGraphConsumoFranjaDetalle = new Chart(graphTargetConsumoFranjaDetalle, {
        type: 'line',
        data: chartDataConsumoFranjaDetalle,
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tiempo'
                    },
                    time: {
                        unit:'hour',
                        displayFormats: {
                            hour: 'MMM/DD HH:mm'
                        }   
                    }
                }],
                yAxes: [{
                    id: "y-axis-1",
                    scaleLabel: {
                        display: true,
                        labelString: 'Valor'
                    },
                    ticks: {
                        beginAtZero:false,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }]
            },
            tooltips: { 
                callbacks: {
                    label: function(tooltipItem, data) {
                        value = parseFloat(tooltipItem.yLabel);
                        value = +(Math.round(value + "e+2")  + "e-2");
                        o_value = value.toLocaleString("es");
                        return (value>0)?o_value:""; 
                    },
                }
            },
            pan: {
                enabled: true,
                mode: "x",
                speed: 10,
                threshold: 10
            },
            zoom: {
                enabled: true,
                drag: true,
                mode: 'x',
                limits: {
                    max: 10,
                    min: 0.5
                }
            },
            watermark: {
                image: image,
                x: 0,
                y: 10,
                //width: 108,
                //height: 39,
                opacity: 0.1,
                alignX: "middle",
                alignY: "middle",
                position: "back",
            },
            annotation: {
                annotations: [
                ]
            }
        }
    });


$( document ).ready(function() {
    $('.select2').select2();

    $('#iconoFechaInicial').click(function(event){
        event.preventDefault();
        $('#TextFechaInicial').focus();
    });
    $('#iconoFechaFinal').click(function(event){
        event.preventDefault();
        $('#TextFechaFinal').focus();
    });

    $('#iconoHoraInicial').click(function(event){
        event.preventDefault();
        $('#TextHoraInicial').focus();
    });
    $('#iconoHoraFinal').click(function(event){
        event.preventDefault();
        $('#TextHoraFinal').focus();
    });


    $("#graphConsumoFranja").click( 
        function(evt){
            var activePoints = barGraphConsumoFranja.getElementsAtEvent(evt);
            if (activePoints[0]) {
                var chartData = activePoints[0]['_chart'].config.data;
                var idx = activePoints[0]['_index'];
                var label = chartData.labels[idx];
                var value = chartData.datasets[0].data[idx];
                $("#box-detalle").removeClass('hidden');
                graphResetZoom(barGraphConsumoFranjaDetalle); 
                cargarGrafico(false,reporte.hidden[idx],value,label);
                
            }
 
        }
    );                 
    //$('#example1').DataTable();

    $('#btnBuscar').click(function(){
            if (!(reporte.activo)){
                var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
                $("#container-loading").removeClass("hidden");
                graficoBarraJs2(
                        reporte,
                        barGraphConsumoFranja,
                        {   
                            fieldNameX:"valorx",
                            fieldNameY:"valor",
                            hidden:"idmedidor",
                            queries:[{
                                fieldsSelect:["*,coalesce(substring(espa_nombre,1,10),codigo) as valorx"],
                                tableName   :"mediciones.consumo_franja_horaria(%s,23,'%s','%s','%s','%s','%s')".format($("#SelectCategoria").val(),$("#TextFechaInicial").val(),$("#TextFechaFinal").val(),$("#TextHoraInicial").val(),$("#TextHoraFinal").val(),database),
                                orderby:[{
                                    field:"valor",
                                    type : "asc NULLS FIRST"
                                }],
                                where: [{
                                    field:"idmedidorfisico",
                                    oper:"<>",
                                    value:106,
                                    type:"int"
                                },
                                {   logical:'and',
                                    field:"valor",
                                    oper:"<>",
                                    value:0,
                                    type:"int"
                                }],        
                            }],
                        },
                        {   
                            loading: "#container-loading",
                        }
                    );
            }
            else {
                error("Reporte Solicitado, espere a que finalice la consulta");
            }
    }); 
});



        if (edificios != '') {
        selectJs2(
            "#SelectEdificio",
            { 
                value: "idedificio",
                show: {
                    fields:["nombre"],
                },
                hide: ["idedificio"],
                queries:[{
                    fieldsSelect:["edificios.idedificio","entidades.nombre"],
                    tableName   :"(mediciones.edificios left join mediciones.entidades using (identidad))",
                    orderby:[{
                        field:"entidades.nombre",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"entidades.activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {
                        logical:"and",
                        field  :"edificios.idedificio",
                        oper   :"in",
                        value  :"("+edificios+")",
                        type   :"int",  
                    }]        
                }],
            },
            {
            }    
        );
    }
    else{
        $("#SelectEdificio").prop("disabled",true);
    }

    $("#SelectEdificio").bind("change",function(){
        if ($("#SelectEdificio").val() != -1) {
            // barGraphDemandaGeneralDiaria.options.watermark.image.src = "images/graph/logo%s.png".format($("#SelectEdificio").val());
        }
        selectJs2(
            "#SelectCategoria",
            { 
                value: "idcategoria",
                show: {
                    fields:["nombre","descripcion"],
                    format: "%s | %s"
                },
                hide: [],
                queries:[{
                    fieldsSelect: ["*"],
                    tableName   :"mediciones.categorias",
                    orderby:[{
                        field:"idcategoria",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",     
                    },
                    {
                        logical:"and",
                        field  :"idedificio",
                        oper   :"=",
                        value  :$("#SelectEdificio").val(),
                        type   :"int",  
                    }]        
                }],
            },
            {
            }    
        );
    });   

    $('#TextFechaInicial').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        //timeFormat: 'hh:ii',
        timepicker: false,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 
    $('#TextFechaFinal').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        //timeFormat: 'hh:ii',
        timepicker: false,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 
    
    $('#TextHoraInicial').datepicker({
        dateFormat: ' ',
        timepicker: true,
        classes: 'only-timepicker'
    });

    $('#TextHoraFinal').datepicker({
        dateFormat: ' ',
        timepicker: true,
        classes: 'only-timepicker'
    });

    $("#btnResetDetalle").click(function(){
        graphResetZoom(barGraphConsumoFranjaDetalle);    
    });





    function cargarGrafico(borrar,medidor,promedio,titulo){
        animacion = true;
        graphDelete(barGraphConsumoFranjaDetalle);
        tbMedidores= new Object({fechas:[],Medidores:new Object()});
        var scale = setXScale(moment($("#TextFechaInicial").val()),moment($("#TextFechaFinal").val()));
        //var medidor = $("#SelectMedidor option:selected").text().split('|');
        //var tipo = $('input:radio[name=tipo]:checked').val();
        //var variable = $("#SelectVariable option:selected").text().split('|');
        var tipo = 'AVG';
        var variable = 23
        var fechainicial = $("#TextFechaInicial").val();
        var fechafinal = $("#TextFechaFinal").val();
        var horainicial = $("#TextHoraInicial").val();
        var horafinal = $("#TextHoraFinal").val();
        $("#container-loading-detalle").removeClass("hidden");
        var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
        if (!(reporte.activo)){
            barGraphConsumoFranjaDetalle.options.scales.xAxes[0].time.unit = scale.medida;
            graficoLinealJs2(
                reporte,
                barGraphConsumoFranjaDetalle,
                {   
                    zero : true,
                    titulo: titulo,
                    fieldNameX:"fecha",
                    fieldNameY:"valor",
                    parseFecha: "YYYY-MM-DD HH:mm:ss",
                    queries:[{
                        fieldsSelect:["TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi') as fecha, trunc(%s(valor)) as valor ".format(tipo)],
                        tableName   :"mediciones.consultar_medidor_variable(%s,%s,'%s','%s','%s') group by TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi')".format(medidor,variable,fechainicial+' 00:00:00',fechafinal+' 23:59:59',database),
                        orderby:[{
                            field:"fecha",
                            type : "asc"
                        }],        
                    }],
                },
                {   
                    medidor:medidor,
                    variable: variable,
                    tipo:tipo,
                    fechainicial:fechainicial,
                    fechafinal:fechafinal,
                    horainicial:horainicial,
                    horafinal:horafinal,
                    medidores:tbMedidores,
                    loading: "#container-loading-detalle",
                    promedios :[{
                        id: 'lbAvgFranja',
                        label:'Franja',
                        promedio: promedio,
                        colorBase:'red',
                        unidad:'kW',
                    }]
                }
            );
        }
        else {
            error("Grafico Solicitado, espere a que finalice la consulta");
        }
    }

</script>

<?php
}
else{
  echo "sin permiso";
}
?>