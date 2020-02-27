<?php
header('Content-Type: application/json');
include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");

if ((isset($_POST["p_login"])) && (isset($_POST["p_passw"]))){
	$login = $_POST["p_login"];
	$pass  = $_POST["p_passw"];
	$consulta = dbUser($login,$pass);
/*	if ($consulta["success"] == 1) {
		$consulta = dbPassword($login,$pass);
		if ($consulta["success"] == 1){
			$_SESSION['usuario'] = $consulta["usuario"];
		}
	}*/
	echo json_encode($consulta);
}
else {
	echo "error tratable luego...";
}
	
	//print_r($consulta);
?>