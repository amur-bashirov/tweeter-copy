export interface MediaDao {
  uploadProfileImage(
    base64Data: string,
    filename: string
  ): Promise<string>; 
}
