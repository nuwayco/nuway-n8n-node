"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuwayApi = void 0;
var NuwayApi = /** @class */ (function () {
    function NuwayApi() {
        this.name = 'nuwayApi';
        this.displayName = 'NUWAY API';
        this.documentationUrl = 'https://nuway.co';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://app.nuway.co',
            }
        ];
    }
    return NuwayApi;
}());
exports.NuwayApi = NuwayApi;
