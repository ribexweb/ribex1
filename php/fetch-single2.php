<?php
include_once('constantes.php');
if ((isset($_POST["tableName"])) && (isset($_POST['primaryField'])) && (isset($_POST['primaryValue'])))
{
	$output = array();
	$fields = (isset($_POST["fields"]))?$_POST["fields"]:"*";
	$type  = (isset($_POST["type"]))?$_POST["type"]:"int";
	if ($type == "int"){
		$query = sprintf("SELECT %s FROM %s WHERE %s = %s LIMIT 1",$fields,$_POST['tableName'],$_POST['primaryField'],$_POST['primaryValue']); 
	}
	else{
		$query = sprintf("SELECT %s FROM %s WHERE %s = '%s' LIMIT 1",$fields,$_POST['tableName'],$_POST['primaryField'],$_POST['primaryValue']); 
	}

	$connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
	$statement = $connection->prepare($query);
	$statement->execute();
    $output["sql"] = $query;
    $output["resultados"] = $statement->fetchAll();
	echo json_encode($output);
}
?>