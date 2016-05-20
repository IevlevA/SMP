<?php
$con = new MongoClient();
$collection = $con -> notes -> keeps;
$con -> close();

if($_POST['aim'] == "createNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$note = array('id' => $_COOKIE['id'], 'title' => $title, 'description' => $description);
	$collection -> insert($note);
}

if($_POST['aim'] == "deleteNote") {
	$title = $_POST['title'];
	$description = $_POST['description'];
	$options = array('justOne' => true);
	$note = array('title' => $title, 'description' => $description);
	$collection -> remove($note, $options);
}

if($_POST['aim'] == "editNote") {
	$titleOld = $_POST['titleOld'];
	$descriptionOld = $_POST['descriptionOld'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$collection -> update(array('title' => $titleOld, 'description' => $descriptionOld), array('$set' => array('title' => $title, 'description' => $description)), array('upsert' => false));
}

if($_POST['aim'] == "drawNotes") {
	$notesArray = "[";
	$notes = $collection -> find(array('id' => $_COOKIE['id']));
	while($note = $notes -> getNext()) {
		$notesArray .= json_encode($note);
    	if($notes -> hasNext()) {
    		$notesArray .= ",";
    	}
	}
	$notesArray .= "]";
	echo $notesArray;
}

if($_POST['aim'] == "deleteAll") {
	$collection -> remove(array('id' => $_COOKIE['id']), array ('justOne' => false));
}
 
?>
