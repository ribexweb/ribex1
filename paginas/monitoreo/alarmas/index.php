<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<style type="text/css">
@-webkit-keyframes blink1 {
    50% {
        background: rgba(255, 0, 0, 0.5);
    }
}
@-moz-keyframes blink1 {
    50% {
        background: rgba(255, 0, 0, 0.5);
    }
}
@keyframes blink1 {
    50% {
        background: rgba(255, 0, 0, 0.5);
    }
}
.blink1 {
    -webkit-animation-direction: normal;
    -webkit-animation-duration: 5s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-name: blink1;
    -webkit-animation-timing-function: linear;
    -moz-animation-direction: normal;
    -moz-animation-duration: 5s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-name: blink1;
    -moz-animation-timing-function: linear;
    animation-direction: normal;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-name: blink1;
    animation-timing-function: linear;
}
@-webkit-keyframes blink2 {
    50% {
        background: rgba(255, 255, 0, 0.5);
    }
}
@-moz-keyframes blink2 {
    50% {
        background: rgba(255, 255, 0, 0.5);
    }
}
@keyframes blink2 {
    50% {
        background: rgba(255, 255, 0, 0.5);
    }
}
.blink2 {
    -webkit-animation-direction: normal;
    -webkit-animation-duration: 5s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-name: blink2;
    -webkit-animation-timing-function: linear;
    -moz-animation-direction: normal;
    -moz-animation-duration: 5s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-name: blink2;
    -moz-animation-timing-function: linear;
    animation-direction: normal;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-name: blink2;
    animation-timing-function: linear;
}

</style>
<link rel="stylesheet" href="jscript/iCheck/all.css">
<section class="content-header">
      <h1>
        Alarmas
        <small>Alarmas registradas en el sistema</small>
      </h1>
</section>
<section class="content">
  <div class="row">
    <div class="col-xs-12">
      <div class="box">
        <div class="box-body">
          <table id="tablaAlertas" class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Alerta</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Condicion</th>
                <th>Tipo</th>
                <th>Grupo</th>
                <th>Marca</th>
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


    var dtAlertas = $('#tablaAlertas').DataTable({
      "processing":false,
      //"serverSide":true,
      "order":[],
      "ajax":{
        url:"php/getTable.php",
        type: "POST",
        data:{ 
          primaryField: "idocurrencia",
          show: {
            updatebtn:false,
            deletebtn:false,
            fields:["idocurrencia","nombre","fecha","condicion","tipoo","idgrupoocurrencia","marca"],
          },
          queries:[{
            fieldsSelect:["*"],
            tableName   :"monitoreo.ocurrencias left join monitoreo.grupos_ocurrencias using (idgrupoocurrencia) left join monitoreo.alarmas using (idalarma)",
            orderby:[{
              field:"idocurrencia",
              type : "desc limit 100"
            }],   
          }],
        //otrosbotones:[{nombre:"widgets",tipo:"btn-info",accion:"widgets",icono:"fa-map"}],
        },
        error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
        }
      },
      "createdRow": function( row, data, dataIndex ) {
        if (moment.duration(moment().diff(moment(data[2]))).asMinutes() < 5){
          $(row).addClass("blink"+data[4]);
        }  
      },
      "columnDefs":[
        {
          "targets":[-1,-2,-3,-4],
          "orderable":false,
        },
        {
          "targets":[-1,-2,-3],
          "className": "text-center",
        },
        {
          "targets":[2],
          render:function(data, type, row ){
            return moment(data).milliseconds(0).format("YYYY-MM-DD HH:mm:ss");
          }          
        },
        {
          "targets":[-4],
          "orderable":false,
          "className": "text-center",
          render:function(data, type, row ){
            return (data=='1')?"<img src='images/iconos/error.png' />":"<img src='images/iconos/warning.png' />";
          }
        },
        {
          "targets":[-2],
          "className": "text-center",
          render:function(data, type, row ){
            var r = "";
            switch (data) {
            case "1": r = "<img src='images/alertas/new-notificacion-count.png' />";
              break;
            case "2": r = "<img src='images/alertas/next-notificacion-count.png' />";
              break;
            case "3": r = "<img src='images/alertas/new-notificacion-time.png' />";
              break;
            case "4": r = "<img src='images/alertas/next-notificacion-time.png' />";
              break; 
            }
            return r;
          }
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

  $(document).ready(function(){
    reporte = {activo:false,inicio:0,final:0};
    dataNueva = {todo:null};
    dataActual = {todo:null};

    setInterval(function() {
      dtAlertas.ajax.reload(null, false);
    },5000);
  });




</script>

<?php
}
else{
  echo "sin permiso";
}

?>