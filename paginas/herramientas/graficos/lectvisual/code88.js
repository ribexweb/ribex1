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

$(document).ready(function () {
    $('.select2').select2();

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
        return;
    }

    $(document).on('change', '#SelectEdificio', function (event) {
        if (paginaActiva.code == 88) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            selectJs2(
                "#SelectMedidor",
                {
                    value: "idmedidor",
                    show: {
                        fields: ["codigo", "asig_codigo", "cons_nombre", "espa_nombre"],
                        format: "%s | %s | %s | %s"
                    },
                    hide: ["idmedidorfisico", "idtarifaedificio"],
                    queries: [{
                        fieldsSelect: ["idmedidor", "idmedidorfisico", "codigo", "coalesce(cons_nombre,'virtual') as cons_nombre", "coalesce(espa_nombre,descripcion) as espa_nombre", "asig_codigo", "idtarifaedificio"],
                        tableName: "mediciones.medidores_permisados(%s,%s)".format($("#SelectEdificio").val(), usuarioActivo),
                        orderby: [{
                            field: "idmedidorfisico",
                            type: "asc NULLS first"
                        }],
                        where: [{
                            field: "asig_activo",
                            oper: "=",
                            value: "true",
                            type: "int",
                        }]
                    }],
                },
                {
                }
            );
        }
    });

    $(document).on('click', '#btnNuevo', function (event) {
        if (paginaActiva.code == 88) {
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type, this.id, paginaActiva.code));
            consultarMedidor($("#SelectMedidor").val());
        }
    });

    function consultarMedidor(idmedidor) {
        inicial = '2019-10-20';
        final = '2019-11-20'
        $.ajax({
            url: "php/data.php?consultar_medidor", // Use href attribute as URL
            type: "post",
            beforeSend: function (xhr) {
                $("#energia").html("<i class='fas fa-cog fa-spin'></i> <span>kWh</span>");
                $("#potenciatotal").html("<i class='fas fa-cog  fa-spin'></i> <span>kW</span>");
                $("#voltaje1").html("<i class='fas fa-cog  fa-spin'></i> <span>V</span>");
                $("#voltaje2").html("<i class='fas fa-cog  fa-spin'></i> <span>V</span>");
                $("#voltaje3").html("<i class='fas fa-cog  fa-spin'></i> <span>V</span>");
                $("#corriente1").html("<i class='fas fa-cog  fa-spin'></i> <span>A</span>");
                $("#corriente2").html("<i class='fas fa-cog  fa-spin'></i>  <span>A</span>");
                $("#corriente3").html("<i class='fas fa-cog  fa-spin'></i> <span>A</span>");
                $("#potencia1").html("<i class='fas fa-cog  fa-spin'></i> <span>kW</span>");
                $("#potencia2").html("<i class='fas fa-cog fa-spin'></i> <span>kW</span>");
                $("#potencia3").html("<i class='fas fa-cog  fa-spin'></i> <span>kW</span>");
                $("#fecha").html("<i class='fas fa-cog  fa-spin'></i> ");
                $("#dmaxsum").html("<i class='fas fa-cog  fa-spin'></i> <span>kW</span> ");
                $("#dmaxhp").html("<i class='fas fa-cog  fa-spin'></i> <span>kW</span> ");
                $("#periodo").html("%s | %s".format(inicial, final))
            },
            data: {
                queries: [
                    {   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                        fieldsSelect: ["*"],
                        tableName: "mediciones.ultimos_valores_medidor_servidor(%s)".format(idmedidor),
                        // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),
                        orderby: [
                            {
                                field: 'idvariable',
                                type: 'asc',
                            }
                        ],
                    },
                    {
                        fieldsSelect: ["coalesce(valorvar2,valorvar305,valorvar23) as valor", "coalesce(fechavar2,fechavar305,fechavar23) as fecha"],
                        tableName: "remarcacion.getdemandasmaxperiodo_hp_v2(%s,%s,%s,'%s','%s','%s')".format($("#SelectEdificio").val(), usuarioActivo, $("#SelectMedidor option:selected").attr('data-idtarifaedificio'), inicial, final, database),
                        where: [{
                            field: "idmedidorfisico",
                            oper: "=",
                            value: $("#SelectMedidor option:selected").attr('data-idmedidorfisico'),
                            type: "int"
                        }]
                        // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),                        
                    },
                    {
                        fieldsSelect: ["coalesce(valorvar2,valorvar305,valorvar23) as valor", "coalesce(fechavar2,fechavar305,fechavar23) as fecha"],
                        tableName: "remarcacion.getdemandasmaxperiodo_24h_v2(%s,%s,%s,'%s','%s','%s')".format($("#SelectEdificio").val(), usuarioActivo, $("#SelectMedidor option:selected").attr('data-idtarifaedificio'), '2019-10-20', '2019-11-20', database),
                        where: [{
                            field: "idmedidorfisico",
                            oper: "=",
                            value: $("#SelectMedidor option:selected").attr('data-idmedidorfisico'),
                            type: "int"
                        }]
                        // tableName   :"consultar_medidor_variable(%s,%s,'%s',now()::timestamp)".format(medidor,2,hoy),                        
                    }
                ]
            },
        })
            .then(function (data) {
                console.log(data);
                if (data[0].resultados.length > 0) {
                    valores = data[0].resultados;
                    console.log(valores);
                    $("#energia").html("%s <span>kWh</span>".format(existe(valores, "1")));
                    if (valores.filter(element => (element.idvariable == "2")).length >= 1) {
                        $("#potenciatotal").html("%s <span>kW</span>".format(existe(valores, "2")));
                    }
                    else {
                        if ((($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2599) &&
                            ($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2600) &&
                            ($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2601)) &&
                            ($("#SelectEdificio").val() == 4)) {
                            $("#potenciatotal").html("%s <span>kW</span>".format("<i class='fas fa-times'></i>"));
                        }
                        else {
                            $("#potenciatotal").html("%s <span>kW</span>".format(existe(valores, "305")));
                        }

                    }
                    $("#voltaje1").html("%s <span>V</span>".format(existe(valores, "3")))
                    $("#voltaje2").html("%s <span>V</span>".format(existe(valores, "4")))
                    $("#voltaje3").html("%s <span>V</span>".format(existe(valores, "5")))
                    $("#corriente1").html("%s <span>A</span>".format(existe(valores, "11")))
                    $("#corriente2").html("%s <span>A</span>".format(existe(valores, "12")))
                    $("#corriente3").html("%s <span>A</span>".format(existe(valores, "13")))
                    $("#potencia1").html("%s <span>kW</span>".format(existe(valores, "26")))
                    $("#potencia2").html("%s <span>kW</span>".format(existe(valores, "27")))
                    $("#potencia3").html("%s <span>kW</span>".format(existe(valores, "28")))
                    $("#fecha").html("%s".format(existe(valores, "1", "fecha")))
                    if ((($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2599) &&
                        ($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2600) &&
                        ($("#SelectMedidor option:selected").attr('data-idmedidorfisico') != 2601)) &&
                        ($("#SelectEdificio").val() == 4)) {
                        $("#dmaxhp").html("%s <span>kW</span>".format("<i class='fas fa-times'></i>"))
                        $("#dmaxsum").html("%s <span>kW</span>".format("<i class='fas fa-times'></i>"))
                    }
                    else {
                        $("#dmaxhp").html("%s <span>kW %s</span>".format(data[1].resultados[0].valor, (data[1].resultados[0].fecha != null) ? "(" + data[1].resultados[0].fecha + ")" : ""))
                        $("#dmaxsum").html("%s <span>kW %s</span>".format(data[2].resultados[0].valor, (data[2].resultados[0].fecha != null) ? "(" + data[2].resultados[0].fecha + ")" : ""))

                    }
                }

            })
            .done(function (xhr) {
            });
    }

    function existe(valores, variable, campo = "valor") {
        element = valores.filter(element => (element.idvariable == variable));
        if (campo == "valor") {
            return (element.length >= 1) ? formatear_valor(parseFloat(element[0][campo]).toFixed(2), 'float8', true).value : "<i class='fas fa-times'></i>";
        }
        else {
            console.log(element[0][campo]);
            return (element.length >= 1) ? element[0][campo] : "<i class='fas fa-bas'></i>"
        }
    }





});