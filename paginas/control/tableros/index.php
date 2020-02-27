<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<!--<section class="content-header">
    <h1>
        Tableros
        <small>Panel de Visualización</small>
    </h1> 
</section>-->
<style>
.close {
    margin: 1px 0 0 10px;
    font-size: 18px;
}
.nav-tabs > li .closeDashboard > i,.closeWidget > i  {
    color:#ff0000;
}
.nav-tabs > li .editDashboard > i,.editWidget > i {
    color:#0000ff;
}
.gauge{
    height:200px;
}
.gauge svg {
    margin:0px !important;
    height:100%;
    min-height:100%;
    width:100%;
}
.gauge text:nth-child(7) tspan{
  font-size: 0.8em !important;  
}

.gauge text:nth-child(8) tspan, .gauge text:nth-child(9) tspan, .gauge text:nth-child(10) tspan{
  font-weight:bold;
  color:black; 
}
</style>

<section class="content-header">
    <h1>
        Dashboard
        <small>Version 2.0</small>
    </h1>
</section>
<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">
                        <i class="fa fa-table"></i>
                        Tableros
                    </h3>
                    <div class="box-tools pull-right">
                        <div class="btn-group">
                            <button id="config-widgets" data-tippy-content="Configurar Tableros y Widgets (click)" type="button" class="tooltips btn btn-box-tool dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-wrench"></i></button>
                                <ul class="dropdown-menu" role="menu">
                                    <li><a id="add_dashboard" href="#">Agregar Tablero</a></li>
                                    <li><a id="edit_dashboard" data-toggle="false" href="#">Activar Editar Tablero</a></li>
                                    <li><a id="remove_dashboard" data-toggle="false" href="#">Activar Eliminar Tablero</a></li>
                                    <li class="divider"></li>
                                    <li><a id="add_widget" href="#">Agregar Widget</a></li>
                                    <li><a id="edit_widget" data-toggle="false" href="#">Activar Editar Widget</a></li>
                                    <li><a id="remove_widget" data-toggle="false" href="#">Activar Eliminar Widget</a></li>
                                </ul>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="nav-tabs-custom">
                                <ul id="tab_dashboard" class="nav nav-tabs">
                                </ul>
                                <div id="context_dashboard" class="tab-content">
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<div  id="widgetConfig" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div id="modal-box-header" class="box-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4>
                    <i class="fa fa-list-alt fa-lg"></i>
                    <span id="modal-titulo-widget">Estado de Medidores</span>
                </h4>
                <h5><b><span id="modal-descripcion-widget">Editar parametros del widget</span></b></h5>
            </div>
            <div id="modal-box-body-widget" class="box-body">

            </div>
            <div id="modal-box-footer-widget" class="box-footer">
                <button type="button" id="btnModalCancelarWidget" class="btn btn-danger custom pull-right" data-dismiss="modal"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                <span class='pull-right'>&nbsp;</span>
                <button type="button" id="btnModalAceptarWidget" class="btn btn-success custom pull-right"><i class='fa fa-check'> Aceptar</i></button><span></span>
            </div>
        </div>
    </div>
</div>
<div  id="dashboardConfig" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div id="modal-box-header-dashboard" class="box-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4>
                    <i class="fa fa-list-alt fa-lg"></i>
                    <span id="modal-titulo-dashboard">Tableros</span>
                </h4>
                <h5><b><span id="modal-descripcion-dashboard">Editar parametros del Tablero</span></b></h5>
            </div>
            <div id="modal-box-body-dashboard" class="box-body">

            </div>
            <div id="modal-box-footer-dashboard" class="box-footer">
                <button type="button" id="btnModalCancelarDashboard" class="btn btn-danger custom pull-right" data-dismiss="modal"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                <span class='pull-right'>&nbsp;</span>
                <button type="button" id="btnModalAceptarDashboard" class="btn btn-success custom pull-right"><i class='fa fa-check'> Aceptar</i></button><span></span>
            </div>
        </div>
    </div>
</div>
<!-- Widgets -->
<script src="jscript/loading.js"></script>
<script src="jscript/dashboard/widget-potenciadia.js?v=3<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-energiames.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-ultimos.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-ultimosdinero.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-comparaciondinero.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-medidoresactivos.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-medidoresinactivos.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-ultimaactualizacion.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-potenciaactual.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-energiadia.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-medidoresstatus.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-energiapresupuestadaanual.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-energiapresupuestadamensual.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-potenciamaxima.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-montopresupuestadoanual.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-detallefactura.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-energiametrosedificios.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-potenciamma.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-promediometrosedificios.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-promedioenergiaedificios.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-promediofacturacionedificios.js?v=<?php echo date('his'); ?>"></script>
<script src="jscript/dashboard/widget-promediomontosedificios.js?v=<?php echo date('his'); ?>"></script>

<!-- Chart.Js-->
<script src="jscript/chart.js/dist/Chart.bundle.js"></script>
<script src="jscript/chart.js/chartjs-plugin-labels.js"></script>
<script src="jscript/chart.js/chartjs-plugin-datalabels.js"></script>
<script src="jscript/chart.js/chartjs-plugin-annotation.min.js"></script>
<script src="jscript/chart.js/chartjs-plugin-watermark.min.js"></script>
<script src="https://unpkg.com/popper.js@1"></script>
<script src="https://unpkg.com/tippy.js@5"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code5.js?<?php echo time(); ?>'></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/widgets/operaciones.js?<?php echo time(); ?>'></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/dashboards/operaciones.js?<?php echo time(); ?>'></script>


<script type="text/javascript">
  var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
  var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
  var operDashboard = 0;
  var operWidget = 0;
  var globalTipo = 0;

</script>

<?php
}
else{
  echo "sin permiso";
}

?>
