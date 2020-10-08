export class GameServerWorker {
    constructor(callbacks) {
        this._callbacks = callbacks;
        this._worker = new Worker(new URL("./index.js", import.meta.url), {type:"module"});
        this._worker.addEventListener("message", e => this._handleMessage(e));
        this._post({type:"create"});
    }
    _handleMessage(e) {
        const data = e.data;
        switch (data.type) {
            case "updates":
                this._callbacks.update(data.updates);
                return;
        }
    }
    updateInput(playerId, diff) {
        this._post({type:"input", id: playerId, diff: diff});
    }
    _post(data) {
        this._worker.postMessage(data);
    }

    close() {
        this._worker.postMessage({type:"close"});
    }
}
