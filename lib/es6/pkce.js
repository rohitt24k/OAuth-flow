import { createHash, randomBytes } from "crypto";
function base64URLEncoder(str) {
    return str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}
function sha256(buffer) {
    return createHash("sha256").update(buffer).digest();
}
export var generatePKCE = function () {
    var verifier = base64URLEncoder(randomBytes(32));
    var challenge = base64URLEncoder(sha256(verifier));
    return { verifier: verifier, challenge: challenge };
};
