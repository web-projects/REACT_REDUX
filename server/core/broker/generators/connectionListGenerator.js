export default class ConnectionListGenerator {
    constructor(sqlConnectionWorker) {
        this.sqlConnectionWorker = sqlConnectionWorker;
    }

    retrieveConnectionAdjacencyList() {
        return new Promise((resolve, reject) => {
            const connectionMap = new Map();
            const objectMap = new Map();
            try {
                this.getConnectionData().then((result) => {
                    result.data.forEach((conn) => {
                        objectMap[conn.ConnectionId] = conn;
                        // if BrokerOwnerId is null or whitespace, continue
                        if (conn.BrokerOwnerId == null || conn.BrokerOwnerId === '') {
                            return;
                        }

                        // if connectionList does not yet have the connectionId, add an emptyList
                        if (connectionMap[conn.ConnectionId] == null) {
                            connectionMap[conn.ConnectionId] = [];
                        }
                        // if connectionList does not yet have the BrokerOwnerId, add an emptyList
                        if (connectionMap[conn.BrokerOwnerId] == null) {
                            connectionMap[conn.BrokerOwnerId] = [];
                        }

                        connectionMap[conn.ConnectionId].push(conn.BrokerOwnerId);
                        connectionMap[conn.BrokerOwnerId].push(conn.ConnectionId);
                    });
                    resolve({
                        objectMap,
                        adjacencyList: connectionMap,
                    });
                }).catch((err) => {
                    reject(err);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    getConnectionData() {
        return new Promise((resolve, reject) => {
            try {
                this.sqlConnectionWorker.execute('SELECT * FROM Connection with (NOLOCK)', null, null, null)
                    .then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
            } catch (e) {
                reject(e.message);
            }
        });
    }
}
