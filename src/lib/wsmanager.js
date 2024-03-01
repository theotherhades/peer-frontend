// @ts-nocheck

import { get } from "svelte/store";
import { apiWsUrl as storedApiWsUrl } from "./stores.js";

/**
 * Wrapper for WebSocket connections to the server.
 */
export default class WsManager {
    constructor(path) {
        this.apiWsUrl = get(storedApiWsUrl);
        this.callbacks = {};
        this.internalWebSocket = new WebSocket(`${this.apiWsUrl}/${path}`);

        // Event listeners
        this.internalWebSocket.addEventListener("message", (event) => {
            this.onMessage(event);
        });
        this.internalWebSocket.addEventListener("error", (event) => {
            this.onError(event);
        });
    }

    emit(event, ...args) {
        if (!this.callbacks[event]) this.callbacks[event] = [];
        for (const callback of this.callbacks[event]) callback(...args);
    }
    on(event, cb) {
        if (!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb);
    }

    send(packet) {
        this.internalWebSocket.send(JSON.stringify(packet));
        console.log(`[WsManager] OUTGOING: ${JSON.stringify(packet)}`);
    }
    close() {
        this.internalWebSocket.close();
        console.log("[WsManager] Connection was closed by the client");
    }
    onMessage(event) {
        const packet = JSON.parse(event.data);
        console.log(`[WsManager] INCOMING: ${JSON.stringify(packet)}`);
        
        if (packet.cmd === "auth") {
            this.emit("auth");
        } else if (packet.cmd === "livemsg") {
            this.emit("livemsg", packet);
        }
    }
    onError(event) {
        console.error(`[WsManager] ERROR: ${event}`);
    }
}