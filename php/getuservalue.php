<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (isset($_SESSION["usuario"]["datos"]["idusuario"])){
        /*$connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $query = sprintf("select * from vusuarios where idusuario=%s",$_SESSION["usuario"]["datos"]["idusuario"]);
        $statement = $connection->prepare($query);
        $result = $statement->execute();
        if ($registro = $statement->fetch(PDO::FETCH_LAZY)){
            wr($registro[$_POST["field"]]);
        }*/
        wr($_SESSION["usuario"]["datos"][$_POST["field"]]);
    }
    else{
        wr('Error tratable luego....');
    }
?>