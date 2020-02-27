<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" href="jscript/iCheck/all.css">
<section class="content-header">
      <h1>
        Tarifas
        <small>Tipos de Tarifas</small>
      </h1>
</section>
<section class="content">
  <div class="row">
    <div class="col-xs-12">
      <div class="box">
        <div class="box-body">
          <div class="text-right">
            <button type="button" id="nuevoTarifa" data-toggle="modal" data-target="#ModalTarifa" class="btn btn-info btn-sm"><i class='fa fa-plus'> </i> Nuevo</button>
          </div>
          <table id="tablaTarifas" class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Activo</th>
                <th>Operaciones</th>
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
  <div id="divForma" class="hidden">
    <div class="box box-success">
      <div class="box-header with-border">
          <h3 id="formtitle" class="box-title">Cargos Habilitados</h3>
          <div class="box-tools pull-right">
              <button id="cerrarForma" type="button" class="btn btn-box-tool"><i class="fa fa-remove"></i></button>
          </div>
      </div>
      <div class="box-body">
          <div class="row">
            <div class="col-md-12">
              <div class="text-right">
                <button type="button" id="nuevoCargo" data-idtarifa="0" data-toggle="modal" data-target="#cargoModal" class="btn btn-info btn-sm"><i class='fa fa-plus'> </i> Nuevo</button>
              </div>
              <table id="tablacargos" class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Descripcion</th>
                    <th>Clasificacion</th>
                    <th>Variable</th>
                    <th>Unidad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  </div>
</section>  

<script>
  var tarifaActivo = -1;
  var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
  edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
  var dataTableCargo = null;//$('#tablawidgets').DataTable({destroy:true,paging:false,searching:false});


    /**
    * Evento Pagina Lista
    */
    loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var dtTarifas = $('#tablaTarifas').DataTable({
            "processing":false,
            //"serverSide":true,
            "order":[],
            "ajax":{
                url:"php/getTable.php",
                type: "POST",
                data:{ 
                primaryField: "idtarifa",
                show: {
                    fields:["codigo","descripcion","activo"],
                    realtablename:'tarifas',
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.tarifas",
                    orderby:[{
                    field:"idtarifa",
                    type : "asc"
                    }],   
                }],
                otrosbotones:[{nombre:"cargos",tipo:"btn-info",accion:"cargos",icono:"fa-map"}],
                }
            },
            "columnDefs":[
                {
                    "targets":[-1,-2],
                    "orderable":false,
                },
                {
                    "targets":[-1,-2],
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

  $(document).on('click', '.cargos_tarifas', function(){
      $("#divForma").removeClass("hidden");
      $("#tablacargos tbody").empty();
      tarifaActivo = $(this).attr("id");
      $("#nuevoCargo").attr("data-idtarifa",tarifaActivo);
      $.ajax({
        url:"php/data.php",
        method:"POST",
        data:{
            queries:[{
              fieldsSelect:["*"],
              tableName   :"remarcacion.tarifas",
              where  :[{
                field  :"idtarifa",
                oper   :"=",
                value  :tarifaActivo,
                type   :"int",
              }],      
            }],
        },
        dataType:'json',
        success:function(data){
        
          $("#formtitle").html('Lista de Cargos para %s'.format(data[0].resultados[0].codigo));

          dataTableCargo = $('#tablacargos').DataTable({
            destroy:true,
            "processing":false,
            //"serverSide":true,
            "order":[],
            "ajax":{
              url:"php/getTable.php",
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
              },
              type: "POST",
              data:{ 
                primaryField: "idtarifacargo",
                hide:["idtarifacargo"],
                show: {
                  fields:["nombre","descripcion","clas_nombre","vari_codigo","unid_codigo"],
                  realtablename:"cargostarifas",
                },
                queries:[{
                  fieldsSelect:["*"],
                  tableName   :"remarcacion.vcargostarifas",
                  orderby:[{
                    field:"nombre",
                    type : "asc"
                  }],
                  where  :[
                  { field:"idtarifa",
                    oper:"=",
                    value:tarifaActivo,
                    type: "int"
                  },
                  { logical: 'OR',
                    field:"comun",
                    oper:"=",
                    value:'true',
                    type: "int"                    
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

        } 
      });   
  });


</script>

<?php
}
else{
  echo "sin permiso";
}

?>