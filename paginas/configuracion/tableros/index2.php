<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<section class="content-header">
      <h1>
        Tableros
        <small>Tableros de Visualizacion de Medidores</small>
      </h1>
</section>
<section class="content">
  <div class="row">
    <div class="col-xs-12">
      <div class="box">
        <div class="box-body">
          <div class="text-right">
            <button type="button" id="nuevoTablero" data-toggle="modal" data-target="#tableroModal" class="btn btn-info btn-sm"><i class='fa fa-plus'> </i> Nuevo</button>
          </div>

            <table id="tabla" class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Posicion</th>
                  <th>Activo</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>

        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
    </div>
    <!-- /.col -->
  </div>
  <div id="divForma" class="hidden">
    <div class="box box-success">
      <div class="box-header with-border">
          <h3 id="formtitle" class="box-title">Widgets Habilitados</h3>
          <div class="box-tools pull-right">
              <button id="cerrarForma" type="button" class="btn btn-box-tool"><i class="fa fa-remove"></i></button>
          </div>
      </div>
      <div class="box-body">
          <div class="row">
            <div class="col-md-12">
              <div class="text-right">
                <button type="button" id="nuevoWidget" data-iddashboard="0" data-toggle="modal" data-target="#widgetModal" class="btn btn-info btn-sm"><i class='fa fa-plus'> </i> Nuevo</button>
              </div>
              <table id="tablawidgets" class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Datos</th>
                    <th>Posicion</th>
                    <th>Activo</th>
                    <th>Operaciones</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  </div>
</section>  

<div id="tableroModal" class="modal fade">
	<div class="modal-dialog">
		<form method="post" id="FormaTablero" enctype="multipart/form-data">
			<div class="modal-content">
				<div class="modal-header">
					<button id="cerrarModal" type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title-tablero">Agregar Nuevo Tablero</h4>
				</div>
				<div class="modal-body">
          <div class="row form-group">
            <div class="col col-md-12">
              <label>Nombre</label>
              <input type="text" data-field="nombre" name="textNombreTablero" id="textNombreTablero" class="form-control" autocomplete="off" />
            </div>
          </div>
          <div class="row form-group">
            <div class="col col-md-12">
              <label>Activo</label> 
              <input type="checkbox" data-field="activo" id="chkActivoTablero" name="chkActivoTablero">

            </div>
          </div> 
				</div>
				<div class="modal-footer">
          <input type="hidden" data-primary="true" data-field="iddashboard" name="textIdDashboard" id="textIdDashboard" />
          <input type="hidden" data-field="idusuario" name="textIdUsuario" id="textIdUsuario" value="<?php echo $_SESSION["usuario"]["datos"]["idusuario"];?>"/>
          <input type="hidden" name="textOperacionTablero" id="textOperacionTablero" value=""/>
					<input type="submit" name="btnAccionTablero" id="btnAccionTablero" class="btn btn-success" value="Add" />
					<button type="button" id="btnCerrar" class="btn btn-default" data-dismiss="modal">Cerrar</button>
				</div>
			</div>
		</form>
	</div>
</div>
<style>
.select2-container span.pantone-color-block {
  width: 30px;
  margin-right: 5px;
  padding-left: 5%;
  border-radius: 3px;
  border: 1px solid #808080;
}
</style>

