//*****************************************************************************
// Facebook Initialization 
//*****************************************************************************
window.fbAsyncInit = function() {
    FB.init({
        appId: '174443279377278', // App ID
        channelUrl: '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
        status: false, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

    // pay attention to the callback function call
    FB.Event.subscribe('auth.statusChange', function(response) {
        facebookStatusChange(response);
    });
    FB.getLoginStatus(function(response) {
        facebookStatusChange(response);
    });
};
// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));


//*****************************************************************************
// Page loader
//*****************************************************************************
// Listen for any attempts to call changePage().
$(document).bind("pagebeforechange", function(e, data) {

// We only want to handle changePage() calls where the caller is
// asking us to load a page by URL.
    if (typeof data.toPage === "string") {

        // We are being asked to load a page by URL, but we only
        // want to handle URLs that request a reload...
        u = $.mobile.path.parseUrl(data.toPage),
                re = /\?reload/;
        if (u.hash.search(re) === -1) {
            return;
        }   //else

        pageSelector = u.hash.replace(/\?reload/, "");
        $page = $(pageSelector);

        reloadPage(pageSelector, function() {
            // Now call changePage() and tell it to switch to
            // the page we just modified.
            $.mobile.changePage(pageSelector, data.options);
        });

        // Make sure to tell changePage() we've handled this call so it doesn't
        // have to do anything.
        e.preventDefault();
    }

});


// TODO: add ???
$('#picturePreview').click(filePreview());