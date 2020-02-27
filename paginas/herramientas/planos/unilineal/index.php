<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<section class="content-header">
    <h1>
        Unilineal
        <small>Diagrama Unilineal de Energía</small>
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
                <form id="Forma" role="form">
                    <div class="box-body">
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Edificio</label>
                                <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div>     
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                        <button id="btnBuscar" type="button" class="btn btn-primary pull-right">Buscar</button>
                    </div>
                </form>
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Diagrama</h3>
                </div>
                <div class="card" style="height: 100%">
                    <div id='unilinealGeneral' style='height:auto;position: relative;text-align: center;'>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


<script type="text/javascript" language="javascript">
var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
var loadmapa = false;
var indexmap = 0;

    function cargar_unilineal(index){
        console.log("cargando "+index);
        $("#unilinealGeneral").load("paginas/herramientas/planos/unilineal/plantillas/unilineal%s.php".format(index));
    }

$( document ).ready(function() {
    $('.select2').select2();

    $('#btnBuscar').click(function(){
        cargar_unilineal($("#SelectEdificio").val());
        loadmapa = true;
        indexmap = $("#SelectEdificio").val(); 
    }); 
});

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
                    tableName   :"(mediciones.edificios left join mediciones.entidades using(identidad))",
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


</script>

<?php
}
else{
  echo "sin permiso";
}

?>