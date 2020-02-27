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
        Reporte de Remarcación Detalle
        <small>Listado de Remarcación Detallada</small>
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
                            <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                            </select>
                        </div> 
                        <div class="form-group">
                            <label>Remarcación</label>
                            <select id="selectRemarcacion" name="selectRemarcacion" class="form-control select2" style="width: 100%;">
                            </select>
                        </div>     
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                        <button id="btnBuscar" type="button" class="btn btn-block btn-info custom"><i class="fa fa-search"> </i> Buscar</button>
                    </div>
                </form>
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header">
                    <h3 class="box-title">Listado de Remarcación</h3>
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
    <canvas id="grafico"  class="hidden" style="height: 200px; width: 400px;" width="400" height="200"></canvas>

</section>

<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code78.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};
    var dataLeidaFacturada = {data:null};

    $("#textFecha").val(moment().format("YYYY-MM-DD")+' 00:00');

    var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idconsumidor',
        columnDefs : [{ 
            targets: [-1,-2], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right minimo120'
            },{
                targets:[0,3],
                className:'minimo200',
            },{
                targets:[1,2],
                className:'minimo120',
            },{
                targets:[4],
                className: 'text-center minimo80'
            }
        ],
        columns:[
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"cons_rut",title:"Rut"},
            {data:"cons_codigo",title:"Código"},
            {data:"razonsocial",title:"Razón Social"},
            {data:"medidores",title:"Medidores"},
            {data:"total",title:"Monto Neto CLP"},
            {data:"totalconsumo",title:"Energía Facturada kWh"},
        ],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        //buttons: buttons,
        language: spanish,

    }

    var Tabla = $("#tabla").DataTable(tableParams);

    if (edificios != '') {
        selectJs2(
            "#selectEdificio",
            { 
                value: "idedificio",
                show: {
                    fields:["nombre"],
                },
                hide: ["idedificio"],
                queries:[{
                    fieldsSelect:["idedificio","nombre"],
                    tableName   :"mediciones.vedificios",
                    orderby:[{
                        field:"nombre",
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
        $("#selectEdificio").prop("disabled",true);
    }

    $('#textFecha').datepicker({
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