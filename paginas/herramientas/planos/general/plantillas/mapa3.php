
<style>
.qtip-wiki{
    max-width: 385px;
}

.qtip-wiki p{
    margin: 0 0 6px;
}

.qtip-wiki h1{
    font-size: 20px;
    line-height: 1.1;
    margin: 0 0 5px;
}

.qtip-wiki img{
    float: left;
    margin: 10px 10px 10px 0;
}

.qtip-wiki .info{
    overflow: hidden;
}

.qtip-wiki p.note{
    font-weight: 700;
}


    table, table tr td {
        border-collapse: collapse;
        font-size:12px;
    }
    table thead td{
        font-weight: bold;
        padding:7px;
    }

</style>
<img src="images/mapas/mapa6.svg" width="920px" height="486px" border="0" usemap="#Map2" />
<map name="Map2" id="Map2">
    <area target="" data-nbmembre="Me-MAM-1074" title="" href="" coords="154,152,174,161" shape="rect">
    <area target="" data-nbmembre="Me-MAM-1075" title="" href="" coords="269,150,285,158" shape="rect">
    <area target="" data-nbmembre="Me-MAM-1078" title="" href="" coords="318,149,336,158" shape="rect">
    <area target="" data-nbmembre="Me-MAM-1079" title="" href="" coords="344,151,365,158" shape="rect">
    <area target="" data-nbmembre="Me-MAM-1080" title="" href="" coords="375,152,391,160" shape="rect">
    <area target="" data-nbmembre="Me-MAM-1076" title="" href="" coords="465,147,485,139,480,128,461,138" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1052" title="" href="" coords="560,117,581,106,574,97,557,109" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1053" title="" href="" coords="556,188,577,178,572,167,552,178" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1043" title="" href="" coords="592,172,612,163,606,154,590,163" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1048" title="" href="" coords="620,188,629,183,620,167,610,172" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1045" title="" href="" coords="640,213,648,208,638,191,631,197" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1051" title="" href="" coords="654,237,665,232,654,214,645,220" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1042" title="" href="" coords="682,277,693,271,681,254,671,258" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1049" title="" href="" coords="688,279,698,273,706,290,700,296" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1040" title="" href="" coords="658,138,667,134,654,116,645,124" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1046" title="" href="" coords="667,151,672,146,683,161,674,167" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1044" title="" href="" coords="696,195,707,188,694,171,687,178" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1050" title="" href="" coords="715,218,724,212,714,195,705,202" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1041" title="" href="" coords="733,247,742,238,730,222,722,233" shape="poly">
    <area target="" data-nbmembre="Me-MAM-1047" title="" href="" coords="740,251,745,243,758,260,751,268" shape="poly">

</map>
<script type="text/javascript">
$(document).ready(function(){
    


 /* $("img[usemap]:last").mapify({

  });*/

  tippy('#Map2 area', {
    content: 'Buscando...',
    animateFill: false,
    animation: 'fade',
    flipOnUpdate: true,
    followCursor: 'initial',
    arrow: true,
    onShow(instance) {
        var nombre = $(instance.reference).attr("data-nbmembre"); 
        var d = new Date();
        $.ajax({
            url :"php/getData2.php", // Use href attribute as URL
            data:{
                queries:[
                    {
                        fieldSelect:["codigo","espa_nombre"],
                            tableName  : "mediciones.vmedidores",
                        where:[{
                            field:"codigo",
                            oper :"=",
                            value:nombre,
                            type :"str"
                        }]     
                    },
                    {
                        fieldsSelect:["*"],
                        tableName   :"mediciones.ultimos_valores_medidor(now()::timestamp,(select idmedidorfisico from mediciones.vmedidores where (codigo='%s')),'1,3,4,5,11,12,13,14,23')".format(nombre),  
                    },
                ]
            },
        })
        .then(function(data) {
            console.log(data);
            if (data[0].resultados.length > 0) {
                var html  = "<div style='width:200px'>";
                    html += "   <h5><strong>%s</strong></h5>".format(data[0].resultados[0].espa_nombre);
                    html += "   <table style='margin:auto'>";
                    html += "       <thead>";
                    html += "           <td colspan=3>Datos de Variables</td>";
                    html += "       </thead>";
                    html += "       <tbody>"
                    for (var index in data[1].resultados) {
                        html += "           <tr>";
                        html += "               <td><b>%s</b></td><td style='text-align:right'>%s</td><td style='padding-left:3px;'>%s</td>".format(data[1].resultados[index].codigo,convertirFormatoLocal(data[1].resultados[index].valor),data[1].resultados[index].unidad);
                        html += "           </tr>";
                    }
                    html += "       </tbody>";
                    html += "   </table>";
                    html += "</div>"; 
                    instance.setContent(html);
            }
            else{
                instance.setContent('No hay Datos');
            }
        })
    }

  });

    /*$('area').each(function() {
        $(this).qtip({
            hide: {
                fixed: true,
                delay: 300
            },
            content: {
                text: function(event, api) {
                    var medidor = api.elements.target.attr("data-nbmembre");
                    api.set('content.text','');
                    var d = new Date();
                    $.ajax({
                        url :"php/getData2.php", // Use href attribute as URL
                        data:{queries:[
                               {   fieldSelect:["codigo","espa_nombre"],
                                    tableName  : "vmedidores",
                                    where      :[{
                                                    field:"idmedidor",
                                                    oper :"=",
                                                    value:medidor,
                                                    type :"int"
                                                  }]     

                                },
                                {
                                    fieldsSelect:["*"],
                                    tableName   :"ultimos_valores_medidor(now()::timestamp,%s,'1,3,4,5,11,12,13,14,23')".format(medidor),  
                                },
                                ]
                            },
                        })
                    .then(function(data) {
                        console.log(data);
                        var cuerpo = "<table style='margin:auto'>";
                            cuerpo += "<thead>";
                            cuerpo += "<td colspan=3>Datos de Variables</td>";
                            cuerpo += "</thead>";
                        for (var index in data[1].resultados) {

                          cuerpo += "<tr>";
                          cuerpo += "<td><b>%s</b></td><td style='text-align:right'>%s</td><td style='padding-left:3px;'>%s</td>".format(data[1].resultados[index].codigo,convertirFormatoLocal(data[1].resultados[index].valor),data[1].resultados[index].unidad);

                          cuerpo += "</tr>";
                        }
                        if (data[0].resultados.length > 0) {
                            api.set('content.title',data[0].resultados[0].codigo+" ("+data[0].resultados[0].espa_nombre+")");
                        }
                        else {
                           api.set('content.title','No Hay Informacion');  
                        }
                        api.set('content.text',cuerpo);

                       

                    }, function(xhr, status, error) {
                        // Upon failure... set the tooltip content to error
                        api.set('content.text', status + ': ' + error);
                    });
        
                    return 'Consultando...'; // Set some initial text
                }
            },
            position: {
                viewport: $(window)
            },
            style: 'qtip-tipped qtip-rounded'
         });
    }); */

 });

  

</script>

