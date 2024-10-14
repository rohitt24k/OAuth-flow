import crypto from "crypto";

export class CryptoUtils {
  static async getRandomBytes(length: number): Promise<Uint8Array> {
    return crypto.randomBytes(length);
  }

  static async sha256(message: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      hash.update(message);
      resolve(hash.digest());
    });
  }

  static base64URLEncode(buffer: ArrayBuffer): string {
    const binary = Array.from(new Uint8Array(buffer))
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return Buffer.from(binary, "binary")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  static base64URLDecode(str: string): Uint8Array {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const binaryString = Buffer.from(str, "base64").toString("binary");
    return new Uint8Array(Array.from(binaryString).map((c) => c.charCodeAt(0)));
  }
}
