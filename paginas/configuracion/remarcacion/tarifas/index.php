<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-dollar-sign fa-lg"></i>
                Tarifas <small>Tarifas Asociadas al Edificio</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Tarifas
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaTarifas" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Precio N°</td> 
                            <td>Nombre</td> 
                            <td>Edificio</td>
                            <td>Tarifa Base</td>
                            <td>Activo</td>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <div class="box-footer">
                    <button type="button" id="btnBorrar" class="btn btn-danger custom pull-right" disabled><i class='fa fa-times'> </i> Borrar</button>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnNuevo" class="btn btn-success custom pull-right"><i class='fa fa-plus'> </i> Nuevo</button>
                </div>
            </div>
            <div id="divOperaciones" class="box box-primary hidden" style="background-color:#e3e3e3;">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-dollar-sign fa-lg"></i>
                        <span id="lbTitulo">Tarifas</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Tarifas</span></b></h5>
                </div>
                <div class="box-body"> 
                    <div id="divParametros" class="col-md-3">
                        <div class="box box-primary">
                            <div class="box-header with-border">
                                <h4>
                                    <i class="fa fa-keyboard fa-lg"></i>
                                    <span id="lbTitulo">Parametros</span>
                                </h4>
                            </div>              
                            <div class="box-body">
                                <form id="FormaParametros">
                                    <input id="hdOperacion" type="hidden" value=""> 
                                    <div class="form-group">
                                            <label>Edificio</label>
                                            <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                            </select>
                                    </div> 
                                    <div class="form-group">
                                            <label>Tarifa Base</label>
                                            <select id="SelectTarifa" name="SelectTarifa" class="form-control select2" style="width: 100%;">
                                            </select>
                                    </div> 
                                    <div class="form-group">  
                                      <label>Nombre</label>
                                      <input type="text" class="form-control" id="textNombre" name="textNombre" autocomplete="off" data-smk-msg="Nombre de tarifa requerido" required>
                                    </div>  
                                    <div class="form-group"> 
                                            <label>Descripción</label>
                                            <input type="text" class="form-control" id="textDescripcion" name="textDescripcion" autocomplete="off">
                                    </div> 
                                    <div class="form-group">
                                            <label for="checkActivo">Activo</label>
                                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                    </div> 
                                </form>      
                            </div>
                            <div class="box-footer">
                                    
                            </div>           
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div id="divCargos" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-list fa-lg"></i>
                                    <span id="lbTarifa">Cargos Asociados a la Tarifa</span>
                                </h4>
                            </div>
                            <div class="box-body">
                                <div class="text-right">
                                    <button type="button" id="btnEliminarCargo" class="btn btn-danger"><i class='fa fa-minus'> </i></button><p>
                                </div> 
                                <table id="tablaCargos" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <td>Cargo</td> 
                                        <td>Nombre</td>
                                        <td>Clasificación</td>
                                        <td>Tipo Cálculo</td>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="box-footer">
                            </div>
                        </div>
                        <div id='divActualizaciones' class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-edit fa-lg"></i>
                                    Agregar Nuevo Cargo a la Lista Superior<span id='lbCargo'></span>
                                </h4>
                                <button id="btnAgregar" type="button" class="btn btn-warning pull-right"><i class="fa fa-arrow-up"> </i> Agregar</button>    
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <form id="FormaActualizacion" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="SelectCargo">Cargo</label>
                                            <select id="SelectCargo" name="SelectCargo" class="form-control select2 required" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="txtClasificacion">Clasificación</label>
                                            <input type="text" class="form-control" id="txtClasificacion" name="txtClasificacion" autocomplete="off" disabled>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="SelectCalculo">Tipo de Cálculo</label>
                                            <select id="SelectCalculo" name="SelectCalculo" class="form-control select2 required" style="width: 100%;">
                                            </select>
                                        </div>
                                    </form>
                                </div>
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code58.js?<?php echo time();?>'></script>
<script>
    //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteTarifas = {activo:false,inicio:0,final:0,data:null};
    var reporteCargos = {activo:false,inicio:0,final:0,data:null};
    var ajaxParamsCargos;
    var idTarifaActual = 0;
    var evento = true;

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
                    tableName   :"(mediciones.edificios left join mediciones.entidades using (identidad))",
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

    selectJs2(
        "#SelectTarifa",
        { 
            value: "idtarifa",
            show: {
                fields:["codigo"],
            },
            hide: ["idtarifa"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"remarcacion.tarifas",
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

    selectJs2(
        "#SelectCalculo",
        { 
            value: "idcalculo",
            show: {
                fields:["nombre"],
            },
            hide: ["idcalculo"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"remarcacion.calculos",
                orderby:[{
                    field:"calculos.idcalculo",
                    type : "asc"
                }],
    
            }],
        },
        {
        }    
    );

    var tableParamsTarifas = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idtarifaedificio',
        columnDefs:[{
            targets:[0,-2,-1],
            className:'text-center'
        }],
        columns:[
            {data:"idtarifaedificio",title:"Tarifa N°"},
            {data:"nombre",title:"Nombre"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"tari_codigo",title:"Tarifa Base"},
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
                d.primaryField = "idtarifaedificio";
                d.show = {
                    fields:["idtarifaedificio","idtarifa","idedificio","nombre","descripcion","activo","edif_nombre","tari_codigo"],
                    realtablename:'tarifasedificios',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vtarifasedificios",
                    orderby:[{
                        field:"idtarifaedificio",
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
                reporteTarifas.data = data.resultados[0].resultados;         
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

    var tablaTarifas = $("#tablaTarifas").DataTable(tableParamsTarifas); 

    var tableParamsCargos = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idcargo',
        columnDefs : [
            {
                targets : [3],
                className:'text-center'
            }
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"calc_nombre",title:"Tipo de Cálculo"},
        ],
        order: [],
        select: {
            style: 'os',
        },
        language: spanish,
    }

    var tablaCargos = $("#tablaCargos").DataTable(tableParamsCargos);



</script>           

 
        



<?php
}
else{
  echo "sin permiso";
}

?>