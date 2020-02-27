<?php
    include_once($_SERVER['DOCUMENT_ROOT'] ."/php/funciones.php");
    if (isset($_SESSION["usuario"]["datos"]["idusuario"])){

        construirMenu2($_SESSION["usuario"]["datos"]["idusuario"],-1,"",true);

    }
    else {
        wr("Error tratable luego");
    }

    function construirMenu($rol,$padre,$ruta,$inicio){

        $condicionPadre = ($padre == -1)?"padre is null":sprintf("padre = %s",$padre);

        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $query = sprintf("SELECT * from vrolespaginas where (idrol=:idrol) and (%s) and (pagi_activa = true) and (role_activo=true) and (rolepagina_activo=true) order by posicion",$condicionPadre);
        $params = array();
        $params[":idrol"] = $rol;
        $statement = $connection->prepare($query);
        $statement->execute($params);
        if ($inicio) wr('<ul class="sidebar-menu" data-widget="tree">');
        while($registro = $statement->fetch(PDO::FETCH_LAZY)){
            switch ($registro->tipo){
                case 0: wr(sprintf('<li class="header">%s</li>',$registro->pagi_nombre));
                        construirMenu($rol,$registro->idpagina,$registro->ruta."/",false);
                        break;
                case 1: wr('<li class="treeview">');
                        wr('    <a href="#">');
                        wr(sprintf('            <i class="fa %s"></i>',$registro->icono));
                        wr(sprintf('        <span>%s</span>',$registro->pagi_nombre));
                        wr('        <span class="pull-right-container">');
                        wr('            <i class="fa fa-angle-left pull-right"></i>');
                        wr('        </span>');
                        wr('    </a>');
                        wr('    <ul class="treeview-menu">');
                        construirMenu($rol,$registro->idpagina,$registro->ruta."/",false);
                        wr('    </ul>');
                        wr('</li>');
                        break;
                case 2: $pagina = sprintf("index.php?pag=paginas/%s%s/index.php",$ruta,$registro->ruta);
                        wr(sprintf('<li><a href="javascript:load(%s,1)"><i class="fa %s"></i> <span>%s</span></a></li>',$registro->idpagina,$registro->icono,$registro->pagi_nombre));
                        break;
            }
            
            
        }
        if ($inicio) wr("</ul>");
  




    }

    function construirMenu2($idusuario,$padre,$ruta,$inicio){

        $condicionPadre = ($padre == -1)?"padre is null":sprintf("padre = %s",$padre);

        $connection = new PDO(sprintf("pgsql:host=%s;dbname=%s;user=%s;password=%s;port=%s",SERVIDOR,BASEDATOS,USUARIO,PASSWORD,PUERTO));
        $query = sprintf("SELECT * from vusuariospaginas where (idusuario=:idusuario) and (%s) and (activa = true) and (view=true) order by posicion",$condicionPadre);
        $params = array();
        $params[":idusuario"] = $idusuario;
        $statement = $connection->prepare($query);
        $statement->execute($params);
        if ($inicio) wr('<ul class="sidebar-menu" data-widget="tree">');
        while($registro = $statement->fetch(PDO::FETCH_LAZY)){
            switch ($registro->tipo){
                case 0: wr(sprintf('<li class="header">%s</li>',$registro->nombre));
                        construirMenu2($idusuario,$registro->idpagina,$registro->ruta."/",false);
                        break;
                case 1: wr('<li class="treeview">');
                        wr('    <a href="#">');
                        wr(sprintf('            <i class="fa %s"></i>',$registro->icono));
                        wr(sprintf('        <span>%s</span>',$registro->nombre));
                        wr('        <span class="pull-right-container">');
                        wr('            <i class="fa fa-angle-left pull-right"></i>');
                        wr('        </span>');
                        wr('    </a>');
                        wr('    <ul class="treeview-menu">');
                        construirMenu2($idusuario,$registro->idpagina,$registro->ruta."/",false);
                        wr('    </ul>');
                        wr('</li>');
                        break;
                case 2: $pagina = sprintf("index.php?pag=paginas/%s%s/index.php",$ruta,$registro->ruta);
                        wr(sprintf('<li><a href="javascript:load(%s,1)"><i class="fa %s"></i> <span>%s</span></a></li>',$registro->idpagina,$registro->icono,$registro->nombre));
                        break;
            }
            
            
        }
        if ($inicio) wr("</ul>");

    }
?>