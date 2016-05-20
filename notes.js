var titleBeforeEdit = "";
var descrBeforeEdit = "";
var noteToEdit;

//Кроссбраузерная функция создания XMLHttpRequest
function getXmlHttp() {
    var xmlhttp;

    try {
        xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
    } catch(e) {
        try {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
return xmlhttp; 
}


function AddNote() {
	var error = document.getElementById('errorCreation');

	if(document.getElementById('noteTitle').value.trim().length == 0 || document.getElementById('descr').value.trim().length == 0) {
		error.innerHTML = "Fill the fields";
		return;
	}
	else {
		error.innerHTML = "";
	}

	var req = getXmlHttp(); // создать объект для запроса к серверу
	if(req) {
	// onreadystatechange активируется при получении ответа сервера
	req.onreadystatechange = function() {
		if(req.readyState == 4) {  // если запрос закончил выполняться 
			if(req.status == 200) {
				var titleValue = document.getElementById('noteTitle').value;
				var descrValue = document.getElementById('descr').value;
				DrawNote(titleValue, descrValue);
				$('#form').modal("hide");
				//document.getElementById('form').style.display = 'none';
			}
			else alert(req.statusText);
		}
	}
	req.open("POST", 'notesActions.php', true)  // задать адрес подключения
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var params = "title=" + document.getElementById('noteTitle').value + "&description=" + document.getElementById('descr').value + "&aim=createNote";
	req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function EditNote() {
	var error = document.getElementById('errorCreationEdit');
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(document.getElementById('noteTitleEdit').value.trim().length == 0 || document.getElementById('descrEdit').value.trim().length == 0) {
		error.innerHTML = "Fill the fields";
		return;
	}
	else {
		error.innerHTML = "";
	}

	if(req) {
		// onreadystatechange активируется при получении ответа сервера
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					noteToEdit.children[0].innerHTML = document.getElementById('noteTitleEdit').value;
					noteToEdit.children[3].innerHTML = document.getElementById('descrEdit').value;
					$('#formEdit').modal("hide");
				}
				else alert(req.statusText);
			}
		}
		req.open("POST", 'notesActions.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		var params = "title=" + document.getElementById('noteTitleEdit').value + "&titleOld=" + titleBeforeEdit + "&description=" + document.getElementById('descrEdit').value + "&descriptionOld=" + descrBeforeEdit + "&aim=editNote";
		req.send(params); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function Draw() {
	CheckAutorization();

	var req = getXmlHttp();

	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					var noteJ = req.responseText;
					var notesReceived = JSON.parse(noteJ);
					for(var i = 0; i < notesReceived.length; i++) {
						DrawNote(notesReceived[i].title, notesReceived[i].description);
					}
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'notesActions.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=drawNotes"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function DrawNote (title, descr) {
	var note = document.createElement('div');
	var deleteNote = document.createElement('div');
	var editNote = document.createElement('div');
	var noteTitle = document.createElement('p');
	var noteDescription = document.createElement('textarea');

	note.setAttribute('id', 'noteCreated');
	note.setAttribute('class', 'panel');
	deleteNote.setAttribute('title', 'Delete note');
	editNote.setAttribute('title', 'Edit note');
	deleteNote.setAttribute('id', 'deleteNoteCreated');
	editNote.setAttribute('id', 'editNoteCreated');
	noteTitle.setAttribute('id', 'noteTitleCreated');
	noteTitle.setAttribute('class', 'panel-heading text-center');
	editNote.setAttribute('data-toggle', 'modal');
	editNote.setAttribute('data-target', '#formEdit')
	noteDescription.setAttribute('id', 'noteDescriptionCreated');
	noteDescription.setAttribute('class', 'panel-body');
	noteDescription.setAttribute('readonly', 'true');
	noteDescription.setAttribute('maxlength', '2000');

	noteTitle.innerHTML = title;
	noteDescription.innerHTML = descr;

	note.appendChild(noteTitle);
	note.appendChild(editNote);
	note.appendChild(deleteNote);
	note.appendChild(noteDescription);


	editNote.onmouseover = function() {
		this.style.backgroundColor = "#8B877D";
	}

	editNote.onmouseout = function() {
		this.style.backgroundColor = "#B8A994";
	}

	deleteNote.onmouseover = function() {
		this.style.backgroundColor = "#8B877D";
	}

	deleteNote.onmouseout = function() {
		this.style.backgroundColor = "#B8A994";
	}

	editNote.onclick = function() {
		titleBeforeEdit = this.previousSibling.innerHTML;
		descrBeforeEdit = this.nextSibling.nextSibling.innerHTML;
		document.getElementById('noteTitleEdit').value = titleBeforeEdit;
		document.getElementById('descrEdit').value = descrBeforeEdit;
		noteToEdit = this.parentElement;
	}

	deleteNote.onclick = function() {
		var req = getXmlHttp();
		var that = this;
		if(req) {
			req.open("POST", 'notesActions.php', true)  // задать адрес подключения
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			var params = "title=" + this.parentElement.children[0].innerHTML + "&description=" + this.parentElement.children[3].value + "&aim=deleteNote";
			req.send(params); // отослать запрос
			that.parentElement.parentElement.removeChild(that.parentElement);
		}
		else {
			alert("Браузер не поддерживает AJAX");
		}
	}

	document.getElementById('noteCollection').appendChild(note);
}


//проверяет, авторизирован ли пользователь
function CheckAutorization() {
	var req = getXmlHttp();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					if(req.responseText == "Error") {
						location.replace("index.html");
					}
					else {
						document.getElementById('logoutLink').innerHTML = "Log Out (logged as " + req.responseText + ")";
					}
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'Check.php', true);  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=checkAutorization"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}

	setTimeout("CheckAutorization()", 1000);
}


function DeleteAll() {
	var req = getXmlHttp();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4) {  // если запрос закончил выполняться 
				if(req.status == 200) {
					location.reload();
				}
				else alert(req.statusText);
			}	
		}

		req.open("POST", 'notesActions.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=deleteAll"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}


function Logout() {
	var req = getXmlHttp(); // создать объект для запроса к серверу

	if(req) {	
		req.open("POST", 'Check.php', true)  // задать адрес подключения
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send("aim=logout"); // отослать запрос
	}
	else {
		alert("Браузер не поддерживает AJAX");
	}
}