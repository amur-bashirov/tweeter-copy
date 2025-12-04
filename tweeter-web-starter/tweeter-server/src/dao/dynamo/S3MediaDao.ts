
import { Buffer } from "buffer";
import { MediaDao } from "../interfaces/MediaDao";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


export class S3MediaDao implements MediaDao{
    private s3 = new S3Client({ region:"us-east-1" });

    async uploadProfileImage(buffer: Buffer, filename: string, extension: string): Promise<string> {

        let contentType = "image/jpeg"; 

        if (extension.toLowerCase() === "png") {
            contentType = "image/png";
        } else if (extension.toLowerCase() === "jpg" || extension.toLowerCase() === "jpeg") {
            contentType = "image/jpeg";
        }

        const bucket = "amzn-s3-tweeter-amur-bashirov";
        const key = `profile-images/${filename}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType
        });

        await this.s3.send(command);

        return `https://${bucket}.s3.amazonaws.com/${key}`;
}

    
}