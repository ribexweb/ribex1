<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css"><style>
    .minimo120{
        min-width:120px;
    }
    .minimo200{
        min-width:200px;
    }
    .minimo300{
        min-width:300px;
    }
    .datepicker{z-index:9999 !important} 
</style>
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-money-bill-alt fa-lg"></i>
                Precios <small>Precios utilizados para el proceso de Remarcación</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-money-bill-alt fa-lg"></i>
                        Historico de Precios
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaHistPrecios" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>Precio N°</td> 
                            <td>Fecha</td> 
                            <td>Edificio</td>
                            <td>Tarifa</td>
                            <td>Facturas</td>
                            <td>Desde</td>
                            <td>Hasta</td>
                            <td>Activo</td>
                            <td>Adjunto</td>
                            <td>Operaciones</td>
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
                        <i class="fa fa-money-bill-alt fa-lg"></i>
                        <span id="lbTitulo">Precios</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar precios</span></b></h5>
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
                                    <div class="form-group col">
                                        <label>Edificio</label>
                                        <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group col">
                                        <label>Tarifa</label>
                                        <select id="SelectTarifa" name="SelectTarifa" class="form-control select2" style="width: 100%;" required>
                                        </select>
                                    </div> 
                                    <div class="form-group col">
                                        <label>Factura</label>
                                        <select id="SelectFactura" name="SelectFactura" class="form-control select2" style="width: 100%;" data-smk-msg="Grupo de Facturas Requerido" required>
                                        </select>
                                    </div> 
                                    <div class="form-group col">  
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
                                    <div class="form-group col">
                                        <label>Fecha Inicial</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control datetime" id="textFechaInicial" name="TextFechaInicial" autocomplete="off" data-smk-msg="Fecha Inicial para Cálculos requerida" required>
                                            <span id="iconoFechaInicial" class="input-group-btn">
                                                <button data-input="textFechaInicial" type="button" id="btnFechaInicial" class="btn btn-success custom icono">
                                                    <i class='fa fa-calendar-day'></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div> 
                                    <div class="form-group col"> 
                                        <label>Fecha Final</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control datetime" id="textFechaFinal" name="TextFechaFinal" autocomplete="off" data-smk-msg="Fecha Final para Cálculos requerida" required>
                                            <span id="iconoFechaFinal" class="input-group-btn">
                                                <button data-input="textFechaFinal" type="button" id="btnFechaFinal" class="btn btn-success custom icono">
                                                    <i class='fa fa-calendar-day'></i>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    <form>
                                        <div class="form-group col">  
                                            <label>Adjunto</label>
                                            <div class="input-group">
                                                <form>
                                                    <input type="file" name="filePDFPrecio" id="filePDFPrecio" accept=".pdf" style="display:none"/>
                                                    <input type="text" class="form-control" id="textAdjuntoPrecio" name="textAdjuntoPrecio" autocomplete="off" readonly>
                                                    <span id="iconoAdjunto" class="input-group-btn">
                                                        <button data-input="textAdjuntoPrecio" type="button" id="btnAdjunto" class="btn btn-info custom">
                                                            <i class='fa fa-paperclip'></i>
                                                        </button>
                                                        <button data-input="textAdjuntoPrecio" type="button" id="btnLimpiarAdjunto" class="btn btn-danger custom">
                                                            <i class='fa fa-trash'></i>
                                                        </button>
                                                    </span>
                                                    <input type="submit" id="submitFilePDFPrecio" class="submit" value="Submit" style="display:none">
                                                </form>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="checkActivo">Activo</label>
                                            <span id="iconoAdjunto" class="input-group-btn">
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </span>
                                        </div> 
                                    </form>  
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
                                    <span id="lbTarifa">Cargos Asociados a la Tarifa</span>
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
                                        <td>Observaciones</td>
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
                        <div id='divActualizaciones' class="box box-primary hidden">
                            <div class="box-header">
                                <h4>
                                    <i class="fa fa-edit fa-lg"></i>
                                    Modificar cálculos para Cargo <span id='lbCargo'></span>
                                </h4>
                                <button id="btnActualizar" type="button" class="btn btn-warning pull-right"><i class="fa fa-arrow-up"> </i> Editar</button>    
                            </div>
                            <div class="box-body">
                                <div class="row">
                                    <form id="FormaActualizacion" role="form" id="form">
                                        <input class="form-control" id="hdIdCargo" placeholder="" type="hidden">
                                        <div class="form-group col-md-4">
                                            <label for="txtCargo">Cargos</label>
                                            <input type="text" class="form-control" id="txtCargo" name="txtFijoCargo" autocomplete="off" disabled>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="txtClasificacion">Clasificación</label>
                                            <input type="text" class="form-control" id="txtClasificacion" name="txtFijoClasificacion" autocomplete="off" disabled>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="selectTipoCalculo">Tipo de Calculo</label>
                                            <select id="selectTipoCalculo" name="SelectTipoCalculo" class="form-control select2" style="width: 100%;" data-smk-msg="Tipo de Cálculo Requerido" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo1' class="row calculo">
                                    <form id="FormaActualizacion1" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="txtMontoFijo">Monto Unico</label>
                                            <input type="text" class="form-control" id="txtMontoFijo" name="txtMontoFijo" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo2' class="row calculo">
                                    <form id="FormaActualizacion2" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="txtMontoUnitario">Monto Unitario</label>
                                            <input type="text" class="form-control" id="txtMontoUnitario" name="txtMontoUnitario" autocomplete="off" value="0"   data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="selectVariableFacturar">Variable a Facturar</label>
                                            <select id="selectVariableFacturar" name="SelectVariableFacturar" class="form-control select2" style="width: 100%;" data-smk-msg="Variable Requerida" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo3' class="row calculo">
                                    <form id="FormaActualizacion3" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="txtMontoMedidores">Monto a Dividir</label>
                                            <input type="text" class="form-control" id="txtMontoMedidores" name="txtMontoMedidores" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="txtCantidadMedidores">Cantidad de Medidores</label>
                                            <input type="text" class="form-control" id="txtCantidadMedidores" name="txtCantidadMedidores" autocomplete="off" valor="1"  data-smk-type="number" data-smk-msg="Ingrese un valor válido para Medidores" required>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo4' class="row calculo">
                                    <form id="FormaActualizacion4" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="txtMontoUnitario2">Monto a Dividir</label>
                                            <input type="text" class="form-control" id="txtMontoUnitario2" name="txtMontoUnitario2" autocomplete="off" value="0" data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="selectVariableLeer">Variable a Facturar</label>
                                            <select id="selectVariableLeer" name="SelectVariableLeer" class="form-control select2" style="width: 100%;" data-smk-msg="Variable Requerida" required>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="txtValorVariable">Valor Total Variable</label>
                                            <input type="text" class="form-control" id="txtValorVariable" name="txtValorVariable" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para la Variable" required>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo5' class="row calculo">
                                    <form id="FormaActualizacion5" role="form" id="form">
                                        <div class="form-group col-md-3">
                                            <label for="txtMontoLista">Monto a Dividir</label>
                                            <div class="input-group">
                                            <input type="text" class="form-control" id="txtMontoLista" name="txtMontoLista" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                                <span id="iconoMontoLista" class="input-group-btn">
                                                    <button data-input="txtMontoLista" type="button" id="btnMontoLista" class="btn btn-success custom">
                                                        <i class='fa fa-calculator'></i>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="selectLista">Lista Seleccionada</label>
                                            <select id="selectLista" name="SelectLista" class="form-control select2" style="width: 100%;" data-smk-msg="Lista Requerida" required>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="selectTotalTipo">Tipo de Total</label>
                                            <select id="selectTotalTipo" name="SelectTotalTipo" class="form-control select2" style="width: 100%;" data-smk-msg="Tipo Requerido" required>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="txtMontoTotal">Total Valores</label>
                                            <input type="text" class="form-control" id="txtMontoTotal" name="txtMontoTotal" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Total" required>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo6' class="row calculo">
                                    <form id="FormaActualizacion6" role="form" id="form">
                                        <div class="form-group col-md-3">
                                            <label for="txtMontoLista2">Monto por Unidad</label>
                                            <input type="text" class="form-control" id="txtMontoLista2" name="txtMontoLista2" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="selectLista2">Lista Seleccionada</label>
                                            <select id="selectLista2" name="selectLista2" class="form-control select2" style="width: 100%;" data-smk-msg="Lista Requerida" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo7' class="row calculo">
                                    <form id="FormaActualizacion7" role="form" id="form">
                                        <div class="form-group col-md-3">
                                            <label for="txtMontoLista3">Monto Fijo</label>
                                            <input type="text" class="form-control" id="txtMontoLista3" name="txtMontoLista3" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el Monto" required>
                                        </div>
                                        <div class="form-group col-md-3">
                                            <label for="selectLista3">Lista Seleccionada</label>
                                            <select id="selectLista3" name="selectLista3" class="form-control select2" style="width: 100%;" data-smk-msg="Lista Requerida" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo8' class="row calculo">
                                    <form id="FormaActualizacion8" role="form" id="form">
                                        <div class="form-group col-md-3">
                                            <label for="selectLista4">Lista Seleccionada</label>
                                            <select id="selectLista4" name="selectLista4" class="form-control select2" style="width: 100%;" data-smk-msg="Lista Requerida" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='calculo9' class="row calculo">
                                    <form id="FormaActualizacion9" role="form" id="form">
                                        <div class="form-group col-md-4">
                                            <label for="txtPorcentaje">Porcentaje a Aplicar</label>
                                            <input type="text" class="form-control" id="txtPorcentaje" name="txtPorcentaje" autocomplete="off" value="0"   data-smk-type="decimal" data-smk-decimal-separator="." data-smk-msg="Ingrese un valor válido para el porcentaje" required>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="selectVariablePorcentaje">Variable Seleccionada</label>
                                            <select id="selectVariablePorcentaje" name="SelectVariablePorcentaje" class="form-control select2" style="width: 100%;" data-smk-msg="Variable Requerida" required>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div id='divObservaciones' class="row">
                                    <div class="form-group col-md-6">
                                        <label for="txtObservaciones">Observaciones</label>
                                        <input type="text" class="form-control" id="txtObservaciones" name="txtObservaciones" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
                <div class="box-footer">
                    <button type="button" id="btnCancelar" class="btn btn-danger custom pull-right"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnAceptar" class="btn btn-success custom pull-right"><i class='fa fa-check'> Aceptar</i></button><span></span>
                    <button type="button" id="btnCopiar" class="btn btn-success custom pull-right hidden"><i class='fa fa-check'> Copiar</i></button><span></span>
                </div>
            </div>
        </div>
    </div>

