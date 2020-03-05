

xhrPool.abortAll = function () { // our abort function
  $(this).each(function (idx, jqXHR) {
    jqXHR.abort();
  });
  xhrPool.length = 0
};

timers.abortAll = function () {
  $(this).each(function (idx, timer) {
    clearTimeout(timer);
  });
  timers.length = 0;
};

function contar_relaciones() {
  var argumentos = arguments;
  var idvalue = argumentos[0].idvalue;
  var primaryfield = argumentos[0].primaryfield;
  var tablename = argumentos[0].tablename;
  $.ajax({
    url: "php/data.php",
    method: "POST",
    data: {
      queries: [{
        fieldsSelect: ["tablename", "descripcion", "sum(registros) as registros", "avg(nivel) as nivel"],
        tableName: "contar_registros_antes_borrar('%s',%s,'%s','',1)".format(primaryfield, idvalue, tablename),
        groupby: ["tablename", "descripcion"],
        orderby: [{
          field: "nivel",
          type: "asc"
        }],
      }]
    },
    dataType: 'json',
    success: function (data) {
      for (var ResIndex in data[0].resultados) {

      }
    }
  });

}

function debug(elements) {



  /*if (type == 'tabla'){
    console.table(msj);
  }  
  else {  
    console.log(moment().format("YYYY/MM/DD HH:mm:ss")+':'+JSON.stringify(msj));
  }*/
}

String.prototype.format = function () {
  var a = this, b;
  for (b in arguments) {
    a = a.replace(/%[a-z]/, arguments[b]);
  }
  return a; // Make chainable
};

function filtrar(a, property) {
  var arr = [];
  for (var i = 0; i < a.length; i++) {
    if (arr.filter(e => e[property] === a[i][property]).length == 0) {
      arr.push(a[i]);
    }
  }
  return arr;
}

String.prototype.format_array = function () {
  var a = this;
  for (var index in arguments[0]) {
    a = a.replace(/%[a-z]/, arguments[0][index]);
  }
  return a;
};

function findObjectByKeyIndex(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return i;
    }
  }
  return -1;
}
function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

function graphResetZoom(graph) {
  graph.resetZoom();
}

function setXScale(fechaInicial, fechaFinal) {
  var scale = "";
  if (fechaFinal.diff(fechaInicial, 'years') > 0) {
    scale = {
      medida: 'month',
      formato: 'YYYY/MM/DD'
    };
  }
  else if (fechaFinal.diff(fechaInicial, 'months') > 0) {
    scale = {
      medida: 'week',
      formato: 'MM/DD HH:mm'
    };
  }
  else if (fechaFinal.diff(fechaInicial, 'weeks') > 0) {
    scale = {
      medida: 'day',
      formato: 'DD HH:mm'
    };
  }
  else if (fechaFinal.diff(fechaInicial, 'days') > 2) {
    scale = {
      medida: 'day',
      formato: 'HH:mm'
    };
  }
  else {
    scale = {
      medida: 'hour',
      formato: 'HH'
    };
  }
  return scale;
}

function graphDelete(graph) {
  graph.data.datasets.length = 0;
  graph.options.title.text = '';
  $("#textMaximo").val('');
  $("#textMinimo").val('');
  $("#textDiff").val('');
  graph.update();
}

var getColorForPercentage = function (pct) {

  var color = {
    r: Math.floor(130 - (1.3 * pct)),
    g: Math.floor(130 + (1.25 * pct)),
    b: Math.floor(130 - (1.3 * pct))
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?=()&%$#;:-';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randonColor() {
  return '#' + (function lol(m, s, c) { return s[m.floor(m.random() * s.length)] + (c && lol(m, s, c - 1)); })(Math, '0123456789ABCDEF', 4);
}

function graphAdd(containerGraph, graph) {
  $(containerGraph).html('').append("<canvas id='%s'></canvas>".format(graph));
}

Number.prototype.numberFormat = function (decimals, dec_point, thousands_sep) {
  dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
  thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

  var parts = this.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

  return parts.join(dec_point);
}

function formatear_valor(dato, type, aString, decimal = 2) {
  var align = "";
  var value = 0;
  switch (type) {
    case "float8":
      align = "right";
      value = parseFloat(dato);
      value = +(Math.round(value + "e+2") + "e-2");
      if (aString)
        //value = parseFloat(Math.round(value * 100) / 100).toFixed(2).numberFormat(2, ',', '.');
        value = value.numberFormat(decimal, ',', '.');
      break;
    case "int4":
      align = "right";
      value = dato;
      break;
    default:
      align = "left";
      value = dato;
  }
  return {
    align: align,
    value: value
  }
}

var colores_ribex = [];
colores_ribex.push("#D63535");
colores_ribex.push("#00AD8B");
colores_ribex.push("#F0CC01");
colores_ribex.push("#da5f0d");
colores_ribex.push("#005990");
colores_ribex.push("#97EA60");
colores_ribex.push("#044D60");
colores_ribex.push("#edc951");
colores_ribex.push("#eb6841");
colores_ribex.push("#cc2a36");
colores_ribex.push("#4f372d");
colores_ribex.push("#00a0b0");
colores_ribex.push("#BE2280");
colores_ribex.push("#89FF57");
colores_ribex.push("#9A47FF");
colores_ribex.push("#682CD0");
colores_ribex.push("#D6B600");
colores_ribex.push("#8F1500");


/*for (var i = 1;i<=100-colores_ribex.length;i++){
    colores_ribex.push(randomColor());
}*/


function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}


function cargar_info_medidor(zone, variables, debug = false) {
  //console.log(zone.attr("data-nbmembre"));
  var page = (!(debug)) ? "includes/getData.php" : "includes/getDatadebug.php";

  $.ajax({
    type: 'GET',
    url: page,
    data: {
      p_fieldSelect: ["*"],
      p_tabla: "ultimos_valores_medidor(now()::timestamp without time zone,%s,'%s')".format(zone.attr("data-nbmembre"), variables),
      p_fieldOrder: ["idvariable asc"],
      p_whereField: [""],
      p_whereOper: [""],
      p_whereValue: [""],
      p_valueType: [""],
      p_whereLogi: [""]
    },
    success: function (data) {
      //console.log(data);
      if (data.resultados.length > 0) {
        varStr = "";
        for (var resIndex in data.resultados) {
          if (resIndex % 2) {
            varStr += "<td style='font-weight:bold'>%s</td><td>%s %s</td></tr>".format(data.resultados[resIndex].nombrevar, data.resultados[resIndex].valor, data.resultados[resIndex].medida);
          }
          else {
            varStr += "<tr><td style='font-weight:bold'>%s</td><td>%s %s</td>".format(data.resultados[resIndex].nombrevar, data.resultados[resIndex].valor, data.resultados[resIndex].medida);
          }
        }

        str = "<table style='border:1px solid #fff; font-size:9pt;width:100%;color:#000;'>" +
          "<thead style='background-color:#da5b20;font-weight:bold;'>" +
          "<td colspan=4>" + zone.attr("data-title") + "</td>" +
          "</thead>" +
          "<tbody>" + varStr +
          "</tbody>" +
          "</table>";
      }
      else {
        str = "Cargando data del Servidor...";
      }

    },
    async: false
  });

  return str;
}

function cargar_variables_formateadas(cargando, dataVariables, edificio, variables, debug = false) {
  //console.log(cargando);
  cargando.activo = true;
  $("#cargando").html("cargando data, espere un momento por favor...");
  var page = (!(debug)) ? "includes/getData.php" : "includes/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: ["*"],
    p_tabla: "ultimos_valores(now()::timestamp without time zone,%s,'%s')".format(edificio, variables),
    p_fieldOrder: ["idmedidor asc", "idvariable asc"],
    p_whereField: ["fecha"],
    p_whereOper: ["<>"],
    p_whereValue: ["2000-01-01 00:00:00"],
    p_valueType: ["str"],
    p_whereLogi: [""]
  },
    function (data) {
      $("#cargando").html("data cargada...");
      cargando.activo = false;
      dataVariables.length = 0;
      var medidorActual = "";
      var medidor = {
        nombre: "",
        data: []
      }
      for (var dataIndex in data.resultados) {
        idvariable = data.resultados[dataIndex].idvariable;
        nombre = data.resultados[dataIndex].nombrevar;
        medida = data.resultados[dataIndex].medida;
        valor = data.resultados[dataIndex].valor;
        fecha = data.resultados[dataIndex].fecha;

        if (medidorActual != data.resultados[dataIndex].codigo) {
          medidorActual = data.resultados[dataIndex].codigo;
          idmedidor = data.resultados[dataIndex].idmedidor;
          //medidor.nombre = medidorActual;
          medidor = { idmedidor: idmedidor, nombre: medidorActual, data: [] };
          dataVariables.push(medidor);
        }
        dataVariables[dataVariables.length - 1].data.push({ idvariable: idvariable, nombre: nombre, medida: medida, valor: valor, fecha: fecha });


      }

    }
  );
}

function query() {
  var datos = null;
  //console.log(arguments);
  var page = (arguments[0].debug !== undefined) ? ((arguments[0].debug) ? "includes/getData2debug.php" : "includes/getData2.php") : "includes/get2Data.php";
  var consultas = (arguments[0].query !== undefined) ? (arguments[0].query) : [];
  $.ajax({
    url: page, // Use href attribute as URL
    data: {
      queries: consultas
    },
  })
    .then(function (data) {

    });
}

function selectJs2(idSelect, field) {
  var argumentos = arguments;
  var Selected = (argumentos[1].Selected !== undefined) ? (argumentos[1].Selected) : -1;
  var Nulo = (argumentos[1].Nulo !== undefined) ? (argumentos[1].Nulo) : [];
  var fieldShow = (argumentos[1].show.fields !== undefined) ? (argumentos[1].show.fields) : [];
  var fieldHide = (argumentos[1].hide !== undefined) ? (argumentos[1].hide) : [];
  var fieldValue = (argumentos[1].value !== undefined) ? (argumentos[1].value) : "";
  var consultas = (argumentos[1].queries !== undefined) ? (argumentos[1].queries) : [];
  //if (argumentos.length > 2) {
  var msjLoad = ((argumentos[2] !== undefined) && (argumentos[2].msjLoad !== undefined)) ? (argumentos[2].msjLoad) : "Cargando Data...";
  var msjNoData = ((argumentos[2] !== undefined) && (argumentos[2].msjNoData !== undefined)) ? (argumentos[2].msjNoData) : "No hay Datos...";
  var startDisabled = ((argumentos[2] !== undefined) && (argumentos[2].startDisabled !== undefined)) ? (argumentos[2].startDisabled) : false;
  var page = ((argumentos[2] !== undefined) && (argumentos[2].debug !== undefined)) ? ((argumentos[2].debug) ? "php/data.php" : "php/data.php") : "php/data.php";
  var vdebug = ((argumentos[2] !== undefined) && (argumentos[2].debug !== undefined)) ? argumentos[2].debug : false;
  //}
  callbackFunction = argumentos[3];
  if (vdebug) console.log('table', argumentos);
  $(idSelect).find('option').remove().end();
  $(idSelect).attr("disabled", startDisabled);
  $(idSelect).append('<option value="-1">%s</option>'.format(msjLoad));
  $.ajax({
    url: page + "?cbox=" + idSelect.substring(1, idSelect.length),
    type: 'POST',
    data: {
      queries: consultas,
    }
  })
    .then(function (data) {
      if (vdebug) debug(data);
      $(idSelect).find('option').remove().end();
      var options = "";
      for (var dataIndex in Nulo) {
        console.log
        options += '<option value="%s">%s</option>'.format(Nulo[dataIndex].value, Nulo[dataIndex].text);
      }
      if (data[0].resultados.length > 0) {
        for (var dataIndex in data[0].resultados) {
          var valueShowArray = [];
          var defaultFormatStr = "";
          for (var fieldShowIndex in fieldShow) {
            valueShowArray.push(data[0].resultados[dataIndex][fieldShow[fieldShowIndex]]);
            defaultFormatStr += "%s ";
          }
          var fieldFormatStr = (argumentos[1].show.format !== undefined) ? (argumentos[1].show.format) : defaultFormatStr;
          var fieldStr = fieldFormatStr.format_array(valueShowArray);
          var hideStr = "";
          for (var fieldHideIndex in fieldHide) {
            if (fieldHide[fieldHideIndex] != "") {
              hideStr += "data-%s='%s' ".format(fieldHide[fieldHideIndex], data[0].resultados[dataIndex][fieldHide[fieldHideIndex]]);
            }
          }
          var selectedStr = (Selected == data[0].resultados[dataIndex][fieldValue]) ? "selected" : "";
          options += '<option value="%s" %s %s>%s</option>\n'.format(data[0].resultados[dataIndex][fieldValue], hideStr, selectedStr, fieldStr);
        }
        $(idSelect).html(options);
        $(idSelect).change();
        $(idSelect).attr('disabled', false);
        if (callbackFunction !== undefined) {
          callbackFunction();
        }

      }
      else {
        if (Nulo.length > 0) {
          $(idSelect).html(options);
          $(idSelect).change();
          $(idSelect).attr('disabled', false);
        }
        else {
          $(idSelect).html('<option value="-1">%s</option>'.format(msjNoData));
        }
      }
    });
}


