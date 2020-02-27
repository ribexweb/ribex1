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
        if (paginaActiva.code == 75){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            event.preventDefault();
            $("#"+$(this).attr("data-input")).focus();
        }
    });

    //Evento Click para el Control BtnBorrar
    $(document).on('click','#btnBorrar',function(event){
        if (paginaActiva.code == 75){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            barGraph.data.datasets[0].data.length = 0;
            barGraph.data.datasets[1].data.length = 0;
            barGraph.options.title.text = '';
            barGraph.options.legend.display = false;
            barGraph.update();
        }
    });

    //Evento Click para el Boton BtnGuardar    
    $(document).on('click','#btnGuardar',function(event){      
        if (paginaActiva.code == 75){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            var canvas = graphTarget.get(0);
            canvas.toBlob(function(blob) {
                saveAs(blob, "%s.png".format(barGraph.options.title.text));
            });
        }   
    });

    $(document).on('click','#btnGraficar',function(event){
        if (paginaActiva.code == 75){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            if (validar('#FormaParametros')){
                GraficoMontoConsumo($("#SelectMedidor").val(),usuarioActivo,$("#TextFecha").val(),$("#textMeses").val(),barGraph,{temporal:false,title:$("#SelectMedidor").select2('data')[0].text});
            }
        }
    });


    $(document).on('change','#SelectEdificio',function(event){
        if (paginaActiva.code == 75){
            console.log("ejecutando accion %s en control %s de la pagina %s".format(event.type,this.id,paginaActiva.code));
            cargarMedidores(this.value,usuarioActivo);
        }
    });

    function cargarMedidores(idedificio,usuarioActivo){
        selectJs2(
            "#SelectMedidor",
            {   
                value: "idmedidor",
                show: {
                    fields:["codigo","cons_nombre","espa_nombre"],
                    format: "%s | %s | %s"
                },
                hide: ["idmedidorfisico"],
                queries:[{
                    fieldsSelect: ["idmedidor","idmedidorfisico","codigo","coalesce(cons_nombre,'virtual') as cons_nombre","coalesce(espa_nombre,descripcion) as espa_nombre"],
                    tableName   :"mediciones.medidores_permisados(%s,%s)".format(idedificio,usuarioActivo),
                    orderby:[{
                        field:"idmedidorfisico",
                        type : "asc NULLS first"
                    }],
                    where  :[{
                    field  :"asig_activo",
                    oper   :"=",
                    value  :"true",
                    type   :"int",        
                },{logical :"and",
                    field  :"local",
                    oper   :"=",
                    value  :"true",
                    type   :"int",        
                }]        
                }],
            },
            {
            }    
        );
    }



});