<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>

<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content-header">
      <h1>
        Variables por Día
        <small>Gráficos de Variable por Medidor en un Día</small>
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
                            <div class="row form-group">
                                <div class="col col-md-12">
                                    <label>Edificio</label>
                                    <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-12">
                                    <label>Medidor</label>
                                    <select id="SelectMedidor" name="SelectMedidor" class="form-control select2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Variable</label>
                                <select id="SelectVariable" name="SelectVariable" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Fecha</label>
                                <div class="input-group">
                                    <input type="text" class="form-control date" id="TextFecha" name="TextFecha" autocomplete="off" data-smk-msg="Fecha válida Requerida" required>
                                    <span id="iconoFecha" class="input-group-btn">
                                        <button data-input="TextFecha" type="button" id="btnFecha" class="btn btn-success custom icono">
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
                            <div class="form-group text-center">
                                <input id="chkTemperatura" type="checkbox" name="temperatura" class="minimal">Temperatura
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
        <!--<div class="col-md-9">
            <div class="box box-danger">
                <div class="box-header with-border">
                    <h3 id="titulo-grafico" class="box-title">Gráfico de Variables</h3>
                    <div class="box-tools pull-right">
                        <a id="btnReset" class="btn"><i class="fa fa-refresh"></i></a>
                        <a id="btnBorrar" class="btn"><i class="fa fa-eraser"></i></a>
                        <a class="btn"><i class="fa fa-save"></i></a>
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                    </div>
                </div>
                <div class="box-body" style="">
                    <canvas id="graphDemandaGeneralDiaria" style="height: 295px; width: 580px;" width="580" height="295"></canvas>
                </div>
            </div>
        </div>-->
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

                    </div>    
                </div>
            </div>
        </div>
    </div>
</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code12.js?<?php echo time(); ?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src="jscript/chart.js/chartjs-plugin-annotation.min.js"></script>
<script type="text/javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    var indexVar = -1;
    reporte = {activo:false,inicio:0,final:0};
    tbMedidores= new Object({fechas:[],Medidores:new Object()});
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var graphTargetDemandaGeneralDiaria = $("#graphDemandaGeneralDiaria");
    var timeFormat = 'HH:mm:ss';
    var chartDataDemandaGeneralDiaria = {
        labels: [],
        datasets: []
    };
    var image = new Image();
    image.src = "images/logo.png";
    image.width = 200;
    image.height= 200;

    $("#loading").html(graphLoading());

    $("#TextFecha").val(moment().format("YYYY-MM-DD")+' 00:00');


    var barGraphDemandaGeneralDiaria = new Chart(graphTargetDemandaGeneralDiaria, {
        type: 'line',
        //data: chartDataDemandaGeneralDiaria,
        options: {
            responsive: true,
            title:      {
                display: true,
                text:    ""
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel.toLocaleString()+' kW';
                        //return data.labels[tooltipItems.index] + ": " + data.datasets[0].data[tooltipItems.index].toLocaleString();
                    }
                }
            },
            plugins:{
                    datalabels: {
						display: function(context) {
							return false;
						},
					}                    
            }, 
            scales:     {
                xAxes: [{
                    type:       "time",
                    time: {
                            unit:'hour',
                            stepSize:1,
                            displayFormats: {
                                hour: 'HH'
                            }
                    },
                    scaleLabel: {
                        display:     true,
                        labelString: 'Periodo'
                    }
                }],
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                    scaleLabel: {
                        display:     true,
                        labelString: 'kW'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }]
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
                    annotations:[{
                        id:'box0',
						type: 'box',
						xScaleID: 'x-axis-0',
						yScaleID: 'y-axis-0',
						xMin: "18:00:00",
						xMax: "23:00:00",
						//yMin: 0,
						//yMax: 100,
						backgroundColor: 'rgba(90,0,0, 0.1)',
						borderColor: 'rgba(90,0,0, 0.1)',
                        borderWidth: 1,                      
                    },{
                        drawTime: "afterDatasetsDraw",
                        id: "hline",
                        type: "line",
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: '20:30:00',
                        borderColor: "transparent",
                        borderWidth: 1,
                        label: {
                          position:'top',
                          backgroundColor: "transparent",
                          content: "Horario Punta",
                          enabled: true,
                          fontColor: "#000",
                          fontStyle: "normal",
                          fontSize:15,
                        }
                    }
                    ]
				} 
        }
    });

    $('.date').datepicker({
            language: 'es',
            dateFormat: 'yyyy-mm-dd',
            firstDay: 0,
            autoClose: true,
            toggleSelected: false,
            maxDate: new Date() // Now can select only dates, which goes after today
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
    else{ 
    }
</script>
<?php
}
else{
  echo "sin permiso";
}

?>