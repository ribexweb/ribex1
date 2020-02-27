<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>


<section class="content-header">
      <h1>
        Boletas Generadas V2
        <small>Boletas generadas V2 por Periodo a la fecha</small>
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
                                    <label>Periodo</label>
                                    <select id="SelectPeriodo" name="SelectPeriodo" class="form-control select2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>  
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer text-right">
                            <div class="col col-md-6">
                            </div>
                            <div class="col col-md-6">
                                <button id="btnBuscar" type="button" class="btn btn-block btn-success"><i class='fa fa-search'> </i> Buscar</button>
                            </div>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header">
                    <h3 class="box-title">Boletas Generadas</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                <div class="text-right">
                    <button type="button" id="descargarTodasPeriodo" data-iddashboard="0" data-toggle="modal" data-target="#widgetModal" class="btn btn-info btn-sm" data-toggle="tooltip" title="Descargar todas las boletas en un único archivo"><i class='fa fa-download'> </i> Descargar Todos</button><p>
                </div>                
                <table id="tabla" class="table table-bordered table-striped" style="width:100%">
                    <thead>
                    <tr>
                        <th>Boleta N°</th>
                        <th>Medidor</th>
                        <th>Arrendatario</th>
                        <th>Monto Neto (CLP)</th>
                        <th>Monto+IVA (CLP)</th>
                        <th>Operaciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
    </div>
    <canvas id="grafico"  class="hidden" style="height: 200px; width: 400px;" width="400" height="200"></canvas>

</section>
<script src="jscript/dashboard/widget-comparaciondinero.js?v=<?php echo date('his'); ?>"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code60.js?<?php echo time(); ?>'></script>
<script type="text/javascript">
var edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;

var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        rowId: 'idremarcacionasignacion',
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: true,
        columnDefs : [
        { 
            targets: [-2,-3], 
            render: $.fn.dataTable.render.number( '.', ',', 0 ),
            className: 'text-right',
            type:'formatted-num' 
        },
        {
            "targets":[-1],
            "orderable":false,
        },
        {
            "targets":[-1,],
            "className": "text-center",
        }
        ],
        columns:[
            {data:"idremarcacionasignacion",title:"Boleta N°"},
            //{data:"desde",title:"Desde"},
            //{data:"hasta",title:"Hasta"},
            {data:"codigo",title:"Medidor"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"total",title:"Monto Neto (CPL)"},
            {data:"totaliva",title:"Monto+IVA (CPL)"},
            {data:"operaciones",title:"Descargar"},
        ],
        order: [],
        language: spanish,
    }

    Tabla = $("#tabla").DataTable(tableParams); 

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
    }




</script>
<?php
}
else{
  echo "sin permiso";
}

?>