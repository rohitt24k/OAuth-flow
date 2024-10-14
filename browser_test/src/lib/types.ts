export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope?: string;
  pkce?: boolean;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope?: string;
  token_type: string;
  refresh_token?: string;
}

export interface PKCECodes {
  codeVerifier: string;
  codeChallenge: string;
}

export interface IUserInfo {
  email: string;
  email_verified: true;
  name: string;
  nickname: string;
  picture: string;
}
