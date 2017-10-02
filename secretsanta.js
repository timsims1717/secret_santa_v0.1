

var postToServer = function (url, json_object, onSuccess, onFailure) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function () {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status >= 200 && request.status < 400) {
				response = request.responseText;
				onSuccess(response);
			} else {
				response = request.responseText;
				onFailure(response);
			}
		}
	};
	request.open("POST",url);
	request.setRequestHeader("Content-Type","text/plain; charset=UTF-8");
	request.send(JSON.stringify(json_object));
};

var getFromServer = function (url,onSuccess,onFailure) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function () {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status >= 200 && request.status < 400) {
				response = JSON.parse(request.responseText);
				onSuccess(response);
			} else {
				response = request.responseText;
				onFailure(response);
			}
		}
	};
	request.open("GET",url);
	request.send();
};

var logResponse = function (response) {
	console.log(response);
	document.getElementById("submit-error").innerHTML = response;
};



var people = [];
var editPerson = -1;

var addTab = document.getElementById("add-tab");
addTab.onclick = function () {
	var addBox = document.getElementById("add-box");
	if (addBox.hidden) {
		showAddTab();
		hideEditTab();
		hideOptionTab();
		hideMessageTab();
	}
};

var editTab = document.getElementById("edit-tab");
editTab.onclick = function () {
	var editBox = document.getElementById("edit-box");
	if (editBox.hidden) {
		hideAddTab();
		showEditTab();
		hideOptionTab();
		hideMessageTab();
	}
};

var optionTab = document.getElementById("option-tab");
optionTab.onclick = function () {
	var optionBox = document.getElementById("option-box");
	if (optionBox.hidden) {
		hideAddTab();
		hideEditTab();
		showOptionTab();
		hideMessageTab();
	}
};

var messageTab = document.getElementById("message-tab");
messageTab.onclick = function () {
	var messageBox = document.getElementById("message-box");
	if (messageBox.hidden) {
		hideAddTab();
		hideEditTab();
		hideOptionTab();
		showMessageTab();
	}
};

var showAddTab = function () {
	var addBox = document.getElementById("add-box");
	addBox.hidden = false;
	resetAddPersonList();
	clearAddErrors();
};

var hideAddTab = function () {
	var addBox = document.getElementById("add-box");
	addBox.hidden = true;
};

var showEditTab = function () {
	var editBox = document.getElementById("edit-box");
	editBox.hidden = false;
	clearEditErrors();
	populateEditList();
};

var hideEditTab = function () {
	var editBox = document.getElementById("edit-box");
	editBox.hidden = true;
};

var showOptionTab = function () {
	var optionBox = document.getElementById("option-box");
	optionBox.hidden = false;
};

var hideOptionTab = function () {
	var optionBox = document.getElementById("option-box");
	optionBox.hidden = true;
};

var showMessageTab = function () {
	var messageBox = document.getElementById("message-box");
	messageBox.hidden = false;
};

var hideMessageTab = function () {
	var messageBox = document.getElementById("message-box");
	messageBox.hidden = true;
};

var resetAddPersonList = function () {
	addPersonList = document.getElementById("add-list");
	addPersonList.innerHTML = "";
	var i = 0;
	var n = people.length;
	var hidden = (n == 0);
	document.getElementById("add-list-head").hidden = hidden;
	for (; i < n; i++) {
		var personItem = document.createElement("li");
		var person = people[i]["name"] + " - " + people[i]["email"];
		personItem.innerHTML = person;
		addPersonList.appendChild(personItem);
	}
};

var clearAddErrors = function () {
	document.getElementById("add-name-label").style.color = "#000000";
	document.getElementById("add-email-label").style.color = "#000000";
	document.getElementById("add-error").innerHTML = "";
};

var addPerson = document.getElementById("add-person");
addPerson.onclick = function () {
	var nameInput = document.getElementById("add-name");
	var emailInput = document.getElementById("add-email");
	var wishListInput = document.getElementById("add-wish-list");
	if (nameInput.value != "" && emailInput.value != "")  {
		var person = {"name":nameInput.value,
					  "email":emailInput.value,
					  "wishList":wishListInput.value,
					  "exclude":-1};
		people.push(person);
		nameInput.value = "";
		emailInput.value = "";
		wishListInput.value = "";
		clearAddErrors();
		resetAddPersonList();
	} else {
		document.getElementById("add-error").innerHTML = "Please fill out the necessary info.";
		if (nameInput.value == "") {
			document.getElementById("add-name-label").style.color = "#dd2222";
		}
		if (emailInput.value == "") {
			document.getElementById("add-email-label").style.color = "#dd2222";
		}
	}
};

