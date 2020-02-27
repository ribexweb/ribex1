<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if ((isset($_POST['key'])) && (isset($_POST['value']))) {
        $_SESSION[$_POST['key']] = $_POST["value"];
        wr("variable seteada");
    }
    else {
        wr("error tratable luego");
    }
?>