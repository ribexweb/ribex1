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
                        <label>Nombre</label>
                        <input type="text" class="form-control" id="textNombre" name="textNombre" autocomplete="off">
                    </div>
                    <div id='container-edificio' class="form-group col col-md-6 widget">
                        <label>Descripcion</label>
                        <input type="text" class="form-control" id="textDescripcion" name="textDescripcion" autocomplete="off">
                    </div>
                </div> 
                <div class="row form-row">
                    <div class="form-group col-md-3 text-center">
                        <label for="checkshActivo">Activo</label>
                        <span id="iconoAdjunto" class="input-group-btn">
                            <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
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
    var iddashboard = <?php wr(isset($_GET['id'])?$_GET['id']:-1);?>;
    $("#container-loading").html(graphLoading());
    
    function loadDashboard(){
        $.ajax({
        url : "php/data.php?dashboard", // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type: "post",
        data:{
            queries:[
                {   
                fieldsSelect:["*"],
                tableName:"control.dashboards",
                where:[{
                    field:"iddashboard",
                    oper:"=",
                    value:iddashboard,
                    type:"int"
                }]
            }]              
        },
        })
        .then(function(data) {
            $("#container-loading").toggleClass('hidden');
            $("#btnModalAceptar").removeClass("disabled");
            if (data[0].resultados.length > 0) {
                cargar = true;
                $("#textNombre").val(data[0].resultados[0].nombre);
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
	    $("#container-loading").toggleClass('hidden');
	    $("#btnModalAceptar").addClass("disabled");
        loadDashboard();
    });

</script>