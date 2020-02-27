<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<style>
    .minimo120{
        min-width:120px;
    }
    .minimo200{
        min-width:200px;
    }
    .minimo80{
        min-width:80px;
    }
</style>
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Asignaciones <small>Asignaciones para Remarcación</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Asignaciones
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaAsignaciones" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>N° Asignación</td>
                            <td>Edificio</td>
                            <td>Medidor</td>
                            <td>Codigo Cliente</td>
                            <td>Consumidor</td>
                            <td>Espacio</td>
                            <td>Ubicacion</td>
                            <td>Uso</td>
                            <td>Tarifa</td>
                            <td>Local</td>
                            <td>Inicio</td>
                            <td>Cese</td>
                            <td>Porcentaje</td>
                            <td>Asignacion Previa</td>
                            <td>Activo</td>
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
                    <button type="button" id="btnNuevo" class="btn btn-success custom pull-right"><i class='fa fa-plus'> </i> Ingresar</button>
                </div>
            </div>
            <div id="divOperaciones" class="box box-primary hidden">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list-alt fa-lg"></i>
                        <span id="lbTitulo">Asignaciones</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Asignaciones</span></b></h5>
                </div>
                <div class="box-body"> 
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active"><a href="#tab_1" data-toggle="tab" aria-expanded="true">Datos Básicos</a></li>
                            <li class=""><a href="#tab_2" data-toggle="tab" aria-expanded="false">Variables</a></li>
                            <li class=""><a href="#tab_3" data-toggle="tab" aria-expanded="false">Escalamientos</a></li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_1">
                                <div class="box-body">
                                    <form id="FormaParametros">
                                        <input id="hdOperacion" type="hidden" value=""> 
                                        <div class="form-row">
                                            <div class="form-group col-md-3">  
                                                <label>Edificio</label>
                                                <select id="selectEdificio" name="selectEdificio" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div>  
                                            <div class="form-group col-md-3">  
                                                <label>Código</label>
                                                <input type="text" class="form-control" id="textCodigo" name="textCodigo" autocomplete="off" data-smk-msg="Código de Variable requerido" required>
                                            </div>  
                                            <div class="form-group col-md-3"> 
                                                <label>Servicio</label>
                                                <select id="selectServicio" name="selectServicio" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div> 
                                            <div class="form-group col-md-3">
                                                <label>Protocolo</label>
                                                <select id="selectProtocolo" name="selectProtocolo" class="form-control select2" style="width: 100%;">
                                                </select>
                                            </div> 
                                        </div> 
                                        <div class="form-row">
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkActivo">Activo</label>
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkActivo" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </div> 
                                            <div class="form-group col col-md-3 text-center">
                                                <label for="checkPrincipal">Principal</label>
                                                <label class="cl-switch cl-switch-green cl-switch-large"><input id="checkPrincipal" checked="false" type="checkbox"><span class="switcher"></span></label>
                                            </div>
                                        </div>    
                                    </form>
                                </div>   
                            </div>
                            <div class="tab-pane" id="tab_2">
                                En Construcción            
                            </div>
                            <div class="tab-pane" id="tab_3">
                                En Construcción
                            </div>
                        </div>
                    </div>              
                </div>
                <div class="box-footer">
                    <button type="button" id="btnCancelar" class="btn btn-danger custom pull-right"><i class='fa fa-window-close'> </i> Cancelar</button><p>
                    <span class='pull-right'>&nbsp;</span>
                    <button type="button" id="btnAceptar" class="btn btn-success custom pull-right"><i class='fa fa-check'> Aceptar</i></button><span></span>
                </div>
            </div>
        </div>
    </div>
</section>

    <script src="jscript/datepicker/datepicker.min.js"></script>
    <script src="jscript/datepicker/datepicker.es.js"></script>
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code25.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteAsignaciones = {activo:false,inicio:0,final:0,data:[]};
    var asignacionActual = 0;
    
    var tableParamsAsignaciones = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idasignacion',
        columnDefs:[{
            targets:[0,2,7,8,9,12,-1],
            className:"minimo80 text-center"
        },
        {
            targets:[10,11],
            className:"minimo120 text-center"
        },
        {
            targets:[1,3,4,5,6],
            className:"minimo200"
        },
        {
            targets:[-1,9],
            orderable:false
        }],
        columns:[
            {data:"idasignacion",title:"N° Global"},
            {data:"edif_nombre",title:"Edificio"},
            {data:"codigo",title:"Medidor"},
            {data:"asig_codigo",title:"Código Cliente"},
            {data:"cons_nombre",title:"Consumidor"},
            {data:"espa_nombre",title:"Espacio"},
            {data:"ubic_nombre",title:"Ubicación"},
            {data:"usos_nombre",title:"Uso"},
            {data:"tari_nombre",title:"Tarifa"},
            {data:"local",title:"Local"},
            {data:"asig_fechainicial",title:"Inicio"},
            {data:"asig_fechafinal",title:"Cese"},
            {data:"asig_porcentaje",title:"Porcentaje"},
            {data:"idasignacionprevia",title:"Asignación Previa"},
            {data:"asig_activo",title:"Activo"},
        ],
        order: [],
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idasignacion";
                d.show = {
                    fields:["idasignacion","idedificio","edif_nombre","codigo","asig_codigo","idconsumidor","cons_nombre","idespacio","espa_nombre","idubicacion","ubic_nombre","iduso","usos_nombre","local","asig_fechainicial","asig_fechafinal","asig_porcentaje","idasignacionprevia","asig_activo","idtarifaedificio","tari_nombre"],
                    realtablename:'asignaciones',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["vmedidores.*","asignaciones.local"],
                    tableName   :"mediciones.vmedidores left join mediciones.asignaciones using(idasignacion)",
                    orderby:[{
                        field:"vmedidores.idasignacion",
                        type : "desc"
                    }],
                    where  :[{
                        field:"vmedidores.idedificio",
                        oper: "in",
                        value: "("+edificios+")",
                        type:"int"
                    }]  
                }];
            },
            dataSrc: function(data){  
                reporteAsignaciones.data = data.resultados[0].resultados; 
                console.log(data.resultados[0].resultados);       
                return data.data;                 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                error2({
                    msg:errorThrown
                });
            },
        },
        language: spanish,
        select: {
            style: 'single',
        },  
    }

    var tablaAsignaciones = $("#tablaAsignaciones").DataTable(tableParamsAsignaciones); 

    selectJs2(
        "#selectServicio",
        { 
            value: "idservicio",
            show: {
                fields:["nombre"],
            },
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
        {
        }    
    );

    selectJs2(
        "#selectProtocolo",
        { 
            value: "idprotocolo",
            show: {
                fields:["nombre"],
            },
            queries:[{
                fieldsSelect:["*"],
                tableName   :"mediciones.protocolos",
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
        {
        }    
    );

    if (edificios != '') {
        selectJs2(
            "#selectEdificio",
            { 
                value: "sufijo",
                show: {
                    fields:["nombre","sufijo"],
                    format:"%s (%s)",
                },
                hide: ["sufijo"],
                queries:[{
                    fieldsSelect:["edificios.idedificio","entidades.nombre","concat('Me-',sufijo,'-') as sufijo"],
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
        $("#selectEdificio").prop("disabled",true);
    }







</script>
<?php
}
else{
  echo "sin permiso";
}

?>