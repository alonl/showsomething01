/** Server side, Wrriten by Alon Lavi && Michael Chochlov */

//requirements
var express = require('express');
var showsome = require('./showsome');
var ShowsomeDb = require('./showsome').ShowsomeDb;
var http = require('http')
  , path = require('path');

var app = express();//.createServer();
app.configure(function () {
    app.use(express.logger('dev'));    
    app.use(express.bodyParser());//it will parse json request bodies (as well as others), and place the result in req.body:
});

// init DB instance
var showsomeDb = new ShowsomeDb('localhost', 27017);

app.use('/public', express.static(__dirname+'/public_html'));
app.use('/', express.static(__dirname+'/public_html'));

// handle https (ssl encrypted requests)
app.use(function(req, res, next) {
	connectionKey = req.body.signed_request;
	console.log('connectionKey = ' + connectionKey);
	
	encrypted = false;
	if (typeof connectionKey === 'undefined') {
		encrypted = false;
		console.log('connection is not encrypted');
	} else {
		encrypted = true;
		console.log('connection is encrypted');
	}
		
	// check if connection is enctypted
//	encrypted = true;
//	try { certificate = req.connection.getPeerCertificate(); console.log('certificate' = certificate); }
//	catch (err) {
//		console.log('connection is not encrypted');
//		encrypted = false;
//	}

//	console.log('req protocol = ' + req.protocol);

//	encrypted = false;
//	console.log("encrypted = " + req.connection.encrypted);
//	if (req.connection.encrypted == 'undefined') {
//		console.log("encrypted undefined");
//		encrypted = false;
//	} else {
//		console.log("encrypted id defined");
//		encrypted = true;
//	}

	if (encrypted == true) {
		console.log('not supported page');
		res.sendfile(__dirname + '/public_html/notsupported.html');
	} else {
		next();
	}
});
app.use(app.router);


// handle facebook request
//app.post('/', function(req, res) {
//	res.sendfile(__dirname + '/public_html/index.html');
//});

///////////////// Server Functions ////////////////////////////


//get all active games for a given user
app.get('/games/:uid', function(req, res) {
	
	// gets the id
	var uid = req.params.uid;
	
	// get games all gamrs from db
	showsomeDb.getActiveGames(uid, function(error, result) {
		if (error) {
			console.log(error);
		} else {
			var userActiveGames = []; // found active games for this user
			for (i = 0; i < result.length; i++) {
				
				// if user is either a first player or second player, adds this game
				if (result[i].uid0 == uid) {
					game = new Game(result[i]._id, result[i].uid1, 1 - result[i].next, result[i].role);
				} else if (result[i].uid1 == uid) {
					game = new Game(result[i]._id, result[i].uid0, result[i].next, result[i].role);
				} else {
					// skip
					continue;
				}

				// adds the appropriate games to current games for this user
				userActiveGames.push(game);
			}
			
			// send respose
			res.send(JSON.stringify(userActiveGames));
		}
		
	});
	
});

// create a new game at the server and push it to DB
app.post('/games', function(req, res) {

	var body = "";
	req.on('data', function(chunk) {
		body += chunk;
	});
	req.on('end', function() {
		console.log('POSTed: ' + body);
		
		incoming = JSON.parse(body);
		
		// new game instance
		newGame = { 
		"uid0": incoming.uid0, 
		"uid1": incoming.uid1, 
		"next": 0,
		"role": "r"
		};
		
		// updates database
		showsomeDb.saveOne(newGame, function(val, callback) {
		
			//sends back the created game, with the new id
			res.send(newGame);
		});
	
	});
	

});

// gets a game from DB with the given id
app.get('/game/:gameid', function(req, res) {
	
	// the given id for the requested game
	gameID = req.params.gameid;
	
	showsomeDb.findOne(gameID, function(error, result) {
		if (error) {
			console.log(error);
		} else {
			res.send(result);
		}
	});

});

