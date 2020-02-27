<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>

<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content-header">
      <h1>
        Consumos por Medidor
        <small>Gráficos de Consumos Históricos por Medidor</small>
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
                                <label>Meses Atras</label>
                                <input type="text" class="form-control" id="textMeses" name="textMeses" autocomplete="off" data-smk-type="number" data-smk-msg="Numero de Meses Requerido" required>
                            </div>
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer">
                            <div class="col col-md-6">
                                <button id="btnGraficar" type="button" class="btn btn-block btn-info custom"><i class="fa fa-plus"> </i> Graficar</button>
                            </div>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
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
                                <a id="btnBorrar" class="btn btn-danger"><i class="fa fa-eraser"></i></a>
                                <a id="btnGuardar" class="btn btn-success"><i class="fa fa-download"></i></a>                                    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <canvas id="graph"  style="height: 293px; width: 590px;" width="590" height="293"></canvas>
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code75.js?<?php echo time(); ?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src="jscript/chart.js/chartjs-plugin-labels.js"></script>
<script type="text/javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0};
    tbMedidores= new Object({fechas:[],Medidores:new Object()});
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var graphTarget = $("#graph");
    var timeFormat = 'HH:mm:ss';

    var barChartData = {
        labels: [],
        datasets: [{
            label:'Energía',
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            data: [],
            yAxisID: "y-axis-1",
        },
        {   label:'Boleta',
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            data: [],
            yAxisID: "y-axis-2",
        }]
    };

    var image = new Image();
    image.src = "images/logo.png";
    image.width = 200;
    image.height= 200;

    $("#loading").html(graphLoading());

    $("#TextFecha").val(moment().format("YYYY-MM-DD")+' 00:00');

    var barGraph = new Chart(graphTarget, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: ''
            },
            responsive: true,
            legend: {
                display:false,
                position: 'top',
            },
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                    scaleLabel: {
                        display: true,
                        labelString: 'Energia kWh'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }, {
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    scaleLabel: {
                        display: true,
                        labelString: 'Pesos CLP'
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    },
                    // grid line settings
                    gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }]
            },
            plugins:{
                datalabels: {
						display: function(context) {
							return false;
						},
                },   
                labels:[
                {
                     render : function (args) {
                                value = parseFloat(args.value);
                                value = +(Math.round(value + "e+2")  + "e-2");
                                o_value = value.toLocaleString("es");
                                return o_value;
                                //return (args.dataset.yAxisID=='y-axis-1')?o_value+' kWh':o_value+" CLP";       
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
                        return (value>0)?o_value+((tooltipItem.datasetIndex==0)?' kWh':' CLP'):""; 
                    },
                }
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


    $("#textMeses").val(6);
</script>
<?php
}
else{
  echo "sin permiso";
}

?>