<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
?>
<div id="divOperaciones" class="box box-primary">
    <div class="box-body"> 
        <form id="FormaParametros">
            <input id="hdOperacion" type="hidden" value=""> 
            <fieldset class='fieldset'>
                <legend>Datos Principales</legend>
                <div class="row form-row">
                    <div id='container-edificio' class="form-group col col-md-6 widget">
                        <label>Edificio</label>
                        <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                        </select>
                    </div>
                    <div id='container-tipo' class="form-group col col-md-6 widget">
                        <label>Tipo</label>
                        <select id="selectTipo2" name="selectTipo2" class="form-control select2" style="width: 100%;">
                        </select>
                    </div>
                </div>
                <div class="row form-row">
                    <div id='container-tamano' class="form-group col col-md-6 widget">
                        <label>Tamaño Widget</label>
                        <select id="selectTamano" name="selectTamano" class="form-control select2" style="width: 100%;">
                        </select>
                    </div> 
                </div> 
            </fieldset>
            <fieldset class='fieldset'>
                <legend>Series</legend>
                <div class="row form-row">
                    <div id='container-tituloFactur' class="form-group col col-md-6 widget">
                        <label>Titulo Facturacion</label>
                        <input type="text" class="form-control" id="textTituloFactur" name="textTituloFactur" value="Facturas" autocomplete="off">
                    </div>
                    <div id='container-colorpicker1Factur' class="form-group col col-md-6 widget">
                        <label for="colorpickerFactur">Color</label>
                        <br>
                        <input id='colorpickerFactur' type="text" class="form-control colorrgb"  value="rgba(240,204,0,0.8)">
                    </div>               
                </div>
                <div class="row form-row"> 
                    <div id='container-tituloPresup' class="form-group col col-md-6 widget">
                        <label>Titulo Presupuesto</label>
                        <input type="text" class="form-control" id="textTituloPresup" name="textTituloPresup" value="Presupuesto" autocomplete="off">
                    </div>
                    <div id='container-colorpicker1Presup' class="form-group col col-md-6 widget">
                        <label for="colorpickerPresup">Color</label>
                        <br>
                        <input id='colorpickerPresup' type="text" class="form-control colorrgb"  value="rgba(0,120,0,1)">
                    </div> 
                </div>
                <div class="row form-row"> 
                    <div id='container-tituloArrend' class="form-group col col-md-6 widget">
                        <label>Titulo Arrendatarios</label>
                        <input type="text" class="form-control" id="textTituloArrend" name="textTituloArrend" value="Arrendatarios" autocomplete="off">
                    </div>
                    <div id='container-Arrend' class="form-group col col-md-6 widget">
                        <label for="colorpickerArrend">Color</label>
                        <br>
                        <input id='colorpickerArrend' type="text" class="form-control colorrgb"  value="rgba(27,109,193,0.8)">
                    </div> 
                </div>
                <div class="row form-row"> 
                    <div id='container-tituloGastoC' class="form-group col col-md-6 widget">
                        <label>Titulo Gasto Común</label>
                        <input type="text" class="form-control" id="textTituloGastoC" name="textTituloGastoC" value="Gasto Común" autocomplete="off">
                    </div>
                    <div id='container-colorpicker1GastoC' class="form-group col col-md-6 widget">
                        <label for="colorpickerGastoC">Color</label>
                        <br>
                        <input id='colorpickerGastoC' type="text" class="form-control colorrgb"  value="rgba(215,53,53,0.6)">
                    </div> 
                </div>    
            </fieldset>
            <fieldset class='fieldset'>
                <legend>Otras Opciones</legend>
                <div class="row form-row">  
                    <div class="form-group col-md-6 text-center">
                        <label for="checkshPorcent">Mostrar Porcentaje (%)</label>
                        <span id="iconoAdjunto" class="input-group-btn">
                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshPorcent" checked="false" type="checkbox"><span class="switcher"></span></label>
                        </span>
                    </div> 
                    <div class="form-group col-md-6 text-center">
                        <label for="checkshIVA">Aplicar IVA</label>
                        <span id="iconoAdjunto" class="input-group-btn">
                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshIVA" checked="false" type="checkbox"><span class="switcher"></span></label>
                        </span>
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
    var idwidget = <?php wr(isset($_GET['id'])?$_GET['id']:-1);?>;
    var oper = <?php wr(isset($_GET['op'])?$_GET['op']:2); ?>;
    var cargar = false;
    $("#container-loading").html(graphLoading());
    
    function loadEdificios(edificios){
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
                {startDisabled:true
                },   
            );
        }
        else{
            $("#selectEdificio").prop("disabled",true);
        }
    }

    function loadTamano(){
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
                tableName   :"(select UNNEST(array[4,6,12]) as tamano) as database",
                orderby:[{
                field:"tamano",
                type : "asc"
                }],       
            }],
            },
            {startDisabled:true
            },
            
        );
    }

    function loadTipo(){
        selectJs2(
            "#selectTipo2",
            { 
            Selected: 0,
            value: "tipo",
            show: {
                fields:["tipo"],
                format: "%s"
            },
            hide: ["tipo"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"(select UNNEST(array['monto','energia']) as tipo) as database",
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

    function loadWidget(){
        $.ajax({
        url : "php/data.php?widget", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   
                fieldsSelect:["*"],
                tableName:"control.mywidgets()",
                where:[{
                    field:"idwidget",
                    oper:"=",
                    value:idwidget,
                    type:"int"
                }]
            }]              
        },
        })
        .then(function(data) {
            $("#container-loading").toggleClass('hidden');
            $("#btnModalAceptar").removeClass("disabled");
            if (data[0].resultados.length > 0) {
                json = JSON.parse(data[0].resultados[0].parametros); 
                $("#selectEdificio").val(parseInt(json[0]));
                $("#selectEdificio").select2().trigger('change'); 
                $("#selectTipo2").val(json[2]);
                $("#selectTipo2").select2().trigger('change');
                $("#selectTamano").val(parseInt(data[0].resultados[0].tamano));
                $("#selectTamano").select2().trigger('change');
                $("#textTituloFactur").val(json[7]);
                $("#textTituloArrend").val(json[8]);
                $("#textTituloGastoC").val(json[9]);
                $("#textTituloPresup").val(json[10]);
                $("#colorpickerFactur").minicolors('value',json[3]); 
                $("#colorpickerArrend").minicolors('value',json[4]); 
                $("#colorpickerGastoC").minicolors('value',json[5]); 
                $("#colorpickerPresup").minicolors('value',json[6]); 
                $("#checkshPorcent").attr("checked",(json[11]=='true'));
                $("#checkshIVA").attr("checked",(json[12]=='true'));
            }    
        })
        .done(function(xhr){
            var index = xhrPool.indexOf(xhr);
            if (index > -1) {
                xhrPool.splice(index, 1);
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
        });          
    }  

    $(document).ready(function(){
        $('.select2').select2();
        $(".colorrgb").minicolors({
            control: 'hue',
            format: 'rgb',
            opacity: true,
            theme: 'bootstrap',
        });
        loadTamano();
        loadTipo();
        loadEdificios(edificios);
        if (oper == 2) {
            $("#container-loading").toggleClass('hidden');
            $("#btnModalAceptar").addClass("disabled");
            loadWidget();
        }
        else {
        }
    });

    $(document).on('change','#selectEdificio',function(event){

    });

</script>