function download2(shouldDownload, funcStr) {
  //var funcStr = window.location.hash.replace(/#/g, '') || 'basic';
  var doc = boletas[funcStr](arguments[2], arguments[3], arguments[4]);
  if (arguments[2].length == 1) {
    doc.setProperties({
      title: 'Boleta N°: ' + arguments[2][0].boleta.numero,
    });
    doc.save('boleta%s.pdf'.format(arguments[2][0].boleta.numero));
  }
  else {
    doc.setProperties({
      title: 'Boletas Varias',
    });
    doc.save('boletas.pdf');
  }
}

function downloadAgrupada(datos) {
  //var funcStr = window.location.hash.replace(/#/g, '') || 'basic';
  var doc = boletas['agrupada'](datos);
  if (datos[2].resultados.length == 1) {
    doc.setProperties({
      title: 'Boletas Agrupadas Remarcacion %s, Consumidor %s'.format(datos[1].resultados[0].idremarcacion,datos[2].resultados[0].idconsumidor) 
    });
    doc.save('boletas-%s-%s.pdf'.format(datos[1].resultados[0].idremarcacion,datos[2].resultados[0].idconsumidor));
  }
  else {
    doc.setProperties({
      title: 'Boletas Varias',
    });
    doc.save('boletas.pdf');
  }
}

