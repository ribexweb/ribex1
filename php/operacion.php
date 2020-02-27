<?php
   include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (isset($_POST["operacion"])){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        if ($_POST["operacion"] == "Ingresar"){
            $query = sprintf("INSERT INTO %s ",$_POST["tableName"]);
            $fieldCount = count($_POST["campos"]);
            $contador = 0;
            $fieldStr = "(";
            $fieldVal = "(";
            $params = array();
            foreach($_POST["campos"] as $field => $value){
                if (++$contador !== $fieldCount) {
                    $fieldStr .= sprintf("%s ,",$field);
                    $fieldVal .= sprintf(":%s,",$field); 
                }
                else {
                    $fieldStr .= sprintf("%s)",$field);
                    $fieldVal .= sprintf(":%s)",$field);
                }    
                $params[sprintf(":%s",$field)] = $value; 
            }

            $query .= sprintf("%s VALUES %s",$fieldStr,$fieldVal);
            $statement = $connection->prepare($query);
            $result = $statement->execute($params);
            //echo $query;
            if(!empty($result))
		    {
			    echo sprintf('Registro Ingresado en %s',$_POST["tableName"]);
		    }
        }
        else {
            $query = sprintf("UPDATE %s SET ",$_POST["tableName"]);
            $fieldCount = count($_POST["campos"]);
            $contador = 0;
            $fieldStr = "";
            foreach($_POST["campos"] as $field => $value){
                if (++$contador !== $fieldCount) {
                    $fieldStr .= sprintf("%s = :%s ,",$field,$field);
                }
                else {
                    $fieldStr .= sprintf("%s = :%s",$field,$field);

                }    
                $params[sprintf(":%s",$field)] = $value; 
            }

            $query .= sprintf("%s WHERE %s=%s",$fieldStr,$_POST["primaryField"],$_POST["primaryValue"]);
            $statement = $connection->prepare($query);
            $result = $statement->execute($params);
            if(!empty($result))
		    {
			    echo sprintf('Registro %s con %s=%s fue Actualizado',$_POST["tableName"],$_POST["primaryField"],$_POST["primaryValue"]);
            }
            else{
            }

        

            
        }
    }   
?>