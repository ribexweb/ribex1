<?php 
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (true){
?>
<link rel="stylesheet" type="text/css" href="jscript/datepicker/datepicker.min.css">
<section class="content-header">
    <div style='col-md-12'>
        <h3 class='text-secondary'>
            <i class="fa fa-dollar-sign fa-lg"></i>
            Remarcar <small>Remarcación por Edificio y Tarifa</small>
        </h3>
    </div>
</section>
<section class="content">
    <div class='row'>
        <div class="col-md-3">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Parámetros</h3>
                </div>
                <form id="Forma" role="form">
                    <div class="box-body">
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Edificio</label>
                                <select id="SelectEdificio" name="SelectEdificio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Tarifa</label>
                                <select id="SelectTarifa" name="SelectTarifa" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">
                                <label>Lista de Precios</label>
                                <select id="SelectPrecio" name="SelectPrecio" class="form-control select2" style="width: 100%;">
                                </select>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Fecha</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="TextFecha" name="TextFecha" autocomplete="off">
                                    <span id="iconoFecha" class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                </div>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Fecha Inicial</label>
                                <input type="text" class="form-control" id="TextFechaInicial" name="TextFechaInicial" autocomplete="off" disabled>
                            </div>
                        </div> 
                        <div class="row form-group">
                            <div class="col col-md-12">   
                                <label>Fecha Final</label>
                                <input type="text" class="form-control" id="TextFechaFinal" name="TextFechaFinal" autocomplete="off" disabled>
                            </div>
                        </div>      
                    </div>
                    <!-- /.box-body -->
                    <div class="box-footer">
                            <!--<button id="btnGenerar" type="button" class="btn btn-primary pull-right"><i class="fa fa-search"> </i> Generar</button>    -->
                    </div>
                </form>
            </div>
        </div> 
        <div class="col-md-9">
            <div id="precios">
                <div class="box box-primary">
                    <div class="box-header">
                        <h3 class="box-title">Precios</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="tablaPrecios" class="table table-bordered table-striped" style="width:100%">
                            <thead>
                                <td>Cargo</td> 
                                <td>Nombre</td>
                                <td>Clasificación</td>
                                <td>Tipo Cálculo</td>
                                <td>Monto</td>
                                <td>Parametros</td>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                    <div class="box-footer">
                            <button id="btnCalcular" type="button" class="btn btn-warning pull-right" disabled><i class="fa fa-calculator"> </i> Calcular</button>    
                    </div>
                </div>
            </div>
            <div id='energia'>
                <div class="box box-primary">
                    <div class="box-header">
                        <h3 class="box-title">Listado de Energia</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <table id="tablaAsignaciones" class="table table-bordered table-striped" style="width:100%">
                            <thead>
                                <tr>
                                <td>Medidor</td>
                                <td>Arrendatario</td>
                                <td>Espacio</td>
                                <td>Fecha Inicial</td>
                                <td>Lectura Inicial</td>
                                <td>Fecha Final</td>
                                <td>Lectura Final</td>
                                <td>total</td>
                            </tr> 
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                    <div class="box-footer">
                                <button id="btnGuardar" type="button" class="btn btn-success pull-right" disabled><i class="fa fa-database"> </i> Guardar</button>    
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<script src="jscript/datepicker/datepicker.min.js"></script>
<script src="jscript/datepicker/datepicker.es.js"></script>
<script src="jscript/DataTables/pdfmake-0.1.36/pdfmake.min.js"></script>
<script src="jscript/DataTables/pdfmake-0.1.36/vfs_fonts.js"></script>

<script type="text/javascript" language="javascript">
    loadScript(JsFileName('<?php echo $_SERVER["SCRIPT_NAME"];?>',paginaActiva.code));
    var usuarioActivo = <?php wr($_SESSION["usuario"]["datos"]["idusuario"]); ?>;
    var database = '<?php echo $_SESSION["usuario"]["datos"]["database"]; ?>';
    var idtarifa = 0;
    edificios = '<?php wr(getDataSesion('edificios','idedificio'));?>';
    var reportePrecios = {activo:false,inicio:0,final:0,data:null};
    var editorPrecios;
    var ajaxParamsPrecios;
    var reporteAsignaciones = {activo:false,inicio:0,final:0,data:null};
    var dataLeidaFacturada = {data:null};
    
    $("#TextFecha").val(moment().format("YYYY-MM-DD HH:mm:ss"));
   /* var tableParamsPrecios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        columnDefs : [{ 
            targets: [-1], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right',
            width:"100px",
            type:'html-num-fmt' },
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"descripcion",title:"Descripcion"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"precio",title:"Precio Unitario",className: 'editable'},
        ],
        order: [[ 3, 'asc' ],[ 0, 'asc' ]],
        select: {
            style:    'os',
            selector: 'td:first-child'
        },
        language: spanish,
    }*/

    var tableParamsPrecios = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        scrollY:        300,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        columnDefs : [{ 
            targets: [-2], 
            render: $.fn.dataTable.render.number( '.', ',', 2 ),
            className: 'text-right',
            width:"100px",
            type:'html-num-fmt' 
            },
            {
                targets : [3,4],
                className:'text-center'
            },
            {
                targets : [-1],
                width:"200px",
            }
        ],
        columns:[
            {data:"idcargo",title:"Cargo"},
            {data:"nombre",title:"Nombre"},
            {data:"clas_nombre",title:"Clasificación"},
            {data:"calc_nombre",title:"Tipo de Cálculo"},
            {data:"monto",title:"Monto"},
            {data:"parametrosjson",title:"Parametros"},
        ],
        order: [],
        select: {
            style: 'single',
        },
        language: spanish,
    }

    $('#tablaPrecios').on( 'click', 'tbody td', function (e) {
        editorPrecios.inline( this, {
            onBlur: 'submit'
        } );
    } );

    var tablaPrecios = $("#tablaPrecios").DataTable(tableParamsPrecios);

    $('#tablaPrecios').on( 'click', 'tbody td.editable', function (e) {
        editorPrecios.inline( this );
    } );

