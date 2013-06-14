//*****************************************************************************
// Facebook Initialization 
//*****************************************************************************
window.fbAsyncInit = function() {
    FB.init({
        appId: '174443279377278', // App ID
        channelUrl: '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
        status: false, // check login status
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,   // parse XFBML
		frictionlessRequests: true
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
