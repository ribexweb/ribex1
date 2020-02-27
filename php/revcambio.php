<?php
header('Content-Type: application/json');
include_once "funciones.php";

if ((isset($_POST["p_login"])) && (isset($_POST["p_oldpass"])) && (isset($_POST["p_newpass"]))){
	$login = $_POST["p_login"];
    $oldpass  = $_POST["p_oldpass"];
    $newpass  = $_POST["p_newpass"];
    $consulta = dbUser($login,$oldpass); 
	if ($consulta["success"] == 1) {
		$consulta = dbCambio($login,$newpass);
	}
	echo json_encode($consulta);
}
else {
	echo "error tratable luego...";
}
	
	//print_r($consulta);
?>