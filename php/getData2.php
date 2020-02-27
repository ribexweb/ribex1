<?php
  header('Content-Type: application/json');
  set_time_limit(0);
  include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
  $sentencias = array();
  if (!(isset($_GET["queries"]))){
    $entencias[] = ["mensaje"=>"No hay consultas, utilice el parametro queries..."];
  } 
  else{
    $parametros = $_GET["queries"];

    foreach ($parametros as $param){
      //print_r($param);
      $select      = (isset($param["fieldsSelect"]))?implode(",",$param["fieldsSelect"]):"*";
      $tableName       = $param["tableName"]; 
      /************Construccion de Clausula Where*********************/ 
      $where = [];
      $whereStr = "";
      if (isset($param["where"])){
        $where = $param["where"];
        $whereStr = "WHERE ";
        for ($whereIndex = 0;$whereIndex<count($where);$whereIndex++){
          $wh = $where[$whereIndex]; 
          if ($whereIndex > 0){
            if (isset($wh["logical"])) {
              $whereStr.= sprintf(" %s ",$wh["logical"]);            
            }
            else {
              $entencias[] = ["Consulta mal construida falta operador lógico (and,or) en clausula Where N° ".($whereIndex+1)];
            }
          }  

          if (isset($wh["not"])){
            if ($wh["not"] == 1){
              $formatStr = ($wh["type"] == "int")?"(%s(%s %s %s))":"(%s(%s %s '%s'))";
              $whereStr.=sprintf($formatStr,"Not",$wh["field"],$wh["oper"],$wh["value"]);
            }
            else{
              $formatStr = ($wh["type"] == "int")?"(%s %s %s)":"(%s %s '%s')";
              $whereStr.=sprintf($formatStr,$wh["field"],$wh["oper"],$wh["value"]);
            }  
          }
          else {
            $formatStr = ($wh["type"] == "int")?"(%s %s %s)":"(%s %s '%s')";
            $whereStr.=sprintf($formatStr,$wh["field"],$wh["oper"],$wh["value"]);
          }
        }
      }
      /********************Fin Construccion de Clausula Where***************/  
      /*******************Construcion de clausula Order by*****************/
      $orderby = [];
      $orderbyStr = "";
      if (isset($param["orderby"])){
        $orderby = $param["orderby"];
        $orderbyStr = "ORDER BY ";
      }  
      for ($orderbyIndex=0;$orderbyIndex<count($orderby);$orderbyIndex++){
        $ordby = $orderby[$orderbyIndex];
        $orderbyStr.= ($orderbyIndex < count($orderby)-1)?sprintf("%s %s,",$ordby["field"],$ordby["type"]):sprintf("%s %s",$ordby["field"],$ordby["type"]);
      }
      /************Fin de Construccion de Clausula Order by ****************/
     $sql = sprintf("SELECT %s FROM %s %s %s",$select,$tableName,$whereStr,$orderbyStr);
     $datos = [ 
      "sql" => $sql,
      "fields" => array(),
      "resultados" => array(), 
     ];
     $sentencias[] = $datos;
    }

    for ($index=0;$index<count($sentencias);$index++){
      if ($query = execute_query2($sentencias[$index]["sql"])){
        if ($query["success"]){
          for ($indexField=0;$indexField<pg_num_fields($query["query"]);$indexField++){
            $sentencias[$index]["fields"][] = [
              "type" => pg_field_type($query["query"], $indexField),
              "size" => pg_field_size($query["query"], $indexField),
              "name" => pg_field_name($query["query"], $indexField),
              "table"=> pg_field_table($query["query"], $indexField),
            ];
          }
        
          while ($record = @pg_fetch_array($query["query"])){
            $sentencias[$index]["resultados"][] = $record;
          }
        } 
      }
    }
    if (!($query["success"])) {
      $sentencias[] = [ 
                      "sql" => $query["sql"],
                      "fields" => array(),
                      "resultados" => array(),
                      "msg" => $query["msg"] 
                    ];
    }
  }
    echo json_encode($sentencias);

?>