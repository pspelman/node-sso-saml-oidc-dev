require('dotenv').config();

var path = require('path');

var fs = require('fs');

var express = require('express');
var session = require('express-session');
var passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

var bodyParser = require('body-parser');

var userProfile;

var app = express();

app.set('views', path.join(__dirname, 'public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: process.env.SESSION_SECRET}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// saml strategy for passport


// const strategy = new saml(
//     {
//         entryPoint: process.env.SAML_ENTRYPOINT,
//         issuer: process.env.SAML_ISSUER,
//         protocol: process.env.SAML_PROTOCOL,
//         logoutUrl: process.env.SAML_LOGOUT_URL
//     },
//     (profile, done) => {
//         userProfile = profile;
//         done(null, userProfile);
//     }
// );
const strategy = new SamlStrategy(
    {
        path: '/login/callback',
        //    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        entryPoint: process.env.SAML_ENTRYPOINT,
        //    issuer: 'passport-saml',
        issuer: process.env.SAML_ISSUER,
        //    cert: 'fake cert', // cert must be provided
        cert: 'fake cert',
        protocol: process.env.SAML_PROTOCOL,
        logoutUrl: process.env.SAML_LOGOUT_URL
    },
    (profile, done) => {
        console.log(`profile: `, profile);
        userProfile = profile;
        done(null, userProfile);
    }
    // function(profile, done) {
    //     findByEmail(profile.email, function(err, user) {
    //         if (err) {
    //             return done(err);
    //         }
    //         return done(null, user);
    //     });
);

passport.use('saml', strategy);

var redirectToLogin = (req, res, next) => {
    if (!req.isAuthenticated() || userProfile === null) {
        return res.redirect('/app/login');
    }
    next();
}

app.get('/app', redirectToLogin, (req, res) => {
    res.render('index', {
        title: 'Express Web Application',
        heading: 'Logged-In to Express Web Application'
    });
});

app.get('/app/login',
    passport.authenticate('saml', {
        successRedirect: '/app',
        failureRedirect: '/app/login'
    })
);

app.get('app/logout', (req, res) => {
    if (req.user === null) {
        return res.redirect('/app/Home');
    }
    return strategy.logout(req, (err, uri) => {
        req.logout();

        userProfile = null;

        return res.redirect(uri);
    });
});

app.get('/app/failed', (req, res) => {
    res.status(401).send('Login failed');
});

app.post('/saml/consume',
    passport.authenticate('saml', {
        failureRedirect: '/app/failed',
        failureFlash: true
    }),
    (req, res) => {
        // saml assertion extraction from saml response
        // var samlResponse = res.req.body.SAMLResponse;
        // var decoded = base64decode(samlResponse);
        // var assertion =
        // 	('<saml2:Assertion' + decoded.split('<saml2:Assertion')[1]).split(
        // 		'</saml2:Assertion>'
        // 	)[0] + '</saml2:Assertion>';
        // var urlEncoded = base64url(assertion);

        // success redirection to /app
        return res.redirect('/app');

    });


app.post('/app/home', (req, res) => {
    res.render('home', {
        title: 'Express Web Application',
        heading: 'Express Web Application'
    });
});

app.listen(process.env.PORT || 3000);


/*
* var passport = require('passport');
var saml = require('passport-saml').Strategy;

// saml strategy for passport
var strategy = new saml(
	{
		entryPoint: <provide SAML entry point url : https://localhost:9443/samlsso>,
		issuer: <provide SAML issuer name : SampleExpressApp>,
		protocol: <provide the protocol used : http://>,
		logoutUrl: <provide the logout url : https://localhost:9443/samlsso>
	},
	(profile, done) => {
		// your body implementation on success
	}
);

// register the strategy with passport
passport.use(strategy);*/