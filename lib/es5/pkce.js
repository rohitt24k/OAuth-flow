"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePKCE = void 0;
var crypto_1 = require("crypto");
function base64URLEncoder(str) {
    return str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}
function sha256(buffer) {
    return (0, crypto_1.createHash)("sha256").update(buffer).digest();
}
var generatePKCE = function () {
    var verifier = base64URLEncoder((0, crypto_1.randomBytes)(32));
    var challenge = base64URLEncoder(sha256(verifier));
    return { verifier: verifier, challenge: challenge };
};
exports.generatePKCE = generatePKCE;
