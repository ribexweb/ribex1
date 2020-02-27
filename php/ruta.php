<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");

    function buscarPadre($idchild,$ruta){
        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $query = sprintf("SELECT * from public.vusuariospaginas where (idpagina=%s)",$idchild);
        $statement = $connection->prepare($query);
        $statement->execute();
        if ($registro = $statement->fetch(PDO::FETCH_LAZY)) {
            if (is_null($registro->padre)){
                return sprintf("paginas/%s/%s",$registro->ruta,$ruta);
            }
            else {
                return buscarPadre($registro->padre,sprintf("%s/%s",$registro->ruta,$ruta));
            }
        }  
    }

    $ruta = "";

    if (isset($_POST["idchild"])){
        $ruta = buscarPadre($_POST["idchild"],"index.php");
    }
    else {
        echo "Error tratable luego";
    }
    wr($ruta);
?>