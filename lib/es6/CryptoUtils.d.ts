export declare class CryptoUtils {
    static getRandomBytes(length: number): Promise<Uint8Array>;
    static sha256(message: string): Promise<ArrayBuffer>;
    static base64URLEncode(buffer: ArrayBuffer): string;
    static base64URLDecode(str: string): Uint8Array;
}
