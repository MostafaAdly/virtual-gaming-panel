"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eventEmitter() {
    let listeners = {};
    return {
        on(key, fn) {
            listeners[key] = (listeners[key] || []).concat(fn);
        },
        off(key, fn) {
            listeners[key] = (listeners[key] || []).filter((f) => f !== fn);
        },
        emit(key, data) {
            (listeners[key] || []).forEach(function (fn) {
                fn(data);
            });
        },
        offAll() {
            listeners = {};
        },
    };
}
exports.default = eventEmitter;
