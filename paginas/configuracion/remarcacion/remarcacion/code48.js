
blog[paginaActiva.code].comments = blog[paginaActiva.code].comments || {};
blog[paginaActiva.code].comments.debugMode = false;

blog[paginaActiva.code].isFirstLoad = function (namesp, jsFile) {
    var isFirst = namesp.firstLoad === undefined;
    namesp.firstLoad = false;

    if (!isFirst) {
        console.log(
            "Warning: Javascript file is included twice: " +
            jsFile);
    }
    return isFirst;
};

var monthsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
ivaCargosGlobal = false;
$(document).ready(function () {

    $('.select2').select2();

    tablaRemarcaciones.on('select', function (event, dt, type, indexes) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Modificar Remarcacion");
            $("#btnAceptar i").text("Modificar");
            $("#hdOperacion").val("Modificar");
            var record = findObjectByKey(reporteRemarcaciones.data, 'idremarcacion', tablaRemarcaciones.rows(indexes).data()[0].idremarcacion);
            RemarcacionActual = record;
            cargarRemarcacion(record);
            // $('html, body').animate({scrollTop: $("#divOperaciones").offset().top}, "slow")
        }
    });

    tablaAsignaciones.on('select', function (event, dt, type, indexes) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            var record = findObjectByKey(reporteAsignaciones.data, 'idasignacion', tablaAsignaciones.rows(indexes).data()[0].idasignacion);
            $(".canvas-remarcacion").css('border', '');
            $("#canvasgraph%s".format(record.idasignacion)).css('border', '2px solid green');
        }
    });

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
        return;
    }

    $(document).on('change', '#SelectEdificio', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            selectJs2(
                "#SelectTarifa",
                {
                    Selected: (RemarcacionActual.idtarifaedificio !== undefined) ? RemarcacionActual.idtarifaedificio : -1,
                    value: "idtarifaedificio",
                    show: {
                        fields: ["idtarifaedificio", "nombre", "tari_codigo"],
                        format: "%s - %s | (%s)"
                    },
                    hide: ["idtarifaedificio"],
                    queries: [{
                        fieldsSelect: ["*"],
                        tableName: "remarcacion.vtarifasedificios",
                        orderby: [{
                            field: "nombre",
                            type: "asc"
                        }],
                        where: [{
                            field: "activo",
                            oper: "=",
                            value: "true",
                            type: "int",
                        },
                        {
                            logical: "AND",
                            field: "idtarifaedificio",
                            oper: "in",
                            type: "int",
                            value: "(select distinct(idtarifaedificio) from mediciones.vmedidores where (idedificio=%s))".format($("#SelectEdificio").val()),
                        }
                        ]
                    }],
                },
                {
                }
            );
        }
    });

    $(document).on('change', '#SelectPrecio', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            $("#TextFechaInicial").val($('option:selected', this).attr('data-desde'));
            $("#TextFechaFinal").val($('option:selected', this).attr('data-hasta'));
            $("#textAdjunto").val($('option:selected', this).attr('data-file'));
            $("#btnView").attr('disabled', ($("#textAdjunto").val() == ''));
            loadCargosPrecios(reportePrecios, $("#SelectPrecio").val(), tableParamsPrecios, "#tablaPrecios");
            $("#btnCalcular").attr("disabled", ((reportePrecios.data != null) && (reportePrecios.data.length == 0)) ? true : false);
        }
    });

    $(document).on('change', '#SelectTarifa', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            event.preventDefault();
            $("#divActualizaciones").addClass("hidden");
            idtarifaedificio = this.value;
            cargarPrecios($("#SelectEdificio").val(), this.value);
            if ($.fn.DataTable.isDataTable("#tablaPrecios")) {
                $("#tablaPrecios").DataTable().destroy();
                $("#tablaPrecios").empty();
                $("#btnCalcular").attr("disabled", true);
            };
        }
    });

    $(document).on('click', '#btnCalcular', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            event.preventDefault();
            if (validar('#FormaParametros')) {
                loadAsignaciones(reporteAsignaciones, $("#SelectEdificio").val(), $("#SelectTarifa").val(), "#tablaAsignaciones")
            }
        }
    });

    $(document).on('click', '#btnCancelar', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            $("#divOperaciones").addClass("hidden");
            $('html, body').animate({ scrollTop: $("#tablaRemarcaciones").offset().top }, "slow");
        }
    });

    $(document).on('click', '#btnNuevo', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            $("#divOperaciones").removeClass("hidden");
            $("#lbTitulo").text("Ingresar Precio");
            $("#btnAceptar i").text("Ingresar");
            $("#hdOperacion").val("Ingresar");
            $("#tab_graficos").empty();
            RemarcacionActual = {};
            clearComponentes();
        }
    });

    $(document).on('click', '#btnAceptar', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            event.preventDefault();
            if ($("#hdOperacion").val() == "Ingresar") {
                if (validar("#FormaParametros")) {
                    if (tablaAsignaciones.rows().data().count() > 0) {
                        guardar_remarcaciones();
                        confirmarModificar(tablaRemarcaciones, {
                            titulo: 'Confirmación',
                            msg: "¿Desea ingresar un ingresar un Nuevo item o continuar modificando el actual?",
                            btnSi: "#btnNuevo",
                        });
                    }
                    else {
                        error2({ msg: 'Lista de Calculos de Energia y Montos esta vacía' });
                    }
                }
                else {
                    //error2({msg:'error'});
                }

            }
            else {
                if (validar("#FormaParametros")) {
                    actualizar_remarcaciones(RemarcacionActual);
                }
                else {
                    //error2({msg:'error'});
                }
            }
        }
    });

    $(document).on('change', '.booleano_activo_remarcaciones', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Remarcaciones",
                "remarcacion.remarcaciones",
                { field: "idremarcacion", value: id, type: 'integer' },
                { name: 'activo', value: activo, type: 'boolean' },
                { name: 'idremarcacion', value: id },
                reporteRemarcaciones,
                "#checkActivo"
            );
        }
    });

    $(document).on('change', '.booleano_publicar_remarcaciones', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            var id = $(this).attr("id");
            var activo = $(this).is(":checked");
            updateFieldBoolean("Remarcaciones",
                "remarcacion.remarcaciones",
                { field: "idremarcacion", value: id, type: 'integer' },
                { name: 'publicar', value: activo, type: 'boolean' },
                { name: 'idremarcacion', value: id },
                reporteRemarcaciones,
                "#checkPublicar"
            );
        }
    });

    $(document).on('click', '.descargar_remarcaciones', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            boletas_remarcacion(this.id, this, 'detallada', $("#SelectEdificio").val(), true);
        }
    });

    $(document).on('click', '.descargarSimple_remarcaciones', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            boletas_remarcacion(this.id, this, 'detallada', $("#SelectEdificio").val(), false);
        }
    });

    $(document).on('click', '.descargar_boleta_asignacion', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            generar_boleta_array([this.id], this, 'detallada', $("#SelectEdificio").val(), true);
        }
    });

    $(document).on('click', '.descargarSimple_boleta_asignacion', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            generar_boleta_array([this.id], this, 'detallada', $("#SelectEdificio").val(), false);
        }
    });

    /*LISTO*/
    $(document).on('click', '.icono', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            event.preventDefault();
            $("#" + $(this).attr("data-input")).focus();
        }
    });

    function clearComponentes() {
        RemarcacionActual = {};
        $("#textFecha").val(moment().format("YYYY-MM-DD HH:mm:ss"));
        $("#TextFechaInicial").val('');
        $("#TextFechaFinal").val('');
        $("#checkActivo").attr("checked", true);
        $("#checkPublicar").attr("checked", false);
        tablaAsignaciones.rows().remove().draw('page');
        tablaPrecios.rows().remove().draw('page');
        reportePrecios.data.length = 0;
        reporteAsignaciones.data.length = 0;
        $("#SelectEdificio").val($("#SelectEdificio option:first").val());
        $("#SelectEdificio").select2().trigger('change');
        $("#btnCalcular").attr("disabled", true);
        $('html, body').animate({ scrollTop: $("#divOperaciones").offset().top }, "slow");
    }

    function cargarRemarcacion(record) {
        $("#textFecha").val(record.fecha);
        $("#SelectEdificio").val(record.idedificio);
        $("#SelectEdificio").select2().trigger('change');
        $("#checkActivo").attr("checked", (record.activo == 't'));
        $("#checkPublicar").attr("checked", (record.publicar == 't'));
        //        $("#SelectTarifa").val(record.idtarifaedificio);
        //        $("#SelectTarifa").select2().trigger('change');
        //        $("#SelectPrecio").val(record.idprecio);
        //        $("#SelectPrecio").select2().trigger('change');
        //        console.log($("#SelectPrecio").val());
        //        $("#lbTarifa").text("Precios Asociados a la Tarifa %s de %s".format(record.nombre,record.edif_nombre));
        loadAsignacionesAlmacenadas(reporteAsignaciones, record.idremarcacion, "#tablaAsignaciones");
    }

    function loadCargosPrecios2(reporte, idprecio, tableParams, idtabla) {
        if (!(reporte.activo)) {
            reporte.activo = true;
            //$("#btnCancelar").removeClass("disabled");
            ajaxParamsPrecios = {
                url: "php/data.php",
                type: "POST",
                data: function (d) {
                    d.queries = [{
                        fieldsSelect: ["*", "array_to_json(array[parametros])->>0 as parametrosjson"],
                        tableName: "remarcacion.vcargosprecios",
                        orderby: [{
                            field: "idclasificacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idprecio",
                            oper: "=",
                            value: idprecio,
                            type: "int"
                        }],
                    }]
                },
                dataSrc: function (data) {
                    reporte.activo = false;
                    // $('#btnCalcular').attr("disabled","");
                    $('#btnCalcular').removeAttr('disabled');
                    //$("#btnCancelar").addClass("disabled");
                    reporte.data = data[0].resultados;
                    for (index = 0; index < reporte.data.length; index++) {
                        //var elemento = {};
                        //elemento = data[0].resultados[i];
                        //reporte.data.push(elemento);
                        reporte.data[index].parametros_json = JSON.parse(reporte.data[index].parametros);
                    }
                    return (reporte.data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg: errorThrown
                    });
                },
            };
            tableParams.ajax = ajaxParamsPrecios;
            tablaPrecios = $(idtabla).DataTable(tableParams);
        }
        else {
            error2({ size: 'normal', msg: "Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar" });
        }
    }

    function loadCargosPrecios(reporte, idprecio, tableParams, idtabla) {
        if (!(reporte.activo)) {
            reporte.activo = true;
            //$("#btnCancelar").removeClass("disabled");
            $.ajax({
                url: "php/data.php?lista=cargosprecios",
                type: "POST",
                data: {
                    queries: [{
                        fieldsSelect: ["*", "array_to_json(array[parametros])->>0 as parametrosjson"],
                        tableName: "remarcacion.vcargosprecios",
                        orderby: [{
                            field: "idclasificacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idprecio",
                            oper: "=",
                            value: idprecio,
                            type: "int"
                        }],
                    }]
                },
                success: function (data) {
                    reporte.activo = false;
                    $('#btnCalcular').removeAttr('disabled');
                    reporte.data = data[0].resultados;
                    for (index = 0; index < reporte.data.length; index++) {
                        //var elemento = {};
                        //elemento = data[0].resultados[i];
                        //reporte.data.push(elemento);
                        reporte.data[index].parametros_json = JSON.parse(reporte.data[index].parametros);
                    }
                    if ($.fn.DataTable.isDataTable(idtabla)) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                    };
                    tableParams.aaData = reporte.data;
                    tableParams.data = reporte.data;
                    tablaPrecios = $(idtabla).DataTable(tableParams);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg: errorThrown
                    });
                },
            });
        }
        else {
            error2({ size: 'normal', msg: "Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar" });
        }
    }

    function loadAsignaciones(reporte, idedificio, idtarifa, idtabla) {
        var precios = [];
        var idlista = [];

        reportePrecios.data.map(function (value, index) {
            var precio = JSON.parse(value.parametrosjson);
            if (precio.idlista !== undefined) {
                if (idlista.indexOf(precio.idlista) === -1) {
                    idlista.push(precio.idlista);
                }
            }
            precios.push({
                idcargo: value.idcargo,
                nombre: value.nombre,
                idcalculo: value.idcalculo,
                monto: value.monto,
                parametros: value.parametrosjson,
                isleido: value.isleido
            });
        });
        if (!(reporte.activo)) {
            reporte.activo = true;

            if ($.fn.DataTable.isDataTable(idtabla)) {
                $(idtabla).DataTable().destroy();
                $(idtabla).empty();
                tablaAsignaciones.processing(true);
                //tablaasignaciones.processing( true );
            };

            $.ajax({
                url: "php/data.php?loadAsignaciones",
                type: "POST",
                data: {
                    queries: [{
                        fieldsSelect: ["*", "case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName: "nuevas.getCalculos_v3(%s,%s,%s,'%s','%s','%s'::json,'%s')".format(
                            idedificio,
                            idtarifa,
                            usuarioActivo,
                            $("#TextFechaInicial").val(),
                            $("#TextFechaFinal").val(),
                            JSON.stringify(precios),
                            database,
                        ),
                        orderby: [{
                            field: "substring(codigo,8,3)::integer",
                            type: "asc"
                        }],
                        where: [],
                    },
                    {
                        fieldsSelect: ["idlista", "idvalorlista", "idasignacion", "valor"],
                        tableName: "remarcacion.listas left join remarcacion.valores_listas using(idlista)",
                        orderby: [
                            { field: "idlista", type: "asc" },
                            { field: "idasignacion", type: "asc" }
                        ],
                        where: [
                            { field: "listas.idlista", oper: "in", value: "(%s)".format(idlista.join(',')), type: "int" }
                        ],
                    },
                    {
                        fieldSelect:["*"],
                        tableName: "configuraciones.vvalores",
                        orderby:[{field:"idvalor",type:"asc"}],
                        where:[{field:"idedificio",oper:"=",value:idedificio,type:"int"},
                               {logical:"and",field:"idcategoria",oper:"=",value:2,type:"int"},
                               {logical:"and",field:"conf_activo",oper:"=",value:true,type:"int"},
                               {logical:"and",field:"cate_activo",oper:"=",value:true,type:"int"},
                               {logical:"and",field:"prop_activo",oper:"=",value:true,type:"int"},
                               {logical:"and",field:"valo_activo",oper:"=",value:true,type:"int"},
                        ]
                      }]
                },
                success: function (data) {
                    console.log(data);
                    /*ACOMODAR LISTA*/
                    listas = [];
                    data[1].resultados.forEach(function (element, index) {
                        var registro = findObjectByKey(listas, 'idlista', parseInt(element.idlista));
                        if (registro == null) {
                            index = listas.push({
                                idlista: parseInt(element.idlista),
                                valores: []
                            });
                            registro = listas[index - 1];
                        }
                        registro.valores.push({
                            idvalorlista: parseInt(element.idvalorlista),
                            idasignacion: parseInt(element.idasignacion),
                            valor: parseFloat(element.valor)
                        });
                    });


                    reporte.activo = false;
                    $('#btnGuardar').removeAttr("disabled");

                    reporte.data = [];
                    var tableParams = {
                        responsive: true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing: true,
                        scrollX: true,
                        scrollCollapse: true,
                        autoWidth: false,
                        rowId: 'idasignacion',
                        fixedColumns: {
                            leftColumns: 2,
                            rightColumns: 1
                        },
                        select: {
                            style: 'single',
                        },
                        order: [],
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                        "footerCallback": function (row, data, start, end, display) {
                            var api = this.api(), data;

                            var intVal = function (i) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '') * 1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            total = [];
                            for (index = 7; index < (Object.keys(reporte.data[0]).length - 3); index++) {
                                total[index] = api.column(index).data().reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);
                                $(api.column(index).footer()).html(convertirFormatoLocal(total[index]));
                            }
                        }
                    }


                    ivaCargosGlobal = (PropBoolean(data[2].resultados,33,0) == 1);
                    console.log("iva Global:"+ivaCargosGlobal);
                    montosFijos = JSON.parse(data[0].resultados[0].montosfijos);
                    factoresCalculos = JSON.parse(data[0].resultados[0].factorescalculos);
                    valoresLeidos = JSON.parse(data[0].resultados[0].valoresleidos);
                    valoresFacturados = JSON.parse(data[0].resultados[0].valoresfacturados);
                    //**********Inicio Construir Cabeceras Tabla */
                    tableParams.columns = [
                        { data: "codigo", title: "Medidor" },
                        { data: "nombre", title: "Arrendatario" },
                        { data: "espa_nombre", title: "Espacio" },
                        { data: "energiafechainicial", title: "Fecha Inicial" },
                        { data: "energiafechafinal", title: "Fecha Final" },
                        { data: "energialecturainicial", title: "Lectura Inicial (kWh)" },
                        { data: "energialecturafinal", title: "Lectura Final (kWh)" },
                    ];

                    tableParams.columnDefs = [{
                        targets: [5, 6],
                        render: $.fn.dataTable.render.number('.', ',', 2),
                        className: 'text-right',
                        type: 'html-num-fmt'
                    },
                    {
                        targets: [],
                        render: $.fn.dataTable.render.number('.', ',', 0),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets: [2, 3, 4],
                        className: 'minimo120',
                    },
                    {
                        targets: [1],
                        className: 'minimo200',
                    },
                    {
                        targets: [2],
                        className: 'minimo300',
                    }, {
                        targets: [],
                        className: 'minimo80 text-center'
                    }, {
                        targets: [],
                        visible: false
                    }];


                    var indexColumn = 7;
                    valoresLeidos.forEach(function (element, index) {
                        tableParams.columns.push({ data: "valoresleidos%s".format(element.idvariable), title: element.nombre, width: "120px" });
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });

                    tableParams.columns.push({ data: "constante", title: "Constante" });
                    tableParams.columnDefs[5].targets.push(indexColumn++);
                    tableParams.columns.push({ data: "idconsumidor", title: "IDconsumidor" });
                    tableParams.columnDefs[6].targets.push(indexColumn++);
                    tableParams.columns.push({ data: "idtarifaedificio", title: "IDTarifaEdificio" });
                    tableParams.columnDefs[6].targets.push(indexColumn++);

                    factoresCalculos.forEach(function (element, index) {
                        switch (parseInt(element.idcargo)) {
                            case 4:
                            case 5:
                            case 6: idvariable = element.idvariable;
                                if (element.idvariable == "") {
                                    switch (parseInt(element.idcargo)) {
                                        case 4: idvariable = 1; break;
                                        case 5: idvariable = 3; break;
                                        case 6: idvariable = 4; break;
                                    }
                                }
                                tableParams.columns.push({ data: "valoresfacturados%s".format(idvariable), title: "%s Facturada".format(element.nombre), width: "120px" });
                                tableParams.columnDefs[0].targets.push(indexColumn++);
                                break;
                            /* default: switch (parseInt(element.calculo)){
                                         case 2: 
                                         case 8:
                                         case 9:
                                                 indice = ((valoresFacturados[index] !== undefined)&&(valoresFacturados[index].idvariable !== undefined) && (valoresFacturados[index].idvariable != null))?valoresFacturados[index].idvariable:factoresCalculos[index].idcargo;
                                                 nombre = ((valoresFacturados[index] !== undefined)&&(valoresFacturados[index].nombre !== undefined) && (valoresFacturados[index].nombre != null))?valoresFacturados[index].nombre:factoresCalculos[index].nombre;
                                                 tableParams.columns.push({data:"valoresfacturados%s-%s".format(element.idcargo,element.idvariable),title:element.nombre,width:"120px"}); 
                                                 tableParams.columnDefs[0].targets.push(indexColumn++);
                                                 break;
                                      }
                                      break;*/
                        }
                        /* if ((parseInt(element.calculo) != 4) || (parseInt(element.idcargo) == 4)){
                             console.log(valoresFacturados[index]);
                             indice = ((valoresFacturados[index] !== undefined)&&(valoresFacturados[index].idvariable !== undefined) && (valoresFacturados[index].idvariable != null))?valoresFacturados[index].idvariable:factoresCalculos[index].idcargo;
                             nombre = ((valoresFacturados[index] !== undefined)&&(valoresFacturados[index].nombre !== undefined) && (valoresFacturados[index].nombre != null))?valoresFacturados[index].nombre:factoresCalculos[index].nombre;
                             console.log(element);
                             tableParams.columns.push({data:"valoresfacturados%s".format(indice),title:nombre,width:"120px"}); 
                             tableParams.columnDefs[0].targets.push(indexColumn++);
                         }*/
                    });
                    montosFijos.forEach(function (element, index) {
                        tableParams.columns.push({ data: "montosfijos%s".format(index), title: "Monto por %s".format(element.nombre), width: "120px" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });
                    factoresCalculos.forEach(function (element, index) {
                        tableParams.columns.push({ data: "montoscalculados%s".format(element.idcargo), title: "Monto por %s".format(element.nombre), width: "120px" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });

                    if (!(ivaCargosGlobal)) {
                        tableParams.columns.push({ data: "totalneto", title: "Total Neto" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                        tableParams.columns.push({ data: "totaliva", title: "Total IVA" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    }
                    tableParams.columns.push({ data: "total", title: "Total" });
                    tableParams.columnDefs[1].targets.push(indexColumn++);
                    //**********Final Construir Cabeceras Tabla */

                    //**********Inicio Definiciones de Columnas */

                    //********Inicio Construir arreglo de valores (table)

                    //********Final Construir arreglo de valores (table)

                    dataLeidaFacturada.data = [];
                    columna = 1;
                    fila = 1;
                    $("#tab_graficos").empty();
                    data[0].resultados.forEach(function (element, index) {
                        var registro = {};
                        dataLeidaFacturada.data.push({
                            leidos: [],
                            facturados: []
                        });
                        montos = {};
                        registro = {
                            rowId: element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo: element.codigo,
                            cons_nombre: element.cons_nombre,
                            nombre: element.nombre,
                            espa_nombre: element.espa_nombre,
                            energiafechainicial: element.energiafechainicial,
                            energiafechafinal: element.energiafechafinal,
                            energialecturainicial: element.energialecturainicial,
                            energialecturafinal: element.energialecturafinal,
                            constante: element.constante,
                            idconsumidor: element.idconsumidor,
                            idtarifaedificio: element.idtarifaedificio
                        };

                        JSON.parse(element.valoresleidos).forEach(function (e, i) {
                            //registro["valoresleidos%s".format(i)] = e.valor;  
                            registro["valoresleidos%s".format(e.idvariable)] = parseFloat(e.valor);
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length - 1].leidos.push({
                                idcargo: parseInt(e.idcargo),
                                valor: parseFloat(e.valor),
                                fecha: (e.fecha !== undefined) ? e.fecha : null
                            });
                        });
                        valoresFacturados = JSON.parse(element.valoresfacturados);
                        valoresFacturados.forEach(function (e, i) {
                            //registro["valoresfacturados%s".format(i)] = e.valor;
                            registro["valoresfacturados%s".format(e.idvariable)] = parseFloat(e.valor);
                        });
                        var totalneto = 0;
                        var monto = 0;
                        JSON.parse(element.montosfijos).forEach(function (e, i) {
                            monto = (element.calculos == 't') ? Math.round(parseFloat(e.monto)) : 0;
                            monto = (!(ivaCargosGlobal))?monto:Math.round(monto*1.19);
                            registro["montosfijos%s".format(i)] = monto;
                            totalneto += monto;
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length - 1].facturados.push({
                                idcargo: parseInt(e.idcargo),
                                facturado: 1,
                                monto: monto
                            });
                        });
                        var energia = 0;
                        JSON.parse(element.factorescalculos).forEach(function (e, i) {
                            var valor = 0;
                            if ((e.idvariable !== undefined) && (e.idvariable != "")) {

                                valor = parseFloat(findObjectByKey(valoresFacturados, 'idvariable', e.idvariable).valor);
                                /*switch (parseInt(e.idvariable)) {
                                    case 1: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','4').valor);
                                    energia = valor;
                                    break;
                                    case 2: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','13').valor);
                                    break;
                                    case 3: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','5').valor);
                                    break;
                                    case 4: valor = parseFloat(findObjectByKey(valoresFacturados,'idcargo','6').valor);
                                    break;
                                }*/
                            }
                            else if (e.idlista !== undefined) {
                                if (e.idlista != "") {
                                    var unico = ((e.unico !== undefined) && (e.unico == 1));
                                    lista = findObjectByKey(listas, 'idlista', parseInt(e.idlista));
                                    asignacion = findObjectByKey(lista.valores, 'idasignacion', parseInt(registro.idasignacion));
                                    if (parseFloat(e.calculo) != 8) {
                                        valor = (asignacion != null) ? (!(unico)) ? asignacion.valor : 1 : 0;
                                    }
                                    else {
                                        valor = (asignacion != null) ? asignacion.valor : 0;
                                    }
                                }
                                else {
                                    valor = 0;
                                }
                            }
                            //tipo de calculo
                            var monto = 0;
                            switch (parseInt(e.calculo)) {
                                case 2: monto = Math.round(valor * parseFloat(e.factor));
                                    break;
                                case 4: monto = Math.round(valor * parseFloat(e.factor));
                                    //registro["valoresfacturados%s".format(e.idcargo)] = parseFloat(e.factor);
                                    break;
                                case 8: montoEnergia = (montos["montosvariables1"] !== undefined) ? montos["montosvariables1"] : 0;
                                    montoDemandaHP = (montos["montosvariables3"] !== undefined) ? montos["montosvariables3"] : 0;
                                    montoDemandaSUM = (montos["montosvariables4"] !== undefined) ? montos["montosvariables4"] : 0;
                                    monto = Math.round((valor / 100) * (montoEnergia + montoDemandaHP + montoDemandaSUM));
                                    //registro["valoresfacturados%s".format(e.idcargo)] = valor;
                                    break;
                                case 9:
                                    montoEnergia = (montos["montosvariables1"] !== undefined) ? montos["montosvariables1"] : 0;
                                    monto = Math.round(montoEnergia * (parseFloat(e.factor) / 100));
                                    //registro["valoresfacturados%s".format(e.idcargo)] = e.factor;
                                    break;
                            }
                            monto = ((element.calculos == 't') ? monto : 0) * ((element.perdida == 't') ? 1.035 : 1)
                            monto = (!(ivaCargosGlobal))?monto:Math.round(monto*1.19);
                            dataLeidaFacturada.data[dataLeidaFacturada.data.length - 1].facturados.push({
                                idcargo: parseInt(e.idcargo),
                                facturado: valor,
                                monto: monto,
                            });
                            if (parseInt(e.calculo) == 2) {
                                montos["montosvariables%s".format(e.idvariable)] = monto;
                            }
                            registro["montoscalculados%s".format(e.idcargo)] = monto;

                            totalneto += monto;
                        })

                        totalneto = Math.round(totalneto);
                        totaliva = Math.round(totalneto * 0.19);
                        if (!(ivaCargosGlobal)){
                            console.log("iva no incluidos en cargos")
                            registro.totalneto = totalneto;
                            registro.totaliva = totaliva;
                            registro.total = Math.round(totalneto + totaliva);
                        }
                        else {
                            console.log("iva incluido en cargos")
                            registro.total = Math.round(totalneto);
                        }
                        


                        reporte.data.push(registro);


                        dias = Math.trunc(moment(registro.energiafechafinal, 'YYYY-MM-DD').diff(moment(registro.energiafechainicial, 'YYYY-MM-DD'), 'days') / 2);
                        mes = moment(registro.energiafechafinal, 'YYYY-MM-DD').subtract(dias, 'd').format('M');
                        //agregar_Grafico(fila, "#tab_graficos", element, $("#TextFechaFinal").val(), { temporal: true, total: registro["valoresfacturados1"], totalconsumo: totalneto, mes: monthsShort[mes - 1] });

                        columna = (columna <= 1) ? columna + 1 : 1;
                        fila = (columna == 1) ? fila + 1 : fila;
                    });


                    var cadena = "";
                    for (i = 1; i <= Object.keys(reporte.data[0]).length - 3; i++) {
                        cadena += "<th>-</th>";
                    }
                    $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                    tableParams.data = reporte.data;
                    tableParams.buttons.buttons[2].orientation = 'landscape';
                    tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaAsignaciones = $(idtabla).DataTable(tableParams);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg: errorThrown
                    });
                },
            });
        }
        else {
            error2({ size: 'normal', msg: "Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar" });
        }
    }

    function loadAsignacionesAlmacenadas(reporte, idremarcacion, idtabla) {
        if (!(reporte.activo)) {
            reporte.activo = true;
            $.ajax({
                url: "php/data.php?loadAsignacionesAlmacenadas",
                type: "POST",
                data: {
                    queries: [{
                        fieldsSelect: ["*", "case when (asig_codigo <> '') and (asig_codigo is not null) then asig_codigo else cons_nombre end as nombre "],
                        tableName: "remarcacion.vremarcacionesasignaciones",
                        orderby: [{
                            field: "idasignacion",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    },
                    {
                        fieldsSelect: ["*"],
                        tableName: "remarcacion.vvaloresleidos",
                        orderby: [{
                            field: "idremarcacionasignacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    },
                    {
                        fieldsSelect: ["*"],
                        tableName: "remarcacion.vvaloresfacturados",
                        orderby: [{
                            field: "idremarcacionasignacion",
                            type: "asc"
                        },
                        {
                            field: "idcargo",
                            type: "asc"
                        }],
                        where: [{
                            field: "idremarcacion",
                            oper: "=",
                            value: idremarcacion,
                            type: "int"
                        }],
                    }]
                },
                success: function (data) {
                    /*ACOMODAR LISTA*/
                    console.log(data);

                    reporte.activo = false;
                    reporte.data = [];
                    var tableParams = {
                        responsive: true,
                        destroy: true,
                        paging: true,
                        searching: true,
                        processing: true,
                        //  scrollY: 300,
                        scrollX: true,
                        scrollCollapse: true,
                        autoWidth: false,
                        rowId: 'idasignacion',
                        fixedColumns: {
                            leftColumns: 2,
                            rightColumns: 1
                        },
                        order: [[0, 'asc']],
                        select: {
                            style: 'single',
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                        language: spanish,
                        "footerCallback": function (row, data, start, end, display) {
                            var api = this.api(), data;

                            var intVal = function (i) {
                                return typeof i === 'string' ?
                                    i.replace(/[\$,]/g, '') * 1 :
                                    typeof i === 'number' ?
                                        i : 0;
                            };

                            total = [];
                            for (index = 7; index < (Object.keys(reporte.data[0]).length - 3) - 1; index++) {
                                total[index] = api.column(index).data().reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);
                                $(api.column(index).footer()).html(convertirFormatoLocal(total[index]));
                            }
                        }
                    }

                    tableParams.columns = [
                        { data: "codigo", title: "Medidor" },
                        { data: "nombre", title: "Arrendatario" },
                        { data: "espa_nombre", title: "Espacio" },
                        { data: "energiafechainicial", title: "Fecha Inicial" },
                        { data: "energiafechafinal", title: "Fecha Final" },
                        { data: "energialecturainicial", title: "Lectura Inicial (kWh)" },
                        { data: "energialecturafinal", title: "Lectura Final (kWh)" },
                    ];

                    tableParams.columnDefs = [{
                        targets: [5, 6],
                        render: $.fn.dataTable.render.number('.', ',', 2),
                        className: 'text-right',
                        type: 'html-num-fmt',
                        width: 200
                    },
                    {
                        targets: [],
                        render: $.fn.dataTable.render.number('.', ',', 0),
                        className: 'text-right',
                        type: 'currency',
                    },
                    {
                        targets: [2, 3, 4],
                        className: 'minimo120',
                    },
                    {
                        targets: [1],
                        className: 'minimo200',
                    },
                    {
                        targets: [-1],
                        className: 'text-center',
                    }, {
                        targets: [0],
                        className: 'minimo80'
                    }, {
                        targets: [],
                        className: 'minimo80 text-center'
                    }];

                    var idremarcacionasignacion = data[0].resultados[0].idremarcacionasignacion;
                    var count = 0;
                    var indexColumn = 7;
                    dataLeidaFacturada.data = [];
                    let filtrado = data[1].resultados.filter(element => (element.idremarcacionasignacion===idremarcacionasignacion));
                    filtrado.map((element,index) => {
                        tableParams.columns.push({ data: "valoresleidos%s".format(index), title: "%s leida".format(element.nombre), width: "300px" });
                        tableParams.columnDefs[0].targets.push(indexColumn++);                        
                    })

                    /*for (index = 0; index < data[1].resultados.length; index++) {
                        if (data[1].resultados[index].idremarcacionasignacion !== idremarcacionasignacion) {
                            break;
                        }
                        tableParams.columns.push({ data: "valoresleidos%s".format(count++), title: "%s leida".format(data[1].resultados[index].nombre), width: "300px" });
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    };*/

                    tableParams.columns.push({ data: "constante", title: "Constante" });
                    tableParams.columnDefs[6].targets.push(indexColumn++);

                    var idremarcacionasignacion = data[2].resultados[0].idremarcacionasignacion;

                    var facturados = data[2].resultados.filter(function (elemento) {
                        return ((elemento.idremarcacionasignacion == idremarcacionasignacion) &&
                            (elemento.calc_nombre == "Valor Facturado"));
                    });
                    count = 0;
                    facturados.forEach(function (element, index) {
                        tableParams.columns.push({ data: "valoresfacturados%s".format(count++), title: "%s facturada".format(element.nombre), width: 200 });
                        tableParams.columnDefs[0].targets.push(indexColumn++);
                    });

                    var facturados = data[2].resultados.filter(function (elemento) {
                        return (elemento.idremarcacionasignacion == idremarcacionasignacion);
                    });
                    count = 0;
                    facturados.forEach(function (element, index) {
                        tableParams.columns.push({ data: "montos%s".format(count++), title: "Monto por %s".format(element.nombre), width: 200 });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    });

                    tableParams.columns.push({ data: "total", title: "Total" });
                    tableParams.columnDefs[1].targets.push(indexColumn++);
                    var ivacargos = data[0].resultados[0].ivacargos;
                    if (ivacargos == 'f') {
                        tableParams.columns.push({ data: "totaliva", title: "Total+IVA" });
                        tableParams.columnDefs[1].targets.push(indexColumn++);
                    }
                    tableParams.columns.push({ data: "boleta", title: "Boleta" });
                    columna = 1;
                    fila = 1;

                    $("#tab_graficos").empty();

                    data[0].resultados.forEach(function (element, index) {
                        var registro = {};

                        registro = {
                            DT_RowId: element.idasignacion,
                            idasignacion: element.idasignacion,
                            codigo: element.codigo,
                            nombre: element.nombre,
                            cons_nombre: element.cons_nombre,
                            espa_nombre: element.espa_nombre,
                            energiafechainicial: element.energiafechainicial,
                            energialecturainicial: element.energialecturainicial,
                            energiafechafinal: element.energiafechafinal,
                            energialecturafinal: element.energialecturafinal,
                            constante: element.constante,
                            total: 0,
                        };
                        if (ivacargos == 'f') {
                            registro.totaliva = 0;
                        }


                        var leidos = data[1].resultados.filter(function (elemento) {
                            return elemento.idremarcacionasignacion == element.idremarcacionasignacion;
                        });
                        dataLeidaFacturada.data.push({
                            leidos: [],
                            facturados: []
                        });
                        leidos.forEach(function (e, i) {
                            dataLeidaFacturada.data[index].leidos.push({ idcargo: e.idcargo, valor: e.valor, fecha: e.fecha });
                            registro["valoresleidos%s".format(i)] = e.valor;
                        });

                        var facturados = data[2].resultados.filter(function (elemento) {
                            return ((elemento.idremarcacionasignacion == element.idremarcacionasignacion)
                                && (elemento.calc_nombre == "Valor Facturado"));
                        });


                        facturados.forEach(function (e, i) {
                            registro["valoresfacturados%s".format(i)] = e.facturado;
                        });

                        var facturados = data[2].resultados.filter(function (elemento) {
                            return (elemento.idremarcacionasignacion == element.idremarcacionasignacion);
                        });

                        facturados.forEach(function (e, i) {
                            dataLeidaFacturada.data[index].facturados.push({ idcargo: e.idcargo, facturado: e.facturado, monto: e.monto });
                            registro["montos%s".format(i)] = e.monto;
                            registro.total += parseFloat(e.monto);
                            if (ivacargos == 'f') {
                                registro.totaliva = Math.round(registro.total * 1.19);
                            }
                        });

                        registro.boleta = '<button id="%s" name="descargar" class="btn btn-info btn-xs descargar_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion) + "&nbsp" +
                            '<button id="%s" name="descargarSimple" class="btn btn-warning btn-xs descargarSimple_boleta_asignacion"><i class="fa fa-download"></i></button>'.format(element.idremarcacionasignacion);

                        //agregar_Grafico(fila, "#tab_graficos", element, element.hasta, { temporal: false });
                        columna = (columna <= 1) ? columna + 1 : 1;
                        fila = (columna == 1) ? fila + 1 : fila;
                        reporte.data.push(registro);
                    });
                    console.log('Columnas');
                    console.log(tableParams.columns);
                    console.log('Campos');
                    console.log(reporte.data[0]);

                    if ($.fn.DataTable.isDataTable(idtabla)) {
                        $(idtabla).DataTable().destroy();
                        $(idtabla).empty();
                        var cadena = "";
                        for (i = 1; i <= Object.keys(reporte.data[0]).length - 3; i++) {
                            cadena += "<th>-</th>";
                        }
                        $(idtabla).append('<tfoot><tr>%s</tr></tfoot>'.format(cadena));
                        //tablaasignaciones.processing( true );
                    };
                    tableParams.data = reporte.data;
                    tableParams.buttons.buttons[2].orientation = 'landscape';
                    tableParams.buttons.buttons[2].pageSize = 'LEGAL';
                    tablaAsignaciones = $(idtabla).DataTable(tableParams);



                },
                error: function (jqXHR, textStatus, errorThrown) {
                    error2({
                        msg: errorThrown
                    });
                },
            });

        }
        else {
            error2({ size: 'normal', msg: "Reporte Solicitado, espere a que finalice la consulta o puede detener la ejecución con el botón Cancelar" });
        }
    }

    function guardar_remarcaciones() {
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];
        elementos["tableName"] = "remarcacion.remarcaciones";
        elementos["operacion"] = "Ingresar";
        elementos["campos"].push({
            "fecha": $("#textFecha").val(),
            "idprecio": $("#SelectPrecio").val(),
            "idedificio": $("#SelectEdificio").val(),
            "idtarifaedificio": $("#SelectTarifa").val(),
            "activo": $("#checkActivo").is(":checked"),
            "publicar": $("#checkPublicar").is(":checked"),
            "ivacargos": ivaCargosGlobal
        });
        elementos["returnFields"].push("idremarcacion");
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    success2({
                        msg: data[0].mesg,
                    });
                    guardar_log(data[0].return[0]["idremarcacion"], elementos["tableName"], elementos["operacion"], JSON.stringify(elementos["campos"]), usuarioActivo);
                    guardar_asignaciones_remarcaciones({
                        idremarcacion: data[0].return[0]["idremarcacion"],
                        asignaciones: reporteAsignaciones.data
                    });
                }
                else {
                    console.log(data);
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: data[0].mesg,
                });
            }
        });
    }

    function eliminar_asignaciones_remarcaciones(idRemarcacion) {
        var elementos = {}
        elementos["tableName"] = "remarcacion.remarcaciones_asignaciones";
        elementos["operacion"] = "Eliminar";
        elementos["where"] = [{
            field: "idremarcacion",
            oper: "=",
            value: idRemarcacion,
            type: "int"
        }];
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    guardar_log(idRemarcacion, elementos["tableName"], elementos["operacion"], JSON.stringify(elementos["where"]), usuarioActivo);
                    guardar_asignaciones_remarcaciones({
                        idremarcacion: idRemarcacion,
                        asignaciones: reporteAsignaciones.data
                    });
                }
                else {
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: data[0].mesg,
                });
            }
        });
    }

    function actualizar_remarcaciones(remarcacion) {
        //event.preventDefault();
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];
        elementos["tableName"] = "remarcacion.remarcaciones";
        elementos["primaryField"] = "idremarcacion";
        elementos["operacion"] = "Modificar";
        elementos["types"] = "date,integer,integer,boolean,boolean,boolean,integer,integer";
        elementos["campos"].push({
            "update": {
                "fecha": $("#textFecha").val(),
                "idprecio": $("#SelectPrecio").val(),
                "idedificio": $("#SelectEdificio").val(),
                "activo": $("#checkActivo").is(":checked"),
                "publicar": $("#checkPublicar").is(":checked"),
                "ivacargos": ivaCargosGlobal,
                "idtarifaedificio": $("#SelectTarifa").val(),
            },
            "primaryValue": remarcacion.idremarcacion,
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    updaterecord(remarcacion.idremarcacion);
                    guardar_log(remarcacion.idremarcacion, elementos["tableName"], elementos["operacion"], JSON.stringify(elementos["campos"]), usuarioActivo);
                    eliminar_asignaciones_remarcaciones(remarcacion.idremarcacion);

                    success2({
                        msg: data[0].mesg,
                    });
                }
                else {
                    console.log(data);
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: data[0].mesg,
                });
            }
        });
    }

    function guardar_asignaciones_remarcaciones() {
        argumentos = arguments;
        var elementos = {}
        elementos["campos"] = [];
        elementos["returnFields"] = [];
        elementos["tableName"] = "remarcacion.remarcaciones_asignaciones";
        elementos["operacion"] = "Ingresar";
        arguments[0].asignaciones.forEach(function (value, index) {
            elementos["campos"].push({
                "idremarcacion": argumentos[0].idremarcacion,
                "idasignacion": value.idasignacion,
                "energiafechainicialx1": value.energiafechainicialx1,
                "energiafechainicialx2": value.energiafechainicialx2,
                "energiavalorinicialy1": value.energiavalorinicialx1,
                "energiavalorinicialy2": value.energiavalorinicialx2,
                "energiafechainicial": value.energiafechainicial,
                "energialecturainicial": value.energialecturainicial,
                "energiafechafinalx1": value.energiafechafinalx1,
                "energiafechafinalx2": value.energiafechafinalx2,
                "energiavalorfinaly1": value.energiavalorfinalx1,
                "energiavalorfinaly2": value.energiavalorfinalx2,
                "energiafechafinal": value.energiafechafinal,
                "energialecturafinal": value.energialecturafinal,
                "constante": value.constante,
                "idconsumidor": value.idconsumidor,
                "idtarifaedificio": value.idtarifaedificio
            });
        });
        elementos["returnFields"].push("idremarcacionasignacion", "idasignacion");
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementos,
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    success2({
                        msg: data[0].mesg,
                    });
                    guardar_log(argumentos[0].idremarcacion, elementos["tableName"], elementos["operacion"], JSON.stringify(elementos["campos"]), usuarioActivo);
                    guardar_valores_leidos_facturados(argumentos[0].idremarcacion, data[0].return);
                }
                else {
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: errorThrown,
                });
            }
        });
    }

    function guardar_valores_leidos_facturados(idremarcacion, idremarcacionasignacion) {

        /*for (var indexAsignaciones=0;indexAsignaciones<dataLeidaFacturada.data.length;indexAsignaciones++){
            var asignacion = dataLeidaFacturada.data[indexAsignaciones];
            for (var indexLeidos=0;indexLeidos<asignacion.leidos.length;indexLeidos++){
                dataLeidaFacturada.data[indexAsignaciones].leidos[indexLeidos].idremarcacionasignacion = idremarcacionasignacion[indexAsignaciones].idremarcacionasignacion;
            }
            for (var indexFacturados=0;indexFacturados<asignacion.facturados.length;indexFacturados++){
                dataLeidaFacturada.data[indexAsignaciones].facturados[indexFacturados].idremarcacionasignacion = idremarcacionasignacion[indexAsignaciones].idremarcacionasignacion;
            }
        }*/

        dataLeidaFacturada.data.forEach(function (element, index) {
            element.leidos.forEach(function (e, i) {
                e.idremarcacionasignacion = idremarcacionasignacion[index].idremarcacionasignacion
            });
            element.facturados.forEach(function (e, i) {
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
        dataLeidaFacturada.data.forEach(function (value, index) {
            value.leidos.forEach(function (value, index) {
                elementosLeidos["campos"].push(value);
            });
            value.facturados.forEach(function (value, index) {
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
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    success2({
                        msg: data[0].mesg,
                    });
                    guardar_log(idremarcacion, elementosLeidos["tableName"], elementosLeidos["operacion"], JSON.stringify(elementosLeidos["campos"]), usuarioActivo);
                    tablaRemarcaciones.row({ selected: true }).deselect();
                    tablaRemarcaciones.ajax.reload();
                }
                else {
                    console.log(data);
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: errorThrown,
                });
            }
        });
        $.ajax({
            url: 'php/operacion_multiple.php',
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: elementosFacturados,
            success: function (data, textStatus, jQxhr) {
                if (data[0].tipo == "success") {
                    success2({
                        msg: data[0].mesg,
                    });
                    guardar_log(idremarcacion, elementosFacturados["tableName"], elementosFacturados["operacion"], JSON.stringify(elementosFacturados["campos"]), usuarioActivo);
                }
                else {
                    console.log(data);
                    error2({
                        msg: data[0].mesg,
                    });
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                error2({
                    msg: errorThrown,
                });
            }
        });
    }

    function boletas_remarcacion(idremarcacion, button, tipo, idedificio, showCargos) {
        $(button).attr('disabled', true);
        $("i", button).attr('class', 'fas fa-sync fa-spin');
        $.ajax({
            url: "php/data.php",
            type: "POST",
            data: {
                queries: [{
                    fieldsSelect: ["idremarcacionasignacion"],
                    tableName: "remarcacion.remarcaciones_asignaciones left join mediciones.asignaciones using (idasignacion)",
                    orderby: [{ field: "idremarcacionasignacion", type: "asc" }],
                    where: [{
                        field: "idremarcacion",
                        oper: "=",
                        value: idremarcacion,
                        type: "int"
                    },
                    {
                        logical: "and",
                        field: "local",
                        oper: "=",
                        value: "true",
                        type: "int"
                    }],
                }]
            },
            success: function (data) {
                generar_boleta_array(data[0].resultados.map(remarcacionesAsignaciones => remarcacionesAsignaciones.idremarcacionasignacion), button, tipo, idedificio, showCargos);
            }
        });
    }

    $(document).on('click', '#btnView', function (event) {
        if (paginaActiva.code == 48) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            var File = 'php/uploads/%s'.format($("#textAdjunto").val());
            descargar2(File, $("#textAdjunto").val());
        }
    });

    function updaterecord(idRemarcacion) {
        var index = findObjectByKeyIndex(tablaRemarcaciones.rows().data(), 'idremarcacion', idRemarcacion);
        var record = tablaRemarcaciones.rows().data()[index];
        record.fecha = $("#textFecha").val();
        record.desde = $("#TextFechaInicial").val();
        record.hasta = $("#TextFechaFinal").val();
        record.idedificio = $("#SelectEdificio").val();
        record.edif_nombre = $("#SelectEdificio").select2('data')[0].text;
        record.idtarifa = $("#SelectTarifa").val();
        record.tari_codigo = $("#SelectTarifa").select2('data')[0].text;
        record.activo = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_activo_remarcaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idremarcacion, ($("#checkActivo").is(":checked")) ? "checked" : "");
        record.publicar = '<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_publicar_remarcaciones" type="checkbox" %s ><span class="switcher"></span></label>'.format(record.idremarcacion, ($("#checkPublicar").is(":checked")) ? "checked" : "");
        tablaRemarcaciones.row("#" + record.idremarcacion).data(record).invalidate().draw('page');
        var record2 = findObjectByKey(reporteRemarcaciones.data, 'idremarcacion', idRemarcacion);
        record2.fecha = record.fecha;
        record2.desde = record.desde;
        record2.hasta = record2.hasta;
        record2.idedificio = record.idedificio;
        record2.edif_nombre = record.edif_nombre;
        record2.idtarifa = record.idtarifa;
        record2.tari_codigo = record.tari_codigo;
        record2.activo = ($("#checkActivo").is(":checked")) ? "t" : "f";
        record2.publicar = ($("#checkPublicar").is(":checked")) ? "t" : "f";
    }

    function cargarPrecios(idedificio, idtarifaedificio) {
        selectJs2(
            "#SelectPrecio",
            {
                Selected: RemarcacionActual.idprecio,
                value: "idprecio",
                show: {
                    fields: ["idprecio", "fecha"],
                    format: "P%s:(%s)"
                },
                hide: ["desde", "hasta", "file"],
                queries: [{
                    fieldsSelect: ["*", "coalesce(adjunto,''::text) as file"],
                    tableName: "remarcacion.vprecios",
                    orderby: [{
                        field: "idprecio",
                        type: "desc"
                    }],
                    where: [
                        {
                            field: "(idedificio",
                            oper: "=",
                            type: "int",
                            value: idedificio,
                        },
                        {
                            logical: "and",
                            field: "idtarifaedificio",
                            oper: "=",
                            type: "int",
                            value: idtarifaedificio,
                        },
                        {
                            logical: "and",
                            field: "activo",
                            oper: "=",
                            value: true,
                            type: "int"
                        },
                        {
                            logical: "and",
                            field: "idprecio",
                            oper: "not in",
                            value: "(select distinct(idprecio) from remarcacion.remarcaciones where (idedificio=%s) and (idtarifaedificio=%s)))".format(idedificio, idtarifaedificio),
                            type: "int"
                        },
                        {
                            logical: "or",
                            field: "idprecio",
                            oper: "=",
                            value: (RemarcacionActual.idprecio !== undefined) ? RemarcacionActual.idprecio : -1,
                            type: "int"
                        }
                    ]
                }],
            },
            {
                startDisable: true,
            }
        );
    }

    function agregar_Grafico(fila, contenedor, registro, hasta) {
        var divFila;
        temporal = arguments[4];
        temporal.title = registro.cons_nombre + ' ' + registro.codigo;
        if ($("#grafico_row_%s".format(fila)).length == 0) {
            divFila = $('<div class="row" id="grafico_row_%s">'.format(fila)).appendTo(contenedor);
        }
        else {
            divFila = $("#grafico_row_%s".format(fila));
        }
        divCol = $('    <div class="col col-md-6 grafico-remarcacion" id="grafico_col_%s">'.format(registro.idasignacion)).appendTo(divFila);
        canvas = $('             <canvas class="canvas-remarcacion" id="canvasgraph%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(registro.idasignacion)).appendTo(divCol);
        var graphTarget = $("#canvasgraph%s".format(registro.idasignacion));
        var barChartData = {
            labels: [],
            datasets: [{
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                data: [],
                yAxisID: "y-axis-1",
            },
            {
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                data: [],
                yAxisID: "y-axis-2",
            }]
        };

        var grafico = new Chart(graphTarget, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: registro.cons_nombre + ' ' + registro.codigo
                },
                legend: {
                    display: false,
                    position: 'top',
                },
                scales: {
                    yAxes: [{
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                        scaleLabel: {
                            display: true,
                            labelString: 'Energia kWh'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                return value.toLocaleString();
                            }
                        }
                    }, {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "right",
                        id: "y-axis-2",
                        scaleLabel: {
                            display: true,
                            labelString: 'Pesos CLP'
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                return value.toLocaleString();
                            }
                        },
                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    }]
                },
                plugins: {
                    labels: false,
                    datalabels: {
                        display: function (context) {
                            return false;
                        },
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            value = parseFloat(tooltipItem.yLabel);
                            value = +(Math.round(value + "e+2") + "e-2");
                            o_value = value.toLocaleString("es");
                            return (value > 0) ? o_value + ((tooltipItem.datasetIndex == 0) ? ' kWh' : ' CLP') : "";
                        },
                    }
                }
            }
        });

        GraficoMontoConsumo(registro.idmedidor, usuarioActivo, hasta, 3, grafico, arguments[4]);
    }

});