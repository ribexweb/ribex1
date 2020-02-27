
 
  /*$('input[type="checkbox"]').iCheck({
      checkboxClass: 'icheckbox_flat-green',
  })*/

  function formatColor (state) {
    if (!state.id) { return state.text; }
    var $color = $(
      '<span class="pantone-color-block '+state.text+'"></span><span>' + state.text + '</span>'
    );
    return $color;
  };

  //$(".my-colorpicker2").colorpicker();


  $(document).ready(function(){
   /* if (!blog.isFirstLoad(blog.comments, "code20.js")) {
      return;
    }*/
    $('.select2').select2();

    $(".selectColor").select2({
		  templateResult: formatColor,
		  templateSelection: formatColor,
    });
    
      cargarEdificios("#SelectEdificioUAMA",edificios,-1);
      cargarEdificios("#SelectEdificioPD",edificios,-1);
      cargarEdificios("#SelectEdificioEM",edificios,-1);
      cargarEdificios("#SelectEdificioUC",edificios,-1);
      cargarEdificios("#SelectEdificioPA",edificios,-1);
      cargarEdificios("#SelectEdificioUCD",edificios,-1);
      cargarEdificios("#SelectEdificioCED",edificios,-1);

    $("#SelectTipoWidget").change(function(){
      $(".widgets").addClass("hidden");
      $("#%s".format($(this).find(":selected").select2().data("widget"))).removeClass("hidden");
    });

    $("#SelectEdificioPA").change(function(){
      cargarMedidores("#SelectMedidorPA",$(this).val(),-1,usuarioActivo);
    });

    $("#SelectEdificioEM").change(function(){
      cargarMedidores("#SelectMedidorEM",$(this).val(),-1,usuarioActivo);
    });

    $("#SelectEdificioPD").change(function(){
      cargarMedidores("#SelectMedidorPD",$(this).val(),-1,usuarioActivo);
    });

    $("#SelectEdificioUC").change(function(){
      cargarMedidores("#SelectMedidorUC",$(this).val(),-1,usuarioActivo);
    });

    $("#SelectEdificioUCD").change(function(){
      cargarMedidores("#SelectMedidorUCD",$(this).val(),-1,usuarioActivo);
    });

    $("#SelectEdificioCED").change(function(){
      cargarMedidores("#SelectMedidorCED",$(this).val(),-1,usuarioActivo);
    });

    //Accion en el Boton Nuevo Tablero
    $('#nuevoTablero').click(function(){
      $('#FormaTablero')[0].reset();
      $('.modal-title-tablero').text("Ingresar Nuevo Tablero");
      $('#btnAccionTablero').val("Ingresar");
      $('#textOperacionTablero').val("Ingresar");
    });

    //Accion en el Boton Nuevo Widget
    $('#nuevoWidget').click(function(){
      $('#FormaWidget')[0].reset();
      $('.modal-title-widget').text("Ingresar Nuevo Widget");
      $('#btnAccionWidget').val("Ingresar");
      $('#textOperacionWidget').val("Ingresar");
      $("#textIddashboard").val($(this).attr("data-iddashboard"));
      $("#SelectTipoWidget").change();
      $("#SelectTipoWidget").attr("disabled",false);
      $(".icheckbox_flat-green").removeClass('checked');
      var values=$("#FormaWidget").find(":input").map(function(){
        $(this).change();
      });
    });

    //Accion en el Boton Modificar Tablero
    $(document).on('click', '.update_dashboards', function(){
      var id = $(this).attr("id");
      $.ajax({
        url:"php/fetch-single.php",
        method:"POST",
        data:{
          primaryValue: id,
          tableName:"control.dashboards",
          primaryField: "iddashboard",
        },
        dataType:"json",
        success:function(data)
        {
          $('#tableroModal').modal('show');
          $('#textNombreTablero').val(data.nombre);
          $("#textNombreTablero").parent().parent().removeClass("has-error");
          $('.modal-title-tablero').text("Actualizar Tablero");
          $('#textIdDashboard').val(data.iddashboard);
          $('#chkActivoTablero').prop('checked', data.activo);
          if ($('#chkActivoTablero').is(':checked')) {
            $(".icheckbox_flat-green").addClass('checked');
          }
          else{
            $(".icheckbox_flat-green").removeClass('checked');
          }
          $('#btnAccionTablero').val("Actualizar");
          $('#textOperacionTablero').val("Actualizar");
        }
      });
    });
  
    //Accion en el Boton Modificar Widget
    $(document).on('click', '.update_vwidgets3', function(){
      var id = $(this).attr("id");
      $.ajax({
        url:"php/fetch-single.php",
        method:"POST",
        data:{
          fields:"*,array_to_json(datos) as json",
          primaryValue: id,
          tableName:"control.vwidgets3",
          primaryField: "idwidget",
        },
        dataType:"json",
        success:function(data)
        {
          console.log(data);


          $('#FormaWidget')[0].reset();
          $('.modal-title-widget').text("Actualizar Widget");
          $('#btnAccionWidget').val("Modificar");
          $('#textOperacionWidget').val("Modificar");
          $("#textIddashboard").val(data.iddashboard);
          $("#SelectTipoWidget").val(data.tipo).change();
          $("#SelectTipoWidget").attr("disabled",true);
          $('#chkActivoWidget').prop('checked', data.activo);
          $("#textIdwidget").val(data.idwidget);
          $("#textidTipowidget").val(data.idtipowidget);
          if ($('#chkActivoWidget').is(':checked')) {
           $(".icheckbox_flat-green").addClass('checked');
          }
          else{
           $(".icheckbox_flat-green").removeClass('checked');
          }
          var datos = jQuery.parseJSON(data.json);
          switch (data.tipo) {
            case 1,2: $("#SelectEdificioUAMA").val(parseInt(datos[0])).trigger("change");
                      $("#SelectColorUAMA").val(datos[2]).trigger("change");
                      break;
            case 3: 
                      if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioPA").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorPA',parseInt(datos[datos.length-1]),parseInt(datos[0]),usuarioActivo);
                      }
                      else {
                       $("#SelectMedidorPA").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectColorPA").val(datos[2]).trigger("change");
                      break;
            case 4:   if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioPD").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorPD',parseInt(datos[datos.length-1]),parseInt(datos[0]),usuarioActivo);
                      }
                      else {
                       $("#SelectMedidorPD").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectTamanoPD").val(data.tamano).trigger("change");
                      $("#CPColorHoyPD").val(datos[3]).parent().children("div").children("i").css("background-color",datos[3]);
                      $("#CPColorAyerPD").val(datos[4]).parent().children("div").children("i").css("background-color",datos[4]);;
                      break;
            case 5:   if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioUC").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorUC',parseInt(datos[datos.length-1]),parseInt(datos[0]),usuarioActivo);
                      }
                      else {
                       $("#SelectMedidorUC").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectTamanoUC").val(data.tamano).trigger("change");
                      $("#SelectMesesUC").val(datos[2]).trigger("change");
                      $("#CPColorUltimoUC").val(datos[3]).parent().children("div").children("i").css("background-color",datos[3]);
                      $("#CPColorTodosUC").val(datos[4]).parent().children("div").children("i").css("background-color",datos[4]);;
                      break;
            case 6:   if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioEM").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorEM',parseInt(datos[datos.length-1]),parseInt(datos[0])),usuarioActivo;
                      }
                      else {
                       $("#SelectMedidorEM").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectTamanoEM").val(data.tamano).trigger("change");
                      break;

            case 7:   if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioUCD").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorUCD',parseInt(datos[datos.length-1]),parseInt(datos[0]),usuarioActivo);
                      }
                      else {
                       $("#SelectMedidorUCD").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectTamanoUCD").val(data.tamano).trigger("change");
                      $("#SelectMesesUCD").val(datos[2]).trigger("change");
                      $("#CPColorUCD").val(datos[3]).parent().children("div").children("i").css("background-color",datos[3]);
                      break;
            case 8:   if (datos[datos.length-1] != 'Virtual') {
                        $("#SelectEdificioCED").val(parseInt(datos[datos.length-1])).trigger("change");
                        cargarMedidores('#SelectMedidorCED',parseInt(datos[datos.length-1]),parseInt(datos[0]),usuarioActivo);
                      }
                      else {
                       $("#SelectMedidorCED").val(datos[0]).trigger("change"); 
                      }
                      $("#SelectTamanoCED").val(data.tamano).trigger("change");
                      $("#SelectMesesCED").val(datos[2]).trigger("change");
                      $("#CPColorDineroCED").val(datos[3]).parent().children("div").children("i").css("background-color",datos[3]);
                      $("#CPColorEnergiaCED").val(datos[4]).parent().children("div").children("i").css("background-color",datos[4]);;
                      break;
                    
          }
          $('#widgetModal').modal('show');
        }
      });
    });


    $(document).on('click', '.delete_dashboards', function(){
      var id = $(this).attr("id");
      var a = confirmar(dataTable,
                        { prompt : false,
                          idactivo:dashboardActivo,
                          divChild: "#divForma",
                          tablename:"control.dashboards",
                          primaryfield : "iddashboard",
                          idvalue: id,
                        });
    });

    $(document).on('click', '.delete_vwidgets3', function(){
      var id = $(this).attr("data-idwidget");
      var a = confirmar(dataTableWidget,
                        {prompt:false,
                         tablename:"control.widgets",
                         primaryfield : "idwidget",
                         idvalue: id,
                        });
    });

    //Accion al darle al Boton Ingresar o Modificar Tablero
    $(document).on('submit', '#FormaTablero', function(event){
      event.preventDefault();
      var elementos = {}
      elementos["campos"] = {};
      var values=$("#FormaTablero").find(":input").map(function(){
        if ($(this).data("field") !== undefined) {
          if ($(this).data("field") != 'activo') {
            if ($(this).data("primary") === undefined) {
              elementos["campos"][$(this).data("field")] = $(this).val();
            }
          }
          else {
            elementos["campos"][$(this).data("field")] = $(this).is(':checked');
          }
        }  
      });
      elementos["primaryField"] = "iddashboard";
      elementos["primaryValue"] = $("#textIdDashboard").val();
      elementos["tableName"] = "control.dashboards";
      elementos["operacion"] = $("#textOperacionTablero").val();
      var nombre = $("#textNombreTablero").val();
      if(nombre != '')
      {
        $.ajax({
          url: 'php/operacion.php',
          dataType: 'text',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          data: elementos,
          success: function( data, textStatus, jQxhr ){
              success( data );
              //console.log(data);
              dataTable.ajax.reload(null, false);
          },
          error: function( jqXhr, textStatus, errorThrown ){
              alert( errorThrown );
          }
        });
      }
      else
      {
        error("Campo Nombre es Requerido");
        $("#textNombreTablero").parent().parent().addClass("has-error");
      }
    });

    //Accion al darle al Boton Ingresar o Modificar Widget
    $(document).on('submit', '#FormaWidget', function(event){
      event.preventDefault();
      var elementos = {}
      elementos["widgets"] = {};
      elementos["widgets"]["schemaName"] = "control";
      elementos["widgets"]["tableName"] = "widgets";
      elementos["widgets"]["showMsg"] = 1;
      elementos["widgets"]["primaryField"] = "idwidget";
      elementos["widgets"]["primaryValue"] = $("#textIdwidget").val();
      elementos["widgets"]["campos"] = {};
      elementos["widgets"]["campos"]["iddashboard"] = $("#textIddashboard").val();
      elementos["widgets"]["campos"]["activo"] = $("#chkActivoWidget").is(':checked');

      //console.log("tipo widget:"+$("#SelectTipoWidget").val());
      switch ($("#SelectTipoWidget").val()) {
        case "1":
          elementos["widgets"]["campos"]["tamano"] = 3;
          elementos["wgsmedidoresactivos"] = {};
          elementos["wgsmedidoresactivos"]["schemaName"] = "control";
          elementos["wgsmedidoresactivos"]["tableName"] = "wgsmedidoresactivos";
          elementos["wgsmedidoresactivos"]["showMsg"] = 0;
          elementos["wgsmedidoresactivos"]["primaryField"] = "idwgmedidoresactivos";
          elementos["wgsmedidoresactivos"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgsmedidoresactivos"]["campos"] = {};
          elementos["wgsmedidoresactivos"]["campos"]["idedificio"] = $("#SelectEdificioUAMA").val();
          elementos["wgsmedidoresactivos"]["campos"]["backgroundcolor"] = $("#SelectColorUAMA").val();
          elementos["wgsmedidoresactivos"]["campos"]["idwidget"] = {};
          elementos["wgsmedidoresactivos"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgsmedidoresactivos"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgsmedidoresactivos"]["campos"]["idwidget"]["foreignField"] = "idwidget";
          break; 
        case "2":
          elementos["widgets"]["campos"]["tamano"] = 3; 
          elementos["wgsultimaactualizacion"] = {};

          elementos["wgsultimaactualizacion"]["campos"] = {};
          elementos["wgsultimaactualizacion"]["schemaName"] = "control";
          elementos["wgsultimaactualizacion"]["tableName"] = "wgsultimaactualizacion";
          elementos["wgsultimaactualizacion"]["showMsg"] = 0;
          elementos["wgsultimaactualizacion"]["primaryField"] = "idwgultimaactualizacion";
          elementos["wgsultimaactualizacion"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgsultimaactualizacion"]["campos"]["idedificio"] = $("#SelectEdificioUAMA").val();
          elementos["wgsultimaactualizacion"]["campos"]["backgroundcolor"] = $("#SelectColorUAMA").val();
          elementos["wgsultimaactualizacion"]["campos"]["idwidget"] = {};
          elementos["wgsultimaactualizacion"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgsultimaactualizacion"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgsultimaactualizacion"]["campos"]["idwidget"]["foreignField"] = "idwidget";
          break;  
        case "3":
          elementos["widgets"]["campos"]["tamano"] = 3;
          elementos["wgspotenciaactual"] = {};
          elementos["wgspotenciaactual"]["schemaName"] = "control";
          elementos["wgspotenciaactual"]["tableName"] = "wgspotenciaactual";
          elementos["wgspotenciaactual"]["showMsg"] = 0;
          elementos["wgspotenciaactual"]["primaryField"] = "idwgpotenciaactual";
          elementos["wgspotenciaactual"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgspotenciaactual"]["campos"] = {}; 
          elementos["wgspotenciaactual"]["campos"]["idmedidor"] = $("#SelectMedidorPA").val();
          elementos["wgspotenciaactual"]["campos"]["backgroundcolor"] = $("#SelectColorPA").val();
          elementos["wgspotenciaactual"]["campos"]["idwidget"] = {};
          elementos["wgspotenciaactual"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgspotenciaactual"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgspotenciaactual"]["campos"]["idwidget"]["foreignField"] = "idwidget";
          break;
        case "4": 
          elementos["widgets"]["campos"]["tamano"] = $("#SelectTamanoPD").val();
          elementos["wgspotenciadia"] = {};
          elementos["wgspotenciadia"]["schemaName"] = "control";
          elementos["wgspotenciadia"]["tableName"] = "wgspotenciadia";
          elementos["wgspotenciadia"]["showMsg"] = 0;
          elementos["wgspotenciadia"]["primaryField"] = "idwgpotenciadia";
          elementos["wgspotenciadia"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgspotenciadia"]["campos"] = {};           
          elementos["wgspotenciadia"]["campos"]["idmedidor"] = $("#SelectMedidorPD").val(); 
          elementos["wgspotenciadia"]["campos"]["backgroundcolortoday"] = $("#CPColorHoyPD").val();
          elementos["wgspotenciadia"]["campos"]["backgroundcoloryesterday"] = $("#CPColorAyerPD").val();
          elementos["wgspotenciadia"]["campos"]["idwidget"] = {};
          elementos["wgspotenciadia"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgspotenciadia"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgspotenciadia"]["campos"]["idwidget"]["foreignField"] = "idwidget";
          break;
        case "5": 
          elementos["widgets"]["campos"]["tamano"] = $("#SelectTamanoUC").val();
          elementos["wgsultimosconsumos"] = {};
          elementos["wgsultimosconsumos"]["schemaName"] = "control";
          elementos["wgsultimosconsumos"]["tableName"] = "wgsultimosconsumos";
          elementos["wgsultimosconsumos"]["showMsg"] = 0;
          elementos["wgsultimosconsumos"]["primaryField"] = "idwgultimosconsumos";
          elementos["wgsultimosconsumos"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgsultimosconsumos"]["campos"] = {}; 
          elementos["wgsultimosconsumos"]["campos"]["idmedidor"] = $("#SelectMedidorUC").val(); 
          elementos["wgsultimosconsumos"]["campos"]["meses"] = $("#SelectMesesUC").val();
          elementos["wgsultimosconsumos"]["campos"]["backgroundcolorlast"] = $("#CPColorUltimoUC").val();
          elementos["wgsultimosconsumos"]["campos"]["backgroundcolor"] = $("#CPColorTodosUC").val();
          elementos["wgsultimosconsumos"]["campos"]["idwidget"] = {};
          elementos["wgsultimosconsumos"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgsultimosconsumos"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgsultimosconsumos"]["campos"]["idwidget"]["foreignField"] = "idwidget"
          break;
        case "6": 
          elementos["widgets"]["campos"]["tamano"] = $("#SelectTamanoEM").val();
          elementos["wgsenergiames"] = {};
          elementos["wgsenergiames"]["schemaName"] = "control";
          elementos["wgsenergiames"]["tableName"] = "wgsenergiames";
          elementos["wgsenergiames"]["showMsg"] = 0;
          elementos["wgsenergiames"]["primaryField"] = "idwgenergiames";
          elementos["wgsenergiames"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgsenergiames"]["campos"] = {};          
          elementos["wgsenergiames"]["campos"]["idmedidor"] = $("#SelectMedidorEM").val(); 
          elementos["wgsenergiames"]["campos"]["idwidget"] = {};
          elementos["wgsenergiames"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgsenergiames"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgsenergiames"]["campos"]["idwidget"]["foreignField"] = "idwidget";
          break;
        case "7": 
          elementos["widgets"]["campos"]["tamano"] = $("#SelectTamanoUCD").val();
          elementos["wgsultimosconsumosdinero"] = {};
          elementos["wgsultimosconsumosdinero"]["schemaName"] = "control";
          elementos["wgsultimosconsumosdinero"]["tableName"] = "wgsultimosconsumosdinero";
          elementos["wgsultimosconsumosdinero"]["showMsg"] = 0;    
          elementos["wgsultimosconsumosdinero"]["primaryField"] = "idwgultimosconsumosdinero";
          elementos["wgsultimosconsumosdinero"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgsultimosconsumosdinero"]["campos"] = {}; 
          elementos["wgsultimosconsumosdinero"]["campos"]["idmedidor"] = $("#SelectMedidorUCD").val(); 
          elementos["wgsultimosconsumosdinero"]["campos"]["meses"] = $("#SelectMesesUCD").val();
          elementos["wgsultimosconsumosdinero"]["campos"]["backgroundcolor"] = $("#CPColorUCD").val();
          elementos["wgsultimosconsumosdinero"]["campos"]["idwidget"] = {};
          elementos["wgsultimosconsumosdinero"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgsultimosconsumosdinero"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgsultimosconsumosdinero"]["campos"]["idwidget"]["foreignField"] = "idwidget"
          break;
        case "8": 
          elementos["widgets"]["campos"]["tamano"] = $("#SelectTamanoCED").val();
          elementos["wgscomparacionconsumosdinero"] = {};
          elementos["wgscomparacionconsumosdinero"]["schemaName"] = "control";
          elementos["wgscomparacionconsumosdinero"]["tableName"] = "wgscomparacionconsumosdinero";
          elementos["wgscomparacionconsumosdinero"]["showMsg"] = 0;    
          elementos["wgscomparacionconsumosdinero"]["primaryField"] = "idwgcomparacionconsumosdinero";
          elementos["wgscomparacionconsumosdinero"]["primaryValue"] = $("#textidTipowidget").val();
          elementos["wgscomparacionconsumosdinero"]["campos"] = {}; 
          elementos["wgscomparacionconsumosdinero"]["campos"]["idmedidor"] = $("#SelectMedidorCED").val(); 
          elementos["wgscomparacionconsumosdinero"]["campos"]["meses"] = $("#SelectMesesCED").val();
          elementos["wgscomparacionconsumosdinero"]["campos"]["backgroundcolordinero"] = $("#CPColorDineroCED").val();
          elementos["wgscomparacionconsumosdinero"]["campos"]["backgroundcolorenergia"] = $("#CPColorEnergiaCED").val();
          elementos["wgscomparacionconsumosdinero"]["campos"]["idwidget"] = {};
          elementos["wgscomparacionconsumosdinero"]["campos"]["idwidget"]["foreign"] = true;
          elementos["wgscomparacionconsumosdinero"]["campos"]["idwidget"]["table"] = "widgets";
          elementos["wgscomparacionconsumosdinero"]["campos"]["idwidget"]["foreignField"] = "idwidget"
          break;

      }
      /*elementos["dashboards_widgets"] = {};
      elementos["dashboards_widgets"]["tableName"] = "dashboards_widgets";
      elementos["dashboards_widgets"]["showMsg"] = 1;
      elementos["dashboards_widgets"]["primaryField"] = "iddashboardwidget";
      elementos["dashboards_widgets"]["primaryValue"] = $("#textiddashboardwidget").val();
      elementos["dashboards_widgets"]["campos"] = {};
      elementos["dashboards_widgets"]["campos"]["iddashboard"] = $("#textIddashboard").val();
      elementos["dashboards_widgets"]["campos"]["activo"] = $("#chkActivoWidget").is(':checked');
      elementos["dashboards_widgets"]["campos"]["idwidget"] = {};
      elementos["dashboards_widgets"]["campos"]["idwidget"]["foreign"] = true;
      elementos["dashboards_widgets"]["campos"]["idwidget"]["table"] = "widgets";
      elementos["dashboards_widgets"]["campos"]["idwidget"]["foreignField"] = "idwidget";*/
 
      elementos["operacion"] = $("#textOperacionWidget").val();
      console.log(elementos);
      $.ajax({
        url: 'php/operacion_compuesta.php',
        dataType: 'json',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: elementos,
        success: function( data, textStatus, jQxhr ){
          console.log(data);
          for (var indexData in data) {
            if (data[indexData].showMsg) {
              switch (data[indexData].tipo) {
                case "success" :  
                  success(data[indexData].msg);
                  dataTableWidget.ajax.reload(null, false);
                  break;
                case "error":
                  error(data[indexData].msg);
                  break;  
              }
            }
          }
            
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert( errorThrown );
        }
      });      

    });

    //Procedimiento Cargar Select de Edificios
    function cargarEdificios(controlEdificio,edificios,indexSelected){
      if (edificios != '') { //Si tiene uno o varios edificios en permisologia
        selectJs2(
          controlEdificio,
          { Selected:indexSelected,
            value: "idedificio",
            show: {
              fields:["nombre"],
            },
            hide: ["identidad"],
            queries:[{
              fieldsSelect:["idedificio","nombre"],
              tableName   :"mediciones.vedificios",
              orderby:[{
                field:"nombre",
                type : "asc"
              }],
              where  :[{
                field  :"activo",
                oper   :"=",
                value  :"true",
                type   :"int",       
              },
              {
                logical:"and",
                field  :"idedificio",
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
    }    

    //Procedimiento Cargar Select de Medidores
    function cargarMedidores(control,idedificio,indexSelected,idusuario){
      if (edificios != '') { //Si tiene uno o varios edificios en permisologia
        selectJs2(
          control,
          { Selected:indexSelected,
            value: "idmedidor",
            show: {
                fields:["codigo","cons_nombre","espa_nombre"],
                format: "%s | %s | %s"
            },
            hide: ["idmedidorfisico"],
            queries:[{
              fieldsSelect: ["idmedidor","idmedidorfisico","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
              tableName   :"mediciones.medidores_permisados(%s,%s)".format(idedificio,idusuario),
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
          {
          }    
        );
      }
    }  

    $("#cerrarForma").click(function(){
      $("#divForma").addClass("hidden");
    });

    //Accion al cambiar el tipo de Widget
    $("#SelectTipoWidget").bind('change',function(){
      $(this).find(':selected').data('datos');
    });

    $("#add").click(function(){
      $("#divForma").removeClass("hidden");
      $("#formtitle").html('Configurar Nuevo Tablero');
      $('#Forma')[0].reset();
      $('#btnAccion').val("Ingresar");
      $('#textOperacion').val("Ingresar");
    });

    //Accion al activar o desactivar un tablero directamente en la Tabla
    $(document).on('click','.booleano_activo_dashboards',function(){
      if (!(isboolean)) { 
        isboolean = true;
        var id = $(this).attr("id");
        var activo = $(this).hasClass('btn-success');
        $.ajax({
          url:"php/updateField.php",
          method:"POST",
          data:{
            tableName:"control.dashboards",
            primaryField: "iddashboard",
            primaryValue:id,
            fieldName:'activo',
            fieldValue:!(activo),
          },
          dataType:'text',
          success:function(data){
            success( data );
              dataTable.ajax.reload(null, false);
              isboolean = false;
          }
        });
      }  
    });
    //Accion al activar o desactivar un widget directamente en la tabla
    $(document).on('click','.booleano_activo_vwidgets3',function(){
      console.log('Entrando a booleano activo vwidgets3');
      var id = $(this).attr("id");
      var activo = $(this).hasClass('btn-success');
      $.ajax({
        url:"php/updateField.php",
        method:"POST",
        data:{
          tableName:"control.widgets",
          primaryField: "idwidget",
          primaryValue:id,
          fieldName:'activo',
          fieldValue:!(activo),
        },
        dataType:'text',
        fail:function(data){
          console.log('Fallo:'+data);
        },
        success:function(data){
          success( data );
            dataTableWidget.ajax.reload(null, false);
        }
      });
    });

    $(document).on('click','.posicion_dashboards',function(){
      var id = $(this).attr("id");
      var operacion = $(this).data("operacion");
      var posicion = $(this).data("posicion");
      $.ajax({
        url:"php/changePosicion.php",
        async: true,
        method:"POST",
        data:{
          tableName:"control.dashboards",
          idGroupField: "idusuario",
          idGroupValue: usuarioActivo,
          primaryField: "iddashboard",
          primaryValue:id,
          posicion:posicion,
          operacion:operacion,
        },
        dataType:'text',
        success:function(data){
            //alert( data );
            dataTable.ajax.reload(null, false);
        }
      });      
    });

    $(document).on('click','.posicion_vwidgets3',function(){
      var id = $(this).attr("id");
      var operacion = $(this).data("operacion");
      var posicion = $(this).data("posicion");
      var iddashboard = $(this).data("iddashboard");
      $.ajax({
        url:"php/changePosicion.php",
        method:"POST",
        data:{
          tableName:"control.widgets",
          idGroupField: "iddashboard",
          idGroupValue: iddashboard,
          primaryField: "idwidget",
          primaryValue:id,
          posicion:posicion,
          operacion:operacion,
        },
        dataType:'text',
        success:function(data){
            dataTableWidget.ajax.reload(null, false);
        }
      });      
    });


  
    function cargarEdificios(controlEdificio,edificios,indexSelected){
      if (edificios != '') { //Si tiene uno o varios edificios en permisologia
        selectJs2(
          controlEdificio,
          { Selected:indexSelected,
            value: "idedificio",
            show: {
              fields:["nombre"],
            },
            hide: ["identidad"],
            queries:[{
              fieldsSelect:["idedificio","nombre"],
              tableName   :"mediciones.vedificios",
              orderby:[{
                field:"nombre",
                type : "asc"
              }],
              where  :[{
                field  :"activo",
                oper   :"=",
                value  :"true",
                type   :"int",       
              },
              {
                logical:"and",
                field  :"idedificio",
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
    }

    function cargarMedidoresFisicos(controlMedidor,edificio,indexSelected){
      selectJs2(
        controlMedidor,
        { Selected:indexSelected,
          value: "idmedidorfisico",
          show: {
              fields:["codigo","cons_nombre","espa_nombre"],
              format: "%s | %s | %s"
          },
          hide: ["idmedidor","codigo"],
          queries:[{
              fieldsSelect: ["idmedidorfisico","codigo","cons_nombre","espa_nombre","idmedidor"],
              tableName   :"mediciones.vmedidores",
              orderby:[{
                  field:"idmedidor",
                  type : "asc"
              }],
              where  :[{
                  field  :"asig_activo",
                  oper   :"=",
                  value  :"true",
                  type   :"int",
                      
              },
              {
                  logical:"and",
                  field  :"idedificio",
                  oper   :"=",
                  value  :edificio,
                  type   :"int",  
              }]        
          }],
        },
        {
        }    
      );
    }


    $(document).on('click', '.widgets_dashboards', function(){
      $("#divForma").removeClass("hidden");
      $("#tablawidgets tbody").empty();
      dashboardActivo = $(this).attr("id");
      $("#nuevoWidget").attr("data-iddashboard",dashboardActivo);
      $.ajax({
        url:"php/data.php",
        method:"POST",
        data:{
            queries:[{
              fieldsSelect:["*"],
              tableName   :"control.dashboards",
              where  :[{
                field  :"iddashboard",
                oper   :"=",
                value  :dashboardActivo,
                type   :"int",
              }],      
            }],
        },
        dataType:'json',
        success:function(data){
        
          $("#formtitle").html('Lista de Widgets para %s'.format(data[0].resultados[0].nombre));

          dataTableWidget = $('#tablawidgets').DataTable({
            destroy:true,
            "processing":false,
            //"serverSide":true,
            "order":[],
            "ajax":{
              url:"php/getTable.php",
              error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
              },
              type: "POST",
              data:{ 
                primaryField: "idwidget",
                hide:["idwidget"],
                show: {
                  fields:["tipotexto","datos","posicion","activo"],
                  group:["iddashboard"],
                  realtablename:"vwidgets3",
                },
                queries:[{
                  fieldsSelect:["*"],
                  tableName   :"control.vwidgets3",
                  orderby:[{
                    field:"posicion",
                    type : "asc"
                  }],
                  where  :[
                  { field:"iddashboard",
                    oper:"=",
                    value:dashboardActivo,
                    type: "int"
                  }],     
                }],
                //otrosbotones:[{nombre:"widgets",tipo:"btn-info",accion:"widgets",icono:"fa-map"}],
              }
            },
            "columnDefs":[
            {
              "targets":[-1,-2,-3],
              "orderable":false,
            },
            {
              "targets":[-1,-2,-3],
              "className": "text-center",
            }
            ],
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
          });

        } 
      });   
    });

  });  
