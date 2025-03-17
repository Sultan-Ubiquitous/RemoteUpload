import inquirer from "inquirer";
import * as dotenv from 'dotenv';
import { IAMClient, CreateUserCommand, CreateAccessKeyCommand, PutUserPolicyCommand } from "@aws-sdk/client-iam";
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

// Function to get user input for AWS credentials
const getAWSCredentials = async () => {
  const answers = await inquirer.prompt([
    { type: "input", name: "accessKeyId", message: "Enter your AWS Access Key ID:" },
    { type: "password", name: "secretAccessKey", message: "Enter your AWS Secret Access Key:", mask: "*" },
    { type: "input", name: "region", message: "Enter your AWS Region (e.g., us-east-1):", default: "us-east-1" },
  ]);
  return answers;
};

// Function to create an IAM user
const createIAMUser = async (iamClient, userName) => {
  try {
    // Step 1: Create IAM User
    await iamClient.send(new CreateUserCommand({ UserName: userName }));
    console.log(`User ${userName} created.`);

    // Step 2: Create Access Key for IAM User
    const accessKeyResponse = await iamClient.send(new CreateAccessKeyCommand({ UserName: userName }));
    console.log("IAM User Access Key:", accessKeyResponse.AccessKey.AccessKeyId);

    // Step 3: Attach S3 Full Access Policy
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["s3:*"],
          Resource: ["*"],
        },
      ],
    };

    await iamClient.send(
      new PutUserPolicyCommand({
        UserName: userName,
        PolicyName: "S3FullAccessPolicy",
        PolicyDocument: JSON.stringify(policyDocument),
      })
    );

    console.log(`S3 policy attached to user ${userName}`);

    return {
      userName,
      accessKeyId: accessKeyResponse.AccessKey.AccessKeyId,
      secretAccessKey: accessKeyResponse.AccessKey.SecretAccessKey,
    };
  } catch (error) {
    console.error("Error creating IAM user:", error);
  }
};

// Function to create an S3 bucket using IAM user's credentials
const createS3Bucket = async (bucketName, credentials, region) => {
  try {
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });

    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`S3 bucket ${bucketName} created successfully.`);
  } catch (error) {
    console.error("Error creating S3 bucket:", error);
  }
};

// Main function
const main = async () => {
  try {
    const awsCreds = await getAWSCredentials();

    // Create IAM Client with user's credentials
    const iamClient = new IAMClient({
      region: awsCreds.region,
      credentials: {
        accessKeyId: awsCreds.accessKeyId,
        secretAccessKey: awsCreds.secretAccessKey,
      },
    });

    // Define IAM user and bucket name
    const userName = "new-iam-user";
    const bucketName = "my-unique-s3-bucket-" + Date.now();

    // Create IAM user and get its credentials
    const iamUserCreds = await createIAMUser(iamClient, userName);

    if (iamUserCreds) {
      // Create an S3 bucket using the IAM user credentials
      await createS3Bucket(bucketName, iamUserCreds, awsCreds.region);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Run the script
main();
