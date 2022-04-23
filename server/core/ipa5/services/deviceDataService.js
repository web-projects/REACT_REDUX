import * as _ from '../../sql/sqlDataTypes';

export default class DeviceDataService {
    constructor(sqlConnectionWorkerProvider, connectionType, sqlQueryBuilder) {
        this.sqlConnectionWorkerProvider = sqlConnectionWorkerProvider;
        this.connectionType = connectionType;
        // this.sqlConnectionWorker = sqlConnectionWorker;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    getAllDeviceData(opts) {
        const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
        return new Promise((resolve, reject) => {
            const builtQuery = this.sqlQueryBuilder
                .top(1000)
                .select(`DeviceID, CompanyID, Concat(ma.MfgName, ' ' , mo.Description) AS DeviceBranding,
                    [AppID] , [SerialNumber], [OSVersion], [FirmwareVersion], [FormsVersion], [Debit],
                    [IsEMVCapable], [P2PEEnabled], d.[Active], d.[CreatedDate], d.[CreatedBy], d.[UpdatedDate],
                    d.[UpdatedBy], [VipaPackageTag], [CertPackageTag], [IdleImagePackageTag], [VosVault],
                    [VosAppM], [VosVFOP], [VosSRED]`)
                .from('[IPAv5].[dbo].[Device] d')
                .join('Manufacturer ma on ma.ManufacturerID = d.ManufacturerID')
                .join('Model mo on mo.ModelID = d.ModelID')
                .orderByDesc('DeviceID')
                .build();

            // sqlConnectionWorker.execute(builtQuery, null, null, null)
            //    .then((result) => {
            //        resolve(result);
            //    }).catch((err) => {
            //        reject(err);
            //    });
            resolve(
                {
                    data: [
                        {
                            CompanyID: '100',
                            AppID: '10',
                            User: 'Jonnie',
                            SerialNumber: '12345',
                            OSVersion: 'OS.1',
                            FirmwareVersion: 'FW.1',
                            DeviceID: 'id1',
                            VipaPackageTag: 'tag1',
                        },
                        {
                            CompanyID: '101',
                            AppID: '11',
                            User: 'Fonzie',
                            SerialNumber: '67890',
                            OSVersion: 'OS.2',
                            FirmwareVersion: 'FW.2',
                            DeviceID: 'id2',
                            VipaPackageTag: 'tag2',
                        },
                        {
                            CompanyID: '102',
                            AppID: '12',
                            User: 'Owen',
                            SerialNumber: '02468',
                            OSVersion: 'OS.3',
                            FirmwareVersion: 'FW.3',
                            DeviceID: 'id3',
                            VipaPackageTag: 'tag3',
                        },
                    ],
                },
            );
        });
    }

    getExtendedDeviceData(opts) {
        // Return an object with
        // {
        //    DeviceData
        //    App Data
        //    AppRollCall Data
        // }
        return new Promise((resolve, reject) => {
            const deviceQuery = this.sqlQueryBuilder
            .top(1)
            .from('[IPAv5].[dbo].[Device]')
            .where('DeviceId = $DEVICEID')
            .addParameter('$DEVICEID', _.SqlIntType, opts.deviceId)
            .build();

            // const sqlConnectionWorker = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
            // sqlConnectionWorker.execute(deviceQuery, null, null, null)
            //     .then((result) => {
            //         const appId = result.data[0].AppID;
            //         const appDataQuery = this.sqlQueryBuilder
            //             .top(1)
            //             .from('[IPAv5].[dbo].[App]')
            //             .where('AppId = $APPID')
            //             .addParameter('$APPID', _.SqlIntType, appId)
            //             .build();
            //         const appRollCallQuery = this.sqlQueryBuilder
            //             .top(1)
            //             .from('AppRollCall')
            //             .where('AppId = $APPID')
            //             .orderByDesc('AppRollCallID')
            //             .addParameter('$APPID', _.SqlIntType, appId)
            //             .build();

            //         // resolve(result);
            //         Promise.all([
            //             new Promise((resolve2, reject2) => {
            //                 const sqlConnectionWorker2 = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
            //                 sqlConnectionWorker2.execute(appDataQuery, null, null, null)
            //                     .then((result2) => {
            //                         resolve2(result2.data[0]);
            //                     }).catch((err2) => {
            //                         reject2(err2);
            //                     });
            //             }),
            //             new Promise((resolve3, reject3) => {
            //                 const sqlConnectionWorker3 = this.sqlConnectionWorkerProvider.getConnectionWorker(this.connectionType);
            //                 sqlConnectionWorker3.execute(appRollCallQuery, null, null, null)
            //                     .then((result3) => {
            //                         resolve3(result3.data[0]);
            //                     }).catch((err3) => {
            //                         reject3(err3);
            //                     });
            //             }),
            //         ]).then((combinedResults) => {
            //             resolve({
            //                 data: {
            //                     deviceData: result.data[0],
            //                     appData: combinedResults[0],
            //                     appRollCall: combinedResults[1],
            //                 },
            //             });
            //         });
            //     }).catch((err) => {
            //         reject(err);
            //     });

            resolve(
                {
                    data: {
                      appData: {
                        AppID: 'app-id',
                        CompanyID: 'company-id',
                        AppTypeID: 'app-type-id',
                        RollCallOn: 'roll-call-on',
                      },
                      appRollCall: {
                        AppRollCallID: 'app-roll-call-id',
                        CompanyID: 'company-id',
                        AppID: 'app-id',
                        Username: 'user-name',
                      },
                      deviceData: {
                        VosAppM: 'vos-appm',
                        VosSRED: 'vos-sred',
                        VosVFOP: 'vos-vfop',
                        VosVault: 'vos-vault',
                      },
                    },
                },
            );
        });
    }
}
