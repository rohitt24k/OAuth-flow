import { CryptoUtils } from "./CryptoUtils";
import { PKCECodes } from "./types";

export class PKCEHandler {
  static async generatePKCE(): Promise<PKCECodes> {
    const verifierBytes = await CryptoUtils.getRandomBytes(32);
    const verifier = CryptoUtils.base64URLEncode(verifierBytes);
    const challengeBuffer = await CryptoUtils.sha256(verifier);
    const challenge = CryptoUtils.base64URLEncode(challengeBuffer);
    return { codeVerifier: verifier, codeChallenge: challenge };
  }

  static encodeState(stateData: string): string {
    return CryptoUtils.base64URLEncode(new TextEncoder().encode(stateData));
  }

  static decodeState(state: string): string {
    return new TextDecoder().decode(CryptoUtils.base64URLDecode(state));
  }
}
