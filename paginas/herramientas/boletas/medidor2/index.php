<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>



<section class="content-header">
      <h1>
        Boletas Generadas V2
        <small>Boletas generadas V2 por medidor a la fecha</small>
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
                                    <label>Medidor</label>
                                    <select id="SelectMedidor" name="SelectMedidor" class="form-control select2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>  
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer text-right">
                            <div class="col col-md-6">
                            </div>
                            <div class="col col-md-6">
                                <button id="btnBuscar" type="button" class="btn btn-block btn-success">Buscar</button>
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
                <table id="tabla" class="table table-bordered table-striped" style="width:100%">
                    <thead>
                    <tr>
                        <th>Año</th>
                        <th>Mes</th>
                        <th>Fecha</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Boleta N°</th>
                        <th>Monto</th>
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
</section>

<script type="text/javascript">

var edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;


loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
$('.select2').select2();

dataTable = $('#tabla').DataTable({
        destroy:true,
        "processing":false,
        //"serverSide":true,
        "order":[],
        "columnDefs":[
        { 
            targets: -2, 
            render: $.fn.dataTable.render.number( '.', ',', 0 ),
            className: 'dt-body-right',
            type:'html-num-fmt' 
        },
        {
            "targets":[-1,-3,-4],
            "orderable":false,
        },
        {
            "targets":[1,2,-1,-2,-3],
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
    else{ //si solo tiene uno o varios medidores a su cargo
    /*    $("#SelectEdificio").prop("disabled",true);
        $("#SelectMedidor").prop("disabled",false);
        var medidores = '<?php wr(obtener_Medidores());?>';
        selectJs2(
            "#SelectMedidor",
            { 
                value: "idmedidor",
                show: {
                    fields:["codigo","nombre"],
                    format: "%s %s"
                },
                hide: [],
                queries:[{
                    fieldsSelect:["medidores.idmedidor","medidores.codigo","entidades.nombre","medidores.codigo"],
                    tableName   :"((mediciones.medidores left join mediciones.asignaciones on medidores.idmedidor=asignaciones.idmedidor) left join oficinas on asignaciones.idoficina=oficinas.idoficina) left join entidades on oficinas.identidad=entidades.identidad",
                    orderby:[{
                        field:"medidores.idmedidor",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"medidores.activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",    
                    },
                    {
                        logical:"and",
                        field  :"medidores.idmedidor",
                        oper   :"in",
                        value  :"("+medidores+")",
                        type   :"int",  
                    }]        
                }],
            },
            {

            }    
        );*/
    }

    $("#SelectEdificio").bind("change",function(){
        if ($("#SelectEdificio").val() != -1) {
           // barGraphDemandaGeneralDiaria.options.watermark.image.src = "images/graph/logo%s.png".format($("#SelectEdificio").val());
        }
        selectJs2(
            "#SelectMedidor",
            { 
                value: "idmedidor",
                show: {
                    fields:["codigo","cons_nombre","espa_nombre"],
                    format: "%s | %s | %s"
                },
                hide: ["idmedidorfisico","idasignacion"],
                queries:[{
                    fieldsSelect: ["idmedidor","idmedidorfisico","idasignacion","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
                    tableName   :"mediciones.medidores_permisados(%s,%s)".format($("#SelectEdificio").val(),usuarioActivo),
                    orderby:[{
                        field:"idmedidorfisico",
                        type : "asc NULLS first"
                    }],
                    where  :[{
                        field  :"asig_activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",        
                    }]        
                }],
            },
            {
            }    
        );
    });

    $('#btnBuscar').click(function(){

dataTable = $('#tabla').DataTable({
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
        primaryField: "idremarcacionasignacion",
        hide:["idremarcacionasignacion"],
        show: {
          fields:["ano","mes","fecha","desde","hasta","idremarcacionasignacion","monto"],
          deletebtn:0,
          updatebtn:0,
          realtablename: "boletas_medidor",
        },
        queries:[{
          fieldsSelect:["idremarcacionasignacion","desde,hasta,fecha::date,extract('year' from fecha) as ano","lpad(extract('month' from fecha)::text,2,'0') as mes"],
          tableName   :"remarcacion.vremarcacionesasignaciones left join mediciones.vmedidores using(idasignacion)",
          orderby:[{
            field:"idremarcacionasignacion",
            type : "desc"
          }],
          where  :[
          { field:"vremarcacionesasignaciones.idasignacion",
            oper:"=",
            value:$("#SelectMedidor option:selected").attr('data-idasignacion'),
            type: "int"
          }],     
        }],
        otrosbotones:[{nombre:"descargar",tipo:"btn-info",accion:"descargar",icono:"fa-cloud-download"}],
      }
    },
    "columnDefs":[
    { 
        targets: -2, 
        render: $.fn.dataTable.render.number( '.', ',', 0,'',' CLP' ),
        className: 'text-right',
        type: 'currency'

    },
    {
        "targets":[-1,-3,-4],
        "orderable":false,
    },
    {
        "targets":[1,2,-1,-2,-3],
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

}); 




</script>
<?php
}
else{
  echo "sin permiso";
}

?>