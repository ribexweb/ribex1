<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Variables <small>Variables para Medidores</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Historico de Variables
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaVariables" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Nombre</td>
                            <td>Descripción</td>
                            <td>Unidad</td>
                            <td>Activo</td>
                            <td>Virtual</td>
                            <td>Zero</td>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <div class="box-footer">
                    <button type="button" id="btnBorrar" class="btn btn-danger custom pull-right"><i class='fa fa-times'> </i> Borrar</button>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnNuevo" class="btn btn-success custom pull-right"><i class='fa fa-plus'> </i> Nuevo</button>
                </div>
            </div>
            <div id="divOperaciones" class="box box-primary hidden">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Variables</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Variables</span></b></h5>
                </div>
                <div class="box-body"> 
                    <form id="FormaParametros">
                        <input id="hdOperacion" type="hidden" value=""> 
                        <div class="form-row">
                            <div class="form-group col-md-4">  
                                <label>Nombre</label>
                                <input type="text" class="form-control" id="TextCodigo" name="TextCodigo" autocomplete="off" data-smk-msg="Código de Variable requerido" required>
                            </div>  
                            <div class="form-group col-md-4"> 
                                <label>Descripción</label>
                                <input type="text" class="form-control" id="TextDescripcion" name="textDescripcion" autocomplete="off">
                            </div> 
                            <div class="form-group col-md-4">
                                <label>Unidad</label>
                                <select id="SelectUnidad" name="SelectUnidad" class="form-control select2" style="width: 100%;">
                                </select>
                            </div> 
                        </div> 
                        <div class="form-row">
                            <div class="form-group col col-md-4 text-center">
                                <label for="checkActivo">Activo</label>
                                <span id="iconoAdjunto" class="input-group-btn">
                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                </span>
                            </div> 
                            <div class="form-group col col-md-4 text-center">
                                <label for="checkVirtual">Virtual</label>
                                <span id="iconoAdjunto" class="input-group-btn">
                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkVirtual" checked="false" type="checkbox"><span class="switcher"></span></label>
                                </span>
                            </div>
                            <div class="form-group col col-md-4 text-center">
                                <label for="checkZero">Zero</label>  
                                <span id="iconoAdjunto" class="input-group-btn">
                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkZero" checked="false" type="checkbox"><span class="switcher"></span></label>   
                                </span>
                            </div>
                        </div>    
                    </form>                 
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
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code67.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var reporteVariables = {activo:false,inicio:0,final:0,data:[]};
    var VariableActual = {};
    
    var tableParamsVariables = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idvariable',
        columnDefs:[{
            targets:[-1,-2,-3,-4],
            className:"text-center"
        },
        {
            targets:[-1,-2,-3],
            orderable:false
        }],
        columns:[
            {data:"codigo",title:"Código"},
            {data:"descripcion",title:"Descripción"},
            {data:"unid_codigo",title:"Unidad"},
            {data:"activo",title:"Activo"},
            {data:"virtual",title:"Virtual"},
            {data:"zero",title:"Zero"},
        ],
        order: [],
        
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idvariable";
                d.show = {
                    fields:["idvariable","codigo","descripcion","idunidad","unid_codigo","activo","virtual","zero"],
                    realtablename:'variables',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.vvariables",
                    orderby:[{
                        field:"idvariable",
                        type : "desc"
                    }],
                    where  :[]  
                }];
            },
            dataSrc: function(data){  
                reporteVariables.data = data.resultados[0].resultados;         
                return data.data;                 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        },
        language: spanish,
        select: {
            style: 'single',
        },  
    }

    var tablaVariables = $("#tablaVariables").DataTable(tableParamsVariables); 

    selectJs2(
            "#SelectUnidad",
          { 
                value: "idunidad",
                show: {
                    fields:["codigo","descripcion"],
                    format: "%s-%s"
                },
                hide: ["idunidad"],
                queries:[{
                    fieldsSelect:["idunidad","codigo","descripcion"],
                    tableName   :"mediciones.unidades",
                    orderby:[{
                        field:"codigo",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        }
                        ]        
                }],
            },
            {
            }    
        );

</script>
<?php
}
else{
  echo "sin permiso";
}

?>