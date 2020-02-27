<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<style>
    .minimo60{
        min-width:60px;
    }
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
        Reporte Real vs Presupuestado Mensual
        <small>Reporte de Montos (CLP)</small>
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
                            <label>Año</label>
                            <select id="selectAno" name="selectAno" class="form-control select2" style="width: 100%;">
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
                    <h3 class="box-title">Reporte Mensual</h3>
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code81.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};


    var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'item',
        columnDefs : [{
                targets:[0],
                className:'minimo200',
            },{
                targets:[1,2,3,4,5,6,7,8,9,10,11,12],
                render: $.fn.dataTable.render.number( '.', ',', 2 ),
                className: 'text-right minimo120'
            }
        ],
        columns:[
            {data:"descripcion",title:"Descripción"},
            {data:"monto1",title:"Enero"},
            {data:"monto2",title:'Febrero'},
            {data:"monto3",title:'Marzo'},
            {data:"monto4",title:'Abril'},
            {data:"monto5",title:"Mayo"},
            {data:"monto6",title:'Junio'},
            {data:"monto7",title:'Julio'},
            {data:"monto8",title:'Agosto'},
            {data:"monto9",title:"Septiembre"},
            {data:"monto10",title:'Octubre'},
            {data:"monto11",title:'Noviembre'},
            {data:"monto12",title:'Diciembre'},
        ],
        order:[],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        buttons: buttons,
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
                hide: ["idedificio","idpresupuesto","idarrendatarios","idgastocomun"],
                queries:[{
                    fieldsSelect:["edificios.idedificio","vedificios.nombre","coalesce(edificios.idmedidorprincipal,-1) as idpresupuesto","coalesce(idarrendatarios,-1) as idarrendatarios","coalesce(idgastocomun,-1) as idgastocomun"],
                    tableName   :"mediciones.vedificios left join mediciones.edificios using (idedificio)",
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

    selectAnos("#selectAno",2010);

</script>

<?php
}
else{
  echo "sin permiso";
}

?>