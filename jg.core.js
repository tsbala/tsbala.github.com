/* *********************************************************************************************************** */
/* NOTE: This Should Always Be Placed in the "HEAD" Section of the Page. (Scripts Used By Us Are Loaded Async) */
/* *********************************************************************************************************** */

// Global Scope
    // Google Analytics Tracking Array/Queue
var _gaq = [];

function submitFormAjax(formName, onSuccess) {
    $.post($(formName).attr('action'), $(formName).serialize() + "&jsonRequest=true",
                    function (saveData) { onSuccess(saveData); });
    return false;
}  

// JustGiving Scope
var JustGiving = {
    __namespace: true,
    WriteConsole: function writeConsole(value) {
                    var production = window.location.href.match(/^http(s?):\/\/(www\.)?justgiving.com/i);
                    if (window.console && (production === null)) {
                        window.console.info(value);
                    }
                  }
            };

var queryString = function (q) {
    if (q == "") return {};
    var b = {};
    for (var i = 0; i < q.length; ++i) {
        var p = q[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
} (window.location.search.substr(1).split('&'));


// Analytics
JustGiving.Analytics = function () {
    __namespace = true;

    var spyRunning = false;

    function renderPushArguments(array) {
        try {
            if (spyRunning) {
                var output = 'Analytics Request Sent: _gaq.push([';
                for (i = 0; i < array.length; i++) {
                    var item = array[i];

                        if (i > 0)
                            output += ', ';

                        output += ('\'' + item + '\'');
                };
                output += ']);';
                JustGiving.WriteConsole(output);
            }
        } catch (err) { debugger; };
    };

    function Push(array) {
        if (array.constructor != Array) {
            throw "Only Arrays Should be Pushed to JustGiving.Analytics.Push (See: http://bit.ly/gnonOe)";
        }
        else {
            renderPushArguments(array);
            _gaq.push(array);
        }
    };

    function Spy() {

        function createAnalyticsElement() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

            // Once The Script is Loaded, We Need to Override "Push" Again
            /* Raised by IE */
            ga.onreadystatechange = function () {
                if (s.readyState == 'complete') {
                    /* Nothing */
                }
            };

            /* Raised by FF/Webkit */
            ga.onload = function () {
                /* Nothing */
            };
        };

        createAnalyticsElement();

        spyRunning = true;
        JustGiving.WriteConsole('JustGiving Google Analytics Spy Running...');
    };

    return {
        spy: Spy,
        push: Push
    };
} ();

JustGiving.Analytics.SocialTracking = function () {
    var settings = {
        network: '',
        socialAction: '',
        target: '',
        pagePath: ''
    };

    function extendSettings(options) {
        settings = $.extend({}, settings, options);
        //JustGiving.WriteConsole(settings);
    }

    function track() {
        if (settings.network !== '' && settings.socialAction != '') {
            if (settings.pagePath !== '') {
                try { JustGiving.Analytics.push(['_trackSocial', settings.network, settings.socialAction, settings.target, settings.pagePath]); } catch (ex) { }
            }
            else {
                try { JustGiving.Analytics.push(['_trackSocial', settings.network, settings.socialAction, settings.target]); } catch (ex) { }
            }
        }
        else {
            JustGiving.WriteConsole('_trackSocial not pushed to Google Analytics as network and action not defined');
        }
    };

    return {
        Track: track,
        ExtendSettings: extendSettings
    };
} ();

JustGiving.Analytics.TrackFacebookLikeSourceAndRef = function () {
    var push = function () {
        if (referrerIsFacebook()) {
            if (queryString["fb_source"] && queryString["fb_ref"]) {
                JustGiving.Analytics.push(['_setCampSourceKey', 'fb_source']);
                JustGiving.Analytics.push(['_setCampMediumKey', 'fb_ref']);
            }
        }
    };

    var referrerIsFacebook = function() {
        return document.referrer.match( /^https?:\/\/(www\.)?facebook\.com\//i );
    };

    return {
        Push: push
    };
} ();

// Spin Up Components
JustGiving.Analytics.spy();

// Facebook helper object
(function(namespace) {
    namespace.DoIfFacebookAuthIsValid = function (ifAuthIsValid, ifAuthIsInvalid) {
        var retrieveLatestFromFBServer = true; // As we do FB OAuth on the server, we need to refresh the Facebook OAuth cookies on client by forcing a fetch from the FB servers and not the cache

        FB.getLoginStatus(function (response) {
            if (response.authResponse) {
                ifAuthIsValid();
            } else {
                ifAuthIsInvalid();
            }
        }, retrieveLatestFromFBServer);
    };

    namespace.DoIfHasPermission = function (permission, actionSuccess, actionFailure) {
        FB.api('/me/permissions', function (perms) {
            if (perms && perms.data[0][permission]) {
                actionSuccess();
            }
            else {
                actionFailure();
            }
        });
    };
})(JustGiving.Facebook = JustGiving.Facebook || {});