<div id="widgetModal" class="modal fade">
	<div class="modal-dialog">
		<form method="post" id="FormaWidget" enctype="multipart/form-data">
			<div class="modal-content">
				<div class="modal-header">
					<button id="cerrarModal" type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title-widget">Agregar Nuevo Tablero</h4>
				</div>
				<div class="modal-body">
          <div class="row form-group">
            <div class="col col-md-12">
              <label>Tipo</label>
              <select id="SelectTipoWidget" name="SelectTipoWidget" class="form-control select2" style="width: 100%;">
                <option value=1 data-widget="formUAMA">Medidores Activos</option>
                <option value=2 data-widget="formUAMA">Última Actualización</option>
                <option value=3 data-widget="formPotenciaActual">Potencia Actual</option>
                <option value=4 data-widget="formPotenciaDia">Potencia del Día</option>
                <option value=5 data-widget="formUltimosConsumos">Últimos Consumos</option>
                <option value=6 data-widget="formEnergiaMes">Energía del Mes</option>
                <option value=7 data-widget="formBoletasGeneradas">Últimas Boletas</option>
                <option value=8 data-widget="formComparacionED">Comparación Energía/Boleta</option>
              </select>
            </div>
          </div>
          <div class="row form-group">
            <div class="col col-md-12">
              <label>Activo</label> 
              <input type="checkbox" data-field="activo" id="chkActivoWidget" name="chkActivoWidget">
            </div>
          </div> 
          <div class="row form-group">
            <div class="col col-md-12">
              <div class="box box-solid">
                <div class="box-header with-border">
                  <h3 class="box-title">Datos del Widget Seleccionado</h3>
                </div>
                <div class="box-body">
                  <div id="formPotenciaDia" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioPD" name="SelectEdificioPD" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorPD" name="SelectMedidorPD" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Tamaño</label>
                        <select id="SelectTamanoPD" name="SelectTamanoPD" class="form-control select2" style="width: 100%;">
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                          <option value=6 selected="selected">6</option>
                          <option value=7>7</option>
                          <option value=8>8</option>
                          <option value=9>9</option>
                          <option value=10>10</option>
                          <option value=11>11</option>
                          <option value=12>12</option>
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Color Hoy</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorHoyPD" name="CPColorHoyPD" type="text" class="form-control" autocomplete="off" value="rgba(0,166,90,0.6)">
                          <div class="input-group-addon">
                            <i style=""></i>
                          </div>
                        </div>
                      </div>
                      <div class="col col-md-6">
                        <label>Color Ayer</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorAyerPD" name="CPColorAyerPD" type="text" class="form-control" autocomplete="off" value="rgba(243,156,18,0.6)">
                          <div class="input-group-addon">
                            <i style=""></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="formEnergiaMes" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioEM" name="SelectEdificioEM" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorEM" name="SelectMedidorEM" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Tamaño</label>
                        <select id="SelectTamanoEM" name="SelectTamanoEM" class="form-control select2" style="width: 100%;">
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                          <option value=6 selected="selected">6</option>
                          <option value=7>7</option>
                          <option value=8>8</option>
                          <option value=9>9</option>
                          <option value=10>10</option>
                          <option value=11>11</option>
                          <option value=12>12</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div id="formUltimosConsumos" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioUC" name="SelectEdificioUC" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorUC" name="SelectMedidorUC" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Tiempo Atras</label>
                        <select id="SelectMesesUC" name="SelectMesesUC" class="form-control select2" style="width: 100%;">
                          <option value=2>2 Meses</option>
                          <option value=3>3 Meses</option>
                          <option value=4>4 Meses</option>
                          <option value=5>5 Meses</option>
                          <option value=6 selected="selected">6 Meses</option>
                          <option value=7>7 Meses</option>
                          <option value=8>8 Meses</option>
                          <option value=9>9 Meses</option>
                          <option value=10>10 Meses</option>
                          <option value=11>11 Meses</option>
                          <option value=12>12 Meses</option>
                          <option value=13>13 Meses</option>
                          <option value=14>14 Meses</option>
                          <option value=15>15 Meses</option>
                          <option value=16>16 Meses</option>
                          <option value=17>17 Meses</option>
                          <option value=18>18 Meses</option>
                          <option value=19>19 Meses</option>
                          <option value=20>20 Meses</option>
                          <option value=21>21 Meses</option>
                          <option value=22>22 Meses</option>
                          <option value=23>23 Meses</option>
                          <option value=24>24 Meses</option>
                        </select>
                      </div>
                      <div class="col col-md-6">
                        <label>Tamaño</label>
                        <select id="SelectTamanoUC" name="SelectTamanoUC" class="form-control select2" style="width: 100%;" value="6">
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                          <option value=6 selected="selected">6</option>
                          <option value=7>7</option>
                          <option value=8>8</option>
                          <option value=9>9</option>
                          <option value=10>10</option>
                          <option value=11>11</option>
                          <option value=12>12</option>
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Color Meses Anteriores</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorTodosUC" name="CPColorTodosUC" type="text" class="form-control" autocomplete="false" value="rgba(0,166,90,0.6)">
                          <div class="input-group-addon">
                            <i style="background-color: rgba(0, 110, 86, 0.29);"></i>
                          </div>
                        </div>
                      </div>
                      <div class="col col-md-6">
                        <label>Color Mes Actual</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorUltimoUC" name="CPColorUltimoUC" type="text" class="form-control" autocomplete="false" value="rgba(166,0,90,0.4)">
                          <div class="input-group-addon">
                            <i style="background-color: rgba(0, 110, 86, 0.29);"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="formUAMA" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioUAMA" name="SelectEdificioUAMA" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Color</label>
                        <select id="SelectColorUAMA" name="SelectColorUAMA" class="selectColor form-control select2" style="width: 100%;">
                          <option value='bg-black'>bg-black</option>
                          <option value='bg-gray'>bg-gray</option>
                          <option value='bg-white'>bg-white</option>
                          <option value='bg-aqua'>bg-aqua</option>
                          <option value='bg-blue'>bg-blue</option>
                          <option value='bg-navy'>bg-navy</option>
                          <option value='bg-teal'>bg-teal</option>
                          <option value='bg-green'>bg-green</option>
                          <option value='bg-olive'>bg-olive</option>
                          <option value='bg-lime'>bg-lime</option>
                          <option value='bg-yellow'>bg-yellow</option>
                          <option value='bg-orange' selected="selected">bg-orange</option>
                          <option value='bg-red'>bg-red</option>
                          <option value='bg-fuchsia'>bg-fuchsia</option>
                          <option value='bg-purple'>bg-purple</option>
                          <option value='bg-maroon'>bg-maroon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div id="formPotenciaActual" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioPA" name="SelectEdificioPA" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorPA" name="SelectMedidorPA" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                      <label>Color</label>
                        <select id="SelectColorPA" name="SelectColorPA" class="selectColor form-control select2" style="width: 100%;">
                          <option value='bg-black'>bg-black</option>
                          <option value='bg-gray'>bg-gray</option>
                          <option value='bg-white'>bg-white</option>
                          <option value='bg-aqua'>bg-aqua</option>
                          <option value='bg-blue'>bg-blue</option>
                          <option value='bg-navy'>bg-navy</option>
                          <option value='bg-teal'>bg-teal</option>
                          <option value='bg-green' selected="selected">bg-green</option>
                          <option value='bg-olive'>bg-olive</option>
                          <option value='bg-lime'>bg-lime</option>
                          <option value='bg-yellow'>bg-yellow</option>
                          <option value='bg-orange'>bg-orange</option>
                          <option value='bg-red'>bg-red</option>
                          <option value='bg-fuchsia'>bg-fuchsia</option>
                          <option value='bg-purple'>bg-purple</option>
                          <option value='bg-maroon'>bg-maroon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div id="formBoletasGeneradas" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioUCD" name="SelectEdificioUCD" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorUCD" name="SelectMedidorUCD" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Tiempo Atras</label>
                        <select id="SelectMesesUCD" name="SelectMesesUCD" class="form-control select2" style="width: 100%;">
                          <option value=2>2 Meses</option>
                          <option value=3>3 Meses</option>
                          <option value=4>4 Meses</option>
                          <option value=5>5 Meses</option>
                          <option value=6 selected="selected">6 Meses</option>
                          <option value=7>7 Meses</option>
                          <option value=8>8 Meses</option>
                          <option value=9>9 Meses</option>
                          <option value=10>10 Meses</option>
                          <option value=11>11 Meses</option>
                          <option value=12>12 Meses</option>
                          <option value=13>13 Meses</option>
                          <option value=14>14 Meses</option>
                          <option value=15>15 Meses</option>
                          <option value=16>16 Meses</option>
                          <option value=17>17 Meses</option>
                          <option value=18>18 Meses</option>
                          <option value=19>19 Meses</option>
                          <option value=20>20 Meses</option>
                          <option value=21>21 Meses</option>
                          <option value=22>22 Meses</option>
                          <option value=23>23 Meses</option>
                          <option value=24>24 Meses</option>
                        </select>
                      </div>
                      <div class="col col-md-6">
                        <label>Tamaño</label>
                        <select id="SelectTamanoUCD" name="SelectTamanoUCD" class="form-control select2" style="width: 100%;" value="6">
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                          <option value=6 selected="selected">6</option>
                          <option value=7>7</option>
                          <option value=8>8</option>
                          <option value=9>9</option>
                          <option value=10>10</option>
                          <option value=11>11</option>
                          <option value=12>12</option>
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Color Meses Anteriores</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorUCD" name="CPColorUCD" type="text" class="form-control" autocomplete="false" value="rgba(45,10,80,0.6)">
                          <div class="input-group-addon">
                            <i style="background-color: rgba(0, 110, 86, 0.29);"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="formComparacionED" class="widgets hidden">
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Edificio</label>
                        <select id="SelectEdificioCED" name="SelectEdificioCED" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-12">
                        <label>Medidor</label>
                        <select id="SelectMedidorCED" name="SelectMedidorCED" class="form-control select2" style="width: 100%;">
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Tiempo Atras</label>
                        <select id="SelectMesesCED" name="SelectMesesCED" class="form-control select2" style="width: 100%;">
                          <option value=2>2 Meses</option>
                          <option value=3>3 Meses</option>
                          <option value=4>4 Meses</option>
                          <option value=5>5 Meses</option>
                          <option value=6 selected="selected">6 Meses</option>
                          <option value=7>7 Meses</option>
                          <option value=8>8 Meses</option>
                          <option value=9>9 Meses</option>
                          <option value=10>10 Meses</option>
                          <option value=11>11 Meses</option>
                          <option value=12>12 Meses</option>
                          <option value=13>13 Meses</option>
                          <option value=14>14 Meses</option>
                          <option value=15>15 Meses</option>
                          <option value=16>16 Meses</option>
                          <option value=17>17 Meses</option>
                          <option value=18>18 Meses</option>
                          <option value=19>19 Meses</option>
                          <option value=20>20 Meses</option>
                          <option value=21>21 Meses</option>
                          <option value=22>22 Meses</option>
                          <option value=23>23 Meses</option>
                          <option value=24>24 Meses</option>
                        </select>
                      </div>
                      <div class="col col-md-6">
                        <label>Tamaño</label>
                        <select id="SelectTamanoCED" name="SelectTamanoCED" class="form-control select2" style="width: 100%;" value="6">
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                          <option value=6 selected="selected">6</option>
                          <option value=7>7</option>
                          <option value=8>8</option>
                          <option value=9>9</option>
                          <option value=10>10</option>
                          <option value=11>11</option>
                          <option value=12>12</option>
                        </select>
                      </div>
                    </div>
                    <div class="row form-group">
                      <div class="col col-md-6">
                        <label>Color Monto Boleta</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorDineroCED" name="CPColorDineroCED" type="text" class="form-control" autocomplete="false" value="rgba(45,10,80,0.6)">
                          <div class="input-group-addon">
                            <i style="background-color: rgba(0, 110, 86, 0.29);"></i>
                          </div>
                        </div>
                      </div>
                      <div class="col col-md-6">
                        <label>Color Consumo Energía</label>
                        <div class="input-group my-colorpicker2 colorpicker-element">
                          <input id="CPColorEnergiaCED" name="CPColorEnergiaCED" type="text" class="form-control" autocomplete="false" value="rgba(0,166,90,0.6)">
                          <div class="input-group-addon">
                            <i style="background-color: rgba(0, 110, 86, 0.29);"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 
				</div>
				<div class="modal-footer">
          <input type="hidden" data-primary="true" data-field="idwidget" name="textIdwidget" id="textIdwidget" value=""/>
          <input type="hidden" data-field="iddashboard" name="textiddashboard" id="textIddashboard" value=""/>
          <input type="hidden"  name="textidTipowidget" id="textidTipowidget" value=""/>
					<input type="hidden" name="textOperacionWidget" id="textOperacionWidget" value=""/>
					<input type="submit" name="btnAccionWidget" id="btnAccionWidget" class="btn btn-success" value="Add" />
					<button type="button" id="btnCerrar" class="btn btn-default" data-dismiss="modal">Cerrar</button>
				</div>
			</div>
		</form>
	</div>
