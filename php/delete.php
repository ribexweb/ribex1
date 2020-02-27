<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if ((isset($_POST['tableName'])) && (isset($_POST['where'])) ){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));

        $where = $_POST["where"];
        $whereStr = "WHERE ";
        for ($whereIndex = 0;$whereIndex<count($where);$whereIndex++){
          $wh = $where[$whereIndex]; 
          if ($whereIndex > 0){
            if (isset($wh["logical"])) {
              $whereStr.= sprintf(" %s ",$wh["logical"]);            
            }
            else {
              $sentencias[] = ["Consulta mal construida falta operador lógico (and,or) en clausula Where N° ".($whereIndex+1)];
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

        $query = sprintf("DELETE FROM %s %s",$_POST["tableName"],$whereStr);
        $statement = $connection->prepare($query);
        $result = $statement->execute();
        if(!empty($result)){
            $tipo = "success";
            $msg = sprintf('Registro Eliminado con éxito de %s',$_POST["tableName"]);
        }
        else {
            $tipo = "error";
            $msg  = sprintf('Ocurrio un error al intentar eliminar el registro de %s',$_POST["tableName"]);
        }

        echo json_encode(["post" => $_POST,
                          "query" => $query,
                          "tipo" => $tipo,
                          "msg" => $msg]);
       }
;
?>