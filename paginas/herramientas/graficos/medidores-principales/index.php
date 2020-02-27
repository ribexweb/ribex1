<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>

<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content-header">
      <h1>
        Energía Medidores Principales
        <small>Gráficos de Energia ingresada en Medidores Principales</small>
      </h1>
</section>
<section class="content">
    <div class="row">
        <!-- left column -->
        <div class="col-md-3">
          <!-- general form elements -->
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Parámetros</h3>
                    <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <!-- /.box-header -->
                <div class="box-body" style="">
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
                                    <label>Fecha Inicial</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control datetime" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off">
                                        <span id="iconoFecha" class="input-group-btn">
                                            <button data-input="TextFechaInicial" type="button" id="btnFechaInicial" class="btn btn-success custom icono">
                                                <i class='fa fa-calendar-day'></i>
                                            </button>
                                        </span> 
                                    </div>
                                </div>
                            <!--<span id="iconoFechaInicial" class="input-group-addon"><i class="fa fa-calendar"></i></span>-->
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-12">
                                    <label>Fecha Final</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control datetime" id="TextFechaFinal" name="TextFechaFinal" autocomplete="off">
                                        <span id="iconoFecha" class="input-group-btn">
                                            <button data-input="TextFechaFinal" type="button" id="btnFechaFinal" class="btn btn-success custom icono">
                                                <i class='fa fa-calendar-day'></i>
                                            </button>
                                        </span> 
                                    </div>
                                </div>
                            </div>    
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer">
                            <div class="col col-md-3">
                            </div>
                            <div class="col col-md-6">
                                <button id="btnNuevo" type="button" class="btn btn-block btn-primary">Nuevo</button>
                            </div>  
                            <div class="col col-md-3">
                            </div>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
        <!--/.col (left) -->
       <!--<div class="col-md-9">
            <div class="box box-danger">
                <div class="box-header with-border">
                    <h3 id="titulo-grafico" class="box-title">Gráfico de Energía Medidores Principales</h3>
                    <div class="box-tools pull-right">
                        <a id="btnBorrar" class="btn"><i class="fa fa-eraser"></i></a>
                        <a class="btn"><i class="fa fa-save"></i></a>
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                    </div>
                </div>
                <div class="box-body" style="">
                    <canvas id="graphDemandaGeneralDiaria" style="height: 295px; width: 590px;" width="590" height="295"></canvas>
                </div>
            </div>
        </div>-->
        <div class="col-md-9">
            <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#grafico" data-toggle="tab" aria-expanded="true">Gráfico</a></li>
                    <li class=""><a href="#datos" data-toggle="tab" aria-expanded="false">Datos</a></li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="grafico">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="box-tools pull-right">
                                    <a id="btnBorrar" class="btn btn-danger"><i class="fa fa-eraser"></i></a>
                                    <a id="btnGuardar" class="btn btn-success"><i class="fa fa-download"></i></a>                                    
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <canvas id="graphDemandaGeneralDiaria"  style="height: 295px; width: 590px;" width="590" height="295"></canvas>
                                <div id="container-loading" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">
                                    <div id="loading" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">

                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                    <div class="tab-pane" id="datos">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="box-tools pull-right">
                                    <a id="btnExcel" class="btn"><i class="fa fa-file-excel-o"></i></a>
                                    <a id="btnCsv" class="btn"><i class="fa fa-file-text-o"></i></a>
                                    <a id="btnPdf" class="btn"><i class="fa fa-file-pdf-o"></i></a>
                                    <a id="btnPrint" class="btn"><i class="fa fa-print"></i></a>                                    
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <table id="tabla" class="table table-bordered table-striped"  style="width:100%">
                                    <thead class='text-center'>
                                        <tr><td id='tbEdificio' colspan=4>Arauco Maipú</td></tr>
                                        <tr><td id='tbRango' colspan=4>Rango Desde: Hasta:</td></tr>
                                        <tr><td class='text-center' width='40%'>Descripción</td>
                                            <td class='text-center' width='20%'>Valor</td>
                                            <td class='text-center' width='20%'>Unidad</td>
                                            <td class='text-center' width='20%'>Porcentaje</td></tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code13.js?<?php echo time(); ?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src="jscript/chart.js/chartjs-plugin-labels.js"></script>
