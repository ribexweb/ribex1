<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/constantes.php");
    if ((isset($_POST['tableName'])) && (isset($_POST['primaryField'])) &&
       (isset($_POST['primaryValue'])) && (isset($_POST['fieldName'])) &&
       (isset($_POST['fieldValue']))){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $query = sprintf("UPDATE %s SET %s=:%s where (%s=:%s)",$_POST["tableName"],$_POST["fieldName"],$_POST["fieldName"],$_POST["primaryField"],$_POST["primaryField"]);
        $params = array();
        $params[sprintf(":%s",$_POST["primaryField"])] = $_POST["primaryValue"];
        $params[sprintf(":%s",$_POST["fieldName"])] = $_POST["fieldValue"];
        $statement = $connection->prepare($query);
        $result = $statement->execute($params);
        if(!empty($result)){
            echo sprintf('Registro de la tabla %s fue Actualizado',$_POST["tableName"]);
            //echo $query;
        }
        else {

        }
    }
?>