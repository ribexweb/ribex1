<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
    

<section class="content-header">
    <h1>
        Plano General
        <small>Plano General del Edificio</small>
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
                    <h3 class="box-title">Plano</h3>
                </div>
                <div class="card text-center" style="height: 100%">
                    <div id='mapageneral' class='text-center'>
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
               let cargandoVariables = {activo:false,inicio:0,final:0};


               let variables = [];

                function revisar_variables(){
                   if (loadmapa){
                      if (indexmap > 0) {
                        if (!(cargandoVariables.activo)){
                            cargar_variables_formateadas(cargandoVariables,variables,indexmap,"1,3,4,5,11,12,13,23");
                        }
                        else {
                            console.log("en proceso de carga de variables del edificio:%s".format(indexmap));
                        }    
                      }
                   }
                   else{
                     console.log("mapa no cargado");
                   }
                }

                function cargar_mapa(index){
                    $("#mapageneral").load("paginas/herramientas/planos/general/plantillas/mapa%s.php".format(index));
                }

$( document ).ready(function() {
    $('.select2').select2();

    $('#btnBuscar').click(function(){
        cargar_mapa($("#SelectEdificio").val());
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