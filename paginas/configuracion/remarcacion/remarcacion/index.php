<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<style>
    .minimo120{
        min-width:120px;
    }
    .minimo80{
        min-width:80px;
    }
    .minimo200{
        min-width:200px;
    }
    .minimo300{
        min-width:300px;
    }
</style>

<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-cog fa-lg"></i>
                Remarcaciones <small>Proceso de Remarcación por Edificio y Tarifa</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Historico de Remarcaciones
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaRemarcaciones" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Remarcacion N°</td>  
                            <td>Edificio</td>
                            <td>Tarifa</td>
                            <td>Fecha</td>
                            <td>Desde</td>
                            <td>Hasta</td>
                            <td>Activo</td>
                            <td>Publicar</td>
                            <td>Boletas</td>
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
            <div id="divOperaciones" class="box box-primary hidden" style="background-color:#e3e3e3;">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-cog fa-lg"></i>
                        <span id="lbTitulo">Tarifas</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar Remarcaciones</span></b></h5>
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
                                <form id="FormaParametros" role="form">
                                    <input id="hdOperacion" type="hidden" value=""> 
                                    <div class="form-group">
                                        <label>Edificio</label>
                                        <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group">
                                        <label>Tarifa</label>
                                        <select id="SelectTarifa" name="SelectTarifa" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group">
                                        <label>Precios</label>
                                        <select id="SelectPrecio" name="SelectPrecio" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group">  
                                        <label>Fecha</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control date" id="textFecha" name="TextFecha" autocomplete="off" required>
                                            <span id="iconoFecha" class="input-group-btn">
                                                <button data-input="textFecha" type="button" id="btnFecha" class="btn btn-success custom icono">
                                                    <i class='fa fa-calendar-day'></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div> 
                                    <div class="form-group">
                                        <label>Fecha Inicial</label>
                                        <input type="text" class="form-control" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off" data-smk-msg="Debe seleccionar la lista de Precios a utilizar" readonly required>
                                    </div> 
                                    <div class="form-group">
                                        <label>Fecha Final</label>
                                        <input type="text" class="form-control" id="TextFechaFinal" name="TextFechaFinal" autocomplete="off" data-smk-msg="Debe seleccionar la lista de Precios a utilizar" readonly required>
                                    </div> 
                                    <div class="form-group">
                                        <label>Adjunto</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="textAdjunto" name="textAdjunto" autocomplete="off" readonly>
                                            <span id="iconoView" class="input-group-btn">
                                                <button data-input="textAdjunto" type="button" id="btnView" class="btn btn-success custom" disabled>
                                                    <i class='fa fa-search'></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div> 
                                    <div class="form-group">
                                        <div class="col col-md-6 text-center">
                                            <label for="checkActivo">Activo</label>
                                            <span id="iconoAdjunto" class="input-group-btn">
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </span>
                                        </div>
                                        <div class="col col-md-6 text-center">
                                            <label for="checkPublicar">Publicar</label>
                                            <span id="iconoAdjunto" class="input-group-btn">
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkPublicar" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </span>
                                        </div>
                                    </div> 
                                </form>      
                            </div>
                            <div class="box-footer">
                            </div>           
                        </div>
                    </div>
                    <div id="divPrecios" class="col-md-9">
                        <div id="divPrecios" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-money-bill-alt fa-lg"></i>
                                    <span id="lbTarifa">Precios Asociados a la Tarifa</span>
                                </h4>
                            </div>
                            <div class="box-body">
                                <table id="tablaPrecios" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <td>Cargo</td> 
                                        <td>Nombre</td>
                                        <td>Clasificación</td>
                                        <td>Tipo Cálculo</td>
                                        <td>Monto</td>
                                        <td>Parametros</td>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="box-footer">
                                <button id="btnCalcular" type="button" class="btn btn-warning pull-right" disabled><i class="fa fa-calculator"> </i> Calcular</button>    
                            </div>
                        </div>
                        <div id="divEnergia" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-bolt fa-lg"></i>
                                    <span id="lbTarifa">Listado de Calculos de Energía y Montos</span>
                                </h4>
                             </div>
                            <div class="box-body">
                                <div id="tab_datos">
                                    <table id="tablaAsignaciones" class="table table-bordered table-striped" style="width:100%">
                                        <thead>
                                            <tr>
                                                <td>Medidor</td>
                                                <td>Arrendatario</td>
                                                <td>Espacio</td>
                                                <td>Fecha Inicial</td>
                                                <td>Lectura Inicial</td>
                                                <td>Fecha Final</td>
                                                <td>Lectura Final</td>
                                            </tr> 
                                        </thead>
                                        <tbody>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
                                    </table>
                                </div>
                                <div id="tab_graficos">
                            </div>
                            </div>
                            <div class="box-footer">
                                <!-- <button id="btnGuardar" type="button" class="btn btn-success pull-right" disabled><i class="fa fa-database"> </i> Guardar</button>     -->
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
    <canvas id="grafico"  class="hidden" style="height: 200px; width: 400px;" width="400" height="200"></canvas>

