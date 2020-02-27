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
        <small>Lista de energia por Edificio</small>
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
                            <label>Fecha</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="TextFecha" name="TextFecha" autocomplete="off" data-smk-msg="Fecha Requerida" required>
                                <span id="iconoFecha" class="input-group-btn">
                                    <button data-input="TextFecha" type="button" id="btnFecha" class="btn btn-success custom icono">
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
                    <h3 class="box-title">Reporte de Energía</h3>
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code10.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};

/*    function getQuery(){
        var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
        return [{
            fieldsSelect:["coalesce(codigocliente,codigo) as codigo","consumidor","espacio","fecha::date as fecha","fecha::time as hora","valor"],
            tableName   :"mediciones.valoralafecha('%s'::timestamp,%s,1,%s,'%s')".format(
                $("#TextFecha").val(),
                $("#SelectEdificio").val(),
                usuarioActivo,
                database),
            orderby:[{
                field:"idmedidorfisico",
                type : "asc"
            }],
            where:[],      
        }];
    }*/
    $("#TextFecha").val(moment().format("YYYY-MM-DD")+' 00:00');
    var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idmedidorfisico',
        columnDefs : [{ 
            targets: [-1], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right minimo100'
            },{
                targets:[0,3,4],
                className:'minimo80 text-center',
            },{
                targets:[1,2],
                className:'minimo200'
            }
        ],
        columns:[
            {data:"codigo",title:"codigo"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"fecha",title:"Fecha"},
            {data:"hora",title:"Hora"},
            {data:"valor",title:"Energia kWh"},
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

    $('#TextFecha').datepicker({
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