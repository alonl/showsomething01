/** active user variables */
var connected = false;
var uid;
var accessToken;
var fullName;


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
        $.mobile.changePage("#pageLogin");
    } else {
        // the user isn't logged in to Facebook.
        connected = false;
        $.mobile.changePage("#pageLogin");
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

function logoutFacebookUser() {
    FB.logout(function(response) {
        alert("Your friends are waiting for you to ShowSomething! Come back soon... :)")
        $.mobile.changePage("#pageLogin");
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
        $.mobile.changePage("#pageMainMenu?reload");
    });

    // trigger page create on the generated words page once the app is loaded
    $('#pageGeneratedWords').trigger('create');

}

