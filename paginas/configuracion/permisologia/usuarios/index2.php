<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" href="jscript/iCheck/all.css">
<section style="padding:5px 5px">
  <div class="col-xs-12 box">
    <div class="box-header bg-light-gray with-border">
      <h4>
        <i class="fa fa-users fa-lg"></i>
        Usuarios
      </h4>
      <h5><b>Administrar usuarios del Sistema</b></h5>
    </div>  
    <div class="box-body">
      <div class="row text-right">
        <button type="button" id="btnNuevo" class="btn btn-success custom"><i class='fa fa-plus'> </i> Ingresar</button><span clas></span>
        <button type="button" id="btnBorrar" class="btn btn-danger custom"><i class='fa fa-times'> </i> Borrar</button><p>
      </div>
      <div class="row">
        <table id="tablaUsuarios" class="table table-bordered table-striped" style="width:100%">
          <thead>
            <tr>
              <th>Usuario N°</th>
              <th>Login</th>
              <th>Rol</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Activo</th>
              <th>Cambiar</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div id="divOperaciones" class="col-xs-12 box hidden">
    <div class="box-header bg-light-gray with-border">
      <h4>
        <i class="fa fa-users fa-lg"></i>
        <span id="lbTitulo">Usuarios</span>
      </h4>
      <h5><b><span id="lbTituloDescripcion">Administrar usuarios del Sistema</span></b></h5>
    </div>  
    <div class="box-body">
    <form role="form" id="formUsuarios">
      <div class="row">
        <p class="lead"><b>Datos Personales:</b></p>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <input class="form-control" id="hdIdPersona" placeholder="" type="hidden">
          <input class="form-control" id="hdIdUsuario" placeholder="" type="hidden">
          <input class="form-control" id="hdOperacion" placeholder="" type="hidden">
          <div class="form-group col-md-3">
            <label for="txtRut">Rut</label>
            <div class="input-group">
                <input type="text" class="form-control" id="txtRut" name="txtRut" autocomplete="off">
                <span id="iconoFechaFinal" class="input-group-btn">
                  <button data-input="txtRut" type="button" id="btnSearchRut" class="btn btn-success custom">
                    <i class='fa fa-search'></i>
                  </button>
                </span>
            </div>
          </div>
          <div class="form-group col-md-3">
            <label for="txtNombres">Nombres</label>
            <input class="form-control" id="txtNombres" placeholder="" type="text">
          </div>
          <div class="form-group col-md-3">
            <label for="txtApellidos">Apellidos</label>
            <input class="form-control" id="txtApellidos" placeholder="" type="text">
          </div>
          <div class="form-group col-md-3">
            <label for="txtTelefonos">Telefonos</label>
            <input class="form-control" id="txtTelefonos" placeholder="" type="text">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group col-md-3">
            <label for="textEmail">Email</label>
            <input class="form-control" id="txtEmail" placeholder="" type="text">
          </div>
          <div class="form-group col-md-3">
            <label for="txtDireccion">Dirección</label>
            <input class="form-control" id="txtDireccion" placeholder="" type="text">
          </div>
        </div>
      </div>
      <div class="row">
          <p class="lead"><b>Datos de la Cuenta:</b></p>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group col-md-3">
            <label for="txtLogin">Login</label>
            <input class="form-control" id="txtLogin" placeholder="" type="text">
          </div>
          <div class="form-group col-md-3">
          <label for="txtPassword">Password</label>
            <div class="input-group">
                <input type="password" class="form-control" id="txtPassword" name="txtPassword" autocomplete="off">
                <span id="iconoToggle" class="input-group-btn">
                  <button data-input="txtPassword" type="button" id="btnTogglePass" class="btn btn-warning custom">
                    <i class='fa fa-eye'></i>
                  </button>
                </span>
                <span id="iconoRandom" class="input-group-btn">
                  <button data-input="txtPassword" type="button" id="btnRandomPass" class="btn btn-info custom">
                    <i class='fa fa-random'></i>
                  </button>
                </span>
            </div> 
          </div>
          <div class="form-group col-md-3">
            <label for="selectRol">Rol</label>
            <select id="selectRol" name="selectRol" class="form-control select2" style="width: 100%;">
            </select>
          </div>
          <div class="form-group col-md-3">
            <label for="selectDatabase">Base de Datos</label>
            <select id="selectDatabase" name="selectDatabase" class="form-control select2" style="width: 100%;">
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group col-md-3">
            <label for="checkActivo">Activo</label>
            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="" type="checkbox"><span class="switcher"></span></label>
            <label for="checkCambiar">Cambiar</label>
            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkCambiar" checked="" type="checkbox"><span class="switcher"></span></label>
          </div>
        </div>
      </div>
      <div class="row text-right">
        <button type="button" id="btnAceptar" class="btn btn-success custom"><i class='fa fa-check'> </i> Aceptar</button><span></span>
        <button type="button" id="btnCancelar" class="btn btn-danger custom"><i class='fa fa-window-close'> </i> Cancelar</button><p>
      </div>
    </form>
    </div>
  </div>  
