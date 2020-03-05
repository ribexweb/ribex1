<?php
header('Content-Type: application/json');

function login($texto){
    $ddf = fopen('/tmp/login.log','a');
    fwrite($ddf,"[".date("r")."] Login $texto\r\n");
    fclose($ddf);
} 

include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
if ((isset($_POST["p_login"])) && (isset($_POST["p_passw"]))){
	$login = $_POST["p_login"];
    $pass  = $_POST["p_passw"];
    $consulta = DbUser($login,$pass);
    if ($consulta["success"] == 1){
        $consulta = crearSesion($login,$pass);
        if ($consulta["success"] == 1) {
            $_SESSION['usuario'] = $consulta["usuario"];
            login($login);

        }
    } 
	echo json_encode($consulta);  
}
else {
	echo "error tratable luego...";
}
	
	//print_r($consulta);
?>