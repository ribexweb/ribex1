<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");;

    function dibujar_posiciones($groupName,$groupValue,$table,$id,$posicion,$actual,$total){
        $str = "";
        $groupStr = "";
        for ($i=0;$i<count($groupName);$i++){
            $groupStr .= sprintf("data-%s='%s' ",$groupName[$i],$groupValue[0][$groupName[$i]]);
        }

        if ($total == 1){
            $str .= sprintf("<button id='%s' %s data-posicion='%s' data-operacion='+' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion).
                    sprintf("<button id='%s' %s data-posicion='%s' data-operacion='-' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion);
        }
        else {
            if ($actual == 1) {
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-operacion='+' name='posicion' class='btn btn-info btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$table).
                        sprintf("<button id='%s' %s data-posicion='%s' data-operacion='-' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion);
            }
            elseif ($actual == $total){
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-operacion='+' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion).
                        sprintf("<button id='%s' %s data-posicion='%s' data-operacion='-' name='posicion' class='btn btn-info btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$table);
            }
            else {
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-operacion='+' name='posicion' class='btn btn-info btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$table).
                        sprintf("<button id='%s' %s data-posicion='%s' data-operacion='-' name='posicion' class='btn btn-info btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$table);

            }    
        }
        return $str;
    }

    if (isset($_POST["queries"])){
        set_time_limit(0);
        
        $resultados = query($_POST["queries"]);
        $data = array();
        $total = count($resultados[0]["resultados"]);
        $actual = 1;
        $groupName = isset($_POST["show"]["group"])?$_POST["show"]["group"]:array();
        $updateBtn = isset($_POST["show"]["updatebtn"])?$_POST["show"]["updatebtn"]:1;
        $deleteBtn = isset($_POST["show"]["deletebtn"])?$_POST["show"]["deletebtn"]:1;
        $fieldHides = isset($_POST["hide"])?$_POST["hide"]:[];
        $tablename = isset($_POST["tablename"])?$_POST["tablename"]:(isset($_POST["queries"][0]["tableName"])?$_POST["queries"][0]["tableName"]:"SinTabla");
        $realtablename = isset($_POST["show"]["realtablename"])?$_POST["show"]["realtablename"]:$tablename;
        foreach($resultados[0]["resultados"] as $registro){
 
            $hideStr = "";             
            foreach ($fieldHides as $fieldHide) {
              if ($fieldHide != "") {
                $hideStr .= sprintf("data-%s='%s' ",$fieldHide,$registro[$fieldHide]);
              }    
            }
            
   
            $groupValue = array();
            for ($i=0;$i<count($groupName);$i++){
                $groupValue[] = [$groupName[$i] => $registro[$groupName[$i]]];
            }
            $sub_array = array();
            foreach($_POST["show"]["fields"] as $showField){
                $key = array_search($showField, array_column($resultados[0]["fields"], 'name'));
                $type = $resultados[0]["fields"][$key]["type"];
                
                if ($type != "bool") {
                    if ($showField != 'posicion') {
                        $sub_array[] = $registro[$showField];  
                    }
                    else{
                        $sub_array[] = dibujar_posiciones($groupName,$groupValue,$realtablename,$registro[$_POST['primaryField']],$registro[$showField],$actual,$total);
                    }
                }
                else{
                    $activo = ($registro[$showField]=='t')?"checked":"";
                    //$clase  = ($registro[$showField]=='t')?"btn-success":"btn-danger";
                    //$sub_array[] = sprintf("<button id='%s' name='activo' class='btn %s btn-xs booleano_%s_%s'><i class='fa %s'></i></button>",$registro[$_POST['primaryField']],$clase,$showField,$realtablename,$activo);
                    $sub_array[]= sprintf('<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_%s_%s" type="checkbox" %s ><span class="switcher"></span></label>',$registro[$_POST['primaryField']],$showField,$realtablename,$activo);
                }
            }
            $actual++;
            $botones = "";
            if ($updateBtn==1) {
                $botones = sprintf("<button id='%s' name='update' class='btn btn-warning btn-xs update_%s'><i class='fa fa-edit'></i></button>&nbsp;",$registro[$_POST['primaryField']],$realtablename);
            }
            if ($deleteBtn==1){
                $botones .= sprintf("<button id='%s' name='delete' %s class='btn btn-danger btn-xs delete_%s'><i class='fa fa-times'></i></button>&nbsp;",$registro[$_POST['primaryField']],$hideStr,$realtablename);
            }
            if (isset($_POST["otrosbotones"])){
                foreach ($_POST["otrosbotones"] as $otrosbot){
                    $botones .= sprintf("<button id='%s' name='%s' %s class='btn %s btn-xs %s_%s'><i class='fa %s'></i></button>&nbsp;",$registro[$_POST['primaryField']],$otrosbot["nombre"],$hideStr,$otrosbot["tipo"],$otrosbot["accion"],$realtablename,$otrosbot["icono"]);    
                }
            }
            $sub_array[] = $botones;
            $data[] = $sub_array;
        } 

        $output = array(
            "post" => $_POST,
            //"draw"    => $_GET['draw'],
            //"recordsTotal"  =>  count($resultados[0]["resultados"]),
            //"recordsFiltered" => get_total_all_records(),
            "resultados" => $resultados,
            "data"    => $data,
        );

        echo json_encode($output);
    }
    else {
        errorPage();
    }


?>