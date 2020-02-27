function energiaMes(medidor,debug=false){
    medidor.activo = true;
    //idmedidor = (medidor.idmedidorfisico != null)?medidor.idmedidorfisico:medidor.idmedidorvirtual;
    var page      = (debug!==undefined)?((debug)?"php/getData2debug.php":"php/data.php"):"includes/data.php";
    var hoy = moment().format('YYYY/MM/DD HH:mm:ss');
    var dias = moment().subtract(1,'months').endOf('month').diff(moment().subtract(1,'months').startOf('month'),'days')+1;
    var primerDiaMesAnterior = moment().subtract(1,'months').startOf('month').format('YYYY/MM/DD');
    var ultimoDiaMesAnterior = moment().subtract(1,'months').endOf('month').format('YYYY/MM/DD');
    var primerDiaMesActual   = moment().startOf('month').format('YYYY/MM/DD');
    var ultimoDiaMesActual   = moment().endOf('month').format('YYYY/MM/DD');
    $.ajax({
        url : page, // Use href attribute as URL
        beforeSend: function( xhr ) {
            //console.log('Hacer algo antes');
            xhrPool.push(xhr);
        },
        type:"post",
        data:{
            queries:[
                        {
                        fieldsSelect:["*"],
                        tableName   :"mediciones.consultar_valor_medidor_where(%s,%s,'fecha','>=','%s',2)".format(medidor.idmedidor,1,primerDiaMesAnterior),
                        },
                        {
                        fieldsSelect:["*"],
                        tableName   :"mediciones.consultar_valor_medidor_where(%s,%s,'fecha','<=','%s',2)".format(medidor.idmedidor,1,ultimoDiaMesAnterior),
                        },
                        {
                            fieldsSelect:["TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi') as fecha, trunc(avg(valor)) as valor "],
                            tableName   :"mediciones.consultar_medidor_variable(%s,%s,'%s',now()::timestamp) group by TO_TIMESTAMP(concat(fecha::date,' ',extract(hour from fecha)::text,':',extract(minute from fecha)::text),'YYYY-MM-DD HH24:mi')".format(medidor.idmedidor,1,primerDiaMesActual),
                            orderby:[{field:'fecha',
                                      type : 'asc'}]
                        },
                        {
                            fieldSelect:["codigo"],
                            tableName: "mediciones.vmedidores",
                            where:[{field:"idmedidor",
                                    oper:"=",
                                    value:medidor.idmedidor,
                                    type:"int"}]
                        }

                    ]         
                   
             },
        })
        .then(function(data) {
            medidor.activo = false;
            var arrDatos = [];
            medidor.barGraphConsumoMes.data.datasets.length = 0;
            var m = (data[1].resultados[0].valor-data[0].resultados[0].valor)/(dias);
            arrDatos.push({x :primerDiaMesActual,y:data[2].resultados[0].valor});
            arrDatos.push({x :ultimoDiaMesActual,y:(dias*m)+parseFloat(data[2].resultados[0].valor)});
            //arrDatos.push({x :'2018-12-31 23:59:59',y:parseFloat(data[0].resultados[0].valor)+(m*31)});
            medidor.barGraphConsumoMes.data.datasets.push({label: "Promedio Mes Anterior",
                                        data: arrDatos,
                                        borderColor: '#FF0000',
                                        fill:false
                                    }); 
            var arrDatos = [];
            for (var dataIndex in data[2].resultados){
                arrDatos.push({x:data[2].resultados[dataIndex].fecha,
                               y:data[2].resultados[dataIndex].valor});
            }                        
            medidor.barGraphConsumoMes.data.datasets.push({   label: "Mes Actual",
                                        data: arrDatos,
                                        borderColor: '#1B6DC1',
                                        fill:true,
                                        borderWidth: 1,
                                        backgroundColor: 'rgba(27,109,93,0.2)',
                                    });                     
            medidor.barGraphConsumoMes.options.scales.xAxes[0].time.parser = 'YYYY/MM/DD HH:mm:ss';             
            medidor.barGraphConsumoMes.update();

            $("#medidorMes%s".format(medidor.idwidget)).html(data[3].resultados[0].codigo+' '+data[3].resultados[0].cons_nombre);  


        })
        .done(function(xhr){
            var index = xhrPool.indexOf(xhr);
            if (index > -1) {
                xhrPool.splice(index, 1);
            }
        });

               

}

function dibujarWidgetEnergiaMes(idTablero,widget){
    a = $('<div id="container-widget-%s" class="col-md-%s">'.format(widget.idwidget,widget.tamano)).appendTo(idTablero);
    b = $('     <div class="box box-danger">').appendTo(a);
    c = $('         <div class="box-header with-border">').appendTo(b);
    d = $('             <h3 class="box-title">Energia del Mes</h3>').appendTo(c);
    e = $('             <div id="medidorMes%s" class="small text-muted">Medidor N°</div>'.format(widget.idwidget)).appendTo(c);
    f = $('             <div class="box-tools pull-right">').appendTo(c);
    g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseMes%s" aria-controls="collapseMes%s"><i class="fa fa-minus"></i></button>'.format(widget.idwidget,widget.idwidget)).appendTo(f);
    h = $('         <div id="collapseMes%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idwidget)).appendTo(b);
    i = $('             <div class="chart">').appendTo(h);
    j = $('                 <canvas id="graphConsumoMes%s" style="height: 99px; width: 234px;" width="210" height="89"></canvas>'.format(widget.idwidget)).appendTo(i);
    widget.graphTargetConsumoMes = $("#graphConsumoMes%s".format(widget.idwidget));
    Chart.defaults.global.defaultFontColor = 'black';
    widget.barGraphConsumoMes = new Chart(widget.graphTargetConsumoMes, {
        type: 'line',       
        data: {
                labels: [],
                datasets: []
                },
        options: {
            elements:{
                point:{
                    radius:0,
                },
            },
            responsive: true,
            title:{
                display:false,
                text:""
            },
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        unit : 'day',
                        // parser: timeFormat,
                        //tooltipFormat: 'll HH:mm'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Periodo'
                    },
                    ticks: {
                        maxRotation: 0
                    }
                }, ],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Energia kHw'
                    },
                    ticks: {
                        beginAtZero: false,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }]
            }      
        }
    });

    energiaMes(widget);

}