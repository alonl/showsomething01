
/** active user variables */
var connected = false;
var uid;
var accessToken;
var fullName;
var userActiveGames = []; // current list of active games for this user.
var currentGameID = 0;


//*****************************************************************************
// Demo database
//*****************************************************************************

Database = {};

// Simulates a signed users database (for facebook referance)
Database.registeredUsers = ["761779163", "759352895", "583844288", "100001053996829", "1127758094", "581384374", "589522209", "604016348", "603071564", "617923676", "833304196", "100001388995300"];

// Current active games between all active users
Database.activeGames = {
    "data": [
        {
            // a game object
            "_id": 000,
            "uid0": "100002058341130",
            "uid1": "100001053996829",
            "next": "0",
            "role": "r"
        },
        {
            "_id": 001,
            "uid0": "100002058341130",
            "uid1": "1127758094",
            "next": "1",
            "role": "r"
        },
        {
            "_id": 002,
            "uid0": "761779163",
            "uid1": "100002058341130",
            "next": "1",
            "role": "g"
        }
    ]
};

// Holds the relevant information regarding a move by a guesser
Database.turnInformationG = {
    "data": [
        {
            "gameID": 002, // game id
            "word": "waterfall", // words for guesser to desctibe
            "photoUrl": "img/waterfall2.jpg", // the photo of the word to describe
            "triesLeft": 5 //number of tries left (will be used in next version)
        }
    ]
};

// Holds the relevant information regarding a move by the riddler (will be constructed as you start a new game, and documented later)
Database.turnInformationR = {
    "data": []

};

// difficulty levels
Database.easyWords = ["table", "chair", "car", "television", "couch", "radio", "keys", "computer", "watch", "shirt", "pants", "window", "ball", "arm", "mother"];
Database.mediumWords = ["rain", "engine", "skateboard", "wave", "breakfast", "midnight", "friends", "bus", "brother", "mailman", "kinder", "fun", "blink", "game", "city"];
Database.hardWords = ["girl friend", "available", "flee", "porshe", "chaos", "crazy", "villa", "warrior", "love", "maiden", "slipknot", "9gag", "show", "try", "behavior"];

/**
 * Defines a game state information relevant for a guesser state
 * @param {type} gameID - game id
 * @param {type} word - the word to be gueesed
 * @param {type} photoUrl - the picture taken by the opponent
 * @param {type} triesLeft - number of tries left for guessing this word
 * @returns {TurnInfoG}
 */
function TurnInfoG(gameID, word, photoUrl, triesLeft) {
    this.gameID = gameID;
    this.word = word;
    this.photoUrl = photoUrl;
    this.triesLeft = triesLeft;
}

/**
 * Returns a copy of the game instace for this user, used next
 * for eliminating the ability to access the actual word by this user
 * @param {type} turnInfoG
 * @returns {a copy of TurnInfoG}
 */
function TurnInfoGCopy(turnInfoG) {
    newTurnInfoG = new TurnInfoG(turnInfoG.gameID, turnInfoG.word, turnInfoG.photoUrl, turnInfoG.triesLeft);
    return newTurnInfoG;
}


//*****************************************************************************
// Server functions
//*****************************************************************************

var ajaxcall = function(method, url, onready, body, showReload) {
    
    if (showReload == null) {
        $.mobile.showPageLoadingMsg("", "Get ready to ShowSomething!");
    }
    
    var request = false;
    request = new XMLHttpRequest();

    if (request) {

        request.open(method, url);
        request.onreadystatechange = function() {
            if (request.readyState == 4 &&
                    request.status == 200) {
                onready(request);
            }
        };
        request.send(body);
    }
};

/* our server */
Server = {};

/**
 * Registers a new user to database
 * @param {type} uid
 * @param {type} callback
 * @returns {undefined}
 */
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

/**
 * Gets the current registered users
 * @returns {@exp;Database@pro;registeredUsers}
 */
//Server.getRegisteredUsers = function() {
//    return Database.registeredUsers;
//};

// TODO: delete!
/**
 * Gets the current active games
 * @param {type} uid
 * @param {type} callback
 * @returns {undefined}
 */
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

/**
 * Gets a game (not a relative game object) from the database
 * @param {type} gameID
 * @param {type} callback
 * @returns {undefined}
 */