var populateEditList = function () {
	var editPersonList = document.getElementById("edit-list");
	editPersonList.innerHTML = "";
	document.getElementById("edit-table").hidden = true;
	document.getElementById("edit-exclude").hidden = true;
	savePerson.hidden = true;
	if (people.length > 0) {
		editPersonList.hidden = false;
		editPerson.hidden = false;
		var emptyItem = document.createElement("option");
		emptyItem.value = -1;
		editPersonList.appendChild(emptyItem);
		var i = 0;
		var n = people.length;
		for (; i < n; i++) {
			var personItem = document.createElement("option");
			personItem.value = i;
			personItem.innerHTML = people[i]["name"];
			editPersonList.appendChild(personItem);
		}
	} else {
		editPersonList.hidden = true;
		editPerson.hidden = true;
		document.getElementById("edit-error").innerHTML = "There's no one to edit yet!";
		document.getElementById("current-edit-person").innerHTML = "-1";
	}
};

var clearEditErrors = function () {
	document.getElementById("edit-name-label").style.color = "#000000";
	document.getElementById("edit-email-label").style.color = "#000000";
	document.getElementById("edit-error").innerHTML = "";
};

var editPerson = document.getElementById("edit-person");
editPerson.onclick = function () {
	var currentPerson = document.getElementById("edit-list").value;
	var currentPersonId = parseInt(currentPerson);
	if (currentPersonId == -1) {
		document.getElementById("edit-error").innerHTML = "You have to select someone from the list!";
		document.getElementById("edit-table").hidden = true;
	} else {
		document.getElementById("current-edit-person").innerHTML = currentPerson;
		document.getElementById("edit-table").hidden = false;
		document.getElementById("edit-name").value = people[currentPersonId]["name"];
		document.getElementById("edit-email").value = people[currentPersonId]["email"];
		document.getElementById("edit-wish-list").innerHTML = people[currentPersonId]["wishList"];
		if (document.getElementById("is-exclude").checked && people.length > 5) {
			var editExcludeList = document.getElementById("edit-exclude-list");
			editExcludeList.innerHTML = "";
			var emptyItem = document.createElement("option");
			emptyItem.value = -1;
			editExcludeList.appendChild(emptyItem);
			var i = 0;
			var n = people.length;
			for (; i < n; i++) {
				var personItem = document.createElement("option");
				personItem.value = i;
				personItem.innerHTML = people[i]["name"];
				editExcludeList.appendChild(personItem);
			}
			document.getElementById("edit-exclude").hidden = false;
			editExcludeList.value = people[currentPersonId]["exclude"];
		}
		savePerson.hidden = false;
	}
};

var savePerson = document.getElementById("save-person");
savePerson.onclick = function () {
	var currentPerson = document.getElementById("current-edit-person").innerHTML;
	var currentPersonId = parseInt(currentPerson);
	if (currentPersonId == -1) {
		document.getElementById("edit-error").innerHTML = "You have to select someone from the list!";
	} else {
		var nameInput = document.getElementById("edit-name");
		var emailInput = document.getElementById("edit-email");
		var wishListInput = document.getElementById("edit-wish-list");
		var editExcludeList = document.getElementById("edit-exclude-list");
		if (nameInput.value != "" && emailInput.value != "")  {
			var person = {"name":nameInput.value,
					  	  "email":emailInput.value,
					  	  "wishList":wishListInput.value,
					  	  "exclude":parseInt(editExcludeList.value)};
			people[currentPersonId] = person;
			populateEditList();
			clearEditErrors();
		} else {
			document.getElementById("edit-error").innerHTML = "Please fill out the necessary info.";
			if (nameInput.value == "") {
				document.getElementById("edit-name-label").style.color = "#dd2222";
			}
			if (emailInput.value == "") {
				document.getElementById("edit-email-label").style.color = "#dd2222";
			}
		}
	}
};

var submit = document.getElementById("submit");
submit.onclick = function () {
	var submitError = document.getElementById("submit-error");
	submitError.innerHTML = "";
	if (people.length < 4) {
		submitError.innerHTML = "You haven't added enough people yet!";
	} else {
		var data = {"people":people,
				"message":document.getElementById("message").value,
				"cost":document.getElementById("gift-cost").value,
				"exclude":document.getElementById("is-exclude").checked,
				"secret":document.getElementById("is-secret").checked};
		postToServer("http://localhost:8080/secretsanta",
				data, logResponse, logResponse);
	}
}