(function () {
    'use strict';
	Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
	if(!Date.now) Date.now = function() { return new Date(); }
	Date.time = function() { return Date.now().getUnixTime(); }
	
	var url = window.location.href;
    console.log(url);
	console.log(localStorage.getItem("token"));
	var obj = parseURLParams(url);
	console.log(obj['token'][0]);
	console.log(obj['username'][0]);
	console.log(localStorage.getItem("token"));
	
	var username = obj['username'][0];
	var token = obj['token'][0];
	document.getElementById("homepage").innerHTML = username;
	document.getElementById("homepage").href = '/homepage?username=' + username + '&token=' + token;
	document.getElementById("nextP").addEventListener("click",nextP);
	document.getElementById('prev').addEventListener("click",previous);
	document.getElementById("logout").addEventListener("click",clear);
	var currentPage = 1;
	var userid = "";
	GetPost();
	
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
	
	
	function GetPost(){
		console.log(token);
		var headers = new Headers();
		headers.append('Authorization',token);
		console.log(headers);
		const rawResponse = fetch('http://localhost:5000/user/', {
				method: 'GET',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				console.log(myJson);
				var elements = document.getElementById("posts");
				if(myJson['following'].length == 0){
					console.log(document.getElementById("warning"));
					document.getElementById("warning").style.display = "block";
					var warn = document.createElement("a");
					warn.setAttribute("href",'/discover?username=' + username + '&token=' + token);
					warn.setAttribute("style","color:orange;margin-left:25%;");
					var Wtxt = document.createTextNode("Discover Users >>");
					warn.appendChild(Wtxt);
					elements.appendChild(warn);
				}
				else{
					  userid = myJson['id'],currentPage;
					  getfeeds(myJson['id'],currentPage);
				}

			  });
		
		return false;
	}
	
	function previous(){
		console.log("click previous");
		console.log(currentPage);
		if(currentPage == 1){
			alert("You are in the front page");
			return;
		}
		currentPage --;
		getfeeds(userid,currentPage,0);
	}
	
	function nextP(){
		console.log("click next");
		console.log(userid);
		currentPage ++;
		getfeeds(userid,currentPage,1);
	}
	
	function getfeeds(id,currentPage,fromN){
     var n = currentPage*10;
	 var p = n-10;
	  var someone = "http://localhost:5000/user/feed/?p=" + p+"&n="+n;
	  console.log(someone);
	  fetch(someone, {
		method: 'GET',
		headers: new Headers({
				'Authorization': 'Token '+ token, 
				'Content-Type': 'application/x-www-form-urlencoded'
	  })
	  }).then(function(response){
		  console.log(response.status);
		  return response.json();
	  })
	  .then(function(js){
		console.log(js);
		console.log(js['posts'].length);
		console.log("test1 ");
		if(js['posts'].length == 0 && fromN == 1){
			alert("No more post to display");
			return;
		}
		var myNode = document.getElementById("posts");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		} 
		
		for(var i = 0;i < js['posts'].length;i++){
			var CurrId = js['posts'][i]['id'];
			var element = document.getElementById("posts");
			
			var divs = document.createElement("div");
			divs.setAttribute("id","post"+CurrId);
			element.appendChild(divs);
			var CurrentE = document.getElementById("post"+CurrId);
			
			var para = document.createElement("h1");
			para.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;font-size:32px;");
			var node = document.createTextNode(js['posts'][i]['meta']['author']);
			para.appendChild(node);
			CurrentE.appendChild(para);
			
			var line = document.createElement("hr");
			CurrentE.appendChild(line);
			
			console.log(js['posts'][i]['id']);
			
			var pic = document.createElement("img");
			var address = "data:image/png;base64,"+js['posts'][i]['src'];
			//console.log("address of picture");
			//console.log(address);
			pic.setAttribute("src",address);
			pic.setAttribute("style","width:100%;display:block;");
			pic.setAttribute("alt",js['posts'][i]['id']);
			CurrentE.appendChild(pic);
			var line = document.createElement("hr");
			CurrentE.appendChild(line);
			
			var table = document.createElement("table");
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			

			var unlike = document.createElement("img");
			var iconU = "";
			if(js['posts'][i]['meta']['likes'].includes(id)){
				iconU = "images/like.png";
			}
			else{
				iconU = "images/unlike.png";
			}
			console.log(iconU);
			
			unlike.setAttribute("src",iconU);
			var idU = "like"+CurrId;
			unlike.setAttribute("id",idU);
			unlike.setAttribute("style","width:30px;display:block;margin-right:20px;");
			td.appendChild(unlike);
			
			var comment = document.createElement("img");
			var iconC= "images/comment.png";
			comment.setAttribute("src",iconC);
			var idC = "comment"+CurrId;
			comment.setAttribute("id",idC);
			comment.setAttribute("style","width:30px;display:block;margin-right:20px;");
			
			var td1 = document.createElement("td");
			td1.appendChild(comment);
			tr.appendChild(td);
			tr.appendChild(td1);
			table.appendChild(tr);
			CurrentE.appendChild(table);
			
			var num = document.createElement("p");
			var numOfL =  document.createTextNode(js['posts'][i]['meta']['likes'].length + " likes");
			var loveid = "Love"+CurrId;
			num.setAttribute("id",loveid);
			num.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
			num.appendChild(numOfL);
			CurrentE.appendChild(num);
			console.log(document.getElementById(loveid));
			document.getElementById(loveid).addEventListener("click", showAllLike);
			
			var likeP = document.createElement("div");
			likeP.setAttribute("style","display:none;");
			var listid = "likeList"+CurrId;
			likeP.setAttribute("id",listid);
			CurrentE.appendChild(likeP);
			
			var line3 = document.createElement("hr");
			CurrentE.appendChild(line3);
	
			var likelength = js['posts'][i]['meta']['likes'];
			console.log(likelength);
			var bodyName = document.createTextNode(likelength);
			console.log(bodyName);
			var currlistId = "likeList"+CurrId;
			document.getElementById(currlistId).appendChild(bodyName);
			console.log(document.getElementById(currlistId));
			
			var p = document.createElement("p");
			var txt;
			if(js['posts'][i]['meta']['description_text'] != ""){
				txt = document.createTextNode(js['posts'][i]['meta']['author'] + " : " + js['posts'][i]['meta']['description_text']);
			}
			else{
				txt = document.createTextNode(js['posts'][i]['meta']['author'] + " : No Description");
			}
			p.setAttribute("style","font-family: 'Niramit', sans-serif;margin-bottom:0;");
			p.appendChild(txt);
			CurrentE.appendChild(p);
			
			var p1 = document.createElement("p");
			var tx;
			tx = document.createTextNode("Comments below: ");
			p1.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
			p1.appendChild(tx);
			CurrentE.appendChild(p1);	

				var comments = js['posts'][i]['comments'];
				console.log("comment detail");
			//	console.log(comments);
				
				var commentid = "commentFor" + CurrId; 
				var sectionC = document.createElement("div");
				sectionC.setAttribute("id",commentid);
				CurrentE.appendChild(sectionC);
				var CurrentS = document.getElementById(commentid);
				
				if(comments.length == 0){
					var string = document.createElement("p");
					var com = document.createTextNode("No comments yet");
					var noCommentid = "noComment" + CurrId;
					string.setAttribute("id",noCommentid);
					string.setAttribute("style","font-family: 'Lobster', cursive; color:#696969;margin-bottom:0;margin-left:1%;");
					string.appendChild(com);
					CurrentS.appendChild(string);
				}
				
				for(var j = 0;j < comments.length;j ++){
					if(j == 9){
						var show = document.createElement("button");
						var explain = document.createTextNode("Show all comments ...");
						show.appendChild(explain);
						show.setAttribute("class","btn btn-link");
						show.setAttribute("style","color:orange;");
						var showid = "show" + CurrId;
						show.setAttribute("id",showid);
						CurrentS.appendChild(show);
						document.getElementById(showid).addEventListener("click", showAll);
						console.log(show);
						
						var section = document.createElement("div");
						section.setAttribute("style","display:none;");
						var contentid = "content" + CurrId;
						section.setAttribute("id",contentid);	
						CurrentS.appendChild(section);
					}
					if(j >= 9){				
						var d = new Date(comments[j]['published']*1000);
						var string = d.toString();
						var current = string.slice(0, 21);
						var author = document.createElement("p");
						author.setAttribute("style","margin-bottom:0;font-size:13px;");
						var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
						author.appendChild(says);
						document.getElementById(contentid).appendChild(author);
					}
					else{ 
						var d = new Date(comments[j]['published']*1000);
						var string = d.toString();
						var current = string.slice(0, 21);
						var author = document.createElement("p");
						author.setAttribute("style","margin-bottom:0;font-size:13px;");
						var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
						author.appendChild(says);
						CurrentS.appendChild(author);
						console.log(d);
					}
				}
				
				var line2 = document.createElement("hr");
				line2.setAttribute("id","finalLine");
				CurrentE.appendChild(line2);
				
				var currL = "like" + CurrId;
				console.log('here');
				console.log(document.getElementById(currL));
				document.getElementById(currL).addEventListener("click", Likey);
				
				var currC = "comment"+CurrId;
				console.log(document.getElementById(currC));
				document.getElementById(currC).addEventListener("click", CommentTo);
		}
	  })
	}

	function Likey(){
		console.log(this.id);
		
		var post = this.id.substring(4,this.id.length);
		console.log(post);
		console.log(document.getElementById(this.id).src);
		if(document.getElementById(this.id).src === "http://localhost:8080/images/unlike.png"){
			 var someone = "http://localhost:5000/post/like/?id="+post;
			  console.log(someone);
			  fetch(someone, {
				method: 'PUT',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(js){
				console.log(js);
				var temp = "like"+post;
				document.getElementById(temp).src = "images/like.png";
				var loveid = "Love" + post;
				var num = document.getElementById(loveid).innerHTML.substring(0,1);
				console.log(num);
				num ++;
				console.log(num);
				document.getElementById(loveid).innerHTML = num + " likes";
				var body = document.createTextNode(username+" ");
				var likeListid = "likeList" + post;
				document.getElementById(likeListid).appendChild(body);
				console.log(document.getElementById(likeListid));
			  })
		}
		else{
			  var someone = "http://localhost:5000/post/unlike/?id="+post;
			  console.log(someone);
			  fetch(someone, {
				method: 'PUT',
				headers: new Headers({
						'Authorization': 'Token '+ token, 
						'Content-Type': 'application/x-www-form-urlencoded'
			  })
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(js){
				console.log(js);
				var temp = "like"+post;
				document.getElementById(temp).src = "images/unlike.png";
				var loveid = "Love" + post;
				var num = document.getElementById(loveid).innerHTML.substring(0,1);
				console.log(num);
				num --;
				console.log(num);
				document.getElementById(loveid).innerHTML = num + " likes";
				var listid = "likeList" + post;
				var l = document.getElementById(listid);
				var str = l.textContent;
				console.log(l.textContent);
				var res = str.split(" ");
				console.log(res[0]);
				console.log("length of childenode");
				console.log(l.childNodes.length);
				for(var u = 0;u < l.childNodes.length;u ++){
					if(res[u] === username){
						l.removeChild(l.childNodes[u]);
					}
				}
			  })
		}
		currentPage ++;
	}
	
	function CommentTo(){
		console.log(this.id);
		var post = this.id.substring(7,this.id.length);
		console.log(post);
		
		var txt;
		var comment = prompt("Comment below : ");
		if (comment == null || comment == "") {
			alert("No comment entered");
			return;
		} else {
			txt = comment;
		}
		console.log(txt);
		
		var today = new Date();
		console.log(today.toString());
		console.log(today.getUnixTime());
		console.log(username);
		const po = {
			"author": username,
			"published": today.getUnixTime(),
			"comment": txt
		}
		var url = 'http://localhost:5000/post/comment?id=' + post;
		fetch(url, {
				method: 'PUT',
				headers: {
				  'Authorization': 'Token '+ token, 
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(po)
			  }).then(function(response){
				  console.log(response.status);
				  return response.json();
			  })
			  .then(function(myJson){
				  console.log(myJson);
				  
				  var el = document.getElementById("finalLine");
				  el.parentNode.removeChild(el);
				   var msg = "noComment" + post;
				  if(document.getElementById(msg)){
					document.getElementById(msg).style.display = "none";
				  }
					var d = today;
					var string = d.toString();
					var current = string.slice(0, 21);
					var author = document.createElement("p");
					author.setAttribute("style","margin-bottom:0;font-size:13px;");
					var says =  document.createTextNode(username+ " : "+ txt + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
					author.appendChild(says);
					var commentid = "commentFor" + post;
					document.getElementById(commentid).appendChild(author);
					
					var line2 = document.createElement("hr");
					line2.setAttribute("id","finalLine");
					var currP = "post" + post;
					document.getElementById(currP).appendChild(line2);
					console.log(d);
			  })
	}
	
	function showAll(){
		console.log(this.id);
		var post = this.id.substring(4,this.id.length);
		var commid = "content" + post;
		if(document.getElementById(commid).style.display == "none"){
			console.log("none");
			document.getElementById(commid).style.display = "block";
		}
		else{
			console.log("block");
			document.getElementById(commid).style.display = "none";
		}
	}
	
	function showAllLike(){
		console.log(this.id);
		var post = this.id.substring(4,this.id.length);
		var likeList = "likeList"+post;
		var l = document.getElementById(likeList);
		var str = l.textContent;
		console.log(l.textContent);
	    var res = str.split(",");
		if(document.getElementById(likeList).style.display == "none"){
			console.log("none");
			if(isNaN(res[0])){
				
			}
			else{
				l.innerHTML="";
				for(var x =0;x < res.length;x ++){
					console.log(res[x]);
					var userlike = "http://localhost:5000/user/?id=" + res[x];
					console.log(userlike);
					var fetchnow = fetch(userlike,{
						method: 'GET',
						headers: new Headers({
								'Authorization': 'Token '+ token, 
								'Content-Type': 'application/x-www-form-urlencoded'
						})
					}).then(function(response){
						console.log("test");
						console.log(response.status);
						return response.json();
					}).then(function(data){
						console.log(data);
						console.log(post);
						var bodyName = document.createTextNode(data['username']+" ");
						console.log(bodyName);
						document.getElementById(likeList).appendChild(bodyName);
						console.log(document.getElementById(likeList));
					}).catch(function(e){ 
						console.log("error"); 
					}); 
				}
			}
			document.getElementById(likeList).style.display = "block";
		}
		else{
			console.log("block");
			document.getElementById(likeList).style.display = "none";
		}
	}
	
	function clear(){
		console.log("logout user");
		localStorage.clear();
	}

	
}());