</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code44.js?<?php echo time();?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script>
  var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
  var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
  edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
  var reporteUsuarios = {activo:false,inicio:0,final:0,data:[]};
  var usuarioActual = {};
  var tableParamsUsuarios = { 
    responsive:true,
    destroy: true,
    paging: true,
    searching: true,
    columnDefs : [
      {targets:[-1,-2,-3],orderable:false,classname:"text-center"},
      {targets:[0],visible:false,orderable:false,searchable:false}
    ],
    columns:[
      {data:"idusuario",title:"Usuario N°"},
      {data:"login",title:"Login"},
      {data:"nombre",title:"Rol Asignado"},
      {data:"nombres",title:"Nombres"},
      {data:"apellidos",title:"Apellidos"},
      {data:"activo",title:"Activo"},
      {data:"cambiar",title:"Cambiar Contraseña"},
    ],
    order: [[ 3, 'desc' ]],
    select: {
      style: 'single',
      //selector: 'td:first-child'
    },
    ajax:{
      url:"php/getTable2.php",
      type: "POST",
      data:function(d){
        d.primaryField = "idusuario";
        d.show = {
          fields:["idusuario","login","nombre","nombres","apellidos","activo","cambiar"],
          realtablename:'usuarios',
          deletebtn: false,
          updatebtn:false
        };
        d.queries = [{
          fieldsSelect:["*"],
          tableName   :"public.vusuarios",
          orderby:[{
            field:"login",
            type : "asc"
          }]   
        }];
      },
      dataSrc: function(data){  
        reporte.data = data.resultados[0].resultados;         
        return data.data;                 
      },
      error: function (jqXHR, textStatus, errorThrown) {
        error2({
          msg:errorThrown
        });
      },
    },
    language: spanish,
  }

  var tablaUsuarios = $("#tablaUsuarios").DataTable(tableParamsUsuarios); 

  selectJs2(
    "#selectRol",
    { 
      value: "idrol",
      show: {
        fields:["nombre","descripcion"],
        format: "%s | %s"
      },
      hide: ["idrol"],
      queries:[{
        fieldsSelect:["idrol","nombre","descripcion"],
        tableName   :"public.roles",
        orderby:[{
          field:"nombre",
          type : "asc"
        }],
        where  :[{
          field  :"activo",
          oper   :"=",
          value  :"true",
          type   :"int",       
        },]        
      }],
    }      
  );
  selectJs2(
    "#selectDatabase",
    { 
      value: "tipo",
      show: {
        fields:["tipo","descripcion"],
        format: "%s | %s"
      },
      hide: ["tipo"],
      queries:[{
        fieldsSelect:["*"],
        tableName   :"(select UNNEST(array['FULL','15MIN']) as tipo,UNNEST(array['BD Consultas Lentas','BD Consultas Rapidas']) as descripcion) as database",
        orderby:[{
          field:"database",
          type : "asc"
        }],       
      }],
    }      
  );

  function updateComponents(record){
    $("#hdIdPersona").val(record.idpersona);
    $("#hdIdUsuario").val(record.idusuario);
    $("#txtRut").val(record.rut);
    $("#txtNombres").val(record.nombres);
    $("#txtApellidos").val(record.apellidos);
    $("#txtTelefonos").val(record.telefonos);
    $("#txtDireccion").val(record.direccion);
    $("#txtEmail").val(record.email);
    $("#txtLogin").val(record.login);
    $("#selectRol").val(record.idrol);
    $("#txtPassword").val(record.dcry);
    $("#selectRol").select2().trigger('change');
    $("#selectDatabase").val(record.database);
    $("#selectDatabase").select2().trigger('change');
    $("#checkActivo").attr("checked",(record.activo=='t'));
    $("#checkCambiar").attr("checked",(record.cambiar=='t'));    
  }

  function clearForm(idForm){
    $(idForm+' input').each(function(){
      switch (this.type) {
        case 'text'    : this.value   = '';  break;
        case 'checkbox': this.checked = true;break;
        case 'hidden'  : this.value   = '';  break;
      }      
    });
    $(idForm+' select').each(function(){
      this.selectedIndex = 0;
    });
  }

  function loadPersona(rut){
      $.ajax({
        url:"php/data.php",
        method:"POST",
        data:{
          queries:[{
            fieldsSelect:["*"],
            tableName   :"public.personas left join usuarios using (idpersona)",
            where  :[{
              field  :"rut",
              oper   :"=",
              value  :rut,
              type   :"str",       
            },]        
          }],
        },
        dataType:"json",
        success:function(data){
          if (data[0].resultados.length > 0){
            recordUsuario = data[0].resultados[0];
            $("hdIdPersona").val(record.idpersona);
            $("#txtNombres").val(record.nombres);
            $("#txtApellidos").val(record.apellidos);
            $("#txtTelefonos").val(record.telefonos);
            $("#txtDireccion").val(record.direccion);
            $("#txtEmail").val(record.email);
          }
          else{
            $("hdIdPersona").val('');
            $("#txtNombres").val('');
            $("#txtApellidos").val('');
            $("#txtTelefonos").val('');
            $("#txtDireccion").val('');
            $("#txtEmail").val('');           
            warning2({msg:"Persona con rut %s no encontrado".format(rut)});
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          error2({
              msg:errorThrown
          });
        },
      });
  }

</script>

<?php
}
else{
  echo "sin permiso";
}

?>