import * as dotenv from 'dotenv';
import { IAMClient, CreateUserCommand } from "@aws-sdk/client-iam";
import { mockClient } from 'aws-sdk-client-mock';

dotenv.config();

const s3Mock = mockClient(IAMClient);

client = new IAMClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    },
});

const userRequirements = {
    UserName: "Ideally will take from user",
    PermissionsBoundary: "Will add these too",
    Tags: [
        {
            Key: "UserId",
            Value: "123456789",
        },
    ]

}
