<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
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
    .select2-container span.pantone-color-block {
        width: 30px;
        margin-right: 5px;
        padding-left: 5%;
        border-radius: 3px;
        border: 1px solid #808080;
    }
</style>
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Tableros <small>Tableros de visualizacion de Medidores</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Tableros Disponibles
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaTableros" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Nombre</td>
                            <td>Descripción</td>
                            <td>Posición</td>
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
            <div id="divOperaciones" class="box box-primary hidden" style="background-color:#e3e3e3;">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-file-invoice-dollar fa-lg"></i>
                        <span id="lbTitulo">Tableros</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Tableros</span></b></h5>
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
                                <form id="formaParametros">
                                    <input id="hdOperacion" type="hidden" value=""> 
                                    <div class="form-group">
                                        <label>Nombre</label>
                                        <input type="text" class="form-control" id="textNombre" name="textNombre" autocomplete="off" required>
                                    </div>
                                    <div class="form-group">  
                                        <label>Descripción</label>
                                        <input type="text" class="form-control" id="textDescripcion" name="textDescripcion" autocomplete="off">
                                    </div>  
                                    <div class="form-group">
                                        <label for="checkActivo">Activo</label>
                                        <span id="iconoAdjunto" class="input-group-btn">
                                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                        </span>
                                    </div> 
                                </form>      
                            </div>
                            <div class="box-footer">
                                    
                            </div>           
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div id="divWidgets" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-file-invoice fa-lg"></i>
                                    <span id="lbTarifa">Widgets Asociados al Tablero</span>
                                </h4>
                            </div>
                            <div class="box-body">
                                <div class="text-right">
                                    <button type="button" id="btnEliminarWidget" class="btn btn-danger"><i class='fa fa-minus'> </i></button><p>
                                </div> 
                                <table id="tablaWidgets" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <td>Tipo</td> 
                                        <td>Datos</td>
                                        <td>Tamaño</td>
                                        <td>Posición</td>
                                        <td>Activo</td>
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
                                    Ingresar o Modificar Widget <span id='lbCargo'></span>
                                </h4>
                                <button id="btnLimpiar" type="button" class="btn btn-info pull-right"><i class="fa fa-paint-brush"> </i> Limpiar</button>    
                                <span class='pull-right'>&nbsp;</span>
                                <button id="btnActualizar" type="button" class="btn btn-warning pull-right" disabled><i class="fa fa-database"> </i> Actualizar</button>    
                                <span class='pull-right'>&nbsp;</span>
                                <button id="btnAgregar" type="button" class="btn btn-success pull-right"><i class="fa fa-arrow-up"> </i> Agregar</button>
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <form id="FormaActualizacion" role="form">
                                        <input class="form-control" id="hdIdWidget" placeholder="" type="hidden">
                                        <div class="form-group col col-md-3">
                                            <label>Tipo</label>
                                            <select id="selectTipoWidget" name="selectTipoWidget" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-edificio' class="form-group col col-md-3 widget">
                                            <label>Edificio</label>
                                            <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-medidor' class="form-group col col-md-3 widget">
                                            <label>Medidor</label>
                                            <select id="selectMedidor" name="selectMedidor" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-servicio' class="form-group col col-md-3 widget">
                                            <label>Servicio</label>
                                            <select id="selectServicio" name="selectServicio" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-tamano' class="form-group col col-md-3 widget">
                                            <label>Tamaño Widget</label>
                                            <select id="selectTamano" name="selectTamano" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-meses' class="form-group col col-md-3 widget">
                                            <label>Meses Anteriores</label>
                                            <select id="selectMeses" name="selectMeses" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-color' class="form-group col col-md-3 widget">
                                            <label>Color Widget</label>
                                            <select id="selectColor" name="selectColor" class="selectColor form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div id='container-colorpicker1' class="form-group col col-md-3 widget">
                                            <label for="colorpicker1">Color Ayer</label>
                                            <br>
                                            <input id='colorpicker1' type="text" class="form-control colorrgb"  value="">
                                        </div>   
                                        <div id='container-colorpicker2' class="form-group col col-md-3 widget">
                                            <label for="colorpicker2">Color Hoy</label>
                                            <br>
                                            <input id='colorpicker2' type="text" class="form-control colorrgb"  value="">
                                        </div> 
                                        <div id='container-activo' class="form-group  col col-md-3 widget">
                                            <label for="checkActivo">Activo</label>
                                            <span id="iconoAdjunto" class="input-group-btn">
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivoWg" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </span>
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

    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code20.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var reporteTableros = {activo:false,inicio:0,final:0,data:[]};
    var reporteWidgets = {activo:false,inicio:0,final:0,data:[]};
    var tableroActual = {};
    var widgetActual = {};
    var medidorActual = -1;

    $(".widget").hide();


    
    var tableParamsTableros = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'iddashboard',
        columnDefs:[
            {targets:[-1,-2],className:'text-center minimo80'}
        ],
        columns:[
            {data:"nombre",title:"Nombre"},
            {data:"descripcion",title:"Descripción"},
            {data:"posicion",title:"Posición"},
            {data:"activo_switch",title:"Activo"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable3.php?dashboard",
            type: "POST",
            data:function(d){
                d.primaryField = "iddashboard";
                d.show = {
                    fields:["iddashboard","nombre","posicion","activo","descripcion"],
                    realtablename:'tableros',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"control.dashboards",
                    orderby:[{
                        field:"posicion",
                        type : "desc"
                    }],
                    where  :[{ 
                        field:"idusuario",
                        oper:"=",
                        value:usuarioActivo,
                        type: "int"
                    }]
                }]
            },
            dataSrc: function(data){  
                reporteTableros.data = data.resultados[0].resultados;       
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

    var tablaTableros = $("#tablaTableros").DataTable(tableParamsTableros); 

    var tableParamsWidgets = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idwidget',
        columnDefs:[
            {targets:[-1,-2,-3],className:'text-center minimo80'}
        ],
        columns:[
            {data:"tipotexto",title:"Tipo"},
            {data:"datos",title:"Datos"},
            {data:"tamano",title:"Tamaño"},
            {data:"posicion",title:"Posición"},
            {data:"activo_switch",title:"Activo"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        language: spanish,
    }

    var tablaWidgets = $("#tablaWidgets").DataTable(tableParamsWidgets); 

    selectJs2(
        "#selectColor",
        { 
        value: "color",
        show: {
            fields:["color"],
            format: "%s"
        },
        hide: ["color"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array['bg-black','bg-gray','bg-white','bg-aqua','bg-blue','bg-navy','bg-green','bg-teal','bg-olive','bg-lime','bg-yellow','bg-orange','bg-red','bg-fuchsia','bg-purple','bg-maroon']) as color) as database",
            orderby:[{
            field:"color",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectTipoWidget",
        { 
        value: "tipo",
        show: {
            fields:["descripcion"],
            format: "%s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[11,1,9,2,3,4,5,7,8]) as tipo,UNNEST(array['Comunicación de Medidores','Medidores Activos','Medidores Inactivos','Última Actualización','Potencia Actual','Potencia del Día','Últimos Consumos','Últimos Montos','Comparación Energia/Boleta']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectTamano",
        { 
        Selected: 6,
        value: "tamano",
        show: {
            fields:["tamano"],
            format: "%s"
        },
        hide: ["tamano"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[3,4,5,6,7,8,9,10,11,12]) as tamano) as database",
            orderby:[{
            field:"tamano",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectMeses",
        { 
        Selected: 6,
        value: "meses",
        show: {
            fields:["meses"],
            format: "%s"
        },
        hide: ["meses"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[2,3,4,5,6,7,8,9,10,11,12]) as meses) as database",
            orderby:[{
            field:"meses",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectServicio",
        { 
            value: "idservicio",
            show: {
                fields:["nombre","prefijo"],
                format:"%s (%s)",
            },
            hide:["prefijo"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"mediciones.servicios",
                orderby:[{
                    field:"nombre",
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
        $("#selectEdificio").prop("disabled",true);
    }

</script>
<?php
}
else{
  echo "sin permiso";
}

?>