//Server.getGame = function(gameID, callback) {
//    for (i = 0; i < Database.activeGames.data.length; ++i) {
//        if (Database.activeGames.data[i]._id == gameID) {
//            game = Database.activeGames.data[i];
//            callback(game);
//        }
//    }
//};

/**
 * Gets a copy for a relative active game for this user as a guesser
 * @param {type} gameID
 * @param {type} callback
 * @returns {undefined}
 */
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

/**
 * Looks for a relative active game for this user as a riddler
 * @param {type} gameId
 * @param {type} callback
 * @returns {unresolved}
 */
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

/**
 * Return the game information for turn = guesser, but return the word length instead of the word itself
 * @param {type} gameID
 * @param {type} callback
 * @returns {undefined}
 */
//Server.getTurnInformationGLength = function(gameID, callback) {
//    Server.getTurnInformationG(gameID, function(game) {
//        game.word = game.word.length;
//        callback(game);
//    });
//};

/**
 * Checks if the guesser guessed the game,
 * if user guessed, changes the state of this game to a riddler state
 * if not, informs the user
 * @param {type} gameId
 * @param {type} answer
 * @param {type} callback
 * @returns {undefined}
 */
//Server.validateGuess = function(gameId, answer, callback) {
//    Server.getTurnInformationG(gameId, function(game2) {
//        if (game2.word.toUpperCase() == answer.toUpperCase()) {
//
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

/**
 * Creates a new game 
 * @param {type} myID
 * @param {type} otherID
 * @param {type} callback
 * @returns {undefined}
 */
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

//TODO: Break down to number of create game style

/**
 * Generates word for the riddler to choose from
 * @param {type} gameID
 * @param {type} diff
 * @param {type} callback
 * @returns {undefined}
 */
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
//        "chosenWord": -1
//    };
//
//    // update database
//    Database.turnInformationR.data.push(newTurnInfoR);
//    callback(chosenWords);
//};

/**
 * find the game with the given ID and updates the chosen word accordingly
 * @param {type} gameID
 * @param {type} chosenWord
 * @returns {undefined}
 */
//Server.saveChosenWord = function(gameID, chosenWord) {
//
//    // finds the currect game and updates the word
//    for (i = 0; i < Database.turnInformationR.data.length; i++) {
//        if (Database.turnInformationR.data[i].gameID === gameID) {
//            Database.turnInformationR.data[i].chosenWord = chosenWord;
//        }
//    }
//};

/**
 * Updates the relevant game state after a complete move by the riddler 
 * @param {type} currentGameID
 * @param {type} callback
 * @returns {undefined}
 */
//Server.makeMoveRiddler = function(currentGameID, callback) {
//    Server.getGame(currentGameID, function(game) {
//        game.next = 1 - game.next;
//        game.role = "g";
//        callback();
//    });
//};


//*****************************************************************************
// 
//*****************************************************************************

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


//*****************************************************************************
// Facebook functions
//*****************************************************************************

function facebookStatusChange(response) {
    if (response.status === 'connected') {
        uid = response.authResponse.userID;
        accessToken = response.authResponse.accessToken;
        facebookLoggedIn();

    } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook, 
        // but has not authenticated your app
        connected = false;
        alert("Error: You must authenticate the app on your Facebook account!");
        window.location = "#pageLogin";
    } else {
        // the user isn't logged in to Facebook.
        connected = false;
        window.location = "#pageLogin";
    }
}

function loginFacebookUser() {
    FB.login(function(response) {
        if (response.authResponse) {
            facebookLoggedIn();
        } else {
            alert('User cancelled login or did not fully authorize.');
        }
    });
}

function facebookLoggedIn() {

    if (connected === true) {
        return;
    }
    connected = true;

    FB.api('/me', function(response) {
        ajaxcall("POST", "users/" + response.id, function() {
        }, "", true);
        fullName = response.name;
        window.location = "#pageMainMenu?reload";
    });

    // trigger page create on the generated words page once the app is loaded
    $('#pageGeneratedWords').trigger('create');

}

function setNameInHtml(opponentID) {
    FB.api("/" + opponentID, function(response) {
        $("." + opponentID + "Name").each(function() {
            $(this).html(response.name);
        });
    });
}


//*****************************************************************************
// Client-side functions
//*****************************************************************************

/**
 * Updates the current game state for the riddler and goes to the 
 * generated word page with the appropriate set of words,
 * if user has already chosen words, collects his choises from server and
 * updates the relevant page
 * @param {type} game
 * @returns {undefined}
 */
