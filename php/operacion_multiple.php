<?php
   include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (isset($_POST["operacion"])){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        if ($_POST["operacion"] == "Ingresar"){
            $returnFields = (isset($_POST["returnFields"]))?implode(",",$_POST["returnFields"]):"";
            $rowsSQL = array();
            //Will contain the values that we need to bind.
            $toBind = array();
            //Get a list of column names to use in the SQL statement.
            $columnNames = array_keys($_POST["campos"][0]);
            foreach($_POST["campos"] as $arrayIndex => $row){
                $params = array();
                foreach($row as $columnName => $columnValue){
                    $param = ":" . $columnName . $arrayIndex;
                    $params[] = $param;
                    if ((($columnName == 'fecha') && ($columnValue == "")) || 
                         ($columnValue == 'null')){
                            $toBind[$param] = null;
                    }
                    else {
                        $toBind[$param] = $columnValue; 
                    }
                }
                $rowsSQL[] = "(" . implode(", ", $params) . ")";
            }
            //Construct our SQL statement
            //$sql = format("INSERT INTO %s (%s) VALUES %s", $_POST["tableName"],implode(", ", $columnNames),implode(", ", $rowsSQL));
            $sql = "INSERT INTO ".$_POST["tableName"] . "(".implode(',',$columnNames).") VALUES " . implode(", ", $rowsSQL);
            $sql = ($returnFields != "")?$sql." RETURNING ".$returnFields:$sql;
            //Prepare our PDO statement.
            $statement = $connection->prepare($sql);
            //Bind our values.
            foreach($toBind as $param => $val){
                $statement->bindValue($param, $val);
            }   
            //Execute our statement (i.e. insert the data)
            $tableName = explode('.',$_POST["tableName"]);
            $realTableName = (isset($_POST["realTableName"]))?$_POST["realTableName"]:$tableName[sizeof($tableName)-1];
            if ($result = $statement->execute()){
                $retorno = $statement->fetchAll();
                $mensajes[] =   [
                                    "tipo" => "success",
                                    "return" => $retorno,
                                    "mesg" => sprintf("%s Registro(s) Ingresado(s) en la tabla %s",sizeof($retorno),$realTableName),    
                                    "sql"  => $sql,
                                    "params" => $toBind,
                                    "file" => $_FILES,
                                    "POST" => $_POST,
                                ];
            }
            else {
                $mensajes[] =   [
                                    "tipo" => "error",
                                    "mesg" => sprintf("Ocurrio un error al tratar de ingresar en la tabla %s",$realTableName),
                                    "sql"  => $sql,
                                    "params" => $toBind,
                                    "POST" => $_POST,
                                ];          
            }
        }
        else if ($_POST["operacion"] == "Modificar"){
            
            $arrayColumns = array();
            $columnNames = array_keys($_POST["campos"][0]["update"]);
            $countColumns = count($columnNames);
            $types = explode(",",$_POST["types"]);
            foreach ($columnNames as $columnIndex => $columnName){
                $arrayColumns[] = sprintf("%s = C.%s::%s",$columnName,$columnName,$types[$columnIndex]);
            }
            $arrayBind = array();
            $arrayParams = array();
            foreach($_POST["campos"] as $recordIndex => $record){
                $fieldIndex = 0;
                $params = array();
                foreach($record["update"] as $columnName => $columnValue){
                    $paramName = sprintf(":%s%s%s",$columnName,$recordIndex,$fieldIndex);
                    if ((($columnName == 'fecha') && ($columnValue == "")) || 
                         ($columnValue == 'null')){
                        $arrayBind[$paramName] = null;
                    }
                    else {
                        $arrayBind[$paramName] = $columnValue; 
                    }
                    $fieldIndex++;
                    $params[] = $paramName;
                }
                $paramName = sprintf(":%s%s%s",$_POST["primaryField"],$recordIndex,$countColumns);
                $params[] = $paramName;
                $arrayBind[$paramName] = $record["primaryValue"];
                $arrayParams[] = sprintf("(%s)",implode(",",$params));
            }

            $sql = sprintf("UPDATE %s as T SET ",$_POST["tableName"]);
            $sql .= implode(",",$arrayColumns);
            $sql .= sprintf(" FROM (VALUES %s)",implode(",",$arrayParams));
            $sql .= sprintf(" AS C(%s,%s)",implode(",",$columnNames),$_POST["primaryField"]);
            $sql .= sprintf(" WHERE C.%s::%s=T.%s",$_POST["primaryField"],$types[count($types)-1],$_POST["primaryField"]);
            $statement = $connection->prepare($sql);
            $pdotype = null;
            $countType = 0;
            foreach($arrayBind as $param => $val){
                switch ($types[$countType++]) {
                    case 'integer'      : $pdotype = PDO::PARAM_INT; break;
                    case 'boolean'      : $pdotype = PDO::PARAM_BOOL; break;
                    case 'text'         : $pdotype = PDO::PARAM_STR; break;
                    case 'timestamp'    : $pdotype = PDO::PARAM_STR; break;
                    case 'numeric'      : $pdotype = PDO::PARAM_STR; break;
                }
                $statement->bindValue($param, $val);
            }  
            $tableName = explode('.',$_POST["tableName"]);
            $realTableName = (isset($_POST["realTableName"]))?$_POST["realTableName"]:$tableName[sizeof($tableName)-1];
            if($result = $statement->execute()){
                $mensajes[] =   [
                    "tipo" => "success",
                    "sql" => $sql,
                    "mesg" => sprintf("Registro(s) Actualizado(s) en la tabla %s",$realTableName),    
                ];
            }
            else{
                $mensajes[] =   [
                    "tipo"   => "error",
                    "mesg"   => sprintf("Ocurrio un error al tratar de modificar en la tabla %s",$realTableName),
                    "columns" => $arrayColumns,
                    "bind" => $arrayBind,
                    "POST" => $_POST,
                    "params" => $arrayParams,
                    "sql" => $sql,
                    "error" => $connection->errorInfo()
                ];          
            }          
        }
        else {
            
            $whereStr = '';
            if (isset($_POST["where"])){
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
                
            }
            $sql = sprintf("DELETE FROM %s %s",$_POST["tableName"],$whereStr);
            $statement = $connection->prepare($sql);
            if($result = $statement->execute()){
                $mensajes[] =   [
                    "sql"  => $sql,
                    "tipo" => "success",
                    "mesg" => sprintf("Registro(s) Eliminados(s) en la tabla %s",$_POST["tableName"]),    
                ];                
            }
            else {
                $mensajes[] =   [
                    "sql"    => $sql,
                    "tipo"   => "error",
                    "mesg"   => sprintf("Ocurrio un error al tratar de eliminar en la tabla %s",$_POST["tableName"]),
                    "sql" => $sql,
                ];
            }
        }
        echo json_encode($mensajes);
    }   
?>