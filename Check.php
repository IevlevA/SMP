<?php
$con = new MongoClient();
$collection = $con -> notes -> users;
$cursor = $collection -> find();
$con -> close();

if($_POST['aim'] == "signIn") {
	$login = $_POST['login'];
	$pass = sha1($_POST['pass']);
	$user = $collection -> findOne(array('login' => $login));
	if(is_null($user)) {
		echo "Login or password is incorrect";
	}
	if($user['password'] === $pass) {
		$hash = md5(generateCode());
		setcookie('id', $user["_id"], time()+10000);
		setcookie('hash', $hash, time()+10000);
		$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
		echo "ok";
	}
}

if($_POST['aim'] == "signUp") {
	$login = $_POST['login'];
	$pass = sha1($_POST['pass']);
	$userTest = $collection -> findOne(array('login' => $login));
	if($_POST['login'] == $userTest['login']) {
		echo "Profile already exists";
		exit();
	}
	$person = array("login" => $login, "password" => $pass);
	$collection -> insert($person);
	$user = $collection -> findOne(array("login" => $login));
	$hash = md5(generateCode());
	setcookie('id', $user["_id"], time()+10000);
	setcookie('hash', $hash, time()+10000);
	$collection -> update(array('login' => $login), array('$set' => array('hash' => $hash)), array('upsert' => false));
	echo "ok";
}

if($_POST['aim'] == "checkAutorization") {
	if(isset($_COOKIE['id']) && isset($_COOKIE['hash'])) {
		$con = new MongoClient();
		$collection = $con -> notes -> users;
		$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
		if($user['hash'] === $_COOKIE['hash']) {
			echo $user['login'];
		}
		else echo "Error";
	$con -> close();
	}
	else {
		echo "Error";
	}
}

if($_POST['aim'] == "editProfile") {
	$passNew = sha1(md5($_POST['passNew']));
	$passOld = sha1(md5($_POST['passOld']));
	$user = $collection -> findOne(array("_id" => new MongoId($_COOKIE['id'])));
	if($passOld == $user['password']) {
		$collection -> update(array('_id' => new MongoId($_COOKIE['id'])), array('$set' => array('password' => $passNew)), array('upsert' => false));
		echo "ok";
	}
	else {
		echo "error";
	}
}

if($_POST['aim'] == "logout") {
	setcookie('id', "", time()-3600);
	setcookie('hash', "", time()-3600);
}

function generateCode($length = 15) {
	$chars = "ZXCVBNMASDFGHJKLQWERTYUIOP1234567890xcvbnmasdfghjklqwertyuiop";
	$code = "";
	while (strlen($code) < $length) {
		$char = $chars[mt_rand(0, strlen($chars)-1)];
		$code .= $char;
	}
	return $code;
}
?>