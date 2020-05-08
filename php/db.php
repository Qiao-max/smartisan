<?php
    header("content-type:text/html;charset=utf-8");
    $db = mysqli_connect("localhost","usr","buocgq123");
    mysqli_select_db($db,"dbsmart");
    mysqli_query($db,"set name utf8");
?>