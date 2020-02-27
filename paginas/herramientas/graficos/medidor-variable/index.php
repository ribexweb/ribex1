<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">

<section class="content-header">
      <h1>
        Variables por Medidor
        <small>Gráficos de Variable por Medidor en Rango</small>
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
                    <form id="FormaParametros" role="form">
                        <div class="box-body">
                            <div class="form-group">
                                <label>Edificio</label>
                                <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Medidor</label>
                                <select id="SelectMedidor" name="SelectMedidor" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Variable</label>
                                <select id="SelectVariable" name="SelectVariable" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fecha Inicial</label>
                                <div class="input-group">
                                    <input type="text" class="form-control datetime" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off" data-smk-msg="Fecha Inicial Requerida" required>
                                    <span id="iconoFecha" class="input-group-btn">
                                        <button data-input="TextFechaInicial" type="button" id="btnFechaInicial" class="btn btn-success custom icono">
                                            <i class='fa fa-calendar-day'></i>
                                        </button>
                                    </span> 
                                </div>
                             </div>
                            <div class="form-group">
                                <label>Fecha Final</label>
                                <div class="input-group">
                                    <input type="text" class="form-control datetime" id="TextFechaFinal" name="TextFechaFinal" autocomplete="off" data-smk-msg="Fecha Final Requerida" required>
                                    <span id="iconoFecha" class="input-group-btn">
                                        <button data-input="TextFechaFinal" type="button" id="btnFechaFinal" class="btn btn-success custom icono">
                                            <i class='fa fa-calendar-day'></i>
                                        </button>
                                    </span> 
                                </div>
                            </div>   
                            <div class="form-group">
                                <label>Tipo de Dato</label>
                                <div class="radio input-group">
                                    <div class="col col-md-1">
                                    </div>
                                    <div class="col col-md-3">
                                        <input type="radio" name="tipo" value="Avg" class="minimal" checked>Avg
                                    </div>
                                    <div class="col col-md-3">
                                        <input type="radio" name="tipo" value="Min" class="minimal">Min
                                    </div>
                                    <div class="col col-md-3">
                                        <input type="radio" name="tipo" value="Max" class="minimal">Max
                                    </div>
                                </div>                                                                        
                            </div>  
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer">
                            <div class="col col-md-6">
                                <button id="btnNuevo" type="button" class="btn btn-block btn-primary custom"><i class="fa fa-file"> </i> Nuevo</button>
                            </div>  
                            <div class="col col-md-6">
                                <button id="btnAgregar" type="button" class="btn btn-block btn-warning custom"><i class="fa fa-plus"> </i> Agregar</button>
                            </div>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Gráfico</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                            </button>
                        </div>
                    </div>
                <div class="box-body" style="">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="box-tools pull-right">
                                <a id="btnReset" class="btn btn-primary"><i class="fa fa-sync"></i></a>
                                <a id="btnBorrar" class="btn btn-danger"><i class="fa fa-eraser"></i></a>
                                <a id="btnGuardar" class="btn btn-success"><i class="fa fa-download"></i></a>                                    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <canvas id="graphDemandaGeneralDiaria"  style="height: 293px; width: 590px;" width="590" height="293"></canvas>
                            <div id="container-loading" class="text-center hidden" style="position:absolute;top:0px;left:5px;width:98%;height:100%;background-color:rgba(255,255,255,0.7);">
                               <div id="loading" style="position:absolute;left:50%;top:50%;margin:-65px 0 0 -85px;width:170px;height:130px;">

                               </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class='col-md-4'>
                                <label>Mínimo</label>
                                <input type="text" class="form-control" id="textMinimo" name="textMinimo" autocomplete="off" readonly>
                            </div>
                            <div class='col-md-4'>
                                <label>Máximo</label>
                                <input type="text" class="form-control" id="textMaximo" name="textMaximo" autocomplete="off" readonly>
                            </div>
                            <div class='col-md-4'>
                                <label>Diferencia</label>
                                <input type="text" class="form-control" id="textDiff" name="textDiff" autocomplete="off" readonly>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>  
        </div>
    </div>
</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code11.js?<?php echo time(); ?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script type="text/javascript">
    reporte = {activo:false,inicio:0,final:0};
    tbMedidores= new Object({fechas:[],Medidores:new Object()});
    var indexVar = -1;
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php wr($_SESSION["usuario"]["datos"]["database"]);?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var graphTargetDemandaGeneralDiaria = $("#graphDemandaGeneralDiaria");
    var timeFormat = 'MM/DD/YYYY HH:mm';
    var chartDataDemandaGeneralDiaria = {
        labels: [],
        datasets: []
    };
    var image = new Image();
    image.src = "images/ribe50x50.png";
    image.width = 120;
    image.height= 30; 

    var animacion = false;

    $("#TextFechaFinal").val(moment().format("YYYY-MM-DD")+' 00:00');
    $("#TextFechaInicial").val(moment().subtract(1, 'month').format("YYYY-MM-DD")+' 00:00');


    $("#loading").html(graphLoading());

    var barGraphDemandaGeneralDiaria = new Chart(graphTargetDemandaGeneralDiaria, {
        type: 'line',
        data: chartDataDemandaGeneralDiaria,
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
            plugins:{
                    datalabels: {
						display: function(context) {
							return false;
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
                },
            	// Function called while the user is zooming
                onZoom: function(chart) { console.log(barGraphDemandaGeneralDiaria.scales["x-axis-0"]); },
                // Function called once zooming is completed
                onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
            },
            watermark: {
                image: image,
                //width: 108,
                //height: 39,
                opacity: 0.3,
                alignX: "middle",
                alignY: "top",
                //position: "back",
            },
            animation: {
					onProgress: function(animation) {
                        if (animacion) {
                            //$("#loading").removeClass("hidden");  
                        }  
						
					},
					onComplete: function() {	
                            //$("#loading").addClass("hidden");
                            //animacion = false;
   
					}
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

    /*Cargar Select Edificios por primera Vez */
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
    else{
    }

</script>
<?php
}
else{
  echo "sin permiso";
}

?>