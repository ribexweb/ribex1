function promedioEnergia(medidor,debug=false){
    //edificio.activo = true; 
    //var medidor = 644;  
    //console.log(medidor);
    var diaAnteriorMesActual = moment().subtract(1,'days').format('YYYY/MM/DD 23:59:59');
    var primerDiaMesActual   = moment().startOf('month').format('YYYY/MM/DD');
    var primerDiaMesAnterior = moment().subtract(1,'months').startOf('month').format('YYYY/MM/DD');
    var ultimoDiaMesAnterior = moment().subtract(1,'months').endOf('month').format('YYYY/MM/DD 23:59:59');
    var page = (!(debug))?"php/data.php":"includes/getData2debug.php";
   $.ajax({
            url : page,
            type:"post",
            data:{queries:[{
                                fieldsSelect:["*"],
                                tableName   :"consultar_promedio(%s,1,'%s','%s')".format(medidor.idmedidor,primerDiaMesAnterior,ultimoDiaMesAnterior),                            
                            },
                           {
                                fieldsSelect:["*"],
                                tableName   :"consultar_promedio(%s,1,'%s','%s')".format(medidor.idmedidor,primerDiaMesActual,diaAnteriorMesActual),
                            },
                                {
                                    fieldSelect:["codigo"],
                                    tableName: "vmedidores",
                                    where:[{field:"idmedidor",
                                            oper:"=",
                                            value:medidor.idmedidor,
                                            type:"int"}]
                                }
                            ],
                }
            })
          .then(function(data) {
                //edificio.activo = false;
                console.log(data);
                $("#medidorProm%s".format(medidor.idmedidor)).html(data[2].resultados[0].codigo+' '+data[2].resultados[0].cons_nombre);  

                $("#promedioMesAnterior%s".format(medidor.idmedidor)).html("%s kWh".format(convertirFormatoLocal(Math.round(data[0].resultados[0].promedio))));
                $("#promedioMesActual%s".format(medidor.idmedidor)).html("%s kWh".format(convertirFormatoLocal(Math.round(data[1].resultados[0].promedio))));
                $("#promedioDiff%s".format(medidor.idmedidor)).html("%s kWh".format((Math.round(data[1].resultados[0].promedio)-Math.round(data[0].resultados[0].promedio)).toLocaleString()));
                $("#variacion%s".format(medidor.idmedidor)).html("%s %".format(Math.round((data[1].resultados[0].promedio/data[0].resultados[0].promedio*100)-100)));
                var maxValue = Math.ceil((data[0].resultados[0].promedio*1.20)/100)*100;
                var countTick = 10;
                var periodo = maxValue/countTick;
                //console.log(periodo);
                var ticks = [];
                for (var index=0;index<=countTick;index++){
                    var tick = Math.ceil((periodo*index)/100)*100;
                    //var tick = Math.round(periodo*index);
                    ticks.push(tick);
                }
                medidor.gauge.options.majorTicks = ticks;
                medidor.gauge.options.maxValue = Math.ceil((data[0].resultados[0].promedio*1.20)/100)*100;
                medidor.gauge.options.highlights[0].to =  data[0].resultados[0].promedio;
                medidor.gauge.options.highlights[1].from = data[0].resultados[0].promedio;
                medidor.gauge.options.highlights[1].to =  Math.ceil((data[0].resultados[0].promedio*1.20)/100)*100;
                medidor.gauge.value = data[1].resultados[0].promedio;
                console.log(data[0].resultados[0].promedio+' | '+data[1].resultados[0].promedio);
                medidor.gauge.update();

               });


}