function descargar(url, ano, mes, idasignacion, grupo) {
  var a = document.createElement('A');
  a.href = url;
  a.download = (grupo != "0") ? "boleta_%s-%s-%s-%s.jpg".format(idasignacion, mes, ano, grupo) : "boleta_%s-%s-%s.jpg".format(idasignacion, mes, ano)
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function descargar2(url, adjunto) {
  var a = document.createElement('A');
  a.href = url;
  a.download = adjunto;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function generar_boleta_array(id, button, tipo, idedificio, showCargos) {
  var datos = [];
  $(button).attr('disabled', true);
  $("i", button).attr('class', 'fas fa-sync fa-spin');
  strId = id.join(",");
  $.ajax({
    url: "php/data.php",
    type: "POST",
    data: {
      queries: [{
        fieldsSelect: ["vmedidores.idedificio", "vmedidores.edif_nombre", "vmedidores.edif_direccion", "vmedidores.codigo",
          "vmedidores.idasignacion", "vmedidores.cons_rut", "case when (vmedidores.asig_codigo is null) or (vmedidores.asig_codigo = '') then vmedidores.cons_nombre else vmedidores.asig_codigo end as cons_nombre",
          "coalesce(vmedidores.cons_direccion,'') as cons_direccion", "vmedidores.espa_nombre", "vmedidores.tari_nombre",
          "energialecturafinal", "energialecturainicial", "energiafechainicial", "energiafechafinal",
          "remarcaciones.fecha::date", "precios.desde::date", "(precios.hasta - interval '1 second')::date as hasta",
          "coalesce(consumidores.rut,'') as edif_rut", "remarcaciones_asignaciones.idremarcacionasignacion",
          "vmedidores.idmedidor", "vmedidores.idmedidorfisico", "remarcaciones.ivacargos"],
        tableName: "remarcacion.remarcaciones_asignaciones left join " +
          "mediciones.vmedidores using (idasignacion) left join " +
          "remarcacion.remarcaciones using (idremarcacion) left join " +
          "remarcacion.precios using (idprecio) left join " +
          "mediciones.consumidores on vmedidores.edif_identidad=consumidores.identidad",
        orderby: [{ field: "remarcaciones_asignaciones.idremarcacionasignacion", type: "asc" }],
        where: [{
          field: "idremarcacionasignacion",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        }],
      },
      {
        fieldsSelect: ["*"],
        tableName: "remarcacion.vvaloresleidos",
        orderby: [{ field: "idremarcacionasignacion", type: "asc" }, { field: "idcargo", type: "asc" }],
        where: [{
          field: "idremarcacionasignacion",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        }],
      },
      {
        fieldsSelect: ["idremarcacionasignacion", "idcargo", "nombre", "monto", "facturado", "unid_codigo"],
        tableName: "remarcacion.vvaloresfacturados",
        orderby: [{ field: "idcargo", type: "asc" }],
        where: [{
          field: "idremarcacionasignacion",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        },
        {
          logical: "AND",
          field: "monto",
          oper: "<>",
          value: 0,
          type: "int"
        }],
      },
      {
        fieldSelect: ["*"],
        tableName: "remarcacion.ultimosconsumosboleta(array[%s],6,'15MIN')".format(strId),
        orderby: [{ field: "idremarcacionasignacion", type: "asc" }, { field: "ano", type: "asc" }, { field: "mes", type: "asc" }],
      },
      {
        fieldSelect: ["*"],
        tableName: "configuraciones.vvalores",
        orderby: [{ field: "idvalor", type: "asc" }],
        where: [{ field: "idedificio", oper: "=", value: idedificio, type: "int" },
        { logical: "and", field: "idcategoria", oper: "in", value: "(1,2)", type: "int" },
        { logical: "and", field: "conf_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "cate_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "prop_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "valo_activo", oper: "=", value: true, type: "int" },
        ]
      }
      ]
    },
    success: function (data) {
      data[0].resultados.map(function (value, index) {
        datos.push({
          edificio: {
            idedificio: value.idedificio,
            nombre: value.edif_nombre,
            direccion: value.edif_direccion,
            rut: value.edif_rut,
            ivaCargos: value.ivacargos
          },
          boleta: {
            numero: parseInt(value.idremarcacionasignacion),
            fecha: value.fecha,
            desde: value.desde,
            hasta: value.hasta,
            cliente: {
              idasignacion: value.idasignacion,
              rut: value.cons_rut,
              nombre: value.cons_nombre,
              direccion: value.cons_direccion,
              espacio: value.espa_nombre,
              tarifa: value.tari_nombre,
              codigo: value.codigo,
              idmedidor: value.idmedidor,
              idmedidorfisico: value.idmedidorfisico
            },
            lecturas: [],
            facturados: [],
            anteriores: [],
            total: 0
          }
        });
        datos[datos.length - 1].boleta.lecturas.push({ col2: "Lectura Inicial (kWh):", col3: formatear_valor(value.energialecturainicial, 'float8', true).value, col4: "", col5: "" });
        datos[datos.length - 1].boleta.lecturas.push({ col2: "Lectura Final (kWh):", col3: formatear_valor(value.energialecturafinal, 'float8', true).value, col4: "", col5: "" });
        datos[datos.length - 1].boleta.lecturas.push({ col2: "Consumo (kWh):", col3: formatear_valor((value.energialecturafinal - value.energialecturainicial), 'float8', true).value, col4: "", col5: "" });

        leidas = data[1].resultados.filter(registro => (registro.idcargo != 4) && (registro.idremarcacionasignacion == value.idremarcacionasignacion));
        cont = 0;
        leidas.map(function (value_leida, index_leida) {
          datos[datos.length - 1].boleta.lecturas[cont]["col4"] = "%s leida (%s):".format(value_leida.nombre, value_leida.unid_codigo);
          datos[datos.length - 1].boleta.lecturas[cont++]["col5"] = formatear_valor(value_leida.valor, 'float8', true).value;
          if (cont >= datos[datos.length - 1].boleta.lecturas.length) {
            datos[datos.length - 1].boleta.lecturas.push({ col2: "", col3: "", col4: "", col5: "" });
          }
          facturada = data[2].resultados.filter(registro => ((registro.idcargo == value_leida.idcargo) && (registro.idremarcacionasignacion == value_leida.idremarcacionasignacion)));
          if (facturada.length > 0) {
            datos[datos.length - 1].boleta.lecturas[cont]["col4"] = "%s facturada (%s):".format(facturada[0].nombre, facturada[0].unid_codigo);
            datos[datos.length - 1].boleta.lecturas[cont++]["col5"] = formatear_valor(facturada[0].facturado, 'float8', true).value;
          }
        });
      });



      var actualRA = "";
      var contador = 0;



      /*  data[1].resultados.map(function(value,index){
          if (value.idcargo != 4) {
            if (actualRA != value.idremarcacionasignacion) {
              actualRA = value.idremarcacionasignacion;
              contador = 1;
            }
            var reg = datos.filter(registro => registro.boleta.numero == value.idremarcacionasignacion);
            if (value.valorisleida == "t"){ 
              if (contador <= reg[0].boleta.lecturas.length) {
                reg[0].boleta.lecturas[contador-1].col4 = value.nombre+" leida:";
                reg[0].boleta.lecturas[contador-1].col5 = formatear_valor(value.valor,'float8',true).value;
              }
              else {
                reg[0].boleta.lecturas.push({col2:"",col3:"",col4:value.nombre+" leida:",col5:formatear_valor(value.valor,'float8',true).value});
              }
              contador++;
              /*if (value.fecha != null) {
                if (contador <= reg[0].boleta.lecturas.length) {
                  reg[0].boleta.lecturas[contador-1].col4 = "Fecha "+value.nombre+" leida:";
                  reg[0].boleta.lecturas[contador-1].col5 = value.fecha;              
                }
                else{
                  reg[0].boleta.lecturas.push({col2:"",col3:"",col4:"Fecha "+value.nombre+" leida:",col5:value.fecha});
                }
                contador++;
              }  
            }
            else{
              if (contador <= reg[0].boleta.lecturas.length) {
                reg[0].boleta.lecturas[contador-1].col4 = value.nombre+" facturada:";
                reg[0].boleta.lecturas[contador-1].col5 = formatear_valor(value.valor,'float8',true).value;
              }
              else {
                reg[0].boleta.lecturas.push({col2:"",col3:"",col4:value.nombre+" facturada:",col5:formatear_valor(value.valor,'float8',true).value});
              }  
              contador ++;
            }  
          }
        }); */


      data[2].resultados.map(function (value, index) {
        var registro = datos.filter(registro => registro.boleta.numero == value.idremarcacionasignacion);
        registro[0].boleta.facturados.push({
          "nombre": value.nombre,
          //"monto" : formatear_valor(value.monto,'float8',true,0).value,
          "monto": value.monto
        });
        registro[0].boleta.total += parseFloat(value.monto);
      });

      data[3].resultados.map(function (value, index) {
        var registro = datos.filter(registro => registro.boleta.numero == value.idremarcacionasignacion);
        registro[0].boleta.anteriores.push({
          "nombremes": value.nombremes,
          "consumo": value.consumo
        });
      });
      download2(true, tipo, datos, data[4].resultados, showCargos);
      $("i", button).attr('class', 'fa fa-download');
      $(button).attr('disabled', false);
    }
  });
}

function generar_boleta_consumidor(idconsumidor, button, tipo, idedificio, idremarcacion, showCargos) {
  var datos = [];
  $(button).attr('disabled', true);
  $("i", button).attr('class', 'fas fa-sync fa-spin');
  strId = idconsumidor.join(",");
  $.ajax({
    url: "php/data.php",
    type: "POST",
    data: {
      queries: [{
        fieldsSelect: ["*"],
        tableName: "mediciones.vedificios left join mediciones.vconsumidores using (identidad)",
        where: [{
          field: "vedificios.idedificio",
          oper: "=",
          value: idedificio,
          type: "int"
        }]
      },
      {
        fieldsSelect: ["idremarcacion","desde::date","hasta::date","fecha::date","ivacargos"],
        tableName: "remarcacion.vremarcaciones",
        where: [{
          field: "idremarcacion",
          oper: "=",
          value: idremarcacion,
          type: "int"
        }]
      },
      {
        fieldsSelect: ["idconsumidor","nombre","coalesce(direccion,'') as direccion","rut"],
        tableName: "mediciones.vconsumidores",
        where: [{
          field: "idconsumidor",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        }]
      },
      {
        fieldsSelect: ["idremarcacionasignacion","codigo","energialecturainicial","energialecturafinal","espa_nombre","constante"],
        tableName: "remarcacion.vremarcacionesasignaciones",
        orderby:[{field:"idremarcacionasignacion",type:"asc"}],
        where: [{
          field: "idconsumidor",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        },
        {
          logical: "and",
          field: "idremarcacion",
          oper: "=",
          value: idremarcacion,
          type: "int"
        }]
      },
      {
        fieldsSelect: ["*"],
        tableName: "remarcacion.vvaloresleidos",
        orderby: [{ field: "idremarcacionasignacion", type: "asc" }, { field: "idcargo", type: "asc" }],
        where: [{
          field: "idconsumidor",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        },
        {
          logical: "and",
          field: "idremarcacion",
          oper: "=",
          value: idremarcacion,
          type: "int"
        }]
      },
      {
        fieldsSelect: ["idconsumidor", "idcargo", "nombre", "unid_codigo","sum(monto) as monto", "sum(facturado) as facturado"],
        tableName: "remarcacion.vvaloresfacturados",
        orderby: [{ field: "idcargo", type: "asc" }],
        groupby:["idconsumidor","idcargo", "nombre", "unid_codigo"],
        where: [{
          field: "idconsumidor",
          oper: "in",
          value: "(%s)".format(strId),
          type: "int"
        },
        {
          logical: "and",
          field: "idremarcacion",
          oper: "=",
          value: idremarcacion,
          type: "int"
        },
        {
          logical: "AND",
          field: "monto",
          oper: "<>",
          value: 0,
          type: "int"
        }]
      },
      {
        fieldSelect: ["*"],
        tableName: "configuraciones.vvalores",
        orderby: [{ field: "idvalor", type: "asc" }],
        where: [{ field: "idedificio", oper: "=", value: idedificio, type: "int" },
        { logical: "and", field: "idcategoria", oper: "in", value: "(1,2,3)", type: "int" },
        { logical: "and", field: "conf_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "cate_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "prop_activo", oper: "=", value: true, type: "int" },
        { logical: "and", field: "valo_activo", oper: "=", value: true, type: "int" },
        ]
      }
      ]
    },
    success: function (data) {
      data[3].totales = {potencia:0,diff:0,energiainicial:0,energiafinal:0,consumo:0};
      data[3].resultados = data[3].resultados.map(function(item,index){
        readPot = data[4].resultados.filter(dato => ((dato.idremarcacionasignacion==item.idremarcacionasignacion)&&(dato.idcargo==12)));
        readEne = data[4].resultados.filter(dato => ((dato.idremarcacionasignacion==item.idremarcacionasignacion)&&(dato.idcargo==4)));
        let potencia = (readPot.length > 0)?parseFloat(readPot[0].valor):0;
        //let diff = item.energialecturafinal-item.energialecturainicial;
        let diff =(readEne.length > 0)?parseFloat(readEne[0].valor):0;
        let consumo = diff*item.constante;
        data[3].totales.potencia += potencia;
        data[3].totales.diff += diff;
        data[3].totales.energiainicial += item.energialecturainicial;
        data[3].totales.energiafinal += item.energialecturafinal;
        data[3].totales.consumo += consumo;
        return [
            item.idremarcacionasignacion,'',
            item.codigo,'',
            formatear_valor(potencia,'float8',true,2).value,'',
            item.espa_nombre,'',
            formatear_valor(item.energialecturainicial,'float8',true,2).value,'',
            formatear_valor(item.energialecturafinal,'float8',true,2).value,'',
            formatear_valor(diff,'float8',true,2).value,'',
            item.constante,'',
            formatear_valor(consumo,'float8',true,2).value,'',
          ];
      });

      data[5].totales = {monto:0};
      data[5].resultados = data[5].resultados.map(function(item,index){
        data[5].totales.monto += parseFloat(item.monto);
        return [item.nombre,'',
        (item.facturado>0)?formatear_valor((item.monto/item.facturado),'float8',true,3).value:0,'',
        formatear_valor(item.facturado,'float8',true,2).value,'',
        formatear_valor(item.monto,'float8',true,0).value];
      });
      console.log(data[3]);
      downloadAgrupada(data);

    }
  });
}

function generar_boleta(id) {
  $.ajax({
    url: "php/data.php",
    type: "POST",
    data: {
      queries: [{
        fieldsSelect: ["vmedidores.idedificio", "vmedidores.edif_nombre", "vmedidores.edif_direccion",
          "vmedidores.idasignacion", "vmedidores.cons_rut", "vmedidores.cons_nombre",
          "coalesce(vmedidores.cons_direccion,'') as cons_direccion", "vmedidores.espa_nombre", "vmedidores.tari_nombre",
          "energialecturafinal", "energialecturainicial", "energiafechainicial", "energiafechafinal",
          "remarcaciones.fecha::date", "precios.desde::date", "precios.hasta::date",
          "coalesce(consumidores.rut,'') as edif_rut"],
        tableName: "remarcacion.remarcaciones_asignaciones left join " +
          "mediciones.vmedidores using (idasignacion) left join " +
          "remarcacion.remarcaciones using (idremarcacion) left join " +
          "remarcacion.precios using (idprecio) left join " +
          "mediciones.consumidores on vmedidores.edif_identidad=consumidores.identidad",
        where: [{
          field: "idremarcacionasignacion",
          oper: "=",
          value: id,
          type: "int"
        }],
      }]
    },
    success: function (data) {
      $.ajax({
        url: "php/data.php",
        type: "POST",
        data: {
          queries: [{
            fieldsSelect: ["*"],
            tableName: "remarcacion.vvaloresleidos",
            where: [{
              field: "idremarcacionasignacion",
              oper: "=",
              value: id,
              type: "int"
            }],
          },
          {
            fieldsSelect: ["nombre", "monto"],
            tableName: "remarcacion.vvaloresfacturados",
            where: [{
              field: "idremarcacionasignacion",
              oper: "=",
              value: id,
              type: "int"
            }],
          }]
        },
        success: function (data2) {
          var datos = {};
          datos.edificio = {
            idedificio: data[0].resultados[0].idedificio,
            nombre: data[0].resultados[0].edif_nombre,
            direccion: data[0].resultados[0].edif_direccion,
            rut: data[0].resultados[0].edif_rut
          };
          datos.boleta = {
            numero: id,
            fecha: data[0].resultados[0].fecha,
            desde: data[0].resultados[0].desde,
            hasta: data[0].resultados[0].hasta,
            cliente: {
              idasignacion: data[0].resultados[0].idasignacion,
              rut: data[0].resultados[0].cons_rut,
              nombre: data[0].resultados[0].cons_nombre,
              direccion: data[0].resultados[0].cons_direccion,
              espacio: data[0].resultados[0].espa_nombre,
              tarifa: data[0].resultados[0].tari_nombre,
            },
          }
          datos.boleta.lecturas = [];
          datos.boleta.lecturas.push({ col2: "Lectura Inicial (kWh):", col3: formatear_valor(data[0].resultados[0].energialecturainicial, 'float8', true).value, col4: "Lectura Final (kWh):", col5: formatear_valor(data[0].resultados[0].energialecturafinal, 'float8', true).value });
          datos.boleta.lecturas.push({ col2: "Fecha Lectura Inicial:", col3: data[0].resultados[0].energiafechainicial, col4: "Fecha Lectura Final:", col5: data[0].resultados[0].energiafechafinal });
          datos.boleta.lecturas.push({ col2: "Consumo (kWh):", col3: formatear_valor((data[0].resultados[0].energialecturafinal - data[0].resultados[0].energialecturainicial), 'float8', true).value, col4: "Periodo:", col5: "%s al %s".format(data[0].resultados[0].desde, data[0].resultados[0].hasta) });

          data2[0].resultados.forEach(function (value, index) {
            console.log('siiii');
            if (index > 0) {
              datos.boleta.lecturas.push({ col2: value.nombre + " leida:", col3: formatear_valor(value.leido, 'float8', true).value, col4: "Fecha " + value.nombre + ":", col5: value.fecha });
            }
          });


          datos.boleta.facturados = [];
          datos.boleta.total = 0;
          data2[1].resultados.forEach(function (value, index) {
            console.log(value);

            datos.boleta.facturados.push({
              "nombre": value.nombre,
              "monto": formatear_valor(value.monto, 'float8', true, 0).value,
            });
            datos.boleta.total += parseFloat(value.monto);
          });
          console.log(data2[0]);

          // download2(true,"invoice",datos);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          error2({
            msg: errorThrown
          });
        },
      });
      //update(true,"invoice",datos);                    
    },
    error: function (jqXHR, textStatus, errorThrown) {
      error2({
        msg: errorThrown
      });
    },
  });
}


/*selectJs2("#prueba",
          { 
            value: "idmedidor",
            show: {
                    fields:["codigo","nombre"],
                    format:"%s %s"
                  },
            hide: ["codigo"],
            queries:[{
                      fieldsSelect:["medidores.idmedidor","medidores.codigo","entidades.nombre","medidores.codigo"],
                      tableName   :"((medidores left join asignaciones on medidores.idmedidor=asignaciones.idmedidor) left join oficinas on asignaciones.idoficina=oficinas.idoficina) "+
                                "   left join entidades on oficinas.identidad=entidades.identidad",
                    }],
          },
          {          
            msjLoad:"me da la gana",
            msjNoData:"No hay data uhhhhh...",
            debug:false
          });*/


function selectJs(idSelect,
  fieldSelect,
  tabla,
  fieldOrder,
  fieldShow,
  fieldFormatShow,
  fieldValue,
  fieldHide,
  whereField,
  whereOper,
  whereValue,
  valueType,
  whereLogi,
  debug = false) {
  $(idSelect).find('option').remove().end();
  $(idSelect).prop("disabled", true);
  $(idSelect).append('<option value="-1">Cargando data...</option>');
  var page = (!(debug)) ? "includes/getData.php" : "includes/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: fieldSelect,
    p_tabla: tabla,
    p_fieldOrder: fieldOrder,
    p_whereField: whereField,
    p_whereOper: whereOper,
    p_whereValue: whereValue,
    p_valueType: valueType,
    p_whereLogi: whereLogi
  },
    function (data) {
      //console.log(data);
      $(idSelect).find('option').remove().end();
      //$(idSelect).find('option').remove().end().prop('disabled','disabled');
      if (data.resultados.length > 0) {
        var options = "";
        for (var dataIndex in data.resultados) {

          var valueShowArray = [];
          for (var fieldShowIndex in fieldShow) {
            valueShowArray.push(data.resultados[dataIndex][fieldShow[fieldShowIndex]]);
            /*if (fieldShowIndex != fieldShow.length-1){
              value += data.resultados[dataIndex][fieldShow[fieldShowIndex]] + fieldSep[fieldShowIndex];
            }
            else {
              value += data.resultados[dataIndex][fieldShow[fieldShowIndex]];	
            }*/
          }

          var valueStr = fieldFormatShow.format_array(valueShowArray);

          var hideStr = "";

          for (var fieldHideIndex in fieldHide) {
            if (fieldHide[fieldHideIndex] != "") {
              hideStr += "data-%s='%s' ".format(fieldHide[fieldHideIndex], data.resultados[dataIndex][fieldHide[fieldHideIndex]]);
            }
          }

          //console.log(hideData);

          options += '<option value="%s" %s>%s</option>'.format(data.resultados[dataIndex][fieldValue], hideStr, valueStr);
        }
        $(idSelect).html(options);
        $(idSelect).change();
        $(idSelect).prop('disabled', false);
      }
      else {
        $(idSelect).html('<option value="-1">No hay Data...</option>');
      }
    }
  );
}

