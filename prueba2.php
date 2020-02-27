<script src="jscript/jquery/dist/jquery.min.js"></script>
<script>
function energiaDia(){

    $.ajax({
        url : "php/data.php?energia_dia", 
        beforeSend: function( xhr ) {
        },
        type: "post",
        data:{
            queries:[
                { 
                    fieldsSelect:["idmedidor","codigo","energiafechainicial","energialecturainicial","energiafechafinal","energialecturafinal","energialecturafinal-energialecturainicial as consumo"],
                    tableName:"remarcacion.consumos(16,'2019-07-23 00:00',now()::timestamp,1,'15MIN')",
                    orderby :[{field:'idmedidor',type:'asc'}],
                    where:[{field:'idservicio',oper:'=',value:3,type:'int'}]
                }
            ]              
        },
        })
    .then(function(data) {
        console.log(data);
    })
    .done(function(xhr){

    });         
}

energiaDia();
</script>