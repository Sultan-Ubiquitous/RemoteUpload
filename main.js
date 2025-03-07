import * as dotenv from 'dotenv';
import { IAMClient } from "@aws-sdk/client-iam";

dotenv.config();

client = new IAMClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    },
});