import * as dotenv from 'dotenv';
import { IAMClient, CreatePolicyCommand } from "@aws-sdk/client-iam";

dotenv.config();


const iamClient = new IAMClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    },
});

const boundaryPolicy = {
    PolicyName: "S3BoundaryPolicy",
    PolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "AllowBucketCreation",
                Effect: "Allow",
                Action: "s3:CreateBucket",
                Resource: "*",
            },
            {
                Sid: "AllowObjectManagement",
                Effect: "Allow",
                Action: [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:ListBucket",
                    "s3:GetBucketLocation",
                    "s3:AbortMultipartUpload",
                    "s3:ListMultipartUploadParts"
                ]
            }
        ]
    })
}

const response = await iamClient.send(
    new CreatePolicyCommand(boundaryPolicy)
);

console.log(response);


