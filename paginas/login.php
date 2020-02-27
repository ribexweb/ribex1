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
  <link rel="stylesheet" href="../jscript/iCheck/square/blue.css">
  <!-- Lobibox -->
  <link rel="stylesheet" href="../jscript/lobibox/lobibox.css">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
</head>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="login-logo">
    <a href="http://www.ribe.cl"><img src='../images/ribe.png' width=50px><b>Ribé</b>Ingeniería</a>
  </div>
  <!-- /.login-logo -->
  <div class="login-box-body">
    <p class="login-box-msg">Datos para iniciar su Sesión</p>

    <form action="" method="post">
      <div class="form-group has-feedback">
        <input id="usuario" type="text" class="form-control" placeholder="Usuario">
        <span class="glyphicon glyphicon-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="contra" type="password" class="form-control" placeholder="Contraseña">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <div class="col-xs-8">
          <div class="checkbox icheck">
            <label>
              <input type="checkbox"> Recordarme
            </label>
          </div>
        </div>
        <!-- /.col -->
        <div class="col-xs-4">
          <button id="iniciar" type="button" class="btn btn-primary btn-block btn-flat">Ingresar</button>
        </div>
        <!-- /.col -->
      </div>
    </form>


    <a href="#">Olvide mi contraseña</a><br>

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
<script src="../jscript/moment/moment.js"></script>
<!-- Propias -->
<script src="../jscript/loading.js"></script>
<script src="../jscript/variables.js?<?php echo time();?>"></script>
<script src="../jscript/utils.js?<?php echo time();?>"></script>
<!-- Lobibox -->
<script src="../jscript/lobibox/lobibox.js"></script>


<script>
    function validar_usuario(log,pass){
        var r = null;
        jQuery.ajax({
            url: '../php/revlogin.php',
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
      $( "#usuario" ).keypress(function( event ) {
        if ( event.which == 13 ) {
          event.preventDefault();
          $("#contra").focus();
        }
      });
      $( "#contra" ).keypress(function( event ) {
        if ( event.which == 13 ) {
          event.preventDefault();
          $("#iniciar").click();
        }
      });
        $("#iniciar").click(function(){
            var resp = validar_usuario($("#usuario").val(),$("#contra").val());
            if (resp != null) {
                if (resp.success == 1){
                  if (resp.cambiar){
                    info2({msg:"Debe cambiar su contraseña, sera redirigido en unos momentos..."});
                    setTimeout(function () {
                                window.location.href = "cambio.php"; //will redirect to your blog page (an ex: blog.html)
                              }, 2000); 
                  }
                  else{
                    var resp = crearSesion($("#usuario").val(),$("#contra").val());
                    guardar_log(resp.usuario.datos.idusuario, "usuarios", "ingreso", "",resp.usuario.datos.idusuario);
                    window.location.href = "../index.php"; //will redirect to your blog page (an ex: blog.html)

                  }
                  /*if (resp.usuario.datos.cambiar == "t") {
                    window.location.href = "cambio.php"; 
                  }
                  else {
                    //crear_sesion($("#usuario").val(),$("#contra").val());
                    window.location.href = "index.php?pagina=tableros/index";
                  }*/
                }
                else{
                    error(resp.mensaje);  
                }
            }
            else {
                error("Error de Aplicación, Comuniquese con el Administrador")
            }    
        })
    });

  $(function () {
    $('input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' /* optional */
    });
  });
</script>
</body>
</html>
