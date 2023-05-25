"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadDefaults = exports.EventPatterns = void 0;
exports.EventPatterns = {
    vanilla: {
        start: /^\[.+?\]: Done/,
        stop: /^\[.+?\]: ThreadedAnvilChunkStorage: All dimensions are saved/,
        crash: /Crashed/
    },
    paper: {
        start: /^\[.+?\]: Done/,
        stop: /^\[.+?\]: ThreadedAnvilChunkStorage: All dimensions are saved/,
        crash: /Paper Crashed/
    }
};
function LoadDefaults(config, defaults) {
    const loadObject = (obj, defaultObj) => {
        Object.keys(defaultObj).forEach(key => {
            if (typeof obj[key] !== typeof defaultObj[key]) {
                obj[key] = defaultObj[key];
                return;
            }
            if (typeof obj[key] === 'object')
                loadObject(obj[key], defaultObj[key]);
        });
        return obj;
    };
    return loadObject(config, defaults);
}
exports.LoadDefaults = LoadDefaults;
