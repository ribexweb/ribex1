<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
?>
<div id="divOperaciones" class="box box-primary">
    <div class="box-body"> 
        <form id="FormaParametros">
            <input id="hdOperacion" type="hidden" value=""> 
            <fieldset class='fieldset'>
            <legend>Datos Principales</legend>
            <div class="row">
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
            <div class="row">
                <div id='container-paleta' class="form-group col col-md-6 widget">
                    <label>Paleta de Colores</label>
                    <select id="selectPaleta" name="selectPaleta" class="form-control select2" style="width: 100%;">
                    </select>
                </div> 
                <div id='container-tamano' class="form-group col col-md-6 widget">
                    <label>Tamaño Widget</label>
                    <select id="selectTamano" name="selectTamano" class="form-control select2" style="width: 100%;">
                    </select>
                </div>
            </div>
            </fieldset>
            <fieldset class='fieldset'>
            <legend>Datos del Grupo</legend>
            <div class="row form-row">
                <div id='container-medidor' class="form-group col col-md-6 widget">
                    <label>Primeros</label>
                    <input type="text" class="form-control" id="textPrimeros" name="textPrimeros" autocomplete="off" value="10">
                </div>
                <div id='container-titulo' class="form-group col col-md-6 widget">
                    <label>Porcentaje</label>
                    <input type="text" class="form-control" id="textPorcentaje" name="textPorcentaje" autocomplete="off" value="1">
                </div> 
            </div>
            <div class="row form-row">
                <div id='container-titulo' class="form-group col col-md-3 widget">
                    <label>Nombre Otros</label>
                    <input type="text" class="form-control" id="textNombreOtros" name="textNombreOtros" autocomplete="off">
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshNombreOtros">Mostrar</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshNombreOtros" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div id='container-titulo' class="form-group col col-md-3 widget">
                    <label>Espacio Otros</label>
                    <input type="text" class="form-control" id="textEspacioOtros" name="textEspacioOtros" autocomplete="off">
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshEspacioOtros">Mostrar</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEspacioOtros" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
            </div>
            </fieldset>
            <fieldset class='fieldset'>
            <legend>Datos del Titulo</legend>
            <div class="row form-row">
                <div id='container-titulo' class="form-group col col-md-6 widget">
                    <label>Titulo </label>
                    <input type="text" class="form-control" id="textTitulo" name="textTitulo" autocomplete="off">
                </div>
                <div class="form-group col-md-3 text-center">
                    <label for="checkshTitulo">Titulo</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshTitulo" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
            </div>
            <div class="row form-row">
                <div class="form-group col-md-3 text-center">
                    <label for="checkshEdificio">Edificio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEdificio" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshNombre">Nombre</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshNombre" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshCodigo">Código</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshCodigo" checked="false" type="checkbox"><span class="switcher"></span></label>
                    </span>
                </div> 
                <div class="form-group col-md-3 text-center">
                    <label for="checkshEspacio">Espacio</label>
                    <span id="iconoAdjunto" class="input-group-btn">
                        <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkshEspacio" checked="false" type="checkbox"><span class="switcher"></span></label>
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
    var indexMedidor = -1;
    $("#container-loading").html(graphLoading());
    
    function loadEdificios(edificios){
        if (edificios != '') {
            selectJs2(
                "#selectEdificio",
                { 
                    value: "idedificio",
                    Nulo:[{value:-1,text:'Sin Edificio (Medidor Virtual)'}],
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

    function loadMedidores(control,index){
        if (edificios != '') { //Si tiene uno o varios edificios en permisologia
            console.log(control+":"+index);
          selectJs2(
            control,
            { Selected:index,
              Nulo:[{value:-1,text:'Sin Medidor Asociado'}],
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
            {startDisabled:true
            },
           
          );
        }
    } 

    function loadPaleta(){
        selectJs2(
            "#selectPaleta",
            { 
                value: "idpaleta",
                show: {
                    fields:["nombre"],
                },
                hide: ["idpaleta"],
                queries:[{
                    fieldsSelect:["idpaleta","nombre"],
                    tableName   :"configuraciones.paletas",
                    orderby:[{
                        field:"nombre",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        }]        
                }],
            },
            {startDisabled:true
            },   
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
                console.log(json);
                indexMedidor = parseInt(json[0]);
                cargar = true;
                $("#selectEdificio").val(parseInt(json[6]));
                $("#selectEdificio").select2().trigger('change');
                $("#selectPaleta").val(parseInt(json[4]));
                $("#selectPaleta").select2().trigger('change');  
                $("#selectTamano").val(parseInt(data[0].resultados[0].tamano));
                $("#selectTamano").select2().trigger('change');
                $("#textPrimeros").val(parseInt(json[8]));
                $("#textPorcentaje").val(parseInt(json[9]));
                $("#textNombreOtros").val(json[10]);
                $("#checkshNombreOtros").attr("checked",(json[11]=='true'));
                $("#textEspacioOtros").val(json[12]);
                $("#checkshEspacioOtros").attr("checked",(json[13]=='true'));
                $("#textTitulo").val(json[14]);
                $("#checkshEdificio").attr("checked",(json[15]=='true'));
                $("#checkshNombre").attr("checked",(json[16]=='true'));
                $("#checkshCodigo").attr("checked",(json[17]=='true'));
                $("#checkshEspacio").attr("checked",(json[18]=='true'));
                $("#checkshTitulo").attr("checked",(json[19]=='true'));
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
        loadPaleta();
        loadEdificios(edificios);
        if (oper == 2) {
            $("#container-loading").toggleClass('hidden');
            $("#btnModalAceptar").addClass("disabled");
            loadWidget();
        }
        else {
            loadMedidores("#selectMedidor",indexMedidor);
            cargar = true;
        }
    });

    $("#selectEdificio").change(function(){
        if (cargar){
            loadMedidores("#selectMedidor",indexMedidor);
        }
    });


</script>