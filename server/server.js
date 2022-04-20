import express from 'express';
import session from 'express-session';
import timeout from 'connect-timeout';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import Grip from './grip';
import * as logger from './logger';
import requestLoggerMiddleware from './middlewares/requestLoggerMiddleware';
// import mockApiRouter from './routes/mockApiRouter';
// import authRouter from './routes/authRouter';
// import dataRouter from './routes/dataRouter';
import deviceApiRouter from './routes/deviceApiRouter';
// import ReportGenerationStandardOptions from './core/reporting/reportGenerationStandardOptions';
// import ReportGeneratorProvider from './core/providers/reportGeneratorProvider';
// import ConnectionListGeneratorProvider from './core/providers/connectionListGeneratorProvider';

const passport = require('passport');

//
// Import Application Insights but disable telemetry
// when we're running in a local configuration.
//
// Although eslint complains because the 'require' statement
// is out of import order, this is necessary because app insights
// injects instrumentation code into common 3rd-party libraries
// to collect further telemetry information.
// ------------------------------------------------------------------
const appInsights = require('applicationinsights');
const createError = require('http-errors');

logger.log2('Initializing dotenv config');
dotenv.config();

logger.log2('Initiailizing express framework');
const app = express();

logger.log2('Disabling X-Powered-By header for security purposes. DO NOT DISABLE!');
app.disable('x-powered-by');

logger.log2('Express configured to trust SSL Termination at the network load balancer in Azure');
app.set('trust proxy', 1);

//
// Adjust the timeout value for express and also ensure that it is
// the last middleware on the stack. Failure to do so will cause
// the request flow to stop processing.
// ------------------------------------------------------------------
app.use(timeout(120000));

logger.log2('Initializing JSON for Express');
app.use(express.json());

logger.log2('Express is now configured to parse URL encoded data via querystring lib');
app.use(express.urlencoded({ extended: false }));

logger.log2('Initializing cookie-parser middleware');
app.use(cookieParser());

logger.log2('Making public folder accessible');
app.use(express.static(path.join(__dirname, 'public')));

logger.log2('Enable express session middleware');
const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {},
  };

app.use(session(sess));

logger.log2('Enable passport middlewares');
app.use(passport.initialize());
app.use(passport.session());

logger.log2('Initializing request logger middleware');
app.use(requestLoggerMiddleware);

logger.log2('Initializing custom security middleware');
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Frame-Options', 'DENY');
    next();
});

//
// Additional routers should all be defined here.
// ------------------------------------------------------------------
app.use('/api/devices', deviceApiRouter);
// app.use('/api', mockApiRouter);
// app.use('/auth', authRouter);
// app.use('/data', dataRouter);

const grip = new Grip();

//
// Handle rendering of pages by GRIP
// ------------------------------------------------------------------
const renderPage = ((req, res, dataObject) => {
    const renderedHtml = grip.render(dataObject);
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write(renderedHtml);
    res.end();
});

function loggedIn(req, res, next) {
    // if (req.user) {
        next();
    // } else {
    //    res.redirect('/auth/login');
    // }
}

//
// Top Level Page Endpoints.
// ------------------------------------------------------------------

app.get('/',
    loggedIn,
    (req, res) => {
        // res.send({ express: 'Hello From Express' });
        renderPage(req, res, grip.getHomepageInfo());
    });

/*
app.get('/login', (req, res) => {
    renderPage(req, res, grip.getLoginPageInfo());
});

app.get('/forgot-password', (req, res) => {
    renderPage(req, res, grip.getForgotPasswordInfo());
});

app.get('/loginfailure', (req, res) => {
    renderPage(req, res, grip.getLoginFailureInfo());
});

app.get('/logout', (req, res) => {
    req.logout();
    renderPage(req, res, grip.getLogoutInfo());
});
*/

app.get('/devices', (req, res) => {
    renderPage(req, res, grip.getDevicesInfo());
});

/**
 * Note:
 * The following functions will be moved to a proper router
 * and will be left in place for now.
 *
 * /getreport
 * /getexcelreport
 * /getvolume
 * /getexcelvolume
 */

