<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<style>
    .minimo60{
        min-width:60px;
    }
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
<section class="content-header">
    <h1>
        Exportar Remarcación a Softland
        <small>Generar y exportar</small>
    </h1>
</section>
<section class="content">
    <div class="row">
        <!-- left column -->
        <div class="col-md-3">
            <!-- general form elements -->
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Parámetros</h3>
                </div>
                <!-- /.box-header -->
                <!-- form start -->
                <form id="FormaParametros" role="form">
                    <div class="box-body">
                        <div class="form-group col">
                            <label>Edificio</label>
                            <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                            </select>
                        </div> 
                        <div class="form-group col">
                            <label>Remarcación</label>
                            <select id="selectRemarcacion" name="selectRemarcacion" class="form-control select2" style="width: 100%;">
                            </select>
                        </div>  
                        <div class="form-group col">  
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
                        <div class="row">
                            <div class="form-group col col-md-6">
                                <label>Código de Bodega</label>
                                <input type="text" class="form-control date" id="textBodega" name="textBodega" autocomplete="off" required value='03'>
                            </div>  
                            <div class="form-group col col-md-6">
                                <label>Folio Inicial</label>
                                <input type="text" class="form-control date" id="textFolio" name="textFolio" autocomplete="off" required>
                            </div>  
                        </div>
                        <div class="row">
                            <div class="form-group col col-md-6">
                                <label>Centro de Costo</label>
                                <input type="text" class="form-control date" id="textCCosto" name="textCCosto" autocomplete="off" required value='009-300'>
                            </div>  
                            <div class="form-group col col-md-6">
                                <label>Centro de Costo Cont.</label>
                                <input type="text" class="form-control date" id="textCCostoContable" name="textCCostoContable" autocomplete="off" required value='009-300'>
                            </div> 
                        </div> 
                        <div class='row'>
                            <div class="form-group col col-md-6">
                                <label>Concepto de Salida</label>
                                <input type="text" class="form-control date" id="textSalida" name="textSalida" autocomplete="off" required value='01'> 
                            </div>  
                            <div class="form-group col col-md-6">
                                <label>Condición de Pago</label>
                                <input type="text" class="form-control date" id="textPago" name="textPago" autocomplete="off" required value='004'>
                            </div> 
                        </div>
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                        <button id="btnGenerar" type="button" class="btn btn-block btn-info custom"><i class="fa fa-cog"> </i> Generar</button>
                    </div>
                </form>
            </div>
        </div>
        <!--/.col (left) -->
        <div class="col-md-9">
            <div class="box box-primary">
                <div class="box-header">
                    <h3 class="box-title">Listado Generado</h3>
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <table id="tabla" class="table table-bordered table-striped" style="width:100%" data-export-title="Listado para Softland">
                        <thead>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
                <!-- /.box-body -->
            </div>
        </div>
    </div>
    <canvas id="grafico"  class="hidden" style="height: 200px; width: 400px;" width="400" height="200"></canvas>

</section>