function JsFileName(scriptname, codigo) {
  return scriptname.match(/.*\//) + 'code%s.js'.format(codigo);
}



function load(code, link) {
  if ((code != paginaActiva.code) || (link == 0)) {
    stopTimers();
    xhrPool.abortAll();
    var bench = 19000 + new Date().getTime();
    /* clearInterval(timerGlobal);
     timerGlobal  = setInterval(
                function(){ 
                  checkTime(bench); 
                }
                , 1000
              );
 */

    paginaActiva.code = code;

    $.ajax({
      url: 'php/ruta.php',
      method: "POST",
      data: {
        idchild: code,
      },
    })
      .then(function (data) {
        var paginaSesion = getSesion("paginaActiva");
        if ((paginaSesion != $.trim(data)) || (link == 0)) {
          writeSesion("idpaginaActiva", code);
          loadpage("#content-wrapper", 1, data);
        }
        else {
          //console.log("Pagina ya activa");
        }
      })
      .fail(function (data) {
      });


    // loadpage("#content-wrapper",1,"tableros/index.php");
  }
  else {
    //console.log("Pagina ya activa");
  }
}

function getSesion(name) {
  var resp = "";
  $.ajax({
    url: 'php/getsesion.php',
    method: "POST",
    async: false,
    data: {
      name: name,
    },
  })
    .done(function (data) {
      resp = $.trim(data);
    })
    .fail(function (data) {
    });

  return resp;
}

function loadpage(control, usuario, page) {
  var d = new Date();
  var n = d.getTime();
  $.ajax({
    url: page + "?id=" + n,
  })
    .then(function (data) {
      $(control).html(data);
      writeSesion("paginaActiva", page);

    })
    .fail(function (data) {
      loadpage(control, usuario, 'paginas/otras/404.php');
      writeSesion("paginaActiva", "paginas/otras/404.php");
    });
}

function writeSesion(key, value) {
  $.ajax({
    url: 'php/writesesion.php',
    method: 'post',
    data: {
      key: key,
      value: value
    }
  })
    .then(function (data) {
      //console.log(data);
    });
}

function tableLoading(idTable, columnas) {
  $(idTable + " tbody").html('').append("<tr><td colspan=%s>Cargando...</td></tr>".format(columnas));
  $(idTable + " tbody tr td").load("includes/loading.html");
}


function SoloResultJs(dataSQL, reporte, fieldSelect, tabla, fieldOrder, whereField, whereOper, whereValue, valueType, whereLogi, limit = 0, debug = false) {
  reporte.activo = true;
  reporte.inicio = performance.now();
  var page = (!(debug)) ? "includes/getData.php" : "includes/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: fieldSelect,
    p_tabla: tabla,
    p_fieldOrder: fieldOrder,
    p_whereField: whereField,
    p_whereOper: whereOper,
    p_whereValue: whereValue,
    p_valueType: valueType,
    p_whereLogi: whereLogi,
    p_limit: limit
  },
    function (data) {
      dataSQL.todo = data;
      reporte.final = performance.now();
      reporte.activo = false;
      //console.log('consulta finalizada');
    }
  );
}

function convertirFormatoLocal(value) {
  value = parseFloat(value);
  value = +(Math.round(value + "e+2") + "e-2");
  return value.toLocaleString("es");
}


function formatFieldValue(field, icons, type, value, currency = null) {
  var o_align = '';
  var o_value = '';
  var setIcons = findObjectByKey(icons, "campo", field);
  if (setIcons == null) {
    switch (type) {
      case "float8":
        o_align = "right";
        o_value = convertirFormatoLocal(value);
        break;
      case "int4":
        o_align = "right";
        o_value = value;
        break;
      case "timestamp":
        o_align = "left";
        o_value = value.split(".")[0];
        break;
      default:
        o_align = "left";
        o_value = value;
    }
    if (currency != null) {
      var setCurrency = findObjectByKey(currency, "field", field);
      if (setCurrency != null) {
        o_value += ' ' + setCurrency.moneda;
      }
    }
  }
  else {
    var icono = findObjectByKey(setIcons.imagenes, "valor", value);
    if (icono != null) {
      o_align = icono.align;
      o_value = icono.tipo.format(icono.imagen);
    }
  }
  return { align: o_align, value: o_value };
};

function reporteJs2(reporte, tabla, fieldView) {
  reporte.activo = true;
  reporte.inicio = performance.now();
  var argumentos = arguments;
  var textEdificio = (argumentos[3].textEdificio !== undefined) ? (argumentos[3].textEdificio) : "No definido";
  var textFecha = (argumentos[3].textFecha !== undefined) ? (argumentos[3].textFecha) : "No definida";
  var consultas = (argumentos[3].queries !== undefined) ? (argumentos[3].queries) : [];
  var columnas = [];
  for (var index in argumentos[3].queries[0].fieldsSelect) {
    var field = argumentos[3].queries[0].fieldsSelect[index].split(' ');
    columnas.push({ data: field[field.length - 1], title: fieldView[index] });
  }
  $(tabla).DataTable({ destroy: false, language: { "emptyTable": graphLoading() } }).clear().draw();
  $.ajax({
    url: "php/data.php",
    method: "POST",
    dataType: "json",
    data: {
      queries: consultas,
    },
    success: function (data) {
      reporte.activo = false;
      if (data.length > 0) {
        var numFields = [];
        for (field in data[0].fields) {
          if ((data[0].fields[field].type == "numeric") || (data[0].fields[field].type == "float8")) {
            numFields.push(parseInt(field));
          }
        }
        $(tabla).DataTable({
          destroy: true,
          "aaData": data[0].resultados,
          columns: columnas,
          columnDefs: [{
            targets: numFields,
            render: $.fn.dataTable.render.number('.', ',', 0),
            className: 'text-right',
            type: 'html-num-fmt'
          }],
          dom: 'Bfrtip',
          buttons: [
            { extend: 'excel', text: '<i class="fa fa-file-excel-o"></i>', titleAttr: 'Exportar a Excel' },
            { extend: 'csv', title: 'Consumo de Energia', text: '<i class="fa fa-file-text-o"></i>', titleAttr: 'Exportar a CSV' },
            { extend: 'pdf', title: 'Consumo de Energia', text: '<i class="fa fa-file-pdf-o"></i>', titleAttr: 'Exportar a PDF' },
            { extend: 'print', title: 'Consumo de Energia', text: '<i class="fa fa-print"></i>', titleAttr: 'Enviar a impresión' }
          ],
          language: {
            "decimal": "",
            "emptyTable": "No se Encontraron Registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Showing 0 to 0 of 0 entries",
            "infoFiltered": "(Filtrado desde _MAX_ total registros)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Registros",
            "loadingRecords": graphLoading(),
            "processing": "Processing...",
            "search": "Buscar:",
            "zeroRecords": "No se Encontraron Registros",
            "paginate": {
              "first": "Primera",
              "last": "Última",
              "next": "Siguiente",
              "previous": "Previo"
            },
            "aria": {
              "sortAscending": ": activate to sort column ascending",
              "sortDescending": ": activate to sort column descending"
            }
          },
        });
      }
    }
  });
  /* $(tabla).DataTable(
     {      ajax: {
         url: "php/getData2.php",
         data:{
           queries: consultas,
         },
         dataSrc: function(data){
           for (var index in data[0].fields){
           }
           reporte.activo = false;
           return (data[0].resultados);
         }
       },
       columns: columnas,
     }
   );*/
}




function reporteJs(dataSQL, reporte, fieldView, idTable, fieldSelect, tabla, fieldOrder, whereField, whereOper, whereValue, valueType, whereLogi, categoria = '', fieldcategoria = '', limit = 0, icons = null, currency = null, debug = false) {
  //tableLoading(idTable,fieldView.length);
  reporte.activo = true;
  reporte.inicio = performance.now();
  a = $(idTable + " thead").html('');
  b = $("<tr>").appendTo(a);
  //$(idTable+" thead").html('').append("<tr>");
  for (var viewIndex in fieldView) {
    $("<th>%s</th>".format(fieldView[viewIndex])).appendTo(b);
    //$(idTable+ " thead").append("<th>%s</th>".format(fieldView[viewIndex]));
  }


  //$(idTable+" thead").append("</tr>");
  icons = (icons == null) ? { campo: "xxxxxx", imagenes: [] } : icons;
  var page = (!(debug)) ? "includes/getData.php" : "includes/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: fieldSelect,
    p_tabla: tabla,
    p_fieldOrder: fieldOrder,
    p_whereField: whereField,
    p_whereOper: whereOper,
    p_whereValue: whereValue,
    p_valueType: valueType,
    p_whereLogi: whereLogi,
    p_limit: limit
  },
    function (data) {
      dataSQL.todo = data;
      reporte.final = performance.now();
      reporte.activo = false;
      categoria = (categoria != '') ? 'class="' + categoria + '%s"' : '';
      $(idTable + " tbody").html('');
      if (data.resultados.length > 0) {
        success("tiempo de ejecucion:" + Math.round((reporte.final - reporte.inicio) / 1000) + " segundos", 5000);
        for (var dataIndex in data.resultados) {
          var clase = (categoria != '') ? categoria.format(data.resultados[dataIndex][fieldcategoria]) : "";
          var rowStart = "<tr %s>".format(clase);
          var columnas = '';
          for (var fieldSelectIndex in fieldSelect) {
            var value = formatFieldValue(data.fields[fieldSelectIndex].name,
              icons,
              data.fields[fieldSelectIndex].type,
              data.resultados[dataIndex][data.fields[fieldSelectIndex].name],
              currency);

            columnas += "<td align='%s'>%s</td>".format(value.align, value.value);

          }
          var rowEnd = '</tr>';
          $(idTable + " tbody").append(rowStart + columnas + rowEnd);
        }

        $(idTable).DataTable({
          destroy: true,
          paging: true,
          searching: true,
          dom: 'Bfrtip',
          buttons: [
            { extend: 'excel', text: '<i class="fa fa-file-excel-o"></i>', titleAttr: 'Exportar a Excel' },
            { extend: 'csv', text: '<i class="fa fa-file-text-o"></i>', titleAttr: 'Exportar a CSV' },
            { extend: 'pdf', text: '<i class="fa fa-file-pdf-o"></i>', titleAttr: 'Exportar a PDF' },
            { extend: 'print', text: '<i class="fa fa-print"></i>', titleAttr: 'Enviar a impresión' }
          ],
          language: {
            "decimal": "",
            "emptyTable": "No data available in table",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Showing 0 to 0 of 0 entries",
            "infoFiltered": "(Filtrado desde _MAX_ total registros)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Registros",
            "loadingRecords": "Loading...",
            "processing": "Processing...",
            "search": "Buscar:",
            "zeroRecords": "No se Encontraron Registros",
            "paginate": {
              "first": "Primera",
              "last": "Última",
              "next": "Siguiente",
              "previous": "Previo"
            },
            "aria": {
              "sortAscending": ": activate to sort column ascending",
              "sortDescending": ": activate to sort column descending"
            }
          }
        });
      }
      else {
        $(idTable + " tbody").html('').append("<tr><td colspan=%s align='center'>No hay datos para mostrar...</td></tr>".format(fieldView.length));
      }


    }
  );
}

function graficoBarraJs2(grafico, Graph) {
  var argumentos = arguments;
  var zero = (argumentos[2].zero !== undefined) ? (argumentos[2].zero) : false;
  var titulo = (argumentos[2].titulo !== undefined) ? (argumentos[2].titulo) : "Definir Titulo";
  var fieldNameX = (argumentos[2].fieldNameX !== undefined) ? (argumentos[2].fieldNameX) : "fieldX";
  var fieldNameY = (argumentos[2].fieldNameY !== undefined) ? (argumentos[2].fieldNameY) : "fieldY";
  var hidden = (argumentos[2].hidden !== undefined) ? (argumentos[2].hidden) : "hidden";
  var parseFecha = (argumentos[2].parseFecha !== undefined) ? (argumentos[2].parseFecha) : "HH:mm:ss";
  var consultas = (argumentos[2].queries !== undefined) ? (argumentos[2].queries) : [];
  var debug = (argumentos[2].debug !== undefined) ? (argumentos[2].debug) : false;
  var loading = (argumentos[3].loading !== undefined) ? (argumentos[3].loading) : "#container-loading-detalle";

  dataType = (!(debug)) ? "json" : "text";
  grafico.activo = true;
  grafico.inicio = performance.now();
  $.ajax({
    url: "php/data.php",
    method: "POST",
    data: {
      queries: consultas,
    },
    dataType: dataType,
    success: function (data) {
      //console.log(data);
      if (debug) console.log(data);
      grafico.final = performance.now();
      grafico.activo = false;
      if (data.length > 0) {
        if (data[0].resultados.length > 0) {

          success("tiempo de ejecucion:" + Math.round((grafico.final - grafico.inicio) / 1000) + " segundos", 5000);
          var arrLabels = [];
          var arrDatos = [];
          grafico.hidden = [];
          var arrColor = randomColor({
            luminosity: 'light',
            alpha: 0.5,
            count: data[0].resultados.length,
            hue: 'blue'
          });
          for (var resultadosIndex in data[0].resultados) {
            arrLabels.push(data[0].resultados[resultadosIndex][fieldNameX]);
            arrDatos.push(data[0].resultados[resultadosIndex][fieldNameY]);
            grafico.hidden.push(data[0].resultados[resultadosIndex][hidden]);
            //arrColor.push(randonColor());
          }
          Graph.data.labels = arrLabels;
          Graph.data.datasets[0].data = arrDatos;
          //arrColor[arrColor.length-1] = medidor.backgroundcolorlast;
          Graph.data.datasets[0].backgroundColor = arrColor;
          Graph.data.datasets[0].borderColor = arrColor;
          Graph.update();
          $(loading).addClass("hidden");
        }
        else {
          $(loading).addClass("hidden");
          error("No se encontraron datos para mostrar", 5000);
        }
      }
    }
  });
}

