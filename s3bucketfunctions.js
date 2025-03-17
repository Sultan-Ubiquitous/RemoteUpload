import * as dotenv from 'dotenv';
import { S3Client, CreateBucketCommand, PutBucketEncryptionCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from "fs";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



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

        //Applying encryption
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
        console.log(`Default Encryption also Applied for the bucket ${bucketName}`);
        
    } catch (error) {
      console.error("Bucket not created, error occured: ", error);
        
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
        console.error("Some Error occured ", error);
        
    }
}


const uploadInTheBucket = async(filePath, bucketName, fileName) => {
    try {

        const s3Client = new S3Client({
            region: process.env.region,
            credentials:{
                accessKeyId: process.env.accessKeyId,
                secretAccessKey: process.env.secretAccessKey,
            },
        });

        const fileStream = fs.createReadStream(filePath);

        const uploadParameters = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileStream,
        };

        const upload = new Upload({
            client: s3Client,
            params: uploadParameters,
        });

        upload.on("httpUploadProgress", (progress)=>{
            console.log(`Uploaded ${progress.loaded} out of ${progress.total} bytes`);            
        });
        //actual upload process begins
        const result = await upload.done();
        console.log("File Upload successfully completed at: ", result.Location);
    } catch (error) {
        console.error("Some error occured: ", error);
    }
}

const getObjectUrl = async(bucketName, fileName) => {
    
    const s3Client = new S3Client({
        region: process.env.region,
        credentials:{
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
        },
    });

    const input = {
        Bucket: bucketName,
        Key: fileName,
    };

    const command = new GetObjectCommand(input);
    
    const output = await getSignedUrl(s3Client, command);
    return output;
}

const getImageUrl = async(bucketName,fileName) => {
    
    const s3Client = new S3Client({
        region: process.env.region,
        credentials:{
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
        },
    });

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ResponseContentType: 'image/jpeg',
    });
    
    const url = await getSignedUrl(s3Client, command);
    return url;
}

const bucketName = 'azims-first-test-bucket';
const filePath = 'Objects/venum.jpeg'
const fileName = 'venum'

const url = await getPreviewUrl(bucketName, fileName);

console.log(url);

export {createBucket};

