var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


//*****************************************************************************
// mongo database
//*****************************************************************************

ShowsomeDb = function(host, port) {
  this.db= new Db('node-mongo-showsome', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

ShowsomeDb.prototype.getCollection = function(callback) {
  this.db.collection('games', function(error, games_collection) {
    if( error ) callback(error);
    else callback(null, games_collection);
  });
};

//find all games
ShowsomeDb.prototype.findAll = function(callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// finds all words with the given difficulty
ShowsomeDb.prototype.getWordByDiff = function (diff, callback) {
	  this.getCollection(function(error, words_collection) {
      if(error) callback(error)
      else {
        words_collection.find({difficulty: diff}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// we wrote
ShowsomeDb.prototype.getActiveGames = function(uid, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        games_collection.find( { $or: [ {uid0: uid}, {uid1: uid} ] } ).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new games
ShowsomeDb.prototype.saveGames = function(games, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
        if( typeof(games.length)=="undefined")
          games = [games];

        for( var i =0;i< games.length;i++ ) {
          game = games[i];
          game.created_at = new Date();
        }

       id = games_collection.insert(games, function() {
          callback(null, games);
        });
      }
    });
};

//save new words
ShowsomeDb.prototype.saveWords = function(words, callback) {
    this.getCollection(function(error, words_collection) {
      if( error ) callback(error)
      else {
        if( typeof(words.length)=="undefined")
          words = [words];

        for( var i =0;i< words.length;i++ ) {
          word = words[i];
          word.created_at = new Date();
        }

        words_collection.insert(words, function() {
          callback(null, words);
        });
      }
    });
};

// saves one game in the database
ShowsomeDb.prototype.saveOne = function(game, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
  
       id = games_collection.insert(game, function() {
          callback(null, game._id);
        });
      }
    });
};

// find a single game in the game database
ShowsomeDb.prototype.findOne = function(gameID, callback) {
    this.getCollection(function(error, games_collection) {
      if( error ) callback(error)
      else {
		console.log(gameID);
        games_collection.find({_id: ObjectID(gameID)}).toArray(function(error, result) {
          if(error) callback(error)
          else callback(null, result[0])
        }); 
      }
    });
};

exports.ShowsomeDb = ShowsomeDb;




//*****************************************************************************
//// export server methods api
////****************************************************************************
///**
//// returns the list of the active games
//exports.getActiveGames = function(req, res) {
//} ;
//
//// Add new game to the list of the active games
//exports.putActiveGame = function(req, res) {
//	var gameElementsWithNoID = req.body;
//	// response is the new game id
//};
//
//// Get the list of the active users
//exports.getUsers = function(req, res) {
//};
//
//// Add a new user to system
//exports.putUser = function(req, res) {
//	var newUserID = req.params.id;
//};
//
//// compose game element from data bases using the given game id
//exports.getGame = function(req, res) {
//	var gameID = req.params.id;
//};
//
//// break down given game element into relevant data bases
//exports.putGame = function(req, res) {
//	var game = req.body;
//};
//
//// validates a guess
//exports.validateGuess = function(req, res) {
//	var guess = req.params.guess;
//};
//
//// deletes a game from the database
//exports.deleteGame = function(req, res) {
//	var gameID = req.params.id;
//};
//
////*****************************************************************************
//// Demo database
////*****************************************************************************
//
//Database = {};
//
//// Simulates a signed users database (for facebook referance)
//Database.registeredUsers = ["761779163", "759352895", "583844288", "100001053996829", "1127758094", "581384374", "589522209", "604016348", "603071564", "617923676", "833304196", "100001388995300"];
//
//// Current active games between all active users
//Database.activeGames = {
//    "data": [
//        {
//            // a game object
//            "_id": 000,
//            "uid0": "100002058341130",
//            "uid1": "100001053996829",
//            "next": "0",
//            "role": "r"
//        },
//        {
//            "_id": 001,
//            "uid0": "100002058341130",
//            "uid1": "1127758094",
//            "next": "1",
//            "role": "r"
//        },
//        {
//            "_id": 002,
//            "uid0": "761779163",
//            "uid1": "100002058341130",
//            "next": "1",
//            "role": "g"
//        }
//    ]
//};
//
//// Holds the relevant information regarding a move by a guesser
//Database.turnInformationG = {
//    "data": [
//        {
//            "gameID": 002, // game id
//            "word": "waterfall", // words for guesser to desctibe
//            "photoUrl": "img/waterfall2.jpg", // the photo of the word to describe
//            "triesLeft": 5 //number of tries left (will be used in next version)
//        }
//    ]
//};
//
//// Holds the relevant information regarding a move by the riddler (will be constructed as you start a new game, and documented later)
//Database.turnInformationR = {
//    "data": []
//
//};
//
//// difficulty levels
//Database.easyWords = ["table", "chair", "car", "television", "couch", "radio", "keys", "computer", "watch", "shirt", "pants", "window", "ball", "arm", "mother"];
//Database.mediumWords = ["rain", "engine", "skateboard", "wave", "breakfast", "midnight", "friends", "bus", "brother", "mailman", "kinder", "fun", "blink", "game", "city"];
//Database.hardWords = ["girl friend", "available", "flee", "porshe", "chaos", "crazy", "villa", "warrior", "love", "maiden", "slipknot", "9gag", "show", "try", "behavior"];
//
//
////*****************************************************************************
//// Helper functions
////*****************************************************************************
//
///**
// * Defines a game state information relevant for a guesser state
// * @param {type} gameID - game id
// * @param {type} word - the word to be gueesed
// * @param {type} photoUrl - the picture taken by the opponent
// * @param {type} triesLeft - number of tries left for guessing this word
// * @returns {TurnInfoG}
// */
//function TurnInfoG(gameID, word, photoUrl, triesLeft) {
//    this.gameID = gameID;
//    this.word = word;
//    this.photoUrl = photoUrl;
//    this.triesLeft = triesLeft;
//}
//
///**
// * Returns a copy of the game instace for this user, used next
// * for eliminating the ability to access the actual word by this user
// * @param {type} turnInfoG
// * @returns {a copy of TurnInfoG}
// */
//function TurnInfoGCopy(turnInfoG) {
//    newTurnInfoG = new TurnInfoG(turnInfoG.gameID, turnInfoG.word, turnInfoG.photoUrl, turnInfoG.triesLeft);
//    return newTurnInfoG;
//}
//
//
////*****************************************************************************
//// Server functions
////*****************************************************************************
//
///* our server */
//Server = {};
//
///**
// * Registers a new user to database
// * @param {type} uid
// * @param {type} callback
// * @returns {undefined}
// */
//Server.registerUser = function(uid) {
//
//    // check if user is already registered
//    if ($.inArray(uid, Database.registeredUsers) > -1) {
//        return;
//    }
//    // else
//
//    // add the user to the registered users database
//    Database.registeredUsers.push(uid);
//};
//
///**
// * Gets the current registered users
// * @returns {@exp;Database@pro;registeredUsers}
// */
//Server.getRegisteredUsers = function() {
//    return Database.registeredUsers;
//};
//
///**
// * Gets the current active games
// * @param {type} uid
// * @param {type} callback
// * @returns {undefined}
// */
//Server.getActiveGames = function(uid, callback) {
//
//    // get the active games of the current user from db
//    activeGamesDb = Database.activeGames.data;
//    for (i = 0; i < activeGamesDb.length; ++i) {
//        if (activeGamesDb[i].uid0 == uid) {
//            game = new Game(activeGamesDb[i]._id, activeGamesDb[i].uid1, 1 - activeGamesDb[i].next, activeGamesDb[i].role);
//        } else if (activeGamesDb[i].uid1 == uid) {
//            game = new Game(activeGamesDb[i]._id, activeGamesDb[i].uid0, activeGamesDb[i].next, activeGamesDb[i].role);
//        } else {
//            // skip
//            continue;
//        }
//
//        // adds the appropriate games to current games for this user
//        userActiveGames.push(game);
//    }
//
//    // informs the function which called it that userActiveGames is ready
//    callback();
//};
//
///**
// * Gets a game (not a relative game object) from the database
// * @param {type} gameID
// * @param {type} callback
// * @returns {undefined}
// */
//Server.getGame = function(gameID, callback) {
//    for (i = 0; i < Database.activeGames.data.length; ++i) {
//        if (Database.activeGames.data[i]._id == gameID) {
//            game = Database.activeGames.data[i];
//            callback(game);
//        }
//    }
//};
//
///**
// * Gets a copy for a relative active game for this user as a guesser
// * @param {type} gameID
// * @param {type} callback
// * @returns {undefined}
// */
//Server.getTurnInformationG = function(gameID, callback) {
//    // get the turn information from db
//    for (i = 0; i < Database.turnInformationG.data.length; ++i) {
//        if (Database.turnInformationG.data[i].gameID == gameID) {
//
//            // uses a copy of the originala game for further manipulation
//            game = TurnInfoGCopy(Database.turnInformationG.data[i]);
//            callback(game);
//        }
//    }
//    // didnt find game - does not suppose to happen
//    callback(0);
//};
//
///**
// * Looks for a relative active game for this user as a riddler
// * @param {type} gameId
// * @param {type} callback
// * @returns {unresolved}
// */
//Server.getTurnInformationR = function(gameId, callback) {
//
//    // finds active game if any
//    for (i = 0; i < Database.turnInformationR.data.length; i++) {
//        if (Database.turnInformationR.data[i].gameID === gameId) {
//            callback(Database.turnInformationR.data[i]);
//            return;
//        }
//    }
//
//    // didnt find game
//    callback(0);
//};
//
///**
// * Return the game information for turn = guesser, but return the word length instead of the word itself
// * @param {type} gameID
// * @param {type} callback
// * @returns {undefined}
// */
//Server.getTurnInformationGLength = function(gameID, callback) {
//    Server.getTurnInformationG(gameID, function(game) {
//        game.word = game.word.length;
//        callback(game);
//    });
//};
//
///**
// * Checks if the guesser guessed the game,
// * if user guessed, changes the state of this game to a riddler state
// * if not, informs the user
// * @param {type} gameId
// * @param {type} answer
// * @param {type} callback
// * @returns {undefined}
// */
//Server.validateGuess = function(gameId, answer, callback) {
//    Server.getTurnInformationG(gameId, function(game2) {
//        if (game2.word.toUpperCase() == answer.toUpperCase()) {
//            Server.getGame(gameId, function(game) {
//
//                // change the game state
//                game.role = "r";
//
//                callback(true);
//            });
//        } else {
//            callback(false);
//        }
//    });
//};
//
///**
// * Creates a new game 
// * @param {type} myID
// * @param {type} otherID
// * @param {type} callback
// * @returns {undefined}
// */
//Server.createNewGame = function(myID, otherID, callback) {
//    game = {
//        "_id": Database.activeGames.data.length,
//        "uid0": myID,
//        "uid1": otherID,
//        "next": 0,
//        "role": "r"
//    };
//    Database.activeGames.data.push(game);
//    callback(game);
//};
//
///**
// * Generates word for the riddler to choose from
// * @param {type} gameID
// * @param {type} diff
// * @param {type} callback
// * @returns {undefined}
// */
//Server.generateWords = function(gameID, diff, callback) {
//    var words;
//    var randomNumber;
//    var usedArray = [];
//    var chosenWords = [5];
//
//    // determines what difficulty was chosen by the user
//    if (diff === 1) {
//        words = Database.easyWords;
//    } else if (diff === 2) {
//        words = Database.mediumWords;
//    } else {
//        words = Database.hardWords;
//    }
//
//    for (i = 0; i < 5; i++) {
//
//        randomNumber = Math.floor(Math.random() * 14);
//
//        if (i > 0) {
//
//            // makes sure we dont choose the same word twice
//            while ($.inArray(randomNumber, usedArray) > -1) {
//                randomNumber = Math.floor(Math.random() * 14);
//            }
//
//        }
//
//        // choses a word
//        chosenWords[i] = words[randomNumber];
//
//        // prevent duplications
//        usedArray[i] = randomNumber;
//    }
//
//    // creates an instance of a relative game accordingly
//    newTurnInfoR = {
//        "gameID": gameID,
//        "word0": chosenWords[0],
//        "word1": chosenWords[1],
//        "word2": chosenWords[2],
//        "word3": chosenWords[3],
//        "word4": chosenWords[4],
//        "chosenWord": 0
//    };
//
//    // update database
//    Database.turnInformationR.data.push(newTurnInfoR);
//    callback(chosenWords);
//};
//
///**
// * find the game with the given ID and updates the chosen word accordingly
// * @param {type} gameID
// * @param {type} chosenWord
// * @returns {undefined}
// */
//Server.saveChosenWord = function(gameID, chosenWord) {
//
//    // finds the currect game and updates the word
//    for (i = 0; i < Database.turnInformationR.data.length; i++) {
//        if (Database.turnInformationR.data[i].gameID === gameID) {
//            Database.turnInformationR.data[i].chosenWord = chosenWord;
//        }
//    }
//};
//
///**
// * Updates the relevant game state after a complete move by the riddler 
// * @param {type} currentGameID
// * @param {type} callback
// * @returns {undefined}
// */
//Server.makeMoveRiddler = function(currentGameID, callback) {
//    Server.getGame(currentGameID, function(game) {
//        game.next = 1 - game.next;
//        game.role = "g";
//        callback();
//    });
//};
//
//
//
//
///*--------------------------------------------------------------------------------------------------------------------*/
//// In this app an array will be our database 
//
//
//    var students = [
//    {
//		id:1,
//        name: "Bibi Netaniou",
//        year: "2010",
//        country: "USA",
//        picture: "israel1.jpg"
//    },
//    {	
//		id:2,
//        name: "Yair Lapid",
//        year: "2011",
//        country: "Israel",
//        picture: "roi1.jpg"
//    },
//    {
//		id:3,
//        name: "Naftali Benet",
//        year: "2009",
//        country: "Israel",
//        picture: "Ido1.jpg"
//    },
//    {
//		id:4,
//        name: "Shelly Yehimoziyz",
//        year: "2011",
//        country: "Israel",
//        picture: "itamar1.jpg"
//    }];
//
////find student by id
//function find(id)
//{
//for (var i=0;i<students.length;i++)
//		if (students[i].id == id)
//		{
//			console.log("students["+i+"].id="+students[i].id );
//			return students[i];
//		}
//		return null;
//}
//exports.findById = function(req, res) {
//    var id = req.params.id;
//    console.log('Retrieving student: ' + id);
//	var st = find(id);
//	if (st != null)
//		res.send(JSON.stringify(st));
//	else
//		res.send(JSON.stringify(""));
//};
//
//exports.findAll = function(req, res) {
//    console.log("findAll");
//	res.send(JSON.stringify(students));
// 
//};
//
//exports.addStudent = function(req, res) {
//    var student = req.body;
//	console.log("addStudent req.body="+student);
//	students.push(student);
//    console.log('Adding student: ' + JSON.stringify(student));
//	res.send(JSON.stringify(student));
//}
//
//exports.updateStudent= function(req, res) {
//    var id = req.params.id;
//    var student = req.body;
//	//to do.
//}
//
//exports.deleteStudent = function(req, res) {
//    var id = req.params.id;
//    console.log('Deleting student: ' + id);
//	//to do
//    
//}
//
