import * as dotenv from 'dotenv';
import { S3Client, CreateBucketCommand, ServerSideEncryption, PutBucketEncryptionCommand } from '@aws-sdk/client-s3';

dotenv.config();

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


const setEncryptionToExistingBucket = async (bucketName) => {
    try {

        const s3Client = new S3Client({
            region: process.env.region,
            credentials:{
                accessKeyId: process.env.accessKeyId,
                secretAccessKey: process.env.secretAccessKey,
            },
        });

        const encryptionConfig = {
            ServerSideEncryptionConfiguration: {
                Rules: [
                    {
                        ApplyServerSideEncryptionByDefault: {
                            SSEAlgorithm: "AES256",
                        },
                    },
                ],
            },
        }

        await s3Client.send(new PutBucketEncryptionCommand({
            Bucket: bucketName,
            ServerSideEncryptionConfiguration: encryptionConfig.ServerSideEncryptionConfiguration,
        }));
        console.log(`Default Encryption Applied for the bucket ${bucketName}`);
    } catch (error) {
        console.log("Some Error occured ", error);
        
    }
}


// const putIntoBucket = async() => {
    
// }



// export {createBucket};
const bucket = 'azims-first-test-bucket'
setEncryptionToExistingBucket(bucket);