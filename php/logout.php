<?php
   include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
   unset($_SESSION);
   session_destroy();
   //$_SESSION["login"] = "";
?>