// generate words for new turn riddler
app.get('/game/generate/:gameid/:diff', function(req, res) {
	 
	diff = req.params.diff;
	gameID = req.params.gameid;
	
	var words;
	var randomNumber;
    var usedArray = [];
    var chosenWords = [5];
	
	
	// gets all the words from the given difficulty
	showsomeDb.getWordByDiff(diff, function(error, words) {
		
		if (error) {
			console.log("error getting words");
		} else {
			
			// 5 words at a time
			for (i = 0; i < 5; i++) {

				randomNumber = Math.floor(Math.random() * words.length);
				if (i > 0) {
					
					// makes sure we dont choose the same word twice
					while (in_array(randomNumber, usedArray) != -1) {
						randomNumber = Math.floor(Math.random() * words.length);
						
					}

				}

				// choses a word
				chosenWords[i] = words[randomNumber].word;

				// prevent duplications	
				usedArray[i] = randomNumber;
			}
			
			// update database
			// creates an instance of a relative game accordingly
			newTurnInfoR = {
				"gameID": gameID, //referance to the game object
				"word0": chosenWords[0],
				"word1": chosenWords[1],
				"word2": chosenWords[2],
				"word3": chosenWords[3],
				"word4": chosenWords[4],
				"chosenWord": -1 //  no word chosen yet
			};
			
			// pushes the new move to database
			showsomeDb.saveTurnInfoR(newTurnInfoR, function(error, result) {
				console.log("newly puted newTurnInfoR with game id: " + result.gameID);
			});
			
			// replyes with word chosen
			res.send(chosenWords);
		
		}

	});

});

// get registered users from db
app.get('/users', function (req, res) {

	showsomeDb.getAllUsers(function(error, users) {
	
		if (error) {
			console.log(error);
		} else {
			res.send(users);
		}
		
	});
});

// update new user to registered users db
app.post('/users/:id', function (req, res) {
	
	userID = req.params.id;
	found = false;
	
	showsomeDb.getAllUsers(function(error, users) {
	
		if (error) {
			console.log(error);
		} else {
			
			// looks for user in registered users db
			for (i = 0; i < users.length; i++) {
			
				if (users[i].uid == userID) {
					found = true;
				}
			}
			
			// if user is not registered, registers the user and returns the object id of this new user
			if (!found) {
				user = { "uid": userID };
				showsomeDb.saveUser(user, function(error, newid) {
				res.send(newid);
				});
				
			} else {
			
				// if registered, returns the id given
				res.send(userID);
			}
		}

	});
	
});

// gets the turn information r according to the given game id
app.get('/turn/r/:gameid', function(req, res) {
	
	gameid = req.params.gameid;
	
	showsomeDb.getTurnInfoR(gameid, function(error, result) {
		if (error) {
			res.json(error, 400);
		} else {
			if (result.length == 0) {
				res.json('0');
			} else {
				res.send(result[0]);
			}
		}
	});

});

// validates a guess provided by the user(the guess is in the body)
app.post('/turn/g/:gameid', function(req, res) {
	
	gameid = req.params.gameid;
	answer = ""
	
	// reads body
	req.on('data', function(chunk) {
		answer += chunk;
	});
	req.on('end', function() {
	
		// gets the turn info to check the word
		showsomeDb.getTurnInfoG(gameid, function (error, result) {
		
			if (error) {
				console.log(error);
			} else {
				
				// user guessed right
				if (answer.toUpperCase() == result.word.toUpperCase()) {
					
					// changes the game state to riddler
					showsomeDb.updateGameState(gameid, 'r', false, function (error, result) {
						
						res.send("correct");
					});
					
				}

				// wrong guess, 
				else {
					
					// updates the number of tries left
					showsomeDb.updateTriesLeft(gameid, function(error, result) {
						
						if (error) {
							res.send("error while updating number of tries in game: " + gameid);
						} else {
							
							// sends back number of tries left
							res.send(result);
								
						}
						
					});
					
				}
			}
			
		});
		
	});

});

// user gives up on trying to guess the game
app.get('/turn/g/giveup/:gameid', function(req, res) {

	gameid = req.params.gameid;
	
	// changes the game state to riddler (same player, different move)
	showsomeDb.updateGameState(gameid, 'r', false, function (error, result) {
						
		res.send(result);
							
	});
		
});

// gets turn information guesser from the DB
app.get('/turn/g/:gameid' , function (req, res) {
	
	gameid = req.params.gameid;
	
	// gets the turn from db
	showsomeDb.getTurnInfoG(gameid, function (error, result) {
		
		if (error) {
			res.send(error);
		} else {
			
			// makes a copy of the game object that not includes the words itself
			// but its length
			copy = {
				"gameID": result.gameID,
				"word": result.word.length, // so that the right answer wiil not be seen in network traffic
				"triesLeft": result.triesLeft
			}
			
			// result
			res.send(copy);
		}
	});
	
	
});

// gets the image of the current turn information guesser
app.get('/turn/g/:gameid/photo' , function (req, res) {

	gameid = req.params.gameid;
	
	// gets only the photo
	showsomeDb.getPhoto(gameid, function (error, result) {
		
		if (error) {
			res.send(error);
		} else {
			
			if (result == null) {
				res.status(404).send('Not found');
			}
			else {
				//return only the image of this game (ommits the object id)
				res.send(result.photo);
			}
		}
	});
	
});

