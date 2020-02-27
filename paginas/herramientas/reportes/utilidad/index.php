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
</style>
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-dollar-sign fa-lg"></i>
                Utilidad <small>Reporte de Utilidad y Gastos Comunes</small>
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
                    <table id="tablaUtilidades" class="table table-bordered table-striped" style="width:100%" data-export-title="Listado de Utilidades" data-export-orientation="landscape">
                        <thead>
                            <td>N° Grupo</td> 
                            <td>Edificio</td> 
                            <td>Fecha</td>
                            <td>Facturas</td>
                            <td>Consumo (kWh)</td>
                            <td>Total Neto (CLP)</td>
                            <td>Monómico Compra (CLP/kWh)</td>
                            <td>Consumo Remanufacturado (kWh)</td>
                            <td>Consumo Gasto Común (kWh)</td>
                            <td>Costo Gasto Común (CLP)</td>
                            <td>Costo Insumo Comprado (CLP)</td>
                            <td>Vendido (CLP)</td>
                            <td>Monómico Venta (CLP/kWh)</td>
                            <td>Utilidad (CLP)</td>
                            <td>Total + IVA (CLP)</td>
                        </thead>
                        <tbody>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div id="divOperaciones" class="box box-primary hidden">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Datos Utilizados</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Lista de Datos utilizados y/o Generados para el Reporte</span></b></h5>
                </div>
                <div class="box-body"> 
                    <div class="nav-tabs-custom">
                        <ul id='tabletas' class="nav nav-tabs">
                            <li class="active"><a href="#tab_facturas" data-toggle="tab" aria-expanded="true">Facturas</a></li>
                        </ul>
                        <div id='tabletas-contenido' class="tab-content">
                            <div class="tab-pane active" id="tab_facturas">
                                <div class="box-body">
                                    <table id="tablaFacturas" class="table table-bordered table-striped" style="width:100%">
                                        <thead>
                                            <td>Proveedor</td> 
                                            <td>Medidor</td>
                                            <td>Boleta</td>
                                            <td>Cliente</td>
                                            <td>Fecha</td>
                                            <td>Consumo kWh</td>
                                            <td>Consumo Dem. HP</td>
                                            <td>Consumo Dem. Max</td>
                                            <td>Monto</td>
                                            <td>IVA</td>
                                            <td>SubTotal</td>
                                            <td>Crédito</td>
                                            <td>Total</td>
                                            <td>Adjunto</td>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <td>Proveedor</td> 
                                                <td>Medidor</td>
                                                <td>Boleta</td>
                                                <td>Cliente</td>
                                                <td>Fecha</td>
                                                <td>Consumo kWh</td>
                                                <td>Consumo Dem. HP</td>
                                                <td>Consumo Dem. Max</td>
                                                <td>Monto</td>
                                                <td>IVA</td>
                                                <td>SubTotal</td>
                                                <td>Crédito</td>
                                                <td>Total</td>
                                                <td>Adjunto</td>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>   
                            </div>
                        </div>
                    </div>              
                </div>
                <div class="box-footer">
                    <button type="button" id="btnCancelar" class="btn btn-danger custom pull-right"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnExportar" class="btn btn-success custom pull-right"><i class='fa fa-file-export'> Exportar</i></button><span></span>
                </div>
            </div>
        </div>
    </div>
</section> 
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code68.js?<?php echo time();?>'></script>
<script>
    //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteUtilidades = {activo:false,inicio:0,final:0,data:[]};
    var reporteFacturas = {activo:false,inicio:0,final:0,data:[]};
    reportePrecios = [];
    reporteRemarcacionesLocales=[];
    reporteRemarcacionesGastosComunes =[];
    reporteRemarcacionesClima=[];
    var grupoActual = null;





    var tableParamsUtilidades = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idgrupofactura',
        columnDefs:[{
            targets:[0],
            className:'text-center minimo80'
        },{
            targets:[0,2,3],
            className:'text-center minimo120'
        },{
            targets:[1],
            className:'minimo200',
        },{
            targets:[4,5,6,7,8,9,10,11,12,13,14],
            className:'text-right minimo120',
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
        }],
        columns:[
            {data:"idgrupofactura",title:"Grupo N°"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"fecha",title:"Fecha"},
            {data:"facturas",title:"Facturas"},
            {data:"totalconsumo",title:"Consumo Proveedor (kWh)"},
            {data:"totalneto",title:"Costo Proveedor (CLP)"},
            {data:"monomicocompra",title:"Monómico Compra (CLP/kWh)"},
            {data:"rema_totalconsumo",title:"Consumo Refacturado (kWh)"},
            {data:"consumo_gastocomun",title:"Consumo Gasto Común (kWh)"},
            {data:"costo_gastocomun",title:"Costo Gasto Común (CLP)"},
            {data:"costo_insumo",title:"Costo Insumo Comprado (CLP)"},
            {data:"rema_total",title:"Vendido (CLP)"},
            {data:"monomicoventa",title:"Monómico Venta (CLP/kWh)"},
            {data:"utilidad",title:"Utilidad (CLP)"},
            {data:"total",title:"Total + IVA (CLP)"},
        ],
        order: [[ 0, 'desc' ]],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idgrupofactura";
                d.show = {
                    fields:["idgrupofactura","idedificio","edif_nombre","fecha",
                            "descripcion","activo","facturas","totalneto","totaliva",
                            "total","totalconsumo","monomicocompra","rema_totalconsumo",
                            "consumo_gastocomun","costo_gastocomun","costo_insumo","rema_total",
                            "monomicoventa","utilidad"],
                    realtablename:'gruposfacturas',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.vutilidad",
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
                reporteUtilidades.data = data.resultados[0].resultados; 
                        
                return data.data;                 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        },
        dom: 'Bfrtip',
        //buttons: buttons,
        language: spanish,
    }

    var tablaUtilidades = $("#tablaUtilidades").DataTable(tableParamsUtilidades); 

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
            {data:"consumopp",title:"Demanda Máx HP"},
            {data:"consumoppp",title:"Demanda Máx Sum"},
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
            style: 'single',
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
            var array = [5,6,7,8,10,11,12,13];
            total = [];
            array.map(function(value,index){
                total[value] = api.column(value).data().reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                               }, 0 );;
                $(api.column(value).footer()).html(convertirFormatoLocal(total[value]));               
            });
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