function dibujarWidgetPromedio(idTablero,widget){
    a = $('<div class="col-md-6">').appendTo(idTablero);
    b = $('     <div class="box box-success">').appendTo(a);
    c = $('         <div class="box-header with-border">').appendTo(b);
    d = $('             <h3 class="box-title">Consumo Promedio Diario</h3>').appendTo(c);
    e = $('             <div id="medidorProm%s" class="small text-muted">Medidor N°1</div>'.format(widget.idmedidor)).appendTo(c);
    f = $('             <div class="box-tools pull-right">').appendTo(c);
    g = $('                     <button type="button" class="btn btn-box-tool" data-toggle="collapse" data-target="#collapseProm%s" aria-controls="collapseProm%s"><i class="fa fa-minus"></i></button>'.format(widget.idmedidor,widget.idmedidor)).appendTo(f);
    h = $('         <div id="collapseProm%s" class="box-body collapse in" aria-expanded="true" >'.format(widget.idmedidor)).appendTo(b);
    i = $('             <div class="chart">').appendTo(h);
    j = $('                 <canvas id="meterMes%s" style="height: 169px; width: 284px;" width="260" height="159"></canvas>'.format(widget.idmedidor)).appendTo(i);
    /*b = $('				<div style="width:auto;">').appendTo(h);  
    b = $('					<table style="border:1px solid #C1C1C1; font-weight: bold;">').appendTo(b);	 	 	 
    c = $('						<tr>').appendTo(b);
    $('								<td colspan=2 style="background-color:#E1E1E1;text-align:center">Datos Promedios</td>').appendTo(c);
    c = $('						<tbody>').appendTo(b);
    d = $('							<tr>').appendTo(c);
    e = $('							    <td style="font-weight: bold;border:1px solid #C1C1C1;padding-left:8px;">Anterior:</td>').appendTo(d);
    e = $('                             <td style="width:90px;text-align:right;border:1px solid #C1C1C1;" id="promedioMesAnterior%s">0 kWh</td>'.format(widget.idmedidor)).appendTo(d);
    d = $('							<tr>').appendTo(c);
    e = $('								<td style="font-weight: bold;border:1px solid #C1C1C1;padding-left:8px;">Actual:</td>').appendTo(d);
    e = $('                             <td style="width:90px;text-align:right;border:1px solid #C1C1C1;" id="promedioMesActual%s">0 kWh</td>'.format(widget.idmedidor)).appendTo(d);
    d = $('							<tr>').appendTo(c);
    e = $('							    <td style="font-weight: bold;border:1px solid #C1C1C1;padding-left:8px;">Diferencia:</td>').appendTo(d);
    e = $('                             <td style="width:90px;text-align:right;border:1px solid #C1C1C1;" id="promedioDiff%s">0 kWh</td>'.format(widget.idmedidor)).appendTo(d);
    d = $('							<tr>').appendTo(c);
    e = $('								<td style="font-weight: bold;border:1px solid #C1C1C1;padding-left:8px;">Variación:</td>').appendTo(d);
    e = $('                             <td style="width:90px;text-align:right;border:1px solid #C1C1C1;" id="variacion%s">0 %</td>'.format(widget.idmedidor)).appendTo(d);
   */ widget.gauge = new RadialGauge({
            renderTo: 'meterMes%s'.format(widget.idmedidor),
            width: 300,
            //height: 300,
            units: "kWh",
            minValue: 0,
            //startAngle: 90,
            //ticksAngle: 180,
            exactTicks:true,
            valueBox: false,
            maxValue: 160,
            majorTicks: ['0','20','40','60','80','100','120','140','160'],
            numberMargin: 100,
            minorTicks: 2,
            strokeTicks: false,
            barProgress:false,
            highlights: [
            {
                "from":0,
                "to":100,
                "color": "rgba(0,255,0,.25)"
            },
            {
                "from": 100,
                "to": 120,
                "color": "rgba(200, 50, 50, .6)"
            }
            ],
            colorPlate: "#fff",
            borderShadowWidth: 0,
            borders: false,
            needleType: "arrow",
            needleWidth: 2,
            needleCircleSize: 7,
            needleCircleOuter: false,
            needleCircleInner: false,
            animationDuration: 1000,
            animationRule: "linear"
            }).draw();

            promedioEnergia(widget);

}