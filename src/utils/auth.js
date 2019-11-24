const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { getUserInfo, getUser, addUser } = require("../database/databaseOperations").user

module.exports = passport => {
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (userId, done) => {
        try {
            let user = await getUserInfo(userId)
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })

    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
        async (token, refreshToken, profile, done) => {
            try {
                let user = await getUser(profile.id)
                if (user) {
                    return done(null, user)
                } else {
                    console.log("New user being created")
                    let newUser = await addUser({
                        username: profile.displayName,
                        token,
                        googleId: profile.id
                    })
                    return done(null, newUser)
                }
            } catch (err) {
                console.error(err)
                return done(err)
            }
        }))
}