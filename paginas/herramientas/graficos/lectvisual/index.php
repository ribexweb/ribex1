<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">

<section class="content-header">
      <h1>
        Lectura Visual
        <small>Datos en Tiempo Real por Medidor</small>
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
                    <form id="FormaParametros" role="form">
                        <div class="box-body">
                            <div class="form-group">
                                <label>Edificio</label>
                                <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Medidor</label>
                                <select id="SelectMedidor" name="SelectMedidor" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>  
                        </div>
                    <!-- /.box-body -->
                        <div class="box-footer">
                            <div class="col col-md-6">
                                <button id="btnNuevo" type="button" class="btn btn-block btn-primary custom"><i class="fa fa-file"> </i> Nuevo</button>
                            </div>  
                        </div>
                    </form>
                </div>  
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Información</h3>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                            </button>
                        </div>
                    </div>
                <div class="variables box-body text-center">
                    <div style="font-size:24pt;font-family: 'Open Sans Condensed', sans-serif;padding:50px;display: inline-block;width:600px;height:600px;background-size: auto;background-image:url(images/widgets/medidor.png);background-position: center;background-repeat: no-repeat;">
                        <div class="row">
                            <div class="col-md-6 text-left" style="font-weight:bold">
                                Energía (8.1):
                            </div>    
                            <div id='energia' class="valor col-md-6 text-right" style="font-weight:bold;color:#FFFF00">
                                - <span>kWh</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 text-left" style="font-weight:bold">
                                Potencia Actual:
                            </div>    
                            <div id='potenciatotal' class="valor col-md-6 text-right" style="font-weight:bold;color:#FFFF00">
                                -  <span>kW</span>
                            </div>
                        </div>
                        <div class="row" style="font-weight:bold">
                            <div class='col-md-4' >
                                L1
                            </div>
                            <div class='col-md-4'>
                                L2
                            </div>
                            <div class='col-md-4'>
                                L3
                            </div>
                        </div>    
                        <div class="row" style="font-weight:bold;color:#FFFF00">
                            <div id='voltaje1' class='valor col-md-4'>
                                - <span>V</span>
                            </div>
                            <div id='voltaje2' class='valor col-md-4'>
                                - <span>V</span>
                            </div>
                            <div id='voltaje3' class='valor col-md-4'>
                                - <span>V</span>
                            </div>
                        </div>   
                        <div class="row" style="font-weight:bold;color:#FFFF00">
                            <div id='corriente1' class='valor col-md-4'>
                                - <span>A</span>
                            </div>
                            <div id='corriente2' class='valor col-md-4'>
                                - <span>A</span>
                            </div>
                            <div id='corriente3' class='valor col-md-4'>
                                - <span>A</span>
                            </div>
                        </div>   
                        <div class="row" style="font-weight:bold;color:#FFFF00">
                            <div id='potencia1' class='valor col-md-4'>
                                - <span>kW</span>
                            </div>
                            <div id='potencia2' class='valor col-md-4'>
                                - <span>kW</span>
                            </div>
                            <div id='potencia3' class='valor col-md-4'>
                                - <span>kW</span>
                            </div>
                        </div>  
                        <div class="row">
                            <div class='valor text-center col-md-12' style="color:#000000;font-weight:bold">
                                <span id='periodo'>- | -</span>
                            </div>
                        </div>  
                        <div class="row">
                            <div class="col-md-5 text-left" style="font-weight:bold">
                                DMax. HP (6.1):
                            </div>  
                            <div id='dmaxhp' class="valor col-md-7 text-right" style="font-weight:bold;color:#FFFF00">
                                -  <span>kW</span>
                            </div>
                        </div>  
                        <div class="row">
                            <div class="col-md-5 text-left" style="font-weight:bold">
                                DMax. SUM (6.2):
                            </div>  
                            <div id='dmaxsum' class="valor col-md-7 text-right" style="font-weight:bold;color:#FFFF00">
                                -  <span>kW</span>
                            </div>
                        </div>  
                        <div class="row">
                            <div class='valor text-center col-md-12' style="margin-top:15px">
                                <span id='fecha' style="color:#3aa213;font-weight:bold">####-##-## ##:##:##</span>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>  
        </div>
    </div>
</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code88.js?<?php echo time(); ?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script type="text/javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php wr($_SESSION["usuario"]["datos"]["database"]);?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';

    /*Cargar Select Edificios por primera Vez */
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
    }

</script>
<?php
}
else{
  echo "sin permiso";
}

?>