<script type="text/javascript">
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0};

    //get the doughnut chart canvas
    $("#loading").html(graphLoading());
    var color = Chart.helpers.color;

    $("#TextFechaFinal").val(moment().format("YYYY-MM-DD")+' 00:00');
    $("#TextFechaInicial").val(moment().subtract(1, 'month').format("YYYY-MM-DD")+' 00:00');

    var graphTargetDemandaGeneralDiaria = $("#graphDemandaGeneralDiaria");
    //doughnut chart data
    var chartDataDemandaGeneralDiaria = {
        labels: [],
        datasets: [{
            label: "",
            data: [],
            backgroundColor: [],
            borderWidth: 13
        }]
    };
    //create Chart class object
    Chart.defaults.global.defaultFontColor = 'black';
    var barGraphDemandaGeneralDiaria = new Chart(graphTargetDemandaGeneralDiaria, {
        type: "doughnut",
        data: chartDataDemandaGeneralDiaria,
        options:{
            responsive:true,
            title: {
                display: true,
                text: '',
                fontSize:14,
                fontStyle: 'normal',
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var index = tooltipItem.index;
                        value = parseFloat(dataset.data[index]);
                        value = +(Math.round(value + "e+2")  + "e-2");
                        o_value = value.toLocaleString("es");
                        return dataset.labels[index] + ': ' + o_value +' kWh';
                    }
                }
            }, 
            plugins:{
                datalabels: {
						display: function(context) {
							return false;
                        },
                        fontSize:14,
                },   
                labels:[{
                     render : function (args) {return args.percentage+"%";},
                     fontSize:14,
                },
                {
                     render : function (args) {
                                value = parseFloat(args.value);
                                value = +(Math.round(value + "e+2")  + "e-2");
                                o_value = value.toLocaleString("es");
                        return args.dataset.labels[args.index]+'\n'+o_value+' kWh';},
                     position: 'outside',
                     fontSize:14,
                }]
            }
        }
    });

    $('.datetime').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 





        var dtTable = $("#tabla").DataTable({
          "bInfo" : false,
          paging:false,
          searching:false,
          showing:false,
          responsive:true,
          destroy:true,
          buttons: [
              {extend:'excel',text:'<i class="fa fa-file-excel-o"></i>',titleAttr:'Exportar a Excel'},
              {extend:'csv', fieldSeparator: ';',text:'<i class="fa fa-file-text-o"></i>',titleAttr:'Exportar a CSV'},
              {extend:'pdf',text:'<i class="fa fa-file-pdf-o"></i>',titleAttr:'Exportar a PDF'},
              {extend:'print', text:'<i class="fa fa-print"></i>',titleAttr:'Enviar a impresión'}
          ],
          language: {
            "decimal": ",",
            "thousands": "."
          }
        });


        if (edificios != '') { //Si tiene uno o varios edificios en permisologia
            selectJs2(
                "#SelectEdificio",
                { 
                    value: "idedificio",
                    show: {
                        fields:["nombre"],
                    },
                    hide: ["identidad"],
                    queries:[{
                        fieldsSelect:["edificios.idedificio","entidades.nombre"],
                        tableName   :"(mediciones.edificios left join mediciones.entidades using(identidad))",
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

        $("#btnCsv").click(function(){
            console.log(dtTable.data().count());
            dtTable.button( '.buttons-csv' ).trigger();
        });
        $("#btnExcel").click(function(){
            dtTable.button( '.buttons-excel' ).trigger();
        });
        $("#btnPdf").click(function(){
            dtTable.button( '.buttons-pdf' ).trigger();
        });
        $("#btnPrint").click(function(){
            dtTable.button( '.buttons-print' ).trigger();
        });

</script>

<?php
}
else{
  echo "sin permiso";
}

?>