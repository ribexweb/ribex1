<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
?>
<div id="divOperaciones" class="box box-primary">
    <div class="box-body"> 
        <form id="FormaParametros">
            <input id="hdOperacion" type="hidden" value=""> 
            <div class="form-row">
                <div id='container-edificio' class="form-group col col-md-6 widget">
                    <label>Edificio</label>
                    <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
                <div id='container-servicio' class="form-group col col-md-6 widget">
                    <label>Servicio</label>
                    <select id="selectServicio" name="selectServicio" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div id='container-colorpicker1' class="form-group col col-md-6 widget">
                    <label for="colorpicker1">Color Activos</label>
                    <br>
                    <input id='colorpicker1' type="text" class="form-control colorrgb"  value="rgba(0, 166, 89, 0.8)">
                </div> 
                <div id='container-colorpicker2' class="form-group col col-md-6 widget">
                    <label for="colorpicker2">Color Inactivos</label>
                    <br>
                    <input id='colorpicker2' type="text" class="form-control colorrgb"  value="rgba(166, 33, 33, 0.8)">
                </div>
            </div>
            <div class="form-row">
                <div id='container-tamano' class="form-group col col-md-6 widget">
                    <label>Tamaño Widget</label>
                    <select id="selectTamano" name="selectTamano" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
                <div class="form-group col-md-3 text-center">
                    <label for="checkActivo">Mostrar Edificio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEdificio" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkActivo">Mostrar Servicio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshServicio" checked="false" type="checkbox"><span class="switcher"></span></label>
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
                loadServicios    
            );
        }
        else{
            $("#selectEdificio").prop("disabled",true);
        }
    }

    function loadServicios(){
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
            {startDisabled:true
            },
            loadTamano  
        );
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
                tableName   :"(select UNNEST(array[2,3,4]) as tamano) as database",
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
                $("#selectTamano").val(parseInt(data[0].resultados[0].tamano)); 
                $('#selectTamano').select2().trigger('change');  
                $("#selectEdificio").val(parseInt(json[0]));
                $("#selectEdificio").select2().trigger('change'); 
                $("#selectServicio").val(parseInt(json[4]));
                $("#selectServicio").select2().trigger('change');  
                $("#colorpicker1").minicolors('value',json[2]); 
                $("#colorpicker2").minicolors('value',json[3]); 
                $("#checkshEdificio").attr("checked",(json[6]=='true'));
                $("#checkshServicio").attr("checked",(json[7]=='true'));
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
    loadEdificios(edificios);
    if (oper == 2) {
        $("#container-loading").toggleClass('hidden');
        $("#btnModalAceptar").addClass("disabled");
        loadWidget();
    }
});

</script>