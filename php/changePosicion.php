<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    $parametros = new StdClass();
    $parametros = $_POST;
    $mensajes = array();
    if (isset($parametros["operacion"])){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $posicionActual = $parametros["posicion"];
        $posicionNueva  = ($parametros["operacion"] == '-')?$posicionActual-1:$posicionActual+1;
        $query = sprintf("UPDATE %s SET posicion=%s WHERE (%s=%s) and (posicion=%s)",$parametros["tableName"],-999,$parametros["idGroupField"],$parametros["idGroupValue"],$posicionNueva);

        $statement = $connection->prepare($query);
        $result = $statement->execute();
        $query = sprintf("UPDATE %s SET posicion=%s WHERE (%s=%s) and (posicion=%s)",$parametros["tableName"],$posicionNueva,$parametros["idGroupField"],$parametros["idGroupValue"],$posicionActual);

        $statement = $connection->prepare($query);
        $result = $statement->execute();
        $query = sprintf("UPDATE %s SET posicion=%s WHERE (%s=%s) and (posicion=%s)",$parametros["tableName"],$posicionActual,$parametros["idGroupField"],$parametros["idGroupValue"],-999);
        $statement = $connection->prepare($query);
        $result = $statement->execute();
    }
    else {
        errorPage();
    }

    
?>