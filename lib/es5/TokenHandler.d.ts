import { PKCECodes, TokenResponse } from "./types";
export declare class TokenHandler {
    private tokenEndpoint;
    private clientId;
    private clientSecret?;
    private redirectUri;
    private pkceCodes?;
    constructor(tokenEndpoint: string, clientId: string, redirectUri: string, pkceCodes?: PKCECodes, clientSecret?: string);
    exchangeCodeForToken(code: string): Promise<TokenResponse>;
    refreshToken(refreshToken: string): Promise<TokenResponse>;
}