</section>
    <div class="modal fade" id="copiarModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="box box-primary" style="background-color:#e3e3e3;">
                <div class="box-header">
                    <h4 class="modal-title" id="exampleModalLabel">
                        <i class="fa fa-search-dollar fa-lg"></i>
                        Copiar Precios
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="box-body">
                <div class="box box-primary">
                        <div class="box-header with-border">
                            <h4>
                                <i class="fa fa-keyboard fa-lg"></i>
                                <span id="lbTitulo">Parametros</span>
                            </h4>
                        </div>              
                        <div class="box-body">
                            <form id="FormaParametrosCopiar" role="form">
                                <input id="hdOperacion" type="hidden" value=""> 
                                <div class="row">
                                    <div class="form-group col col-md-4">
                                        <label>Edificio</label>
                                        <input type="hidden" class="form-control date required" id="hdIdEdificioCopiar" name="hdIdEdificioCopiar">
                                        <input type="text" class="form-control date required" id="textEdificioCopiar" name="textEdificioCopiar" autocomplete="off" disabled>
                                    </div>
                                    <div class="form-group col col-md-4">
                                        <label>Tarifa</label>
                                        <input type="hidden" class="form-control date required" id="hdIdTarifaCopiar" name="hdIdtarifaCopiar">
                                        <input type="text" class="form-control date required" id="textTarifaCopiar" name="textTarifaCopiar" autocomplete="off" disabled>
                                    </div>
                                    <div class="form-group col col-md-4">  
                                        <label>Fecha</label>
                                        <input type="text" class="form-control date required" id="textFechaCopiar" name="textFechaCopiar" autocomplete="off" disabled>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col col-md-4">  
                                        <label>Nueva Fecha Inicial</label>
                                        <input type="text" class="form-control datetime required" id="textFechaInicialCopiar" name="textFechaInicialCopiar" autocomplete="off" data-smk-msg="Fecha Inicial Requerida" required>
                                    </div>
                                    <div class="form-group col col-md-4">  
                                        <label>Nueva Fecha Final</label>
                                        <input type="text" class="form-control datetime required" id="textFechaFinalCopiar" name="textFechaFinalCopiar" autocomplete="off" data-smk-msg="Fecha Final Requerida" required>
                                    </div>
                                </div> 
                            </form>      
                        </div>
                        <div id="divEnergia" class="box box-primary">
                        <div class="box-header">
                            <h4>
                                <i class="fa fa-bolt fa-lg"></i>
                                <span id="lbTarifa">Cargos Asociados a la Tarifa</span>
                            </h4>
                            </div>
                        <div class="box-body">
                            <table id="tablaPrecios2" class="table table-bordered table-striped" style="width:100%">
                                <thead>
                                    <td>Cargo</td> 
                                    <td>Nombre</td>
                                    <td>Clasificación</td>
                                    <td>Tipo Cálculo</td>
                                    <td>Monto</td>
                                    <td>Parametros</td>
                                    <td>Observaciones</td>
                                </thead>
                                <tbody>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                        <div class="box-footer">
                            <!-- <button id="btnGuardar" type="button" class="btn btn-success pull-right" disabled><i class="fa fa-database"> </i> Guardar</button>     -->
                        </div>
                    </div>
                        <div class="box-footer">
                        </div>           
                    </div>
                </div>
                <div class="box-footer text-right">
                    <div class='col col-md-12'>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class='fa fa-window-close'> </i> Cerrar</button>
                        <button id="btnAceptarCopiar" type="button" class="btn btn-primary"><i class='fa fa-check'> Aceptar</i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="remarcacionModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div class="modal-dialog modal-lg" role="document">
            <div class="box box-primary" style="background-color:#e3e3e3;">
                <div class="box-header">
                    <h4 class="modal-title" id="exampleModalLabel">
                        <i class="fa fa-search-dollar fa-lg"></i>
                        Previsualizar Remarcación
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="box-body"> 
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h4>
                                <i class="fa fa-keyboard fa-lg"></i>
                                <span id="lbTitulo">Parametros</span>
                            </h4>
                        </div>              
                        <div class="box-body">
                            <form id="FormaParametrosModal" role="form">
                                <input id="hdOperacion" type="hidden" value=""> 
                                <div class="row">
                                    <div class="form-group col col-md-4">
                                        <label>Edificio</label>
                                        <input type="hidden" class="form-control date required" id="hdIdEdificioRemar" name="hdIdEdificioRemar">
                                        <input type="text" class="form-control date required" id="textEdificioRemar" name="textEdificioRemar" autocomplete="off" disabled>
                                    </div>
                                    <div class="form-group col col-md-4">
                                        <label>Tarifa</label>
                                        <input type="hidden" class="form-control date required" id="hdIdTarifaRemar" name="hdIdtarifaRemar">
                                        <input type="text" class="form-control date required" id="textTarifaRemar" name="textTarifaRemar" autocomplete="off" disabled>
                                    </div>
                                    <div class="form-group col col-md-4">   
                                        <label>Fecha</label>
                                        <input type="text" class="form-control date required" id="textFechaRemar" name="textFechaRemar" autocomplete="off" disabled>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col col-md-4">   
                                        <label>Fecha Inicial</label>
                                        <input type="text" class="form-control date required" id="textFechaInicialRemar" name="textFechaInicialRemar" autocomplete="off" disabled>
                                    </div>
                                    <div class="form-group col col-md-4">   
                                        <label>Fecha Final</label>
                                        <input type="text" class="form-control date required" id="textFechaFinalRemar" name="textFechaFinalRemar" autocomplete="off" disabled>
                                    </div>
                                </div> 
                            </form>      
                        </div>
                        <div class="box-footer">
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
                            <div class="text-right">
                                <button type="button" id="btnSeleccionar" class="btn btn-info btn-sm"><i class='fa fa-mouse-pointer'> </i> Seleccionar Todas</button><p>
                            </div> 
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
                                        <td>Total</td>
                                    </tr> 
                                </thead>
                                <tbody>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                        <div class="box-footer">
                            <!-- <button id="btnGuardar" type="button" class="btn btn-success pull-right" disabled><i class="fa fa-database"> </i> Guardar</button>     -->
                        </div>
                    </div>
                </div>
                <div class="box-footer text-right">
                    <div class='col col-md-12'>
                        <h4>Monto Seleccionado:
                            <span id='lbMontoSel'>0</span>
                            $
                        </h4>    
                    </div>
                    <div class='col col-md-12'>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class='fa fa-window-close'> </i> Cerrar</button>
                        <button id="btnAceptarRemar" type="button" class="btn btn-primary"><i class='fa fa-check'> Aceptar</i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="jscript/datepicker/datepicker.min.js"></script>
    <script src="jscript/datepicker/datepicker.es.js"></script>
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code63.js?<?php echo time();?>'></script>
<script>
   // loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteHistPrecios ={activo:false,inicio:0,final:0,data:[]};
    var reportePrecios = {activo:false,inicio:0,final:0,data:[]};
    var reportePrecios2 = {activo:false,inicio:0,final:0,data:[]};
    var reporteAsignaciones = {activo:false,inicio:0,final:0,data:[]};
    var dataLeidaFacturada = {data:[]};
    var ajaxParamsPrecios;
    var evento = true;
    var idPrecioActual = {};
    var idPrecioCopiar = null;
    var aceptarClose = false;
    var monto = 0;

    $(".calculo").hide();

    $("#textFecha").val(moment().format("YYYY-MM-DD"));

    $('.datetime').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    });

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
                    format: "%s - %s"
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
        "#selectTipoCalculo",
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

    selectJs2(
        "#selectVariableFacturar",
        { 
        value: "tipo",
        show: {
            fields:["tipo","descripcion"],
            format: "%s | %s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2,3,4,5]) as tipo,UNNEST(array['Energia','Demanda Máxima (BT3 y AT3)','Demanda Maxima HP (BT4.3 y AT4.3)','Demanda Máxima Suministrada (BT4.3 y AT4.3)','Potencia Contratada']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectVariableLeer",
        { 
        value: "tipo",
        show: {
            fields:["tipo","descripcion"],
            format: "%s | %s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2,3,4,5]) as tipo,UNNEST(array['Energia','Demanda Máxima (BT3 y AT3)','Demanda Maxima HP (BT4.3 y AT4.3)','Demanda Máxima Suministrada (BT4.3 y AT4.3)','Potencia Contratada']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectVariablePorcentaje",
        { 
        value: "tipo",
        show: {
            fields:["tipo","descripcion"],
            format: "%s | %s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2,3,4,5]) as tipo,UNNEST(array['Energia','Demanda Máxima (BT3 y AT3)','Demanda Maxima HP (BT4.3 y AT4.3)','Demanda Máxima Suministrada (BT4.3 y AT4.3)','Potencia Contratada']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    selectJs2(
        "#selectTotalTipo",
        { 
        value: "tipo",
        show: {
            fields:["tipo","descripcion"],
            format: "%s | %s"
        },
        hide: ["tipo"],
        queries:[{
            fieldsSelect:["*"],
            tableName   :"(select UNNEST(array[1,2]) as tipo,UNNEST(array['Total de la Lista','Otro Total']) as descripcion) as database",
            orderby:[{
            field:"tipo",
            type : "asc"
            }],       
        }],
        }      
    );

    var tableParamsHistPrecios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        rowId: 'idprecio',
        columnDefs:[{
            targets:[1,5,6],
            className: 'text-center minimo120'
        },
        {
            targets:[-1,-2],
            className: 'text-center'
        },
        {
            targets:[2,4],
            className:'minimo200'
        }],
        columns:[
            {data:"idprecio",title:"Precio N°"},
            {data:"fecha",title:"fecha"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"tari_nombre",title:"Tarifa"},
            {data:"infofactura",title:"Facturas"},
            {data:"desde",title:"Desde"},
            {data:"hasta",title:"Hasta"},
            {data:"activo",title:"Activo"},
            {data:"adjunto",title:"Adjunto"},
            {data:"operaciones",title:"Operaciones"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idprecio";
                d.show = {
                    fields:["idprecio","fecha","desde","hasta","idedificio","edif_nombre","idtarifaedificio","tari_nombre","idgrupofactura","grfact_fecha","grfact_facturas","grfact_totalneto","adjunto","adjunto_cont","activo","operaciones"],
                    realtablename:'precios',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*,coalesce(adjunto,'') as adjunto_cont","case when adjunto <> '' then concat('<button id=''',idprecio,''' name=''descargar'' data-file=''',adjunto,''' class=''btn btn-info btn-xs descargar_adjunto''><i class=''fa fa-download''></i></button>') else '' end as adjunto"],
                    tableName   :"remarcacion.vprecios",
                    orderby:[{
                        field:"idprecio",
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
                    {nombre:"copiar",tipo:"btn-warning",accion:"copiar",icono:"fa-copy"},
                ];

            },
            dataSrc: function(data){  
                data.data.map(function(element,index){
                    //"concat('Facturas:',coalesce(grfact_facturas,0),' Neto:',coalesce(grfact_totalneto,0),' CLP') as infofactura",
                    element["infofactura"] = '<b>Facturas</b>:%s, <b>Neto</b>:%s CLP'.format((element.grfact_facturas != "")?element.grfact_facturas.toLocaleString("es"):0,(element.grfact_totalneto != "")?parseFloat(element.grfact_totalneto).toLocaleString("es"):0);
                });        
                reporteHistPrecios.data = data.resultados[0].resultados; 
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

    var tablaHistPrecios = $("#tablaHistPrecios").DataTable(tableParamsHistPrecios); 

    var tableParamsPrecios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        columnDefs : [{ 
            targets: [-3], 
            render: $.fn.dataTable.render.number( '.', ',', 3 ),
            className: 'text-right minimo120',
            type:'html-num-fmt' 
            },
            {
                targets : [2,3],
                className:'text-center minimo120'
            },
            {
                targets : [1],
                className:'minimo200'                
            },
            {
                targets : [0],
                className:'text-center'   
            },
            {
                targets : [-2,-1],
                className:'minimo300'
            }
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"calc_nombre",title:"Tipo de Cálculo"},
            {data:"monto",title:"Monto"},
            {data:"parametros",title:"Parametros"},
            {data:"observaciones",title:"Observaciones"},
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
        autoWidth: false,
        rowId: 'idasignacion',
        fixedColumns:   {
            leftColumns: 1,
            rightColumns: 1
        },
        columns:[
            {data:"idasignacion",title:"Asignación"},
            {data:"codigo",title:"Medidor"},
            {data:"cons_nombre",title:"Arrendatario"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"energiafechainicial",title:"Fecha Inicial"},
            {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
            {data:"energiafechafinal",title:"Fecha Final"},
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

    var tableParamsPrecios2 = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        columnDefs : [{ 
            targets: [-3], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right minimo120',
            type:'html-num-fmt' 
            },
            {
                targets : [2,3],
                className:'text-center minimo120'
            },
            {
                targets : [1],
                className:'minimo200'                
            },
            {
                targets : [0],
                className:'text-center'   
            },
            {
                targets : [-2,-1],
                className:'minimo300'
            }
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"calc_nombre",title:"Tipo de Cálculo"},
            {data:"monto",title:"Monto"},
            {data:"parametros",title:"Parametros"},
            {data:"observaciones",title:"Observaciones"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
    }

    var tablaPrecios2 = $("#tablaPrecios2").DataTable(tableParamsPrecios2);

</script>
<?php
}
else{
  echo "sin permiso";
}

?>