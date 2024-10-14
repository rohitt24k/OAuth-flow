import { PKCECodes, TokenResponse } from "./types";

export class TokenHandler {
  private tokenEndpoint: string;
  private clientId: string;
  private clientSecret?: string;
  private redirectUri: string;
  private pkceCodes?: PKCECodes;

  constructor(
    tokenEndpoint: string,
    clientId: string,
    redirectUri: string,
    pkceCodes?: PKCECodes,
    clientSecret?: string
  ) {
    this.tokenEndpoint = tokenEndpoint;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.clientSecret = clientSecret;
    this.pkceCodes = pkceCodes;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params: Record<string, string> = {
      grant_type: "authorization_code",
      code,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    };
    let verifier;

    if (typeof localStorage !== "undefined") {
      verifier = localStorage.getItem("code_verifier");
    } else {
      verifier = this.pkceCodes?.codeVerifier;
    }
    if (verifier) {
      params.code_verifier = verifier;
    }

    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const params: Record<string, string> = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
    };

    if (this.clientSecret) {
      params.client_secret = this.clientSecret;
    }

    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  }
}
