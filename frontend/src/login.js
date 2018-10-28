(function () {
	/*
	  Login.js for login.html. Implement the login and sign up function.
	*/
    'use strict';
    document.getElementById("toLogin").onclick = function() {myFunction()};
    document.getElementById("toSignup").onclick = function() {myFunction()};
    document.getElementById("submit").onclick = function(){Login()};
	document.getElementById("submit1").onclick = function(){SignUp()};
	
    function myFunction() {
        var x = document.getElementById("loginform");
        var y = document.getElementById("signupform");
        if(x.style.display === "none"){
            x.style.display="block";
            y.style.display="none";
        }
        else{
            x.style.display="none";
            y.style.display="block";
        }
    }

    function Login(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        console.log(username);
        console.log(password);
        if ( username != "" && password != ""){
			const user = {
				"username": username ,
				"password": password
			}
			console.log(user);
			  const rawResponse = fetch('http://localhost:5000/auth/login', {
				method: 'POST',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				  if(myJson['message'] == "Invalid Username/Password"){
					  console.log(myJson['message']);
					 document.getElementById("error").style.display = "block";
				  }
				  else{
					  var token = myJson;
					  console.log("myjson " +myJson['token'] );
					  console.log("token " + token);
					  alert("Login success");
					  if (typeof(Storage) !== "undefined") {
						// Store
						localStorage.setItem("token", myJson['token']);
						localStorage.setItem("host", username);
						// Retrieve
						console.log(localStorage.getItem("token"));
					  }
					//  window.location = '/homepage?username=' + username;
					 window.location = '/homepage?username=' + username + '&token=' + myJson['token'];
					  //Token ef1759ceea339874659a914bba2598c996f6fb77cc06b1fd1bb16db37efcb89c [format for feed request]
				  }
			  });
			
            return false;
        }
		else if(username == "" && password == ""){
			alert("Please filled out the username and password");
			return false;
		}
		else if(username == ""){
			alert("Please filled out the username.");
			return false;
		}
        else{
            alert("Please filled out the password");
            return false;
        }
    }
	
	function SignUp(){
		var username = document.getElementById("username1").value;
        var password = document.getElementById("password1").value;
		var email = document.getElementById("email").value;
        var name = document.getElementById("name").value;
		console.log(username);
		console.log(password);
		console.log(name);
		console.log(email);
		if ( username != "" && password != "" && email != "" && name != ""){
			const user = {
				"username": username ,
				"password": password,
				"email": email,
				"name": name
			}
			
			  console.log(user);
			  const rawResponse = fetch('http://localhost:5000/auth/signup', {
				method: 'POST',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				 if(myJson['message'] == "Username Taken"){
					  console.log(myJson['message']);
					 document.getElementById("errorU").style.display = "block";
				  }
				  else{
					  var token = myJson;
					  console.log("myjson " +myJson['token'] );
					  console.log("token " + token);
					  alert("Sign Up success. Login as " + username);
					  if (typeof(Storage) !== "undefined") {
						// Store
						localStorage.setItem("token", myJson['token']);
						localStorage.setItem("host",username);
						// Retrieve
						console.log(localStorage.getItem("token"));
					 }
					 window.location = '/homepage?username=' + username + '&token=' + myJson['token'];
					//	window.location = '/homepage?username=' + username; 
					  //Token ef1759ceea339874659a914bba2598c996f6fb77cc06b1fd1bb16db37efcb89c [format for feed request]
				  }
			  });
		 }
		 else{
			 alert("Please filled out all the details");
			 return false;
		 }
	}
}());

