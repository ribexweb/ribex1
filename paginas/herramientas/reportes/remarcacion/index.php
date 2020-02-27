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
        Reporte de Remarcación
        <small>Listado de Remarcación agrupado por Arrendatario</small>
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
                    <div class="text-right">
                        <button type="button" id="descargarTodasMedidor" data-iddashboard="0" data-toggle="modal" data-target="#widgetModal" class="btn btn-info" data-toggle="tooltip" title="Descargar todas las boletas en un único archivo"><i class='fa fa-download'> </i> Descargar Todos</button><p>
                    </div> 
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code77.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};
    idremarcacion = -1;
    idedificio = -1;
    idservicio = -1;
    fecha = '';

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
            targets: [-2,-3,-4], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right minimo120'
            },{
                targets:[0,3],
                className:'minimo200',
            },{
                targets:[1,2],
                className:'minimo120',
            },{
                targets:[4,-1],
                className: 'text-center minimo80'
            },
            {
                targets:[-1],
                className:'text-center minimo80',
                orderable:false
            }
        ],
        fixedColumns:   {
            rightColumns: 1
        },
        columns:[
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"rut",title:"Rut"},
            {data:"codigo",title:"Código"},
            {data:"razonsocial",title:"Razón Social"},
            {data:"medidores",title:"Medidores"},
            {data:"total",title:"Monto Neto (CLP)"},
            {data:"totaliva",title:"Monto con IVA (CLP)"},
            {data:"totalconsumo",title:"Energía Facturada (kWh)"},
            {data:"boleta",title:"Boleta"},
        ],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        //buttons: buttons,
        language: spanish,
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            total = api.column(4).data().reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
            $(api.column(4).footer()).html(convertirFormatoLocal(total));
            total = api.column(5).data().reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
            $(api.column(5).footer()).html(convertirFormatoLocal(total));
            total = api.column(6).data().reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
            $(api.column(6).footer()).html(convertirFormatoLocal(total));
            total = api.column(7).data().reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );
            $(api.column(7).footer()).html(convertirFormatoLocal(total));
        }
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
        $("#SelectEdificio").prop("disabled",true);
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