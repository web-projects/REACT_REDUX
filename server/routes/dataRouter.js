import express from 'express';
import { Connection, Request } from 'tedious';
import passport from 'passport';
import { BearerStrategy } from 'passport-azure-ad';
// eslint-disable-next-line camelcase
import { log2, log2_e } from '../logger';

const tenantId = '964397d4-5d15-4c5f-a2ad-ebbc946a55ef';
const clientId = 'ffab61ed-cee9-4310-b2c8-4fb5ea3207d9';

/**
 * Note a bug exists with MS OIDC whereby when MS Graph scopes are requested (i.e. 'openid' & 'profile' in authRouter.js),
 * it returns a v1.0 token, despite us requesting a v2.0 token.
 * In addition, the Passport.js library expects a v2.0 in this case and therefore is unable to validate it.
 * The chosen solution is to instead validate the JWT using v1.0 audience & issuer shown below.
 */
const config = {
  creds: {
    identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
    clientID: clientId,
    loggingLevel: 'info',
    loggingNoPII: true, // set this false for better logging during debugging!
    audience: `api://${clientId}`,
    validateIssuer: true,
    issuer: `https://sts.windows.net/${tenantId}/`,
  },
};

const options = {
  identityMetadata: config.creds.identityMetadata,
  clientID: config.creds.clientID,
  validateIssuer: config.creds.validateIssuer,
  issuer: config.creds.issuer,
  passReqToCallback: config.creds.passReqToCallback,
  isB2C: config.creds.isB2C,
  policyName: config.creds.policyName,
  allowMultiAudiencesInToken: config.creds.allowMultiAudiencesInToken,
  audience: config.creds.audience,
  loggingLevel: config.creds.loggingLevel,
  loggingNoPII: config.creds.loggingNoPII,
  clockSkew: config.creds.clockSkew,
  scope: config.creds.scope,
};

const users = [];
let owner = null;

function findByOid(oid, fn) {
  for (let i = 0; i < users.length; ++i) {
    const user = users[i];
    if (users.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new BearerStrategy(options,
  ((token, done) => {
    log2('verifying the user');
    // console.dir(token); // Uncomment for testing.
    findByOid(token.oid, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        // "Auto-registration"
        log2(`User was added automatically as they were new. Their oid is: ${token.oid}`);
        users.push(token);
        owner = token.oid;
        return done(null, token);
      }
      owner = token.oid;
      return done(null, user, token);
    });
  })));

const router = express.Router();

router.use((req, res, next) => {
  log2('New data request received.');
  next();
});

const executeSql = (query, params) => new Promise(
  (resolve, reject) => {
    let result = '';

    const request = new Request(query, ((err) => {
      if (err) {
          reject(err);
      } else {
        resolve(result);
      }
    }));

    if (params != null) {
      params.forEach((param) => {
        request.addParameter(param.name, param.type, param.value, param.options);
      });
    }

    const dbConfig = JSON.parse(process.env.IPAV5_DB_JSON_CONNSTRING);

    // TODO: `executeSql` may need another param (e.g. `context`) which could target diff dbs.
    const connection = new Connection(dbConfig);

    request.on('row', (columns) => {
        columns.forEach((column) => {
          if (column.value === null) {
            result += 'NULL ';
          } else {
            result += `${column.value} `;
          }
        });
    });

    connection.on('connect', (err) => {
      // If no error, then good to proceed.
      if (err) {
        reject(err);
      } else {
        log2('Connected');
        connection.execSql(request);
      }
    });

    request.on('done', (rowCount, more) => {
      log2(`${rowCount} rows returned`);
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on('requestCompleted', (rowCount, more) => {
        connection.close();
    });

    connection.connect();
  },
);

router.get('/version',
  (req, res, next) => {
    next();
  },
  passport.authenticate('oauth-bearer', { session: false }),
  (req, res) => {
    const response = {
      result: null,
      error: null,
    };

    executeSql('select @@VERSION')
    .then((ok) => {
      response.result = ok;
    })
    .catch((err) => {
      log2_e(err);
      response.error = err;
    })
    .finally(() => {
      res.send(response);
    });
  });

module.exports = router;