// updates the chosen word for the given game
app.put('/turn/r/:gameid', function(req, res) {
	
	gameid = req.params.gameid;
	
	// reads body and gets word
	chosenWord = "";
	req.on('data', function(chunk) {
		chosenWord += chunk;
	});
	req.on('end', function() {
	
		// updates word in db
		showsomeDb.updateChosenWord(gameid, chosenWord, function (error, result) {
		
			if (error) {
				console.log(error);
			} else {
				res.send(result);
			}
			
		});
		
	});
});

// makes a move as a riddler
app.post('/turn/r', function (req, res) {

	body = "";
	req.on('data', function(chunk) {
		body += chunk;
	});
	
	req.on('end', function() {
	
		turn = JSON.parse(body);
		
		// delete prior turnInfoG with same game id (if any)
		showsomeDb.deleteTurnInfoG(turn.gameID, function() {});

		// saves the new turnInfoG
		showsomeDb.saveTurnInfoG(turn, function (error, result) {
		
			if (error) {
				res.json(error, 400);
			}
			else  {
				
				// updates the game state
				showsomeDb.updateGameState(turn.gameID, 'g', true, function(error, result) {});
				
				// deletes the turn infoR from the db
				showsomeDb.deleteTurnInfoR(turn.gameID, function(result) {
					success = result;
				});
				
				if (!success) {
					console.log("faild to delete turnInfoR with id: " + turn.gameID);
				}
				// response with the object id after success
				//res.send(turn._id);
				res.send("updated");
			} 
				
		});
		
	});
	
});

// deletes a game from DB
app.delete('/game/:gameid', function (req, res) {

	gameid = req.params.gameid;
	
	// deletes the game
	showsomeDb.deleteGame(gameid, function(result) {
		
		// bad deletion,
		if (!result) {
			res.send("error removing the game: " + gameid);
		}
		
		// good deletion
		else {
			
			//deletes turnInfoG
			showsomeDb.deleteTurnInfoG(gameid, function(result){
				res1 = result;
			});
			
			//deletes turnInfoR
			showsomeDb.deleteTurnInfoR(gameid, function(result){
				res2 = result;
			});
			
			// informs about success of deletion
			if (res1 && res2) {
				res.send("Successfuly deleted game: " + gameid);
			} else if (!res1){
				res.send("unable to delete turnInfoG with gameid: " + gameid);
			} else {
				res.send("unable to delete turnInfoR with gameid: " + gameid);
			}
			
		}
	});
	
});

////////////////////////////Helper functions///////////////////////////////////////

/**
 * Defines a game relative for this user.
 * 
 * @param {type} gameID - current game
 * @param {type} opponentID - user's opponent
 * @param {type} nextPlayer - 1 if you're the next player, else 0
 * @param {type} nextRole - the next state for this player (r - riddler, g - guesser)
 * @returns {Game}
 */
function Game(gameID, opponentID, nextPlayer, nextRole) {
    this._id = gameID;
    this.opponentID = opponentID;
    this.nextPlayer = nextPlayer;
    this.nextRole = nextRole;
}

function in_array(needle, haystack){
 
    for (i = 0; i<haystack.length ;i++) {
        if (haystack[i] == needle) return i;
    }
    return -1;
}

// gets a single game from db
function getGame(gameid, callback) {
		showsomeDb.findOne(gameid, function(error, result) {
		if (error) {
			callback(error);
		} else {
			callback(result);
		}
	});
}

/********************************************************************************************************/
/** ADMIN CONTROL FUNCTIONS - basic collection, more will be added on next submittion*/

// delete all words in DB 
app.delete('/yugi', function(req, res) {

	showsomeDb.deleteWord('all', function(result) { //delets all words
	
		if (result) {
			res.send("all words have been deleted");
		} else {
			res.send("error deleting all words");
		}
	}); 
	

});

// save given words in DB
app.post('/yugi', function(req, res) {

	var body = "";
	req.on('data', function(chunk) {
		body += chunk;
	});
	req.on('end', function() {

		incoming = JSON.parse(body);
	
		showsomeDb.saveWords(incoming, function(err, words) {
			if (err) {
				res.send("error while saving given words");
			} else {
				res.send("save successfuly");
			}
	
		}); 
	
	}); 

});