function yourTurnRiddler(game) {

    currentGameID = game._id;
    
    
    ajaxcall("GET", "turn/r/" + currentGameID, function(res) {

        response = JSON.parse(res.responseText);

        // no previous game was found
        if (response == 0) {

            // let the user choose new words
            window.location = "#pageSelectDifficulty";
        }

        // get the already chosen words from server
        else {

            // check if a word was already chosen
            chosenWord = response.chosenWord;
            if (chosenWord == -1) {

                // move to pageGeneratedWords with chosen words
                chosenWords = [];
                chosenWords.push(response.word0);
                chosenWords.push(response.word1);
                chosenWords.push(response.word2);
                chosenWords.push(response.word3);
                chosenWords.push(response.word4);
                updateChosenWords(chosenWords);

            }

            // user already chosen a word
            else {
                // move to pagePrePicture
                gotoPagePrePictureScreen(chosenWord);
            }
        }

    });

//    Server.getTurnInformationR(game._id, function(response) {
//
//    });

}

/**
 * updatess server after riddler has chosen his word difficulty
 * @returns {undefined}
 */
function transferChosenWord() {

    // finds out which word was checked
    chosenWord = $('#wordsPresented :checked').val();
//    Server.saveChosenWord(currentGameID, chosenWord);
    
    ajaxcall("PUT", "turn/r/" + currentGameID, function() {
        gotoPagePrePictureScreen(chosenWord);
    }, chosenWord);
    
}

/**
 * Generates words according to the level chosen by the riddler
 * @param {type} diff
 * @returns {undefined}
 */
function generateWords(diff) {
    
    
    ajaxcall("GET", "game/generate/" + currentGameID + "/" + diff, function(response) {
        words = JSON.parse(response.responseText);
        updateChosenWords(words);
    });

//    Server.generateWords(currentGameID, diff, function(response) {
//        updateChosenWords(response);
//    });
}

/**
 * Updates the gussing page with information sent by the riddler
 * @param {type} game
 * @returns {undefined}
 */
function yourTurnGuesser(game) {
    currentGameID = game._id;
    $("#riddleName").addClass(game.opponentID + 'Name');
    setNameInHtml(game.opponentID);

    // TODO: keep it?
    var image = document.createElement('img');
    image.src = "img/loading.gif";
    $(image).addClass('fit-width');
    document.getElementById('riddleImageDiv').innerHTML = "";
    document.getElementById('riddleImageDiv').appendChild(image);

    
    ajaxcall("GET", "turn/g/" + game._id, function(res) {
        response = JSON.parse(res.responseText);

        $("#riddleAnswer").attr('maxlength', response.word);
        $("#riddleAnswer").attr('placeholder', 'word length is: ' + response.word);
        $("#riddleGameId").attr('value', game._id);

        window.location = "#pageGuess";
    });

    $(document).bind('pagechange', function() {
         // TODO: keep it?
        ajaxcall("GET", "turn/g/" + game._id + "/photo", function(res2) {
            var image = document.createElement('img');
            image.src = res2.responseText;
            $(image).addClass('fit-width');
            document.getElementById('riddleImageDiv').innerHTML = "";
            document.getElementById('riddleImageDiv').appendChild(image);
        }, "", true);
    });


//    Server.getTurnInformationGLength(game._id, function(response) {
//        $("#riddleImageDiv").html('<img class="fit-width" src="' + response.photoUrl + '">');
//        $("#riddleAnswer").attr('maxlength', response.word);
//        $("#riddleAnswer").attr('placeholder', 'word length is: ' + response.word);
//        $("#riddleGameId").attr('value', game._id);
//
//        window.location = "#pageGuess";
//    });
}

/**
 * Validates the guess made by the guesser
 * @returns {Boolean}
 */
