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
                Asignaciones <small>Asignaciones para Remarcación</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Asignaciones
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaAsignaciones" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>N° Asignación</td>
                            <td>Edificio</td>
                            <td>N° Medidor</td>
                            <td>Código Medidor</td>
                            <td>Código Cliente</td>
                            <td>Arrendatario</td>
                            <td>Espacio</td>
                            <td>Ubicacion</td>
                            <td>Uso</td>
                            <td>Tarifa</td>
                            <td>Remarcar</td>
                            <td>Calculos</td>
                            <td>Boleta</td>
                            <td>Inicio</td>
                            <td>Cese</td>
                            <td>Porcentaje</td>
                            <td>Asignacion Previa</td>
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
            <div id="divOperaciones" class="box box-primary hidden">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Asignaciones</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Asignaciones</span></b></h5>
                </div>
                <div class="box-body"> 
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active"><a href="#tab_1" data-toggle="tab" aria-expanded="true">Datos Básicos</a></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_1">
                                <div class="box-body">
                                    <form id="formaParametros">
                                        <input id="hdOperacion" type="hidden" value=""> 
                                        <div class="row">
                                            <div class="form-group col col-md-3">  
                                                <label>Edificio</label>
                                                <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3">  
                                                <label>Medidor Físico</label>
                                                <select id="selectMedidor" name="selectMedidor" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3"> 
                                                <label>Servicio</label>
                                                <input type="text" class="form-control" id="textServicio" name="textServicio" autocomplete="off" disabled>
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Codigo Cliente</label>
                                                <input type="text" class="form-control" id="textCodigo" name="textCodigo" autocomplete="off">
                                            </div> 
                                        </div> 
                                        <div class="row">
                                            <div class="form-group col col-md-3">  
                                                <label>Consumidor</label>
                                                <select id="selectConsumidor" name="selectConsumidor" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3">  
                                                <label>Rut</label>
                                                <input type="text" class="form-control" id="textRut" name="textRut" autocomplete="off" disabled>
                                            </div>  
                                            <div class="form-group col col-md-3"> 
                                                <label>Dirección</label>
                                                <input type="text" class="form-control" id="textDireccion" name="textDireccion" autocomplete="off" disabled>
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Espacio</label>
                                                <select id="selectEspacio" name="selectEspacio" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div> 
                                        </div> 
                                        <div class="row">
                                            <div class="form-group col col-md-3">
                                                <label>Ubicación</label>
                                                <select id="selectUbicacion" name="selectUbicacion" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div> 
                                            <div class="form-group col col-md-3">  
                                                <label>Uso</label>
                                                <select id="selectUso" name="selectUso" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3">  
                                            <label>Tarifa</label>
                                                <select id="selectTarifa" name="selectTarifa" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3">
                                                <label>Porcentaje</label>
                                                <input type="text" class="form-control" id="textPorcentaje" name="textPorcentaje" autocomplete="off"  data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Numero válido de Porcentaje requerido" required>
                                            </div> 
                                        </div> 
                                        <div class="row">
                                            <div class="form-group col col-md-3">  
                                                <label>Asignacion Previa</label>
                                                <select id="selectPrevia" name="selectPrevia" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col col-md-3">  
                                                <label>Arrendatario Previo</label>
                                                <input type="text" class="form-control" id="textConsumidorPrevio" name="textConsumidorPrevio" autocomplete="off" disabled>
                                            </div>  
                                            <div class="form-group col col-md-3"> 
                                                <label>Inicio Previo</label>
                                                <input type="text" class="form-control" id="textInicioPrevio" name="textInicio" autocomplete="off" disabled>
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Cese Previo</label>
                                                <input type="text" class="form-control" id="textCesePrevio" name="textCese" autocomplete="off" disabled>
                                            </div> 
                                        </div>  
                                        <div class="row">
                                            <div class="form-group col col-md-3"> 
                                                <label>Inicio</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control date" id="textInicio" name="textInicio" autocomplete="off">
                                                    <span id="iconoInicio" class="input-group-btn">
                                                        <button data-input="textInicio" type="button" id="btnInicio" class="btn btn-success custom icono">
                                                            <i class='fa fa-calendar-day'></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div> 
                                            <div class="form-group col col-md-3">
                                                <label>Cese</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control date" id="textCese" name="textCese" autocomplete="off">
                                                    <span id="iconoCese" class="input-group-btn">
                                                        <button data-input="textCese" type="button" id="btnCese" class="btn btn-success custom icono">
                                                            <i class='fa fa-calendar-day'></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div> 
                                        </div>
                                        <div class="row">
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkLocal">Remarcar</label>
                                                <span id="iconoAdjunto" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkLocal" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>    
                                            </div> 
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkCalculos">Calculos</label>
                                                <span id="iconoAdjunto" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkCalculos" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>    
                                            </div> 
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkBoleta">Boleta</label>
                                                <span id="iconoAdjunto" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkBoleta" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>    
                                            </div> 
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkActivo">Activo</label>
                                                <span id="iconoAdjunto" class="input-group-btn">
                                                    <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                                </span>
                                            </div>
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

    <script src="jscript/datepicker/datepicker.min.js"></script>
    <script src="jscript/datepicker/datepicker.es.js"></script>
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code25.js?<?php echo time(); ?>'></script>

