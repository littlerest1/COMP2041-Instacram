(function () {
	/*
	  feed.js for  index.html. Index page is for the unlog user 
	  This page just show some instagram example from feed.json 
	*/

    'use strict';
	console.log("here");

	 fetch('http://localhost:8080/data/feed.json', {
	  }).then(function(response){
		  console.log(response.status);
		  return response.json();
	  })
	  .then(function(json){
		console.log("there");
		console.log(json); 
		var i = 0;
		while(i < json.length){
			var para = document.createElement('h1');
			para.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;font-size:32px;");
			var node = document.createTextNode(json[i]['meta']['author']);
			para.appendChild(node);

			var element = document.getElementById("posts");
			element.appendChild(para);
			var line = document.createElement("hr");
			element.appendChild(line);
			
			var pic = document.createElement("img");
			var url = "images/"+json[i]['src'];
			console.log(url);
			pic.setAttribute("src",url);
			pic.setAttribute("style","width:100%;display:block;");
			pic.setAttribute("alt",json[i]['id']);
			element.appendChild(pic);
			var line1 = document.createElement("hr");
			element.appendChild(line1);
			
			var table = document.createElement("table");
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			
			var unlike = document.createElement("img");
			var iconU = "images/unlike.png";
			unlike.setAttribute("src",iconU);
			var idU = "like"+json[i]['id'];
			unlike.setAttribute("id",idU);
			unlike.setAttribute("style","width:30px;display:block;margin-right:20px;");
			td.appendChild(unlike);
			
			
			var comment = document.createElement("img");
			var iconC= "images/comment.png";
			comment.setAttribute("src",iconC);
			var idC = "comment"+json[i]['id'];
			comment.setAttribute("id",idC);
			comment.setAttribute("style","width:30px;display:block;margin-right:20px;");
			
			var td1 = document.createElement("td");
			td1.appendChild(comment);
			tr.appendChild(td);
			tr.appendChild(td1);
			table.appendChild(tr);
			element.appendChild(table);
			
			var num = document.createElement("p");
			var numOfL =  document.createTextNode(json[i]['meta']['likes'].length + " likes");
			num.setAttribute("id","Love");
			num.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
			num.appendChild(numOfL);
			element.appendChild(num);
			console.log(document.getElementById("Love"));
			document.getElementById("Love").addEventListener("click", showAllLike);
			
			var p = document.createElement("p");
			var txt;
			if(json[i]['meta']['description_text'] != ""){
				txt = document.createTextNode(json[i]['meta']['author'] + " : " + json[i]['meta']['description_text']);
			}
			else{
				txt = document.createTextNode(json[i]['meta']['author'] + " : No Description");
			}
			p.setAttribute("style","font-family: 'Niramit', sans-serif;margin-bottom:0;");
			p.appendChild(txt);
			element.appendChild(p);
			
			var p1 = document.createElement("p");
			var tx;
			tx = document.createTextNode("Comments below: ");
			p1.setAttribute("style","font-family: 'Lobster', cursive; color:#FF6347;margin-bottom:0;");
			p1.appendChild(tx);
			element.appendChild(p1);
			
			var comments = json[i]['meta']['comments'];
			if(comments.length == 0){
				var string = document.createElement("p");
				var com = document.createTextNode("No comments yet");
				string.setAttribute("style","font-family: 'Lobster', cursive; color:#696969;margin-bottom:0;margin-left:1%;");
				string.appendChild(com);
				element.appendChild(string);
			}
		
			for(var j = 0;j < comments.length;j ++){
				if(j == 9){
					var show = document.createElement("button");
					var explain = document.createTextNode("Show all comments ...");
					show.appendChild(explain);
					show.setAttribute("class","btn btn-link");
					show.setAttribute("style","color:orange;");
					show.setAttribute("id","show");
					element.appendChild(show);
					document.getElementById("show").addEventListener("click", showAll);
					console.log(show);
					
					var section = document.createElement("div");
					section.setAttribute("style","display:none;");
					section.setAttribute("id","content");	
					element.appendChild(section);
				}
				if(j >= 9){				
					var d = new Date(comments[j]['published']*1000);
					var string = d.toString();
					var current = string.slice(0, 21);
					var author = document.createElement("p");
					author.setAttribute("style","margin-bottom:0;font-size:13px;");
					var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
					author.appendChild(says);
					document.getElementById("content").appendChild(author);
				}
				else{ 
					var d = new Date(comments[j]['published']*1000);
					var string = d.toString();
					var current = string.slice(0, 21);
					var author = document.createElement("p");
					author.setAttribute("style","margin-bottom:0;font-size:13px;");
					var says =  document.createTextNode(comments[j]['author'] + " : "+ comments[j]['comment'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0(" + current + ")");
					author.appendChild(says);
					element.appendChild(author);
					console.log(d);
				}
			}
			
			var line2 = document.createElement("hr");
			element.appendChild(line2);
			
			var currL = "like" + json[i]['id'];
			console.log('here');
			console.log(document.getElementById(currL));
			document.getElementById(currL).addEventListener("click", Likey);
			
			var currC = "comment"+json[i]['id'];
			console.log(document.getElementById(currC));
			document.getElementById(currC).addEventListener("click", CommentTo);
			i ++;
		}
	  })
	
	function Likey(){
		console.log(this.id);
	}
	
	function CommentTo(){
		console.log(this.id);
	}
	
	function showAll(){
		console.log(this.id);
		
		if(document.getElementById("content").style.display == "none"){
			console.log("none");
			document.getElementById("content").style.display = "block";
		}
		else{
			console.log("block");
			document.getElementById("content").style.display = "none";
		}
	}
	
	function showAllLike(){
		console.log(this.id);
	}
}());