// save basic words set set in DB
app.get('/yugi', function(req, res) {
	showsomeDb.saveWords([
        {
            // a word object
            "difficulty": "1",
            "word": "table"
        },
        {
            "difficulty": "1",
            "word": "chair"
        },
        {
           "difficulty": "1",
           "word": "car"
        },
		{
            "difficulty": "1",
            "word": "television"
        },
		{
            "difficulty": "1",
            "word": "couch"
        },
		{
            "difficulty": "1",
            "word": "radio"
        },
		{
            "difficulty": "1",
            "word": "keys"
        },
		{
            "difficulty": "1",
            "word": "computer"
        },
		{
            "difficulty": "1",
            "word": "watch"
        },
		{
            "difficulty": "1",
            "word": "shirt"
        },
		{
            "difficulty": "1",
            "word": "pants"
        },
		{
            "difficulty": "1",
            "word": "window"
        },
		{
            "difficulty": "1",
            "word": "ball"
        },
		{
            "difficulty": "1",
            "word": "arm"
        },
		{
            "difficulty": "1",
            "word": "mother"
        },
		{
	
            "difficulty": "2",
            "word": "rain"
        },
		{
            "difficulty": "2",
            "word": "engine"
        },
		{
            "difficulty": "2",
            "word": "skateboard"
        },
		{
            "difficulty": "2",
            "word": "wave"
        },
		{
            "difficulty": "2",
            "word": "breakfast"
        },
		{
            "difficulty": "2",
            "word": "midnight"
        },
		{
            "difficulty": "2",
            "word": "friends"
        },
		{
            "difficulty": "2",
            "word": "bus"
        },
		{
            "difficulty": "2",
            "word": "brother"
        },
		{
            "difficulty": "2",
            "word": "mailman"
        },
		{
            "difficulty": "2",
            "word": "kinder"
        },
		{
            "difficulty": "2",
            "word": "fun"
        },
		{
            "difficulty": "2",
            "word": "blink"
        },
		{
            "difficulty": "2",
            "word": "game"
        },
		{
            "difficulty": "3",
            "word": "city"
        },
		{
            "difficulty": "3",
            "word": "girlfriend"
        },
		{
            "difficulty": "3",
            "word": "available"
        },
		{
            "difficulty": "3",
            "word": "flee"
        },
		{
            "difficulty": "3",
            "word": "porshe"
        },
		{
            "difficulty": "3",
            "word": "chaos"
        },
		{
            "difficulty": "3",
            "word": "crazy"
        },
		{
            "difficulty": "3",
            "word": "villa"
        },
		{
            "difficulty": "3",
            "word": "warrior"
        },
		{
            "difficulty": "3",
            "word": "love"
        },
		{
            "difficulty": "3",
            "word": "maiden"
        },
		{
            "difficulty": "3",
            "word": "slipknot"
        },
		{
            "difficulty": "3",
            "word": "9gag"
        },
		{
            "difficulty": "3",
            "word": "show"
        },
		{
            "difficulty": "3",
            "word": "try"
        },
		{
            "difficulty": "3",
            "word": "behavior"
        }
    ], function(err, result) {
		if (err) {
			res.send("could not save words");
		} else {
			res.send("OKAY");
		}
	});
}); 

app.get('/momo', function(req, res) {

showsomeDb.deleteGame('all' ,function(callback) {});
showsomeDb.deleteTurnInfoG('all' ,function(callback) {});
showsomeDb.deleteTurnInfoR('all' ,function(callback) {});

showsomeDb.saveGames([
        {
            // a game object
            "uid0": "100002058341130",
            "uid1": "100001053996829",
            "next": "0",
            "role": "r"
        },
        {
            "uid0": "100002058341130",
            "uid1": "1127758094",
            "next": "1",
            "role": "r"
        }
    ], function(callback) {});
	
showsomeDb.saveUsers([

        {
            // a user object
            "uid": "761779163"
        },
        {
            // a user object
            "uid": "759352895"
        },
		{
            // a user object
            "uid": "583844288"
        },
		{
            // a user object
            "uid": "759352895"
        },
		{
            // a user object
            "uid": "100001053996829"
        },
		{
            // a user object
            "uid": "1127758094"
        },
		{
            // a user object
            "uid": "589522209"
        },
		{
            // a user object
            "uid": "604016348"
        },
		{
            // a user object
            "uid": "603071564"
        },
		{
            // a user object
            "uid": "617923676"
        },
		{
            // a user object
            "uid": "833304196"
        },
		{
            // a user object
            "uid": "100001388995300"
        }
    ], function(callback) {});
	
	res.send("empty db and saved basic games");
});

app.listen(3000); // starts listening