/*
app.get('/get-approllcall-report', (req, res) => {
    const reportOptions = new ReportGenerationStandardOptions();
    reportOptions.companyId = 199;
    reportOptions.startDateRange = '2022-01-01';
    reportOptions.endDateRange = '2022-04-05';
    reportOptions.includeTestData = true;

    const provider = new ReportGeneratorProvider();
    const reportGenerator = provider.getAppRollCallReportGenerator(reportOptions, null);

    reportGenerator.runReport().then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err.message);
    });
});

app.get('/get-approllcall-excel-report', (req, res) => {
    const reportOptions = new ReportGenerationStandardOptions();
    reportOptions.companyId = 199;
    reportOptions.startDateRange = '2022-01-01';
    reportOptions.endDateRange = '2022-04-05';
    reportOptions.includeTestData = true;

    const provider = new ReportGeneratorProvider();
    const reportGenerator = provider.getAppRollCallReportGenerator(reportOptions, null);

    reportGenerator.saveReportToStream(res).catch((err) => {
        res.status(500).send(err.message);
    });
});

app.get('/get-volume-report', (req, res) => {
    const reportOptions = new ReportGenerationStandardOptions();
    reportOptions.companyId = 385;
    reportOptions.startDate.month = 3;
    reportOptions.startDate.year = 2022;
    reportOptions.endDate.month = 4;
    reportOptions.endDate.year = 2022;

    const provider = new ReportGeneratorProvider();
    const reportGenerator = provider.getVolumeCountReportGenerator(reportOptions, null);

    reportGenerator.runReport().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.dir(err);
        res.status(500).send(err.message);
    });
});

app.get('/get-volume-excel-report', (req, res) => {
    const reportOptions = new ReportGenerationStandardOptions();
    reportOptions.companyId = 385;
    reportOptions.startDate.month = 3;
    reportOptions.startDate.year = 2022;
    reportOptions.endDate.month = 4;
    reportOptions.endDate.year = 2022;

    const provider = new ReportGeneratorProvider();
    const reportGenerator = provider.getVolumeCountReportGenerator(reportOptions, null);

    reportGenerator.saveReportToStream(res).catch((err) => {
        res.status(500).send(err.message);
    });
});

app.get('/get-connection-list', (req, res) => {
    const provider = new ConnectionListGeneratorProvider();
    const connectionListGenerator = provider.getConnectionListGenerator();

    connectionListGenerator.retrieveConnectionAdjacencyList().then((result) => {
        res.send(JSON.stringify(result, null, 2));
    }).catch((err) => {
        res.status(500).send(err.message);
    });
});
*/

//
// Catch 404 and forward to error handler.
// ------------------------------------------------------------------
app.use((req, res, next) => {
    next(createError(404));
});

//
// Catch the timedout event from express and do no further processing.
// ------------------------------------------------------------------
app.use((req, res, next) => {
    if (!req.timedout) {
        next();
    }
});

//
// Launch the main server on the port specified by environment
// variable or on the default port of 9001.
// ------------------------------------------------------------------
let server = null;
const options = {
    key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem')),
};

grip.executeSetup().then(() => {
    logger.log2('GRIP setup is complete.');

    server = https.createServer(options, app).listen(process.env.PORT, () => {
        const host = server.address().address;
        const { port } = server.address();

        let absoluteHost = host;
        if (host === '::') {
            absoluteHost = 'localhost';
        }

        // Application Insights SDK connection string gets added automatically
        // within the Azure environment and that's the only time we should run
        // the SDK.
        if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
            logger.log2('Adding application insights connection string "%s" and starting SDK', process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
            appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
                // Track context across asynchronous callbacks in NodeJS.
                .setAutoDependencyCorrelation(true)
                // Allow data to be sent to the live metrics service.
                .setSendLiveMetrics(true)
                // Allow calls to be displayed for console.log and also winston and bunyan.
                .setAutoCollectConsole(true, true)
                .start();
        } else {
            logger.log2('Application Insights SDK not started since we are running locally.');
        }

        logger.log2('Currently running in NODE_ENV "%s"', process.env.NODE_ENV);
        logger.log2('Dashboard Server listening at %s', `${absoluteHost}:${port}`);
    });
}).catch((err) => {
    logger.log2_e('Unable to start Dashboards Server');
    logger.log2_e(err);

    process.exit(-1);
});

global.grip = grip;

//
// Wire up the exit handler to the NodeJS process to handle
// CTRL + C and process termination signals accurately to
// close down the server properly.
// ------------------------------------------------------------------
function exitHandler() {
    logger.log2('Closing Dashboard Server socket connections.');
    server.close(() => {
        logger.log2('Closed out remaining connections.');
        process.exit();
    });
}

process.on('SIGTERM', exitHandler.bind(null));
process.on('SIGINT', exitHandler.bind(null));
