let tableros = { resultados: null, actual: 0 };
let widgets = { data: null };
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

let paginaActiva = { code: -1 };
var edificios = '';
let reporte = { activo: false, inicio: 0, final: 0 };
let dataSQL = { todo: null };

let tbMedidores = new Object({ fechas: [], Medidores: new Object() });
var isboolean = false;
let dataNueva = { todo: null };
let dataActual = { todo: null };

var timers = [];

var xhrPool = [];

var pdfData;

var separadorMiles = whatMilesSeparator();
var separadorDecimal = whatDecimalSeparator();

var globalSeparadorMiles = function (separador) {return (separador == '.')?/\./g:/\,/g};
var globalSeparadorDecim = function (separador) {return (separador == '.')?/\./g:/\,/g};

var buttonCommon = {
  init: function (dt, node, config) {
    var table = dt.table().context[0].nTable;
    if (table) {
      console.log($(table).data('export-title'));
      let title = ($(table).data('export-title') !== undefined)?$(table).data('export-title'):"Sin titulo";
      config.title = title;
      config.titleAttr = title;
      config.orientation =  ($(table).data('export-orientation') !== undefined)?$(table).data('export-orientation'):'portrait';
    }
  },
  title: 'default title'
};

$.extend( $.fn.dataTable.defaults, {
  "buttons": {  
    dom: {
      button: {
        tag: "button",
        className: "btn btn-default",
      }
    },
    buttons: [
      $.extend( true, {}, buttonCommon, {
        className: 'btn btn-default btn-primary',
        text: '<i class="fa fa-file-alt"></i>',
        extend: 'csvHtml5',
        titleAttr: 'Exportar a TXT',
        fieldBoundary: '',
        extension: ".txt",
        footer: true,
        exportOptions: {
          modifier: {
            selected: null
          }
        }
      } ),
      $.extend( true, {}, buttonCommon, {
          className: 'btn btn-default btn-info',
          text: '<i class="fa fa-file-csv"></i>',
          extend: 'csvHtml5',
          footer: true,
          titleAttr: 'Exportar a CSV',
          exportOptions: {
            modifier: {
              selected: null
            }
          }
      } ),
      $.extend( true, {}, buttonCommon, {
        className: "btn-success",
        extend: 'excelHtml5',
        title: 'Exportar a XLS',
        text: '<i class="fa fa-file-excel"></i>',
        titleAttr: 'Exportar a XLS',
        footer: true,
        customize: function( xlsx ) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          $('row:nth-child(2) c', sheet).attr( 's', '42' );
          //$('row:last c', sheet).attr( 's', '42' );
        },
        exportOptions: {
          orthogonal: 'export',
          modifier: {
            selected: null
          },
          columns: ':visible',
          format: {
            body: function (data, row, column, node) {
              data = $('<p>' + data + '</p>').text();
              //convertido = $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.toLocaleString():data;
              convertido = $.isNumeric(data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles)) ? data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles):data;
              console.log('body-> (original:'+data+')(convertido:'+convertido+')');
              return convertido;
              //return $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.replace(/\./g,'').replace(/,/g, '.') : data;
            },
            footer:function(data, row,column,node){
              data = $('<p>' + data + '</p>').text();
              //convertido = $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.toLocaleString():data;
              convertido = $.isNumeric(data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles)) ? data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles):data;
              console.log('footer-> (original:'+data+')(convertido:'+convertido+')');
              return convertido;
              //return $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.replace(/\./g,'').replace(/,/g, '.') : data;
            }
          }
        }
      } ),
      $.extend( true, {}, buttonCommon, {
        className: "btn-danger",
        extend: 'pdfHtml5',
        title: 'Exportar a PDF3',
        text: '<i class="fa fa-file-pdf"></i>',
        titleAttr: 'Exportar a PDF2',
        footer: true,
        pageSize : 'A3',
        customize: function (doc) {
          doc.content[1].margin = [10, 5, 5, 10]
          //doc.content[1].table.widths = 
          //    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
          console.log(doc.content[1].table.widths);    
        },

        exportOptions: {
          modifier: {
            selected: null
          }
        },

      } ),
      $.extend( true, {}, buttonCommon, {
        className: "btn-default",
        extend: 'print',
        title: 'Enviar a impresión',
        text: '<i class="fa fa-print"></i>',
        titleAttr: 'Enviar a impresión',
        footer: true,
        exportOptions: {
          modifier: {
            selected: null
          }
        }      
      })
    ]
  }
});


