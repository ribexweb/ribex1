<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
?>
<div id="divOperaciones" class="box box-primary">
    <div class="box-body"> 
        <form id="FormaParametros">
            <input id="hdOperacion" type="hidden" value=""> 
            <fieldset class='fieldset'>
                <legend>Tipo de Widget</legend>
                <div id='container-tipo' class="form-group col col-md-6 widget">
                    <label>Tipo Widget</label>
                    <select id="selectTipo" name="selectTipo" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
                <div id='container-tipo' class="form-group col col-md-6 widget">
                    <img id="preview" src='' style='width:100%;height:150px;'>
                </div>
            </fieldset>    
            <fieldset class='fieldset'>
                <legend>Widget Seleccionado</legend>
                <div class="form-row">
                    <div id='container-tablero' class="form-group col col-md-6 widget">
                        <label>Tablero</label>
                        <select id="selectTablero" name="selectTablero" class="form-control select2" style="width: 100%;">
                        </select>
                    </div>
                    <div class="form-group col-md-6 text-center">
                        <label for="checkActivo">Activo</label>
                        <span id="iconoAdjunto" class="input-group-btn">
                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                        </span>
                    </div> 
                </div>
                <div class="form-row">
                    <div id='container-seleccionado' class="form-group col col-md-12 widget">
                    </div>
                </div>
            </fieldset>         
        </form>  
        <div id='container-loading' class='hidden text-center' style='z-index:100000;position:absolute;top:0px;left:5px;width:100%;height:100%;background-color:rgba(255,255,255,0.6);'>
        </div>
    </div> 
</div>
<script>

    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var iddashboard = <?php wr(isset($_GET['id'])?$_GET['id']:-1);?>;
    var newTipo = new Image;
    $("#container-loading").html(graphLoading());
    


    
    function consultarTipo(idusuario){
        $.ajax({
            url: "php/data.php",
            type:"POST",
            data:{
                queries : [{
                    fieldsSelect:["count(*) as edificios"],
                    tableName   :"public.permisos",
                    where:[{
                        field:"idusuario",
                        oper:"=",
                        value:idusuario,
                        type:"int"
                    },{ logical:"and",
                        field:"todo",
                        oper:"=",
                        value:"true",
                        type:"int"
                    }],      
                }]
            },
            success: function(data){
                var idWidgets = [3,4,5,7,8,14];
                var textWidgets = ["'3-Potencia Actual (Obsoleto)'","'4-Potencia del Día'","'5-Últimos Consumos Energía'","'7-Ultimas Boletas'","'8-Comparacion Energía vs Boleta'","'14-Potencia Máxima'"];
                
                if (data[0].resultados.length > 0) {
                    if (parseInt(data[0].resultados[0].edificios) > 0){
                        
                        if (edificios != '15') {
                            idWidgets.push(1,2,9,10,11,12,13,15,16,17,18);
                            textWidgets.push("'1-Medidores Activos (Obsoleto)'","'2-Última Actualización (Obsoleto)'","'9-Medidores Inactivos (Obsoleto)'","'10-Energía Acumulada del Mes'","'11-Estado de Medidores'","'12-Presupuesto Anual de Energía'","'13-Presupuesto Mensual de Energía'","'15-Presupuesto Anual'","'16-Facturacion Anual'","'17-Energía por Metros Cuadrados'","'18-Potencia Máxima, Mínima y Promedio'");
                        }    
                        else{
                            idWidgets.push(1,2,9,10,11);
                            textWidgets.push("'1-Medidores Activos (Obsoleto)'","'2-Última Actualización (Obsoleto)'","'9-Medidores Inactivos (Obsoleto)'","'10-Energía Acumulada del Mes'","'11-Estado de Medidores'");
                        }
                    }
                    if (parseInt(data[0].resultados[0].edificios) > 1){
                        idWidgets.push(19,20,21,22);
                        textWidgets.push("'19-Rendimiento Energía/m2 Edificios'","'20-Energia Presupuesta vs Real Edificios'","'21-Desglose Facturación Edificios'","'22-Presupuestos Edificios'");
                    }
                }
                loadTipos(idWidgets.join(","),textWidgets.join(','));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        });
    }

    function loadTipos(idWidgets,textWidgets){
        console.log(idWidgets);
        console.log(textWidgets);
        selectJs2(
            "#selectTipo",
            { 
            value: "tipo",
            show: {
                fields:["descripcion"],
                format: "%s"
            },
            hide: ["tipo"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"(select UNNEST(array[%s]) as tipo,UNNEST(array[%s]) as descripcion) as database".format(idWidgets,textWidgets),
                orderby:[{
                field:"tipo",
                type : "asc"
                }],       
            }],
            },
            {startDisabled:true
            },
            
        );
    }

    function loadTableros(){
        selectJs2(
            "#selectTablero",
            { 
            value: "iddashboard",
            show: {
                fields:["nombre"],
                format: "%s"
            },
            hide: ["iddashboard"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"control.dashboards",
                orderby:[{
                field:"posicion",
                type : "asc"
                }],
                where:[{
                    field:"idusuario",
                    oper:"=",
                    value:usuarioActivo,
                    type:"int"
                }]       
            }],
            },
            {startDisabled:true
            },
            
        );
    }





    $(document).ready(function(){
	    //$("#container-loading").toggleClass('hidden');
        //$("#btnModalAceptar").addClass("disabled");
        $('.select2').select2();
        consultarTipo(usuarioActivo);
        loadTableros();
    });

    $(document).on("change","#selectTipo",function(event){
        globalTipo = parseInt($(this).val());
        var page = 'paginas/control/tableros/widgets/editwidget%s.php?op=1'.format($(this).val());
        newTipo.src = "paginas/control/tableros/widgets/img/widget%s.png".format($(this).val());
        $("#container-seleccionado").load(page,function(event){
        });
    });

    newTipo.onload = function() {
        $("#preview").attr('src',this.src);
    }

</script>