</section>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code48.js?<?php echo time();?>'></script>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script>
    //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteRemarcaciones = {activo:false,inicio:0,final:0,data:[]};
    var reportePrecios = {activo:false,inicio:0,final:0,data:[]};
    var reporteAsignaciones = {activo:false,inicio:0,final:0,data:[]};
    var ajaxParamsPrecios;
    var ajaxParamsAsignaciones;
    var dataLeidaFacturada = {data:null};
    var RemarcacionActual = {};
    var evento = true;

    $("#textFecha").val(moment().format("YYYY-MM-DD"));

    $('.date').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    });

    if (edificios != '') {
        selectJs2(
            "#SelectEdificio",
            { 
                value: "idedificio",
                show: {
                    fields:["idedificio","nombre"],
                    format: '%s - %s'
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

    var tableParamsRemarcaciones = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idremarcacion',
        columnDefs:[{
            targets:[2,3,-1,-2],
            className:"text-center"
        },{
            targets:[-1,-2],
            orderable:false
        }],
        columns:[
            {data:"idremarcacion",title:"Precio N°"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"nombre",title:"Tarifa"},
            {data:"fecha",title:"fecha"},
            {data:"desde",title:"Desde"},
            {data:"hasta",title:"Hasta"},
            {data:"activo",title:"Activo"},
            {data:"publicar",title:"Publicar"},
            {data:"operaciones",title:"Boletas"},
        ],
        order: [[ 0, 'desc' ]],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idremarcacion";
                d.show = {
                    fields:["idremarcacion","fecha","desde","hasta","idedificio","edif_nombre","idtarifaedificio","nombre","idprecio","activo","publicar"],
                    realtablename:'remarcaciones',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vremarcaciones",
                    orderby:[{
                        field:"idremarcacion",
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
                d.otrosbotones=[
                    {nombre:"descargar",tipo:"btn-info",accion:"descargar",icono:"fa-download"},
                    {nombre:"descargarSimple",tipo:"btn-warning",accion:"descargarSimple",icono:"fa-download"}];
            },
            dataSrc: function(data){  
                reporteRemarcaciones.data = data.resultados[0].resultados;         
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

    var tablaRemarcaciones = $("#tablaRemarcaciones").DataTable(tableParamsRemarcaciones); 

    var tableParamsPrecios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idcargo',
        columnDefs : [{ 
            targets: [-2], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right',
            width:"100px",
            type:'html-num-fmt' 
            },
            {
                targets : [3,4],
                className:'text-center'
            },
            {
                targets : [-1],
                width:"200px",
            }
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"calc_nombre",title:"Tipo de Cálculo"},
            {data:"monto",title:"Monto"},
            {data:"parametros_json",title:"Parametros"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
    }

    var tablaPrecios = $("#tablaPrecios").DataTable(tableParamsPrecios);

    var tableParamsAsignaciones = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        processing: true,
        scrollY:        300,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: true,
        rowId: 'idasignacion',
        fixedColumns:   {
            leftColumns: 1,
            rightColumns: 1
        },
        columns:[
            {data:"codigo",title:"Medidor"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"energiafechainicial",title:"Fecha Inicial"},
            {data:"energiafechafinal",title:"Fecha Final"},
            {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
            {data:"energialecturafinal",title:"Lectura Final (kWh)"},
        ],
      order: [[ 0, 'asc' ]],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
    }

    var tablaAsignaciones = $("#tablaAsignaciones").DataTable(tableParamsAsignaciones);
    


</script>
<?php
}
else{
  echo "sin permiso";
}
?>