import {EngineServlet} from "./enginerunner.js";

const engine = new EngineServlet({
    emit(msg) {
        postMessage(msg);
    },
    close() {
        close();
    },
});

addEventListener("message", e => {
    engine.send(e.data);
});