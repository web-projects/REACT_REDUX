import express from 'express';
import DataServiceProvider from '../core/providers/dataServiceProvider';
import { log2 } from '../logger';

const router = express.Router();

router.use((req, res, next) => {
    log2('New Device API Request received.');
    next();
});

// List the devices
router.get('/get-all-devices', (req, res) => {
    // Get data service provider
    const serviceProvider = new DataServiceProvider();

    // get data service
    const service = serviceProvider.getDeviceDataService();

    // execute data service to return the data
    return service.getAllDeviceData(null).then((result) => {
        res.send(result.data);
    }).catch((err) => {
        res.status(500).send(err.message);
    });
});

// List the devices
router.get('/get-device-details', (req, res) => {
    // Get data service provider
    const serviceProvider = new DataServiceProvider();

    // get data service
    const service = serviceProvider.getDeviceDataService();

    // execute data service to return the data
    return service.getDeviceDetails(null).then((result) => {
        res.send(result.data);
    }).catch((err) => {
        res.status(500).send(err.message);
    });
});

module.exports = router;
