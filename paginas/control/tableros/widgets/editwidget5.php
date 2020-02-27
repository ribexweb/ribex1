<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
?>
<div id="divOperaciones" class="box box-primary">
    <div class="box-body"> 
        <form id="FormaParametros">
            <input id="hdOperacion" type="hidden" value=""> 
            <div class="row form-row">
                <div id='container-edificio' class="form-group col col-md-6 widget">
                    <label>Edificio</label>
                    <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
                <div id='container-medidor' class="form-group col col-md-6 widget">
                    <label>Medidor</label>
                    <select id="selectMedidor" name="selectMedidor" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
            </div>
            <div class="row form-row">
                <div id='container-variable' class="form-group col col-md-6 widget">
                    <label>Meses Anteriores</label>
                    <select id="selectMeses" name="selectMeses" class="form-control select2" style="width: 100%;">
                    </select>
                </div> 
                <div id='container-tamano' class="form-group col col-md-6 widget">
                    <label>Tamaño Widget</label>
                    <select id="selectTamano" name="selectTamano" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
            </div>
            <div class="row form-row">
                <div id='container-colorpicker1' class="form-group col col-md-6 widget">
                    <label for="colorpicker1">Color Meses Anteriores</label>
                    <br>
                    <input id='colorpicker1' type="text" class="form-control colorrgb"  value="rgba(0,166,90,0.6)">
                </div> 
                <div id='container-colorpicker2' class="form-group col col-md-6 widget">
                    <label for="colorpicker2">Color Mes Actual</label>
                    <br>
                    <input id='colorpicker2' type="text" class="form-control colorrgb"  value="rgba(166,0,90,0.4)">
                </div>
            </div>
            <div class="row form-row">
                <div class="form-group col-md-3 text-center">
                    <label for="checkshEdificio">Mostrar Edificio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEdificio" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshNombre">Mostrar Nombre</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshNombre" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshCodigo">Mostrar Codigo</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshCodigo" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshEspacio">Mostrar Espacio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEspacio" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
            </div>
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
    var indexMedidor = -1;
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

    function loadMedidores(index){
        if (edificios != '') { //Si tiene uno o varios edificios en permisologia
          selectJs2(
            "#selectMedidor",
            { Selected:index,
              value: "idmedidor",
              show: {
                  fields:["codigo","cons_nombre","espa_nombre"],
                  format: "%s | %s | %s"
              },
              hide: ["idmedidorfisico"],
              queries:[{
                fieldsSelect: ["idmedidor","idmedidorfisico","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
                tableName   :"mediciones.medidores_permisados(%s,%s)".format($("#selectEdificio").val(),usuarioActivo),
                orderby:[{
                  field:"idmedidorfisico",
                  type : "asc NULLS first"
                }],
                where  :[{
                  field  :"asig_activo",
                  oper   :"=",
                  value  :"true",
                  type   :"int",                            
                },
                {
                    logical: "or",
                    field: "idmedidorvirtual",
                    oper:  " is not ",
                    value: "null",
                    type:  "int",
                }]        
              }],
            },
            {
            },
           
          );
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

    function loadMeses(){
        selectJs2(
            "#selectMeses",
            { 
            Selected: 6,
            value: "mes",
            show: {
                fields:["mes"],
                format: "%s"
            },
            hide: ["mes"],
            queries:[{
                fieldsSelect:["*"],
                tableName   :"(select UNNEST(array[1,2,3,4,5,6,7,8,9,10,11,12]) as mes) as database",
                orderby:[{
                field:"mes",
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
                indexMedidor = json[0];
                $("#selectEdificio").val(parseInt(json[7]));
                $("#selectEdificio").select2().trigger('change'); 
                $("#selectMeses").val(parseInt(json[4]));
                $("#selectMeses").select2().trigger('change');
                $("#selectTamano").val(parseInt(data[0].resultados[0].tamano));
                $("#selectTamano").select2().trigger('change');
                $("#colorpicker1").minicolors('value',json[5]); 
                $("#colorpicker2").minicolors('value',json[6]); 
                $("#checkshEdificio").attr("checked",(json[9]=='true'));
                $("#checkshNombre").attr("checked",(json[10]=='true'));
                $("#checkshCodigo").attr("checked",(json[11]=='true'));
                $("#checkshEspacio").attr("checked",(json[12]=='true'));
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
        loadMeses();
        loadEdificios(edificios);
        if (oper == 2) {
            $("#container-loading").toggleClass('hidden');
            $("#btnModalAceptar").addClass("disabled");
            loadWidget();
        }
        else{
            loadMedidores(indexMedidor);
            cargar = true;
        }
    });

    $("#selectEdificio").change(function(){
        if (cargar){
            loadMedidores(indexMedidor);
        }
    });

</script>