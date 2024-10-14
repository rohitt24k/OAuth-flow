import { PKCECodes } from "./types";
export declare class PKCEHandler {
    static generatePKCE(): Promise<PKCECodes>;
    static encodeState(stateData: string): string;
    static decodeState(state: string): string;
}