<script>
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteAsignaciones = {activo:false,inicio:0,final:0,data:[]};
    var asignacionActual = 0;

    $('.date').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    });
    
    var tableParamsAsignaciones = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idasignacion',
        columnDefs:[{
            targets:[0,2,8,9,10,11,12,15,16,17],
            className:"minimo80 text-center"
        },
        {
            targets:[3,13,14],
            className:"minimo120 text-center"
        },
        {
            targets:[1,4,5,6,7],
            className:"minimo200"
        },
        {
            targets:[10,11,12,17],
            orderable:false
        }],
        columns:[
            {data:"idasignacion",title:"N° Global"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"idmedidorfisico",title:"N° Medidor"},
            {data:"codigo",title:"Código Medidor"},
            {data:"asig_codigo",title:"Código Cliente"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"ubic_nombre",title:"Ubicación"},
            {data:"usos_nombre",title:"Uso"},
            {data:"tari_nombre",title:"Tarifa"},
            {data:"local",title:"Remarcar"},
            {data:"calculos",title:"Calcular"},
            {data:"boleta",title:"Boleta"},
            {data:"asig_fechainicial",title:"Inicio"},
            {data:"asig_fechafinal",title:"Cese"},
            {data:"asig_porcentaje",title:"Porcentaje"},
            {data:"idasignacionprevia",title:"Previa"},
            {data:"asig_activo",title:"Activo"},
        ],
        order: [],
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idasignacion";
                d.show = {
                    fields:["idasignacion","idedificio","idmedidorfisico","edif_nombre","codigo","asig_codigo","idconsumidor","cons_nombre","idespacio","espa_nombre","idubicacion","ubic_nombre","iduso","usos_nombre","local","calculos","boleta","asig_fechainicial","asig_fechafinal","asig_porcentaje","idasignacionprevia","asig_activo","idtarifaedificio","tari_nombre"],
                    realtablename:'asignaciones',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"mediciones.vmedidores",
                    orderby:[{
                        field:"vmedidores.idasignacion",
                        type : "desc"
                    }],
                    where  :[{
                        field:"vmedidores.idedificio",
                        oper: "in",
                        value: "("+edificios+")",
                        type:"int"
                    }]  
                }];
            },
            dataSrc: function(data){  
                reporteAsignaciones.data = data.resultados[0].resultados;      
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

    var tablaAsignaciones = $("#tablaAsignaciones").DataTable(tableParamsAsignaciones); 


    if (edificios != '') {
        selectJs2(
            "#selectEdificio",
            { 
                value: "idedificio",
                show: {
                    fields:["nombre"],
                    format:"%s",
                },
                hide:["prefijo"],
                queries:[{
                    fieldsSelect:["idedificio","nombre","sufijo as prefijo"],
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
        $("#selectEdificio").prop("disabled",true);
    }


</script>
<?php
}
else{
  echo "sin permiso";
}

?>