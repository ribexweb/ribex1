<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<style>
    .minimo120{
        min-width:120px;
    }
    .minimo200{
        min-width:200px;
    }
    .minimo80{
        min-width:80px;
    }
</style>
<section class="content-header">
    <h1>
        Energia
        <small>Consumo de energia por Edificio y Periodo</small>
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
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                <form id="FormaParametros" role="form">
                    <div class="box-body">
                        <div class="form-group">
                            <label>Edificio</label>
                            <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                            </select>
                        </div> 
                        <div class="form-group"> 
                            <label>Fecha Inicial</label>
                            <div class="input-group">
                                <input type="text" class="form-control datetime" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off" data-smk-msg="Fecha Inicial Requerida" required>
                                <span id="iconoFechaInicial" class="input-group-btn">
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
                                <span id="iconoFechaFinal" class="input-group-btn">
                                    <button data-input="TextFechaFinal" type="button" id="btnFechaFinal" class="btn btn-success custom icono">
                                        <i class='fa fa-calendar-day'></i>
                                    </button>
                                </span> 
                            </div>
                        </div>      
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                            <button id="btnCancelar" type="button" class="btn btn-danger pull-right disabled custom" style='margin-left: 5px'><i class="fa fa-stop-circle"> </i> Cancelar</button>
                            <button id="btnBuscar" type="button" class="btn btn-success pull-right custom"><i class="fa fa-search"> </i> Buscar</button>    
                    </div>
                </form>
            </div>
        </div> 
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header">
                    <h3 class="box-title">Consumos de Energia</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <table id="tabla" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
    </div>
</section>

<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code53.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};


    $("#TextFechaFinal").val(moment().format("YYYY-MM-DD")+' 00:00');
    $("#TextFechaInicial").val(moment().subtract(1, 'month').format("YYYY-MM-DD")+' 00:00');

    var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: true,
        rowId: 'idmedidorfisico',
        columnDefs : [{ 
            targets: [-1,-2,-4], 
            render: $.fn.dataTable.render.number( '.', ',', 0 ),
            className: 'minimo120 text-right',
            },{
                targets:[0],
                className:'minimo80 text-center',
            },
            {
                targets:[3,5],
                className:'minimo120 text-center'
            },{
                targets:[1,2],
                className:'minimo200'
            }
        ],
        columns:[
            {data:"codigo",title:"Codigo"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"energiafechainicial",title:"Desde"},
            {data:"energialecturainicial",title:"Lect. Inicial kWh"},
            {data:"energiafechafinal",title:"Hasta"},
            {data:"energialecturafinal",title:"Lect. Final kWh"},
            {data:"consumo",title:"Consumo kWh"},
        ],
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
    }

    var Tabla = $("#tabla").DataTable(tableParams);

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

</script>

<?php
}
else{
  echo "sin permiso";
}

?>