function validateGuess() {

    // gets the guess
    gameId = document.forms["riddle-answer"]["riddleGameId"].value;
    answer = document.forms["riddle-answer"]["riddleAnswer"].value;

    // validate the guess with info from the server
    
    ajaxcall("POST", "/turn/g/" + gameId, function(res) {

        response = res.responseText;

        if (response == "correct") {
//            $(document).simpledialog({
//                'mode': 'bool',
//                'prompt': "Excellent! You're right! Now it's your time to ShowSomething!",
//                'useModal': true,
//                'buttons': {
//                    'continue': {
//                        click: function() {
//                            window.location = "#pageMainMenu?reload";
//                        }
//                    }
//                }
//            });
            alert("Excellent! You're right! Now it's your time to ShowSomething!");
            window.location = "#pageMainMenu?reload";
        } else { // response == number of tries left

            // more tries available
            if (response != 0) {
                alert("Oops! Wrong answer. you have " + response + " tries left! Do try again!");
            }

            // no more tries left
            else {

                // ends this game and moves to next state
                giveup();

            }

        }

    }, answer);

    // You must return false to prevent the default form behavior
    return false;
}

// let the server know that the user has given up
function giveup() {

    
    ajaxcall("get", "/turn/g/giveup/" + currentGameID, function(res) {

        response = JSON.parse(res.responseText);

        if (response == true) {
            alert("Nice Try! more luck next time! it's your turn to ShowSomething!");
            window.location = "#pageMainMenu?reload";
        }

    });

}

/**
 * Creates a new game between the user and the chosen opponenet
 * @param {type} opponentID
 * @returns {undefined}
 */
function createNewGame(opponentID) {
    ajaxcall("POST", "games", function(response) {
        game = JSON.parse(response.responseText);
        currentGameID = game._id;
        yourTurnRiddler(game);
    }, '{"uid0": "' + uid + '", "uid1": "' + opponentID + '"}', true);
}

/**
 * User makes a move as a riddler
 * @param {type} currentGameID
 * @returns {undefined}
 */
//function makeMoveRiddler(currentGameID) {
//    Server.makeMoveRiddler(currentGameID, function() {
////        window.location = '#pageMainMenu?reload';
//    });
//}

/**
 * Checks if a game between this user and the given opponenets id is an active game
 * @param {type} userID
 * @returns {Boolean}
 */
function isInActiveGames(userID) {
    for (activeGameIndex = 0; activeGameIndex < userActiveGames.length; ++activeGameIndex) {
        if (userActiveGames[activeGameIndex].opponentID == userID) {
            return true;
        }
    }
    return false;
}

function deleteGame(gameID) {
    
    ajaxcall("DELETE", "/game/" + gameID, function() {
        alert("The game has been deleted.");
        document.getElementById('mainLogo').click();  // TODO: fix
    });
}

//*****************************************************************************
// Page constructing helper functions
//*****************************************************************************

/**
 * Builds the list of words to be chosen from
 * @param {type} chosenWords
 * @returns {undefined}
 */
function updateChosenWords(chosenWords) {

    for (i = 0; i < 5; i++) {
        $('#for-choice-' + i).trigger('create');
    }

    // updates the currect buttons
    for (i = 0; i < 5; i++) {

        // sets the value for this button
        button = document.getElementById('choice-' + i + '');
        button.setAttribute('value', chosenWords[i]);

        label = document.getElementById('for-choice-' + i);
        label.innerHTML = '<span class="ui-btn-inner"><span class="ui-btn-text">' + chosenWords[i] + '</span><span class="ui-icon ui-icon-radio-off ui-icon-shadow">&nbsp;</span></span>';
    }

    // gets to the actual page
    window.location = "#pageGeneratedWords";
}

/**
 * transfers the user to the pre picture screen with his chosen word to depict
 * @param {type} chosenWord
 * @returns {undefined}
 */
function gotoPagePrePictureScreen(chosenWord) {
    document.getElementById("sendPicture").reset(); // resets the uplaod form
    $('#picturePreview').attr('src', 'img/pre_upload.png');
    label = document.getElementById('chosenWord');
    label.innerHTML = chosenWord;
    window.location = '#pagePrePicture';
}

/**
 * Shows the picture uploaded by the user
 * @param {type} files
 * @returns {undefined}
 */
function showPicture(files) {
    file = files[0];
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function(oFREvent) {
        $('#picturePreview').attr('src', oFREvent.target.result);
    };
}

function filePreview() {
    $('#fileToUpload').click();
}

/**
 * Uploads the picture to the server - not implemented yet
 * @returns {undefined}
 */