function agregarpromedio(Graph, id, label, promedio, colorBase, unidad, horas) {
  var etiq = label + ":" + promedio + ' ' + unidad + ' Energia:' + Math.round((promedio * horas), 2) + ' kWh';

  if ((Graph.chart.options.annotation.elements === undefined) &&
    (Graph.chart.annotation.elements[id] === undefined)) {

    var linea = {
      drawTime: "afterDatasetsDraw",
      id: id,
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      value: parseFloat(promedio),
      borderColor: randomColor({
        luminosity: 'light',
        alpha: 1,
        hue: colorBase
      }),
      borderWidth: 2,
      label: {
        backgroundColor: '#8a6d3e',
        content: etiq,
        enabled: true
      },
    };
    // Graph.options.annotation.annotations = [];
    Graph.options.annotation.annotations.push(linea);
  }
  else {
    Graph.chart.annotation.elements[id].options.value = parseFloat(promedio);
    Graph.chart.annotation.elements[id].options.label.content = etiq;

  }
}

function agregarAreas(fechainicial, fechafinal, horainicial, horafinal) {
  var fInicial = moment(fechainicial);
  var fFinal = moment(fechafinal);
  var hInicial = moment(horainicial, 'HH:mm');
  var hFinal = moment(horafinal, 'HH:mm');
  var area = null;
  var dias = fFinal.diff(fInicial, 'Days');
  var fechaactual = fInicial;
  for (var i = 1; i <= dias + 1; i++) {
    if (hInicial < hFinal) {
      var area = {
        drawTime: "beforeDatasetsDraw",
        id: "box" + i,
        type: "box",
        xScaleID: "x-axis-0",
        yScaleID: "y-axis-0",
        xMin: moment(fechaactual).format('YYYY/MM/DD') + ' ' + $.trim(horainicial),
        xMax: moment(fechaactual).format('YYYY/MM/DD') + ' ' + $.trim(horafinal),
        yMin: 0,
        yMax: barGraphConsumoFranjaDetalle.options.scales.yAxes[0].yMax,
        backgroundColor: "rgba(101, 33, 171, 0.1)",
        borderColor: "rgb(101, 33, 171,0.1)",
        borderWidth: 1,
      };

      barGraphConsumoFranjaDetalle.options.annotation.annotations.push(area);
    }
    else {
      var area1 = {
        drawTime: "beforeDatasetsDraw",
        id: "boxA" + i,
        type: "box",
        xScaleID: "x-axis-0",
        yScaleID: "y-axis-0",
        xMin: moment(fechaactual).format('YYYY/MM/DD') + ' 00:00:00',
        xMax: moment(fechaactual).format('YYYY/MM/DD') + ' ' + $.trim(horafinal),
        yMin: 0,
        yMax: barGraphConsumoFranjaDetalle.options.scales.yAxes[0].yMax,
        backgroundColor: "rgba(101, 33, 171, 0.1)",
        borderColor: "rgb(101, 33, 171,0.1)",
        borderWidth: 1,
      };
      var area2 = {
        drawTime: "beforeDatasetsDraw",
        id: "boxB" + i,
        type: "box",
        xScaleID: "x-axis-0",
        yScaleID: "y-axis-0",
        xMin: moment(fechaactual).format('YYYY/MM/DD') + ' ' + $.trim(horainicial),
        xMax: moment(fechaactual).format('YYYY/MM/DD') + ' 23:59:59',
        yMin: 0,
        yMax: barGraphConsumoFranjaDetalle.options.scales.yAxes[0].yMax,
        backgroundColor: "rgba(101, 33, 171, 0.1)",
        borderColor: "rgb(101, 33, 171,0.1)",
        borderWidth: 1,
      };

      barGraphConsumoFranjaDetalle.options.annotation.annotations.push(area1);
      barGraphConsumoFranjaDetalle.options.annotation.annotations.push(area2);


    }

    fechaactual = moment(fechaactual).add(1, 'days');
  }




}

function calcular_segundos(fechainicial, fechafinal, horainicial, horafinal, horafinalGrafica) {
  var fInicial = moment(fechainicial);
  var fFinal = moment(fechafinal);
  var hInicial = moment(horainicial, 'HH:mm');
  var hFinal = moment(horafinal, 'HH:mm');
  var hFinalG = moment(horafinalGrafica, 'HH:mm');
  var dias = fFinal.diff(fInicial, 'Days');
  var fechaactual = fInicial;
  var suma = 0;
  for (var i = 1; i <= dias + 1; i++) {
    if (hInicial < hFinal) {
      if (i < dias + 1) {
        suma += hFinal.diff(hInicial, 'Seconds');
      }
      else {
        if ((hFinalG > hInicial) && (hFinalG < hFinal)) {
          suma += hFinalG.diff(hInicial, 'Seconds');
        }
        else if (hFinalG >= hFinal) {
          suma += hFinal.diff(hInicial, 'Seconds');
        }
      }
    }
    else {
      if (i < dias + 1) {
        suma += moment('23:59:59', 'HH:mm:ss').diff(hInicial, 'Seconds') + 1 +
          hFinal.diff(moment('00:00', 'HH:mm'), 'Seconds');
      }
      else {
        if (hFinalG < hFinal) {
          suma += hFinalG.diff(moment('00:00', 'HH:mm'), 'Seconds');
        }
        else {
          suma += hFinal.diff(moment('00:00', 'HH:mm'), 'Seconds');
          if (hFinalG > hInicial) {
            suma += hFinalG.diff(hInicial, 'Seconds');
          }
        }

      }



    }


  }

  return suma / 3600;

}

