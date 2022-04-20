import express from 'express';
import _ from 'underscore';
import { log2 } from '../logger';

const router = express.Router();

router.use((req, res, next) => {
  log2('New Mock API Request received.');
  next();
});

// #region Companies
// List companies
router.get('/companies', (req, res) => {
  res.json({
    companies: [
      {
        companyid: 1,
        name: 'Sphere Commerce',
        companytypeid: 1,
        timezoneid: 1,
        active: true,
        createddate: '2020-07-21 00:00:00.000',
        createdby: 'austin.orphan',
        updateddate: null,
        updatedby: null,
      },
      {
        companyid: 2,
        name: 'Conduent',
        companytypeid: 1,
        timezoneid: 1,
        active: true,
        createddate: '2020-07-21 00:00:00.000',
        createdby: 'austin.orphan',
        updateddate: '2020-07-21 12:00:00.000',
        updatedby: 'austin.orphan',
      },
      {
        companyid: 3,
        name: 'Some Company 3',
        companytypeid: 1,
        timezoneid: 1,
        active: true,
        createddate: '2020-07-21 00:00:00.000',
        createdby: 'austin.orphan',
        updateddate: null,
        updatedby: null,
      },
      {
        companyid: 4,
        name: 'Some Other Company 4',
        companytypeid: 1,
        timezoneid: 1,
        active: false,
        createddate: '2020-07-21 00:00:00.000',
        createdby: 'austin.orphan',
        updateddate: null,
        updatedby: null,
      },
    ],
  });
  res.end();
});

// Get company
router.get('/companies/:companyid', (req, res) => {
  res.json(
    {
      companyid: req.params.companyid,
      name: 'Some Name',
      companytypeid: 1,
      timezoneid: 1,
      active: true,
      createddate: '2020-07-21 00:00:00.000',
      createdby: 'austin.orphan',
      updateddate: null,
      updatedby: null,
    },
  );
  res.end();
});

// Create company
router.post('/companies', (req, res) => {
  res.status(201);
  const resJson = {
    companyid: 1,
  };
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      resJson[`${key}`] = req.body[key];
    }
  }
  res.json(resJson);
  res.end();
});

// Update company
router.patch('/companies/:companyid', (req, res) => {
  const resJson = {
    companyid: req.params.companyid,
  };
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      resJson[`${key}`] = req.body[key];
    }
  }
  res.json(resJson);
  res.end();
});

// Delete company
router.delete('/companies/:companyid', (req, res) => {
  let statusCode;
  if (isNaN(req.params.companyid)) {
    statusCode = 400;
  } else if (Number(req.params.companyid) < 1 || Number(req.params.companyid) > 9) {
    statusCode = 204;
  } else {
    statusCode = 200;
  }
  res.status(statusCode);
  res.end();
});
// #endregion

// #region Devices
// List devices
router.get('/devices', (req, res) => {
  let devices = [
    {
      deviceid: 1,
      companyid: 1,
      manufacturerid: 1,
      modelid: 1,
      appid: 1,
      serialnumber: 'sn01',
      assetnumber: null,
      osversion: '1.0',
      firmwareversion: '1.0',
      formsversion: 'tc123',
      debit: true,
      isemvcapable: true,
      jdalversion: '1.0',
      p2peenabled: null,
      active: true,
      createddate: '2020-07-21 00:00:00.000',
      createdby: 'austin.orphan',
      updateddate: null,
      updatedby: null,
      partnumber: null,
    },
    {
      deviceid: 2,
      companyid: 2,
      manufacturerid: 1,
      modelid: 1,
      appid: 1,
      serialnumber: 'sn02',
      assetnumber: 'asset1',
      osversion: '2.0',
      firmwareversion: '1.0',
      formsversion: 'tc123',
      debit: false,
      isemvcapable: true,
      jdalversion: '1.0',
      p2peenabled: true,
      active: true,
      createddate: '2020-07-21 00:00:00.000',
      createdby: 'austin.orphan',
      updateddate: '2020-07-21 12:00:00.000',
      updatedby: 'austin.orphan',
      partnumber: 'part1234',
    },
    {
      deviceid: 3,
      companyid: 2,
      manufacturerid: 1,
      modelid: 1,
      appid: 1,
      serialnumber: 'sn03',
      assetnumber: null,
      osversion: '1.0',
      firmwareversion: '2.0',
      formsversion: 'tc123',
      debit: true,
      isemvcapable: true,
      jdalversion: '1.0',
      p2peenabled: null,
      active: false,
      createddate: '2020-07-21 00:00:00.000',
      createdby: 'austin.orphan',
      updateddate: null,
      updatedby: null,
      partnumber: null,
    },
    {
      deviceid: 4,
      companyid: 3,
      manufacturerid: 1,
      modelid: 1,
      appid: 1,
      serialnumber: 'sn04',
      assetnumber: null,
      osversion: '1.0',
      firmwareversion: '1.0',
      formsversion: 'tc123',
      debit: true,
      isemvcapable: true,
      jdalversion: '1.0',
      p2peenabled: null,
      active: true,
      createddate: '2020-07-21 00:00:00.000',
      createdby: 'austin.orphan',
      updateddate: null,
      updatedby: null,
      partnumber: null,
    },
  ];

  // filter based on companyid
  if (req.query.companyid !== undefined) {
    devices = _.filter(devices, (item) => item.companyid == req.query.companyid);
  }

  res.json({
    devices,
  });
});

// Get device
router.get('/devices/:deviceid', (req, res) => {
  res.json({
    deviceid: req.params.deviceid,
    companyid: 1,
    manufacturerid: 1,
    modelid: 1,
    appid: 1,
    serialnumber: 'abc123',
    assetnumber: null,
    osversion: '1.0',
    firmwareversion: '1.0',
    formsversion: 'tc123',
    debit: true,
    isemvcapable: true,
    jdalversion: '1.0',
    p2peenabled: null,
    active: true,
    createddate: '2020-07-21 00:00:00.000',
    createdby: 'austin.orphan',
    updateddate: null,
    updatedby: null,
    partnumber: null,
  });
});

// Create device
router.post('/devices', (req, res) => {
  res.status(201);
  const resJson = {
    deviceid: 1,
  };
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      resJson[`${key}`] = req.body[key];
    }
  }
  res.json(resJson);
  res.end();
});

// Update device
router.patch('/devices/:deviceid', (req, res) => {
  const resJson = {
    deviceid: req.params.deviceid,
  };
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      resJson[`${key}`] = req.body[key];
    }
  }
  res.json(resJson);
  res.end();
});

router.delete('/devices/:deviceid', (req, res) => {
  let statusCode;
  if (isNaN(req.params.deviceid)) {
    statusCode = 400;
  } else if (Number(req.params.deviceid) < 1 || Number(req.params.deviceid) > 9) {
    statusCode = 204;
  } else {
    statusCode = 200;
  }
  res.status(statusCode);
  res.end();
});
// #endregion

module.exports = router;
