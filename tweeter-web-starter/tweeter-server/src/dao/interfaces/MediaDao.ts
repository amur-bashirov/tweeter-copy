import { Buffer } from "buffer";

export interface MediaDao {
  uploadProfileImage(
    base64Data: Buffer,
    filename: string,
     extension: string
  ): Promise<string>; 
}
