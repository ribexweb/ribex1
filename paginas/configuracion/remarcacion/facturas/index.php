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
    #tablaFacturas tfoot tr th{
		background:#d7e1c5;
		font-weight:bold;
		}
</style>
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-file-invoice-dollar fa-lg"></i>
                Facturas <small>Grupos de Facturas Electricas Asociadas al Edificio</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Grupos de Facturas
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaGrupos" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>N° Grupo</td> 
                            <td>Edificio</td> 
                            <td>Fecha</td>
                            <td>Facturas</td>
                            <td>Consumo kWh</td>
                            <td>Total Neto</td>
                            <td>Total IVA</td>
                            <td>SubTotal</td>
                            <td>Crédito</td>
                            <td>Total</td>
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
                        <i class="fa fa-file-invoice-dollar fa-lg"></i>
                        <span id="lbTitulo">Grupos de Facturas</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Grupos de Facturas</span></b></h5>
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
                                            <label>Edificio</label>
                                            <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                                            </select>
                                    </div>
                                    <div class="form-group">  
                                        <label>Fecha</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control date" id="textFecha" name="TextFecha" autocomplete="off" data-smk-msg="Fecha Requerida" required>
                                            <span id="iconoFecha" class="input-group-btn">
                                                <button data-input="textFecha" type="button" id="btnFecha" class="btn btn-success custom icono">
                                                    <i class='fa fa-calendar-day'></i>
                                                </button>
                                            </span>
                                        </div>
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
                        <div id="divFacturas" class="box box-primary">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-file-invoice fa-lg"></i>
                                    <span id="lbTarifa">Facturas Asociadas al Grupo</span>
                                </h4>
                            </div>
                            <div class="box-body">
                                <div class="text-right">
                                    <button type="button" id="btnEliminarFactura" class="btn btn-danger"><i class='fa fa-minus'> </i></button><p>
                                </div> 
                                <table id="tablaFacturas" class="table table-bordered table-striped" style="width:100%">
                                    <thead>
                                        <td>Proveedor</td> 
                                        <td>Medidor</td>
                                        <td>Boleta</td>
                                        <td>Cliente</td>
                                        <td>Fecha</td>
                                        <td>Consumo kWh</td>
                                        <td>Demanda Máx HP</td>
                                        <td>Demanda Máx Sum</td>
                                        <td>Monto</td>
                                        <td>IVA</td>
                                        <td>SubTotal</td>
                                        <td>Crédito</td>
                                        <td>Total</td>
                                        <td>Adjunto</td>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th></th> 
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>    
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
                                    Ingresar o Modificar Factura <span id='lbCargo'></span>
                                </h4>
                                <button id="btnLimpiar" type="button" class="btn btn-info pull-right"><i class="fa fa-paint-brush"> </i> Limpiar</button>    
                                <span class='pull-right'>&nbsp;</span>
                                <button id="btnActualizar" type="button" class="btn btn-warning pull-right" disabled><i class="fa fa-arrow-up"> </i> Editar</button>    
                                <span class='pull-right'>&nbsp;</span>
                                <button id="btnAgregar" type="button" class="btn btn-success pull-right"><i class="fa fa-arrow-up"> </i> Agregar</button>
                            </div>
                            <div class="box-body">
                                <form id="formaActualizacion" role="form">
                                    <input class="form-control" id="hdIdFactura" placeholder="" type="hidden">
                                    <div class="row">
                                        <div class="form-group col col-md-3">
                                            <label>Proveedor</label>
                                            <select id="selectProveedor" name="selectProveedor" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div class="form-group col col-md-3">
                                            <label>Medidor</label>
                                            <select id="selectMedidor" name="selectMedidor" class="form-control select2" style="width: 100%;">
                                            </select>
                                        </div>
                                        <div class="form-group col col-md-3">  
                                            <label>Boleta</label>
                                            <input type="text" class="form-control" id="textBoleta" name="textBoleta" autocomplete="off" data-smk-msg="Número de boleta requerido" required>
                                        </div>  
                                        <div class="form-group col col-md-3">  
                                            <label>Cliente</label>
                                            <input type="text" class="form-control" id="textCliente" name="textCliente" autocomplete="off" data-smk-msg="Número de cliente requerido" required>
                                        </div> 
                                    </div>
                                    <div class="row">
                                        <div class="form-group col col-md-3">  
                                            <label>Fecha Emisión Boleta</label>
                                            <div class="input-group">
                                                <input type="text" class="form-control date" id="textFechaFactura" name="TextFechaFactura" autocomplete="off" data-smk-msg="Fecha Requerida" required>
                                                <span id="iconoFecha" class="input-group-btn">
                                                    <button data-input="textFechaFactura" type="button" id="btnFechaFactura" class="btn btn-success custom icono">
                                                        <i class='fa fa-calendar-day'></i>
                                                    </button>
                                                </span>
                                            </div>
                                        </div> 
                                        <div class="form-group col col-md-3">  
                                            <label>Consumo</label>
                                            <input type="text" class="form-control" id="textConsumo" name="textConsumo" autocomplete="off"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Valor válido Consumo" required>
                                        </div> 
                                        <div class="form-group col col-md-3">  
                                            <label>Demanda Max HP</label>
                                            <input type="text" class="form-control" id="textConsumoPP" name="textConsumoPP" autocomplete="off"  data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Valor válido Demanda Máx HP" required value="0">
                                        </div> 
                                        <div class="form-group col col-md-3">  
                                            <label>Demanda Max Sum.</label>
                                            <input type="text" class="form-control" id="textConsumoPPP" name="textConsumoPPP" autocomplete="off"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Valor válido Demanda Máx Sum" required value="0">
                                        </div> 
                                    </div> 
                                    <div class="row">
                                        <div class="form-group col col-md-3">  
                                            <label>Monto Neto</label>
                                            <input type="text" class="form-control" id="textMontoNeto" name="textMontoNeto" autocomplete="off"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Valor válido Monto Neto" required>
                                        </div>                                    
                                        <div class="form-group col col-md-3">  
                                            <label>IVA (%)</label>
                                            <input type="text" class="form-control" id="textIVA" name="textIVA" autocomplete="off" value="19"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Valor válido (%) de IVA" required>
                                        </div>                                    
                                        <div class="form-group col col-md-3">  
                                            <label>Monto IVA</label>
                                            <input type="text" class="form-control" id="textMontoIVA" name="textMontoIVA" autocomplete="off" readonly>
                                        </div> 
                                        <div class="form-group col col-md-3">  
                                            <label>SubTotal</label>
                                            <input type="text" class="form-control" id="textSubTotal" name="textSubTotal" autocomplete="off" readonly>
                                        </div>                                      
                                    </div>  
                                    <div class="row">
                                        <div class="form-group col col-md-3">  
                                            <label>Credito</label>
                                            <input type="text" class="form-control" id="textCredito" name="textCredito" autocomplete="off"   data-smk-msg="Valor válido Crédito" required value='0'>
                                        </div> 
                                        <div class="form-group col col-md-3">  
                                            <label>Total</label>
                                            <input type="text" class="form-control" id="textMontoTotal" name="textMontoTotal" autocomplete="off" readonly>
                                        </div> 
                                        <div class="form-group col col-md-6">  
                                            <label>Adjunto</label>
                                            <div class="input-group">
                                                <form>
                                                    <input type="file" name="filePDF" id="filePDF" accept=".pdf" style="display:none"/>
                                                    <input type="text" class="form-control" id="textAdjunto" name="textAdjunto" autocomplete="off" readonly>
                                                    <span id="iconoAdjunto" class="input-group-btn">
                                                        <button data-input="textAdjunto" type="button" id="btnAdjunto" class="btn btn-info custom">
                                                            <i class='fa fa-paperclip'></i>
                                                        </button>
                                                        <button data-input="textAdjunto" type="button" id="btnLimpiarAdjunto" class="btn btn-danger custom">
                                                            <i class='fa fa-trash'></i>
                                                        </button>
                                                    </span>
                                                    <input type="submit" id="submitFilePDF" class="submit" value="Submit" style="display:none">
                                                </form>
                                            </div>
                                        </div>                                     
                                    </div>
                                    <div class="row">
                                        <div class="form-group col col-md-6">  
                                            <label>Observaciones</label>
                                            <input type="text" class="form-control" id="textObservaciones" name="textObservaciones" autocomplete="off">
                                        </div> 
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
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code52.js?<?php echo time();?>'></script>
<script>
    //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteGrupos = {activo:false,inicio:0,final:0,data:[]};
    var reporteFacturas = {activo:false,inicio:0,final:0,data:[]};
    var GrupoActual = null;
    var evento = true;

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

    selectJs2(
        "#selectProveedor",
        { 
            value: "idproveedor",
            show: {
                fields:["nombre"],
            },
            hide: ["idproveedor"],
            queries:[{
                fieldsSelect:["idproveedor","nombre"],
                tableName   :"mediciones.vproveedores",
                orderby:[{
                    field:"nombre",
                    type : "asc"
                }],
                where  :[{
                    field  :"activo",
                    oper   :"=",
                    value  :"true",
                    type   :"int",                    
                    }]        
            }],
        },
        {
        }    
    );



    var tableParamsGrupos = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idgrupofactura',
        columnDefs:[{
            targets:[1],
            className:'minimo200',
        },{
            targets:[0,2,3,-1],
            className:'text-center minimo120'
        },{
            targets:[5,6,7,8,9],
            className:'text-right minimo120',
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
        },
        {
            targets:[4],
            className:'text-right minimo120',
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
        }],

        columns:[
            {data:"idgrupofactura",title:"Grupo N°"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"fecha",title:"Fecha"},
            {data:"facturas",title:"Facturas"},
            {data:"totalconsumo",title:"Consumo kWh"},
            {data:"totalneto",title:"Total Neto"},
            {data:"totaliva",title:"Total IVA"},
            {data:"subtotal",title:"SubTotal"},
            {data:"credito",title:"Credito"},
            {data:"total",title:"Total"},
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
                d.primaryField = "idgrupofactura";
                d.show = {
                    fields:["idgrupofactura","idedificio","edif_nombre","fecha","descripcion","activo","facturas","totalneto","totaliva","total","totalconsumo","credito","subtotal"],
                    realtablename:'gruposfacturas',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vgruposfacturas",
                    orderby:[{
                        field:"idgrupofactura",
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
                reporteGrupos.data = data.resultados[0].resultados;         
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

    var tablaGrupos = $("#tablaGrupos").DataTable(tableParamsGrupos); 

    var tableParamsFacturas = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idfactura',
        columnDefs : [
            {
                targets:[0,1],
                className:'minimo120',
            },
            {
                targets : [2,3,4,-1],
                className:'text-center minimo120'
            },
            {
                targets : [6,7,8,9,10,11,12,13],
                className:'text-right minimo120',
                render: $.fn.dataTable.render.number( '.', ',', 2 ),
            },
            {
                targets : [5],
                className:'text-right minimo120',
                render: $.fn.dataTable.render.number( '.', ',', 2 ),
            },
            {
                targets:[14],
                className:'minimo200'
            }
        ],
        columns:[
            {data:"prov_nombre",title:"Proveedor"},
            {data:"codigo",title:"Medidor"},
            {data:"boleta",title:"Boleta"},
            {data:"cliente",title:"Cliente"},
            {data:"fecha",title:"Fecha"},
            {data:"consumo",title:"Consumo kWh"},
            {data:"consumopp",title:"Dem. Max. HP"},
            {data:"consumoppp",title:"Dem. Max. Sum."},
            {data:"monto",title:"Monto"},
            {data:"iva",title:"IVA"},
            {data:"montoiva",title:"Monto IVA"},
            {data:"montosubtotal",title:"SubTotal"},
            {data:"credito",title:"Crédito"},
            {data:"montototal",title:"Total"},
            {data:"observaciones",title:"Observaciones"},
            {data:"adjunto",title:"Adjunto"},
        ],
        order: [],
        select: {
            style: 'os',
        },
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            total = [];
            total[5] = api.column(5).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[6] = api.column(6).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[7] = api.column(7).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[8] = api.column(8).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[10] = api.column(10).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[11] = api.column(11).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[12] = api.column(12).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            total[13] = api.column(13).data().reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0 );
            $( api.column(4).footer() ).html('Totales:');
            $( api.column(5).footer() ).html(convertirFormatoLocal(total[5]));
            $( api.column(6).footer() ).html(convertirFormatoLocal(total[6]));
            $( api.column(7).footer() ).html(convertirFormatoLocal(total[7]));
            $( api.column(8).footer() ).html(convertirFormatoLocal(total[8]));
            $( api.column(10).footer() ).html(convertirFormatoLocal(total[10]));
            $( api.column(11).footer() ).html(convertirFormatoLocal(total[11]));
            $( api.column(12).footer() ).html(convertirFormatoLocal(total[12]));
            $( api.column(13).footer() ).html(convertirFormatoLocal(total[13]));
        }
    }

    var tablaFacturas = $("#tablaFacturas").DataTable(tableParamsFacturas);

</script>           

<?php
}
else{
  echo "sin permiso";
}

?>