function graficoLinealJs2(grafico,
  Graph) {
  var argumentos = arguments;
  //console.log(argumentos);
  var zero = (argumentos[2].zero !== undefined) ? (argumentos[2].zero) : false;
  var titulo = (argumentos[2].titulo !== undefined) ? (argumentos[2].titulo) : "Definir Titulo";
  var fieldNameX = (argumentos[2].fieldNameX !== undefined) ? (argumentos[2].fieldNameX) : "fieldX";
  var fieldNameY = (argumentos[2].fieldNameY !== undefined) ? (argumentos[2].fieldNameY) : "fieldY";
  var parseFecha = (argumentos[2].parseFecha !== undefined) ? (argumentos[2].parseFecha) : "HH:mm:ss";
  var consultas = (argumentos[2].queries !== undefined) ? (argumentos[2].queries) : [];
  var temperatura = (argumentos[2].temperatura !== undefined) ? (argumentos[2].temperatura) : false;
  var debug = (argumentos[2].debug !== undefined) ? (argumentos[2].debug) : false;
  var medidor = (argumentos[3].medidor !== undefined) ? (argumentos[3].medidor) : [];
  var variable = (argumentos[3].variable !== undefined) ? (argumentos[3].variable) : [];
  var tipo = (argumentos[3].tipo !== undefined) ? (argumentos[3].tipo) : "";
  var fechainicial = (argumentos[3].fechainicial !== undefined) ? (argumentos[3].fechainicial) : "";
  var fechafinal = (argumentos[3].fechafinal !== undefined) ? (argumentos[3].fechafinal) : "";
  var horainicial = (argumentos[3].horainicial !== undefined) ? (argumentos[3].horainicial) : "";
  var horafinal = (argumentos[3].horafinal !== undefined) ? (argumentos[3].horafinal) : "";

  var medidores = (argumentos[3].medidores !== undefined) ? (argumentos[3].medidores) : [];
  var loading = (argumentos[3].loading !== undefined) ? (argumentos[3].loading) : "#container-loading";
  var promedios = (argumentos[3].promedios !== undefined) ? (argumentos[3].promedios) : [];
  var nombreMedidor = medidor[0];
  var nombreVariable = variable[2];
  var unixfechainicial = moment(fechainicial, "YYYY-MM-DD hh:mm").valueOf();
  var unixfechafinal = moment(fechafinal, "YYYY-MM-DD hh:mm").valueOf();
  var rango = unixfechainicial + '-' + unixfechafinal;

  dataType = (!(debug)) ? "json" : "text";
  grafico.activo = true;
  grafico.inicio = performance.now();
  $.ajax({
    url: "php/data.php",
    method: "POST",
    data: {
      queries: consultas,
    },
    dataType: dataType,
    success: function (data) {
      if (debug) console.log(data);
      grafico.final = performance.now();
      grafico.activo = false;
      if (data.length > 0) {

        if (data[0].resultados.length > 0) {
          success("tiempo de ejecucion:" + Math.round((grafico.final - grafico.inicio) / 1000) + " segundos", 5000);
          var arrDatos = [];
          var max = Math.round(Math.max.apply(Math, data[0].resultados.map(function (lectura) { return parseFloat(lectura.valor); })));
          var min = Math.round(Math.min.apply(Math, data[0].resultados.map(function (lectura) { return parseFloat(lectura.valor); })));

          $("#textMaximo").val(max);
          $("#textMinimo").val(min);
          $("#textDiff").val(max - min);

          for (var resultadosIndex in data[0].resultados) {
            var valor = formatear_valor(data[0].resultados[resultadosIndex][fieldNameY], findObjectByKey(data[0].fields, "name", fieldNameY).type, false);

            var datos = {
              x: data[0].resultados[resultadosIndex][fieldNameX],
              y: valor.value
            }
            arrDatos.push(datos);
            var objFecha = {
              unix: moment(data[0].resultados[resultadosIndex][fieldNameX], "YYYY-MM-DD hh:mm:ss").valueOf(),
              str: data[0].resultados[resultadosIndex][fieldNameX],
            }
            //if (findObjectByKey(medidores.fechas,"unix",objFecha.unix)==null){
            //medidores.fechas.push(objFecha);
            //}

            // medidores.fechas.sort((a,b) => (a.unix > b.unix) ? 1 : ((b.unix > a.unix) ? -1 : 0)); 

            var objValor = {
              unix: objFecha.unix,
              str: objFecha.str,
              valor: valor.value,
            }

            //if (findObjectByKey(medidores.Medidores[nombreMedidor]['data'][nombreVariable]['data'][tipo][rango].valores,"unix",objValor.unix)==null){
            //medidores.Medidores[nombreMedidor]['data'][nombreVariable]['data'][tipo][rango].valores.push(objValor);
            //}
          }


          //medidores[nombreMedidor]['data'][nombreVariable]['data'][tipo][rango]['valores'] = [];


          //dibujarTabla2("tabla",medidores);

          var ValueDataDiario = {
            label: titulo,
            data: arrDatos,
            borderColor: randonColor(),
            fill: false,
            yAxisID: "y-axis-1",
          }


          Graph.options.scales.xAxes[0].time.parser = parseFecha;
          Graph.options.scales.yAxes[0].ticks.beginAtZero = zero;
          Graph.data.datasets.push(ValueDataDiario);
          Graph.update();

          if (temperatura != false) {
            if (temperatura.show) {


              $.ajax({
                url: "php/data.php",
                method: "POST",
                data: {
                  queries: [{
                    fieldsSelect: ["TO_TIMESTAMP(CONCAT(extract(hour from fecha)::text,':',extract(minute from fecha)::text),'HH24:mi')::time as hora", "*"],
                    tableName: "mediciones.valoresclima",
                    orderby: [{ field: "fecha", type: "asc" }],
                    where: [{
                      field: "idciudad",
                      oper: "=",
                      value: "(select idciudad from mediciones.edificios where idedificio=%s)".format(temperatura.idedificio),
                      type: "int"
                    },
                    {
                      logical: "and",
                      field: "fecha::date",
                      oper: "=",
                      value: moment(fechainicial, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD"),
                      type: "str"
                    }
                    ]
                  }],
                },
                dataType: "json",
                success: function (data) {
                  if (data.length > 0) {
                    if (data[0].resultados.length > 0) {
                      var arrTemp = [];
                      for (var resultadosIndex in data[0].resultados) {
                        var temp = {
                          x: data[0].resultados[resultadosIndex]["hora"],
                          y: parseFloat(data[0].resultados[resultadosIndex]["temp"])
                        }
                        arrTemp.push(temp);
                      }
                      var ValueDataTemp = {
                        label: "Temperatura",
                        data: arrTemp,
                        borderColor: randonColor(),
                        fill: false,
                        yAxisID: "y-axis-2",
                      }
                      Graph.data.datasets.push(ValueDataTemp);
                      Graph.update();
                    }
                  }
                }
              });
            }
          }









          /*Graph.options.annotation.annotations.forEach(function(item,index,object){
            delete(object);
          });*/

          //console.log('Anotaciones:'+Graph.options.annotation.annotations.length);
          for (resPromedios in promedios) {
            var pr = promedios[resPromedios];
            // console.log('ultima hora grafica:'+arrDatos[arrDatos.length-1].x);
            var realHoraFinal = moment(arrDatos[arrDatos.length - 1].x, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
            //console.log('Hora Inicial:'+horainicial+', Hora Final:'+realHoraFinal);
            var horas = calcular_segundos(fechainicial, fechafinal, horainicial, horafinal, realHoraFinal);
            //console.log(horas);
            agregarpromedio(Graph, pr.id, pr.label, pr.promedio, pr.colorBase, pr.unidad, horas);
          }
          if (promedios.length > 0) {
            agregarAreas(fechainicial, fechafinal, horainicial, horafinal);
            Graph.update();
          }


          $(loading).addClass("hidden");
        }
        else {
          $(loading).addClass("hidden");
          error2({ type: "error", msg: "No se encontraron datos para mostrar" });
        }
      }
    }
  });
}

function construirCabecerasTabla(tablaName, medidores) {
  /* $("#%s thead #header-sfecha".format(tablaName)).html('');
  /* $("#%s thead #header-medidor".format(tablaName)).html('');
   $("#%s thead #header-variable".format(tablaName)).html('');
   $("#%s thead #header-tipo".format(tablaName)).html('');
   $("#%s thead #header-fecha".format(tablaName)).html('');
   $("#%s thead #header-campos".format(tablaName)).html('');
   $("#%s tbody".format(tablaName)).html('');
   $("<th rowspan=6 class='text-center'>Fecha</th>").appendTo("#%s thead #header-sfecha".format(tablaName));*/
  $("#%s thead #header-medidor".format(tablaName)).html('');
  $("#%s thead #header-variable".format(tablaName)).html('');
  $("#%s thead #header-fecha".format(tablaName)).html('');
  $("#%s thead #header-campos".format(tablaName)).html('');
  $("#%s tbody".format(tablaName)).html('');
  //$("<th class='text-center'>%s</th>".format("")).appendTo("#%s thead #header-sfecha".format(tablaName));
  var contarValores = 0;
  for (var indexMedidor in medidores.Medidores) {
    var contarMedidor = 0;
    var medidor = medidores.Medidores[indexMedidor]
    var length = Object.size(medidor['data']);
    $("<th class='text-center' id='medidor-%s' colspan='%s'>%s</th>".format(medidor.id, length, indexMedidor)).appendTo("#%s thead #header-medidor".format(tablaName));
    for (var indexVariable in medidor['data']) {
      var contarVariable = 0;
      var variable = medidor['data'][indexVariable];
      var length = Object.size(variable['data']);
      $("<th class='text-center' id='medidor-%s-variable-%s' colspan='%s'>%s</th>".format(medidor.id, variable.id, length, indexVariable)).appendTo("#%s thead #header-variable".format(tablaName));
      for (var indexTipo in variable['data']) {
        var contarTipo = 0;
        var tipo = variable['data'][indexTipo];
        var length = Object.size(tipo);
        //$("<th id='medidor-%s-variable-%s-tipo-%s' class='text-center' colspan='%s'>%s</th>".format(medidor.id,variable.id,indexTipo,length,indexTipo)).appendTo("#%s thead #header-tipo".format(tablaName));
        for (var indexRango in tipo) {
          var rango = tipo[indexRango];
          contarTipo++; contarMedidor++; contarVariable++;
          $("<th class='text-center'>%s</br>%s</th>".format(rango.fechainicial, rango.fechafinal)).appendTo("#%s thead #header-fecha".format(tablaName));
          $("<th class='text-center'>%s</th>".format(indexTipo)).appendTo("#%s thead #header-campos".format(tablaName));
        }
        $("#medidor-%s-variable-%s-tipo-%s".format(medidor.id, variable.id, indexTipo)).attr('colspan', contarTipo);
      }
      $("#medidor-%s-variable-%s".format(medidor.id, variable.id)).attr('colspan', contarVariable);
    }
    $("#medidor-%s".format(medidor.id)).attr('colspan', contarMedidor);
    contarValores += contarMedidor;

  }
  return contarValores;
}
function construirCuerpoTabla(tablaName, medidores, countValores) {
  for (var indexFecha in medidores.fechas) {
    var fecha = medidores.fechas[indexFecha];
    var Fila = $("<tr id='fecha-%s'></tr>".format(fecha.unix)).appendTo($("#%s".format(tablaName)));
    $("<td>%s</td>".format(fecha.str)).appendTo(Fila);
    for (var indexValores = 0; indexValores < countValores; indexValores++) {
      $("<td class='text-right'></td>").appendTo(Fila);
    }

    //var rowNode= $("#%s".format(tablaName)).DataTable().row.add(arrFieldValue).draw();

    /* for (var i=0;i<countValores;i++){
       $( rowNode ).find('td').eq(i+1).addClass('text-right');
     }*/
    //rowNode.id = "fecha-%s".format(fecha.unix);
  }

}

function llenarCuerpoTabla(tablaName, medidores) {
  var contarValores = 0;
  for (var indexMedidor in medidores.Medidores) {
    var medidor = medidores.Medidores[indexMedidor]
    for (var indexVariable in medidor['data']) {
      var variable = medidor['data'][indexVariable];
      for (var indexTipo in variable['data']) {
        var tipo = variable['data'][indexTipo];
        for (var indexRango in tipo) {
          var rango = tipo[indexRango];
          for (var indexValor in rango.valores) {
            var valor = rango.valores[indexValor];
            //var indexFila = $(tabla).DataTable().row("#fecha-%s".format(valor.unix)).index()
            //$(tablaName).DataTable().cell(indexFila,contarValores+1).data(valor.valor).draw();
            $("#fecha-%s".format(valor.unix)).find('td').eq(contarValores + 1).html(valor.valor);
          }
          contarValores++;
        }
      }
    }
  }
}

function dibujarTabla2(tablaName, medidores) {
  $("#%s".format(tablaName)).DataTable().destroy();
  var countValores = construirCabecerasTabla(tablaName, medidores);
  construirCuerpoTabla(tablaName, medidores, countValores);
  llenarCuerpoTabla(tablaName, medidores);
  $("#%s".format(tablaName)).DataTable({});
}

function dibujarTabla(tablaName, medidores) {
  $("#%s thead #header-medidor".format(tablaName)).html('');
  $("#%s thead #header-variable".format(tablaName)).html('');
  $("#%s thead #header-tipo".format(tablaName)).html('');
  $("#%s thead #header-fecha".format(tablaName)).html('');
  $("#%s thead #header-campos".format(tablaName)).html('');
  $("#%s tbody".format(tablaName)).html('');
  for (var medidor in medidores) {
    var length = Object.size(medidores[medidor]['data']);
    $("<th class='text-center' id='medidor-%s' colspan='%s'>%s</th>".format(medidores[medidor].id, length, medidor)).appendTo("#%s thead #header-medidor".format(tablaName));
    var contarMedidor = 0;
    var contadorRango = 0;
    for (var variable in medidores[medidor]['data']) {
      var contarVariable = 0;
      var length = Object.size(medidores[medidor]['data'][variable]['data']);
      $("<th class='text-center' id='medidor-%s-variable-%s' colspan='%s'>%s</th>".format(medidores[medidor].id, medidores[medidor]['data'][variable].id, length, variable)).appendTo("#%s thead #header-variable".format(tablaName));
      for (var tipo in medidores[medidor]['data'][variable]['data']) {
        var length = Object.size(medidores[medidor]['data'][variable]['data'][tipo]);
        $("<th id='medidor-%s-variable-%s-tipo-%s' class='text-center' colspan='%s'>%s</th>".format(medidores[medidor].id, medidores[medidor]['data'][variable].id, tipo, length, tipo)).appendTo("#%s thead #header-tipo".format(tablaName));
        var contarTipo = 0;
        for (var rango in medidores[medidor]['data'][variable]['data'][tipo]) {

          $("<th class='text-center' colspan='2'>%s</br>%s</th>".format(medidores[medidor]['data'][variable]['data'][tipo][rango].fechainicial, medidores[medidor]['data'][variable]['data'][tipo][rango].fechafinal)).appendTo("#%s thead #header-fecha".format(tablaName));
          $("<th class='text-center'>Fecha</th>").appendTo("#%s thead #header-campos".format(tablaName));
          //contarTipo++;contarMedidor++;contarVariable++;
          $("<th class='text-center'>Valor</th>").appendTo("#%s thead #header-campos".format(tablaName));
          contarTipo++; contarMedidor++; contarVariable++;
          var fila = 0;
          for (var datos in medidores[medidor]['data'][variable]['data'][tipo][rango].valores) {
            //console.log(medidores[medidor]['data'][variable]['data'][tipo][rango].valores[datos]);
            if ($("#%s tbody #fila-%s".format(tablaName, fila)).length == 0) {
              $("<tr id='fila-%s'>".format(fila)).appendTo("#%s tbody".format(tablaName));
            }
            var filaStr = "#%s tbody #fila-%s".format(tablaName, fila);
            //$("<td>%s</td>".format(medidores[medidor]['data'][variable]['data'][tipo][rango].valores[datos].x)).appendTo(filaStr);
            $("<td>%s</td>".format(medidores[medidor]['data'][variable]['data'][tipo][rango].valores[datos].y)).appendTo(filaStr);
            fila++;
          }
          contadorRango++;
        }
        $("#medidor-%s-variable-%s-tipo-%s".format(medidores[medidor].id, medidores[medidor]['data'][variable].id, tipo)).attr('colspan', contarTipo);
      }
      $("#medidor-%s-variable-%s".format(medidores[medidor].id, medidores[medidor]['data'][variable].id)).attr('colspan', contarVariable);
    }
    $("#medidor-%s".format(medidores[medidor].id)).attr('colspan', contarMedidor);
  }

  $("#%s".format(tablaName)).DataTable();
  /*$('#%s'.format(tablaName)).DataTable({
    responsive:true,
    destroy: true,
    paging: true,
    searching: true,
      language:{
        "decimal":        "",
        "emptyTable":     "No se Encontraron Registros",
        "info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Showing 0 to 0 of 0 entries",
        "infoFiltered":   "(Filtrado desde _MAX_ total registros)",
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ Registros",
        "loadingRecords": graphLoading(),
        "processing":     "Processing...",
        "search":         "Buscar:",
        "zeroRecords":    "No se Encontraron Registros",
        "paginate": {
          "first":      "Primera",
          "last":       "Última",
          "next":       "Siguiente",
          "previous":   "Previo"
        },
        "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        }
      },
  });*/
}

function addEmptyRow(where, what) {
  $(what).appendTo(where);
}

function graficoLinealJs(grafico,
  parseFecha,
  fieldX,
  fieldY,
  fecha,
  medidor,
  containerGraph,
  graphName,
  Graph,
  fieldSelect,
  tabla,
  fieldOrder,
  whereField,
  whereOper,
  whereValue,
  valueType,
  whereLogi,
  saltos = 1,
  debug = false) {
  //graphLoading(containerGraph);
  grafico.activo = true;
  grafico.inicio = performance.now();
  var page = (!(debug)) ? "php/getData.php" : "php/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: fieldSelect,
    p_tabla: tabla,
    p_fieldOrder: fieldOrder,
    p_whereField: whereField,
    p_whereOper: whereOper,
    p_whereValue: whereValue,
    p_valueType: valueType,
    p_whereLogi: whereLogi
  },
    function (data) {
      grafico.final = performance.now();
      grafico.activo = false;
      //$(idTable+" tbody").html('');
      if (data.resultados.length > 0) {
        success("tiempo de ejecucion:" + Math.round((grafico.final - grafico.inicio) / 1000) + " segundos", 5000);
        var arrDatos = [];
        for (var dataIndex in data.resultados) {

          var valor = formatear_valor(data.resultados[dataIndex][fieldY], findObjectByKey(data.fields, "name", fieldY).type, false);
          /*if (data.resultados.length > 150){
              if ((dataIndex % saltos)==0){
                  var datos = {
                      x : data.resultados[dataIndex][fieldX],
                      y : valor.value
                  }
                  arrDatos.push(datos);   
              }
          }
          else {*/
          var datos = {
            x: data.resultados[dataIndex][fieldX],
            y: valor.value
          }
          arrDatos.push(datos);
          //}        
        }
        var ValueDataDiario = {
          label: "%s %s".format(medidor, fecha),
          data: arrDatos,
          borderColor: randonColor(),
          fill: false
        }
        chartDataDemandaGeneralDiaria.datasets.push(ValueDataDiario);
        Graph.options.scales.xAxes[0].time.parser = parseFecha;
        //console.log(Graph.options.scales.xAxes[0].time.parser);
        Graph.update();
      }
      else {
        info("No se encontraron datos para mostrar", 5000);
        //$(idTable+" tbody").html('').append("<tr><td colspan=%s align='center'>No hay datos para mostrar...</td></tr>".format(columnas));  
      }


    }
  );
}

