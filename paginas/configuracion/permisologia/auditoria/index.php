<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Auditoría <small>Logs de cambios y modificaciones de la información</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Historico de Operaciones
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaLogs" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Usuario</td>
                            <td>Nombres</td>
                            <td>Apellidos</td>
                            <td>Fecha</td>
                            <td>Tabla</td>
                            <td>Clave</td>
                            <td>Operacion</td>
                            <td>Detalle</td>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code74.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var reporteLogs = {activo:false,inicio:0,final:0,data:[]};
    var logActual = 0;
    
    var tableParamsLogs = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idlog',
        columnDefs:[
            {
                targets:7,
                render: function ( data, type, row ) {
                    return type === 'display' && data.length > 10 ?
                    data.substr( 0, 100 ) +'…' :data;
                }
            },
            {
                targets:[0,6],
                className:'text-center font-weight-bold'
            }
        ],
        columns:[
            {data:"login",title:"Usuario"},
            {data:"nombres",title:"Nombres"},
            {data:"apellidos",title:"Apellidos"},
            {data:"fecha",title:"Fecha"},
            {data:"tabla",title:"Tabla"},
            {data:"idclave",title:"Clave"},
            {data:"operacion",title:"Operacion"},
            {data:"detalle",title:"Detalle"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idlog";
                d.show = {
                    fields:["login","nombres","apellidos","fecha","tabla","idclave","operacion","detalle"],
                    realtablename:'logs',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"public.vlogs",
                    orderby:[{
                        field:"idlog",
                        type : "desc"
                    }],
                    where  :[]  
                }];
            },
            dataSrc: function(data){  
                reporteLogs.data = data.resultados[0].resultados;         
                return data.data;                 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        },
        language: spanish,
        dom: 'Bfrtip',
        buttons:buttons,
        rowCallback: function(row, data, index){
            console.log(data);
            if(data.operacion == 'Ingresar'){
                $(row).find('td:eq(6)').addClass('bg-lime');
            }
            else if(data.operacion == 'Modificar'){
                $(row).find('td:eq(6)').addClass('bg-yellow');
            }
            else if (data.operacion == 'Eliminar'){
                $(row).find('td:eq(6)').addClass('bg-red');
            }
            else if (data.operacion == 'Duplicar'){
                $(row).find('td:eq(6)').addClass('bg-teal');
            }
        }
    }

    var tablaLogs = $("#tablaLogs").DataTable(tableParamsLogs); 

</script>
<?php
}
else{
  echo "sin permiso";
}

?>