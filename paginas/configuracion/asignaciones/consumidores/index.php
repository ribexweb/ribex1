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
                Arrendatarios <small>Arrendatarios utilizados para asignaciones</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Arrendatarios
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaConsumidores" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Edificio</td> 
                            <td>Rut</td>
                            <td>Nombre</td>
                            <td>Código</td>
                            <td>Razón Social</td>
                            <td>Dirección</td>
                            <td>Activo</td>
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
                        <span id="lbTitulo">Arrendatarios</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Arrendatario</span></b></h5>
                </div>
                <div class="box-body"> 
                    <form id="FormaParametros">
                        <input id="hdOperacion" type="hidden" value=""> 
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label>Edificio</label>
                                <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div> 
                            <div class="form-group col-md-4">  
                                <label>Nombre</label>
                                <input type="text" class="form-control" id="textNombre" name="textNombre" autocomplete="off" data-smk-msg="Nombre de Arrendatario requerido" required>
                            </div>  
                            <div class="form-group col-md-4"> 
                                <label>Rut</label>
                                <input type="text" class="form-control" id="textRut" name="textRut" autocomplete="off">
                            </div> 
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4"> 
                                <label>Código</label>
                                <input type="text" class="form-control" id="textCodigo" name="textCodigo" autocomplete="off">
                            </div> 
                            <div class="form-group col-md-4"> 
                                <label>Razón Social</label>
                                <input type="text" class="form-control" id="textRazon" name="textRazon" autocomplete="off">
                            </div> 
                            <div class="form-group col-md-4"> 
                                <label>Dirección</label>
                                <input type="text" class="form-control" id="textDireccion" name="textDireccion" autocomplete="off">
                            </div> 
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="checkActivo">Activo</label>
                                <span id="iconoAdjunto" class="input-group-btn">
                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
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
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code31.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var reporteConsumidores = {activo:false,inicio:0,final:0,data:[]};
    var ConsumidorActual = 0;
    
    var tableParamsConsumidores = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idconsumidor',
        columns:[
            {data:"edif_nombre",title:"Edificio"},
            {data:"rut",title:"RUT"},
            {data:"nombre",title:"Nombre"},
            {data:"codigo",title:"Código"},
            {data:"razonsocial",title:"Razón Social"},
            {data:"direccion",title:"Dirección"},
            {data:"activo",title:"Activo"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idconsumidor";
                d.show = {
                    fields:["identidad","idconsumidor","idedificio","edif_nombre","nombre","rut","direccion","codigo","razonsocial","activo"],
                    realtablename:'arrendatarios',
                    deletebtn: false,
                    updatebtn:false
                };
                d.hide=["identidad"];
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.vconsumidores",
                    orderby:[{
                        field:"idconsumidor",
                        type : "desc"
                    }],
                    where  :[
                        {
                        field  :"idedificio",
                        oper   :"in",
                        value  :"("+edificios+")",
                        type   :"int",  
                    }]  
                }];
            },
            dataSrc: function(data){  
                reporteConsumidores.data = data.resultados[0].resultados;         
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

    var tablaConsumidores = $("#tablaConsumidores").DataTable(tableParamsConsumidores); 

    if (edificios != '') {
        selectJs2(
            "#selectEdificio",
            { 
                value: "idedificio",
                show: {
                    fields:["nombre"],
                },
                hide: ["idedificio"],
                queries:[{
                    fieldsSelect:["idedificio","nombre"],
                    tableName   :"mediciones.vedificios",
                    orderby:[{
                        field:"nombre",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {
                        logical:"and",
                        field  :"idedificio",
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