function graficoTortaJs2(grafico, field) {
  var argumentos = arguments;
  var chartData = (argumentos[1].chartData !== undefined) ? (argumentos[1].chartData) : [];
  var graph = (argumentos[1].graph !== undefined) ? (argumentos[1].graph) : null;
  //var fieldLabel    = (argumentos[1].label!==undefined)?(argumentos[1].label):[];
  //var fieldValue    = (argumentos[1].value!==undefined)?(argumentos[1].value):"";
  var consultas = (argumentos[1].queries !== undefined) ? (argumentos[1].queries) : [];
  if (argumentos.length > 2) {
    var msjLoad = (argumentos[2].msjLoad !== undefined) ? (argumentos[2].msjLoad) : "Cargando Data...";
    var msjNoData = (argumentos[2].msjNoData !== undefined) ? (argumentos[2].msjNoData) : "No hay Datos...";
    var startDisabled = (argumentos[2].startDisable !== undefined) ? (argumentos[2].startDisable) : true;
    var page = (argumentos[2].debug !== undefined) ? ((argumentos[2].debug) ? "php/getData2.php" : "php/getData2.php") : "php/getData2.php";
    var vdebug = (argumentos[2].debug !== undefined) ? argumentos[2].debug : false;
  }
  if (vdebug) console.log(argumentos);
  grafico.activo = true;
  grafico.inicio = performance.now();
  chartData.datasets.length = 0;
  graph.update();
  $.ajax({
    url: page,
    data: {
      queries: consultas,
    }
  })
    .then(function (data) {
      //console.log(data);
      if (vdebug) debug(data);
      grafico.final = performance.now();
      grafico.activo = false;

      if (data.length > 0) {

        for (var dataIndex in data) {
          var tabla = (consultas[dataIndex].dataTb !== undefined) ? (consultas[dataIndex].dataTb) : "#tabla";
          var unidad = (consultas[dataIndex].unidad !== undefined) ? (consultas[dataIndex].unidad) : "kWh";
          var showTb = (consultas[dataIndex].showTb !== undefined) ? (consultas[dataIndex].showTb) : true;
          var otherField = (consultas[dataIndex].otherFields !== undefined) ? (consultas[dataIndex].otherFields) : [];
          if (showTb) $(tabla).DataTable().clear().draw();
          if (data[dataIndex].resultados.length > 0) {
            success("tiempo de ejecucion:" + Math.round((grafico.final - grafico.inicio) / 1000) + " segundos", 5000);
            var arrValues = [];
            var arrLabels = [];
            var fieldLabel = (consultas[dataIndex].label !== undefined) ? (consultas[dataIndex].label) : [];
            var fieldValue = (consultas[dataIndex].value !== undefined) ? (consultas[dataIndex].value) : "";
            var acumulado = 0;
            for (var resIndex in data[dataIndex].resultados) {
              var valor = formatear_valor(data[dataIndex].resultados[resIndex][fieldValue], findObjectByKey(data[dataIndex].fields, "name", fieldValue).type, false);
              arrValues.push(valor.value);
              acumulado += valor.value;
              var label = (data[dataIndex].resultados[resIndex][fieldLabel[0]] == data[dataIndex].resultados[resIndex][fieldLabel[2]]) ? data[dataIndex].resultados[resIndex][fieldLabel[1]] : data[dataIndex].resultados[resIndex][fieldLabel[0]];
              arrLabels.push(label);
              if (showTb) {
                var arFieldValue = [];
                arFieldValue.push(label);
                arFieldValue.push(valor.value);
                arFieldValue.push(unidad);
                arFieldValue.push(unidad);
                for (var indexOtField in otherField) {
                  arFieldValue.push(data[dataIndex].resultados[resIndex][otherField[indexOtField]]);
                }
                var rowNode = $(tabla).DataTable().row.add(arFieldValue).draw().node();
                $(rowNode).find('td').eq(0).addClass('text-center');
                $(rowNode).find('td').eq(1).addClass('text-right');
                $(rowNode).find('td').eq(2).addClass('text-center');
                $(rowNode).find('td').eq(3).addClass('text-right');
              }
              //var fila = $("<tr id='fila%s'></tr>".format(resIndex)).appendTo("%s tbody".format(tabla));
              // $("<td id='descripcion%s' class='text-center'>%s</td><td class='text-right'>%s %s</td>".format(resIndex,label,valor.value,unidad)).appendTo(fila);
            }

            if (showTb) {
              for (var index = 0; index < $(tabla).DataTable().rows().count(); index++) {
                var porcentaje = 0;
                if (acumulado > 0) {
                  porcentaje = Math.round(($(tabla).DataTable().cell(index, 1).data() / acumulado * 100) * 100) / 100;
                }
                else {
                  porcentaje = 0;
                }
                $(tabla).DataTable().cell(index, 3).data(porcentaje).draw();
              }
            }


            var serie = {
              labels: arrLabels,
              data: arrValues,
              backgroundColor: colores_ribex,
              borderWidth: 13
            }
            var color = Chart.helpers.color;
            for (var i in serie.backgroundColor) {
              serie.backgroundColor[i] = color(serie.backgroundColor[i]).alpha(0.5).rgbString();
              $("#descripcion%s".format(i)).css("background-color", serie.backgroundColor[i]);
            }
            chartData.datasets.push(serie);
            graph.update();
            $("#container-loading").addClass("hidden");



          }
          else {
            $("#container-loading").addClass("hidden");
            info("No se encontraron datos para mostrar", 5000);
          }
        }
      }
      else {
        info("No se encontraron datos para mostrar", 5000);
      }

    });
}

function graficoTortaJs(showMsg,
  grafico,
  chartData,
  graph,
  fieldLabel,
  fieldValue,
  fieldSelect,
  tabla,
  fieldOrder,
  whereField,
  whereOper,
  whereValue,
  valueType,
  whereLogi,
  debug = false) {
  //graphLoading(containerGraph);
  grafico.activo = true;
  grafico.inicio = performance.now();
  chartData.datasets.length = 0;
  graph.update();
  var page = (!(debug)) ? "php/getData.php" : "php/getDatadebug.php";
  $.get(page, {
    p_fieldSelect: fieldSelect,
    p_tabla: tabla,
    p_fieldOrder: fieldOrder,
    p_whereField: whereField,
    p_whereOper: whereOper,
    p_whereValue: whereValue,
    p_valueType: valueType,
    p_whereLogi: whereLogi
  },
    function (data) {
      grafico.final = performance.now();
      grafico.activo = false;
      //$(idTable+" tbody").html('');
      if (data.resultados.length > 0) {
        if (showMsg) success("tiempo de ejecucion:" + Math.round((grafico.final - grafico.inicio) / 1000) + " segundos", 5000);
        var arrValues = [];
        var arrLabels = [];
        for (var dataIndex in data.resultados) {
          var valor = formatear_valor(data.resultados[dataIndex][fieldValue], findObjectByKey(data.fields, "name", fieldValue).type, false);
          arrValues.push(valor.value);

          arrLabels.push((data.resultados[dataIndex][fieldLabel[0]] == data.resultados[dataIndex][fieldLabel[2]]) ? data.resultados[dataIndex][fieldLabel[1]] : data.resultados[dataIndex][fieldLabel[0]]);
        }

        //chartData.label = arrLabels;
        //graph.data.labels = arrLabels;
        var serie = {
          labels: arrLabels,
          data: arrValues,
          backgroundColor: colores_ribex,
          borderWidth: 13
        }

        for (var i in serie.backgroundColor) {
          serie.backgroundColor[i] = color(serie.backgroundColor[i]).alpha(0.5).rgbString();
        }


        //chartData.datasets[0].data.push(arrValues);

        chartData.datasets.push(serie);
        //chartData.datasets[0].backgroundColor = colores_ribex;
        //graph.options.title.text = titulo;
        //for (var i in chartData.datasets[0].backgroundColor){
        //chartData.datasets[0].backgroundColor[i] = color(chartData.datasets[0].backgroundColor[i]).alpha(0.5).rgbString();;
        //}
        graph.update();
        //Graph.update(); 
      }
      else {
        info("No se encontraron datos para mostrar", 5000);
      }


    }
  );
}

function error(msg, delay, size) {
  error2({ msg: msg, delay: delay, size: size });
}

