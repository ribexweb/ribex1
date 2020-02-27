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
                Listas <small>Listas de valores utilizados para la Remarcación</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Historico de Listas
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaListas" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Lista N°</td> 
                            <td>Edificio</td> 
                            <td>Nombre</td>
                            <td>Fecha</td>
                            <td>Tipo de Lista</td>
                            <td>Tipo de Dato</td>
                            <td>Activa</td>
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
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Listas</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar listas</span></b></h5>
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
                                        <label>Nombre</label>
                                        <input type="text" class="form-control" id="TextNombre" name="TextNombre" autocomplete="off" data-smk-msg="Nombre de lista requerido" required>
                                    </div> 
                                    <div class="form-group">
                                        <label>Tipo de Lista</label>
                                        <select id="SelectTipo" name="SelectTipo" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group">
                                        <label>Tipo de Dato</label>
                                        <select id="SelectTipoDato" name="SelectTipoDato" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group">  
                                        <label>Fecha</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control date" id="TextFecha" name="TextFecha" autocomplete="off" required>
                                            <span id="iconoFecha" class="input-group-btn">
                                                <button data-input="TextFecha" type="button" id="btnFecha" class="btn btn-success custom icono">
                                                    <i class='fa fa-calendar-day'></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div> 
                                    <div class="form-group"> 
                                        <label>Descripción</label>
                                        <input type="text" class="form-control" id="TextDescripcion" name="TextDescripcion" autocomplete="off">
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
                    <div id="divPrecios" class="col-md-9">
                        <div id="divPrecios" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-list fa-lg"></i>
                                    <span id="lbTarifa">Valores Asociados a la Lista</span>
                                </h4>
                            </div>
                            <div class="box-body">
                                <input type="file" name="fileCSV" id="fileCSV" accept=".csv" style="display:none"/>
                                <table id="tablaValores" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <td>Asignacion N°</td> 
                                        <td>Medidor</td>
                                        <td>Arrendatario</td>
                                        <td>Espacio</td>
                                        <td>Valor</td>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                    <tfoot>
                                        <td></td> 
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>                                    
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
                                    Modificar Valor de la Lista <span id='lbCargo'></span>
                                </h4>
                                <button id="btnActualizar" type="button" class="btn btn-warning pull-right" disabled><i class="fa fa-arrow-up"> </i> Editar</button>    
                            </div>
                            <div class="box-body">
                                <form id="FormaActualizacion" role="form" id="form">
                                        <input class="form-control" id="hdIdAsignacion" placeholder="" type="hidden">
                                        <div class="form-group col-md-4">
                                            <label for="TextAsignacion">Asignación N°</label>
                                            <input type="text" class="form-control" id="TextAsignacion" name="TextAsignacion" autocomplete="off" data-smk-msg="Seleccione un medidor de la lista superior" readonly required>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="TextMedidor">Medidor</label>
                                            <input type="text" class="form-control" id="TextMedidor" name="TextMedidor" autocomplete="off" disabled>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="TextValor">Valor</label>
                                            <input type="text" class="form-control" id="TextValor" name="TextValor" autocomplete="off"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un número válido" required>
                                        </div>
                                 </form>
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
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code57.js?<?php echo time(); ?>'></script>

<script>
    //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteListas ={activo:false,inicio:0,final:0,data:[]};
    var reporteValores = {activo:false,inicio:0,final:0,data:[]};
    var ajaxParamsValores;
    var evento = true;
    var ListaActual = {};

    $("#TextFecha").val(moment().format("YYYY-MM-DD"));

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
        "#SelectTipo",
        { 
        value: "tipo",
        show: {
            fields:["descripcion"],
            format: "%s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2]) as tipo,UNNEST(array['Fijo','Periodo']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#SelectTipoDato",
        { 
        value: "tipo",
        show: {
            fields:["descripcion"],
            format: "%s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2]) as tipo,UNNEST(array['Valores','Porcentajes']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );


    var tableParamsListas = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idlista',
        columns:[
            {data:"idlista",title:"Lista N°"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"nombre",title:"Nombre"},
            {data:"fecha",title:"Fecha"},
            {data:"tipo_descripcion",title:"Tipo de Lista"},
            {data:"tipodato_descripcion",title:"Tipo de Datos"},
            {data:"activa",title:"Activa"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idlista";
                d.show = {
                    fields:["idlista","idedificio","edif_nombre","nombre","tipo","tipo_descripcion","tipodato","tipodato_descripcion","fecha","descripcion","activa"],
                    realtablename:'listas',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vlistas",
                    orderby:[{
                        field:"idlista",
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
                reporteListas.data = data.resultados[0].resultados;         
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

    var tablaListas = $("#tablaListas").DataTable(tableParamsListas); 

    var tableParamsValores = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        rowId: 'idasignacion',
        columnDefs : [{ 
            targets: [-1], 
            //render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right',
            width:"100px",
           // type:'html-num-fmt' 
            },
        ],
        columns:[
            {data:"idasignacion",title:"Asignacion N°"},
            {data:"codigo",title:"Medidor"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"valor",title:"Valor"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        language: spanish,
        dom: 'Bfrtip',
        buttons:{
            dom:{
                button: {
                    tag: "button",
                    className: "btn btn-default"
                }
            },
            buttons : [
                {
                    className: "btn-success",
                    title:'Importar desde CSV',
                    text:'<i class="fa fa-file-import"></i>',
                    titleAttr:'Importar desde CSV',
                    action: function ( e, dt, node, config ) {
                        document.getElementById("fileCSV").click();
                    }
                },
                {
                    className: "btn-danger", 
                    title:'Consumo de Energia',
                    text:'<i class="fa fa-file-export"></i>',
                    titleAttr:'Exportar hacia CSV',
                    extend: 'csv',
                    exportOptions: {
                        modifier: {
                            selected: null
                        }
                    }
                },
                {
                    className: "btn-default", 
                    extend: 'print', 
                    title:'Enviar a impresión',
                    text:'<i class="fa fa-print"></i>',
                    titleAttr:'Enviar a impresión',
                    exportOptions: {
                        modifier: {
                            selected: null
                        }
                    }
                }
            ]
        },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            total = api
                .column( 4 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            $( api.column( 3 ).footer() ).html('Total:');
            $( api.column( 4 ).footer() ).html(Math.round(total));

        }
    }

    var tablaValores = $("#tablaValores").DataTable(tableParamsValores);

</script>
<?php
}
else{
  echo "sin permiso";
}

?>