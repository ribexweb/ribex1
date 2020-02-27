<?php
 
/**
 * function to encrypt
 * @param string $data
 * @param string $key
 */
function encrypt($data,$key)
{
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    $encrypted=openssl_encrypt($data, "aes-256-cbc", $key, 0, $iv);
    // return the encrypted string with $iv joined 
    return base64_encode($encrypted."::".$iv);
}
 
/**
 * function to decrypt
 * @param string $data
 * @param string $key
 */
function decrypt($data,$key)
{
    list($encrypted_data, $iv) = explode('::', base64_decode($data), 2);
    return openssl_decrypt($encrypted_data, 'aes-256-cbc', $key, 0, $iv);
}
 
 
$key="1235@";
$string="1456";
 

    echo 'Medidor a Consultar:'.decrypt($_GET['id'],$key);
?>