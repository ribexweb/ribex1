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
            </div>
            <div class="row form-row">
                <div id='container-colorpicker1' class="form-group col col-md-6 widget">
                    <label for="colorpicker1">Color de Fondo</label>
                    <br>
                    <input id='colorpicker1' type="text" class="form-control colorrgb"  value="rgba(255,160,10,0.8)">
                </div> 
                <div id='container-colorpicker2' class="form-group col col-md-6 widget">
                    <label for="colorpicker2">Color de Fuente</label>
                    <br>
                    <input id='colorpicker2' type="text" class="form-control colorrgb"  value="rgba(255,255,255,1)'">
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
            );
        }
        else{
            $("#selectEdificio").prop("disabled",true);
        }
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
                $("#colorpicker1").minicolors('value',json[2]); 
                $("#colorpicker2").minicolors('value',json[3]); 
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