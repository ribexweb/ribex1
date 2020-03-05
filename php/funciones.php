<?php
  include_once($_SERVER['DOCUMENT_ROOT'] ."/php/constantes.php");
  function dbUser($login,$pass){
    $sql = sprintf("select count(*) as cuenta from public.usuarios where (lower(login)=lower('%s'))",$login);
    $query = execute_query($sql);
    if ($registro = pg_fetch_object($query)){
    if ($registro->cuenta > 0) {
      $sql = sprintf("select count(*) as cuenta from public.usuarios where (lower(login)=lower('%s')) and (activo=true)",$login);
      $query = execute_query($sql);
      if ($registro = pg_fetch_object($query)){
        if ($registro->cuenta > 0) {
          $sql = sprintf("select idusuario,count(*) as cuenta from public.usuarios where (lower(login)=lower('%s')) and (passwd=encrypt('%s','RibexDB_1123581321','3des')) group by idusuario",$login,$pass);
          $query = execute_query($sql);
          if ($registro = pg_fetch_object($query)){
            $idusuario = $registro->idusuario;
            if ($registro->cuenta > 0) {
              $sql = sprintf("select cambiar from public.usuarios where (lower(login)=lower('%s'))",$login);
              $query = execute_query($sql);
              if ($registro = pg_fetch_object($query)){ 
                $_SESSION['login'] = $login; 
                return ["success" => 1,"idusuario" => $idusuario,"cambiar" => (bool)($registro->cambiar=='t')];
              }
              else {
                return ["success" => 0,"mensaje" => "Problemas en la consulta (Cambiar), consulte al administrador"];  
              }
            }
            else {
              return ["success" => 0,"mensaje" => "La Contraseña del usuario es incorrecta"];
            }
          }
          else {
            return ["success" => 0,"mensaje" => "La Contraseña del usuario es incorrecta"];  
          }
        } 
        else{
          return ["success" => 0,"mensaje" => "Usuario Inactivo, consulte al Administrador"];
        }
      }
      else {
        return ["success" => 0,"mensaje" => "Problemas en la consulta (Activo), consulte al administrador"];
      }
    }
    else{
      return ["success" => 0,"mensaje" => "Usuario no Registrado"];
    }
    }
    else {
      return ["success" => 0,"mensaje" => "Problemas en la consulta (Usuario), consulte al administrador"];
    }

  }

  function dbCambio($login,$newpass){
    $sql = sprintf("update public.usuarios set cambiar=false,passwd=encrypt('%s','RibexDB_1123581321','3des')",$newpass);
    $sql .= sprintf("where (lower(login)=lower('%s'))",$login);
    $mensajes = array();
    if ($query = execute_query($sql)) {
      $mensajes["success"] = 1; 
    }
    else {
      $mensajes["success"] = 0;
      $mensajes["error"] = "Error modificando la contraseña";
    }

    return $mensajes;

  }

  function is_session_started(){
      if ( php_sapi_name() !== 'cli' ) {
          if ( version_compare(phpversion(), '5.4.0', '>=') ) {
              return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
          } else {
              return session_id() === '' ? FALSE : TRUE;
          }
      }
      return FALSE;
  }

  function crearSesion($login,$pass){
      $sql = sprintf("select idusuario,idrol,nombres, apellidos,login,activo,cambiar,direccion,email,telefono,database from public.vusuarios where (lower(login)=lower('%s')) and (passwd=encrypt('%s','RibexDB_1123581321','3des'))",$login,$pass);
      $query = execute_query($sql);
      if ($registro_datos = pg_fetch_assoc($query)){

          /*$sql2 = sprintf("select idmodulo,nombre from vmodulosusuarios where (idusuario=%s) and (activo=true) and (modu_activo=true)",$registro_datos["idusuario"]);

          $query2 = execute_query($sql2);
          $modulos = array();
          while ($registro_modulos = pg_fetch_assoc($query2)){
            $modulos[] = $registro_modulos;
          }*/
          
          //$sql3 = sprintf("select idpermisoentidad,idedificio,nombre,potenciatotal::integer,activo::integer from obtener_Edificios(%s)",$registro_datos["idusuario"]);
          $sql3 = sprintf("select idpermisoentidad,idedificio,nombre,activo::integer from public.obtener_Edificios(%s)",$registro_datos["idusuario"]);

          $query3 = execute_query($sql3);
          $edificios = array();
          while ($registro_edificios = pg_fetch_assoc($query3)){

        /*   $sqlprom = sprintf("select idmedidor from widgets where (activo=true) and (tipo=1) and (idpermisoentidad=%s)",$registro_edificios["idpermisoentidad"]);
            $queryprom = execute_query($sqlprom);
            $promedios = array();
            while ($registro_prom = pg_fetch_assoc($queryprom)) {
              $registro_prom['activo'] = false;
              $promedios[] = $registro_prom;
            }

            $sqlprom = sprintf("select idmedidor from widgets where (activo=true) and (tipo=2) and (idpermisoentidad=%s)",$registro_edificios["idpermisoentidad"]);
            $queryprom = execute_query($sqlprom);
            $potenciadia = array();
            while ($registro_poten = pg_fetch_assoc($queryprom)) {
              $registro_poten['activo'] = false;
              $registro_poten['ultimafecha'] = null;
              $potenciadia[] = $registro_poten;
            }

            $sqlenerg = sprintf("select idmedidor from widgets where (activo=true) and (tipo=3) and (idpermisoentidad=%s)",$registro_edificios["idpermisoentidad"]);
            $queryenerg= execute_query($sqlenerg);
            $energiames = array();
            while ($registro_energ = pg_fetch_assoc($queryenerg)) {
              $registro_energ['activo'] = false;
              $registro_energ['ultimafecha'] = null;
              $energiames[] = $registro_energ;
            } */
            


            //$registro_edificios['potenciatotal'] = (bool)$registro_edificios['potenciatotal'];
            $registro_edificios['activo'] = (bool)$registro_edificios['activo'];
            //$registro_edificios['promedios'] = $promedios;
          // $registro_edificios['potenciadia'] = $potenciadia;
          // $registro_edificios['energiames'] = $energiames;
            $edificios[] =  /*[ idpermisoentidad => $registro_edificios["idpermisoentidad"],
                              identidad        => $registro_edificios["identidad"],
                              nombre           => $registro_edificios["nombre"],
                              potenciatotal    => $registro_edificios["potenciatotal"],
                              activo           => $registro_edificios["activo"],
                              promedios        => [],
                            ];*/$registro_edificios;

          }

          $sql4 = sprintf("select * from public.obtener_Consumidores(%s) where (idedificio not in (select idedificio from public.Obtener_Edificios(%s)));",$registro_datos["idusuario"],$registro_datos["idusuario"]);

          $query4 = execute_query($sql4);
          $medidores = array();
          while ($registro_medidores = pg_fetch_assoc($query4)){
            $medidores[] = $registro_medidores;
          }


          return ["success" => 1,
                  "usuario" => ["datos" => $registro_datos,
                                "edificios" => $edificios,
                                "medidores" => $medidores]]; 
      }
      else {
        return ["success" => 0,"mensaje" => "La contraseña es incorrecta"];
      }

    }   

    function cargar_pagina($pagina){
      if (file_exists($pagina)){
        include_once $pagina;
      }
      else {
        $page = $pagina;
        include_once("php/404.php");
      }  
    }
    
    function wr($texto){
      echo $texto;
    }

    function logout(){
      session_destroy();
    }

    function sesion_creada(){
      return (isset($_SESSION['usuario']) && ($_SESSION['usuario']['datos']['login'] != ""));
    }


    function load_page($page){
        include_once sprintf("%s.php",$page);
    }


    function execute_query($sql){
        $connString = sprintf("host=%s dbname=%s user=%s password=%s port=%s connect_timeout=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO,TIMEOUT);
        if ($conn =  @pg_connect($connString)) {
          if ($query = @pg_query($sql)){
            return $query;
          } 
          else {
            wr(sprintf("no se pudo realizar la consulta [%s]",$sql));
          } 
        }
        else{
          wr(sprintf("<script type='text/javascript'>error('Error en conexion a </br><b>host</b>=%s</br> <b>port</b>=%s</br> <b>dbname</b>=%s</br><b>user</b>=%s',0);</script>",SERVIDOR,PUERTO,BASEDATOS,USUARIO));
        }
          
    }

    function execute_query2($sql){
        $connString = sprintf("host=%s dbname=%s user=%s password=%s port=%s connect_timeout=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO,TIMEOUT);
        if ($conn =  @pg_connect($connString)) {
          if ($query = @pg_query($sql)){
            return ["success" => 1,
                    "sql"     => $sql,
                    "query"   => $query];
          } 
          else {
            return ["success" => 0,
                    "msg"     => sprintf("No se pudo realizar la consulta"),
                    "sql"     => $sql];
          } 
        }
        else{
          return ["success" => 0,
                  "msg"     => sprintf("Error en conexion a host:%s port:%s dbname:%s user:%s",SERVIDOR,PUERTO,BASEDATOS,USUARIO),
                  "sql"     => $sql];
        }
          
    }


    function select($nameSelect,$idSelect,$classSelect,$fieldselect,$tabla,$fieldorder,$fieldshow,$fieldvalue,$show = false){
          $sql = sprintf("select %s from %s order by %s",$fieldselect,$tabla,$fieldorder);
          if ($show) wr($sql);
          if ($query = execute_query($sql)){
            wr(sprintf("<select name='%s' id='%s' class='%s'>",$nameSelect,$idSelect,$classSelect));
            while ($reg = pg_fetch_assoc($query)) {
              wr(sprintf("<option value=%s>%s</option>",$reg[$fieldvalue],$reg[$fieldshow]));
            }     
            wr("</select>");
          }
      }

    function whereConstruct($whereField,$whereOper,$whereValue,$valueType,$whereLogi){
        $str = "";
          for ($i=0;$i<count($whereField);$i++){
            if ($i != count($whereField)-1) {
              switch ($valueType[$i]) {
                case "int"  :    $str .= sprintf("(%s %s %s) %s ",$whereField[$i],$whereOper[$i],$whereValue[$i],$whereLogi[$i]);break;
                default :    $str .= sprintf("(%s %s '%s') %s ",$whereField[$i],$whereOper[$i],$whereValue[$i],$whereLogi[$i]);break;
              }
            }
            else {
              switch ($valueType[$i]) {
                case "int"  : $str .= sprintf("(%s %s %s)",$whereField[$i],$whereOper[$i],$whereValue[$i]);break;
                default : $str .= sprintf("(%s %s '%s')",$whereField[$i],$whereOper[$i],$whereValue[$i]);break; 
              }
            }    
          }
        return $str;
    }



  /**************SEGURIDAD Y ACCESO*********************/
  function modulo_permitido($idmodulo){

    if (isset($_SESSION["usuario"]["modulos"])){
      #echo ($k = array_search($idmodulo,array_column($_SESSION["usuario"]["modulos"], 'idmodulo')) === FALSE);
      return ($k = array_search($idmodulo,array_column($_SESSION["usuario"]["modulos"], 'idmodulo')) !== FALSE);
    }
    else{
      return false;
    }
  }

  function getDataSesion($entidad,$field){
    return implode(",", array_column($_SESSION["usuario"][$entidad], $field));
  }

  function getDataSesionArray($entidad,$field){
    return array_column($_SESSION["usuario"][$entidad], $field);
  }

  function obtener_EdificiosNombres(){
    return implode(",", array_column($_SESSION["usuario"]["edificios"], 'nombre'));
  }

  function obtener_Medidores(){
    return implode(",", array_column($_SESSION["usuario"]["medidores"], 'idmedidor'));
  }

  function buscar_array($array,$field,$value){
      $enc = -1;
      for ($index=0;$index<count($array);$index++){
          if ($array[$index][$field] == $value) {
              $enc = $index;
              break;
          }
      }
      return $enc;
  }

  function query($queries){
    $sentencias = array();
    if (!(isset($queries))){
      $entencias[] = ["mensaje"=>"No hay consultas, utilice el parametro queries..."];
    } 
    else{
        $parametros = $queries;
        foreach ($parametros as $param){
            //print_r($param);
            $select      = (isset($param["fieldsSelect"]))?implode(",",$param["fieldsSelect"]):"*";
            $tableName       = $param["tableName"]; 
            /************Construccion de Clausula Where*********************/ 
            $where = [];
            $whereStr = "";
            if (isset($param["where"])){
                $where = $param["where"];
                $whereStr = "WHERE ";
                for ($whereIndex = 0;$whereIndex<count($where);$whereIndex++){
                    $wh = $where[$whereIndex]; 
                    if ($whereIndex > 0){
                        if (isset($wh["logical"])) {
                            $whereStr.= sprintf(" %s ",$wh["logical"]);            
                        }
                        else {
                            $entencias[] = ["Consulta mal construida falta operador lógico (and,or) en clausula Where N° ".($whereIndex+1)];
                        }
                    }  
        
                    if (isset($wh["not"])){
                        if ($wh["not"] == 1){
                            $formatStr = ($wh["type"] == "int")?"(%s(%s %s %s))":"(%s(%s %s '%s'))";
                            $whereStr.=sprintf($formatStr,"Not",$wh["field"],$wh["oper"],$wh["value"]);
                        }
                        else{
                            $formatStr = ($wh["type"] == "int")?"(%s %s %s)":"(%s %s '%s')";
                            $whereStr.=sprintf($formatStr,$wh["field"],$wh["oper"],$wh["value"]);
                        }  
                    }
                    else {
                        $formatStr = ($wh["type"] == "int")?"(%s %s %s)":"(%s %s '%s')";
                        $whereStr.=sprintf($formatStr,$wh["field"],$wh["oper"],$wh["value"]);
                    }
                }
            }
            /********************Fin Construccion de Clausula Where***************/  
            /*******************Construcion de clausula Order by*****************/
            $orderby = [];
            $orderbyStr = "";
            if (isset($param["orderby"])){
            $orderby = $param["orderby"];
            $orderbyStr = "ORDER BY ";
            }  
            for ($orderbyIndex=0;$orderbyIndex<count($orderby);$orderbyIndex++){
            $ordby = $orderby[$orderbyIndex];
            $orderbyStr.= ($orderbyIndex < count($orderby)-1)?sprintf("%s %s,",$ordby["field"],$ordby["type"]):sprintf("%s %s",$ordby["field"],$ordby["type"]);
            }
            /************Fin de Construccion de Clausula Order by ****************/
            $sql = sprintf("SELECT %s FROM %s %s %s",$select,$tableName,$whereStr,$orderbyStr);
            $datos = [ 
                "sql" => $sql,
                "fields" => array(),
                "resultados" => array(), 
            ];
            $sentencias[] = $datos;
        }
        for ($index=0;$index<count($sentencias);$index++){
            if ($query = execute_query2($sentencias[$index]["sql"])){
                if ($query["success"]){
                    for ($indexField=0;$indexField<pg_num_fields($query["query"]);$indexField++){
                        $sentencias[$index]["fields"][] = [
                            "type" => pg_field_type($query["query"], $indexField),
                            "size" => pg_field_size($query["query"], $indexField),
                            "name" => pg_field_name($query["query"], $indexField),
                            "table"=> pg_field_table($query["query"], $indexField),
                        ];
                    }
                    while ($record = @pg_fetch_array($query["query"])){
                        $sentencias[$index]["resultados"][] = $record;
                    }
                } 
            }
        }
        if (!($query["success"])) {
            $sentencias[] = [ 
                "sql" => $query["sql"],
                "fields" => array(),
                "resultados" => array(),
                "msg" => $query["msg"] 
            ];
        }
    }

    return $sentencias;
  }

  function errorPage(){
    wr("Error Pagina, se definira despues...");
  }

  function indent($json) {

    $result      = '';
    $pos         = 0;
    $strLen      = strlen($json);
    $indentStr   = '  ';
    $newLine     = "\n";
    $prevChar    = '';
    $outOfQuotes = true;

    for ($i=0; $i<=$strLen; $i++) {

        // Grab the next character in the string.
        $char = substr($json, $i, 1);

        // Are we inside a quoted string?
        if ($char == '"' && $prevChar != '\\') {
            $outOfQuotes = !$outOfQuotes;

        // If this character is the end of an element,
        // output a new line and indent the next line.
        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
            $result .= $newLine;
            $pos --;
            for ($j=0; $j<$pos; $j++) {
                $result .= $indentStr;
            }
        }

        // Add the character to the result string.
        $result .= $char;

        // If the last character was the beginning of an element,
        // output a new line and indent the next line.
        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
            $result .= $newLine;
            if ($char == '{' || $char == '[') {
                $pos ++;
            }

            for ($j = 0; $j < $pos; $j++) {
                $result .= $indentStr;
            }
        }

        $prevChar = $char;
    }

    return $result;
  }

  function referer_valid(){
    return  ((isset($_SERVER['HTTP_REFERER'])) && (($_SERVER['HTTP_REFERER'] == ROOT) || ($_SERVER['HTTP_REFERER'] == LOGIN) || ($_SERVER['HTTP_REFERER'] == HOST_APPNAME)))?1:0;
  }
?>