/*    editorPrecios = new $.fn.dataTable.Editor( {
        ajax:  function ( method, url, d, successCallback, errorCallback ) {
            var output = { data: [] };

            if ( d.action === 'edit' ) {
                // Update each edited item with the data submitted
                $.each( d.data, function (id, value) {
                    index = findObjectByKeyIndex(reportePrecios.data,"DT_RowId",id);
                    data = reportePrecios.data[findObjectByKeyIndex(reportePrecios.data,"DT_RowId",id)];
                    value.precio = parseFloat(value.precio.toString().replace(',','.')); 
                    console.log(value.precio.toString().replace(',','.'));
                    
                    const keys = Object.keys(value);
                    for (const key of keys) {
                        data[key] = value[key];
                    }
                    output.data.push( data );     

                } );
            }

            successCallback( output );

 
        },
        table: "#tablaPrecios",

        fields: [ {
                label: "Precio Unitario:",
                name: "precio"
            }
        ],
    } );*/


    var tableParamsAsignaciones = { 
        responsive:true,
        destroy: true,
        paging: true,
        searching: true,
        processing: true,
        scrollY:        300,
        scrollX:        true,
        scrollCollapse: true,
        autoWidth: false,
        fixedColumns:   {
            leftColumns: 1,
            rightColumns: 1
        },
        order: [[ 0, 'asc' ]],
        dom: 'Bfrtip',
        buttons: buttons,
        language: spanish,
    }

    var tablaasignaciones = $("#tablaAsignaciones").DataTable(tableParamsAsignaciones);


    if (edificios != '') {
        selectJs2(
            "#SelectEdificio",
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
            {
            }    
        );
    }
    else{
        $("#SelectEdificio").prop("disabled",true);
    }

    $("#SelectEdificio").change(function(index){
        selectJs2(
            "#SelectTarifa",
            { 
                value: "idtarifa",
                show: {
                    fields:["codigo"],
                },
                hide: ["idtarifa"],
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.tarifas",
                    orderby:[{
                        field:"tarifas.codigo",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"tarifas.activo",
                        oper   :"=",
                        value  :"true",
                        type   :"int",                    
                        },
                        {logical: "AND",
                         field  : "tarifas.idtarifa",
                         oper   : "in",
                         type   : "int",   
                         value  : "(select distinct(idtarifa) from mediciones.vmedidores where (idedificio=%s))".format($("#SelectEdificio").val()), 
                        }
                    ]        
                }],
            },
            {
            }    
        );
      /*  selectJs2(
            "#SelectPrecios",
            { 
                value: "idprecio",
                show: {
                    fields:["fecha"],
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.precios",
                    orderby:[{
                        field:"precios.idprecio",
                        type : "desc"
                    }],
                    where  :[{
                        field  :"precios.idedificio",
                        oper   :"=",
                        value  :this.value,
                        type   :"int",                    
                        },
                        {logical: "AND",
                         field  : "precios.idtarifa",
                         oper   : "=",
                         type   : "int",   
                         value  : $("#SelectTarifa").val()
                        }
                    ]        
                }],
            },
            {
            }    
        );*/
    
    
    });

    $("#SelectTarifa").change(function(index){
        selectJs2(
            "#SelectPrecio",
            { 
                value: "idprecio",
                show: {
                    fields:["fecha","desde","hasta"],
                    format: "%s | %s al %s"
                },
                queries:[{
                    fieldsSelect:["*"],
                    tableName   :"remarcacion.precios",
                    orderby:[{
                        field:"precios.idprecio",
                        type : "desc"
                    }],
                    where  :[{
                        field  :"precios.idedificio",
                        oper   :"=",
                        value  :$("#SelectEdificio").val(),
                        type   :"int",                    
                        },
                        {logical: "AND",
                         field  : "precios.idtarifa",
                         oper   : "=",
                         type   : "int",   
                         value  :this.value
                        }
                    ]        
                }],
            },
            {
            }    
        );
    });

    $('#TextFechaInicial').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 
    $('#TextFechaFinal').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    });
    $('#TextFecha').datepicker({
        language: 'es',
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii',
        timepicker: true,
        firstDay: 0,
        autoClose: true,
        toggleSelected: false,
        maxDate: new Date() // Now can select only dates, which goes after today
    }); 


    function guardar_valores_leidos_facturados(idremarcacionasignacion){

        /*for (var indexAsignaciones=0;indexAsignaciones<dataLeidaFacturada.data.length;indexAsignaciones++){
            var asignacion = dataLeidaFacturada.data[indexAsignaciones];
            for (var indexLeidos=0;indexLeidos<asignacion.leidos.length;indexLeidos++){
                dataLeidaFacturada.data[indexAsignaciones].leidos[indexLeidos].idremarcacionasignacion = idremarcacionasignacion[indexAsignaciones].idremarcacionasignacion;
            }
            for (var indexFacturados=0;indexFacturados<asignacion.facturados.length;indexFacturados++){
                dataLeidaFacturada.data[indexAsignaciones].facturados[indexFacturados].idremarcacionasignacion = idremarcacionasignacion[indexAsignaciones].idremarcacionasignacion;
            }
        }*/

        dataLeidaFacturada.data.forEach(function(element,index){
            element.leidos.forEach(function(e,i){
                e.idremarcacionasignacion = idremarcacionasignacion[index].idremarcacionasignacion
            });
            element.facturados.forEach(function(e,i){
                e.idremarcacionasignacion = idremarcacionasignacion[index].idremarcacionasignacion
            });
        });

        



        var elementosLeidos = {}
        elementosLeidos["campos"] = [];
        elementosLeidos["returnFields"] = [];
        elementosLeidos["tableName"] = "remarcacion.valores_leidos";
        elementosLeidos["operacion"] = "Ingresar";
        var elementosFacturados = {}
        elementosFacturados["campos"] = [];
        elementosFacturados["returnFields"] = [];
        elementosFacturados["tableName"] = "remarcacion.valores_facturados";
        elementosFacturados["operacion"] = "Ingresar";

        dataLeidaFacturada.data.forEach(function (value, index){
            value.leidos.forEach(function (value,index){
                elementosLeidos["campos"].push(value);
            });
            value.facturados.forEach(function (value,index){
                elementosFacturados["campos"].push(value);
            });
        });

        elementosLeidos["returnFields"].push("idvalor");
        elementosFacturados["returnFields"].push("idvalor");
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementosLeidos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                }
                else { 
                    error2({
                        msg : data[0].mesg,    
                    });  
                } 
            },
            error: function( jqXhr, textStatus, errorThrown ){     
                error2({
                    msg : errorThrown,    
                }); 
            }
        });  

        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementosFacturados,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                }
                else {

                    error2({
                        msg : data[0].mesg,    
                    });  
                } 
            },
            error: function( jqXhr, textStatus, errorThrown ){     
                error2({
                    msg : errorThrown,    
                }); 
            }
        });
    }

    function guardar_asignacions_remarcaciones(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];
        elementos["tableName"] = "remarcacion.remarcaciones_asignaciones";
        elementos["operacion"] = "Ingresar";
        arguments[0].asignaciones.forEach(function (value, index){
            elementos["campos"].push({
                "idremarcacion"               : argumentos[0].idremarcacion,
                "idasignacion"                : value.idasignacion,
                "energiafechainicialx1"       : value.energiafechainicialx1,
                "energiafechainicialx2"       : value.energiafechainicialx2,
                "energiavalorinicialy1"       : value.energiavalorinicialx1,
                "energiavalorinicialy2"       : value.energiavalorinicialx2,
                "energiafechainicial"         : value.energiafechainicial,
                "energialecturainicial"       : value.energialecturainicial,
                "energiafechafinalx1"         : value.energiafechafinalx1,
                "energiafechafinalx2"         : value.energiafechafinalx2,
                "energiavalorfinaly1"         : value.energiavalorfinalx1,
                "energiavalorfinaly2"         : value.energiavalorfinalx2,
                "energiafechafinal"           : value.energiafechafinal,
                "energialecturafinal"         : value.energialecturafinal,
            });
        }); 
        elementos["returnFields"].push("idremarcacionasignacion","idasignacion");  
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_valores_leidos_facturados(data[0].return);
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });  
                } 
            },
            error: function( jqXhr, textStatus, errorThrown ){     
                error2({
                    msg : errorThrown,    
                }); 
            }
        });      
    }

    function guardar_remarcaciones(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];
        elementos["tableName"] = "remarcacion.remarcaciones";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push(arguments[0]);
        elementos["returnFields"].push("idremarcacion");
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                    guardar_asignacions_remarcaciones({
                        idremarcacion : data[0].return[0]["idremarcacion"],  
                        asignaciones:reporteAsignaciones.data      
                    });
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });  
                } 
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                        msg : errorThrown,    
                    }); 
            }
        });          
    }

    function guardar_cargos_precios(){
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["tableName"] = "remarcacion.precios_cargos";
        elementos["operacion"] = "Ingresar";
        arguments[0].cargos.forEach(function (value, index){
            elementos["campos"].push({
                "idprecio"    : argumentos[0].idprecio,
                "idcargo"     : value.idcargo,
                "monto"       : value.precio,
                "idcalculo"  : 1
            });
        });         
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                if (data[0].tipo == "success"){
                    success2({
                        msg : data[0].mesg,
                    });
                }
                else {
                    error2({
                        msg : data[0].mesg,    
                    });  
                }              
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : errorThrown,    
                }); 
            }
        });    
    }

    function guardar_precios(){
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];        
        elementos["tableName"] = "remarcacion.precios";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push(arguments[0]);
        elementos["returnFields"].push("idprecio");  
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function( data, textStatus, jQxhr ){
                    if (data[0].tipo == "success"){
                        success2({
                            msg : data[0].mesg,
                        });
                        guardar_cargos_precios({
                            idprecio:data[0].return[0]["idprecio"],
                            cargos:reportePrecios.data
                        });
                        guardar_remarcaciones({
                            idprecio  : data[0].return[0]["idprecio"],
                            fecha     : $("#TextFecha").val(),
                            idedificio: $("#SelectEdificio").val(),
                            idtarifa  : $("#SelectTarifa").val(),
                        });
                    }
                    else {
                        error2({
                            msg : data[0].mesg,    
                        });
                    }    
            },
            error: function( jqXhr, textStatus, errorThrown ){
                error2({
                    msg : data[0].mesg,    
                });
            }
        });
    }

    function loadCargosTarifas(reporte,idprecio,tableParams,idtabla){
        if (!(reporte.activo)){
            reporte.activo = true;
            //$("#btnCancelar").removeClass("disabled");
            ajaxParamsPrecios = {
                url: "php/data.php",
                type:"POST",
                data:function(d){
                    d.queries = [{
                        fieldsSelect:["*","array_to_json(array[parametros])->>0 as parametrosjson"],
                        tableName   :"remarcacion.vcargosprecios",
                        orderby:[{
                            field:"idclasificacion",
                            type : "asc"
                        },
                        {
                            field:"idcargo",
                            type : "asc"
                        }],
                        where:[{
                            field:"idprecio",
                            oper:"=",
                            value:idprecio,
                            type:"int"    
                        }],      
                    }]
                },
                dataSrc: function(data){
                    reporte.activo = false;
                   // $('#btnCalcular').attr("disabled","");
                    $('#btnCalcular').removeAttr('disabled');
                    //$("#btnCancelar").addClass("disabled");
                    reporte.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i];
                        elemento["DT_RowId"] = data[0].resultados[i].idcargo;
                        reporte.data.push(elemento);
                    }
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            };
                
                
                tableParams.ajax = ajaxParamsPrecios;
                tablaPrecios = $(idtabla).DataTable(tableParams);    


                
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

    function loadAsignaciones(reporte,idedificio,idtarifa,idtabla){
        var precios = [];
        reportePrecios.data.map(function(value,index){
            precios.push({
                idcargo:value.idcargo,
                nombre:value.nombre,
                idcalculo:value.idcalculo,
                monto:value.monto,
                parametros:value.parametrosjson,
                isleido:value.isleido
            });
        }); 
        

        

        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.getCalculos2(%s,%s,%s,'%s','%s','%s'::json,'%s')".format(
                            $("#SelectEdificio").val(),
                            idtarifa,
                            usuarioActivo,
                            $("#TextFechaInicial").val(),
                            $("#TextFechaFinal").val(),
                            JSON.stringify(precios),
                            database,
                        ),
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[],      
                    }]
                },
                success: function(data){
                    reporte.activo = false;
                    $('#btnGuardar').removeAttr("disabled");

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing:true,
                        scrollX:        true,
                        scrollCollapse: true,
                        fixedColumns:   {
                            leftColumns: 2,
                            //rightColumns: 1
                        },
                        order: [[ 0, 'asc' ]],
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                    }

                    valoresLeidos = JSON.parse(data[0].resultados[0].leidos);
                    valoresFacturados = JSON.parse(data[0].resultados[0].facturados);
                    
                   //**********Inicio Construir Cabeceras Tabla */
                    tableParams.columns=[
                        {data:"idasignacion",title:"Asignación"},
                        {data:"codigo",title:"Medidor"},
                        {data:"cons_nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];


                    var countValores = 0; 
                    valoresLeidos.forEach(function(element,index) {
                       if (element.isleida == "t") { 
                        tableParams.columns.push({data:"valoresleidos%s".format(index),title:element.nombreleida,width:"80px"});
                        countValores++;
                       } 
                    });

                    valoresFacturados.forEach(function(element,index) {
                        if ((element.solomonto === undefined) || (element.solomonto == 0)) {
                            tableParams.columns.push({data:"valoresfacturados%s".format(index),title:element.nombrefacturado,width:"80px"});
                            countValores++;
                        }    
                    });

                    valoresFacturados.forEach(function(element,index) {
                        tableParams.columns.push({data:"montosfacturados%s".format(index),title:element.nombremonto,width:"80px"});
                    });

                    tableParams.columns.push({data:"total",title:"Total"});                    
                    //**********Final Construir Cabeceras Tabla */
                    //**********Inicio Definiciones de Columnas */
                    tableParams.columnDefs = [{ 
                        targets: [5,7], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'width100 text-right',
                        type:'html-num-fmt'
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'width100 text-right',
                        type: 'currency',
                    }];
                    columnStart = 8;
                    /****Definicion de Columnas para Valores Leidos */
                    for (var index=columnStart;index<columnStart+countValores;index++){
                      tableParams.columnDefs[0].targets.push(index);      
                    }
                    columnStart = columnStart + countValores;
                    for (var index=columnStart;index<=columnStart+valoresFacturados.length;index++){
                      tableParams.columnDefs[1].targets.push(index);      
                    }
                    //**********Final Definiciones de Columnas */    

                    //********Inicio Construir arreglo de valores (table)
                    dataLeidaFacturada.data = [];
                    for (i=0;i<data[0].resultados.length;i++){
                        var elemento = {};
                        elemento = data[0].resultados[i],
                        elemento["total"] = 0;

                        dataLeidaFacturada.data.push({
                            leidos:[],
                            facturados:[]
                        });  

  
                        valoresLeidos = JSON.parse(data[0].resultados[i].leidos);

                        
                        valoresLeidos.forEach(function(element,index) {
                            elemento["valoresleidos%s".format(index)] = element.valor;
                            
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].leidos.push({
                                //idasignacion:data[0].resultados[i].idasignacion,
                                idcargo:element.idcargo,
                                valor  : element.valor,
                                fecha  : null,
                                isleida: (element.isleida == "t")
                            });

                            if ((element.fecha != "")  && (element.fecha !== undefined)) {
                                dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].leidos[dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].leidos.length-1].fecha = element.fecha;
                            }
                        });



                        valoresFacturados = JSON.parse(data[0].resultados[i].facturados);
                        valoresFacturados.forEach(function(element,index) {
                            if ((element.solomonto === undefined) || (element.solomonto == 0)) {
                                elemento["valoresfacturados%s".format(index)] = element.facturado;
                            } 
                            elemento["montosfacturados%s".format(index)] = element.monto;  
                            elemento["total"] += parseFloat(element.monto);
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].facturados.push({
                                //idasignacion:data[0].resultados[i].idasignacion,
                                idcargo:element.idcargo,
                                facturado  : element.facturado,
                                monto  : element.monto
                            });
                        });
                        reporte.data.push(elemento);
                    }
                    //********Final Construir arreglo de valores (table)

  
                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        //tablaasignaciones.processing( true );
                    }; 
                        tableParams.data = reporte.data;
                        $(idtabla).DataTable(tableParams);
                        

                        
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            });
                
                
                //tableParams.ajax = ajaxParams;
                //Tabla = $(idtabla).DataTable(tableParams);    
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    }    

    function loadAsignaciones2(reporte,idedificio,idtarifa,idtabla){
        var precios = [];
        var idlista = [];
        reportePrecios.data.map(function(value,index){
            var precio = JSON.parse(value.parametrosjson);
            if (precio.idlista !== undefined) {
                if (idlista.indexOf(precio.idlista) === -1){
                    idlista.push(precio.idlista);
                }
            }
            precios.push({
                idcargo:value.idcargo,
                nombre:value.nombre,
                idcalculo:value.idcalculo,
                monto:value.monto,
                parametros:value.parametrosjson,
                isleido:value.isleido
            });
        }); 
        if (!(reporte.activo)){
            reporte.activo = true;
            $.ajax({
                url: "php/data.php",
                type:"POST",
                data:{
                    queries : [{
                        fieldsSelect:["*"],
                        tableName   :"remarcacion.getCalculos2(%s,%s,%s,'%s','%s','%s'::json,'%s')".format(
                            $("#SelectEdificio").val(),
                            idtarifa,
                            usuarioActivo,
                            $("#TextFechaInicial").val(),
                            $("#TextFechaFinal").val(),
                            JSON.stringify(precios),
                            database,
                        ),
                        orderby:[{
                            field:"idasignacion",
                            type : "asc"
                        }],
                        where:[],      
                    },
                    {
                        fieldsSelect:["idlista","idvalorlista","idasignacion","valor","activo"],
                        tableName : "remarcacion.listas left join remarcacion.valores_listas using(idlista)",
                        orderby:[
                            {field:"idlista",type:"asc"},
                            {field:"idasignacion",type:"asc"}
                        ],
                        where :[
                            {field:"listas.idlista",oper:"in",value:"(%s)".format(idlista.join(',')),type:"int"}
                        ],
                    }]
                },
                success: function(data){
                    /*ACOMODAR LISTA*/
                    listas = [];
                    data[1].resultados.forEach(function(element,index){
                        var registro = findObjectByKey(listas,'idlista',parseInt(element.idlista));
                        if (registro == null){
                            index = listas.push({
                                idlista:parseInt(element.idlista),
                                valores:[]        
                            });
                            registro = listas[index-1];
                        }
                        registro.valores.push({
                            idvalorlista:parseInt(element.idvalorlista),
                            idasignacion:parseInt(element.idasignacion),
                            valor:parseFloat(element.valor)
                        });
                    });

                    
                    reporte.activo = false;
                    $('#btnGuardar').removeAttr("disabled");

                    reporte.data = [];
                    var tableParams = { 
                        responsive:true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing:true,
                        scrollX:        true,
                        scrollCollapse: true,
                        fixedColumns:   {
                            leftColumns: 2,
                            //rightColumns: 1
                        },
                        order: [[ 0, 'asc' ]],
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                    }

                    montosFijos = JSON.parse(data[0].resultados[0].montosfijos);
                    factoresCalculos = JSON.parse(data[0].resultados[0].factorescalculos);
                    valoresLeidos = JSON.parse(data[0].resultados[0].valoresleidos);
                    valoresFacturados = JSON.parse(data[0].resultados[0].valoresfacturados);    
                   //**********Inicio Construir Cabeceras Tabla */
                    tableParams.columns=[
                        {data:"idasignacion",title:"Asignación"},
                        {data:"codigo",title:"Medidor"},
                        {data:"cons_nombre",title:"Arrendatario"},
                        {data:"espa_nombre",title:"Espacio"},
                        {data:"energiafechainicial",title:"Fecha Inicial"},
                        {data:"energialecturainicial",title:"Lectura Inicial (kWh)"},
                        {data:"energiafechafinal",title:"Fecha Final"},
                        {data:"energialecturafinal",title:"Lectura Final (kWh)"},
                     ];

                     tableParams.columnDefs = [{ 
                        targets: [5,7], 
                        render: $.fn.dataTable.render.number( '.', ',', 2 ),
                        className: 'width100 text-right',
                        type:'html-num-fmt'
                    },
                    {
                        targets:[],
                        render: $.fn.dataTable.render.number( '.', ',', 0, ),
                        className: 'width100 text-right',
                        type: 'currency',
                    }];


                    var indexColumn = 8;
                    valoresLeidos.forEach(function(element,index) {
                        tableParams.columns.push({data:"valoresleidos%s".format(index),title:element.nombre,width:"80px"});
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });
                    valoresFacturados.forEach(function(element,index) {
                        tableParams.columns.push({data:"valoresfacturados%s".format(index),title:element.nombre,width:"80px"}); 
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });
                    montosFijos.forEach(function(element,index) {
                        tableParams.columns.push({data:"montosfijos%s".format(index),title:element.nombre,width:"80px"}); 
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });
                    factoresCalculos.forEach(function(element,index) {
                        tableParams.columns.push({data:"montoscalculados%s".format(index),title:element.nombre,width:"80px"}); 
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });

                    tableParams.columns.push({data:"total",title:"Total"});    
                    tableParams.columnDefs[1].targets.push(indexColumn++);                
                    //**********Final Construir Cabeceras Tabla */

                    //**********Inicio Definiciones de Columnas */

                    //********Inicio Construir arreglo de valores (table)

                    //********Final Construir arreglo de valores (table)

                    dataLeidaFacturada.data = [];
                    data[0].resultados.forEach(function(element,index){
                        var registro = {};
                        dataLeidaFacturada.data.push({
                            leidos:[],
                            facturados:[]
                        });      

                        registro = {
                            idasignacion: element.idasignacion,
                            codigo:element.codigo,
                            cons_nombre:element.cons_nombre,
                            espa_nombre:element.espa_nombre,
                            energiafechainicial:element.energiafechainicial,
                            energialecturainicial:element.energialecturainicial,
                            energiafechafinal:element.energiafechafinal,
                            energialecturafinal:element.energialecturafinal,
                        };
                        
                        JSON.parse(element.valoresleidos).forEach(function(e,i){
                            registro["valoresleidos%s".format(i)] = e.valor;  
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].leidos.push({
                                idcargo: parseInt(e.idcargo),
                                valor  : parseFloat(e.valor),
                                fecha  : null
                            });                   
                        });
                        valoresFacturados =  JSON.parse(element.valoresfacturados);
                        valoresFacturados.forEach(function(e,i){
                            registro["valoresfacturados%s".format(i)] = e.valor;                     
                        });
                        registro.total = 0;
                        JSON.parse(element.montosfijos).forEach(function(e,i){
                            registro["montosfijos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].facturados.push({
                                idcargo    : parseInt(e.idcargo),
                                facturado  : 1,
                                monto      : parseFloat(e.monto)
                            });                     
                        });
                        JSON.parse(element.factorescalculos).forEach(function(e,i){
                            var valor = 0;
                            if (e.idvariable !== undefined) {
                                switch (parseInt(e.idvariable)) {
                                    case 1: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','4').valor);
                                    break;
                                }
                            }
                            else if (e.idlista !== undefined) {
                                lista = findObjectByKey(listas,'idlista',parseInt(e.idlista));
                                asignacion = findObjectByKey(lista.valores,'idasignacion',parseInt(registro.idasignacion));
                                valor = asignacion.valor;
                            }
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length-1].facturados.push({
                                idcargo    : parseInt(e.idcargo),
                                facturado  : valor,
                                monto      : valor * parseFloat(e.factor)
                            }); 
                            registro["montoscalculados%s".format(i)] = valor * parseFloat(e.factor);
                            registro.total += valor * parseFloat(e.factor);
                        })
                        reporte.data.push(registro);                       
                    });

                    if ( $.fn.DataTable.isDataTable(idtabla) ) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        //tablaasignaciones.processing( true );
                    };                         
                        tableParams.data = reporte.data;
                        $(idtabla).DataTable(tableParams);

                        

                        
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg:errorThrown
                    });
                },
            });
                
                
                //tableParams.ajax = ajaxParams;
                //Tabla = $(idtabla).DataTable(tableParams);    
        }    
        else {
            error2({size:'normal',msg:"Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar"});
        }
    } 

</script>
<?php
}
else{
  echo "sin permiso";
}

?>