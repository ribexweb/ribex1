<?php
  include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
  if (sesion_creada()){
?>
<!DOCTYPE html>
<html>
<head>  
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ribex 1.2 | Dashboard</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!--******************************************************************************
       Script para cargar en pagina otros archivos de javascript o css una sola vez 
      ******************************************************************************-->  

    <link rel="stylesheet" type="text/css" href="jscript/select2/dist/css/select2.min.css">
    <link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
    <link rel="stylesheet" type="text/css" href="jscript/bootstrap/dist/css/bootstrap.min.css">
    <!--<link rel="stylesheet" type="text/css" href="jscript/font-awesome/css/font-awesome.min.css">-->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="jscript/Ionicons/css/ionicons.min.css">
     <!--<link rel="stylesheet" type="text/css" href="jscript/datatables.net-bs/css/dataTables.bootstrap.min.css">-->
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/DataTables-1.10.18/css/dataTables.bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/datatables.min.css"/>
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/FixedColumns-3.2.5/css/fixedColumns.dataTables.min.css"/>
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/Select-1.3.0/css/select.dataTables.min.css"/>
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/Buttons-1.5.6/css/buttons.dataTables.min.css"/>
    <link rel="stylesheet" type="text/css" href="jscript/DataTables/Editor-2019-05-09-1.9.0/css/editor.dataTables.min.css"/>
    <link rel="stylesheet" type="text/css" href="css/dist/css/AdminLTE.min.css?<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="css/dist/css/skins/_all-skins.min.css">
    <link rel="stylesheet" type="text/css" href="jscript/lobibox/lobibox.css">
    <link rel="stylesheet" type="text/css" href="css/loading/loading.css">
    <link rel="stylesheet" type="text/css" href="css/toggle/clean-switch.css">
    <link rel="stylesheet" type="text/css" href="scss/buttons.css?<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="jscript/smoke/css/smoke.min.css">
    <!--<link rel="stylesheet" href="//min.gitcdn.xyz/repo/wintercounter/Protip/master/protip.min.css">-->
    <link rel="stylesheet" type="text/css" href="jscript/colorpicker/jquery.minicolors.css">
    <link rel="stylesheet" type="text/css" href="css/loading2.css?<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="css/medidores.css?<?php echo time(); ?>">
    <link href="https://fonts.googleapis.com/css?family=Orbitron&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet">
    <!--<link rel="stylesheet" type="text/css" href="jscript/qtips/jquery.qtip.min.css">
    <link rel="stylesheet" type="text/css" href="jscript/mapify/jquery.mapify.css"> -->
    <script src="jscript/jquery/dist/jquery.min.js"></script>
    <script src="jscript/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="css/dist/js/adminlte.min.js"></script>
    <script src="jscript/loadscript.js?<?php echo time(); ?>"></script>
    <script src="jscript/moment/min/moment-with-locales.min.js"></script>
    <script src="jscript/randomColor/randomColor.js?<?php echo time(); ?>"></script>
    <!--<script src="jscript/datatables.net-bs/js/jquery.dataTables.min.js"></script>
    <script src="jscript/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>-->
    <script src="jscript/DataTables/DataTables-1.10.18/js/jquery.dataTables.min.js"></script>
    <script src="jscript/DataTables/DataTables-1.10.18/js/dataTables.bootstrap.min.js"></script>
    <script src="jscript/DataTables/plugins/processing.js"></script>
    <script src="jscript/select2/dist/js/select2.full.min.js"></script>
    <script src="jscript/datepicker/datepicker.min.js"></script>
    <script src="jscript/datepicker/datepicker.es.js"></script>
    <script src="jscript/chart.js/dist/Chart.bundle.js"></script>
    <script src="jscript/chart.js/chartjs-plugin-watermark.min.js"></script> 
    <script src="jscript/chart.js/chartjs-plugin-zoom.js"></script>
    <script src="jscript/chart.js/chartjs-plugin-annotation.min.js"></script>
    <!--<script src="jscript/chart.js/chartjs-plugin-labels.js"></script>-->
    <script src="jscript/chart.js/chartjs-plugin-datalabels.js"></script>
    <script src="jscript/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    <script src="jscript/DataTables/Buttons-1.5.6/js/dataTables.buttons.min.js"></script>
    <script src="jscript/DataTables/Buttons-1.5.6/js/buttons.flash.min.js"></script>
    <script src="jscript/DataTables/JSZip-2.5.0/jszip.min.js"></script>
    <script src="jscript/DataTables/pdfmake-0.1.36/pdfmake.min.js"></script>
    <script src="jscript/DataTables/pdfmake-0.1.36/vfs_fonts.js"></script>
    <script src="jscript/DataTables/Buttons-1.5.6/js/buttons.html5.min.js"></script>
    <script src="jscript/DataTables/Buttons-1.5.6/js/buttons.print.min.js"></script>
    <script src="https://unpkg.com/popper.js@1"></script>
    <script src="https://unpkg.com/tippy.js@5"></script>
    <script src="jscript/jspdf/jspdf.min.js"></script>
    <script src="jscript/jspdf/mitubachi-normal.js"></script>
    <script src="jscript/jspdf/jspdf.plugin.autotable.js?<?php echo time(); ?>"></script>
    <script src="jscript/jspdf/genboletas.js?1<?php echo time(); ?>"></script> 
    <script src="jscript/smoke/js/smoke.min.js"></script>
    <script src="jscript/csv/jquery.csv.min.js"></script>
    <script src="jscript/loading.js"></script>
    <script src="jscript/variables.js?<?php echo time(); ?>"></script>
    <script src="jscript/utils.js?<?php echo time();?>"></script>
    <script src="jscript/colorpicker/jquery.minicolors.min.js?<?php echo time();?>"></script>
    <script src="jscript/colorpicker/tinycolor-min.js?<?php echo time();?>"></script>
    <script src="jscript/filesaver/1.3.3/filesaver.min.js?<?php echo time();?>"></script>
    <!--<script src="jscript/validate/jquery.formvalidate.js"></script>-->
    <!--<script src="//min.gitcdn.xyz/repo/wintercounter/Protip/master/protip.min.js"></script>-->
    <!-- <script src="jscript/csv/read-csv.js"></script>-->
    <script src="jscript/justgage/raphael-2.1.4.min.js?<?php echo time();?>"></script>
    <script src="jscript/justgage/justgage.js?<?php echo time();?>"></script>
    <script src="jscript/confirmation/bootstrap-confirmation.min.js?<?php echo time();?>"></script>
    <script src="jscript/xlsx/xlsx.full.min.js?<?php echo time();?>"></script>
</head>

<script>


    loadScript('jscript/jquery-ui/jquery-ui.min.js');

   // $.widget.bridge('uibutton', $.ui.button);

    //loadScript('jscript/bootstrap/dist/js/bootstrap.min.js');
    //loadScript('jscript/jquery-sparkline/dist/jquery.sparkline.min.j');
    //loadScript('plugins/jvectormap/jquery-jvectormap-1.2.2.min.js');
    //loadScript('plugins/jvectormap/jquery-jvectormap-world-mill-en.js');
    //loadScript('jscript/jquery-knob/dist/jquery.knob.min.js');
    //loadScript('jscript/moment/min/moment.min.js');
    //loadScript('jscript/bootstrap-daterangepicker/daterangepicker.js');
    //loadScript('jscript/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js');
    //loadScript('jscript/jquery-slimscroll/jquery.slimscroll.min.js');


    loadScript('jscript/select2/dist/js/select2.full.min.js');
   // loadScript('jscript/DataTables/Buttons-1.5.6/js/dataTables.buttons.min.js');
   // loadScript('jscript/DataTables/Buttons-1.5.6/js/buttons.flash.min.js');
   // loadScript('jscript/DataTables/Buttons-1.5.6/js/buttons.print.min.js');
    loadScript('jscript/DataTables/Select-1.3.0/js/dataTables.select.min.js');
    loadScript('jscript/DataTables/KeyTable-2.5.0/js/dataTables.keyTable.min.js');
   // loadScript('jscript/DataTables/Editor-2019-05-09-1.9.0/js/dataTables.editor.js');
    loadScript('jscript/DataTables/FixedColumns-3.2.5/js/dataTables.fixedColumns.min.js');

   //loadScript('jscript/DataTables/pdfmake-0.1.36/pdfmake.min.js');
    //loadScript('jscript/DataTables/pdfmake-0.1.36/vfs_fonts.js');
    //loadScript('jscript/DataTables//JSZip-2.5.0/jszip.min.js');
    //loadScript('jscript/DataTables/Buttons-1.5.6/js/buttons.html5.min.js');
    loadScript('jscript/datepicker/datepicker.min.js');
    loadScript('jscript/datepicker/datepicker.es.js');

    loadScript('jscript/lobibox/lobibox.js');
    /*loadScript('jscript/mapify/jquery.mapify.js');
    loadScript('jscript/qtips/jquery.qtip.min.js');*/

</script>


<body class="hold-transition skin-blue sidebar-mini">
    <div class="wrapper">

        <header class="main-header">
            <!-- Logo -->
            <a href="index2.html" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini"><img src='images/ribe.png' width=30px></span>
            <!-- logo for regular state and mobile devices -->
            <span class="logo-lg"><img src='images/ribe.png' width=30px><b>Ribé</b>Ingeniería</span>
            </a>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>

            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                <!-- Messages: style can be found in dropdown.less-->
                <li class="dropdown messages-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-envelope-o"></i>
                    <span class="label label-success"></span>
                    </a>
                </li>
                <!-- Notifications: style can be found in dropdown.less -->
                <li class="dropdown notifications-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-bell-o"></i>
                    <span class="label label-warning"></span>
                    </a>
                </li>
                <!-- Tasks: style can be found in dropdown.less -->
                <li class="dropdown tasks-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-flag-o"><?php if ($_SESSION['usuario']['datos']['idusuario'] == 1) {echo SERVIDOR.":".BASEDATOS;} ?></i>
                    <span class="label label-danger"></span>
                    </a>
                </li>
                <!-- User Account: style can be found in dropdown.less -->
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <img src="images/usuario24x24.png" class="user-image" alt="User Image">
                    <span class="hidden-xs">
                        <?php 
                        if ((isset($_SESSION['usuario']['datos']['nombres'])) && 
                            (isset($_SESSION['usuario']['datos']['apellidos']))) {
                            wr(sprintf("%s %s",$_SESSION['usuario']['datos']['nombres'],$_SESSION['usuario']['datos']['apellidos']));
                        }
                        ?>
                    </span>
                    </a>
                    <ul class="dropdown-menu">
                    <!-- User image -->
                    <li class="user-header">
                        <img src="images/usuario240x240.png" class="img-circle" alt="User Image">
                        <p>
                        <?php 
                            if ((isset($_SESSION['usuario']['datos']['nombres'])) && 
                                (isset($_SESSION['usuario']['datos']['apellidos']))) {
                            wr(sprintf("%s %s",$_SESSION['usuario']['datos']['nombres'],$_SESSION['usuario']['datos']['apellidos']));
                            wr(sprintf("<small>%s</small>",$_SESSION['usuario']['datos']['email']));
                            wr(sprintf("<small>%s</small>",$_SESSION['usuario']['datos']['telefono']));
                            }
                        ?>  
                        </p>
                    </li>
                    <!-- Menu Body -->
                    <!-- Menu Footer-->
                    <li class="user-footer">
                        <div class="pull-left">
                            <button id="btnPerfil" type="button" class="btn btn-info"><i class="fa fa-id-card"> </i> Perfil</button>    
                        </div>
                        <div class="pull-right">
                            <button id="btnCerrar" type="button" class="btn btn-danger" onclick='javascript:logout();'><i class="fa fa-sign-out-alt"> </i> Cerrar</button>    
                            <!--<a href="javascript:logout();" class="btn btn-danger">Cerrar</a> -->
                        </div>
                    </li>
                    </ul>
                </li>
                </ul>
            </div>
            </nav>
        </header>
    <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
            <?php include_once "php/menuprincipal3.php"; ?>
            </section>
            <!-- /.sidebar -->
        </aside>

    <!-- Content Wrapper. Contains page content -->

        <div id="content-wrapper" class="content-wrapper">
        </div>
    <!-- /.content-wrapper -->
         <footer class="main-footer">
            <div class="pull-right hidden-xs">
            <b>Version</b> 1.2
            </div>
            <strong>Copyright &copy; 2019 <a href="http://ribe.cl">Ribé Ingeniería</a>.</strong> Todos los Derechos Reservados.
        </footer>
                            
    <!-- Control Sidebar -->

    <!-- /.control-sidebar -->
    <!-- Add the sidebar's background. This div must be placed
        immediately after the control sidebar -->
        <div class="control-sidebar-bg">
           
        </div>
    </div>
</body>
<script>

    if (paginaActiva.code == -1){
        paginaSesion = <?php 
                            if (isset($_SESSION["idpaginaActiva"])) {
                                echo $_SESSION["idpaginaActiva"];
                            }
                            else{
                                echo 5;    
                            }       
                        ?>;
        if (paginaSesion != -1)
           load(paginaSesion,0);
    }
    else {
        console.log('fue ajax:'+paginaActiva.code);
    }

    
</script>



<?php 
  }
  else{ //sin sesion activa 
    header('Location: paginas/login.php');
  }
?> 