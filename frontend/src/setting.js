(function () {
	/**
	 * setting page for user to edit their details 
	 */
    'use strict';
	var url = window.location.href;
    console.log(url);
	console.log(localStorage.getItem("token"));
	var obj = parseURLParams(url);
	console.log(obj['token'][0]);
	console.log(obj['username'][0]);
	console.log(localStorage.getItem("token"));
	console.log("Current user = " + localStorage.getItem("host"));
	
	var username = obj['username'][0];
	var token = obj['token'][0];
	var home = "http://localhost:8080/page?username=" + username + "&token=" + token; 
	var profilePage = "http://localhost:8080/homepage?username=" + username + "&token=" + token; 

	document.getElementById("home").setAttribute("href",home);
	document.getElementById("user").innerHTML = username;
	document.getElementById("user").setAttribute("href",profilePage);
	document.getElementById("logout").addEventListener("click",clear);
	document.getElementById("submit1").onclick = function(){Change()};

	
	function parseURLParams(url) {
		var queryStart = url.indexOf("?") + 1,
			queryEnd   = url.indexOf("#") + 1 || url.length + 1,
			query = url.slice(queryStart, queryEnd - 1),
			pairs = query.replace(/\+/g, " ").split("&"),
			parms = {}, i, n, v, nv;

		if (query === url || query === "") return;

		for (i = 0; i < pairs.length; i++) {
			nv = pairs[i].split("=", 2);
			n = decodeURIComponent(nv[0]);
			v = decodeURIComponent(nv[1]);

			if (!parms.hasOwnProperty(n)) parms[n] = [];
			parms[n].push(nv.length === 2 ? v : null);
		}
		return parms;
	}
	


	
	function Change(){
        var password = document.getElementById("password1").value;
		var email = document.getElementById("email").value;
        var name = document.getElementById("name").value;
		console.log(password);
		console.log(name);
		console.log(email);
		if (password != "" && email != "" && name != ""){
			const user = {
				"email": email,
				"name": username,
				"password": password
			}
			fetch('http://localhost:5000/user/', {
				method: 'PUT',
				headers: {
				 'Authorization':'Token ' + token,
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			  }).then(function(response){
				  console.log(response.status);
				  if(response.status === 200){
					 alert("Detail changes,please login again");
					 window.location = '/';
				  }
				  else{
					  alert("Could not change your details");
					  location.reload();
				  }
			  })	
		}
		else{
			alert("Please fill out all details");
			return;
		}
	}
	
	function clear(){
		console.log("logout user");
		localStorage.clear();
	}
}());