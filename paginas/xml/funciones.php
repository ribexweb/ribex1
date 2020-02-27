<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/constantes.php");

    function token_existe($token){
        $r = array();
        $strConn = sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO);
        $connection = new PDO($strConn);
        $sql = "SELECT count(*) as cuenta from public.usuarios where (token='$token')";
        if ($statement = $connection->query($sql)) {
            $record = $statement->fetchAll(PDO::FETCH_ASSOC);
            $cuenta = $record[0]["cuenta"];
        }
        else {
            $cuenta = -1;
        }

        $r["servidor"] = SERVIDOR;
        $r["basedatos"] = BASEDATOS;
        $r["usuario"] = USUARIO;
        $r["puerto"] = PUERTO;
        $r["sql"] = $sql;
        $r["return"] = $cuenta; 
        return $r;
    }



    function consultar_medidor($token,$idedificio,$idmedidor,$idvariable){
        $r = array();
        $sqlRecord = "";
        $strConn = sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO);
        $connection = new PDO($strConn);
        $fieldSelect = "count(*) as cuenta";
        $tableName = sprintf("mediciones.medidores_permisados(%s,(select idusuario from public.usuarios where token='%s'))",$idedificio,$token);
        $sqlCount = sprintf("SELECT %s from %s",$fieldSelect,$tableName);
        if ($idmedidor != null) {
            $sqlCount = $sqlCount . sprintf(' where (idmedidor=%s)',$idmedidor);
        } 
        $r["sql"] = $sqlCount;
        if ($statement = $connection->query($sqlCount)) {
            $record = $statement->fetchAll(PDO::FETCH_ASSOC);
            $cuenta = $record[0]["cuenta"];
            if ($cuenta > 0) {
                $fieldSelect = "idequipo,idmedidor,idmedidorfisico,edif_nombre,codigo,serv_nombre,cons_nombre,ubic_nombre,espa_nombre,usos_nombre";
                $sqlRecord = sprintf("SELECT %s from %s",$fieldSelect,$tableName);
                if ($idmedidor != null) {
                    $sqlRecord = $sqlRecord . sprintf(' where (idmedidor=%s)',$idmedidor);
                }
                $r["sql"] = $sqlRecord;
                if ($statement = $connection->query($sqlRecord)) {
                    $record = $statement->fetchAll(PDO::FETCH_ASSOC);
                    $r["records"] = $record;
                }
                else{
                    $cuenta = -1;    
                }
            }
        }
        else {
            $cuenta = -1;
        } 
        $r["servidor"] = SERVIDOR;
        $r["basedatos"] = BASEDATOS;
        $r["usuario"] = USUARIO;
        $r["puerto"] = PUERTO;
        $r["return"] = $cuenta; 
        return $r;      
    }

    function consultar_variable($idmedidor,$idvariable){
        $r = array();   
        $strConn = sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO);
        $connection = new PDO($strConn); 
        $fieldSelect = "*";
        $tableName = sprintf("mediciones.ultimos_valores_medidor_servidor(%s)",$idmedidor);
        $sql = sprintf("SELECT %s from %s",$fieldSelect,$tableName);
        if ($idvariable != null) {
            $sql = $sql . sprintf(' where (idvariable=%s)',$idvariable);
        } 
        if ($statement = $connection->query($sql)) {
            $record = $statement->fetchAll(PDO::FETCH_ASSOC);
            $r["records"] = $record;
        }   
        $r["servidor"] = SERVIDOR;
        $r["basedatos"] = BASEDATOS;
        $r["usuario"] = USUARIO;
        $r["puerto"] = PUERTO;
        $r["sql"] = $sql; 
        return $r;          
    }
?>