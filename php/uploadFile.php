<?php
//allowed file types
$arr_file_types = ['image/png', 'application/pdf', 'image/jpg', 'image/jpeg'];
 
if (!(in_array($_FILES['file']['type'], $arr_file_types))) {
    $mensajes[] =   [
        "tipo" => "success",
        "mesg" => "Archivo no Permitido ".$_FILES['file']['type'],
    ];
    echo json_encode($mensajes);
    return;
}
 
if (!file_exists('uploads')) {
    mkdir('uploads', 0777);
}

$fileName = $_FILES['file']['name'];
$fileNameCmps = explode(".", $fileName);
$fileExtension = strtolower(end($fileNameCmps));
$newFileName = md5(time() . $fileName) . '.' . $fileExtension;

if (move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $newFileName)){
    $mensajes[] =   [
        "tipo" => "success",
        "mesg" => "Archivo Cargado con éxito",
        "file" => $newFileName,
    ];
}
else {
    $mensajes[] =   [
        "tipo" => "error",
        "mesg" => "Error al subir archivo ".$_FILES['file']['tmp_name'],
    ];
}
 
echo json_encode($mensajes);
die();
?>