</div>
<script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code20.js'></script>
<script>
  var dashboardActivo = -1;
  var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
  edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
  var dataTableWidget = null;//$('#tablawidgets').DataTable({destroy:true,paging:false,searching:false});

  //loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));

  var dataTable = $('#tabla').DataTable({
      "processing":false,
      responsive:true,
      //"serverSide":true,
      "order":[],
      "ajax":{
        url:"php/getTable.php",
        type: "POST",
        data:{ 
          primaryField: "iddashboard",
          show: {
            fields:["nombre","posicion","activo"],
            realtablename:"dashboards",
          },
          queries:[{
            fieldsSelect:["*"],
            tableName   :"control.dashboards",
            orderby:[{
              field:"posicion",
              type : "asc"
            }],
            where  :[
            { field:"idusuario",
              oper:"=",
              value:usuarioActivo,
              type: "int"
            }],     
          }],
          otrosbotones:[{nombre:"widgets",tipo:"btn-info",accion:"widgets",icono:"fa-map"}],
        }
      },
      "columnDefs":[
      {
        "targets":[-1,-2,-3],
        "orderable":false,
      },
      {
        "targets":[-1,-2,-3],
        "className": "text-center",
      }
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No se Encontraron Registros",
        "info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Showing 0 to 0 of 0 entries",
        "infoFiltered":   "(Filtrado desde _MAX_ total registros)",
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ Registros",
        "loadingRecords": graphLoading(),
        "processing":     "Processing...",
        "search":         "Buscar:",
        "zeroRecords":    "No se Encontraron Registros",
        "paginate": {
          "first":      "Primera",
          "last":       "Última",
          "next":       "Siguiente",
          "previous":   "Previo"
        },
        "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        }
      },
    });

 


</script>



<!-- bootstrap color picker -->
<script src="jscript/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>





<?php
}
else{
  echo "sin permiso";
}

?>
