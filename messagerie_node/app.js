var express = require('express'),
	app = express(),
	body = 	require('body-parser'),
	fs = 	require('fs'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [];	//est egale a la base de donnée
	// j'ouvre le fichier bdd.json r=  Ouvre en lecture seule, et place le pointeur de fichier au début du fichier.
	fs.open('bdd.json', 'r', (err, bdd) => {
 		if (!err) {
	 		var data = fs.readFileSync('bdd.json');
			// console.log("Synchronous read: " + data.toString());
			// les données (data) sont du string que je converti en json et que stock dans la variable users
			// pas besoin d'ouvrir les [] car le fichier en contient deja
			users = JSON.parse(data.toString());
			console.log(users);
	 	}
	});


	
server.listen(3001,"0.0.0.0"); // Lancement du serveur

// parse application/x-www-form-urlencoded 
app.use(body.urlencoded({ extended: false }))
 
// parse application/json 
app.use(body.json())




/********** ROUTE **************/

/* Home - GET (Route par default pour le navigateur web) */
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// enregistrer un utilisateur
/* Register - POST */
app.post('/register', function(req, res){
	users.push(req.body); // Insert Into
	res.send(users);
});




// route pour connection
/* Login - POST */
app.post('/login', function(req, res){
	// definir une function a vide pour stocker les infos de notre utilisateur
	var theUser = {};
	// on definit la variable qui contient le message d'erreur
	var error = {"error":true,"message":"Fail"};
	users.forEach(function(user){ // fetchAll - Foreach
		// si le phone poster par l'utilisateur (y en a un)
		if (req.body.phone){
			// un des phone de notre Jason est egal au phone poster par l'utilisateur
			if(user.phone == req.body.phone)
				// je stock toute les infos de notre utilisateur dans une variable
				theUser = user
		}else{
			// pareil pour le mail
			if(user.mail == req.body.mail)
				theUser = user
		}
	});
	// si le password  poster de notre utilisateur  (y en a un)
	if(theUser.password){
		//  password poster par l'utilisateur est egal a un des password de notre Jason
		if(theUser.password == req.body.password)
			// je retourne les infos de l'utilisateur qui c'est co
			res.send(theUser);
		else
			res.send(error);
	}else
		res.send(error);			
});
	
// pour changer le password
app.put('/login', function(req, res){
	var theUser = {};
	usersBis = []; // Bdd
	var newPassword;
	users.forEach(function(user){
		if (req.body.phone){
			// un des phone de notre Jason est egal au phone poster par l'utilisateur
			if(req.body.phone == user.phone){
				newPassword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				user.password = newPassword;
			}
			usersBis.push(user); // Insert Into	
		}
	});
	users = usersBis;
	res.send(newPassword);
	
});

// modification des infos users, subtilités selon les données envoyés par l'utilisateur

//route en put car update d'information
app.put('/editInfomation', function(req, res){
    var theUser = {};
    usersBis = [];
    users.forEach(function(user){
         if (req.body.phone){


            if(req.body.phone == user.phone){
            	
                for (var param in req.body) {
                	
                    user.password = (req.body.password)? req.body.password : user.password;
                    user.name = (req.body.name)? req.body.name : user.name;
                    user.mail = (req.body.mail)? req.body.mail : user.mail;
                    theUser = user;
                }
            }
            usersBis.push(user);
        }
    });
    users = usersBis;
    
    res.send(theUser);
})

 
//c'est le code pour la modification des infos des utilisateurs

app.post('/fichier', function(req, res){
	// champ name
	var name = JSON.stringify(users);
	//declaration de la variable qui contient le msg d'erreur
	var error = {"error":true,"message":"Fail"};
	// ecriture du fichier message.txt avec dedans la valeur du champ name
	fs.writeFile('bdd.json', name, (err) => {
		// si il y a une erreur envoi de la variable error declaré plus haut
		if (err) res.send(error);
		// sinon envoi de la variable avec le message
		res.send({"error":false,"message":"It\'s saved!"});
	});
		
	
});