<?php 
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content">
    <div class="box box-primary" style="background-color:#f4f4f4;">
        <div class="box-header">
            <h3 class='text-secondary'>
                <i class="fa fa-list-alt fa-lg"></i>
                Medidores Físicos <small>Medidores Fisicos para Asignaciones</small>
            </h3>
        </div>
        <div class="box-body">
            <div class="box box-primary">
                <div class="box-header">
                    <h4>
                        <i class="fa fa-list fa-lg"></i>
                        Listado de Medidores Físicos
                    </h4>
                </div>
                <div class="box-body">
                    <table id="tablaMedidores" class="table table-bordered table-striped" style="width:100%">
                        <thead>
                            <td>N° Global</td>
                            <td>Código</td>
                            <td>Servicio</td>
                            <td>Protocolo</td>
                            <td>Principal</td>
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
                        <span id="lbTitulo">Medidores Físicos</span>
                    </h4>
                    <h5><b><span id="lbTituloDescripcion">Ingresar o Modificar Medidores Físicos</span></b></h5>
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
    <script src='<?php echo pathinfo($_SERVER["SCRIPT_NAME"])["dirname"];?>/code69.js?<?php echo time(); ?>'></script>

<script>
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reporteMedidores = {activo:false,inicio:0,final:0,data:[]};
    var medidorActual = 0;
    
    var tableParamsMedidores = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX:        true,
        scrollCollapse: true,
        //autoWidth: false,
        rowId: 'idmedidorfisico',
        columnDefs:[{
            targets:[],
            className:"text-center"
        },
        {
            targets:[-1,-2],
            orderable:false
        }],
        columns:[
            {data:"idmedidorfisico",title:"N° Global"},
            {data:"codigo",title:"Código"},
            {data:"serv_nombre",title:"Servicio"},
            {data:"prot_nombre",title:"Protocolo"},
            {data:"activo",title:"Activo"},
            {data:"principal",title:"Principal"},
        ],
        order: [],
        
        ajax:{
            url:"php/getTable2.php",
            type: "POST",
            data:function(d){
                d.primaryField = "idmedidorfisico";
                d.hide = ["idequipo","idmedidor"];
                d.show = {
                    fields:["idequipo","idmedidor","idmedidorfisico","codigo","idservicio","serv_nombre","idprotocolo","prot_nombre","activo","principal","prefijo","numero"],
                    realtablename:'medidoresfisicos',
                    deletebtn: false,
                    updatebtn:false
                };
                d.queries = [{
                    fieldsSelect:["*","substr(codigo,8,10) as numero","substr(codigo,1,7) as prefijo"],
                    tableName   :"mediciones.vmedidoresfisicos",
                    orderby:[{
                        field:"idmedidorfisico",
                        type : "desc"
                    }],
                    where  :[{
                        field:"substr(codigo,4,3)",
                        oper: "in",
                        value: "(select sufijo from mediciones.vedificios where (idedificio in ("+edificios+")))",
                        type:"int"
                    },{
                        logical:"and",
                        field:"substr(codigo,1,2)",
                        oper:'<>',
                        value:'Mv',
                        type:'str'
                    }]  
                }];
            },
            dataSrc: function(data){  
                reporteMedidores.data = data.resultados[0].resultados; 
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

    var tablaMedidores = $("#tablaMedidores").DataTable(tableParamsMedidores); 

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