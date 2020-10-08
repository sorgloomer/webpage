export class LocalGameServer {
    constructor(worker, playerId) {
        this._worker = worker;
        this.playerId = playerId;
    }

    updateInput(input) {
        this._worker.updateInput(this.playerId, input);
    }
    listen(callbacks) {
        this._callbacks = callbacks;
    }
}



export class RemoteGameServer {
    constructor(connection) {
        this._connection = connection;
    }

    updateInput(input) {
    }
}