<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code85.js?<?php echo time();?>'></script>
<script type="text/javascript" language="javascript">
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    reporte = {activo:false,inicio:0,final:0,data:[]};

    $("#textFecha").val(moment().format("YYYY-MM-DD"));

    var tableParams = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idconsumidor',
        columnDefs : [{ 
            targets: [-1,-2], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right minimo120'
            },{
                targets:[0,3],
                className:'minimo200',
            },{
                targets:[1,2],
                className:'minimo120',
            },{
                targets:[4],
                className: 'text-center minimo80'
            }
        ],
        columns:[
            {data:"codigobodega",title:"Código Bodega"},
            {data:"numerofolio",title:"Número de Folio"},
            {data:"fecha",title:"Fecha Generación"},
            {data:"salidabodega",title:"Salida Bodega"},
            {data:"descripcion",title:"Descripción"}, 
            {data:"codigocliente",title:"Código de Cliente"},
            {data:"centrocosto",title:"Código Centro de Costo"},
            {data:"codigobodegadestino",title:"Código de Bodega Destino"},
            {data:"codigoprecios",title:"Código Lista de Precios"},
            {data:"ordentrabajo",title:"Orden de Trabajo"},
            {data:"ordenproduccion",title:"Orden de Producción"},
            {data:"ordencompra",title:"Orden de Compra"},
            {data:"facturaasociada",title:"Factura Asociada"},
            {data:"subtipofacturaasociada",title:"Subtipo de Factura Asociada"},
            {data:"notacredito",title:"Nota de Crédito"}, 
            {data:"centrocostocontable",title:"Centro de Costo Contable"},
            {data:"codigovendedor",title:"Codigo de Vendedor"}, 
            {data:"condicionpago",title:"Condición de Pago"}, 
            {data:"lugardespacho",title:"Lugar de Despacho"}, 
            {data:"retiradopor",title:"Retirado por"},
            {data:"patente",title:"Patente"}, 
            {data:"solicitadopor",title:"Solicitado por"}, 
            {data:"despachadopor",title:"Despachado por"}, 
            {data:"notaventa",title:"Nota de Venta"},
            {data:"porcentajedescuento1",title:"% Descuento 1"},
            {data:"valordescuento1",title:"Valor de Descuento 1"},
            {data:"porcentajedescuento2",title:"% Descuento 2"}, 
            {data:"valordescuento2",title:"Valor de Descuento 2"},
            {data:"porcentajedescuento3",title:"% Descuento 3"},
            {data:"valordescuento3",title:"Valor de Descuento 3"}, 
            {data:"porcentajedescuento4",title:"% Descuento 4"},
            {data:"valordescuento4",title:"Valor de Descuento 4"},
            {data:"porcentajedescuento5",title:"% Descuento 5"},
            {data:"valordescuento5",title:"Valor de Descuento 5"},
            {data:"flete",title:"Flete"},
            {data:"embalaje",title:"Embalaje"}, 
            {data:"totalfinal",title:"Total final"}, 
            {data:"codigoproducto",title:"Código del Producto"}, 
            {data:"descripcionproducto",title:"Descripción del Producto"}, 
            {data:"unidadmedida",title:"Unidad de Medida"},
            {data:"cantidad",title:"Cantidad Despachada"}, 
            {data:"preciounitario",title:"Precio Unitario"}, 
            {data:"porcentajedescuentolinea1",title:"% Descuento L1"},
            {data:"valordescuentolinea1",title:"Valor Descuento L1"}, 
            {data:"porcentajedescuentolinea2",title:"% Descuento L2"},
            {data:"valordescuentolinea2",title:"Valor Descuento L2"}, 
            {data:"porcentajedescuentolinea3",title:"% Descuento L3"}, 
            {data:"valordescuentolinea3",title:"Valor Descuento L3"}, 
            {data:"porcentajedescuentolinea4",title:"% Descuento L4"}, 
            {data:"valordescuentolinea4",title:"Valor Descuento L4"},
            {data:"porcentajedescuentolinea5",title:"% Descuento L5"}, 
            {data:"valordescuentolinea5",title:"Valor Descuento L5"},
            {data:"valortotaldescuentolinea",title:"Total Descuento Linea"}, 
            {data:"partidatalla",title:"Partida o Talla"},  
            {data:"piezacolor",title:"Pieza o Color"},  
            {data:"vencimiento",title:"Vencimiento"}, 
            {data:"serie",title:"Serie"},  
            {data:"cuentaconsumo",title:"Cuenta de Consumo"}, 
        ],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        //buttons: buttons,
        language: spanish,

    }

    var Tabla = $("#tabla").DataTable(tableParams);

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
        $("#selectEdificio").prop("disabled",true);
    }

    $('#textFecha').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 
</script>

<?php
}
else{
  echo "sin permiso";
}

?>