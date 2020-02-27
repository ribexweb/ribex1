<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (isset($_POST["name"])){
        if (isset($_SESSION[$_POST["name"]])){
            wr($_SESSION[$_POST["name"]]);
        }
        else {
            wr("");
        }
    }
    else{
        echo "error tratable luego...";
    }
?>