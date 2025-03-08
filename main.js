import * as dotenv from 'dotenv';
import { IAMClient, CreateUserCommand } from "@aws-sdk/client-iam";
import { mockClient } from 'aws-sdk-client-mock';

dotenv.config();

const s3Mock = mockClient(IAMClient);

const iamClient = new IAMClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    },
});

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