import * as dotenv from 'dotenv';
import { IAMClient, CreateUserCommand } from "@aws-sdk/client-iam";

dotenv.config();


const iamClient = new IAMClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    },
});

const boundaryPolicy = {
    PolicyName: "S3BoundaryPolicyForIAM",
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

const userRequirements = {
    UserName: "Example Name",
    PermissionsBoundary: "",
    Tags: [
        {
            Key: "UserId",
            Value: "123456789",
        },
    ]

}

const createUser = new CreateUserCommand(userRequirements);
try {
    const response = await iamClient.send(createUser);
    console.log("User created: ", response);
    
} catch (error) {
    console.log(error);
}