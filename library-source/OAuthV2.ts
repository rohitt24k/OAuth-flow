import { jwtDecode } from "jwt-decode";
import { PKCEHandler } from "./PKCEHandler";
import { TokenHandler } from "./TokenHandler";
import { OAuthConfig, PKCECodes, TokenResponse, IUserInfo } from "./types";

export class OAuthClient {
  private clientId: string;
  private clientSecret?: string;
  private redirectUri: string;
  private authorizationEndpoint: string;
  private tokenEndpoint: string;
  private scope: string;
  private pkce: boolean;
  private pkceCodes?: PKCECodes;
  private refreshToken?: string;
  userInfo?: IUserInfo;

  private tokenHandler: TokenHandler;

  constructor(config: OAuthConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.authorizationEndpoint = config.authorizationEndpoint;
    this.tokenEndpoint = config.tokenEndpoint;
    this.scope = config.scope || "openid profile email offline_access";
    this.pkce = config.pkce ?? !config.clientSecret;

    this.tokenHandler = new TokenHandler(
      this.tokenEndpoint,
      this.clientId,
      this.redirectUri,
      this.pkceCodes,
      this.clientSecret
    );
  }

  async startAuthFlow(): Promise<string> {
    const params: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      response_type: "code",
    };

    if (this.pkce) {
      this.pkceCodes = await PKCEHandler.generatePKCE();

      localStorage.setItem("code_verifier", this.pkceCodes.codeVerifier);
      params.code_challenge = this.pkceCodes.codeChallenge;
      params.code_challenge_method = "S256";
    } else if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }

    params.state = "This is a state which is of no use for now";

    const searchParams = new URLSearchParams(params);
    return `${this.authorizationEndpoint}?${searchParams.toString()}`;
  }

  async handleCallback(
    callbackParams: Record<string, string>,
    res?: any
  ): Promise<{ data: TokenResponse; userInfo?: IUserInfo }> {
    if (callbackParams.error) {
      throw new Error(`OAuth error: ${callbackParams.error}`);
    }

    if (!callbackParams.code) {
      throw new Error("No code found in the callback parameters");
    }

    if (typeof window !== "undefined") {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    const data = await this.tokenHandler.exchangeCodeForToken(
      callbackParams.code
    );

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

    const idToken = data.id_token;

    this.decodeUserInfo(idToken);

    return { data, userInfo: this.userInfo };
  }

  async handleRefreshToken(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error("the refresh token is not present");
    }
    const data = await this.tokenHandler.refreshToken(this.refreshToken);

    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
      if (typeof localStorage !== "undefined")
        localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data;
  }

  async handleInitialSetup() {
    const refresh_token = localStorage.getItem("refresh_token");
    const id_token = localStorage.getItem("id_token");

    if (refresh_token) this.refreshToken = refresh_token;
    if (id_token) this.decodeUserInfo(id_token);

    return this.userInfo;
  }

  decodeUserInfo(idToken: string) {
    try {
      const userInfo = jwtDecode(idToken);
      this.userInfo = userInfo as IUserInfo;
    } catch (error) {
      throw new Error("error in decoding id_token");
    }
  }
}
