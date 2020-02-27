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
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Usuarios <small>Usuarios del Sistema</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Usuarios
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaUsuarios" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <tr>
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
                <div class="box-footer">
                    <button type="button" id="btnBorrar" class="btn btn-danger custom pull-right" disabled><i class='fa fa-times'> </i> Borrar</button>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnNuevo" class="btn btn-success custom pull-right"><i class='fa fa-plus'> </i> Nuevo</button>
                </div>
            </div>
            <div id="divOperaciones" class="box box-primary hidden">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Usuarios</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Usuarios</span></b></h5>
                </div>
                <div class="box-body"> 
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active"><a href="#tab_datos" data-toggle="tab" aria-expanded="true">Datos Básicos</a></li>
                            <li class=""><a href="#tab_navegacion" data-toggle="tab" aria-expanded="false">Navegación</a></li>
                            <li class=""><a href="#tab_permisos" data-toggle="tab" aria-expanded="false">Permisos</a></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_datos">
                                <div class="box-body">
                                    <form id="FormaParametros">
                                        <input id="hdOperacion" type="hidden" value=""> 
                                        <div class="row">
                                            <div class="form-group col col-md-3">  
                                                <label>Rut</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control date" id="textRut" name="textRut" autocomplete="off">
                                                    <span id="iconoRut" class="input-group-btn">
                                                        <button data-input="textRut" type="button" id="btnRut" class="btn btn-success custom">
                                                            <i class='fa fa-search'></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>   
                                            <div class="form-group col col-md-3">  
                                                <label>Nombres</label>
                                                <input type="text" class="form-control" id="textNombres" name="textNombres" autocomplete="off">
                                            </div> 
                                            <div class="form-group col col-md-3"> 
                                                <label>Apellidos</label>
                                                <input type="text" class="form-control" id="textApellidos" name="textApellidos" autocomplete="off">
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Teléfono</label>
                                                <input class="form-control" id="txtTelefono" placeholder="" type="text"autocomplete="off">               
                                            </div>                                             
                                        </div>
                                        <div class="row">
                                            <div class="form-group col col-md-3">
                                                <label for="textEmail">Email</label>
                                                <input class="form-control" id="txtEmail" placeholder="" type="text"autocomplete="off">
                                            </div>
                                            <div class="form-group col col-md-3">
                                                <label for="txtDireccion">Dirección</label>
                                                <input class="form-control" id="txtDireccion" placeholder="" type="text"autocomplete="off">
                                            </div>
                                            <div class="form-group col col-md-3"> 
                                                <label>Login</label>
                                                <input class="form-control" id="textLogin" placeholder="" type="text" autocomplete="off">
                                            </div>
                                            <div class="form-group col col-md-3"> 
                                                <label>Password</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control date" id="textPassword" name="textPassword" autocomplete="off">
                                                    <span id="iconoToggle" class="input-group-btn">
                                                        <button data-input="textPassword" type="button" id="btnTogglePass" class="btn btn-warning custom">
                                                            <i class='fa fa-eye'></i>
                                                        </button>
                                                    </span>
                                                    <span id="iconoRandom" class="input-group-btn">
                                                        <button data-input="textPassword" type="button" id="btnRandomPass" class="btn btn-info custom">
                                                            <i class='fa fa-random'></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col col-md-3">
                                                <label for="selectRol">Rol</label>
                                                <select id="selectRol" name="selectRol" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>
                                            <div class="form-group col col-md-3">
                                                <label for="selectDatabase">Base de Datos</label>
                                                <select id="selectDatabase" name="selectDatabase" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>
                                            <div class="form-group col col-md-3">
                                                <label>Cambiar</label>
                                                <span id="iconoCambiar" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkCambiar" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>    
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Activo</label>
                                                <span id="iconoActivo" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>   
                            </div>
                            <div class="tab-pane" id="tab_navegacion">
                                <h4>
                                    <i class="fa fa-key fa-lg"></i>
                                    <span id="lbTitulo">Permisos de Navegación</span>
                                </h4>
                                <table id="tablaPermisos" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Ver</th>
                                        <th>Insertar</th>
                                        <th>Actualizar</th>
                                        <th>Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>        
                            </div>
                            <div class="tab-pane" id="tab_permisos">
                                En Construcción
                            </div>
                        </div>
                    </div>              
                </div>
                <div class="box-footer">
                    <button type="button" id="btnCancelar" class="btn btn-danger custom pull-right"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnAceptar" class="btn btn-success custom pull-right"><i class='fa fa-check'> Aceptar</i></button><span></span>
                </div>
            </div>
        </div>
    </div>
</section>

    <script src="jscript/datepicker/datepicker.min.js"></script>
    <script src="jscript/datepicker/datepicker.es.js"></script>
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code44.js?<?php echo time(); ?>'></script>

<script>
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteUsuarios = {activo:false,inicio:0,final:0,data:[]};
    var reportePermisos = {activo:false,inicio:0,final:0,data:[]};
    var usuarioActual = {};
    
    var tableParamsUsuarios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idusuario',
        columnDefs : [
            {
            targets:[-1,-2],
            orderable:false,
            className:"minimo80 text-center"
            },
            {
            targets:[1,2,3],
            className:"minimo200"  
            },
            {
                targets:[0],
                className:'minimo120'
            }
        ],
        columns:[
        {data:"login",title:"Login"},
        {data:"nombre",title:"Rol Asignado"},
        {data:"nombres",title:"Nombres"},
        {data:"apellidos",title:"Apellidos"},
        {data:"activo",title:"Activo"},
        {data:"cambiar",title:"Cambiar Contraseña"},
        ],
        order: [],
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
            fields:["idusuario","login","dcry","nombre","nombres","apellidos","activo","cambiar","rut","telefono","direccion","email","idrol","database"],
            realtablename:'usuarios',
            deletebtn: false,
            updatebtn:false
            };
            d.queries = [{
                fieldsSelect:["*"],
                tableName   :"public.vusuarios",
                orderby:[{
                    field:"idusuario",
                    type : "desc"
                }]   
            }];
        },
        dataSrc: function(data){  
            reporteUsuarios.data = data.resultados[0].resultados;         
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

    var tableParamsPermisos = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: true,
        rowId: 'idusuariopagina',
        columnDefs : [
            {
            targets:[-1,-2,-3,-4],
            orderable:false,
            className:"minimo80 text-center"
            },
            {
            targets:[1],
            className:"minimo80"  
            },
            {
                targets:[0],
                className:'minimo120'
            }
        ],
        columns:[
        {data:"nombretab",title:"Pagina"},
        {data:"tipo_nombre",title:"Tipo"},
        {data:"view",title:"Visualizar"},
        {data:"insert",title:"Ingresar"},
        {data:"update",title:"Modificar"},
        {data:"delete",title:"Eliminar"},
        ],
        order: [],
        select: {
        style: 'single',
        //selector: 'td:first-child'
        },
        language: spanish,
    }

    var tablaPermisos = $("#tablaPermisos").DataTable(tableParamsPermisos); 

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

</script>
<?php
}
else{
  echo "sin permiso";
}

?>