import express from 'express';
import { log2 } from '../logger';

const router = express.Router();

router.use((req, res, next) => {
  log2('New auth Request received.');
  next();
});

const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const tenantId = '964397d4-5d15-4c5f-a2ad-ebbc946a55ef';
const clientId = 'ffab61ed-cee9-4310-b2c8-4fb5ea3207d9';
const dataReadScope = `api://${clientId}/data-read`;

// TODO: Load this from a config file.
const config = {
    creds: {
        identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
        clientID: clientId,
        responseType: 'id_token code',
        responseMode: 'form_post',
        redirectUrl: 'https://localhost:9001/auth/login-callback',
        allowHttpForRedirectUrl: false,
        clientSecret: 'Zx17Q~sEsTxV6jQBGnlT3h85RvaJU_qoMx~Kp',
        validateIssuer: true,
        isB2C: false,
        issuer: null,
        passReqToCallback: false,
        scope: [
          'openid',
          'profile',
          dataReadScope,
        ],
        loggingLevel: 'info',
        loggingNoPII: true,
        nonceLifetime: 3600,
        nonceMaxAmount: 10,
        useCookieInsteadOfSession: false,
        cookieSameSite: false,
        cookieEncryptionKeys: null,
        clockSkew: 300,
    },
};

const options = {
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: config.creds.redirectUrl,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: config.creds.clientSecret,
    validateIssuer: config.creds.validateIssuer,
    isB2C: config.creds.isB2C,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    loggingNoPII: config.creds.loggingNoPII,
    nonceLifetime: config.creds.nonceLifetime,
    nonceMaxAmount: config.creds.nonceMaxAmount,
    useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
    cookieSameSite: config.creds.cookieSameSite, // boolean
    cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
    clockSkew: config.creds.clockSkew,
  };

const users = [];

function findByOid(oid, fn) {
  for (let i = 0; i < users.length; ++i) {
    const user = users[i];
    if (users.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new OIDCStrategy(options,
    // eslint-disable-next-line camelcase, consistent-return
    (iss, sub, profile, access_token, refresh_token, done) => {
      // log2(`access_token: ${access_token}`); // Uncomment for testing.
      if (!profile.oid) {
        return done(new Error('No oid found'), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(() => {
        findByOid(profile.oid, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }));

router.get('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/loginfailure' }),
  (req, res) => {
      res.redirect('/');
  });

function regenerateSessionAfterAuthentication(req, res, next) {
    const passportInstance = req.session.passport;
    return req.session.regenerate((err) => {
      if (err) {
        return next(err);
      }
      req.session.passport = passportInstance;
      return req.session.save(next);
    });
  }

router.post('/login-callback',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/loginfailure' }),
  regenerateSessionAfterAuthentication,
  (req, res) => {
      res.cookie('username', req.user.displayName);
      res.redirect('/');
  });

module.exports = router;