function error2() {
  message2({
    type: 'error',
    size: (arguments[0].size !== undefined) ? arguments[0].size : 'mini',
    msg: (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido...',
    delay: (arguments[0].delay !== undefined) ? arguments[0].delay : 5000,
  });
}

function warning2() {
  message2({
    type: 'warning',
    size: (arguments[0].size !== undefined) ? arguments[0].size : 'mini',
    msg: (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido...',
    delay: (arguments[0].delay !== undefined) ? arguments[0].delay : 5000,
  });
}

function success(msg, delay) {
  message('success', msg, delay);
}

function success2() {
  message2({
    type: 'success',
    size: (arguments[0].size !== undefined) ? arguments[0].size : 'mini',
    msg: (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido...',
    delay: (arguments[0].delay !== undefined) ? arguments[0].delay : 5000,
  });
}

function info(msg, delay) {
  message('info', msg, delay);
}

function info2() {
  message2({
    type: 'info',
    size: (arguments[0].size !== undefined) ? arguments[0].size : 'mini',
    msg: (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido...',
    delay: (arguments[0].delay !== undefined) ? arguments[0].delay : 5000,
  });
}


function message(type, mensaje, del) {
  var type = (arguments[0].type !== undefined) ? arguments[0].type : 'info';
  var type = (arguments[0].size !== undefined) ? arguments[0].size : 'mini';
  var msg = (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido...';
  var delay = (arguments[0].delay !== undefined) ? arguments[0].delay : 5000;
  Lobibox.notify(type, {
    delay: del,  //In milliseconds
    msg: mensaje,
    size: 'mini',
    sound: false
  });
}

function message2() {
  var type = (arguments[0].type !== undefined) ? arguments[0].type : 'info';
  var size = (arguments[0].size !== undefined) ? arguments[0].size : 'mini';
  var msg = (arguments[0].msg !== undefined) ? arguments[0].msg : 'mensaje no definido';
  var delay = (arguments[0].delay !== undefined) ? arguments[0].delay : 5000;
  Lobibox.notify(type, {
    delay: delay,  //In milliseconds
    msg: msg,
    size: size,
    sound: false
  });
}



/******************TIMERS***************************/
function stopTimers() {
  timers.forEach(function (timer) {
    clearInterval(timer);
  });
  timers.length = 0;
}

/********************AJAX**************************/


/*$.xhrPool = []; // array of uncompleted requests
$.xhrPool.abortAll = function() { // our abort function
    $(this).each(function(idx, jqXHR) { 
        jqXHR.abort();
    });
    $.xhrPool.length = 0
};


$.ajaxSetup({
    beforeSend: function(jqXHR) { // before jQuery send the request we will push it to our array
        if ($.xhrPool !== undefined) {
          console.log("count:"+$.xhrPool.length);
        }
        $.xhrPool.push(jqXHR);
    },
    complete: function(jqXHR) { // when some of the requests completed it will splice from the array
        var index = $.xhrPool.indexOf(jqXHR);
        if (index > -1) {
            $.xhrPool.splice(index, 1);
            console.log("count:"+$.xhrPool.length);
        }
    }
});*/

function obtener_Edificios() {
  var edificios = null
  jQuery.ajax({
    url: 'includes/obtener_variables.php',
    data: { p_variable: "edificio" },
    success: function (data) {
      edificios = data;
    },
    async: true
  });
  return edificios;
}


/*****************LOGOUT***********************/

function logout() {
  stopTimers();
  xhrPool.abortAll();
  jQuery.ajax({
    url: 'php/logout.php',
    success: function (data) {
      //console.log(data);
      r = (data == '1');
    },
    async: false
  });
  window.location.href = "paginas/login.php";
}

function confirmar(datatable) {
  var argumentos = arguments;
  var idactivo = (argumentos[1].idactivo !== undefined) ? argumentos[1].idactivo : -1;
  var prompt = (argumentos[1].prompt !== undefined) ? argumentos[1].prompt : true;
  var divChild = (argumentos[1].divChild !== undefined) ? argumentos[1].divChild : "XX";
  var idvalue = argumentos[1].idvalue;
  var primaryfield = argumentos[1].primaryfield;
  var tablename = argumentos[1].tablename;
  $.ajax({
    url: "php/data.php",
    method: "POST",
    data: {
      queries: [{
        fieldsSelect: ["coalesce(descripcion,tablename) as nombre", "sum(registros) as registros", "avg(nivel) as nivel"],
        tableName: "public.contar_registros_antes_borrar('%s',%s,'%s','',1)".format(primaryfield, idvalue, tablename),
        groupby: ["tablename", "descripcion"],
        orderby: [{
          field: "nivel",
          type: "asc"
        }],
      }]
    },
    dataType: 'json',
    success: function (data) {
      //console.log(data);
      var msg = "Eliminar este registro, implicaria eliminar lo siguiente: </br></br>";
      for (var ResIndex in data[0].resultados) {
        msg += "<b>%s</b>:%s registro(s) </br>".format(data[0].resultados[ResIndex].nombre, data[0].resultados[ResIndex].registros);
      }
      msg += '</br>¿Está seguro de querer realizar esta operación?'
      Lobibox.confirm({
        title: (argumentos[1].titulo !== undefined) ? (argumentos[1].titulo) : "Confirmación",
        msg: msg,
        buttonsAlign: 'right',
        buttons: {
          Yes: {
            text: 'Si',
            'class': 'btn btn-danger',
            closeOnClick: true
          },
          No: {
            text: 'No',
            'class': 'btn btn-success',
            closeOnClick: true
          },
        },
        callback: function (lobibox, type) {
          switch (type) {

            case 'Yes':
              if (!(prompt)) {
                $.ajax({
                  url: "php/delete.php",
                  method: "POST",
                  data: {
                    tableName: tablename,
                    where: [{
                      field: primaryfield,
                      oper: "=",
                      value: idvalue,
                      type: "int"
                    }]
                  },
                  dataType: 'text',
                  success: function (data) {
                    if (idactivo == idvalue) {
                      $(divChild).addClass("hidden");
                    }
                    datatable.ajax.reload((null, false));
                  },
                  error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                  }

                });
              }
              else {
                info("Seguridad Especial requerida, aun no implementada");
              }
              break;
          }
        }

      });
    }
  });

}

function padding_right(s, c, n) {
  if (!s || !c || s.length >= n) {
    return s;
  }
  var max = (n - s.length) / c.length;
  for (var i = 0; i < max; i++) {
    s += c;
  }
  return s;
}

function roundup(v) {
  var v10 = v * 1.10;
  var str = parseInt(v10.toString()[0]) + 1;
  var largo = v10.toString().split(".")[0].length - 1;
  return parseInt(padding_right(str.toString(), '0', str.toString().length + largo));
}

function validar(form) {
  return $(form).smkValidate();
}

/*function checkTime(this_time){
  var check = new Date - this_time;
  console.log("tiempo:"+check);
  if(check>=0){
      logout();
  }
}
*/

function updateFieldBoolean(realTableName, tableName, primary, field, search, reporte, idComponent) {
  var elementos = {}
  elementos["campos"] = [];
  elementos["returnFields"] = [];
  elementos["realTableName"] = realTableName;
  elementos["tableName"] = tableName;
  elementos["primaryField"] = primary.field;
  elementos["operacion"] = "Modificar";
  elementos["types"] = "%s,%s".format(field.type, primary.type);
  var update = {}
  update[field.name] = field.value;
  elementos["campos"].push({
    update,
    "primaryValue": primary.value
  });
  $.ajax({
    url: 'php/operacion_multiple.php',
    dataType: 'json',
    type: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: elementos,
    success: function (data, textStatus, jQxhr) {
      if (data[0].tipo == "success") {
        var record = findObjectByKey(reporte.data, search.name, search.value);
        record[field.name] = (field.value) ? "t" : "f";
        $(idComponent).attr("checked", (record[field.name] == 't'));
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

function confirmarModificar(tabla) {
  var argumentos = arguments;
  btnSi = (argumentos[1].btnSi !== undefined) ? argumentos[1].btnSi : "#btnNinguno";
  Lobibox.confirm({
    closeButton: false,
    title: (argumentos[1].titulo !== undefined) ? (argumentos[1].titulo) : "Confirmación",
    msg: (argumentos[1].msg !== undefined) ? argumentos[1].msg : "No hay Mensaje",
    buttonsAlign: 'right',
    buttons: {
      Yes: {
        text: 'Ingresar Nuevo',
        'class': 'btn btn-danger',
        closeOnClick: true
      },
      No: {
        text: 'Modificar Actual',
        'class': 'btn btn-success',
        closeOnClick: true
      },
    },
    callback: function (lobibox, type) {
      switch (type) {
        case 'Yes':
          $(btnSi).trigger("click");
          break;
        case 'No':
          tabla.row(':eq(0)', { page: 'current' }).select();
          break;
      }
    }

  });
}

function copiarPrecio(tabla) {
  var argumentos = arguments;
  btnSi = (argumentos[1].btnSi !== undefined) ? argumentos[1].btnSi : "#btnNinguno";
  Lobibox.confirm({
    closeButton: false,
    title: (argumentos[1].titulo !== undefined) ? (argumentos[1].titulo) : "Confirmación",
    msg: (argumentos[1].msg !== undefined) ? argumentos[1].msg : "No hay Mensaje",
    buttonsAlign: 'right',
    buttons: {
      Yes: {
        text: 'Si',
        'class': 'btn btn-danger',
        closeOnClick: true
      },
      No: {
        text: 'No',
        'class': 'btn btn-success',
        closeOnClick: true
      },
    },
    callback: function (lobibox, type) {
      switch (type) {
        case 'Yes':
          $(btnSi).trigger("click");
          break;
        case 'No':

          break;
      }
    }

  });
}

function guardar_log(idclave, tabla, operacion, detalle, idusuario) {
  //event.preventDefault();
  var elementos = {}
  elementos["campos"] = [];
  elementos["returnFields"] = [];
  elementos["tableName"] = "public.logs";
  elementos["operacion"] = "Ingresar";
  elementos["campos"].push({
    "idclave": idclave,
    "idusuario": idusuario,
    "tabla": tabla,
    "operacion": operacion,
    "detalle": detalle
  });
  elementos["returnFields"].push("idlog");
  console.log(elementos);
  $.ajax({
    url: '../php/operacion_multiple.php?log',
    dataType: 'json',
    type: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: elementos,
    success: function (data, textStatus, jQxhr) {
      if (data[0].tipo == "success") {
      }
      else {
        console.log(data);
        error2({
          msg: data[0].mesg,
        });
      }
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(jqXhr);
      //console.log(jqXhr);
      //error2({
      //  msg: "error en log",
     // });
    }
  });
}

function GraficoMontoConsumo(idmedidor, idusuario, fecha, meses, barGraph, temporal) {
  //$("#container-loading-%s".format(medidor.idwidget)).removeClass("hidden");
  var title = (temporal.title !== undefined) ? temporal.title : '';
  $.ajax({
    url: 'php/data.php?medidor=' + idmedidor, // Use href attribute as URL
    type: "post",
    data: {
      queries: [{   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
        fieldsSelect: ["*"],
        tableName: "control.ultimosconsumosunificado(%s,%s,'%s',%s,'15MIN')".format(idmedidor, meses, fecha, idusuario),
        orderby: [{ field: 'ano', type: "asc" }, { field: 'mes', type: 'asc' }],
      },
      ]
    },
  })
    .then(function (data) {
      var arrLabels = [];
      var arrDatosDinero = [];
      var arrDatosEnergia = [];
      var arrColorDinero = [];
      var arrColorEnergia = [];
      data[0].resultados.map(function (element, index) {
        arrLabels.push(element.nombremes);
        arrDatosEnergia.push(element.total);
        arrDatosDinero.push(Math.round(element.totalconsumo * 1.19));
        arrColorEnergia.push('rgba(27,109,193,0.8)');
        arrColorDinero.push('rgba(215,210,0,0.8)');

      });
      if (temporal.temporal) {
        arrLabels.push(temporal.mes);
        arrDatosEnergia.push(temporal.total);
        arrDatosDinero.push(temporal.totalconsumo * 1.19);
      }
      //$("#medidorUltimos%s".format(medidor.idwidget)).html(data[1].resultados[0].codigo+' '+data[1].resultados[0].cons_nombre+' '+data[1].resultados[0].espa_nombre);  
      barGraph.data.labels = arrLabels;
      barGraph.data.datasets[1].data = arrDatosDinero;
      barGraph.data.datasets[1].backgroundColor = 'rgba(215,210,0,0.8)';
      barGraph.data.datasets[1].borderColor = 'rgba(215,210,0,0.8)';
      barGraph.data.datasets[1].label = 'Boleta (CLP)';
      barGraph.data.datasets[0].data = arrDatosEnergia;
      barGraph.data.datasets[0].backgroundColor = 'rgba(27,109,193,0.8)';
      barGraph.data.datasets[0].borderColor = 'rgba(27,109,193,0.8)';
      barGraph.data.datasets[0].label = 'Energía (kWh)';
      barGraph.options.title.text = title;
      if (!(temporal.temporal)) {
        barGraph.options.legend.display = true;
      }
      barGraph.update();
      //$("#container-loading-%s".format(medidor.idwidget)).addClass("hidden");*/

    })
    .fail(function (xhr, textStatus, errorThrown) {
      error2({
        msg: errorThrown
      });
    })
    .done(function (xhr) {
      var index = xhrPool.indexOf(xhr);
      if (index > -1) {
        xhrPool.splice(index, 1);
      }
    });
}

function selectAnos(idSelect, desde, hasta = moment().format('YYYY')) {
  var years = '';
  for (year = desde; year <= hasta; year++) {
    yearTmp = (year != hasta) ? "%s,".format(year) : "%s".format(year);
    years = years + yearTmp;
  }

  selectJs2(
    idSelect,
    {
      value: "ano",
      show: {
        fields: ["ano"],
        format: "%s"
      },
      hide: ["ano"],
      queries: [{
        fieldsSelect: ["*"],
        tableName: "(select UNNEST(array[%s]) as ano) as database".format(years),
        orderby: [{
          field: "ano",
          type: "desc"
        }],
      }],
    }
  );

}





; (function ($) {
  if ($.fn.datepicker !== undefined) {
    $.fn.datepicker.language['es'] = {
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yyyy',
      timeFormat: 'hh:ii aa',
      firstDay: 1
    };
  }
})(jQuery);