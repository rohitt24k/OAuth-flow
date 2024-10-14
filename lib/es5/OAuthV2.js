"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClient = void 0;
var jwt_decode_1 = require("jwt-decode");
var PKCEHandler_1 = require("./PKCEHandler");
var TokenHandler_1 = require("./TokenHandler");
var OAuthClient = /** @class */ (function () {
    function OAuthClient(config) {
        var _a;
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = config.redirectUri;
        this.authorizationEndpoint = config.authorizationEndpoint;
        this.tokenEndpoint = config.tokenEndpoint;
        this.scope = config.scope || "openid profile email offline_access";
        this.pkce = (_a = config.pkce) !== null && _a !== void 0 ? _a : !config.clientSecret;
        this.tokenHandler = new TokenHandler_1.TokenHandler(this.tokenEndpoint, this.clientId, this.redirectUri, this.pkceCodes, this.clientSecret);
    }
    OAuthClient.prototype.startAuthFlow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, searchParams;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            client_id: this.clientId,
                            redirect_uri: this.redirectUri,
                            scope: this.scope,
                            response_type: "code",
                        };
                        if (!this.pkce) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, PKCEHandler_1.PKCEHandler.generatePKCE()];
                    case 1:
                        _a.pkceCodes = _b.sent();
                        localStorage.setItem("code_verifier", this.pkceCodes.codeVerifier);
                        params.code_challenge = this.pkceCodes.codeChallenge;
                        params.code_challenge_method = "S256";
                        return [3 /*break*/, 3];
                    case 2:
                        if (this.clientSecret) {
                            params.client_secret = this.clientSecret;
                        }
                        _b.label = 3;
                    case 3:
                        params.state = "This is a state which is of no use for now";
                        searchParams = new URLSearchParams(params);
                        return [2 /*return*/, "".concat(this.authorizationEndpoint, "?").concat(searchParams.toString())];
                }
            });
        });
    };
    OAuthClient.prototype.handleCallback = function (callbackParams, res) {
        return __awaiter(this, void 0, void 0, function () {
            var newUrl, data, idToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (callbackParams.error) {
                            throw new Error("OAuth error: ".concat(callbackParams.error));
                        }
                        if (!callbackParams.code) {
                            throw new Error("No code found in the callback parameters");
                        }
                        if (typeof window !== "undefined") {
                            newUrl = window.location.origin + window.location.pathname;
                            window.history.replaceState({}, document.title, newUrl);
                        }
                        return [4 /*yield*/, this.tokenHandler.exchangeCodeForToken(callbackParams.code)];
                    case 1:
                        data = _a.sent();
                        if (data.refresh_token) {
                            this.refreshToken = data.refresh_token;
                            if (typeof localStorage !== "undefined")
                                localStorage.setItem("refresh_token", data.refresh_token);
                        }
                        if (data.access_token && typeof localStorage !== "undefined")
                            localStorage.setItem("access_token", data.access_token);
                        else if (res) {
                            res.cookie("access_token", data.access_token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                maxAge: 24 * 60 * 60 * 1000,
                            });
                            res.cookie("id_token", data.id_token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === "production",
                                maxAge: 24 * 60 * 60 * 1000,
                            });
                        }
                        if (data.id_token && typeof localStorage !== "undefined")
                            localStorage.setItem("id_token", data.id_token);
                        idToken = data.id_token;
                        this.decodeUserInfo(idToken);
                        return [2 /*return*/, { data: data, userInfo: this.userInfo }];
                }
            });
        });
    };
    OAuthClient.prototype.handleRefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.refreshToken) {
                            throw new Error("the refresh token is not present");
                        }
                        return [4 /*yield*/, this.tokenHandler.refreshToken(this.refreshToken)];
                    case 1:
                        data = _a.sent();
                        if (data.refresh_token) {
                            this.refreshToken = data.refresh_token;
                            if (typeof localStorage !== "undefined")
                                localStorage.setItem("refresh_token", data.refresh_token);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    OAuthClient.prototype.handleInitialSetup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var refresh_token, id_token;
            return __generator(this, function (_a) {
                refresh_token = localStorage.getItem("refresh_token");
                id_token = localStorage.getItem("id_token");
                if (refresh_token)
                    this.refreshToken = refresh_token;
                if (id_token)
                    this.decodeUserInfo(id_token);
                return [2 /*return*/, this.userInfo];
            });
        });
    };
    OAuthClient.prototype.decodeUserInfo = function (idToken) {
        try {
            var userInfo = (0, jwt_decode_1.jwtDecode)(idToken);
            this.userInfo = userInfo;
        }
        catch (error) {
            throw new Error("error in decoding id_token");
        }
    };
    return OAuthClient;
}());
exports.OAuthClient = OAuthClient;
