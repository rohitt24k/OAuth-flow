import { OAuthConfig, TokenResponse, IUserInfo } from "./types";
export declare class OAuthClient {
    private clientId;
    private clientSecret?;
    private redirectUri;
    private authorizationEndpoint;
    private tokenEndpoint;
    private scope;
    private pkce;
    private pkceCodes?;
    private refreshToken?;
    userInfo?: IUserInfo;
    private tokenHandler;
    constructor(config: OAuthConfig);
    startAuthFlow(): Promise<string>;
    handleCallback(callbackParams: Record<string, string>, res?: any): Promise<{
        data: TokenResponse;
        userInfo?: IUserInfo;
    }>;
    handleRefreshToken(): Promise<TokenResponse>;
    handleInitialSetup(): Promise<IUserInfo>;
    decodeUserInfo(idToken: string): void;
}
