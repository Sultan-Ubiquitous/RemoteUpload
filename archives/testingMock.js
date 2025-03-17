import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import fs from "fs";
import path from "path";
const s3Mock = mockClient(S3Client);

// Mock the PutObjectCommand
s3Mock.on(PutObjectCommand).resolves({});

// Your function that uses S3
const uploadFile = async (bucketName, key, body) => {
    const s3Client = new S3Client({
        region: 'us-east-1', // Specify a region if necessary
        credentials: {
            accessKeyId: 'FAKE_ACCESS_KEY_ID',
            secretAccessKey: 'FAKE_SECRET_ACCESS_KEY',
        },
    });
    await s3Client.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: body }));
};

// Test your function
(async () => {
    await uploadFile('test-bucket', 'test-key', 'hello');
    console.log('File uploaded successfully without hitting AWS!');
})();
