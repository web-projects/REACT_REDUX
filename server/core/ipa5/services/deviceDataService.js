import * as _ from '../../sql/sqlDataTypes';

export default class DeviceDataService {
    constructor(sqlConnectionWorker, sqlQueryBuilder) {
        this.sqlConnectionWorker = sqlConnectionWorker;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    getAllDeviceData(opts) {
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

            // this.sqlConnectionWorker.execute(builtQuery, null, null, null)
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
}
