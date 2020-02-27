<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");;

    function dibujar_posiciones($groupName,$groupValue,$table,$id,$posicion,$actual,$total){
        $str = "";
        $groupStr = "";
        for ($i=0;$i<count($groupName);$i++){
            $groupStr .= sprintf("data-%s='%s' ",$groupName[$i],$groupValue[0][$groupName[$i]]);
        }

        if ($total == 1){
            $str .= sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='+' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$total).
                    sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='-' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$total);
        }
        else {
            if ($posicion == 1) {
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='+' name='posicion' class='btn btn-danger btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$total,$table).
                        sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='-' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$total);
            }
            elseif ($posicion == $total){
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='+' name='posicion' class='btn btn-default btn-xs disabled'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$total).
                        sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='-' name='posicion' class='btn btn-success btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$total,$table);
            }
            else {
                $str .= sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='+' name='posicion' class='btn btn-danger btn-xs posicion_%s'><i class='fa fa-arrow-down'></i></button>",$id,$groupStr,$posicion,$total,$table).
                        sprintf("<button id='%s' %s data-posicion='%s' data-total='%s' data-operacion='-' name='posicion' class='btn btn-success btn-xs posicion_%s'><i class='fa fa-arrow-up'></i></button>",$id,$groupStr,$posicion,$total,$table);

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
        $totalName = isset($_POST["show"]["total"])?$_POST["show"]["total"]:"total";
        $updateBtn = isset($_POST["show"]["updatebtn"])?$_POST["show"]["updatebtn"]:1;
        $deleteBtn = isset($_POST["show"]["deletebtn"])?$_POST["show"]["deletebtn"]:1;
        $prefixid  = isset($_POST["show"]["prefixid"])?$_POST["show"]["prefixid"]:0;
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
            $record = array();
            foreach($_POST["show"]["fields"] as $showField){
                $key = array_search($showField, array_column($resultados[0]["fields"], 'name'));
                $type = $resultados[0]["fields"][$key]["type"];
                
                if ($type != "bool") {
                    if ($showField != 'posicion') {
                        $record[$showField] = (isset($registro[$showField]))?$registro[$showField]:"";   
                    }
                    else{
                        $record["posicion"] = dibujar_posiciones($groupName,$groupValue,$realtablename,$registro[$_POST['primaryField']],$registro[$showField],$actual,$total);
                        //$record["posicion"] = $registro[$showField];
                    }
                }
                else if ($type == "bool") {
                    $activo = ($registro[$showField]=='t')?"checked":"";
                    //$activo = ($registro[$showField]=='t')?"fa-check":"fa-close";
                    //$clase  = ($registro[$showField]=='t')?"btn-success":"btn-danger";
                    //$record[$showField] = sprintf("<button id='%s' name='activo' class='btn %s btn-xs booleano_%s_%s'><i class='fa %s'></i></button>",$registro[$_POST['primaryField']],$clase,$showField,$realtablename,$activo); 
                    $id = ($prefixid == 1)?sprintf("%s%s",$showField,$registro[$_POST['primaryField']]):sprintf("%s",$registro[$_POST['primaryField']]);
                    $record[$showField.'_switch'] = sprintf('<label class="cl-switch cl-switch-green"><input id="%s" class="booleano_%s_%s" type="checkbox" %s %s><span class="switcher"></span></label>',$id,$showField,$realtablename,$activo,$hideStr);
                    $record[$showField] = $registro[$showField];
                    //$record[$showField."value"] = $registro[$showField];
                }
            }
            $actual++;
            $botones = "";
            if ($updateBtn==1) {
                $botones = sprintf("<button id='%s' name='update' class='btn btn-warning btn-xs update_%s'><i class='fa fa-edit'>Modificar</i></button>&nbsp;",$registro[$_POST['primaryField']],$realtablename);
            }
            if ($deleteBtn==1){
                $botones .= sprintf("<button id='%s' name='delete' %s class='btn btn-danger btn-xs delete_%s'><i class='fa fa-eraser'></i></button>&nbsp;",$registro[$_POST['primaryField']],$hideStr,$realtablename);
            }
            if (isset($_POST["otrosbotones"])){
                foreach ($_POST["otrosbotones"] as $otrosbot){
                    $botones .= sprintf("<button id='%s' name='%s' %s class='btn %s btn-xs %s_%s'><i class='fa %s'></i></button>&nbsp;",$registro[$_POST['primaryField']],$otrosbot["nombre"],$hideStr,$otrosbot["tipo"],$otrosbot["accion"],$realtablename,$otrosbot["icono"]);    
                }
            }
            $record["operaciones"] = $botones;
            $data[] = $record;
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