function fileUpload() {
    file = document.getElementById('fileToUpload').files[0];

    if (file.size > 1049000) {
        alert("The maximum image size is 1 MB. Please upload a smaller file. (Tip: Try to zoom in while taking the picture for reducing it's size...)");
        return;
    }
    
    alert("The picture is now being sent to your friend! Please wait a moment.");
    
    $.mobile.showPageLoadingMsg("", "Get ready to ShowSomething!");

    reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        var result = event.target.result;
        var fileName = document.getElementById('fileToUpload').files[0].name; //Should be 'picture.jpg'
        // TODO: check if the object sent is correct
        ajaxcall("POST", "/turn/r", function() {
            console.log("result = " + result);
            console.log("name = " + fileName);
            $.mobile.changePage("#pageMainMenu?reload"); // TODO: fix all like this
//            window.location = "#pageMainMenu?reload";
        }, JSON.stringify({gameID: currentGameID, word: chosenWord, photo: result, triesLeft: 5}));
    };


}

/**
 * reusable sort function, sort by any field
 * @param {type} field
 * @param {type} reverse
 * @param {type} primer
 * @returns {unresolved}
 */
var sort_by = function(field, reverse, primer) {

    var key = function(x) {
        return primer ? primer(x[field]) : x[field]
    };

    return function(a, b) {
        var A = key(a), B = key(b);
        return ((((A < B) ? -1 : (A > B) ? +1 : 0)) * [-1, 1][+!!reverse]);
    };
};


//*****************************************************************************
// Dynamic pages loading
//*****************************************************************************

/**
 * used for dinamically injecting a page - pageMainManu and pageNewGAme
 * @param {type} pageSelector
 * @param {type} callback
 * @returns {undefined}
 */
