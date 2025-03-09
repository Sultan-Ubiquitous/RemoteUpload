import * as dotenv from 'dotenv';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';


const createBucket = async (bucketName) => {
    try {
        const s3Client = new S3Client({
            region: process.env.region,
            credentials:{
                accessKeyId: process.env.accessKeyId,
                secretAccessKey: process.env.secretAccessKey,
            },
        });
        await s3Client.send(new CreateBucketCommand({Bucket: bucketName}));
        console.log(`${bucketName} bucket created successfully.`);
        
    } catch (error) {
      console.log("Bucket not created, error occured: ", error);
        
    }
}