buttons = {
  dom: {
    button: {
      tag: "button",
      className: "btn btn-default",
    }
  },
  buttons: [
    {
      className: "btn-primary",
      extend: 'csvHtml5',
      title: 'Exportar a TXT',
      text: '<i class="fa fa-file-alt"></i>',
      titleAttr: 'Exportar a TXT',
      fieldBoundary: '',
      extension: ".txt",
      footer: true,
      exportOptions: {
        columns: ':visible',
        modifier: {
          selected: null
        }
      },
    },
    {
      className: "btn-info",
      extend: 'csvHtml5',
      title: 'Exportar a CSV',
      text: '<i class="fa fa-file-csv"></i>',
      titleAttr: 'Exportar a CSV',
      footer: true,
      exportOptions: {
        columns: ':visible',
        modifier: {
          selected: null
        }
      },
    },
    {
      className: "btn-success",
      extend: 'excelHtml5',
      title: 'Exportar a XLS',
      text: '<i class="fa fa-file-excel"></i>',
      titleAttr: 'Exportar a XLS',
      footer: true,
      customize: function( xlsx ) {
        var sheet = xlsx.xl.worksheets['sheet1.xml'];
        $('row:nth-child(2) c', sheet).attr( 's', '42' );
        //$('row:last c', sheet).attr( 's', '42' );
      },
      exportOptions: {
        orthogonal: 'export',
        modifier: {
          selected: null
        },
        columns: ':visible',
        format: {
          body: function (data, row, column, node) {
            data = $('<p>' + data + '</p>').text();
            //convertido = $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.toLocaleString():data;
            convertido = $.isNumeric(data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles)) ? data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles):data;
            //console.log('body-> (original:'+data+')(convertido:'+convertido+')');
            return convertido;
            //return $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.replace(/\./g,'').replace(/,/g, '.') : data;
          },
          footer:function(data, row,column,node){
            data = $('<p>' + data + '</p>').text();
            //convertido = $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.toLocaleString():data;
            convertido = $.isNumeric(data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles)) ? data.replace(globalSeparadorMiles,'').replace(globalSeparadorDecim, separadorMiles):data;
            //console.log('footer-> (original:'+data+')(convertido:'+convertido+')');
            return convertido;
            //return $.isNumeric(data.replace(/\./g,'').replace(/,/g, '.')) ? data.replace(/\./g,'').replace(/,/g, '.') : data;
          }
        }
      }
    },
    {
      className: "btn-danger",
      extend: 'pdfHtml5',
      title: 'Exportar a PDFY',
      text: '<i class="fa fa-file-pdf"></i>',
      titleAttr: 'Exportar a PDFX',
      footer: true,
      exportOptions: {
        columns: ':visible',
        modifier: {
          selected: null
        }
      }
    },
    {
      className: "btn-default",
      extend: 'print',
      title: 'Enviar a impresión',
      text: '<i class="fa fa-print"></i>',
      titleAttr: 'Enviar a impresión',
      footer: true,
      exportOptions: {
        modifier: {
          selected: null
        }
      }
    }
  ]
};

/* {extend:'excel',text:'<i class="fa fa-file-excel-o"></i>',titleAttr:'Exportar a Excel'},
  {extend:'csv',title:'Consumo de Energia',text:'<i class="fa fa-file-text-o"></i>',titleAttr:'Exportar a CSV'},
  {extend:'pdf',title:'Consumo de Energia',text:'<i class="fa fa-file-pdf-o"></i>',titleAttr:'Exportar a PDF'},
  {extend: 'print', title:'Consumo de Energia',text:'<i class="fa fa-print"></i>',titleAttr:'Enviar a impresión'}
];*/



spanish = {
  "decimal": "",
  "emptyTable": "No se Encontraron Registros",
  "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
  "infoEmpty": "Showing 0 to 0 of 0 entries",
  "infoFiltered": "(Filtrado desde _MAX_ total registros)",
  "infoPostFix": "",
  "thousands": ",",
  "lengthMenu": "Mostrar _MENU_ Registros",
  "loadingRecords": graphLoading(),
  "processing": "",
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
};

blog = [];
for (slotPagina = 0; slotPagina <= 1100; slotPagina++) {
  blog[slotPagina] = {};
}
/*blog[54] = {};
blog[55] = {};
blog[57] = {};
blog[63] = {};
blog[48] = {};
blog[58] = {};
blog[20] = {};
blog[60] = {};
blog[59] = {};
blog[10] = {};
blog[53] = {};
blog[12] = {};
blog[11] = {};
blog[22] = {};
*/


var timerGlobal = null;

function whatDecimalSeparator() {
  var n = 1.1;
  n = n.toLocaleString().substring(1, 2);;
  return n;
}

function whatMilesSeparator() {
  var n = 1000;
  n = n.toLocaleString().substring(1, 2);;
  return n;
}

logo = new Image();
logo.src = "images/ribe50x50.png";
logo.width = 120;
logo.height= 30; 
