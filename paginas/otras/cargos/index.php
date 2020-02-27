<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" href="jscript/iCheck/all.css">
<section class="content-header">
      <h1>
        Cargos
        <small>Cargos de Facturación, Precios, Remarcación</small>
      </h1>
</section>
<section class="content">
  <div class="row">
    <div class="col-xs-12">
      <div class="box">
        <div class="box-body">
          <div class="text-right">
            <button type="button" id="nuevoCargo" data-toggle="modal" data-target="#ModalCargo" class="btn btn-info btn-sm"><i class='fa fa-plus'> </i> Nuevo</button>
          </div>
          <table id="tablaCargos" class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Cargo</th>
                    <th>Descripcion</th>
                    <th>Clasificacion</th>
                    <th>Variable</th>
                    <th>Unidad</th>
                    <th>Común</th>
                    <th>Activo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
    </div>
    <!-- /.col -->
  </div>
</section>  

<script>
    /**
    * Evento Pagina Lista
    */
   // loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var dtCargos = $('#tablaCargos').DataTable({
            "processing":false,
            //"serverSide":true,
            "order":[],
            "ajax":{
                url:"php/getTable.php",
                type: "POST",
                data:{ 
                primaryField: "idcargo",
                show: {
                    fields:["nombre","descripcion","clas_nombre","vari_codigo","unid_codigo","comun","activo"],
                    realtablename:'cargos',
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vcargos",
                    orderby:[{
                    field:"nombre",
                    type : "asc"
                    }],   
                }],
                //otrosbotones:[{nombre:"widgets",tipo:"btn-info",accion:"widgets",icono:"fa-map"}],
                }
            },
            "columnDefs":[
                {
                    "targets":[-1,-2,-3],
                    "orderable":false,
                },
                {
                    "targets":[-1,-2,-3],
                    "className": "text-center",
                }
            ],
            language:{
                "decimal":        "",
                "emptyTable":     "No se Encontraron Registros",
                "info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty":      "Showing 0 to 0 of 0 entries",
                "infoFiltered":   "(Filtrado desde _MAX_ total registros)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Mostrar _MENU_ Registros",
                "loadingRecords": graphLoading(),
                "processing":     "Processing...",
                "search":         "Buscar:",
                "zeroRecords":    "No se Encontraron Registros",
                "paginate": {
                "first":      "Primera",
                "last":       "Última",
                "next":       "Siguiente",
                "previous":   "Previo"
                },
                "aria": {
                "sortAscending":  ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
                }
            },
        });


</script>

<?php
}
else{
  echo "sin permiso";
}

?>