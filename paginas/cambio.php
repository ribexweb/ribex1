<?php include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
  if (isset($_SESSION["login"])){
      $login = $_SESSION["login"];
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Ribex 2.0 | Log in</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.7 -->
  <link rel="stylesheet" href="../jscript/bootstrap/dist/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../jscript/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="../jscript/Ionicons/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../css/dist/css/AdminLTE.min.css?8383838">
  <!-- iCheck -->
  <link rel="stylesheet" href="../jscript//iCheck/square/blue.css">
  <!-- Lobibox -->
  <link rel="stylesheet" href="../jscript//lobibox/lobibox.css">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
</head>
<body class="hold-transition login-page" >
<div class="login-box" style="margin-top:0px !important;">
  <div class="login-logo">
    <a href="http://www.ribe.cl"><img src='../images/ribe.png' width=50px><b>Ribé</b>Ingeniería</a>
  </div>
  <!-- /.login-logo -->

  <div class="login-box-body">
    <p class="login-box-msg">Cambio de Datos para Iniciar Sesión</p>

    <form action="../../index2.html" method="post">
      <div class="form-group has-feedback">
        <input id="login" type="text" class="form-control" placeholder="Usuario" disabled value="<?php echo $login; ?>">
        <span class="glyphicon glyphicon-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="contraAnterior" type="password" class="form-control" placeholder="Contraseña Anterior">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="contraNueva" type="password" class="form-control" placeholder="Contraseña Nueva">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="contraNuevaRepetir" type="password" class="form-control" placeholder="Repetir Contraseña Nueva">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <div class="col-xs-8">

        </div>
        <!-- /.col -->
        <div class="col-xs-4">
          <button id="iniciar" type="button" class="btn btn-primary btn-block btn-flat">Cambiar</button>
        </div>
        <!-- /.col -->
      </div>
    </form>
  </div>
  <!-- /.login-box-body -->
</div>
<!-- /.login-box -->

<!-- jQuery 3 -->
<script src="../jscript/jquery/dist/jquery.min.js"></script>
<!-- Bootstrap 3.3.7 -->
<script src="../jscript/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- iCheck -->
<script src="../jscript/iCheck/icheck.min.js"></script>
<!-- Moments -->
<script src="../jscript/moment/min/moment.min.js"></script>
<!-- Propias -->
<script src="../jscript/loading.js"></script>
<script src="../jscript/variables.js"></script>
<script src="../jscript/utils.js"></script>
<!-- Lobibox -->
<script src="../jscript/lobibox/lobibox.js"></script>


<script>
    function validar_datos(log,oldpass,newpass){
        var r = null;
        jQuery.ajax({
            url: '../php/revcambio.php',
            method: 'post',
            data:{
              p_login:log,
              p_oldpass:oldpass,
              p_newpass:newpass
            },
            error: function(data){
               console.log(data);     
            },
            success: function (data) {
                //console.log(data); //alert(data);
                r = data;    
            },
                async: false
        });
            return r;
    }

    function crearSesion(log,pass){
      var r = null;
        jQuery.ajax({
            url: '../php/sesion.php',
            method: 'post',
            data:{
              p_login:log,
              p_passw:pass
            },
            error: function (data){
              console.log(data);    
            },
            success: function (data) {
                r = data;    
            },
                async: false
        });
            return r;      
    }

    $( document ).ready(function() {
      $( "#contraAnterior" ).keypress(function( event ) {
        $(this).parent().removeClass("has-error");
        if ( event.which == 13 ) {
          event.preventDefault();
          $("#contraNueva").focus();
        }
      });

      $( "#contraNueva" ).keypress(function( event ) {
        $(this).parent().removeClass("has-error");
        if ( event.which == 13 ) {
          event.preventDefault();
          $("#contraNuevaRepetir").focus();
        }
      });

      $( "#contraNuevaRepetir" ).keypress(function( event ) {
        $(this).parent().removeClass("has-error");
        if ( event.which == 13 ) {
          event.preventDefault();
          $("#iniciar").click();
        }
      });

        $("#iniciar").click(function(){
            if ($.trim($("#contraAnterior").val())!=""){
                if ($.trim($("#contraNueva").val())!=""){
                    if ($.trim($("#contraNueva").val()) == $.trim($("#contraNuevaRepetir").val())){
                        var resp = validar_datos($("#login").val(),$("#contraAnterior").val(),$("#contraNueva").val());
                        //console.log(resp);
                        if (resp != null) {
                            if (resp.success == 1){
                              var resp = crearSesion($("#login").val(),$("#contraNueva").val());
                              success2({msg:"Los datos fueron cambiados con exito, sera redireccionado al sistema"});
                              setTimeout(function () {
                                window.location.href = "../index.php"; //will redirect to your blog page (an ex: blog.html)
                              }, 2000); //will call the function after 2 secs.
                            }
                            else{
                                error2({msg:resp.mensaje});  
                            }
                        }
                        else {
                            error2({msg:"Error de Aplicación, Comuniquese con el Administrador"})
                        } 
                    }
                    else{
                        error2({msg:"La contraseña nueva y su verificacion deben ser iguales"});
                        $("#contraNuevaRepetir").focus().parent().addClass("has-error");                    
                    } 
                }
                else{
                    error2({msg:"Escriba la contraseña nueva, por favor"});
                    $("#contraNueva").focus().parent().addClass("has-error");                    
                }
            }
            else {
                error2({msg:"Escriba la contraseña anterior, por favor"});
                $("#contraAnterior").focus().parent().addClass("has-error");
            }  
        })
    });

</script>
</body>
</html>
<?php
  }
  else {
    header('Location: login.php');   
  }
?>
