blog[paginaActiva.code].comments = blog[paginaActiva.code].comments || {};
blog[paginaActiva.code].comments.debugMode = false;

blog[paginaActiva.code].isFirstLoad = function(namesp, jsFile) {
	var isFirst = namesp.firstLoad === undefined;
	namesp.firstLoad = false;
	
	if (!isFirst) {
		console.log(
			"Warning: Javascript file is included twice: " + 
				jsFile);
	}
	return isFirst;
};

$( document ).ready(function() {

    $('.select2').select2();

    if (!blog[paginaActiva.code].isFirstLoad(blog[paginaActiva.code].comments, "comment.js")) {
		return;
    }  

    $('#SelectMedidor').select2({
        templateResult: function(data) {
            var r = data.text.split('|');
            var result = '<div>';
            for (var index=0;index<r.length;index++){
                result += '<div>' + r[index] + '</div>';
            }                            
                result += '</div>';
            return $(result);
        }
    });

    $(document).on('click','.icono',function(event){
        if (paginaActiva.code == 76){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    //Evento Click para el Control BtnBorrar
    $(document).on('click','#btnBorrar',function(event){
        if (paginaActiva.code == 76){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            barGraph.data.datasets[0].data.length = 0;
            barGraph.data.datasets[1].data.length = 0;
            barGraph.options.title.text = '';
            barGraph.options.legend.display = false;
            barGraph.update();
        }
    });

    //Evento Click para el Boton BtnReset    
    $(document).on('click','#btnGuardar',function(event){      
        if (paginaActiva.code == 76){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var canvas = graphTarget.get(0);
            canvas.toBlob(function(blob) {
                saveAs(blob, "%s.png".format(barGraph.options.title.text));
            });
        }   
    });

    $(document).on('click','#btnGraficar',function(event){
        if (paginaActiva.code == 76){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                GraficoMontoConsumo($("#SelectArrendatario").val(),$("#TextFecha").val(),$("#textMeses").val(),barGraph,$("#SelectArrendatario").select2('data')[0].text);
            }
        }
    });

    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 76){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarConsumidores(this.value);
        }
    });

    function cargarConsumidores(idedificio){
        selectJs2(
            "#SelectArrendatario",
            {   
                value: "idconsumidor",
                show: {
                    fields:["cons_nombre"],
                    format: "%s"
                },
                queries:[{
                    fieldsSelect: ["distinct on (idconsumidor,cons_nombre) idconsumidor", "cons_nombre"],
                    tableName   :"mediciones.vmedidores",
                    orderby:[{
                        field:"cons_nombre",
                        type : "asc"
                    }],
                    where  :[{
                        field  :"idedificio",
                        oper   :"=",
                        value  :idedificio,
                        type   :"int",        
                    }]        
                }],
            },
            {
            }    
        );
    }

    function GraficoMontoConsumo(idarrendatario,fecha,meses,barGraph,title){
        //$("#container-loading-%s".format(medidor.idwidget)).removeClass("hidden");
        $.ajax({
        url : 'php/data.php', // Use href attribute as URL
        type: "post",
        data:{
            queries:[{   //SELECT * from valores_aleatorios(1000,644,1,'2018-12-12 00:00:00'::timestamp,now()::timestamp) order by fecha
                fieldsSelect:["*"],
                tableName:"control.ultimosconsumosconsumidor(%s,'%s',%s)".format(idarrendatario,fecha,meses),
                orderby :[{field:'fecha',type:"asc"}],
                },  
            ]              
        },
        })
        .then(function(data) {
            barGraph.data.labels = data[0].resultados.map(function(periodo){return periodo.mes;}); 
            barGraph.data.datasets.length = 0;
            barGraph.data.datasets.push({yAxisID: "y-axis-1",borderWidth: 1,label:'Energía kWh',borderColor: 'rgba(27,109,193,1)',backgroundColor:'rgba(27,109,193,0.8)',data:data[0].resultados.map(function (consumo){return parseFloat(consumo.totalconsumo);})});    
            barGraph.data.datasets.push({yAxisID: "y-axis-2",borderWidth: 1,label:'Boleta CLP',borderColor: 'rgba(215,210,0,1)',backgroundColor:'rgba(215,210,0,0.8)',data:data[0].resultados.map(function (consumo){return parseFloat(consumo.total);})});    
            barGraph.options.title.text = title;
            barGraph.options.legend.display = true;
            barGraph.update();
        })
        .fail(function (xhr, textStatus, errorThrown) {
            error2({
                msg:errorThrown
            });
        })
        .done(function(xhr){
            var index = xhrPool.indexOf(xhr);
            if (index > -1) {
                xhrPool.splice(index, 1);
            }
        });        
    }

});