function reloadPage(pageSelector, callback) {

    $(pageSelector).remove(); // removes the current page
    pageID = pageSelector.replace(/#/, "");

    // bulids similar parts for both pages
    $("body").append('<section data-role="page" id="' + pageID + '" data-theme="a"></section>');
    $(pageSelector).append('<div data-role="content" id="' + pageID + 'Content"></div>');
    $(pageSelector).append('<footer data-role="footer" id="' + pageID + 'Footer" data-position="fixed"></footer>');

    // choses which page to build now
    if (pageSelector === "#pageMainMenu") {
        reloadPageMainMenu(pageSelector, callback);
    } else if (pageSelector === "#pageNewGame") {
        reloadPageNewGame(pageSelector, callback);
    }

}

/**
 * Injecting the main manu page
 * @param {type} pageSelector
 * @param {type} callback
 * @returns {undefined}
 */
function reloadPageMainMenu(pageSelector, callback) {
    $(pageSelector).append('<header data-role="header" data-position="fixed"><h1><a id="mainLogo" href="http://showsomething06.aws.af.cm/" target="_self"><img src="img/logo_trans.png" alt="ShowSomething"></a></h1></header>');
    $(pageSelector + 'Footer').append('<h3>See If You Know What You See!</h3>');

    // displays a welcome message to the user
    $(pageSelector + 'Content').append('<div id="welcomeUser"></div>');
    FB.api('/me', function(response) {
        $("#welcomeUser").html("Welcome " + response.name + "!");
    });

    $(pageSelector + 'Content').append('<div><a href="#pageNewGame?reload" data-role="button" data-transition="flip">Create New Game</a></div>');

    $(pageSelector + 'Content').append('<ul data-role="listview" id="testlist" data-inset="true" data-split-icon="delete"></ul>');

    userActiveGames = [];

    
    ajaxcall("GET", "games/" + uid, function(response) {

        userActiveGames = JSON.parse(response.responseText);
        console.log("Got active games: " + JSON.stringify(userActiveGames));
        if (userActiveGames != null)
        {
            for (i = 0; i < userActiveGames.length; ++i) {
                gameId = userActiveGames[i]._id;
                opponentID = userActiveGames[i].opponentID;
                setNameInHtml(opponentID);
                photo = 'http://graph.facebook.com/' + opponentID + '/picture?width=80&height=80';
                nextPlayer = userActiveGames[i].nextPlayer;
                nextRole = userActiveGames[i].nextRole;
                actionMessage = "";
                link = "";
                if (nextPlayer == 0) {
                    actionMessage = 'Waiting for <span class="' + opponentID + 'Name"></span> to move.';
                    link = '';
                } else if (nextRole == "r") {
                    actionMessage = "Your Move!";
                    link = 'href="javascript: yourTurnRiddler(userActiveGames[' + i + ']);"';
                } else { // nextRole == "g"
                    actionMessage = "Your Move!";
                    link = 'href="javascript: yourTurnGuesser(userActiveGames[' + i + ']);"';
                }
                gameItem = '<li><a ' + link + ' ><img src="' + photo + '"><h2 class="' + opponentID + 'Name"></h2><p>' + actionMessage + '</p></a><a href="javascript: deleteGame(\'' + gameId + '\');" class="fix-border"></a></li>';
                $("#testlist").append(gameItem);
            }

            $page = $(pageSelector);
            $content = $page.children(":jqmData(role=content)");

            // Pages are lazily enhanced. We call page() on the page
            // element to make sure it is always enhanced before we
            // attempt to enhance the listview markup we just injected.
            // Subsequent calls to page() are ignored since a page/widget
            // can only be enhanced once.
            $page.page();

            // Enhance the listview we just injected.
            $content.find(":jqmData(role=listview)").listview();

            // We don't want the data-url of the page we just modified
            // to be the url that shows up in the browser's location field,
            // so set the dataUrl option to the URL for the category
            // we just loaded.
//    options.dataUrl = u.href;

            callback();
        }

    });

}

/**
 * Injects page newGame
 * @param {type} pageSelector
 * @param {type} callback
 * @returns {undefined}
 */
function reloadPageNewGame(pageSelector, callback) {

    $(pageSelector + 'Footer').append('<div><a href=#pageMainMenu?reload data-role="button" data-min="true">Cancel</a></div>');

    $(pageSelector + 'Content').append('<strong>Choose a Friend:</strong><br><br><div><ul data-role="listview" data-filter="true" data-filter-placeholder="Type a name..." id="friendsList"></ul></div>');

    // in the end
    $page = $(pageSelector);
    $content = $page.children(":jqmData(role=content)");

    
    ajaxcall("GET", "users", function(response) {

        registeredUsersDB = JSON.parse(response.responseText);
        registeredUsers = [];

        console.log("Got registered users: " + JSON.stringify(registeredUsersDB));

        // creates an array of only user id's
        for (i = 0; i < registeredUsersDB.length; ++i) {
            registeredUsers.push(registeredUsersDB[i].uid);
        }

        FB.api('/me/friends', function(response) {

            // sorts the response array by the users' names
            response.data.sort(sort_by('name', true, function(a) {
                return a.toUpperCase();
            }));

            for (i = 0; i < response.data.length; i++) {
                if ($.inArray(response.data[i].id, registeredUsers) > -1) {
                    if (!isInActiveGames(response.data[i].id)) {
                        id = response.data[i].id;
                        name = response.data[i].name;
                        actionMessage = "Start a new game with " + name + "!";
                        photo = 'http://graph.facebook.com/' + id + '/picture?width=80&height=80';
                        link = 'href="javascript: createNewGame(' + id + ');"';
                        friendItem = '<li><a ' + link + ' ><img src="' + photo + '"><h2>' + name + '</h2><p>' + actionMessage + '</p></a></li>';
                        $("#friendsList").append(friendItem);
                    }
                }
            }


            $page = $(pageSelector);
            $content = $page.children(":jqmData(role=content)");

            // Pages are lazily enhanced. We call page() on the page
            // element to make sure it is always enhanced before we
            // attempt to enhance the listview markup we just injected.
            // Subsequent calls to page() are ignored since a page/widget
            // can only be enhanced once.
            $page.page();

            // Enhance the listview we just injected.
            $content.find(":jqmData(role=listview)").listview();

            // We don't want the data-url of the page we just modified
            // to be the url that shows up in the browser's location field,
            // so set the dataUrl option to the URL for the category
            // we just loaded.
//    options.dataUrl = u.href;

            callback();

        });

    });

}

///**
// * hides the address bar of mobile 
// * @returns {undefined}
// */
//function hideAddressBar()
//{
//    if (!window.location.hash)
//    {
//        if (document.height < window.outerHeight)
//        {
//            document.body.style.height = (window.outerHeight + 50) + 'px';
//        }
//
//        setTimeout(function() {
//            window.scrollTo(0, 1);
//        }, 50);
//    }
//}
//
//// activagtes the hide of the address bar
//window.addEventListener("load", function() {
//    if (!window.pageYOffset) {
//        hideAddressBar();
//    }
//});
//window.addEventListener("orientationchange", hideAddressBar);
