<?php
header('Content-type: text/xml');
include_once($_SERVER['DOCUMENT_ROOT'] ."/paginas/xml/funciones.php");
include_once($_SERVER['DOCUMENT_ROOT'] ."/paginas/xml/constantes.php");
$XML = new SimpleXMLElement("<data></data>");
$info = $XML->addChild("informacion");
$copy = $info->addChild("copyright","Ribe Ingenieria, Chile 2019");
$uso  = $info->addChild("language","es");
if (isset($_GET["token"])){
    if (isset($_GET["idedificio"])){
        $token = $_GET["token"];
        $idedificio= $_GET["idedificio"];
        $idmedidor= isset($_GET["idmedidor"])?$_GET["idmedidor"]:null;
        $idvariable = isset($_GET["idvariable"])?$_GET["idvariable"]:null;
        $resp = token_existe($token);
        switch ($resp["return"]) {
            case -1 : 
                $error = $XML->addChild('error');
                $error->addChild('codigo',ERROR_DATABASE);
                $error->addChild('mensaje','problemas de conexion a la base de batos');         
            break;
            case 0:
                $error = $XML->addChild('error');
                $error->addChild('codigo',TOKEN_NO_EXISTE);
                $error->addChild('mensaje','token no existe');    
            break;
            default:
                $infoMedidores = consultar_medidor($token,$idedificio,$idmedidor,$idvariable);
                switch ($infoMedidores["return"]){
                    case -1:
                        $error = $XML->addChild('error');
                        $error->addChild('codigo',ERROR_DATABASE);
                        $error->addChild('mensaje','problemas de conexion a la base de batos');
                    break;
                    case 0:
                        $error = $XML->addChild('error');
                        $error->addChild('codigo',MEDIDOR_NO_EXISTE);
                        $error->addChild('mensaje','medidor no existe');   
                    break;
                    default:
                        $success= $XML->addChild('success');
                        $medidores = $success->addChild('medidores');
                        for ($indexMed=0;$indexMed<count($infoMedidores["records"]);$indexMed++){
                            $medidor = $medidores->addChild("medidor");
                            foreach ($infoMedidores["records"][$indexMed] as $clave => $valor){
                                if (trim($valor) != '') {
                                    $medidor->addChild($clave,$valor);
                                }
                            }
                            $infoVariables = consultar_variable($infoMedidores["records"][$indexMed]["idmedidor"],$idvariable);
                            $variables = $medidor->addChild("variables");
                            for ($indexVar=0;$indexVar<count($infoVariables["records"]);$indexVar++){
                                
                                $variable = $variables->addChild("variable");
                                foreach ($infoVariables["records"][$indexVar] as $clave => $valor){
                                    $variable->addChild($clave,$valor);
                                }    
                            }
                        }
                       // echo count($infoMedidor["records"]);
                    break;
                }              
            break;
        }
    }
    else{
        $error = $XML->addChild('error');
        $error->addChild('codigo',EDIFICIO_VACIO);
        $error->addChild('menssaje','idedificio vacio');          
    }

}
else{
    $error = $XML->addChild('error');
    $error->addChild('codigo',TOKEN_VACIO);
    $error->addChild('menssaje','token vacio');
}
echo $XML->asXML();
?>