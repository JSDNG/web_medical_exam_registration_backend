require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { loginWithGoogle } = require("../services/adminService");

const configLoginWithGoogle = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_APP_CLIENT_ID,
                clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
                callbackURL: "http://localhost:8081/api/v1/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const authType = "google";
                    let rawData = {
                        fullName: profile.displayName,
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                        authGoogleId: profile.id,
                    };
                    let user = await loginWithGoogle(authType, rawData);
                    return done(null, user);
                } catch (err) {
                    console.log(err);
                    return done(err);
                }
            }
        )
    );
};

module.exports = {
    configLoginWithGoogle,
};
