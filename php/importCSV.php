
<?php

//import.php
if(!empty($_FILES['fileCSV']['name']))
{
 $file_data = fopen($_FILES['fileCSV']['name'], 'r');
 fgetcsv($file_data);
 while($row = fgetcsv($file_data))
 {
  $data[] = array(
   'idasignacion'  => $row[0],
   'codigo'   => $row[1],
   'cons_nombre'  => $row[2],
   'espa_nombre'  => $row[3],
   'valor' => $row[4]
  );
 }
 echo json_encode($data);
}

?>