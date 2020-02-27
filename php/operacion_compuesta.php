<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    $parametros = new StdClass();
    $parametros = $_POST;
    $mensajes = array();
    if (isset($parametros["operacion"])){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $operacion = $parametros["operacion"];
        unset($parametros["operacion"]);
        if ($operacion == "Ingresar"){
            $foreign = array();
            foreach ($parametros as $tableName => $table){
                $query = sprintf("INSERT INTO %s.%s ",$table["schemaName"],$table["tableName"]);
                $fieldCount = count($table["campos"]);
                $contador = 0;
                $fieldStr = "(";
                $fieldVal = "(";
                $primaryField = $table["primaryField"];
                $showMsg = $table["showMsg"];
                $params = array();
                foreach ($table["campos"] as $field => $value){
                    if (++$contador !== $fieldCount) {
                        $fieldStr .= sprintf("%s ,",$field);
                        $fieldVal .= sprintf(":%s,",$field); 
                    }
                    else {
                        $fieldStr .= sprintf("%s)",$field);
                        $fieldVal .= sprintf(":%s)",$field);
                    }    
                    if (!(isset($value["foreign"]))) {
                        $params[sprintf(":%s",$field)] = $value;
                    }
                    else {
                        $params[sprintf(":%s",$field)] = $foreign[$value["table"]][$value["foreignField"]];
                    }     
                }  
                $query .= sprintf("%s VALUES %s RETURNING %s",$fieldStr,$fieldVal,$primaryField);
                $statement = $connection->prepare($query);
                if ($result = $statement->execute($params)){
                    $retorno = $statement->fetchAll();
                    $foreign[$tableName] = array();
                    $foreign[$tableName][$primaryField] = $retorno[0][$primaryField];
                    //$id = $retorno[0][$primaryField];
                        $mensajes[] = [ "query" => $query,
                                        "params" => $params,
                                        "showMsg" => (bool)$showMsg,
                                        "tipo" => "success",
                                        "msg" => sprintf('Registro Ingresado con éxito en %s',$tableName)];    
                }
                else {
                        $mensajes[] = [ "query" => $query,
                                        "params" => $params,
                                        "showMsg" => (bool)$showMsg,
                                        "tipo" => "error",
                                        "msg" => $statement->errorInfo()[2]];
                }
            }
        }
        else{
            foreach ($parametros as $tableName => $table){
                $query = sprintf("UPDATE %s SET ",$tableName);
                $fieldCount = count($table["campos"]);
                $contador = 0;
                $fieldStr = "";
                $primaryField = $table["primaryField"];
                $primaryValue= $table["primaryValue"];
                $showMsg = $table["showMsg"];
                $params = array();
                foreach($table["campos"] as $field => $value){
                    if (++$contador !== $fieldCount) {
                        $fieldStr .= sprintf("%s = :%s ,",$field,$field);
                    }
                    else {
                        $fieldStr .= sprintf("%s = :%s",$field,$field);
    
                    }    
                    if (!(isset($value["foreign"]))) {
                        $params[sprintf(":%s",$field)] = $value;
                    }
                    else {
                        $params[sprintf(":%s",$field)] = $paramsAnt[sprintf(":%s",$value["foreignField"])];
                    } 
                }
                $query .= sprintf("%s WHERE %s=:%s",$fieldStr,$primaryField,$primaryField);
                $params[sprintf(":%s",$primaryField)] = $primaryValue;
                $statement = $connection->prepare($query);
                if ($result = $statement->execute($params)){
                        $mensajes[] = [ "showMsg" => (bool)$showMsg,
                                        "tipo" => "success",
                                        "msg" => sprintf('Registro Actualizado con éxito en %s',$tableName)];    
                }
                else {
                        $mensajes[] = [ "showMsg" => (bool)$showMsg,
                                        "tipo" => "error",
                                        "msg" => $statement->errorInfo()[2]];
                }
                $paramsAnt = new StdClass();
                $paramsAnt = $params;
                /*$mensajes[] = ["query" => $query,
                               "params" =>$params];*/
            }



        }
        echo json_encode($mensajes);
    }
    else {
        wr("Error tratable luego");
    }
    
?>