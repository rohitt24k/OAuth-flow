import { createHash, randomBytes } from "crypto";

function base64URLEncoder(str: Buffer | string): string {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: string | Buffer): Buffer {
  return createHash("sha256").update(buffer).digest();
}

export const generatePKCE = () => {
  const verifier: string = base64URLEncoder(randomBytes(32));
  const challenge: string = base64URLEncoder(sha256(verifier));

  return { verifier, challenge };
};
