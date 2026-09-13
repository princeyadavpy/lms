const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    // Only register Google strategy if real credentials are set
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientID || clientID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        console.log('ℹ️  Google OAuth: credentials not configured — skipping strategy setup');
        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser(async (id, done) => {
            try { const user = await User.findById(id); done(null, user); }
            catch (err) { done(err, null); }
        });
        return;
    }

    const BASE_URL = process.env.BASE_URL || '/lms';
    const defaultCallback = `${BASE_URL}/api/auth/google/callback`.replace(/\/+/g, '/');
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || defaultCallback;

    passport.use(
        new GoogleStrategy(
            { clientID, clientSecret, callbackURL },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });
                    if (user) {
                        user.lastLoginAt = new Date();
                        await user.save();
                        return done(null, user);
                    }
                    const email = profile.emails?.[0]?.value;
                    if (email) {
                        user = await User.findOne({ email });
                        if (user) {
                            user.googleId = profile.id;
                            user.avatar = profile.photos?.[0]?.value || null;
                            user.lastLoginAt = new Date();
                            await user.save();
                            return done(null, user);
                        }
                    }
                    user = await User.create({
                        name: profile.displayName,
                        email: email || `google_${profile.id}@noemail.com`,
                        password: null,
                        googleId: profile.id,
                        avatar: profile.photos?.[0]?.value || null,
                        role: 'Student',
                        lastLoginAt: new Date()
                    });
                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try { const user = await User.findById(id); done(null, user); }
        catch (err) { done(err, null); }
    });
};
